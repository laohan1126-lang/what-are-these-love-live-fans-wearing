import { fetch, ProxyAgent } from 'undici';

const proxy = new ProxyAgent('http://127.0.0.1:12002');

async function main() {
  const red = 'https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQEWdg4f9hZ_no8E9mmjRQs1a_IPKB_epU6YoRvhYPQpCtr3VwRUkh83AaXn92nxUlHJcWlIUKFBuP1mcVzFHyT5QNUCNaOqIswGnjP52I_Ex4HFKdmf9h5JEWS0hpzrlUjCrMCEkEaGRn4=';
  const res = await fetch(red, { dispatcher: proxy, redirect: 'follow' });
  console.log('Final URL:', res.url);
  const text = await res.text();
  console.log('Title:', text.match(/<title>([^<]+)<\/title>/)?.[1]);
  const imgs = [...text.matchAll(/https:\/\/ogre\.natalie\.mu\/media\/news\/[^"'\s>]+\.jpg/g)].map(x => x[0]);
  console.log('Images:', [...new Set(imgs)]);
}

main().catch(console.error);
