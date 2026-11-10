import assert from 'assert';
import { db, initDatabase } from '../server/db.js';
import { curateCharacterCostumes } from '../server/scraper/curator.js';
import { createBackupZip, restoreBackupZip } from '../server/backup.js';
import path from 'path';
import fs from 'fs';

async function testAll() {
  console.log('--- 1. 验证全部小分队成员绑定正确性 ---');
  initDatabase();

  const getSubunit = (groupId: string) => {
    return db.prepare(`
      SELECT c.id, c.name_ja
      FROM character_groups cg
      JOIN characters c ON cg.character_id = c.id
      WHERE cg.group_id = ?
    `).all(groupId) as { id: string; name_ja: string }[];
  };

  // 虹咲
  const r3birth = getSubunit('r3birth');
  assert.strictEqual(r3birth.length, 3, 'R3BIRTH 必须有 3 人');
  assert(r3birth.some(m => m.id === 'mifune-shioriko'));
  assert(r3birth.some(m => m.id === 'mia-taylor'), 'R3BIRTH 必须包含米雅');
  assert(r3birth.some(m => m.id === 'zhong-lanzhu'), 'R3BIRTH 必须包含岚珠');

  const diverdiva = getSubunit('diverdiva');
  assert.strictEqual(diverdiva.length, 2, 'DiverDiva 必须有 2 人');
  assert(diverdiva.some(m => m.id === 'asaka-karin'));
  assert(diverdiva.some(m => m.id === 'miyashita-ai'));

  const azuna = getSubunit('azuna');
  assert.strictEqual(azuna.length, 3, 'A・ZU・NA 必须有 3 人');

  const qu4rtz = getSubunit('qu4rtz');
  assert.strictEqual(qu4rtz.length, 4, 'QU4RTZ 必须有 4 人');

  // 莲之空
  const cerise = getSubunit('cerise_bouquet');
  assert.strictEqual(cerise.length, 4, 'スリーズブーケ必须有 4 人 (含锦上麦卡)');
  assert(cerise.some(m => m.id === 'maika-kinjo'), 'スリーズブーケ必须包含锦上麦卡');

  const mirakra = getSubunit('mira_cra_park');
  assert.strictEqual(mirakra.length, 4, 'みらくらぱーく！必须有 4 人 (含令泽葵)');
  assert(mirakra.some(m => m.id === 'aoi-reisawa'), 'みらくらぱーく！必须包含令泽葵');

  const tasokare = getSubunit('tasokare_no_rinko');
  assert.strictEqual(tasokare.length, 1, '誰ソ彼ノ燐光必须存在且包含泉');
  assert(tasokare.some(m => m.id === 'izumi-katsuragi'));

  // 紫轮美音绝对不分配小分队
  const mionGroups = db.prepare(`SELECT group_id FROM character_groups WHERE character_id = 'mion-shinowa'`).all() as any[];
  assert.strictEqual(mionGroups.length, 1, '紫轮美音只能在 hasunosora_main，不得猜测小分队');
  assert.strictEqual(mionGroups[0].group_id, 'hasunosora_main');

  // μ's
  assert.strictEqual(getSubunit('printemps').length, 3, 'Printemps 必须有 3 人');
  assert.strictEqual(getSubunit('lily_white').length, 3, 'lily white 必须有 3 人');
  assert.strictEqual(getSubunit('bibi').length, 3, 'BiBi 必须有 3 人');

  // Aqours
  assert.strictEqual(getSubunit('cyaron').length, 3, 'CYaRon! 必须有 3 人');
  assert.strictEqual(getSubunit('azalea').length, 3, 'AZALEA 必须有 3 人');
  assert.strictEqual(getSubunit('guilty_kiss').length, 3, 'Guilty Kiss 必须有 3 人');

  // Liella!
  assert.strictEqual(getSubunit('catchu').length, 3, 'CatChu! 必须有 3 人');
  assert.strictEqual(getSubunit('kaleidoscore').length, 3, 'KALEIDOSCORE 必须有 3 人');
  assert.strictEqual(getSubunit('5yncri5e').length, 5, '5yncri5e! 必须有 5 人');

  console.log('✓ 全部企划分队成员绑定完整正确！');

  console.log('--- 2. 验证不支持角色采集时的明确提示 ---');
  const himeResult = await curateCharacterCostumes('anyoji-hime');
  assert.strictEqual(himeResult.supported, false, '安养寺姬芽必须报告 supported: false');
  assert.strictEqual(himeResult.inserted, 0, '安养寺姬芽自动采集 inserted 必须为 0');
  assert(himeResult.reason && himeResult.reason.includes('暂不支持'), '必须明确提示不支持原因');
  console.log('✓ 不支持角色采集明确返回 supported: false 与具体原因！');

  console.log('--- 3. 验证备份恢复后数据库连接仍保持可用 ---');
  const testZip = path.resolve('./temp_verify_backup.zip');
  try {
    console.log('正在执行打包备份...');
    await createBackupZip(testZip);
    console.log('备份打包完成，大小:', fs.statSync(testZip).size);
    assert(fs.existsSync(testZip));

    console.log('正在执行还原测试...');
    const restoreRes = restoreBackupZip(testZip);
    assert.strictEqual(restoreRes.success, true);

    const rowCount = db.prepare('SELECT COUNT(*) as count FROM characters').get() as any;
    assert(rowCount.count >= 66, '恢复后数据库必须立即可读且拥有完整角色数据');
    console.log('✓ 备份恢复无缝重连，数据库连接完全正常！');
  } catch (err: any) {
    console.error('备份恢复测试详细错误:', err);
    throw err;
  } finally {
    if (fs.existsSync(testZip)) fs.rmSync(testZip, { force: true });
  }

  console.log('====================================================');
  console.log(' 用户提出的全部风险与边界问题已全部通过严格自动化测试！');
  console.log('====================================================');
}

testAll().catch(e => {
  console.error('测试失败:', e);
  process.exit(1);
});
