import { fetch, ProxyAgent } from 'undici';
import fs from 'fs';
import path from 'path';

const proxy = new ProxyAgent('http://127.0.0.1:12002');

async function main() {
  const url = 'https://natalie.mu/comic/news/552522';
  const res = await fetch(url, { dispatcher: proxy, headers: { 'User-Agent': 'Mozilla/5.0' } });
  const text = await res.text();
  const imgRegex = /https:\/\/ogre\.natalie\.mu\/media\/news\/comic\/[^"'\s>]+\.jpg/g;
  const imgs = [...new Set([...text.matchAll(imgRegex)].map(x => x[0]))];
  console.log('Found comic images count:', imgs.length);
  console.log('Comic images:', imgs);

  // Natalie gallery links
  const galleryRegex = /href="(\/comic\/gallery\/news\/552522\/[^"]+)"/g;
  const galleryLinks = [...new Set([...text.matchAll(galleryRegex)].map(x => 'https://natalie.mu' + x[1]))];
  console.log('Gallery links count:', galleryLinks.length);
  console.log('Sample gallery links:', galleryLinks.slice(0, 10));

  // Let's fetch the gallery pages to get full-res image URLs
  const dir = path.resolve('data/natalie_552522');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  for (let i = 0; i < Math.min(20, galleryLinks.length); i++) {
    const gUrl = galleryLinks[i];
    try {
      const gRes = await fetch(gUrl, { dispatcher: proxy, headers: { 'User-Agent': 'Mozilla/5.0' } });
      const gText = await gRes.text();
      const m = gText.match(/https:\/\/ogre\.natalie\.mu\/media\/news\/comic\/[^"'\s>]+\.jpg/);
      const cap = gText.match(/<figcaption[^>]*>([^<]+)<\/figcaption>/)?.[1] || gText.match(/class="NA_article_img_caption"[^>]*>([^<]+)</)?.[1] || '';
      if (m) {
        console.log(`Gallery ${i}: caption="${cap}", img=${m[0]}`);
      }
    } catch (e) {}
  }
}

main().catch(console.error);
