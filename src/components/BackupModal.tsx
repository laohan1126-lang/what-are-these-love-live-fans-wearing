import React, { useState } from 'react';
import { X, Download, Upload, ShieldAlert, CheckCircle, Database, AlertCircle } from 'lucide-react';
import { restoreBackup } from '../services/api';

interface BackupModalProps {
  onClose: () => void;
  onRestoreSuccess: () => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({
  onClose,
  onRestoreSuccess,
}) => {
  const [isRestoring, setIsRestoring] = useState(false);
  const [resultMsg, setResultMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleDownload = () => {
    window.location.href = '/api/backup';
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!confirm('警告：还原备份将恢复压缩包内的数据库与图片。系统会在覆盖前自动在磁盘创建 .bak 副本。是否确认继续？')) {
      e.target.value = '';
      return;
    }

    setIsRestoring(true);
    setResultMsg(null);
    try {
      const res = await restoreBackup(file);
      setResultMsg({ type: 'success', text: res.message });
      onRestoreSuccess();
    } catch (err: any) {
      setResultMsg({ type: 'error', text: err.message || '还原失败' });
    } finally {
      setIsRestoring(false);
      e.target.value = '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#0c1427] border border-sky-400/20 rounded-2xl p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-sky-400/10 pb-3">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-teal-400" />
            <h3 className="text-sm font-bold text-slate-100">本地数据备份与还原</h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-100 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {resultMsg && (
          <div
            className={`p-3 rounded-xl text-xs flex items-start gap-2 border ${
              resultMsg.type === 'success'
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/15 border-rose-500/30 text-rose-300'
            }`}
          >
            {resultMsg.type === 'success' ? (
              <CheckCircle className="w-4 h-4 flex-none mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 flex-none mt-0.5" />
            )}
            <div className="flex-1 leading-relaxed">{resultMsg.text}</div>
          </div>
        )}

        <div className="space-y-4 text-xs text-slate-300">
          {/* 备份导出 */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-sky-400/10 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-slate-200">
              <Download className="w-4 h-4 text-sky-400" />
              <span>导出完整数据快照包 (ZIP)</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              将当前的 SQLite 数据库（元数据、主题、出处）和本地图片库（`data/uploads/`）打包下载为一个 ZIP 快照，随时随地备份到任意硬盘。
            </p>
            <button
              onClick={handleDownload}
              className="w-full mt-2 py-2 px-3 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-400/30 font-semibold transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-3.5 h-3.5" />
              <span>立即下载 ZIP 备份</span>
            </button>
          </div>

          {/* 还原导入 */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-sky-400/10 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-slate-200">
              <Upload className="w-4 h-4 text-amber-400" />
              <span>从 ZIP 备份包恢复数据</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              重装系统或迁移数据后，选择历史备份 ZIP 包即可一键还原。系统在覆盖前会自动在磁盘保留一份 `.bak` 备份，安全无虞。
            </p>

            <label className="w-full mt-2 py-2 px-3 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-400/30 font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              <span>{isRestoring ? '正在还原恢复...' : '选择 ZIP 备份文件还原'}</span>
              <input
                type="file"
                accept=".zip"
                disabled={isRestoring}
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div className="text-[10px] text-slate-500 text-center">
          所有数据仅存放在本地机器中，绝不上传任何外部云端。
        </div>
      </div>
    </div>
  );
};
