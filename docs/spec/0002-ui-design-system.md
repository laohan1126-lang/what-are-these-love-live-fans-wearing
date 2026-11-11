# 0002 - UI 设计系统：`ui-design-1-0` (v1.6) 舞台织锦手帖与《決意の光》角色世界定调

## 背景与设计目标

为彻底消除“Love Live! 衣装资料库”在早期版本中遗留的暗黑后台表格感、圆角卡片套卡片（Box-in-Box）以及系统黑体平铺感，本项目严格遵循 Codex `ui-design-1-0`（v1.6 Goal Loop + 真实画面举证协议）与 `benchmarks/megu-fm-v7` 的质量标准进行重设计。

本设计以三船栞子《決意の光》（决意之光）夜间和风现代舞台为视觉世界起点，构建**「舞台后台衣桁与衣装考据手帖（Stage Atelier & Costume Folio）」**——让原画场景、独立设计的 SVG 书法字形、无容器嵌套的开放版面、双折屏风式 2D/3D 视轨对照，以及翡翠书签/流苏棱镜指针反馈共同组成统一的产品世界。

---

## 核心审美与架构铁律（源自 `ui-design-1-0` v1.6）

1. **零容器嵌套（Zero Box-in-Box / Panel-in-Panel）**：
   - 严禁卡片套卡片、面板套面板、框里套框。
   - 顶栏为直接浮于夜幕画布上的排印天际线（Typographic Skyline），不设封闭背景盒；
   - 右侧考据手帖区、底片衣桁索引、筛选刻度均通过字号反差、留白、对齐、金丝细线（`1px` 和风分割线）与景深建立层级，整页最多保留一层确有功能的交互边界（如主舞台画幅或弹窗抽屉）。
2. **自然有艺术感的字体排印（Artistic & Editorial Typography）**：
   - 标题使用独立定制的 SVG 书法/展示字标（`#display-lettering`：`/assets/ketsui-lettering.svg`），确保跨环境真实解码渲染，绝不退化为系统粗黑体；
   - 搭配高反差衬线展示标题（`--font-serif`）、微倾日文手写/古典副标（`--font-brush` / `-5deg`）、以及克制的等宽考据编号（`--font-mono`），形成松弛有呼吸感的非对称杂志编排。
3. **角色融入：「世界先于画像」（Theme as System）**：
   - 舞台原画（`#theme-image`：`/assets/theme_stage_shioriko.jpg`）作为连续的舞台背景光影空间融入画面右上方景深，通过多段式平滑遮罩与深绀画布自然衔接；
   - **绝对安全区保护**：任何标题、状态徽标或操作按钮严禁压住三船栞子的面部、眼睛与手势；
   - **隐藏人物测试（Hidden-Character Test）**：提供一键「隐藏人物测试」开关；当隐去所有人物原画与立绘时，页面依然凭借深绀×翡翠×织锦金配色、SVG 书法字标、和风屏风刻度线、玉印徽记与书签流苏交互保持鲜明的角色与产品辨识度。
4. **首屏量化契约（First-Viewport Rendered Contract）**：
   - 在 `1440×900` 与 `1366×768` 桌面视口（`scroll 0,0`）下，主视觉检视区（`#main-image`）位于左侧主舞台，全部核心操作（视轨切换 `#primary-action`、全屏检视 `#action-lightbox`、编辑考据 `#action-edit`、手动录入 `#action-add`、社区补录 `#action-curate`）均完整位于主舞台右侧（`control_side: "right"`），可见比例 `≥ 98%` 且中心命中测试（`hit_test`）为 `true`。
   - 在 `390×844` 手机视口下，核心操作与主视觉同样在首屏可达、零横向溢出（`overflow: false`）。
5. **五层丰富动效体系（Layered Motion System）**：
   - **进场编排**：舞台背景显影缩放（`stage-develop`）+ 书法字标斜切浮现（`script-reveal`）+ 手帖条目错峰揭示（stagger）；
   - **指针响应（`#signature-effect`）**：悬停关键交互热区（`.atelier-zone`）时，4 枚翡翠/织锦金/舞台青/珊瑚朱「和风书签与菱光」SVG 卫星绕指针旋转响应，点击时触发菱光散逸；
   - **滚动分镜**：底部扩展考据卷宗与全团衣桁矩阵随 `IntersectionObserver` 渐进揭示；
   - **状态转场**：切换衣装或「双轨屏风 / 2D 绘卷 / 3D 现世」视轨时，画幅平滑过渡、刻度脉冲同步位移；
   - **环境微动**：舞台金丝声光波纹（`stage-wave`）与环形铭文印章（`orbit-seal`）持续轻柔律动，支持 `prefers-reduced-motion` 一键静态降级。

---

## Design Tokens（设计变量系统）

