import React, { useState, useEffect, useCallback } from 'react';
import { Project, Character, CostumeVariant, FilterOptions, CostumeTheme } from './types';
import {
  fetchProjects,
  fetchCharacters,
  fetchCharacterCostumes,
  fetchThemes,
  curateCharacter,
} from './services/api';
import { TopNav } from './components/TopNav';
import { CharacterMasthead } from './components/CharacterMasthead';
import { WorkbenchStage } from './components/WorkbenchStage';
import { MemberDrawer } from './components/MemberDrawer';
import { EmptyState } from './components/EmptyState';
import { CostumeLightbox } from './components/CostumeLightbox';
import { CostumeEditorDrawer } from './components/CostumeEditorDrawer';
import { BackupModal } from './components/BackupModal';

const SATELLITE_COLORS = ['#2dd4bf', '#e5b869', '#38bdf8', '#f43f5e'];

export const App: React.FC = () => {
  // 全局数据状态
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('nijigasaki');
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'active' | 'all'>('all');

  const [characters, setCharacters] = useState<Character[]>([]);
  const [allCharacters, setAllCharacters] = useState<Character[]>([]);
  const [selectedCharacterId, setSelectedCharacterId] = useState<string>('mifune-shioriko');

  // 跨企划与角色切换同步引用，防止异步网络返回冲刷选中的目标角色
  const pendingCharacterIdRef = React.useRef<string | null>(null);

  const [themes, setThemes] = useState<CostumeTheme[]>([]);
  const [costumes, setCostumes] = useState<CostumeVariant[]>([]);
  const [selectedCostumeId, setSelectedCostumeId] = useState<string | null>(null);

  // 筛选与视图状态
  const [filters, setFilters] = useState<FilterOptions>({
    status: 'all',
    sourceType: 'all',
    evolutionStage: 'all',
    search: '',
  });

  const [isLoading, setIsLoading] = useState(true);
  const [hideCharacterMode, setHideCharacterMode] = useState(false);

  // 抽屉与弹窗状态
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeLightboxCostume, setActiveLightboxCostume] = useState<CostumeVariant | null>(null);
  const [editingCostume, setEditingCostume] = useState<CostumeVariant | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isBackupOpen, setIsBackupOpen] = useState(false);
  const [isCurating, setIsCurating] = useState(false);

  // 角色专属指针与状态反馈器 (#signature-effect: 翡翠书签与流苏菱光卫星)
  const [orbitState, setOrbitState] = useState<{
    mode: 'idle' | 'hover' | 'burst';
    x: number;
    y: number;
  }>({
    mode: 'idle',
    x: 42,
    y: 78,
  });

  // 同步隐藏人物测试模式到 body dataset
  useEffect(() => {
    document.body.dataset.hideCharacter = hideCharacterMode ? 'true' : 'false';
  }, [hideCharacterMode]);

  // 指针交互监听：悬停 .atelier-zone 唤醒翡翠书签卫星，点击触发菱光散逸
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let burstTimer = 0;

    const handlePointerMove = (e: PointerEvent) => {
      if (reducedMotion.matches) return;
      const target = (e.target as Element | null)?.closest?.('.atelier-zone');
      if (target) {
        setOrbitState(prev => ({
          mode: prev.mode === 'burst' ? 'burst' : 'hover',
          x: e.clientX,
          y: e.clientY,
        }));
      } else {
        setOrbitState(prev =>
          prev.mode === 'idle' ? prev : { mode: 'idle', x: 42, y: 78 }
        );
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      if (reducedMotion.matches) return;
      const target = (e.target as Element | null)?.closest?.('.atelier-zone');
      if (!target) return;
      window.clearTimeout(burstTimer);
      setOrbitState({
        mode: 'burst',
        x: e.clientX || 180,
        y: e.clientY || 220,
      });
      burstTimer = window.setTimeout(() => {
        setOrbitState(prev => ({
          mode: 'hover',
          x: prev.x,
          y: prev.y,
        }));
      }, 520);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.clearTimeout(burstTimer);
    };
  }, []);

  // 滚动驱动分镜揭示 (IntersectionObserver)
  useEffect(() => {
    const elements = document.querySelectorAll('.enter-on-scroll');
    if (!('IntersectionObserver' in window)) {
      elements.forEach(el => el.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px 60px 0px' }
    );
    elements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [costumes, characters]);

  // 触发当前角色的自动化图鉴检索（采集结果全部入库为“待核实”，杜绝伪权威）
  const handleCurate = async () => {
    if (!selectedCharacterId || isCurating) return;
    setIsCurating(true);
    try {
      const res = await curateCharacter(selectedCharacterId, 1, 5);
      if (res.supported === false) {
        alert(
          `【暂不支持自动采集】\n${
            res.reason || '该角色在外部卡面源中暂无收录索引。请点击“手动著录衣装”进行资料建档。'
          }`
        );
      } else {
        alert(
          `【社区卡面检索入库完成】\n` +
            `目标角色：${res.characterName}\n` +
            `新增入库：${res.inserted} 套（状态：待核实）\n` +
            `跳过重复：${res.skipped} 套\n` +
            `下载失败：${res.failed} 套\n\n` +
            `提示：所有自动采集的卡面均为社区第三方数据，已标记为“待核实”，需人工进一步核实日文原名与出处。`
        );
      }
      await loadCostumes();
      await loadThemes();
      await loadProjects();
    } catch (err: any) {
      alert('图鉴采集失败: ' + err.message);
    } finally {
      setIsCurating(false);
    }
  };

  // 加载全量角色
  const loadAllCharacters = useCallback(async () => {
    try {
      const data = await fetchCharacters();
      setAllCharacters(data);
    } catch (e) {
      console.error(e);
    }
  }, []);

  // 1. 加载企划列表
  const loadProjects = useCallback(async () => {
    try {
      const data = await fetchProjects();
      setProjects(data);
    } catch (e) {
      console.error(e);
    }
  }, []);

  // 统一角色与企划精准切换调度（防竞态冲刷，支持现役与历代全员）
  const handleSelectCharacter = useCallback(
    (charId: string, projId?: string) => {
      let targetProjId = projId;
      if (!targetProjId) {
        const charObj = allCharacters.find(c => c.id === charId);
        if (charObj && projects.length > 0) {
          for (const p of projects) {
            if (p.groups?.some(grp => charObj.groups?.some(cg => cg.group_id === grp.id))) {
              targetProjId = p.id;
              break;
            }
          }
        }
      }

      // 锁定待选目标，防止角色列表异步返回时重置回第一个角色
      pendingCharacterIdRef.current = charId;

      // 若目标角色为历代/毕业成员，确保状态过滤器为 all
      const targetChar = allCharacters.find(c => c.id === charId);
      if (targetChar && targetChar.status !== 'active' && statusFilter !== 'all') {
        setStatusFilter('all');
      }

      if (targetProjId && targetProjId !== selectedProjectId) {
        setSelectedProjectId(targetProjId);
        setSelectedGroupId(null);
      }

      setSelectedCharacterId(charId);
    },
    [allCharacters, projects, selectedProjectId, statusFilter]
  );

  // 2. 加载角色列表
  const loadCharacters = useCallback(async () => {
    try {
      const data = await fetchCharacters({
        project_id: selectedProjectId,
        group_id: selectedGroupId || undefined,
        status: statusFilter === 'all' ? undefined : 'active',
      });
      setCharacters(data);

      const targetId = pendingCharacterIdRef.current || selectedCharacterId;
      pendingCharacterIdRef.current = null;

      if (data.length > 0) {
        if (data.some(c => c.id === targetId)) {
          setSelectedCharacterId(targetId);
        } else {
          // 当前选中的角色确实不属于当前企划/分组时，才回退到首位角色
          setSelectedCharacterId(data[0].id);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, [selectedProjectId, selectedGroupId, statusFilter]);

  // 3. 加载主题列表
  const loadThemes = useCallback(async () => {
    try {
      const data = await fetchThemes();
      setThemes(data as any);
    } catch (e) {
      console.error(e);
    }
  }, []);

  // 4. 加载当前角色的衣装列表（优先默认选中具备 2D+3D 双轨对照或已核实的代表衣装）
  const loadCostumes = useCallback(async () => {
    if (!selectedCharacterId) return;
    setIsLoading(true);
    try {
      const data = await fetchCharacterCostumes(selectedCharacterId, filters);
      setCostumes(data);
      if (data.length > 0 && (!selectedCostumeId || !data.some(c => c.id === selectedCostumeId))) {
        const dualTrackCostume = data.find(
          c =>
            c.images.some(i => i.category === 'illustration' || i.is_primary) &&
            c.images.some(i => i.category === 'real_life')
        );
        const verifiedWithImage = data.find(
          c => c.status === 'verified' && c.images.length > 0
        );
        setSelectedCostumeId((dualTrackCostume || verifiedWithImage || data[0]).id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCharacterId, filters, selectedCostumeId]);

  useEffect(() => {
    loadProjects();
    loadThemes();
    loadAllCharacters();
  }, [loadProjects, loadThemes, loadAllCharacters]);

  useEffect(() => {
    loadCharacters();
  }, [loadCharacters]);

  useEffect(() => {
    loadCostumes();
  }, [loadCostumes]);

  const currentCharacter = characters.find(c => c.id === selectedCharacterId);

  const handleEditorSuccess = async (savedId: string) => {
    setIsEditorOpen(false);
    setEditingCostume(null);
    setSelectedCostumeId(savedId);
    await loadCostumes();
    await loadCharacters();
    await loadThemes();
    await loadProjects();
  };

  const handleOpenEdit = (costume: CostumeVariant) => {
    setEditingCostume(costume);
    setIsEditorOpen(true);
  };

  const handleOpenNewCostume = () => {
    setEditingCostume(null);
    setIsEditorOpen(true);
  };

  // 计算 #signature-effect 的三态几何变换（idle / hover / burst）
  const orbitTransform =
    orbitState.mode === 'burst'
      ? `translate3d(${Math.round(orbitState.x - 28)}px, ${Math.round(orbitState.y - 28)}px, 0px) scale(1.34) rotate(62deg)`
      : orbitState.mode === 'hover'
      ? `translate3d(${Math.round(orbitState.x - 28)}px, ${Math.round(orbitState.y - 28)}px, 0px) scale(1.1) rotate(24deg)`
      : `translate3d(28px, 56px, 0px) scale(0.86) rotate(0deg)`;

  const orbitOpacity = orbitState.mode === 'idle' ? 0.72 : orbitState.mode === 'hover' ? 0.98 : 1;

  return (
    <div
      className="min-h-screen bg-[#070c18] text-slate-100 flex flex-col relative selection:bg-teal-500/25 selection:text-teal-200"
      style={
        {
          '--char-accent': currentCharacter?.color_hex || '#2dd4bf',
        } as React.CSSProperties
      }
    >
      {/* 舞台光感漫反射底纹 */}
      <div className="fixed inset-0 pointer-events-none stage-glow z-0" aria-hidden="true" />

      {/* 专属角色交互反馈器 (#signature-effect)：翡翠玉簪与流苏菱光卫星 */}
      <div
        id="signature-effect"
        aria-hidden="true"
        data-motion-mode={orbitState.mode}
        className="signature-orbit"
        style={{
          transform: orbitTransform,
          opacity: orbitOpacity,
        }}
      >
        {SATELLITE_COLORS.map((color, idx) => {
          const angle = (idx * Math.PI) / 2 + (orbitState.mode === 'burst' ? 0.65 : 0.25);
          const radius =
            orbitState.mode === 'burst' ? 28 : orbitState.mode === 'hover' ? 18 : 7;
          const dx = Math.round(Math.cos(angle) * radius);
          const dy = Math.round(Math.sin(angle) * radius);
          const rot =
            orbitState.mode === 'burst'
              ? idx * 90 + 55
              : orbitState.mode === 'hover'
              ? idx * 90 + 25
              : idx * 90;
          const scale =
            orbitState.mode === 'burst' ? 1.24 : orbitState.mode === 'hover' ? 1.08 : 0.85;
          return (
            <svg
              key={color}
              viewBox="0 0 24 24"
              className="signature-satellite"
              style={{
                transform: `translate3d(${dx}px, ${dy}px, 0px) rotate(${rot}deg) scale(${scale})`,
                opacity: orbitState.mode === 'idle' ? 0.78 : 0.98,
              }}
            >
              <path
                d="M12 2 L19 10 L12 22 L5 10 Z"
                fill="none"
                stroke={color}
                strokeWidth="1.7"
              />
              <circle cx="12" cy="10" r="2.2" fill={color} />
            </svg>
          );
        })}
      </div>

      {/* 1. 顶栏排印天际线 */}
      <TopNav
        projects={projects}
        selectedProjectId={selectedProjectId}
        onSelectProject={id => {
          setSelectedProjectId(id);
          setSelectedGroupId(null);
        }}
        characters={characters}
        allCharacters={allCharacters}
        selectedCharacterId={selectedCharacterId}
        onSelectCharacter={handleSelectCharacter}
        onOpenBackup={() => setIsBackupOpen(true)}
        onOpenDrawer={() => setIsDrawerOpen(true)}
        hideCharacterMode={hideCharacterMode}
        onToggleHideCharacter={() => setHideCharacterMode(prev => !prev)}
      />

      {/* 2. 角色舞台刊头 (Character Masthead) */}
      {currentCharacter && (
        <CharacterMasthead
          character={currentCharacter}
          costumeCount={costumes.length}
          filters={filters}
          onFilterChange={setFilters}
        />
      )}

      {/* 3. 首屏主工作舞台 (Workbench Stage) */}
      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 lg:px-8 pt-2.5 pb-10 relative z-10 space-y-10">
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 py-6 animate-pulse">
            <div className="lg:col-span-8 h-[350px] bg-white/[0.03] border-b border-[#e5b869]/20" />
            <div className="lg:col-span-4 h-[350px] bg-white/[0.02] border-l border-[#e5b869]/20" />
          </div>
        ) : costumes.length === 0 ? (
          <EmptyState
            characterName={currentCharacter?.name_zh || '当前角色'}
            onAddCostume={handleOpenNewCostume}
            onCurateCostumes={handleCurate}
            isCurating={isCurating}
          />
        ) : (
          <WorkbenchStage
            costumes={costumes}
            selectedCostumeId={selectedCostumeId}
            onSelectCostume={setSelectedCostumeId}
            onOpenLightbox={setActiveLightboxCostume}
            onEditCostume={handleOpenEdit}
            onAddCostume={handleOpenNewCostume}
            onCurateCostumes={handleCurate}
            isCurating={isCurating}
          />
        )}

        {/* 4. 滚动分镜章节：角色全卷考据目录与同团成员横向名簿 (开放式排版行，零卡片嵌套) */}
        <section
          className="enter-on-scroll is-visible border-t border-[#e5b869]/20 pt-7 space-y-6"
          aria-label="全卷考据索引与同企划成员速览"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* 左：当前角色全卷文字目录（开放式细线行） */}
            <div className="lg:col-span-7 space-y-2.5">
              <div className="flex items-baseline justify-between border-b border-[#e5b869]/20 pb-1.5">
                <div className="flex items-baseline gap-2.5">
                  <span className="font-mono text-[10px] tracking-[0.22em] text-[#e5b869] uppercase">
                    ARCHIVE LEDGER · 衣装考据总目
                  </span>
                  <h3 className="serif-title text-base font-bold text-slate-100 m-0">
                    {currentCharacter?.name_zh} 收录一览
                  </h3>
                </div>
                <span className="font-mono text-[11px] text-[#2dd4bf]">
                  TOTAL {String(costumes.length).padStart(2, '0')}
                </span>
              </div>

              <div className="divide-y divide-white/[0.06]">
                {costumes.map((c, i) => {
                  const isCurrent = c.id === selectedCostumeId;
                  const has2D = c.images.some(
                    img => img.category === 'illustration' || img.is_primary
                  );
                  const has3D = c.images.some(img => img.category === 'real_life');
                  return (
                    <div
                      key={c.id}
                      onClick={() => {
                        setSelectedCostumeId(c.id);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`atelier-zone py-2.5 flex items-center justify-between gap-3 cursor-pointer transition-all ${
                        isCurrent
                          ? 'text-[#2dd4bf] pl-2 border-l-2 border-[#2dd4bf]'
                          : 'text-slate-300 hover:text-white hover:pl-1.5'
                      }`}
                    >
                      <div className="flex items-baseline gap-3 min-w-0">
                        <span className="font-mono text-xs text-[#e5b869]">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <div className="min-w-0">
                          <span className="serif-title text-sm font-semibold block truncate">
                            {c.name_status === 'unidentified'
                              ? '待查明日文原名'
                              : c.name_ja || c.name_zh}
                          </span>
                          <span className="text-[11px] text-slate-400 block truncate">
                            {c.theme?.name_ja ? `系列：${c.theme.name_ja}` : ''}{' '}
                            {c.name_zh ? `· ${c.name_zh}` : ''}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 flex-none font-mono text-[10px]">
                        <span className={has2D ? 'text-[#2dd4bf]' : 'text-slate-600'}>2D</span>
                        <span className={has3D ? 'text-[#f43f5e]' : 'text-slate-600'}>3D</span>
                        <span
                          className={
                            c.status === 'verified' ? 'text-[#2dd4bf]' : 'text-[#e5b869]'
                          }
                        >
                          {c.status === 'verified' ? '玉印核实' : '待核实'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 右：同企划成员快速切换名簿 */}
            <div className="lg:col-span-5 space-y-2.5 lg:border-l lg:border-[#e5b869]/20 lg:pl-6">
              <div className="flex items-baseline justify-between border-b border-[#e5b869]/20 pb-1.5">
                <span className="font-mono text-[10px] tracking-[0.22em] text-[#e5b869] uppercase">
                  TROUPE ROSTER · 同企划成员 ({characters.length}人)
                </span>
                <button
                  type="button"
                  onClick={() => setStatusFilter(prev => (prev === 'active' ? 'all' : 'active'))}
                  className="atelier-zone font-mono text-[10px] text-[#2dd4bf] hover:underline cursor-pointer"
                >
                  {statusFilter === 'active' ? '切换历代全员 ↗' : '仅看现役在籍 ↗'}
                </button>
              </div>

              <div className="flex flex-wrap gap-x-4 gap-y-2 pt-1">
                {characters.map(ch => {
                  const active = ch.id === selectedCharacterId;
                  return (
                    <button
                      key={ch.id}
                      type="button"
                      onClick={() => {
                        handleSelectCharacter(ch.id, selectedProjectId);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`skyline-tab atelier-zone text-xs flex items-center gap-1.5 cursor-pointer ${
                        active ? 'is-active text-[#2dd4bf] font-bold' : 'text-slate-300'
                      }`}
                    >
                      <span
                        className="w-2 h-2 rotate-45 flex-none"
                        style={{ backgroundColor: ch.color_hex || '#2dd4bf' }}
                      />
                      <span>{ch.name_zh}</span>
                      <span className="font-mono text-[10px] text-slate-500">
                        ({ch.costume_count ?? 0})
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 5. 企划与历代成员抽屉选择器 */}
      <MemberDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        projects={projects}
        selectedProjectId={selectedProjectId}
        onSelectProject={id => {
          setSelectedProjectId(id);
          setSelectedGroupId(null);
        }}
        selectedGroupId={selectedGroupId}
        onSelectGroup={setSelectedGroupId}
        characters={characters}
        selectedCharacterId={selectedCharacterId}
        onSelectCharacter={handleSelectCharacter}
        statusFilter={statusFilter}
        onToggleStatusFilter={setStatusFilter}
      />

      {/* 6. 大图灯箱检视浮层 */}
      {activeLightboxCostume && (
        <CostumeLightbox
          costume={activeLightboxCostume}
          onClose={() => setActiveLightboxCostume(null)}
          onEdit={() => {
            handleOpenEdit(activeLightboxCostume);
            setActiveLightboxCostume(null);
          }}
        />
      )}

      {/* 7. 录入与编辑抽屉 */}
      {isEditorOpen && (
        <CostumeEditorDrawer
          initialCostume={editingCostume}
          defaultCharacterId={selectedCharacterId}
          characters={characters}
          themes={themes}
          onClose={() => {
            setIsEditorOpen(false);
            setEditingCostume(null);
          }}
          onSuccess={handleEditorSuccess}
        />
      )}

      {/* 8. 备份与还原弹窗 */}
      {isBackupOpen && (
        <BackupModal
          onClose={() => setIsBackupOpen(false)}
          onRestoreSuccess={async () => {
            await loadProjects();
            await loadCharacters();
            await loadThemes();
            await loadCostumes();
          }}
        />
      )}
    </div>
  );
};
