const hospitals = [
  {
    id: 301,
    name: "南昌一脉阳光医学诊断中心",
    shortName: "南",
    type: 2,
    typeLabel: "执行机构",
    city: "南昌",
    description: "当前还原页面默认上下文，维护院内检查项目、平台项目映射和设备绑定。",
    defaultCheckRatio: 70,
    defaultConsumRatio: 100,
    defaultDrugRatio: 100,
  },
  {
    id: 302,
    name: "江西一脉阳光影像中心",
    shortName: "赣",
    type: 2,
    typeLabel: "执行机构",
    city: "南昌",
    description: "用于补充执行机构场景，便于演示医院切换交互。",
    defaultCheckRatio: 72,
    defaultConsumRatio: 100,
    defaultDrugRatio: 100,
  },
  {
    id: 303,
    name: "成都青藤互联网医院",
    shortName: "青",
    type: 1,
    typeLabel: "互联网医院",
    city: "成都",
    description: "作为开单入口机构保留在切换列表中，不直接维护当前页面数据。",
    defaultCheckRatio: 100,
    defaultConsumRatio: 100,
    defaultDrugRatio: 100,
  },
  {
    id: 304,
    name: "云杉报告中心",
    shortName: "云",
    type: 3,
    typeLabel: "报告机构",
    city: "重庆",
    description: "主要负责报告交付，不参与院内检查项目对码。",
    defaultCheckRatio: 100,
    defaultConsumRatio: 100,
    defaultDrugRatio: 100,
  },
];

const devices = [
  { id: 1, label: "CT_64排", modality: "CT", hospitalIds: [301, 302] },
  { id: 2, label: "MR_3.0T", modality: "MR", hospitalIds: [301, 302] },
  { id: 3, label: "DR_无", modality: "DR", hospitalIds: [301, 302] },
];

const platformItems = [
  { id: 1001, itemCode: "20030400111001", itemName: "* CT腰椎(平扫)", modality: "CT" },
  { id: 1002, itemCode: "30061102110001", itemName: "* MR胎盘(平扫)", modality: "MR" },
  { id: 1003, itemCode: "20999999000001", itemName: "* CT三维重建", modality: "CT" },
  { id: 1004, itemCode: "20999999470001", itemName: "* CT临床操作项目", modality: "CT" },
  { id: 1005, itemCode: "40072606000001", itemName: "* DR双跟骨侧位", modality: "DR" },
  { id: 1006, itemCode: "40072605000001", itemName: "* DR右跟骨侧位", modality: "DR" },
  { id: 1007, itemCode: "40072605000002", itemName: "* DR右跟骨骨轴位", modality: "DR" },
  { id: 1008, itemCode: "40072604000001", itemName: "* DR左跟骨侧位", modality: "DR" },
  { id: 1009, itemCode: "40072604000002", itemName: "* DR左跟骨骨轴位", modality: "DR" },
];

const baseRows = [
  {
    id: 1,
    hospitalId: 301,
    modality: "CT",
    itemCode: "19990272600001",
    itemName: "CT腰椎（平扫）",
    platformItemId: 1001,
    deviceIds: [1],
    checkPrice: 260,
    checkRatio: 70,
    consumPrice: 0,
    consumRatio: null,
    drugPrice: 0,
    drugRatio: null,
    outItemId: "OUT-301-001",
    status: "matched",
    showRatios: false,
  },
  {
    id: 2,
    hospitalId: 301,
    modality: "MR",
    itemCode: "19990269600001",
    itemName: "MR胎盘（平扫）",
    platformItemId: 1002,
    deviceIds: [2],
    checkPrice: 460,
    checkRatio: 70,
    consumPrice: 0,
    consumRatio: null,
    drugPrice: 0,
    drugRatio: null,
    outItemId: "OUT-301-002",
    status: "matched",
    showRatios: false,
  },
  {
    id: 3,
    hospitalId: 301,
    modality: "CT",
    itemCode: "19761183000001",
    itemName: "CT三维重建",
    platformItemId: 1003,
    deviceIds: [1],
    checkPrice: 50,
    checkRatio: 70,
    consumPrice: 0,
    consumRatio: null,
    drugPrice: 0,
    drugRatio: null,
    outItemId: "OUT-301-003",
    status: "matched",
    showRatios: false,
  },
  {
    id: 4,
    hospitalId: 301,
    modality: "CT",
    itemCode: "20999999900001",
    itemName: "* CT临床操作项目",
    platformItemId: 1004,
    deviceIds: [1],
    checkPrice: 285,
    checkRatio: 70,
    consumPrice: 0,
    consumRatio: null,
    drugPrice: 0,
    drugRatio: null,
    outItemId: "OUT-301-004",
    status: "matched",
    showRatios: false,
  },
  {
    id: 5,
    hospitalId: 301,
    modality: "DR",
    itemCode: "40072606000011",
    itemName: "* DR双跟骨侧位",
    platformItemId: 1005,
    deviceIds: [3],
    checkPrice: 80,
    checkRatio: 70,
    consumPrice: 0,
    consumRatio: null,
    drugPrice: 0,
    drugRatio: null,
    outItemId: "OUT-301-005",
    status: "matched",
    showRatios: false,
  },
  {
    id: 6,
    hospitalId: 301,
    modality: "DR",
    itemCode: "40072605000011",
    itemName: "* DR右跟骨侧位",
    platformItemId: 1006,
    deviceIds: [3],
    checkPrice: 65,
    checkRatio: 70,
    consumPrice: 0,
    consumRatio: null,
    drugPrice: 0,
    drugRatio: null,
    outItemId: "OUT-301-006",
    status: "matched",
    showRatios: false,
  },
  {
    id: 7,
    hospitalId: 301,
    modality: "DR",
    itemCode: "40072605000012",
    itemName: "* DR右跟骨骨轴位",
    platformItemId: 1007,
    deviceIds: [3],
    checkPrice: 40,
    checkRatio: 70,
    consumPrice: 0,
    consumRatio: null,
    drugPrice: 0,
    drugRatio: null,
    outItemId: "OUT-301-007",
    status: "matched",
    showRatios: false,
  },
  {
    id: 8,
    hospitalId: 301,
    modality: "DR",
    itemCode: "40072605000013",
    itemName: "* DR右跟骨骨侧位",
    platformItemId: 1006,
    deviceIds: [3],
    checkPrice: 40,
    checkRatio: 70,
    consumPrice: 0,
    consumRatio: null,
    drugPrice: 0,
    drugRatio: null,
    outItemId: "OUT-301-008",
    status: "matched",
    showRatios: false,
  },
  {
    id: 9,
    hospitalId: 301,
    modality: "DR",
    itemCode: "40072604000011",
    itemName: "* DR左跟骨侧位",
    platformItemId: 1008,
    deviceIds: [3],
    checkPrice: 65,
    checkRatio: 70,
    consumPrice: 0,
    consumRatio: null,
    drugPrice: 0,
    drugRatio: null,
    outItemId: "OUT-301-009",
    status: "matched",
    showRatios: false,
  },
  {
    id: 10,
    hospitalId: 301,
    modality: "DR",
    itemCode: "40072604000012",
    itemName: "* DR左跟骨骨轴位",
    platformItemId: 1009,
    deviceIds: [3],
    checkPrice: 40,
    checkRatio: 70,
    consumPrice: 0,
    consumRatio: null,
    drugPrice: 0,
    drugRatio: null,
    outItemId: "OUT-301-010",
    status: "matched",
    showRatios: false,
  },
];

const comboRules = [
  {
    id: 501,
    type: "多对多",
    status: "enabled",
    upstreamOrg: "成都青藤互联网医院",
    upstreamItemCode: "30061102110000",
    upstreamItemName: "MRI头部普通+血管扫描",
    comboDisplayName: "颅脑MR平扫+头颅动脉MRA",
    platformItems: [
      { code: "P001", name: "颅脑MR平扫" },
      { code: "P002", name: "头颅动脉MRA" },
    ],
    priceMode: "组合固定价",
    priceValue: "¥746.66",
    platformPriceSummary: "颅脑MR平扫 ¥520.00 + 头颅动脉MRA ¥226.66",
    deliveryMode: "主项目+加收项",
    deliveryHospital: "南昌一脉阳光医学诊断中心",
    deliveryItems: [
      { name: "头部MR平扫", role: "主执行项目", note: "与平台“颅脑MR平扫”绑定，下发 1 条执行明细" },
      { name: "血管扫描加收项", role: "附加执行项目", note: "承接“头颅动脉MRA”能力，支持单独核价与结算追踪" },
    ],
    orderDisplayName: "颅脑MR平扫+头颅动脉MRA",
    orderSourceName: "MRI头部普通+血管扫描",
    orderDetails: ["颅脑MR平扫", "头颅动脉MRA"],
    statusLabel: "已启用",
    statusHint: "价格规则、执行项目与启用校验均已补齐，可自动下发。",
    aiHint: "AI 识别关键词：MRI / 头部 / 血管扫描，建议拆解为“颅脑MR平扫 + 头颅动脉MRA”，需运营确认后保存。",
    updatedAt: "2026-06-11 16:20",
  },
  {
    id: 502,
    type: "一对多",
    status: "pending",
    upstreamOrg: "华西互联网医院",
    upstreamItemCode: "30061102110018",
    upstreamItemName: "胸部CT+上腹部CT",
    comboDisplayName: "胸部CT平扫+上腹部CT平扫",
    platformItems: [
      { code: "P021", name: "胸部CT平扫" },
      { code: "P022", name: "上腹部CT平扫" },
    ],
    priceMode: "明细价格相加",
    priceValue: "按明细汇总",
    platformPriceSummary: "下单时汇总两个平台标准项目价格",
    deliveryMode: "多个执行项目",
    deliveryHospital: "江西一脉阳光影像中心",
    deliveryItems: [
      { name: "胸部CT平扫", role: "执行项目 1", note: "交付中心直接接收单项目" },
      { name: "上腹部CT平扫", role: "执行项目 2", note: "与主订单保持拆分关系，独立回传报告" },
    ],
    orderDisplayName: "胸部CT平扫+上腹部CT平扫",
    orderSourceName: "胸部CT+上腹部CT",
    orderDetails: ["胸部CT平扫", "上腹部CT平扫"],
    statusLabel: "待补配置",
    statusHint: "价格规则已确认，但交付中心执行项目仍待最终核验。",
    aiHint: "当前已命中两个 CT 标准项目，待交付中心确认是否接受拆成两条执行项目。",
    updatedAt: "2026-06-11 15:04",
  },
  {
    id: 503,
    type: "多对一",
    status: "draft",
    upstreamOrg: "云杉互联网医院",
    upstreamItemCode: "30061102110026",
    upstreamItemName: "颅脑MR平扫+增强",
    comboDisplayName: "颅脑MR平扫+增强加收项",
    platformItems: [
      { code: "P031", name: "颅脑MR平扫" },
      { code: "P032", name: "增强加收项" },
    ],
    priceMode: "按交付中心价格",
    priceValue: "待中心报价",
    platformPriceSummary: "优先取交付中心套餐价，缺失时禁止启用",
    deliveryMode: "中心组合项目",
    deliveryHospital: "南昌一脉阳光医学诊断中心",
    deliveryItems: [
      { name: "头部MR平扫+增强套餐", role: "组合执行项目", note: "中心侧已有套餐项目，可一条下发" },
    ],
    orderDisplayName: "颅脑MR平扫+增强加收项",
    orderSourceName: "颅脑MR平扫+增强",
    orderDetails: ["颅脑MR平扫", "增强加收项"],
    statusLabel: "待审核",
    statusHint: "中心套餐价未回填，当前规则只保留草稿，不允许自动启用。",
    aiHint: "AI 已建议拆解为“平扫 + 增强加收项”，但套餐价格仍需人工确认。",
    updatedAt: "2026-06-11 11:38",
  },
];

