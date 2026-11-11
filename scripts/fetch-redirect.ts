import { fetch } from 'undici';

async function main() {
  const redirectUrl = 'https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQEpWYFWkhImtgX9s6t5NcQZoMv0MZazryxCIOHDMpmFZDs58YffIibB4CXo6XyvkIO1fOD8JwT6QHHAlAk9VbuVcW1fYuYJ1BELKeP8x08Sp37OViryjMJhxw==';
  const res = await fetch(redirectUrl, {
    redirect: 'follow',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
    }
  });
  console.log('Final URL:', res.url);
  const text = await res.text();
  console.log('Title:', text.match(/<title>([^<]+)<\/title>/)?.[1]);
  const imgRegex = /https:\/\/[^"'<>\s]+\.(?:jpg|jpeg|png)/gi;
  const imgs = [...new Set(text.match(imgRegex) || [])];
  console.log('Images found:', imgs);
}

main().catch(console.error);
