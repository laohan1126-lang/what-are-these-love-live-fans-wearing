# 0005 - Love Live! 衣装主知识图谱流水线与双 Agent 协作契约规范 (Master Knowledge Pipeline & Agent Contract)

## 背景

在 Love Live! 衣装资料库的建设演进中，早期采集曾面临由于缺乏统一前向事实源导致的数据混乱：
1. **无源盲搜与逆向反推失真**：在没有官方确凿曲目与衣装 Master 记录时直接去第三方社交平台（如小红书、微博、Twitter 等）以模糊词抓取，导致衣装名称错误、角色归属错位，甚至将同人自制私服误收录为主图鉴。
2. **左轨原画占位降级**：部分打歌服左轨 2D 原画使用了未觉醒的日常便服、通用学校制服（校服）作为主打歌服插画，严重背离了舞台打歌服图鉴的初心。
3. **右轨真人实穿质量参差**：混入塑料假人模特（无动态悬垂感）、背影照（完全看不清胸前排扣与腰封细节）、以及几十万人体育场看台大远景舞台照（人物模糊成几个色块）。

为了从根本上保障图鉴的权威性、学术性与视觉美感，本规范确立**前向知识图谱流水线 (Forward Knowledge Graph Pipeline)**，并正式确立**本地双 Agent（AntiGravity + opencode）协作契约**。

---

## 一、前向知识图谱流水线铁律 (Forward Pipeline Iron Rules)

知识图谱的数据生成与资产流动必须严格遵循**单向正向依赖流**：

```
[官方企划/曲目/专辑 Master]
          ↓
[官方特训后/觉醒舞台服 Master (2D 3600x1800 母版)]
          ↓
[生成任务契约清单 tasks/crawl_targets.json]
          ↓
[opencode 靶向检索真实 Coser/声优正面全身模特照]
          ↓
[双轨严格准入检验与入库落盘]
```

### 1. 绝对严禁盲猜与逆向盲搜 (Prohibition of Blind Guessing & Reverse Scraping)
- **前置依赖**：系统录入任何一套衣装前，必须先在知识库中建立或确认其所属的企划代号、团体、官方正式日文曲名、官方日文衣装名、登场舞台/卡面属性。
- **禁止反向推导**：严禁在未确立官方 Master 节点的情况下，直接从抓取到的图片反向臆造或猜测歌曲名称与衣装信息。

### 2. 双轨对照左轨铁律：官方特训后/觉醒舞台打歌服母版
- **核心要求**：左轨 2D 资产必须严格为官方觉醒后（特训後 / 覚醒後）的高分辨率舞台打歌服原画立绘（画质基准：3600×1800 级别或超清矢量卡面提取，保证无损放大）。
- **红线禁止**：
  - ❌ **严禁使用普通通用校服（冬服/夏服制服）作为打歌服的左轨主图**。
  - ❌ **严禁使用特训前日常便服、练习服作为正式舞台打歌服的主原画**。
  - 仅当该衣装词条本身就是“音ノ木坂学院制服”、“浦の星女学院制服”等专门制服词条时，方允许收录校服原画。

### 3. 双轨对照右轨铁律：3D 真人模特正面实穿对照
- **核心要求**：右轨 3D 资产必须为真实人类（高质量 Coser 或官方声优 Cast）亲身穿着该衣装展示。
  - **视角与姿态**：必须**正对镜头（0°~15°正面或 3/4 站姿）**，呈服装模特级展拍姿态，整体衣装轮廓舒展对称。
  - **画幅构图**：必须为**全身立姿**或**过膝 3/4 半身景**，完整清晰展现领口、肩饰、胸前配饰、腰封腰带、裙摆层级与袜靴搭配。
  - **画质标准**：主体清晰锐利，无剧烈运动模糊或严重噪点。
- **四大红线禁令**：
  - ❌ **严禁背影**：看不清正面结构版型的背影照，一律不得作为主对照图。
  - ❌ **严禁大远景/烟雾灯海全景**：体育馆看台大远景或舞台灯海远镜头（人物极小、衣服细节缺失）严禁作为 `real_life`。
  - ❌ **严禁塑料假人模特与冷冰平铺**：假人模特无法体现真人的自然垂坠感与身材比例，严禁作为 `real_life` 主图（必须降级或放入 `detail` 辅助图）。
  - ❌ **严禁严重偏色、过暗或严重遮挡的废片**。

---

## 二、本地双 Agent 协作契约 (Local Dual-Agent Contract)

本项目采用 AntiGravity 与 opencode 双 Agent 互补协作机制，各司其职、边界清晰：

