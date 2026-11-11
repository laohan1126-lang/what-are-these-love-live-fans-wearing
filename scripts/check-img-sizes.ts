import fs from 'fs';

const imgNames = ['B1_0534', 'A1_0650', 'B2_3330', 'B2_3028', 'A4_1001', 'B1_3499', 'B1_5183', 'A4_5648', 'B2_4240'];

for (const name of imgNames) {
  const filePath = `data/seigura_test/${name}.jpg`;
  if (fs.existsSync(filePath)) {
    const stat = fs.statSync(filePath);
    console.log(`${name}: ${stat.size} bytes`);
  }
}
