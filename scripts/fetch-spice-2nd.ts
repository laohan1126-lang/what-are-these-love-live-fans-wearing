import { fetch, ProxyAgent } from 'undici';

const proxy = new ProxyAgent('http://127.0.0.1:12002');

async function main() {
  const url = 'https://spice.eplus.jp/articles/search?query=' + encodeURIComponent('10人目の仲間も加えた虹ヶ咲の新たな一歩');
  const res = await fetch(url, { dispatcher: proxy, headers: { 'User-Agent': 'Mozilla/5.0' } });
  const text = await res.text();
  const m = text.match(/href="(\/articles\/\d+)"/);
  if (m) {
    const art = 'https://spice.eplus.jp' + m[1];
    console.log('Found SPICE article:', art);
    const r = await fetch(art, { dispatcher: proxy, headers: { 'User-Agent': 'Mozilla/5.0' } });
    const content = await r.text();
    const imgs = [...content.matchAll(/https:\/\/spice\.eplus\.jp\/images\/[^"'>\s]+\.jpg/g)].map(x => x[0]);
    console.log('SPICE images:', [...new Set(imgs)]);
  } else {
    console.log('Not found by exact title, trying query: 虹ヶ咲 2nd Live レポート');
    const url2 = 'https://spice.eplus.jp/articles/search?query=' + encodeURIComponent('虹ヶ咲 2nd Live レポート');
    const res2 = await fetch(url2, { dispatcher: proxy, headers: { 'User-Agent': 'Mozilla/5.0' } });
    const text2 = await res2.text();
    const matches = [...text2.matchAll(/href="(\/articles\/\d+)"/g)].map(x => 'https://spice.eplus.jp' + x[1]);
    console.log('Matched articles:', [...new Set(matches)]);
  }
}

main().catch(console.error);
