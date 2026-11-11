import { fetch, ProxyAgent } from 'undici';

const proxy = new ProxyAgent('http://127.0.0.1:12002');

async function main() {
  const url = 'https://ll-fans.jp/data/song/282';
  const res = await fetch(url, { dispatcher: proxy, headers: { 'User-Agent': 'Mozilla/5.0' } });
  console.log('Status:', res.status);
  const text = await res.text();
  console.log('Length:', text.length);
  const imgs = [...text.matchAll(/<img[^>]+src="([^">]+)"/g)].map(x => x[1]);
  console.log('Images:', imgs);
}

main().catch(console.error);
