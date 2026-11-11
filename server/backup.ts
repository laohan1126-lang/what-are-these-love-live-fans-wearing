import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import { DATA_DIR, DB_FILE, UPLOADS_DIR, db, reopenDatabase } from './db.js';

const require = createRequire(import.meta.url);
const AdmZip = require('adm-zip');

export function createBackupZip(outputPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      // 保证 WAL 数据安全合并
      try {
        db.pragma('wal_checkpoint(PASSIVE)');
      } catch (e) {
        // ignore
      }

      const zip = new AdmZip();

      // 1. 添加 SQLite 数据库文件及活跃 WAL 文件
      if (fs.existsSync(DB_FILE)) {
        zip.addLocalFile(DB_FILE);
      }
      const walFile = DB_FILE + '-wal';
      if (fs.existsSync(walFile) && fs.statSync(walFile).size > 0) {
        zip.addLocalFile(walFile);
      }

      // 2. 添加 uploads 目录内容（忽略瞬态 tmp-* 临时文件或并发消失的文件）
      if (fs.existsSync(UPLOADS_DIR)) {
        const files = fs.readdirSync(UPLOADS_DIR);
        for (const name of files) {
          if (name.startsWith('tmp-')) continue;
          const filePath = path.resolve(UPLOADS_DIR, name);
          try {
            if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
              zip.addLocalFile(filePath, 'uploads');
            }
          } catch {
            // 忽略并发清理中的瞬态文件
          }
        }
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

  // 1. 创建兜底备份 .bak (排除内存映射锁定的 -shm 文件)
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.resolve(DATA_DIR, `../data_backup_${timestamp}.bak`);
  try {
    if (fs.existsSync(DATA_DIR)) {
      fs.cpSync(DATA_DIR, backupDir, {
        recursive: true,
        filter: (src) => !src.endsWith('-shm'),
      });
    }
  } catch (e) {
    // 忽略特定锁文件的拷贝异常
  }

  // 2. 解压到临时目录
  const tempExtractDir = path.resolve(DATA_DIR, '../.temp_restore_' + timestamp);
  if (!fs.existsSync(tempExtractDir)) {
    fs.mkdirSync(tempExtractDir, { recursive: true });
  }

  zip.extractAllTo(tempExtractDir, true);

  // 3. 安全处理数据库与 uploads
  try {
    if (db && db.open) {
      db.close();
    }
  } catch (e) {
    // ignore
  }

  const extractedDb = path.resolve(tempExtractDir, 'archive.db');
  if (fs.existsSync(extractedDb)) {
    try {
      const walFile = DB_FILE + '-wal';
      const shmFile = DB_FILE + '-shm';
      if (fs.existsSync(walFile)) fs.writeFileSync(walFile, Buffer.alloc(0));
      if (fs.existsSync(shmFile)) fs.writeFileSync(shmFile, Buffer.alloc(0));
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
    try {
      const files = fs.readdirSync(extractedUploads);
      for (const file of files) {
        const src = path.resolve(extractedUploads, file);
        const dest = path.resolve(UPLOADS_DIR, file);
        if (fs.statSync(src).isFile()) {
          try {
            fs.copyFileSync(src, dest);
          } catch (e) {
            // ignore individual busy file
          }
        }
      }
    } catch (e: any) {
      console.warn('Uploads restore warning:', e.message);
    }
  }

  // 4. 重新建立数据库连接并验证可用性
  reopenDatabase();
  try {
    db.prepare('SELECT COUNT(*) FROM characters').get();
  } catch (err: any) {
    throw new Error('恢复后数据库校验失败: ' + err.message);
  }

  // 5. 清理临时解压目录
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