const state = {
  screen: "workspace",
  verifyCode: "",
  activePage: "combo-mapping",
  sidebarCollapsed: false,
  selectedHospitalId: 301,
  filters: {
    modality: "",
    keyword: "",
  },
  comboFilters: {
    type: "",
    status: "",
    keyword: "",
  },
  page: 1,
  pageSize: 10,
  comboPage: 1,
  comboPageSize: 10,
  mockTotalRecords: 986,
  hospitals,
  rows: baseRows.map((row) => ({ ...row })),
  comboRules: comboRules.map((rule) => ({ ...rule })),
  selectedComboRuleId: 501,
  hospitalModal: {
    open: false,
    type: "",
    keyword: "",
  },
  itemModal: {
    open: false,
    mode: "create",
    draft: null,
    analysis: "输入医院项目名称后，点击“AI 对码”生成建议平台项目。",
  },
  comboModal: {
    open: false,
    mode: "create",
    draft: null,
    analysis: "输入上游项目名称后，点击“AI 拆解”生成组合拆解建议。",
  },
  batchModal: {
    open: false,
    rows: [],
  },
  comboBatchModal: {
    open: false,
    rows: [],
  },
};

const refs = {
  loginScreen: document.getElementById("loginScreen"),
  workspaceScreen: document.getElementById("workspaceScreen"),
  loginAccount: document.getElementById("loginAccount"),
  loginPassword: document.getElementById("loginPassword"),
  loginCaptchaInput: document.getElementById("loginCaptchaInput"),
  refreshCaptcha: document.getElementById("refreshCaptcha"),
  loginButton: document.getElementById("loginButton"),
  pageRoutes: Array.from(document.querySelectorAll("[data-page-id]")),
  pageMenuButtons: Array.from(document.querySelectorAll("[data-page-target]")),
  appShell: document.getElementById("appShell"),
  collapseToggle: document.getElementById("collapseToggle"),
  hospitalSwitchButton: document.getElementById("hospitalSwitchButton"),
  userMenuButton: document.getElementById("userMenuButton"),
  userMenu: document.getElementById("userMenu"),
  logoutButton: document.getElementById("logoutButton"),
  changePasswordButton: document.getElementById("changePasswordButton"),
  switchHospitalQuickButton: document.getElementById("switchHospitalQuickButton"),
  modalityFilter: document.getElementById("modalityFilter"),
  keywordFilter: document.getElementById("keywordFilter"),
  searchButton: document.getElementById("searchButton"),
  resetButton: document.getElementById("resetButton"),
  addItemButton: document.getElementById("addItemButton"),
  templateButton: document.getElementById("templateButton"),
  importButton: document.getElementById("importButton"),
  batchButton: document.getElementById("batchButton"),
  exportButton: document.getElementById("exportButton"),
  importFileInput: document.getElementById("importFileInput"),
  tableBody: document.getElementById("tableBody"),
  recordText: document.getElementById("recordText"),
  pagination: document.getElementById("pagination"),
  hospitalModal: document.getElementById("hospitalModal"),
  hospitalTypeFilter: document.getElementById("hospitalTypeFilter"),
  hospitalKeywordFilter: document.getElementById("hospitalKeywordFilter"),
  hospitalGrid: document.getElementById("hospitalGrid"),
  itemModal: document.getElementById("itemModal"),
  itemModalModeLabel: document.getElementById("itemModalModeLabel"),
  itemModalTitle: document.getElementById("itemModalTitle"),
  ratioBanner: document.getElementById("ratioBanner"),
  itemNameInput: document.getElementById("itemNameInput"),
  itemCodeInput: document.getElementById("itemCodeInput"),
  platformItemSelect: document.getElementById("platformItemSelect"),
  platformItemCodeInput: document.getElementById("platformItemCodeInput"),
  deviceChipList: document.getElementById("deviceChipList"),
  hospitalAmountPreview: document.getElementById("hospitalAmountPreview"),
  platformAmountPreview: document.getElementById("platformAmountPreview"),
  checkPriceInput: document.getElementById("checkPriceInput"),
  checkRatioInput: document.getElementById("checkRatioInput"),
  consumPriceInput: document.getElementById("consumPriceInput"),
  consumRatioInput: document.getElementById("consumRatioInput"),
  drugPriceInput: document.getElementById("drugPriceInput"),
  drugRatioInput: document.getElementById("drugRatioInput"),
  outItemIdInput: document.getElementById("outItemIdInput"),
  aiMatchButton: document.getElementById("aiMatchButton"),
  aiResultBox: document.getElementById("aiResultBox"),
  saveItemButton: document.getElementById("saveItemButton"),
  batchModal: document.getElementById("batchModal"),
  batchTableBody: document.getElementById("batchTableBody"),
  batchAiButton: document.getElementById("batchAiButton"),
  batchSaveButton: document.getElementById("batchSaveButton"),
  comboTotalCount: document.getElementById("comboTotalCount"),
  comboReadyCount: document.getElementById("comboReadyCount"),
  comboRiskCount: document.getElementById("comboRiskCount"),
  comboTypeFilter: document.getElementById("comboTypeFilter"),
  comboStatusFilter: document.getElementById("comboStatusFilter"),
  comboKeywordFilter: document.getElementById("comboKeywordFilter"),
  comboSearchButton: document.getElementById("comboSearchButton"),
  comboResetButton: document.getElementById("comboResetButton"),
  comboTableBody: document.getElementById("comboTableBody"),
  comboDetailCard: document.getElementById("comboDetailCard"),
  addComboRuleButton: document.getElementById("addComboRuleButton"),
  comboTemplateButton: document.getElementById("comboTemplateButton"),
  comboImportButton: document.getElementById("comboImportButton"),
  comboExportButton: document.getElementById("comboExportButton"),
  comboImportFileInput: document.getElementById("comboImportFileInput"),
  comboListTypeFilter: document.getElementById("comboListTypeFilter"),
  comboListKeywordFilter: document.getElementById("comboListKeywordFilter"),
  comboListSearchButton: document.getElementById("comboListSearchButton"),
  comboListAddButton: document.getElementById("comboListAddButton"),
  comboListTemplateButton: document.getElementById("comboListTemplateButton"),
  comboListImportButton: document.getElementById("comboListImportButton"),
  comboListBatchButton: document.getElementById("comboListBatchButton"),
  comboListExportButton: document.getElementById("comboListExportButton"),
  comboListImportFileInput: document.getElementById("comboListImportFileInput"),
  comboMainTableBody: document.getElementById("comboMainTableBody"),
  comboRecordText: document.getElementById("comboRecordText"),
  comboPagination: document.getElementById("comboPagination"),
  comboRuleModal: document.getElementById("comboRuleModal"),
  comboRuleModalModeLabel: document.getElementById("comboRuleModalModeLabel"),
  comboRuleModalTitle: document.getElementById("comboRuleModalTitle"),
  comboRuleBanner: document.getElementById("comboRuleBanner"),
  comboUpstreamHospitalSelect: document.getElementById("comboUpstreamHospitalSelect"),
  comboDeliveryHospitalSelect: document.getElementById("comboDeliveryHospitalSelect"),
  comboUpstreamNameInput: document.getElementById("comboUpstreamNameInput"),
  comboUpstreamCodeInput: document.getElementById("comboUpstreamCodeInput"),
  comboMappingTypeSelect: document.getElementById("comboMappingTypeSelect"),
  comboDisplayNameInput: document.getElementById("comboDisplayNameInput"),
  comboOrderDisplayInput: document.getElementById("comboOrderDisplayInput"),
  comboPlatformItemsInput: document.getElementById("comboPlatformItemsInput"),
  comboDeliveryItemsInput: document.getElementById("comboDeliveryItemsInput"),
  comboPriceModeSelect: document.getElementById("comboPriceModeSelect"),
  comboPriceValueInput: document.getElementById("comboPriceValueInput"),
  comboAiSplitButton: document.getElementById("comboAiSplitButton"),
  comboAiResultBox: document.getElementById("comboAiResultBox"),
  comboPlatformCountPreview: document.getElementById("comboPlatformCountPreview"),
  comboDeliveryCountPreview: document.getElementById("comboDeliveryCountPreview"),
  comboExampleSource: document.getElementById("comboExampleSource"),
  comboExamplePlatform: document.getElementById("comboExamplePlatform"),
  comboExampleDelivery: document.getElementById("comboExampleDelivery"),
  comboSaveRuleButton: document.getElementById("comboSaveRuleButton"),
  comboBatchModal: document.getElementById("comboBatchModal"),
  comboBatchTableBody: document.getElementById("comboBatchTableBody"),
  comboBatchAiButton: document.getElementById("comboBatchAiButton"),
  comboBatchSaveButton: document.getElementById("comboBatchSaveButton"),
  toastStack: document.getElementById("toastStack"),
};

const modalityOptions = Array.from(new Set(platformItems.map((item) => item.modality)));

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function getCurrentHospital() {
  return state.hospitals.find((hospital) => hospital.id === state.selectedHospitalId);
}

function getHospitalById(hospitalId) {
  return state.hospitals.find((hospital) => hospital.id === hospitalId) || null;
}

function getPlatformItemById(itemId) {
  return platformItems.find((item) => item.id === itemId) || null;
}

function getExecutionHospitals() {
  return state.hospitals.filter((hospital) => hospital.type === 2);
}

function getEligibleDevices(hospitalId = state.selectedHospitalId) {
  return devices.filter((device) => device.hospitalIds.includes(hospitalId));
}

function getRowDeviceText(row) {
  const labels = getEligibleDevices(row.hospitalId)
    .filter((device) => row.deviceIds.includes(device.id))
    .map((device) => device.label);
  return labels.join(" / ") || "未绑定";
}

function formatAmount(value) {
  const numeric = Number(value || 0);
  return numeric.toFixed(2).replace(/\.?0+$/, "");
}

