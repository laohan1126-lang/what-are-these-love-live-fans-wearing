import { fetch, ProxyAgent } from 'undici';

const proxy = new ProxyAgent('http://127.0.0.1:12002');

async function main() {
  const url = 'https://idol.st/allstars/cards/?search=Lanzhu';
  const res = await fetch(url, { dispatcher: proxy, headers: { 'User-Agent': 'Mozilla/5.0' } });
  const html = await res.text();
  const cardRegex = /href="(\/allstars\/card\/\d+\/[^"]+)"/g;
  const links = [...new Set([...html.matchAll(cardRegex)].map(x => x[1]))];
  console.log('Lanzhu links:', links);
}

main().catch(console.error);
