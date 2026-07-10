import { useMemo, useState } from 'react'
import {
  Alert,
  Button,
  Card,
  Col,
  Descriptions,
  Empty,
  Modal,
  Row,
  Segmented,
  Space,
  Statistic,
  Table,
  Tag,
  Typography,
  message,
} from 'antd'
import {
  BankOutlined,
  ClusterOutlined,
  EyeOutlined,
  GiftOutlined,
  NodeIndexOutlined,
  PlusOutlined,
  SafetyCertificateOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons'
import '../ActivityManagement/ActivityManagement.css'
import './PriceManagement.css'

const { Paragraph, Text } = Typography

const activityTypeMeta = {
  'internet-hospital-price': {
    label: '互联网医院价格活动',
    shortLabel: '互联网医院',
    tagColor: 'blue',
    icon: BankOutlined,
    subjectLabel: '互联网医院 / 来源平台',
    description: '解决平安等来源平台对同一互联网医院项目展示不同价格的问题。',
    example: '平安好医生下肺结节 AI 展示 129 元。',
  },
  'delivery-center-price': {
    label: '交付中心价格活动',
    shortLabel: '交付中心',
    tagColor: 'green',
    icon: ClusterOutlined,
    subjectLabel: '交付中心',
    description: '解决某个交付中心基于自身项目和门市价做阶段性活动的问题。',
    example: '成都高新影像中心 CT 骨密度活动价 138 元。',
  },
  'platform-discount': {
    label: '平台通用优惠',
    shortLabel: '平台优惠',
    tagColor: 'purple',
    icon: GiftOutlined,
    subjectLabel: '用户 / 券 / 订单',
    description: '解决用户侧优惠券、折扣券和指定用户优惠，跟用户权益走。',
    example: '互联网医院新客券满 200 减 30。',
  },
}

const workflowSteps = [
  {
    title: '项目准备',
    description: '单项目来自项目库；主套先通过组合项目 / 对码多对多形成可售卖项目。',
  },
  {
    title: '配置价格',
    description: '按互联网医院、交付中心或平台优惠三类模型配置。',
  },
  {
    title: '用户下单',
    description: '识别来源平台、售卖项目、履约中心和用户权益。',
  },
  {
    title: '计算价格',
    description: '先命中项目价格活动，再判断用户是否可用优惠券。',
  },
  {
    title: '支付履约',
    description: '用户支付后进入交付中心履约和报告交付链路。',
  },
  {
    title: '结算复盘',
    description: '订单记录价格来源、优惠金额、支付价和结算口径。',
  },
]

const priceRules = [
  {
    id: 'pm-001',
    name: '平安好医生肺结节专项价',
    type: 'internet-hospital-price',
    owner: '平安好医生互联网医院',
    subject: '来源平台：平安',
    projectName: '肺结节 AI 辅助筛查',
    projectKind: '单项目',
    sourceScope: '平安入口',
    deliveryScope: '成都高新影像交付中心、南昌红谷滩影像交付中心',
    basePrice: 160,
    rulePrice: 129,
    effectText: '展示价从 ￥160.00 调整为 ￥129.00',
    conflictKey: '互联网医院 + 来源平台 + 项目 + 履约中心 + 时间',
    status: 'running',
    period: '2026-07-01 00:00 至 2026-08-31 23:59',
    configInput: '运营选择互联网医院、来源平台、互联网医院项目和可履约中心后，录入平台专属展示价。',
    orderHit: '用户从平安入口进入并购买肺结节 AI 时，系统优先命中平安来源价。',
    settlementRecord: '订单保留门市价、平安展示价、用户支付价和后续交付中心结算价。',
    dependency: '依赖互联网医院项目和可履约中心映射。',
  },
  {
    id: 'pm-002',
    name: '平安胸腹联扫组合项目价',
    type: 'internet-hospital-price',
    owner: '平安好医生互联网医院',
    subject: '来源平台：平安',
    projectName: '胸腹联扫',
    projectKind: '组合项目',
    sourceScope: '平安入口',
    deliveryScope: '已完成组合对码的交付中心',
    basePrice: 520,
    rulePrice: 459,
    effectText: '组合项目展示价 ￥459.00',
    conflictKey: '互联网医院 + 来源平台 + 组合项目 + 履约中心 + 时间',
    status: 'listed',
    period: '2026-07-10 00:00 至 2026-09-30 23:59',
    configInput: '价格管理只选择已经存在的“胸腹联扫”组合项目，不在活动里临时拼套餐。',
    orderHit: '用户购买组合项目时，先按组合项目命中来源平台价。',
    settlementRecord: '结算明细追溯组合项目与对码后的院内执行项目。',
    dependency: '依赖对码多对多先完成组合项目创建与下发映射。',
  },
  {
    id: 'pm-003',
    name: '成都高新 CT 骨密度活动价',
    type: 'delivery-center-price',
    owner: '成都高新影像交付中心',
    subject: '中心自有项目',
    projectName: 'CT 骨密度辅助诊断',
    projectKind: '单项目',
    sourceScope: '全部来源',
    deliveryScope: '成都高新影像交付中心',
    basePrice: 180,
    rulePrice: 138,
    effectText: '中心活动价 ￥138.00',
    conflictKey: '交付中心 + 中心项目 + 时间',
    status: 'running',
    period: '2026-07-01 00:00 至 2026-07-31 23:59',
    configInput: '运营选择交付中心及中心自身项目，按中心门市价设置阶段性活动价。',
    orderHit: '用户选择该中心履约且项目匹配时，命中交付中心价格活动。',
    settlementRecord: '订单记录中心门市价、中心活动价和实际履约中心。',
    dependency: '依赖交付中心院内项目库和项目可售状态。',
  },
  {
    id: 'pm-004',
    name: '南昌红谷滩 MR 项目暑期活动',
    type: 'delivery-center-price',
    owner: '南昌红谷滩影像交付中心',
    subject: '中心自有项目',
    projectName: '头颅 MRI 平扫',
    projectKind: '单项目',
    sourceScope: '青藤自营、互联网医院入口',
    deliveryScope: '南昌红谷滩影像交付中心',
    basePrice: 280,
    rulePrice: 238,
    effectText: '中心活动价 ￥238.00',
    conflictKey: '交付中心 + 中心项目 + 时间',
    status: 'listed',
    period: '2026-07-15 00:00 至 2026-08-15 23:59',
    configInput: '活动主体为交付中心，来源只作为适用范围，不改变中心项目价格归属。',
    orderHit: '用户下单选择该中心且项目匹配时命中。',
    settlementRecord: '结算时按中心活动价记录，后续再结合平台抽成或分账。',
    dependency: '依赖中心项目价格和履约排班可用。',
  },
  {
    id: 'pm-005',
    name: '互联网医院新客满减券',
    type: 'platform-discount',
    owner: '平台',
    subject: '新客用户',
    projectName: '互联网医院项目订单满 200 元',
    projectKind: '优惠条件',
    sourceScope: '全部互联网医院入口',
    deliveryScope: '支持参与活动的交付中心',
    basePrice: null,
    rulePrice: null,
    discountText: '满 ￥200.00 减 ￥30.00',
    effectText: '在项目价格基础上再扣减 30 元',
    conflictKey: '用户范围 + 券批次 + 使用条件 + 有效期',
    status: 'running',
    period: '2026-07-01 00:00 至 2026-07-31 23:59',
    configInput: '运营配置券批次、用户范围、使用门槛、可用项目和每人可用次数。',
    orderHit: '系统在已确定项目价格后，判断用户是否为新客且订单金额满足门槛。',
    settlementRecord: '订单记录券批次、优惠金额、承担方和用户实际支付价。',
    dependency: '依赖用户标签、券系统和订单结算链路。',
  },
  {
    id: 'pm-006',
    name: '人工耳蜗项目专属券',
    type: 'platform-discount',
    owner: '平台',
    subject: '指定用户 / 指定项目',
    projectName: '人工耳蜗专属页面项目',
    projectKind: '优惠条件',
    sourceScope: '人工耳蜗项目页',
    deliveryScope: '项目指定履约中心',
    basePrice: null,
    rulePrice: null,
    discountText: '指定用户立减 ￥50.00',
    effectText: '命中专属项目和用户后扣减 50 元',
    conflictKey: '用户 ID / 人群包 + 项目 + 券批次 + 有效期',
    status: 'listed',
    period: '2026-07-08 00:00 至 2026-08-31 23:59',
    configInput: '运营上传指定用户或人群包，并绑定人工耳蜗项目适用范围。',
    orderHit: '用户从人工耳蜗专属页下单时，系统判断项目和用户是否同时满足。',
    settlementRecord: '订单记录用户优惠金额，避免和项目活动价混淆。',
    dependency: '依赖项目专属页、用户识别和券核销能力。',
  },
]

const statusMeta = {
  listed: { label: '已上架', color: 'blue' },
  running: { label: '进行中', color: 'green' },
  offline: { label: '已下架', color: 'orange' },
}

function formatAmount(value) {
  if (typeof value !== 'number') return '-'
  return `￥${value.toFixed(2)}`
}

function getTypeMeta(type) {
  return activityTypeMeta[type] || activityTypeMeta['internet-hospital-price']
}

function getStatusMeta(status) {
  return statusMeta[status] || statusMeta.listed
}

function LogicCard({ type }) {
  const meta = getTypeMeta(type)
  const Icon = meta.icon

  return (
    <div className="price-management-logic-card">
      <div className="price-management-logic-card__header">
        <span className="price-management-logic-card__icon"><Icon /></span>
        <span>{meta.label}</span>
      </div>
      <div className="price-management-logic-card__desc">{meta.description}</div>
      <div className="price-management-logic-card__example">例：{meta.example}</div>
    </div>
  )
}

function FlowStep({ item, index }) {
  return (
    <div className="price-management-flow-step">
      <span className="price-management-flow-step__index">{index + 1}</span>
      <div className="price-management-flow-step__title">{item.title}</div>
      <div className="price-management-flow-step__desc">{item.description}</div>
    </div>
  )
}

function PriceEffectCell({ row }) {
  if (row.type === 'platform-discount') {
    return (
      <div className="price-management-price-cell">
        <span className="price-management-price-cell__main">{row.discountText}</span>
        <span className="price-management-price-cell__sub">{row.effectText}</span>
      </div>
    )
  }

  return (
    <div className="price-management-price-cell">
      <span className="price-management-price-cell__main">{formatAmount(row.rulePrice)}</span>
      <span className="price-management-price-cell__sub">原价 {formatAmount(row.basePrice)}</span>
    </div>
  )
}

function PriceManagementPage() {
  const [activeType, setActiveType] = useState('internet-hospital-price')
  const [selectedRecord, setSelectedRecord] = useState(null)

  const filteredRules = useMemo(() => (
    priceRules.filter((item) => item.type === activeType)
  ), [activeType])

  const stats = useMemo(() => {
    const runningCount = priceRules.filter((item) => item.status === 'running').length
    const internetHospitalCount = priceRules.filter((item) => item.type === 'internet-hospital-price').length
    const deliveryCenterCount = priceRules.filter((item) => item.type === 'delivery-center-price').length
    const couponCount = priceRules.filter((item) => item.type === 'platform-discount').length
    return { runningCount, internetHospitalCount, deliveryCenterCount, couponCount }
  }, [])

  const segmentedOptions = Object.entries(activityTypeMeta).map(([value, meta]) => ({
    label: meta.label,
    value,
  }))

  const columns = [
    {
      title: '配置名称',
      dataIndex: 'name',
      width: 240,
      fixed: 'left',
      render: (name, row) => (
        <Space orientation="vertical" size={2}>
          <Text strong>{name}</Text>
          <Text className="price-management-subtle">{row.id}</Text>
        </Space>
      ),
    },
    {
      title: '类型',
      width: 150,
      render: (_, row) => {
        const meta = getTypeMeta(row.type)
        return <Tag className="price-management-type-tag" color={meta.tagColor}>{meta.shortLabel}</Tag>
      },
    },
    {
      title: '定价主体',
      width: 220,
      render: (_, row) => (
        <Space orientation="vertical" size={2}>
          <Text>{row.owner}</Text>
          <Text className="price-management-subtle">{row.subject}</Text>
        </Space>
      ),
    },
    {
      title: '项目 / 条件',
      width: 230,
      render: (_, row) => (
        <div className="price-management-project-cell">
          <Text>{row.projectName}</Text>
          <Tag color={row.projectKind === '组合项目' ? 'orange' : row.projectKind === '优惠条件' ? 'purple' : 'green'}>
            {row.projectKind}
          </Tag>
        </div>
      ),
    },
    {
      title: '适用范围',
      width: 280,
      render: (_, row) => (
        <Space orientation="vertical" size={2}>
          <Text>{row.sourceScope}</Text>
          <Text className="price-management-subtle">{row.deliveryScope}</Text>
        </Space>
      ),
    },
    {
      title: '价格 / 优惠',
      width: 180,
      render: (_, row) => <PriceEffectCell row={row} />,
    },
    {
      title: '生效时间',
      dataIndex: 'period',
      width: 260,
    },
    {
      title: '状态',
      width: 100,
      render: (_, row) => {
        const meta = getStatusMeta(row.status)
        return <Tag color={meta.color}>{meta.label}</Tag>
      },
    },
    {
      title: '冲突口径',
      dataIndex: 'conflictKey',
      width: 260,
    },
    {
      title: '操作',
      fixed: 'right',
      width: 130,
      render: (_, row) => (
        <Button type="link" className="activity-link" icon={<EyeOutlined />} onClick={() => setSelectedRecord(row)}>
          看闭环
        </Button>
      ),
    },
  ]

  return (
    <div className="price-management-page">
      <div className="activity-page">
        <div className="activity-shell">
          <div className="activity-header">
            <div>
              <h1 className="activity-title">价格管理</h1>
              <div className="activity-subtitle">
                按 B 方案拆分互联网医院价格活动、交付中心价格活动和平台通用优惠，统一服务下单计价与结算追溯。
              </div>
            </div>
            <Button
              className="activity-green-btn"
              icon={<PlusOutlined />}
              onClick={() => message.info('当前为方案 demo，真实新建表单将在确认字段后补充')}
            >
              新建价格配置
            </Button>
          </div>

          <div className="activity-content">
            <div className="price-management-hero">
              <Card className="price-management-card" title="B 方案核心逻辑">
                <Alert
                  type="success"
                  showIcon
                  title="先分清定价主体，再统一进入订单价格计算。"
                  description="价格活动决定项目本身卖多少钱；平台通用优惠决定这个用户还能减多少钱。主套优惠不在价格管理里临时拼套餐，而是先通过组合项目 / 对码多对多形成可售卖项目。"
                />
                <div style={{ height: 16 }} />
                <div className="price-management-logic">
                  {Object.keys(activityTypeMeta).map((type) => <LogicCard key={type} type={type} />)}
                </div>
              </Card>

              <Card
                className="price-management-card"
                title="本期边界"
                extra={<Tag color="orange">主套不做一级活动</Tag>}
              >
                <Paragraph>
                  “胸腹联扫”等主套优惠先由互联网医院项目或对码多对多生成组合项目，价格管理只对已存在的单项目 / 组合项目配置价格或优惠。
                </Paragraph>
                <Paragraph>
                  报告机构收费、复杂审核流、真实券发放和完整价格引擎暂不纳入本期。
                </Paragraph>
                <Space wrap>
                  <Tag icon={<NodeIndexOutlined />} color="green">组合项目先行</Tag>
                  <Tag icon={<ShoppingCartOutlined />} color="blue">结算时动态判断</Tag>
                  <Tag icon={<SafetyCertificateOutlined />} color="purple">同层冲突禁止</Tag>
                </Space>
              </Card>
            </div>

            <Card className="price-management-card" title="业务闭环流程" style={{ marginBottom: 16 }}>
              <div className="price-management-flow">
                {workflowSteps.map((item, index) => <FlowStep key={item.title} item={item} index={index} />)}
              </div>
            </Card>

            <Row gutter={16} className="price-management-summary">
              <Col span={6}>
                <Card className="price-management-stat-card">
                  <Statistic title="进行中配置" value={stats.runningCount} suffix="条" />
                </Card>
              </Col>
              <Col span={6}>
                <Card className="price-management-stat-card">
                  <Statistic title="互联网医院价格活动" value={stats.internetHospitalCount} suffix="条" />
                </Card>
              </Col>
              <Col span={6}>
                <Card className="price-management-stat-card">
                  <Statistic title="交付中心价格活动" value={stats.deliveryCenterCount} suffix="条" />
                </Card>
              </Col>
              <Col span={6}>
                <Card className="price-management-stat-card">
                  <Statistic title="平台通用优惠" value={stats.couponCount} suffix="条" />
                </Card>
              </Col>
            </Row>

            <Card
              className="price-management-table-card"
              title="价格配置列表"
              extra={(
                <Segmented
                  className="price-management-segment"
                  options={segmentedOptions}
                  value={activeType}
                  onChange={setActiveType}
                />
              )}
            >
              <Table
                rowKey="id"
                columns={columns}
                dataSource={filteredRules}
                pagination={false}
                locale={{ emptyText: <Empty description="暂无价格配置" /> }}
                scroll={{ x: 2050 }}
              />
            </Card>
          </div>
        </div>
      </div>

      <Modal
        title="价格配置闭环说明"
        open={Boolean(selectedRecord)}
        onCancel={() => setSelectedRecord(null)}
        footer={<Button className="activity-green-btn" onClick={() => setSelectedRecord(null)}>我知道了</Button>}
        width={980}
      >
        {selectedRecord ? (
          <>
            <Descriptions column={2} size="small" bordered>
              <Descriptions.Item label="配置名称">{selectedRecord.name}</Descriptions.Item>
              <Descriptions.Item label="配置类型">{getTypeMeta(selectedRecord.type).label}</Descriptions.Item>
              <Descriptions.Item label="定价主体">{selectedRecord.owner}</Descriptions.Item>
              <Descriptions.Item label="项目 / 条件">{selectedRecord.projectName}</Descriptions.Item>
              <Descriptions.Item label="价格 / 优惠">
                {selectedRecord.discountText || `${formatAmount(selectedRecord.basePrice)} → ${formatAmount(selectedRecord.rulePrice)}`}
              </Descriptions.Item>
              <Descriptions.Item label="冲突口径">{selectedRecord.conflictKey}</Descriptions.Item>
              <Descriptions.Item label="生效时间" span={2}>{selectedRecord.period}</Descriptions.Item>
              <Descriptions.Item label="依赖前提" span={2}>{selectedRecord.dependency}</Descriptions.Item>
            </Descriptions>

            <div className="price-management-modal-flow">
              <div className="price-management-modal-flow__item">
                <div className="price-management-modal-flow__title">1. 配置输入</div>
                <div className="price-management-modal-flow__desc">{selectedRecord.configInput}</div>
              </div>
              <div className="price-management-modal-flow__item">
                <div className="price-management-modal-flow__title">2. 下单命中</div>
                <div className="price-management-modal-flow__desc">{selectedRecord.orderHit}</div>
              </div>
              <div className="price-management-modal-flow__item">
                <div className="price-management-modal-flow__title">3. 价格影响</div>
                <div className="price-management-modal-flow__desc">{selectedRecord.effectText}</div>
              </div>
              <div className="price-management-modal-flow__item">
                <div className="price-management-modal-flow__title">4. 结算记录</div>
                <div className="price-management-modal-flow__desc">{selectedRecord.settlementRecord}</div>
              </div>
            </div>
          </>
        ) : null}
      </Modal>
    </div>
  )
}

export default PriceManagementPage
