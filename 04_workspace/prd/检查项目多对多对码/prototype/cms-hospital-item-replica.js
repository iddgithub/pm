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

const state = {
  screen: "workspace",
  verifyCode: "",
  sidebarCollapsed: false,
  selectedHospitalId: 301,
  filters: {
    modality: "",
    keyword: "",
  },
  page: 1,
  pageSize: 10,
  mockTotalRecords: 986,
  hospitals,
  rows: baseRows.map((row) => ({ ...row })),
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
  batchModal: {
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
  const toast = document.createElement("div");
  toast.className = `toast toast--${type}`;
  toast.innerHTML = `<strong>${escapeHtml(title)}</strong><span>${escapeHtml(body)}</span>`;
  refs.toastStack.appendChild(toast);
  window.setTimeout(() => toast.remove(), 2600);
}

function renderTopBar() {
  const hospital = getCurrentHospital();
  refs.hospitalSwitchButton.textContent = `${hospital.name} - ${hospital.typeLabel}`;
}

function renderFilterOptions() {
  refs.modalityFilter.innerHTML = [
    '<option value="">检查类型</option>',
    ...modalityOptions.map((modality) => `<option value="${modality}">${modality}</option>`),
  ].join("");
  refs.modalityFilter.value = state.filters.modality;

  refs.hospitalTypeFilter.innerHTML = [
    '<option value="">全部类型</option>',
    '<option value="1">互联网医院</option>',
    '<option value="2">执行机构</option>',
    '<option value="3">报告机构</option>',
  ].join("");
  refs.hospitalTypeFilter.value = state.hospitalModal.type;
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

function renderTable() {
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

function renderWorkspace() {
  renderTopBar();
  renderTable();
  renderPagination();
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
  showToast("登录成功", "已进入院内检查项目对码页面。");
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
  refs.refreshCaptcha.addEventListener("click", createVerifyCode);
  refs.loginButton.addEventListener("click", handleLogin);

  refs.collapseToggle.addEventListener("click", () => {
    state.sidebarCollapsed = !state.sidebarCollapsed;
    refs.appShell.classList.toggle("is-collapsed", state.sidebarCollapsed);
  });

  refs.hospitalSwitchButton.addEventListener("click", () => {
    refs.hospitalModal.hidden = false;
    renderHospitalModal();
  });

  refs.switchHospitalQuickButton.addEventListener("click", () => {
    refs.userMenu.hidden = true;
    refs.hospitalModal.hidden = false;
    renderHospitalModal();
  });

  refs.userMenuButton.addEventListener("click", () => {
    refs.userMenu.hidden = !refs.userMenu.hidden;
  });

  refs.logoutButton.addEventListener("click", () => {
    refs.userMenu.hidden = true;
    state.screen = "login";
    refs.workspaceScreen.hidden = true;
    refs.loginScreen.hidden = false;
    createVerifyCode();
    refs.loginCaptchaInput.value = "";
    showToast("已退出登录", "返回登录页，可继续查看原型。");
  });

  refs.changePasswordButton.addEventListener("click", () => {
    refs.userMenu.hidden = true;
    showToast("交互保留", "密码修改入口已保留，当前原型未接真实提交流程。");
  });

  refs.searchButton.addEventListener("click", () => {
    state.filters.modality = refs.modalityFilter.value;
    state.filters.keyword = refs.keywordFilter.value;
    state.page = 1;
    renderWorkspace();
  });

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

  refs.addItemButton.addEventListener("click", () => openItemModal("create"));
  refs.batchButton.addEventListener("click", openBatchModal);
  refs.batchAiButton.addEventListener("click", runBatchAi);
  refs.batchSaveButton.addEventListener("click", saveBatch);

  refs.templateButton.addEventListener("click", () => {
    downloadTemplate();
    showToast("模版已导出", "已生成可用于批量导入的项目模版。");
  });

  refs.exportButton.addEventListener("click", () => {
    downloadCsv("院内检查项目对码导出.csv", getDisplayedRows());
    showToast("导出成功", "当前医院项目列表已导出为 CSV。");
  });

  refs.importButton.addEventListener("click", () => refs.importFileInput.click());
  refs.importFileInput.addEventListener("change", (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    showToast("导入成功", `已接收文件“${file.name}”，演示环境仅保留交互反馈。`);
    refs.importFileInput.value = "";
  });

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

  refs.hospitalTypeFilter.addEventListener("change", (event) => {
    state.hospitalModal.type = event.target.value;
    renderHospitalModal();
  });

  refs.hospitalKeywordFilter.addEventListener("input", (event) => {
    state.hospitalModal.keyword = event.target.value;
    renderHospitalModal();
  });

  refs.hospitalGrid.addEventListener("click", (event) => {
    const card = event.target.closest("[data-hospital-id]");
    if (!card) return;
    state.selectedHospitalId = Number(card.dataset.hospitalId);
    state.page = 1;
    closeModal("hospitalModal");
    renderWorkspace();
    showToast("切换成功", `当前上下文已切换到 ${getCurrentHospital().name}。`);
  });

  document.querySelectorAll("[data-close]").forEach((button) => {
    button.addEventListener("click", () => closeModal(button.dataset.close));
  });

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
  ].forEach((input) => {
    input.addEventListener("input", syncDraftFromInputs);
  });

  refs.platformItemSelect.addEventListener("change", (event) => {
    applyPlatformSelection(event.target.value);
  });

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

  refs.saveItemButton.addEventListener("click", saveDraft);

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

  document.querySelectorAll("[data-route]").forEach((button) => {
    button.addEventListener("click", () => {
      window.location.href = button.dataset.route;
    });
  });

  document.addEventListener("click", (event) => {
    if (!refs.userMenuButton.contains(event.target) && !refs.userMenu.contains(event.target)) {
      refs.userMenu.hidden = true;
    }
  });
}

function init() {
  createVerifyCode();
  renderFilterOptions();
  refs.keywordFilter.value = state.filters.keyword;
  refs.hospitalKeywordFilter.value = state.hospitalModal.keyword;
  refs.loginScreen.hidden = state.screen !== "login";
  refs.workspaceScreen.hidden = state.screen !== "workspace";
  bindEvents();
  renderWorkspace();
}

init();
