import { fetch, ProxyAgent } from 'undici';

const proxy = new ProxyAgent('http://127.0.0.1:12002');

async function main() {
  for (const id of [775, 736, 891]) {
    const url = `https://idol.st/allstars/card/${id}/`;
    const res = await fetch(url, { dispatcher: proxy, headers: { 'User-Agent': 'Mozilla/5.0' } });
    const html = await res.text();
    const m = html.match(/href="([^"]+2x\.png)"/i) || html.match(/src="([^"]+trained[^"]+\.png)"/i);
    const title = html.match(/<h1[^>]*>([^<]+)<\/h1>/)?.[1];
    console.log(`[${id}] Title: ${title}`);
    console.log(`[${id}] Art: ${m?.[1]}`);
  }
}

main().catch(console.error);
