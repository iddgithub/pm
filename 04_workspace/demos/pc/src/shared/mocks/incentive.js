import dayjs from 'dayjs'

const regions = ['江西省南昌市某某地址', '江西省南昌市红谷滩区某某地址', '江西省南昌市西湖区某某地址', '江西省南昌市青山湖区某某地址']
const departments = ['放射科', '心内科', '神经内科', '骨科']
const operators = [
  { name: '运营A', region: '杭州西湖区', department: '放射科' },
  { name: '运营B', region: '杭州拱墅区', department: '心内科' },
  { name: '运营C', region: '宁波鄞州区', department: '神经内科' },
  { name: '运营D', region: '温州鹿城区', department: '骨科' },
]
const clinics = ['城西影像中心', '滨江康复诊所', '海曙综合门诊', '鹿城骨科门诊', '未来医学诊所']
const doctors = ['张医生', '李医生', '王医生', '赵医生', '周医生', '吴医生', '郑医生', '钱医生']
const doctorTypes = ['互联网医生', '线下医生']
const auditStatuses = ['待审核', '审核通过', '审核驳回']
const enableStatuses = ['已启用', '已停用']
const withdrawStatuses = ['待审核', '审核通过', '已打款', '已驳回']
const orderStatuses = ['已支付', '已检查', '已出报告', '已取消']

function pick(list, index) {
  return list[index % list.length]
}

export const doctorApplications = Array.from({ length: 28 }, (_, index) => ({
  id: index + 1,
  applicationNo: `SQ${dayjs().subtract(index, 'day').format('YYYYMMDD')}${String(index + 1).padStart(4, '0')}`,
  applyTime: dayjs().subtract(index, 'day').format('YYYY-MM-DD HH:mm'),
  doctorType: pick(doctorTypes, index),
  doctorName: pick(doctors, index),
  phone: `1380000${String(100 + index).padStart(4, '0')}`,
  clinicName: pick(clinics, index),
  region: pick(regions, index),
  department: pick(departments, index),
  auditStatus: pick(auditStatuses, index),
  enabledStatus: pick(enableStatuses, index),
  credentialStatus: index % 4 === 0 ? '待补充' : '已提交',
  note: index % 5 === 0 ? '需补充诊所门头照' : '资料齐全',
}))

export const doctorBindings = Array.from({ length: 24 }, (_, index) => {
  const operator = pick(operators, index)
  const doctorRate = 8 + (index % 5)
  const platformRate = 15
  return {
    id: index + 1,
    doctorName: pick(doctors, index),
    phone: `1390000${String(200 + index).padStart(4, '0')}`,
    clinicName: pick(clinics, index + 1),
    clinicRegion: pick(regions, index + 1),
    department: pick(departments, index + 2),
    operatorName: operator.name,
    operatorRegion: operator.region,
    operatorDepartment: operator.department,
    doctorRate,
    operatorRate: platformRate - doctorRate,
    platformRate,
    effectiveAt: dayjs().subtract(index % 7, 'day').format('YYYY-MM-DD'),
    enabledStatus: index % 7 === 0 ? '已停用' : '已启用',
    bindingStatus: index % 6 === 0 ? '待确认' : '已绑定',
  }
})

export const commissionConfigs = doctorBindings.map((item, index) => ({
  id: item.id,
  doctorName: item.doctorName,
  operatorName: item.operatorName,
  platformRate: item.platformRate,
  doctorRate: item.doctorRate,
  operatorRate: item.operatorRate,
  effectiveAt: item.effectiveAt,
  expireAt: dayjs(item.effectiveAt).add(6, 'month').format('YYYY-MM-DD'),
  status: index % 5 === 0 ? '即将失效' : '生效中',
  updatedBy: index % 2 === 0 ? '平台管理员' : '运营主管',
}))

export const withdrawalRequests = Array.from({ length: 16 }, (_, index) => ({
  id: index + 1,
  applyTime: dayjs().subtract(index * 2, 'day').format('YYYY-MM-DD HH:mm'),
  doctorName: pick(doctors, index),
  amount: 600 + index * 120,
  availableAmount: 1200 + index * 200,
  status: pick(withdrawStatuses, index),
  reviewer: index % 3 === 0 ? '王主管' : '李主管',
  processedAt: index % 4 === 0 ? '-' : dayjs().subtract(index, 'day').format('YYYY-MM-DD HH:mm'),
  rejectReason: index % 4 === 0 ? '银行卡信息待补充' : '-',
}))

export const dashboardMetrics = [
  { key: 'orderCount', label: '全平台开单数', value: 1256, suffix: '单' },
  { key: 'paidCount', label: '已支付订单数', value: 986, suffix: '单' },
  { key: 'reportCount', label: '已出报告订单数', value: 842, suffix: '单' },
  { key: 'doctorBonus', label: '医生提成总金额', value: 186500, prefix: '¥' },
  { key: 'operatorBonus', label: '运营提成总金额', value: 94200, prefix: '¥' },
  { key: 'signedDoctors', label: '已签约医生人数', value: 136, suffix: '人' },
]

