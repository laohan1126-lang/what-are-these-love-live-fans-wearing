import { fetch, ProxyAgent } from 'undici';

const proxy = new ProxyAgent('http://127.0.0.1:12002');

async function main() {
  const cards = [
    { name: 'lanzhu', query: 'https://idol.story.pink/api/cards/?idol=Zhong%20Lanzhu&ordering=-id&page_size=10' },
    { name: 'rina', query: 'https://idol.story.pink/api/cards/?idol=Tennoji%20Rina&ordering=-id&page_size=10' },
    { name: 'ayumu', query: 'https://idol.story.pink/api/cards/?idol=Uehara%20Ayumu&ordering=-id&page_size=10' }
  ];

  for (const c of cards) {
    try {
      const res = await fetch(c.query, { dispatcher: proxy });
      console.log(`[${c.name}] status: ${res.status}`);
      if (res.status === 200) {
        const data = await res.json() as any;
        console.log(`[${c.name}] count:`, data.count);
        for (const r of (data.results || []).slice(0, 3)) {
          console.log(`   card ${r.id}: title="${r.title}", trained="${r.clean_ur_trained || r.art || r.card_image}"`);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }
}

main().catch(console.error);
