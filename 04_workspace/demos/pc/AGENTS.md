# PC 端供应链管理后台

本文件是 Codex 使用的目录索引；同目录 `CLAUDE.md` 是 Claude 使用的目录索引，二者应保持一致。

## 项目概述

基于 React + Ant Design + Vite 的 PC 端供应链管理后台 Demo，重点在于界面展示和交互体验，所有数据使用 Mock 模拟。

## 访问与运行

- H5 固定地址：`http://127.0.0.1:3001/`
- PC 固定地址：`http://127.0.0.1:3002/`
- 使用 `bash /Users/hugaopeng/Desktop/pm_agent/04_workspace/demos/demosctl.sh status` 查看运行状态
- 如需单独重启 PC，使用 `bash /Users/hugaopeng/Desktop/pm_agent/04_workspace/demos/demosctl.sh restart pc`

## 维护规则

- 本目录只承载 PC 演示工程代码与运行相关说明，不沉淀长期业务知识
- 新增说明文档或重要结构调整后，同步更新本文件与同目录 `CLAUDE.md`
- 业务规则稳定后，应提炼回 `04_workspace/prd/` 或 `03_context/`，不要只停留在 demo 代码里

## 当前文件

- `package.json` — 工程依赖与脚本入口
- `vite.config.js` — Vite 配置
- `src/app/App.jsx` — 根组件入口
- `src/routes/pcRoutes.jsx` — 路由与左侧菜单定义
- `src/features/home/` — 首页模块
- `src/features/commerce/` — 销售与经营业务页面
- `src/features/incentive-admin/` — 激励管理页面
- `src/features/platform-ops/` — 平台运营页面，包括 AI 报告上传与各类分析页
- `src/shared/` — 布局、导航、状态和 Mock 数据
- `src/styles/global.css` — 全局样式
- `public/` — 静态资源

## 忽略项

- `dist/` — 构建产物目录，不手工维护索引
- `node_modules/` — 依赖目录，不手工维护索引
