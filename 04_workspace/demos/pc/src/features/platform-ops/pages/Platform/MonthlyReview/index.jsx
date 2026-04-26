import { Card, Col, Row, Statistic, Table, Tag } from 'antd'
import { monthlyReviewMetrics, problemDoctors, problemOperators, strategyItems } from '../../../../../shared/mocks/incentive'

export default function MonthlyReview() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 16, gap: 16, overflow: 'auto' }}>
      <div style={{ fontSize: 16, fontWeight: 500, color: '#333' }}>月度复盘与策略</div>

      <Row gutter={[16, 16]}>
        {monthlyReviewMetrics.map((item) => (
          <Col span={8} key={item.key}>
            <Card>
              <Statistic title={item.label} value={item.value} prefix={item.prefix} suffix={item.suffix} valueStyle={item.key.includes('Bonus') ? { color: '#FF6B00' } : undefined} />
            </Card>
          </Col>
        ))}
      </Row>

      <Card title="问题医生清单">
        <Table
          rowKey="doctorName"
          size="small"
          pagination={false}
          columns={[
            { title: '医生', dataIndex: 'doctorName', width: 100 },
            { title: '诊所', dataIndex: 'clinicName', width: 160 },
            { title: '问题描述', dataIndex: 'reason', width: 220 },
            { title: '归属运营', dataIndex: 'owner', width: 120 },
          ]}
          dataSource={problemDoctors}
        />
      </Card>

      <Card title="问题运营清单">
        <Table
          rowKey="operatorName"
          size="small"
          pagination={false}
          columns={[
            { title: '运营', dataIndex: 'operatorName', width: 120 },
            { title: '区域', dataIndex: 'region', width: 140 },
            { title: '问题描述', dataIndex: 'reason', width: 220 },
            { title: '建议动作', dataIndex: 'followUp', width: 220 },
          ]}
          dataSource={problemOperators}
        />
      </Card>

      <Card title="策略记录与执行跟踪">
        <Table
          rowKey="key"
          size="small"
          pagination={false}
          columns={[
            { title: '策略事项', dataIndex: 'summary', width: 280 },
            { title: '负责人', dataIndex: 'owner', width: 120 },
            { title: '截止日期', dataIndex: 'dueDate', width: 120 },
            {
              title: '当前状态',
              dataIndex: 'status',
              width: 100,
              render: (value) => (
                <Tag color={value === '已完成' ? 'green' : value === '进行中' ? 'blue' : 'orange'}>
                  {value}
                </Tag>
              ),
            },
            { title: '执行结果', dataIndex: 'result', width: 280 },
          ]}
          dataSource={strategyItems}
        />
      </Card>
    </div>
  )
}
