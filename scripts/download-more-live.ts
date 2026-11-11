import { fetch, ProxyAgent } from 'undici';
import fs from 'fs';
import path from 'path';

const proxy = new ProxyAgent('http://127.0.0.1:12002');

const targets = [
  { name: 'hasunosora_dome_live.jpg', url: 'https://seigura.com/wp-content/uploads/2026/07/2675707363a3c6f5ab64a7594dda09fd.jpg' },
  { name: 'hasunosora_cerise_live.jpg', url: 'https://seigura.com/wp-content/uploads/2026/07/e39af251381eb4d65990a0aa5bc974c2.jpg' },
  { name: 'hasunosora_mira_live.jpg', url: 'https://seigura.com/wp-content/uploads/2026/07/dd5fdd61719cb4a97ae1cde11755589a.jpg' },
  { name: 'nijigasaki_5th_live_full.jpg', url: 'https://seigura.com/wp-content/uploads/2022/09/0f1be6f6b8c88a17030666f58e9f2f7b.jpg' },
  { name: 'nijigasaki_5th_live_stage.jpg', url: 'https://seigura.com/wp-content/uploads/2022/09/f5861a6a88300b4b1a1ffa1d9f4ac1d4.jpg' },
  { name: 'aqours_5th_live.jpg', url: 'https://seigura.com/wp-content/uploads/2019/07/D_G1CaPWsAAcP8H.jpg' }
];

async function main() {
  const dir = path.resolve('data/seigura_test');
  for (const t of targets) {
    const p = path.join(dir, t.name);
    console.log(`Downloading ${t.name}...`);
    const res = await fetch(t.url, { dispatcher: proxy, headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (res.status === 200) {
      const buf = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(p, buf);
      console.log(`Saved ${t.name} (${buf.length} bytes)`);
    }
  }
}

main().catch(console.error);
