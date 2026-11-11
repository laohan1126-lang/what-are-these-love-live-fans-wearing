import React from 'react';
import { FilterOptions, SourceType, EvolutionStage } from '../types';
import { Filter, CheckCircle, Clock, HelpCircle, Sparkles, Radio } from 'lucide-react';

interface MultiFilterBarProps {
  filters: FilterOptions;
  onChange: (filters: FilterOptions) => void;
}

export const MultiFilterBar: React.FC<MultiFilterBarProps> = ({
  filters,
  onChange,
}) => {
  const updateFilter = (key: keyof FilterOptions, val: string) => {
    onChange({ ...filters, [key]: val });
  };

  const statusOptions = [
    { id: 'all', label: '全部状态' },
    { id: 'verified', label: '已核实', icon: CheckCircle, color: 'text-teal-300' },
    { id: 'unverified', label: '待核实', icon: Clock, color: 'text-amber-300' },
    { id: 'unidentified', label: '待识别', icon: HelpCircle, color: 'text-slate-400' },
  ];

  const sourceTypes: { id: string; label: string }[] = [
    { id: 'all', label: '全部来源' },
    { id: 'game_card', label: '手游卡面' },
    { id: 'seiyuu_live', label: '声优 Live 演出服' },
    { id: 'cosplay_photo', label: 'Cosplay 实拍' },
    { id: 'anime', label: '动画' },
    { id: 'cd_jacket', label: 'CD 封面' },
    { id: 'magazine', label: '杂志' },
    { id: 'official_art', label: '版权绘' },
  ];

  const evolutionStages = [
    { id: 'all', label: '全形态' },
    { id: 'unawakened', label: '觉醒前 (特训前)' },
    { id: 'awakened', label: '觉醒后 (演出服)' },
  ];

  return (
    <div className="bg-[#090f1f]/85 border border-sky-400/15 rounded-xl p-3.5 space-y-3 mb-6 backdrop-blur-md">
      {/* 状态与来源维度横向过滤 */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* 状态过滤器 */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] text-slate-400 font-medium mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3 text-teal-400" />
            核实状态:
          </span>
          {statusOptions.map(opt => {
            const isSelected = (filters.status || 'all') === opt.id;
            const Icon = opt.icon;
            return (
              <button
                key={opt.id}
                onClick={() => updateFilter('status', opt.id)}
                className={`text-xs px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 border ${
                  isSelected
                    ? 'bg-teal-500/20 text-teal-200 border-teal-400/40 font-medium shadow-[0_0_10px_-2px_rgba(45,212,191,0.25)]'
                    : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                {Icon && <Icon className={`w-3 h-3 ${opt.color}`} />}
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>

        {/* 来源类型过滤器 */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] text-slate-400 font-medium mr-1">出处类型:</span>
          {sourceTypes.map(st => {
            const isSelected = (filters.sourceType || 'all') === st.id;
            return (
              <button
                key={st.id}
                onClick={() => updateFilter('sourceType', st.id)}
                className={`text-xs px-2.5 py-1 rounded-lg transition-all border ${
                  isSelected
                    ? 'bg-sky-500/20 text-sky-200 border-sky-400/40 font-medium'
                    : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                {st.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 卡面觉醒形态与衣装搜索 */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-sky-400/10">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-slate-400 font-medium mr-1 flex items-center gap-1">
            <Radio className="w-3 h-3 text-sky-400" />
            卡面形态 (针对手游):
          </span>
          {evolutionStages.map(es => {
            const isSelected = (filters.evolutionStage || 'all') === es.id;
            return (
              <button
                key={es.id}
                onClick={() => updateFilter('evolutionStage', es.id)}
                className={`text-[11px] px-2.5 py-0.5 rounded-md transition-all border ${
                  isSelected
                    ? 'bg-amber-400/20 text-amber-200 border-amber-400/40 font-medium'
                    : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                {es.label}
              </button>
            );
          })}
        </div>

        {/* 关键字搜索框 */}
        <div className="w-full sm:w-64">
          <input
            type="text"
            value={filters.search || ''}
            onChange={e => updateFilter('search', e.target.value)}
            placeholder="在当前角色中检索衣装/曲名/备注..."
            className="w-full px-3 py-1 text-xs bg-slate-900/90 border border-sky-400/20 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-400"
          />
        </div>
      </div>
    </div>
  );
};
