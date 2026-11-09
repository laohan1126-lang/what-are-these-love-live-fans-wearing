import React from 'react';
import { Shirt, Plus, Sparkles } from 'lucide-react';

interface EmptyStateProps {
  characterName: string;
  onAddCostume: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  characterName,
  onAddCostume,
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
        本资料库严禁生成未经考据的臆想数据。如果你正在收集或考据该角色的 COSPLAY 服装，可以立即录入第一套官方或待识别衣装。
      </p>

      <button
        onClick={onAddCostume}
        className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-950 bg-teal-400 hover:bg-teal-300 transition-all flex items-center gap-2 shadow-[0_0_20px_-5px_rgba(45,212,191,0.5)] active:scale-95"
      >
        <Plus className="w-4 h-4" />
        <span>+ 录入第一套衣装</span>
      </button>
    </div>
  );
};
