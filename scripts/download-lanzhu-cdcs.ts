import { fetch, ProxyAgent } from 'undici';
import fs from 'fs';

const proxy = new ProxyAgent('http://127.0.0.1:12002');

async function main() {
  const url = 'https://idol.st/allstars/card/736/SR-Lanzhu-Zhong-We-All-Match-Colorful-Dreams-Colorful-Smiles/';
  const res = await fetch(url, { dispatcher: proxy, headers: { 'User-Agent': 'Mozilla/5.0' } });
  const html = await res.text();
  const imgs = [...html.matchAll(/https:\/\/i\.idol\.st\/u\/card\/art\/2x\/[^"'>\s]+/g)].map(x => x[0]);
  console.log('Card 736 2x images:', imgs);
  if (imgs.length >= 2) {
    const r = await fetch(imgs[1], { dispatcher: proxy });
    const buf = Buffer.from(await r.arrayBuffer());
    fs.writeFileSync('data/uploads/lanzhu_colorful_dreams_idolized_2d.png', buf);
    fs.writeFileSync('public/uploads/lanzhu_colorful_dreams_idolized_2d.png', buf);
    console.log('Saved idolized 2x:', buf.length);
  }
}

main().catch(console.error);
