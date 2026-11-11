import { fetch, ProxyAgent } from 'undici';

const proxy = new ProxyAgent('http://127.0.0.1:12002');

async function main() {
  const res = await fetch('https://seigura.com/news/46528/', { dispatcher: proxy, headers: { 'User-Agent': 'Mozilla/5.0' } });
  const text = await res.text();
  const target = '続くソロパートでは、新加入となった小泉さんのステージからスタート';
  const idx = text.indexOf(target);
  if (idx !== -1) {
    console.log(text.slice(idx - 100, idx + 800));
  }
}

main().catch(console.error);
