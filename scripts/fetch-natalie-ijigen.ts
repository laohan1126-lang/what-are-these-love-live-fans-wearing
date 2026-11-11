import { fetch, ProxyAgent } from 'undici';

const proxy = new ProxyAgent('http://127.0.0.1:12002');

async function main() {
  const red = 'https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQF8CCCSUa0TlkPA82XMmgDYpbJ8Hj4ntxbFh9dsXjK5Fcb1tJ1TTIKA1SMRAi6sbK1n0IP8NBlzD8iImAwrHMJZKqVcNXxAsPV_xePMZBnhPuocMxqSOOVJCA==';
  const res = await fetch(red, { dispatcher: proxy, redirect: 'follow' });
  console.log('Final URL:', res.url);
  const text = await res.text();
  console.log('Title:', text.match(/<title>([^<]+)<\/title>/)?.[1]);
  const imgRegex = /https:\/\/ogre\.natalie\.mu\/media\/news\/music\/[^"'\s>]+\.jpg/g;
  const imgs = [...text.matchAll(imgRegex)].map(x => x[0]);
  console.log('Natalie images count:', imgs.length);
  console.log('Images sample:', [...new Set(imgs)].slice(0, 10));
}

main().catch(console.error);
