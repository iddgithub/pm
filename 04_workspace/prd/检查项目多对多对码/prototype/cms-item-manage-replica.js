const hospitals = [
  {
    id: 301,
    name: "南昌一脉阳光医学诊断中心",
    typeLabel: "执行机构",
  },
  {
    id: 302,
    name: "江西一脉阳光影像中心",
    typeLabel: "执行机构",
  },
];

const baseRows = [
  {
    id: 1,
    itemName: "* CT颅脑(平扫)",
    itemCode: "20010100110000",
    scanCode: "11",
    postCode: "0",
    postProcess: "-",
    modality: "CT",
    scanMode: "平扫",
    level1Code: "1",
    level1Name: "头部",
    level2Code: "101",
    level2Name: "头部",
    level3Code: "10100",
    level3Name: "颅脑",
    status: "启用",
    positionCode: "",
    positionName: "",
    createdAt: "2025-11-11 10:15:28",
  },
  {
    id: 2,
    itemName: "* CT颅脑(平扫+三维重建)",
    itemCode: "20010100111100",
    scanCode: "11",
    postCode: "11",
    postProcess: "三维重建",
    modality: "CT",
    scanMode: "平扫",
    level1Code: "1",
    level1Name: "头部",
    level2Code: "101",
    level2Name: "头部",
    level3Code: "10100",
    level3Name: "颅脑",
    status: "启用",
    positionCode: "",
    positionName: "",
    createdAt: "2025-11-11 10:15:28",
  },
  {
    id: 3,
    itemName: "* CT颅脑(增强)",
    itemCode: "20010100210000",
    scanCode: "21",
    postCode: "0",
    postProcess: "-",
    modality: "CT",
    scanMode: "增强",
    level1Code: "1",
    level1Name: "头部",
    level2Code: "101",
    level2Name: "头部",
    level3Code: "10100",
    level3Name: "颅脑",
    status: "启用",
    positionCode: "",
    positionName: "",
    createdAt: "2025-11-11 10:15:28",
  },
  {
    id: 4,
    itemName: "* CT颅脑(平扫+增强)",
    itemCode: "20010100220000",
    scanCode: "22",
    postCode: "0",
    postProcess: "-",
    modality: "CT",
    scanMode: "平扫+增强",
    level1Code: "1",
    level1Name: "头部",
    level2Code: "101",
    level2Name: "头部",
    level3Code: "10100",
    level3Name: "颅脑",
    status: "启用",
    positionCode: "",
    positionName: "",
    createdAt: "2025-11-11 10:15:28",
  },
  {
    id: 5,
    itemName: "* CT颅脑(平扫+增强+三维重建)",
    itemCode: "20010100221100",
    scanCode: "22",
    postCode: "11",
    postProcess: "三维重建",
    modality: "CT",
    scanMode: "平扫+增强",
    level1Code: "1",
    level1Name: "头部",
    level2Code: "101",
    level2Name: "头部",
    level3Code: "10100",
    level3Name: "颅脑",
    status: "启用",
    positionCode: "",
    positionName: "",
    createdAt: "2025-11-11 10:15:28",
  },
  {
    id: 6,
    itemName: "* CT颅脑灌注成像(CTP)",
    itemCode: "20010100410000",
    scanCode: "41",
    postCode: "0",
    postProcess: "-",
    modality: "CT",
    scanMode: "灌注成像(CTP)",
    level1Code: "1",
    level1Name: "头部",
    level2Code: "101",
    level2Name: "头部",
    level3Code: "10100",
    level3Name: "颅脑",
    status: "启用",
    positionCode: "",
    positionName: "",
    createdAt: "2025-11-11 10:15:28",
  },
  {
    id: 7,
    itemName: "* CT颅脑[外伤](平扫)",
    itemCode: "20010104110000",
    scanCode: "11",
    postCode: "0",
    postProcess: "-",
    modality: "CT",
    scanMode: "平扫",
    level1Code: "1",
    level1Name: "头部",
    level2Code: "101",
    level2Name: "头部",
    level3Code: "10104",
    level3Name: "颅脑[外伤]",
    status: "启用",
    positionCode: "",
    positionName: "",
    createdAt: "2025-11-11 10:15:28",
  },
  {
    id: 8,
    itemName: "* CT颅底(平扫)",
    itemCode: "20010200110000",
    scanCode: "11",
    postCode: "0",
    postProcess: "-",
    modality: "CT",
    scanMode: "平扫",
    level1Code: "1",
    level1Name: "头部",
    level2Code: "102",
    level2Name: "头部",
    level3Code: "10200",
    level3Name: "颅底",
    status: "启用",
    positionCode: "",
    positionName: "",
    createdAt: "2025-11-11 10:15:28",
  },
  {
    id: 9,
    itemName: "* CT颅底(平扫+三维重建)",
    itemCode: "20010200111100",
    scanCode: "11",
    postCode: "11",
    postProcess: "三维重建",
    modality: "CT",
    scanMode: "平扫",
    level1Code: "1",
    level1Name: "头部",
    level2Code: "102",
    level2Name: "头部",
    level3Code: "10200",
    level3Name: "颅底",
    status: "启用",
    positionCode: "",
    positionName: "",
    createdAt: "2025-11-11 10:15:28",
  },
  {
    id: 10,
    itemName: "* CT颅底(增强)",
    itemCode: "20010200210000",
    scanCode: "21",
    postCode: "0",
    postProcess: "-",
    modality: "CT",
    scanMode: "增强",
    level1Code: "1",
    level1Name: "头部",
    level2Code: "102",
    level2Name: "头部",
    level3Code: "10200",
    level3Name: "颅底",
    status: "启用",
    positionCode: "",
    positionName: "",
    createdAt: "2025-11-11 10:15:28",
  },
];

