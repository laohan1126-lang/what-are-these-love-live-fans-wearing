import { db } from '../server/db.js';
import { verifyScrapedCostume } from '../server/scraper/verifier.js';
import { curateCharacterCostumes } from '../server/scraper/curator.js';
import fs from 'fs';
import path from 'path';

let passCount = 0;
let failCount = 0;

function assert(condition: boolean, msg: string) {
  if (condition) {
    console.log(`  ✓ PASS: ${msg}`);
    passCount++;
  } else {
    console.error(`  ✗ FAIL: ${msg}`);
    failCount++;
  }
}

async function runTests() {
  console.log('====================================================');
  console.log('   Spec 0003 - 自动化图鉴采集与考据流水线验收测试   ');
  console.log('====================================================\n');

  // AC-1: 采集脚本运行并获取真实官方数据
  console.log('【测试 AC-1】自动化采集脚本运行与真实数据解析...');
  const shiorikoCostumes = db.prepare(`
    SELECT v.*, s.url as source_url, s.source_type, s.evolution_stage
    FROM costume_variants v
    JOIN costume_sources s ON s.variant_id = v.id
    WHERE v.character_id = 'mifune-shioriko'
  `).all() as any[];
  assert(shiorikoCostumes.length >= 10, `三船栞子当前收录 ${shiorikoCostumes.length} 套衣装，满足 >= 10 套的标准`);

  // AC-2: 本地图片落盘与离线可访问
  console.log('\n【测试 AC-2】图片自动下载与本地落盘...');
  const shiorikoImages = db.prepare(`
    SELECT img.file_path FROM costume_images img
    JOIN costume_variants v ON img.variant_id = v.id
    WHERE v.character_id = 'mifune-shioriko'
  `).all() as any[];

  assert(shiorikoImages.length > 0, `已保存 ${shiorikoImages.length} 张本地衣装图片`);
  let allExistLocally = true;
  for (const row of shiorikoImages.slice(0, 5)) {
    const relative = row.file_path.replace(/^\/uploads\//, '');
    const fullPathData = path.resolve(process.cwd(), 'data/uploads', relative);
    const fullPathPublic = path.resolve(process.cwd(), 'public/uploads', relative);
    if (!fs.existsSync(fullPathData) && !fs.existsSync(fullPathPublic)) {
      allExistLocally = false;
      console.error(`Missing file: ${relative}`);
    }
  }
  assert(allExistLocally, '采样检查本地图片文件物理存在，支持离线加载');

  // AC-3: 数据准确性与证据链校验
  console.log('\n【测试 AC-3】数据准确性与证据链...');
  const sampleCostume = shiorikoCostumes.find(c => c.name_ja && c.name_ja.includes('Miracle STAY TUNE!'));
  assert(!!sampleCostume, '成功检索到《Miracle STAY TUNE!》官方打歌服');
  if (sampleCostume) {
    assert(sampleCostume.source_url.startsWith('https://idol.st'), '出处包含官方可溯源的完整外链');
    assert(sampleCostume.status === 'verified', '强证据链下已核实认证生效');
  }

  // AC-4 & AC-6: 收集度计数与图鉴列表展现
  console.log('\n【测试 AC-4 & AC-6】收集度动态计算与多角色收录...');
  const countRow = db.prepare(`
    SELECT COUNT(v.id) as count
    FROM characters c
    JOIN costume_variants v ON v.character_id = c.id
    WHERE c.id = 'uehara-ayumu'
  `).get() as any;
  assert(countRow.count >= 20, `上原步梦收录套数 (${countRow.count}) 动态统计准确且 >= 20 套`);

  // AC-5: 出处与形态分类准确性
  console.log('\n【测试 AC-5】卡面形态与 Live 出处区分...');
  const liveCostume = shiorikoCostumes.find(c => c.source_type === 'seiyuu_live');
  const gameCardCostume = shiorikoCostumes.find(c => c.source_type === 'game_card');
  assert(!!liveCostume, `成功分类声优 Live 演出服 (如: ${liveCostume?.name_ja})`);
  assert(!!gameCardCostume, `成功分类手游卡面衣装 (如: ${gameCardCostume?.name_ja})`);

  // AC-7: 增量去重防重复入库
  console.log('\n【测试 AC-7】增量去重防重复机制...');
  const beforeCount = db.prepare(`SELECT COUNT(*) as count FROM costume_variants WHERE character_id = 'mifune-shioriko'`).get() as any;
  const duplicateResult = await curateCharacterCostumes('mifune-shioriko', 1);
  const afterCount = db.prepare(`SELECT COUNT(*) as count FROM costume_variants WHERE character_id = 'mifune-shioriko'`).get() as any;
  assert(duplicateResult.inserted === 0, '二次采集时已收录项新增数为 0');
  assert(duplicateResult.skipped > 0, `准确识别并跳过 ${duplicateResult.skipped} 套重复衣装`);
  assert(beforeCount.count === afterCount.count, `数据库记录数严格保持一致 (${beforeCount.count} === ${afterCount.count})，杜绝脏数据`);

  // AC-8: 异常与虚假数据拦截容错
  console.log('\n【测试 AC-8】异常与虚假数据强拦截...');
  const invalidFakeCostume = verifyScrapedCostume({
    characterId: 'mifune-shioriko',
    themeNameJa: '未知',
    variantNameJa: '某套衣服 待识别',
    sourceType: 'other',
    evolutionStage: 'none',
    sourceTitle: '假数据',
    sourceUrl: 'not_a_valid_url',
    imageUrl: '',
  });
  assert(!invalidFakeCostume.verified, '虚假/占位符数据被 Agent 考据闸门坚决拦截');

  console.log('\n====================================================');
  console.log(` 测试总结: ${passCount} 通过, ${failCount} 失败`);
  console.log('====================================================\n');

  if (failCount > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Test runner failed:', err);
  process.exit(1);
});
