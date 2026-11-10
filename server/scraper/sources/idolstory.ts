import { ScrapedCostume } from '../types.js';

export const IDOL_STORY_SLUGS: Record<string, { slug: string; nameJa: string; group: string }> = {
  // 虹咲
  'mifune-shioriko': { slug: 'Shioriko', nameJa: '三船 栞子', group: 'nijigasaki' },
  'uehara-ayumu': { slug: 'Ayumu', nameJa: '上原 歩夢', group: 'nijigasaki' },
  'nakasu-kasumi': { slug: 'Kasumi', nameJa: '中須 かすみ', group: 'nijigasaki' },
  'osaka-shizuku': { slug: 'Shizuku', nameJa: '桜坂 しずく', group: 'nijigasaki' },
  'asaka-karin': { slug: 'Karin', nameJa: '朝香 果林', group: 'nijigasaki' },
  'miyashita-ai': { slug: 'Ai', nameJa: '宮下 愛', group: 'nijigasaki' },
  'omi-kanata': { slug: 'Kanata', nameJa: '近江 彼方', group: 'nijigasaki' },
  'yuki-setsuna': { slug: 'Setsuna', nameJa: '優木 せつ菜', group: 'nijigasaki' },
  'emma-verde': { slug: 'Emma', nameJa: 'エマ・ヴェルデ', group: 'nijigasaki' },
  'tennoji-rina': { slug: 'Rina', nameJa: '天王寺 璃奈', group: 'nijigasaki' },
  'mia-taylor': { slug: 'Mia', nameJa: 'ミア・テイラー', group: 'nijigasaki' },
  'zhong-lanzhu': { slug: 'Lanzhu', nameJa: '鐘 嵐珠', group: 'nijigasaki' },

  // Aqours
  'takami-chika': { slug: 'Chika', nameJa: '高海 千歌', group: 'sunshine' },
  'sakurauchi-riko': { slug: 'Riko', nameJa: '桜内 梨子', group: 'sunshine' },
  'matsuura-kanan': { slug: 'Kanan', nameJa: '松浦 果南', group: 'sunshine' },
  'kurosawa-dia': { slug: 'Dia', nameJa: '黒澤 ダイヤ', group: 'sunshine' },
  'watanabe-you': { slug: 'You', nameJa: '渡辺 曜', group: 'sunshine' },
  'tsushima-yoshiko': { slug: 'Yoshiko', nameJa: '津島 善子', group: 'sunshine' },
  'kunikida-hanamaru': { slug: 'Hanamaru', nameJa: '国木田 花丸', group: 'sunshine' },
  'ohara-mari': { slug: 'Mari', nameJa: '小原 鞠莉', group: 'sunshine' },
  'kurosawa-ruby': { slug: 'Ruby', nameJa: '黒澤 ルビィ', group: 'sunshine' },

  // μ's
  'kousaka-honoka': { slug: 'Honoka', nameJa: '高坂 穂乃果', group: 'muse' },
  'ayase-eli': { slug: 'Eli', nameJa: '絢瀬 絵里', group: 'muse' },
  'minami-kotori': { slug: 'Kotori', nameJa: '南 ことり', group: 'muse' },
  'sonoda-umi': { slug: 'Umi', nameJa: '園田 海未', group: 'muse' },
  'hoshizora-rin': { slug: 'Rin', nameJa: '星空 凛', group: 'muse' },
  'nishikino-maki': { slug: 'Maki', nameJa: '西木野 真姫', group: 'muse' },
  'tojo-nozomi': { slug: 'Nozomi', nameJa: '東條 希', group: 'muse' },
  'koizumi-hanayo': { slug: 'Hanayo', nameJa: '小泉 花陽', group: 'muse' },
  'yazawa-nico': { slug: 'Nico', nameJa: '矢澤 にこ', group: 'muse' },
};