const detailSections = [
  { key: "scanPosition", label: "扫描体位", title: "扫描体位" },
  { key: "scanRange", label: "扫描范围", title: "扫描范围" },
  { key: "imagingArea", label: "成像区域", title: "成像区域" },
  { key: "targetOrgan", label: "成像靶器官", title: "成像靶器官" },
  { key: "contrastPlan", label: "对比剂方案", title: "对比剂方案" },
  { key: "technicalParam", label: "技术参数", title: "技术参数" },
  { key: "clinicalUse", label: "临床应用", title: "临床应用" },
  { key: "evaluationIndex", label: "评价指标", title: "评价指标" },
  { key: "other", label: "其他", title: "其他" },
];

const state = {
  sidebarCollapsed: false,
  selectedHospitalId: 301,
  filters: {
    modality: "",
    keyword: "",
  },
  page: 1,
  pageSize: 10,
  mockTotalRecords: 1388,
  detailModal: {
    open: false,
    row: null,
    activeSectionKey: "scanPosition",
  },
};

const refs = {
  appShell: document.getElementById("appShell"),
  collapseToggle: document.getElementById("collapseToggle"),
  hospitalSwitchButton: document.getElementById("hospitalSwitchButton"),
  userMenuButton: document.getElementById("userMenuButton"),
  userMenu: document.getElementById("userMenu"),
  changePasswordButton: document.getElementById("changePasswordButton"),
  switchHospitalButton: document.getElementById("switchHospitalButton"),
  logoutButton: document.getElementById("logoutButton"),
  modalityFilter: document.getElementById("modalityFilter"),
  keywordFilter: document.getElementById("keywordFilter"),
  searchButton: document.getElementById("searchButton"),
  tableBody: document.getElementById("tableBody"),
  recordText: document.getElementById("recordText"),
  pagination: document.getElementById("pagination"),
  detailModal: document.getElementById("detailModal"),
  closeDetailButton: document.getElementById("closeDetailButton"),
  detailSummary: document.getElementById("detailSummary"),
  detailTabs: document.getElementById("detailTabs"),
  detailSectionLabel: document.getElementById("detailSectionLabel"),
  detailSectionTitle: document.getElementById("detailSectionTitle"),
  detailSectionContent: document.getElementById("detailSectionContent"),
  toastStack: document.getElementById("toastStack"),
};

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function getCurrentHospital() {
  return hospitals.find((hospital) => hospital.id === state.selectedHospitalId) || hospitals[0];
}

function getModalityOptions() {
  return Array.from(new Set(baseRows.map((row) => row.modality)));
}

function cloneDisplayRow(row, absoluteIndex) {
  if (absoluteIndex < baseRows.length) {
    return row;
  }

  const sequence = absoluteIndex + 1;
  const serial = String(sequence).padStart(4, "0");
  return {
    ...row,
    id: sequence,
    itemCode: `${row.itemCode.slice(0, -4)}${serial}`,
    createdAt: `2025-11-${String((sequence % 18) + 10).padStart(2, "0")} 10:15:28`,
  };
}

function isDefaultState() {
  return !state.filters.modality && !state.filters.keyword.trim();
}

