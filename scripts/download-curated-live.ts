import { fetch, ProxyAgent } from 'undici';
import fs from 'fs';
import path from 'path';

const proxy = new ProxyAgent('http://127.0.0.1:12002');

const downloadList = [
  {
    filename: 'shioriko_ketsui_live_real.jpg',
    url: 'https://ogre.natalie.mu/media/news/comic/2023/1210/ijigen-fes_35.jpg',
    caption: '小泉萌香（三船栞子役）东京巨蛋 Live 现场实录：身穿《決意の光》和风振袖打歌服（振袖、和风腰封结、百褶裙与白羽发饰）'
  },
  {
    filename: 'ayumu_dream_with_you_live_real.jpg',
    url: 'https://ogre.natalie.mu/media/news/comic/2023/1210/ijigen-fes_22.jpg',
    caption: '大西亚玖璃（上原步梦役）东京巨蛋 Live 现场实录：身穿《Dream with You》粉白打歌服实景舞台上身'
  },
  {
    filename: 'lanzhu_eutopia_live_real.jpg',
    url: 'https://ogre.natalie.mu/media/news/comic/2023/1210/ijigen-fes_34.jpg',
    caption: '法元明菜（钟岚珠役）东京巨蛋 Live 现场实录：身穿《Eutopia》中华风红金长袍打歌服，大屏幕 2D 插画对照'
  },
  {
    filename: 'kanata_butterfly_live_real.jpg',
    url: 'https://ogre.natalie.mu/media/news/comic/2023/1210/ijigen-fes_23.jpg',
    caption: '鬼头明里（近江彼方役）东京巨蛋 Live 现场实录：身穿《Butterfly》梦幻紫蝴蝶薄纱演出服实景舞台上身'
  },
  {
    filename: 'rina_tsunagaru_live_real.jpg',
    url: 'https://ogre.natalie.mu/media/news/comic/2023/1210/ijigen-fes_24.jpg',
    caption: '田中千惠美（天王寺璃奈役）东京巨蛋 Live 现场实录：身穿《ツナガルコネクト》赛博连帽衫打歌服并佩戴 LED 璃奈板'
  },
  {
    filename: 'karin_vivid_world_live_real.jpg',
    url: 'https://ogre.natalie.mu/media/news/comic/2023/1210/ijigen-fes_33.jpg',
    caption: '久保田未梦（朝香果林役）东京巨蛋 Live 现场实录：身穿《VIVID WORLD》纯白机能风舞台服真人上身'
  },
  {
    filename: 'aqours_aozora_live_real.jpg',
    url: 'https://ogre.natalie.mu/media/news/comic/2023/1210/ijigen-fes_01.jpg',
    caption: 'Aqours（高海千歌役 伊波杏树等）东京巨蛋 Live 现场实录：身穿《青空Jumping Heart》经典海军风蓝白条纹打歌服'
  },
  {
    filename: 'hasunosora_dream_believers_live_real.jpg',
    url: 'https://ogre.natalie.mu/media/news/comic/2023/1210/ijigen-fes_07.jpg',
    caption: '莲之空女学院学园偶像俱乐部（日野下花帆役 榆井希实等）东京巨蛋 Live 现场实录：身穿《Dream Believers》正装打歌服'
  },
  {
    filename: 'hasunosora_holiday_live_real.jpg',
    url: 'https://ogre.natalie.mu/media/news/comic/2023/1210/ijigen-fes_20.jpg',
    caption: 'スリーズブーケ（日野下花帆、乙宗梢）东京巨蛋 Live 现场实录：身穿《Holiday∞Holiday》经典双人打歌服'
  },
  {
    filename: 'liella_tokonatsu_live_real.jpg',
    url: 'https://ogre.natalie.mu/media/news/comic/2023/1210/ijigen-fes_05.jpg',
    caption: 'Liella!（涩谷香音役 伊达小百合等）东京巨蛋 Live 现场实录：身穿《常夏☆サンシャイン》夏日热带打歌服'
  }
];

async function main() {
  const uploadDirs = [
    path.resolve('data/uploads'),
    path.resolve('public/uploads')
  ];
  for (const d of uploadDirs) {
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  }

  for (const item of downloadList) {
    console.log(`Downloading ${item.filename} from ${item.url}...`);
    const res = await fetch(item.url, { dispatcher: proxy, headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (res.status === 200) {
      const buf = Buffer.from(await res.arrayBuffer());
      for (const d of uploadDirs) {
        fs.writeFileSync(path.join(d, item.filename), buf);
      }
      console.log(`Saved ${item.filename} (${buf.length} bytes) to data/uploads and public/uploads`);
    } else {
      console.log(`Failed ${item.filename}: ${res.status}`);
    }
  }
}

main().catch(console.error);
