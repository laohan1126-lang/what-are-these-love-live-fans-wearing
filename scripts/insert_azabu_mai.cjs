const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.resolve(__dirname, '../data/archive.db'));

const varId = 'var-cos-azabu-mai';
const themeId = 'theme-mai-mymai';

db.prepare(`
  INSERT INTO costume_themes (id, name_ja, name_zh, category, description)
  VALUES ('theme-mai-mymai', 'mymai', 'mymai', 'single_cd', 'いきづらい部（BLUEBIRD）麻布麻衣 Solo / 对抗曲打歌服')
  ON CONFLICT(id) DO UPDATE SET name_ja=excluded.name_ja
`).run();

db.prepare(`
  INSERT INTO costume_variants (id, theme_id, character_id, name_ja, name_zh, name_status, status, notes, created_at, updated_at)
  VALUES (?, ?, 'azabu-mai', 'mymai（麻布 麻衣Ver.）', 'mymai（麻布麻衣Ver.）', 'identified', 'unverified',
    'いきづらい部（BLUEBIRD）麻布麻衣 Solo 曲《mymai》对抗服。深海蓝 IT 机能风西装短裙、工卡夹与数据流耳机。正面全身漫展舞台实拍。',
    datetime('now'), datetime('now'))
  ON CONFLICT(id) DO UPDATE SET name_ja=excluded.name_ja, name_zh=excluded.name_zh
`).run(varId, themeId);

db.prepare(`
  INSERT INTO costume_images (id, variant_id, file_path, original_filename, is_primary, caption, category, sort_order)
  VALUES ('img-cos-azabu-mai-front', ?, '/uploads/cos-azabu-mai-front.jpg', 'cos-azabu-mai-front.jpg', 1,
    '小红书 Coser 正面实拍 @海苔由紀·《mymai》对抗服（1080x1440）', 'real_life', 0)
  ON CONFLICT(id) DO UPDATE SET file_path=excluded.file_path
`).run(varId);

db.prepare(`
  INSERT INTO costume_sources (id, variant_id, source_type, evolution_stage, title, url, detail)
  VALUES ('src-cos-azabu-mai', ?, 'cosplay_photo', 'none',
    '小红书 @海苔由紀：鸟生日就该跳鸟！',
    'https://www.xiaohongshu.com/explore/6aa584590000000026022a43',
    '在地王嘉年华跳了麻衣的mymai对抗服，正面高清舞台展示。')
  ON CONFLICT(id) DO UPDATE SET title=excluded.title
`).run(varId);

console.log('麻布麻衣入库成功！');
