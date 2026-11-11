import React, { useState, useEffect } from 'react';
import { CostumeVariant } from '../types';
import {
  X,
  ZoomIn,
  ZoomOut,
  ExternalLink,
  ShieldCheck,
  Clock,
  HelpCircle,
  Edit3,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface CostumeLightboxProps {
  costume: CostumeVariant;
  onClose: () => void;
  onEdit: () => void;
}

export const CostumeLightbox: React.FC<CostumeLightboxProps> = ({
  costume,
  onClose,
  onEdit,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const images =
    costume.images.length > 0
      ? costume.images
      : [{ file_path: '', caption: '暂无图片', category: 'illustration' as const }];
  const currentImage = images[activeImageIndex] || images[0];

  const isVerified = costume.status === 'verified';
  const isUnidentified = costume.name_status === 'unidentified';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#040710]/90 backdrop-blur-xl animate-in fade-in duration-200 select-none"
      role="dialog"
      aria-modal="true"
      aria-label="衣装原画与实穿全屏检视"
    >
      {/* 单层弹层容器：内部使用金丝细线与排版分隔，不嵌套子卡片 */}
      <div className="relative w-full max-w-6xl h-[88vh] bg-[#070c18] border border-[#e5b869]/35 shadow-2xl flex flex-col md:flex-row overflow-hidden">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 bg-[#070c18]/85 hover:bg-[#2dd4bf] text-slate-200 hover:text-[#041210] border border-[#e5b869]/40 flex items-center justify-center transition-colors cursor-pointer"
          aria-label="关闭全屏检视"
        >
          <X className="w-4 h-4" />
        </button>

        {/* 左：高清原画/实穿画幅区 */}
        <div className="relative flex-1 bg-[#04060d] flex flex-col justify-between p-4 overflow-hidden border-b md:border-b-0 md:border-r border-[#e5b869]/25">
          <div className="flex items-center justify-between text-xs font-mono z-10 pr-10">
            <span
              className={
                currentImage.category === 'real_life'
                  ? 'text-[#f43f5e]'
                  : currentImage.category === 'detail'
                  ? 'text-[#e5b869]'
                  : 'text-[#2dd4bf]'
              }
            >
              {currentImage.category === 'real_life'
                ? '弐 · 3D REAL-LIFE STAGE MODEL'
                : currentImage.category === 'detail'
                ? '参 · STAGE & FABRIC DETAIL'
                : '壱 · 2D MASTER ILLUSTRATION'}
            </span>
            {currentImage.caption && (
              <span className="text-slate-400 truncate max-w-md">{currentImage.caption}</span>
            )}
          </div>

          {currentImage.file_path ? (
            <div
              className={`flex-1 min-h-0 flex items-center justify-center overflow-auto py-2 ${
                isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
              }`}
              onClick={() => setIsZoomed(!isZoomed)}
            >
              <img
                src={currentImage.file_path}
                alt={costume.name_ja || '衣装高清图'}
                className={`max-w-full max-h-full object-contain transition-transform duration-300 ${
                  isZoomed ? 'scale-150' : 'scale-100'
                }`}
              />
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-500 text-xs font-mono">
              NO IMAGE RECORDED
            </div>
          )}

          {/* 底部控制尺 */}
          <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs font-mono z-10">
            <button
              type="button"
              onClick={() => setIsZoomed(!isZoomed)}
              className="text-slate-300 hover:text-[#2dd4bf] flex items-center gap-1.5 cursor-pointer"
            >
              {isZoomed ? <ZoomOut className="w-3.5 h-3.5" /> : <ZoomIn className="w-3.5 h-3.5" />}
              <span>{isZoomed ? '适应画幅' : '150% 原寸放大'}</span>
            </button>

            {images.length > 1 && (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setActiveImageIndex((activeImageIndex - 1 + images.length) % images.length)
                  }
                  className="text-slate-300 hover:text-[#2dd4bf] flex items-center gap-0.5 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>上一帧</span>
                </button>
                <span className="text-[#e5b869]">
                  {String(activeImageIndex + 1).padStart(2, '0')} /{' '}
                  {String(images.length).padStart(2, '0')}
                </span>
                <button
                  type="button"
                  onClick={() => setActiveImageIndex((activeImageIndex + 1) % images.length)}
                  className="text-slate-300 hover:text-[#2dd4bf] flex items-center gap-0.5 cursor-pointer"
                >
                  <span>下一帧</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 右：考据卷宗与出处排版栏（内部零卡片嵌套） */}
        <div className="w-full md:w-96 flex flex-col justify-between p-6 overflow-y-auto bg-[#070c18]">
          <div className="space-y-5 divide-y divide-[#e5b869]/20">
            <div className="space-y-2 pb-4">
              <div className="flex items-center justify-between pr-8">
                {isVerified ? (
                  <span className="text-xs font-semibold text-[#2dd4bf] flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    <span>玉印 · 已核实官方出处</span>
                  </span>
                ) : isUnidentified ? (
                  <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4" />
                    <span>待查明官方原名</span>
                  </span>
                ) : (
                  <span className="text-xs font-medium text-[#e5b869] flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>待核实出处</span>
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onEdit();
                  }}
                  className="text-xs text-[#e5b869] hover:text-[#2dd4bf] flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>修订卷宗</span>
                </button>
              </div>

              {costume.theme?.name_ja && (
                <div className="text-xs text-[#2dd4bf] font-mono">
                  主题系列：{costume.theme.name_ja}
                </div>
              )}

              <h2 className="serif-title text-xl font-bold text-slate-100 leading-snug m-0">
                {isUnidentified ? costume.name_zh || '待考据日文原名' : costume.name_ja}
              </h2>
              {costume.name_zh && !isUnidentified && (
                <p className="text-xs text-slate-400 m-0">{costume.name_zh}</p>
              )}
            </div>

            {costume.notes && (
              <div className="pt-4 space-y-1">
                <span className="font-mono text-[10px] text-[#e5b869] uppercase tracking-wider block">
                  DESIGN NOTES · 版型与考据备忘
                </span>
                <p className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed m-0">
                  {costume.notes}
                </p>
              </div>
            )}

            <div className="pt-4 space-y-2">
              <span className="font-mono text-[10px] text-[#2dd4bf] uppercase tracking-wider block">
                AUTHORITATIVE SOURCES · 出处依据 ({costume.sources.length})
              </span>
              {costume.sources.length === 0 ? (
                <p className="text-xs text-slate-500 italic m-0">暂未录入出处依据</p>
              ) : (
                <div className="divide-y divide-white/[0.06]">
                  {costume.sources.map(src => (
                    <div key={src.id} className="py-2.5 space-y-1">
                      <div className="flex items-center justify-between gap-2 text-xs font-medium text-slate-100">
                        <span className="truncate">{src.title}</span>
                        {src.evolution_stage && src.evolution_stage !== 'none' && (
                          <span className="font-mono text-[10px] text-[#e5b869] whitespace-nowrap flex-none">
                            [{src.evolution_stage === 'awakened' ? '觉醒后' : '觉醒前'}]
                          </span>
                        )}
                      </div>
                      {src.detail && <p className="text-[11px] text-slate-400 m-0">{src.detail}</p>}
                      {src.url && (
                        <a
                          href={src.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-[#2dd4bf] hover:underline font-mono break-all"
                        >
                          <ExternalLink className="w-3 h-3 flex-none" />
                          <span>访问官方出处链接</span>
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 mt-6 border-t border-[#e5b869]/20 text-[10px] font-mono text-slate-500 flex justify-between">
            <span>ID: {costume.id.slice(0, 14)}</span>
            <span>UPDATED: {new Date(costume.updated_at).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
