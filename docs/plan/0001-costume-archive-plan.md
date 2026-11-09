# 0001 - Love Live! 衣装资料库实施 Plan (v0.3 修订版)

## 1. 规范对齐与审查意见落实

根据最新审查意见及 [docs/spec/0001-costume-archive.md](file:///d:/lovelive%EF%BC%81/docs/spec/0001-costume-archive.md) (v0.3)，本 Plan 对以下 5 项业务规则做出针对性调整，避免不必要的架构扩张，同时确保数据模型具备真实的业务表达力：

1. **莲之空及各企划的历代动态阵容**：
   - 坚决杜绝前端页面硬编码人数（如写死“8人”或“9人”）；
   - 在数据层记录角色期数/年级（如 102 期至 106 期）、状态（现役在籍 `active` / 毕业历史 `graduated` / 前成员 `former`）及不同时期的组合归属（如 Edel Note 时期、DOLLCHESTRA 加入等）；
   - 首页与团体页人数全部通过数据库 `COUNT(DISTINCT c.id)` 动态聚合得出，支持“在籍人数”与“历代收录总数”分别呈现；历史成员与衣装永久保存。
2. **支持“待识别”衣装先行录入**：
   - 当用户看到 COS 服但尚未查出日文官方正式名称时，允许录入图片并将状态标为 `待识别 (unidentified)`；
   - 严禁系统或用户编造假正式名，待后续考据确凿后再补全日文名并升级状态。
3. **支持声优 Live 与手游卡面觉醒形态结构化筛选**：
   - 来源表新增 `seiyuu_live`（声优现场演出服）类型；
   - 增加结构化字段 `evolution_stage`（`none` / `unawakened` 觉醒前 / `awakened` 觉醒后），供前端图鉴进行专项多维组合过滤，不再混入纯文本备注中。
4. **“已核实”后端强制证据链校验**：
   - 后端 API 在保存或更新记录时实施强校验：若试图将状态设为 `verified`，必须满足：① 日文原名非空且不能为“待识别”；② 关联至少一条包含有效可访问 HTTP/HTTPS URL 与出处标题的来源记录。缺少任一条件后端一律返回 HTTP 400 并拒绝变更。
5. **极简本地备份与恢复方案**：
   - 提供 `data/archive.db` + `data/uploads/` 的完整打包（ZIP 快照）机制，支持界面一键导出备份/导入还原，并提供 `pnpm run backup` 脚本，防止误删或重新安装造成数据丢失。

---

## 2. 总体架构与技术选型

保持轻量、高效原则，不引入外部云端与复杂基础设施；同时**全面迁移 Codex 1.9 单画板沉浸式桌面 UI 体系**，以三船栞子《决意之光》演出舞台定调全站视觉（详见 [docs/spec/0002-ui-design-system.md](file:///d:/lovelive%EF%BC%81/docs/spec/0002-ui-design-system.md)）：

| 组件 | 选用技术 | 设计目标与视觉定调 |
| :--- | :--- | :--- |
| **前端应用** | Vite + React + TypeScript + Tailwind CSS | 响应迅速，本地 SPA 单页架构；采用 **Codex 1.9 单画板架构**，以深邃夜幕舞台（`#080D1A`）与三船栞子翡翠绿（`#2DD4BF`）为基调，搭配霓虹青（`#00E5FF`）与亚克力玻璃拟态微发光质感。 |
| **后端服务** | 轻量 Node.js API (原生 `node:http` + 轻量路由器或 Fastify) | 单一语言技术栈，直接与前端共享 TypeScript 实体类型接口；负责 SQLite 读写、图片上传与安全校验。 |
| **数据持久层** | SQLite (`better-sqlite3`) | 单文件本地存储（`data/archive.db`），支持事务与外键，便于快照复制与完整恢复。 |
| **本地图片存储** | 本地文件系统目录 (`data/uploads/`) | 上传文件哈希重命名落盘，数据库仅存相对路径；与源码隔离，版本控制严格排除。 |
| **备份与恢复** | Node.js 原生压缩流 / `archiver` + `adm-zip` | 单键打包与解包 `data/` 目录为时间戳 ZIP 文件，支持覆盖前自动备份 `.bak`。 |

---

## 3. 增强数据关系设计（SQLite Schema）

```
[projects 企划] 1 ──< N [groups 团体/分队]
                          │
                          │ N
                     [character_groups 成员在籍关联]
                          │ M
                          ▼
                   [characters 角色 (含期数/现役/毕业状态)]
                          │ 1
                          │
                          │ N
[costume_themes 主题] 1 ──< N [costume_variants 角色衣装版本 (含待识别状态)]
                                  │ 1          │ 1
                                  │            │
                                  │ N          │ N
                                  ▼            ▼
                   [costume_images 图片]    [costume_sources 来源 (含声优Live/觉醒形态)]
```

### 数据表详细定义

#### 1. `projects`（企划表）
- `id` (TEXT, PK): 唯一标识，如 `hasunosora`, `nijigasaki`, `superstar`, `sunshine`, `muse`, `ikizuraibu`
- `name_ja` (TEXT, NOT NULL): 官方日文名
- `name_zh` (TEXT, NOT NULL): 中文名
- `sort_order` (INTEGER, DEFAULT 0)

#### 2. `groups`（团体 / 分队表）
- `id` (TEXT, PK): 唯一标识，如 `hasunosora_main`, `cerise_bouquet`, `dollchestra`, `mira_cra_park`, `edel_note`
- `project_id` (TEXT, NOT NULL, FK -> projects.id)
- `name_ja` (TEXT, NOT NULL): 日文名
- `name_zh` (TEXT, NOT NULL): 中文名
- `type` (TEXT, NOT NULL): `main`（主团） / `subunit`（小分队） / `special`（特别组合）
- `sort_order` (INTEGER, DEFAULT 0)

#### 3. `characters`（角色表）
- `id` (TEXT, PK): 唯一标识，如 `anyoji-hime`, `uehara-ayumu`, `seras-yanagida-lilienfeld`
- `name_ja` (TEXT, NOT NULL): 官方日文规范写法（如 `安養寺 姫芽`）
- `name_zh` (TEXT, NOT NULL): 中文惯用名（如 `安养寺姬芽`）
- `enrollment_term` (TEXT): 入学期数/届别（如 `102期`, `103期`, `104期`, `105期`, `106期` 或动画 1 期生）
- `status` (TEXT, NOT NULL, DEFAULT 'active'): `active`（现役在籍） / `graduated`（已毕业） / `former`（前成员）
- `color_hex` (TEXT): 成员代表色（十六进制）
- `sort_order` (INTEGER, DEFAULT 0)

#### 4. `character_groups`（成员活动历史与归属表）
- `character_id` (TEXT, NOT NULL, FK -> characters.id ON DELETE CASCADE)
- `group_id` (TEXT, NOT NULL, FK -> groups.id ON DELETE CASCADE)
- `period` (TEXT): 活动时期（如 `103期~104期`、`105期`、`全时期`）
- `status` (TEXT, NOT NULL, DEFAULT 'active'): `active`（当前在籍） / `historical`（历史所属）
- `role_description` (TEXT): 角色描述（如 `初始两人`、`104期加入`、`解散后移籍`）
- **PRIMARY KEY** (`character_id`, `group_id`, `period`)

#### 5. `costume_themes`（衣装主题 / 系列表）
- `id` (TEXT, PK): 主题 ID（UUID）
- `name_ja` (TEXT, NOT NULL): 主题日文名
- `name_zh` (TEXT): 主题中文译名（可选）
- `category` (TEXT, DEFAULT 'general'): 分类（`single_cd`, `anime_insert`, `game_event`, `live`, `general`）
- `description` (TEXT): 简要说明

#### 6. `costume_variants`（角色专属衣装版本表，支持“待识别”）
- `id` (TEXT, PK): 版本 ID（UUID）
- `theme_id` (TEXT, NOT NULL, FK -> costume_themes.id ON DELETE RESTRICT)
- `character_id` (TEXT, NOT NULL, FK -> characters.id ON DELETE RESTRICT)
- `name_ja` (TEXT): 官方日文名称（若尚未查明，允许为 NULL）
- `name_zh` (TEXT): 中文名称（可选）
- `name_status` (TEXT, NOT NULL, DEFAULT 'identified'): `identified`（已查明正式名） / `unidentified`（待识别，严禁编造正式名）
- `status` (TEXT, NOT NULL, DEFAULT 'unverified'): `verified`（已核实） / `unverified`（待核实）
- `notes` (TEXT): 服装设计特征备注
- `created_at` (TEXT, NOT NULL): ISO 字符串
- `updated_at` (TEXT, NOT NULL): ISO 字符串

#### 7. `costume_images`（衣装图片表）
- `id` (TEXT, PK): 图片 ID（UUID）
- `variant_id` (TEXT, NOT NULL, FK -> costume_variants.id ON DELETE CASCADE)
- `file_path` (TEXT, NOT NULL): 本地相对存储路径，如 `uploads/2026/hime-01.webp`
- `original_filename` (TEXT): 原始文件名
- `is_primary` (INTEGER, DEFAULT 0): 是否为主图（1 为是，0 为否）
- `caption` (TEXT): 说明（如 `立绘全身图`、`正面细节`、`背面设计`）
- `sort_order` (INTEGER, DEFAULT 0)

#### 8. `costume_sources`（衣装出处来源表，支持声优Live与觉醒状态）
- `id` (TEXT, PK): 来源 ID（UUID）
- `variant_id` (TEXT, NOT NULL, FK -> costume_variants.id ON DELETE CASCADE)
- `source_type` (TEXT, NOT NULL): 
  - `anime`（动画）
  - `game_card`（手游卡面）
  - `seiyuu_live`（声优现场演出服）
  - `cd_jacket`（CD 封面）
  - `magazine`（杂志）
  - `official_art`（官方插画/版权绘）
  - `other`（其他）
- `evolution_stage` (TEXT, NOT NULL, DEFAULT 'none'):
  - `none`（不适用/普通）
  - `unawakened`（手游觉醒前 / 特训前）
  - `awakened`（手游觉醒后 / 特训后）
- `title` (TEXT, NOT NULL): 来源标题（如 `Love Live! 莲之空 1st Live Tour 演出服`、`Link! Like!【Dream Believers】觉醒后`）
- `url` (TEXT): 供复查的真实权威链接
- `detail` (TEXT): 详细场次/时间点说明

---

## 4. 页面结构与多维筛选设计

```
┌────────────────────────────────────────────────────────────────────────┐
│ 导航：Love Live! 衣装资料库  [企划/团体] [全部角色]  [备份与还原]        │
├────────────────────────────────────────────────────────────────────────┤
│ 企划与团体目录（人数通过 SQL 动态计算，严禁硬编码）：                     │
│ ├─ 莲之空女学院学园偶像俱乐部 [在籍 9 人 / 历代 14 人] (含 102~106 期)   │
│ ├─ 虹咲学园学园偶像同好会     [在籍 12 人 / 历代 13 人] (含各分队)       │
│ └─ Liella! / Aqours / μ's / いきづらい部                                │
├────────────────────────────────────────────────────────────────────────┤
│ 角色衣装图鉴 (/character/:id)                                          │
│ ├─ 角色卡头：安养寺姬芽 [104期 / 在籍] [みらくらぱーく！] [莲之空]       │
│ ├─ 多维过滤条：                                                        │
│ │  ├ 状态：[全部] [已核实] [待核实] [待识别]                           │
│ │  ├ 来源类型：[全部] [动画] [手游卡面] [声优Live] [CD封面]             │
│ │  └ 卡面形态：[全部] [觉醒前] [觉醒后]                                │
│ ├─ 衣装卡片网格：                                                      │
│ │  ├ [卡片A: 已核实] 封面图 / Dream Believers / 来源: 手游觉醒后        │
│ │  └ [卡片B: 待识别] COS参考图 / 【待识别】某活动服 / 来源: 待核实      │
│ └─ 底部操作：[+ 录入新衣装]（支持先存图并标为待识别）                  │
├────────────────────────────────────────────────────────────────────────┤
│ 数据安全控制面板 (/settings/backup)                                     │
│ ├─ [一键导出本地备份 (ZIP)] -> 包含 archive.db 与所有本地图片           │
│ └─ [选择备份包恢复 (ZIP)]   -> 校验包合法性，恢复前自动创建 .bak 防覆盖 │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 5. 后端校验逻辑与备份方案

### 5.1 后端强制证据链校验规则
在 API 控制器 (`POST /api/costumes`, `PUT /api/costumes/:id`) 中执行硬校验：
```ts
if (payload.status === 'verified') {
  // 1. 检查日文名称有效性
  if (payload.name_status === 'unidentified' || !payload.name_ja || !payload.name_ja.trim()) {
    return res.status(400).json({
      error: '校验失败：标记为“已核实”的衣装必须具备查证属实的官方日文原名，不得为待识别或留空。'
    });
  }
  // 2. 检查证据来源有效性
  const sources = payload.sources || [];
  const hasValidEvidence = sources.some(s => 
    s.title && s.title.trim().length > 0 &&
    s.url && /^https?:\/\/.+/i.test(s.url.trim())
  );
  if (!hasValidEvidence) {
    return res.status(400).json({
      error: '校验失败：标记为“已核实”的衣装必须提供至少一条带有可复查有效链接（HTTP/HTTPS）的出处依据。'
    });
  }
}
```

### 5.2 本地数据备份与恢复机制
- **备份包结构**：
  ```
  backup_20261110_015030.zip
  ├── manifest.json       (记录备份时间、版本号、记录数、图片数量)
  ├── archive.db          (SQLite 完整数据库快照)
  └── uploads/            (全部已上传图片目录)
  ```
- **安全还原流程**：
  1. 上传或选择 ZIP 备份包；
  2. 后端解压至临时目录，校验 `manifest.json` 与 `archive.db` 结构；
  3. 将当前 `data/` 目录原子更名为 `data_backup_timestamp.bak` 作为安全回退点；
  4. 将解包出的 `archive.db` 与 `uploads/` 写入 `data/`；
  5. 重新载入 SQLite 连接并返回恢复成功通知。

---

## 6. 验收用例与测试映射矩阵 (AC-1 至 AC-10)

| Spec 用例编号 | 场景描述 | 自动化/手动验证方式 | 预期结果判定标准 |
| :--- | :--- | :--- | :--- |
| **AC-1** | **正常浏览**：选择虹咲 → 三船栞子 → 衣装 | 访问首页 → 虹咲 → 三船栞子。 | 成功加载该角色已核实衣装，显示立绘、日文名、来源出处。 |
| **AC-2** | **修改后更新**：修改一条衣装记录名称并保存 | 打开衣装详情，修改名称并保存，刷新页面。 | 列表与详情立即同步显示新名称，F5 刷新后保持不变。 |
| **AC-3** | **持久保存**：录入新衣装与图片，重启应用 | 新增一条衣装并上传图片，重启 Node.js 进程。 | 重启后该记录与图片完好无损，文件与 DB 均已落盘。 |
| **AC-4** | **缺失数据处理**：无衣装或无图片时的容错表现 | 访问无衣装角色；录入无图衣装。 | 角色页显示优雅“暂未收录”空状态；无图衣装显示占位符，排版整齐不报错。 |
| **AC-5** | **资料可信度**：首批核查数据真实出处 | 抽查三船栞子、上原步梦、安养寺姬芽的已核实记录。 | 来源链接均可直达权威出处并印证官方名称。 |
| **AC-6** | **待识别衣装录入**：无日文名暂存模式 | 录入一套仅有图片与自用说明的服装，设为“待识别”。 | 保存成功，界面展示【待识别】标签，不强制编造日文名；后续补全名称后可转正。 |
| **AC-7** | **声优Live与卡面形态筛选**：精确过滤 | 在筛选器中勾选“声优Live”或“手游觉醒后”。 | 列表即刻仅展示匹配该维度的衣装卡片，非匹配项被精确过滤。 |
| **AC-8** | **已核实后端强校验**：防伪防漏 | 缺少来源 URL 或日文名仍尝试设为“已核实”。 | 后端直接拦截并返回 400 明确错误提示；前端展示阻止保存原因。 |
| **AC-9** | **本地数据备份与恢复**：防丢与还原 | 导出备份 ZIP，手动修改/删除数据后执行恢复还原。 | 恢复后原有数据库记录与所有图片完整无损还原。 |
| **AC-10** | **历代成员动态统计与历史保留**：莲之空各期 | 检查团体列表与莲之空角色阵容。 | 人数由 SQL 聚合计算得出；102 期至 106 期成员及相关衣装完整呈现，历史不丢失。 |

---

## 7. 实施分步任务规划（待确认后执行）

- **Task 1: 项目骨架与数据库持久层（含历代阵容与约束）**
  - 构建 Vite + React + TS 前端与轻量 Node.js 后端。
  - 创建 SQLite Schema（含 `status`, `enrollment_term`, `evolution_stage`, `name_status`）。
  - 录入真实企划、团体与角色的基础元数据（含莲之空 102~106 期历代成员及虹咲、μ's、Aqours、Liella!、いきづらい部，动态 COUNT 人数）。
- **Task 2: 后端 API 与安全校验（CRUD、图片服务、强证据校验）**
  - 实现团体与角色 API（含动态聚合统计）。
  - 实现衣装与来源的 CRUD 接口，嵌入 `verified` 证据链硬校验逻辑。
  - 实现图片上传重命名与静态文件托管服务。
- **Task 3: 本地备份与恢复引擎**
  - 实现 `backup` 打包端点与 CLI 命令。
  - 实现 `restore` 校验解包与 `.bak` 兜底机制。
- **Task 4: 前端核心视图与多维筛选交互**
  - 团体/角色总览页（动态人数统计、现役/历代切换）。
  - 角色专属衣装图鉴页（多维筛选：状态、声优Live、卡面觉醒形态）。
  - 衣装详情大图灯箱预览。
  - 衣装编辑与“待识别”录入表单。
- **Task 5: 首批数据考据录入与全面验收**
  - 录入三船栞子、上原步梦、安养寺姬芽的核实衣装及一套“待识别”示例。
  - 逐条执行 AC-1 至 AC-10 验收测试。
