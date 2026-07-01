export const TOTAL_DURATION = 70

export const scenes = [
  {
    id: 'value-loop',
    index: '01',
    start: 0,
    end: 6,
    title: '青藤医生平台',
    subtitle: '让检查服务形成闭环',
    visual: '患者检查服务闭环动态流程图',
    voiceover:
      '青藤平台通过打通患者预约、到院检查、报告回传和报告解读，帮助医生形成更规范的患者管理闭环，减少患者流失。',
    captions: ['青藤平台打通患者预约', '到院检查与报告回传', '帮助医生形成闭环'],
    keywords: ['患者预约', '报告回传', '医生解读', '患者管理'],
  },
  {
    id: 'onboarding',
    index: '02',
    start: 6,
    end: 14,
    title: '01 医生如何入驻平台',
    subtitle: '三步完成开通',
    visual: '医生入驻三步流程卡片',
    voiceover:
      '医生入驻流程也很简单。完成劳务协议签署后，由运营协助扫码提交信息，平台审核通过后，即可开通医生端服务。',
    captions: ['医生入驻流程很简单', '运营协助提交信息', '审核通过开通服务'],
    keywords: ['劳务协议', '运营协助', '平台审核'],
  },
  {
    id: 'service-mode',
    index: '03',
    start: 14,
    end: 20,
    title: '02 选择适合的患者服务方式',
    subtitle: '运营协助，平台赋能',
    visual: '运营人员与医生沟通示意',
    voiceover:
      '医生可以结合自身场景，与运营人员沟通，选择适合自己的患者服务方式，由平台提供流程和物料支持。',
    captions: ['结合医生自身场景', '选择患者服务方式', '平台提供流程支持'],
    keywords: ['运营协助', '平台赋能', '物料支持'],
  },
  {
    id: 'patient-booking',
    index: '04',
    start: 20,
    end: 40,
    title: '03 患者如何完成检查预约',
    subtitle: '小程序自助预约流程',
    visual: '手机小程序 UI 快速切换',
    voiceover:
      '患者端可以通过小程序完成自助检查预约。患者选择检查项目，填写主诉和预约时间，选择就近机构并完成支付。检查完成后，报告回传至平台，并通过短信提醒患者查看。',
    captions: ['患者扫码进入小程序', '选择项目与预约时间', '就近机构完成支付', '报告回传提醒查看'],
    keywords: ['患者预约', '检查机构', '报告回传', '短信提醒'],
  },
  {
    id: 'doctor-report',
    index: '05',
    start: 40,
    end: 48,
    title: '04 医生如何完成报告解读任务',
    subtitle: '任务分配与 AI 辅助确认',
    visual: '医生端任务列表与报告详情',
    voiceover:
      '患者报告完成后，平台可自动给医生分配任务。医生进入任务详情，结合 AI 辅助信息进行确认，完成报告解读服务。',
    captions: ['平台分配待解读任务', '进入任务详情查看', '结合 AI 辅助确认'],
    keywords: ['待解读任务', 'AI 辅助确认', '完成解读'],
  },
  {
    id: 'withdraw',
    index: '06',
    start: 48,
    end: 55,
    title: '05 劳务费明细与提现',
    subtitle: '规范明细，审核打款',
    visual: '劳务费明细页与提现申请页',
    voiceover:
      '医生完成报告解读任务后，系统会自动生成劳务费明细。医生可发起提现申请，平台审核通过后完成打款。',
    captions: ['生成规范劳务费明细', '医生发起提现申请', '平台审核后完成打款'],
    keywords: ['规范劳务费', '提现申请', '平台审核'],
  },
  {
    id: 'future',
    index: '07',
    start: 55,
    end: 65,
    title: '06 沉淀患者资源，打造院后管理能力',
    subtitle: '个人 IP、数字分身与持续服务',
    visual: '未来能力概念图',
    voiceover:
      '未来，平台还将帮助医生沉淀患者资源，打造个人 IP，并依托 AI 数字分身能力，实现更长效的院后管理和持续服务价值。',
    captions: ['帮助医生沉淀患者资源', '打造个人 IP 与数字分身', '形成院后管理能力'],
    keywords: ['数字分身', '院后管理', '持续服务价值'],
  },
  {
    id: 'ending',
    index: '08',
    start: 65,
    end: 70,
    title: '青藤医生平台',
    subtitle: '让医生服务更规范，让患者管理更持续',
    visual: '品牌收束与双端闭环示意',
    voiceover: '青藤医生平台，让医生服务更规范，让患者管理更持续。',
    captions: ['让医生服务更规范', '让患者管理更持续'],
    keywords: ['规范服务', '持续管理'],
  },
]

export const sourceAssets = [
  {
    name: '患者预约教程截图',
    path: '/qingteng-video-assets/patient-booking.jpg',
    usage: '第 4 段小程序预约流程，可作为参考底图；成片默认使用模拟 UI。',
  },
  {
    name: '报告查看教程截图',
    path: '/qingteng-video-assets/report-cloud-film.jpg',
    usage: '第 4 段报告回传提示参考。',
  },
  {
    name: '医生端任务截图',
    path: '/qingteng-video-assets/doctor-task.png',
    usage: '第 5 段医生任务页参考；成片使用脱敏重绘 UI。',
  },
  {
    name: '劳务费提现截图',
    path: '/qingteng-video-assets/withdraw-mobile.png',
    usage: '第 6 段提现页参考；成片使用模拟金额。',
  },
  {
    name: '患者管理截图',
    path: '/qingteng-video-assets/patient-management-mobile.png',
    usage: '第 7 段院后管理参考；成片使用模拟患者标签。',
  },
  {
    name: '参考视频',
    path: '/qingteng-video-assets/reference.mp4',
    usage: '第 4 段患者操作节奏参考，不直接展示真实可识别信息。',
  },
]
