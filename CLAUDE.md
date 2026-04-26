# pm_agent Repository

本文件为 Claude 在 `pm_agent` 中工作的总入口。

## 仓库定位

`pm_agent` 是当前唯一的产品经理主仓，用于同时承接：

- 稳定可复用的产品与业务知识
- 正在推进的需求、原型和 PRD
- H5 / PC 演示工程与页面稿

当前仓库已经整合产品知识沉淀、专题式 PRD 维护和 H5 / PC demo 工程。后续新增内容统一在本仓库内沉淀。

## 三层结构

- `03_context/`：已经确认、适合长期复用的稳定事实
- `04_workspace/`：正在推进的需求、PRD、原型、demo 和讨论
- `05_drafts/`：临时记录、方案探索和未定内容

知识流转路径：

`05_drafts/ -> 04_workspace/ -> 03_context/`

## 重点目录

- `01_agents/`：沉淀可复用的 PM 角色定义，给 Codex / Claude 提供稳定的执行身份
- `02_tools/`：沉淀模板、清单和工作流，减少每次从零组织输入
- `03_context/01_产品架构/`：产品概览、术语、立项背景等稳定信息
- `03_context/02_功能模块/`：已沉淀的功能规则和模块说明
- `04_workspace/prd/`：按“一个需求一个专题目录”维护需求全过程
- `04_workspace/demos/`：H5 与 PC 演示工程
- `.claude/commands/`：给 Claude / Codex 使用的命令说明和方法入口

## 工作约定

1. 默认使用简体中文。
2. 新需求一律优先进入 `04_workspace/prd/某个专题/`。
3. 未确认内容先放 `05_drafts/`，不要直接进入 `03_context/`。
4. 已经上线并稳定的规则，再从 `04_workspace/` 提炼到 `03_context/`。
5. 每次新增、移动或归档文档后，同步更新相关目录的 `CLAUDE.md` 与 `AGENTS.md`。
6. `04_workspace/demos/` 只存放工程、页面稿和演示资产，不承载长期知识。
7. `01_agents/` 只放“如何做事”的角色定义，不记录具体需求、会议或业务事实。
8. `02_tools/` 只放模板、清单和工作流，不承载正在推进的专题内容。

## 命令入口

- `.claude/commands/context-engineer.md`
- `.claude/commands/write-prd.md`
- `.claude/commands/requirements-analysis.md`
- `.claude/commands/prd-writer.md`
- `.claude/commands/pc-demo.md`
