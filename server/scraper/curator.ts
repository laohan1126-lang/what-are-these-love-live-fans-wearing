import crypto from 'crypto';
import { db } from '../db.js';
import { CurationResult, ScrapedCostume } from './types.js';
import { fetchIdolStoryCostumes, IDOL_STORY_SLUGS } from './sources/idolstory.js';
import { verifyScrapedCostume } from './verifier.js';
import { downloadImage } from './downloader.js';

export async function curateCharacterCostumes(
  characterId: string,
  page: number = 1,
  pageSize: number = 5
): Promise<CurationResult> {
  const character = db.prepare('SELECT * FROM characters WHERE id = ?').get(characterId) as any;
  if (!character) {
    throw new Error(`Character not found in database: ${characterId}`);
  }

  // 1. 明确检查该角色是否受数据源支持
  if (!IDOL_STORY_SLUGS[characterId]) {
    return {
      characterId,
      characterName: character.name_ja,
      totalFound: 0,
      inserted: 0,
      skipped: 0,
      failed: 0,
      supported: false,
      reason: `该角色（${character.name_zh || character.name_ja}）所属企划在 Idol Story 卡面源中暂无收录索引，暂不支持自动采集。`,
      items: [],
    };
  }

  const result: CurationResult = {
    characterId,
    characterName: character.name_ja,
    totalFound: 0,
    inserted: 0,
    skipped: 0,
    failed: 0,
    supported: true,
    items: [],
  };

  // 2. 抓取候选数据（支持分页）
  const candidates: ScrapedCostume[] = await fetchIdolStoryCostumes(characterId, page, pageSize);
  result.totalFound = candidates.length;

  console.log(`[Curator] Found ${candidates.length} candidate costumes for ${character.name_ja} (Page ${page})`);

  const checkExisting = db.prepare(`
    SELECT v.id FROM costume_variants v
    LEFT JOIN costume_sources s ON s.variant_id = v.id
    WHERE v.character_id = ? AND ((v.name_ja IS NOT NULL AND v.name_ja = ?) OR s.url = ?)
    LIMIT 1
  `);

  const findTheme = db.prepare('SELECT id FROM costume_themes WHERE name_ja = ? LIMIT 1');
  const insertTheme = db.prepare(`
    INSERT INTO costume_themes (id, name_ja, name_zh, category, description)
    VALUES (?, ?, ?, 'allstars', ?)
  `);

  const insertVariant = db.prepare(`
    INSERT INTO costume_variants (id, theme_id, character_id, name_ja, name_zh, name_status, status, notes, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertImage = db.prepare(`
    INSERT INTO costume_images (id, variant_id, file_path, original_filename, is_primary, caption, sort_order)
    VALUES (?, ?, ?, ?, 1, ?, 0)
  `);

  const insertSource = db.prepare(`
    INSERT INTO costume_sources (id, variant_id, source_type, evolution_stage, title, url, detail)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  // 3. 逐条下载、验证与入库
  for (const candidate of candidates) {
    try {
      // 查重：若同角色已有相同名称或相同来源 URL 则跳过
      const existing = checkExisting.get(characterId, candidate.variantNameJa, candidate.sourceUrl) as any;
      if (existing) {
        result.skipped++;
        result.items.push({
          variantId: existing.id,
          nameJa: candidate.variantNameJa || candidate.themeNameJa,
          imageUrl: candidate.imageUrl,
          status: 'skipped',
          reason: '已收录于数据库，跳过重复项',
        });
        continue;
      }

      // 下载高清图片到本地：下载失败绝不入库，避免留存破损记录导致下次被查重拦截
      const dl = await downloadImage(candidate.imageUrl, `${characterId}_costume`);
      if (!dl || !dl.localPath) {
        result.failed++;
        result.items.push({
          variantId: '',
          nameJa: candidate.variantNameJa || candidate.themeNameJa,
          imageUrl: candidate.imageUrl,
          status: 'failed',
          reason: '图片下载失败或尺寸不达标，取消入库以支持下次重试',
        });
        continue;
      }

      const localFilePath = dl.localPath;

      // 事务入库
      const now = new Date().toISOString();
      const variantId = `var_${crypto.randomBytes(6).toString('hex')}`;

      db.transaction(() => {
        // 主题处理
        let themeId: string;
        const existingTheme = findTheme.get(candidate.themeNameJa) as any;
        if (existingTheme) {
          themeId = existingTheme.id;
        } else {
          themeId = `theme_${crypto.randomBytes(6).toString('hex')}`;
          insertTheme.run(themeId, candidate.themeNameJa, candidate.themeNameZh || null, candidate.sourceTitle);
        }

        const nameStatus = candidate.variantNameJa ? 'identified' : 'unidentified';

        // 插入衣装变体：自动抓取结果必须统一设为 unverified（待核实），禁止设为 verified
        insertVariant.run(
          variantId,
          themeId,
          characterId,
          candidate.variantNameJa || null,
          candidate.variantNameZh || (candidate.variantNameJa ? null : '待核实卡面衣装'),
          nameStatus,
          'unverified',
          candidate.notes || null,
          now,
          now
        );

        // 插入图片
        const imgId = `img_${crypto.randomBytes(6).toString('hex')}`;
        insertImage.run(imgId, variantId, localFilePath, dl.fileName || null, candidate.variantNameJa || candidate.themeNameJa);

        // 插入来源：严禁使用“Agent 官方考据认证”伪权威标注，如实注明为社区卡面库抓取
        const srcId = `src_${crypto.randomBytes(6).toString('hex')}`;
        insertSource.run(
          srcId,
          variantId,
          candidate.sourceType,
          candidate.evolutionStage,
          candidate.sourceTitle,
          candidate.sourceUrl,
          'Idol Story 社区卡面库自动采集入库（待人工比对核实）'
        );
      })();

      result.inserted++;
      result.items.push({
        variantId,
        nameJa: candidate.variantNameJa || candidate.themeNameJa,
        imageUrl: localFilePath,
        status: 'inserted',
      });
      console.log(`[Curator] Successfully curated: ${candidate.variantNameJa || candidate.themeNameJa}`);
    } catch (err: any) {
      console.error(`[Curator] Error inserting costume:`, err.message);
      result.failed++;
      result.items.push({
        variantId: '',
        nameJa: candidate.variantNameJa || candidate.themeNameJa,
        imageUrl: candidate.imageUrl,
        status: 'failed',
        reason: err.message,
      });
    }
  }

  return result;
}

export async function curateAllSupportedCharacters(): Promise<Record<string, CurationResult>> {
  const allResults: Record<string, CurationResult> = {};
  for (const charId of Object.keys(IDOL_STORY_SLUGS)) {
    try {
      const res = await curateCharacterCostumes(charId, 1);
      allResults[charId] = res;
    } catch (e: any) {
      console.error(`[Curator] Failed for ${charId}:`, e.message);
    }
  }
  return allResults;
}
