import { fetch } from 'undici';

async function main() {
  const url = 'https://love-live.fandom.com/wiki/Ketsui_no_Hikari';
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
  });
  console.log('Status:', res.status);
  const text = await res.text();
  const imgRegex = /https:\/\/[^"'<>\s]+\.(?:png|jpg|jpeg|webp)/gi;
  const imgs = [...new Set(text.match(imgRegex) || [])];
  console.log('Images:', imgs.filter(i => i.includes('static.wikia.nocookie.net')));
}

main().catch(console.error);