function getFilteredRows() {
  const keyword = state.filters.keyword.trim();
  return baseRows.filter((row) => {
    if (state.filters.modality && row.modality !== state.filters.modality) {
      return false;
    }
    if (!keyword) {
      return true;
    }
    return [
      row.itemName,
      row.itemCode,
      row.scanCode,
      row.postCode,
      row.postProcess,
      row.level1Code,
      row.level1Name,
      row.level2Code,
      row.level2Name,
      row.level3Code,
      row.level3Name,
    ].some((value) => String(value || "").includes(keyword));
  });
}

function getVisibleTotal() {
  return isDefaultState() ? state.mockTotalRecords : getFilteredRows().length;
}

function getTotalPages() {
  return Math.max(1, Math.ceil(getVisibleTotal() / state.pageSize));
}

function getVisibleRows() {
  const rows = getFilteredRows();
  if (!rows.length) {
    return [];
  }

  state.page = Math.min(state.page, getTotalPages());
  const start = (state.page - 1) * state.pageSize;

  if (isDefaultState()) {
    return Array.from({ length: state.pageSize }, (_, offset) => {
      const absoluteIndex = start + offset;
      const baseRow = rows[absoluteIndex % rows.length];
      return cloneDisplayRow(baseRow, absoluteIndex);
    });
  }

  return rows.slice(start, start + state.pageSize);
}

function getStatusClass(status) {
  return status === "启用" ? "status-chip status-chip--matched" : "status-chip status-chip--draft";
}

function getPageItems(totalPages) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (state.page <= 4) {
    return [1, 2, 3, 4, 5, 6, "...", totalPages];
  }

  if (state.page >= totalPages - 3) {
    return [1, "...", totalPages - 5, totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, "...", state.page - 1, state.page, state.page + 1, "...", totalPages];
}

function showToast(title, body, type = "success") {
  const toast = document.createElement("div");
  toast.className = `toast toast--${type}`;
  toast.innerHTML = `<strong>${escapeHtml(title)}</strong><span>${escapeHtml(body)}</span>`;
  refs.toastStack.appendChild(toast);
  window.setTimeout(() => toast.remove(), 2600);
}

function buildDetailContent(row) {
  const contrastText = row.scanMode.includes("增强")
    ? `当前项目为 ${row.scanMode} 场景，默认沿用头部增强检查的对比剂流程，强调过敏史确认、注射速率核对和检查后留观。`
    : "当前项目为非增强流程，默认不启用对比剂方案，如需增强版检查应通过对应平台项目编码单独维护。";

  return {
    scanPosition: `${row.itemName} 默认使用仰卧位完成检查，摆位环节优先对齐 ${row.level3Name} 解剖中心线。\n若同类项目存在特殊摆位要求，可在平台规范维护中追加院内备注。`,
    scanRange: `扫描范围按 ${row.level1Name} / ${row.level2Name} / ${row.level3Name} 分级编码执行，当前编码链路为 ${row.level1Code}-${row.level2Code}-${row.level3Code}。\n原型中保留固定范围描述，实际系统中由标准项目词条驱动。`,
    imagingArea: `成像区域归属 ${row.level3Name}，用于支撑平台项目分发、院内检查项目对码和检查报告模板匹配。\n若为组合套餐，平台会在同一主项目下挂接后处理或附加项。`,
    targetOrgan: `靶器官以 ${row.level3Name} 为主，页面中同时保留一级、二级、三级部位字段，便于线上列表快速识别归属。\n当前原型按真实 CMS 列表密度保留多级部位信息。`,
    contrastPlan: contrastText,
    technicalParam: `扫描编码 ${row.scanCode}、后处理编码 ${row.postCode}、后处理名称 ${row.postProcess} 共同构成当前项目的技术参数骨架。\n交互原型中保留真实字段顺序，用于后续继续还原详情态和编辑态。`,
    clinicalUse: `${row.itemName} 的临床应用主要面向 ${row.level3Name} 场景下的检查申请、平台项目标准化以及下游机构项目映射。\n详情页重点不是重新编辑，而是查看标准项目说明和使用规范。`,
    evaluationIndex: `评价指标在当前线上详情中以说明性文本承载，原型保留为阅读态。\n若后续继续扩页，可补充分值、等级、适应症等明细字段和滚动内容区。`,
    other: `当前原型以列表页和详情阅读态为优先，未接入真实接口、权限校验或项目词条维护链路。\n保留顶部医院上下文、左侧菜单、分页和详情入口，便于继续扩展到平台患者列表等相关页。`,
  };
}

function renderTopBar() {
  const hospital = getCurrentHospital();
  refs.hospitalSwitchButton.textContent = `${hospital.name} - ${hospital.typeLabel}`;
}

