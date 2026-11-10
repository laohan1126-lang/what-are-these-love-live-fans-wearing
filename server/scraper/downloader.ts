import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { ProxyAgent, setGlobalDispatcher } from 'undici';
import { UPLOADS_DIR } from '../db.js';

// 自动检测系统/环境变量中的代理配置
const proxy = process.env.HTTPS_PROXY || process.env.HTTP_PROXY || process.env.ALL_PROXY;
if (proxy) {
  try {
    setGlobalDispatcher(new ProxyAgent(proxy));
  } catch (err) {
    console.warn('[Downloader] Failed to initialize ProxyAgent:', err);
  }
}

const PUBLIC_UPLOADS_DIR = path.resolve(process.cwd(), 'public/uploads');

// 确保目录存在
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
if (!fs.existsSync(PUBLIC_UPLOADS_DIR)) {
  fs.mkdirSync(PUBLIC_UPLOADS_DIR, { recursive: true });
}

export async function downloadImage(
  url: string,
  preferredPrefix: string = 'curated'
): Promise<{ localPath: string; fileName: string; size: number } | null> {
  try {
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
    };

    const res = await fetch(url, { headers });
    if (!res.ok) {
      console.warn(`[Downloader] HTTP error ${res.status} fetching image: ${url}`);
      return null;
    }

    const contentType = res.headers.get('content-type') || '';
    let ext = '.jpg';
    if (contentType.includes('png') || url.endsWith('.png')) {
      ext = '.png';
    } else if (contentType.includes('webp') || url.endsWith('.webp')) {
      ext = '.webp';
    } else if (contentType.includes('jpeg') || url.endsWith('.jpeg')) {
      ext = '.jpeg';
    }

    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 严格画质闸门：严禁入库小于 100KB 的低清缩略图
    if (buffer.length < 100 * 1024) {
      console.warn(`[Downloader] 拦截低清图片 (仅 ${buffer.length} bytes): ${url}`);
      return null;
    }

    // 内容哈希去重
    const hash = crypto.createHash('sha256').update(buffer).digest('hex').slice(0, 12);
    const safePrefix = preferredPrefix.replace(/[^a-zA-Z0-9_-]/g, '_');
    const fileName = `${safePrefix}_${hash}${ext}`;

    const destPathData = path.resolve(UPLOADS_DIR, fileName);
    const destPathPublic = path.resolve(PUBLIC_UPLOADS_DIR, fileName);

    // 写入主上传目录与前端静态目录
    fs.writeFileSync(destPathData, buffer);
    try {
      fs.writeFileSync(destPathPublic, buffer);
    } catch {
      // 容错
    }

    return {
      localPath: `/uploads/${fileName}`,
      fileName,
      size: buffer.length,
    };
  } catch (err: any) {
    console.error(`[Downloader] Exception downloading ${url}:`, err.message);
    return null;
  }
}
