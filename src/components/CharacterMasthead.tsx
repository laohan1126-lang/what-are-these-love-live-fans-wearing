import React from 'react';
import { Character, FilterOptions } from '../types';
import { Plus, CheckCircle, Clock, HelpCircle, Sparkles } from 'lucide-react';

interface CharacterMastheadProps {
  character: Character;
  costumeCount: number;
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  onAddCostume: () => void;
  onCurateCostumes?: () => void;
  isCurating?: boolean;
}

export const CharacterMasthead: React.FC<CharacterMastheadProps> = ({
  character,
  costumeCount,
  filters,
  onFilterChange,
  onAddCostume,
  onCurateCostumes,
  isCurating = false,
}) => {
  const isShioriko = character.id === 'mifune-shioriko';

  return (
    <section className="relative overflow-hidden border-b border-white/[0.08] bg-[#090f1f]/90 select-none">
      {/* 舞台原画融合场景 (仅在右侧呈现，带平滑渐变蒙版，保护人物面部并与暗场无缝衔接) */}
      <div className="absolute right-0 top-0 bottom-0 w-[45%] max-w-xl pointer-events-none overflow-hidden hidden sm:block">
        <img
          src="/uploads/shioriko_ketsui_no_hikari.jpg"
          alt=""
          className="w-full h-full object-cover object-top opacity-30 mix-blend-screen"
          style={{
            maskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0.9) 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0.9) 100%)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#090f1f] via-transparent to-[#090f1f]/50 pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-5 relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        {/* 左侧：角色刊头信息与斜体引语 */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs">
            <span
              className="w-2 h-2 rounded-full flex-none shadow-sm"
              style={{ backgroundColor: character.color_hex || '#2dd4bf' }}
            />
            <span className="eyebrow">
              {character.enrollment_term || 'MEMBER'} · {character.groups?.map(g => g.group_name_zh).join(' · ') || '学园偶像'}
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              ({costumeCount} 套已录入)
            </span>
          </div>

          <div className="flex items-baseline gap-3">
            <h1 className="serif-title text-2xl sm:text-3xl font-bold text-slate-100 tracking-wide">
              {character.name_zh}
            </h1>
            <span className="text-sm font-light text-slate-400 font-mono tracking-wider">
              {character.name_ja}
            </span>
            {isShioriko && (
              <span className="title-jp text-xs text-teal-300/80 pl-2 hidden md:inline">
                「私の信じる正しさを、貫きます」
              </span>
            )}
          </div>

          {/* 筛选条 (轻量无噪音，融入排版中) */}
          <div className="flex items-center gap-2 pt-1 flex-wrap">
            <span className="text-[11px] text-slate-400">过滤：</span>
            {[
              { id: 'all', label: '全部' },
              { id: 'verified', label: '官方已核实' },
              { id: 'unverified', label: '待核实' },
              { id: 'unidentified', label: '待识别' },
            ].map(opt => {
              const active = (filters.status || 'all') === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => onFilterChange({ ...filters, status: opt.id })}
                  className={`text-[11px] px-2.5 py-0.5 rounded transition-all ${
                    active
                      ? 'bg-teal-400/20 text-teal-200 border border-teal-400/40 font-medium'
                      : 'text-slate-400 hover:text-slate-200 border border-transparent'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}

            <span className="text-slate-600 px-1">|</span>

            {[
              { id: 'all', label: '全来源' },
              { id: 'game_card', label: '手游卡面' },
              { id: 'seiyuu_live', label: '声优 Live' },
            ].map(st => {
              const active = (filters.sourceType || 'all') === st.id;
              return (
                <button
                  key={st.id}
                  onClick={() => onFilterChange({ ...filters, sourceType: st.id })}
                  className={`text-[11px] px-2 py-0.5 rounded transition-all ${
                    active
                      ? 'bg-sky-400/20 text-sky-200 border border-sky-400/40 font-medium'
                      : 'text-slate-400 hover:text-slate-200 border border-transparent'
                  }`}
                >
                  {st.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 右侧：主操作按钮组 */}
        <div className="flex-none flex items-center gap-2">
          {onCurateCostumes && (
            <button
              onClick={onCurateCostumes}
              disabled={isCurating}
              className={`text-xs px-3.5 py-2 rounded-lg font-bold transition-all flex items-center gap-1.5 active:scale-95 ${
                isCurating
                  ? 'bg-sky-500/30 text-sky-200 border border-sky-400/40 cursor-wait'
                  : 'bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-[0_0_20px_-5px_rgba(14,165,233,0.5)]'
              }`}
              title="从社区公开卡面库检索补充卡面立绘（自动标记为待核实，严禁冒充官方认证）"
            >
              <Sparkles className={`w-3.5 h-3.5 stroke-[2.5] ${isCurating ? 'animate-spin' : ''}`} />
              <span>{isCurating ? '正在检索卡面中...' : '补录社区卡面'}</span>
            </button>
          )}

          <button
            onClick={onAddCostume}
            className="text-xs px-3.5 py-2 rounded-lg bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold transition-all shadow-[0_0_20px_-5px_rgba(45,212,191,0.4)] flex items-center gap-1.5 active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>+ 手动录入</span>
          </button>
        </div>
      </div>
    </section>
  );
};
