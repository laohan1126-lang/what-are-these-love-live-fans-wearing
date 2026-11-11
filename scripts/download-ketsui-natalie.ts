import { fetch, ProxyAgent } from 'undici';
import fs from 'fs';
import path from 'path';

const proxy = new ProxyAgent('http://127.0.0.1:12002');

const imgs = [
  { name: 'shioriko_ketsui_natalie_live.jpg', url: 'https://ogre.natalie.mu/media/news/comic/2023/1210/ijigen-fes_35.jpg' },
  { name: 'lanzhu_eutopia_natalie_live.jpg', url: 'https://ogre.natalie.mu/media/news/comic/2023/1210/ijigen-fes_34.jpg' },
  { name: 'ijigen_fes_33.jpg', url: 'https://ogre.natalie.mu/media/news/comic/2023/1210/ijigen-fes_33.jpg' },
  { name: 'ijigen_fes_36.jpg', url: 'https://ogre.natalie.mu/media/news/comic/2023/1210/ijigen-fes_36.jpg' }
];

async function main() {
  const dir = path.resolve('data/natalie_live');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  for (const item of imgs) {
    const p = path.join(dir, item.name);
    console.log(`Downloading ${item.url} -> ${item.name}...`);
    const res = await fetch(item.url, { dispatcher: proxy, headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (res.status === 200) {
      const buf = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(p, buf);
      console.log(`Saved ${item.name} (${buf.length} bytes)`);
    } else {
      console.log(`Failed ${item.name}: ${res.status}`);
    }
  }
}

main().catch(console.error);
