import fs from 'fs';
import path from 'path';

const outputFile = path.resolve('data/master_costumes_index.json');

const masterIndex = {
  $schema: "http://json-schema.org/draft-07/schema#",
  version: "1.0.0",
  updated_at: new Date().toISOString(),
  title: "Love Live! Master Costume Index (衣装主知识图谱库)",
  description: "Authoritative Master Costume Index across all Love Live! projects (Nijigasaki 1st-8th Live, Hasunosora 102-106期, Aqours, μ's, Liella!, BLUEBIRD)",
  projects: {
    nijigasaki: {
      id: "nijigasaki",
      name_ja: "虹ヶ咲学園スクールアイドル同好会",
      name_zh: "虹咲学园学园偶像同好会",
      subunits: ["azuna", "qu4rtz", "diverdiva", "r3birth"]
    },
    hasunosora: {
      id: "hasunosora",
      name_ja: "蓮ノ空女学院スクールアイドルクラブ",
      name_zh: "莲之空女学院学园偶像俱乐部",
      subunits: ["cerise_bouquet", "dollchestra", "mira_cra_park", "edel_note", "tasokare_no_rinko"]
    },
    sunshine: {
      id: "sunshine",
      name_ja: "ラブライブ！サンシャイン!! (Aqours)",
      name_zh: "Aqours",
      subunits: ["cyaron", "azalea", "guilty_kiss"]
    },
    muse: {
      id: "muse",
      name_ja: "ラブライブ！School idol project (μ's)",
      name_zh: "μ's",
      subunits: ["printemps", "lily_white", "bibi"]
    },
    superstar: {
      id: "superstar",
      name_ja: "ラブライブ！スーパースター!! (Liella!)",
      name_zh: "Liella!",
      subunits: ["catchu", "kaleidoscore", "5yncri5e"]
    },
    ikizuraibu: {
      id: "ikizuraibu",
      name_ja: "イキヅライブ！ LOVELIVE! BLUEBIRD (いきづらい部！)",
      name_zh: "いきづらい部",
      subunits: []
    }
  },
  costumes: [
    // =========================================================================
    // 1. 虹ヶ咲学園スクールアイドル同好会 (Nijigasaki High School Idol Club)
    // =========================================================================
    // --- 三船 栞子 (Mifune Shioriko) ---
    {
      costume_id: "costume-shioriko-ketsui-no-hikari",
      project_id: "nijigasaki",
      group_id: "nijigasaki_main",
      song_name_ja: "決意の光",
      song_name_zh: "决意之光",
      costume_name_ja: "決意の光（三船栞子Ver.）",
      costume_name_zh: "决意之光 演出服",
      category: "single_cd",
      era_or_live: "2nd Live / SIFAS 17章",
      characters: [
        {
          character_id: "mifune-shioriko",
          character_name_ja: "三船 栞子",
          character_name_zh: "三船栞子",
          variant_id: "variant-shioriko-ketsui-no-hikari",
          theme_id: "theme-ketsui-no-hikari",
          visual_design: "和风开襟振袖羽织、暗纹黑色和服锦缎、金丝滚边与雪白百褶裙，搭配白青渐变羽毛发饰与折扇配件。",
          official_2d_reference: {
            title: "Love Live! 学园偶像祭 ALL STARS (SIFAS) UR【決意の光】覚醒後",
            file_path: "/uploads/shioriko_ketsui_no_hikari.jpg",
            url: "https://lovelive-as.bushimo.jp/"
          },
          search_keywords: [
            "三船栞子 決意の光 cos 正面",
            "三船栞子 決意の光 コスプレ",
            "三船栞子 決意の光 模特 立拍"
          ]
        }
      ]
    },
    {
      costume_id: "costume-shioriko-aoi-canaria",
      project_id: "nijigasaki",
      group_id: "nijigasaki_main",
      song_name_ja: "翠いカナリア",
      song_name_zh: "翠鸟",
      costume_name_ja: "翠いカナリア（三船栞子Ver.）",
      costume_name_zh: "翠鸟 演出服",
      category: "album",
      era_or_live: "3rd Album / 4th Live",
      characters: [
        {
          character_id: "mifune-shioriko",
          character_name_ja: "三船 栞子",
          character_name_zh: "三船栞子",
          variant_id: "variant-shioriko-aoi-canaria",
          theme_id: "theme-shioriko-aoi-canaria",
          visual_design: "翠绿与夜黑撞色和洋折衷羽织礼服，鸟翼金纹刺绣腰封，配翡翠玉饰与羽毛发冠。",
          official_2d_reference: {
            title: "SIFAS UR【翠いカナリア】覚醒後",
            file_path: "/uploads/shioriko_aoi_canaria_2d.png",
            url: "https://idol.st/allstars/card/439/"
          },
          search_keywords: [
            "三船栞子 翠いカナリア cos",
            "三船栞子 翠いカナリア コスプレ 正面",
            "三船栞子 翠鸟 cos"
          ]
        }
      ]
    },
    {
      costume_id: "costume-shioriko-concerto-fantasy",
      project_id: "nijigasaki",
      group_id: "nijigasaki_main",
      song_name_ja: "Concerto Fantasy",
      song_name_zh: "奇幻协奏曲",
      costume_name_ja: "Concerto Fantasy（三船栞子Ver.）",
      costume_name_zh: "奇幻协奏曲 演出服",
      category: "album",
      era_or_live: "4th Album / 5th Live",
      characters: [
        {
          character_id: "mifune-shioriko",
          character_name_ja: "三船 栞子",
          character_name_zh: "三船栞子",
          variant_id: "variant-shioriko-concerto-fantasy",
          theme_id: "theme-shioriko-concerto-fantasy",
          visual_design: "宫廷幻想风翠黑长款礼服，古典和弦乐谱暗纹与金边琴弓刺绣，典雅高贵。",
          official_2d_reference: {
            title: "SIFAS UR【Concerto Fantasy】覚醒後",
            file_path: "/uploads/shioriko_concerto_fantasy_2d.png",
            url: "https://idol.st/allstars/card/645/"
          },
          search_keywords: [
            "三船栞子 Concerto Fantasy cos",
            "三船栞子 Concerto Fantasy コスプレ",
            "三船栞子 协奏曲 cos 正面"
          ]
        }
      ]
    },
    {
      costume_id: "costume-shioriko-emotion",
      project_id: "nijigasaki",
      group_id: "nijigasaki_main",
      song_name_ja: "EMOTION",
      song_name_zh: "EMOTION",
      costume_name_ja: "EMOTION（三船栞子Ver.）",
      costume_name_zh: "EMOTION 动画演出服",
      category: "anime_in",
      era_or_live: "动画2期第7话 / 5th Live",
      characters: [
        {
          character_id: "mifune-shioriko",
          character_name_ja: "三船 栞子",
          character_name_zh: "三船栞子",
          variant_id: "variant-shioriko-emotion",
          theme_id: "theme-shioriko-emotion",
          visual_design: "翡翠绿与象牙白双色小提琴燕尾洋装，胸前黑色缎带领结与百褶裙层叠结构，手持小提琴。",
          official_2d_reference: {
            title: "SIFAS UR【EMOTION】覚醒後",
            file_path: "/uploads/shioriko_emotion_2d.png",
            url: "https://idol.st/allstars/card/750/"
          },
          search_keywords: [
            "三船栞子 EMOTION cos 正面",
            "三船栞子 EMOTION コスプレ",
            "三船栞子 小提琴 打歌服 cos"
          ]
        }
      ]
    },
    {
      costume_id: "costume-r3birth-monster-girls",
      project_id: "nijigasaki",
      group_id: "r3birth",
      song_name_ja: "MONSTER GIRLS",
      song_name_zh: "MONSTER GIRLS",
      costume_name_ja: "MONSTER GIRLS（R3BIRTH）",
      costume_name_zh: "MONSTER GIRLS 演出服",
      category: "unit_single",
      era_or_live: "R3BIRTH 1st Single / 4th Live",
      characters: [
        {
          character_id: "mifune-shioriko",
          character_name_ja: "三船 栞子",
          character_name_zh: "三船栞子",
          variant_id: "variant-shioriko-monster-girls",
          theme_id: "theme-r3birth-monster-girls",
          visual_design: "黑绿撞色机车皮衣战袍，金链装饰与百褶皮裙，帅气暗黑酷飒风。",
          official_2d_reference: {
            title: "SIFAS UR【MONSTER GIRLS】三船 栞子 覚醒後",
            file_path: "/uploads/shioriko_monster_girls_2d.png",
            url: "https://idol.st/allstars/card/560/"
          },
          search_keywords: [
            "三船栞子 MONSTER GIRLS cos",
            "R3BIRTH MONSTER GIRLS コスプレ 正面",
            "三船栞子 皮衣 打歌服 cos"
          ]
        },
        {
          character_id: "mia-taylor",
          character_name_ja: "ミア・テイラー",
          character_name_zh: "米雅·泰勒",
          variant_id: "variant-mia-monster-girls",
          theme_id: "theme-r3birth-monster-girls",
          visual_design: "黑银撞色机车短夹克，铆钉皮裤与银色腰链，欧美潮流朋克风。",
          official_2d_reference: {
            title: "SIFAS UR【MONSTER GIRLS】ミア・テイラー 覚醒後",
            file_path: "/uploads/mia_monster_girls_2d.png",
            url: "https://idol.st/allstars/card/561/"
          },
          search_keywords: [
            "ミアテイラー MONSTER GIRLS cos",
            "米雅泰勒 MONSTER GIRLS コスプレ 正面",
            "Mia Taylor cos MONSTER GIRLS"
          ]
        },
        {
          character_id: "zhong-lanzhu",
          character_name_ja: "鐘 嵐珠",
          character_name_zh: "钟岚珠",
          variant_id: "variant-lanzhu-monster-girls",
          theme_id: "theme-r3birth-monster-girls",
          visual_design: "粉黑奢华紧身机车裙装，高开叉金链皮裙与过膝漆皮长靴，霸气女王姿态。",
          official_2d_reference: {
            title: "SIFAS UR【MONSTER GIRLS】鐘 嵐珠 覚醒後",
            file_path: "/uploads/lanzhu_monster_girls_2d.png",
            url: "https://idol.st/allstars/card/562/"
          },
          search_keywords: [
            "钟岚珠 MONSTER GIRLS cos 正面",
            "鐘嵐珠 MONSTER GIRLS コスプレ",
            "Zhong Lanzhu MONSTER GIRLS cos"
          ]
        }
      ]
    },
    {
      costume_id: "costume-nijigasaki-fly-with-you",
      project_id: "nijigasaki",
      group_id: "nijigasaki_main",
      song_name_ja: "Fly with You!!",
      song_name_zh: "Fly with You!!",
      costume_name_ja: "Fly with You!!（虹ヶ咲全员Ver.）",
      costume_name_zh: "Fly with You!! 演出服",
      category: "album",
      era_or_live: "5th Album / 6th Live",
      characters: [
        {
          character_id: "mifune-shioriko",
          character_name_ja: "三船 栞子",
          character_name_zh: "三船栞子",
          variant_id: "variant-shioriko-fly-with-you",
          theme_id: "theme-nijigasaki-fly-with-you",
          visual_design: "天蓝与纯白双色羽毛梦幻礼服，透明薄纱裙摆点缀金丝，双翼造型发饰。",
          official_2d_reference: {
            title: "SIFAS UR【Fly with You!!】三船 栞子 覚醒後",
            file_path: "/uploads/shioriko_fly_with_you_2d.png",
            url: "https://idol.st/allstars/card/880/"
          },
          search_keywords: [
            "三船栞子 Fly with You cos",
            "虹ヶ咲 Fly with You コスプレ 正面",
            "三船栞子 天使羽毛 cos"
          ]
        },
        {
          character_id: "uehara-ayumu",
          character_name_ja: "上原 歩夢",
          character_name_zh: "上原步梦",
          variant_id: "variant-ayumu-fly-with-you",
          theme_id: "theme-nijigasaki-fly-with-you",
          visual_design: "樱粉与羽白轻纱长裙，背部流线羽翼与粉白玫瑰花冠。",
          official_2d_reference: {
            title: "SIFAS UR【Fly with You!!】上原 歩夢 覚醒後",
            file_path: "/uploads/ayumu_fly_with_you_2d.png",
            url: "https://idol.st/allstars/card/875/"
          },
          search_keywords: [
            "上原歩夢 Fly with You cos 正面",
            "上原步梦 Fly with You コスプレ",
            "Ayumu Fly with You cos"
          ]
        }
      ]
    },

    // --- 上原 歩夢 (Uehara Ayumu) ---
    {
      costume_id: "costume-ayumu-yume-e-no-ippo",
      project_id: "nijigasaki",
      group_id: "nijigasaki_main",
      song_name_ja: "夢への一歩",
      song_name_zh: "迈向梦想的一步",
      costume_name_ja: "夢への一歩（上原歩夢Ver.）",
      costume_name_zh: "迈向梦想的一步 演出服",
      category: "single_cd",
      era_or_live: "1st Album / 1st Live",
      characters: [
        {
          character_id: "uehara-ayumu",
          character_name_ja: "上原 歩夢",
          character_name_zh: "上原步梦",
          variant_id: "variant-ayumu-yume-e-no-ippo",
          theme_id: "theme-yume-e-no-ippo",
          visual_design: "粉白格纹相间抹胸洋装打歌服，胸前粉红玫瑰花圈、腰间大蝴蝶结与荷叶边蓬蓬裙，配粉色长筒袜。",
          official_2d_reference: {
            title: "SIFAS UR【夢への一歩】覚醒後 3600x1800 官方超清原画母版",
            file_path: "/uploads/ayumu_yume_e_no_ippo_2d.png",
            url: "https://www.lovelive-anime.jp/nijigasaki/"
          },
          search_keywords: [
            "上原歩夢 夢への一歩 cos 正面",
            "上原步梦 梦的一步 コスプレ",
            "上原步梦 舞台打歌服 cos 正面全身"
          ]
        }
      ]
    },
    {
      costume_id: "costume-ayumu-kaika-sengen",
      project_id: "nijigasaki",
      group_id: "nijigasaki_main",
      song_name_ja: "開花宣言",
      song_name_zh: "开花宣言",
      costume_name_ja: "開花宣言（上原歩夢Ver.）",
      costume_name_zh: "开花宣言 演出服",
      category: "album",
      era_or_live: "2nd Album / 2nd Live",
      characters: [
        {
          character_id: "uehara-ayumu",
          character_name_ja: "上原 歩夢",
          character_name_zh: "上原步梦",
          variant_id: "variant-ayumu-kaika-sengen",
          theme_id: "theme-ayumu-kaika-sengen",
          visual_design: "浅樱粉与嫩芽绿相间花瓣洋装，多重粉色花朵层叠裙摆，花苞形袖套与玫瑰发夹。",
          official_2d_reference: {
            title: "SIFAS UR【開花宣言】覚醒後",
            file_path: "/uploads/ayumu_kaika_sengen_2d.png",
            url: "https://idol.st/allstars/card/278/"
          },
          search_keywords: [
            "上原歩夢 開花宣言 cos 正面",
            "上原步梦 开花宣言 コスプレ",
            "上原步梦 花瓣裙 cos"
          ]
        }
      ]
    },
    {
      costume_id: "costume-ayumu-break-the-system",
      project_id: "nijigasaki",
      group_id: "nijigasaki_main",
      song_name_ja: "Break The System",
      song_name_zh: "Break The System",
      costume_name_ja: "Break The System（上原歩夢Ver.）",
      costume_name_zh: "Break The System 剧场版/OVA演出服",
      category: "anime_in",
      era_or_live: "OVA NEXT SKY / 6th Live",
      characters: [
        {
          character_id: "uehara-ayumu",
          character_name_ja: "上原 歩夢",
          character_name_zh: "上原步梦",
          variant_id: "variant-ayumu-break-the-system",
          theme_id: "theme-ayumu-break-the-system",
          visual_design: "深粉与黑金机能风帅气战袍，不对称皮带绑带、半露肩皮夹克与过膝皮靴，突破甜美设定的硬核酷炫风。",
          official_2d_reference: {
            title: "OVA NEXT SKY 挿入歌【Break The System】官方立绘",
            file_path: "/uploads/ayumu_break_the_system_2d.png",
            url: "https://www.lovelive-anime.jp/nijigasaki/nextsky/"
          },
          search_keywords: [
            "上原歩夢 Break The System cos 正面",
            "上原步梦 Break The System コスプレ",
            "上原步梦 机能风 cos"
          ]
        }
      ]
    },
    {
      costume_id: "costume-ayumu-awakening-promise",
      project_id: "nijigasaki",
      group_id: "nijigasaki_main",
      song_name_ja: "Awakening Promise",
      song_name_zh: "觉醒之誓",
      costume_name_ja: "Awakening Promise（上原歩夢Ver.）",
      costume_name_zh: "Awakening Promise 动画演出服",
      category: "anime_in",
      era_or_live: "动画1期第12话 / 3rd Live",
      characters: [
        {
          character_id: "uehara-ayumu",
          character_name_ja: "上原 歩夢",
          character_name_zh: "上原步梦",
          variant_id: "variant-ayumu-awakening-promise",
          theme_id: "theme-ayumu-awakening-promise",
          visual_design: "纯白轻纱与柔粉缎面相间花嫁风短裙，胸前银色钥匙吊坠与后腰大拖尾薄纱蝴蝶结。",
          official_2d_reference: {
            title: "SIFAS UR【Awakening Promise】覚醒後",
            file_path: "/uploads/ayumu_awakening_promise_2d.png",
            url: "https://idol.st/allstars/card/410/"
          },
          search_keywords: [
            "上原歩夢 Awakening Promise cos 正面",
            "上原步梦 花嫁 打歌服 cos",
            "Ayumu Awakening Promise コスプレ"
          ]
        }
      ]
    },

    // --- 钟 岚珠 (Zhong Lanzhu) ---
    {
      costume_id: "costume-lanzhu-colorful-dreams",
      project_id: "nijigasaki",
      group_id: "nijigasaki_main",
      song_name_ja: "Colorful Dreams! Colorful Smiles!",
      song_name_zh: "多彩梦想！多彩笑容！",
      costume_name_ja: "Colorful Dreams! Colorful Smiles!（鐘 嵐珠Ver.）",
      costume_name_zh: "Colorful Dreams 钟岚珠版",
      category: "anime_op",
      era_or_live: "动画2期 OP / 5th Live",
      characters: [
        {
          character_id: "zhong-lanzhu",
          character_name_ja: "鐘 嵐珠",
          character_name_zh: "钟岚珠",
          variant_id: "variant-lanzhu-colorful-dreams",
          theme_id: "theme-lanzhu-colorful-dreams",
          visual_design: "白色毛绒披肩短洋装，裙摆饰有七彩琴键与音符暗纹、配毛绒耳罩与黑色短靴、毛球手套。",
          official_2d_reference: {
            title: "SIFAS SR【Colorful Dreams! Colorful Smiles!】覚醒後 3600x1800 母版",
            file_path: "/uploads/lanzhu_colorful_dreams_idolized_2d.png",
            url: "https://idol.st/allstars/card/736/"
          },
          search_keywords: [
            "钟岚珠 Colorful Dreams cos 正面",
            "鐘嵐珠 CDCS コスプレ 模特",
            "钟岚珠 琴键打歌服 cos 全身"
          ]
        }
      ]
    },
    {
      costume_id: "costume-lanzhu-queendom",
      project_id: "nijigasaki",
      group_id: "nijigasaki_main",
      song_name_ja: "Queendom",
      song_name_zh: "Queendom",
      costume_name_ja: "Queendom（鐘 嵐珠Ver.）",
      costume_name_zh: "Queendom 演出服",
      category: "album",
      era_or_live: "3rd Album / 4th Live",
      characters: [
        {
          character_id: "zhong-lanzhu",
          character_name_ja: "鐘 嵐珠",
          character_name_zh: "钟岚珠",
          variant_id: "variant-lanzhu-queendom",
          theme_id: "theme-lanzhu-queendom",
          visual_design: "华丽金色与深绯红中华风旗袍礼服，金丝孔雀刺绣与高开叉流苏，贵气十足。",
          official_2d_reference: {
            title: "SIFAS UR【Queendom】覚醒後",
            file_path: "/uploads/lanzhu_queendom_2d.png",
            url: "https://idol.st/allstars/card/438/"
          },
          search_keywords: [
            "钟岚珠 Queendom cos 正面",
            "鐘嵐珠 Queendom コスプレ",
            "钟岚珠 旗袍打歌服 cos"
          ]
        }
      ]
    },
    {
      costume_id: "costume-lanzhu-eutopia",
      project_id: "nijigasaki",
      group_id: "nijigasaki_main",
      song_name_ja: "Eutopia",
      song_name_zh: "Eutopia",
      costume_name_ja: "Eutopia（鐘 嵐珠Ver.）",
      costume_name_zh: "Eutopia 动画演出服",
      category: "anime_in",
      era_or_live: "动画2期第1话 / 5th Live",
      characters: [
        {
          character_id: "zhong-lanzhu",
          character_name_ja: "鐘 嵐珠",
          character_name_zh: "钟岚珠",
          variant_id: "variant-lanzhu-eutopia",
          theme_id: "theme-lanzhu-eutopia",
          visual_design: "纯白羽翼女皇礼服，高开叉长摆、金边镶钻胸甲与巨大雪白羽翼披风，震慑全场的登场战袍。",
          official_2d_reference: {
            title: "SIFAS UR【Eutopia】覚醒後",
            file_path: "/uploads/lanzhu_eutopia_2d.png",
            url: "https://idol.st/allstars/card/705/"
          },
          search_keywords: [
            "钟岚珠 Eutopia cos 正面",
            "鐘嵐珠 Eutopia コスプレ 模特",
            "钟岚珠 白羽毛 翅膀 cos"
          ]
        }
      ]
    },

    // --- 優木 せつ菜 (Yuki Setsuna) ---
    {
      costume_id: "costume-setsuna-chase",
      project_id: "nijigasaki",
      group_id: "nijigasaki_main",
      song_name_ja: "CHASE!",
      song_name_zh: "CHASE!",
      costume_name_ja: "CHASE!（優木 せつ菜Ver.）",
      costume_name_zh: "CHASE! 演出服",
      category: "single_cd",
      era_or_live: "1st Album / 动画1期第1话 / 1st Live",
      characters: [
        {
          character_id: "yuki-setsuna",
          character_name_ja: "優木 せつ菜",
          character_name_zh: "优木雪菜",
          variant_id: "var-cos-yuki-setsuna",
          theme_id: "theme-setsuna-chase",
          visual_design: "黑红相间哥特摇滚风燕尾制服，火红皮质短手套、不对称黑红百褶裙与金色马甲排扣。",
          official_2d_reference: {
            title: "SIFAS UR【CHASE!】覚醒後 3600x1800 官方原画",
            file_path: "/uploads/setsuna_chase_2d.png",
            url: "https://idol.st/allstars/card/10/"
          },
          search_keywords: [
            "優木せつ菜 CHASE cos 正面",
            "优木雪菜 CHASE! コスプレ 正面",
            "雪菜 CHASE 打歌服 cos 全身"
          ]
        }
      ]
    },
    {
      costume_id: "costume-setsuna-dive",
      project_id: "nijigasaki",
      group_id: "nijigasaki_main",
      song_name_ja: "DIVE!",
      song_name_zh: "DIVE!",
      costume_name_ja: "DIVE!（優木 せつ菜Ver.）",
      costume_name_zh: "DIVE! 动画演出服",
      category: "anime_in",
      era_or_live: "动画1期第3话 / 3rd Live",
      characters: [
        {
          character_id: "yuki-setsuna",
          character_name_ja: "優木 せつ菜",
          character_name_zh: "优木雪菜",
          variant_id: "variant-setsuna-dive",
          theme_id: "theme-setsuna-dive",
          visual_design: "烈焰红与亮黑交织闪耀战袍，胸前烈焰标志，双层黑红硬纱蓬蓬裙与不对称皮护臂。",
          official_2d_reference: {
            title: "SIFAS UR【DIVE!】覚醒後",
            file_path: "/uploads/setsuna_dive_2d.png",
            url: "https://idol.st/allstars/card/380/"
          },
          search_keywords: [
            "優木せつ菜 DIVE cos 正面",
            "优木雪菜 DIVE コスプレ",
            "雪菜 DIVE 打歌服 cos"
          ]
        }
      ]
    },

    // --- 天王寺 璃奈 (Tennoji Rina) ---
    {
      costume_id: "costume-rina-miracle-stay-tune",
      project_id: "nijigasaki",
      group_id: "nijigasaki_main",
      song_name_ja: "Miracle STAY TUNE!",
      song_name_zh: "Miracle STAY TUNE!",
      costume_name_ja: "Miracle STAY TUNE!（天王寺 璃奈Ver.）",
      costume_name_zh: "Miracle STAY TUNE! 演出服",
      category: "single_cd",
      era_or_live: "广播剧主题曲 / 5th Live",
      characters: [
        {
          character_id: "tennoji-rina",
          character_name_ja: "天王寺 璃奈",
          character_name_zh: "天王寺璃奈",
          variant_id: "var-cos-tennoji-rina",
          theme_id: "theme-rina-miracle-stay",
          visual_design: "猫耳电波赛博连帽衫，白粉渐变未来科技感百褶裙，手持互动数码璃奈板。",
          official_2d_reference: {
            title: "SIFAS UR【Miracle STAY TUNE!】覚醒後 3600x1800 母版",
            file_path: "/uploads/rina_miracle_stay_tune_2d.png",
            url: "https://idol.st/allstars/card/720/"
          },
          search_keywords: [
            "天王寺璃奈 Miracle STAY TUNE cos",
            "天王寺璃奈 コスプレ 正面 猫耳",
            "天王寺璃奈 璃奈板 cos 模特"
          ]
        }
      ]
    },
    {
      costume_id: "costume-rina-tsunagaru-connect",
      project_id: "nijigasaki",
      group_id: "nijigasaki_main",
      song_name_ja: "ツナガルコネクト",
      song_name_zh: "心连心Connect",
      costume_name_ja: "ツナガルコネクト（天王寺 璃奈Ver.）",
      costume_name_zh: "心连心Connect 动画演出服",
      category: "anime_in",
      era_or_live: "动画1期第6话 / 3rd Live",
      characters: [
        {
          character_id: "tennoji-rina",
          character_name_ja: "天王寺 璃奈",
          character_name_zh: "天王寺璃奈",
          variant_id: "variant-rina-tsunagaru-connect",
          theme_id: "theme-rina-tsunagaru-connect",
          visual_design: "粉紫渐变数码机能裙，发光机械猫耳耳机与透光波点短袜，配发光LED璃奈板面具。",
          official_2d_reference: {
            title: "SIFAS UR【ツナガルコネクト】覚醒後",
            file_path: "/uploads/rina_tsunagaru_connect_2d.png",
            url: "https://idol.st/allstars/card/395/"
          },
          search_keywords: [
            "天王寺璃奈 ツナガルコネクト cos 正面",
            "天王寺璃奈 动画打歌服 コスプレ",
            "璃奈板 正面全身 cos"
          ]
        }
      ]
    },

    // --- 中須 かすみ (Nakasu Kasumi) ---
    {
      costume_id: "costume-kasumi-mutekikyu-believer",
      project_id: "nijigasaki",
      group_id: "nijigasaki_main",
      song_name_ja: "無敵級*ビリーバー",
      song_name_zh: "无敌级*Believer",
      costume_name_ja: "無敵級*ビリーバー（中須 かすみVer.）",
      costume_name_zh: "无敌级*Believer 演出服",
      category: "single_cd",
      era_or_live: "1st Solo Single / 3rd Live",
      characters: [
        {
          character_id: "nakasu-kasumi",
          character_name_ja: "中須 かすみ",
          character_name_zh: "中须霞",
          variant_id: "variant-kasumi-mutekikyu-believer",
          theme_id: "theme-kasumi-mutekikyu-believer",
          visual_design: "明黄柠檬色闪亮舞台裙，白色小披肩配明黄蝴蝶结，星星皇冠发饰与双层百褶短裙。",
          official_2d_reference: {
            title: "SIFAS UR【無敵級*ビリーバー】覚醒後",
            file_path: "/uploads/kasumi_mutekikyu_2d.png",
            url: "https://idol.st/allstars/card/310/"
          },
          search_keywords: [
            "中須かすみ 無敵級ビリーバー cos 正面",
            "中须霞 无敌级believer コスプレ",
            "中须霞 黄色打歌服 cos"
          ]
        }
      ]
    },

    // --- 桜坂 しずく (Osaka Shizuku) ---
    {
      costume_id: "costume-shizuku-solitude-rain",
      project_id: "nijigasaki",
      group_id: "nijigasaki_main",
      song_name_ja: "Solitude Rain",
      song_name_zh: "孤独之雨",
      costume_name_ja: "Solitude Rain（桜坂 しずくVer.）",
      costume_name_zh: "Solitude Rain 动画演出服",
      category: "anime_in",
      era_or_live: "动画1期第8话 / 3rd Live",
      characters: [
        {
          character_id: "osaka-shizuku",
          character_name_ja: "桜坂 しずく",
          character_name_zh: "樱坂雫",
          variant_id: "variant-shizuku-solitude-rain",
          theme_id: "theme-shizuku-solitude-rain",
          visual_design: "湖蓝与水白渐变露肩舞台洋装，水晶雨滴腰链，透明雨伞与水滴耳坠。",
          official_2d_reference: {
            title: "SIFAS UR【Solitude Rain】覚醒後",
            file_path: "/uploads/shizuku_solitude_rain_2d.png",
            url: "https://idol.st/allstars/card/401/"
          },
          search_keywords: [
            "桜坂しずく Solitude Rain cos 正面",
            "樱坂雫 孤独之雨 コスプレ",
            "樱坂雫 蓝白打歌服 cos"
          ]
        }
      ]
    },

    // --- 朝香 果林 (Asaka Karin) ---
    {
      costume_id: "costume-karin-vivid-world",
      project_id: "nijigasaki",
      group_id: "nijigasaki_main",
      song_name_ja: "VIVID WORLD",
      song_name_zh: "VIVID WORLD",
      costume_name_ja: "VIVID WORLD（朝香 果林Ver.）",
      costume_name_zh: "VIVID WORLD 动画演出服",
      category: "anime_in",
      era_or_live: "动画1期第9话 / 3rd Live",
      characters: [
        {
          character_id: "asaka-karin",
          character_name_ja: "朝香 果林",
          character_name_zh: "朝香果林",
          variant_id: "variant-karin-vivid-world",
          theme_id: "theme-karin-vivid-world",
          visual_design: "深海蓝与霓虹紫科技紧身裙，露腰露背设计，不对称未来光感手套与过膝高跟长靴。",
          official_2d_reference: {
            title: "SIFAS UR【VIVID WORLD】覚醒後",
            file_path: "/uploads/karin_vivid_world_2d.png",
            url: "https://idol.st/allstars/card/405/"
          },
          search_keywords: [
            "朝香果林 VIVID WORLD cos 正面",
            "朝香果林 紧身打歌服 コスプレ",
            "Karin VIVID WORLD cos 模特"
          ]
        }
      ]
    },

    // --- 宮下 愛 (Miyashita Ai) ---
    {
      costume_id: "costume-ai-saikou-heart",
      project_id: "nijigasaki",
      group_id: "nijigasaki_main",
      song_name_ja: "サイコーハート",
      song_name_zh: "至高之心",
      costume_name_ja: "サイコーハート（宮下 愛Ver.）",
      costume_name_zh: "至高之心 动画演出服",
      category: "anime_in",
      era_or_live: "动画1期第4话 / 3rd Live",
      characters: [
        {
          character_id: "miyashita-ai",
          character_name_ja: "宮下 愛",
          character_name_zh: "宫下爱",
          variant_id: "variant-ai-saikou-heart",
          theme_id: "theme-ai-saikou-heart",
          visual_design: "艳阳橙与柠檬黄拉拉队夹克，运动抹胸与蓝黄百褶短裙，配橙色运动护腕与双马尾爱心发圈。",
          official_2d_reference: {
            title: "SIFAS UR【サイコーハート】覚醒後",
            file_path: "/uploads/ai_saikou_heart_2d.png",
            url: "https://idol.st/allstars/card/385/"
          },
          search_keywords: [
            "宮下愛 サイコーハート cos 正面",
            "宫下爱 动画打歌服 コスプレ",
            "宫下爱 橙色运动服 cos"
          ]
        }
      ]
    },

    // --- 近江 彼方 (Omi Kanata) ---
    {
      costume_id: "costume-kanata-butterfly",
      project_id: "nijigasaki",
      group_id: "nijigasaki_main",
      song_name_ja: "Butterfly",
      song_name_zh: "Butterfly",
      costume_name_ja: "Butterfly（近江 彼方Ver.）",
      costume_name_zh: "Butterfly 动画演出服",
      category: "anime_in",
      era_or_live: "动画1期第7话 / 3rd Live",
      characters: [
        {
          character_id: "omi-kanata",
          character_name_ja: "近江 彼方",
          character_name_zh: "近江彼方",
          variant_id: "variant-kanata-butterfly",
          theme_id: "theme-kanata-butterfly",
          visual_design: "梦幻薰衣草紫蝶翼仙子礼服，多层透明紫纱层叠，背部精致蝶翼与紫藤花发饰。",
          official_2d_reference: {
            title: "SIFAS UR【Butterfly】覚醒後",
            file_path: "/uploads/kanata_butterfly_2d.png",
            url: "https://idol.st/allstars/card/398/"
          },
          search_keywords: [
            "近江彼方 Butterfly cos 正面",
            "近江彼方 蝴蝶打歌服 コスプレ",
            "近江彼方 紫色仙女裙 cos"
          ]
        }
      ]
    },

    // --- エマ・ヴェルデ (Emma Verde) ---
    {
      costume_id: "costume-emma-la-bella-patria",
      project_id: "nijigasaki",
      group_id: "nijigasaki_main",
      song_name_ja: "La Bella Patria",
      song_name_zh: "美丽故乡",
      costume_name_ja: "La Bella Patria（エマ・ヴェルデVer.）",
      costume_name_zh: "美丽故乡 动画演出服",
      category: "anime_in",
      era_or_live: "动画1期第5话 / 3rd Live",
      characters: [
        {
          character_id: "emma-verde",
          character_name_ja: "エマ・ヴェルデ",
          character_name_zh: "艾玛·维尔德",
          variant_id: "variant-emma-la-bella-patria",
          theme_id: "theme-emma-la-bella-patria",
          visual_design: "森林绿与阳光黄意大利田园民俗风洋装，胸前红色丝绳系带马甲，草编花帽与围裙荷叶边。",
          official_2d_reference: {
            title: "SIFAS UR【La Bella Patria】覚醒後",
            file_path: "/uploads/emma_la_bella_patria_2d.png",
            url: "https://idol.st/allstars/card/390/"
          },
          search_keywords: [
            "エマ・ヴェルデ La Bella Patria cos 正面",
            "艾玛维尔德 田园风 コスプレ",
            "Emma Verde cos 正面全身"
          ]
        }
      ]
    },

    // =========================================================================
    // 2. 蓮ノ空女学院スクールアイドルクラブ (Hasunosora Girls' High School)
    // 102期 ~ 106期 历代所有小分队与核心打歌服
    // =========================================================================
    // --- スリーズブーケ (Cerise Bouquet) ---
    {
      costume_id: "costume-cerise-tsukiyomi-kurage",
      project_id: "hasunosora",
      group_id: "cerise_bouquet",
      song_name_ja: "月夜見海月",
      song_name_zh: "月夜水母",
      costume_name_ja: "ドレス《月夜見海月》（Cerise Bouquet）",
      costume_name_zh: "月夜见海月 演出服",
      category: "single_cd",
      era_or_live: "104期9月单曲",
      characters: [
        {
          character_id: "ginko-momose",
          character_name_ja: "百生 吟子",
          character_name_zh: "百生吟子",
          variant_id: "var-cos-ginko-momose",
          theme_id: "theme-tsukiyomi-kurage",
          visual_design: "水母透明触手质感褶皱裙摆，浅海蓝和风大袖与银光薄纱，水母触须腰饰与珍珠头饰。",
          official_2d_reference: {
            title: "Link! Like! Love Live! UR【月夜見海月】百生 吟子（特訓後）官方原画母版",
            file_path: "/uploads/ginko_tsukiyomi_kurage_2d.jpg",
            url: "https://gamerch.com/hasunosora/873011"
          },
          search_keywords: [
            "百生吟子 月夜見海月 cos 正面",
            "百生吟子 月夜见水母 コスプレ",
            "百生吟子 水母服 cos 模特"
          ]
        },
        {
          character_id: "kaho-hinoshita",
          character_name_ja: "日野下 花帆",
          character_name_zh: "日野下花帆",
          variant_id: "variant-kaho-tsukiyomi-kurage",
          theme_id: "theme-tsukiyomi-kurage",
          visual_design: "暖粉与月白相间水母透明洋装，层叠海浪褶皱，水母触须半透披风。",
          official_2d_reference: {
            title: "Link! Like! Love Live! UR【月夜見海月】日野下 花帆（特訓後）",
            file_path: "/uploads/kaho_tsukiyomi_kurage_2d.jpg",
            url: "https://gamerch.com/hasunosora/873010"
          },
          search_keywords: [
            "日野下花帆 月夜見海月 cos 正面",
            "日野下花帆 コスプレ 水母服",
            "Kaho Hinoshita Tsukiyomi Kurage cos"
          ]
        }
      ]
    },
    {
      costume_id: "costume-cerise-holiday-holiday",
      project_id: "hasunosora",
      group_id: "cerise_bouquet",
      song_name_ja: "Holiday∞Holiday",
      song_name_zh: "Holiday∞Holiday",
      costume_name_ja: "Holiday∞Holiday（スリーズブーケVer.）",
      costume_name_zh: "Holiday∞Holiday 演出服",
      category: "unit_single",
      era_or_live: "103期 2nd Single",
      characters: [
        {
          character_id: "kaho-hinoshita",
          character_name_ja: "日野下 花帆",
          character_name_zh: "日野下花帆",
          variant_id: "variant-kaho-holiday-holiday",
          theme_id: "theme-cerise-holiday-holiday",
          visual_design: "浅杏暖粉假日千鸟格洋装，米白双层蕾丝花边短裙，配遮阳小草帽与双马尾粉丝带。",
          official_2d_reference: {
            title: "Link! Like! Love Live! UR【Holiday∞Holiday】日野下 花帆（特訓後）",
            file_path: "/uploads/kaho_holiday_holiday_2d.png",
            url: "https://gamerch.com/hasunosora/745120"
          },
          search_keywords: [
            "日野下花帆 Holiday Holiday cos 正面",
            "日野下花帆 千鸟格 コスプレ",
            "スリーズブーケ Holiday Holiday cos"
          ]
        },
        {
          character_id: "kozue-otomune",
          character_name_ja: "乙宗 梢",
          character_name_zh: "乙宗梢",
          variant_id: "variant-kozue-holiday-holiday",
          theme_id: "theme-cerise-holiday-holiday",
          visual_design: "薄荷绿与象牙白典雅千鸟格长裙，端庄披风与蕾丝手套，金丝框眼镜与山茶花胸针。",
          official_2d_reference: {
            title: "Link! Like! Love Live! UR【Holiday∞Holiday】乙宗 梢（特訓後）",
            file_path: "/uploads/kozue_holiday_holiday_2d.png",
            url: "https://gamerch.com/hasunosora/745121"
          },
          search_keywords: [
            "乙宗梢 Holiday Holiday cos 正面",
            "乙宗梢 コスプレ 绿千鸟格",
            "Kozue Otomune Holiday Holiday cos"
          ]
        }
      ]
    },
    {
      costume_id: "costume-cerise-suisai-sekai",
      project_id: "hasunosora",
      group_id: "cerise_bouquet",
      song_name_ja: "水彩世界",
      song_name_zh: "水彩世界",
      costume_name_ja: "水彩世界（スリーズブーケVer.）",
      costume_name_zh: "水彩世界 演出服",
      category: "unit_single",
      era_or_live: "103期 1st Single",
      characters: [
        {
          character_id: "kaho-hinoshita",
          character_name_ja: "日野下 花帆",
          character_name_zh: "日野下花帆",
          variant_id: "variant-kaho-suisai-sekai",
          theme_id: "theme-cerise-suisai-sekai",
          visual_design: "水彩柔粉轻透洋装，荷叶边层叠纱裙与调色板风格撞色丝带。",
          official_2d_reference: {
            title: "Link! Like! Love Live! UR【水彩世界】日野下 花帆（特訓後）",
            file_path: "/uploads/kaho_suisai_sekai_2d.png",
            url: "https://gamerch.com/hasunosora/738200"
          },
          search_keywords: [
            "日野下花帆 水彩世界 cos 正面",
            "スリーズブーケ 水彩世界 コスプレ",
            "日野下花帆 水彩粉裙 cos"
          ]
        },
        {
          character_id: "kozue-otomune",
          character_name_ja: "乙宗 梢",
          character_name_zh: "乙宗梢",
          variant_id: "variant-kozue-suisai-sekai",
          theme_id: "theme-cerise-suisai-sekai",
          visual_design: "翡翠绿水彩晕染典雅长裙，墨线金边勾勒，优雅贵族千金感。",
          official_2d_reference: {
            title: "Link! Like! Love Live! UR【水彩世界】乙宗 梢（特訓後）",
            file_path: "/uploads/kozue_suisai_sekai_2d.png",
            url: "https://gamerch.com/hasunosora/738201"
          },
          search_keywords: [
            "乙宗梢 水彩世界 cos 正面",
            "乙宗梢 水彩 コスプレ",
            "Kozue Suisai Sekai cos"
          ]
        }
      ]
    },

    // --- みらくらぱーく！ (Mira-Cra Park!) ---
    {
      costume_id: "costume-mira-key-of-like",
      project_id: "hasunosora",
      group_id: "mira_cra_park",
      song_name_ja: "Key of Like!",
      song_name_zh: "Key of Like!",
      costume_name_ja: "ドレス《Key of Like!》（みらくらぱーく！）",
      costume_name_zh: "Key of Like! 演出服",
      category: "single_cd",
      era_or_live: "103期 1st CD",
      characters: [
        {
          character_id: "rurino-osawa",
          character_name_ja: "大沢 瑠璃乃",
          character_name_zh: "大泽瑠璃乃",
          variant_id: "var-cos-rurino-osawa",
          theme_id: "theme-rurino-key-of-like",
          visual_design: "亮黄休闲连帽长袖外套、橙黄双层百褶短裙、粉黄条纹长筒袜与糖果钥匙吊坠，元气双马尾发圈。",
          official_2d_reference: {
            title: "Link! Like! Love Live! UR【Key of Like!】大沢 瑠璃乃（特訓後）官方原画母版",
            file_path: "/uploads/rurino_key_of_like_2d.jpg",
            url: "https://gamerch.com/hasunosora/769145"
          },
          search_keywords: [
            "大沢瑠璃乃 Key of Like cos 正面",
            "大泽瑠璃乃 Key of Like コスプレ",
            "大泽瑠璃乃 黄色卫衣打歌服 cos"
          ]
        },
        {
          character_id: "megumi-fujishima",
          character_name_ja: "藤島 慈",
          character_name_zh: "藤岛慈",
          variant_id: "variant-megumi-key-of-like",
          theme_id: "theme-rurino-key-of-like",
          visual_design: "浅粉与鲜橙撞色连帽露脐舞台服，多重数码糖果挂件与银粉过膝长靴。",
          official_2d_reference: {
            title: "Link! Like! Love Live! UR【Key of Like!】藤島 慈（特訓後）",
            file_path: "/uploads/megumi_key_of_like_2d.png",
            url: "https://gamerch.com/hasunosora/769146"
          },
          search_keywords: [
            "藤島慈 Key of Like cos 正面",
            "藤岛慈 Key of Like コスプレ",
            "Megumi Fujishima cos"
          ]
        }
      ]
    },
    {
      costume_id: "costume-mira-do-do-do",
      project_id: "hasunosora",
      group_id: "mira_cra_park",
      song_name_ja: "ド！ド！ド！",
      song_name_zh: "Do! Do! Do!",
      costume_name_ja: "ド！ド！ド！（みらくらぱーく！Ver.）",
      costume_name_zh: "Do! Do! Do! 演出服",
      category: "unit_single",
      era_or_live: "103期 1st Single",
      characters: [
        {
          character_id: "rurino-osawa",
          character_name_ja: "大沢 瑠璃乃",
          character_name_zh: "大泽瑠璃乃",
          variant_id: "variant-rurino-do-do-do",
          theme_id: "theme-mira-do-do-do",
          visual_design: "粉黑亮黄撞色运动短打，多重徽章与卡通涂鸦腰封。",
          official_2d_reference: {
            title: "Link! Like! Love Live! UR【ド！ド！ド！】大沢 瑠璃乃（特訓後）",
            file_path: "/uploads/rurino_do_do_do_2d.png",
            url: "https://gamerch.com/hasunosora/741300"
          },
          search_keywords: [
            "大沢瑠璃乃 ド！ド！ド！ cos 正面",
            "大泽瑠璃乃 dododo コスプレ",
            "瑠璃乃 运动短裙 cos"
          ]
        },
        {
          character_id: "megumi-fujishima",
          character_name_ja: "藤島 慈",
          character_name_zh: "藤岛慈",
          variant_id: "variant-megumi-do-do-do",
          theme_id: "theme-mira-do-do-do",
          visual_design: "橙粉撞色短马甲短裙，粉紫猫耳发圈与能量饮料瓶挂件。",
          official_2d_reference: {
            title: "Link! Like! Love Live! UR【ド！ド！ド！】藤島 慈（特訓後）",
            file_path: "/uploads/megumi_do_do_do_2d.png",
            url: "https://gamerch.com/hasunosora/741301"
          },
          search_keywords: [
            "藤島慈 ド！ド！ド！ cos 正面",
            "藤岛慈 dododo コスプレ",
            "藤岛慈 撞色短裙 cos"
          ]
        }
      ]
    },

    // --- DOLLCHESTRA ---
    {
      costume_id: "costume-doll-awoke",
      project_id: "hasunosora",
      group_id: "dollchestra",
      song_name_ja: "AWOKE",
      song_name_zh: "AWOKE",
      costume_name_ja: "AWOKE（DOLLCHESTRA Ver.）",
      costume_name_zh: "AWOKE 演出服",
      category: "unit_single",
      era_or_live: "103期 1st Single",
      characters: [
        {
          character_id: "tsuzuri-yugiri",
          character_name_ja: "夕霧 綴理",
          character_name_zh: "夕雾缀理",
          variant_id: "variant-tsuzuri-awoke",
          theme_id: "theme-doll-awoke",
          visual_design: "深红与纯黑帅气机械战甲短裙，单侧金属肩甲，流线型战术系带与高筒战靴。",
          official_2d_reference: {
            title: "Link! Like! Love Live! UR【AWOKE】夕霧 綴理（特訓後）",
            file_path: "/uploads/tsuzuri_awoke_2d.png",
            url: "https://gamerch.com/hasunosora/739100"
          },
          search_keywords: [
            "夕霧綴理 AWOKE cos 正面",
            "夕雾缀理 AWOKE コスプレ",
            "夕雾缀理 战甲打歌服 cos"
          ]
        },
        {
          character_id: "sayaka-murano",
          character_name_ja: "村野 さやか",
          character_name_zh: "村野沙耶香",
          variant_id: "variant-sayaka-awoke",
          theme_id: "theme-doll-awoke",
          visual_design: "深海蓝与冷银帅气制服，机械风金属扣带与花样滑冰式短裙剪裁。",
          official_2d_reference: {
            title: "Link! Like! Love Live! UR【AWOKE】村野 さやか（特訓後）",
            file_path: "/uploads/sayaka_awoke_2d.png",
            url: "https://gamerch.com/hasunosora/739101"
          },
          search_keywords: [
            "村野さやか AWOKE cos 正面",
            "村野沙耶香 AWOKE コスプレ",
            "Sayaka Murano Awoke cos"
          ]
        }
      ]
    },
    {
      costume_id: "costume-doll-kura-kura",
      project_id: "hasunosora",
      group_id: "dollchestra",
      song_name_ja: "Kura:kura",
      song_name_zh: "Kura:kura",
      costume_name_ja: "Kura:kura（DOLLCHESTRA Ver.）",
      costume_name_zh: "Kura:kura 演出服",
      category: "unit_single",
      era_or_live: "103期 2nd Single",
      characters: [
        {
          character_id: "tsuzuri-yugiri",
          character_name_ja: "夕霧 綴理",
          character_name_zh: "夕雾缀理",
          variant_id: "variant-tsuzuri-kura-kura",
          theme_id: "theme-doll-kura-kura",
          visual_design: "暗黑哥特风不对称燕尾风衣，深红玫瑰花结与黑色提花蕾丝面料。",
          official_2d_reference: {
            title: "Link! Like! Love Live! UR【Kura:kura】夕霧 綴理（特訓後）",
            file_path: "/uploads/tsuzuri_kura_kura_2d.png",
            url: "https://gamerch.com/hasunosora/747200"
          },
          search_keywords: [
            "夕霧綴理 Kurakura cos 正面",
            "夕雾缀理 哥特打歌服 コスプレ",
            "Tsuzuri Kura:kura cos"
          ]
        },
        {
          character_id: "sayaka-murano",
          character_name_ja: "村野 さやか",
          character_name_zh: "村野沙耶香",
          variant_id: "variant-sayaka-kura-kura",
          theme_id: "theme-doll-kura-kura",
          visual_design: "幽蓝暗夜蕾丝洋装，银丝锁链饰品与冰晶发簪。",
          official_2d_reference: {
            title: "Link! Like! Love Live! UR【Kura:kura】村野 さやか（特訓後）",
            file_path: "/uploads/sayaka_kura_kura_2d.png",
            url: "https://gamerch.com/hasunosora/747201"
          },
          search_keywords: [
            "村野さやか Kurakura cos 正面",
            "村野沙耶香 暗黑哥特 コスプレ",
            "Sayaka Kurakura cos"
          ]
        }
      ]
    },

    // --- 莲之空全体曲 ---
    {
      costume_id: "costume-hasunosora-dream-believers",
      project_id: "hasunosora",
      group_id: "hasunosora_main",
      song_name_ja: "Dream Believers",
      song_name_zh: "Dream Believers",
      costume_name_ja: "Dream Believers（蓮ノ空全员Ver.）",
      costume_name_zh: "Dream Believers 出道演出服",
      category: "single_cd",
      era_or_live: "莲之空出道曲 / 103~106期传承",
      characters: [
        {
          character_id: "anyoji-hime",
          character_name_ja: "安養寺 姫芽",
          character_name_zh: "安养寺姬芽",
          variant_id: "variant-hime-dream-believers",
          theme_id: "theme-dream-believers",
          visual_design: "浅紫与黑色相间短裙打歌服，领口配糖果紫领结与游戏手柄挂件，活力不对称过膝袜。",
          official_2d_reference: {
            title: "Link! Like! Love Live! 卡面【Dream Believers】覚醒後 官方原画",
            file_path: "/uploads/hime_dream_believers_2d.png",
            url: "https://www.lovelive-anime.jp/hasunosora/"
          },
          search_keywords: [
            "安養寺姫芽 Dream Believers cos 正面",
            "安养寺姬芽 觉醒打歌服 コスプレ",
            "安养寺姬芽 紫色短裙 cos 模特"
          ]
        },
        {
          character_id: "kosuzu-tachimachi",
          character_name_ja: "徒町 小鈴",
          character_name_zh: "徒町小铃",
          variant_id: "variant-kosuzu-dream-believers",
          theme_id: "theme-dream-believers",
          visual_design: "浅麦黄与象牙白双层百褶裙，领口系黄白领结与稻穗胸针，元气单马尾。",
          official_2d_reference: {
            title: "Link! Like! Love Live! 104期 UR【Dream Believers】徒町 小鈴（特訓後）",
            file_path: "/uploads/kosuzu_dream_believers_2d.png",
            url: "https://gamerch.com/hasunosora/845100"
          },
          search_keywords: [
            "徒町小鈴 Dream Believers cos 正面",
            "徒町小铃 コスプレ 演出服",
            "Kosuzu Tachimachi Dream Believers cos"
          ]
        },
        {
          character_id: "ginko-momose",
          character_name_ja: "百生 吟子",
          character_name_zh: "百生吟子",
          variant_id: "variant-ginko-dream-believers",
          theme_id: "theme-dream-believers",
          visual_design: "浅海绿与月白双层百褶裙，清雅端庄的和风领扣与青绿领结。",
          official_2d_reference: {
            title: "Link! Like! Love Live! 104期 UR【Dream Believers】百生 吟子（特訓後）",
            file_path: "/uploads/ginko_dream_believers_2d.png",
            url: "https://gamerch.com/hasunosora/845101"
          },
          search_keywords: [
            "百生吟子 Dream Believers cos 正面",
            "百生吟子 104期制服打歌服 コスプレ",
            "Ginko Momose Dream Believers cos"
          ]
        }
      ]
    },

    // --- 105期 / 106期 新成员及小分队 (Edel Note & 誰ソ彼ノ燐光) ---
    {
      costume_id: "costume-edel-note-1st",
      project_id: "hasunosora",
      group_id: "edel_note",
      song_name_ja: "Edel Note ユニットステージ衣装",
      song_name_zh: "Edel Note 组合专属打歌服",
      costume_name_ja: "Edel Note ユニットステージ衣装",
      costume_name_zh: "Edel Note 组合打歌服",
      category: "unit_single",
      era_or_live: "105期 小分队",
      characters: [
        {
          character_id: "seras-yanagida-lilienfeld",
          character_name_ja: "セラス 柳田 リリエンフェルト",
          character_name_zh: "塞拉斯·柳田·莉莉恩费尔德",
          variant_id: "variant-seras-edel-note",
          theme_id: "theme-edel-note-1st",
          visual_design: "绯红与黑曜石交织德奥贵族军礼服，金丝流苏肩章与金排扣，高贵典雅。",
          official_2d_reference: {
            title: "Link! Like! Love Live! 105期 UR【Edel Note】セラス（特訓後）",
            file_path: "/uploads/seras_edel_note_2d.png",
            url: "https://gamerch.com/hasunosora/105_seras"
          },
          search_keywords: [
            "セラス 柳田 リリエンフェルト cos 正面",
            "塞拉斯 柳田 莉莉恩费尔德 コスプレ",
            "Edel Note セラス cos"
          ]
        },
        {
          character_id: "izumi-katsuragi",
          character_name_ja: "桂城 泉",
          character_name_zh: "桂城泉",
          variant_id: "variant-izumi-edel-note",
          theme_id: "theme-edel-note-1st",
          visual_design: "常磐绿与纯白双色古典洋装，黑丝绒腰带与精美西洋剑配饰。",
          official_2d_reference: {
            title: "Link! Like! Love Live! 105期 UR【Edel Note】桂城 泉（特訓後）",
            file_path: "/uploads/izumi_edel_note_2d.png",
            url: "https://gamerch.com/hasunosora/105_izumi"
          },
          search_keywords: [
            "桂城泉 cos 正面",
            "桂城泉 コスプレ 打歌服",
            "Izumi Katsuragi Edel Note cos"
          ]
        }
      ]
    },
    {
      costume_id: "costume-tasokare-rinko-1st",
      project_id: "hasunosora",
      group_id: "tasokare_no_rinko",
      song_name_ja: "誰ソ彼ノ燐光 1st ステージ衣装",
      song_name_zh: "誰ソ彼ノ燐光 组合专属打歌服",
      costume_name_ja: "誰ソ彼ノ燐光 1st ステージ衣装",
      costume_name_zh: "誰ソ彼ノ燐光 演出服",
      category: "unit_single",
      era_or_live: "106期 新小分队",
      characters: [
        {
          character_id: "izumi-katsuragi",
          character_name_ja: "桂城 泉",
          character_name_zh: "桂城泉",
          variant_id: "variant-izumi-tasokare",
          theme_id: "theme-tasokare-rinko-1st",
          visual_design: "暮光深紫与磷火幽蓝渐变和洋礼服，夜光暗纹与灵动流苏。",
          official_2d_reference: {
            title: "Link! Like! Love Live! 106期 UR【誰ソ彼ノ燐光】桂城 泉（特訓後）",
            file_path: "/uploads/izumi_tasokare_2d.png",
            url: "https://gamerch.com/hasunosora/106_rinko"
          },
          search_keywords: [
            "桂城泉 誰ソ彼ノ燐光 cos 正面",
            "誰ソ彼ノ燐光 コスプレ",
            "桂城泉 暮光礼服 cos"
          ]
        }
      ]
    },
    {
      costume_id: "costume-hasunosora-106th-blooming",
      project_id: "hasunosora",
      group_id: "hasunosora_main",
      song_name_ja: "106期 蓮ノ空ステージ衣装",
      song_name_zh: "106期 莲之空全员舞台服",
      costume_name_ja: "106期 蓮ノ空ステージ衣装",
      costume_name_zh: "106期 莲之空全员打歌服",
      category: "single_cd",
      era_or_live: "106期 最新世代",
      characters: [
        {
          character_id: "maika-kinjo",
          character_name_ja: "錦上 マイカ",
          character_name_zh: "锦上舞香",
          variant_id: "variant-maika-106th",
          theme_id: "theme-hasunosora-106th-blooming",
          visual_design: "石竹玫粉与纯白拼接礼服，花瓣层叠轻纱与珍珠发卡。",
          official_2d_reference: {
            title: "Link! Like! Love Live! 106期 UR 錦上 マイカ（特訓後）",
            file_path: "/uploads/maika_106th_2d.png",
            url: "https://gamerch.com/hasunosora/106_maika"
          },
          search_keywords: [
            "錦上マイカ cos 正面",
            "锦上舞香 コスプレ",
            "Maika Kinjo cos"
          ]
        },
        {
          character_id: "aoi-reisawa",
          character_name_ja: "令沢 葵",
          character_name_zh: "令泽葵",
          variant_id: "variant-aoi-106th",
          theme_id: "theme-hasunosora-106th-blooming",
          visual_design: "深海群青与冰蓝拼接燕尾制服短裙，帅气银扣与流星耳饰。",
          official_2d_reference: {
            title: "Link! Like! Love Live! 106期 UR 令沢 葵（特訓後）",
            file_path: "/uploads/aoi_106th_2d.png",
            url: "https://gamerch.com/hasunosora/106_aoi"
          },
          search_keywords: [
            "令沢葵 cos 正面",
            "令泽葵 コスプレ",
            "Aoi Reisawa cos"
          ]
        },
        {
          character_id: "mion-shinowa",
          character_name_ja: "紫輪 みおん",
          character_name_zh: "紫轮美音",
          variant_id: "variant-mion-106th",
          theme_id: "theme-hasunosora-106th-blooming",
          visual_design: "浅紫藤色与月华白优雅洋装，星辰刺绣与银月发簪。",
          official_2d_reference: {
            title: "Link! Like! Love Live! 106期 UR 紫輪 みおん（特訓後）",
            file_path: "/uploads/mion_106th_2d.png",
            url: "https://gamerch.com/hasunosora/106_mion"
          },
          search_keywords: [
            "紫輪みおん cos 正面",
            "紫轮美音 コスプレ",
            "Mion Shinowa cos"
          ]
        }
      ]
    },

    // =========================================================================
    // 3. ラブライブ！サンシャイン!! (Aqours)
    // =========================================================================
    {
      costume_id: "costume-aozora-jumping-heart",
      project_id: "sunshine",
      group_id: "aqours_main",
      song_name_ja: "青空Jumping Heart",
      song_name_zh: "青空Jumping Heart",
      costume_name_ja: "青空Jumping Heart（Aqours全员Ver.）",
      costume_name_zh: "青空Jumping Heart 演出服",
      category: "anime_op",
      era_or_live: "动画1期 OP / 1st Live",
      characters: [
        {
          character_id: "takami-chika",
          character_name_ja: "高海 千歌",
          character_name_zh: "高海千歌",
          variant_id: "variant-chika-aozora-jumping-heart",
          theme_id: "theme-chika-aozora-jumping-heart",
          visual_design: "海蓝色双排扣小外套、百褶裙拼黄白波浪滚边、水手礼帽与亮黄领结、白色长筒袜。",
          official_2d_reference: {
            title: "SIFAS SR【青空Jumping Heart】覚醒後 3600x1800 母版",
            file_path: "/uploads/chika_aozora_2d.png",
            url: "https://idol.st/allstars/card/150/"
          },
          search_keywords: [
            "高海千歌 青空Jumping Heart cos 正面",
            "高海千歌 青空Jumping Heart 模特 立拍",
            "Aqours 青空Jumping Heart 打歌服 正面全身"
          ]
        },
        {
          character_id: "watanabe-you",
          character_name_ja: "渡辺 曜",
          character_name_zh: "渡边曜",
          variant_id: "variant-you-aozora-jumping-heart",
          theme_id: "theme-chika-aozora-jumping-heart",
          visual_design: "水手海军风双排扣小马甲、天蓝波浪滚边百褶裙、水手船长帽与敬礼手势。",
          official_2d_reference: {
            title: "SIFAS SR【青空Jumping Heart】渡辺 曜 覚醒後",
            file_path: "/uploads/you_aozora_2d.png",
            url: "https://idol.st/allstars/card/154/"
          },
          search_keywords: [
            "渡辺曜 青空Jumping Heart cos 正面",
            "渡边曜 青空打歌服 コスプレ",
            "You Watanabe Aozora cos"
          ]
        },
        {
          character_id: "sakurauchi-riko",
          character_name_ja: "桜内 梨子",
          character_name_zh: "樱内梨子",
          variant_id: "variant-riko-aozora-jumping-heart",
          theme_id: "theme-chika-aozora-jumping-heart",
          visual_design: "浅粉与海蓝双排扣水手洋装、粉红波浪百褶裙与侧分粉色发夹。",
          official_2d_reference: {
            title: "SIFAS SR【青空Jumping Heart】桜内 梨子 覚醒後",
            file_path: "/uploads/riko_aozora_2d.png",
            url: "https://idol.st/allstars/card/151/"
          },
          search_keywords: [
            "桜内梨子 青空Jumping Heart cos 正面",
            "樱内梨子 青空打歌服 コスプレ",
            "Riko Sakurauchi Aozora cos"
          ]
        }
      ]
    },
    {
      costume_id: "costume-aqours-omoi-yo-hitotsu-ni-nare",
      project_id: "sunshine",
      group_id: "aqours_main",
      song_name_ja: "想いよひとつになれ",
      song_name_zh: "心意合而为一",
      costume_name_ja: "想いよひとつになれ（AqoursVer.）",
      costume_name_zh: "心意合而为一 演出服",
      category: "anime_in",
      era_or_live: "动画1期第11话 / 1st Live",
      characters: [
        {
          character_id: "kunikida-hanamaru",
          character_name_ja: "国木田 花丸",
          character_name_zh: "国木田花丸",
          variant_id: "var-cos-kunikida-hanamaru",
          theme_id: "theme-hanamaru-omoi-yo",
          visual_design: "明黄色缎面燕尾百褶裙、金色蕾丝金边马甲、小礼帽与白色短靴。",
          official_2d_reference: {
            title: "SIFAS SR【想いよひとつになれ】国木田 花丸 覚醒後 3600x1800 母版",
            file_path: "/uploads/hanamaru_omoi_yo_2d.png",
            url: "https://idol.st/allstars/card/188/"
          },
          search_keywords: [
            "国木田花丸 想いよひとつになれ cos 正面",
            "国木田花丸 心意合而为一 コスプレ",
            "国木田花丸 亮黄燕尾裙 cos 模特"
          ]
        },
        {
          character_id: "kurosawa-ruby",
          character_name_ja: "黒澤 ルビィ",
          character_name_zh: "黑泽露比",
          variant_id: "variant-ruby-omoi-yo",
          theme_id: "theme-hanamaru-omoi-yo",
          visual_design: "玫粉色缎面燕尾裙、粉白金扣马甲与侧边小圆礼帽。",
          official_2d_reference: {
            title: "SIFAS SR【想いよひとつになれ】黒澤 ルビィ 覚醒後",
            file_path: "/uploads/ruby_omoi_yo_2d.png",
            url: "https://idol.st/allstars/card/190/"
          },
          search_keywords: [
            "黒澤ルビィ 想いよひとつになれ cos 正面",
            "黑泽露比 心意合一 コスプレ",
            "Ruby Kurosawa Omoi yo cos"
          ]
        }
      ]
    },
    {
      costume_id: "costume-aqours-koi-ni-naritai-aquarium",
      project_id: "sunshine",
      group_id: "aqours_main",
      song_name_ja: "恋になりたいAQUARIUM",
      song_name_zh: "想在水族馆恋爱",
      costume_name_ja: "恋になりたいAQUARIUM（Aqours全员Ver.）",
      costume_name_zh: "水族馆 演出服",
      category: "single_cd",
      era_or_live: "2nd Single / 1st Live",
      characters: [
        {
          character_id: "watanabe-you",
          character_name_ja: "渡辺 曜",
          character_name_zh: "渡边曜",
          variant_id: "variant-you-aquarium",
          theme_id: "theme-aqours-aquarium",
          visual_design: "深海浅蓝渐变波浪鱼尾蓬蓬裙、贝壳海星珍珠配饰、水手大礼帽与人鱼感薄纱。",
          official_2d_reference: {
            title: "SIFAS UR【恋になりたいAQUARIUM】渡辺 曜 覚醒後",
            file_path: "/uploads/you_aquarium_2d.png",
            url: "https://idol.st/allstars/card/220/"
          },
          search_keywords: [
            "渡辺曜 水族館 cos 正面",
            "渡边曜 恋になりたいAQUARIUM コスプレ",
            "You Watanabe Aquarium cos 模特"
          ]
        }
      ]
    },

    // =========================================================================
    // 4. ラブライブ！School idol project (μ's)
    // =========================================================================
    {
      costume_id: "costume-honoka-borarara",
      project_id: "muse",
      group_id: "muse_main",
      song_name_ja: "僕らのLIVE 君とのLIFE",
      song_name_zh: "我们的LIVE 与你的LIFE",
      costume_name_ja: "僕らのLIVE 君とのLIFE（高坂穂乃果Ver.）",
      costume_name_zh: "我们的LIVE 与你的LIFE 穗乃果版",
      category: "single_cd",
      era_or_live: "μ's 传奇原点 1st Single",
      characters: [
        {
          character_id: "kousaka-honoka",
          character_name_ja: "高坂 穂乃果",
          character_name_zh: "高坂穗乃果",
          variant_id: "variant-honoka-borarara",
          theme_id: "theme-honoka-borarara",
          visual_design: "红色燕尾外套、交叉金排扣马甲、红白拼接百褶短裙与红黑长筒高筒马靴、领结饰花。",
          official_2d_reference: {
            title: "SIFAS SR【僕らのLIVE 君とのLIFE】覚醒後 3600x1800 母版",
            file_path: "/uploads/honoka_borarara_2d.png",
            url: "https://idol.st/allstars/card/148/"
          },
          search_keywords: [
            "高坂穂乃果 僕らのLIVE 君とのLIFE cos 正面",
            "高坂穗乃果 我们的live コスプレ 全身",
            "穗乃果 1st打歌服 cos 模特"
          ]
        },
        {
          character_id: "sonoda-umi",
          character_name_ja: "園田 海未",
          character_name_zh: "园田海未",
          variant_id: "variant-umi-borarara",
          theme_id: "theme-honoka-borarara",
          visual_design: "深海蓝燕尾马甲，蓝色蝴蝶结领结，蓝白拼接百褶裙与过膝马靴。",
          official_2d_reference: {
            title: "SIFAS SR【僕らのLIVE 君とのLIFE】園田 海未 覚醒後",
            file_path: "/uploads/umi_borarara_2d.png",
            url: "https://idol.st/allstars/card/147/"
          },
          search_keywords: [
            "園田海未 僕らのLIVE 君とのLIFE cos 正面",
            "园田海未 我们的live コスプレ",
            "Umi Borarara cos"
          ]
        },
        {
          character_id: "minami-kotori",
          character_name_ja: "南 ことり",
          character_name_zh: "南小鸟",
          variant_id: "variant-kotori-borarara",
          theme_id: "theme-honoka-borarara",
          visual_design: "浅绿燕尾马甲，嫩绿蝴蝶结领饰，绿白拼接百褶短裙与小短靴。",
          official_2d_reference: {
            title: "SIFAS SR【僕らのLIVE 君とのLIFE】南 ことり 覚醒後",
            file_path: "/uploads/kotori_borarara_2d.png",
            url: "https://idol.st/allstars/card/149/"
          },
          search_keywords: [
            "南ことり 僕らのLIVE 君とのLIFE cos 正面",
            "南小鸟 我们的live コスプレ",
            "Kotori Borarara cos"
          ]
        }
      ]
    },
    {
      costume_id: "costume-tojo-kirakira-sensation",
      project_id: "muse",
      group_id: "muse_main",
      song_name_ja: "KiRa-KiRa Sensation!",
      song_name_zh: "闪亮心情",
      costume_name_ja: "KiRa-KiRa Sensation!（東條 希Ver.）",
      costume_name_zh: "KiRa-KiRa Sensation! 东条希版",
      category: "anime_in",
      era_or_live: "动画2期第12话 最终决战夺冠曲",
      characters: [
        {
          character_id: "tojo-nozomi",
          character_name_ja: "東條 希",
          character_name_zh: "东条希",
          variant_id: "var-cos-tojo-nozomi",
          theme_id: "theme-nozomi-kirakira",
          visual_design: "紫白格纹多层裙摆、金扣马甲与紫色羽毛发饰、双层蕾丝内衬短裙与皇冠羽圈。",
          official_2d_reference: {
            title: "SIFAS SR【KiRa-KiRa Sensation!】東條 希 覚醒後 3600x1800 母版",
            file_path: "/uploads/nozomi_kirakira_2d.png",
            url: "https://idol.st/allstars/card/299/"
          },
          search_keywords: [
            "東條希 KiRa-KiRa Sensation cos 正面",
            "东条希 闪亮心情 コスプレ 正面",
            "东条希 夺冠打歌服 cos 模特"
          ]
        },
        {
          character_id: "kousaka-honoka",
          character_name_ja: "高坂 穂乃果",
          character_name_zh: "高坂穗乃果",
          variant_id: "variant-honoka-kirakira",
          theme_id: "theme-nozomi-kirakira",
          visual_design: "橙粉渐变皇冠华丽舞台裙，金色双排扣马甲，多重蕾丝羽毛层叠裙。",
          official_2d_reference: {
            title: "SIFAS SR【KiRa-KiRa Sensation!】高坂 穂乃果 覚醒後",
            file_path: "/uploads/honoka_kirakira_2d.png",
            url: "https://idol.st/allstars/card/297/"
          },
          search_keywords: [
            "高坂穂乃果 KiRa-KiRa Sensation cos 正面",
            "高坂穗乃果 夺冠打歌服 コスプレ",
            "Honoka KiRa-KiRa Sensation cos"
          ]
        }
      ]
    },
    {
      costume_id: "costume-sonoda-angel",
      project_id: "muse",
      group_id: "muse_main",
      song_name_ja: "ホワイトデー編 天使の弓矢",
      song_name_zh: "天使篇 / 白色情人节爱神",
      costume_name_ja: "ホワイトデー編 天使の弓矢（園田 海未Ver.）",
      costume_name_zh: "天使篇爱神（园田海未Ver.）",
      category: "game_card",
      era_or_live: "SIF 经典极高人气天使篇覚醒",
      characters: [
        {
          character_id: "sonoda-umi",
          character_name_ja: "園田 海未",
          character_name_zh: "园田海未",
          variant_id: "var-cos-sonoda-umi",
          theme_id: "theme-umi-angel",
          visual_design: "深海蓝与纯白双色希腊风神圣礼服、洁白丘比特羽翼、金丝罗马绑带短靴与天使爱神手杖。",
          official_2d_reference: {
            title: "SIF UR【天使編 / ホワイトデー】園田 海未（覚醒後）3600x1800 母版",
            file_path: "/uploads/umi_angel_2d.png",
            url: "https://schoolido.lu/cards/551/"
          },
          search_keywords: [
            "園田海未 天使編 cos 正面",
            "园田海未 白色情人节天使 コスプレ",
            "海未 天使弓矢 cos 全身 翅膀"
          ]
        }
      ]
    },
    {
      costume_id: "costume-muse-snow-halation",
      project_id: "muse",
      group_id: "muse_main",
      song_name_ja: "Snow halation",
      song_name_zh: "雪之光芒",
      costume_name_ja: "Snow halation（μ's全员Ver.）",
      costume_name_zh: "Snow halation 冬日雪景演出服",
      category: "single_cd",
      era_or_live: "2nd Single / 动画2期第9话 / 冬日传奇神曲",
      characters: [
        {
          character_id: "kousaka-honoka",
          character_name_ja: "高坂 穂乃果",
          character_name_zh: "高坂穗乃果",
          variant_id: "variant-honoka-snow-halation",
          theme_id: "theme-snow-halation",
          visual_design: "冬日雪景纯白毛绒长大衣，暖橙色丝带领结与百褶短裙，白色毛绒长筒靴与耳套。",
          official_2d_reference: {
            title: "SIFAS UR【Snow halation】高坂 穂乃果 覚醒後",
            file_path: "/uploads/honoka_snow_halation_2d.png",
            url: "https://idol.st/allstars/card/120/"
          },
          search_keywords: [
            "高坂穂乃果 Snow halation cos 正面",
            "高坂穗乃果 白毛领大衣 コスプレ",
            "Honoka Snow Halation cos 全身"
          ]
        },
        {
          character_id: "minami-kotori",
          character_name_ja: "南 ことり",
          character_name_zh: "南小鸟",
          variant_id: "variant-kotori-snow-halation",
          theme_id: "theme-snow-halation",
          visual_design: "纯白毛绒立领雪景大衣，灰绿蝴蝶结与珍珠短裙，雪白保暖耳罩。",
          official_2d_reference: {
            title: "SIFAS UR【Snow halation】南 ことり 覚醒後",
            file_path: "/uploads/kotori_snow_halation_2d.png",
            url: "https://idol.st/allstars/card/121/"
          },
          search_keywords: [
            "南ことり Snow halation cos 正面",
            "南小鸟 雪之光芒 コスプレ",
            "Kotori Snow Halation cos"
          ]
        }
      ]
    },

    // =========================================================================
    // 5. ラブライブ！スーパースター!! (Liella!)
    // =========================================================================
    {
      costume_id: "costume-liella-hajimari-wa-kimi-no-sora",
      project_id: "superstar",
      group_id: "liella_main",
      song_name_ja: "始まりは君の空",
      song_name_zh: "始于你的天空",
      costume_name_ja: "始まりは君の空（Liella!全员Ver.）",
      costume_name_zh: "始于你的天空 出道演出服",
      category: "single_cd",
      era_or_live: "Liella! 1st Single",
      characters: [
        {
          character_id: "shibuya-kanon",
          character_name_ja: "澁谷 かのん",
          character_name_zh: "涩谷香音",
          variant_id: "variant-kanon-hajimari",
          theme_id: "theme-liella-hajimari",
          visual_design: "橙白双色水手制服双排扣打歌服，橙色领结、金色刺绣与百褶短裙，白色长筒袜与小皮鞋。",
          official_2d_reference: {
            title: "Liella! 1st Single【始まりは君の空】澁谷 かのん 官方打歌服立绘",
            file_path: "/uploads/kanon_hajimari_2d.png",
            url: "https://www.lovelive-anime.jp/yuigaoka/"
          },
          search_keywords: [
            "澁谷かのん 始まりは君の空 cos 正面",
            "涩谷香音 始于你的天空 コスプレ",
            "Kanon Shibuya cos 模特 正面全身"
          ]
        },
        {
          character_id: "tang-keke",
          character_name_ja: "唐 可可",
          character_name_zh: "唐可可",
          variant_id: "variant-keke-hajimari",
          theme_id: "theme-liella-hajimari",
          visual_design: "天蓝与纯白双排扣水手服，水蓝大领结，双层百褶短裙与天蓝贝雷帽。",
          official_2d_reference: {
            title: "Liella! 1st Single【始まりは君の空】唐 可可 官方立绘",
            file_path: "/uploads/keke_hajimari_2d.png",
            url: "https://www.lovelive-anime.jp/yuigaoka/"
          },
          search_keywords: [
            "唐可可 始まりは君の空 cos 正面",
            "唐可可 水手打歌服 コスプレ",
            "Tang Keke Hajimari cos"
          ]
        }
      ]
    },
    {
      costume_id: "costume-liella-nonfiction",
      project_id: "superstar",
      group_id: "liella_main",
      song_name_ja: "ノンフィクション!!",
      song_name_zh: "Nonfiction!!",
      costume_name_ja: "ノンフィクション!!（平安名 すみれVer.）",
      costume_name_zh: "Nonfiction!! 平安名堇C位演出服",
      category: "anime_in",
      era_or_live: "动画1期第10话 / 1st Live",
      characters: [
        {
          character_id: "heanna-sumire",
          character_name_ja: "平安名 すみれ",
          character_name_zh: "平安名堇",
          variant_id: "variant-sumire-nonfiction",
          theme_id: "theme-liella-nonfiction",
          visual_design: "孔雀墨绿与深黑复古贵族欧式晚礼服，华丽羽冠皇冠、孔雀羽毛大拖尾披风与金丝刺绣胸封。",
          official_2d_reference: {
            title: "动画1期第10话【ノンフィクション!!】平安名 すみれ 官方舞台立绘",
            file_path: "/uploads/sumire_nonfiction_2d.png",
            url: "https://www.lovelive-anime.jp/yuigaoka/"
          },
          search_keywords: [
            "平安名すみれ ノンフィクション cos 正面",
            "平安名堇 Nonfiction コスプレ",
            "平安名堇 孔雀绿打歌服 cos 模特"
          ]
        }
      ]
    },

    // =========================================================================
    // 6. イキヅライブ！ LOVELIVE! BLUEBIRD (いきづらい部！)
    // =========================================================================
    {
      costume_id: "costume-bluebird-mai-mymai",
      project_id: "ikizuraibu",
      group_id: "ikizuraibu_main",
      song_name_ja: "mymai",
      song_name_zh: "mymai",
      costume_name_ja: "mymai（麻布 麻衣Ver.）",
      costume_name_zh: "mymai 麻布麻衣对抗服",
      category: "single_cd",
      era_or_live: "いきづらい部（BLUEBIRD）Solo / 对抗曲",
      characters: [
        {
          character_id: "azabu-mai",
          character_name_ja: "麻布 麻衣",
          character_name_zh: "麻布麻衣",
          variant_id: "var-cos-azabu-mai",
          theme_id: "theme-mai-mymai",
          visual_design: "深海蓝 IT 机能风西装短裙、工卡夹、数据流耳机、白衬衫紧身领带与不对称裙褶。",
          official_2d_reference: {
            title: "BLUEBIRD 公式 麻布 麻衣《mymai》舞台立绘母版",
            file_path: "/uploads/azabu_mai_mymai_2d.png",
            url: "https://www.lovelive-anime.jp/bluebird/"
          },
          search_keywords: [
            "麻布麻衣 mymai cos 正面",
            "麻布麻衣 对抗服 コスプレ",
            "麻布麻衣 机能风西装 cos 模特"
          ]
        }
      ]
    },
    {
      costume_id: "costume-bluebird-hanabi-dou-da",
      project_id: "ikizuraibu",
      group_id: "ikizuraibu_main",
      song_name_ja: "DOU DA DOING",
      song_name_zh: "DOU DA DOING",
      costume_name_ja: "DOU DA DOING（駒形 花火Ver.）",
      costume_name_zh: "DOU DA DOING 演出服",
      category: "single_cd",
      era_or_live: "いきづらい部（BLUEBIRD）Solo曲",
      characters: [
        {
          character_id: "komagata-hanabi",
          character_name_ja: "駒形 花火",
          character_name_zh: "驹形花火",
          variant_id: "var-cos-komagata-hanabi",
          theme_id: "theme-hanabi-dou-da",
          visual_design: "红蓝相间热血运动水手裙、额头护额、亮片拳套与运动短靴，热血冲劲十足。",
          official_2d_reference: {
            title: "BLUEBIRD 公式 駒形 花火《DOU DA DOING》舞台立绘母版",
            file_path: "/uploads/hanabi_dou_da_doing_2d.png",
            url: "https://www.lovelive-anime.jp/bluebird/"
          },
          search_keywords: [
            "駒形花火 DOU DA DOING cos 正面",
            "驹形花火 拳套 コスプレ",
            "Komagata Hanabi DOU DA DOING cos"
          ]
        }
      ]
    },
    {
      costume_id: "costume-bluebird-1st-stage",
      project_id: "ikizuraibu",
      group_id: "ikizuraibu_main",
      song_name_ja: "BLUEBIRD 1st ステージ衣装",
      song_name_zh: "BLUEBIRD 1st 团体打歌服",
      costume_name_ja: "BLUEBIRD 1st ステージ衣装",
      costume_name_zh: "BLUEBIRD 1st 团体打歌服",
      category: "single_cd",
      era_or_live: "BLUEBIRD 企划登场 1st Live",
      characters: [
        {
          character_id: "takahashi-polka",
          character_name_ja: "高橋 ポルカ",
          character_name_zh: "高桥波尔卡",
          variant_id: "var-cos-takahashi-polka",
          theme_id: "theme-bluebird-1st-stage",
          visual_design: "亮黄与米白条纹潮流连帽运动夹克、白色百褶裙与黄黑双色短袜。",
          official_2d_reference: {
            title: "BLUEBIRD 公式 高橋 ポルカ 舞台立绘母版",
            file_path: "/uploads/polka_bluebird_1st_2d.png",
            url: "https://www.lovelive-anime.jp/bluebird/"
          },
          search_keywords: [
            "高橋ポルカ cos 正面",
            "高桥波尔卡 コスプレ",
            "Takahashi Polka BLUEBIRD cos"
          ]
        },
        {
          character_id: "goto-akira",
          character_name_ja: "五桐 玲",
          character_name_zh: "五桐玲",
          variant_id: "var-cos-goto-akira",
          theme_id: "theme-bluebird-1st-stage",
          visual_design: "薄荷绿与象牙白帅气机能短外套，中性风利落立领与短裤拼接裙。",
          official_2d_reference: {
            title: "BLUEBIRD 公式 五桐 玲 舞台立绘母版",
            file_path: "/uploads/akira_bluebird_1st_2d.png",
            url: "https://www.lovelive-anime.jp/bluebird/"
          },
          search_keywords: [
            "五桐玲 cos 正面",
            "五桐玲 コスプレ 打歌服",
            "Goto Akira BLUEBIRD cos"
          ]
        },
        {
          character_id: "kanazawa-kiseki",
          character_name_ja: "金澤 奇跡",
          character_name_zh: "金泽奇迹",
          variant_id: "var-cos-kanazawa-kiseki",
          theme_id: "theme-bluebird-1st-stage",
          visual_design: "樱粉色甜心蝴蝶结裙装，荷叶边翻领与粉色贝雷帽。",
          official_2d_reference: {
            title: "BLUEBIRD 公式 金澤 奇跡 舞台立绘母版",
            file_path: "/uploads/kiseki_bluebird_1st_2d.png",
            url: "https://www.lovelive-anime.jp/bluebird/"
          },
          search_keywords: [
            "金澤奇跡 cos 正面",
            "金泽奇迹 コスプレ",
            "Kanazawa Kiseki cos"
          ]
        },
        {
          character_id: "chofu-noriko",
          character_name_ja: "調布 のりこ",
          character_name_zh: "调布法子",
          variant_id: "var-cos-chofu-noriko",
          theme_id: "theme-bluebird-1st-stage",
          visual_design: "紫罗兰电竞未来风制服短裙，发光耳机与多重机能挂扣。",
          official_2d_reference: {
            title: "BLUEBIRD 公式 調布 のりこ 舞台立绘母版",
            file_path: "/uploads/noriko_bluebird_1st_2d.png",
            url: "https://www.lovelive-anime.jp/bluebird/"
          },
          search_keywords: [
            "調布のりこ cos 正面",
            "调布法子 コスプレ",
            "Chofu Noriko cos"
          ]
        },
        {
          character_id: "harumiya-yukuri",
          character_name_ja: "春宮 ゆくり",
          character_name_zh: "春宫由栗",
          variant_id: "var-cos-harumiya-yukuri",
          theme_id: "theme-bluebird-1st-stage",
          visual_design: "水蓝文艺风百褶背心裙，白衬衫与针织背心叠穿，清纯书卷气。",
          official_2d_reference: {
            title: "BLUEBIRD 公式 春宮 ゆくり 舞台立绘母版",
            file_path: "/uploads/yukuri_bluebird_1st_2d.png",
            url: "https://www.lovelive-anime.jp/bluebird/"
          },
          search_keywords: [
            "春宮ゆくり cos 正面",
            "春宫由栗 コスプレ",
            "Harumiya Yukuri cos"
          ]
        },
        {
          character_id: "konohana-kaguya",
          character_name_ja: "此花 輝夜",
          character_name_zh: "此花辉夜",
          variant_id: "var-cos-konohana-kaguya",
          theme_id: "theme-bluebird-1st-stage",
          visual_design: "玫红和洋歌舞伎风短裙，黑色锦缎振袖与折扇发饰。",
          official_2d_reference: {
            title: "BLUEBIRD 公式 此花 輝夜 舞台立绘母版",
            file_path: "/uploads/kaguya_bluebird_1st_2d.png",
            url: "https://www.lovelive-anime.jp/bluebird/"
          },
          search_keywords: [
            "此花輝夜 cos 正面",
            "此花辉夜 コスプレ",
            "Konohana Kaguya cos"
          ]
        },
        {
          character_id: "yamada-midori",
          character_name_ja: "山田 真緑",
          character_name_zh: "山田真绿",
          variant_id: "var-cos-yamada-midori",
          theme_id: "theme-bluebird-1st-stage",
          visual_design: "深绿元气自然系短裙，白绿撞色棒球帽与运动短袜。",
          official_2d_reference: {
            title: "BLUEBIRD 公式 山田 真緑 舞台立绘母版",
            file_path: "/uploads/midori_bluebird_1st_2d.png",
            url: "https://www.lovelive-anime.jp/bluebird/"
          },
          search_keywords: [
            "山田真緑 cos 正面",
            "山田真绿 コスプレ",
            "Yamada Midori cos"
          ]
        },
        {
          character_id: "sasaki-shion",
          character_name_ja: "佐々木 翔音",
          character_name_zh: "佐佐木翔音",
          variant_id: "var-cos-sasaki-shion",
          theme_id: "theme-bluebird-1st-stage",
          visual_design: "银白纯净无机质机能风外套，极简几何线条与银灰高筒袜。",
          official_2d_reference: {
            title: "BLUEBIRD 公式 佐々木 翔音 舞台立绘母版",
            file_path: "/uploads/shion_bluebird_1st_2d.png",
            url: "https://www.lovelive-anime.jp/bluebird/"
          },
          search_keywords: [
            "佐々木翔音 cos 正面",
            "佐佐木翔音 コスプレ",
            "Sasaki Shion cos"
          ]
        }
      ]
    }
  ]
};

fs.writeFileSync(outputFile, JSON.stringify(masterIndex, null, 2), 'utf-8');
console.log(`[PASS] 成功建立 Master Costume Index: ${outputFile}`);
console.log(`- 包含企划数: ${Object.keys(masterIndex.projects).length}`);
console.log(`- 包含经典/最新核心打歌服套数: ${masterIndex.costumes.length}`);
let totalChars = 0;
masterIndex.costumes.forEach(c => totalChars += c.characters.length);
console.log(`- 包含角色穿戴实例词条总数: ${totalChars}`);
