import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import { DATA_DIR, DB_FILE, UPLOADS_DIR, db } from './db.js';

const require = createRequire(import.meta.url);
const AdmZip = require('adm-zip');

export function createBackupZip(outputPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      // 保证 WAL 数据刷回主库文件
      try {
        db.pragma('wal_checkpoint(TRUNCATE)');
      } catch (e) {
        // ignore
      }

      const zip = new AdmZip();

      // 1. 添加 SQLite 数据库文件
      if (fs.existsSync(DB_FILE)) {
        zip.addLocalFile(DB_FILE);
      }

      // 2. 添加 uploads 目录内容
      if (fs.existsSync(UPLOADS_DIR)) {
        zip.addLocalFolder(UPLOADS_DIR, 'uploads');
      }

      // 3. 添加 manifest.json
      const manifest = {
        version: '0.3.0',
        created_at: new Date().toISOString(),
        backup_type: 'full',
      };
      zip.addFile('manifest.json', Buffer.from(JSON.stringify(manifest, null, 2), 'utf-8'));

      zip.writeZip(outputPath);
      resolve();
    } catch (err) {
      reject(err);
    }
  });
}

export function restoreBackupZip(zipPath: string): { success: boolean; message: string } {
  if (!fs.existsSync(zipPath)) {
    throw new Error('备份文件不存在: ' + zipPath);
  }

  const zip = new AdmZip(zipPath);
  const zipEntries = zip.getEntries();

  // 校验 zip 内是否包含 archive.db
  const hasDb = zipEntries.some((entry: any) => entry.entryName === 'archive.db' || entry.entryName.endsWith('/archive.db'));
  if (!hasDb) {
    throw new Error('无效的备份文件：压缩包内未找到 archive.db 数据库文件');
  }

  // 1. 创建兜底备份 .bak
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.resolve(DATA_DIR, `../data_backup_${timestamp}.bak`);
  if (fs.existsSync(DATA_DIR)) {
    fs.cpSync(DATA_DIR, backupDir, { recursive: true });
  }

  // 2. 解压到临时目录
  const tempExtractDir = path.resolve(DATA_DIR, '../.temp_restore_' + timestamp);
  if (!fs.existsSync(tempExtractDir)) {
    fs.mkdirSync(tempExtractDir, { recursive: true });
  }

  zip.extractAllTo(tempExtractDir, true);

  // 3. 安全复制 db 文件与 uploads 目录
  const extractedDb = path.resolve(tempExtractDir, 'archive.db');
  if (fs.existsSync(extractedDb)) {
    try {
      db.close();
    } catch (e) {
      // ignore
    }
    fs.copyFileSync(extractedDb, DB_FILE);
  }

  const extractedUploads = path.resolve(tempExtractDir, 'uploads');
  if (fs.existsSync(extractedUploads)) {
    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }
    fs.cpSync(extractedUploads, UPLOADS_DIR, { recursive: true });
  }

  // 4. 清理临时解压目录
  try {
    fs.rmSync(tempExtractDir, { recursive: true, force: true });
  } catch (e) {
    // ignore
  }

  return {
    success: true,
    message: `数据恢复成功！已在恢复前自动保存回退副本于: ${backupDir}`,
  };
}
