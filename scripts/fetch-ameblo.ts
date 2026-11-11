import { fetch, ProxyAgent } from 'undici';
import fs from 'fs';
import path from 'path';

const proxy = new ProxyAgent('http://127.0.0.1:12002');

const urls = [
  'https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQHOLHIM-guVs-m-2EoeL5rcuJoTrQeP1ZO3XL3Yz7Q6DlauwhPZ8_s_5uEbgE3804gl5mGuKLY-pnJhy_-3dagnJXqVV0jIVFestmwGD6iUMg8SOdNiFL1HL2nB0nKNXCqaA72xMampIwnmEcY=',
  'https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQGmT4uNeb-i290nISqivVHiucY4oqdDjorX2umISyq6_RjqyeN1WR4G2BLkFBm_9cEiUxsMEbLA1irQqMAIoiXk-A6pjEmhaFFuON3KR2DbsUg-3AL7qjHglpwr59Md5RQ-SRdlwMdi7MSLv6s=',
  'https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQHDK8QDdjKtYlHXzmzdQmps1bjaeUfUS8jsFnWxgixR9EYrKhBrti708XMPAmRtNhBW0hWgjr0Gi4ZQ7R3XglGajIQAHBLCEeZMAF4rr0gefw1cIBjTxsXbe_vtTwGtJ4u__Q0DPK4YUkTz630='
];

async function main() {
  const dir = path.resolve('data/ameblo_test');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  for (let i = 0; i < urls.length; i++) {
    const res = await fetch(urls[i], { dispatcher: proxy, redirect: 'follow' });
    console.log(`URL ${i} -> ${res.url}`);
    const text = await res.text();
    const imgs = [...text.matchAll(/https:\/\/stat\.ameba\.jp\/user_images\/[^"'>\s]+\.(?:jpg|png)/g)].map(x => x[0]);
    console.log('Imgs:', imgs);
    for (let j = 0; j < imgs.length; j++) {
      const imgRes = await fetch(imgs[j], { dispatcher: proxy });
      if (imgRes.status === 200) {
        const buf = Buffer.from(await imgRes.arrayBuffer());
        const filename = `ameblo_${i}_${j}.jpg`;
        fs.writeFileSync(path.join(dir, filename), buf);
        console.log(`Saved ${filename} (${buf.length} bytes)`);
      }
    }
  }
}

main().catch(console.error);
