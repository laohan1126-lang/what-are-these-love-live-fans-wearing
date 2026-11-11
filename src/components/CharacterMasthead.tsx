import React from 'react';
import { Character, FilterOptions } from '../types';

interface CharacterMastheadProps {
  character: Character;
  costumeCount: number;
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
}

export const CharacterMasthead: React.FC<CharacterMastheadProps> = ({
  character,
  costumeCount,
  filters,
  onFilterChange,
}) => {
  const isShioriko = character.id === 'mifune-shioriko';
  const charColor = character.color_hex || '#2dd4bf';

  const statusItems = [
    { id: 'all', label: '全卷' },
    { id: 'verified', label: '玉印已核实' },
    { id: 'unverified', label: '待核实' },
    { id: 'unidentified', label: '待识名' },
  ];

  const sourceItems = [
    { id: 'all', label: '全出处' },
    { id: 'game_card', label: '卡面' },
    { id: 'seiyuu_live', label: '声优Live' },
    { id: 'cosplay_photo', label: '实穿对照' },
  ];

  const stageItems = [
    { id: 'all', label: '全形态' },
    { id: 'awakened', label: '觉醒后' },
    { id: 'unawakened', label: '觉醒前' },
  ];

  return (
    <section
      className="relative overflow-hidden border-b border-[#e5b869]/20 bg-transparent select-none"
      aria-label="角色舞台刊头与筛选刻度"
    >
      {/* 右侧连续舞台原画空间 (#theme-image)：保护人物面部与手势安全区，零按钮遮挡 */}
      <div className="
        absolute right-0 top-0 bottom-0
        w-[42%] sm:w-[46%] max-w-2xl
        pointer-events-none overflow-hidden z-0
      ">
        <img
          id="theme-image"
          src="/assets/theme_stage_shioriko.jpg"
          alt="三船栞子 決意の光 舞台原画背景"
          fetchPriority="high"
          className="character-visual-asset animate-stage-develop w-full h-full object-cover object-[52%_18%] opacity-65 sm:opacity-75"
          style={{
            maskImage:
              'linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.45) 26%, rgba(0,0,0,0.92) 64%, rgba(0,0,0,0.85) 100%)',
            WebkitMaskImage:
              'linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.45) 26%, rgba(0,0,0,0.92) 64%, rgba(0,0,0,0.85) 100%)',
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(180deg, rgba(7,12,24,0.35) 0%, transparent 28%, transparent 72%, rgba(7,12,24,0.92) 100%)',
          }}
        />
      </div>

      {/* 环形和风铭文印章（位于中部偏右安全负形区，不压人物脸部） */}
      <svg
        className="orbit-seal hidden xl:block absolute top-2 right-[38%] w-24 h-24 text-[#e5b869]/45 pointer-events-none z-10"
        viewBox="0 0 160 160"
        aria-hidden="true"
      >
        <defs>
          <path
            id="ketsuiOrbitPath"
            d="M80,80 m-58,0 a58,58 0 1,1 116,0 a58,58 0 1,1 -116,0"
          />
        </defs>
        <text className="font-mono text-[8.5px] tracking-[2.4px] fill-current">
          <textPath href="#ketsuiOrbitPath">
            KETSUI NO HIKARI · STAGE COSTUME FOLIO · 2D×3D ·
          </textPath>
        </text>
        <circle
          cx="80"
          cy="80"
          r="38"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.6"
          strokeDasharray="2 6"
        />
      </svg>

      {/* 左侧开放式排印主体：严格限制最大宽度，绝不侵入右侧人物面部安全区 */}
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-2.5 sm:py-3.5 relative z-10">
        <div className="max-w-[62%] sm:max-w-[58%] space-y-1.5">
          {/* 第一行：定制 SVG 艺术字标 (#display-lettering) 与角色编号 */}
          <div className="flex flex-wrap items-center gap-3">
            <img
              id="display-lettering"
              src="/assets/ketsui-lettering.svg"
              alt="決意の光 · 衣装手帖"
              className="animate-script-reveal h-8 sm:h-11 w-auto object-contain object-left block"
            />

            <div className="hidden md:flex items-center gap-2 pl-2 border-l border-[#e5b869]/25">
              <span
                className="w-2 h-2 rotate-45 flex-none"
                style={{ backgroundColor: charColor }}
              />
              <span className="eyebrow">
                {character.enrollment_term || 'IDOL'} ·{' '}
                {character.groups?.map(g => g.group_name_zh).join(' / ') || '学园偶像'}
              </span>
              <span className="font-mono text-[10px] text-[#2dd4bf] tabular-nums">
                [{String(costumeCount).padStart(2, '0')} 卷收录]
              </span>
            </div>
          </div>

          {/* 第二行：角色主衬线标题与倾斜书法引语 */}
          <div className="flex flex-wrap items-baseline gap-2.5 sm:gap-4">
            <h1 className="serif-title text-xl sm:text-3xl font-bold text-slate-100 tracking-tight leading-none">
              {character.name_zh}
            </h1>
            <span className="font-mono text-xs sm:text-sm text-[#e5b869]/90 tracking-widest">
              {character.name_ja}
            </span>
            <span className="md:hidden font-mono text-[10px] text-[#2dd4bf]">
              · {costumeCount} 卷
            </span>
            <p className="brush-quote text-xs text-[#2dd4bf]/90 hidden lg:inline-block m-0">
              {isShioriko
                ? '「私の信じる正しさを、貫きます」—— 翠玉と金糸の舞台考証'
                : `「${character.name_ja}」专属衣装与现实舞台对照卷宗`}
            </p>
          </div>

          {/* 第三行：无框刻度式多维筛选条（纯排印与细线，零胶囊嵌套） */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-0.5 text-[11px]">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[9px] text-[#e5b869]/80 uppercase tracking-wider hidden sm:inline">
                STATUS
              </span>
              {statusItems.map(opt => {
                const active = (filters.status || 'all') === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => onFilterChange({ ...filters, status: opt.id })}
                    className={`skyline-tab atelier-zone text-[11px] cursor-pointer ${
                      active ? 'is-active text-[#2dd4bf] font-semibold' : 'text-slate-400'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>

            <span className="text-[#e5b869]/30 hidden sm:inline">/</span>

            <div className="hidden sm:flex items-center gap-2">
              <span className="font-mono text-[9px] text-[#e5b869]/80 uppercase tracking-wider">
                ORIGIN
              </span>
              {sourceItems.map(st => {
                const active = (filters.sourceType || 'all') === st.id;
                return (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => onFilterChange({ ...filters, sourceType: st.id })}
                    className={`skyline-tab atelier-zone text-[11px] cursor-pointer ${
                      active ? 'is-active text-[#e5b869] font-semibold' : 'text-slate-400'
                    }`}
                  >
                    {st.label}
                  </button>
                );
              })}
            </div>

            <span className="text-[#e5b869]/30 hidden xl:inline">/</span>

            <div className="hidden xl:flex items-center gap-2">
              {stageItems.map(es => {
                const active = (filters.evolutionStage || 'all') === es.id;
                return (
                  <button
                    key={es.id}
                    type="button"
                    onClick={() => onFilterChange({ ...filters, evolutionStage: es.id })}
                    className={`skyline-tab atelier-zone text-[11px] cursor-pointer ${
                      active ? 'is-active text-sky-300 font-semibold' : 'text-slate-400'
                    }`}
                  >
                    {es.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 底部环境微动：舞台金丝与翡翠声光波束 */}
      <svg
        className="w-full h-3 block pointer-events-none opacity-65"
        viewBox="0 0 1440 16"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0 10 C240 2, 480 15, 720 8 S1180 2, 1440 10"
          fill="none"
          stroke="rgba(229,184,105,0.28)"
          strokeWidth="1"
        />
        <path
          className="stage-wave-dash"
          d="M0 10 C240 2, 480 15, 720 8 S1180 2, 1440 10"
          fill="none"
          stroke="#2dd4bf"
          strokeWidth="1.4"
        />
      </svg>
    </section>
  );
};