```css
:root {
  /* 夜幕和风舞台画布 */
  --canvas-void: #050811;
  --canvas-ink: #070c18;
  --canvas-wash: #0b1326;

  /* 文本墨色层级 (WCAG AA 高对比) */
  --ink-primary: #f4f7fb;
  --ink-secondary: #cbd5e1;
  --ink-muted: #8fa1b8;
  --ink-faint: #5b6d85;

  /* 三船栞子 · 決意の光 核心色板 (取样自原画振袖、翡翠发饰与舞台霓虹) */
  --jade: #2dd4bf;           /* 栞子翡翠玉代表色 */
  --jade-deep: #0d9488;      /* 玉印深色 */
  --kinpaku: #e5b869;        /* 和风金丝织锦 */
  --stage-cyan: #38bdf8;     /* 舞台霓虹青光 */
  --shuin-rose: #f43f5e;     /* 现世实穿朱印色 */

  /* 开放式分割线 (替代封闭卡片边框) */
  --hairline-gold: rgba(229, 184, 105, 0.22);
  --hairline-jade: rgba(45, 212, 191, 0.28);
  --hairline-subtle: rgba(148, 163, 184, 0.14);

  /* 字体排印角色 */
  --font-serif: "Noto Serif JP", "Noto Serif SC", "Songti SC", "STSong", Georgia, serif;
  --font-brush: "Yu Mincho", "Kaiti SC", "STKaiti", "KaiTi", "Noto Serif JP", serif;
  --font-sans: "Noto Sans JP", "PingFang SC", "Microsoft YaHei", system-ui, sans-serif;
  --font-mono: "JetBrains Mono", "Cascadia Mono", Consolas, monospace;
}
```

---

## 开放式单画板空间构图（无嵌套容器）

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ 【顶栏天际线 Typographic Skyline】（无背景盒，直接浮于夜幕舞台）               │
│ 衣桁 · COSTUME ARCHIVE   01 虹咲(13)  02 莲之空(14)  03 Liella!(11) ... [检索]│
├──────────────────────────────────────────────────────────────────────────────┤
│ 【主角舞台与书法字标区】（右景深：決意の光舞台原画 #theme-image，面部零遮挡）   │
│ [SVG 艺术字 #display-lettering: 決意の光 · 舞台衣装考証]                      │
│ 三船栞子  三船 栞子 · 「私の信じる正しさを、貫きます」                        │
│ 筛选刻度：全部 / 官方已核实 / 待核实 / 待识别  ·  全来源 / 卡面 / Live / 实拍  │
├───────────────────────────────────────────┬──────────────────────────────────┤
│ 【左：主视觉屏风展台 #main-image】         │ 【右：开放式考据手帖栏】          │
│                                           │ (无外层卡片框，纯排版与金丝细线)  │
│  ┌─────────────────┬─────────────────┐    │                                  │
│  │ 壱 · 2D 设定母版 │ 弐 · 3D 实穿对照 │    │ 決意の光（三船栞子Ver.） [玉印]  │
│  │ (超清立绘原画)   │ (真人模特立姿)   │    │ 系列：決意の光 · 决意之光 演出服 │
│  └─────────────────┴─────────────────┘    │                                  │
│                                           │ [视轨切换 #primary-action]       │
│  ─── 衣桁底片导轨 (Folio Strip) ───        │ [全屏检视 #action-lightbox]      │
│  01 決意の光  ·  02 ミステリアスジュエリー  │ [编辑考据 #action-edit]          │
│                                           │ [+录入 #action-add] [补录 #curate]│
│                                           │ 出处考证链 (可点击外链直跳)      │
└───────────────────────────────────────────┴──────────────────────────────────┘
```

---

## 验收标准（对齐 `ui-design-1-0` Gate A / B / C）

1. **零框中框（`hierarchy_and_containers`）**：全站去除“外面板套内卡片再套胶囊”的后台模板结构，层级由字形、留白与金丝细线建立。
2. **字形与零遮挡（`typography_and_overlap`）**：`#display-lettering` SVG 书法字标与 `#theme-image` 原画 100% 解码可见，人物面部、眼睛与手势零遮挡。
3. **首屏契约与实测回执（`rendered_contract`）**：通过 `scripts/rendered_probe.js` 在 `1440×900`、`1366×768`、`390×844` 三个真实视口采样，主图与右侧五大核心操作按钮首屏可达、无遮挡、无横向溢出。
4. **动效三帧举证（`motion_and_interactivity`）**：`#signature-effect` 书签流苏卫星在触发前、悬停中、点击后三帧具有可测量的 DOM 渲染与 `motion_signature` 变化。
5. **全量业务测试不退化（`existing_function_contract`）**：`pnpm test`（AC-1 ~ AC-10）与 `pnpm run build` 100% 通过。