function formatDateTime(value = new Date()) {
  const date = value instanceof Date ? value : new Date(value);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  const hours = `${date.getHours()}`.padStart(2, "0");
  const minutes = `${date.getMinutes()}`.padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

function getEffectiveRatio(value, fallback) {
  if (value === null || value === undefined || value === "") {
    return Number(fallback || 100);
  }
  return Number(value);
}

function getHospitalAmount(row) {
  return Number(row.checkPrice || 0) + Number(row.consumPrice || 0) + Number(row.drugPrice || 0);
}

function getPlatformAmount(row) {
  const hospital = getHospitalById(row.hospitalId) || getCurrentHospital();
  const checkRatio = getEffectiveRatio(row.checkRatio, hospital.defaultCheckRatio);
  const consumRatio = getEffectiveRatio(row.consumRatio, hospital.defaultConsumRatio);
  const drugRatio = getEffectiveRatio(row.drugRatio, hospital.defaultDrugRatio);

  return Number(row.checkPrice || 0) * checkRatio / 100
    + Number(row.consumPrice || 0) * consumRatio / 100
    + Number(row.drugPrice || 0) * drugRatio / 100;
}

function getDisplayedRows() {
  const keyword = state.filters.keyword.trim();
  return state.rows.filter((row) => {
    if (row.hospitalId !== state.selectedHospitalId) return false;
    if (state.filters.modality && row.modality !== state.filters.modality) return false;
    if (!keyword) return true;
    const platform = getPlatformItemById(row.platformItemId);
    return [
      row.itemCode,
      row.itemName,
      platform?.itemCode,
      platform?.itemName,
      getRowDeviceText(row),
    ].some((value) => String(value || "").includes(keyword));
  });
}

function isMockFullState() {
  return state.selectedHospitalId === 301 && !state.filters.modality && !state.filters.keyword.trim();
}

function getVisibleTotal() {
  return isMockFullState() ? state.mockTotalRecords : getDisplayedRows().length;
}

function getTotalPages() {
  return Math.max(1, Math.ceil(getVisibleTotal() / state.pageSize));
}

function getPagedRows() {
  const rows = getDisplayedRows();
  if (isMockFullState()) {
    return rows;
  }
  const totalPages = Math.max(1, Math.ceil(rows.length / state.pageSize));
  state.page = Math.min(state.page, totalPages);
  const start = (state.page - 1) * state.pageSize;
  return rows.slice(start, start + state.pageSize);
}

function createVerifyCode() {
  const chars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
  let code = "";
  for (let index = 0; index < 4; index += 1) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  state.verifyCode = code;
  refs.refreshCaptcha.textContent = code;
}

function showToast(title, body, type = "success") {
  if (!refs.toastStack) return;
  const toast = document.createElement("div");
  toast.className = `toast toast--${type}`;
  toast.innerHTML = `<strong>${escapeHtml(title)}</strong><span>${escapeHtml(body)}</span>`;
  refs.toastStack.appendChild(toast);
  window.setTimeout(() => toast.remove(), 2600);
}

function renderTopBar() {
  if (!refs.hospitalSwitchButton) return;
  const hospital = getCurrentHospital();
  refs.hospitalSwitchButton.textContent = `${hospital.name} - ${hospital.typeLabel}`;
}

function renderFilterOptions() {
  if (refs.modalityFilter) {
    refs.modalityFilter.innerHTML = [
      '<option value="">检查类型</option>',
      ...modalityOptions.map((modality) => `<option value="${modality}">${modality}</option>`),
    ].join("");
    refs.modalityFilter.value = state.filters.modality;
  }

  if (refs.hospitalTypeFilter) {
    refs.hospitalTypeFilter.innerHTML = [
      '<option value="">全部类型</option>',
      '<option value="1">互联网医院</option>',
      '<option value="2">执行机构</option>',
      '<option value="3">报告机构</option>',
    ].join("");
    refs.hospitalTypeFilter.value = state.hospitalModal.type;
  }
}

function getRatioCellText(row, fieldName, priceFieldName) {
  if (!row.showRatios) {
    return "";
  }
  if (Number(row[priceFieldName] || 0) === 0 && fieldName !== "checkRatio") {
    return "";
  }
  const hospital = getHospitalById(row.hospitalId) || getCurrentHospital();
  const fallbackMap = {
    checkRatio: hospital.defaultCheckRatio,
    consumRatio: hospital.defaultConsumRatio,
    drugRatio: hospital.defaultDrugRatio,
  };
  return String(getEffectiveRatio(row[fieldName], fallbackMap[fieldName]));
}

function renderActivePage() {
  refs.pageRoutes.forEach((page) => {
    page.hidden = page.dataset.pageId !== state.activePage;
  });

  refs.pageMenuButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.pageTarget === state.activePage);
  });
}

function getDisplayedComboListRules() {
  const keyword = state.comboFilters.keyword.trim();
  return state.comboRules.filter((rule) => {
    if (state.comboFilters.type && rule.type !== state.comboFilters.type) return false;
    if (!keyword) return true;
    return [
      rule.upstreamOrg,
      rule.upstreamItemCode,
      rule.upstreamItemName,
      rule.comboDisplayName,
      rule.orderDisplayName,
      rule.platformItems.map((item) => item.name).join(" "),
      rule.deliveryHospital,
      rule.deliveryItems.map((item) => item.name).join(" "),
    ].some((value) => String(value || "").includes(keyword));
  });
}

function getComboVisibleTotal() {
  return getDisplayedComboListRules().length;
}

function getComboTotalPages() {
  return Math.max(1, Math.ceil(getComboVisibleTotal() / state.comboPageSize));
}

function getPagedComboRules() {
  const rules = getDisplayedComboListRules();
  const totalPages = getComboTotalPages();
  state.comboPage = Math.min(state.comboPage, totalPages);
  const start = (state.comboPage - 1) * state.comboPageSize;
  return rules.slice(start, start + state.comboPageSize);
}

function getComboPlatformNames(rule) {
  return rule.platformItems.map((item) => item.name).join(" + ") || "待配置";
}

function getComboDeliveryNames(rule) {
  return rule.deliveryItems.map((item) => item.name).join(" + ") || "待配置";
}

function getComboOptionList(values) {
  return Array.from(new Set(values.filter(Boolean)));
}

