import { Project, Group, Character, CostumeVariant, FilterOptions } from '../types';

const API_BASE = '/api';

export async function fetchProjects(): Promise<Project[]> {
  const res = await fetch(`${API_BASE}/projects`);
  if (!res.ok) throw new Error('获取企划失败');
  return res.json();
}

export async function fetchCharacters(params?: {
  project_id?: string;
  group_id?: string;
  status?: string;
}): Promise<Character[]> {
  const query = new URLSearchParams();
  if (params?.project_id) query.set('project_id', params.project_id);
  if (params?.group_id) query.set('group_id', params.group_id);
  if (params?.status) query.set('status', params.status);

  const res = await fetch(`${API_BASE}/characters?${query.toString()}`);
  if (!res.ok) throw new Error('获取角色列表失败');
  return res.json();
}

export async function fetchCharacter(id: string): Promise<Character> {
  const res = await fetch(`${API_BASE}/characters/${id}`);
  if (!res.ok) throw new Error('获取角色信息失败');
  return res.json();
}

export async function fetchCharacterCostumes(
  characterId: string,
  filters?: FilterOptions
): Promise<CostumeVariant[]> {
  const query = new URLSearchParams();
  if (filters?.status && filters.status !== 'all') query.set('status', filters.status);
  if (filters?.sourceType && filters.sourceType !== 'all') query.set('source_type', filters.sourceType);
  if (filters?.evolutionStage && filters.evolutionStage !== 'all') query.set('evolution_stage', filters.evolutionStage);
  if (filters?.search) query.set('search', filters.search);

  const res = await fetch(`${API_BASE}/characters/${characterId}/costumes?${query.toString()}`);
  if (!res.ok) throw new Error('获取角色衣装失败');
  return res.json();
}

export async function fetchCostume(id: string): Promise<CostumeVariant> {
  const res = await fetch(`${API_BASE}/costumes/${id}`);
  if (!res.ok) throw new Error('获取衣装详情失败');
  return res.json();
}

export async function fetchThemes(): Promise<{ id: string; name_ja: string; name_zh?: string }[]> {
  const res = await fetch(`${API_BASE}/themes`);
  if (!res.ok) throw new Error('获取主题失败');
  return res.json();
}

export async function createCostume(payload: any): Promise<{ id: string; message: string }> {
  const res = await fetch(`${API_BASE}/costumes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || '创建衣装记录失败');
  }
  return data;
}

export async function updateCostume(id: string, payload: any): Promise<{ id: string; message: string }> {
  const res = await fetch(`${API_BASE}/costumes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || '更新衣装记录失败');
  }
  return data;
}

export async function deleteCostume(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/costumes/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || '删除衣装记录失败');
  }
}

export async function uploadImage(file: File): Promise<{ file_path: string; original_filename: string }> {
  const formData = new FormData();
  formData.append('image', file);

  const res = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || '图片上传失败');
  }
  return data;
}

export async function restoreBackup(file: File): Promise<{ success: boolean; message: string }> {
  const formData = new FormData();
  formData.append('backup_zip', file);

  const res = await fetch(`${API_BASE}/restore`, {
    method: 'POST',
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || '备份恢复失败');
  }
  return data;
}
