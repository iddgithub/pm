import { useNavigate } from 'react-router-dom'
import { Button, Card, Col, Row, Statistic, Table } from 'antd'
import { ShoppingOutlined, DollarOutlined, InboxOutlined, TeamOutlined } from '@ant-design/icons'
import { dashboardMetrics, doctorApplications, operatorRanking } from '../../../shared/mocks/incentive'
import { orderList } from '../../../shared/mocks/sales'
import { useTab } from '../../../shared/stores/tabStore'

const moduleCards = [
  {
    key: 'commerce',
    title: '经营业务',
    description: '统一查看销售、采购和仓储核心流程。',
    action: '/sales/order',
    label: '进入订单列表',
  },
  {
    key: 'incentive',
    title: '激励管理',
    description: '处理医生审核、绑定关系、分佣配置与提现审核。',
    action: '/incentive/review',
    label: '进入医生审核',
  },
  {
    key: 'platform',
    title: '平台运营',
    description: '汇总平台经营数据、医生业绩与月度复盘。',
    action: '/platform/dashboard',
    label: '进入业务总览',
  },
  {
    key: 'ai-report',
    title: 'AI报告上传',
    description: '按订单和检查项目上传、发布与替换 AI 报告分析文件。',
    action: '/platform/ai-report-upload',
    label: '进入AI报告上传',
  },
]

export default function HomeDashboard() {
  const navigate = useNavigate()
  const { addTab } = useTab()

  const openPage = (path, label) => {
    navigate(path)
    addTab({ key: path, label })
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 16, gap: 16, overflow: 'auto' }}>
      <div style={{ fontSize: 20, fontWeight: 600, color: '#0f172a' }}>pm_agent 工作台</div>

      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card>
            <Statistic title="销售订单" value={orderList.length} prefix={<ShoppingOutlined style={{ color: '#FF6B00' }} />} suffix="单" />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="平台开单数" value={dashboardMetrics[0].value} prefix={<DollarOutlined style={{ color: '#1890ff' }} />} suffix="单" />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="待审核医生" value={doctorApplications.filter((item) => item.auditStatus === '待审核').length} prefix={<InboxOutlined style={{ color: '#52c41a' }} />} suffix="人" />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="签约医生数" value={dashboardMetrics.find((item) => item.key === 'signedDoctors')?.value ?? 0} prefix={<TeamOutlined style={{ color: '#722ed1' }} />} suffix="人" />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {moduleCards.map((item) => (
          <Col span={6} key={item.key}>
            <Card
              title={item.title}
              extra={<Button type="link" onClick={() => openPage(item.action, item.label)}>{item.label}</Button>}
              style={{ height: '100%' }}
            >
              <div style={{ color: '#475569', lineHeight: 1.8 }}>{item.description}</div>
            </Card>
          </Col>
        ))}
      </Row>

      <Card title="运营排行快照">
        <Table
          rowKey="name"
          size="small"
          pagination={false}
          columns={[
            { title: '运营', dataIndex: 'name', width: 120 },
            { title: '区域', dataIndex: 'region', width: 140 },
            { title: '绑定医生', dataIndex: 'bindingDoctors', width: 120 },
            { title: '开单数', dataIndex: 'orderCount', width: 100 },
            { title: '提成', dataIndex: 'operatorBonus', render: (value) => `¥${value.toLocaleString()}` },
          ]}
          dataSource={operatorRanking}
        />
      </Card>
    </div>
  )
}
