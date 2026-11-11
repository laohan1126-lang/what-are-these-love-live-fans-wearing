# UI Goal Contract · Love Live! 衣装资料库 (`ui-design-1-0` v1.6)

## 0. 任务定位与三层上下文区分 (`references/product-and-surface.md`)

- **PRODUCT TRUTHS（不可变产品事实）**：
  - 面向个人与考据爱好者的 Love Live! 全企划角色与衣装本地资料库（纯本地 SQLite + 本地物理图片目录 `data/uploads/` 与 `public/uploads/`）。
  - 核心功能：企划/分队/角色动态人数聚合切换（严禁硬编码人数）、2D 设定原画与 3D 真人实穿对照检视、多维筛选（核实状态 / 来源类型 / 觉醒前后 / 关键词）、新增与编辑衣装、已核实状态后端强证据链校验、待识别暂存模式、社区卡面自动补录（默认标为待核实）、本地 ZIP 快照备份与恢复。
- **VISUAL WORLD（本次重设计建立的视觉系统）**：
  - 摒弃旧版暗黑 SaaS 卡片后台，以三船栞子《決意の光》舞台为母题，建立**「夜间和风现代舞台后台 · 衣桁与考据手帖（Stage Atelier & Costume Folio）」**。
- **SURFACE CONTRACT（当前页面决策）**：
  - 页面模式：`Operate + Experience`（高频检索、筛选、对照检视衣装，同时感受角色专属舞台氛围）。
  - 变更范围：`redesign`（重设计展示层与交互结构，100% 保护后端 API、SQLite 数据与 AC-1 ~ AC-10 业务契约）。

---

## 1. UI Design Studio 标杆核查与迁移报告 (`references/accepted-benchmark-studio.md`)

- `STUDIO_STATUS`: `BENCHMARK_LOADED`（已通过 `studio_reference.py` 校验 SHA，并实看 `benchmarks/megu-fm-v7/CASE.md`、`desktop-first.png`、`mobile-first.png`、`desktop-mic-hover.png`、`desktop-hidden-character.png` 及 `site/src/index.html`、`styles.css`、`app.js`）。
- `BENCHMARK_CASE`: `megu-fm-v7`
- `BENCHMARK_EVIDENCE`:
  - `C:\Users\Dell\.agents\ui-design-studio\benchmarks\megu-fm-v7\CASE.md`
  - `C:\Users\Dell\.agents\ui-design-studio\benchmarks\megu-fm-v7\evidence\desktop-first.png`
  - `C:\Users\Dell\.agents\ui-design-studio\benchmarks\megu-fm-v7\evidence\mobile-first.png`
  - `C:\Users\Dell\.agents\ui-design-studio\benchmarks\megu-fm-v7\evidence\desktop-mic-hover.png`
  - `C:\Users\Dell\.agents\ui-design-studio\benchmarks\megu-fm-v7\evidence\desktop-hidden-character.png`
  - `C:\Users\Dell\.agents\ui-design-studio\benchmarks\megu-fm-v7\site\src\index.html` / `styles.css` / `app.js`
- **TRANSFER（5 条可迁移的质量关系）**：
  1. **原画即环境空间**：将 `/assets/theme_stage_shioriko.jpg` 作为舞台景深连续空间，配平滑多段遮罩，严守人物脸部、眼睛、手势安全区，绝不塞进窄条横幅或被按钮覆盖。
  2. **独立 SVG 展示字形 + 多尺度排印**：使用独立设计的 SVG 艺术字标（`#display-lettering`）配合大衬线中文名、微倾日文名言、等宽编号，让文字成为画面骨架。
  3. **零框中框开放版面**：顶栏采用排印天际线（无外框），操作与元信息通过金丝细线（hairlines）和留白直接排布在画布上，消除“卡片套卡片”。
  4. **操作即主题动作**：视轨切换化为「屏风视轨刻度（双折对照 / 壱·绘卷 / 弐·现世）」，衣装切换化为「衣桁编号导轨」，鼠标响应化为「翡翠书签与流苏菱光卫星（`#signature-effect`）」。
  5. **首屏动作完整性**：在 `1440×900`、`1366×768` 与 `390×844` 首屏（`scroll 0,0`）内完整呈现主图与核心操作入口，无需滚动即可完成视轨切换、大图检视、编辑、录入与补录。
- **NON_TRANSFER（5 条不可复刻的 MEGU 外观）**：
  1. 不复刻藤岛慈角色与左图右字首屏比例；
  2. 不复刻冰白/樱粉/浅青电台配色；
  3. 不复刻 FM 调频刻度 `88.8 / 96.6 / 12.20`、调谐旋钮或电波虚线；
  4. 不复刻 `Megu's` 手写体标志与播音室文案；
  5. 不复刻麦克风指针粒子。

---

## 2. 角色主题卡与五句世界契约 (`references/theme-as-system.md` & `character-integration.md`)

