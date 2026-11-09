import React from 'react';
import { Project } from '../types';
import { Sparkles, Users, Database, ChevronRight } from 'lucide-react';

interface TopNavProps {
  projects: Project[];
  selectedProjectId: string;
  onSelectProject: (id: string) => void;
  onOpenDrawer: () => void;
  onOpenBackup: () => void;
  currentCharacterNameZh?: string;
}

export const TopNav: React.FC<TopNavProps> = ({
  projects,
  selectedProjectId,
  onSelectProject,
  onOpenDrawer,
  onOpenBackup,
  currentCharacterNameZh,
}) => {
  return (
    <header className="h-14 px-6 border-b border-white/[0.08] bg-[#070b16]/95 backdrop-blur-xl flex items-center justify-between sticky top-0 z-40 select-none">
      {/* 品牌与标题 */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2.5">
          <span className="serif-title text-base font-bold tracking-wider text-slate-100 flex items-center gap-1.5">
            <span className="text-teal-400 font-mono text-sm">LL!</span>
            <span>COSTUME ARCHIVE</span>
          </span>
          <span className="title-jp text-[11px] text-teal-300/80 font-normal hidden sm:inline-block px-1.5 py-0.5 rounded bg-teal-500/10 border border-teal-400/20">
            決意の光 · 舞台衣装考証手帖
          </span>
        </div>

        {/* 企划横向切换 Tab */}
        <nav className="hidden md:flex items-center gap-1 pl-4 border-l border-white/[0.08]" aria-label="企划系列">
          {projects.map(p => {
            const isSelected = p.id === selectedProjectId;
            return (
              <button
                key={p.id}
                onClick={() => onSelectProject(p.id)}
                className={`text-xs px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'text-teal-300 bg-white/[0.06] font-medium border-b-2 border-teal-400'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
                }`}
              >
                <span>{p.name_zh}</span>
                <span className="text-[10px] font-mono text-slate-500">
                  {p.active_count ?? 0}/{p.total_count ?? 0}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* 右侧：成员选择抽屉按钮与备份 */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenDrawer}
          className="text-xs px-3 py-1.5 rounded-lg bg-teal-500/15 hover:bg-teal-500/25 text-teal-300 border border-teal-400/30 font-medium transition-all flex items-center gap-2"
        >
          <Users className="w-3.5 h-3.5 text-teal-400" />
          <span>当前：{currentCharacterNameZh || '选择成员'}</span>
          <ChevronRight className="w-3.5 h-3.5 text-teal-400/70" />
        </button>

        <button
          onClick={onOpenBackup}
          className="text-xs px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/[0.05] transition-all flex items-center gap-1.5"
          title="本地备份与还原"
        >
          <Database className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">备份</span>
        </button>
      </div>
    </header>
  );
};
