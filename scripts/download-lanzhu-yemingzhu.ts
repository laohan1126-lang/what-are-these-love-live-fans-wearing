import { fetch, ProxyAgent } from 'undici';
import fs from 'fs';
import path from 'path';

const proxy = new ProxyAgent('http://127.0.0.1:12002');

async function main() {
  const url = 'https://i.idol.st/u/card/art/2x/775SR-Lanzhu-Zhong-I-Want-to-Look-Back-on-This-Forever-Ye-Mingzhu-8VIOFD.png';
  const res = await fetch(url, { dispatcher: proxy, headers: { 'User-Agent': 'Mozilla/5.0' } });
  if (res.status === 200) {
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync('data/uploads/lanzhu_yemingzhu_2d.png', buf);
    fs.writeFileSync('public/uploads/lanzhu_yemingzhu_2d.png', buf);
    console.log('Saved lanzhu_yemingzhu_2d.png:', buf.length, 'bytes');
  }
}

main().catch(console.error);
