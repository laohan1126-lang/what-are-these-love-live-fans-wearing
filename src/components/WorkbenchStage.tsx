import React, { useState } from 'react';
import { CostumeVariant } from '../types';
import {
  ShieldCheck,
  Clock,
  HelpCircle,
  ExternalLink,
  Edit3,
  Maximize2,
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
  onCurateCostumes?: () => void;
  isCurating?: boolean;
}

export const WorkbenchStage: React.FC<WorkbenchStageProps> = ({
  costumes,
  selectedCostumeId,
  onSelectCostume,
  onOpenLightbox,
  onEditCostume,
  onAddCostume,
  onCurateCostumes,
  isCurating = false,
}) => {
  const [viewMode, setViewMode] = useState<'split' | 'illustration' | 'real_life'>('split');

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

  const cycleViewMode = () => {
    setViewMode(prev =>
      prev === 'split' ? 'illustration' : prev === 'illustration' ? 'real_life' : 'split'
    );
  };

  if (!activeCostume) {
    return null;
  }

  // 解析双轨与细节视觉资产
  const illustrationImage =
    activeCostume.images.find(
      img => img.category === 'illustration' || (!img.category && img.is_primary)
    ) || activeCostume.images[0];

  const realLifeImage =
    activeCostume.images.find(img => img.category === 'real_life') || null;

  const detailImages = activeCostume.images.filter(img => img.category === 'detail');

  const isVerified = activeCostume.status === 'verified';
  const isUnidentified = activeCostume.name_status === 'unidentified';
  const primarySource = activeCostume.sources[0];

  // 主视觉锚点图片路径（确保 #main-image 始终指向真实可解码图像）
  const mainAnchorSrc =
    viewMode === 'real_life' && realLifeImage?.file_path
      ? realLifeImage.file_path
      : illustrationImage?.file_path || '/assets/theme_stage_shioriko.jpg';

  const showDualSplit = viewMode === 'split' && Boolean(realLifeImage?.file_path);

  const renderFolioStrip = (className: string) => (
    <div className={className} aria-label="衣桁卷宗底片导轨">
      <div className="flex items-center justify-between text-[11px] pb-1.5 border-b border-[#e5b869]/20">
        <span className="font-mono tracking-[0.2em] uppercase text-[#e5b869]">
          KIMONO RACK · 衣桁卷宗 ({String(activeIndex + 1).padStart(2, '0')}/
          {String(costumes.length).padStart(2, '0')})
        </span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handlePrev}
            className="atelier-zone text-slate-400 hover:text-[#2dd4bf] font-mono text-[11px] flex items-center gap-0.5 cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>前卷</span>
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="atelier-zone text-slate-400 hover:text-[#2dd4bf] font-mono text-[11px] flex items-center gap-0.5 cursor-pointer"
          >
            <span>次卷</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex items-stretch gap-4 overflow-x-auto pt-2 pb-1">
        {costumes.map((c, idx) => {
          const thumb = c.images.find(i => i.is_primary) || c.images[0];
          const isSelected = c.id === activeCostume.id;
          const has3D = c.images.some(i => i.category === 'real_life');
          const serial = String(idx + 1).padStart(2, '0');
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => onSelectCostume(c.id)}
              className={`atelier-zone group flex-none w-36 text-left pt-1 pb-1.5 border-b-2 transition-all cursor-pointer ${
                isSelected
                  ? 'border-[#2dd4bf] opacity-100'
                  : 'border-transparent opacity-60 hover:opacity-95 hover:border-[#e5b869]/40'
              }`}
            >
              <div className="aspect-[16/9] w-full overflow-hidden bg-[#050811] relative mb-1">
                {thumb?.file_path ? (
                  <img
                    src={thumb.file_path}
                    alt=""
                    className="character-visual-asset w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-mono text-[10px] text-slate-600">
                    NO IMAGE
                  </div>
                )}
              </div>
              <div className="flex items-baseline justify-between gap-1">
                <span className="font-mono text-[10px] text-[#e5b869]">{serial}</span>
                <span className="text-[11px] text-slate-200 truncate flex-1 font-medium">
                  {c.name_status === 'unidentified' ? '待识名衣装' : c.name_ja || c.name_zh}
                </span>
                {has3D && (
                  <span className="font-mono text-[9px] text-[#f43f5e]" title="含3D真人实穿对照">
                    2D×3D
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-7 items-start select-none">
      {/* 左侧主舞台区 (占 8 列)：开放式屏风对照画幅，零圆角卡片套卡片 */}
      <div className="lg:col-span-8 flex flex-col space-y-3 animate-folio-1">
        {/* 屏风顶部标尺 */}
        <div className="flex items-center justify-between text-[11px] border-b border-[#e5b869]/20 pb-1.5">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] tracking-[0.22em] text-[#e5b869] uppercase">
              STAGE SCREEN · 屏风检视台
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-300 font-medium">
              {showDualSplit
                ? '壱 · 2D 设定母版  ×  弐 · 3D 现世实穿'
                : viewMode === 'real_life'
                ? '弐 · 三次元真人实穿独奏'
                : '壱 · 二次元官方设定原画母版'}
            </span>
          </div>

          <div className="flex items-center gap-3 font-mono text-[10px]">
            { (['split', 'illustration', 'real_life'] as const).map(mode => {
              const active = viewMode === mode;
              const label =
                mode === 'split' ? '双折并置' : mode === 'illustration' ? '壱·绘卷' : '弐·现世';
              return (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setViewMode(mode)}
                  className={`skyline-tab atelier-zone cursor-pointer ${
                    active ? 'is-active text-[#2dd4bf] font-semibold' : 'text-slate-400'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 主视觉检视画幅（左侧锚点 #main-image 所在舞台，开放式透明底，零嵌套盒） */}
        <div className="relative w-full h-[220px] sm:h-[340px] lg:h-[370px] bg-transparent border-b border-[#e5b869]/25 overflow-hidden group">
          {showDualSplit ? (
            /* 双轨屏风并置视图 (2D 原画 × 3D 真人实穿) */
            <div className="w-full h-full grid grid-cols-2 divide-x divide-[#e5b869]/25">
              {/* 左扇：2D 官方设定原画 (#main-image) */}
              <div className="relative w-full h-full flex flex-col justify-between p-2 sm:p-3 overflow-hidden">
                <div className="flex items-center justify-between text-[10px] font-mono text-[#2dd4bf] z-10 pointer-events-none">
                  <span>壱 · 2D OFFICIAL ILLUSTRATION</span>
                  {primarySource?.evolution_stage && primarySource.evolution_stage !== 'none' && (
                    <span className="text-[#e5b869]">
                      [{primarySource.evolution_stage === 'awakened' ? '覚醒後' : '覚醒前'}]
                    </span>
                  )}
                </div>

                <div className="flex-1 min-h-0 flex items-center justify-center py-1">
                  <img
                    id="main-image"
                    src={mainAnchorSrc}
                    alt={activeCostume.name_ja || '2D 官方设定原画'}
                    onClick={() => onOpenLightbox(activeCostume)}
                    className="character-visual-asset max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-[1.015] cursor-zoom-in"
                  />
                </div>

                <div className="text-[10px] text-slate-400 truncate font-mono z-10 pointer-events-none">
                  {illustrationImage?.caption || '官方设定原画母版'}
                </div>
              </div>

              {/* 右扇：3D 真人模特实穿对照 */}
              <div className="relative w-full h-full flex flex-col justify-between p-2 sm:p-3 overflow-hidden bg-transparent">
                <div className="flex items-center justify-between text-[10px] font-mono text-[#f43f5e] z-10 pointer-events-none">
                  <span>弐 · 3D REAL-LIFE MODEL</span>
                  <span className="text-[#e5b869]">[正面立姿对照]</span>
                </div>

                <div className="flex-1 min-h-0 flex items-center justify-center py-1">
                  <img
                    src={realLifeImage!.file_path}
                    alt={`${activeCostume.name_ja || '衣装'} 3D 真人实穿对照`}
                    onClick={() => onOpenLightbox(activeCostume)}
                    className="character-visual-asset max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-[1.015] cursor-zoom-in"
                  />
                </div>

                <div className="text-[10px] text-slate-400 truncate font-mono z-10 pointer-events-none">
                  {realLifeImage?.caption || '三次元真人实穿对照'}
                </div>
              </div>
            </div>
          ) : (
            /* 单幅全展画幅（当仅有一轨图像或用户切换至单轨独奏时，优雅满幅呈现，绝不留黑洞） */
            <div className="relative w-full h-full flex flex-col justify-between p-2.5 sm:p-4">
              <div className="flex items-center justify-between text-[10px] font-mono z-10 pointer-events-none">
                <span className="text-[#2dd4bf]">
                  {viewMode === 'real_life' && realLifeImage
                    ? '弐 · 3D REAL-LIFE STAGE MODEL'
                    : '壱 · 2D MASTER ILLUSTRATION'}
                </span>
                <span className="text-[#e5b869]">
                  {!realLifeImage
                    ? '当前卷宗仅收录 2D 设定原画 · 可在右侧关联 3D 实穿'
                    : '点击画幅唤起全屏高清检视'}
                </span>
              </div>

              <div className="flex-1 min-h-0 flex items-center justify-center py-1">
                <img
                  id="main-image"
                  src={mainAnchorSrc}
                  alt={activeCostume.name_ja || '衣装主视觉'}
                  onClick={() => onOpenLightbox(activeCostume)}
                  className="character-visual-asset max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-[1.015] cursor-zoom-in"
                />
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono z-10">
                <span className="truncate">
                  {viewMode === 'real_life' && realLifeImage
                    ? realLifeImage.caption
                    : illustrationImage?.caption || '官方超清原画母版'}
                </span>
                {!realLifeImage && (
                  <button
                    type="button"
                    onClick={() => onEditCostume(activeCostume)}
                    className="atelier-zone text-[#f43f5e] hover:underline cursor-pointer pointer-events-auto"
                  >
                    + 关联三次元实穿照 ↗
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 桌面端：衣桁底片卷导轨位于主舞台正下方 */}
        {renderFolioStrip('hidden lg:block pt-1')}
      </div>

      {/* 右侧开放式考据手帖栏 (占 4 列，control_side: "right"，零外层卡片盒嵌套) */}
      <aside
        className="lg:col-span-4 lg:border-l lg:border-[#e5b869]/25 lg:pl-6 flex flex-col space-y-3.5 animate-folio-2"
        aria-label="衣装考据手帖与首屏核心操作"
      >
        {/* 1. 卷宗编号、玉印状态与衣装主标题 */}
        <div className="border-b border-[#e5b869]/20 pb-2.5 space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-[10px] tracking-[0.2em] text-[#e5b869] uppercase">
              FOLIO NO. {String(activeIndex + 1).padStart(2, '0')} /{' '}
              {String(costumes.length).padStart(2, '0')}
            </span>

            {/* 核实玉印（无外盒嵌套，纯印记排版） */}
            {isVerified ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#2dd4bf]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#2dd4bf]" />
                <span>玉印 · 官方已核实</span>
              </span>
            ) : isUnidentified ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400">
                <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                <span>待查明官方原名</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#e5b869]">
                <Clock className="w-3.5 h-3.5 text-[#e5b869]" />
                <span>待核实出处</span>
              </span>
            )}
          </div>

          {activeCostume.theme?.name_ja && (
            <div className="text-[11px] text-[#2dd4bf] font-mono">
              曲目 / 主题：{activeCostume.theme.name_ja}
              {activeCostume.theme.name_zh ? ` (${activeCostume.theme.name_zh})` : ''}
            </div>
          )}

          <h2 className="serif-title text-lg sm:text-xl font-bold text-slate-100 leading-snug tracking-tight m-0">
            {isUnidentified
              ? activeCostume.name_zh || '待考据日文原名衣装'
              : activeCostume.name_ja}
          </h2>

          {!isUnidentified && activeCostume.name_zh && (
            <p className="text-xs text-slate-400 m-0">{activeCostume.name_zh}</p>
          )}
        </div>

        {/* 2. 首屏核心操作组（严格满足 1440x900 / 1366x768 右侧首屏与 390x844 首屏契约） */}
        <div className="space-y-2 border-b border-[#e5b869]/20 pb-3">
          {/* 主动作 #primary-action：切换屏风视轨 */}
          <button
            id="primary-action"
            type="button"
            onClick={cycleViewMode}
            className="atelier-zone w-full py-2 px-3 bg-[#2dd4bf] hover:bg-[#5eead4] text-[#041210] font-bold text-xs tracking-wider flex items-center justify-between transition-all cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Columns className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>
                切换屏风视轨（当前：
                {viewMode === 'split'
                  ? '双折 2D×3D'
                  : viewMode === 'illustration'
                  ? '壱·2D原画'
                  : '弐·3D实穿'}
                ）
              </span>
            </span>
            <span className="font-mono text-[10px] uppercase">TURN ↗</span>
          </button>

          {/* 4 项核心手帖操作矩阵 (#action-lightbox, #action-edit, #action-add, #action-curate)：开放式排印行，无子盒底色 */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
            <button
              id="action-lightbox"
              type="button"
              onClick={() => onOpenLightbox(activeCostume)}
              className="atelier-zone py-2 px-1 border-b border-[#2dd4bf]/45 hover:border-[#2dd4bf] bg-transparent text-slate-100 hover:text-[#2dd4bf] text-xs flex items-center justify-between transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <Maximize2 className="w-3.5 h-3.5 text-[#2dd4bf]" />
                <span>全屏原画检视</span>
              </span>
              <span className="font-mono text-[10px] text-[#2dd4bf]">↗</span>
            </button>

            <button
              id="action-edit"
              type="button"
              onClick={() => onEditCostume(activeCostume)}
              className="atelier-zone py-2 px-1 border-b border-[#e5b869]/45 hover:border-[#e5b869] bg-transparent text-slate-100 hover:text-[#e5b869] text-xs flex items-center justify-between transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <Edit3 className="w-3.5 h-3.5 text-[#e5b869]" />
                <span>修订考据卷宗</span>
              </span>
              <span className="font-mono text-[10px] text-[#e5b869]">✎</span>
            </button>

            <button
              id="action-add"
              type="button"
              onClick={onAddCostume}
              className="atelier-zone py-2 px-1 border-b border-[#2dd4bf]/35 hover:border-[#2dd4bf] bg-transparent text-slate-200 hover:text-[#2dd4bf] text-xs flex items-center justify-between transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5 text-[#2dd4bf]" />
                <span>手动著录衣装</span>
              </span>
              <span className="font-mono text-[10px] text-[#2dd4bf]">+</span>
            </button>

            <button
              id="action-curate"
              type="button"
              onClick={onCurateCostumes}
              disabled={isCurating}
              className="atelier-zone py-2 px-1 border-b border-sky-400/40 hover:border-sky-300 bg-transparent text-slate-200 hover:text-sky-300 text-xs flex items-center justify-between transition-colors cursor-pointer disabled:opacity-50"
            >
              <span className="flex items-center gap-1.5">
                <Sparkles className={`w-3.5 h-3.5 text-sky-300 ${isCurating ? 'animate-spin' : ''}`} />
                <span>{isCurating ? '检索卡面中…' : '补录社区卡面'}</span>
              </span>
              <span className="font-mono text-[10px] text-sky-300">✦</span>
            </button>
          </div>
        </div>

        {/* 3. 开放式视轨对照与权威出处链（纯排版行，无框中框） */}
        <div className="space-y-2.5 text-xs animate-folio-3">
          {activeCostume.notes && (
            <p className="text-slate-300 leading-relaxed m-0 border-l-2 border-[#e5b869]/60 pl-2.5">
              {activeCostume.notes}
            </p>
          )}

          {/* 细节附图微缩导览（若有 detail 图像，点击直达灯箱） */}
          {detailImages.length > 0 && (
            <div className="space-y-1">
              <span className="font-mono text-[10px] text-[#e5b869] uppercase tracking-wider block">
                STAGE DETAILS · 舞台与版型细节佐证 ({detailImages.length})
              </span>
              <div className="flex items-center gap-2 overflow-x-auto py-0.5">
                {detailImages.map(d => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => onOpenLightbox(activeCostume)}
                    className="atelier-zone flex-none w-16 aspect-[4/3] bg-[#050811] border-b border-[#e5b869]/40 overflow-hidden opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
                    title={d.caption || '点击查看细节大图'}
                  >
                    <img
                      src={d.file_path}
                      alt={d.caption || '细节佐证'}
                      className="character-visual-asset w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 权威出处依据行 */}
          <div className="space-y-1.5 pt-1">
            <span className="font-mono text-[10px] text-[#2dd4bf] uppercase tracking-wider block">
              VERIFIED PROVENANCE · 考据出处 ({activeCostume.sources.length})
            </span>
            {activeCostume.sources.length === 0 ? (
              <p className="text-[11px] text-slate-500 italic m-0">
                暂未绑定外部出处链接，可通过「修订考据卷宗」补充。
              </p>
            ) : (
              <div className="divide-y divide-white/[0.06]">
                {activeCostume.sources.map(src => (
                  <div key={src.id} className="py-1.5 flex items-baseline justify-between gap-2">
                    <div className="min-w-0">
                      <span className="text-slate-200 font-medium block truncate">{src.title}</span>
                      {src.detail && (
                        <span className="text-[11px] text-slate-400 block truncate">
                          {src.detail}
                        </span>
                      )}
                    </div>
                    {src.url && (
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="atelier-zone flex-none inline-flex items-center gap-1 text-[11px] text-[#2dd4bf] hover:text-[#e5b869] font-mono"
                      >
                        <span>溯源</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* 手机端：衣桁卷宗底片导轨置于首屏操作组下方，确保 390x844 首屏内五大按钮 100% 可达 */}
      <div className="lg:hidden">{renderFolioStrip('pt-2')}</div>
    </div>
  );
};
