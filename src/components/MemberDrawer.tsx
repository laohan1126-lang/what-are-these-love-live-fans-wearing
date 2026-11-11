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
    <div className="fixed inset-0 z-50 flex justify-end bg-[#070b12]/85 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="w-full max-w-md h-full bg-[#090e17] border-l border-[#e5b869]/30 flex flex-col justify-between overflow-hidden">
        {/* 顶部标题 */}
        <div className="px-6 py-4 border-b border-[#e5b869]/25 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Users className="w-4 h-4 text-[#e5b869]" />
            <div>
              <span className="font-mono text-[10px] text-[#2dd4bf] uppercase tracking-[0.2em] block">
                TROUPE ROSTER · 剧团名簿
              </span>
              <h2 className="serif-title text-sm font-bold text-slate-100 m-0">
                切换企划学园与在籍成员
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-mono text-slate-400 hover:text-[#e5b869] flex items-center gap-1 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
            <span>[ESC]</span>
          </button>
        </div>

        {/* 内容区 */}
        <div className="flex-1 overflow-y-auto px-6 py-5 divide-y divide-[#e5b869]/20 space-y-5">
          {/* 1. 企划切换 */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#e5b869] block">
              01 · PROJECT ARCHIVE · 企划系列
            </label>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              {projects.map((p, idx) => {
                const isSelected = p.id === selectedProjectId;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      onSelectProject(p.id);
                      onSelectGroup(null);
                    }}
                    className={`text-left py-2 border-b text-xs transition-colors cursor-pointer ${
                      isSelected
                        ? 'border-[#e5b869] text-[#f5f0e6] font-semibold'
                        : 'border-white/[0.08] text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="block truncate">
                      <span className="font-mono text-[10px] text-[#e5b869] mr-1">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      {p.name_zh}
                    </span>
                    <span className="block text-[10px] text-slate-500 font-mono mt-0.5">
                      ROSTER {p.total_count ?? 0}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. 队伍与在籍状态切换 */}
          {currentProject && (
            <div className="pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#2dd4bf]">
                  02 · SUB-UNIT & STATUS · 分队与在籍
                </span>
                <div className="flex items-center gap-3 text-[11px] font-mono">
                  <button
                    type="button"
                    onClick={() => onToggleStatusFilter('active')}
                    className={`pb-0.5 border-b cursor-pointer ${
                      statusFilter === 'active'
                        ? 'border-[#2dd4bf] text-[#2dd4bf] font-bold'
                        : 'border-transparent text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    现役在籍
                  </button>
                  <button
                    type="button"
                    onClick={() => onToggleStatusFilter('all')}
                    className={`pb-0.5 border-b cursor-pointer ${
                      statusFilter === 'all'
                        ? 'border-[#2dd4bf] text-[#2dd4bf] font-bold'
                        : 'border-transparent text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    历代全员
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-x-4 gap-y-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => onSelectGroup(null)}
                  className={`text-xs pb-1 border-b transition-colors cursor-pointer ${
                    selectedGroupId === null
                      ? 'border-[#e5b869] text-[#f5f0e6] font-semibold'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  全团
                </button>
                {currentProject.groups?.map(g => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => onSelectGroup(g.id)}
                    className={`text-xs pb-1 border-b transition-colors cursor-pointer ${
                      selectedGroupId === g.id
                        ? 'border-[#e5b869] text-[#f5f0e6] font-semibold'
                        : 'border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {g.name_zh || g.name_ja}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 3. 搜索与成员列表 */}
          <div className="pt-4 space-y-3">
            <div className="relative border-b border-[#e5b869]/30 pb-1">
              <Search className="w-3.5 h-3.5 absolute left-0 top-1/2 -translate-y-1/2 text-[#e5b869]" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="检索角色名 (中/日)..."
                className="w-full pl-6 pr-2 py-1 text-xs bg-transparent text-slate-100 placeholder-slate-500 focus:outline-none"
              />
            </div>

            <div className="divide-y divide-white/[0.06] max-h-96 overflow-y-auto pr-1">
              {filteredCharacters.map(char => {
                const isSelected = char.id === selectedCharacterId;
                return (
                  <button
                    key={char.id}
                    type="button"
                    onClick={() => {
                      onSelectCharacter(char.id);
                      onClose();
                    }}
                    className={`w-full text-left py-2.5 text-xs transition-colors flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'text-[#f5f0e6] font-semibold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span
                        className="w-2 h-2 rotate-45 flex-none"
                        style={{ backgroundColor: char.color_hex || '#2dd4bf' }}
                      />
                      <div className="truncate">
                        <span className="serif-title font-bold block truncate leading-tight">
                          {char.name_zh}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono block truncate leading-tight">
                          {char.name_ja}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-none pl-2 font-mono text-[10px]">
                      {char.enrollment_term && (
                        <span className="text-slate-500">{char.enrollment_term}</span>
                      )}
                      <span
                        className={
                          (char.costume_count ?? 0) > 0 ? 'text-[#2dd4bf]' : 'text-slate-600'
                        }
                      >
                        {String(char.costume_count ?? 0).padStart(2, '0')} 卷
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 底部关闭按钮 */}
        <div className="px-6 py-4 border-t border-[#e5b869]/25 text-center">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-1.5 text-xs font-mono uppercase tracking-[0.2em] text-slate-400 hover:text-[#e5b869] cursor-pointer"
          >
            CLOSE ROSTER · 收起名簿
          </button>
        </div>
      </div>
    </div>
  );
};
