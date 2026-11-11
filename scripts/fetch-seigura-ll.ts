import { fetch, ProxyAgent } from 'undici';

const proxy = new ProxyAgent('http://127.0.0.1:12002');

async function main() {
  const urls = [
    'https://seigura.com/?s=' + encodeURIComponent('ラブライブ！ 蓮ノ空 ライブレポート'),
    'https://seigura.com/?s=' + encodeURIComponent('虹ヶ咲 5th Live ライブレポート'),
    'https://seigura.com/?s=' + encodeURIComponent('Aqours ライブレポート')
  ];

  for (const u of urls) {
    const res = await fetch(u, { dispatcher: proxy, headers: { 'User-Agent': 'Mozilla/5.0' } });
    const text = await res.text();
    const articles = [...text.matchAll(/href="(https:\/\/seigura\.com\/news\/\d+\/)"/g)].map(m => m[1]);
    console.log('Query:', u, 'Articles:', [...new Set(articles)]);
  }
}

main().catch(console.error);
