import fs from 'fs';
import path from 'path';
import { db } from '../server/db.js';

interface MasterIndex {
  version: string;
  projects: Record<string, any>;
  costumes: Array<{
    costume_id: string;
    project_id: string;
    group_id: string;
    song_name_ja: string;
    song_name_zh: string;
    costume_name_ja: string;
    costume_name_zh: string;
    category: string;
    era_or_live?: string;
    characters: Array<{
      character_id: string;
      character_name_ja: string;
      character_name_zh: string;
      variant_id?: string;
      theme_id?: string;
      visual_design?: string;
      official_2d_reference?: {
        title: string;
        file_path: string;
        url?: string;
      };
      search_keywords?: string[];
    }>;
  }>;
}

interface CrawlTask {
  task_id: string;
  character_id: string;
  character_name_ja: string;
  character_name_zh: string;
  project_id: string;
  group: string;
  costume_id: string;
  song_name_ja: string;
  song_name_zh: string;
  costume_name_ja: string;
  costume_name_zh: string;
  variant_id: string;
  target_type: 'real_life_model';
  search_keywords: string[];
  visual_requirements: {
    perspective: string;
    framing: string;
    subject: string;
    reject: string[];
  };
  dest_filename: string;
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  assigned_agent: string;
  result: {
    file_path: string;
    source_title: string;
    source_url: string;
    completed_at: string;
  } | null;
}

export function generateCrawlTasks() {
  const masterIndexPath = path.resolve('data/master_costumes_index.json');
  if (!fs.existsSync(masterIndexPath)) {
    throw new Error(`Master index not found at ${masterIndexPath}`);
  }

  const masterData: MasterIndex = JSON.parse(fs.readFileSync(masterIndexPath, 'utf-8'));
  const tasksDir = path.resolve('tasks');
  if (!fs.existsSync(tasksDir)) {
    fs.mkdirSync(tasksDir, { recursive: true });
  }

  const tasks: CrawlTask[] = [];

  // 预编译数据库查询
  const checkVariantStmt = db.prepare(`
    SELECT cv.id, cv.status, cv.name_status, cv.name_ja
    FROM costume_variants cv
    WHERE cv.id = ?
  `);

  const checkRealLifeImgStmt = db.prepare(`
    SELECT ci.id, ci.file_path, ci.caption
    FROM costume_images ci
    WHERE ci.variant_id = ? AND ci.category = 'real_life'
    ORDER BY ci.is_primary DESC, ci.sort_order ASC
    LIMIT 1
  `);

  const checkSourceStmt = db.prepare(`
    SELECT cs.title, cs.url
    FROM costume_sources cs
    WHERE cs.variant_id = ? AND cs.source_type IN ('cosplay_photo', 'live_stage', 'seiyuu_live')
    ORDER BY cs.id ASC
    LIMIT 1
  `);

  for (const costume of masterData.costumes) {
    const projectInfo = masterData.projects[costume.project_id] || { name_zh: costume.project_id };
    const groupName = projectInfo.name_zh || costume.project_id;

    for (const char of costume.characters) {
      const variantId = char.variant_id || `var-${char.character_id}-${costume.song_name_ja.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
      const taskId = `crawl-${char.character_id}-${costume.costume_id.replace(/^costume-/, '')}`;

      // 检查数据库中是否已有符合规格的 real_life 资产
      const variantRow = checkVariantStmt.get(variantId) as any;
      const realLifeImg = checkRealLifeImgStmt.get(variantId) as any;
      const sourceRow = checkSourceStmt.get(variantId) as any;

      // 验证是否真正满足“已核实且具备真实人类实拍”
      const isVerifiedRealLife = variantRow && 
        variantRow.status === 'verified' && 
        realLifeImg && 
        realLifeImg.file_path && 
        sourceRow && 
        sourceRow.url;

      // 生成高精度关键词
      const cleanSongName = costume.song_name_ja.trim();
      const keywords = char.search_keywords && char.search_keywords.length > 0
        ? char.search_keywords
        : [
            `${char.character_name_zh} ${cleanSongName} cos 正面`,
            `${char.character_name_ja} ${cleanSongName} コスプレ 正面`,
            `${char.character_name_zh} ${costume.costume_name_zh} 模特 立拍`,
            `${groupName} ${cleanSongName} 打歌服 正面全身`
          ];

      // 生成更具可读性的落盘文件名
      const charShort = char.character_id.split('-')[1] || char.character_id;
      const cleanCostumeSlug = costume.costume_id
        .replace(/^costume-/, '')
        .replace(new RegExp(`^(${char.character_id}|${charShort})-?`), '')
        .replace(/-/g, '_');
      const destFilename = `${char.character_id}_${cleanCostumeSlug}_real_model.jpg`;

      const task: CrawlTask = {
        task_id: taskId,
        character_id: char.character_id,
        character_name_ja: char.character_name_ja,
        character_name_zh: char.character_name_zh,
        project_id: costume.project_id,
        group: groupName,
        costume_id: costume.costume_id,
        song_name_ja: costume.song_name_ja,
        song_name_zh: costume.song_name_zh,
        costume_name_ja: costume.costume_name_ja,
        costume_name_zh: costume.costume_name_zh,
        variant_id: variantId,
        target_type: 'real_life_model',
        search_keywords: keywords,
        visual_requirements: {
          perspective: "front_facing_0_to_15_degrees",
          framing: "full_body_or_knee_up_standing",
          subject: "real_human_coser_or_cast",
          reject: ["mannequin", "back_facing", "extreme_long_shot", "blurry", "school_uniform_placeholder"]
        },
        dest_filename: destFilename,
        status: isVerifiedRealLife ? 'completed' : 'pending',
        assigned_agent: 'opencode',
        result: isVerifiedRealLife
          ? {
              file_path: realLifeImg.file_path,
              source_title: sourceRow.title,
              source_url: sourceRow.url,
              completed_at: new Date().toISOString()
            }
          : null
      };

      tasks.push(task);
    }
  }

  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const pendingCount = tasks.filter(t => t.status === 'pending').length;

  const manifest = {
    version: "1.0.0",
    generated_at: new Date().toISOString(),
    pipeline: "forward-master-pipeline",
    contract_rules: {
      left_track: "strictly 2D official awakened stage costume master (no school uniforms)",
      right_track: "strictly 3D real human coser/cast front-facing standing model",
      forbidden: [
        "mannequins",
        "back-facing",
        "far-distance blurry stage",
        "school uniform placeholders"
      ]
    },
    stats: {
      total_targets: tasks.length,
      verified_completed: completedCount,
      pending_crawl: pendingCount
    },
    tasks
  };

  const targetsFile = path.resolve(tasksDir, 'crawl_targets.json');
  fs.writeFileSync(targetsFile, JSON.stringify(manifest, null, 2), 'utf-8');

  console.log(`[PASS] 成功生成 opencode 任务清单: ${targetsFile}`);
  console.log(`- 目标词条总数: ${tasks.length}`);
  console.log(`- 数据库已核实完成 (completed): ${completedCount}`);
  console.log(`- 待 opencode 靶向检索抓取 (pending): ${pendingCount}`);

  return manifest;
}

if (process.argv[1] && process.argv[1].endsWith('generate_crawl_tasks.ts')) {
  generateCrawlTasks();
}
