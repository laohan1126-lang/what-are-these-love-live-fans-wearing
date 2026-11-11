import { fetch, ProxyAgent } from 'undici';
import fs from 'fs';
import path from 'path';

const proxy = new ProxyAgent('http://127.0.0.1:12002');

async function main() {
  const url = 'https://spice.eplus.jp/articles/275589';
  const res = await fetch(url, { dispatcher: proxy, headers: { 'User-Agent': 'Mozilla/5.0' } });
  console.log('Status:', res.status);
  const text = await res.text();
  console.log('Title:', text.match(/<h1[^>]*>([^<]+)<\/h1>/)?.[1]);
  const imgs = [...text.matchAll(/https:\/\/spice\.eplus\.jp\/images\/[^"'>\s]+\.jpg/g)].map(x => x[0]);
  console.log('Images found:', [...new Set(imgs)].length);

  const dir = path.resolve('data/spice_275589');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  let count = 0;
  for (const imgUrl of [...new Set(imgs)]) {
    count++;
    const filename = `spice_2nd_live_${count}.jpg`;
    const p = path.join(dir, filename);
    console.log(`Downloading ${imgUrl} -> ${filename}...`);
    const r = await fetch(imgUrl, { dispatcher: proxy, headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (r.status === 200) {
      const buf = Buffer.from(await r.arrayBuffer());
      fs.writeFileSync(p, buf);
      console.log(`Saved ${filename} (${buf.length} bytes)`);
    }
  }
}

main().catch(console.error);
