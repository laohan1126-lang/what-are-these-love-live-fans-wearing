import React, { useState } from 'react';
import { Project, Group, Character } from '../types';
import { Users, Search, Sparkles, Filter, Music, ChevronRight } from 'lucide-react';

interface SidebarProps {
  projects: Project[];
  selectedProjectId: string;
  onSelectProject: (id: string) => void;
  selectedGroupId: string | null;
  onSelectGroup: (id: string | null) => void;
  characters: Character[];
  selectedCharacterId: string;
  onSelectCharacter: (id: string) => void;
  activeStatusFilter: 'active' | 'all';
  onToggleStatusFilter: (status: 'active' | 'all') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  projects,
  selectedProjectId,
  onSelectProject,
  selectedGroupId,
  onSelectGroup,
  characters,
  selectedCharacterId,
  onSelectCharacter,
  activeStatusFilter,
  onToggleStatusFilter,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const currentProject = projects.find(p => p.id === selectedProjectId);

  const filteredCharacters = characters.filter(c => {
    const matchesSearch =
      c.name_ja.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.name_zh.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <aside className="w-80 flex-none flex flex-col h-[calc(100vh-4.5rem)] bg-[#090f1f]/80 backdrop-blur-xl border-r border-sky-400/15 overflow-hidden">
      {/* 企划选择器 */}
      <div className="p-3 border-b border-sky-400/15">
        <label className="text-[11px] font-medium tracking-wider text-teal-400 uppercase flex items-center gap-1.5 mb-2">
          <Music className="w-3.5 h-3.5 text-teal-300" />
          企划与团体系列
        </label>
        <div className="space-y-1">
          {projects.map(proj => {
            const isSelected = proj.id === selectedProjectId;
            return (
              <button
                key={proj.id}
                onClick={() => {
                  onSelectProject(proj.id);
                  onSelectGroup(null);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all flex items-center justify-between group ${
                  isSelected
                    ? 'bg-teal-500/15 text-teal-300 border border-teal-500/40 shadow-[0_0_15px_-3px_rgba(45,212,191,0.25)]'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-slate-100 border border-transparent'
                }`}
              >
                <div className="truncate">
                  <span className="font-semibold block truncate">{proj.name_zh}</span>
                  <span className="text-[10px] text-slate-400 block truncate">{proj.name_ja}</span>
                </div>
                <div className="text-right flex-none pl-2">
                  <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-slate-900/80 border border-sky-400/20 text-teal-300">
                    {proj.active_count ?? 0}
                    <span className="text-[9px] text-slate-400">/{proj.total_count ?? 0}</span>
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 小分队筛选与在籍/历代切换 */}
      {currentProject && (
        <div className="px-3 py-2 border-b border-sky-400/10 bg-slate-950/40">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] text-slate-400 font-medium">队伍与分队</span>
            <div className="flex items-center rounded-md bg-slate-900/90 border border-sky-400/20 p-0.5 text-[10px]">
              <button
                onClick={() => onToggleStatusFilter('active')}
                className={`px-2 py-0.5 rounded ${
                  activeStatusFilter === 'active'
                    ? 'bg-teal-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                在籍
              </button>
              <button
                onClick={() => onToggleStatusFilter('all')}
                className={`px-2 py-0.5 rounded ${
                  activeStatusFilter === 'all'
                    ? 'bg-teal-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                历代全员
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-1">
            <button
              onClick={() => onSelectGroup(null)}
              className={`text-[11px] px-2.5 py-1 rounded-md transition-all ${
                selectedGroupId === null
                  ? 'bg-teal-400/20 text-teal-200 border border-teal-400/40'
                  : 'bg-slate-900/70 text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              全部阵容
            </button>
            {currentProject.groups?.map(grp => (
              <button
                key={grp.id}
                onClick={() => onSelectGroup(grp.id)}
                className={`text-[11px] px-2.5 py-1 rounded-md transition-all ${
                  selectedGroupId === grp.id
                    ? 'bg-teal-400/20 text-teal-200 border border-teal-400/40'
                    : 'bg-slate-900/70 text-slate-400 hover:text-slate-200 border border-transparent'
                }`}
              >
                {grp.name_zh || grp.name_ja}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 角色搜索与列表 */}
      <div className="p-3 pb-1">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="搜索角色名 (中/日)..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-900/90 border border-sky-400/20 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400/40"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
        {filteredCharacters.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500">
            未找到匹配角色
          </div>
        ) : (
          filteredCharacters.map(char => {
            const isSelected = char.id === selectedCharacterId;
            return (
              <button
                key={char.id}
                onClick={() => onSelectCharacter(char.id)}
                className={`w-full text-left p-2.5 rounded-lg text-xs transition-all flex items-center justify-between group ${
                  isSelected
                    ? 'bg-gradient-to-r from-teal-500/20 to-sky-500/10 text-teal-200 border-l-4 border-l-teal-400 border border-teal-400/30 shadow-[0_0_15px_-4px_rgba(45,212,191,0.3)]'
                    : 'text-slate-300 hover:bg-slate-800/50 hover:text-slate-100 border-l-4 border-l-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-none shadow-sm"
                    style={{ backgroundColor: char.color_hex || '#2dd4bf' }}
                  />
                  <div className="truncate">
                    <span className="font-semibold block truncate leading-tight">
                      {char.name_zh}
                    </span>
                    <span className="text-[10px] text-slate-400 block truncate leading-tight mt-0.5">
                      {char.name_ja}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-none pl-2">
                  {char.enrollment_term && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-400 border border-slate-700">
                      {char.enrollment_term}
                    </span>
                  )}
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                      (char.costume_count ?? 0) > 0
                        ? 'bg-teal-500/20 text-teal-300 border border-teal-400/30'
                        : 'bg-slate-800/50 text-slate-500'
                    }`}
                  >
                    {char.costume_count ?? 0}套
                  </span>
                </div>
              </button>
            );
          })
        )}
      </div>
    </aside>
  );
};
