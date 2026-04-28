# demos/scripts

本文件是 Codex 使用的目录索引。

## 用途

这里存放 H5 / PC 演示工程共用的启动与守护辅助脚本。

## 当前文件

- `demo-common.sh` — 端口、日志、状态目录等公共变量与函数
- `run-demo-service.sh` — 单个 demo 服务的运行入口

## 维护规则

- 修改脚本参数或日志路径后，同步更新上级 `04_workspace/demos/` 索引
- 本目录只放共用脚本，不放业务文档
