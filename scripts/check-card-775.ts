import { fetch, ProxyAgent } from 'undici';

const proxy = new ProxyAgent('http://127.0.0.1:12002');

async function main() {
  const url = 'https://idol.st/allstars/card/775/SR-Lanzhu-Zhong-I-Want-to-Look-Back-on-This-Forever-Ye-Mingzhu/';
  const res = await fetch(url, { dispatcher: proxy, headers: { 'User-Agent': 'Mozilla/5.0' } });
  console.log('Status:', res.status);
  const html = await res.text();
  console.log('Length:', html.length);
  const imgs = [...html.matchAll(/https:\/\/i\.idol\.st\/[^"'>\s]+/g)].map(x => x[0]);
  console.log('Images:', [...new Set(imgs)]);
}

main().catch(console.error);
