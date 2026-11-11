import { fetch, ProxyAgent } from 'undici';

const proxy = new ProxyAgent('http://127.0.0.1:12002');

async function main() {
  const red = 'https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQE0tGnWl7qrW85AEzVOCf3kYIzzPN06w7KNT3Ej1NClim8tAQv5oV3iEdXdluZZvyJM15Ux-hul4oSok8w8cKCglcMBrOK8zn53XWJYcxJo5rmoVLr9ohLr76y6XA==';
  // Note: vertexaisearch couldn't be connected from local without proxy, but with proxy it works!
  const res = await fetch(red, { dispatcher: proxy, redirect: 'follow' });
  console.log('Final URL:', res.url);
}

main().catch(console.error);
