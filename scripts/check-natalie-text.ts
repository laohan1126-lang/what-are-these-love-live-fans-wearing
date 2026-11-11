import { fetch, ProxyAgent } from 'undici';

const proxy = new ProxyAgent('http://127.0.0.1:12002');

async function main() {
  const url = 'https://natalie.mu/comic/news/552522';
  const res = await fetch(url, { dispatcher: proxy, headers: { 'User-Agent': 'Mozilla/5.0' } });
  const text = await res.text();
  const idx = text.indexOf('決意の光');
  console.log(text.slice(idx - 600, idx + 600));
}

main().catch(console.error);
