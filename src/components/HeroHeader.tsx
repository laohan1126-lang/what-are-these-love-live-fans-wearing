import React from 'react';
import { Sparkles, Database, ShieldCheck, Heart } from 'lucide-react';

interface HeroHeaderProps {
  onOpenBackup: () => void;
  onOpenNewCostume: () => void;
}

export const HeroHeader: React.FC<HeroHeaderProps> = ({
  onOpenBackup,
  onOpenNewCostume,
}) => {
  return (
    <header className="h-18 px-6 flex items-center justify-between border-b border-sky-400/15 bg-[#090f1f]/90 backdrop-blur-md relative z-10">
      {/* 品牌与标题 */}
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400/30 to-sky-600/30 border border-teal-400/40 flex items-center justify-center shadow-[0_0_20px_-3px_rgba(45,212,191,0.3)]">
          <Sparkles className="w-5 h-5 text-teal-300" />
        </div>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold tracking-wide text-slate-100 flex items-center gap-2">
              Love Live! 衣装资料库
            </h1>
            <span className="title-jp text-xs text-teal-300/90 font-medium px-2 py-0.5 rounded bg-teal-500/10 border border-teal-400/25">
              決意の光 · 舞台衣装アーカイブ
            </span>
          </div>
          <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
            <span>个人向 Love Live! 角色与 COS 服装出处考据图鉴</span>
            <span className="w-1 h-1 rounded-full bg-teal-400" />
            <span className="text-[11px] text-teal-400/80">本地离线运行 · 数据安全隔离</span>
          </p>
        </div>
      </div>

      {/* 右侧全局操作区 */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenBackup}
          className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-slate-100 bg-slate-900/80 hover:bg-slate-800 border border-sky-400/20 hover:border-sky-400/40 transition-all flex items-center gap-1.5 shadow-sm"
        >
          <Database className="w-3.5 h-3.5 text-sky-400" />
          <span>本地备份与还原</span>
        </button>

        <button
          onClick={onOpenNewCostume}
          className="px-4 py-1.5 rounded-lg text-xs font-semibold text-slate-950 bg-gradient-to-r from-teal-400 to-emerald-300 hover:from-teal-300 hover:to-emerald-200 transition-all shadow-[0_0_20px_-4px_rgba(45,212,191,0.4)] flex items-center gap-1.5 active:scale-95"
        >
          <Heart className="w-3.5 h-3.5 fill-slate-950" />
          <span>+ 录入新衣装</span>
        </button>
      </div>
    </header>
  );
};
