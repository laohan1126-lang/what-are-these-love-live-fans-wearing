import React, { useState, useRef, useEffect } from 'react';
import { Project, Character } from '../types';
import { Search, Database, ChevronDown, Check, X, Users, EyeOff, Eye } from 'lucide-react';

interface TopNavProps {
  projects: Project[];
  selectedProjectId: string;
  onSelectProject: (id: string) => void;
  characters: Character[];
  allCharacters: Character[];
  selectedCharacterId: string;
  onSelectCharacter: (charId: string, projectId?: string) => void;
  onOpenBackup: () => void;
  onOpenDrawer?: () => void;
  hideCharacterMode?: boolean;
  onToggleHideCharacter?: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  projects,
  selectedProjectId,
  onSelectProject,
  characters,
  allCharacters,
  selectedCharacterId,
  onSelectCharacter,
  onOpenBackup,
  onOpenDrawer,
  hideCharacterMode = false,
  onToggleHideCharacter,
}) => {
  const [dropdownProjectId, setDropdownProjectId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const navRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setDropdownProjectId(null);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDropdownProjectId(null);
        setIsSearchFocused(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleProjectClick = (projectId: string) => {
    onSelectProject(projectId);
    setDropdownProjectId(prev => (prev === projectId ? null : projectId));
  };

  const dropdownCharacters = allCharacters.filter(c => {
    if (!dropdownProjectId) return false;
    const targetProject = projects.find(proj => proj.id === dropdownProjectId);
    if (!targetProject?.groups) return false;
    const targetGroupIds = new Set(targetProject.groups.map(grp => grp.id));
    return c.groups?.some(g => targetGroupIds.has(g.group_id));
  });

  const searchResults = searchQuery.trim()
    ? allCharacters
        .filter(c => {
          const q = searchQuery.trim().toLowerCase();
          return (
            c.name_zh.toLowerCase().includes(q) ||
            c.name_ja.toLowerCase().includes(q) ||
            c.id.toLowerCase().includes(q)
          );
        })
        .slice(0, 8)
    : [];

  const shortProjectLabel = (nameZh: string) => {
    if (nameZh.includes('虹咲')) return '虹咲学园';
    if (nameZh.includes('莲之空')) return '莲之空';
    if (nameZh.includes('いきづらい')) return 'いきづらい部';
    return nameZh;
  };

  return (
    <header className="h-11 px-4 lg:px-8 border-b border-[#e5b869]/20 bg-transparent flex items-center justify-between relative z-40 select-none">
      {/* 左侧：排印天际线品牌字标（零盒子包裹） */}
      <div className="flex items-center gap-3.5 xl:gap-5 min-w-0" ref={navRef}>
        <div className="flex items-baseline gap-2 flex-none">
          <span className="serif-title text-lg font-bold tracking-tight text-slate-100">
            衣<span className="text-[#2dd4bf]">桁</span>
            <span className="text-[#e5b869] italic">.</span>
          </span>
          <span className="hidden sm:inline-block font-mono text-[9px] tracking-[0.2em] text-[#e5b869]/85 uppercase">
            <span className="hidden 2xl:inline">STAGE ATELIER · </span>LL! FOLIO
          </span>
        </div>

        {/* 企划横向文字刻度尺（无圆角按钮外框，纯排印下划线，单行不折行） */}
        <nav
          className="hidden lg:flex items-center gap-2.5 xl:gap-4 pl-3.5 border-l border-[#e5b869]/20 relative whitespace-nowrap"
          aria-label="企划系列刻度"
        >
          {projects.map((p, idx) => {
            const isSelected = p.id === selectedProjectId;
            const isDropdownOpen = dropdownProjectId === p.id;
            const serial = String(idx + 1).padStart(2, '0');
            return (
              <div key={p.id} className="relative flex-none">
                <button
                  type="button"
                  onClick={() => handleProjectClick(p.id)}
                  className={`skyline-tab atelier-zone text-xs flex items-baseline gap-1 cursor-pointer whitespace-nowrap ${
                    isSelected ? 'is-active font-semibold text-slate-100' : ''
                  }`}
                  title={`点击切换 ${p.name_zh} 并展开成员名簿`}
                >
                  <span className="font-mono text-[9px] text-[#e5b869]/80">{serial}</span>
                  <span>{shortProjectLabel(p.name_zh)}</span>
                  <span className="text-[10px] font-mono text-[#2dd4bf]/85 tabular-nums">
                    /{p.total_count ?? 0}
                  </span>
                  <ChevronDown
                    className={`w-2.5 h-2.5 self-center transition-transform duration-200 ${
                      isDropdownOpen ? 'rotate-180 text-[#2dd4bf]' : 'text-slate-500'
                    }`}
                  />
                </button>

                {/* 企划成员速选弹层（单层浮层容器，内部纯排版行） */}
                {isDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-72 bg-[#070c18]/98 backdrop-blur-2xl border border-[#e5b869]/30 shadow-2xl py-2.5 px-3 z-50">
                    <div className="flex items-center justify-between pb-2 mb-1.5 border-b border-white/10">
                      <span className="serif-title text-xs font-bold text-slate-100">
                        {p.name_zh} · 在籍与历代名簿
                      </span>
                      <span className="text-[10px] text-[#e5b869] font-mono">
                        {p.total_count || dropdownCharacters.length} 名
                      </span>
                    </div>

                    <div className="max-h-64 overflow-y-auto divide-y divide-white/[0.05] pr-1">
                      {(dropdownCharacters.length > 0
                        ? dropdownCharacters
                        : dropdownProjectId === selectedProjectId
                        ? characters
                        : []
                      ).map(c => {
                        const isCurrent = c.id === selectedCharacterId;
                        return (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => {
                              onSelectCharacter(c.id, p.id);
                              setDropdownProjectId(null);
                            }}
                            className={`w-full text-left py-2 px-1.5 text-xs flex items-center justify-between transition-colors ${
                              isCurrent
                                ? 'text-[#2dd4bf] font-semibold'
                                : 'text-slate-300 hover:text-white'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span
                                className="w-2 h-2 rotate-45 flex-none"
                                style={{ backgroundColor: c.color_hex || '#2dd4bf' }}
                              />
                              <span className="truncate">{c.name_zh}</span>
                              <span className="text-[10px] text-slate-500 font-mono truncate">
                                {c.name_ja}
                              </span>
                            </div>
                            {isCurrent && <Check className="w-3.5 h-3.5 text-[#2dd4bf] flex-none" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* 右侧：底线式角色检索 + 名簿抽屉 + 隐藏人物测试 + 备份 */}
      <div className="flex items-center gap-3 sm:gap-4 whitespace-nowrap flex-none">
        <div className="relative" ref={searchRef}>
          <div className="flex items-center border-b border-[#e5b869]/35 focus-within:border-[#2dd4bf] transition-colors py-0.5">
            <Search className="w-3 h-3 text-[#e5b869]/80 mr-1.5 flex-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setIsSearchFocused(true);
              }}
              onFocus={() => setIsSearchFocused(true)}
              placeholder="检索角色 (栞子 / 步梦)..."
              aria-label="快速检索角色"
              className="w-28 lg:w-32 xl:w-44 bg-transparent border-0 text-xs text-slate-100 placeholder-slate-500 outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setIsSearchFocused(false);
                }}
                className="text-slate-400 hover:text-slate-200 p-0.5"
                aria-label="清空角色检索"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {isSearchFocused && searchResults.length > 0 && (
            <div className="absolute top-full right-0 mt-2 w-64 bg-[#070c18]/98 backdrop-blur-2xl border border-[#e5b869]/30 shadow-2xl py-2 px-3 z-50">
              <div className="text-[9px] font-mono text-[#e5b869] pb-1.5 border-b border-white/10 uppercase tracking-widest">
                MATCHED IDOLS ({searchResults.length})
              </div>
              <div className="divide-y divide-white/[0.05]">
                {searchResults.map(c => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      let targetProjId: string | undefined;
                      for (const p of projects) {
                        if (p.groups?.some(grp => c.groups?.some(cg => cg.group_id === grp.id))) {
                          targetProjId = p.id;
                          break;
                        }
                      }
                      onSelectCharacter(c.id, targetProjId);
                      setSearchQuery('');
                      setIsSearchFocused(false);
                    }}
                    className="w-full text-left py-2 text-xs flex items-center justify-between text-slate-300 hover:text-[#2dd4bf] transition-colors"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span
                        className="w-2 h-2 rotate-45 flex-none"
                        style={{ backgroundColor: c.color_hex || '#2dd4bf' }}
                      />
                      <span className="font-medium text-slate-100">{c.name_zh}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{c.name_ja}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 企划与历代成员名簿抽屉入口（桌面与手机通用） */}
        {onOpenDrawer && (
          <button
            type="button"
            onClick={onOpenDrawer}
            className="skyline-tab atelier-zone text-xs flex items-center gap-1 cursor-pointer"
            title="展开全部企划、分队与历代成员名簿"
          >
            <Users className="w-3.5 h-3.5 text-[#2dd4bf]" />
            <span>名簿</span>
          </button>
        )}

        {/* 隐藏人物测试开关 (Theme-as-System 验证) */}
        {onToggleHideCharacter && (
          <button
            type="button"
            onClick={onToggleHideCharacter}
            aria-pressed={hideCharacterMode}
            className={`skyline-tab atelier-zone text-xs hidden sm:flex items-center gap-1 cursor-pointer ${
              hideCharacterMode ? 'is-active text-[#e5b869]' : ''
            }`}
            title="隐藏人物测试：检验隐去人物图像后，角色世界与视觉母题是否依然独立成立"
          >
            {hideCharacterMode ? (
              <Eye className="w-3.5 h-3.5 text-[#e5b869]" />
            ) : (
              <EyeOff className="w-3.5 h-3.5 text-slate-400" />
            )}
            <span>{hideCharacterMode ? '显像' : '無像試練'}</span>
          </button>
        )}

        {/* 本地快照备份与恢复入口 */}
        <button
          type="button"
          onClick={onOpenBackup}
          className="skyline-tab atelier-zone text-xs flex items-center gap-1 cursor-pointer"
          title="导出或恢复本地 SQLite 与图片 ZIP 快照"
        >
          <Database className="w-3.5 h-3.5 text-[#e5b869]" />
          <span className="hidden sm:inline">文庫備份</span>
        </button>
      </div>
    </header>
  );
};
