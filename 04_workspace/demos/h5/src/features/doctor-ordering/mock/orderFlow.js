export const quickDateOptions = ['明天', '后天', '本周六', '本周日']

export const calendarMonths = [
  {
    monthLabel: '2024年1月',
    rows: [
      [
        { day: '休\n元旦', muted: true },
        { day: '2' },
        { day: '今天', isToday: true },
        { day: '4' },
        { day: '5' },
        { day: '6', accent: true },
      ],
      [
        { day: '7', accent: true },
        { day: '8' },
        { day: '9' },
        { day: '10' },
        { day: '17', selected: true },
        { day: '18' },
      ],
      [
        { day: '21', accent: true, sub: '可预约' },
        { day: '22', sub: '可预约' },
        { day: '23', sub: '可预约' },
        { day: '24', sub: '可预约' },
        { day: '25', sub: '可预约' },
        { day: '26', sub: '可预约' },
      ],
    ],
  },
  {
    monthLabel: '2024年2月',
    rows: [
      [
        { day: '1', sub: '可预约' },
        { day: '2', sub: '可预约' },
        { day: '3', accent: true, sub: '可预约' },
        { day: '4', muted: true, sub: '班\n可预约' },
        { day: '5', sub: '可预约' },
        { day: '6', sub: '可预约' },
      ],
      [
        { day: '7', sub: '可预约' },
        { day: '8', sub: '可预约' },
        { day: '除夕', accent: true, sub: '可预约' },
        { day: '春节', accent: true, sub: '休\n可预约' },
        { day: '11', accent: true, sub: '休\n可预约' },
        { day: '12', accent: true, sub: '休\n可预约' },
      ],
    ],
  },
]

export const projectGroups = ['头部', '颈部', '脊柱', '胸部', '腹部', '四肢关节', '血管', '非指定部位', '全部部位']

export const modalityTabs = ['CT', 'MR', 'DR']

export const projectCatalog = [
  {
    id: 'brain-ct-plain-1',
    name: '颅脑CT（平扫）',
    modality: 'CT',
    group: '头部',
    keywords: ['头', '颅脑', 'CT', '平扫'],
    score: 94,
    price: 133.5,
  },
  {
    id: 'brain-ct-plain-2',
    name: '颅脑CT（平扫）',
    modality: 'CT',
    group: '头部',
    keywords: ['头', '颅脑', 'CT', '平扫'],
    score: 91,
    price: 133.5,
  },
  {
    id: 'brain-mr-plain',
    name: 'MR颅脑平扫',
    modality: 'MR',
    group: '头部',
    keywords: ['头', '颅脑', 'MR', '平扫'],
    score: 88,
    price: 133.5,
  },
  {
    id: 'chest-ct-plain-1',
    name: '胸部CT（平扫）',
    modality: 'CT',
    group: '胸部',
    keywords: ['胸', '胸部', 'CT', '平扫'],
    score: 86,
    price: 161.7,
  },
  {
    id: 'chest-ct-plain-2',
    name: '胸部CT（平扫）',
    modality: 'CT',
    group: '胸部',
    keywords: ['胸', '胸部', 'CT', '平扫'],
    score: 84,
    price: 161.7,
  },
  {
    id: 'chest-dr-front',
    name: '胸部DR正位',
    modality: 'DR',
    group: '胸部',
    keywords: ['胸', '胸部', 'DR'],
    score: 73,
    price: 78,
  },
  {
    id: 'abdomen-mr',
    name: '上腹部MR平扫',
    modality: 'MR',
    group: '腹部',
    keywords: ['腹', '腹部', 'MR'],
    score: 72,
    price: 286,
  },
  {
    id: 'neck-ct',
    name: '颈部CT（平扫）',
    modality: 'CT',
    group: '颈部',
    keywords: ['颈', '颈部', 'CT'],
    score: 71,
    price: 142,
  },
  {
    id: 'angiography-brain',
    name: '1.5MR颅内动脉血管成像（MRA）',
    modality: 'MR',
    group: '血管',
    keywords: ['头', '动脉', '血管', 'MRA', 'MR'],
    score: 82,
    price: 208,
  },
]

export const searchHistorySeed = ['肝脏平扫', '胆囊平扫', '癫痫套餐一']

export const aiPromptChips = [
  '头疼，胸闷，做什么影像检查？',
  '头疼，胸闷，做什么影像检查？',
  '头疼，胸闷，做什么影像检查？',
]

