import { fetch, ProxyAgent } from 'undici';

const proxy = new ProxyAgent('http://127.0.0.1:12002');

async function main() {
  const searchUrl = 'https://seigura.com/?s=' + encodeURIComponent('ラブライブ！虹ヶ咲学園スクールアイドル同好会 2nd Live! Back to the TOKIMEKI');
  const res = await fetch(searchUrl, {
    dispatcher: proxy,
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  const text = await res.text();
  console.log('Search res text length:', text.length);
  const linkRegex = /href="(https:\/\/seigura\.com\/news\/\d+\/)"/g;
  let m;
  const articles: string[] = [];
  while ((m = linkRegex.exec(text)) !== null) {
    articles.push(m[1]);
  }
  console.log('Articles:', [...new Set(articles)]);

  for (const art of [...new Set(articles)]) {
    const r = await fetch(art, { dispatcher: proxy, headers: { 'User-Agent': 'Mozilla/5.0' } });
    const content = await r.text();
    console.log('Article:', art, 'Title:', content.match(/<h1[^>]*>([^<]+)<\/h1>/)?.[1]);
    const imgs = [...content.matchAll(/https:\/\/seigura\.com\/wp-content\/uploads\/[^"'>\s]+/g)].map(x => x[0]);
    console.log('Imgs:', [...new Set(imgs)]);
  }
}

main().catch(console.error);
