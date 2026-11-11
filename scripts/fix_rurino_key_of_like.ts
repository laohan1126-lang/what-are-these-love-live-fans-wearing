import Database from 'better-sqlite3';
import fs from 'fs';

// 1. Copy image to data/uploads
fs.copyFileSync('public/uploads/rurino_key_of_like_2d.jpg', 'data/uploads/rurino_key_of_like_2d.jpg');

const db = new Database('data/archive.db');

// Update theme
db.prepare(`
  UPDATE costume_themes
  SET name_ja = 'KEY of Like！',
      name_zh = 'KEY of Like！',
      category = 'single',
      description = '莲之空女学院学园偶像俱乐部 104期 4th Single《KEY of Like！》官方舞台服'
  WHERE id = 'theme-rurino-key-of-like' OR id = 'theme-rurino-secret-christmas'
`).run();

// Update variant
const desc = '莲之空女学院学园偶像俱乐部 4th 单曲《KEY of Like！》（104期9人曲）官方舞台打歌服。标志性军乐礼帽配金色星饰、红白配色无袖马甲背心、胸前金色双排链饰与领结、黑色束腰配多层红色蓬褶裙与白色长手套。左轨为官方 2D 专辑打歌服原画母版；右轨为小红书同款 Cosplay 舞台实穿对照。';

db.prepare(`
  UPDATE costume_variants
  SET name_ja = 'ドレス《KEY of Like！》（大沢 瑠璃乃Ver.）',
      name_zh = 'KEY of Like！打歌服（大泽瑠璃乃Ver.）',
      notes = ?
  WHERE id = 'var-cos-rurino-osawa'
`).run(desc);

// Update 2D image
db.prepare(`
  UPDATE costume_images
  SET file_path = '/uploads/rurino_key_of_like_2d.jpg',
      caption = '官方 4th Single《KEY of Like！》大沢瑠璃乃打歌服原画母版'
  WHERE id = 'img-cos-rurino-osawa-ref'
`).run();

// Update 3D image caption to be accurate
db.prepare(`
  UPDATE costume_images
  SET caption = '小红书 Coser 正面实拍 @孤独小猫酱 · 《KEY of Like！》打歌服舞台实穿'
  WHERE id = 'img-cos-rurino-osawa-front'
`).run();

console.log('Database updated successfully for Rurino KEY of Like!');
db.close();
