# H5 Demo

H5 demo 使用 React + Ant Design + Vite，固定本地访问地址为：

- `http://127.0.0.1:3001/`

这里放的是可运行的 H5 演示工程，不是长期知识文档。

## 目录关系

- `src/app/`：应用级壳层与全局入口
- `src/routes/`：路由配置
- `src/features/`：按业务功能组织的页面和模块
- `src/shared/`：可复用组件、布局、样式和通用能力
- `src/pages/`：较轻的页面级入口
- `public/`：静态资源

## 推荐用法

不要长期手工 `bun run dev` 常驻，优先统一使用 [`04_workspace/demos/demosctl.sh`](../demosctl.sh)：

```bash
bash /Users/hugaopeng/Desktop/pm_agent/04_workspace/demos/demosctl.sh install
```

常用命令：

```bash
bash /Users/hugaopeng/Desktop/pm_agent/04_workspace/demos/demosctl.sh status
bash /Users/hugaopeng/Desktop/pm_agent/04_workspace/demos/demosctl.sh restart h5
bash /Users/hugaopeng/Desktop/pm_agent/04_workspace/demos/demosctl.sh open h5
```

## 适合放这里的内容

- 演示页面
- 交互验证页面
- 需求配套的前端原型工程

## 不适合放这里的内容

- 稳定业务规则说明
- 正式 PRD
- 会议纪要或需求分析正文

这些内容应回到 `04_workspace/prd/` 或 `03_context/`。

## 维护原则

- 重要目录结构调整后，同步更新本目录 `AGENTS.md` 和 `README.md`
- demo 代码服务于演示和验证，不要把它当知识库
- 若某些通用规则稳定下来，应提炼回文档层
