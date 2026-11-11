import { db } from '../server/db.js';

console.log('--- 开始注入真实人物上身与扩充对照组数据 ---');

// 清理之前残留的破损或未完成采集卡面数据（例如无图或未觉醒被错误标觉醒的条目）
db.prepare("DELETE FROM costume_variants WHERE name_ja LIKE '%Miracle STAY TUNE%' OR name_ja LIKE '%Tried to Come Up%'").run();
db.prepare("DELETE FROM costume_variants WHERE character_id = 'omi-kanata'").run();

// 1. 更新三船栞子《決意の光》的图片分类与真人演出照
db.prepare("DELETE FROM costume_images WHERE variant_id = 'variant-shioriko-ketsui-no-hikari'").run();

// 2D 官方插画
db.prepare(`
  INSERT INTO costume_images (id, variant_id, file_path, original_filename, is_primary, caption, category, sort_order)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`).run(
  'img-shioriko-01',
  'variant-shioriko-ketsui-no-hikari',
  '/uploads/shioriko_ketsui_no_hikari.jpg',
  'shioriko_ketsui_no_hikari.jpg',
  1,
  'SIFAS 觉醒后舞台主视觉 (1024x630 官方原画)',
  'illustration',
  1
);

// 真人上身对照 (小泉萌香 东京巨蛋实景演出)
db.prepare(`
  INSERT INTO costume_images (id, variant_id, file_path, original_filename, is_primary, caption, category, sort_order)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`).run(
  'img-shioriko-real-live',
  'variant-shioriko-ketsui-no-hikari',
  '/uploads/shioriko_ketsui_live_real.jpg',
  'shioriko_ketsui_live_real.jpg',
  1,
  '声优小泉萌香（三船栞子役）东京巨蛋 Live 现场舞台实穿：和风开襟振袖羽织、后背立体腰封结与白羽发饰 (真人实穿舞台对照)',
  'real_life',
  1
);

// 原假人模特打版与细节降为 detail 细节特写
db.prepare(`
  INSERT INTO costume_images (id, variant_id, file_path, original_filename, is_primary, caption, category, sort_order)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`).run(
  'img-shioriko-detail-01',
  'variant-shioriko-ketsui-no-hikari',
  '/uploads/shioriko_ketsui_real_01.jpg',
  'shioriko_ketsui_real_01.jpg',
  0,
  '《決意の光》成衣打版版型剪裁：和风外套、金丝滚边暗纹与百褶裙剪裁 (细节特写)',
  'detail',
  2
);

db.prepare(`
  INSERT INTO costume_images (id, variant_id, file_path, original_filename, is_primary, caption, category, sort_order)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`).run(
  'img-shioriko-detail-02',
  'variant-shioriko-ketsui-no-hikari',
  '/uploads/shioriko_ketsui_real_02.jpg',
  'shioriko_ketsui_real_02.jpg',
  0,
  '《決意の光》刺绣细节与面料结构：腰封系带、羽毛流苏与和风印花 (细节特写)',
  'detail',
  3
);

// 更新来源
db.prepare("DELETE FROM costume_sources WHERE variant_id = 'variant-shioriko-ketsui-no-hikari' AND source_type = 'live_stage'").run();
db.prepare(`
  INSERT INTO costume_sources (id, variant_id, source_type, evolution_stage, title, url, detail)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`).run(
  'src-shioriko-real-live',
  'variant-shioriko-ketsui-no-hikari',
  'live_stage',
  'none',
  '音楽ナタリー & 異次元フェス 2023 东京巨蛋 Live 官方现场摄影报道',
  'https://natalie.mu/comic/news/552522',
  '小泉萌香（三船栞子役）身穿《決意の光》打歌服于东京巨蛋独唱舞台实录，振袖、腰封蝴蝶结与走位动线现场对照'
);