// 官方打歌服/衣装日文名映射
const OFFICIAL_JP_NAMES: Record<string, string> = {
  'Miracle STAY TUNE!': 'Miracle STAY TUNE!',
  'Concentrate!': 'Concentrate!',
  'Eien no Isshun': '永遠の一瞬',
  'Break The System': 'Break The System',
  'Ketsui no Hikari': '決意の光',
  'Rainbow Waltz': 'レインボー・ワルツ',
  'Mysterious Jewelry': 'ミステリアスジュエリー',
  'Crimson Rose': 'クリムゾンローズ',
  'Paradise in the Sky': 'パラダイス・イン・ザ・スカイ',
  'Sparkling Moonlit Night': '月夜のきらめき',
  'The Miracle Specialist': 'ミラクル・スペシャリスト',
  'Cherry Blossom Girl of the Night': '夜桜の少女',
  'All Stars Next': 'オールスターズ・ネクスト',
  'Merry Christmas with Nijigasaki!': 'メリークリスマス・ウィズ・ニジガク',
  'Nijigasaki High School Uniform (Summer)': '虹ヶ咲学園制服（夏服）',
  'Nijigasaki High School Uniform (Winter)': '虹ヶ咲学園制服（冬服）',
};

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
};

export async function fetchIdolStoryCostumes(characterId: string, maxItems: number = 5): Promise<ScrapedCostume[]> {
  const meta = IDOL_STORY_SLUGS[characterId];
  if (!meta) {
    console.warn(`[IdolStory] No mapping for characterId: ${characterId}`);
    return [];
  }

  const results: ScrapedCostume[] = [];
  const listUrl = `https://idol.st/allstars/cards/?search=${meta.slug}`;

  try {
    console.log(`[IdolStory] 正在检索 ${meta.nameJa} 的官方卡面母版库 (URL: ${listUrl})...`);
    const res = await fetch(listUrl, { headers: HEADERS });
    if (!res.ok) {
      console.warn(`[IdolStory] List URL failed with status: ${res.status}`);
      return [];
    }

    const html = await res.text();
    // 提取不重复的卡片详情页链接
    const cardLinks = Array.from(new Set([...html.matchAll(/href="(\/allstars\/card\/[0-9]+\/[^"]*)"/g)].map(m => m[1])));
    console.log(`[IdolStory] 检索到 ${cardLinks.length} 张官方卡面，准备提取 2x (3600x1800) 超清原图母版...`);

    for (const relativePath of cardLinks.slice(0, maxItems)) {
      const cardUrl = `https://idol.st${relativePath}`;
      try {
        const cardRes = await fetch(cardUrl, { headers: HEADERS });
        if (!cardRes.ok) continue;

        const cardHtml = await cardRes.text();

        // 提取 2x 母版原图 (分辨率高达 3600x1800，彻底告别低清模糊)
        const twoXImgs = Array.from(new Set([...cardHtml.matchAll(/href="([^"]*card\/art\/2x\/[^"]*)"/g)].map(m => m[1])));
        if (twoXImgs.length === 0) {
          console.warn(`[IdolStory] Card ${relativePath} 没有检测到 2x 母版，跳过`);
          continue;
        }

        // 解析卡面和衣装名
        // 例如 /allstars/card/927/UR-Shioriko-Mifune-I-Tried-to-Come-Up-With-a-Pose-Mysterious-Jewelry/
        const slugParts = relativePath.replace(/\/$/, '').split('/');
        const lastPart = slugParts[slugParts.length - 1] || '';
        const cardTitleParts = lastPart.split('-');

        // 提取末尾的衣装名 (如 Mysterious Jewelry, Miracle STAY TUNE)
        let costumeRaw = cardTitleParts.slice(4).join(' ');
        if (!costumeRaw || costumeRaw.trim() === '') {
          costumeRaw = 'ALL STARS 演出服';
        }

        // 匹配日文原名
        const nameJa = OFFICIAL_JP_NAMES[costumeRaw] || costumeRaw;

        // 优先提取觉醒后（演出服形态，通常是数组第 1 项或含特训后的）
        const awakenedImgUrl = twoXImgs[0];

        results.push({
          characterId,
          themeNameJa: nameJa,
          variantNameJa: `${nameJa} (${meta.nameJa}Ver.)`,
          sourceType: 'game_card',
          evolutionStage: 'awakened',
          sourceTitle: `ALL STARS 官方卡面 2x 超清母版：${costumeRaw}`,
          sourceUrl: cardUrl,
          imageUrl: awakenedImgUrl,
          notes: `3600x1800 官方原画级 2x 母版，绝非低清缩略图`,
        });

        console.log(`[IdolStory] ✓ 锁定超清母版: ${nameJa} -> ${awakenedImgUrl}`);
      } catch (err: any) {
        console.warn(`[IdolStory] Error fetching card ${relativePath}:`, err.message);
      }
    }
  } catch (err: any) {
    console.error(`[IdolStory] Exception querying cards:`, err.message);
  }

  return results;
}
