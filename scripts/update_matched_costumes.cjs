const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, '../data/archive.db');
const db = new Database(dbPath);

const updates = [
  {
    theme_id: 'theme-rurino-key-of-like',
    theme_ja: 'Key of Like!',
    theme_zh: 'Key of Like!',
    theme_cat: 'single_cd',
    theme_desc: 'みらくらぱーく！ 1st 单曲打歌服',
    var_id: 'var-cos-rurino-osawa',
    name_ja: 'ドレス《Key of Like!》（大沢 瑠璃乃Ver.）',
    name_zh: 'Key of Like!（大泽瑠璃乃Ver.）',
    notes: '莲之空女学院学园偶像俱乐部 みらくらぱーく！（Mira-Cra Park!）单曲《Key of Like!》打歌服。标志性双马尾、黄色连帽长袖与橙黄百褶裙、多重糖果挂饰。',
    card_title: 'Link! Like! Love Live! UR【Key of Like!】大沢 瑠璃乃（特訓後）'
  },
  {
    theme_id: 'theme-hanamaru-omoi-yo',
    theme_ja: '想いよひとつになれ',
    theme_zh: '心意合而为一',
    theme_cat: 'anime_in',
    theme_desc: 'Aqours 动画1期第11话标志性插曲打歌服',
    var_id: 'var-cos-kunikida-hanamaru',
    name_ja: '想いよひとつになれ（国木田 花丸Ver.）',
    name_zh: '心意合而为一（国木田花丸Ver.）',
    notes: 'Aqours 动画1期插曲《想いよひとつになれ》打歌服。明黄色缎面燕尾百褶裙、金色蕾线、礼帽与小短靴。',
    card_title: 'SIFAS SR【想いよひとつになれ】覚醒後'
  },
  {
    theme_id: 'theme-nozomi-kirakira',
    theme_ja: 'KiRa-KiRa Sensation!',
    theme_zh: '闪亮心情',
    theme_cat: 'anime_in',
    theme_desc: 'μ’s 动画2期第12话 Love Live! 最终决战夺冠曲打歌服',
    var_id: 'var-cos-tojo-nozomi',
    name_ja: 'KiRa-KiRa Sensation!（東條 希Ver.）',
    name_zh: 'KiRa-KiRa Sensation!（东条希Ver.）',
    notes: 'μ’s 动画2期决赛优胜曲《KiRa-KiRa Sensation!》打歌服。紫白格纹多层裙摆、金扣马甲与紫色羽毛发饰。',
    card_title: 'SIFAS SR【KiRa-KiRa Sensation!】覚醒後'
  },
  {
    theme_id: 'theme-umi-angel',
    theme_ja: 'ホワイトデー編 天使の弓矢',
    theme_zh: '天使篇 / 白色情人节爱神',
    theme_cat: 'game_card',
    theme_desc: 'SIF 经典爱神丘比特天使觉醒打歌服',
    var_id: 'var-cos-sonoda-umi',
    name_ja: 'ホワイトデー編 天使の弓矢（園田 海未Ver.）',
    name_zh: '天使篇爱神（园田海未Ver.）',
    notes: 'SIF 极高人气天使篇（白色情人节）觉醒后。深海蓝与纯白双色希腊风神圣礼服、洁白丘比特羽翼、金丝罗马绑带与天使手杖。',
    card_title: 'SIF UR【天使編 / ホワイトデー】園田 海未（覚醒後）'
  },
  {
    theme_id: 'theme-setsuna-chase',
    theme_ja: 'CHASE!',
    theme_zh: 'CHASE!',
    theme_cat: 'single_cd',
    theme_desc: '优木雪菜 1st Solo 单曲标志性打歌服，动画1期第1话惊艳开场曲',
    var_id: 'var-cos-yuki-setsuna',
    name_ja: 'CHASE!（優木 せつ菜Ver.）',
    name_zh: 'CHASE!（优木雪菜Ver.）',
    notes: '动画1期第1话高燃插入曲《CHASE!》打歌服。黑红相间哥特摇滚风燕尾制服，火红皮质手套与不对称百褶裙。',
    card_title: 'SIFAS UR【CHASE!】覚醒後'
  },
  {
    theme_id: 'theme-rina-miracle-stay',
    theme_ja: 'Miracle STAY TUNE!',
    theme_zh: 'Miracle STAY TUNE!',
    theme_cat: 'single_cd',
    theme_desc: '虹咲学园偶像同好会 广播剧主题曲打歌服',
    var_id: 'var-cos-tennoji-rina',
    name_ja: 'Miracle STAY TUNE!（天王寺 璃奈Ver.）',
    name_zh: 'Miracle STAY TUNE!（天王寺璃奈Ver.）',
    notes: '虹咲4th单曲《Miracle STAY TUNE!》打歌服。猫耳电波帽、白粉色渐变未来感裙装与璃奈板配饰。',
    card_title: 'SIFAS UR【Miracle STAY TUNE!】覚醒後'
  },
  {
    theme_id: 'theme-hanabi-dou-da',
    theme_ja: 'DOU DA DOING',
    theme_zh: 'DOU DA DOING',
    theme_cat: 'single_cd',
    theme_desc: 'いきづらい部（BLUEBIRD）驹形花火 Solo 曲打歌服',
    var_id: 'var-cos-komagata-hanabi',
    name_ja: 'DOU DA DOING（駒形 花火Ver.）',
    name_zh: 'DOU DA DOING（驹形花火Ver.）',
    notes: 'いきづらい部（BLUEBIRD）驹形花火 Solo 曲《DOU DA DOING》打歌服。红蓝相间热血运动水手裙、护额与亮片拳套。',
    card_title: 'BLUEBIRD 公式 駒形 花火《DOU DA DOING》舞台立绘'
  },
  {
    theme_id: 'theme-mai-mymai',
    theme_ja: 'mymai',
    theme_zh: 'mymai',
    theme_cat: 'single_cd',
    theme_desc: 'いきづらい部（BLUEBIRD）麻布麻衣 Solo / 对抗曲打歌服',
    var_id: 'var-cos-azabu-mai',
    name_ja: 'mymai（麻布 麻衣Ver.）',
    name_zh: 'mymai（麻布麻衣Ver.）',
    notes: 'いきづらい部（BLUEBIRD）麻布麻衣 Solo 曲《mymai》对抗服。深海蓝 IT 机能风西装短裙、工卡夹与数据流耳机。',
    card_title: 'BLUEBIRD 公式 麻布 麻衣《mymai》舞台立绘'
  }
];

