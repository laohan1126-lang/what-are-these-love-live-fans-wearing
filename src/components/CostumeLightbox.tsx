import React, { useState, useEffect } from 'react';
import { CostumeVariant } from '../types';
import { X, ZoomIn, ZoomOut, ExternalLink, ShieldCheck, Clock, HelpCircle, Edit3, ChevronLeft, ChevronRight } from 'lucide-react';

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

  const images = costume.images.length > 0 ? costume.images : [{ file_path: '', caption: '暂无图片' }];
  const currentImage = images[activeImageIndex] || images[0];

  const isVerified = costume.status === 'verified';
  const isUnidentified = costume.name_status === 'unidentified';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl h-[88vh] bg-[#0c1427]/95 border border-sky-400/25 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 flex items-center justify-center transition-all shadow-lg"
          aria-label="关闭详情"
        >
          <X className="w-4 h-4" />
        </button>

        {/* 左侧：大图浏览区域 */}
        <div className="relative flex-1 bg-slate-950 flex flex-col items-center justify-center overflow-hidden border-b md:border-b-0 md:border-r border-sky-400/15">
          {currentImage.file_path ? (
            <div className={`w-full h-full flex items-center justify-center p-4 overflow-auto ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`} onClick={() => setIsZoomed(!isZoomed)}>
              <img
                src={currentImage.file_path}
                alt={costume.name_ja || '衣装立绘'}
                className={`max-w-full max-h-full object-contain transition-all duration-300 ${isZoomed ? 'scale-150' : 'scale-100'}`}
              />
            </div>
          ) : (
            <div className="text-center text-slate-500 text-xs">
              暂无高清立绘图片
            </div>
          )}

          {/* 缩放切换与多图切换 */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
            <button
              onClick={() => setIsZoomed(!isZoomed)}
              className="pointer-events-auto px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-xs text-slate-300 border border-slate-700 flex items-center gap-1.5 backdrop-blur-md shadow-md"
            >
              {isZoomed ? <ZoomOut className="w-3.5 h-3.5" /> : <ZoomIn className="w-3.5 h-3.5" />}
              <span>{isZoomed ? '适应窗口' : '放大图片'}</span>
            </button>

            {images.length > 1 && (
              <div className="pointer-events-auto flex items-center gap-2 bg-slate-900/80 px-2 py-1 rounded-lg border border-slate-700 backdrop-blur-md">
                <button
                  onClick={() => setActiveImageIndex((activeImageIndex - 1 + images.length) % images.length)}
                  className="p-1 text-slate-300 hover:text-white"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs text-slate-300 font-mono">
                  {activeImageIndex + 1} / {images.length}
                </span>
                <button
                  onClick={() => setActiveImageIndex((activeImageIndex + 1) % images.length)}
                  className="p-1 text-slate-300 hover:text-white"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 右侧：考据元数据与来源面板 */}
        <div className="w-full md:w-96 flex flex-col justify-between p-6 overflow-y-auto bg-[#0a1020]/90">
          <div className="space-y-5">
            {/* 顶部标签 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isVerified ? (
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-teal-950 border border-teal-400 text-teal-300 flex items-center gap-1.5 shadow-[0_0_12px_-2px_rgba(45,212,191,0.4)]">
                    <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                    已核实官方出处
                  </span>
                ) : isUnidentified ? (
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-900 border border-slate-600 text-slate-300 flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                    待查明官方名称
                  </span>
                ) : (
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-950 border border-amber-400 text-amber-300 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    待核实出处
                  </span>
                )}
              </div>

              <button
                onClick={() => {
                  onClose();
                  onEdit();
                }}
                className="text-xs px-3 py-1 rounded-lg bg-teal-500/15 hover:bg-teal-500/25 text-teal-300 border border-teal-400/30 flex items-center gap-1 transition-all"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>编辑资料</span>
              </button>
            </div>

            {/* 名称与主题 */}
            <div className="space-y-1.5">
              {costume.theme?.name_ja && (
                <span className="text-xs font-medium text-teal-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                  主题系列：{costume.theme.name_ja}
                </span>
              )}
              {isUnidentified ? (
                <div>
                  <h2 className="text-lg font-bold text-slate-300 flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                      待识别
                    </span>
                    <span>{costume.name_zh || '尚未考据日文原名'}</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    当前暂未查证到该服装的官方日文原名，本库不编造臆测名称。
                  </p>
                </div>
              ) : (
                <div>
                  <h2 className="text-lg font-bold text-slate-100 leading-snug">
                    {costume.name_ja}
                  </h2>
                  {costume.name_zh && (
                    <p className="text-xs text-slate-400 mt-0.5">{costume.name_zh}</p>
                  )}
                </div>
              )}
            </div>

            {/* 服装设计与考据备忘 */}
            {costume.notes && (
              <div className="p-3 rounded-xl bg-slate-900/60 border border-sky-400/10 space-y-1">
                <span className="text-[11px] font-semibold text-slate-300">服装细节与设计特征：</span>
                <p className="text-xs text-slate-400 whitespace-pre-wrap leading-relaxed">
                  {costume.notes}
                </p>
              </div>
            )}

            {/* 来源依据列表 (可复查外链) */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-300 block">
                官方/权威出处依据 ({costume.sources.length} 条)：
              </span>
              {costume.sources.length === 0 ? (
                <p className="text-xs text-slate-500 italic">暂未录入出处依据</p>
              ) : (
                <div className="space-y-2">
                  {costume.sources.map(src => (
                    <div
                      key={src.id}
                      className="p-3 rounded-xl bg-slate-900/80 border border-sky-400/15 space-y-1"
                    >
                      <div className="flex items-center justify-between text-xs font-medium text-slate-200">
                        <span className="truncate">{src.title}</span>
                        {src.evolution_stage && src.evolution_stage !== 'none' && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800">
                            {src.evolution_stage === 'awakened' ? '觉醒后' : '觉醒前'}
                          </span>
                        )}
                      </div>

                      {src.detail && (
                        <p className="text-[11px] text-slate-400">{src.detail}</p>
                      )}

                      {src.url && (
                        <a
                          href={src.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-teal-300 hover:text-teal-200 hover:underline pt-1 break-all"
                        >
                          <ExternalLink className="w-3 h-3 flex-none" />
                          <span>访问复查官方出处链接</span>
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 mt-6 border-t border-sky-400/10 text-[11px] text-slate-500 flex justify-between">
            <span>记录 ID: {costume.id.slice(0, 12)}...</span>
            <span>更新于: {new Date(costume.updated_at).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
