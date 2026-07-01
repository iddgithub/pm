const doctors = [
  { id: "doctor-1", doctorName: "李医生", phone: "13800000001", clinicName: "华西互联网医院", department: "放射科", operatorName: "运营A", enabledStatus: "已启用" },
  { id: "doctor-2", doctorName: "周医生", phone: "13800000002", clinicName: "未来医学诊所", department: "心内科", operatorName: "运营B", enabledStatus: "已启用" },
  { id: "doctor-3", doctorName: "王医生", phone: "13800000003", clinicName: "海曙综合门诊", department: "神经内科", operatorName: "运营C", enabledStatus: "已启用" },
  { id: "doctor-4", doctorName: "赵医生", phone: "13800000004", clinicName: "鹿城骨科门诊", department: "骨科", operatorName: "运营D", enabledStatus: "已停用" },
  { id: "doctor-5", doctorName: "吴医生", phone: "13800000005", clinicName: "滨江康复诊所", department: "影像科", operatorName: "运营A", enabledStatus: "已启用" },
];

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function money(value) {
  return `¥${Number(value).toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function sum(values) {
  return values.reduce((total, value) => total + Number(value || 0), 0);
}

function average(values) {
  if (!values.length) {
    return 0;
  }
  return Math.round((sum(values) / values.length) * 10) / 10;
}

function stackCell(main, sub = "") {
  return `
    <div class="migration-cell">
      <strong>${escapeHtml(main)}</strong>
      ${sub ? `<span>${escapeHtml(sub)}</span>` : ""}
    </div>
  `;
}

function plainCell(value) {
  return escapeHtml(value ?? "-");
}

function tagCell(label, tone = "neutral") {
  return `<span class="migration-status migration-status--${escapeHtml(tone)}">${escapeHtml(label)}</span>`;
}

function linkActions(actions) {
  return `<div class="cell-action">${actions.map((action) => `
    <button class="btn-link ${action.danger ? "btn-link--danger" : ""}" type="button" data-row-action="${escapeHtml(action.action)}" data-row-id="${escapeHtml(action.rowId)}">
      ${escapeHtml(action.label)}
    </button>
  `).join("")}</div>`;
}

const rowsSeed = {
  "doctor-review": [
    { id: "dr-1", applicationNo: "SQ202606120001", applyTime: "2026-06-12 10:15", doctorType: "互联网医生", doctorName: "李医生", phone: "13800000001", clinicName: "华西互联网医院", region: "江西省南昌市红谷滩区", department: "放射科", auditStatus: "待审核", note: "执业证已上传，等待平台确认" },
    { id: "dr-2", applicationNo: "SQ202606110014", applyTime: "2026-06-11 16:32", doctorType: "线下医生", doctorName: "周医生", phone: "13800000002", clinicName: "未来医学诊所", region: "江西省南昌市西湖区", department: "心内科", auditStatus: "审核通过", note: "资质齐全，可直接签约" },
    { id: "dr-3", applicationNo: "SQ202606100028", applyTime: "2026-06-10 14:08", doctorType: "互联网医生", doctorName: "王医生", phone: "13800000003", clinicName: "海曙综合门诊", region: "江西省南昌市青山湖区", department: "神经内科", auditStatus: "审核驳回", note: "门头照缺失，已退回补充" },
    { id: "dr-4", applicationNo: "SQ202606090011", applyTime: "2026-06-09 09:46", doctorType: "互联网医生", doctorName: "赵医生", phone: "13800000004", clinicName: "鹿城骨科门诊", region: "江西省南昌市东湖区", department: "骨科", auditStatus: "待审核", note: "医生本人视频核验待完成" },
  ],
  "operator-management": [
    { id: "op-1", operatorNo: "YY202606010001", operatorName: "运营A", phone: "13600000001", location: "江西省南昌市红谷滩区", bindingDoctors: 24, enabledStatus: "已启用", createdAt: "2026-05-12", department: "放射科" },
    { id: "op-2", operatorNo: "YY202606010002", operatorName: "运营B", phone: "13600000002", location: "江西省南昌市西湖区", bindingDoctors: 18, enabledStatus: "已启用", createdAt: "2026-05-14", department: "心内科" },
    { id: "op-3", operatorNo: "YY202606010003", operatorName: "运营C", phone: "13600000003", location: "江西省南昌市青山湖区", bindingDoctors: 11, enabledStatus: "已停用", createdAt: "2026-05-16", department: "神经内科" },
    { id: "op-4", operatorNo: "YY202606010004", operatorName: "运营D", phone: "13600000004", location: "江西省南昌市高新区", bindingDoctors: 16, enabledStatus: "已启用", createdAt: "2026-05-18", department: "骨科" },
  ],
  "doctor-management": [
    { id: "dm-1", doctorNo: "YS202606010001", doctorType: "互联网医生", doctorName: "李医生", phone: "13800000001", hospitalName: "华西互联网医院", location: "江西省南昌市红谷滩区红角洲", enabledStatus: "已启用", joinedAt: "2026-05-20" },
    { id: "dm-2", doctorNo: "YS202606010002", doctorType: "线下医生", doctorName: "周医生", phone: "13800000002", hospitalName: "未来医学诊所", location: "江西省南昌市西湖区云锦路", enabledStatus: "已停用", joinedAt: "2026-05-19" },
    { id: "dm-3", doctorNo: "YS202606010003", doctorType: "互联网医生", doctorName: "王医生", phone: "13800000003", hospitalName: "海曙综合门诊", location: "江西省南昌市青山湖区艾溪湖", enabledStatus: "已启用", joinedAt: "2026-05-18" },
    { id: "dm-4", doctorNo: "YS202606010004", doctorType: "互联网医生", doctorName: "赵医生", phone: "13800000004", hospitalName: "鹿城骨科门诊", location: "江西省南昌市东湖区南京西路", enabledStatus: "已启用", joinedAt: "2026-05-15" },
  ],
  binding: [
    { id: "bd-1", doctorName: "李医生", operatorName: "运营A", platformRate: 15, doctorRate: 9, operatorRate: 6, effectiveAt: "2026-06-01", expireAt: "2026-12-01", status: "生效中", updatedBy: "平台管理员" },
    { id: "bd-2", doctorName: "周医生", operatorName: "运营B", platformRate: 15, doctorRate: 8, operatorRate: 7, effectiveAt: "2026-06-01", expireAt: "2026-12-01", status: "生效中", updatedBy: "平台管理员" },
    { id: "bd-3", doctorName: "王医生", operatorName: "运营C", platformRate: 15, doctorRate: 10, operatorRate: 5, effectiveAt: "2026-05-15", expireAt: "2026-11-15", status: "即将失效", updatedBy: "运营主管" },
  ],
  "order-association": [
    { id: "oa-1", orderNo: "202606121028510001", openHospital: "华西互联网医院", associatedDoctorName: "", projectName: "颈椎CT平扫", projectCode: "62037", patientName: "贾斌", phone: "15269151620", paymentStatus: "已缴费", paymentTime: "2026-06-12 10:46", createdAt: "2026-06-12 10:28", orderSource: "运营平台派单" },
    { id: "oa-2", orderNo: "202606120908510002", openHospital: "一脉运营平台", associatedDoctorName: "周医生", projectName: "颅脑CT平扫", projectCode: "62001", patientName: "熊铃朝", phone: "15881776941", paymentStatus: "待缴费", paymentTime: "-", createdAt: "2026-06-12 09:08", orderSource: "医院自然流量" },
    { id: "oa-3", orderNo: "202606111846510003", openHospital: "杭州未来医学诊所", associatedDoctorName: "李医生", projectName: "胸部CT筛查", projectCode: "62088", patientName: "刘秀兰", phone: "15260086324", paymentStatus: "已缴费", paymentTime: "2026-06-11 19:05", createdAt: "2026-06-11 18:46", orderSource: "医生转介绍" },
    { id: "oa-4", orderNo: "202606111532510004", openHospital: "海曙综合门诊", associatedDoctorName: "", projectName: "冠脉CTA", projectCode: "62116", patientName: "王秀梅", phone: "15260258960", paymentStatus: "已缴费", paymentTime: "2026-06-11 15:58", createdAt: "2026-06-11 15:32", orderSource: "患者复购" },
  ],
  "interpretation-assignment": [
    { id: "ia-1", reportNo: "BG202606120001", patientName: "患者1", patientPhone: "13700006001", projectName: "CT颅脑平扫", clinicName: "华西互联网医院", doctorName: "李医生", doctorPhone: "13800000001", serviceFee: 58, reportStatus: "待分配", reportTime: "-", createdAt: "2026-06-12 10:12" },
    { id: "ia-2", reportNo: "BG202606110002", patientName: "患者2", patientPhone: "13700006002", projectName: "肺部CT筛查", clinicName: "未来医学诊所", doctorName: "周医生", doctorPhone: "13800000002", serviceFee: 68, reportStatus: "未解读", reportTime: "2026-06-11 15:08", createdAt: "2026-06-11 14:50" },
    { id: "ia-3", reportNo: "BG202606100003", patientName: "患者3", patientPhone: "13700006003", projectName: "冠脉CTA", clinicName: "海曙综合门诊", doctorName: "王医生", doctorPhone: "13800000003", serviceFee: 88, reportStatus: "已解读", reportTime: "2026-06-10 18:20", createdAt: "2026-06-10 17:32" },
  ],
  "bonus-management": [
    { id: "bm-1", orderNo: "JD202606120001", patientName: "患者1", projectName: "CT颅脑平扫", payTime: "2026-06-12 10:55", reportTime: "2026-06-12 16:20", orderStatus: "已出报告", doctorBonus: 120, operatorBonus: 80, doctorName: "李医生", operatorName: "运营A" },
    { id: "bm-2", orderNo: "JD202606110002", patientName: "患者2", projectName: "肺部CT筛查", payTime: "2026-06-11 14:22", reportTime: "-", orderStatus: "已支付", doctorBonus: 98, operatorBonus: 66, doctorName: "周医生", operatorName: "运营B" },
    { id: "bm-3", orderNo: "JD202606100003", patientName: "患者3", projectName: "冠脉CTA", payTime: "2026-06-10 13:16", reportTime: "2026-06-10 18:05", orderStatus: "已出报告", doctorBonus: 160, operatorBonus: 112, doctorName: "王医生", operatorName: "运营C" },
  ],
  withdrawal: [
    { id: "wd-1", applyTime: "2026-06-12 09:20", doctorName: "李医生", amount: 1200, availableAmount: 3200, status: "待审核", reviewer: "-", processedAt: "-", rejectReason: "-" },
    { id: "wd-2", applyTime: "2026-06-11 15:46", doctorName: "周医生", amount: 980, availableAmount: 2800, status: "审核通过", reviewer: "王主管", processedAt: "2026-06-11 18:10", rejectReason: "-" },
    { id: "wd-3", applyTime: "2026-06-10 17:05", doctorName: "王医生", amount: 860, availableAmount: 2400, status: "已打款", reviewer: "李主管", processedAt: "2026-06-10 19:12", rejectReason: "-" },
  ],
  dashboard: [
    { id: "db-1", patientName: "患者1", appointmentTime: "2026-06-12 09:00-10:00", deliveryCenter: "南昌红谷滩影像交付中心", projectName: "颈椎CT平扫", projectAmount: 399, doctorName: "李医生", clinicDoctorName: "周医生", clinicName: "华西互联网医院", operatorName: "运营A" },
    { id: "db-2", patientName: "患者2", appointmentTime: "2026-06-12 10:30-11:30", deliveryCenter: "南昌西湖影像交付中心", projectName: "肺部CT筛查", projectAmount: 299, doctorName: "周医生", clinicDoctorName: "李医生", clinicName: "未来医学诊所", operatorName: "运营B" },
    { id: "db-3", patientName: "患者3", appointmentTime: "2026-06-12 14:00-15:00", deliveryCenter: "南昌青山湖影像交付中心", projectName: "冠脉CTA", projectAmount: 699, doctorName: "王医生", clinicDoctorName: "吴医生", clinicName: "海曙综合门诊", operatorName: "运营C" },
  ],
  "ai-report-upload": [
    { id: "ai-1", orderNo: "AI202606120001", openHospital: "华西互联网医院", projectName: "颈椎CT平扫", projectCode: "62037", amount: 148.55, patientName: "贾斌", phone: "15269151620", paymentStatus: "已支付", aiReportStatus: "待上传", updatedAt: "2026-06-12 10:12" },
    { id: "ai-2", orderNo: "AI202606110002", openHospital: "未来医学诊所", projectName: "肺部CT筛查", projectCode: "62088", amount: 168, patientName: "刘秀兰", phone: "15260086324", paymentStatus: "已支付", aiReportStatus: "已上传待发布", updatedAt: "2026-06-11 18:32" },
    { id: "ai-3", orderNo: "AI202606100003", openHospital: "海曙综合门诊", projectName: "冠脉CTA", projectCode: "62116", amount: 399, patientName: "王秀梅", phone: "15260258960", paymentStatus: "已支付", aiReportStatus: "已发布", updatedAt: "2026-06-10 19:10" },
  ],
  "multi-code-standard": [
    { id: "mcg-1", groupNo: "GROUP-CT-001", inspectionType: "CT", platformItems: "CT颅脑平扫 / CT颅脑增强", deliveryItems: "院内颅脑CT / 院内增强收费项", deviceBinding: "CT_64排", chargeMode: "组合价", platformAmount: 428, status: "启用", updatedAt: "2026-06-12 09:20" },
    { id: "mcg-2", groupNo: "GROUP-MR-003", inspectionType: "MR", platformItems: "腰椎MR平扫", deliveryItems: "院内腰椎MR", deviceBinding: "MR_3.0T", chargeMode: "单项目", platformAmount: 258, status: "启用", updatedAt: "2026-06-11 15:16" },
    { id: "mcg-3", groupNo: "GROUP-DR-006", inspectionType: "DR", platformItems: "胸片正位", deliveryItems: "院内胸片", deviceBinding: "DR_无", chargeMode: "组合价", platformAmount: 86, status: "停用", updatedAt: "2026-06-09 18:10" },
  ],
  "multi-code-upstream": [
    { id: "mcs-1", code: "62037", name: "颈椎CT平扫", modality: "CT", bodyPart: "颈椎", method: "平扫", upstreamRefs: 16, deliveryRefs: 12, status: "启用", updatedAt: "2026-06-12 10:08" },
    { id: "mcs-2", code: "62088", name: "胸部CT筛查", modality: "CT", bodyPart: "胸部", method: "平扫", upstreamRefs: 21, deliveryRefs: 18, status: "待确认", updatedAt: "2026-06-11 19:00" },
    { id: "mcs-3", code: "62116", name: "冠脉CTA", modality: "CT", bodyPart: "心脏", method: "增强", upstreamRefs: 9, deliveryRefs: 7, status: "启用", updatedAt: "2026-06-10 16:36" },
  ],
  "multi-code-delivery": [
    { id: "mcd-1", centerName: "南昌红谷滩影像交付中心", itemCode: "JN62037", itemName: "院内颈椎CT平扫", itemType: "单项目", standardItems: "颈椎CT平扫", priority: "P1", dispatchRule: "按设备能力优先分配 CT_64排", status: "启用", updatedAt: "2026-06-12 11:12" },
    { id: "mcd-2", centerName: "南昌西湖影像交付中心", itemCode: "JN62088", itemName: "院内胸部CT套餐", itemType: "组合套餐", standardItems: "胸部CT筛查 / 肺结节三维重建", priority: "P1", dispatchRule: "套餐明细完整时整包下发", status: "启用", updatedAt: "2026-06-11 15:48" },
    { id: "mcd-3", centerName: "南昌青山湖影像交付中心", itemCode: "JN63012", itemName: "院内腰椎MR", itemType: "单项目", standardItems: "腰椎MR平扫", priority: "P2", dispatchRule: "缺少 3.0T 设备时降级到 1.5T", status: "停用", updatedAt: "2026-06-09 17:05" },
  ],
  "multi-code-logs": [
    { id: "mcl-1", orderNo: "LOG202606120001", upstreamInstitution: "华西互联网医院", originalProject: "颈椎CT平扫+三维重建", standardItems: "颈椎CT平扫 / 三维重建", deliveryCenter: "南昌红谷滩影像交付中心", matchStatus: "匹配成功", actualItems: "院内颈椎CT / 院内三维重建", exceptionType: "-", processingStatus: "已完成" },
    { id: "mcl-2", orderNo: "LOG202606110002", upstreamInstitution: "未来医学诊所", originalProject: "胸部CT筛查", standardItems: "胸部CT筛查", deliveryCenter: "南昌西湖影像交付中心", matchStatus: "异常待处理", actualItems: "-", exceptionType: "缺少执行项目", processingStatus: "待人工补配" },
    { id: "mcl-3", orderNo: "LOG202606100003", upstreamInstitution: "海曙综合门诊", originalProject: "冠脉CTA", standardItems: "冠脉CTA", deliveryCenter: "南昌青山湖影像交付中心", matchStatus: "已补配待重试", actualItems: "院内冠脉CTA", exceptionType: "设备能力冲突", processingStatus: "待系统重试" },
  ],
  "activity-management": [
    { id: "act-1", activityName: "端午 CT 早筛专场", channelName: "公众号", institutionCount: 12, projectCount: 8, activePeriod: "2026-06-08 至 2026-06-18", status: "进行中", updatedAt: "2026-06-12 09:16" },
    { id: "act-2", activityName: "618 心脑血管筛查周", channelName: "小程序", institutionCount: 20, projectCount: 12, activePeriod: "2026-06-15 至 2026-06-22", status: "待开始", updatedAt: "2026-06-11 16:42" },
    { id: "act-3", activityName: "暑期骨健康联合活动", channelName: "线下地推", institutionCount: 6, projectCount: 5, activePeriod: "2026-07-01 至 2026-07-30", status: "草稿", updatedAt: "2026-06-10 14:08" },
  ],
};

const refs = {
  pageKicker: document.getElementById("pageKicker"),
  pageTitle: document.getElementById("pageTitle"),
  pageDesc: document.getElementById("pageDesc"),
  pageNote: document.getElementById("pageNote"),
  metricsGrid: document.getElementById("metricsGrid"),
  filtersBar: document.getElementById("filtersBar"),
  actionsBar: document.getElementById("actionsBar"),
  highlightBanner: document.getElementById("highlightBanner"),
  moduleTable: document.getElementById("moduleTable"),
  tableHeadRow: document.getElementById("tableHeadRow"),
  tableBody: document.getElementById("tableBody"),
  recordText: document.getElementById("recordText"),
  footerNote: document.getElementById("footerNote"),
  detailModal: document.getElementById("detailModal"),
  detailModalKicker: document.getElementById("detailModalKicker"),
  detailModalTitle: document.getElementById("detailModalTitle"),
  detailModalSummary: document.getElementById("detailModalSummary"),
  detailModalGrid: document.getElementById("detailModalGrid"),
  detailModalActions: document.getElementById("detailModalActions"),
  closeDetailButton: document.getElementById("closeDetailButton"),
  associateModal: document.getElementById("associateModal"),
  associateModalTitle: document.getElementById("associateModalTitle"),
  associateKeywordInput: document.getElementById("associateKeywordInput"),
  associateOrderNo: document.getElementById("associateOrderNo"),
  associateOrderProject: document.getElementById("associateOrderProject"),
  associateDoctorGrid: document.getElementById("associateDoctorGrid"),
  closeAssociateButton: document.getElementById("closeAssociateButton"),
  cancelAssociateButton: document.getElementById("cancelAssociateButton"),
  confirmAssociateButton: document.getElementById("confirmAssociateButton"),
  qrModal: document.getElementById("qrModal"),
  qrModalTitle: document.getElementById("qrModalTitle"),
  qrModalSummary: document.getElementById("qrModalSummary"),
  closeQrButton: document.getElementById("closeQrButton"),
  downloadQrButton: document.getElementById("downloadQrButton"),
  toastStack: document.getElementById("toastStack"),
};

function getActiveViewKey() {
  const key = window.location.hash.replace(/^#/, "");
  return viewConfigs[key] ? key : "doctor-review";
}

function statusTone(label) {
  if (["已启用", "生效中", "启用", "已解读", "已缴费", "已支付", "已发布", "已打款", "进行中", "匹配成功", "审核通过"].includes(label)) {
    return "success";
  }
  if (["待审核", "待分配", "待上传", "已上传待发布", "待确认", "待开始", "即将失效", "待缴费"].includes(label)) {
    return "warning";
  }
  if (["审核驳回", "已驳回", "异常待处理"].includes(label)) {
    return "danger";
  }
  if (["已替换", "已补配待重试", "已支付", "已结束"].includes(label)) {
    return "info";
  }
  return "neutral";
}

const viewConfigs = {
  "doctor-review": {
    group: "合规开单",
    title: "医生审核",
    desc: "迁移旧后台的医生资质审核台，保留申请筛查、资料查看与审核动作，用新 CMS 的卡片 + 白底表格样式统一承载。",
    note: "迁移说明：审核字段、审核状态和结果动作保持原有业务语义，只统一视觉结构与交互密度。",
    highlight: "保留 <strong>医生类型 / 审核状态 / 医生搜索</strong> 三类筛选，并延续 <strong>通过 / 驳回</strong> 的审核闭环。",
    filters: [
      { key: "doctorType", label: "医生类型", type: "select", options: ["全部", "互联网医生", "线下医生"], field: "doctorType" },
      { key: "auditStatus", label: "审核状态", type: "select", options: ["全部", "待审核", "审核通过", "审核驳回"], field: "auditStatus" },
      { key: "keyword", label: "医生搜索", type: "keyword", placeholder: "医生姓名 / 手机号 / 申请单号", fields: ["doctorName", "phone", "applicationNo"] },
    ],
    metrics(rows) {
      return [
        { label: "申请总数", value: `${rows.length}条`, note: "本页承接签约医生审核流转", tone: "good" },
        { label: "待审核", value: `${rows.filter((item) => item.auditStatus === "待审核").length}条`, note: "需优先处理资质待确认申请", tone: "warn" },
        { label: "已通过", value: `${rows.filter((item) => item.auditStatus === "审核通过").length}条`, note: "通过后自动进入医生管理", tone: "good" },
      ];
    },
    columns: [
      { label: "申请单号 / 时间", width: 180, render: (row) => stackCell(row.applicationNo, row.applyTime) },
      { label: "医生信息", width: 170, render: (row) => stackCell(row.doctorName, `${row.doctorType} · ${row.phone}`) },
      { label: "机构名称", width: 180, render: (row) => stackCell(row.clinicName, `${row.department} · ${row.region}`) },
      { label: "审核状态", width: 110, render: (row) => tagCell(row.auditStatus, statusTone(row.auditStatus)) },
      { label: "审核备注", width: 240, render: (row) => plainCell(row.note) },
      { label: "操作", width: 100, render: (row) => linkActions([{ label: "审核", action: "open-detail", rowId: row.id }]) },
    ],
    detailTitle: "申请资料详情",
    detailSummary: (row) => `当前审核对象为 <strong>${escapeHtml(row.doctorName)}</strong>，提交机构 <strong>${escapeHtml(row.clinicName)}</strong>。`,
    detailFields: [
      ["申请单号", "applicationNo"],
      ["申请时间", "applyTime"],
      ["医生类型", "doctorType"],
      ["医生姓名", "doctorName"],
      ["手机号", "phone"],
      ["医院名称", "clinicName"],
      ["所在位置", "region"],
      ["科室", "department"],
      ["审核备注", "note"],
      ["当前状态", "auditStatus"],
    ],
    detailActions: [
      { label: "审核驳回", action: "reject-review", tone: "ghost" },
      { label: "审核通过", action: "approve-review", tone: "primary" },
    ],
  },
  "operator-management": {
    group: "合规开单",
    title: "运营管理",
    desc: "把旧后台运营人员管理列表迁入新平台，继续保留绑定医生数、启停状态和人员明细。",
    note: "迁移说明：保留原列表核心字段，把启停与人员详情沉到统一弹窗内处理。",
    highlight: "保留 <strong>运营编号、位置、绑定医生数、启用状态</strong>，方便在新 CMS 中衔接区域运营管理。",
    filters: [
      { key: "enabledStatus", label: "启用状态", type: "select", options: ["全部", "已启用", "已停用"], field: "enabledStatus" },
      { key: "keyword", label: "运营搜索", type: "keyword", placeholder: "运营姓名 / 手机号 / 运营编号", fields: ["operatorName", "phone", "operatorNo"] },
    ],
    metrics(rows) {
      return [
        { label: "运营人员总数", value: `${rows.length}人`, note: "承接旧后台运营人员名册", tone: "good" },
        { label: "已启用", value: `${rows.filter((item) => item.enabledStatus === "已启用").length}人`, note: "可继续执行绑定与跟进任务", tone: "good" },
        { label: "已停用", value: `${rows.filter((item) => item.enabledStatus === "已停用").length}人`, note: "停用成员不会继续接单", tone: "warn" },
      ];
    },
    columns: [
      { label: "运营编号", width: 160, render: (row) => stackCell(row.operatorNo, row.createdAt) },
      { label: "运营信息", width: 160, render: (row) => stackCell(row.operatorName, `${row.phone} · ${row.department}`) },
      { label: "所在位置", width: 220, render: (row) => plainCell(row.location) },
      { label: "绑定医生数", width: 110, render: (row) => plainCell(`${row.bindingDoctors}人`) },
      { label: "启用状态", width: 110, render: (row) => tagCell(row.enabledStatus, statusTone(row.enabledStatus)) },
      { label: "操作", width: 110, render: (row) => linkActions([{ label: "详情", action: "open-detail", rowId: row.id }]) },
    ],
    detailTitle: "运营资料详情",
    detailSummary: (row) => `运营人员 <strong>${escapeHtml(row.operatorName)}</strong> 当前绑定 <strong>${escapeHtml(row.bindingDoctors)} 位医生</strong>。`,
    detailFields: [
      ["运营编号", "operatorNo"],
      ["运营姓名", "operatorName"],
      ["手机号", "phone"],
      ["负责科室", "department"],
      ["所在位置", "location"],
      ["启用状态", "enabledStatus"],
      ["录入时间", "createdAt"],
    ],
    detailActions: [{ label: "切换启停", action: "toggle-operator", tone: "primary" }],
  },
  "doctor-management": {
    group: "合规开单",
    title: "医生管理",
    desc: "沿用旧后台的医生目录、启停控制和二维码下载能力，在新平台内统一成同一套列表风格。",
    note: "迁移说明：医生名册、二维码预览与启停状态完整保留，页面样式统一为新 CMS 的绿色后台风格。",
    highlight: "保留了你之前确认过的 <strong>下载二维码</strong> 入口，并迁到新平台弹窗体系里。",
    filters: [
      { key: "doctorType", label: "医生类型", type: "select", options: ["全部", "互联网医生", "线下医生"], field: "doctorType" },
      { key: "enabledStatus", label: "启用状态", type: "select", options: ["全部", "已启用", "已停用"], field: "enabledStatus" },
      { key: "keyword", label: "医生搜索", type: "keyword", placeholder: "医生姓名 / 手机号 / 医生编号", fields: ["doctorName", "phone", "doctorNo"] },
    ],
    metrics(rows) {
      return [
        { label: "医生总数", value: `${rows.length}人`, note: "平台签约医生完整名册", tone: "good" },
        { label: "已启用", value: `${rows.filter((item) => item.enabledStatus === "已启用").length}人`, note: "已启用医生可正常接单", tone: "good" },
        { label: "已停用", value: `${rows.filter((item) => item.enabledStatus === "已停用").length}人`, note: "停用医生二维码自动失效", tone: "warn" },
      ];
    },
    columns: [
      { label: "医生编号", width: 160, render: (row) => stackCell(row.doctorNo, row.joinedAt) },
      { label: "医生信息", width: 160, render: (row) => stackCell(row.doctorName, `${row.doctorType} · ${row.phone}`) },
      { label: "医院名称", width: 180, render: (row) => plainCell(row.hospitalName) },
      { label: "所在位置", width: 220, render: (row) => plainCell(row.location) },
      { label: "启用状态", width: 110, render: (row) => tagCell(row.enabledStatus, statusTone(row.enabledStatus)) },
      { label: "操作", width: 180, render: (row) => linkActions([{ label: "详情", action: "open-detail", rowId: row.id }, { label: "下载二维码", action: "open-qr", rowId: row.id }]) },
    ],
    detailTitle: "医生资料详情",
    detailSummary: (row) => `医生 <strong>${escapeHtml(row.doctorName)}</strong> 当前归属 <strong>${escapeHtml(row.hospitalName)}</strong>。`,
    detailFields: [
      ["医生编号", "doctorNo"],
      ["医生类型", "doctorType"],
      ["医生姓名", "doctorName"],
      ["手机号", "phone"],
      ["医院名称", "hospitalName"],
      ["所在位置", "location"],
      ["启用状态", "enabledStatus"],
      ["入驻时间", "joinedAt"],
    ],
    detailActions: [{ label: "切换启停", action: "toggle-doctor", tone: "primary" }],
  },
  binding: {
    group: "合规开单",
    title: "绑定分佣",
    desc: "绑定关系和分佣配置迁移到新平台后，仍按医生、运营、平台三方比例进行维护。",
    note: "迁移说明：保留比例配置含义和生效周期，页面改为统一的比例概览 + 明细表格。",
    highlight: "继续保留 <strong>平台总比例 / 医生分佣 / 运营提成</strong> 三段配置，方便后续与订单分账联动。",
    filters: [
      { key: "status", label: "配置状态", type: "select", options: ["全部", "生效中", "即将失效"], field: "status" },
      { key: "keyword", label: "绑定搜索", type: "keyword", placeholder: "医生姓名 / 运营姓名", fields: ["doctorName", "operatorName"] },
    ],
    metrics(rows) {
      return [
        { label: "生效中配置", value: `${rows.filter((item) => item.status === "生效中").length}条`, note: "当前继续参与订单结算", tone: "good" },
        { label: "平均医生分佣", value: `${average(rows.map((item) => item.doctorRate))}%`, note: "按当前配置计算均值", tone: "warn" },
        { label: "平均运营提成", value: `${average(rows.map((item) => item.operatorRate))}%`, note: "运营侧平均提成比例", tone: "good" },
      ];
    },
    columns: [
      { label: "医生 / 运营", width: 180, render: (row) => stackCell(row.doctorName, row.operatorName) },
      { label: "平台给运营总比例", width: 150, render: (row) => plainCell(`${row.platformRate}%`) },
      { label: "医生分佣比例", width: 130, render: (row) => plainCell(`${row.doctorRate}%`) },
      { label: "运营实际提成比例", width: 150, render: (row) => plainCell(`${row.operatorRate}%`) },
      { label: "生效周期", width: 180, render: (row) => stackCell(row.effectiveAt, `失效：${row.expireAt}`) },
      { label: "状态", width: 110, render: (row) => tagCell(row.status, statusTone(row.status)) },
      { label: "操作", width: 100, render: (row) => linkActions([{ label: "详情", action: "open-detail", rowId: row.id }]) },
    ],
    detailTitle: "分佣配置详情",
    detailSummary: (row) => `当前配置作用于医生 <strong>${escapeHtml(row.doctorName)}</strong> 与运营 <strong>${escapeHtml(row.operatorName)}</strong>。`,
    detailFields: [
      ["医生姓名", "doctorName"],
      ["运营姓名", "operatorName"],
      ["平台给运营总比例", (row) => `${row.platformRate}%`],
      ["医生分佣比例", (row) => `${row.doctorRate}%`],
      ["运营实际提成比例", (row) => `${row.operatorRate}%`],
      ["生效时间", "effectiveAt"],
      ["失效时间", "expireAt"],
      ["最近修改人", "updatedBy"],
      ["当前状态", "status"],
    ],
    detailActions: [{ label: "保存方案", action: "save-config", tone: "primary" }],
  },
  "order-association": {
    group: "合规开单",
    title: "订单关联",
    desc: "订单关联从旧后台迁入新平台后，仍保留订单来源、关联医生和按医生搜索关联的工作方式。",
    note: "迁移说明：把你确认过的“订单来源改为关联医生、关联按钮弹出医生列表、支持搜索”完整带到新样式里。",
    highlight: "保留 <strong>关联医生</strong> 字段和 <strong>关联</strong> 动作，点击后会在新后台弹出医生搜索弹窗完成绑定。",
    filters: [
      { key: "paymentStatus", label: "支付状态", type: "select", options: ["全部", "已缴费", "待缴费"], field: "paymentStatus" },
      { key: "keyword", label: "订单搜索", type: "keyword", placeholder: "订单号 / 患者 / 开单机构", fields: ["orderNo", "patientName", "openHospital"] },
    ],
    metrics(rows) {
      return [
        { label: "订单总数", value: `${rows.length}单`, note: "待核对来源与归属关系", tone: "good" },
        { label: "已关联医生", value: `${rows.filter((item) => item.associatedDoctorName).length}单`, note: "已完成医生归属绑定", tone: "good" },
        { label: "待关联", value: `${rows.filter((item) => !item.associatedDoctorName).length}单`, note: "需要运营继续补齐归属", tone: "warn" },
      ];
    },
    columns: [
      { label: "订单号 / 时间", width: 190, render: (row) => stackCell(row.orderNo, row.createdAt) },
      { label: "开单机构", width: 180, render: (row) => stackCell(row.openHospital, `来源：${row.orderSource}`) },
      { label: "关联医生", width: 150, render: (row) => stackCell(row.associatedDoctorName || "待关联", row.associatedDoctorName ? "已绑定到管理医生" : "点击关联补齐归属") },
      { label: "检查项目", width: 180, render: (row) => stackCell(row.projectName, `项目编码：${row.projectCode}`) },
      { label: "患者信息", width: 150, render: (row) => stackCell(row.patientName, row.phone) },
      { label: "支付状态", width: 110, render: (row) => tagCell(row.paymentStatus, statusTone(row.paymentStatus)) },
      { label: "支付时间", width: 160, render: (row) => plainCell(row.paymentTime) },
      { label: "操作", width: 130, render: (row) => linkActions([{ label: "详情", action: "open-detail", rowId: row.id }, { label: "关联", action: "open-associate", rowId: row.id }]) },
    ],
    detailTitle: "订单关联详情",
    detailSummary: (row) => `订单 <strong>${escapeHtml(row.orderNo)}</strong> 当前开单机构为 <strong>${escapeHtml(row.openHospital)}</strong>。`,
    detailFields: [
      ["订单号", "orderNo"],
      ["开单机构", "openHospital"],
      ["订单来源", "orderSource"],
      ["关联医生", (row) => row.associatedDoctorName || "待关联"],
      ["检查项目", "projectName"],
      ["项目编码", "projectCode"],
      ["患者姓名", "patientName"],
      ["患者手机号", "phone"],
      ["支付状态", "paymentStatus"],
      ["支付时间", "paymentTime"],
      ["创建时间", "createdAt"],
    ],
    detailActions: [{ label: "重新关联医生", action: "open-associate-from-detail", tone: "primary" }],
  },
  "interpretation-assignment": {
    group: "合规开单",
    title: "解读分配",
    desc: "迁移旧后台报告解读分配页，保留待分配 / 未解读 / 已解读三类状态与解读服务费视图。",
    note: "迁移说明：保留报告分配逻辑字段，统一为新 CMS 的筛选卡片与详情弹窗形式。",
    highlight: "继续保留 <strong>待分配、未解读、已解读</strong> 的状态分层，方便接续分配链路。",
    filters: [
      { key: "reportStatus", label: "报告状态", type: "select", options: ["全部", "待分配", "未解读", "已解读"], field: "reportStatus" },
      { key: "keyword", label: "报告搜索", type: "keyword", placeholder: "报告单号 / 患者姓名 / 检查项目", fields: ["reportNo", "patientName", "projectName"] },
    ],
    metrics(rows) {
      return [
        { label: "报告总数", value: `${rows.length}份`, note: "当前纳入解读流转池", tone: "good" },
        { label: "待分配", value: `${rows.filter((item) => item.reportStatus === "待分配").length}份`, note: "优先分配给可用医生", tone: "warn" },
        { label: "已解读", value: `${rows.filter((item) => item.reportStatus === "已解读").length}份`, note: "可继续进入报告交付环节", tone: "good" },
      ];
    },
    columns: [
      { label: "报告单号", width: 170, render: (row) => stackCell(row.reportNo, row.createdAt) },
      { label: "患者", width: 150, render: (row) => stackCell(row.patientName, row.patientPhone) },
      { label: "检查项目", width: 160, render: (row) => plainCell(row.projectName) },
      { label: "机构 / 医生", width: 190, render: (row) => stackCell(row.clinicName, `${row.doctorName} · ${row.doctorPhone}`) },
      { label: "解读服务费", width: 110, render: (row) => money(row.serviceFee) },
      { label: "报告状态", width: 110, render: (row) => tagCell(row.reportStatus, statusTone(row.reportStatus)) },
      { label: "出报告时间", width: 160, render: (row) => plainCell(row.reportTime) },
      { label: "操作", width: 100, render: (row) => linkActions([{ label: "分配", action: "open-detail", rowId: row.id }]) },
    ],
    detailTitle: "报告分配详情",
    detailSummary: (row) => `当前报告由机构 <strong>${escapeHtml(row.clinicName)}</strong> 发起，可在新平台继续执行分配动作。`,
    detailFields: [
      ["报告单号", "reportNo"],
      ["患者姓名", "patientName"],
      ["患者手机号", "patientPhone"],
      ["检查项目", "projectName"],
      ["机构名称", "clinicName"],
      ["分配医生", "doctorName"],
      ["医生手机号", "doctorPhone"],
      ["解读服务费", (row) => money(row.serviceFee)],
      ["报告状态", "reportStatus"],
      ["出报告时间", "reportTime"],
    ],
    detailActions: [{ label: "确认分配", action: "assign-report", tone: "primary" }],
  },
  "bonus-management": {
    group: "合规开单",
    title: "业务管理",
    desc: "迁移旧后台的订单业务台，保留订单状态、医生提成、运营提成与明细查看。",
    note: "迁移说明：业务明细字段不变，统一换成新 CMS 的列表密度和详情弹窗。",
    highlight: "继续承接 <strong>订单状态、医生提成、运营提成</strong> 三类经营核心数据。",
    filters: [
      { key: "orderStatus", label: "订单状态", type: "select", options: ["全部", "已支付", "已出报告"], field: "orderStatus" },
      { key: "keyword", label: "订单搜索", type: "keyword", placeholder: "订单号 / 患者 / 检查项目", fields: ["orderNo", "patientName", "projectName"] },
    ],
    metrics(rows) {
      return [
        { label: "业务订单数", value: `${rows.length}单`, note: "当前经营订单总量", tone: "good" },
        { label: "医生提成合计", value: money(sum(rows.map((item) => item.doctorBonus))), note: "按当前业务单测算", tone: "warn" },
        { label: "运营提成合计", value: money(sum(rows.map((item) => item.operatorBonus))), note: "运营侧累计收益", tone: "good" },
      ];
    },
    columns: [
      { label: "订单号", width: 180, render: (row) => stackCell(row.orderNo, row.payTime) },
      { label: "患者 / 项目", width: 170, render: (row) => stackCell(row.patientName, row.projectName) },
      { label: "医生 / 运营", width: 150, render: (row) => stackCell(row.doctorName, row.operatorName) },
      { label: "订单状态", width: 110, render: (row) => tagCell(row.orderStatus, statusTone(row.orderStatus)) },
      { label: "医生提成", width: 110, render: (row) => money(row.doctorBonus) },
      { label: "运营提成", width: 110, render: (row) => money(row.operatorBonus) },
      { label: "出报告时间", width: 160, render: (row) => plainCell(row.reportTime) },
      { label: "操作", width: 100, render: (row) => linkActions([{ label: "详情", action: "open-detail", rowId: row.id }]) },
    ],
    detailTitle: "业务订单详情",
    detailSummary: (row) => `订单 <strong>${escapeHtml(row.orderNo)}</strong> 已迁入新后台经营视图，可继续查看收益拆分。`,
    detailFields: [
      ["订单号", "orderNo"],
      ["患者姓名", "patientName"],
      ["检查项目", "projectName"],
      ["支付时间", "payTime"],
      ["出报告时间", "reportTime"],
      ["订单状态", "orderStatus"],
      ["医生姓名", "doctorName"],
      ["运营姓名", "operatorName"],
      ["医生提成", (row) => money(row.doctorBonus)],
      ["运营提成", (row) => money(row.operatorBonus)],
    ],
    detailActions: [{ label: "关闭", action: "close-detail", tone: "ghost" }],
  },
  withdrawal: {
    group: "合规开单",
    title: "提现审核",
    desc: "提现审核列表迁移到新平台后，继续承接待审核、审核通过、已打款三类提现流转。",
    note: "迁移说明：保留提现审核明细与驳回原因，只把操作入口统一到新 CMS 的审核弹窗。",
    highlight: "继续保留 <strong>可提现余额、审核状态、处理时间</strong>，支持在统一弹窗里完成审批。",
    filters: [
      { key: "status", label: "提现状态", type: "select", options: ["全部", "待审核", "审核通过", "已打款"], field: "status" },
      { key: "keyword", label: "医生搜索", type: "keyword", placeholder: "医生姓名", fields: ["doctorName"] },
    ],
    metrics(rows) {
      return [
        { label: "提现申请数", value: `${rows.length}笔`, note: "当前已进入审核池", tone: "good" },
        { label: "待审核", value: `${rows.filter((item) => item.status === "待审核").length}笔`, note: "需要财务尽快处理", tone: "warn" },
        { label: "已打款", value: `${rows.filter((item) => item.status === "已打款").length}笔`, note: "已完成结算闭环", tone: "good" },
      ];
    },
    columns: [
      { label: "申请时间", width: 160, render: (row) => plainCell(row.applyTime) },
      { label: "医生姓名", width: 120, render: (row) => plainCell(row.doctorName) },
      { label: "提现金额", width: 110, render: (row) => money(row.amount) },
      { label: "可提现余额", width: 120, render: (row) => money(row.availableAmount) },
      { label: "审核状态", width: 110, render: (row) => tagCell(row.status, statusTone(row.status)) },
      { label: "审核人", width: 110, render: (row) => plainCell(row.reviewer) },
      { label: "处理时间", width: 160, render: (row) => plainCell(row.processedAt) },
      { label: "操作", width: 100, render: (row) => linkActions([{ label: "审核", action: "open-detail", rowId: row.id }]) },
    ],
    detailTitle: "提现申请详情",
    detailSummary: (row) => `当前提现申请来自 <strong>${escapeHtml(row.doctorName)}</strong>，可在新平台内继续执行审批。`,
    detailFields: [
      ["申请时间", "applyTime"],
      ["医生姓名", "doctorName"],
      ["提现金额", (row) => money(row.amount)],
      ["可提现余额", (row) => money(row.availableAmount)],
      ["审核状态", "status"],
      ["审核人", "reviewer"],
      ["处理时间", "processedAt"],
      ["驳回原因", "rejectReason"],
    ],
    detailActions: [
      { label: "驳回申请", action: "reject-withdraw", tone: "ghost" },
      { label: "审核通过", action: "approve-withdraw", tone: "primary" },
    ],
  },
  dashboard: {
    group: "合规开单",
    title: "业务总览",
    desc: "原业务总览模块统一迁入新平台，可继续查看订单、机构、医生与运营维度的综合经营表现。",
    note: "迁移说明：保留总览型指标和最新订单视图，把顶部 KPI 和表格统一成新 CMS 语言。",
    highlight: "继续保留 <strong>开单患者、交付中心、关联诊所医生、关联运营</strong> 等经营核心视角。",
    filters: [
      { key: "keyword", label: "订单搜索", type: "keyword", placeholder: "患者 / 项目 / 交付中心", fields: ["patientName", "projectName", "deliveryCenter"] },
    ],
    metrics() {
      return [
        { label: "全平台开单数", value: "1,256单", note: "按新平台经营周期汇总", tone: "good" },
        { label: "已支付订单数", value: "986单", note: "用于衡量支付转化效率", tone: "warn" },
        { label: "医生提成总金额", value: "¥186,500.00", note: "可继续下钻到业务管理页", tone: "good" },
      ];
    },
    columns: [
      { label: "患者", width: 100, render: (row) => plainCell(row.patientName) },
      { label: "预约日期时间段", width: 170, render: (row) => plainCell(row.appointmentTime) },
      { label: "交付中心", width: 200, render: (row) => plainCell(row.deliveryCenter) },
      { label: "影像检查项目", width: 140, render: (row) => plainCell(row.projectName) },
      { label: "项目金额", width: 120, render: (row) => money(row.projectAmount) },
      { label: "开单医生", width: 100, render: (row) => plainCell(row.doctorName) },
      { label: "关联诊所医生", width: 130, render: (row) => plainCell(row.clinicDoctorName) },
      { label: "关联诊所", width: 160, render: (row) => plainCell(row.clinicName) },
      { label: "关联运营", width: 110, render: (row) => plainCell(row.operatorName) },
      { label: "操作", width: 100, render: (row) => linkActions([{ label: "查看", action: "open-detail", rowId: row.id }]) },
    ],
    detailTitle: "经营订单快照",
    detailSummary: () => "经营订单快照聚焦交付链路与医生归属，方便在新后台统一分析经营表现。",
    detailFields: [
      ["患者", "patientName"],
      ["预约时间段", "appointmentTime"],
      ["交付中心", "deliveryCenter"],
      ["检查项目", "projectName"],
      ["项目金额", (row) => money(row.projectAmount)],
      ["开单医生", "doctorName"],
      ["关联诊所医生", "clinicDoctorName"],
      ["关联诊所", "clinicName"],
      ["关联运营", "operatorName"],
    ],
    detailActions: [{ label: "关闭", action: "close-detail", tone: "ghost" }],
  },
  "ai-report-upload": {
    group: "产品功能",
    title: "AI报告上传",
    desc: "AI 报告上传页已迁入新平台，继续保留订单维度上传、发布、替换与详情查看。",
    note: "迁移说明：保留 AI 报告上传状态与发布动作，统一成新 CMS 的表格 + 详情弹窗结构。",
    highlight: "保留 <strong>待上传、已上传待发布、已发布</strong> 三类状态，便于继续衔接 AI 报告工作流。",
    filters: [
      { key: "aiReportStatus", label: "上传状态", type: "select", options: ["全部", "待上传", "已上传待发布", "已发布"], field: "aiReportStatus" },
      { key: "keyword", label: "订单搜索", type: "keyword", placeholder: "订单号 / 患者 / 检查项目", fields: ["orderNo", "patientName", "projectName"] },
    ],
    metrics(rows) {
      return [
        { label: "待上传", value: `${rows.filter((item) => item.aiReportStatus === "待上传").length}单`, note: "待接入 AI 报告文件", tone: "warn" },
        { label: "已上传待发布", value: `${rows.filter((item) => item.aiReportStatus === "已上传待发布").length}单`, note: "需运营确认后发布", tone: "good" },
        { label: "已发布", value: `${rows.filter((item) => item.aiReportStatus === "已发布").length}单`, note: "已对外可见", tone: "good" },
      ];
    },
    columns: [
      { label: "订单号", width: 190, render: (row) => stackCell(row.orderNo, row.updatedAt) },
      { label: "开单医院", width: 180, render: (row) => plainCell(row.openHospital) },
      { label: "检查项目", width: 180, render: (row) => stackCell(row.projectName, `编码：${row.projectCode}`) },
      { label: "患者信息", width: 150, render: (row) => stackCell(row.patientName, row.phone) },
      { label: "支付状态", width: 110, render: (row) => tagCell(row.paymentStatus, statusTone(row.paymentStatus)) },
      { label: "AI报告上传状态", width: 150, render: (row) => tagCell(row.aiReportStatus, statusTone(row.aiReportStatus)) },
      { label: "金额", width: 110, render: (row) => money(row.amount) },
      { label: "操作", width: 180, render: (row) => linkActions([{ label: "详情", action: "open-detail", rowId: row.id }, { label: "发布", action: "publish-ai", rowId: row.id }]) },
    ],
    detailTitle: "AI 报告详情",
    detailSummary: (row) => `订单 <strong>${escapeHtml(row.orderNo)}</strong> 的 AI 报告上传状态已迁移到新平台统一管理。`,
    detailFields: [
      ["订单号", "orderNo"],
      ["开单医院", "openHospital"],
      ["检查项目名称", "projectName"],
      ["检查项目编码", "projectCode"],
      ["患者姓名", "patientName"],
      ["手机号", "phone"],
      ["支付状态", "paymentStatus"],
      ["AI 报告上传状态", "aiReportStatus"],
      ["最后更新时间", "updatedAt"],
    ],
    detailActions: [{ label: "发布 AI 报告", action: "publish-ai-detail", tone: "primary" }],
  },
  "multi-code-standard": {
    group: "产品功能",
    title: "组合对码列表",
    desc: "组合对码列表已收敛到新平台，保留平台标准项目组合、交付组合与收费方式等核心视图。",
    note: "迁移说明：复用新 CMS 的组合对码视觉系统，并把旧后台的业务入口统一放到产品功能模块下。",
    highlight: "延续 <strong>平台标准项目组合、交付中心院内项目组合、收费方式</strong> 等原有信息结构。",
    filters: [
      { key: "inspectionType", label: "检查类型", type: "select", options: ["全部", "CT", "MR", "DR"], field: "inspectionType" },
      { key: "status", label: "规则状态", type: "select", options: ["全部", "启用", "停用"], field: "status" },
      { key: "keyword", label: "规则搜索", type: "keyword", placeholder: "对码组编号", fields: ["groupNo"] },
    ],
    metrics(rows) {
      return [
        { label: "组合规则数", value: `${rows.length}组`, note: "多对多规则统一沉淀到新平台", tone: "good" },
        { label: "启用中", value: `${rows.filter((item) => item.status === "启用").length}组`, note: "当前参与自动匹配", tone: "good" },
        { label: "停用", value: `${rows.filter((item) => item.status === "停用").length}组`, note: "保留历史规则备查", tone: "warn" },
      ];
    },
    columns: [
      { label: "对码组编号", width: 170, render: (row) => stackCell(row.groupNo, row.updatedAt) },
      { label: "检查类型", width: 100, render: (row) => plainCell(row.inspectionType) },
      { label: "平台标准项目组合", width: 250, render: (row) => plainCell(row.platformItems) },
      { label: "交付中心院内项目组合", width: 250, render: (row) => plainCell(row.deliveryItems) },
      { label: "绑定设备", width: 120, render: (row) => plainCell(row.deviceBinding) },
      { label: "收费方式", width: 110, render: (row) => plainCell(row.chargeMode) },
      { label: "平台金额", width: 110, render: (row) => money(row.platformAmount) },
      { label: "状态", width: 100, render: (row) => tagCell(row.status, statusTone(row.status)) },
      { label: "操作", width: 100, render: (row) => linkActions([{ label: "详情", action: "open-detail", rowId: row.id }]) },
    ],
    detailTitle: "组合规则详情",
    detailSummary: (row) => `组合规则 <strong>${escapeHtml(row.groupNo)}</strong> 已迁入产品功能模块统一维护。`,
    detailFields: [
      ["对码组编号", "groupNo"],
      ["检查类型", "inspectionType"],
      ["平台标准项目组合", "platformItems"],
      ["交付中心院内项目组合", "deliveryItems"],
      ["绑定设备", "deviceBinding"],
      ["收费方式", "chargeMode"],
      ["平台金额", (row) => money(row.platformAmount)],
      ["状态", "status"],
      ["更新时间", "updatedAt"],
    ],
    detailActions: [{ label: "保存规则", action: "save-config", tone: "primary" }],
  },
  "multi-code-upstream": {
    group: "产品功能",
    title: "平台标准项目库",
    desc: "平台标准项目库已迁入新后台，继续作为上游映射和交付引用的标准基线。",
    note: "迁移说明：标准项目字段原样承接，统一到产品功能模块下集中维护。",
    highlight: "保留 <strong>标准项目编码、检查模态、上游引用、下游引用</strong> 等标准库关键字段。",
    filters: [
      { key: "status", label: "状态", type: "select", options: ["全部", "启用", "待确认"], field: "status" },
      { key: "modality", label: "检查模态", type: "select", options: ["全部", "CT", "MR"], field: "modality" },
      { key: "keyword", label: "项目搜索", type: "keyword", placeholder: "标准项目编码 / 名称", fields: ["code", "name"] },
    ],
    metrics(rows) {
      return [
        { label: "标准项目数", value: `${rows.length}项`, note: "当前平台标准基线项目", tone: "good" },
        { label: "待确认", value: `${rows.filter((item) => item.status === "待确认").length}项`, note: "需要产品继续梳理语义", tone: "warn" },
        { label: "启用中", value: `${rows.filter((item) => item.status === "启用").length}项`, note: "参与多对多匹配计算", tone: "good" },
      ];
    },
    columns: [
      { label: "标准项目编码", width: 160, render: (row) => plainCell(row.code) },
      { label: "标准项目名称", width: 180, render: (row) => plainCell(row.name) },
      { label: "检查模态", width: 100, render: (row) => plainCell(row.modality) },
      { label: "检查部位", width: 120, render: (row) => plainCell(row.bodyPart) },
      { label: "检查方式", width: 120, render: (row) => plainCell(row.method) },
      { label: "上游引用", width: 100, render: (row) => plainCell(`${row.upstreamRefs}次`) },
      { label: "下游引用", width: 100, render: (row) => plainCell(`${row.deliveryRefs}次`) },
      { label: "状态", width: 100, render: (row) => tagCell(row.status, statusTone(row.status)) },
      { label: "更新时间", width: 160, render: (row) => plainCell(row.updatedAt) },
      { label: "操作", width: 100, render: (row) => linkActions([{ label: "详情", action: "open-detail", rowId: row.id }]) },
    ],
    detailTitle: "标准项目详情",
    detailSummary: (row) => `标准项目 <strong>${escapeHtml(row.name)}</strong> 现在由新平台产品功能模块集中维护。`,
    detailFields: [
      ["标准项目编码", "code"],
      ["标准项目名称", "name"],
      ["检查模态", "modality"],
      ["检查部位", "bodyPart"],
      ["检查方式", "method"],
      ["上游引用", (row) => `${row.upstreamRefs}次`],
      ["下游引用", (row) => `${row.deliveryRefs}次`],
      ["状态", "status"],
      ["更新时间", "updatedAt"],
    ],
    detailActions: [{ label: "保存标准项目", action: "save-config", tone: "primary" }],
  },
  "multi-code-delivery": {
    group: "产品功能",
    title: "交付中心院内项目库",
    desc: "交付中心院内项目库迁移到新平台后，继续承接院内项目、覆盖标准项目与下发原则管理。",
    note: "迁移说明：下游项目库原业务字段不动，仅将视觉和操作壳迁成统一的 CMS 风格。",
    highlight: "保留 <strong>交付中心、院内项目编码、覆盖标准项目、匹配优先级、下发原则</strong> 等交付关键信息。",
    filters: [
      { key: "status", label: "状态", type: "select", options: ["全部", "启用", "停用"], field: "status" },
      { key: "itemType", label: "项目类型", type: "select", options: ["全部", "组合套餐", "单项目"], field: "itemType" },
      { key: "keyword", label: "院内项目搜索", type: "keyword", placeholder: "院内项目编码 / 名称", fields: ["itemCode", "itemName"] },
    ],
    metrics(rows) {
      return [
        { label: "院内项目数", value: `${rows.length}项`, note: "当前交付中心项目基线", tone: "good" },
        { label: "启用中", value: `${rows.filter((item) => item.status === "启用").length}项`, note: "参与下发分配", tone: "good" },
        { label: "停用", value: `${rows.filter((item) => item.status === "停用").length}项`, note: "保留历史映射关系", tone: "warn" },
      ];
    },
    columns: [
      { label: "交付中心", width: 200, render: (row) => plainCell(row.centerName) },
      { label: "院内项目编码", width: 160, render: (row) => plainCell(row.itemCode) },
      { label: "院内项目名称", width: 220, render: (row) => plainCell(row.itemName) },
      { label: "项目类型", width: 110, render: (row) => plainCell(row.itemType) },
      { label: "覆盖标准项目", width: 220, render: (row) => plainCell(row.standardItems) },
      { label: "匹配优先级", width: 100, render: (row) => plainCell(row.priority) },
      { label: "下发原则", width: 220, render: (row) => plainCell(row.dispatchRule) },
      { label: "状态", width: 100, render: (row) => tagCell(row.status, statusTone(row.status)) },
      { label: "操作", width: 100, render: (row) => linkActions([{ label: "详情", action: "open-detail", rowId: row.id }]) },
    ],
    detailTitle: "院内项目详情",
    detailSummary: (row) => `院内项目 <strong>${escapeHtml(row.itemName)}</strong> 已迁入新平台产品功能模块。`,
    detailFields: [
      ["交付中心", "centerName"],
      ["院内项目编码", "itemCode"],
      ["院内项目名称", "itemName"],
      ["项目类型", "itemType"],
      ["覆盖标准项目", "standardItems"],
      ["匹配优先级", "priority"],
      ["下发原则", "dispatchRule"],
      ["状态", "status"],
      ["更新时间", "updatedAt"],
    ],
    detailActions: [{ label: "保存院内项目", action: "save-config", tone: "primary" }],
  },
  "multi-code-logs": {
    group: "产品功能",
    title: "匹配日志 / 待人工对码",
    desc: "日志视图迁移后继续保留自动匹配结果、异常类型和人工补配处理状态，方便在新平台内集中处理。",
    note: "迁移说明：日志字段和处理状态完整保留，界面切换到新 CMS 的统一日志表格样式。",
    highlight: "保留 <strong>匹配成功、异常待处理、已补配待重试</strong> 等处理状态，方便产品与运营协作修复规则。",
    filters: [
      { key: "matchStatus", label: "匹配结果", type: "select", options: ["全部", "匹配成功", "异常待处理", "已补配待重试"], field: "matchStatus" },
      { key: "keyword", label: "日志搜索", type: "keyword", placeholder: "订单号 / 上游机构 / 原始项目", fields: ["orderNo", "upstreamInstitution", "originalProject"] },
    ],
    metrics(rows) {
      return [
        { label: "匹配日志数", value: `${rows.length}条`, note: "新平台统一承接匹配过程留痕", tone: "good" },
        { label: "异常待处理", value: `${rows.filter((item) => item.matchStatus === "异常待处理").length}条`, note: "需要人工补配规则", tone: "warn" },
        { label: "已补配待重试", value: `${rows.filter((item) => item.matchStatus === "已补配待重试").length}条`, note: "等待系统重放匹配", tone: "good" },
      ];
    },
    columns: [
      { label: "订单号", width: 180, render: (row) => plainCell(row.orderNo) },
      { label: "上游机构", width: 150, render: (row) => plainCell(row.upstreamInstitution) },
      { label: "上游原始项目", width: 240, render: (row) => plainCell(row.originalProject) },
      { label: "标准项目集合", width: 220, render: (row) => plainCell(row.standardItems) },
      { label: "目标交付中心", width: 200, render: (row) => plainCell(row.deliveryCenter) },
      { label: "匹配结果", width: 130, render: (row) => tagCell(row.matchStatus, statusTone(row.matchStatus)) },
      { label: "异常类型", width: 160, render: (row) => plainCell(row.exceptionType) },
      { label: "处理状态", width: 130, render: (row) => plainCell(row.processingStatus) },
      { label: "操作", width: 100, render: (row) => linkActions([{ label: "详情", action: "open-detail", rowId: row.id }]) },
    ],
    detailTitle: "匹配日志详情",
    detailSummary: (row) => `匹配日志 <strong>${escapeHtml(row.orderNo)}</strong> 已迁入新平台，可继续追踪规则异常与补配结果。`,
    detailFields: [
      ["订单号", "orderNo"],
      ["上游机构", "upstreamInstitution"],
      ["上游原始项目", "originalProject"],
      ["标准项目集合", "standardItems"],
      ["目标交付中心", "deliveryCenter"],
      ["匹配结果", "matchStatus"],
      ["实际下发项目", "actualItems"],
      ["异常类型", "exceptionType"],
      ["处理状态", "processingStatus"],
    ],
    detailActions: [{ label: "标记已处理", action: "resolve-log", tone: "primary" }],
  },
  "activity-management": {
    group: "产品功能",
    title: "活动管理",
    desc: "活动管理模块已迁移到新平台，继续支持渠道、机构、项目与活动期的组合管理。",
    note: "迁移说明：保留活动列表和状态流转，把活动总览、编辑入口统一纳入产品功能模块。",
    highlight: "保留 <strong>渠道、覆盖机构数、活动项目数、活动时间、状态</strong>，方便平台运营延续活动编排。",
    filters: [
      { key: "status", label: "活动状态", type: "select", options: ["全部", "进行中", "待开始", "草稿"], field: "status" },
      { key: "keyword", label: "活动搜索", type: "keyword", placeholder: "活动名称 / 渠道", fields: ["activityName", "channelName"] },
    ],
    metrics(rows) {
      return [
        { label: "活动总数", value: `${rows.length}场`, note: "平台活动统一纳管", tone: "good" },
        { label: "进行中", value: `${rows.filter((item) => item.status === "进行中").length}场`, note: "当前对外生效活动", tone: "good" },
        { label: "待开始 / 草稿", value: `${rows.filter((item) => item.status === "待开始" || item.status === "草稿").length}场`, note: "待继续排期与编辑", tone: "warn" },
      ];
    },
    columns: [
      { label: "活动名称", width: 220, render: (row) => stackCell(row.activityName, row.channelName) },
      { label: "覆盖机构数", width: 120, render: (row) => plainCell(`${row.institutionCount}家`) },
      { label: "活动项目数", width: 120, render: (row) => plainCell(`${row.projectCount}项`) },
      { label: "活动时间", width: 220, render: (row) => plainCell(row.activePeriod) },
      { label: "状态", width: 110, render: (row) => tagCell(row.status, statusTone(row.status)) },
      { label: "更新时间", width: 160, render: (row) => plainCell(row.updatedAt) },
      { label: "操作", width: 100, render: (row) => linkActions([{ label: "详情", action: "open-detail", rowId: row.id }]) },
    ],
    detailTitle: "活动详情",
    detailSummary: (row) => `活动 <strong>${escapeHtml(row.activityName)}</strong> 已迁入新平台活动管理模块。`,
    detailFields: [
      ["活动名称", "activityName"],
      ["活动渠道", "channelName"],
      ["覆盖机构数", (row) => `${row.institutionCount}家`],
      ["活动项目数", (row) => `${row.projectCount}项`],
      ["活动时间", "activePeriod"],
      ["状态", "status"],
      ["更新时间", "updatedAt"],
    ],
    detailActions: [{ label: "保存活动", action: "save-config", tone: "primary" }],
  },
};

const state = {
  activeView: getActiveViewKey(),
  rowsByView: clone(rowsSeed),
  filters: {},
  detail: {
    open: false,
    rowId: "",
  },
  associate: {
    open: false,
    rowId: "",
    keyword: "",
    selectedDoctorId: "",
  },
  qr: {
    open: false,
    rowId: "",
  },
};

Object.keys(viewConfigs).forEach((key) => {
  state.filters[key] = Object.fromEntries(
    viewConfigs[key].filters.map((filter) => [filter.key, filter.type === "select" ? "全部" : ""]),
  );
});

function showToast(title, body, type = "success") {
  const toast = document.createElement("div");
  toast.className = `toast toast--${type}`;
  toast.innerHTML = `<strong>${escapeHtml(title)}</strong><span>${escapeHtml(body)}</span>`;
  refs.toastStack.appendChild(toast);
  window.setTimeout(() => toast.remove(), 2600);
}

function activeConfig() {
  return viewConfigs[state.activeView];
}

function activeRows() {
  return state.rowsByView[state.activeView] || [];
}

function rowById(viewKey, rowId) {
  return (state.rowsByView[viewKey] || []).find((row) => row.id === rowId) || null;
}

function filteredRows(viewKey = state.activeView) {
  const config = viewConfigs[viewKey];
  const filters = state.filters[viewKey];
  return (state.rowsByView[viewKey] || []).filter((row) => config.filters.every((filter) => {
    const value = filters[filter.key];
    if (!value || value === "全部") {
      return true;
    }
    if (filter.type === "keyword") {
      return filter.fields.some((field) => String(row[field] || "").includes(value.trim()));
    }
    return String(row[filter.field] || "") === value;
  }));
}

function renderPage() {
  const config = activeConfig();
  refs.pageKicker.textContent = config.group;
  refs.pageTitle.textContent = config.title;
  refs.pageDesc.textContent = config.desc;
  refs.pageNote.innerHTML = `<strong>迁移说明</strong>${escapeHtml(config.note)}`;
  refs.highlightBanner.innerHTML = config.highlight;
  renderMetrics();
  renderFilters();
  renderActions();
  renderTable();
  renderDetailModal();
  renderAssociateModal();
  renderQrModal();
}

function renderMetrics() {
  const cards = activeConfig().metrics(activeRows());
  refs.metricsGrid.innerHTML = cards.map((card) => `
    <div class="combo-overview__card ${card.tone === "good" ? "combo-overview__card--good" : card.tone === "warn" ? "combo-overview__card--warn" : ""}">
      <span>${escapeHtml(card.label)}</span>
      <strong>${escapeHtml(card.value)}</strong>
      <small>${escapeHtml(card.note)}</small>
    </div>
  `).join("");
}

function renderFilters() {
  const config = activeConfig();
  const values = state.filters[state.activeView];
  refs.filtersBar.innerHTML = config.filters.map((filter) => {
    if (filter.type === "select") {
      return `
        <label class="inline-field inline-field--select">
          <span>${escapeHtml(filter.label)}：</span>
          <select data-filter-key="${escapeHtml(filter.key)}">
            ${filter.options.map((option) => `<option value="${escapeHtml(option)}" ${values[filter.key] === option ? "selected" : ""}>${escapeHtml(option)}</option>`).join("")}
          </select>
        </label>
      `;
    }
    return `
      <label class="inline-field inline-field--keyword">
        <span>${escapeHtml(filter.label)}：</span>
        <input data-filter-key="${escapeHtml(filter.key)}" type="text" value="${escapeHtml(values[filter.key])}" placeholder="${escapeHtml(filter.placeholder)}" />
      </label>
    `;
  }).join("") + `
    <button class="btn btn-primary btn-search" type="button" data-filter-action="search">查询</button>
    <button class="btn btn-ghost" type="button" data-filter-action="reset">重置</button>
  `;
}

function renderActions() {
  const label = state.activeView.startsWith("multi-code") ? "保存配置" : "刷新视图";
  refs.actionsBar.innerHTML = `<button class="btn btn-primary" type="button" id="pageActionButton">${label}</button>`;
}

function renderTable() {
  const config = activeConfig();
  const rows = filteredRows();
  refs.tableHeadRow.innerHTML = config.columns.map((column) => `<th style="width:${column.width}px">${escapeHtml(column.label)}</th>`).join("");
  refs.tableBody.innerHTML = rows.length
    ? rows.map((row) => `<tr>${config.columns.map((column) => `<td>${column.render(row)}</td>`).join("")}</tr>`).join("")
    : `<tr><td colspan="${config.columns.length}"><div class="migration-empty">当前筛选条件下暂无数据</div></td></tr>`;
  refs.recordText.innerHTML = `共 <strong>${rows.length}</strong> 条记录，当前为迁移后的统一内容页。`;
  refs.footerNote.textContent = "当前原型重点演示迁移后的页面承载与关键交互，不接真实接口。";
  refs.moduleTable.style.minWidth = `${config.columns.reduce((sumWidth, column) => sumWidth + column.width, 0)}px`;
}

function updateRows(viewKey, rowId, updater) {
  state.rowsByView[viewKey] = (state.rowsByView[viewKey] || []).map((row) => (row.id === rowId ? updater(row) : row));
}

function openDetail(rowId) {
  state.detail.open = true;
  state.detail.rowId = rowId;
  renderDetailModal();
}

function closeDetail() {
  state.detail.open = false;
  state.detail.rowId = "";
  renderDetailModal();
}

function renderDetailModal() {
  refs.detailModal.hidden = !state.detail.open;
  if (!state.detail.open) {
    return;
  }
  const config = activeConfig();
  const row = rowById(state.activeView, state.detail.rowId);
  if (!row) {
    closeDetail();
    return;
  }
  refs.detailModalKicker.textContent = config.group;
  refs.detailModalTitle.textContent = config.detailTitle;
  refs.detailModalSummary.innerHTML = config.detailSummary(row);
  refs.detailModalGrid.innerHTML = config.detailFields.map(([label, keyOrGetter]) => {
    const value = typeof keyOrGetter === "function" ? keyOrGetter(row) : row[keyOrGetter];
    return `
      <div class="migration-detail-item">
        <span>${escapeHtml(label)}</span>
        <strong>${escapeHtml(value ?? "-")}</strong>
      </div>
    `;
  }).join("");
  refs.detailModalActions.innerHTML = config.detailActions.map((action) => `
    <button class="btn ${action.tone === "ghost" ? "btn-ghost" : "btn-primary"}" type="button" data-detail-action="${escapeHtml(action.action)}">
      ${escapeHtml(action.label)}
    </button>
  `).join("");
}

function openAssociate(rowId) {
  state.associate.open = true;
  state.associate.rowId = rowId;
  state.associate.keyword = "";
  state.associate.selectedDoctorId = "";
  refs.associateKeywordInput.value = "";
  renderAssociateModal();
}

function closeAssociate() {
  state.associate.open = false;
  state.associate.rowId = "";
  state.associate.keyword = "";
  state.associate.selectedDoctorId = "";
  renderAssociateModal();
}

function filteredDoctors() {
  const keyword = state.associate.keyword.trim();
  if (!keyword) {
    return doctors;
  }
  return doctors.filter((doctor) => (
    doctor.doctorName.includes(keyword)
    || doctor.phone.includes(keyword)
    || doctor.clinicName.includes(keyword)
  ));
}

function renderAssociateModal() {
  refs.associateModal.hidden = !state.associate.open;
  if (!state.associate.open) {
    return;
  }
  const row = rowById("order-association", state.associate.rowId);
  if (!row) {
    closeAssociate();
    return;
  }
  refs.associateModalTitle.textContent = row.associatedDoctorName ? "重新关联医生" : "关联医生";
  refs.associateOrderNo.textContent = `订单号：${row.orderNo}`;
  refs.associateOrderProject.textContent = `项目：${row.projectName} / 患者：${row.patientName}`;
  const items = filteredDoctors();
  refs.associateDoctorGrid.innerHTML = items.length ? items.map((doctor) => `
    <button class="migration-doctor-card ${state.associate.selectedDoctorId === doctor.id ? "is-active" : ""}" type="button" data-doctor-id="${escapeHtml(doctor.id)}">
      <div class="migration-doctor-card__head">
        <strong>${escapeHtml(doctor.doctorName)}</strong>
        ${tagCell(doctor.enabledStatus, statusTone(doctor.enabledStatus))}
      </div>
      <div class="migration-doctor-card__meta">
        <span>${escapeHtml(doctor.phone)}</span>
        <span>${escapeHtml(doctor.clinicName)} · ${escapeHtml(doctor.department)}</span>
        <span>关联运营：${escapeHtml(doctor.operatorName)}</span>
      </div>
    </button>
  `).join("") : `<div class="migration-empty">没有匹配到医生，请换个关键词再试。</div>`;
}

function openQr(rowId) {
  state.qr.open = true;
  state.qr.rowId = rowId;
  renderQrModal();
}

function closeQr() {
  state.qr.open = false;
  state.qr.rowId = "";
  renderQrModal();
}

function renderQrModal() {
  refs.qrModal.hidden = !state.qr.open;
  if (!state.qr.open) {
    return;
  }
  const row = rowById("doctor-management", state.qr.rowId);
  if (!row) {
    closeQr();
    return;
  }
  refs.qrModalTitle.textContent = `${row.doctorName} 的二维码预览`;
  refs.qrModalSummary.innerHTML = `当前二维码已迁入新平台样式，扫码将进入 <strong>${escapeHtml(row.doctorName)}</strong> 的医生工作台。`;
}

function handleDetailAction(action) {
  const rowId = state.detail.rowId;
  const row = rowById(state.activeView, rowId);
  if (!row) {
    return;
  }

  switch (action) {
    case "approve-review":
      updateRows(state.activeView, rowId, (item) => ({ ...item, auditStatus: "审核通过", note: "已在新平台审核通过" }));
      showToast("审核通过", `已通过 ${row.doctorName} 的签约申请。`);
      break;
    case "reject-review":
      updateRows(state.activeView, rowId, (item) => ({ ...item, auditStatus: "审核驳回", note: "已在新平台驳回，待补充资料" }));
      showToast("已驳回", `已退回 ${row.doctorName} 的申请资料。`, "warning");
      break;
    case "toggle-operator":
      updateRows(state.activeView, rowId, (item) => ({ ...item, enabledStatus: item.enabledStatus === "已启用" ? "已停用" : "已启用" }));
      showToast("状态已更新", `已切换 ${row.operatorName} 的启停状态。`);
      break;
    case "toggle-doctor":
      updateRows(state.activeView, rowId, (item) => ({ ...item, enabledStatus: item.enabledStatus === "已启用" ? "已停用" : "已启用" }));
      showToast("状态已更新", `已切换 ${row.doctorName} 的启停状态。`);
      break;
    case "open-associate-from-detail":
      closeDetail();
      openAssociate(rowId);
      return;
    case "assign-report":
      updateRows(state.activeView, rowId, (item) => ({ ...item, reportStatus: "未解读", reportTime: item.reportTime === "-" ? "待解读分配后生成" : item.reportTime }));
      showToast("分配完成", `已为 ${row.patientName} 的报告确认分配。`);
      break;
    case "approve-withdraw":
      updateRows(state.activeView, rowId, (item) => ({ ...item, status: "审核通过", reviewer: "平台财务", processedAt: "2026-06-12 18:20", rejectReason: "-" }));
      showToast("审核通过", `已通过 ${row.doctorName} 的提现申请。`);
      break;
    case "reject-withdraw":
      updateRows(state.activeView, rowId, (item) => ({ ...item, status: "已驳回", reviewer: "平台财务", processedAt: "2026-06-12 18:20", rejectReason: "已在新平台退回补充资料" }));
      showToast("已驳回", `已驳回 ${row.doctorName} 的提现申请。`, "warning");
      break;
    case "publish-ai-detail":
      updateRows(state.activeView, rowId, (item) => ({ ...item, aiReportStatus: "已发布", updatedAt: "2026-06-12 18:20" }));
      showToast("发布成功", `订单 ${row.orderNo} 的 AI 报告已发布。`);
      break;
    case "resolve-log":
      updateRows(state.activeView, rowId, (item) => ({ ...item, matchStatus: "匹配成功", processingStatus: "已完成", exceptionType: "-", actualItems: item.actualItems === "-" ? "人工补配院内项目" : item.actualItems }));
      showToast("处理完成", `日志 ${row.orderNo} 已标记为处理完成。`);
      break;
    case "save-config":
      showToast("保存成功", "当前配置已保存到迁移后的新平台原型。");
      break;
    case "close-detail":
      break;
    default:
      break;
  }

  closeDetail();
  renderPage();
}

function handleRowAction(action, rowId) {
  switch (action) {
    case "open-detail":
      openDetail(rowId);
      break;
    case "open-associate":
      openAssociate(rowId);
      break;
    case "open-qr":
      openQr(rowId);
      break;
    case "publish-ai":
      updateRows("ai-report-upload", rowId, (item) => ({ ...item, aiReportStatus: "已发布", updatedAt: "2026-06-12 18:20" }));
      showToast("发布成功", "AI 报告已在新平台发布。");
      renderPage();
      break;
    default:
      break;
  }
}

function bindEvents() {
  document.addEventListener("input", (event) => {
    const filterInput = event.target.closest("[data-filter-key]");
    if (filterInput) {
      state.filters[state.activeView][filterInput.dataset.filterKey] = filterInput.value;
    }
    if (event.target === refs.associateKeywordInput) {
      state.associate.keyword = event.target.value;
      renderAssociateModal();
    }
  });

  document.addEventListener("change", (event) => {
    const filterSelect = event.target.closest("[data-filter-key]");
    if (filterSelect) {
      state.filters[state.activeView][filterSelect.dataset.filterKey] = filterSelect.value;
    }
  });

  document.addEventListener("click", (event) => {
    const filterAction = event.target.closest("[data-filter-action]");
    if (filterAction) {
      if (filterAction.dataset.filterAction === "reset") {
        state.filters[state.activeView] = Object.fromEntries(activeConfig().filters.map((filter) => [filter.key, filter.type === "select" ? "全部" : ""]));
        renderPage();
      } else {
        renderTable();
        showToast("筛选已更新", `已按当前条件刷新 ${activeConfig().title}。`);
      }
      return;
    }

    const rowAction = event.target.closest("[data-row-action]");
    if (rowAction) {
      handleRowAction(rowAction.dataset.rowAction, rowAction.dataset.rowId);
      return;
    }

    const detailAction = event.target.closest("[data-detail-action]");
    if (detailAction) {
      handleDetailAction(detailAction.dataset.detailAction);
      return;
    }

    const doctorButton = event.target.closest("[data-doctor-id]");
    if (doctorButton) {
      state.associate.selectedDoctorId = doctorButton.dataset.doctorId;
      renderAssociateModal();
      return;
    }

    if (event.target.id === "pageActionButton") {
      showToast("入口已保留", `${activeConfig().title} 的进一步编辑入口已保留。`);
    }
  });

  refs.closeDetailButton.addEventListener("click", closeDetail);
  refs.detailModal.addEventListener("click", (event) => {
    if (event.target === refs.detailModal) {
      closeDetail();
    }
  });

  refs.closeAssociateButton.addEventListener("click", closeAssociate);
  refs.cancelAssociateButton.addEventListener("click", closeAssociate);
  refs.associateModal.addEventListener("click", (event) => {
    if (event.target === refs.associateModal) {
      closeAssociate();
    }
  });

  refs.confirmAssociateButton.addEventListener("click", () => {
    const doctor = doctors.find((item) => item.id === state.associate.selectedDoctorId);
    if (!doctor) {
      showToast("请选择医生", "先从医生列表里选择需要关联的管理医生。", "warning");
      return;
    }
    updateRows("order-association", state.associate.rowId, (item) => ({ ...item, associatedDoctorName: doctor.doctorName }));
    showToast("关联成功", `订单已关联到 ${doctor.doctorName}。`);
    closeAssociate();
    renderPage();
  });

  refs.closeQrButton.addEventListener("click", closeQr);
  refs.qrModal.addEventListener("click", (event) => {
    if (event.target === refs.qrModal) {
      closeQr();
    }
  });
  refs.downloadQrButton.addEventListener("click", () => {
    const row = rowById("doctor-management", state.qr.rowId);
    if (!row) {
      return;
    }
    showToast("开始下载", `${row.doctorName} 的二维码已开始下载（演示）。`);
  });

  window.addEventListener("hashchange", () => {
    state.activeView = getActiveViewKey();
    closeDetail();
    closeAssociate();
    closeQr();
    renderPage();
  });
}

bindEvents();
renderPage();
