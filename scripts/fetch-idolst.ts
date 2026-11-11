import { fetch, ProxyAgent } from 'undici';

const proxy = new ProxyAgent('http://127.0.0.1:12002');

async function main() {
  const characters = ['Lanzhu', 'Rina', 'Ayumu', 'Chika', 'Kaho'];
  for (const c of characters) {
    const listUrl = `https://idol.st/allstars/cards/?page=1&search=${encodeURIComponent(c)}`;
    const res = await fetch(listUrl, {
      dispatcher: proxy,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    console.log(`[${c}] status: ${res.status}`);
    if (res.status === 200) {
      const html = await res.text();
      const cardLinks = [...new Set([...html.matchAll(/href="(\/allstars\/card\/[0-9]+\/[^"]*)"/g)].map(m => m[1]))];
      console.log(`[${c}] cards found:`, cardLinks.slice(0, 3));
    }
  }
}

main().catch(console.error);
