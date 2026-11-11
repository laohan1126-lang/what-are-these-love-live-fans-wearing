const { fetch, ProxyAgent } = require('undici');
const fs = require('fs');
const path = require('path');

const dispatcher = new ProxyAgent('http://127.0.0.1:12002');

async function main() {
  const url = 'https://gamerch.com/hasunosora/entry/867202';
  console.log('Fetching', url);
  const res = await fetch(url, { dispatcher, headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } });
  const html = await res.text();
  console.log('HTML size:', html.length);
  const matches = [...html.matchAll(/(https:\/\/[^"'\s]+\.(?:jpg|png|webp))/gi)].map(m => m[1]);
  const cdnImgs = matches.filter(u => u.includes('gamerch') || u.includes('image'));
  console.log('Found candidate images:', cdnImgs);

  // 下载特训后原画
  for (let i = 0; i < cdnImgs.length; i++) {
    const imgUrl = cdnImgs[i];
    if (imgUrl.includes('logo') || imgUrl.includes('banner')) continue;
    try {
      const imgRes = await fetch(imgUrl, { dispatcher });
      if (imgRes.ok) {
        const buf = Buffer.from(await imgRes.arrayBuffer());
        console.log(`Image ${i} (${imgUrl}): size = ${buf.length}`);
        fs.writeFileSync(path.resolve(__dirname, `../temp_secret_christmas_${i}.jpg`), buf);
      }
    } catch (e) {
      console.error(e.message);
    }
  }
}

main().catch(console.error);
