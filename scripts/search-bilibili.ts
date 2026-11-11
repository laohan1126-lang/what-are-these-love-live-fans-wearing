import { fetch } from 'undici';

async function main() {
  const url = 'https://api.bilibili.com/x/web-interface/search/type?search_type=video&keyword=' + encodeURIComponent('小泉萌香 决意之光');
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  });
  console.log('Status:', res.status);
  const data = await res.json() as any;
  const list = data?.data?.result || [];
  console.log('Results count:', list.length);
  for (const item of list.slice(0, 10)) {
    console.log(`[${item.bvid}] ${item.title.replace(/<[^>]+>/g, '')}`);
    console.log('   pic:', item.pic);
  }
}

main().catch(console.error);