export const dashboardTrend = Array.from({ length: 7 }, (_, index) => ({
  date: dayjs().subtract(6 - index, 'day').format('MM-DD'),
  orderCount: 120 + index * 8,
  reportCount: 90 + index * 7,
  doctorBonus: 22000 + index * 1200,
}))

export const regionRanking = regions.map((name, index) => ({
  key: name,
  name,
  orderCount: 320 - index * 46,
  signedDoctors: 38 - index * 5,
  reportRate: `${92 - index * 3}%`,
}))

export const operatorRanking = operators.map((item, index) => ({
  key: item.name,
  name: item.name,
  region: item.region,
  bindingDoctors: 28 - index * 4,
  orderCount: 260 - index * 24,
  operatorBonus: 32000 - index * 3600,
}))

export const doctorRanking = Array.from({ length: 6 }, (_, index) => ({
  key: index + 1,
  doctorName: pick(doctors, index),
  clinicName: pick(clinics, index),
  department: pick(departments, index),
  orderCount: 48 - index * 5,
  doctorBonus: 8600 - index * 650,
}))

export const departmentDistribution = departments.map((name, index) => ({
  key: name,
  name,
  signedDoctors: 30 - index * 3,
  paidCount: 260 - index * 28,
}))

export const operatorSummary = operators.map((item, index) => ({
  key: item.name,
  operatorName: item.name,
  region: item.region,
  department: item.department,
  bindingDoctors: 30 - index * 4,
  orderCount: 220 - index * 22,
  paidCount: 190 - index * 20,
  reportCount: 166 - index * 18,
  operatorBonus: 28000 - index * 3400,
}))

export const doctorPerformance = Array.from({ length: 10 }, (_, index) => ({
  key: index + 1,
  doctorName: pick(doctors, index),
  clinicName: pick(clinics, index),
  region: pick(regions, index),
  department: pick(departments, index),
  bindingPatients: 96 - index * 6,
  orderCount: 42 - index * 2,
  paidCount: 36 - index * 2,
  reportCount: 31 - index * 2,
  doctorBonus: 6800 - index * 430,
  operatorBonus: 3400 - index * 210,
}))

export const patientPerformance = Array.from({ length: 12 }, (_, index) => ({
  key: index + 1,
  patientName: `患者${index + 1}`,
  doctorName: pick(doctors, index),
  clinicName: pick(clinics, index),
  region: pick(regions, index),
  department: pick(departments, index),
  latestProject: pick(['CT颅脑平扫', '肺部CT筛查', '骨密度检查', '冠脉CTA'], index),
  orderCount: 6 - (index % 3),
  paidCount: 5 - (index % 2),
  reportCount: 4 - (index % 2),
  doctorBonus: 1680 - index * 95,
}))

export const orderDetails = Array.from({ length: 14 }, (_, index) => ({
  id: index + 1,
  orderNo: `JD202604${String(3100 + index).padStart(4, '0')}`,
  patientName: `患者${index + 1}`,
  projectName: pick(['CT颅脑平扫', '肺部CT筛查', '骨密度检查', '冠脉CTA'], index),
  payTime: dayjs().subtract(index, 'day').format('YYYY-MM-DD HH:mm'),
  reportTime: index % 4 === 0 ? '-' : dayjs().subtract(index, 'day').add(6, 'hour').format('YYYY-MM-DD HH:mm'),
  orderStatus: pick(orderStatuses, index),
  doctorBonus: 120 + index * 18,
  operatorBonus: 80 + index * 12,
}))

export const monthlyReviewMetrics = [
  { key: 'monthOrders', label: '本月开单数', value: 986, suffix: '单' },
  { key: 'monthPaid', label: '已支付订单数', value: 842, suffix: '单' },
  { key: 'monthReported', label: '已出报告订单数', value: 778, suffix: '单' },
  { key: 'monthDoctorBonus', label: '医生提成总金额', value: 128600, prefix: '¥' },
  { key: 'monthOperatorBonus', label: '运营提成总金额', value: 62500, prefix: '¥' },
  { key: 'newSigned', label: '新增签约医生数', value: 18, suffix: '人' },
]

export const problemDoctors = [
  { key: 1, doctorName: '赵医生', clinicName: '滨江康复诊所', reason: '近14天无新增开单', owner: '运营B' },
  { key: 2, doctorName: '周医生', clinicName: '海曙综合门诊', reason: '支付后未转已出报告 4 单', owner: '运营C' },
  { key: 3, doctorName: '吴医生', clinicName: '未来医学诊所', reason: '本月开单仅 2 单', owner: '运营A' },
]

