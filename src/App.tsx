import React, { useState, useEffect, useCallback } from 'react';
import { Project, Character, CostumeVariant, FilterOptions, CostumeTheme } from './types';
import {
  fetchProjects,
  fetchCharacters,
  fetchCharacterCostumes,
  fetchThemes,
} from './services/api';
import { TopNav } from './components/TopNav';
import { CharacterMasthead } from './components/CharacterMasthead';
import { WorkbenchStage } from './components/WorkbenchStage';
import { MemberDrawer } from './components/MemberDrawer';
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
  const [selectedCostumeId, setSelectedCostumeId] = useState<string | null>(null);

  // 筛选与视图状态
  const [filters, setFilters] = useState<FilterOptions>({
    status: 'all',
    sourceType: 'all',
    evolutionStage: 'all',
    search: '',
  });

  const [isLoading, setIsLoading] = useState(true);

  // 抽屉与弹窗状态
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeLightboxCostume, setActiveLightboxCostume] = useState<CostumeVariant | null>(null);
  const [editingCostume, setEditingCostume] = useState<CostumeVariant | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isBackupOpen, setIsBackupOpen] = useState(false);

  // 1. 加载企划列表
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
      if (data.length > 0 && (!selectedCostumeId || !data.some(c => c.id === selectedCostumeId))) {
        setSelectedCostumeId(data[0].id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCharacterId, filters, selectedCostumeId]);

  // 初始化数据加载
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

  return (
    <div className="min-h-screen bg-[#070b16] text-slate-100 flex flex-col relative selection:bg-teal-500/20 selection:text-teal-300">
      {/* 舞台光感漫反射底纹 */}
      <div className="fixed inset-0 pointer-events-none stage-glow z-0" aria-hidden="true" />

      {/* 1. 顶部水平导航栏 */}
      <TopNav
        projects={projects}
        selectedProjectId={selectedProjectId}
        onSelectProject={id => {
          setSelectedProjectId(id);
          setSelectedGroupId(null);
        }}
        onOpenDrawer={() => setIsDrawerOpen(true)}
        onOpenBackup={() => setIsBackupOpen(true)}
        currentCharacterNameZh={currentCharacter?.name_zh}
      />

      {/* 2. 角色刊头 (Masthead) */}
      {currentCharacter && (
        <CharacterMasthead
          character={currentCharacter}
          costumeCount={costumes.length}
          filters={filters}
          onFilterChange={setFilters}
          onAddCostume={handleOpenNewCostume}
        />
      )}

      {/* 3. 主工作画板 (Workbench Stage) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-6 relative z-10">
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-8 animate-pulse">
            <div className="lg:col-span-7 aspect-[16/10] bg-slate-900/40 rounded-2xl border border-white/5" />
            <div className="lg:col-span-5 h-96 bg-slate-900/40 rounded-2xl border border-white/5" />
          </div>
        ) : costumes.length === 0 ? (
          <EmptyState
            characterName={currentCharacter?.name_zh || '当前角色'}
            onAddCostume={handleOpenNewCostume}
          />
        ) : (
          <WorkbenchStage
            costumes={costumes}
            selectedCostumeId={selectedCostumeId}
            onSelectCostume={setSelectedCostumeId}
            onOpenLightbox={setActiveLightboxCostume}
            onEditCostume={handleOpenEdit}
            onAddCostume={handleOpenNewCostume}
          />
        )}
      </main>

      {/* 4. 成员抽屉选择器 */}
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
        onSelectCharacter={setSelectedCharacterId}
        statusFilter={statusFilter}
        onToggleStatusFilter={setStatusFilter}
      />

      {/* 5. 大图灯箱检视浮层 */}
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

      {/* 6. 录入与编辑抽屉 */}
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

      {/* 7. 备份与还原弹窗 */}
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
