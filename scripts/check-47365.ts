import { fetch, ProxyAgent } from 'undici';

const proxy = new ProxyAgent('http://127.0.0.1:12002');

async function main() {
  const res = await fetch('https://seigura.com/news/47365/', { dispatcher: proxy, headers: { 'User-Agent': 'Mozilla/5.0' } });
  const text = await res.text();
  console.log('Title:', text.match(/<h1[^>]*>([^<]+)<\/h1>/)?.[1]);
  const imgs = [...text.matchAll(/https:\/\/seigura\.com\/wp-content\/uploads\/[^"'>\s]+\.jpg/g)].map(x => x[0]);
  console.log('Images:', [...new Set(imgs)]);
}

main().catch(console.error);
