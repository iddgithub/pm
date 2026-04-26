export const AI_REPORT_STORAGE_KEY = 'pm_agent_ai_report_orders_v1'

export const patientSummary = {
  visibleReports: 2,
  waitingReports: 1,
  latestUpdatedAt: '2026-04-22 12:05',
}

export const patientReportList = [
  {
    id: 'patient-report-1',
    orderNo: 'AI202604220001',
    patientName: '刘秀兰',
    clinicName: '辽宁一脉阳光医学影像诊断中心',
    projectName: 'CT冠状动脉钙化积分',
    examTime: '2026-03-26 14:17',
    imageNo: '2603260107',
    reportStatus: 'AI报告可见',
    aiProductName: '冠脉钙化积分辅助诊断',
    aiFileName: 'AI报告分析文件示例-冠脉钙化积分.png',
    visibleVersion: 2,
    publishedAt: '2026-04-22 12:05',
    updateNote: '当前展示为最新版本，替换后未额外发送提醒。',
  },
  {
    id: 'patient-report-2',
    orderNo: 'AI202604220002',
    patientName: '王秀梅',
    clinicName: '宁波一脉阳光影像中心',
    projectName: 'CT颅脑平扫',
    examTime: '2026-04-20 09:42',
    imageNo: '2604201148',
    reportStatus: '待发布',
    aiProductName: '脑卒中风险辅助诊断',
    aiFileName: '',
    visibleVersion: 0,
    publishedAt: '-',
    updateNote: '运营已上传待发布，患者侧暂不可见。',
  },
  {
    id: 'patient-report-3',
    orderNo: 'AI202604220003',
    patientName: '赵建国',
    clinicName: '杭州一脉阳光影像诊断中心',
    projectName: '冠脉CTA',
    examTime: '2026-04-18 15:06',
    imageNo: '2604182305',
    reportStatus: '待上传',
    aiProductName: '冠脉狭窄辅助诊断',
    aiFileName: '',
    visibleVersion: 0,
    publishedAt: '-',
    updateNote: '检查已完成，等待运营上传 AI 报告分析文件。',
  },
]

export function buildPatientReportsFromOrders(orders) {
  return orders.flatMap((order) => order.projects.map((project) => ({
    id: project.id,
    orderNo: order.orderNo,
    patientName: order.patientName,
    clinicName: order.clinicName,
    projectName: project.projectName,
    examTime: order.examTime,
    imageNo: order.imageNo,
    reportStatus:
      project.aiReportStatus === '已发布' || project.aiReportStatus === '已替换'
        ? 'AI报告可见'
        : project.aiReportStatus === '已上传待发布'
          ? '待发布'
          : '待上传',
    aiProductName: project.aiProductName,
    aiFileName: project.currentFileName,
    visibleVersion: project.currentVersion,
    publishedAt: project.publishedAt,
    updateNote:
      project.aiReportStatus === '已替换'
        ? '当前展示为最新替换版本，后台保留历史留痕。'
        : project.aiReportStatus === '已发布'
          ? 'AI 报告已发布，可直接查看。'
          : project.aiReportStatus === '已上传待发布'
            ? '运营已上传待发布，患者侧暂不可见。'
            : '检查已完成，等待运营上传 AI 报告分析文件。',
  })))
}

export function getPatientSummary(reports) {
  const visibleReports = reports.filter((item) => item.reportStatus === 'AI报告可见').length
  const waitingReports = reports.filter((item) => item.reportStatus === '待发布').length
  const latestUpdatedAt = reports
    .filter((item) => item.publishedAt && item.publishedAt !== '-')
    .map((item) => item.publishedAt)
    .sort()
    .at(-1) || '-'

  return {
    visibleReports,
    waitingReports,
    latestUpdatedAt,
  }
}
