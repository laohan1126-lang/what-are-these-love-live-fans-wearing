import { fetch } from 'undici';

async function main() {
  const url = 'https://v-storage.jp/report/142991/';
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  });
  console.log('Status:', res.status);
  const text = await res.text();
  const imgRegex = /<img[^>]+src=["']([^"']+)["']/gi;
  let match;
  const imgs: string[] = [];
  while ((match = imgRegex.exec(text)) !== null) {
    imgs.push(match[1]);
  }
  console.log('Found images:', imgs);
}

main().catch(console.error);
