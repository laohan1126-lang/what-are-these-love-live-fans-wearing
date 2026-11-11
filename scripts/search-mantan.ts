import { fetch, ProxyAgent } from 'undici';

const proxy = new ProxyAgent('http://127.0.0.1:12002');

async function main() {
  const searchUrl = 'https://mantan-web.jp/search/?q=' + encodeURIComponent('小泉萌香 決意の光');
  const res = await fetch(searchUrl, {
    dispatcher: proxy,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  });
  console.log('Search Status:', res.status);
  const text = await res.text();
  const linkRegex = /href="(\/article\/[^"]+)"/g;
  let m;
  const articles: string[] = [];
  while ((m = linkRegex.exec(text)) !== null) {
    articles.push('https://mantan-web.jp' + m[1]);
  }
  console.log('Articles found:', [...new Set(articles)]);
}

main().catch(console.error);