export const problemOperators = [
  { key: 1, operatorName: '运营D', region: '温州鹿城区', reason: '本月仅新增 1 名签约医生', followUp: '补充区域拜访计划' },
  { key: 2, operatorName: '运营B', region: '杭州拱墅区', reason: '绑定医生多但开单转化低', followUp: '重点跟进心内科' },
]

export const strategyItems = [
  { key: 1, summary: '补齐拱墅区心内科医生培训', owner: '王主管', dueDate: '2026-04-28', status: '进行中', result: '已安排两场线上培训' },
  { key: 2, summary: '温州区域新增签约医生专项拓展', owner: '李主管', dueDate: '2026-04-30', status: '待启动', result: '-' },
  { key: 3, summary: '跟进已支付未出报告订单', owner: '平台运营', dueDate: '2026-04-24', status: '已完成', result: '已清理 7 单积压订单' },
]

export const doctorH5Summary = {
  signedStatus: '已签约',
  monthBonus: 4860,
  availableAmount: 3120,
  pendingAmount: 880,
  totalBonus: 16840,
  reportCount: 36,
  orderStatus: [
    { key: 'paid', label: '已支付', value: 42 },
    { key: 'cancelled', label: '已取消', value: 6 },
    { key: 'checked', label: '已检查', value: 38 },
    { key: 'reported', label: '已出报告', value: 36 },
  ],
}

export const doctorCommissionDetails = Array.from({ length: 8 }, (_, index) => ({
  id: index + 1,
  orderNo: `H5202604${String(5100 + index).padStart(4, '0')}`,
  patientName: `患者${index + 1}`,
  phone: `1360000${String(300 + index).padStart(4, '0')}`,
  projectName: pick(['CT颅脑平扫', '肺结节筛查', '冠脉CTA', '骨密度检查'], index),
  projectAmount: 399 + index * 80,
  payTime: dayjs().subtract(index + 1, 'day').format('YYYY-MM-DD HH:mm'),
  reportTime: dayjs().subtract(index, 'day').format('YYYY-MM-DD HH:mm'),
  status: pick(['已支付', '已检查', '已出报告'], index),
  bonus: 98 + index * 16,
  bonusStatus: pick(['已确认', '已申请提现', '已打款'], index),
}))

export const doctorWithdrawRecords = [
  { id: 1, applyTime: '2026-04-18 11:20', amount: 1200, status: '待审核', processedAt: '-', rejectReason: '-' },
  { id: 2, applyTime: '2026-04-10 09:15', amount: 980, status: '已打款', processedAt: '2026-04-11 14:10', rejectReason: '-' },
  { id: 3, applyTime: '2026-04-03 16:40', amount: 650, status: '已驳回', processedAt: '2026-04-04 10:05', rejectReason: '收款信息待补充' },
]

export const doctorPatients = Array.from({ length: 6 }, (_, index) => ({
  id: index + 1,
  patientName: `患者${index + 1}`,
  phone: `1370000${String(600 + index).padStart(4, '0')}`,
  latestProject: pick(['CT颅脑平扫', '肺部筛查', '骨密度检查'], index),
  reportTime: dayjs().subtract(index, 'day').format('YYYY-MM-DD'),
  followUpStatus: index % 2 === 0 ? '已随访' : '待随访',
  reviewReminder: index % 3 === 0 ? '7天后复查' : '30天后回访',
}))

export const doctorProfile = {
  doctorName: '张医生',
  clinicName: '城西影像中心',
  clinicAddress: '杭州市西湖区紫金港路 88 号',
  credentialStatus: '执业资质已通过',
  receiveMethod: '招商银行尾号 6621',
}

export const operatorH5Summary = {
  bindingDoctors: 28,
  monthOrders: 132,
  reportOrders: 106,
  operatorBonus: 18600,
  newSignedDoctors: 5,
}

export const operatorTrend = Array.from({ length: 6 }, (_, index) => ({
  key: index + 1,
  period: `第 ${index + 1} 周`,
  orders: 18 + index * 3,
  reported: 14 + index * 3,
  bonus: 2400 + index * 180,
}))

export const operatorDoctorCards = Array.from({ length: 8 }, (_, index) => ({
  id: index + 1,
  doctorName: pick(doctors, index),
  clinicName: pick(clinics, index),
  region: pick(regions, index),
  department: pick(departments, index),
  orderCount: 32 - index * 2,
  paidCount: 28 - index * 2,
  reportCount: 24 - index * 2,
  doctorBonus: 5200 - index * 320,
  operatorBonus: 2600 - index * 180,
}))

export const operatorDoctorDetail = {
  doctorName: '张医生',
  clinicName: '城西影像中心',
  orderCount: 32,
  paidCount: 28,
  reportCount: 24,
  doctorBonus: 5200,
  operatorBonus: 2600,
}
