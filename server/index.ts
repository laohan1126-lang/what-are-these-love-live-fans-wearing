import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import { db, initDatabase, UPLOADS_DIR, DATA_DIR } from './db.js';
import { createBackupZip, restoreBackupZip } from './backup.js';
import { curateCharacterCostumes } from './scraper/curator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 初始化数据库
initDatabase();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// 静态托管用户上传的图片
app.use('/uploads', express.static(UPLOADS_DIR));
app.use('/api/images', express.static(UPLOADS_DIR));

// 配置 multer 上传
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const hash = crypto.randomBytes(8).toString('hex');
    const safeName = `costume_${Date.now()}_${hash}${ext}`;
    cb(null, safeName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB 限制
});

// ==================== 1. 企划与团体 API ====================

// 获取所有企划（含各企划动态人数统计）
app.get('/api/projects', (_req, res) => {
  try {
    const projects = db.prepare(`
      SELECT p.*,
        (SELECT COUNT(DISTINCT cg.character_id)
         FROM character_groups cg
         JOIN groups g ON cg.group_id = g.id
         JOIN characters c ON cg.character_id = c.id
         WHERE g.project_id = p.id AND c.status = 'active') as active_count,
        (SELECT COUNT(DISTINCT cg.character_id)
         FROM character_groups cg
         JOIN groups g ON cg.group_id = g.id
         WHERE g.project_id = p.id) as total_count
      FROM projects p
      ORDER BY p.sort_order ASC
    `).all();

    const getGroups = db.prepare(`
      SELECT g.*,
        (SELECT COUNT(DISTINCT cg.character_id)
         FROM character_groups cg
         JOIN characters c ON cg.character_id = c.id
         WHERE cg.group_id = g.id AND c.status = 'active') as active_count,
        (SELECT COUNT(DISTINCT cg.character_id)
         FROM character_groups cg
         WHERE cg.group_id = g.id) as total_count
      FROM groups g
      WHERE g.project_id = ?
      ORDER BY g.sort_order ASC
    `);

    const result = projects.map((p: any) => ({
      ...p,
      groups: getGroups.all(p.id),
    }));

    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== 2. 角色 API ====================

// 获取角色列表（支持 project_id、group_id、status 过滤）
app.get('/api/characters', (req, res) => {
  try {
    const { project_id, group_id, status } = req.query;

    let sql = `
      SELECT DISTINCT c.*,
        (SELECT COUNT(*) FROM costume_variants cv WHERE cv.character_id = c.id) as costume_count
      FROM characters c
      LEFT JOIN character_groups cg ON c.id = cg.character_id
      LEFT JOIN groups g ON cg.group_id = g.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (project_id) {
      sql += ` AND g.project_id = ?`;
      params.push(project_id);
    }
    if (group_id) {
      sql += ` AND cg.group_id = ?`;
      params.push(group_id);
    }
    if (status && status !== 'all') {
      sql += ` AND c.status = ?`;
      params.push(status);
    }

    sql += ` ORDER BY c.sort_order ASC`;

    const characters = db.prepare(sql).all(...params);

    const getGroupsForChar = db.prepare(`
      SELECT g.id as group_id, g.name_ja as group_name_ja, g.name_zh as group_name_zh,
             cg.period, cg.status, cg.role_description
      FROM character_groups cg
      JOIN groups g ON cg.group_id = g.id
      WHERE cg.character_id = ?
      ORDER BY g.sort_order ASC
    `);

    const result = characters.map((c: any) => ({
      ...c,
      groups: getGroupsForChar.all(c.id),
    }));

    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 获取单一角色信息
app.get('/api/characters/:id', (req, res) => {
  try {
    const character: any = db.prepare(`
      SELECT c.*,
        (SELECT COUNT(*) FROM costume_variants cv WHERE cv.character_id = c.id) as costume_count
      FROM characters c
      WHERE c.id = ?
    `).get(req.params.id);

    if (!character) {
      return res.status(404).json({ error: '角色不存在' });
    }

    const groups = db.prepare(`
      SELECT g.id as group_id, g.name_ja as group_name_ja, g.name_zh as group_name_zh,
             cg.period, cg.status, cg.role_description
      FROM character_groups cg
      JOIN groups g ON cg.group_id = g.id
      WHERE cg.character_id = ?
      ORDER BY g.sort_order ASC
    `).all(character.id);

    res.json({ ...character, groups });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== 3. 角色衣装图鉴 API ====================

// 获取某角色的全部衣装列表（支持状态、来源、形态多维过滤）
app.get('/api/characters/:id/costumes', (req, res) => {
  try {
    const { id } = req.params;
    const { status, source_type, evolution_stage, search } = req.query;

    let sql = `
      SELECT cv.*,
        ct.name_ja as theme_name_ja, ct.name_zh as theme_name_zh, ct.category as theme_category
      FROM costume_variants cv
      JOIN costume_themes ct ON cv.theme_id = ct.id
      WHERE cv.character_id = ?
    `;
    const params: any[] = [id];

    if (status && status !== 'all') {
      if (status === 'unidentified') {
        sql += ` AND cv.name_status = 'unidentified'`;
      } else {
        sql += ` AND cv.status = ?`;
        params.push(status);
      }
    }

    if (search && typeof search === 'string') {
      sql += ` AND (cv.name_ja LIKE ? OR cv.name_zh LIKE ? OR ct.name_ja LIKE ? OR cv.notes LIKE ?)`;
      const s = `%${search}%`;
      params.push(s, s, s, s);
    }

    sql += ` ORDER BY cv.created_at DESC`;

    const variants: any[] = db.prepare(sql).all(...params);

    const getImages = db.prepare(`
      SELECT * FROM costume_images WHERE variant_id = ? ORDER BY is_primary DESC, sort_order ASC
    `);

    const getSources = db.prepare(`
      SELECT * FROM costume_sources WHERE variant_id = ?
    `);

    let result = variants.map(v => {
      const images = getImages.all(v.id);
      const sources: any[] = getSources.all(v.id);

      return {
        ...v,
        theme: {
          id: v.theme_id,
          name_ja: v.theme_name_ja,
          name_zh: v.theme_name_zh,
          category: v.theme_category,
        },
        images,
        sources,
      };
    });

    // 过滤来源类型
    if (source_type && source_type !== 'all') {
      result = result.filter(v => v.sources.some((s: any) => s.source_type === source_type));
    }

    // 过滤卡面觉醒形态
    if (evolution_stage && evolution_stage !== 'all') {
      result = result.filter(v => v.sources.some((s: any) => s.evolution_stage === evolution_stage));
    }

    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 获取单一衣装详情
app.get('/api/costumes/:id', (req, res) => {
  try {
    const variant: any = db.prepare(`
      SELECT cv.*,
        ct.name_ja as theme_name_ja, ct.name_zh as theme_name_zh, ct.category as theme_category, ct.description as theme_description,
        c.name_ja as character_name_ja, c.name_zh as character_name_zh, c.color_hex as character_color_hex
      FROM costume_variants cv
      JOIN costume_themes ct ON cv.theme_id = ct.id
      JOIN characters c ON cv.character_id = c.id
      WHERE cv.id = ?
    `).get(req.params.id);

    if (!variant) {
      return res.status(404).json({ error: '衣装记录未找到' });
    }

    const images = db.prepare(`
      SELECT * FROM costume_images WHERE variant_id = ? ORDER BY is_primary DESC, sort_order ASC
    `).all(variant.id);

    const sources = db.prepare(`
      SELECT * FROM costume_sources WHERE variant_id = ?
    `).all(variant.id);

    res.json({
      ...variant,
      theme: {
        id: variant.theme_id,
        name_ja: variant.theme_name_ja,
        name_zh: variant.theme_name_zh,
        category: variant.theme_category,
        description: variant.theme_description,
      },
      character: {
        id: variant.character_id,
        name_ja: variant.character_name_ja,
        name_zh: variant.character_name_zh,
        color_hex: variant.character_color_hex,
      },
      images,
      sources,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 获取所有主题列表（供下拉选择）
app.get('/api/themes', (_req, res) => {
  try {
    const themes = db.prepare(`SELECT * FROM costume_themes ORDER BY name_ja ASC`).all();
    res.json(themes);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== 4. 录入与编辑 API (含后端证据强校验) ====================

function validateCostumePayload(payload: any) {
  // 1. 待识别检查
  if (payload.name_status === 'unidentified') {
    // 待识别模式下允许 name_ja 为空或 null，但严禁标记为 verified
    if (payload.status === 'verified') {
      return '校验失败：待识别状态的衣装尚未考据出官方名称，严禁标记为“已核实”。';
    }
  }

  // 2. 已核实强校验约束 (AC-8)
  if (payload.status === 'verified') {
    if (!payload.name_ja || !payload.name_ja.trim()) {
      return '校验失败：标记为“已核实”的衣装必须具备考据属实的官方日文原名，不得为空。';
    }

    const sources = payload.sources || [];
    const hasValidEvidence = sources.some((s: any) => {
      const hasTitle = s.title && s.title.trim().length > 0;
      const hasUrl = s.url && /^https?:\/\/.+/i.test(s.url.trim());
      return hasTitle && hasUrl;
    });

    if (!hasValidEvidence) {
      return '校验失败：标记为“已核实”的衣装必须提供至少一条带有有效可复查链接（HTTP/HTTPS）的出处依据。';
    }
  }

  return null;
}

// 新增衣装
app.post('/api/costumes', (req, res) => {
  try {
    const payload = req.body;
    const validationError = validateCostumePayload(payload);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const variantId = payload.id || `variant_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    let themeId = payload.theme_id;

    const tx = db.transaction(() => {
      // 若提供了新建主题
      if (!themeId && payload.new_theme_name_ja) {
        themeId = `theme_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
        db.prepare(`
          INSERT INTO costume_themes (id, name_ja, name_zh, category, description)
          VALUES (?, ?, ?, ?, ?)
        `).run(
          themeId,
          payload.new_theme_name_ja.trim(),
          payload.new_theme_name_zh?.trim() || null,
          payload.theme_category || 'general',
          payload.theme_description?.trim() || null
        );
      }

      if (!themeId) {
        throw new Error('必须指定所属衣装主题或新建主题');
      }

      const now = new Date().toISOString();
      db.prepare(`
        INSERT INTO costume_variants (
          id, theme_id, character_id, name_ja, name_zh, name_status, status, notes, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        variantId,
        themeId,
        payload.character_id,
        payload.name_ja?.trim() || null,
        payload.name_zh?.trim() || null,
        payload.name_status || (payload.name_ja ? 'identified' : 'unidentified'),
        payload.status || 'unverified',
        payload.notes?.trim() || null,
        now,
        now
      );

      // 插入图片
      if (Array.isArray(payload.images)) {
        const insertImage = db.prepare(`
          INSERT INTO costume_images (id, variant_id, file_path, original_filename, is_primary, caption, category, sort_order)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);
        payload.images.forEach((img: any, idx: number) => {
          const imgId = img.id || `img_${Date.now()}_${idx}`;
          insertImage.run(
            imgId,
            variantId,
            img.file_path,
            img.original_filename || null,
            img.is_primary ? 1 : (idx === 0 ? 1 : 0),
            img.caption || null,
            img.category || 'illustration',
            idx + 1
          );
        });
      }

      // 插入来源
      if (Array.isArray(payload.sources)) {
        const insertSource = db.prepare(`
          INSERT INTO costume_sources (id, variant_id, source_type, evolution_stage, title, url, detail)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `);
        payload.sources.forEach((src: any, idx: number) => {
          const srcId = src.id || `src_${Date.now()}_${idx}`;
          insertSource.run(
            srcId,
            variantId,
            src.source_type || 'other',
            src.evolution_stage || 'none',
            src.title?.trim() || '未命名来源',
            src.url?.trim() || null,
            src.detail?.trim() || null
          );
        });
      }
    });

    tx();

    res.status(201).json({ id: variantId, message: '衣装记录保存成功' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// 修改衣装
app.put('/api/costumes/:id', (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;

    const validationError = validateCostumePayload(payload);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const tx = db.transaction(() => {
      const now = new Date().toISOString();
      db.prepare(`
        UPDATE costume_variants
        SET name_ja = ?,
            name_zh = ?,
            name_status = ?,
            status = ?,
            notes = ?,
            updated_at = ?
        WHERE id = ?
      `).run(
        payload.name_ja?.trim() || null,
        payload.name_zh?.trim() || null,
        payload.name_status || (payload.name_ja ? 'identified' : 'unidentified'),
        payload.status || 'unverified',
        payload.notes?.trim() || null,
        now,
        id
      );

      // 更新来源（如果提供了）
      if (Array.isArray(payload.sources)) {
        db.prepare(`DELETE FROM costume_sources WHERE variant_id = ?`).run(id);
        const insertSource = db.prepare(`
          INSERT INTO costume_sources (id, variant_id, source_type, evolution_stage, title, url, detail)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `);
        payload.sources.forEach((src: any, idx: number) => {
          const srcId = src.id || `src_${Date.now()}_${idx}`;
          insertSource.run(
            srcId,
            id,
            src.source_type || 'other',
            src.evolution_stage || 'none',
            src.title?.trim() || '未命名来源',
            src.url?.trim() || null,
            src.detail?.trim() || null
          );
        });
      }

      // 更新图片（如果提供了）
      if (Array.isArray(payload.images)) {
        db.prepare(`DELETE FROM costume_images WHERE variant_id = ?`).run(id);
        const insertImage = db.prepare(`
          INSERT INTO costume_images (id, variant_id, file_path, original_filename, is_primary, caption, category, sort_order)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);
        payload.images.forEach((img: any, idx: number) => {
          const imgId = img.id || `img_${Date.now()}_${idx}`;
          insertImage.run(
            imgId,
            id,
            img.file_path,
            img.original_filename || null,
            img.is_primary ? 1 : (idx === 0 ? 1 : 0),
            img.caption || null,
            img.category || 'illustration',
            idx + 1
          );
        });
      }
    });

    tx();

    res.json({ id, message: '衣装修改已保存' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// 删除衣装
app.delete('/api/costumes/:id', (req, res) => {
  try {
    const { id } = req.params;
    db.prepare(`DELETE FROM costume_variants WHERE id = ?`).run(id);
    res.json({ message: '衣装记录已删除' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== 5. 图片上传端点 ====================

app.post('/api/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '未接收到有效图片文件' });
    }
    const relativePath = `/uploads/${req.file.filename}`;
    res.json({
      file_path: relativePath,
      original_filename: req.file.originalname,
      size: req.file.size,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== 6. 数据备份与恢复 API ====================

// 下载整库打包 ZIP
app.get('/api/backup', async (_req, res) => {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFolder = path.resolve(DATA_DIR, '../backups');
    if (!fs.existsSync(backupFolder)) {
      fs.mkdirSync(backupFolder, { recursive: true });
    }
    const targetZip = path.resolve(backupFolder, `backup_${timestamp}.zip`);
    await createBackupZip(targetZip);

    res.download(targetZip, `lovelive_costume_backup_${timestamp}.zip`);
  } catch (err: any) {
    res.status(500).json({ error: '备份生成失败: ' + err.message });
  }
});

// 上传并恢复 ZIP 备份
app.post('/api/restore', upload.single('backup_zip'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '请上传有效的 .zip 备份包' });
    }
    const result = restoreBackupZip(req.file.path);
    // 清理上传的临时包
    try {
      fs.unlinkSync(req.file.path);
    } catch (e) {
      // ignore
    }
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: '数据恢复失败: ' + err.message });
  }
});

// ==================== 7. 自动化图鉴采集与考据 API ====================

// 触发特定角色的自动化网络检索与考据入库
app.post('/api/curate/character/:characterId', async (req, res) => {
  try {
    const { characterId } = req.params;
    const maxPages = req.body?.maxPages || 2;
    console.log(`[API] 收到角色 [${characterId}] 图鉴自动化同步请求...`);
    const result = await curateCharacterCostumes(characterId, maxPages);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: '图鉴采集失败: ' + err.message });
  }
});

app.listen(PORT, () => {
  console.log(`[Love Live! 衣装资料库 API] 服务已启动: http://localhost:${PORT}`);
});
