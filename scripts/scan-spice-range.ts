import { fetch, ProxyAgent } from 'undici';

const proxy = new ProxyAgent('http://127.0.0.1:12002');

async function main() {
  for (let id = 275450; id <= 275650; id++) {
    try {
      const url = `https://spice.eplus.jp/articles/${id}`;
      const res = await fetch(url, { dispatcher: proxy, headers: { 'User-Agent': 'Mozilla/5.0' } });
      if (res.status === 200) {
        const text = await res.text();
        const title = text.match(/<h1[^>]*>([^<]+)<\/h1>/)?.[1] || '';
        if (title.includes('虹ヶ咲') || title.includes('小泉萌香') || text.includes('決意の光')) {
          console.log(`Found ID ${id}: ${title}`);
          const imgs = [...text.matchAll(/https:\/\/spice\.eplus\.jp\/images\/[^"'>\s]+\.jpg/g)].map(x => x[0]);
          console.log('Images:', [...new Set(imgs)]);
        }
      }
    } catch (e) {}
  }
}

main().catch(console.error);
