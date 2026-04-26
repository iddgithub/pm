# 04_workspace/demos

`04_workspace/demos/` 用来承接可运行的 H5 / PC 演示工程，不承载稳定业务知识。

固定本地访问地址：

- H5：`http://127.0.0.1:3001/`
- PC：`http://127.0.0.1:3002/`

## 推荐用法

第一次安装本地守护：

```bash
bash /Users/hugaopeng/Desktop/pm_agent/04_workspace/demos/demosctl.sh install
```

查看状态：

```bash
bash /Users/hugaopeng/Desktop/pm_agent/04_workspace/demos/demosctl.sh status
```

打开浏览器：

```bash
bash /Users/hugaopeng/Desktop/pm_agent/04_workspace/demos/demosctl.sh open
```

重启服务：

```bash
bash /Users/hugaopeng/Desktop/pm_agent/04_workspace/demos/demosctl.sh restart
```

卸载守护：

```bash
bash /Users/hugaopeng/Desktop/pm_agent/04_workspace/demos/demosctl.sh uninstall
```

## 日志位置

- 统一日志目录：`04_workspace/demos/.runtime/logs/`
- H5 主日志：`04_workspace/demos/.runtime/logs/h5.log`
- PC 主日志：`04_workspace/demos/.runtime/logs/pc.log`

## 常见问题

### 书签点开后提示连接失败

先执行：

```bash
bash /Users/hugaopeng/Desktop/pm_agent/04_workspace/demos/demosctl.sh status
```

常见状态说明：

- `未安装`：还没把 `launchd` 守护装到本机
- `agent 未加载`：本机守护没有启动
- `进程存在但端口未监听`：Vite 已起但启动失败或端口冲突
- `端口被其他程序占用`：`3001` 或 `3002` 被别的程序占了

### 修改代码后需要手动刷新吗

不需要。方案仍然使用 Vite 开发服务，页面修改后会保持热更新。
