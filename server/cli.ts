import path from 'path';
import fs from 'fs';
import { createBackupZip, restoreBackupZip } from './backup.js';
import { DATA_DIR } from './db.js';

const command = process.argv[2];

async function main() {
  if (command === 'backup') {
    const backupFolder = path.resolve(DATA_DIR, '../backups');
    if (!fs.existsSync(backupFolder)) {
      fs.mkdirSync(backupFolder, { recursive: true });
    }
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const targetZip = path.resolve(backupFolder, `backup_${timestamp}.zip`);
    console.log(`正在创建本地完整备份至: ${targetZip}...`);
    await createBackupZip(targetZip);
    console.log(`✓ 备份创建完成！文件大小: ${(fs.statSync(targetZip).size / 1024).toFixed(1)} KB`);
  } else if (command === 'restore') {
    const targetZip = process.argv[3];
    if (!targetZip) {
      console.error('用法: tsx server/cli.ts restore <path-to-backup.zip>');
      process.exit(1);
    }
    console.log(`正在从 ${targetZip} 恢复数据...`);
    const result = restoreBackupZip(targetZip);
    console.log(`✓ ${result.message}`);
  } else {
    console.log('可用命令: backup | restore <zipfile>');
  }
}

main().catch(err => {
  console.error('执行失败:', err);
  process.exit(1);
});
