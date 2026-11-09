import React from 'react';
import { Character } from '../types';
import { Shirt, Sparkles, Plus, GraduationCap, CheckCircle2 } from 'lucide-react';

interface CharacterHeroProps {
  character: Character;
  costumeCount: number;
  onAddCostume: () => void;
}

export const CharacterHero: React.FC<CharacterHeroProps> = ({
  character,
  costumeCount,
  onAddCostume,
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900/90 via-[#0e172e]/80 to-slate-900/90 border border-sky-400/20 p-5 shadow-xl backdrop-blur-xl mb-6">
      {/* 角色应援色光晕底纹 */}
      <div
        className="absolute -right-16 -top-16 w-56 h-56 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ backgroundColor: character.color_hex || '#2dd4bf' }}
      />
      <div
        className="absolute left-0 top-0 bottom-0 w-1.5"
        style={{ backgroundColor: character.color_hex || '#2dd4bf' }}
      />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* 左侧：角色信息 */}
        <div className="space-y-2">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider text-slate-950 flex items-center gap-1 shadow-sm"
              style={{ backgroundColor: character.color_hex || '#2dd4bf' }}
            >
              <Sparkles className="w-2.5 h-2.5 fill-slate-950" />
              {character.color_hex}
            </span>

            {character.enrollment_term && (
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800/80 text-sky-300 border border-sky-400/20">
                {character.enrollment_term}
              </span>
            )}

            <span
              className={`text-[11px] px-2 py-0.5 rounded-md flex items-center gap-1 border ${
                character.status === 'active'
                  ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                  : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
              }`}
            >
              {character.status === 'active' ? (
                <>
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  现役在籍
                </>
              ) : (
                <>
                  <GraduationCap className="w-3 h-3 text-amber-400" />
                  已毕业/前辈
                </>
              )}
            </span>

            {/* 归属团体与分队标签 */}
            {character.groups?.map(g => (
              <span
                key={g.group_id + g.period}
                className="text-[11px] px-2.5 py-0.5 rounded-md bg-slate-800/60 text-slate-300 border border-slate-700/80"
              >
                {g.group_name_zh}
                {g.period && g.period !== '全时期' && (
                  <span className="text-[9px] text-slate-400 ml-1">({g.period})</span>
                )}
              </span>
            ))}
          </div>

          <div className="flex items-baseline gap-3">
            <h2 className="text-2xl font-black text-slate-100 tracking-wide">
              {character.name_zh}
            </h2>
            <span className="text-base text-teal-300/80 font-medium">
              {character.name_ja}
            </span>
          </div>

          <p className="text-xs text-slate-400">
            已收录该角色衣装档案：
            <strong className="text-teal-300 font-bold ml-1 font-mono text-sm">
              {costumeCount}
            </strong>{' '}
            套
          </p>
        </div>

        {/* 右侧：操作按钮 */}
        <div className="flex items-center gap-3">
          <button
            onClick={onAddCostume}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-950 bg-teal-400 hover:bg-teal-300 transition-all flex items-center gap-2 shadow-[0_0_20px_-5px_rgba(45,212,191,0.5)] active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>录入此角色衣装</span>
          </button>
        </div>
      </div>
    </div>
  );
};