// 2. 上原步梦《夢への一歩》补全对照组
db.prepare("DELETE FROM costume_images WHERE variant_id = 'variant-ayumu-yume-e-no-ippo'").run();
db.prepare(`
  INSERT INTO costume_images (id, variant_id, file_path, original_filename, is_primary, caption, category, sort_order)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`).run(
  'img-ayumu-2d-01',
  'variant-ayumu-yume-e-no-ippo',
  '/uploads/ayumu_yume_e_no_ippo_2d.png',
  'ayumu_yume_e_no_ippo_2d.png',
  1,
  'SIFAS UR 覚醒後 3600x1800 官方超清原画母版：粉白格纹百褶裙与胸前玫瑰花圈',
  'illustration',
  1
);
db.prepare(`
  INSERT INTO costume_images (id, variant_id, file_path, original_filename, is_primary, caption, category, sort_order)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`).run(
  'img-ayumu-real-live',
  'variant-ayumu-yume-e-no-ippo',
  '/uploads/ayumu_dream_with_you_live_real.jpg',
  'ayumu_dream_with_you_live_real.jpg',
  1,
  '声优大西亚玖璃（上原步梦役）东京巨蛋 Live 现场舞台实穿：粉白爱心蓬蓬裙与发带手套 (真人实穿舞台对照)',
  'real_life',
  1
);
db.prepare(`
  INSERT INTO costume_images (id, variant_id, file_path, original_filename, is_primary, caption, category, sort_order)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`).run(
  'img-ayumu-detail-01',
  'variant-ayumu-yume-e-no-ippo',
  '/uploads/azuna_dream_land_live.jpg',
  'azuna_dream_land_live.jpg',
  0,
  '声优グランプリ 官方特写：A・ZU・NA 游乐园打歌服配饰与腰包细节',
  'detail',
  2
);
db.prepare("DELETE FROM costume_sources WHERE variant_id = 'variant-ayumu-yume-e-no-ippo' AND source_type = 'live_stage'").run();
db.prepare(`
  INSERT INTO costume_sources (id, variant_id, source_type, evolution_stage, title, url, detail)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`).run(
  'src-ayumu-real-live',
  'variant-ayumu-yume-e-no-ippo',
  'live_stage',
  'none',
  '音楽ナタリー & 異次元フェス 2023 现场报道：大西亚玖璃 Solo 舞台实拍',
  'https://natalie.mu/comic/news/552522',
  '大西亚玖璃（上原步梦役）身穿粉白洋装打歌服舞台现场实录'
);

// 3. 钟岚珠《Colorful Dreams! Colorful Smiles!》
const themeLanzhuCdcs = 'theme-lanzhu-colorful-dreams';
db.prepare(`
  INSERT OR IGNORE INTO costume_themes (id, name_ja, name_zh, category, description)
  VALUES (?, ?, ?, ?, ?)
`).run(themeLanzhuCdcs, 'Colorful Dreams! Colorful Smiles!', '多彩梦想！多彩笑容！', 'anime_op', '动画2期 OP 演出服，钟岚珠正式加入同好会后的 13 人打歌服');

const variantLanzhuCdcs = 'variant-lanzhu-colorful-dreams';
db.prepare(`
  INSERT OR REPLACE INTO costume_variants (id, theme_id, character_id, name_ja, name_zh, name_status, status, notes, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`).run(
  variantLanzhuCdcs,
  themeLanzhuCdcs,
  'zhong-lanzhu',
  'Colorful Dreams! Colorful Smiles!（鐘 嵐珠Ver.）',
  'Colorful Dreams 钟岚珠版',
  'identified',
  'verified',
  '白色毛绒披肩长裙、裙摆饰有七彩琴键与音符暗纹、配毛绒耳罩与黑色手套。',
  new Date().toISOString(),
  new Date().toISOString()
);

