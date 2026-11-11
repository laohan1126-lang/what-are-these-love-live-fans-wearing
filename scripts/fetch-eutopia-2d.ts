import { fetch, ProxyAgent } from 'undici';
import fs from 'fs';
import path from 'path';

const proxy = new ProxyAgent('http://127.0.0.1:12002');

async function main() {
  const listUrl = `https://idol.st/allstars/cards/?search=Eutopia`;
  const res = await fetch(listUrl, {
    dispatcher: proxy,
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  console.log('Eutopia search status:', res.status);
  const html = await res.text();
  const cardLinks = [...new Set([...html.matchAll(/href="(\/allstars\/card\/[0-9]+\/[^"]*)"/g)].map(m => m[1]))];
  console.log('Eutopia cards:', cardLinks);

  for (const c of cardLinks.slice(0, 2)) {
    const cardRes = await fetch(`https://idol.st${c}`, { dispatcher: proxy, headers: { 'User-Agent': 'Mozilla/5.0' } });
    const cHtml = await cardRes.text();
    const m = cHtml.match(/href="([^"]+2x\.png)"/i) || cHtml.match(/src="([^"]+trained[^"]+\.png)"/i);
    if (m) {
      console.log('Found 2x image for Eutopia:', m[1]);
      const imgRes = await fetch(m[1].startsWith('http') ? m[1] : `https://idol.st${m[1]}`, { dispatcher: proxy });
      if (imgRes.status === 200) {
        const buf = Buffer.from(await imgRes.arrayBuffer());
        fs.writeFileSync('data/uploads/lanzhu_eutopia_2d.png', buf);
        fs.writeFileSync('public/uploads/lanzhu_eutopia_2d.png', buf);
        console.log('Saved lanzhu_eutopia_2d.png:', buf.length, 'bytes');
      }
    }
  }
}

main().catch(console.error);
