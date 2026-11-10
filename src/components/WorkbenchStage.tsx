import React, { useState } from 'react';
import { CostumeVariant } from '../types';
import {
  ShieldCheck,
  Clock,
  HelpCircle,
  ExternalLink,
  Edit3,
  Maximize2,
  Image as ImageIcon,
  Plus,
  ChevronLeft,
  ChevronRight,
  Columns,
  Sparkles,
} from 'lucide-react';

interface WorkbenchStageProps {
  costumes: CostumeVariant[];
  selectedCostumeId: string | null;
  onSelectCostume: (id: string) => void;
  onOpenLightbox: (costume: CostumeVariant) => void;
  onEditCostume: (costume: CostumeVariant) => void;
  onAddCostume: () => void;
}

export const WorkbenchStage: React.FC<WorkbenchStageProps> = ({
  costumes,
  selectedCostumeId,
  onSelectCostume,
  onOpenLightbox,
  onEditCostume,
  onAddCostume,
}) => {
  const [viewMode, setViewMode] = useState<'illustration' | 'real_life' | 'split'>('illustration');

  const activeCostume =
    costumes.find(c => c.id === selectedCostumeId) || costumes[0] || null;

  const activeIndex = costumes.findIndex(c => c.id === activeCostume?.id);

  const handlePrev = () => {
    if (costumes.length === 0) return;
    const prevIdx = (activeIndex - 1 + costumes.length) % costumes.length;
    onSelectCostume(costumes[prevIdx].id);
  };

  const handleNext = () => {
    if (costumes.length === 0) return;
    const nextIdx = (activeIndex + 1) % costumes.length;
    onSelectCostume(costumes[nextIdx].id);
  };

  if (!activeCostume) {
    return null;
  }

  // 区分官方插画原画与现实成片/COS对照图
  const illustrationImage =
    activeCostume.images.find(img => img.category === 'illustration' || (!img.category && img.is_primary)) ||
    activeCostume.images[0];

  const realLifeImage =
    activeCostume.images.find(img => img.category === 'real_life') || null;

  const isVerified = activeCostume.status === 'verified';
  const isUnidentified = activeCostume.name_status === 'unidentified';
  const primarySource = activeCostume.sources[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start py-2 select-none">
      {/* 左/中展区：主舞台与底片卷 (Stage & Filmstrip) - 占 7 列 */}
      <div className="lg:col-span-7 flex flex-col space-y-4">
        {/* 顶部视图形态切换栏（插画 vs 现实实物/COS vs 双轨对照） */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5 bg-slate-950/80 backdrop-blur-md rounded-xl p-1 border border-white/[0.08] shadow-inner">
            <button
              onClick={() => setViewMode('illustration')}
              className={`text-xs px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                viewMode === 'illustration'
                  ? 'bg-teal-400/20 text-teal-200 border border-teal-400/30 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              <span>🎨 设定插画</span>
            </button>

            <button
              onClick={() => setViewMode('real_life')}
              className={`text-xs px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                viewMode === 'real_life'
                  ? 'bg-rose-500/20 text-rose-200 border border-rose-500/30 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              <span>👗 现实实物 / COS 对照</span>
              {realLifeImage && <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />}
            </button>

            <button
              onClick={() => setViewMode('split')}
              className={`text-xs px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                viewMode === 'split'
                  ? 'bg-sky-400/20 text-sky-200 border border-sky-400/30 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              <Columns className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>双轨并排对照</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-400 font-mono">
            <span>{viewMode === 'split' ? '二次元 ↔ 现实成片对照' : viewMode === 'real_life' ? '三次元实物考据' : '官方原画母版'}</span>
          </div>
        </div>

        {/* 1. 主视觉检视台 (Image Stage) */}
        <div className="relative aspect-[16/10] w-full bg-[#050811] rounded-2xl overflow-hidden border border-white/[0.08] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.8)] group flex items-center justify-center">
          {viewMode === 'split' ? (
            /* 双轨并排对照视图 (Side-by-Side Dual View) */
            <div className="w-full h-full grid grid-cols-2 divide-x divide-white/[0.08] bg-[#04060d]">
              {/* 左侧：官方二次元设定原画 */}
              <div className="relative w-full h-full flex items-center justify-center p-3 group/left overflow-hidden">
                <span className="absolute top-3 left-3 text-[10px] px-2 py-0.5 rounded bg-teal-950/80 border border-teal-500/30 text-teal-300 backdrop-blur-md z-10 font-medium">
                  2D 官方设定原画
                </span>
                {illustrationImage?.file_path ? (
                  <img
                    src={illustrationImage.file_path}
                    alt={activeCostume.name_ja || '官方插画'}
                    className="w-full h-full object-contain transition-transform duration-300 group-hover/left:scale-[1.02] cursor-zoom-in"
                    onClick={() => onOpenLightbox(activeCostume)}
                  />
                ) : (
                  <div className="text-slate-500 text-xs">暂无官方原画</div>
                )}
              </div>

              {/* 右侧：三次元现实实物/真人成片对照 */}
              <div className="relative w-full h-full flex items-center justify-center p-3 group/right overflow-hidden bg-slate-950/50">
                <span className="absolute top-3 left-3 text-[10px] px-2 py-0.5 rounded bg-rose-950/80 border border-rose-500/30 text-rose-300 backdrop-blur-md z-10 font-medium">
                  3D 现实实物 / COS 对照
                </span>
                {realLifeImage?.file_path ? (
                  <img
                    src={realLifeImage.file_path}
                    alt="现实实物对照"
                    className="w-full h-full object-contain transition-transform duration-300 group-hover/right:scale-[1.02] cursor-zoom-in"
                    onClick={() => onOpenLightbox(activeCostume)}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-500 gap-2 p-6 text-center">
                    <ImageIcon className="w-8 h-8 stroke-1 text-slate-600" />
                    <span className="text-xs text-slate-400">暂无现实实物 / 现场演出照</span>
                    <button
                      onClick={() => onEditCostume(activeCostume)}
                      className="text-xs px-3 py-1 rounded bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/30 transition-all font-medium mt-1"
                    >
                      + 关联现实对照图
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : viewMode === 'real_life' ? (
            /* 现实实物/COS 单独视口 */
            realLifeImage?.file_path ? (
              <div className="w-full h-full relative flex items-center justify-center p-2">
                <span className="absolute top-3 left-3 text-[10px] px-2.5 py-1 rounded-md bg-rose-950/90 border border-rose-500/40 text-rose-200 backdrop-blur-md z-10 font-medium shadow-md">
                  👗 现实实物 / COSPLAY 舞台对照
                </span>
                <img
                  src={realLifeImage.file_path}
                  alt="现实实物对照"
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-[1.01] cursor-zoom-in"
                  onClick={() => onOpenLightbox(activeCostume)}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-500 gap-3 p-8 text-center max-w-sm">
                <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shadow-inner">
                  <ImageIcon className="w-6 h-6 stroke-1" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-300">暂无现实实物 / COS 对照图</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    本衣装当前已收录官方 2D 原画。您可以录入声优现场 Live 演出实物照片或高品质 COS 摄影对照。
                  </p>
                </div>
                <button
                  onClick={() => onEditCostume(activeCostume)}
                  className="mt-1 text-xs px-4 py-2 rounded-lg bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold transition-all shadow-md active:scale-95"
                >
                  + 上传现实对照照片
                </button>
              </div>
            )
          ) : (
            /* 官方原画插画视口 */
            illustrationImage?.file_path ? (
              <div className="w-full h-full relative flex items-center justify-center p-2">
                {/* 状态徽标 (左上角) */}
                <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
                  <span className="text-[10px] px-2.5 py-1 rounded-md bg-teal-950/90 border border-teal-400/40 text-teal-200 backdrop-blur-md font-medium shadow-md">
                    🎨 官方原画母版
                  </span>

                  {isVerified ? (
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-[#050811]/90 border border-teal-400/40 text-teal-300 flex items-center gap-1.5 shadow-md backdrop-blur-md">
                      <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                      <span>官方已核实</span>
                    </span>
                  ) : isUnidentified ? (
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-[#050811]/90 border border-slate-600 text-slate-300 flex items-center gap-1.5 shadow-md backdrop-blur-md">
                      <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                      <span>待识别</span>
                    </span>
                  ) : (
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-[#050811]/90 border border-amber-400/40 text-amber-300 flex items-center gap-1.5 shadow-md backdrop-blur-md">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>待核实</span>
                    </span>
                  )}

                  {primarySource?.evolution_stage && primarySource.evolution_stage !== 'none' && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-sky-950/80 border border-sky-500/30 text-sky-300 backdrop-blur-md font-mono">
                      {primarySource.evolution_stage === 'awakened' ? '覚醒後' : '覚醒前'}
                    </span>
                  )}
                </div>

                <img
                  src={illustrationImage.file_path}
                  alt={activeCostume.name_ja || '衣装立绘'}
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-[1.01] cursor-zoom-in"
                  onClick={() => onOpenLightbox(activeCostume)}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-500 gap-2 p-8 text-center">
                <ImageIcon className="w-10 h-10 stroke-1 text-slate-600" />
                <span className="text-xs">暂无考证立绘图片</span>
                <button
                  onClick={() => onEditCostume(activeCostume)}
                  className="mt-2 text-xs text-teal-400 hover:underline"
                >
                  + 上传本地立绘图
                </button>
              </div>
            )
          )}

          {/* 悬停快捷工具 (右上角) */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-20">
            <button
              onClick={() => onOpenLightbox(activeCostume)}
              className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 shadow-md backdrop-blur-md transition-all"
              title="全屏检视大图"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onEditCostume(activeCostume)}
              className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 shadow-md backdrop-blur-md transition-all"
              title="编辑此衣装考据"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          </div>

          {/* 左右翻页控制器 */}
          {costumes.length > 1 && (
            <div className="absolute inset-y-0 inset-x-2 flex items-center justify-between pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-20">
              <button
                onClick={handlePrev}
                className="pointer-events-auto w-8 h-8 rounded-full bg-slate-900/80 hover:bg-teal-500 hover:text-slate-950 text-slate-300 border border-white/10 flex items-center justify-center transition-all shadow-md backdrop-blur-md"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                className="pointer-events-auto w-8 h-8 rounded-full bg-slate-900/80 hover:bg-teal-500 hover:text-slate-950 text-slate-300 border border-white/10 flex items-center justify-center transition-all shadow-md backdrop-blur-md"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* 2. 底片卷 (Filmstrip Thumbnail Carousel) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span className="font-mono text-[11px] tracking-wider uppercase text-slate-500">
              FILMSTRIP ({activeIndex + 1}/{costumes.length})
            </span>
            <span className="text-[11px] text-slate-500">点击胶片快速切换展台</span>
          </div>

          <div className="flex items-center gap-3 overflow-x-auto py-1 px-1">
            {costumes.map((c, idx) => {
              const thumb = c.images.find(i => i.is_primary) || c.images[0];
              const isSelected = c.id === activeCostume.id;
              return (
                <button
                  key={c.id}
                  onClick={() => onSelectCostume(c.id)}
                  className={`flex-none w-24 aspect-[4/3] rounded-xl overflow-hidden relative border transition-all text-left bg-slate-950 group ${
                    isSelected
                      ? 'border-teal-400 ring-2 ring-teal-400/30 scale-[1.03] shadow-lg'
                      : 'border-white/10 opacity-60 hover:opacity-100 hover:border-white/30'
                  }`}
                >
                  {thumb?.file_path ? (
                    <img
                      src={thumb.file_path}
                      alt=""
                      className="w-full h-full object-cover object-top"
                      onError={(e) => {
                        (e.currentTarget as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-600">
                      无图
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 p-1 bg-gradient-to-t from-slate-950 to-transparent">
                    <span className="text-[9px] text-slate-200 block truncate font-medium">
                      {c.name_status === 'unidentified' ? '待识别' : (c.name_ja || c.name_zh)}
                    </span>
                  </div>
                </button>
              );
            })}

            {/* 新增卡片按钮 */}
            <button
              onClick={onAddCostume}
              className="flex-none w-24 aspect-[4/3] rounded-xl border border-dashed border-white/20 hover:border-teal-400/60 bg-white/[0.02] hover:bg-white/[0.05] flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-teal-300 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span className="text-[10px] font-medium">+ 录入衣装</span>
            </button>
          </div>
        </div>
      </div>

      {/* 右侧：考据详情与检视面板 (Inspector & Detail Panel) - 占 5 列 */}
      <div className="lg:col-span-5 bg-[#0e1629]/80 border border-white/[0.08] rounded-2xl p-6 space-y-6 backdrop-blur-xl">
        {/* 主题与衣装名 */}
        <div className="space-y-1.5 border-b border-white/[0.06] pb-4">
          {activeCostume.theme?.name_ja && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-teal-400 font-medium">
                系列：{activeCostume.theme.name_ja}
              </span>
              {activeCostume.theme.name_zh && (
                <span className="text-xs text-slate-500">({activeCostume.theme.name_zh})</span>
              )}
            </div>
          )}

          {isUnidentified ? (
            <div>
              <h2 className="serif-title text-xl font-bold text-slate-200 flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 font-mono">
                  待识别
                </span>
                <span>{activeCostume.name_zh || '尚未考据日文原名'}</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                该服装尚未查明官方原名，本库严禁杜撰伪名称，待查实后再予补全。
              </p>
            </div>
          ) : (
            <div>
              <h2 className="serif-title text-xl font-bold text-slate-100 tracking-wide leading-snug">
                {activeCostume.name_ja}
              </h2>
              {activeCostume.name_zh && (
                <p className="text-xs text-slate-400 mt-0.5">{activeCostume.name_zh}</p>
              )}
            </div>
          )}
        </div>

        {/* 考据出处卡片 */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-slate-300 block tracking-wider uppercase font-mono">
            EVIDENCE CITATIONS · 出处依据
          </span>

          {activeCostume.sources.length === 0 ? (
            <div className="p-4 rounded-xl bg-slate-900/50 border border-white/[0.06] text-xs text-slate-500 italic">
              暂未关联官方出处依据
            </div>
          ) : (
            <div className="space-y-2.5">
              {activeCostume.sources.map(src => (
                <div
                  key={src.id}
                  className="p-3.5 rounded-xl bg-slate-900/70 border border-white/[0.06] space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-200">{src.title}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.05] text-slate-400 border border-white/[0.06]">
                      {src.source_type === 'game_card'
                        ? '手游卡面'
                        : src.source_type === 'seiyuu_live'
                        ? '声优Live'
                        : src.source_type === 'anime'
                        ? '动画'
                        : '官方出处'}
                    </span>
                  </div>

                  {src.detail && (
                    <p className="text-[11px] text-slate-400 leading-relaxed">{src.detail}</p>
                  )}

                  {src.url && (
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-teal-300 hover:text-teal-200 hover:underline pt-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5 flex-none" />
                      <span>打开可复查的官方链接</span>
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 服装设计特征备忘 */}
        {activeCostume.notes && (
          <div className="space-y-1.5 border-t border-white/[0.06] pt-4">
            <span className="text-xs font-semibold text-slate-300 block tracking-wider uppercase font-mono">
              DESIGN NOTES · 服装特征
            </span>
            <p className="text-xs text-slate-400 whitespace-pre-wrap leading-relaxed bg-slate-950/40 p-3 rounded-xl border border-white/[0.04]">
              {activeCostume.notes}
            </p>
          </div>
        )}

        {/* 收录图像对照清单 (插画 ↔ 现实) */}
        {activeCostume.images.length > 0 && (
          <div className="space-y-2 border-t border-white/[0.06] pt-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 tracking-wider uppercase font-mono">
                VISUAL ASSETS · 视觉对照 ({activeCostume.images.length})
              </span>
              {realLifeImage && viewMode !== 'split' && (
                <button
                  onClick={() => setViewMode('split')}
                  className="text-[11px] text-sky-300 hover:text-sky-200 flex items-center gap-1 transition-colors"
                >
                  <Columns className="w-3 h-3" />
                  <span>并排双轨对照</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {activeCostume.images.map((img, i) => (
                <div
                  key={img.id || i}
                  onClick={() => {
                    if (img.category === 'real_life') setViewMode('real_life');
                    else if (img.category === 'illustration') setViewMode('illustration');
                  }}
                  className={`p-2 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-all ${
                    (viewMode === 'real_life' && img.category === 'real_life') ||
                    (viewMode === 'illustration' && img.category === 'illustration')
                      ? 'bg-slate-900 border-teal-400/40 ring-1 ring-teal-400/20'
                      : 'bg-slate-950/60 border-white/[0.06] hover:border-white/20'
                  }`}
                >
                  <div className="w-10 h-10 rounded-lg overflow-hidden flex-none bg-slate-900 border border-white/10">
                    <img
                      src={img.file_path}
                      alt=""
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className={`text-[10px] font-semibold block ${
                      img.category === 'real_life'
                        ? 'text-rose-300'
                        : img.category === 'detail'
                        ? 'text-amber-300'
                        : 'text-teal-300'
                    }`}>
                      {img.category === 'real_life' ? '👗 现实实物/COS' : img.category === 'detail' ? '🔍 细节特写' : '🎨 设定插画'}
                    </span>
                    <span className="text-[11px] text-slate-400 truncate block">
                      {img.caption || img.original_filename || '未命名图片'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 操作区 */}
        <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
          <button
            onClick={() => onEditCostume(activeCostume)}
            className="text-xs px-3 py-1.5 rounded-lg bg-teal-500/15 hover:bg-teal-500/25 text-teal-300 border border-teal-400/30 flex items-center gap-1.5 transition-all font-medium"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>编辑考据资料</span>
          </button>

          <button
            onClick={() => onOpenLightbox(activeCostume)}
            className="text-xs px-3 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/[0.05] transition-all flex items-center gap-1.5"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>全屏查看立绘</span>
          </button>
        </div>
      </div>
    </div>
  );
};
