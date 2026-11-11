import { fetch, ProxyAgent } from 'undici';
import fs from 'fs';
import path from 'path';

const proxy = new ProxyAgent('http://127.0.0.1:12002');

const imgList = [
  'https://seigura.com/wp-content/uploads/2020/10/B1_0534.jpg',
  'https://seigura.com/wp-content/uploads/2020/10/A1_0650.jpg',
  'https://seigura.com/wp-content/uploads/2020/10/B2_3330.jpg',
  'https://seigura.com/wp-content/uploads/2020/10/B2_3028.jpg',
  'https://seigura.com/wp-content/uploads/2020/10/A4_1001.jpg',
  'https://seigura.com/wp-content/uploads/2020/10/B1_3499.jpg',
  'https://seigura.com/wp-content/uploads/2020/10/B1_5183.jpg',
  'https://seigura.com/wp-content/uploads/2020/10/A4_5648.jpg',
  'https://seigura.com/wp-content/uploads/2020/10/B2_4240.jpg'
];

async function main() {
  const dir = path.resolve('data/seigura_test');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  for (const url of imgList) {
    const filename = path.basename(url);
    const savePath = path.join(dir, filename);
    console.log(`Downloading ${url}...`);
    const res = await fetch(url, { dispatcher: proxy, headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (res.status === 200) {
      const buffer = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(savePath, buffer);
      console.log(`Saved ${filename} (${buffer.length} bytes)`);
    } else {
      console.log(`Failed ${url}: ${res.status}`);
    }
  }
}

main().catch(console.error);
