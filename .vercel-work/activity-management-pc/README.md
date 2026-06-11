# PC Demo

PC demo 使用 React + Ant Design + Vite，固定本地访问地址为：

- `http://127.0.0.1:3002/`

推荐不要直接手工 `bun run dev` 常驻，而是统一使用 [`04_workspace/demos/demosctl.sh`](../demosctl.sh) 安装本地守护：

```bash
bash /Users/hugaopeng/Desktop/pm_agent/04_workspace/demos/demosctl.sh install
```

常用命令：

```bash
bash /Users/hugaopeng/Desktop/pm_agent/04_workspace/demos/demosctl.sh status
bash /Users/hugaopeng/Desktop/pm_agent/04_workspace/demos/demosctl.sh restart pc
bash /Users/hugaopeng/Desktop/pm_agent/04_workspace/demos/demosctl.sh open pc
```
