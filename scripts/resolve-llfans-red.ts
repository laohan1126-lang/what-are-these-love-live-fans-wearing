import { fetch, ProxyAgent } from 'undici';

const proxy = new ProxyAgent('http://127.0.0.1:12002');

async function main() {
  const red = 'https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQHVzK-fHA6DMKUBfp1IKG6KAkNbbnZDCSzsa38hPmMFOB5cayN8Xl5iaNGQm72Av-_S5aXGwjP7DonUB_Y4LybVRQVAcnWIUXCN8qm50cJTDUJZo8vlTQ==';
  const res = await fetch(red, { dispatcher: proxy, redirect: 'follow' });
  console.log('Final URL:', res.url);
}

main().catch(console.error);
