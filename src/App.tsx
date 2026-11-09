import React, { useState, useEffect, useCallback } from 'react';
import { Project, Group, Character, CostumeVariant, FilterOptions, CostumeTheme } from './types';
import {
  fetchProjects,
  fetchCharacters,
  fetchCharacterCostumes,
  fetchThemes,
} from './services/api';
import { Sidebar } from './components/Sidebar';
import { HeroHeader } from './components/HeroHeader';
import { CharacterHero } from './components/CharacterHero';
import { MultiFilterBar } from './components/MultiFilterBar';
import { CostumeCard } from './components/CostumeCard';
import { EmptyState } from './components/EmptyState';
import { CostumeLightbox } from './components/CostumeLightbox';
import { CostumeEditorDrawer } from './components/CostumeEditorDrawer';
import { BackupModal } from './components/BackupModal';

export const App: React.FC = () => {
  // 全局数据状态
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('nijigasaki');
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'active' | 'all'>('active');

  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacterId, setSelectedCharacterId] = useState<string>('mifune-shioriko');

  const [themes, setThemes] = useState<CostumeTheme[]>([]);
  const [costumes, setCostumes] = useState<CostumeVariant[]>([]);

  // 筛选与视图状态
  const [filters, setFilters] = useState<FilterOptions>({
    status: 'all',
    sourceType: 'all',
    evolutionStage: 'all',
    search: '',
  });

  const [isLoading, setIsLoading] = useState(true);

  // 弹窗与抽屉控制
  const [activeLightboxCostume, setActiveLightboxCostume] = useState<CostumeVariant | null>(null);
  const [editingCostume, setEditingCostume] = useState<CostumeVariant | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isBackupOpen, setIsBackupOpen] = useState(false);

  // 1. 加载企划与团体
  const loadProjects = useCallback(async () => {
    try {
      const data = await fetchProjects();
      setProjects(data);
    } catch (e) {
      console.error(e);
    }
  }, []);

  // 2. 加载角色列表
  const loadCharacters = useCallback(async () => {
    try {
      const data = await fetchCharacters({
        project_id: selectedProjectId,
        group_id: selectedGroupId || undefined,
        status: statusFilter === 'all' ? undefined : 'active',
      });
      setCharacters(data);
      // 如果当前选中的角色不在筛选结果中，默认选中第一个
      if (data.length > 0 && !data.some(c => c.id === selectedCharacterId)) {
        setSelectedCharacterId(data[0].id);
      }
    } catch (e) {
      console.error(e);
    }
  }, [selectedProjectId, selectedGroupId, statusFilter, selectedCharacterId]);

  // 3. 加载主题列表
  const loadThemes = useCallback(async () => {
    try {
      const data = await fetchThemes();
      setThemes(data as any);
    } catch (e) {
      console.error(e);
    }
  }, []);

  // 4. 加载当前角色的衣装列表
  const loadCostumes = useCallback(async () => {
    if (!selectedCharacterId) return;
    setIsLoading(true);
    try {
      const data = await fetchCharacterCostumes(selectedCharacterId, filters);
      setCostumes(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCharacterId, filters]);

  // 初始化加载
  useEffect(() => {
    loadProjects();
    loadThemes();
  }, [loadProjects, loadThemes]);

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

  return (
    <div className="relative min-h-screen bg-[#060913] text-slate-100 flex flex-col overflow-x-hidden selection:bg-teal-500/30 selection:text-teal-200">
      {/* Codex 1.9 单画板舞台背景 (Canvas Scene) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        {/* 三船栞子《决意之光》舞台大图作为全景背景 */}
        <img
          src="/assets/theme_stage_shioriko.jpg"
          alt=""
          className="absolute right-0 -top-12 w-[70vw] max-w-[1200px] h-auto object-cover opacity-35 mix-blend-screen mask-radial pointer-events-none"
          style={{
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 40%, transparent 80%)',
            WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 40%, transparent 80%)',
          }}
        />

        {/* 呼吸微光与彩虹霓虹舞台反射光 */}
        <div className="canvas-light absolute inset-0 pointer-events-none" />

        {/* 舞台光线微渐变覆盖 */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#060913] via-[#060913]/70 to-transparent pointer-events-none" />
      </div>

      {/* 顶部 Hero Header */}
      <HeroHeader
        onOpenBackup={() => setIsBackupOpen(true)}
        onOpenNewCostume={handleOpenNewCostume}
      />

      {/* 主界面分栏工作区 */}
      <div className="flex-1 flex relative z-10 overflow-hidden">
        {/* 左侧：企划/分队与角色导航侧边栏 */}
        <Sidebar
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
          onSelectCharacter={setSelectedCharacterId}
          activeStatusFilter={statusFilter}
          onToggleStatusFilter={setStatusFilter}
        />

        {/* 右侧：主画板工作展区 */}
        <main className="flex-1 h-[calc(100vh-4.5rem)] overflow-y-auto px-6 py-6 lg:px-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* 角色展台信息头 */}
            {currentCharacter && (
              <CharacterHero
                character={currentCharacter}
                costumeCount={costumes.length}
                onAddCostume={handleOpenNewCostume}
              />
            )}

            {/* 多维筛选栏 (状态、声优Live、卡面觉醒前后、搜索) */}
            <MultiFilterBar
              filters={filters}
              onChange={setFilters}
            />

            {/* 衣装卡片展示网格 */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {[1, 2, 3, 4].map(i => (
                  <div
                    key={i}
                    className="aspect-[4/3] rounded-2xl bg-slate-900/40 border border-sky-400/10 animate-pulse"
                  />
                ))}
              </div>
            ) : costumes.length === 0 ? (
              <EmptyState
                characterName={currentCharacter?.name_zh || '当前角色'}
                onAddCostume={handleOpenNewCostume}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {costumes.map(costume => (
                  <CostumeCard
                    key={costume.id}
                    costume={costume}
                    onClick={() => setActiveLightboxCostume(costume)}
                    onEdit={() => handleOpenEdit(costume)}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* 大图灯箱弹窗 */}
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

      {/* 录入/编辑抽屉 */}
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

      {/* 本地备份与还原弹窗 */}
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