```
+-----------------------------------------------------------------------------+
| AntiGravity (本地系统架构师 & 质量总检官)                                       |
|  1. 定义数据结构、知识图谱 Schema 与演进规范                                  |
|  2. 确立官方曲目/衣装日文 Master 基础元数据                                    |
|  3. 导入并核验 2D 官方觉醒后 (3600x1800) 超清母版插画                          |
|  4. 输出任务清单 tasks/crawl_targets.json                                    |
|  5. 审核 opencode 产出资产并执行 pnpm test 及端到端验证                        |
+-----------------------------------------------------------------------------+
                                      │
                         写入任务清单  │ tasks/crawl_targets.json
                                      ▼
+-----------------------------------------------------------------------------+
| opencode (本地垂直抓取与视觉落地执行 Agent)                                    |
|  1. 读取 tasks/crawl_targets.json 待办任务                                   |
|  2. 按照 Spec 0004/0005 严苛标准执行外部图库与社交平台定向检索                   |
|  3. 严格甄别正面真人全身/过膝模特照，过滤假人/背影/远景废片                     |
|  4. 下载原图并同时落盘到 data/uploads/ 与 public/uploads/                     |
|  5. 录入/更新数据库 costume_images (real_life) 与 costume_sources 出处溯源    |
|  6. 更新 tasks/crawl_targets.json 任务状态并向 AntiGravity 交付                |
+-----------------------------------------------------------------------------+
```

---

## 三、任务契约清单规范 (`tasks/crawl_targets.json`)

AntiGravity 通过 `tasks/crawl_targets.json` 向 opencode 下发明确、结构化的抓取目标。

### 1. 文件路径与格式
- 路径：`tasks/crawl_targets.json`
- 编码：UTF-8 无 BOM
- 格式规范遵循下述 JSON Schema：

```json
{
  "version": "1.0.0",
  "generated_at": "2026-11-11T17:30:00.000Z",
  "pipeline": "forward-master-pipeline",
  "contract_rules": {
    "left_track": "strictly 2D official awakened stage costume master (no school uniforms)",
    "right_track": "strictly 3D real human coser/cast front-facing standing model",
    "forbidden": ["mannequins", "back-facing", "far-distance blurry stage", "school uniform placeholders"]
  },
  "tasks": [
    {
      "task_id": "crawl-takami-chika-aozora-jumping-heart",
      "character_id": "takami-chika",
      "character_name_ja": "高海千歌",
      "character_name_zh": "高海千歌",
      "group": "Aqours",
      "costume_id": "costume-aozora-jumping-heart",
      "costume_name_ja": "青空Jumping Heart",
      "costume_name_zh": "青空Jumping Heart",
      "variant_id": "variant-chika-aozora-jumping-heart",
      "target_type": "real_life_model",
      "search_keywords": [
        "高海千歌 青空Jumping Heart cos 正面",
        "高海千歌 青空Jumping Heart 模特 立拍",
        "Aqours 青空Jumping Heart 打歌服 正面全身"
      ],
      "visual_requirements": {
        "perspective": "front_facing_0_to_15_degrees",
        "framing": "full_body_or_knee_up_standing",
        "subject": "real_human_coser_or_cast",
        "reject": ["mannequin", "back_facing", "extreme_long_shot", "blurry"]
      },
      "dest_filename": "chika_aozora_jumping_heart_real_model.jpg",
      "status": "pending",
      "assigned_agent": "opencode",
      "result": null
    }
  ]
}
```

### 2. 字段生命周期与状态机
- `status`:
  - `pending`: 待 opencode 执行
  - `in_progress`: opencode 正在检索抓取
  - `completed`: 已成功下载落盘并写入数据库
  - `rejected`: 经检索无符合严苛标准的优质真人正面照，进入异常复核流，绝不使用次品凑数
- `result`: 任务完成后记录产物元数据：
  - `file_path`: 统一为 `/uploads/<filename>`
  - `source_title`: 出处说明与作者
  - `source_url`: 来源页面 URL
  - `completed_at`: 完成时间戳

---

## 四、验收标准 (Acceptance Criteria)

- **AC-1（前向知识图谱流成立）**：系统所有衣装词条拥有正向建立的官方曲目/衣装元数据根基，彻底杜绝无源逆向盲推。
- **AC-2（2D 官方特训后母版保证）**：双轨左轨必须全部对应特训后舞台打歌服超清立绘母版，排查并清零任何以普通校服、日常私服冒充舞台打歌服的现象。
- **AC-3（3D 真人模特正面对照保证）**：双轨右轨主图必须为真人（Coser/声优）正向立姿模特照，彻底剔除假人、背影与大远景。
- **AC-4（双 Agent 契约文件落地）**：`tasks/crawl_targets.json` 符合完整 Schema 规范，能被外部 Agent 直接消费并回写状态。
- **AC-5（工程与测试全面通过）**：更新与创建的文件符合项目约定，`pnpm test` 持续保持 100% 通过率。

---

## 五、非目标 (Non-Goals)

1. 不允许为了提高所谓的“收录数量”而放宽对假人、背影、大远景图片的准入限制；
2. 不允许在未有官方 2D 特训后舞台服母版的情况下直接上线单轨劣质图鉴；
3. 本规范不涉及商业收费与 COS 服成衣买卖。

---

## 变更记录

- 2026-11-11: 初始创建 0005 规范，确立前向知识图谱流水线、双轨 2D/3D 黄金标准与本地双 Agent (AntiGravity + opencode) 协作契约。
