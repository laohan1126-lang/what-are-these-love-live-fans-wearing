import fs from 'fs';

const files = fs.readdirSync('data/seigura_test');
for (const f of files) {
  const p = 'data/seigura_test/' + f;
  const s = fs.statSync(p);
  console.log(`${f}: ${s.size} bytes`);
}
