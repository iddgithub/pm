export const mockPatients = [
  {
    id: '1',
    name: '刘大福',
    age: 58,
    gender: '男',
    phone: '134****0750',
    tags: ['术后随访', '重点关注'],
    lastVisitDate: '2026-05-10',
    nextFollowupDate: '2026-06-15',
    reportCount: 3,
    followupStatus: 'pending'
  },
  {
    id: '2',
    name: '张小明',
    age: 45,
    gender: '男',
    phone: '138****1234',
    tags: ['常规随访'],
    lastVisitDate: '2026-04-20',
    nextFollowupDate: '2026-06-20',
    reportCount: 5,
    followupStatus: 'completed'
  },
  {
    id: '3',
    name: '王小红',
    age: 38,
    gender: '女',
    phone: '139****5678',
    tags: ['新患者'],
    lastVisitDate: '2026-05-28',
    nextFollowupDate: '2026-06-10',
    reportCount: 1,
    followupStatus: 'overdue'
  },
  {
    id: '4',
    name: '陈大伟',
    age: 62,
    gender: '男',
    phone: '136****9012',
    tags: ['术后随访', '高血压'],
    lastVisitDate: '2026-03-15',
    nextFollowupDate: '2026-06-05',
    reportCount: 8,
    followupStatus: 'pending'
  }
];

export const mockPatientReports = {
  '1': [
    {
      id: 'r1',
      title: 'CT颅脑影像报告',
      reportNo: 'CT20251015089',
      examDate: '2025-10-15 10:53:00',
      examType: 'MR',
      examItem: 'CT颅脑(平扫)',
      institution: '南昌一峰阳光医学诊断中心',
      reportDoctor: '张报告医生',
      reviewDoctor: '刘审核医生',
      reportDate: '2025-10-15 11:20:45',
      findings: '双肺野清晰，未见明显结节及斑片状密度增高影；纵隔居中，心影大小形态正常；双侧胸腔未见积液征象。',
      diagnosis: '胸部CT平扫未见明显异常，请结合临床症状及其他检查综合判断，必要时复查。',
      hasImage: true
    },
    {
      id: 'r2',
      title: '胸部X光片',
      reportNo: 'XR20250822005',
      examDate: '2025-08-22 09:15:00',
      examType: 'X线',
      examItem: '胸部正位片',
      institution: '南昌一峰阳光医学诊断中心',
      reportDoctor: '李报告医生',
      reviewDoctor: '王审核医生',
      reportDate: '2025-08-22 10:00:00',
      findings: '胸廓对称，双肺纹理清晰，未见明显渗出性病灶。',
      diagnosis: '心肺未见明显异常。',
      hasImage: true
    },
    {
      id: 'r3',
      title: '心电图检查',
      reportNo: 'ECG20250610012',
      examDate: '2025-06-10 14:30:00',
      examType: 'ECG',
      examItem: '常规心电图',
      institution: '南昌一峰阳光医学诊断中心',
      reportDoctor: '张报告医生',
      reviewDoctor: '刘审核医生',
      reportDate: '2025-06-10 15:00:00',
      findings: '窦性心律，心率78次/分，各导联波形正常。',
      diagnosis: '正常心电图。',
      hasImage: false
    }
  ],
  '2': [
    {
      id: 'r4',
      title: '腹部B超检查',
      reportNo: 'US20260418002',
      examDate: '2026-04-18 10:00:00',
      examType: 'US',
      examItem: '腹部彩超',
      institution: '南昌一峰阳光医学诊断中心',
      reportDoctor: '王报告医生',
      reviewDoctor: '李审核医生',
      reportDate: '2026-04-18 11:30:00',
      findings: '肝脏大小形态正常，包膜光滑，实质回声均匀。',
      diagnosis: '腹部超声未见明显异常。',
      hasImage: false
    }
  ],
  '3': [
    {
      id: 'r5',
      title: '血常规检查',
      reportNo: 'BL20260525001',
      examDate: '2026-05-25 08:30:00',
      examType: 'LAB',
      examItem: '血常规五分类',
      institution: '南昌一峰阳光医学诊断中心',
      reportDoctor: '张报告医生',
      reviewDoctor: '刘审核医生',
      reportDate: '2026-05-25 09:30:00',
      findings: '白细胞、红细胞、血小板计数均在正常范围内。',
      diagnosis: '血常规基本正常。',
      hasImage: false
    }
  ],
  '4': [
    {
      id: 'r6',
      title: '胸部CT增强',
      reportNo: 'CT20260310007',
      examDate: '2026-03-10 09:00:00',
      examType: 'CT',
      examItem: '胸部CT增强',
      institution: '南昌一峰阳光医学诊断中心',
      reportDoctor: '李报告医生',
      reviewDoctor: '王审核医生',
      reportDate: '2026-03-10 12:00:00',
      findings: '双肺可见散在小结节影，较大者直径约5mm。',
      diagnosis: '双肺小结节，建议6个月后复查。',
      hasImage: true
    }
  ]
};

export const mockFollowupTemplates = [
  {
    id: 't1',
    name: '术后常规随访',
    questions: [
      '术后伤口恢复情况如何？',
      '是否有发热、疼痛等不适症状？',
      '近期饮食、睡眠情况怎么样？',
      '是否按时服用药物？'
    ]
  },
  {
    id: 't2',
    name: '肿瘤复查随访',
    questions: [
      '近期体重是否有明显变化？',
      '是否有咳嗽、胸痛等症状？',
      '上次复查至今有什么不舒服吗？',
      '是否按计划回来复查？'
    ]
  }
];

export const mockPatientTags = ['新患者', '术后随访', '常规随访', '重点关注', '高血压', '糖尿病'];
