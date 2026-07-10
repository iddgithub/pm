import dayjs from 'dayjs'
import { doctorBindings } from './incentive'

const orderSources = ['运营平台派单', '医院自然流量', '医生转介绍', '患者复购', '线下活动']
const hospitals = ['华西互联网医院', '一脉运营平台', '杭州未来医学诊所', '海曙综合门诊', '鹿城骨科门诊']
const projects = [
  { name: '颈椎CT平扫', code: '62037', amount: 148.55 },
  { name: '颅脑CT平扫', code: '62001', amount: 0.93 },
  { name: '胸部CT筛查', code: '62088', amount: 168.00 },
  { name: '冠脉CTA', code: '62116', amount: 399.00 },
  { name: '腰椎MR平扫', code: '63012', amount: 258.00 },
]
const patientNames = ['贾斌', '熊铃朝', '刘秀兰', '王秀梅', '赵建国', '周海波', '陈文静', '李青']
const paymentChannels = ['微信', '支付宝']
const paymentStatuses = ['已缴费', '待缴费']

function pick(list, index) {
  return list[index % list.length]
}

export const ORDER_ASSOCIATION_STORAGE_KEY = 'pm_agent_order_association_orders_v1'

export const orderAssociationDoctors = doctorBindings.map((item, index) => ({
  id: item.id,
  doctorName: item.doctorName,
  phone: item.phone,
  clinicName: item.clinicName,
  department: item.department,
  operatorName: item.operatorName,
  enabledStatus: item.enabledStatus,
  sequence: index + 1,
}))

export const orderAssociationOrders = Array.from({ length: 18 }, (_, index) => {
  const project = pick(projects, index)
  const patientName = pick(patientNames, index)
  const paymentStatus = pick(paymentStatuses, index)
  const associatedDoctor = index % 4 === 0 ? null : orderAssociationDoctors[index % orderAssociationDoctors.length]
  const createdAt = dayjs('2026-04-29 12:08').subtract(index * 3, 'hour')
  const paymentTime = paymentStatus === '待缴费' ? '-' : createdAt.add(18 + (index % 4) * 7, 'minute').format('YYYY-MM-DD HH:mm')
  const tradeNo = paymentStatus === '待缴费'
    ? '-'
    : `4200003${String(1000000 + index * 127).padStart(7, '0')}`

  return {
    id: `associate-order-${index + 1}`,
    orderNo: `202604${createdAt.format('DDHHmmss')}${String(851934462983 + index * 3721).padStart(12, '0')}`,
    openHospital: pick(hospitals, index),
    orderSource: pick(orderSources, index),
    projectName: project.name,
    projectCode: project.code,
    amount: project.amount,
    patientName,
    phone: `15${String(260000000 + index * 86321).padStart(9, '0')}`,
    paymentChannel: pick(paymentChannels, index),
    tradeNo,
    paymentStatus,
    paymentTime,
    createdAt: createdAt.format('YYYY-MM-DD HH:mm'),
    associatedDoctorId: associatedDoctor?.id || null,
    associatedDoctorName: associatedDoctor?.doctorName || '',
    associatedDoctorPhone: associatedDoctor?.phone || '',
    associatedClinicName: associatedDoctor?.clinicName || '',
    associatedOperatorName: associatedDoctor?.operatorName || '',
    associatedAt: associatedDoctor ? createdAt.add(1, 'hour').format('YYYY-MM-DD HH:mm') : '',
  }
})

export function cloneOrderAssociationOrders() {
  return JSON.parse(JSON.stringify(orderAssociationOrders))
}
