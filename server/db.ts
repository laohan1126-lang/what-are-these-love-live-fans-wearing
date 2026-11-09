import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const DATA_DIR = path.resolve(__dirname, '../data');
export const UPLOADS_DIR = path.resolve(DATA_DIR, 'uploads');
export const DB_FILE = path.resolve(DATA_DIR, 'archive.db');

// 确保数据与上传目录存在
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

export const db = new Database(DB_FILE);
db.pragma('foreign_keys = ON');

export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      name_ja TEXT NOT NULL,
      name_zh TEXT NOT NULL,
      sort_order INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS groups (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL,
      name_ja TEXT NOT NULL,
      name_zh TEXT NOT NULL,
      type TEXT NOT NULL, -- 'main', 'subunit', 'special'
      sort_order INTEGER DEFAULT 0,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE RESTRICT
    );

    CREATE TABLE IF NOT EXISTS characters (
      id TEXT PRIMARY KEY,
      name_ja TEXT NOT NULL,
      name_zh TEXT NOT NULL,
      enrollment_term TEXT,
      status TEXT NOT NULL DEFAULT 'active', -- 'active', 'graduated', 'former'
      color_hex TEXT,
      sort_order INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS character_groups (
      character_id TEXT NOT NULL,
      group_id TEXT NOT NULL,
      period TEXT DEFAULT '全时期',
      status TEXT NOT NULL DEFAULT 'active', -- 'active', 'historical'
      role_description TEXT,
      PRIMARY KEY (character_id, group_id, period),
      FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE,
      FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS costume_themes (
      id TEXT PRIMARY KEY,
      name_ja TEXT NOT NULL,
      name_zh TEXT,
      category TEXT DEFAULT 'general',
      description TEXT
    );

    CREATE TABLE IF NOT EXISTS costume_variants (
      id TEXT PRIMARY KEY,
      theme_id TEXT NOT NULL,
      character_id TEXT NOT NULL,
      name_ja TEXT,
      name_zh TEXT,
      name_status TEXT NOT NULL DEFAULT 'identified', -- 'identified', 'unidentified'
      status TEXT NOT NULL DEFAULT 'unverified', -- 'verified', 'unverified'
      notes TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (theme_id) REFERENCES costume_themes(id) ON DELETE RESTRICT,
      FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE RESTRICT
    );

    CREATE TABLE IF NOT EXISTS costume_images (
      id TEXT PRIMARY KEY,
      variant_id TEXT NOT NULL,
      file_path TEXT NOT NULL,
      original_filename TEXT,
      is_primary INTEGER DEFAULT 0,
      caption TEXT,
      sort_order INTEGER DEFAULT 0,
      FOREIGN KEY (variant_id) REFERENCES costume_variants(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS costume_sources (
      id TEXT PRIMARY KEY,
      variant_id TEXT NOT NULL,
      source_type TEXT NOT NULL, -- 'anime', 'game_card', 'seiyuu_live', 'cd_jacket', 'magazine', 'official_art', 'other'
      evolution_stage TEXT NOT NULL DEFAULT 'none', -- 'none', 'unawakened', 'awakened'
      title TEXT NOT NULL,
      url TEXT,
      detail TEXT,
      FOREIGN KEY (variant_id) REFERENCES costume_variants(id) ON DELETE CASCADE
    );
  `);

  seedData();
}

function seedData() {
  const insertProject = db.prepare(`
    INSERT OR IGNORE INTO projects (id, name_ja, name_zh, sort_order)
    VALUES (?, ?, ?, ?)
  `);

  const insertGroup = db.prepare(`
    INSERT OR IGNORE INTO groups (id, project_id, name_ja, name_zh, type, sort_order)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const insertCharacter = db.prepare(`
    INSERT OR IGNORE INTO characters (id, name_ja, name_zh, enrollment_term, status, color_hex, sort_order)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const insertCharacterGroup = db.prepare(`
    INSERT OR IGNORE INTO character_groups (character_id, group_id, period, status, role_description)
    VALUES (?, ?, ?, ?, ?)
  `);

  const seedTx = db.transaction(() => {
    // 1. 企划
    insertProject.run('nijigasaki', '虹ヶ咲学園スクールアイドル同好会', '虹咲学园学园偶像同好会', 1);
    insertProject.run('hasunosora', '蓮ノ空女学院スクールアイドルクラブ', '莲之空女学院学园偶像俱乐部', 2);
    insertProject.run('superstar', 'ラブライブ！スーパースター!! (Liella!)', 'Liella!', 3);
    insertProject.run('sunshine', 'ラブライブ！サンシャイン!! (Aqours)', 'Aqours', 4);
    insertProject.run('muse', 'ラブライブ！School idol project (μ\'s)', 'μ\'s', 5);
    insertProject.run('ikizuraibu', 'いきづらい部！', 'いきづらい部', 6);

    // 2. 团体与小分队
    // 虹咲
    insertGroup.run('nijigasaki_main', 'nijigasaki', '虹ヶ咲学園スクールアイドル同好会', '虹咲全员', 'main', 1);
    insertGroup.run('r3birth', 'nijigasaki', 'R3BIRTH', 'R3BIRTH', 'subunit', 2);
    insertGroup.run('azuna', 'nijigasaki', 'A・ZU・NA', 'A・ZU・NA', 'subunit', 3);
    insertGroup.run('diverdiva', 'nijigasaki', 'DiverDiva', 'DiverDiva', 'subunit', 4);
    insertGroup.run('qu4rtz', 'nijigasaki', 'QU4RTZ', 'QU4RTZ', 'subunit', 5);

    // 莲之空
    insertGroup.run('hasunosora_main', 'hasunosora', '蓮ノ空女学院スクールアイドルクラブ', '莲之空全员', 'main', 1);
    insertGroup.run('cerise_bouquet', 'hasunosora', 'スリーズブーケ', 'Cerise Bouquet', 'subunit', 2);
    insertGroup.run('dollchestra', 'hasunosora', 'DOLLCHESTRA', 'DOLLCHESTRA', 'subunit', 3);
    insertGroup.run('mira_cra_park', 'hasunosora', 'みらくらぱーく！', 'Mira-Cra Park!', 'subunit', 4);
    insertGroup.run('edel_note', 'hasunosora', 'Edel Note', 'Edel Note', 'special', 5);

    // Liella!
    insertGroup.run('liella_main', 'superstar', 'Liella!', 'Liella! 全员', 'main', 1);
    insertGroup.run('catchu', 'superstar', 'CatChu!', 'CatChu!', 'subunit', 2);
    insertGroup.run('kaleidoscore', 'superstar', 'KALEIDOSCORE', 'KALEIDOSCORE', 'subunit', 3);
    insertGroup.run('5yncri5e', 'superstar', '5yncri5e!', '5yncri5e!', 'subunit', 4);

    // Aqours
    insertGroup.run('aqours_main', 'sunshine', 'Aqours', 'Aqours 全员', 'main', 1);
    insertGroup.run('cyaron', 'sunshine', 'CYaRon!', 'CYaRon!', 'subunit', 2);
    insertGroup.run('azalea', 'sunshine', 'AZALEA', 'AZALEA', 'subunit', 3);
    insertGroup.run('guilty_kiss', 'sunshine', 'Guilty Kiss', 'Guilty Kiss', 'subunit', 4);

    // μ's
    insertGroup.run('muse_main', 'muse', 'μ\'s', 'μ\'s 全员', 'main', 1);
    insertGroup.run('printemps', 'muse', 'Printemps', 'Printemps', 'subunit', 2);
    insertGroup.run('lily_white', 'muse', 'lily white', 'lily white', 'subunit', 3);
    insertGroup.run('bibi', 'muse', 'BiBi', 'BiBi', 'subunit', 4);

    // いきづらい部
    insertGroup.run('ikizuraibu_main', 'ikizuraibu', 'いきづらい部！', 'いきづらい部', 'main', 1);

    // 3. 角色注入
    // 虹咲成员
    insertCharacter.run('mifune-shioriko', '三船 栞子', '三船栞子', '1期生', 'active', '#2dd4bf', 1);
    insertCharacter.run('uehara-ayumu', '上原 歩夢', '上原步梦', '1期生', 'active', '#ed7d95', 2);
    insertCharacter.run('nakasu-kasumi', '中須 かすみ', '中须霞', '1期生', 'active', '#e7d600', 3);
    insertCharacter.run('osaka-shizuku', '桜坂 しずく', '樱坂雫', '1期生', 'active', '#01b7ed', 4);
    insertCharacter.run('asaka-karin', '朝香 果林', '朝香果林', '1期生', 'active', '#485ec6', 5);
    insertCharacter.run('miyashita-ai', '宮下 愛', '宫下爱', '1期生', 'active', '#ff5800', 6);
    insertCharacter.run('omi-kanata', '近江 彼方', '近江彼方', '1期生', 'active', '#a664a0', 7);
    insertCharacter.run('yuki-setsuna', '優木 せつ菜', '优木雪菜', '1期生', 'active', '#d81c2f', 8);
    insertCharacter.run('emma-verde', 'エマ・ヴェルデ', '艾玛·维尔德', '1期生', 'active', '#84c36e', 9);
    insertCharacter.run('tennoji-rina', '天王寺 璃奈', '天王寺璃奈', '1期生', 'active', '#9ca5b9', 10);
    insertCharacter.run('mia-taylor', 'ミア・テイラー', '米雅·泰勒', '2期生', 'active', '#a8947f', 11);
    insertCharacter.run('zhong-lanzhu', '鐘 嵐珠', '钟岚珠', '2期生', 'active', '#f8c8c4', 12);
    insertCharacter.run('takasaki-yu', '高咲 侑', '高咲侑', '1期生', 'active', '#141414', 13);

    // 虹咲归属
    insertCharacterGroup.run('mifune-shioriko', 'nijigasaki_main', '全时期', 'active', '成员');
    insertCharacterGroup.run('mifune-shioriko', 'r3birth', '全时期', 'active', '成员');
    insertCharacterGroup.run('uehara-ayumu', 'nijigasaki_main', '全时期', 'active', '成员');
    insertCharacterGroup.run('uehara-ayumu', 'azuna', '全时期', 'active', '成员');
    insertCharacterGroup.run('nakasu-kasumi', 'nijigasaki_main', '全时期', 'active', '成员');
    insertCharacterGroup.run('nakasu-kasumi', 'qu4rtz', '全时期', 'active', '成员');
    insertCharacterGroup.run('osaka-shizuku', 'nijigasaki_main', '全时期', 'active', '成员');
    insertCharacterGroup.run('asaka-karin', 'nijigasaki_main', '全时期', 'active', '成员');
    insertCharacterGroup.run('miyashita-ai', 'nijigasaki_main', '全时期', 'active', '成员');
    insertCharacterGroup.run('omi-kanata', 'nijigasaki_main', '全时期', 'active', '成员');
    insertCharacterGroup.run('yuki-setsuna', 'nijigasaki_main', '全时期', 'active', '成员');
    insertCharacterGroup.run('emma-verde', 'nijigasaki_main', '全时期', 'active', '成员');
    insertCharacterGroup.run('tennoji-rina', 'nijigasaki_main', '全时期', 'active', '成员');
    insertCharacterGroup.run('mia-taylor', 'nijigasaki_main', '全时期', 'active', '成员');
    insertCharacterGroup.run('zhong-lanzhu', 'nijigasaki_main', '全时期', 'active', '成员');
    insertCharacterGroup.run('takasaki-yu', 'nijigasaki_main', '全时期', 'active', '音乐担当');

    // 莲之空历代全部正式成员 (102期至106期)
    // 102期生 (已于2025年3月毕业)
    insertCharacter.run('kozue-otomune', '乙宗 梢', '乙宗梢', '102期', 'graduated', '#68BE8D', 20);
    insertCharacter.run('tsuzuri-yugiri', '夕霧 綴理', '夕雾缀理', '102期', 'graduated', '#BA2636', 21);
    insertCharacter.run('megumi-fujishima', '藤島 慈', '藤岛慈', '102期', 'graduated', '#C5C56A', 22);

    // 103期生 (已于2026年3月毕业)
    insertCharacter.run('kaho-hinoshita', '日野下 花帆', '日野下花帆', '103期', 'graduated', '#F8B500', 23);
    insertCharacter.run('sayaka-murano', '村野 さやか', '村野沙耶香', '103期', 'graduated', '#5383C3', 24);
    insertCharacter.run('rurino-osawa', '大沢 瑠璃乃', '大泽瑠璃乃', '103期', 'graduated', '#E7609E', 25);

    // 104期生 (当前最高在籍年级)
    insertCharacter.run('ginko-momose', '百生 吟子', '百生吟子', '104期', 'active', '#A2D7DD', 26);
    insertCharacter.run('kosuzu-tachimachi', '徒町 小鈴', '徒町小铃', '104期', 'active', '#FAD689', 27);
    insertCharacter.run('anyoji-hime', '安養寺 姫芽', '安养寺姬芽', '104期', 'active', '#9B90C2', 28);

    // 105期生
    insertCharacter.run('seras-yanagida-lilienfeld', 'セラス 柳田 リリエンフェルト', '塞拉斯·柳田·莉莉恩费尔德', '105期', 'active', '#D0104C', 29);
    insertCharacter.run('izumi-katsuragi', '桂城 泉', '桂城泉', '105期', 'active', '#227D51', 30);

    // 106期生 (最新成员)
    insertCharacter.run('maika-kinjo', '錦上 マイカ', '锦上麦卡', '106期', 'active', '#E95295', 31);
    insertCharacter.run('aoi-reisawa', '令沢 葵', '令泽葵', '106期', 'active', '#2A6EBB', 32);
    insertCharacter.run('mion-shinowa', '紫輪 みおん', '紫轮美音', '106期', 'active', '#8B81C3', 33);

    // 莲之空归属绑定
    // 102期
    insertCharacterGroup.run('kozue-otomune', 'hasunosora_main', '102期~103期', 'historical', '第103期部长');
    insertCharacterGroup.run('kozue-otomune', 'cerise_bouquet', '102期~103期', 'historical', '成员');
    insertCharacterGroup.run('tsuzuri-yugiri', 'hasunosora_main', '102期~103期', 'historical', '成员');
    insertCharacterGroup.run('tsuzuri-yugiri', 'dollchestra', '102期~103期', 'historical', '成员');
    insertCharacterGroup.run('megumi-fujishima', 'hasunosora_main', '102期~103期', 'historical', '成员');
    insertCharacterGroup.run('megumi-fujishima', 'mira_cra_park', '102期~103期', 'historical', '成员');

    // 103期
    insertCharacterGroup.run('kaho-hinoshita', 'hasunosora_main', '103期~104期', 'historical', '第104期部长');
    insertCharacterGroup.run('kaho-hinoshita', 'cerise_bouquet', '103期~104期', 'historical', '成员');
    insertCharacterGroup.run('sayaka-murano', 'hasunosora_main', '103期~104期', 'historical', '成员');
    insertCharacterGroup.run('sayaka-murano', 'dollchestra', '103期~104期', 'historical', '成员');
    insertCharacterGroup.run('rurino-osawa', 'hasunosora_main', '103期~104期', 'historical', '成员');
    insertCharacterGroup.run('rurino-osawa', 'mira_cra_park', '103期~104期', 'historical', '成员');

    // 104期
    insertCharacterGroup.run('ginko-momose', 'hasunosora_main', '104期起', 'active', '成员');
    insertCharacterGroup.run('ginko-momose', 'cerise_bouquet', '104期起', 'active', '成员');
    insertCharacterGroup.run('kosuzu-tachimachi', 'hasunosora_main', '104期起', 'active', '成员');
    insertCharacterGroup.run('kosuzu-tachimachi', 'dollchestra', '104期起', 'active', '成员');
    insertCharacterGroup.run('anyoji-hime', 'hasunosora_main', '104期起', 'active', '成员');
    insertCharacterGroup.run('anyoji-hime', 'mira_cra_park', '104期起', 'active', '成员');

    // 105期
    insertCharacterGroup.run('seras-yanagida-lilienfeld', 'hasunosora_main', '105期起', 'active', '成员');
    insertCharacterGroup.run('seras-yanagida-lilienfeld', 'edel_note', '105期', 'historical', '初期组合');
    insertCharacterGroup.run('seras-yanagida-lilienfeld', 'dollchestra', '106期起', 'active', '移籍所属');
    insertCharacterGroup.run('izumi-katsuragi', 'hasunosora_main', '105期起', 'active', '成员');
    insertCharacterGroup.run('izumi-katsuragi', 'edel_note', '105期', 'historical', '初期组合');

    // 106期
    insertCharacterGroup.run('maika-kinjo', 'hasunosora_main', '106期起', 'active', '新入生');
    insertCharacterGroup.run('aoi-reisawa', 'hasunosora_main', '106期起', 'active', '新入生');
    insertCharacterGroup.run('mion-shinowa', 'hasunosora_main', '106期起', 'active', '新入生');

    // μ's 9人
    const museList = [
      ['kousaka-honoka', '高坂 穂乃果', '高坂穗乃果', '#E2732D'],
      ['sonoda-umi', '園田 海未', '园田海未', '#1660A5'],
      ['minami-kotori', '南 ことり', '南小鸟', '#9E9E9E'],
      ['koizumi-hanayo', '小泉 花陽', '小泉花阳', '#54B859'],
      ['hoshizora-rin', '星空 凛', '星空凛', '#F3B52C'],
      ['nishikino-maki', '西木野 真姫', '西木野真姬', '#DE2C37'],
      ['yazawa-nico', '矢澤 にこ', '矢泽妮可', '#D83879'],
      ['tojo-nozomi', '東條 希', '东条希', '#773C85'],
      ['ayase-eli', '絢瀬 絵里', '绚濑绘里', '#00A0E9']
    ];
    museList.forEach(([id, ja, zh, col], idx) => {
      insertCharacter.run(id, ja, zh, '全员', 'graduated', col, 40 + idx);
      insertCharacterGroup.run(id, 'muse_main', '全时期', 'active', '成员');
    });

    // Aqours 9人
    const aqoursList = [
      ['takami-chika', '高海 千歌', '高海千歌', '#F08300'],
      ['sakurauchi-riko', '桜内 梨子', '樱内梨子', '#F4A7B9'],
      ['matsuura-kanan', '松浦 果南', '松浦果南', '#00A381'],
      ['kurosawa-dia', '黒澤 ダイヤ', '黑泽黛雅', '#DE2C37'],
      ['watanabe-you', '渡辺 曜', '渡边曜', '#00A0E9'],
      ['tsushima-yoshiko', '津島 善子', '津岛善子', '#899197'],
      ['kunikida-hanamaru', '国木田 花丸', '国木田花丸', '#F5E56B'],
      ['ohara-mari', '小原 鞠莉', '小原鞠莉', '#8C4B92'],
      ['kurosawa-ruby', '黒澤 ルビィ', '黑泽露比', '#E95295']
    ];
    aqoursList.forEach(([id, ja, zh, col], idx) => {
      insertCharacter.run(id, ja, zh, '全员', 'active', col, 50 + idx);
      insertCharacterGroup.run(id, 'aqours_main', '全时期', 'active', '成员');
    });

    // Liella! 11人
    const liellaList = [
      ['shibuya-kanon', '澁谷 かのん', '涩谷香音', '#ff7f27'],
      ['tang-keke', '唐 可可', '唐可可', '#a0e4f1'],
      ['arashi-chisato', '嵐 千砂都', '岚千砂都', '#ff9494'],
      ['heanna-sumire', '平安名 すみれ', '平安名堇', '#74e76a'],
      ['hazuki-ren', '葉月 恋', '叶月恋', '#002573'],
      ['sakurakoji-kinako', '桜小路 きな子', '樱小路希奈子', '#fff57f'],
      ['yoneme-mei', '米女 メイ', '米女芽衣', '#c9171e'],
      ['wakana-shiki', '若菜 四季', '若菜四季', '#3cd5b9'],
      ['onitsuka-natsumi', '鬼塚 夏美', '鬼冢夏美', '#ff6b97'],
      ['wien-margarete', 'ウィーン・マルガレーテ', '维恩·玛格丽特', '#d59b2d'],
      ['onitsuka-tomari', '鬼塚 冬毬', '鬼冢冬毬', '#57c7d4']
    ];
    liellaList.forEach(([id, ja, zh, col], idx) => {
      insertCharacter.run(id, ja, zh, '全员', 'active', col, 60 + idx);
      insertCharacterGroup.run(id, 'liella_main', '全时期', 'active', '成员');
    });

    // いきづらい部！ (イキヅライブ！ LOVELIVE! BLUEBIRD - 全10人)
    const ikizuraibuList = [
      ['takahashi-polka', '高橋 ポルカ', '高桥波尔卡', '#FEE100'],
      ['azabu-mai', '麻布 麻衣', '麻布麻衣', '#0068B7'],
      ['goto-akira', '五桐 玲', '五桐玲', '#A8D8B9'],
      ['komagata-hanabi', '駒形 花火', '驹形花火', '#D7003A'],
      ['kanazawa-kiseki', '金澤 奇跡', '金泽奇迹', '#FFB6C1'],
      ['chofu-noriko', '調布 のりこ', '调布法子', '#8A2BE2'],
      ['harumiya-yukuri', '春宮 ゆくり', '春宫由栗', '#89C3EB'],
      ['konohana-kaguya', '此花 輝夜', '此花辉夜', '#E03C8A'],
      ['yamada-midori', '山田 真緑', '山田真绿', '#008000'],
      ['sasaki-shion', '佐々木 翔音', '佐佐木翔音', '#E6E6E6']
    ];
    ikizuraibuList.forEach(([id, ja, zh, col], idx) => {
      insertCharacter.run(id, ja, zh, '1期生', 'active', col, 70 + idx);
      insertCharacterGroup.run(id, 'ikizuraibu_main', '全时期', 'active', '成员');
    });

    // 4. 首批真实考据衣装录入 (三船栞子、上原步梦、安养寺姬芽 + 一套待识别样例)
    // 栞子《決意の光》
    const themeShioriko = 'theme-ketsui-no-hikari';
    db.prepare(`
      INSERT OR IGNORE INTO costume_themes (id, name_ja, name_zh, category, description)
      VALUES (?, ?, ?, ?, ?)
    `).run(themeShioriko, '決意の光', '决意之光', 'single_cd', '三船栞子 1st Solo 单曲舞台演出服，SIFAS 登场');

    const variantShioriko = 'variant-shioriko-ketsui-no-hikari';
    db.prepare(`
      INSERT OR IGNORE INTO costume_variants (id, theme_id, character_id, name_ja, name_zh, name_status, status, notes, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      variantShioriko,
      themeShioriko,
      'mifune-shioriko',
      '決意の光（三船栞子Ver.）',
      '决意之光 演出服',
      'identified',
      'verified',
      '和风折扇、黑色暗纹锦缎和服、金丝滚边与白色百褶裙组合，配戴白羽毛与和风花饰头饰。',
      new Date().toISOString(),
      new Date().toISOString()
    );

    db.prepare(`
      INSERT OR IGNORE INTO costume_images (id, variant_id, file_path, original_filename, is_primary, caption, sort_order)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      'img-shioriko-01',
      variantShioriko,
      '/uploads/shioriko_ketsui_no_hikari.jpg',
      'shioriko_ketsui_no_hikari.jpg',
      1,
      'SIFAS 觉醒后舞台主视觉',
      1
    );

    db.prepare(`
      INSERT OR IGNORE INTO costume_sources (id, variant_id, source_type, evolution_stage, title, url, detail)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      'src-shioriko-01',
      variantShioriko,
      'game_card',
      'awakened',
      'Love Live! 学园偶像祭 ALL STARS (SIFAS) UR【決意の光】覚醒後',
      'https://lovelive-as.bushimo.jp/',
      'SIFAS 虹咲第17章登场，三船栞子加入同好会后首套专属 Solo 演出服'
    );

    // 上原步梦《夢への一歩》
    const themeAyumu = 'theme-yume-e-no-ippo';
    db.prepare(`
      INSERT OR IGNORE INTO costume_themes (id, name_ja, name_zh, category, description)
      VALUES (?, ?, ?, ?, ?)
    `).run(themeAyumu, '夢への一歩', '迈向梦想的一步', 'single_cd', '上原步梦 1st Solo 单曲打歌服');

    const variantAyumu = 'variant-ayumu-yume-e-no-ippo';
    db.prepare(`
      INSERT OR IGNORE INTO costume_variants (id, theme_id, character_id, name_ja, name_zh, name_status, status, notes, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      variantAyumu,
      themeAyumu,
      'uehara-ayumu',
      '夢への一歩（上原歩夢Ver.）',
      '迈向梦想的一步 演出服',
      'identified',
      'verified',
      '粉白色相间洋装打歌服，配粉色蝴蝶结发饰与荷叶边裙摆。',
      new Date().toISOString(),
      new Date().toISOString()
    );

    db.prepare(`
      INSERT OR IGNORE INTO costume_sources (id, variant_id, source_type, evolution_stage, title, url, detail)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      'src-ayumu-01',
      variantAyumu,
      'game_card',
      'awakened',
      'SIFAS UR【夢への一歩】覚醒後',
      'https://www.lovelive-anime.jp/nijigasaki/',
      '动画第1季第1话插入曲及官方 1st 专辑收录曲衣装'
    );

    // 安养寺姬芽《Dream Believers》
    const themeHime = 'theme-dream-believers';
    db.prepare(`
      INSERT OR IGNORE INTO costume_themes (id, name_ja, name_zh, category, description)
      VALUES (?, ?, ?, ?, ?)
    `).run(themeHime, 'Dream Believers', 'Dream Believers', 'single_cd', '莲之空女学院学园偶像俱乐部出道主题曲演出服');

    const variantHime = 'variant-hime-dream-believers';
    db.prepare(`
      INSERT OR IGNORE INTO costume_variants (id, theme_id, character_id, name_ja, name_zh, name_status, status, notes, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      variantHime,
      themeHime,
      'anyoji-hime',
      'Dream Believers（安養寺姫芽Ver.）',
      'Dream Believers 姫芽版',
      'identified',
      'verified',
      '浅紫与黑色相间短裙打歌服，领口配糖果紫领结与游戏手柄挂件。',
      new Date().toISOString(),
      new Date().toISOString()
    );

    db.prepare(`
      INSERT OR IGNORE INTO costume_sources (id, variant_id, source_type, evolution_stage, title, url, detail)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      'src-hime-01',
      variantHime,
      'game_card',
      'awakened',
      'Link! Like! Love Live! 卡面【Dream Believers】覚醒後',
      'https://www.lovelive-anime.jp/hasunosora/',
      '104期加入后实装的 104期 Ver. Dream Believers 觉醒后卡面立绘'
    );

    // 待识别测试样例 (验证 AC-6)
    const themeUnidentified = 'theme-temp-mystery';
    db.prepare(`
      INSERT OR IGNORE INTO costume_themes (id, name_ja, name_zh, category, description)
      VALUES (?, ?, ?, ?, ?)
    `).run(themeUnidentified, '未命名主题', '待识别活动服', 'general', '待查明官方名称的服装');

    const variantUnidentified = 'variant-shioriko-unidentified-01';
    db.prepare(`
      INSERT OR IGNORE INTO costume_variants (id, theme_id, character_id, name_ja, name_zh, name_status, status, notes, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      variantUnidentified,
      themeUnidentified,
      'mifune-shioriko',
      null, // 尚未考据出官方日文名，严禁杜撰
      '漫展 COSPLAY 见到的某套三船栞子服装',
      'unidentified',
      'unverified',
      '在漫展上看到三船栞子的一套绿色制服款式，尚待考据官方出处。',
      new Date().toISOString(),
      new Date().toISOString()
    );
  });

  seedTx();
}