function renderFilters() {
  refs.modalityFilter.innerHTML = [
    '<option value="">检查类型</option>',
    ...getModalityOptions().map((modality) => `<option value="${modality}">${modality}</option>`),
  ].join("");
  refs.modalityFilter.value = state.filters.modality;
  refs.keywordFilter.value = state.filters.keyword;
}

function renderTable() {
  const rows = getVisibleRows();
  if (!rows.length) {
    refs.tableBody.innerHTML = '<tr><td colspan="18"><div class="empty-state">当前筛选条件下暂无平台项目</div></td></tr>';
    return;
  }

  refs.tableBody.innerHTML = rows.map((row) => `
    <tr>
      <td class="cell-ellipsis">${escapeHtml(row.itemName)}</td>
      <td>${escapeHtml(row.itemCode)}</td>
      <td>${escapeHtml(row.scanCode)}</td>
      <td>${escapeHtml(row.postCode)}</td>
      <td class="cell-ellipsis">${escapeHtml(row.postProcess)}</td>
      <td>${escapeHtml(row.modality)}</td>
      <td>${escapeHtml(row.scanMode)}</td>
      <td>${escapeHtml(row.level1Code)}</td>
      <td>${escapeHtml(row.level1Name)}</td>
      <td>${escapeHtml(row.level2Code)}</td>
      <td>${escapeHtml(row.level2Name)}</td>
      <td>${escapeHtml(row.level3Code)}</td>
      <td>${escapeHtml(row.level3Name)}</td>
      <td class="cell-status"><span class="${getStatusClass(row.status)}">${escapeHtml(row.status)}</span></td>
      <td>${escapeHtml(row.positionCode || "")}</td>
      <td>${escapeHtml(row.positionName || "")}</td>
      <td class="cell-created-at">${escapeHtml(row.createdAt)}</td>
      <td><button class="btn-link cell-detail" type="button" data-action="detail" data-row-id="${row.id}">详情</button></td>
    </tr>
  `).join("");
}

function renderPagination() {
  const total = getVisibleTotal();
  const totalPages = getTotalPages();
  refs.recordText.textContent = `共${total}条记录 当前显示${Math.min(state.pageSize, getVisibleRows().length)}条记录`;

  const pageButtons = getPageItems(totalPages).map((item) => {
    if (item === "...") {
      return '<span class="pagination__ellipsis">...</span>';
    }
    return `
      <button
        class="pagination__page ${item === state.page ? "is-active" : ""}"
        type="button"
        data-page="${item}"
      >${item}</button>
    `;
  }).join("");

  refs.pagination.innerHTML = `
    <button class="pagination__page ${state.page === 1 ? "is-disabled" : ""}" type="button" data-page="${Math.max(1, state.page - 1)}">‹</button>
    ${pageButtons}
    <button class="pagination__page ${state.page === totalPages ? "is-disabled" : ""}" type="button" data-page="${Math.min(totalPages, state.page + 1)}">›</button>
    <select class="pagination__select" id="pageSizeSelect">
      <option value="10">10条/页</option>
      <option value="20">20条/页</option>
      <option value="50">50条/页</option>
    </select>
    <label class="pagination__goto">
      <span>前往</span>
      <input class="pagination__goto-input" id="gotoInput" type="number" min="1" max="${totalPages}" value="${state.page}" />
      <span>页</span>
    </label>
  `;

  document.getElementById("pageSizeSelect").value = String(state.pageSize);
}

function renderDetailModal() {
  const row = state.detailModal.row;
  if (!state.detailModal.open || !row) {
    refs.detailModal.hidden = true;
    return;
  }

  const content = buildDetailContent(row);
  const activeSection = detailSections.find((section) => section.key === state.detailModal.activeSectionKey) || detailSections[0];

  refs.detailSummary.innerHTML = `
    <div class="detail-meta"><span>项目名称</span><strong>${escapeHtml(row.itemName)}</strong></div>
    <div class="detail-meta"><span>项目编码</span><strong>${escapeHtml(row.itemCode)}</strong></div>
    <div class="detail-meta"><span>检查类型 / 扫描方式</span><strong>${escapeHtml(row.modality)} / ${escapeHtml(row.scanMode)}</strong></div>
    <div class="detail-meta"><span>状态 / 创建时间</span><strong>${escapeHtml(row.status)} / ${escapeHtml(row.createdAt)}</strong></div>
  `;

  refs.detailTabs.innerHTML = detailSections.map((section) => `
    <button
      class="detail-tab ${section.key === activeSection.key ? "is-active" : ""}"
      type="button"
      data-section="${section.key}"
    >${escapeHtml(section.label)}</button>
  `).join("");

  refs.detailSectionLabel.textContent = `${row.level1Name} / ${row.level2Name} / ${row.level3Name}`;
  refs.detailSectionTitle.textContent = activeSection.title;
  refs.detailSectionContent.textContent = content[activeSection.key];
  refs.detailModal.hidden = false;
}

