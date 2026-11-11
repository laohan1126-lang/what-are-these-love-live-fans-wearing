import { fetch, ProxyAgent } from 'undici';
import fs from 'fs';

const proxy = new ProxyAgent('http://127.0.0.1:12002');

async function main() {
  const url = 'https://i.idol.st/u/card/art/2x/736SR-Lanzhu-Zhong-We-All-Match-Colorful-Dreams-Colorful-Smiles-Rwiuy8.png';
  const imgRes = await fetch(url, { dispatcher: proxy });
  if (imgRes.status === 200) {
    const buf = Buffer.from(await imgRes.arrayBuffer());
    fs.writeFileSync('data/uploads/lanzhu_colorful_dreams_2d.png', buf);
    fs.writeFileSync('public/uploads/lanzhu_colorful_dreams_2d.png', buf);
    console.log('Saved lanzhu_colorful_dreams_2d.png:', buf.length);
  }
}

main().catch(console.error);
