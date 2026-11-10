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

export async function fetchIdolStoryCostumes(
  characterId: string,
  page: number = 1,
  pageSize: number = 5
): Promise<ScrapedCostume[]> {
  const meta = IDOL_STORY_SLUGS[characterId];
  if (!meta) {
    console.warn(`[IdolStory] No mapping for characterId: ${characterId}`);
    return [];
  }

  const results: ScrapedCostume[] = [];
  const listUrl = `https://idol.st/allstars/cards/?page=${page}&search=${encodeURIComponent(meta.slug)}`;

  try {
    console.log(`[IdolStory] 正在检索 ${meta.nameJa} 的官方卡面母版库 (Page: ${page}, URL: ${listUrl})...`);
    const res = await fetch(listUrl, { headers: HEADERS });
    if (!res.ok) {
      console.warn(`[IdolStory] List URL failed with status: ${res.status}`);
      return [];
    }

    const html = await res.text();
    // 提取不重复的卡片详情页链接
    const cardLinks = Array.from(new Set([...html.matchAll(/href="(\/allstars\/card\/[0-9]+\/[^"]*)"/g)].map(m => m[1])));
    console.log(`[IdolStory] 检索到 ${cardLinks.length} 张官方卡面，准备提取 2x (3600x1800) 超清原图母版...`);

    // 分页截取指定条数
    const targetLinks = cardLinks.slice(0, pageSize);

    for (const relativePath of targetLinks) {
      const cardUrl = `https://idol.st${relativePath}`;
      try {
        const cardRes = await fetch(cardUrl, { headers: HEADERS });
        if (!cardRes.ok) continue;

        const cardHtml = await cardRes.text();

        // 1. 严格判断觉醒前与觉醒后图片 (idolized vs normal)
        const idolizedMatch = cardHtml.match(/<a\s+href="([^"]*card\/art\/2x\/[^"]*)"[^>]*><img[^>]*class="[^"]*idolized[^"]*"/i);
        const normalMatch = cardHtml.match(/<a\s+href="([^"]*card\/art\/2x\/[^"]*)"[^>]*><img[^>]*class="[^"]*normal[^"]*"/i);

        let imageUrl = '';
        let evolutionStage: 'none' | 'unawakened' | 'awakened' = 'none';

        if (idolizedMatch && idolizedMatch[1]) {
          imageUrl = idolizedMatch[1];
          evolutionStage = 'awakened';
        } else if (normalMatch && normalMatch[1]) {
          imageUrl = normalMatch[1];
          evolutionStage = 'unawakened';
        } else {
          // 兜底提取首张 2x
          const any2x = cardHtml.match(/href="([^"]*card\/art\/2x\/[^"]*)"/i);
          if (any2x && any2x[1]) {
            imageUrl = any2x[1];
            evolutionStage = 'none';
          }
        }

        if (!imageUrl) {
          console.warn(`[IdolStory] Card ${relativePath} 没有检测到 2x 母版，跳过`);
          continue;
        }

        // 2. 准确提取卡名与衣装名（避免英文碎片拼接错误）
        // 从 alt="... 「CardTitle / CostumeName」" 中准确分离
        const altMatch = cardHtml.match(/alt="[^"「]*「([^」]+)」"/i);
        let costumeNameRaw = '';
        let cardTitleRaw = '';

        if (altMatch && altMatch[1]) {
          const parts = altMatch[1].split('/');
          if (parts.length > 1) {
            cardTitleRaw = parts[0].trim();
            costumeNameRaw = parts[1].trim();
          } else {
            cardTitleRaw = parts[0].trim();
            costumeNameRaw = parts[0].trim();
          }
        }

        // 若从 HTML alt 提取失败，退化为从 URL 解析，但不粗暴硬切
        if (!costumeNameRaw) {
          const slugParts = relativePath.replace(/\/$/, '').split('/');
          costumeNameRaw = slugParts[slugParts.length - 1] || 'ALL STARS 卡面';
        }

        // 查找是否有官方核实日文名
        const verifiedJpName = OFFICIAL_JP_NAMES[costumeNameRaw];
        const themeNameJa = verifiedJpName || costumeNameRaw;
        const variantNameJa = verifiedJpName ? `${verifiedJpName} (${meta.nameJa}Ver.)` : '';

        results.push({
          characterId,
          themeNameJa,
          variantNameJa,
          sourceType: 'game_card',
          evolutionStage,
          sourceTitle: `Idol Story SIFAS 卡面：${cardTitleRaw || costumeNameRaw} (${evolutionStage === 'awakened' ? '觉醒后' : evolutionStage === 'unawakened' ? '觉醒前' : '形态未确认'})`,
          sourceUrl: cardUrl,
          imageUrl,
          notes: `由 Idol Story 社区数据采集的 2x 原画（${evolutionStage === 'awakened' ? '已确认为觉醒后演出服' : '未觉醒状态日常卡面'}），待人工比对核实`,
        });

        console.log(`[IdolStory] ✓ 锁定卡面: ${costumeNameRaw} [${evolutionStage}] -> ${imageUrl}`);
      } catch (err: any) {
        console.warn(`[IdolStory] Error fetching card ${relativePath}:`, err.message);
      }
    }
  } catch (err: any) {
    console.error(`[IdolStory] Exception querying cards:`, err.message);
  }

  return results;
}
