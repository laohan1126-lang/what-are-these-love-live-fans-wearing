import { fetch, ProxyAgent } from 'undici';

const proxy = new ProxyAgent('http://127.0.0.1:12002');

async function main() {
  const searchUrl = 'https://natalie.mu/music/search?query=' + encodeURIComponent('虹ヶ咲 2nd Live');
  const res = await fetch(searchUrl, {
    dispatcher: proxy,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  });
  console.log('Search Status:', res.status);
  const text = await res.text();
  const linkRegex = /href="(\/music\/news\/\d+)"/g;
  let m;
  const articles: string[] = [];
  while ((m = linkRegex.exec(text)) !== null) {
    articles.push('https://natalie.mu' + m[1]);
  }
  console.log('Articles found:', [...new Set(articles)]);
}

main().catch(console.error);
