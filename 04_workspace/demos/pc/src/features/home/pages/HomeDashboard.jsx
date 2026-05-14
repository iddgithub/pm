import { useNavigate } from 'react-router-dom'
import {
  ArrowRightOutlined,
  CloudUploadOutlined,
  DollarOutlined,
  HeartOutlined,
  InboxOutlined,
  LineChartOutlined,
  SafetyCertificateOutlined,
  ShoppingOutlined,
  TeamOutlined,
} from '@ant-design/icons'
import { Button, Card, Col, Progress, Row, Space, Statistic, Table, Tag } from 'antd'
import { dashboardMetrics, doctorApplications, operatorRanking } from '../../../shared/mocks/incentive'
import { orderList } from '../../../shared/mocks/sales'
import { useTab } from '../../../shared/stores/tabStore'
import './HomeDashboard.css'

const moduleCards = [
  {
    key: 'commerce',
    title: '经营业务',
    description: '查看订单流转、销售执行与经营业务承接情况。',
    action: '/sales/order',
    label: '进入订单列表',
    icon: <ShoppingOutlined />,
    tone: 'amber',
  },
  {
    key: 'incentive',
    title: '签约与结算',
    description: '处理医生审核、绑定关系、分佣配置与提现审核。',
    action: '/incentive/review',
    label: '进入医生审核',
    icon: <SafetyCertificateOutlined />,
    tone: 'teal',
  },
  {
    key: 'platform',
    title: '经营分析',
    description: '汇总平台经营数据、医生业绩与平台侧关键经营指标。',
    action: '/platform/dashboard',
    label: '进入业务总览',
    icon: <LineChartOutlined />,
    tone: 'cyan',
  },
  {
    key: 'ai-report',
    title: 'AI报告上传',
    description: '按订单和检查项目管理 AI 报告分析文件与发布状态。',
    action: '/platform/ai-report-upload',
    label: '进入AI报告上传',
    icon: <CloudUploadOutlined />,
    tone: 'slate',
  },
]

function ratio(value, total) {
  if (!total) return 0
  return Math.round((value / total) * 100)
}

