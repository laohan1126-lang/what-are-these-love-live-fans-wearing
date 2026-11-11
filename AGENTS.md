# Love Live! 衣装资料库 (Costume Archive)

## 项目约定

- 本项目为一个面向个人的 Love Live! 衣装与角色本地资料库。
- 遵循 Spec 驱动开发（规格位于 `docs/spec/`，前向知识图谱与双 Agent 契约参见 `docs/spec/0005-costume-master-knowledge-pipeline.md`）。
- 编码与提交说明统一使用中文，涉及官方角色名、曲名、衣装原名保留日文规范写法。
- 数据真实性优先：未核实或空数据保持空状态，严禁生成臆想或未证实的设定内容。

## 前向知识图谱流水线与双轨资产铁律

1. **严禁盲猜与逆向盲搜**：数据生成严格遵循正向依赖流（官方歌曲/专辑 Master -> 官方 2D 特训后舞台服 Master -> 生成靶向抓取契约 `tasks/crawl_targets.json` -> 3D 真人模特正向采集）。严禁在无官方 Master 约束下逆向反推或模糊盲爬。
2. **左轨 2D 官方原画铁律**：必须严格收录官方觉醒后/特训後（3600×1800 级别）超清舞台打歌服插画母版；**绝对严禁**使用特训前日常服或通用普通校服（制服）作为正式舞台打歌服的占位图。
3. **右轨 3D 真人模特铁律**：必须为真实人类（高质量 Coser 或声优 Cast）正面立姿（0°~15°正面或 3/4 站姿，全身或过膝）模特级展拍；**绝对严禁**塑料假人模特、背影照、大球场大远景灯海模糊废片。

## 本地双 Agent 协作契约 (AntiGravity + opencode)

- **AntiGravity (设计架构师与质量总检官)**：
  - 负责底层架构设计、知识图谱 Schema 与演进；
  - 建立官方曲目/衣装日文 Master 基础元数据，录入并核验 2D 特训后官方原画母版；
  - 输出并维护靶向采集任务清单 `tasks/crawl_targets.json`；
  - 负责终审验收与质量检验，运行 `pnpm test` 保证端到端验收通过。
- **opencode (外部本地执行 Agent / 垂直抓取与资产落地者)**：
  - 读取 `tasks/crawl_targets.json` 中结构化待办；
  - 按照 Spec 0004/0005 严苛标准执行外部平台定向检索；
  - 严格剔除假人/背影/远景，下载高质量正面真人立姿照并同步落盘至 `data/uploads/` 与 `public/uploads/`；
  - 录入/更新 `costume_images` (real_life) 与 `costume_sources` 溯源记录，更新任务清单状态。

<!-- egm-spec-workflow:project:start -->
## EGM + Spec-Driven Development

- 本项目采用 EGM + Spec-Driven Development 流程（遵循全局 EGM 约定）。
- EGM artifact directory: `.egm`
- 正式批准的设计位于：`docs/designs/`；需求规格位于：`docs/spec/`。
- 新增或重大设计先经独立评审并获用户批准后实现；UI 重设计遵循 `ui-design-1-0` (v1.6) Goal Loop 协议与真实渲染举证。
- 构建与验证命令：
  - 启动开发服务：`pnpm run dev`（后端 `:3001`，前端 `:5173`）
  - 构建前端：`pnpm run build`
  - 全量验收测试：`pnpm test`（执行 `tsx tests/run-all-tests.ts`，覆盖 AC-1 ~ AC-10）
  - 数据快照备份：`pnpm run backup`
<!-- egm-spec-workflow:project:end -->
