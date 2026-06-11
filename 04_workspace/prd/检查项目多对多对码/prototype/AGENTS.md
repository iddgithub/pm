# 检查项目多对多对码 / prototype

本目录用于沉淀“检查项目多对多对码”专题下的后台原型和页面说明。

## 当前文件

- `01-原型说明.md` — 后台四页面原型范围说明
- `02-检查项目多对多对码后台原型.html` — 静态后台原型页
- `project-mapping-prototype.css` — 原型样式文件
- `03-cms院内检查项目对码高保真原型.html` — 基于线上 CMS `#/checkHospitalItem` 还原的独立高保真原型页
- `cms-hospital-item-replica.css` — 高保真原型样式
- `cms-hospital-item-replica.js` — 高保真原型交互逻辑
- `04-URL还原基线.md` — URL 来源、还原边界和样式 token 记录
- `05-cms平台项目列表高保真原型.html` — 基于线上 CMS `#/itemManage` 还原的独立高保真原型页
- `cms-item-manage-replica.css` — 平台项目列表专属补充样式
- `cms-item-manage-replica.js` — 平台项目列表交互逻辑
- `06-cms平台项目列表URL基线.md` — 平台项目列表的 URL 来源和详情态边界说明

## 维护规则

- 页面结构、字段布局、操作入口优先放在本目录
- 原型应围绕后台配置与异常处理闭环，不延伸到无关业务专题
- 新增页面时优先沿用现有编号顺序，并补充到 `01-原型说明.md`
- 针对线上 URL 做高保真还原时，补充 URL 基线说明，明确哪些交互是演示模拟、哪些是视觉还原
