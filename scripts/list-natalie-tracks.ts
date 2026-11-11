import { fetch, ProxyAgent } from 'undici';

const proxy = new ProxyAgent('http://127.0.0.1:12002');

async function main() {
  const url = 'https://natalie.mu/comic/news/552522';
  const res = await fetch(url, { dispatcher: proxy, headers: { 'User-Agent': 'Mozilla/5.0' } });
  const text = await res.text();
  const regex = /<img class="[^"]*NA_imglist_thumb"[^>]+data-src="([^">]+)"\s+alt="([^">]+)"/g;
  let m;
  while ((m = regex.exec(text)) !== null) {
    const src = m[1].replace(/\?.*$/, '');
    const title = m[2];
    console.log(`[${title}] -> ${src}`);
  }
}

main().catch(console.error);