```text
角色 / 作品出处：三船栞子 (Mifune Shioriko) / 《Love Live! 虹咲学园学园偶像同好会》《決意の光》
性格关键词：凛然、诚挚、外柔内刚
主色 / 辅色 / 点缀色：
  - 深绀夜幕 #070c18（取样自《決意の光》夜间舞台深蓝底幕）
  - 翡翠玉绿 #2dd4bf（取样自三船栞子官方代表色与发饰翠玉）
  - 织锦金丝 #e5b869（取样自和风振袖金丝滚边与舞台暖光）
  - 舞台霓虹青 #38bdf8（取样自背后心形灯架与立柱光束）
  - 朱印珊瑚红 #f43f5e（取样自瞳色高光与三次元实穿朱印对照标记）
纹样与材质：和风菱格细线 (Hishi hairlines)、金丝流苏、半透明夜幕纱幕、玉印徽章
标志物 / 小道具：翡翠书签、和风发簪菱花、双折屏风标尺
经典动作 / 台词气质：「私の信じる正しさを、貫きます」——端正、坚定、秩序井然的考据手帖语气
字体性格：刀锋般利落而典雅的明朝衬线展示字 + 略带倾角的毛笔/行楷日文副标 + 精确的等宽考据编号
```

### 五句角色世界契约
1. **她生活在怎样的页面空间？** 一座夜间舞台幕后的「衣装考据与屏风对照手帖室」，深绀夜幕下延展着金丝标尺与翡翠聚光。
2. **主操作如何属于这个世界？** 对照 2D/3D 衣装如同展开双折屏风（绘卷 × 现世），切换衣装如同翻阅衣桁编号，核实出处如同加盖翡翠玉印。
3. **可复用视觉语汇是什么？** 深绀底幕、翡翠玉色、金丝织锦细线、倾斜日文书签引语、菱花玉印。
4. **不用她的肖像，页面还有辨识度吗？** 开启「隐藏人物测试」隐去所有图像后，SVG 书法字形、和风屏风刻度、玉印与书签卫星依然明确指向《決意の光》衣装手帖世界。
5. **角色图是否真的必要？** `#theme-image` 提供右上景深的舞台空间感（面部严守安全区），`#main-image` 提供核心衣装版型对照证据；不展示无意义的装饰缩略图堆砌。

---

## 3. 目标契约与首屏渲染契约 (`goal.rendered_contract`)

- **PROJECT / BASELINE**：`lovelive-costume-archive`（基线截图：`qa/baseline-desktop.png`、`qa/baseline-mobile.png`）。
- **MAIN ACTION**：按企划/角色检索衣装，在首屏直接对比 2D 官方设定原画与 3D 真人实穿照片，核查官方出处或执行录入/编辑/补录。
- **DESIGN THESIS**：以《決意の光》和风现代舞台手帖取代暗黑卡片后台，让衣装作品与排版直接对话。
- **IMMUTABLE**：保留全部 6 大企划动态人数、分队/在籍筛选、多维状态/来源/觉醒阶段过滤、双轨对照、灯箱放大、新增/编辑强校验、自动采集、ZIP 备份恢复及 `pnpm test` 10 项验收测试。
- **ANTI-GOALS**：
  1. 严禁卡片套卡片、面板套面板（消除旧版右栏外框套内框、左栏胶囊框套按钮框）；
  2. 严禁按钮或文字遮挡人物脸部（修复旧版右上角两个大按钮直接压住三船栞子头部的问题）；
  3. 严禁默认展示半屏空黑洞（优先默认选中具备完整双轨图或已核实代表作《決意の光》，单轨衣装在双轨模式下给出优雅紧凑对照指引）；
  4. 严禁退化为系统黑体或照搬 MEGU.FM 电台元素。
- **ASSET ROLES**：
  - `#theme-image` (`/assets/theme_stage_shioriko.jpg`)：顶层右侧舞台环境景深，平滑渐隐入夜幕，保护栞子面部与手势安全区。
  - `#display-lettering` (`/assets/ketsui-lettering.svg`)：首屏左侧定制 SVG 书法展示字标（「決意の光 · 舞台衣装考証手帖」）。
  - `#main-image`（当前选中衣装的主展示图像，如 `/uploads/shioriko_ketsui_no_hikari.jpg`）：首屏左侧主舞台核心考据图像锚点。
  - 3D 实穿对照图（如 `/uploads/shioriko_ketsui_cos_model.jpg`）：双轨并置模式下与 2D 原画同台比对领口、腰封与裙摆结构。
- **RENDERED CONTRACT (`protocol_version: "1.6"`)**：
  - `viewports`:
    - `1440×900` (`control_side: "right"`, `scroll: 0,0`)
    - `1366×768` (`control_side: "right"`, `scroll: 0,0`)
    - `390×844` (`scroll: 0,0`)
  - `anchor`: `"#main-image"`
  - `controls`: `["#primary-action", "#action-lightbox", "#action-edit", "#action-add", "#action-curate"]`
  - `assets`: `["#theme-image", "#display-lettering"]`
  - `motion`: `["#signature-effect"]`（三帧真实测量：idle / hover-middle / click-burst）
