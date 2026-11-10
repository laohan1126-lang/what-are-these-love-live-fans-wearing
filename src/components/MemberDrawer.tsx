import React, { useState } from 'react';
import { Project, Group, Character } from '../types';
import { X, Search, Users, ChevronRight } from 'lucide-react';

interface MemberDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  selectedProjectId: string;
  onSelectProject: (id: string) => void;
  selectedGroupId: string | null;
  onSelectGroup: (id: string | null) => void;
  characters: Character[];
  selectedCharacterId: string;
  onSelectCharacter: (id: string) => void;
  statusFilter: 'active' | 'all';
  onToggleStatusFilter: (status: 'active' | 'all') => void;
}

export const MemberDrawer: React.FC<MemberDrawerProps> = ({
  isOpen,
  onClose,
  projects,
  selectedProjectId,
  onSelectProject,
  selectedGroupId,
  onSelectGroup,
  characters,
  selectedCharacterId,
  onSelectCharacter,
  statusFilter,
  onToggleStatusFilter,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const currentProject = projects.find(p => p.id === selectedProjectId);

  const filteredCharacters = characters.filter(c => {
    return (
      c.name_ja.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.name_zh.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="w-full max-w-md h-full bg-[#0a0f1d] border-l border-white/[0.08] shadow-2xl flex flex-col justify-between overflow-hidden">
        {/* 顶部标题 */}
        <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-teal-400" />
            <h2 className="text-sm font-bold text-slate-100">切换企划成员与阵容</h2>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg hover:bg-white/[0.08] text-slate-400 hover:text-white flex items-center justify-center transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 内容区 */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* 1. 企划切换 */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">
              企划系列
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {projects.map(p => {
                const isSelected = p.id === selectedProjectId;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      onSelectProject(p.id);
                      onSelectGroup(null);
                    }}
                    className={`text-left p-2 rounded-lg text-xs transition-all border ${
                      isSelected
                        ? 'bg-teal-500/15 border-teal-400/40 text-teal-300 font-medium'
                        : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]'
                    }`}
                  >
                    <span className="block truncate font-semibold">{p.name_zh}</span>
                    <span className="block text-[10px] text-slate-500 font-mono mt-0.5">
                      共 {p.total_count ?? 0} 位角色
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. 队伍与在籍状态切换 */}
          {currentProject && (
            <div className="space-y-2 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-slate-400">分队阵容</span>
                <div className="flex items-center rounded-md bg-slate-900 border border-white/10 p-0.5 text-[10px]">
                  <button
                    onClick={() => onToggleStatusFilter('active')}
                    className={`px-2 py-0.5 rounded ${
                      statusFilter === 'active'
                        ? 'bg-teal-400 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    现役在籍
                  </button>
                  <button
                    onClick={() => onToggleStatusFilter('all')}
                    className={`px-2 py-0.5 rounded ${
                      statusFilter === 'all'
                        ? 'bg-teal-400 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    历代全员
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 pt-1">
                <button
                  onClick={() => onSelectGroup(null)}
                  className={`text-[11px] px-2.5 py-1 rounded-md transition-all ${
                    selectedGroupId === null
                      ? 'bg-teal-500/20 text-teal-200 border border-teal-400/40 font-medium'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-transparent'
                  }`}
                >
                  全团
                </button>
                {currentProject.groups?.map(g => (
                  <button
                    key={g.id}
                    onClick={() => onSelectGroup(g.id)}
                    className={`text-[11px] px-2.5 py-1 rounded-md transition-all ${
                      selectedGroupId === g.id
                        ? 'bg-teal-500/20 text-teal-200 border border-teal-400/40 font-medium'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-transparent'
                    }`}
                  >
                    {g.name_zh || g.name_ja}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 3. 搜索与成员列表 */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="快速检索角色名 (中/日)..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-900/90 border border-white/10 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-400"
              />
            </div>

            <div className="space-y-1 max-h-96 overflow-y-auto pr-1">
              {filteredCharacters.map(char => {
                const isSelected = char.id === selectedCharacterId;
                return (
                  <button
                    key={char.id}
                    onClick={() => {
                      onSelectCharacter(char.id);
                      onClose();
                    }}
                    className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-center justify-between border ${
                      isSelected
                        ? 'bg-teal-500/15 text-teal-200 border-teal-400/40 font-medium'
                        : 'text-slate-300 hover:bg-white/[0.04] border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-none"
                        style={{ backgroundColor: char.color_hex || '#2dd4bf' }}
                      />
                      <div className="truncate">
                        <span className="font-semibold block truncate leading-tight">
                          {char.name_zh}
                        </span>
                        <span className="text-[10px] text-slate-500 block truncate leading-tight">
                          {char.name_ja}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-none pl-2">
                      {char.enrollment_term && (
                        <span className="text-[10px] text-slate-500 font-mono">
                          {char.enrollment_term}
                        </span>
                      )}
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                          (char.costume_count ?? 0) > 0
                            ? 'bg-teal-500/20 text-teal-300'
                            : 'bg-white/[0.05] text-slate-500'
                        }`}
                      >
                        {char.costume_count ?? 0}套
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 底部关闭按钮 */}
        <div className="p-4 border-t border-white/[0.08] bg-slate-900/90 text-center">
          <button
            onClick={onClose}
            className="w-full py-2 text-xs font-semibold text-slate-400 hover:text-white"
          >
            完成选择
          </button>
        </div>
      </div>
    </div>
  );
};