export const aiRecommendationCards = [
  {
    id: 'brain-mr-plain',
    reason: '快速评估脑栓塞、主动脉夹层以及冠状动脉情况，优先排查神经系统相关异常。',
    selected: true,
  },
  {
    id: 'brain-ct-plain-1',
    reason: '快速完成头痛急性期排查，适合先做基础影像筛查。',
    selected: false,
  },
  {
    id: 'chest-ct-plain-1',
    reason: '胸闷症状需补充胸部影像信息，帮助区分心肺系统潜在问题。',
    selected: false,
  },
]

export const institutionDateCards = [
  { key: 'today', week: '今天', date: '12.15' },
  { key: 'wed', week: '周二', date: '12.16' },
  { key: 'thu', week: '周三', date: '12.17' },
  { key: 'fri', week: '周四', date: '12.18' },
  { key: 'sat', week: '周五', date: '12.20' },
  { key: 'more', week: '更多', date: '日历' },
]

export const institutionFilters = ['距离最近', '只看三甲', '只看公立']

export const institutions = [
  {
    id: 'first-people',
    name: 'XX第一人民医院',
    address: '地址：XX县XX路XX号',
    distance: '3.4km',
    grade: '三级医疗机构',
    type: '影像中心',
    modalities: ['CT', 'DR', 'MR'],
    selected: true,
  },
  {
    id: 'nanchang-center-a',
    name: '南昌一脉阳光医学影像中心中心中心',
    address: '地址：汉阳区XXXXXXXXXXXXXX',
    distance: '3.4km',
    grade: '三级医疗机构',
    type: '影像中心',
    modalities: ['CT', 'DR', 'MR'],
  },
  {
    id: 'nanchang-center-b',
    name: '南昌一脉阳光医学影像中心',
    address: '地址：汉阳区XXXXXXXXXXXXXX',
    distance: '3.4km',
    grade: '三级医疗机构',
    type: '影像中心',
    modalities: ['CT', 'DR', 'MR'],
  },
]

export const timeSlotGroups = [
  {
    label: '上午',
    slots: ['9:00-10:00', '10:00-11:00', '11:00-12:00'],
  },
  {
    label: '下午',
    slots: ['14:00-15:00', '15:00-16:00', '16:00-17:00'],
  },
]

export const patientRelationOptions = ['本人', '父母', '配偶', '子女']

export const homeOrders = [
  {
    id: 'live-order',
    patientName: '李XX',
    orderNo: 'hdf_2025122660001',
    projectName: 'MR颅脑（平扫）',
    checkTime: '12月15日 明天',
    status: '待完成',
    statusTone: 'pending',
    hospitalName: 'XX第一人民医院',
    schedule: '2025-12-15 11:00-12:00',
    detail: '1.5MR颅内动脉血管成像（MRA）',
  },
]

export const mineOrders = [
  { id: 'mine-pending', label: '待24h支付', status: 'pending' },
  { id: 'mine-expired', label: '已超时自动失效', status: 'expired' },
  { id: 'mine-paid', label: '已支付待检查', status: 'paid' },
  { id: 'mine-completed', label: '已完成', status: 'completed' },
  { id: 'mine-refund', label: '已退费', status: 'refund' },
]

export const sharedPatientOrderSeed = {
  shareToken: 'demo-order-20251215',
  status: 'pending',
  institutionId: 'first-people',
  appointmentDate: '2025年12月15日',
  appointmentHint: '明天',
  projectIds: ['brain-ct-plain-1'],
  projectTimes: {
    'brain-ct-plain-1': '11:00-12:00',
  },
}

export const detailStatusMeta = {
  pending: {
    screenTitle: '订单详情',
    orderTitle: '订单详情',
    summary: '剩余24:00:00订单将自动关闭，请您尽快付款',
    buttonLabel: '支付订单',
    buttonTone: 'primary',
  },
  expired: {
    screenTitle: '订单详情',
    orderTitle: '订单详情',
    summary: '订单超时自动失效，请联系您的服务人员咨询帮助',
    buttonLabel: '订单已超时已自动失效',
    buttonTone: 'disabled',
  },
  paid: {
    screenTitle: '支付详情',
    orderTitle: '订单状态：已支付',
    summary: '请您检查当天携带身份证，按时履约',
    buttonLabel: '取消预约',
    buttonTone: 'outline',
  },
  completed: {
    screenTitle: '支付详情',
    orderTitle: '订单状态：已完成',
    summary: '您已完成检查订单',
    buttonLabel: '',
    buttonTone: 'hidden',
  },
  refund: {
    screenTitle: '支付详情',
    orderTitle: '订单状态：已退费',
    summary: '预计1-×个工作日原路反馈，请您注意查收',
    buttonLabel: '',
    buttonTone: 'hidden',
  },
}

export const detailDescription =
  'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX XXXXXXX 说明文案用于模拟线上医院介绍与服务说明，点击查看更多。'

export const defaultOrderNo = '20324423452324555'
