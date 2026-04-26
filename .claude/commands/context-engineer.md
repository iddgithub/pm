# Context Engineer

使用已安装的 `context-engineer` skill 维护 `pm_agent` 仓库中的上下文知识体系。

## Skill 入口

- `/Users/hugaopeng/.codex/skills/context-engineer/SKILL.md`
- 需要更细的流程时，读取 `/Users/hugaopeng/.codex/skills/context-engineer/references/`

## 适用场景

- Bootstrap: 从零或低结构状态初始化 Context 仓库
- Ingest: 把原始记录、会议内容、想法或事实整理进合适目录
- Maintain: 扫描并同步 `AGENTS.md` / `CLAUDE.md` 索引
- Evolve: 判断哪些内容应从 `05_drafts/` 推进到 `04_workspace/` 或从 `04_workspace/` 沉淀到 `03_context/`
- Diagnose: 输出 Context 仓库健康度报告

## 执行规则

1. 默认使用中文，沿用仓库现有命名和表达。
2. 严格遵循三层流转：`05_drafts/ -> 04_workspace/ -> 03_context/`。
3. 先判断信息属于 `05_drafts/`、`04_workspace/` 还是 `03_context/`；拿不准时优先放入 `05_drafts/`，避免污染稳定事实。
4. 每次新增、移动或删除文档后，同步更新相关目录的 `AGENTS.md` 与 `CLAUDE.md`。
5. 新需求优先落在 `04_workspace/prd/某个专题/`，演示工程只放在 `04_workspace/demos/`。
6. 不编造业务事实；缺失信息用 `[TODO]` 或“待确认”标记。
