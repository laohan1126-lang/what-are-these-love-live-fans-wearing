import { fetch, ProxyAgent } from 'undici';

const proxy = new ProxyAgent('http://127.0.0.1:12002');

async function main() {
  const res = await fetch('https://seigura.com/news/46528/', { dispatcher: proxy, headers: { 'User-Agent': 'Mozilla/5.0' } });
  const text = await res.text();
  // find paragraphs around each image
  const imgNames = ['B1_0534', 'A1_0650', 'B2_3330', 'B2_3028', 'A4_1001', 'B1_3499', 'B1_5183', 'A4_5648', 'B2_4240'];
  for (const name of imgNames) {
    const idx = text.indexOf(name);
    if (idx !== -1) {
      console.log(`=== ${name} ===`);
      console.log(text.slice(Math.max(0, idx - 200), Math.min(text.length, idx + 400)).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '));
    }
  }
}

main().catch(console.error);
