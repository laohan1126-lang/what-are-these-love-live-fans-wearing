import { db, initDatabase } from './db.js';

export function seedRealLifeCostumes() {
  initDatabase();
  console.log('Seeding real-life costume reference images...');

  // 确保主插画分类正确标记为 illustration
  db.prepare(`UPDATE costume_images SET category = 'illustration' WHERE id IN ('img-shioriko-01', 'img-shioriko-mj-01')`).run();

  // 插入决意之光现实实物 / COS 对照图
  const insertImg = db.prepare(`
    INSERT OR REPLACE INTO costume_images (id, variant_id, file_path, original_filename, is_primary, caption, sort_order, category)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertImg.run(
    'img-shioriko-real-01',
    'variant-shioriko-ketsui-no-hikari',
    '/uploads/shioriko_ketsui_real_01.jpg',
    'shioriko_ketsui_real_01.jpg',
    0,
    '《決意の光》现实成衣打版实物考据：和风外套、金丝滚边暗纹与百褶裙剪裁 (1000x1000 高清实物)',
    2,
    'real_life'
  );

  insertImg.run(
    'img-shioriko-real-02',
    'variant-shioriko-ketsui-no-hikari',
    '/uploads/shioriko_ketsui_real_02.jpg',
    'shioriko_ketsui_real_02.jpg',
    0,
    '《決意の光》现实实物细节平铺：腰封系带、羽毛流苏与刺绣面料结构 (1000x1000 高清细节)',
    3,
    'detail'
  );

  // 添加现实实物来源出处
  const insertSource = db.prepare(`
    INSERT OR REPLACE INTO costume_sources (id, variant_id, source_type, evolution_stage, title, url, detail)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  insertSource.run(
    'src-shioriko-real-01',
    'variant-shioriko-ketsui-no-hikari',
    'live_stage',
    'none',
    '声优小泉萌香 2nd Live 现场演出版 & 现实打版实物样衣考据对照',
    'https://v-storage.jp/report/',
    '三次元舞台实物打版考据：黑金和风开襟振袖羽织、白羽发饰与扇舞舞台动线对照'
  );

  console.log('Real-life costume references seeded successfully!');
}

seedRealLifeCostumes();
