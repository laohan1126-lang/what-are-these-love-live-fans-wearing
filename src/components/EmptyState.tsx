import React from 'react';
import { Plus, Sparkles } from 'lucide-react';

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
    <div className="border-y border-[#e5b869]/25 py-12 px-6 text-center flex flex-col items-center justify-center max-w-xl mx-auto my-8 select-none">
      <span className="font-mono text-[10px] tracking-[0.25em] text-[#e5b869] uppercase mb-2">
        EMPTY FOLIO · 尚无收录卷宗
      </span>

      <h3 className="serif-title text-xl font-bold text-slate-100 mb-2">
        暂未著录【{characterName}】的衣装手帖
      </h3>

      <p className="text-xs text-slate-400 max-w-md mb-6 leading-relaxed">
        本手帖严守数据真实性原则，未核实衣装绝不伪造占位。您可启动社区卡面检索入库（自动标记为待核实），或手动著录首套官方衣装。
      </p>

      <div className="flex items-center gap-4">
        {onCurateCostumes && (
          <button
            id="action-curate"
            type="button"
            onClick={onCurateCostumes}
            disabled={isCurating}
            className="atelier-zone px-4 py-2 bg-[#2dd4bf] hover:bg-[#5eead4] text-[#041210] text-xs font-bold tracking-wider flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isCurating ? 'animate-spin' : ''}`} />
            <span>{isCurating ? '正在检索卡面中…' : '✦ 补录社区卡面'}</span>
          </button>
        )}

        <button
          id="action-add"
          type="button"
          onClick={onAddCostume}
          className="atelier-zone px-4 py-2 border-b border-[#e5b869]/60 hover:border-[#e5b869] bg-white/[0.04] hover:bg-white/[0.08] text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 text-[#e5b869]" />
          <span>+ 手动著录衣装</span>
        </button>
      </div>
    </div>
  );
};
