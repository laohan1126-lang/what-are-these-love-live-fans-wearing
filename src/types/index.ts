export interface Project {
  id: string;
  name_ja: string;
  name_zh: string;
  sort_order: number;
  active_count?: number;
  total_count?: number;
  groups?: Group[];
}

export interface Group {
  id: string;
  project_id: string;
  name_ja: string;
  name_zh: string;
  type: 'main' | 'subunit' | 'special';
  sort_order: number;
  active_count?: number;
  total_count?: number;
}

export interface CharacterGroupInfo {
  group_id: string;
  group_name_ja: string;
  group_name_zh: string;
  period: string;
  status: 'active' | 'historical';
  role_description?: string;
}

export interface Character {
  id: string;
  name_ja: string;
  name_zh: string;
  enrollment_term?: string;
  status: 'active' | 'graduated' | 'former';
  color_hex?: string;
  sort_order: number;
  costume_count?: number;
  groups?: CharacterGroupInfo[];
}

export interface CostumeTheme {
  id: string;
  name_ja: string;
  name_zh?: string;
  category: 'single_cd' | 'anime_insert' | 'game_event' | 'live' | 'general';
  description?: string;
}

export interface CostumeImage {
  id: string;
  variant_id: string;
  file_path: string;
  original_filename?: string;
  is_primary: boolean;
  caption?: string;
  category?: 'illustration' | 'real_life' | 'detail';
  sort_order: number;
}

export type SourceType = 'anime' | 'game_card' | 'seiyuu_live' | 'cd_jacket' | 'magazine' | 'official_art' | 'other';
export type EvolutionStage = 'none' | 'unawakened' | 'awakened';

export interface CostumeSource {
  id: string;
  variant_id: string;
  source_type: SourceType;
  evolution_stage: EvolutionStage;
  title: string;
  url?: string;
  detail?: string;
}

export type CostumeStatus = 'verified' | 'unverified';
export type NameStatus = 'identified' | 'unidentified';

export interface CostumeVariant {
  id: string;
  theme_id: string;
  character_id: string;
  name_ja?: string | null;
  name_zh?: string | null;
  name_status: NameStatus;
  status: CostumeStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
  theme?: CostumeTheme;
  character?: Character;
  images: CostumeImage[];
  sources: CostumeSource[];
}

export interface FilterOptions {
  status?: string; // 'all' | 'verified' | 'unverified' | 'unidentified'
  sourceType?: string; // 'all' | SourceType
  evolutionStage?: string; // 'all' | EvolutionStage
  search?: string;
}
