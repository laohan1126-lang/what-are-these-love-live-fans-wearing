import { fetch, ProxyAgent } from 'undici';

const proxy = new ProxyAgent('http://127.0.0.1:12002');

async function main() {
  const searchUrl = 'https://mantan-web.jp/search/?q=' + encodeURIComponent('ラブライブ！虹ヶ咲学園スクールアイドル同好会：2nd Live！で10人のステージ “三船栞子”小泉萌香');
  const res = await fetch(searchUrl, {
    dispatcher: proxy,
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  const text = await res.text();
  console.log('Search res text length:', text.length);
  const m = text.match(/href="(\/article\/2020[^"]+)"/);
  if (m) {
    const artUrl = 'https://mantan-web.jp' + m[1];
    console.log('Target article URL:', artUrl);
    const artRes = await fetch(artUrl, { dispatcher: proxy, headers: { 'User-Agent': 'Mozilla/5.0' } });
    const artText = await artRes.text();
    const imgs = [...artText.matchAll(/https:\/\/storage\.mantan-web\.jp\/[^"'>\s]+/g)].map(x => x[0]);
    console.log('Mantan images:', [...new Set(imgs)]);
  } else {
    console.log('Not found link in search, checking common patterns...');
    // search for text content
    const articles = [...text.matchAll(/href="(\/article\/[^"]+)"/g)].map(x => x[1]);
    console.log('Any articles found in page:', articles);
  }
}

main().catch(console.error);
