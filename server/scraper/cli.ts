import { curateCharacterCostumes, curateAllSupportedCharacters } from './curator.js';
import { IDOL_STORY_SLUGS } from './sources/idolstory.js';
import { db } from '../db.js';

async function main() {
  const args = process.argv.slice(2);
  let characterArg = '';
  let allFlag = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--character' || args[i] === '-c') {
      characterArg = args[i + 1] || '';
      i++;
    } else if (args[i] === '--all') {
      allFlag = true;
    }
  }

  console.log('========================================================');
  console.log('   Love Live! 衣装自动化图鉴采集与考据流水线');
  console.log('========================================================');

  if (allFlag) {
    console.log('[CLI] 开始全量角色同步...');
    const results = await curateAllSupportedCharacters();
    console.log('[CLI] 全量同步完成！汇总:');
    let totalInserted = 0;
    for (const [id, res] of Object.entries(results)) {
      console.log(` - ${res.characterName}: 新增 ${res.inserted} 套, 跳过 ${res.skipped} 套`);
      totalInserted += res.inserted;
    }
    console.log(`[CLI] 总计新收录 ${totalInserted} 套正式衣装！`);
    return;
  }

  if (!characterArg) {
    // 默认采集三船栞子
    characterArg = 'shioriko_mifune';
    console.log('[CLI] 未指定角色，默认同步三船栞子 (shioriko_mifune)');
  }

  // 尝试匹配 characterId 或中文名/日文名
  let targetCharId = characterArg;
  if (!IDOL_STORY_SLUGS[targetCharId]) {
    const cleanArg = characterArg.replace(/\s+/g, '');
    const row = db.prepare(`
      SELECT id FROM characters
      WHERE REPLACE(name_ja, ' ', '') LIKE ?
         OR REPLACE(name_zh, ' ', '') LIKE ?
         OR id LIKE ?
      LIMIT 1
    `).get(`%${cleanArg}%`, `%${cleanArg}%`, `%${cleanArg}%`) as any;
    if (row) {
      targetCharId = row.id;
    } else {
      console.error(`[CLI] 未找到匹配的角色: "${characterArg}"`);
      process.exit(1);
    }
  }

  console.log(`[CLI] 正在为 [${targetCharId}] 执行自动化采集与考据入库...`);
  const result = await curateCharacterCostumes(targetCharId, 2);

  console.log('\n---------------- 采集考据结果 ----------------');
  console.log(`目标角色: ${result.characterName} (${result.characterId})`);
  console.log(`检索发现: ${result.totalFound} 套候选衣装`);
  console.log(`成功入库: ${result.inserted} 套`);
  console.log(`跳过重复: ${result.skipped} 套`);
  console.log(`处理失败: ${result.failed} 套`);
  console.log('--------------------------------------------\n');

  for (const item of result.items) {
    const symbol = item.status === 'inserted' ? '✓' : item.status === 'skipped' ? '↷' : '✗';
    console.log(` ${symbol} [${item.status.toUpperCase()}] ${item.nameJa} ${item.reason ? `(${item.reason})` : ''}`);
  }
}

main().catch(err => {
  console.error('[CLI] 运行时异常:', err);
  process.exit(1);
});
