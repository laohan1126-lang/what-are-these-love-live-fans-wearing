import React, { useState, useEffect } from 'react';
import { CostumeVariant, CostumeTheme, Character, SourceType, EvolutionStage } from '../types';
import { X, Upload, Plus, Trash2, ShieldCheck, AlertCircle, Sparkles, ExternalLink, HelpCircle } from 'lucide-react';
import { uploadImage, createCostume, updateCostume } from '../services/api';

interface CostumeEditorDrawerProps {
  initialCostume?: CostumeVariant | null;
  defaultCharacterId: string;
  characters: Character[];
  themes: CostumeTheme[];
  onClose: () => void;
  onSuccess: (savedCostumeId: string) => void;
}

export const CostumeEditorDrawer: React.FC<CostumeEditorDrawerProps> = ({
  initialCostume,
  defaultCharacterId,
  characters,
  themes,
  onClose,
  onSuccess,
}) => {
  const isEditing = Boolean(initialCostume);

  // 表单状态
  const [characterId, setCharacterId] = useState(initialCostume?.character_id || defaultCharacterId);
  const [themeMode, setThemeMode] = useState<'existing' | 'new'>(
    initialCostume?.theme_id ? 'existing' : (themes.length > 0 ? 'existing' : 'new')
  );
  const [themeId, setThemeId] = useState(initialCostume?.theme_id || (themes[0]?.id || ''));
  const [newThemeNameJa, setNewThemeNameJa] = useState('');
  const [newThemeNameZh, setNewThemeNameZh] = useState('');

  const [isUnidentified, setIsUnidentified] = useState(
    initialCostume ? initialCostume.name_status === 'unidentified' : false
  );
  const [nameJa, setNameJa] = useState(initialCostume?.name_ja || '');
  const [nameZh, setNameZh] = useState(initialCostume?.name_zh || '');
  const [status, setStatus] = useState<'verified' | 'unverified'>(
    initialCostume?.status || 'unverified'
  );
  const [notes, setNotes] = useState(initialCostume?.notes || '');

  // 来源列表
  const [sources, setSources] = useState<
    { id?: string; source_type: SourceType; evolution_stage: EvolutionStage; title: string; url: string; detail: string }[]
  >(
    initialCostume?.sources?.map(s => ({
      id: s.id,
      source_type: s.source_type,
      evolution_stage: s.evolution_stage,
      title: s.title,
      url: s.url || '',
      detail: s.detail || '',
    })) || [
      { source_type: 'game_card', evolution_stage: 'awakened', title: '', url: '', detail: '' },
    ]
  );

  // 图片列表
  const [images, setImages] = useState<
    { id?: string; file_path: string; original_filename?: string; is_primary: boolean; category: 'illustration' | 'real_life' | 'detail' }[]
  >(
    initialCostume?.images?.map(img => ({
      id: img.id,
      file_path: img.file_path,
      original_filename: img.original_filename,
      is_primary: Boolean(img.is_primary),
      category: img.category || 'illustration',
    })) || []
  );

  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 当设为待识别时，自动把 status 转为 unverified
  const handleToggleUnidentified = (checked: boolean) => {
    setIsUnidentified(checked);
    if (checked && status === 'verified') {
      setStatus('unverified');
    }
  };

  // 添加来源条目
  const handleAddSource = () => {
    setSources([
      ...sources,
      { source_type: 'game_card', evolution_stage: 'awakened', title: '', url: '', detail: '' },
    ]);
  };

  // 删除来源条目
  const handleRemoveSource = (idx: number) => {
    setSources(sources.filter((_, i) => i !== idx));
  };

  // 图片本地上传处理
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setErrorMsg(null);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const res = await uploadImage(file);
        setImages(prev => [
          ...prev,
          {
            file_path: res.file_path,
            original_filename: res.original_filename,
            is_primary: prev.length === 0 && i === 0,
            category: prev.some(p => p.category === 'illustration') ? 'real_life' : 'illustration',
          },
        ]);
      }
    } catch (err: any) {
      setErrorMsg(err.message || '图片上传失败');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  // 保存提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // 前端初步校验
    if (!characterId) {
      setErrorMsg('请选择所属角色');
      return;
    }
    if (themeMode === 'new' && !newThemeNameJa.trim()) {
      setErrorMsg('请输入新主题的官方日文名');
      return;
    }
    if (!isUnidentified && !nameJa.trim()) {
      setErrorMsg('请输入官方日文原名，或勾选【暂未查明，设为待识别】');
      return;
    }

    const payload = {
      character_id: characterId,
      theme_id: themeMode === 'existing' ? themeId : null,
      new_theme_name_ja: themeMode === 'new' ? newThemeNameJa.trim() : null,
      new_theme_name_zh: themeMode === 'new' ? newThemeNameZh.trim() : null,
      name_ja: isUnidentified ? null : nameJa.trim(),
      name_zh: nameZh.trim() || null,
      name_status: isUnidentified ? 'unidentified' : 'identified',
      status,
      notes: notes.trim() || null,
      images,
      sources: sources.filter(s => s.title.trim().length > 0 || s.url.trim().length > 0),
    };

    setIsSubmitting(true);
    try {
      if (isEditing && initialCostume) {
        await updateCostume(initialCostume.id, payload);
        onSuccess(initialCostume.id);
      } else {
        const res = await createCostume(payload);
        onSuccess(res.id);
      }
    } catch (err: any) {
      setErrorMsg(err.message || '保存失败');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl h-full bg-[#0b1224] border-l border-sky-400/20 shadow-2xl flex flex-col justify-between overflow-hidden">
        {/* 顶部标头 */}
        <div className="px-6 py-4 border-b border-sky-400/15 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-400" />
            <h2 className="text-base font-bold text-slate-100">
              {isEditing ? '编辑衣装资料' : '录入新衣装'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-100 flex items-center justify-center transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 表单内容 */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {errorMsg && (
            <div className="p-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 flex-none mt-0.5" />
              <div className="flex-1 leading-relaxed">{errorMsg}</div>
            </div>
          )}

          {/* 1. 角色选择 */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>所属角色 *</span>
              <span className="text-[11px] text-slate-400 font-normal">支持多角色同主题各自独立录入</span>
            </label>
            <select
              value={characterId}
              onChange={e => setCharacterId(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-900 border border-sky-400/20 rounded-xl text-slate-200 focus:outline-none focus:border-teal-400"
            >
              {characters.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name_zh} ({c.name_ja})
                </option>
              ))}
            </select>
          </div>

          {/* 2. 主题选择与新建 */}
          <div className="space-y-2 p-3.5 rounded-xl bg-slate-900/40 border border-sky-400/10">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300">衣装所属主题/系列 *</label>
              <div className="flex items-center text-xs gap-3">
                <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
                  <input
                    type="radio"
                    name="themeMode"
                    checked={themeMode === 'existing'}
                    onChange={() => setThemeMode('existing')}
                    className="accent-teal-400"
                  />
                  <span>选用已有主题</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
                  <input
                    type="radio"
                    name="themeMode"
                    checked={themeMode === 'new'}
                    onChange={() => setThemeMode('new')}
                    className="accent-teal-400"
                  />
                  <span>新建主题</span>
                </label>
              </div>
            </div>

            {themeMode === 'existing' ? (
              <select
                value={themeId}
                onChange={e => setThemeId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-900 border border-sky-400/20 rounded-xl text-slate-200 focus:outline-none focus:border-teal-400"
              >
                {themes.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.name_ja} {t.name_zh ? `(${t.name_zh})` : ''}
                  </option>
                ))}
              </select>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <input
                  type="text"
                  value={newThemeNameJa}
                  onChange={e => setNewThemeNameJa(e.target.value)}
                  placeholder="主题官方日文名 (必填，如 決意の光)*"
                  className="px-3 py-2 text-xs bg-slate-900 border border-sky-400/20 rounded-xl text-slate-200 focus:outline-none focus:border-teal-400"
                />
                <input
                  type="text"
                  value={newThemeNameZh}
                  onChange={e => setNewThemeNameZh(e.target.value)}
                  placeholder="主题中文译名 (可选)"
                  className="px-3 py-2 text-xs bg-slate-900 border border-sky-400/20 rounded-xl text-slate-200 focus:outline-none focus:border-teal-400"
                />
              </div>
            )}
          </div>

          {/* 3. 衣装名称与待识别选项 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300">衣装名称</label>
              <label className="flex items-center gap-1.5 text-xs text-amber-300 cursor-pointer bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/25">
                <input
                  type="checkbox"
                  checked={isUnidentified}
                  onChange={e => handleToggleUnidentified(e.target.checked)}
                  className="accent-amber-400"
                />
                <span>暂未考据出官方名称（标记为“待识别”）</span>
              </label>
            </div>

            {isUnidentified ? (
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/80 space-y-2">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <HelpCircle className="w-4 h-4 text-amber-400 flex-none" />
                  <span>已启用【待识别模式】：无需填写官方日文原名，严禁编造伪官方名。</span>
                </div>
                <input
                  type="text"
                  value={nameZh}
                  onChange={e => setNameZh(e.target.value)}
                  placeholder="自用参考备注名 (如：漫展看到的某套绿色演出服)"
                  className="w-full px-3 py-2 text-xs bg-slate-900 border border-sky-400/20 rounded-xl text-slate-200 focus:outline-none focus:border-teal-400"
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">官方日文名称 *</label>
                  <input
                    type="text"
                    value={nameJa}
                    onChange={e => setNameJa(e.target.value)}
                    placeholder="如：決意の光（三船栞子Ver.）"
                    className="w-full px-3 py-2 text-xs bg-slate-900 border border-sky-400/20 rounded-xl text-slate-200 focus:outline-none focus:border-teal-400"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">中文译名 (可选)</label>
                  <input
                    type="text"
                    value={nameZh}
                    onChange={e => setNameZh(e.target.value)}
                    placeholder="如：决意之光"
                    className="w-full px-3 py-2 text-xs bg-slate-900 border border-sky-400/20 rounded-xl text-slate-200 focus:outline-none focus:border-teal-400"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 4. 核实状态 */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">核实状态</label>
            <div className="flex items-center gap-3">
              <label
                className={`flex-1 p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  status === 'verified'
                    ? 'bg-teal-500/15 border-teal-400 text-teal-200 shadow-[0_0_12px_-2px_rgba(45,212,191,0.3)]'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400'
                } ${isUnidentified ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-teal-400" />
                  <div>
                    <span className="text-xs font-bold block">已核实 (Verified)</span>
                    <span className="text-[10px] text-slate-400 block">必须包含有效官方日文名与可复查外链证据</span>
                  </div>
                </div>
                <input
                  type="radio"
                  name="status"
                  value="verified"
                  checked={status === 'verified'}
                  disabled={isUnidentified}
                  onChange={() => setStatus('verified')}
                  className="accent-teal-400"
                />
              </label>

              <label
                className={`flex-1 p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  status === 'unverified'
                    ? 'bg-amber-500/15 border-amber-400 text-amber-200'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400'
                }`}
              >
                <div>
                  <span className="text-xs font-bold block">待核实 (Unverified)</span>
                  <span className="text-[10px] text-slate-400 block">暂未完全核验官方凭证</span>
                </div>
                <input
                  type="radio"
                  name="status"
                  value="unverified"
                  checked={status === 'unverified'}
                  onChange={() => setStatus('unverified')}
                  className="accent-amber-400"
                />
              </label>
            </div>
          </div>

          {/* 5. 本地图片上传 */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>衣装参考图片 (持久化保存在本地磁盘)</span>
              <span className="text-[11px] text-slate-400 font-normal">支持多图上传</span>
            </label>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className="flex flex-col gap-1 rounded-xl p-1.5 border border-sky-400/20 bg-slate-950 group"
                >
                  <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-slate-900">
                    <img
                      src={img.file_path}
                      alt=""
                      className="w-full h-full object-cover object-top"
                    />
                    {img.is_primary && (
                      <span className="absolute bottom-1 left-1 text-[9px] px-1 py-0.2 rounded bg-teal-500 text-slate-950 font-bold">
                        主图
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => setImages(images.filter((_, i) => i !== idx))}
                      className="absolute top-1 right-1 w-5 h-5 rounded bg-rose-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>

                  {/* 属性分类选择 */}
                  <select
                    value={img.category || 'illustration'}
                    onChange={e => {
                      const next = [...images];
                      next[idx].category = e.target.value as any;
                      setImages(next);
                    }}
                    className="w-full text-[10px] bg-slate-900 border border-white/10 rounded px-1.5 py-0.5 text-slate-200 focus:outline-none"
                  >
                    <option value="illustration">🎨 官方设定插画</option>
                    <option value="real_life">👗 现实实物 / COS</option>
                    <option value="detail">🔍 细节特写</option>
                  </select>
                </div>
              ))}

              <label className="aspect-[4/3] rounded-xl border border-dashed border-sky-400/30 hover:border-teal-400 bg-slate-900/40 hover:bg-slate-900/80 flex flex-col items-center justify-center gap-1 cursor-pointer transition-all">
                <Upload className="w-5 h-5 text-sky-400" />
                <span className="text-[10px] text-slate-400">
                  {isUploading ? '上传中...' : '+ 添加图片'}
                </span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  multiple
                  disabled={isUploading}
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* 6. 来源出处依据 (支持声优Live与觉醒形态) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300">
                出处依据 ({sources.length})
              </label>
              <button
                type="button"
                onClick={handleAddSource}
                className="text-xs text-teal-300 hover:text-teal-200 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>添加出处</span>
              </button>
            </div>

            <div className="space-y-3">
              {sources.map((src, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-900/70 border border-sky-400/15 space-y-2.5 relative"
                >
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span className="font-semibold text-teal-400/90">出处 #{idx + 1}</span>
                    {sources.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveSource(idx)}
                        className="text-slate-500 hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-0.5">来源类型</label>
                      <select
                        value={src.source_type}
                        onChange={e => {
                          const val = e.target.value as SourceType;
                          const next = [...sources];
                          next[idx].source_type = val;
                          setSources(next);
                        }}
                        className="w-full px-2 py-1.5 text-xs bg-slate-950 border border-sky-400/20 rounded-lg text-slate-200 focus:outline-none"
                      >
                        <option value="game_card">手游卡面</option>
                        <option value="seiyuu_live">声优 Live 演出服</option>
                        <option value="anime">动画</option>
                        <option value="cd_jacket">CD 封面</option>
                        <option value="magazine">杂志</option>
                        <option value="official_art">版权绘</option>
                        <option value="other">其他</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-400 block mb-0.5">卡面形态</label>
                      <select
                        value={src.evolution_stage}
                        onChange={e => {
                          const val = e.target.value as EvolutionStage;
                          const next = [...sources];
                          next[idx].evolution_stage = val;
                          setSources(next);
                        }}
                        className="w-full px-2 py-1.5 text-xs bg-slate-950 border border-sky-400/20 rounded-lg text-slate-200 focus:outline-none"
                      >
                        <option value="none">不适用 / 普通</option>
                        <option value="unawakened">觉醒前 (特训前)</option>
                        <option value="awakened">觉醒后 (演出服)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">来源标题 *</label>
                    <input
                      type="text"
                      value={src.title}
                      onChange={e => {
                        const next = [...sources];
                        next[idx].title = e.target.value;
                        setSources(next);
                      }}
                      placeholder="如：SIFAS UR【決意の光】覚醒後 或 莲之空 1st Live"
                      className="w-full px-2 py-1.5 text-xs bg-slate-950 border border-sky-400/20 rounded-lg text-slate-200 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">可复查外部链接 (HTTP/HTTPS)</label>
                    <input
                      type="url"
                      value={src.url}
                      onChange={e => {
                        const next = [...sources];
                        next[idx].url = e.target.value;
                        setSources(next);
                      }}
                      placeholder="https://..."
                      className="w-full px-2 py-1.5 text-xs bg-slate-950 border border-sky-400/20 rounded-lg text-slate-200 focus:outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 7. 服装细节与考据备忘 */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">服装设计特征备忘 (可选)</label>
            <textarea
              rows={3}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="记录服装版型、配饰、头饰、裙摆层数或手套等细节特征，方便准备 COSPLAY 时比对..."
              className="w-full px-3 py-2 text-xs bg-slate-900 border border-sky-400/20 rounded-xl text-slate-200 focus:outline-none focus:border-teal-400"
            />
          </div>
        </form>

        {/* 底部按钮栏 */}
        <div className="px-6 py-4 border-t border-sky-400/15 bg-slate-900/90 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs text-slate-400 hover:text-slate-200 font-medium"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-5 py-2 text-xs font-bold text-slate-950 bg-teal-400 hover:bg-teal-300 rounded-xl transition-all shadow-[0_0_20px_-4px_rgba(45,212,191,0.5)] active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? '正在保存...' : (isEditing ? '保存修改' : '立即录入')}
          </button>
        </div>
      </div>
    </div>
  );
};
