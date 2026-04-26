export const doctorOverview = {
  doctorName: '张医生',
  clinicName: '城西影像中心',
  department: '影像科',
  signStatus: '已签约',
  reportFee: 2000,
  patientCount: 80,
  signNote: '平台已审核通过，并绑定运营 周运营；医生分佣比例 10%，可按出报告订单确认收益。',
}

export const doctorMonths = ['全部月份', '4月', '3月']

export const doctorOrderRows = [
  { id: 1, month: '4月', patientName: '刘大福', phone: '13288888888', itemCount: 1, amount: 80, status: '已支付' },
  { id: 2, month: '4月', patientName: '王美玲', phone: '13277776666', itemCount: 1, amount: 80, status: '已取消' },
  { id: 3, month: '4月', patientName: '陈晓东', phone: '13166665555', itemCount: 1, amount: 80, status: '已检查' },
  { id: 4, month: '4月', patientName: '赵海生', phone: '13055554444', itemCount: 2, amount: 160, status: '已出报告' },
  { id: 5, month: '3月', patientName: '周阿姨', phone: '13944443333', itemCount: 2, amount: 160, status: '已出报告' },
  { id: 6, month: '3月', patientName: '李秋月', phone: '13833332222', itemCount: 1, amount: 80, status: '已支付' },
]

export const doctorCommissionRows = [
  {
    id: 1,
    month: '4月',
    orderNo: '888888888888',
    projectName: 'CT颅脑平扫',
    patientName: '刘大福',
    phone: '13288888888',
    settledAt: '2026.4.19 12:12',
    projectAmount: 600,
    bonus: 10,
  },
  {
    id: 2,
    month: '4月',
    orderNo: '888888888889',
    projectName: '胸部 CT 筛查',
    patientName: '王美玲',
    phone: '13277776666',
    settledAt: '2026.4.18 10:26',
    projectAmount: 600,
    bonus: 10,
  },
  {
    id: 3,
    month: '4月',
    orderNo: '888888888890',
    projectName: '冠脉 CTA',
    patientName: '陈晓东',
    phone: '13166665555',
    settledAt: '2026.4.16 09:42',
    projectAmount: 780,
    bonus: 12,
  },
  {
    id: 4,
    month: '3月',
    orderNo: '888888888891',
    projectName: '肺结节复查',
    patientName: '周阿姨',
    phone: '13944443333',
    settledAt: '2026.3.30 15:08',
    projectAmount: 520,
    bonus: 8,
  },
]

export const doctorPatientRows = [
  {
    id: 1,
    patientName: '刘大福',
    phone: '13288888888',
    projectName: 'CT颅脑平扫',
    reportTime: '2026-4-10',
    history: '主诉病史：高血压 5 年，近期头晕加重',
    followStatus: '待随访',
  },
  {
    id: 2,
    patientName: '王美玲',
    phone: '13277776666',
    projectName: '胸部 CT 筛查',
    reportTime: '2026-4-09',
    history: '主诉病史：长期咳嗽，建议 14 天后复查',
    followStatus: '已随访',
  },
  {
    id: 3,
    patientName: '陈晓东',
    phone: '13166665555',
    projectName: '冠脉 CTA',
    reportTime: '2026-4-08',
    history: '主诉病史：运动后胸闷，已同步家属注意事项',
    followStatus: '待随访',
  },
  {
    id: 4,
    patientName: '周阿姨',
    phone: '13944443333',
    projectName: '肺结节复查',
    reportTime: '2026-4-05',
    history: '主诉病史：既往影像已补充，待电话回访',
    followStatus: '已随访',
  },
]
