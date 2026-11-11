import { fetch, ProxyAgent } from 'undici';

const proxy = new ProxyAgent('http://127.0.0.1:12002');

async function main() {
  const searchUrl = 'https://spice.eplus.jp/articles/search?query=' + encodeURIComponent('虹ヶ咲 2nd Live');
  const res = await fetch(searchUrl, {
    dispatcher: proxy,
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  const text = await res.text();
  console.log('SPICE search status:', res.status, 'length:', text.length);
  const links = [...text.matchAll(/href="(\/articles\/\d+)"/g)].map(m => 'https://spice.eplus.jp' + m[1]);
  console.log('SPICE articles:', [...new Set(links)]);

  for (const art of [...new Set(links)].slice(0, 5)) {
    const r = await fetch(art, { dispatcher: proxy, headers: { 'User-Agent': 'Mozilla/5.0' } });
    const c = await r.text();
    const title = c.match(/<h1[^>]*>([^<]+)<\/h1>/)?.[1];
    console.log('Article:', art, 'Title:', title);
    const imgs = [...c.matchAll(/https:\/\/spice\.eplus\.jp\/images\/[^"'>\s]+\.jpg/g)].map(x => x[0]);
    console.log('Imgs count:', imgs.length, 'Samples:', imgs.slice(0, 10));
  }
}

main().catch(console.error);
