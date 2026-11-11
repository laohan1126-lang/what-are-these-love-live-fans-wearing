import fs from 'fs';
import path from 'path';
import { db } from '../server/db.js';

console.log('--- 开始应用正面清晰真人模特/COS实穿对照组 ---');

const DATA_UPLOADS = 'd:/lovelive！/data/uploads';
const PUBLIC_UPLOADS = 'd:/lovelive！/public/uploads';
const TEMP_XHS = 'd:/lovelive！/temp_xhs';

const updates = [
  {
    charId: 'mifune-shioriko',
    variantId: 'variant-shioriko-ketsui-no-hikari',
    srcFile: 'shioriko_1.jpg',
    destFile: 'shioriko_ketsui_cos_model.jpg',
    caption: '三船栞子《決意の光》真人正面立姿对照：和风开襟振袖羽织、金边和风花饰、雪白百褶裙与白青羽毛头饰 (小红书@全熟小龙虾 出片)',
    source: {
      id: 'src-shioriko-xhs-cos',
      title: '小红书 @全熟小龙虾 漫展现场《決意の光》正面模特展拍',
      url: 'https://www.xiaohongshu.com/explore/6954c8a4000000001e00aa16',
      detail: '正面半身立姿，完全正对镜头展现和风羽织振袖、胸前金边纹饰与雪白百褶裙全貌'
    }
  },
  {
    charId: 'takami-chika',
    variantId: 'variant-chika-aozora-jumping-heart',
    srcFile: 'chika_4.jpg',
    destFile: 'chika_aozora_cos_model.jpg',
    caption: '高海千歌《青空Jumping Heart》真人正面直拍对照：湖水蓝双排扣小马甲、红色大领结、亮片双层百褶裙与水手小礼帽 (小红书@_1743_ 出片)',
    source: {
      id: 'src-chika-xhs-cos',
      title: '小红书 @_1743_ 青空Jumping Heart 正面直拍展示',
      url: 'https://www.xiaohongshu.com/explore/6a7ef7c5000000000503130c',
      detail: '正面对准镜头直拍，近景清晰展现水手服打歌服、胸前大领结与亮片百褶裙细节'
    }
  },
  {
    charId: 'zhong-lanzhu',
    variantId: 'variant-lanzhu-colorful-dreams',
    srcFile: 'lanzhu_crop.jpg',
    destFile: 'lanzhu_colorful_dreams_cos_model.jpg',
    caption: '钟岚珠《Colorful Dreams! Colorful Smiles!》真人正面立姿对照：白色毛绒披肩、毛绒耳罩、七彩琴键暗纹短裙与毛球手套 (小红书@歌剧悖论 舞台出片)',
    source: {
      id: 'src-lanzhu-xhs-cos',
      title: '小红书 @歌剧悖论 舞台现场《Colorful Dreams!》钟岚珠正面展示',
      url: 'https://www.xiaohongshu.com/explore/67a9f9c70000000018019a78',
      detail: '正面完整立姿，清晰展现白色毛绒披肩、毛绒耳罩、七彩琴键暗纹与短靴全貌'
    }
  },
  {
    charId: 'uehara-ayumu',
    variantId: 'variant-ayumu-yume-e-no-ippo',
    srcFile: 'ayumu_2.jpg',
    destFile: 'ayumu_yume_cos_model.jpg',
    caption: '上原步梦《夢への一歩》真人正面全身立姿对照：粉白洋装、胸前玫瑰花圈、腰间大蝴蝶结与白色长筒袜 (小红书@噜噜噜噜 舞台出片)',
    source: {
      id: 'src-ayumu-xhs-cos',
      title: '小红书 @噜噜噜噜 夢への一步 正面全身舞台立姿出片',
      url: 'https://www.xiaohongshu.com/explore/6ab9b020000000000200e465',
      detail: '正面全身立姿，正对镜头展现粉白抹胸洋装、胸前玫瑰花圈与蓬蓬裙全貌'
    }
  },
  {
    charId: 'kousaka-honoka',
    variantId: 'variant-honoka-borarara',
    srcFile: 'honoka_1.jpg',
    destFile: 'honoka_borarara_cos_model.jpg',
    caption: '高坂穗乃果《僕らのLIVE 君とのLIFE》真人正面模特立正对照：红色燕尾外套、交叉金排扣马甲、红白百褶短裙与高筒马靴 (小红书@弧泥弧图 出片)',
    source: {
      id: 'src-honoka-xhs-cos',
      title: '小红书 @弧泥弧图 我们的live与你的life 正面全身模特立展',
      url: 'https://www.xiaohongshu.com/explore/6ae6f4e3000000000e034664',
      detail: '正面笔直站立模特视角，清晰展示领结、马甲排扣、百褶裙与长筒马靴全部结构'
    }
  }
];

for (const item of updates) {
  const src = path.join(TEMP_XHS, item.srcFile);
  const dataDest = path.join(DATA_UPLOADS, item.destFile);
  const pubDest = path.join(PUBLIC_UPLOADS, item.destFile);
  
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dataDest);
    fs.copyFileSync(src, pubDest);
    console.log(`Copied ${item.srcFile} -> ${item.destFile}`);
  } else {
    console.error(`Source file not found: ${src}`);
  }
  
  // 调整数据库：将旧的 real_life 降为 detail
  db.prepare(`
    UPDATE costume_images
    SET category = 'detail', is_primary = 0
    WHERE variant_id = ? AND category = 'real_life'
  `).run(item.variantId);
  
  // 插入新的正面模特 real_life
  const newImgId = `img-${item.charId}-real-model`;
  db.prepare(`DELETE FROM costume_images WHERE id = ?`).run(newImgId);
  db.prepare(`
    INSERT INTO costume_images (id, variant_id, file_path, original_filename, is_primary, caption, category, sort_order)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    newImgId,
    item.variantId,
    `/uploads/${item.destFile}`,
    item.destFile,
    1,
    item.caption,
    'real_life',
    1
  );
  
  // 插入来源记录
  db.prepare(`DELETE FROM costume_sources WHERE id = ?`).run(item.source.id);
  db.prepare(`
    INSERT INTO costume_sources (id, variant_id, source_type, evolution_stage, title, url, detail)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    item.source.id,
    item.variantId,
    'cosplay_photo',
    'none',
    item.source.title,
    item.source.url,
    item.source.detail
  );
  
  console.log(`Updated variant: ${item.variantId}`);
}

console.log('--- 数据库与静态资源更新完毕！ ---');
