# H5 演示工程

本文件是 Codex 使用的目录索引。

## 项目概述

基于 React + Ant Design + Vite 的 H5 演示工程，用于展示医生端、医生开单、患者分享页和运营端相关页面。

## 访问与运行

- 固定地址：`http://127.0.0.1:3001/`
- 使用 `bash /Users/hugaopeng/Desktop/pm_agent/04_workspace/demos/demosctl.sh status` 查看运行状态
- 如需重启 H5，使用 `bash /Users/hugaopeng/Desktop/pm_agent/04_workspace/demos/demosctl.sh restart h5`

## 当前文件

- `package.json` — 工程依赖与脚本入口
- `vite.config.js` — Vite 配置
- `src/app/` — 应用入口与角色选择页
- `src/routes/h5Routes.jsx` — H5 路由配置
- `src/features/doctor/` — 医生端工作台
- `src/features/doctor-ordering/` — 医生开单与患者分享页
- `src/features/operator/` — 运营端工作台
- `src/features/patient/` — 患者端相关页面与模拟数据
- `src/shared/` — H5 通用组件与样式
- `public/` — 静态资源

## 忽略项

- `dist/` — 构建产物目录，不手工维护索引
- `node_modules/` 与 `node_modules_symlink/` — 依赖目录，不手工维护索引

## 维护规则

- 本目录只承载 H5 演示工程代码，不沉淀长期业务知识
- 重要页面结构调整后，同步更新本文件与相关 `README.md`
- 业务规则稳定后，应提炼回 `04_workspace/prd/` 或 `03_context/`
