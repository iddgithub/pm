import { Card, Col, Row, Statistic, Table } from 'antd'
import { dashboardMetrics, dashboardTrend, departmentDistribution, doctorRanking, operatorRanking, regionRanking } from '../../../../../shared/mocks/incentive'

export default function Dashboard() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 16, gap: 16, overflow: 'auto' }}>
      <div style={{ fontSize: 16, fontWeight: 500, color: '#333' }}>平台业务总览</div>

      <Row gutter={[16, 16]}>
        {dashboardMetrics.map((item) => (
          <Col span={8} key={item.key}>
            <Card>
              <Statistic title={item.label} value={item.value} prefix={item.prefix} suffix={item.suffix} valueStyle={item.key === 'doctorBonus' ? { color: '#FF6B00' } : undefined} />
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card title="近 7 天趋势">
            <Table
              rowKey="date"
              size="small"
              pagination={false}
              columns={[
                { title: '日期', dataIndex: 'date' },
                { title: '开单数', dataIndex: 'orderCount' },
                { title: '已出报告', dataIndex: 'reportCount' },
                { title: '医生提成', dataIndex: 'doctorBonus', render: (value) => `¥${value.toLocaleString()}` },
              ]}
              dataSource={dashboardTrend}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="区域排行">
            <Table
              rowKey="name"
              size="small"
              pagination={false}
              columns={[
                { title: '区域', dataIndex: 'name' },
                { title: '开单数', dataIndex: 'orderCount' },
                { title: '签约医生', dataIndex: 'signedDoctors' },
                { title: '出报告率', dataIndex: 'reportRate' },
              ]}
              dataSource={regionRanking}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="运营排行">
            <Table
              rowKey="name"
              size="small"
              pagination={false}
              columns={[
                { title: '运营', dataIndex: 'name' },
                { title: '区域', dataIndex: 'region' },
                { title: '绑定医生', dataIndex: 'bindingDoctors' },
                { title: '开单数', dataIndex: 'orderCount' },
                { title: '提成', dataIndex: 'operatorBonus', render: (value) => `¥${value.toLocaleString()}` },
              ]}
              dataSource={operatorRanking}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="医生排行">
            <Table
              rowKey="doctorName"
              size="small"
              pagination={false}
              columns={[
                { title: '医生', dataIndex: 'doctorName' },
                { title: '诊所', dataIndex: 'clinicName' },
                { title: '科室', dataIndex: 'department' },
                { title: '开单数', dataIndex: 'orderCount' },
                { title: '提成', dataIndex: 'doctorBonus', render: (value) => `¥${value.toLocaleString()}` },
              ]}
              dataSource={doctorRanking}
            />
          </Card>
        </Col>
        <Col span={24}>
          <Card title="科室分布">
            <Table
              rowKey="name"
              size="small"
              pagination={false}
              columns={[
                { title: '科室', dataIndex: 'name' },
                { title: '签约医生数', dataIndex: 'signedDoctors' },
                { title: '已支付订单数', dataIndex: 'paidCount' },
              ]}
              dataSource={departmentDistribution}
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}
