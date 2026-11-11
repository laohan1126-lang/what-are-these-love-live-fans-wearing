import { fetch, ProxyAgent } from 'undici';

const proxy = new ProxyAgent('http://127.0.0.1:12002');

async function main() {
  const url = 'https://www.lovelive-anime.jp/nijigasaki/sp_2ndlive.php';
  const res = await fetch(url, {
    dispatcher: proxy,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  });
  const text = await res.text();
  const imgRegex = /<img[^>]+src="([^">]+)"/g;
  let m;
  const imgs: string[] = [];
  while ((m = imgRegex.exec(text)) !== null) {
    imgs.push(m[1]);
  }
  console.log('Images count:', imgs.length);
  console.log('Images:', imgs);
}

main().catch(console.error);