db.prepare("DELETE FROM costume_images WHERE variant_id = ?").run(variantLanzhuCdcs);
db.prepare(`
  INSERT INTO costume_images (id, variant_id, file_path, original_filename, is_primary, caption, category, sort_order)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`).run(
  'img-lanzhu-cdcs-2d',
  variantLanzhuCdcs,
  '/uploads/lanzhu_colorful_dreams_idolized_2d.png',
  'lanzhu_colorful_dreams_idolized_2d.png',
  1,
  'SIFAS 覚醒後 3600x1800 官方超清原画母版：七彩琴键裙摆与毛绒披风',
  'illustration',
  1
);
db.prepare(`
  INSERT INTO costume_images (id, variant_id, file_path, original_filename, is_primary, caption, category, sort_order)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`).run(
  'img-lanzhu-cdcs-real',
  variantLanzhuCdcs,
  '/uploads/nijigasaki_5th_live_full.jpg',
  'nijigasaki_5th_live_full.jpg',
  1,
  '虹ヶ咲 5th Live 巨蛋舞台全景实录：法元明菜（钟岚珠役）与全员身穿《Colorful Dreams! Colorful Smiles!》现场打歌服 (真人舞台对照)',
  'real_life',
  1
);
db.prepare(`
  INSERT INTO costume_images (id, variant_id, file_path, original_filename, is_primary, caption, category, sort_order)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`).run(
  'img-lanzhu-cdcs-detail',
  variantLanzhuCdcs,
  '/uploads/lanzhu_eutopia_live_real.jpg',
  'lanzhu_eutopia_live_real.jpg',
  0,
  '法元明菜（钟岚珠役）现场特写：舞台 2D 大屏幕与真人实穿同框对照 (舞台细节特写)',
  'detail',
  2
);

db.prepare("DELETE FROM costume_sources WHERE variant_id = ?").run(variantLanzhuCdcs);
db.prepare(`
  INSERT INTO costume_sources (id, variant_id, source_type, evolution_stage, title, url, detail)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`).run(
  'src-lanzhu-cdcs-01',
  variantLanzhuCdcs,
  'game_card',
  'awakened',
  'SIFAS SR【Colorful Dreams! Colorful Smiles!】覚醒後',
  'https://idol.st/allstars/card/736/',
  '动画2期 OP 官方限定卡面，附带 3D 舞台演出打歌服'
);
db.prepare(`
  INSERT INTO costume_sources (id, variant_id, source_type, evolution_stage, title, url, detail)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`).run(
  'src-lanzhu-cdcs-02',
  variantLanzhuCdcs,
  'live_stage',
  'none',
  '声優グランプリ 官方 5th Live 巨蛋公演现场图鉴报道',
  'https://seigura.com/news/96710/',
  '虹咲 5th Live Colorful Dreams! Colorful Smiles! 舞台全员实物演出服实录'
);

// 4. 高海千歌《青空Jumping Heart》
const themeChikaAozora = 'theme-chika-aozora-jumping-heart';
db.prepare(`
  INSERT OR IGNORE INTO costume_themes (id, name_ja, name_zh, category, description)
  VALUES (?, ?, ?, ?, ?)
`).run(themeChikaAozora, '青空Jumping Heart', '青空Jumping Heart', 'anime_op', '动画1期 OP 演出服，Aqours 经典海军风打歌服');

const variantChikaAozora = 'variant-chika-aozora-jumping-heart';
db.prepare(`
  INSERT OR REPLACE INTO costume_variants (id, theme_id, character_id, name_ja, name_zh, name_status, status, notes, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`).run(
  variantChikaAozora,
  themeChikaAozora,
  'takami-chika',
  '青空Jumping Heart（高海千歌Ver.）',
  '青空Jumping Heart 千歌版',
  'identified',
  'verified',
  '海蓝色双排扣小外套、百褶裙拼黄白波浪滚边、水手礼帽与亮黄领结。',
  new Date().toISOString(),
  new Date().toISOString()
);

