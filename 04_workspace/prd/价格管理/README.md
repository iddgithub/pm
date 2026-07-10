# 价格管理

本专题用于承接活动管理重构后的“价格管理”方案。

## 背景

多次会议确认，原活动管理方案将互联网医院渠道价、交付中心活动价、用户优惠券和主套优惠混在同一个活动模型里，容易造成主体不清、价格冲突和结算口径混乱。

本专题按 B 方案推进：将价格能力拆成三类配置，用户下单时统一命中和计算。

## 文档

- `prd/01-价格管理B方案简要PRD.md`：用于向领导阐述方案逻辑的简要 PRD。

## 关联模块

- PC demo 页面：`04_workspace/demos/pc/src/features/platform-ops/pages/Platform/PriceManagement/`
- 原活动管理页面：`04_workspace/demos/pc/src/features/platform-ops/pages/Platform/ActivityManagement/`
- 对码多对多专题：`04_workspace/prd/检查项目多对多对码/`

## 当前结论

- 活动管理继续保留。
- 在活动管理菜单下方新增“价格管理”。
- 价格管理采用三类活动分层：互联网医院价格活动、交付中心价格活动、平台通用优惠。
- 主套优惠不作为独立活动类型，先由组合项目 / 对码多对多解决。
