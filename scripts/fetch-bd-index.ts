import { fetch, ProxyAgent } from 'undici';

const proxy = new ProxyAgent('http://127.0.0.1:12002');

async function main() {
  const res = await fetch('https://www.lovelive-anime.jp/nijigasaki/bd.php', {
    dispatcher: proxy,
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  const text = await res.text();
  console.log('Length:', text.length);
  console.log('Title:', text.match(/<title>([^<]+)<\/title>/)?.[1]);
  const links = [...text.matchAll(/href="([^">]+)"/g)].map(m => m[1]);
  console.log('All Links sample:', links.slice(0, 30));
}

main().catch(console.error);
