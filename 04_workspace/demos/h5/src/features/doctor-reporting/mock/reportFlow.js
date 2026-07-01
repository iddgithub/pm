export const doctorProfile = {
  name: '刘医生',
  role: '医生人员',
}

export const initialReports = [
  {
    id: 'report-pending-001',
    month: '5月',
    title: 'CT颅脑平扫影像报告',
    status: 'pending',
    patientName: '刘小福',
    age: 58,
    phone: '134****0750',
    reportTime: '2026-05-10 12:10:16',
    amount: 80,
    examNo: 'CT20250923',
    examTime: '2025-09-23 10:20:45',
    examItem: '腰椎平扫+增强',
    institution: '北京一脉阳光医学影像诊断中心',
    reportDoctor: '张XX',
    reviewDoctor: '张XX',
    reportDate: '2025-09-23 12:23:34',
    viewerTag: 'MR',
    interpretation:
      '本次影像整体未见明显异常，当前无需急诊干预，建议结合主诉与既往检查进一步判断，并告知按需复查。',
  },
  {
    id: 'report-done-002',
    month: '5月',
    title: 'CT胸部平扫影像报告',
    status: 'done',
    patientName: '刘小福',
    age: 58,
    phone: '134****0750',
    reportTime: '2026-05-10 12:10:16',
    amount: 80,
    examNo: 'CT20250924',
    examTime: '2025-09-23 09:56:28',
    examItem: '胸部平扫',
    institution: '北京一脉阳光医学影像诊断中心',
    reportDoctor: '张XX',
    reviewDoctor: '张XX',
    reportDate: '2025-09-23 11:48:02',
    viewerTag: 'MR',
    interpretation:
      '肺纹理走行清晰，未见明显实变与积液表现，建议结合临床情况继续随访。',
  },
]

export const initialServiceStats = {
  totalFee: 788,
  withdrawableBalance: 788,
  completedCount: 6,
}

export const initialWithdrawalRecords = [
  {
    id: 'withdraw-001',
    month: '2026年5月',
    title: '2026年05月提现',
    status: 'processing',
    amount: 468,
    requestedAt: '05-10 12:10:16',
    arrivedAt: '05-10 13:10:16',
  },
  {
    id: 'withdraw-002',
    month: '2026年5月',
    title: '2026年05月提现',
    status: 'paid',
    amount: 468,
    requestedAt: '05-10 12:10:16',
    arrivedAt: '05-10 13:10:16',
  },
  {
    id: 'withdraw-003',
    month: '2026年5月',
    title: '2026年05月提现',
    status: 'paid',
    amount: 468,
    requestedAt: '05-10 12:10:16',
    arrivedAt: '05-10 13:10:16',
  },
  {
    id: 'withdraw-004',
    month: '2026年5月',
    title: '2026年05月提现',
    status: 'rejected',
    amount: 468,
    requestedAt: '05-10 12:10:16',
    arrivedAt: '05-10 13:10:16',
  },
]

export const manageFilters = ['全部', '待解读', '已解读']

export const monthOptions = ['2026年5月', '2026年4月', '2026年3月']

export const serviceMonthOptions = ['5月', '4月', '3月']
