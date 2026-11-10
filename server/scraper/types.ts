export interface ScrapedCostume {
  characterId: string;
  themeNameJa: string;
  themeNameZh?: string;
  variantNameJa: string;
  variantNameZh?: string;
  sourceType: 'anime' | 'game_card' | 'seiyuu_live' | 'cd_jacket' | 'magazine' | 'official_art' | 'other';
  evolutionStage: 'none' | 'unawakened' | 'awakened';
  sourceTitle: string;
  sourceUrl: string;
  imageUrl: string;
  notes?: string;
}

export interface CurationResult {
  characterId: string;
  characterName: string;
  totalFound: number;
  inserted: number;
  skipped: number;
  failed: number;
  items: Array<{
    variantId: string;
    nameJa: string;
    imageUrl: string;
    status: 'inserted' | 'skipped' | 'failed';
    reason?: string;
  }>;
}
