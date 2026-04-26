import { useMemo, useState } from 'react'
import { Card, Col, Form, Input, Row, Select, Statistic, Table } from 'antd'
import { doctorPerformance, operatorSummary, orderDetails } from '../../../../../shared/mocks/incentive'

export default function Analysis() {
  const [query, setQuery] = useState({
    operator: undefined,
    doctor: '',
    region: undefined,
    department: undefined,
  })

  const filteredOperators = useMemo(() => {
    return operatorSummary.filter((item) => {
      if (query.operator && item.operatorName !== query.operator) return false
      if (query.region && item.region !== query.region) return false
      if (query.department && item.department !== query.department) return false
      return true
    })
  }, [query])

  const filteredDoctors = useMemo(() => {
    return doctorPerformance.filter((item) => {
      if (query.doctor && !item.doctorName.includes(query.doctor)) return false
      if (query.region && item.region !== query.region) return false
      if (query.department && item.department !== query.department) return false
      return true
    })
  }, [query])

  const metrics = useMemo(() => ({
    bindingDoctors: filteredOperators.reduce((sum, item) => sum + item.bindingDoctors, 0),
    orderCount: filteredOperators.reduce((sum, item) => sum + item.orderCount, 0),
    reportCount: filteredOperators.reduce((sum, item) => sum + item.reportCount, 0),
    operatorBonus: filteredOperators.reduce((sum, item) => sum + item.operatorBonus, 0),
  }), [filteredOperators])

  const operatorOptions = Array.from(new Set(operatorSummary.map((item) => item.operatorName)))
  const regionOptions = Array.from(new Set(operatorSummary.map((item) => item.region)))
  const departmentOptions = Array.from(new Set(operatorSummary.map((item) => item.department)))

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 16, gap: 16, overflow: 'auto' }}>
      <div style={{ fontSize: 16, fontWeight: 500, color: '#333' }}>医生 / 运营业绩分析</div>

      <Card bodyStyle={{ paddingBottom: 8 }}>
        <Form layout="inline">
          <Form.Item label="运营">
            <Select allowClear placeholder="请选择" style={{ width: 160 }} onChange={(value) => setQuery({ ...query, operator: value })}>
              {operatorOptions.map((item) => <Select.Option key={item} value={item}>{item}</Select.Option>)}
            </Select>
          </Form.Item>
          <Form.Item label="区域">
            <Select allowClear placeholder="请选择" style={{ width: 160 }} onChange={(value) => setQuery({ ...query, region: value })}>
              {regionOptions.map((item) => <Select.Option key={item} value={item}>{item}</Select.Option>)}
            </Select>
          </Form.Item>
          <Form.Item label="科室">
            <Select allowClear placeholder="请选择" style={{ width: 160 }} onChange={(value) => setQuery({ ...query, department: value })}>
              {departmentOptions.map((item) => <Select.Option key={item} value={item}>{item}</Select.Option>)}
            </Select>
          </Form.Item>
          <Form.Item label="医生">
            <Input allowClear placeholder="请输入医生姓名" style={{ width: 180 }} onChange={(event) => setQuery({ ...query, doctor: event.target.value })} />
          </Form.Item>
        </Form>
      </Card>

      <Row gutter={16}>
        <Col span={6}><Card><Statistic title="绑定医生数" value={metrics.bindingDoctors} suffix="人" /></Card></Col>
        <Col span={6}><Card><Statistic title="开单数" value={metrics.orderCount} suffix="单" /></Card></Col>
        <Col span={6}><Card><Statistic title="已出报告订单数" value={metrics.reportCount} suffix="单" /></Card></Col>
        <Col span={6}><Card><Statistic title="运营提成金额" value={metrics.operatorBonus} prefix="¥" /></Card></Col>
      </Row>

      <Card title="运营汇总">
        <Table
          rowKey="operatorName"
          size="small"
          pagination={false}
          columns={[
            { title: '运营', dataIndex: 'operatorName', width: 120 },
            { title: '区域', dataIndex: 'region', width: 140 },
            { title: '科室', dataIndex: 'department', width: 100 },
            { title: '绑定医生数', dataIndex: 'bindingDoctors', width: 110 },
            { title: '开单数', dataIndex: 'orderCount', width: 90 },
            { title: '已支付订单数', dataIndex: 'paidCount', width: 110 },
            { title: '已出报告订单数', dataIndex: 'reportCount', width: 120 },
            { title: '运营提成', dataIndex: 'operatorBonus', width: 120, render: (value) => `¥${value.toLocaleString()}` },
          ]}
          dataSource={filteredOperators}
        />
      </Card>

      <Card title="医生明细">
        <Table
          rowKey="doctorName"
          size="small"
          pagination={false}
          columns={[
            { title: '医生', dataIndex: 'doctorName', width: 100 },
            { title: '诊所', dataIndex: 'clinicName', width: 150 },
            { title: '区域', dataIndex: 'region', width: 130 },
            { title: '科室', dataIndex: 'department', width: 100 },
            { title: '开单数', dataIndex: 'orderCount', width: 90 },
            { title: '已支付订单数', dataIndex: 'paidCount', width: 110 },
            { title: '已出报告订单数', dataIndex: 'reportCount', width: 120 },
            { title: '医生提成', dataIndex: 'doctorBonus', width: 110, render: (value) => `¥${value.toLocaleString()}` },
            { title: '运营提成', dataIndex: 'operatorBonus', width: 110, render: (value) => `¥${value.toLocaleString()}` },
          ]}
          dataSource={filteredDoctors}
        />
      </Card>

      <Card title="订单明细">
        <Table
          rowKey="orderNo"
          size="small"
          pagination={false}
          columns={[
            { title: '订单号', dataIndex: 'orderNo', width: 150 },
            { title: '患者姓名', dataIndex: 'patientName', width: 100 },
            { title: '检查项目', dataIndex: 'projectName', width: 140 },
            { title: '支付时间', dataIndex: 'payTime', width: 160 },
            { title: '出报告时间', dataIndex: 'reportTime', width: 160 },
            { title: '订单状态', dataIndex: 'orderStatus', width: 100 },
            { title: '医生提成', dataIndex: 'doctorBonus', width: 100, render: (value) => `¥${value.toLocaleString()}` },
            { title: '运营提成', dataIndex: 'operatorBonus', width: 100, render: (value) => `¥${value.toLocaleString()}` },
          ]}
          dataSource={orderDetails}
          scroll={{ x: 1100 }}
        />
      </Card>
    </div>
  )
}
