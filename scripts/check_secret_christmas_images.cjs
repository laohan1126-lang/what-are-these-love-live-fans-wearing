const { fetch, ProxyAgent } = require('undici');
const dispatcher = new ProxyAgent('http://127.0.0.1:12002');

async function run() {
  const res = await fetch('https://gamerch.com/hasunosora/entry/671043', { dispatcher });
  const html = await res.text();
  console.log('HTML size:', html.length);
  const links = [...html.matchAll(/<a[^>]+href="(\/hasunosora\/(?:entry\/)?\d+)"[^>]*>([\s\S]*?)<\/a>/gi)];
  const rurinoLinks = [];
  for (const l of links) {
    if (l[2].includes('瑠璃乃')) {
      rurinoLinks.push({ href: l[1], text: l[2].replace(/<[^>]+>/g, '').trim() });
    }
  }
  console.log('大沢瑠璃乃卡面数量:', rurinoLinks.length);
  rurinoLinks.slice(0, 30).forEach(x => console.log(x.href, x.text));
}
run().catch(console.error);
