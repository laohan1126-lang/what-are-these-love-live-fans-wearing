import { fetch, ProxyAgent } from 'undici';
import fs from 'fs';
import path from 'path';

const proxy = new ProxyAgent('http://127.0.0.1:12002');

const museImgs = [
  'https://ogre.natalie.mu/media/news/music/2016/0406/YUT_4254_WEB.jpg',
  'https://ogre.natalie.mu/media/news/music/2016/0406/YUT_5457_WEB.jpg',
  'https://ogre.natalie.mu/media/news/music/2016/0406/_82T6861_WEB.jpg',
  'https://ogre.natalie.mu/media/news/music/2016/0406/YUT_4943_WEB.jpg',
  'https://ogre.natalie.mu/media/news/music/2016/0406/_82T7042_WEB.jpg',
  'https://ogre.natalie.mu/media/news/music/2016/0406/YU7_4386_WEB.jpg',
  'https://ogre.natalie.mu/media/news/music/2016/0406/YU7_4410_WEB.jpg'
];

async function main() {
  let count = 0;
  for (const u of museImgs) {
    count++;
    const filename = `muse_borarara_live_${count}.jpg`;
    console.log(`Downloading ${u} -> ${filename}...`);
    const res = await fetch(u, { dispatcher: proxy, headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (res.status === 200) {
      const buf = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(`data/uploads/${filename}`, buf);
      fs.writeFileSync(`public/uploads/${filename}`, buf);
      console.log(`Saved ${filename} (${buf.length} bytes)`);
    }
  }
}

main().catch(console.error);
