import React from 'react';
import { CostumeVariant } from '../types';
import { ShieldCheck, Clock, HelpCircle, ExternalLink, Edit3, Image as ImageIcon } from 'lucide-react';

interface CostumeCardProps {
  costume: CostumeVariant;
  onClick: () => void;
  onEdit: () => void;
}

export const CostumeCard: React.FC<CostumeCardProps> = ({
  costume,
  onClick,
  onEdit,
}) => {
  const primaryImage = costume.images.find(img => img.is_primary) || costume.images[0];
  const primarySource = costume.sources[0];

  const getSourceTypeLabel = (type?: string) => {
    switch (type) {
      case 'game_card': return '手游卡面';
      case 'seiyuu_live': return '声优 Live';
      case 'anime': return '动画';
      case 'cd_jacket': return 'CD 封面';
      case 'magazine': return '杂志';
      case 'official_art': return '版权绘';
      default: return '官方出处';
    }
  };

  const getEvolutionLabel = (stage?: string) => {
    if (stage === 'awakened') return '覚醒後';
    if (stage === 'unawakened') return '覚醒前';
    return null;
  };

  const isUnidentified = costume.name_status === 'unidentified';
  const isVerified = costume.status === 'verified';

  return (
    <div
      onClick={onClick}
      className="acrylic-card group relative rounded-2xl overflow-hidden flex flex-col cursor-pointer border border-sky-400/15 hover:border-teal-400/50 hover:shadow-[0_12px_30px_-5px_rgba(45,212,191,0.25)] transition-all duration-300"
    >
      {/* 顶部图片展位 */}
      <div className="relative aspect-[4/3] w-full bg-slate-950/80 overflow-hidden">
        {primaryImage?.file_path ? (
          <img
            src={primaryImage.file_path}
            alt={costume.name_ja || costume.name_zh || '衣装参考图'}
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={e => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 gap-2 p-4 text-center">
            <ImageIcon className="w-8 h-8 stroke-1 text-slate-500" />
            <span className="text-[11px]">暂无参考立绘图片</span>
          </div>
        )}

        {/* 状态徽标浮层 */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
          {isVerified ? (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-950/80 border border-teal-400/80 text-teal-300 flex items-center gap-1 shadow-lg backdrop-blur-md">
              <ShieldCheck className="w-3 h-3 text-teal-400" />
              已核实
            </span>
          ) : isUnidentified ? (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900/80 border border-slate-600 text-slate-300 flex items-center gap-1 shadow-lg backdrop-blur-md">
              <HelpCircle className="w-3 h-3 text-slate-400" />
              待识别
            </span>
          ) : (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-950/80 border border-amber-400/80 text-amber-300 flex items-center gap-1 shadow-lg backdrop-blur-md">
              <Clock className="w-3 h-3 text-amber-400" />
              待核实
            </span>
          )}

          {primarySource && getEvolutionLabel(primarySource.evolution_stage) && (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-sky-950/80 border border-sky-400/50 text-sky-300 backdrop-blur-md">
              {getEvolutionLabel(primarySource.evolution_stage)}
            </span>
          )}
        </div>

        {/* 编辑快捷按钮 */}
        <button
          onClick={e => {
            e.stopPropagation();
            onEdit();
          }}
          className="absolute top-2.5 right-2.5 w-7 h-7 rounded-lg bg-slate-900/80 hover:bg-teal-500 hover:text-slate-950 text-slate-300 border border-slate-700 hover:border-teal-400 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-md backdrop-blur-md"
          title="编辑此衣装资料"
        >
          <Edit3 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 底部信息区 */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-2.5">
        <div>
          {/* 主题标签 */}
          {costume.theme?.name_ja && (
            <div className="text-[11px] font-medium text-teal-400/90 truncate mb-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
              <span>{costume.theme.name_ja}</span>
            </div>
          )}

          {/* 衣装名称 */}
          {isUnidentified ? (
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-slate-300 flex items-center gap-1.5">
                <span className="text-xs px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700 font-mono">
                  待识别
                </span>
                <span className="truncate">{costume.name_zh || '尚未考据日文原名'}</span>
              </h3>
              <p className="text-[11px] text-slate-500 italic">待查证官方正式名称，严禁杜撰</p>
            </div>
          ) : (
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-slate-100 group-hover:text-teal-300 transition-colors truncate">
                {costume.name_ja}
              </h3>
              {costume.name_zh && (
                <p className="text-xs text-slate-400 truncate">{costume.name_zh}</p>
              )}
            </div>
          )}
        </div>

        {/* 出处与特征备注摘要 */}
        <div className="pt-2 border-t border-sky-400/10 flex items-center justify-between text-[11px] text-slate-400">
          <span className="px-2 py-0.5 rounded bg-slate-900/60 border border-slate-800 text-sky-300">
            {getSourceTypeLabel(primarySource?.source_type)}
          </span>

          {costume.images.length > 1 && (
            <span className="text-[10px] text-slate-500 font-mono">
              共 {costume.images.length} 张图
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