const insertTheme = db.prepare(`
  INSERT INTO costume_themes (id, name_ja, name_zh, category, description)
  VALUES (?, ?, ?, ?, ?)
  ON CONFLICT(id) DO UPDATE SET
    name_ja=excluded.name_ja,
    name_zh=excluded.name_zh,
    category=excluded.category,
    description=excluded.description
`);

const updateVariant = db.prepare(`
  UPDATE costume_variants
  SET theme_id = ?,
      name_ja = ?,
      name_zh = ?,
      name_status = 'identified',
      notes = ?,
      updated_at = datetime('now')
  WHERE id = ?
`);

const updateImageCaption = db.prepare(`
  UPDATE costume_images
  SET caption = ?
  WHERE variant_id = ? AND category = 'real_life'
`);

for (const u of updates) {
  insertTheme.run(u.theme_id, u.theme_ja, u.theme_zh, u.theme_cat, u.theme_desc);
  const res = updateVariant.run(u.theme_id, u.name_ja, u.name_zh, u.notes, u.var_id);
  if (res.changes > 0) {
    console.log(`[PASS] 成功匹配并正名: ${u.var_id} -> ${u.name_ja} (${u.name_zh})`);
  } else {
    console.log(`[SKIP] 记录未在库中: ${u.var_id}`);
  }
}

console.log('全部匹配操作完成！');
