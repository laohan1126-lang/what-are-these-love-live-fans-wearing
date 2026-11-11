import { fetch, ProxyAgent } from 'undici';

const proxy = new ProxyAgent('http://127.0.0.1:12002');

async function main() {
  const url = 'https://mantan-web.jp/article/20200913dog00m200028000c.html'; // possible mantan article
  // Let's search mantan-web via google custom search / site search
  // Or fetch MANTANWEB LoveLive articles around 2020-09-12 / 2020-09-13
  for (let i = 20; i <= 50; i++) {
    const artUrl = `https://mantan-web.jp/article/20200913dog00m2000${i}000c.html`;
    try {
      const res = await fetch(artUrl, { dispatcher: proxy, headers: { 'User-Agent': 'Mozilla/5.0' } });
      if (res.status === 200) {
        const text = await res.text();
        if (text.includes('虹ヶ咲') || text.includes('小泉萌香') || text.includes('ラブライブ')) {
          console.log('Found article:', artUrl);
          const title = text.match(/<h1[^>]*>([^<]+)<\/h1>/)?.[1];
          console.log('Title:', title);
          const imgs = [...text.matchAll(/<img[^>]+src="([^">]+)"/g)].map(m => m[1]);
          console.log('Images:', imgs);
        }
      }
    } catch (e) {}
  }
}

main().catch(console.error);