export default function HomeDashboard() {
  const navigate = useNavigate()
  const { addTab } = useTab()

  const pendingAuditCount = doctorApplications.filter((item) => item.auditStatus === '待审核').length
  const signedDoctors = dashboardMetrics.find((item) => item.key === 'signedDoctors')?.value ?? 0
  const paidCount = dashboardMetrics.find((item) => item.key === 'paidCount')?.value ?? 0
  const reportCount = dashboardMetrics.find((item) => item.key === 'reportCount')?.value ?? 0
  const orderCount = dashboardMetrics.find((item) => item.key === 'orderCount')?.value ?? 0
  const doctorBonus = dashboardMetrics.find((item) => item.key === 'doctorBonus')?.value ?? 0

  const paymentRate = ratio(paidCount, orderCount)
  const reportRate = ratio(reportCount, paidCount)
  const signRate = ratio(signedDoctors, signedDoctors + pendingAuditCount)

  const heroStats = [
    {
      key: 'sales-order',
      label: '销售订单',
      value: orderList.length,
      suffix: '单',
      icon: <ShoppingOutlined />,
      hint: '经营业务主链路',
    },
    {
      key: 'platform-order',
      label: '平台开单数',
      value: orderCount,
      suffix: '单',
      icon: <DollarOutlined />,
      hint: '平台侧实时汇总',
    },
    {
      key: 'pending-audit',
      label: '待审核医生',
      value: pendingAuditCount,
      suffix: '人',
      icon: <InboxOutlined />,
      hint: '签约与结算入口',
    },
    {
      key: 'signed-doctor',
      label: '签约医生数',
      value: signedDoctors,
      suffix: '人',
      icon: <TeamOutlined />,
      hint: '稳定合作医生池',
    },
  ]

  const pulseItems = [
    {
      key: 'payment',
      label: '支付转化率',
      value: paymentRate,
      color: '#14b8a6',
      meta: `${paidCount} / ${orderCount} 单`,
    },
    {
      key: 'report',
      label: '出报告转化率',
      value: reportRate,
      color: '#0ea5e9',
      meta: `${reportCount} / ${paidCount} 单`,
    },
    {
      key: 'sign',
      label: '签约完成度',
      value: signRate,
      color: '#22c55e',
      meta: `${signedDoctors} 已签约 / ${pendingAuditCount} 待审核`,
    },
  ]

  const openPage = (path, label) => {
    navigate(path)
    addTab({ key: path, label })
  }

  return (
    <div className="medical-home-dashboard">
      <section className="medical-home-hero">
        <div className="medical-home-hero-main">
          <div className="medical-home-eyebrow">医疗经营工作台</div>
          <h1>面向签约、结算与经营分析的一体化首页</h1>
          <p>
            以医疗业务场景为核心，统一承接医生审核、经营数据、AI报告上传与订单经营入口。
            首页只展示高频决策信息，减少后台操作切换成本。
          </p>
          <Space size={12} wrap>
            <Button type="primary" size="large" onClick={() => openPage('/incentive/review', '医生审核')}>
              进入医生审核
            </Button>
            <Button size="large" onClick={() => openPage('/platform/dashboard', '业务总览')}>
              查看业务总览
            </Button>
          </Space>
        </div>

        <div className="medical-home-hero-aside">
          <div className="medical-home-aside-label">今日经营脉搏</div>
          <div className="medical-home-aside-value">¥{doctorBonus.toLocaleString()}</div>
          <div className="medical-home-aside-text">当前医生提成总金额，适合作为签约与结算主看板的快速入口指标。</div>
          <div className="medical-home-aside-grid">
            <div>
              <span>待审核</span>
              <strong>{pendingAuditCount}人</strong>
            </div>
            <div>
              <span>已出报告</span>
              <strong>{reportCount}单</strong>
            </div>
          </div>
        </div>
      </section>

      <Row gutter={[16, 16]}>
        {heroStats.map((item) => (
          <Col span={6} key={item.key}>
            <Card className="medical-home-stat-card" bordered={false}>
              <div className="medical-home-stat-top">
                <span className="medical-home-stat-icon">{item.icon}</span>
                <span className="medical-home-stat-hint">{item.hint}</span>
              </div>
              <Statistic title={item.label} value={item.value} suffix={item.suffix} />
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={16}>
          <Card
            className="medical-home-card"
            title={<span className="medical-home-card-title">核心业务入口</span>}
            bordered={false}
          >
            <div className="medical-home-module-grid">
              {moduleCards.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  className={`medical-home-module-card tone-${item.tone}`}
                  onClick={() => openPage(item.action, item.label)}
                >
                  <div className="medical-home-module-head">
                    <span className="medical-home-module-icon">{item.icon}</span>
                    <ArrowRightOutlined className="medical-home-module-arrow" />
                  </div>
                  <strong>{item.title}</strong>
                  <p>{item.description}</p>
                  <span className="medical-home-module-link">{item.label}</span>
                </button>
              ))}
            </div>
          </Card>
        </Col>

        <Col span={8}>
          <Card
            className="medical-home-card"
            title={<span className="medical-home-card-title">经营健康度</span>}
            bordered={false}
          >
            <div className="medical-home-pulse-list">
              {pulseItems.map((item) => (
                <div key={item.key} className="medical-home-pulse-item">
                  <div className="medical-home-pulse-top">
                    <span>{item.label}</span>
                    <strong>{item.value}%</strong>
                  </div>
                  <Progress percent={item.value} strokeColor={item.color} showInfo={false} trailColor="#e8f1f0" />
                  <span className="medical-home-pulse-meta">{item.meta}</span>
                </div>
              ))}
              <div className="medical-home-tip">
                <HeartOutlined />
                <span>建议优先关注待审核医生与已支付未出报告订单。</span>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={14}>
          <Card
            className="medical-home-card"
            title={<span className="medical-home-card-title">运营排行快照</span>}
            extra={<Tag color="cyan">按区域与绑定医生数汇总</Tag>}
            bordered={false}
          >
            <Table
              rowKey="name"
              size="small"
              pagination={false}
              columns={[
                { title: '运营', dataIndex: 'name', width: 120 },
                { title: '区域', dataIndex: 'region', width: 150 },
                { title: '绑定医生', dataIndex: 'bindingDoctors', width: 120 },
                { title: '开单数', dataIndex: 'orderCount', width: 100 },
                {
                  title: '提成',
                  dataIndex: 'operatorBonus',
                  render: (value) => <span className="medical-home-money">¥{value.toLocaleString()}</span>,
                },
              ]}
              dataSource={operatorRanking}
            />
          </Card>
        </Col>

        <Col span={10}>
          <Card
            className="medical-home-card"
            title={<span className="medical-home-card-title">最新签约申请</span>}
            extra={<Button type="link" onClick={() => openPage('/incentive/review', '医生审核')}>查看全部</Button>}
            bordered={false}
          >
            <div className="medical-home-application-list">
              {doctorApplications.slice(0, 5).map((item) => (
                <div key={item.id} className="medical-home-application-item">
                  <div>
                    <strong>{item.doctorName}</strong>
                    <p>{item.clinicName} · {item.region}</p>
                  </div>
                  <div className="medical-home-application-side">
                    <Tag color={item.auditStatus === '待审核' ? 'gold' : item.auditStatus === '审核通过' ? 'green' : 'red'}>
                      {item.auditStatus}
                    </Tag>
                    <span>{item.applyTime}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