db.prepare("DELETE FROM costume_images WHERE variant_id = ?").run(variantChikaAozora);
db.prepare(`
  INSERT INTO costume_images (id, variant_id, file_path, original_filename, is_primary, caption, category, sort_order)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`).run(
  'img-chika-aozora-2d',
  variantChikaAozora,
  '/uploads/chika_aozora_2d.png',
  'chika_aozora_2d.png',
  1,
  'SIFAS 覚醒後 3600x1800 官方超清原画母版：海蓝双排扣水手制服与百褶裙',
  'illustration',
  1
);
db.prepare(`
  INSERT INTO costume_images (id, variant_id, file_path, original_filename, is_primary, caption, category, sort_order)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`).run(
  'img-chika-aozora-real',
  variantChikaAozora,
  '/uploads/aqours_aozora_live_real.jpg',
  'aqours_aozora_live_real.jpg',
  1,
  'Aqours（高海千歌役 伊波杏树等全员）东京巨蛋 Live 舞台实录：经典蓝白海军风打歌服 (真人舞台对照)',
  'real_life',
  1
);
db.prepare(`
  INSERT INTO costume_images (id, variant_id, file_path, original_filename, is_primary, caption, category, sort_order)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`).run(
  'img-chika-aozora-detail',
  variantChikaAozora,
  '/uploads/aqours_5th_live.jpg',
  'aqours_5th_live.jpg',
  0,
  '声優グランプリ 官方特写：Aqours 巨蛋演唱会舞台演出服结构与彩虹灯海 (细节特写)',
  'detail',
  2
);

db.prepare("DELETE FROM costume_sources WHERE variant_id = ?").run(variantChikaAozora);
db.prepare(`
  INSERT INTO costume_sources (id, variant_id, source_type, evolution_stage, title, url, detail)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`).run(
  'src-chika-aozora-01',
  variantChikaAozora,
  'game_card',
  'awakened',
  'SIFAS SR【青空Jumping Heart】覚醒後',
  'https://idol.st/allstars/card/150/',
  'Love Live! Sunshine!! 动画1期片头曲专属打歌服'
);
db.prepare(`
  INSERT INTO costume_sources (id, variant_id, source_type, evolution_stage, title, url, detail)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`).run(
  'src-chika-aozora-02',
  variantChikaAozora,
  'live_stage',
  'none',
  '音楽ナタリー & 異次元フェス 2023 东京巨蛋开场演出官方报道',
  'https://natalie.mu/comic/news/552522',
  'Aqours 全员身穿《青空Jumping Heart》海军打歌服巨蛋全景现场实录'
);

// 5. 高坂穗乃果《僕らのLIVE 君とのLIFE》
const themeHonokaBorarara = 'theme-honoka-borarara';
db.prepare(`
  INSERT OR IGNORE INTO costume_themes (id, name_ja, name_zh, category, description)
  VALUES (?, ?, ?, ?, ?)
`).run(themeHonokaBorarara, '僕らのLIVE 君とのLIFE', '我们的LIVE 与你的LIFE', 'single_cd', 'μ’s 出道单曲标志性打歌服');

const variantHonokaBorarara = 'variant-honoka-borarara';
db.prepare(`
  INSERT OR REPLACE INTO costume_variants (id, theme_id, character_id, name_ja, name_zh, name_status, status, notes, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`).run(
  variantHonokaBorarara,
  themeHonokaBorarara,
  'kousaka-honoka',
  '僕らのLIVE 君とのLIFE（高坂穂乃果Ver.）',
  '我们的LIVE 与你的LIFE 穗乃果版',
  'identified',
  'verified',
  '红白交领领结、金色胸排系绳、红白拼接百褶裙与红黑长筒袜。',
  new Date().toISOString(),
  new Date().toISOString()
);

db.prepare("DELETE FROM costume_images WHERE variant_id = ?").run(variantHonokaBorarara);
db.prepare(`
  INSERT INTO costume_images (id, variant_id, file_path, original_filename, is_primary, caption, category, sort_order)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`).run(
  'img-honoka-bora-2d',
  variantHonokaBorarara,
  '/uploads/honoka_borarara_2d.png',
  'honoka_borarara_2d.png',
  1,
  'SIFAS 覚醒後 3600x1800 官方超清原画母版：红金领结与百褶裙',
  'illustration',
  1
);
db.prepare(`
  INSERT INTO costume_images (id, variant_id, file_path, original_filename, is_primary, caption, category, sort_order)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`).run(
  'img-honoka-bora-real',
  variantHonokaBorarara,
  '/uploads/muse_borarara_live_1.jpg',
  'muse_borarara_live_1.jpg',
  1,
  'μ’s（高坂穗乃果役 新田惠海等9人）东京巨蛋 Final Live 实景演出：大屏幕动画原画与真人打歌服同台对照 (真人舞台对照)',
  'real_life',
  1
);

