import { fetch, ProxyAgent } from 'undici';

const proxy = new ProxyAgent('http://127.0.0.1:12002');

async function main() {
  const res = await fetch('https://seigura.com/news/46528/', { dispatcher: proxy, headers: { 'User-Agent': 'Mozilla/5.0' } });
  const text = await res.text();
  // match article body
  const body = text.split('entry-content')[1]?.split('</article>')[0] || '';
  const sections = body.split(/<img[^>]+>/g);
  for (let i = 0; i < sections.length; i++) {
    const clean = sections[i].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    if (clean) {
      console.log(`--- Section ${i} ---`);
      console.log(clean.slice(0, 300));
    }
  }
}

main().catch(console.error);
