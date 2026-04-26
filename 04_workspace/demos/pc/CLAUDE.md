# PC 端供应链管理后台

## 项目概述

基于 React + Ant Design + Vite 的 PC 端供应链管理后台 Demo，重点在于界面展示和交互体验，所有数据使用 Mock 模拟。

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

## 启动命令

```bash
bash /Users/hugaopeng/Desktop/pm_agent/04_workspace/demos/demosctl.sh install
bash /Users/hugaopeng/Desktop/pm_agent/04_workspace/demos/demosctl.sh status
```

固定访问地址：

- H5：`http://127.0.0.1:3001/`
- PC：`http://127.0.0.1:3002/`

如需单独重启 PC：

```bash
bash /Users/hugaopeng/Desktop/pm_agent/04_workspace/demos/demosctl.sh restart pc
```

## UI 风格

- **主题色**：橙色 #FF6B00
- **风格**：简约企业风，橙白主色调
- **按钮**：主操作按钮使用主题色背景（`ant-btn-primary`）
- **选中效果**：一二级菜单选中显示橙色

## 布局规范

- **整体**：固定高度 `height: 100vh; overflow: hidden`
- **菜单**：固定不滚动，高度 calc(100vh - 116px)
- **导航栏**：固定不滚动
- **内容区**：flex 布局，内部滚动
- **分页**：固定在页面底部，不随列表滚动
- **列表 Table**：表头固定，内容区域滚动 `scroll={{ x, y: 'calc(100vh - 300px)' }}`

## 菜单结构

- 经营业务：`/sales/order`、`/sales/return`
- 激励管理：`/incentive/review`、`/incentive/binding`、`/incentive/commission`、`/incentive/withdrawal`
- 平台运营：`/platform/dashboard`、`/platform/analysis`、`/platform/doctor-analysis`、`/platform/monthly-review`、`/platform/ai-report-upload`

## 开发规范

### 新增页面

1. 在 `src/features/` 下创建页面文件
2. 在 `src/routes/pcRoutes.jsx` 添加路由配置和菜单项
3. 需要布局或导航联动时，配合 `src/shared/` 下的组件与状态
4. 列表或演示数据统一补到 `src/shared/mocks/`

### 菜单与标签联动

- 点击菜单时调用 `addTab({ key, label })` 添加标签
- `findLabel` 函数递归查找菜单 label，找不到返回 `null`
- 标签名、菜单名、页面标题三者必须一致

### 分页规范

- 默认每页 20 条
- 可选 10/20/50 条
- 模拟数据 100 条

## Mock 数据规范

- 使用工厂函数生成 100 条数据
- 字段贴合业务实际
- 导出列表数据和详情查询函数

## 注意事项

- Demo 项目，不需要真实后端接口
- 不需要登录认证、权限控制
- 保持代码简洁，避免过度工程化
- `dist/` 与 `node_modules/` 为生成目录，不手工维护索引