function renderAll() {
  renderTopBar();
  renderFilters();
  renderTable();
  renderPagination();
  renderDetailModal();
}

function handleSearch() {
  state.filters.modality = refs.modalityFilter.value;
  state.filters.keyword = refs.keywordFilter.value;
  state.page = 1;
  state.detailModal.open = false;
  state.detailModal.row = null;
  renderAll();
}

function toggleUserMenu(force) {
  const nextState = typeof force === "boolean" ? force : !refs.userMenu.hidden;
  refs.userMenu.hidden = nextState;
}

function openDetail(rowId) {
  const row = getVisibleRows().find((item) => item.id === rowId)
    || baseRows.find((item) => item.id === rowId);
  if (!row) {
    return;
  }
  state.detailModal.open = true;
  state.detailModal.row = row;
  state.detailModal.activeSectionKey = "scanPosition";
  renderDetailModal();
}

function closeDetail() {
  state.detailModal.open = false;
  state.detailModal.row = null;
  refs.detailModal.hidden = true;
}

function bindEvents() {
  refs.collapseToggle.addEventListener("click", () => {
    state.sidebarCollapsed = !state.sidebarCollapsed;
    refs.appShell.classList.toggle("is-collapsed", state.sidebarCollapsed);
  });

  refs.userMenuButton.addEventListener("click", () => {
    refs.userMenu.hidden = !refs.userMenu.hidden;
  });

  refs.changePasswordButton.addEventListener("click", () => {
    refs.userMenu.hidden = true;
    showToast("演示说明", "当前原型仅保留用户菜单壳和入口，不接入真实密码修改流程。");
  });

  refs.switchHospitalButton.addEventListener("click", () => {
    refs.userMenu.hidden = true;
    state.selectedHospitalId = state.selectedHospitalId === 301 ? 302 : 301;
    renderTopBar();
    showToast("上下文已切换", `当前医院切换为 ${getCurrentHospital().name}。`);
  });

  refs.logoutButton.addEventListener("click", () => {
    refs.userMenu.hidden = true;
    showToast("演示说明", "本页保持登录态展示，不执行真实退出。", "warning");
  });

  refs.searchButton.addEventListener("click", handleSearch);
  refs.modalityFilter.addEventListener("change", handleSearch);
  refs.keywordFilter.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  });

  refs.tableBody.addEventListener("click", (event) => {
    const button = event.target.closest("[data-action='detail']");
    if (!button) {
      return;
    }
    openDetail(Number(button.dataset.rowId));
  });

  refs.pagination.addEventListener("click", (event) => {
    const button = event.target.closest("[data-page]");
    if (!button) {
      return;
    }
    const page = Number(button.dataset.page);
    if (!Number.isFinite(page) || button.classList.contains("is-disabled")) {
      return;
    }
    state.page = page;
    state.detailModal.open = false;
    state.detailModal.row = null;
    renderTable();
    renderPagination();
    refs.detailModal.hidden = true;
  });

  refs.pagination.addEventListener("change", (event) => {
    if (event.target.id === "pageSizeSelect") {
      state.pageSize = Number(event.target.value);
      state.page = 1;
      state.detailModal.open = false;
      state.detailModal.row = null;
      renderTable();
      renderPagination();
      return;
    }
    if (event.target.id === "gotoInput") {
      const targetPage = Number(event.target.value);
      if (Number.isFinite(targetPage)) {
        state.page = Math.min(getTotalPages(), Math.max(1, targetPage));
        state.detailModal.open = false;
        state.detailModal.row = null;
        renderTable();
        renderPagination();
      }
    }
  });

  refs.closeDetailButton.addEventListener("click", closeDetail);
  refs.detailModal.addEventListener("click", (event) => {
    if (event.target === refs.detailModal) {
      closeDetail();
      return;
    }
    const tab = event.target.closest("[data-section]");
    if (!tab) {
      return;
    }
    state.detailModal.activeSectionKey = tab.dataset.section;
    renderDetailModal();
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".user-box")) {
      refs.userMenu.hidden = true;
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeDetail();
      refs.userMenu.hidden = true;
    }
  });

  document.querySelectorAll("[data-route]").forEach((button) => {
    button.addEventListener("click", () => {
      window.location.href = button.dataset.route;
    });
  });
}

renderAll();
bindEvents();
