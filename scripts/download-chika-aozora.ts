import { fetch, ProxyAgent } from 'undici';
import fs from 'fs';

const proxy = new ProxyAgent('http://127.0.0.1:12002');

async function main() {
  const url = 'https://idol.st/allstars/cards/?search=Aozora%20Jumping%20Heart';
  const res = await fetch(url, { dispatcher: proxy, headers: { 'User-Agent': 'Mozilla/5.0' } });
  const html = await res.text();
  const cardRegex = /href="(\/allstars\/card\/\d+\/[^"]*Chika[^"]*)"/i;
  const m = html.match(cardRegex);
  console.log('Chika Aozora Jumping Heart link:', m?.[1]);
  if (m) {
    const cardRes = await fetch(`https://idol.st${m[1]}`, { dispatcher: proxy, headers: { 'User-Agent': 'Mozilla/5.0' } });
    const cHtml = await cardRes.text();
    const imgs = [...cHtml.matchAll(/https:\/\/i\.idol\.st\/u\/card\/art\/2x\/[^"'>\s]+/g)].map(x => x[0]);
    console.log('2x images:', imgs);
    const targetImg = imgs[1] || imgs[0];
    if (targetImg) {
      const imgRes = await fetch(targetImg, { dispatcher: proxy });
      const buf = Buffer.from(await imgRes.arrayBuffer());
      fs.writeFileSync('data/uploads/chika_aozora_2d.png', buf);
      fs.writeFileSync('public/uploads/chika_aozora_2d.png', buf);
      console.log('Saved chika_aozora_2d.png:', buf.length);
    }
  }
}

main().catch(console.error);
