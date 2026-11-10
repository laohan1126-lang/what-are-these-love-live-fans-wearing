import { ScrapedCostume } from './types.js';

export interface VerificationResult {
  verified: boolean;
  nameStatus: 'identified' | 'unidentified';
  reason?: string;
}

export function verifyScrapedCostume(costume: ScrapedCostume): VerificationResult {
  // 1. 检验衣装日文正式名称
  if (!costume.variantNameJa || costume.variantNameJa.trim() === '') {
    return {
      verified: false,
      nameStatus: 'unidentified',
      reason: '缺少日文原名，标记为待识别',
    };
  }

  const forbiddenPlaceholders = ['待识别', '未知', '某套服装', '占位', 'test', 'unknown'];
  for (const placeholder of forbiddenPlaceholders) {
    if (costume.variantNameJa.toLowerCase().includes(placeholder)) {
      return {
        verified: false,
        nameStatus: 'unidentified',
        reason: '名称包含占位词，严禁标记为已核实',
      };
    }
  }

  // 2. 检验来源链接证据链
  if (!costume.sourceUrl || !costume.sourceUrl.startsWith('http')) {
    return {
      verified: false,
      nameStatus: 'identified',
      reason: '缺少有效可复查的来源 URL',
    };
  }

  // 3. 校验图片链接
  if (!costume.imageUrl || (!costume.imageUrl.startsWith('http') && !costume.imageUrl.startsWith('/uploads/'))) {
    return {
      verified: false,
      nameStatus: 'identified',
      reason: '缺少有效的参考图片 URL',
    };
  }

  // 证据确凿且日文原名合法，通过校验
  return {
    verified: true,
    nameStatus: 'identified',
  };
}
