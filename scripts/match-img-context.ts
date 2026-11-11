import { fetch, ProxyAgent } from 'undici';

const proxy = new ProxyAgent('http://127.0.0.1:12002');

async function main() {
  const res = await fetch('https://seigura.com/news/46528/', { dispatcher: proxy, headers: { 'User-Agent': 'Mozilla/5.0' } });
  const text = await res.text();
  const imgMatches = [...text.matchAll(/<img[^>]+src="([^">]+\.jpg)"[^>]*>/g)];
  for (const m of imgMatches) {
    const url = m[1];
    if (url.includes('2020/10')) {
      const idx = m.index!;
      const before = text.slice(Math.max(0, idx - 300), idx).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      const after = text.slice(idx + m[0].length, Math.min(text.length, idx + m[0].length + 300)).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      console.log(`\n=== Image: ${url} ===`);
      console.log('BEFORE:', before);
      console.log('AFTER:', after);
    }
  }
}

main().catch(console.error);
