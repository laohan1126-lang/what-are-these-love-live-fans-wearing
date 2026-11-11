import fs from 'fs';
import path from 'path';

const copyPairs = [
  { src: 'data/seigura_test/hasunosora_cerise_live.jpg', dest: 'hasunosora_cerise_live.jpg' },
  { src: 'data/seigura_test/B1_5183.jpg', dest: 'azuna_dream_land_live.jpg' },
  { src: 'data/spice_275589/spice_2nd_live_1.jpg', dest: 'mirai_harmony_live_full.jpg' },
  { src: 'data/seigura_test/nijigasaki_5th_live_full.jpg', dest: 'nijigasaki_5th_live_full.jpg' }
];

for (const pair of copyPairs) {
  if (fs.existsSync(pair.src)) {
    fs.copyFileSync(pair.src, path.join('data/uploads', pair.dest));
    fs.copyFileSync(pair.src, path.join('public/uploads', pair.dest));
    console.log(`Copied ${pair.src} to uploads as ${pair.dest}`);
  }
}
