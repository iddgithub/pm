# 运营医生激励方案

本目录用于沉淀“运营/医生激励方案”这一整套需求的完整过程文档，而不仅仅是最终 PRD。

## 目录分层

```text
运营医生激励方案/
├── README.md
├── analysis/      # 需求分析、规则澄清、待确认项
├── prototype/     # 原型说明、页面结构、交互草稿
└── prd/           # 正式 PRD、评审稿、定稿
```

## 当前文件

- `analysis/01-需求分析.md`：第一版需求分析文档
- `prototype/02-原型说明.md`：第一版页面与原型结构说明
- `prd/03-PRD.md`：正式 PRD 草稿

## 使用顺序

1. 先完善 `analysis/01-需求分析.md`
2. 再补充 `prototype/02-原型说明.md`
3. 最后完成 `prd/03-PRD.md`
4. 若需要后台 Demo，再进入 `04_workspace/demos/pc/` 开发平台管理端和平台运营端页面

## 后续维护规则

- 新需求统一在 `04_workspace/prd/` 下新建一个专题目录
- 每个专题目录默认按 `analysis / prototype / prd` 三层维护
- 需求未澄清前，不直接进入正式 PRD
- PC 页面原型和后台 Demo 代码不放在这里，统一放到 `04_workspace/demos/pc/`