db.prepare("DELETE FROM costume_sources WHERE variant_id = ?").run(variantHonokaBorarara);
db.prepare(`
  INSERT INTO costume_sources (id, variant_id, source_type, evolution_stage, title, url, detail)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`).run(
  'src-honoka-bora-01',
  variantHonokaBorarara,
  'game_card',
  'awakened',
  'SIFAS SR【僕らのLIVE 君とのLIFE】覚醒後',
  'https://idol.st/allstars/card/148/',
  'μ’s 传奇原点 1st 单曲打歌服'
);
db.prepare(`
  INSERT INTO costume_sources (id, variant_id, source_type, evolution_stage, title, url, detail)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`).run(
  'src-honoka-bora-02',
  variantHonokaBorarara,
  'live_stage',
  'none',
  '音楽ナタリー μ’s Final LoveLive!〜μ’sic Forever♪♪♪♪♪♪♪♪♪〜 官方现场摄影报道',
  'https://natalie.mu/music/gallery/news/182523/501796',
  '东京巨蛋现场演唱《僕らのLIVE 君とのLIFE》官方舞台实录'
);

// 6. 日野下花帆《スリーズブーケ ライブステージ衣装》
const themeKahoCerise = 'theme-kaho-cerise-bouquet';
db.prepare(`
  INSERT OR IGNORE INTO costume_themes (id, name_ja, name_zh, category, description)
  VALUES (?, ?, ?, ?, ?)
`).run(themeKahoCerise, 'スリーズブーケ ライブステージ衣装', 'Cerise Bouquet 舞台衣装', 'unit_live', '莲之空女学院小分队 スリーズブーケ 专属洋装演出服');

const variantKahoCerise = 'variant-kaho-cerise-bouquet';
db.prepare(`
  INSERT OR REPLACE INTO costume_variants (id, theme_id, character_id, name_ja, name_zh, name_status, status, notes, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`).run(
  variantKahoCerise,
  themeKahoCerise,
  'kaho-hinoshita',
  'スリーズブーケ ライブステージ衣装（日野下花帆Ver.）',
  'Cerise Bouquet 花帆版',
  'identified',
  'verified',
  '柔粉色披肩洋装、双层米色蕾丝百褶裙、白色丝缎领结与长手套。',
  new Date().toISOString(),
  new Date().toISOString()
);

db.prepare("DELETE FROM costume_images WHERE variant_id = ?").run(variantKahoCerise);
db.prepare(`
  INSERT INTO costume_images (id, variant_id, file_path, original_filename, is_primary, caption, category, sort_order)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`).run(
  'img-kaho-cerise-real',
  variantKahoCerise,
  '/uploads/hasunosora_cerise_live.jpg',
  'hasunosora_cerise_live.jpg',
  1,
  '声優グランプリ 官方特写（1000x667 超清）：スリーズブーケ（日野下花帆役 榆井希实等）埼玉巨蛋 Live 实穿粉白洋装演出服 (真人舞台对照)',
  'real_life',
  1
);
db.prepare(`
  INSERT INTO costume_images (id, variant_id, file_path, original_filename, is_primary, caption, category, sort_order)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`).run(
  'img-kaho-cerise-detail',
  variantKahoCerise,
  '/uploads/hasunosora_mira_live.jpg',
  'hasunosora_mira_live.jpg',
  0,
  'スリーズブーケ 现场舞台大屏与三人近景特写 (677KB 超清舞台特写)',
  'detail',
  2
);

db.prepare("DELETE FROM costume_sources WHERE variant_id = ?").run(variantKahoCerise);
db.prepare(`
  INSERT INTO costume_sources (id, variant_id, source_type, evolution_stage, title, url, detail)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`).run(
  'src-kaho-cerise-01',
  variantKahoCerise,
  'live_stage',
  'none',
  '声優グランプリ【ライブレポート】初の単独ドームで咲き誇る！ 蓮ノ空女学院 埼玉公演',
  'https://seigura.com/news/174009/',
  '莲之空女学院学园偶像俱乐部小分队 スリーズブーケ 舞台打歌服现场实录'
);

console.log('--- 注入完成！数据库已更新 ---');