function renderComboSelectOptions(selectRef, values, currentValue) {
  if (!selectRef) return;
  selectRef.innerHTML = values.map((value) => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`).join("");
  selectRef.value = currentValue;
}

function createBlankComboDraft() {
  return {
    id: null,
    type: "多对多",
    status: "draft",
    upstreamOrg: "成都青藤互联网医院",
    upstreamItemCode: "",
    upstreamItemName: "",
    comboDisplayName: "",
    platformItems: [],
    priceMode: "组合固定价",
    priceValue: "",
    platformPriceSummary: "",
    deliveryMode: "多个执行项目",
    deliveryHospital: "南昌一脉阳光医学诊断中心",
    deliveryItems: [],
    orderDisplayName: "",
    orderSourceName: "",
    orderDetails: [],
    statusLabel: "待审核",
    statusHint: "组合规则已创建，待补全拆解与下发信息。",
    aiHint: "输入上游项目名称后，点击“AI 拆解”生成组合拆解建议。",
    updatedAt: formatDateTime(),
  };
}

function inferDeliveryModeFromItems(items) {
  if (!items.length) return "待配置";
  if (items.length === 1) {
    return items[0].name.includes("套餐") ? "中心组合项目" : "单执行项目";
  }
  return items.some((item) => item.name.includes("加收")) ? "主项目+加收项" : "多个执行项目";
}

function getComboStatusMeta(draft) {
  const hasPlatformItems = draft.platformItems.length > 0;
  const hasDeliveryItems = draft.deliveryItems.length > 0;
  const trimmedPriceValue = String(draft.priceValue || "").trim();
  const hasPriceValue = draft.priceMode === "明细价格相加" || (trimmedPriceValue && !trimmedPriceValue.includes("待"));

  if (hasPlatformItems && hasDeliveryItems && hasPriceValue) {
    return {
      status: "enabled",
      statusLabel: "已启用",
      statusHint: "命中后可直接拆解平台项目并下发执行机构。",
    };
  }

  if (hasPlatformItems || hasDeliveryItems) {
    return {
      status: "pending",
      statusLabel: "待补配置",
      statusHint: "组合拆解已建立，但价格或执行映射仍需补齐。",
    };
  }

  return {
    status: "draft",
    statusLabel: "待审核",
    statusHint: "当前仅保存基础信息，尚未形成可用的组合规则。",
  };
}

function getComboAiSuggestion(name) {
  const keyword = String(name || "").replace(/\s+/g, "");

  if (keyword.includes("MRI") && keyword.includes("头") && keyword.includes("血管")) {
    return {
      type: "多对多",
      comboDisplayName: "颅脑MR平扫+头颅动脉MRA",
      orderDisplayName: "颅脑MR平扫+头颅动脉MRA",
      platformItems: [
        { code: "P001", name: "颅脑MR平扫" },
        { code: "P002", name: "头颅动脉MRA" },
      ],
      deliveryHospital: "南昌一脉阳光医学诊断中心",
      deliveryItems: [
        { name: "头部MR平扫", role: "主执行项目", note: "映射平台平扫项目" },
        { name: "血管扫描加收项", role: "附加执行项目", note: "映射血管扫描能力" },
      ],
      priceMode: "组合固定价",
      priceValue: "746.66",
      analysis: "建议拆解为 “颅脑MR平扫 + 头颅动脉MRA”，交付中心按 “头部MR平扫 + 血管扫描加收项” 下发；未命中组合规则时仍走原检查项目对码。",
    };
  }

  if (keyword.includes("胸部") && keyword.includes("上腹部")) {
    return {
      type: "一对多",
      comboDisplayName: "胸部CT平扫+上腹部CT平扫",
      orderDisplayName: "胸部CT平扫+上腹部CT平扫",
      platformItems: [
        { code: "P021", name: "胸部CT平扫" },
        { code: "P022", name: "上腹部CT平扫" },
      ],
      deliveryHospital: "江西一脉阳光影像中心",
      deliveryItems: [
        { name: "胸部CT平扫", role: "执行项目 1", note: "拆分执行" },
        { name: "上腹部CT平扫", role: "执行项目 2", note: "拆分执行" },
      ],
      priceMode: "明细价格相加",
      priceValue: "按明细汇总",
      analysis: "建议拆成两个平台标准项目并分别下发执行，适合兼容当前交付中心逐项接单模式。",
    };
  }

  if (keyword.includes("增强") && (keyword.includes("颅脑") || keyword.includes("MR"))) {
    return {
      type: "多对一",
      comboDisplayName: "颅脑MR平扫+增强加收项",
      orderDisplayName: "颅脑MR平扫+增强加收项",
      platformItems: [
        { code: "P031", name: "颅脑MR平扫" },
        { code: "P032", name: "增强加收项" },
      ],
      deliveryHospital: "南昌一脉阳光医学诊断中心",
      deliveryItems: [
        { name: "头部MR平扫+增强套餐", role: "组合执行项目", note: "中心侧已存在套餐能力" },
      ],
      priceMode: "按交付中心价格",
      priceValue: "待中心报价",
      analysis: "建议先拆平台标准项目，再按中心套餐项目一条下发，兼容已有套餐执行模式。",
    };
  }

  return null;
}

function applyComboSuggestion(draft, suggestion) {
  if (!suggestion) return;
  draft.type = suggestion.type;
  draft.comboDisplayName = suggestion.comboDisplayName;
  draft.orderDisplayName = suggestion.orderDisplayName;
  draft.platformItems = suggestion.platformItems.map((item) => ({ ...item }));
  draft.deliveryHospital = suggestion.deliveryHospital;
  draft.deliveryItems = suggestion.deliveryItems.map((item) => ({ ...item }));
  draft.priceMode = suggestion.priceMode;
  draft.priceValue = suggestion.priceValue;
  draft.aiHint = suggestion.analysis;
}

function renderComboHospitalOptions(draft) {
  const upstreamOptions = getComboOptionList([
    ...state.hospitals.filter((hospital) => hospital.type === 1).map((hospital) => hospital.name),
    ...state.comboRules.map((rule) => rule.upstreamOrg),
    draft.upstreamOrg,
  ]);
  const deliveryOptions = getComboOptionList([
    ...getExecutionHospitals().map((hospital) => hospital.name),
    ...state.comboRules.map((rule) => rule.deliveryHospital),
    draft.deliveryHospital,
  ]);

  renderComboSelectOptions(refs.comboUpstreamHospitalSelect, upstreamOptions, draft.upstreamOrg);
  renderComboSelectOptions(refs.comboDeliveryHospitalSelect, deliveryOptions, draft.deliveryHospital);
}

function getComboPlatformText(draft) {
  return draft.platformItems.map((item) => item.name).join("\n");
}

function getComboDeliveryText(draft) {
  return draft.deliveryItems.map((item) => item.name).join("\n");
}

function renderComboExampleBlock(target, items, emptyText) {
  if (!target) return;
  if (!items.length) {
    target.textContent = emptyText;
    return;
  }
  target.innerHTML = `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

function syncComboModalSummary() {
  const draft = state.comboModal.draft;
  if (!draft) return;

  if (refs.comboPlatformCountPreview) {
    refs.comboPlatformCountPreview.textContent = String(draft.platformItems.length);
  }

  if (refs.comboDeliveryCountPreview) {
    refs.comboDeliveryCountPreview.textContent = String(draft.deliveryItems.length);
  }

  if (refs.comboExampleSource) {
    refs.comboExampleSource.innerHTML = `${escapeHtml(draft.upstreamOrg || "待选择开单机构")}<br/>${escapeHtml(draft.upstreamItemName || "待输入上游项目名称")}`;
  }

  renderComboExampleBlock(
    refs.comboExamplePlatform,
    draft.platformItems.map((item) => item.name),
    "待配置平台标准项目",
  );

  renderComboExampleBlock(
    refs.comboExampleDelivery,
    draft.deliveryItems.map((item) => item.name),
    "待配置执行项目",
  );
}

function renderComboRuleModal() {
  const draft = state.comboModal.draft;
  if (!draft) return;

  renderComboHospitalOptions(draft);
  refs.comboRuleModalModeLabel.textContent = state.comboModal.mode === "create" ? "新增规则" : "编辑规则";
  refs.comboRuleModalTitle.textContent = state.comboModal.mode === "create" ? "新增组合规则" : "编辑组合规则";
  refs.comboRuleBanner.textContent = "命中组合规则后，先拆平台标准项目，再映射执行机构项目；未命中时仍走原检查项目对码。";
  refs.comboUpstreamNameInput.value = draft.upstreamItemName;
  refs.comboUpstreamCodeInput.value = draft.upstreamItemCode;
  refs.comboMappingTypeSelect.value = draft.type;
  refs.comboDisplayNameInput.value = draft.comboDisplayName;
  refs.comboOrderDisplayInput.value = draft.orderDisplayName;
  refs.comboPlatformItemsInput.value = getComboPlatformText(draft);
  refs.comboDeliveryItemsInput.value = getComboDeliveryText(draft);
  refs.comboPriceModeSelect.value = draft.priceMode;
  refs.comboPriceValueInput.value = draft.priceValue;
  refs.comboAiResultBox.innerHTML = draft.aiHint || state.comboModal.analysis;
  syncComboModalSummary();
}

function parseComboLines(text) {
  return String(text || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function syncComboDraftFromInputs() {
  const draft = state.comboModal.draft;
  if (!draft) return;

  draft.upstreamOrg = refs.comboUpstreamHospitalSelect?.value || draft.upstreamOrg;
  draft.deliveryHospital = refs.comboDeliveryHospitalSelect?.value || draft.deliveryHospital;
  draft.upstreamItemName = refs.comboUpstreamNameInput?.value || "";
  draft.upstreamItemCode = refs.comboUpstreamCodeInput?.value || "";
  draft.type = refs.comboMappingTypeSelect?.value || draft.type;
  draft.comboDisplayName = refs.comboDisplayNameInput?.value || "";
  draft.orderDisplayName = refs.comboOrderDisplayInput?.value || draft.comboDisplayName;
  draft.platformItems = parseComboLines(refs.comboPlatformItemsInput?.value).map((name, index) => ({
    code: `AUTO${index + 1}`,
    name,
  }));
  draft.deliveryItems = parseComboLines(refs.comboDeliveryItemsInput?.value).map((name, index) => ({
    name,
    role: draft.deliveryItems[index]?.role || `执行项目 ${index + 1}`,
    note: draft.deliveryItems[index]?.note || "由组合对码规则拆解生成",
  }));
  draft.priceMode = refs.comboPriceModeSelect?.value || draft.priceMode;
  draft.priceValue = refs.comboPriceValueInput?.value || "";
  draft.orderSourceName = draft.upstreamItemName;
  draft.orderDetails = draft.platformItems.map((item) => item.name);
  draft.deliveryMode = inferDeliveryModeFromItems(draft.deliveryItems);
  draft.platformPriceSummary = draft.priceMode === "明细价格相加"
    ? "按平台标准项目明细汇总"
    : draft.priceValue || "待补价格";

  const statusMeta = getComboStatusMeta(draft);
  draft.status = statusMeta.status;
  draft.statusLabel = statusMeta.statusLabel;
  draft.statusHint = statusMeta.statusHint;
  syncComboModalSummary();
}

function openComboRuleModal(mode, ruleId = null) {
  state.comboModal.mode = mode;

  if (mode === "edit") {
    const target = state.comboRules.find((rule) => rule.id === ruleId);
    if (!target) return;
    state.comboModal.draft = JSON.parse(JSON.stringify(target));
  } else {
    state.comboModal.draft = createBlankComboDraft();
  }

  refs.comboRuleModal.hidden = false;
  renderComboRuleModal();
}

function saveComboRule() {
  const draft = state.comboModal.draft;
  if (!draft) return;
  syncComboDraftFromInputs();

  if (!draft.upstreamItemName.trim()) {
    showToast("保存失败", "请输入上游项目名称", "warning");
    return;
  }
  if (!draft.upstreamItemCode.trim()) {
    showToast("保存失败", "请输入上游项目编码", "warning");
    return;
  }
  if (!draft.comboDisplayName.trim()) {
    showToast("保存失败", "请输入平台展示项目", "warning");
    return;
  }
  if (!draft.platformItems.length) {
    showToast("保存失败", "请至少配置一个平台标准项目", "warning");
    return;
  }
  if (!draft.deliveryItems.length) {
    showToast("保存失败", "请至少配置一个执行项目", "warning");
    return;
  }

  draft.updatedAt = formatDateTime();
  draft.orderDisplayName = draft.orderDisplayName || draft.comboDisplayName;
  draft.aiHint = refs.comboAiResultBox?.innerHTML || draft.aiHint;

  if (state.comboModal.mode === "edit") {
    state.comboRules = state.comboRules.map((rule) => rule.id === draft.id ? { ...draft } : rule);
    showToast("保存成功", "组合规则已更新。");
  } else {
    draft.id = Math.max(0, ...state.comboRules.map((rule) => rule.id)) + 1;
    state.comboRules.unshift({ ...draft });
    showToast("新增成功", "组合规则已加入当前列表。");
  }

  state.comboPage = 1;
  closeModal("comboRuleModal");
  renderWorkspace();
}

function deleteComboRule(ruleId) {
  const target = state.comboRules.find((rule) => rule.id === ruleId);
  if (!target) return;
  const shouldDelete = window.confirm(`确定删除组合规则“${target.upstreamItemName}”吗？`);
  if (!shouldDelete) return;
  state.comboRules = state.comboRules.filter((rule) => rule.id !== ruleId);
  renderWorkspace();
  showToast("删除成功", "组合规则已从当前列表移除。");
}

function renderComboListTable() {
  if (!refs.comboMainTableBody) return;
  const rules = getPagedComboRules();
  if (!rules.length) {
    refs.comboMainTableBody.innerHTML = '<tr><td colspan="13"><div class="empty-state">当前筛选条件下暂无组合规则</div></td></tr>';
    return;
  }

  refs.comboMainTableBody.innerHTML = rules.map((rule) => `
    <tr>
      <td class="combo-cell-text">${escapeHtml(rule.upstreamOrg)}</td>
      <td class="cell-ellipsis">${escapeHtml(rule.upstreamItemCode)}</td>
      <td class="combo-cell-text">${escapeHtml(rule.upstreamItemName)}</td>
      <td><span class="combo-tag">${escapeHtml(rule.type)}</span></td>
      <td class="combo-cell-text">${escapeHtml(rule.comboDisplayName)}</td>
      <td class="combo-cell-text">${escapeHtml(getComboPlatformNames(rule))}</td>
      <td class="combo-cell-text">${escapeHtml(rule.deliveryHospital)}</td>
      <td class="combo-cell-text">${escapeHtml(getComboDeliveryNames(rule))}</td>
      <td>
        <strong>${escapeHtml(rule.priceMode)}</strong>
        <span class="combo-table-meta">${escapeHtml(rule.priceValue)}</span>
      </td>
      <td class="combo-cell-text">${escapeHtml(rule.orderDisplayName)}</td>
      <td>
        <span class="status-chip status-chip--${getComboStatusClass(rule.status)}">${escapeHtml(rule.statusLabel)}</span>
        <span class="combo-table-hint">${escapeHtml(rule.statusHint)}</span>
      </td>
      <td>${escapeHtml(rule.updatedAt)}</td>
      <td>
        <div class="cell-action">
          <button class="btn-link" type="button" data-combo-list-action="edit" data-combo-rule-id="${rule.id}">编辑</button>
          <button class="btn-link btn-link--danger" type="button" data-combo-list-action="delete" data-combo-rule-id="${rule.id}">删除</button>
        </div>
      </td>
    </tr>
  `).join("");
}

function renderComboPagination() {
  if (!refs.comboRecordText || !refs.comboPagination) return;
  const totalRecords = getComboVisibleTotal();
  const totalPages = getComboTotalPages();
  state.comboPage = Math.min(state.comboPage, totalPages);

  const start = totalRecords === 0 ? 0 : (state.comboPage - 1) * state.comboPageSize + 1;
  const end = Math.min(totalRecords, state.comboPage * state.comboPageSize);
  refs.comboRecordText.textContent = `共${totalRecords}条记录 当前显示${start}-${end}条记录`;

  const tokens = getVisiblePageTokens(totalPages, state.comboPage);
  const html = [];

  html.push(`
    <button
      class="pagination__page ${state.comboPage === 1 ? "is-disabled" : ""}"
      type="button"
      data-combo-page="${Math.max(1, state.comboPage - 1)}"
    >‹</button>
  `);

  tokens.forEach((token) => {
    if (token === "ellipsis") {
      html.push('<span class="pagination__ellipsis">…</span>');
      return;
    }
    html.push(`
      <button
        class="pagination__page ${token === state.comboPage ? "is-active" : ""}"
        type="button"
        data-combo-page="${token}"
      >${token}</button>
    `);
  });

  html.push(`
    <button
      class="pagination__page ${state.comboPage === totalPages ? "is-disabled" : ""}"
      type="button"
      data-combo-page="${Math.min(totalPages, state.comboPage + 1)}"
    >›</button>
  `);

  html.push(`
    <select class="pagination__select" id="comboPageSizeSelect" aria-label="每页条数">
      ${[10, 20, 30, 50].map((size) => `<option value="${size}" ${size === state.comboPageSize ? "selected" : ""}>${size}条/页</option>`).join("")}
    </select>
  `);

  html.push(`
    <label class="pagination__goto">
      <span>前往</span>
      <input class="pagination__goto-input" id="comboGotoPageInput" type="number" min="1" max="${totalPages}" value="${state.comboPage}" />
      <span>页</span>
    </label>
  `);

  refs.comboPagination.innerHTML = html.join("");
}

function renderComboCopyPage() {
  if (!refs.comboMainTableBody) return;
  refs.comboListTypeFilter.value = state.comboFilters.type;
  refs.comboListKeywordFilter.value = state.comboFilters.keyword;
  renderComboListTable();
  renderComboPagination();
}

function renderComboBatchTable() {
  if (!refs.comboBatchTableBody) return;
  if (!state.comboBatchModal.rows.length) {
    refs.comboBatchTableBody.innerHTML = '<tr><td colspan="5"><div class="empty-state">当前筛选条件下暂无可批量处理组合规则</div></td></tr>';
    return;
  }

  refs.comboBatchTableBody.innerHTML = state.comboBatchModal.rows.map((rule) => `
    <tr>
      <td>${escapeHtml(rule.upstreamItemName)}</td>
      <td><div class="batch-row-note">${escapeHtml(rule.batchNote || "尚未执行 AI 拆解")}</div></td>
      <td class="combo-cell-text">${escapeHtml(getComboPlatformNames(rule))}</td>
      <td class="combo-cell-text">${escapeHtml(getComboDeliveryNames(rule))}</td>
      <td><span class="status-chip status-chip--${getComboStatusClass(rule.status)}">${escapeHtml(rule.statusLabel)}</span></td>
    </tr>
  `).join("");
}

function openComboBatchModal() {
  state.comboBatchModal.rows = getDisplayedComboListRules().map((rule) => ({
    ...JSON.parse(JSON.stringify(rule)),
    batchNote: rule.aiHint || "当前规则已存在，可重新执行 AI 拆解覆盖建议。",
  }));
  refs.comboBatchModal.hidden = false;
  renderComboBatchTable();
}

function runComboBatchAi() {
  state.comboBatchModal.rows = state.comboBatchModal.rows.map((rule) => {
    const suggestion = getComboAiSuggestion(rule.upstreamItemName);
    if (!suggestion) {
      return {
        ...rule,
        status: "pending",
        statusLabel: "待补配置",
        batchNote: "AI 未命中明确组合规则，请人工补充拆解。",
      };
    }

    const nextRule = JSON.parse(JSON.stringify(rule));
    applyComboSuggestion(nextRule, suggestion);
    const statusMeta = getComboStatusMeta(nextRule);
    nextRule.status = statusMeta.status;
    nextRule.statusLabel = statusMeta.statusLabel;
    nextRule.statusHint = statusMeta.statusHint;
    nextRule.deliveryMode = inferDeliveryModeFromItems(nextRule.deliveryItems);
    nextRule.platformPriceSummary = nextRule.priceMode === "明细价格相加"
      ? "按平台标准项目明细汇总"
      : nextRule.priceValue || "待补价格";
    nextRule.batchNote = suggestion.analysis;
    return nextRule;
  });

  renderComboBatchTable();
  showToast("AI 批量拆解完成", `已处理 ${state.comboBatchModal.rows.length} 条组合规则。`);
}

function saveComboBatch() {
  const updated = new Map(state.comboBatchModal.rows.map((rule) => [rule.id, rule]));
  state.comboRules = state.comboRules.map((rule) => updated.get(rule.id) ? { ...updated.get(rule.id) } : rule);
  closeModal("comboBatchModal");
  renderWorkspace();
  showToast("批量保存成功", "组合对码批量处理结果已同步到列表。");
}

function getDisplayedComboRules() {
  const keyword = state.comboFilters.keyword.trim();
  return state.comboRules.filter((rule) => {
    if (state.comboFilters.type && rule.type !== state.comboFilters.type) return false;
    if (state.comboFilters.status && rule.status !== state.comboFilters.status) return false;
    if (!keyword) return true;
    const haystacks = [
      rule.upstreamOrg,
      rule.upstreamItemCode,
      rule.upstreamItemName,
      rule.comboDisplayName,
      rule.platformItems.map((item) => item.name).join(" "),
      rule.deliveryHospital,
    ];
    return haystacks.some((value) => String(value || "").includes(keyword));
  });
}

function getComboStatusClass(status) {
  if (status === "enabled") return "matched";
  if (status === "pending") return "pending";
  return "draft";
}

function getSelectedComboRule() {
  const visibleRules = getDisplayedComboRules();
  const selected = visibleRules.find((rule) => rule.id === state.selectedComboRuleId);
  if (selected) return selected;
  return visibleRules[0] || state.comboRules[0] || null;
}

function ensureSelectedComboRule() {
  const visibleRules = getDisplayedComboRules();
  if (!visibleRules.length) return;
  if (!visibleRules.some((rule) => rule.id === state.selectedComboRuleId)) {
    state.selectedComboRuleId = visibleRules[0].id;
  }
}

function renderComboOverview() {
  if (!refs.comboTotalCount || !refs.comboReadyCount || !refs.comboRiskCount) return;
  const visibleRules = getDisplayedComboRules();
  const readyCount = visibleRules.filter((rule) => rule.status === "enabled").length;
  const riskCount = visibleRules.filter((rule) => rule.status !== "enabled").length;

  refs.comboTotalCount.textContent = String(visibleRules.length);
  refs.comboReadyCount.textContent = String(readyCount);
  refs.comboRiskCount.textContent = String(riskCount);
}

function renderComboTable() {
  if (!refs.comboTableBody) return;
  const visibleRules = getDisplayedComboRules();
  if (!visibleRules.length) {
    refs.comboTableBody.innerHTML = '<tr><td colspan="9"><div class="empty-state">当前筛选条件下暂无组合规则</div></td></tr>';
    return;
  }

  refs.comboTableBody.innerHTML = visibleRules.map((rule) => `
    <tr class="${rule.id === state.selectedComboRuleId ? "is-selected" : ""}" data-combo-rule-id="${rule.id}">
      <td>
        <div class="combo-origin">
          <strong>${escapeHtml(rule.upstreamItemName)}</strong>
          <span>${escapeHtml(rule.upstreamOrg)}</span>
          <small>编码：${escapeHtml(rule.upstreamItemCode)}</small>
        </div>
      </td>
      <td><span class="combo-tag">${escapeHtml(rule.type)}</span></td>
      <td>
        <strong>${escapeHtml(rule.comboDisplayName)}</strong>
        <span class="combo-table-meta">订单主表展示组合名，保留原医嘱名用于追溯</span>
      </td>
      <td>
        <div class="combo-stack">
          ${rule.platformItems.map((item) => `<span class="combo-chip">${escapeHtml(item.name)}</span>`).join("")}
        </div>
      </td>
      <td>
        <strong>${escapeHtml(rule.priceMode)}</strong>
        <span class="combo-table-meta">${escapeHtml(rule.priceValue)}</span>
      </td>
      <td>
        <strong>${escapeHtml(rule.deliveryMode)}</strong>
        <span class="combo-table-meta">${escapeHtml(rule.deliveryHospital)}</span>
      </td>
      <td>
        <span class="status-chip status-chip--${getComboStatusClass(rule.status)}">${escapeHtml(rule.statusLabel)}</span>
        <span class="combo-table-hint">${escapeHtml(rule.statusHint)}</span>
      </td>
      <td>${escapeHtml(rule.updatedAt)}</td>
      <td>
        <div class="cell-action">
          <button class="btn-link" type="button" data-combo-action="view" data-combo-rule-id="${rule.id}">查看示例</button>
        </div>
      </td>
    </tr>
  `).join("");
}

function renderComboDetail() {
  if (!refs.comboDetailCard) return;
  const rule = getSelectedComboRule();
  if (!rule) {
    refs.comboDetailCard.innerHTML = '<div class="empty-state">暂无可展示的组合规则详情</div>';
    return;
  }

  state.selectedComboRuleId = rule.id;

  refs.comboDetailCard.innerHTML = `
    <div class="combo-detail-card__head">
      <span class="detail-tag">示例规则</span>
      <h3>${escapeHtml(rule.upstreamItemName)}</h3>
      <p>${escapeHtml(rule.comboDisplayName)}</p>
    </div>

    <dl class="combo-meta-grid">
      <div>
        <dt>对码类型</dt>
        <dd>${escapeHtml(rule.type)}</dd>
      </div>
      <div>
        <dt>规则状态</dt>
        <dd>${escapeHtml(rule.statusLabel)}</dd>
      </div>
      <div>
        <dt>组合展示名</dt>
        <dd>${escapeHtml(rule.comboDisplayName)}</dd>
      </div>
      <div>
        <dt>价格方式</dt>
        <dd>${escapeHtml(rule.priceMode)}</dd>
      </div>
    </dl>

    <section class="combo-section">
      <h4 class="combo-section__title">平台标准项目</h4>
      <div class="combo-chip-list">
        ${rule.platformItems.map((item) => `<span class="combo-chip">${escapeHtml(item.code)} · ${escapeHtml(item.name)}</span>`).join("")}
      </div>
    </section>

    <section class="combo-section">
      <h4 class="combo-section__title">交付中心执行项目</h4>
      <div class="combo-delivery-list">
        ${rule.deliveryItems.map((item) => `
          <div class="combo-delivery-item">
            <strong>${escapeHtml(item.name)}</strong>
            <span>${escapeHtml(item.role)}</span>
            <small>${escapeHtml(item.note)}</small>
          </div>
        `).join("")}
      </div>
    </section>

    <section class="combo-section">
      <h4 class="combo-section__title">价格与下发示例</h4>
      <div class="combo-price-grid">
        <article class="combo-price-card">
          <span>价格方式</span>
          <strong>${escapeHtml(rule.priceMode)}</strong>
          <p>${escapeHtml(rule.priceValue)}</p>
        </article>
        <article class="combo-price-card">
          <span>平台明细</span>
          <strong>${escapeHtml(rule.platformPriceSummary)}</strong>
          <p>${escapeHtml(`${rule.upstreamOrg} · 编码 ${rule.upstreamItemCode}`)}</p>
        </article>
        <article class="combo-price-card">
          <span>交付中心下发</span>
          <strong>${escapeHtml(rule.deliveryMode)}</strong>
          <p>${escapeHtml(rule.deliveryHospital)}</p>
        </article>
      </div>
    </section>

    <section class="combo-section">
      <h4 class="combo-section__title">订单展示效果</h4>
      <div class="combo-demo-grid">
        <article class="combo-demo-card">
          <span>患者侧展示</span>
          <strong>${escapeHtml(rule.orderDisplayName)}</strong>
          <p>原医嘱名：${escapeHtml(rule.orderSourceName)}<br/>支付金额：${escapeHtml(rule.priceValue)}</p>
        </article>
        <article class="combo-demo-card">
          <span>订单主表</span>
          <strong>对码类型：${escapeHtml(rule.type)}</strong>
          <p>主订单仅展示组合项目名，保留原医嘱编码与原医嘱名称用于追溯。</p>
        </article>
        <article class="combo-demo-card">
          <span>订单明细</span>
          <strong>拆分后的平台项目</strong>
          <ul>
            ${rule.orderDetails.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
          </ul>
        </article>
      </div>
    </section>
  `;
}

function renderComboModule() {
  if (!refs.comboTableBody || !refs.comboDetailCard) return;
  refs.comboTypeFilter.value = state.comboFilters.type;
  refs.comboStatusFilter.value = state.comboFilters.status;
  refs.comboKeywordFilter.value = state.comboFilters.keyword;
  ensureSelectedComboRule();
  renderComboOverview();
  renderComboTable();
  renderComboDetail();
}

function renderTable() {
  if (!refs.tableBody) return;
  const rows = getPagedRows();
  if (!rows.length) {
    refs.tableBody.innerHTML = '<tr><td colspan="14"><div class="empty-state">当前筛选条件下暂无项目</div></td></tr>';
    return;
  }

  refs.tableBody.innerHTML = rows.map((row) => {
    const platform = getPlatformItemById(row.platformItemId);
    return `
      <tr>
        <td class="cell-ellipsis">${escapeHtml(row.itemCode)}</td>
        <td class="cell-ellipsis">${escapeHtml(row.itemName)}</td>
        <td class="cell-ellipsis ${platform ? "" : "cell-empty"}">${escapeHtml(platform?.itemCode || "")}</td>
        <td class="cell-ellipsis ${platform ? "" : "cell-empty"}">${escapeHtml(platform?.itemName || "")}</td>
        <td class="cell-ellipsis">${escapeHtml(getRowDeviceText(row))}</td>
        <td>${formatAmount(getHospitalAmount(row))}</td>
        <td>${formatAmount(getPlatformAmount(row))}</td>
        <td>${formatAmount(row.checkPrice)}</td>
        <td>${escapeHtml(getRatioCellText(row, "checkRatio", "checkPrice"))}</td>
        <td>${formatAmount(row.consumPrice)}</td>
        <td>${escapeHtml(getRatioCellText(row, "consumRatio", "consumPrice"))}</td>
        <td>${formatAmount(row.drugPrice)}</td>
        <td>${escapeHtml(getRatioCellText(row, "drugRatio", "drugPrice"))}</td>
        <td>
          <div class="cell-action">
            <button class="btn-link" type="button" data-action="edit" data-row-id="${row.id}">编辑</button>
            <button class="btn-link btn-link--danger" type="button" data-action="delete" data-row-id="${row.id}">删除</button>
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

function getVisiblePageTokens(totalPages, currentPage) {
  if (totalPages <= 8) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, 6, "ellipsis", totalPages];
  }

  if (currentPage >= totalPages - 3) {
    return [1, "ellipsis", totalPages - 5, totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, "ellipsis", currentPage - 1, currentPage, currentPage + 1, "ellipsis", totalPages];
}

function renderPagination() {
  if (!refs.recordText || !refs.pagination) return;
  const totalRecords = getVisibleTotal();
  const totalPages = getTotalPages();
  state.page = Math.min(state.page, totalPages);

  const visibleCount = Math.min(state.pageSize, totalRecords);
  refs.recordText.textContent = `共${totalRecords}条记录 当前显示${visibleCount}条记录`;

  const tokens = getVisiblePageTokens(totalPages, state.page);
  const html = [];

  html.push(`
    <button
      class="pagination__page ${state.page === 1 ? "is-disabled" : ""}"
      type="button"
      data-page="${Math.max(1, state.page - 1)}"
    >‹</button>
  `);

  tokens.forEach((token) => {
    if (token === "ellipsis") {
      html.push('<span class="pagination__ellipsis">…</span>');
      return;
    }
    html.push(`
      <button
        class="pagination__page ${token === state.page ? "is-active" : ""}"
        type="button"
        data-page="${token}"
      >${token}</button>
    `);
  });

  html.push(`
    <button
      class="pagination__page ${state.page === totalPages ? "is-disabled" : ""}"
      type="button"
      data-page="${Math.min(totalPages, state.page + 1)}"
    >›</button>
  `);

  html.push(`
    <select class="pagination__select" id="pageSizeSelect" aria-label="每页条数">
      ${[10, 20, 30, 50].map((size) => `<option value="${size}" ${size === state.pageSize ? "selected" : ""}>${size}条/页</option>`).join("")}
    </select>
  `);

  html.push(`
    <label class="pagination__goto">
      <span>前往</span>
      <input class="pagination__goto-input" id="gotoPageInput" type="number" min="1" max="${totalPages}" value="${state.page}" />
      <span>页</span>
    </label>
  `);

  refs.pagination.innerHTML = html.join("");
}

function renderHospitalModal() {
  const keyword = state.hospitalModal.keyword.trim();
  const list = state.hospitals.filter((hospital) => {
    if (state.hospitalModal.type && String(hospital.type) !== state.hospitalModal.type) return false;
    if (!keyword) return true;
    return `${hospital.name}${hospital.city}${hospital.typeLabel}`.includes(keyword);
  });

  refs.hospitalGrid.innerHTML = list.map((hospital) => `
    <button class="hospital-card ${hospital.id === state.selectedHospitalId ? "is-active" : ""}" type="button" data-hospital-id="${hospital.id}">
      <div class="hospital-card__head">
        <span class="hospital-card__avatar">${escapeHtml(hospital.shortName)}</span>
        <div>
          <strong>${escapeHtml(hospital.name)}</strong>
          <small>${escapeHtml(`${hospital.city} · ${hospital.typeLabel}`)}</small>
        </div>
      </div>
      <p>${escapeHtml(hospital.description)}</p>
    </button>
  `).join("");
}

function createBlankDraft() {
  return {
    id: null,
    hospitalId: state.selectedHospitalId,
    modality: "",
    itemCode: "",
    itemName: "",
    platformItemId: null,
    deviceIds: [],
    checkPrice: 0,
    checkRatio: null,
    consumPrice: 0,
    consumRatio: null,
    drugPrice: 0,
    drugRatio: null,
    outItemId: "",
    status: "draft",
    showRatios: false,
  };
}

function inferModality(itemName) {
  if (itemName.includes("MR")) return "MR";
  if (itemName.includes("DR")) return "DR";
  if (itemName.includes("CT")) return "CT";
  return "";
}

function renderPlatformOptions(selectedId) {
  refs.platformItemSelect.innerHTML = [
    '<option value="">请选择平台项目</option>',
    ...platformItems.map((item) => `<option value="${item.id}" ${item.id === selectedId ? "selected" : ""}>${escapeHtml(item.itemName)}</option>`),
  ].join("");
  refs.platformItemCodeInput.value = getPlatformItemById(selectedId)?.itemCode || "";
}

function renderDeviceChips() {
  const draft = state.itemModal.draft;
  if (!draft) return;
  const eligible = getEligibleDevices(draft.hospitalId);
  refs.deviceChipList.innerHTML = eligible.map((device) => `
    <button class="device-chip ${draft.deviceIds.includes(device.id) ? "is-selected" : ""}" type="button" data-device-id="${device.id}">
      <span>${escapeHtml(device.label)}</span>
    </button>
  `).join("");
}

function syncItemModalSummary() {
  const draft = state.itemModal.draft;
  if (!draft) return;
  refs.hospitalAmountPreview.textContent = formatAmount(getHospitalAmount(draft));
  refs.platformAmountPreview.textContent = formatAmount(getPlatformAmount(draft));
}

function renderItemModal() {
  const draft = state.itemModal.draft;
  const hospital = getHospitalById(draft.hospitalId) || getCurrentHospital();

  refs.itemModalModeLabel.textContent = state.itemModal.mode === "create" ? "新增项目" : "编辑项目";
  refs.itemModalTitle.textContent = state.itemModal.mode === "create" ? "添加医院项目" : "修改医院项目";
  refs.ratioBanner.textContent = `未设置折扣率时，自动使用当前医院统一折扣率：检查费 ${hospital.defaultCheckRatio}，耗材费 ${hospital.defaultConsumRatio}，药品费 ${hospital.defaultDrugRatio}`;
  refs.itemNameInput.value = draft.itemName;
  refs.itemCodeInput.value = draft.itemCode;
  renderPlatformOptions(draft.platformItemId);
  refs.checkPriceInput.value = draft.checkPrice;
  refs.checkRatioInput.value = draft.checkRatio ?? "";
  refs.consumPriceInput.value = draft.consumPrice;
  refs.consumRatioInput.value = draft.consumRatio ?? "";
  refs.drugPriceInput.value = draft.drugPrice;
  refs.drugRatioInput.value = draft.drugRatio ?? "";
  refs.outItemIdInput.value = draft.outItemId;
  refs.aiResultBox.innerHTML = state.itemModal.analysis;
  renderDeviceChips();
  syncItemModalSummary();
}

function getAiSuggestion(name) {
  const keyword = String(name || "").replace(/\s+/g, "");
  const rules = [
    {
      match: ["腰椎"],
      platformId: 1001,
      analysis: "标准名称：<strong>* CT腰椎(平扫)</strong><br/>匹配理由：命中“腰椎”部位，优先匹配平台标准 CT 腰椎平扫项目。",
    },
    {
      match: ["胎盘"],
      platformId: 1002,
      analysis: "标准名称：<strong>* MR胎盘(平扫)</strong><br/>匹配理由：命中 MR 胎盘检查词条，建议直接绑定平台 MR 胎盘平扫项目。",
    },
    {
      match: ["三维重建"],
      platformId: 1003,
      analysis: "标准名称：<strong>* CT三维重建</strong><br/>匹配理由：命中 CT 三维重建标准项目，可直接完成对码。",
    },
    {
      match: ["临床操作"],
      platformId: 1004,
      analysis: "标准名称：<strong>* CT临床操作项目</strong><br/>匹配理由：命中 CT 临床操作类标准项目。",
    },
    {
      match: ["右跟骨", "左跟骨", "双跟骨", "跟骨"],
      platformId: keyword.includes("双") ? 1005 : keyword.includes("左") ? 1008 : 1006,
      analysis: "标准名称：<strong>* DR跟骨相关项目</strong><br/>匹配理由：命中 DR 跟骨检查词条，建议按左右侧位或双侧位补齐平台项目。",
    },
  ];

  const rule = rules.find((item) => item.match.some((text) => keyword.includes(text)));
  if (!rule) {
    return {
      platformId: null,
      analysis: "未找到明确匹配项，请人工选择平台项目后确认。",
    };
  }
  return rule;
}

function openItemModal(mode, rowId = null) {
  state.itemModal.mode = mode;
  if (mode === "edit") {
    const target = state.rows.find((row) => row.id === rowId);
    if (!target) return;
    state.itemModal.draft = JSON.parse(JSON.stringify(target));
    state.itemModal.analysis = "当前项目已加载，可继续 AI 对码或直接调整费用、设备绑定。";
  } else {
    state.itemModal.draft = createBlankDraft();
    state.itemModal.analysis = "输入医院项目名称后，点击“AI 对码”生成建议平台项目。";
  }
  refs.itemModal.hidden = false;
  renderItemModal();
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.hidden = true;
  }
}

function applyPlatformSelection(itemId) {
  const draft = state.itemModal.draft;
  if (!draft) return;
  const platform = getPlatformItemById(Number(itemId));
  draft.platformItemId = platform ? platform.id : null;
  if (platform) {
    draft.modality = platform.modality;
  }
  refs.platformItemCodeInput.value = platform?.itemCode || "";
  syncItemModalSummary();
}

function saveDraft() {
  const draft = state.itemModal.draft;
  if (!draft.itemName.trim()) {
    showToast("保存失败", "请输入医院项目名称", "warning");
    return;
  }
  if (!draft.itemCode.trim()) {
    showToast("保存失败", "请输入医院项目编码", "warning");
    return;
  }
  if (!draft.platformItemId) {
    showToast("保存失败", "请选择平台项目名称", "warning");
    return;
  }

  draft.modality = getPlatformItemById(draft.platformItemId)?.modality || inferModality(draft.itemName) || draft.modality;
  draft.status = "matched";
  draft.showRatios = [draft.checkRatio, draft.consumRatio, draft.drugRatio].some((value) => value !== null && value !== "");

  if (state.itemModal.mode === "edit") {
    state.rows = state.rows.map((row) => row.id === draft.id ? { ...draft } : row);
    showToast("保存成功", "医院项目已更新。");
  } else {
    draft.id = Math.max(0, ...state.rows.map((row) => row.id)) + 1;
    state.rows.unshift({ ...draft });
    showToast("新增成功", "医院项目已加入当前列表。");
  }

  state.page = 1;
  closeModal("itemModal");
  renderWorkspace();
}

function renderBatchTable() {
  if (!state.batchModal.rows.length) {
    refs.batchTableBody.innerHTML = '<tr><td colspan="5"><div class="empty-state">当前筛选条件下暂无可批量处理项目</div></td></tr>';
    return;
  }

  refs.batchTableBody.innerHTML = state.batchModal.rows.map((row) => {
    const platform = getPlatformItemById(row.platformItemId);
    const statusClass = row.status === "matched" ? "matched" : row.status === "pending" ? "pending" : "draft";
    const statusLabel = row.status === "matched" ? "已对码" : row.status === "pending" ? "待处理" : "草稿";

    return `
      <tr>
        <td>${escapeHtml(row.itemName)}</td>
        <td>${escapeHtml(platform?.itemName || "待 AI 识别")}</td>
        <td>
          <select data-batch-row="${row.id}" class="batch-platform-select">
            <option value="">请选择平台项目</option>
            ${platformItems.map((item) => `<option value="${item.id}" ${item.id === row.platformItemId ? "selected" : ""}>${escapeHtml(item.itemName)}</option>`).join("")}
          </select>
        </td>
        <td><div class="batch-row-note">${escapeHtml(row.batchNote || "尚未执行 AI 分析")}</div></td>
        <td><span class="status-chip status-chip--${statusClass}">${statusLabel}</span></td>
      </tr>
    `;
  }).join("");
}

function openBatchModal() {
  state.batchModal.rows = getDisplayedRows().map((row) => ({
    ...row,
    batchNote: row.status === "matched" ? "当前项目已存在平台映射，可重新覆盖。" : "待执行 AI 批量匹配。",
  }));
  refs.batchModal.hidden = false;
  renderBatchTable();
}

function runBatchAi() {
  state.batchModal.rows = state.batchModal.rows.map((row) => {
    const suggestion = getAiSuggestion(row.itemName);
    return {
      ...row,
      platformItemId: suggestion.platformId || row.platformItemId,
      status: suggestion.platformId ? "matched" : "pending",
      batchNote: suggestion.analysis.replace(/<br\/>/g, " ").replace(/<[^>]+>/g, ""),
    };
  });
  renderBatchTable();
  showToast("AI 批量匹配完成", `已处理 ${state.batchModal.rows.length} 条项目。`);
}

function saveBatch() {
  const updated = new Map(state.batchModal.rows.map((row) => [row.id, row]));
  state.rows = state.rows.map((row) => updated.get(row.id) ? { ...updated.get(row.id) } : row);
  closeModal("batchModal");
  renderWorkspace();
  showToast("批量保存成功", "批量对码结果已同步到列表。");
}

function downloadCsv(fileName, rows) {
  const header = [
    "项目编码",
    "项目名称",
    "平台项目编码",
    "平台项目名称",
    "绑定设备",
    "医院金额",
    "平台金额",
    "检查费用",
    "检查折扣率",
    "耗材费用",
    "耗材折扣率",
    "药品费用",
    "药品折扣率",
  ];

  const content = rows.map((row) => {
    const platform = getPlatformItemById(row.platformItemId);
    return [
      row.itemCode,
      row.itemName,
      platform?.itemCode || "",
      platform?.itemName || "",
      getRowDeviceText(row),
      formatAmount(getHospitalAmount(row)),
      formatAmount(getPlatformAmount(row)),
      formatAmount(row.checkPrice),
      getRatioCellText(row, "checkRatio", "checkPrice"),
      formatAmount(row.consumPrice),
      getRatioCellText(row, "consumRatio", "consumPrice"),
      formatAmount(row.drugPrice),
      getRatioCellText(row, "drugRatio", "drugPrice"),
    ];
  });

  const blob = new Blob([[header, ...content].map((line) => line.join(",")).join("\n")], { type: "text/csv;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(link.href);
}

function downloadTemplate() {
  const rows = [
    ["医院项目编码", "医院项目名称", "平台项目编码", "检查费用", "耗材费用", "药品费用"],
    ["19990000000001", "CT腰椎（平扫）", "20030400111001", "260", "0", "0"],
  ];
  const blob = new Blob([rows.map((line) => line.join(",")).join("\n")], { type: "text/csv;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "检查项目对码模版.csv";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(link.href);
}

function downloadComboTemplate() {
  const rows = [
    ["外部项目编码", "外部项目名称", "对码类型", "平台项目编码", "平台项目名称", "组合展示名", "价格方式", "固定价格", "交付中心执行方式"],
    ["30061102110000", "MRI头部普通+血管扫描", "多对多", "P001|P002", "颅脑MR平扫|头颅动脉MRA", "颅脑MR平扫+头颅动脉MRA", "组合固定价", "746.66", "主项目+加收项"],
  ];
  const blob = new Blob([rows.map((line) => line.join(",")).join("\n")], { type: "text/csv;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "组合对码模版.csv";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(link.href);
}

function downloadComboRulesCsv() {
  const header = ["外部项目编码", "外部项目名称", "对码类型", "平台组合展示名", "平台标准项目", "价格方式", "价格值", "交付中心执行", "规则状态", "更新时间"];
  const sourceRules = refs.comboMainTableBody ? getDisplayedComboListRules() : getDisplayedComboRules();
  const rows = sourceRules.map((rule) => [
    rule.upstreamItemCode,
    rule.upstreamItemName,
    rule.type,
    rule.comboDisplayName,
    rule.platformItems.map((item) => item.name).join(" + "),
    rule.priceMode,
    rule.priceValue,
    `${rule.deliveryHospital} / ${rule.deliveryMode}`,
    rule.statusLabel,
    rule.updatedAt,
  ]);
  const blob = new Blob([[header, ...rows].map((line) => line.join(",")).join("\n")], { type: "text/csv;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "组合对码规则导出.csv";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(link.href);
}

function renderWorkspace() {
  renderActivePage();
  renderTopBar();
  if (refs.tableBody) {
    renderTable();
    renderPagination();
  }
  if (refs.comboMainTableBody) {
    renderComboCopyPage();
  }
  if (refs.comboTableBody && refs.comboDetailCard) {
    renderComboModule();
  }
}

function handleLogin() {
  const account = refs.loginAccount.value.trim();
  const password = refs.loginPassword.value.trim();
  const captcha = refs.loginCaptchaInput.value.trim().toUpperCase();

  if (!account || !password) {
    showToast("登录失败", "请输入账号和密码", "warning");
    return;
  }
  if (captcha !== state.verifyCode) {
    showToast("登录失败", "验证码不正确，请重新输入", "warning");
    createVerifyCode();
    refs.loginCaptchaInput.value = "";
    return;
  }
  state.screen = "workspace";
  refs.loginScreen.hidden = true;
  refs.workspaceScreen.hidden = false;
  renderWorkspace();
  showToast("登录成功", (refs.comboTableBody || refs.comboMainTableBody) ? "已进入组合对码页面。" : "已进入院内检查项目对码页面。");
}

function deleteRow(rowId) {
  const target = state.rows.find((row) => row.id === rowId);
  if (!target) return;
  const shouldDelete = window.confirm(`确定删除医院项目“${target.itemName}”吗？`);
  if (!shouldDelete) return;
  state.rows = state.rows.filter((row) => row.id !== rowId);
  renderWorkspace();
  showToast("删除成功", "医院项目已从当前列表移除。");
}

function syncDraftFromInputs() {
  const draft = state.itemModal.draft;
  if (!draft) return;

  draft.itemName = refs.itemNameInput.value;
  draft.itemCode = refs.itemCodeInput.value;
  draft.checkPrice = Number(refs.checkPriceInput.value || 0);
  draft.checkRatio = refs.checkRatioInput.value === "" ? null : Number(refs.checkRatioInput.value);
  draft.consumPrice = Number(refs.consumPriceInput.value || 0);
  draft.consumRatio = refs.consumRatioInput.value === "" ? null : Number(refs.consumRatioInput.value);
  draft.drugPrice = Number(refs.drugPriceInput.value || 0);
  draft.drugRatio = refs.drugRatioInput.value === "" ? null : Number(refs.drugRatioInput.value);
  draft.outItemId = refs.outItemIdInput.value;
  draft.showRatios = [draft.checkRatio, draft.consumRatio, draft.drugRatio].some((value) => value !== null && value !== "");

  if (!draft.modality) {
    draft.modality = inferModality(draft.itemName);
  }
  syncItemModalSummary();
}

function bindEvents() {
  if (refs.refreshCaptcha) {
    refs.refreshCaptcha.addEventListener("click", createVerifyCode);
  }
  if (refs.loginButton) {
    refs.loginButton.addEventListener("click", handleLogin);
  }

  refs.pageMenuButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.activePage = button.dataset.pageTarget;
      renderWorkspace();
    });
  });

  if (refs.collapseToggle && refs.appShell) {
    refs.collapseToggle.addEventListener("click", () => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
      refs.appShell.classList.toggle("is-collapsed", state.sidebarCollapsed);
    });
  }

  if (refs.hospitalSwitchButton && refs.hospitalModal) {
    refs.hospitalSwitchButton.addEventListener("click", () => {
      refs.hospitalModal.hidden = false;
      renderHospitalModal();
    });
  }

  if (refs.switchHospitalQuickButton && refs.userMenu && refs.hospitalModal) {
    refs.switchHospitalQuickButton.addEventListener("click", () => {
      refs.userMenu.hidden = true;
      refs.hospitalModal.hidden = false;
      renderHospitalModal();
    });
  }

  if (refs.userMenuButton && refs.userMenu) {
    refs.userMenuButton.addEventListener("click", () => {
      refs.userMenu.hidden = !refs.userMenu.hidden;
    });
  }

  if (refs.logoutButton && refs.userMenu && refs.workspaceScreen && refs.loginScreen && refs.loginCaptchaInput) {
    refs.logoutButton.addEventListener("click", () => {
      refs.userMenu.hidden = true;
      state.screen = "login";
      refs.workspaceScreen.hidden = true;
      refs.loginScreen.hidden = false;
      createVerifyCode();
      refs.loginCaptchaInput.value = "";
      showToast("已退出登录", "返回登录页，可继续查看原型。");
    });
  }

  if (refs.changePasswordButton && refs.userMenu) {
    refs.changePasswordButton.addEventListener("click", () => {
      refs.userMenu.hidden = true;
      showToast("交互保留", "密码修改入口已保留，当前原型未接真实提交流程。");
    });
  }

  if (refs.searchButton && refs.modalityFilter && refs.keywordFilter) {
    refs.searchButton.addEventListener("click", () => {
      state.filters.modality = refs.modalityFilter.value;
      state.filters.keyword = refs.keywordFilter.value;
      state.page = 1;
      renderWorkspace();
    });
  }

  if (refs.resetButton) {
    refs.resetButton.addEventListener("click", () => {
      state.filters.modality = "";
      state.filters.keyword = "";
      refs.modalityFilter.value = "";
      refs.keywordFilter.value = "";
      state.page = 1;
      renderWorkspace();
    });
  }

  if (refs.addItemButton) refs.addItemButton.addEventListener("click", () => openItemModal("create"));
  if (refs.batchButton) refs.batchButton.addEventListener("click", openBatchModal);
  if (refs.batchAiButton) refs.batchAiButton.addEventListener("click", runBatchAi);
  if (refs.batchSaveButton) refs.batchSaveButton.addEventListener("click", saveBatch);

  if (refs.comboListSearchButton && refs.comboListTypeFilter && refs.comboListKeywordFilter) {
    refs.comboListSearchButton.addEventListener("click", () => {
      state.comboFilters.type = refs.comboListTypeFilter.value;
      state.comboFilters.keyword = refs.comboListKeywordFilter.value;
      state.comboPage = 1;
      renderWorkspace();
    });
  }

  if (refs.comboListAddButton) refs.comboListAddButton.addEventListener("click", () => openComboRuleModal("create"));
  if (refs.comboListBatchButton) refs.comboListBatchButton.addEventListener("click", openComboBatchModal);

  if (refs.comboListTemplateButton) {
    refs.comboListTemplateButton.addEventListener("click", () => {
      downloadComboTemplate();
      showToast("模版已导出", "已生成组合对码批量维护模版。");
    });
  }

  if (refs.comboListExportButton) {
    refs.comboListExportButton.addEventListener("click", () => {
      downloadComboRulesCsv();
      showToast("导出成功", "当前组合规则已导出为 CSV。");
    });
  }

  if (refs.comboListImportButton && refs.comboListImportFileInput) {
    refs.comboListImportButton.addEventListener("click", () => refs.comboListImportFileInput.click());
    refs.comboListImportFileInput.addEventListener("change", (event) => {
      const file = event.target.files?.[0];
      if (!file) return;
      showToast("导入成功", `已接收组合规则文件“${file.name}”，当前原型仅保留交互反馈。`);
      refs.comboListImportFileInput.value = "";
    });
  }

  if (refs.comboMainTableBody) {
    refs.comboMainTableBody.addEventListener("click", (event) => {
      const actionButton = event.target.closest("[data-combo-list-action]");
      if (!actionButton) return;
      const ruleId = Number(actionButton.dataset.comboRuleId);
      if (actionButton.dataset.comboListAction === "edit") {
        openComboRuleModal("edit", ruleId);
        return;
      }
      if (actionButton.dataset.comboListAction === "delete") {
        deleteComboRule(ruleId);
      }
    });
  }

  if (refs.comboPagination) {
    refs.comboPagination.addEventListener("click", (event) => {
      const pageButton = event.target.closest("[data-combo-page]");
      if (!pageButton || pageButton.classList.contains("is-disabled")) return;
      state.comboPage = Number(pageButton.dataset.comboPage);
      renderWorkspace();
    });

    refs.comboPagination.addEventListener("change", (event) => {
      if (event.target.id === "comboPageSizeSelect") {
        state.comboPageSize = Number(event.target.value);
        state.comboPage = 1;
        renderWorkspace();
      }
    });

    refs.comboPagination.addEventListener("keydown", (event) => {
      if (event.target.id !== "comboGotoPageInput" || event.key !== "Enter") return;
      const totalPages = getComboTotalPages();
      const nextPage = Math.max(1, Math.min(totalPages, Number(event.target.value || 1)));
      state.comboPage = nextPage;
      renderWorkspace();
    });
  }

  if (refs.comboSearchButton && refs.comboTypeFilter && refs.comboStatusFilter && refs.comboKeywordFilter) {
    refs.comboSearchButton.addEventListener("click", () => {
      state.comboFilters.type = refs.comboTypeFilter.value;
      state.comboFilters.status = refs.comboStatusFilter.value;
      state.comboFilters.keyword = refs.comboKeywordFilter.value;
      renderComboModule();
    });
  }

  if (refs.comboResetButton) {
    refs.comboResetButton.addEventListener("click", () => {
      state.comboFilters.type = "";
      state.comboFilters.status = "";
      state.comboFilters.keyword = "";
      renderComboModule();
    });
  }

  if (refs.comboTableBody) {
    refs.comboTableBody.addEventListener("click", (event) => {
      const row = event.target.closest("[data-combo-rule-id]");
      if (!row) return;
      state.selectedComboRuleId = Number(row.dataset.comboRuleId);
      renderComboModule();
    });
  }

  if (refs.addComboRuleButton) {
    refs.addComboRuleButton.addEventListener("click", () => {
      showToast("入口已保留", "当前原型重点演示组合规则列表与示例展示。");
    });
  }

  if (refs.comboTemplateButton) {
    refs.comboTemplateButton.addEventListener("click", () => {
      downloadComboTemplate();
      showToast("模版已导出", "已生成组合对码批量维护模版。");
    });
  }

  if (refs.comboExportButton) {
    refs.comboExportButton.addEventListener("click", () => {
      downloadComboRulesCsv();
      showToast("导出成功", "当前组合规则已导出为 CSV。");
    });
  }

  if (refs.comboImportButton && refs.comboImportFileInput) {
    refs.comboImportButton.addEventListener("click", () => refs.comboImportFileInput.click());
    refs.comboImportFileInput.addEventListener("change", (event) => {
      const file = event.target.files?.[0];
      if (!file) return;
      showToast("导入成功", `已接收组合规则文件“${file.name}”，当前原型仅保留交互反馈。`);
      refs.comboImportFileInput.value = "";
    });
  }

  if (refs.templateButton) {
    refs.templateButton.addEventListener("click", () => {
      downloadTemplate();
      showToast("模版已导出", "已生成可用于批量导入的项目模版。");
    });
  }

  if (refs.exportButton) {
    refs.exportButton.addEventListener("click", () => {
      downloadCsv("院内检查项目对码导出.csv", getDisplayedRows());
      showToast("导出成功", "当前医院项目列表已导出为 CSV。");
    });
  }

  if (refs.importButton && refs.importFileInput) {
    refs.importButton.addEventListener("click", () => refs.importFileInput.click());
    refs.importFileInput.addEventListener("change", (event) => {
      const file = event.target.files?.[0];
      if (!file) return;
      showToast("导入成功", `已接收文件“${file.name}”，演示环境仅保留交互反馈。`);
      refs.importFileInput.value = "";
    });
  }

  if (refs.tableBody) {
    refs.tableBody.addEventListener("click", (event) => {
      const actionButton = event.target.closest("[data-action]");
      if (!actionButton) return;
      const rowId = Number(actionButton.dataset.rowId);
      if (actionButton.dataset.action === "edit") {
        openItemModal("edit", rowId);
        return;
      }
      if (actionButton.dataset.action === "delete") {
        deleteRow(rowId);
      }
    });
  }

  if (refs.pagination) {
    refs.pagination.addEventListener("click", (event) => {
      const pageButton = event.target.closest("[data-page]");
      if (!pageButton || pageButton.classList.contains("is-disabled")) return;
      state.page = Number(pageButton.dataset.page);
      renderWorkspace();
    });

    refs.pagination.addEventListener("change", (event) => {
      if (event.target.id === "pageSizeSelect") {
        state.pageSize = Number(event.target.value);
        state.page = 1;
        renderWorkspace();
      }
    });

    refs.pagination.addEventListener("keydown", (event) => {
      if (event.target.id !== "gotoPageInput" || event.key !== "Enter") return;
      const totalPages = getTotalPages();
      const nextPage = Math.max(1, Math.min(totalPages, Number(event.target.value || 1)));
      state.page = nextPage;
      renderWorkspace();
    });
  }

  if (refs.hospitalTypeFilter) {
    refs.hospitalTypeFilter.addEventListener("change", (event) => {
      state.hospitalModal.type = event.target.value;
      renderHospitalModal();
    });
  }

  if (refs.hospitalKeywordFilter) {
    refs.hospitalKeywordFilter.addEventListener("input", (event) => {
      state.hospitalModal.keyword = event.target.value;
      renderHospitalModal();
    });
  }

  if (refs.hospitalGrid) {
    refs.hospitalGrid.addEventListener("click", (event) => {
      const card = event.target.closest("[data-hospital-id]");
      if (!card) return;
      state.selectedHospitalId = Number(card.dataset.hospitalId);
      state.page = 1;
      closeModal("hospitalModal");
      renderWorkspace();
      showToast("切换成功", `当前上下文已切换到 ${getCurrentHospital().name}。`);
    });
  }

  document.querySelectorAll("[data-close]").forEach((button) => {
    button.addEventListener("click", () => closeModal(button.dataset.close));
  });

  if (refs.aiMatchButton && refs.aiResultBox) {
    refs.aiMatchButton.addEventListener("click", () => {
      const draft = state.itemModal.draft;
      if (!draft || !draft.itemName.trim()) {
        showToast("AI 对码失败", "请先输入医院项目名称", "warning");
        return;
      }
      const suggestion = getAiSuggestion(draft.itemName);
      state.itemModal.analysis = suggestion.analysis;
      refs.aiResultBox.innerHTML = suggestion.analysis;
      if (suggestion.platformId) {
        draft.platformItemId = suggestion.platformId;
        draft.modality = getPlatformItemById(suggestion.platformId)?.modality || draft.modality;
        renderPlatformOptions(draft.platformItemId);
        showToast("AI 对码完成", `已为“${draft.itemName}”回填平台项目。`);
      } else {
        showToast("AI 未命中", "未找到明确匹配项，请手动选择平台项目。", "warning");
      }
      syncItemModalSummary();
    });
  }

  [
    refs.itemNameInput,
    refs.itemCodeInput,
    refs.checkPriceInput,
    refs.checkRatioInput,
    refs.consumPriceInput,
    refs.consumRatioInput,
    refs.drugPriceInput,
    refs.drugRatioInput,
    refs.outItemIdInput,
  ].filter(Boolean).forEach((input) => {
    input.addEventListener("input", syncDraftFromInputs);
  });

  [
    refs.comboUpstreamHospitalSelect,
    refs.comboDeliveryHospitalSelect,
    refs.comboUpstreamNameInput,
    refs.comboUpstreamCodeInput,
    refs.comboMappingTypeSelect,
    refs.comboDisplayNameInput,
    refs.comboOrderDisplayInput,
    refs.comboPlatformItemsInput,
    refs.comboDeliveryItemsInput,
    refs.comboPriceModeSelect,
    refs.comboPriceValueInput,
  ].filter(Boolean).forEach((input) => {
    input.addEventListener(input.tagName === "SELECT" ? "change" : "input", syncComboDraftFromInputs);
  });

  if (refs.platformItemSelect) {
    refs.platformItemSelect.addEventListener("change", (event) => {
      applyPlatformSelection(event.target.value);
    });
  }

  if (refs.comboAiSplitButton && refs.comboAiResultBox) {
    refs.comboAiSplitButton.addEventListener("click", () => {
      const draft = state.comboModal.draft;
      if (!draft || !draft.upstreamItemName.trim()) {
        showToast("AI 拆解失败", "请先输入上游项目名称", "warning");
        return;
      }
      const suggestion = getComboAiSuggestion(draft.upstreamItemName);
      if (!suggestion) {
        refs.comboAiResultBox.innerHTML = "未命中明确组合拆解规则，请人工补充平台标准项目与执行项目。";
        showToast("AI 未命中", "未找到明确组合规则，请手动补充。", "warning");
        return;
      }
      applyComboSuggestion(draft, suggestion);
      refs.comboAiResultBox.innerHTML = suggestion.analysis;
      renderComboRuleModal();
      showToast("AI 拆解完成", `已为“${draft.upstreamItemName}”回填组合拆解建议。`);
    });
  }

  if (refs.deviceChipList) {
    refs.deviceChipList.addEventListener("click", (event) => {
      const chip = event.target.closest("[data-device-id]");
      if (!chip || !state.itemModal.draft) return;
      const deviceId = Number(chip.dataset.deviceId);
      if (state.itemModal.draft.deviceIds.includes(deviceId)) {
        state.itemModal.draft.deviceIds = state.itemModal.draft.deviceIds.filter((id) => id !== deviceId);
      } else {
        state.itemModal.draft.deviceIds = [...state.itemModal.draft.deviceIds, deviceId];
      }
      renderDeviceChips();
    });
  }

  if (refs.saveItemButton) {
    refs.saveItemButton.addEventListener("click", saveDraft);
  }

  if (refs.comboSaveRuleButton) {
    refs.comboSaveRuleButton.addEventListener("click", saveComboRule);
  }

  if (refs.batchTableBody) {
    refs.batchTableBody.addEventListener("change", (event) => {
      if (!event.target.matches(".batch-platform-select")) return;
      const rowId = Number(event.target.dataset.batchRow);
      const value = Number(event.target.value);
      state.batchModal.rows = state.batchModal.rows.map((row) => row.id === rowId ? {
        ...row,
        platformItemId: value || null,
        status: value ? "matched" : "pending",
        batchNote: value ? "已手动选择平台项目，待保存。" : "已清空平台项目，待重新匹配。",
      } : row);
    });
  }

  if (refs.comboBatchAiButton) {
    refs.comboBatchAiButton.addEventListener("click", runComboBatchAi);
  }

  if (refs.comboBatchSaveButton) {
    refs.comboBatchSaveButton.addEventListener("click", saveComboBatch);
  }

  document.querySelectorAll("[data-route]").forEach((button) => {
    button.addEventListener("click", () => {
      window.location.href = button.dataset.route;
    });
  });

  if (refs.userMenuButton && refs.userMenu) {
    document.addEventListener("click", (event) => {
      if (!refs.userMenuButton.contains(event.target) && !refs.userMenu.contains(event.target)) {
        refs.userMenu.hidden = true;
      }
    });
  }
}

function init() {
  createVerifyCode();
  renderFilterOptions();
  if (refs.keywordFilter) {
    refs.keywordFilter.value = state.filters.keyword;
  }
  if (refs.hospitalKeywordFilter) {
    refs.hospitalKeywordFilter.value = state.hospitalModal.keyword;
  }
  if (refs.loginScreen) {
    refs.loginScreen.hidden = state.screen !== "login";
  }
  if (refs.workspaceScreen) {
    refs.workspaceScreen.hidden = state.screen !== "workspace";
  }
  bindEvents();
  renderWorkspace();
}

init();
