import React from 'react';
import { Shirt, Plus, Sparkles } from 'lucide-react';

interface EmptyStateProps {
  characterName: string;
  onAddCostume: () => void;
  onCurateCostumes?: () => void;
  isCurating?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  characterName,
  onAddCostume,
  onCurateCostumes,
  isCurating = false,
}) => {
  return (
    <div className="rounded-2xl border border-sky-400/15 bg-gradient-to-b from-slate-900/60 to-slate-950/80 p-12 text-center flex flex-col items-center justify-center max-w-lg mx-auto my-12 backdrop-blur-md">
      <div className="w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-400/25 flex items-center justify-center text-teal-400 mb-4 shadow-[0_0_25px_-5px_rgba(45,212,191,0.3)]">
        <Shirt className="w-8 h-8 stroke-1" />
      </div>

      <h3 className="text-base font-bold text-slate-200 mb-1">
        暂未收录【{characterName}】的衣装档案
      </h3>

      <p className="text-xs text-slate-400 max-w-sm mb-6 leading-relaxed">
        本资料库遵循严谨的官方考据原则。您可以一键启动自动化脚本检索官方维基与数据库，自动下载立绘并入库；也可手动录入。
      </p>

      <div className="flex items-center gap-3">
        {onCurateCostumes && (
          <button
            onClick={onCurateCostumes}
            disabled={isCurating}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-[0_0_20px_-5px_rgba(14,165,233,0.5)] active:scale-95 ${
              isCurating
                ? 'bg-sky-500/30 text-sky-200 border border-sky-400/40 cursor-wait'
                : 'text-slate-950 bg-sky-400 hover:bg-sky-300'
            }`}
          >
            <Sparkles className={`w-4 h-4 ${isCurating ? 'animate-spin' : ''}`} />
            <span>{isCurating ? '正在检索下载中...' : '自动扩充官方图鉴'}</span>
          </button>
        )}

        <button
          onClick={onAddCostume}
          className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-all flex items-center gap-1.5 border border-white/10 active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>手动录入</span>
        </button>
      </div>
    </div>
  );
};
