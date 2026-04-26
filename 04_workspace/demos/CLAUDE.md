# 04_workspace/demos

## 目录定位

这里维护 H5 / PC demo 的工程代码，以及本机稳定启动所需的守护脚本和文档。

## 固定地址

- H5：`http://127.0.0.1:3001/`
- PC：`http://127.0.0.1:3002/`

## 命令入口

```bash
bash /Users/hugaopeng/Desktop/pm_agent/04_workspace/demos/demosctl.sh install
bash /Users/hugaopeng/Desktop/pm_agent/04_workspace/demos/demosctl.sh status
bash /Users/hugaopeng/Desktop/pm_agent/04_workspace/demos/demosctl.sh restart
bash /Users/hugaopeng/Desktop/pm_agent/04_workspace/demos/demosctl.sh uninstall
bash /Users/hugaopeng/Desktop/pm_agent/04_workspace/demos/demosctl.sh open
```

## 维护约定

1. 书签直达能力必须落在 `launchd`，不要再回退到临时后台进程。
2. 改动固定端口、守护标签、日志目录时，要同步更新 `README.md`、`AGENTS.md` 和相关子目录说明。
3. 默认只监听 `127.0.0.1`，不对外网或局域网暴露。

## 当前文件

- `README.md` — 演示工程的运行说明、日志位置和常见问题
- `demosctl.sh` — 本地守护安装、状态查看、重启和打开浏览器的统一入口
- `scripts/` — H5 / PC demo 共用脚本
- `h5/` — H5 演示工程
- `pc/` — PC 演示工程

## 忽略项

- `.runtime/` — 本地运行生成的状态和日志目录，不作为长期索引对象
- `h5/dist/`、`pc/dist/` — 构建产物目录，不手工维护索引
- `h5/node_modules/`、`pc/node_modules/` — 依赖目录，不手工维护索引
