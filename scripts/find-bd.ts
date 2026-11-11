import { fetch, ProxyAgent } from 'undici';

const proxy = new ProxyAgent('http://127.0.0.1:12002');

async function main() {
  const url = 'https://www.lovelive-anime.jp/nijigasaki/bd_detail.php?id=12'; // try possible ids
  for (let i = 1; i <= 25; i++) {
    try {
      const res = await fetch(`https://www.lovelive-anime.jp/nijigasaki/bd_detail.php?id=${i}`, {
        dispatcher: proxy,
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });
      if (res.status === 200) {
        const text = await res.text();
        const title = text.match(/<title>([^<]+)<\/title>/)?.[1] || '';
        if (title.includes('2nd Live') || text.includes('決意の光')) {
          console.log(`Found id ${i}:`, title);
          const imgs = [...text.matchAll(/<img[^>]+src="([^">]+)"/g)].map(m => m[1]);
          console.log('Images:', imgs);
        }
      }
    } catch (e) {}
  }
}

main().catch(console.error);
