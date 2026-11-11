import { fetch, ProxyAgent } from 'undici';

const proxy = new ProxyAgent('http://127.0.0.1:12002');

async function main() {
  const articles = [
    'https://seigura.com/news/174009/',
    'https://seigura.com/news/96710/',
    'https://seigura.com/news/19675/'
  ];

  for (const art of articles) {
    const res = await fetch(art, { dispatcher: proxy, headers: { 'User-Agent': 'Mozilla/5.0' } });
    const text = await res.text();
    const title = text.match(/<h1[^>]*>([^<]+)<\/h1>/)?.[1];
    console.log('\n=============================');
    console.log('URL:', art);
    console.log('Title:', title);
    const imgs = [...text.matchAll(/https:\/\/seigura\.com\/wp-content\/uploads\/[^"'>\s]+\.jpg/g)].map(x => x[0]);
    console.log('Images:', [...new Set(imgs)].slice(0, 15));
  }
}

main().catch(console.error);
