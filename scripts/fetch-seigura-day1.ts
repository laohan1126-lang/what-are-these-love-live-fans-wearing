import { fetch, ProxyAgent } from 'undici';

const proxy = new ProxyAgent('http://127.0.0.1:12002');

async function main() {
  const searchUrl = 'https://seigura.com/?s=' + encodeURIComponent('虹ヶ咲 2nd Live Brand New Story');
  const res = await fetch(searchUrl, {
    dispatcher: proxy,
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  const text = await res.text();
  const links = [...text.matchAll(/href="(https:\/\/seigura\.com\/news\/\d+\/)"/g)].map(m => m[1]);
  console.log('Day 1 Articles:', [...new Set(links)]);

  for (const art of [...new Set(links)]) {
    const r = await fetch(art, { dispatcher: proxy, headers: { 'User-Agent': 'Mozilla/5.0' } });
    const content = await r.text();
    const title = content.match(/<h1[^>]*>([^<]+)<\/h1>/)?.[1];
    console.log('Article:', art, 'Title:', title);
    if (content.includes('決意の光') || content.includes('小泉萌香') || content.includes('Brand New Story')) {
      const imgs = [...content.matchAll(/https:\/\/seigura\.com\/wp-content\/uploads\/[^"'>\s]+\.jpg/g)].map(x => x[0]);
      console.log('Found imgs for Brand New Story:', [...new Set(imgs)]);
    }
  }
}

main().catch(console.error);
