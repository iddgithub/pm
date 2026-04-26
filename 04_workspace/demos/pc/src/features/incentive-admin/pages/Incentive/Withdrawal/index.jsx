import { useMemo, useState } from 'react'
import { Button, Card, Col, Form, Input, Row, Select, Space, Statistic, Table, Tag, message } from 'antd'
import { withdrawalRequests } from '../../../../../shared/mocks/incentive'

const statusColors = {
  '待审核': 'orange',
  '审核通过': 'blue',
  '已打款': 'green',
  '已驳回': 'red',
}

export default function Withdrawal() {
  const [query, setQuery] = useState({ status: undefined, keyword: '' })

  const filteredData = useMemo(() => {
    return withdrawalRequests.filter((item) => {
      if (query.status && item.status !== query.status) return false
      if (query.keyword) {
        const keyword = query.keyword.trim()
        const hit = item.doctorName.includes(keyword)
        if (!hit) return false
      }
      return true
    })
  }, [query])

  const summary = useMemo(() => ({
    pendingCount: withdrawalRequests.filter((item) => item.status === '待审核').length,
    approvedCount: withdrawalRequests.filter((item) => item.status === '审核通过').length,
    pendingAmount: withdrawalRequests
      .filter((item) => item.status === '待审核')
      .reduce((sum, item) => sum + item.amount, 0),
  }), [])

  const columns = [
    { title: '申请时间', dataIndex: 'applyTime', width: 160 },
    { title: '医生姓名', dataIndex: 'doctorName', width: 110 },
    { title: '申请金额', dataIndex: 'amount', width: 110, render: (value) => `¥${value.toLocaleString()}` },
    { title: '当前可提现金额', dataIndex: 'availableAmount', width: 140, render: (value) => `¥${value.toLocaleString()}` },
    {
      title: '提现状态',
      dataIndex: 'status',
      width: 110,
      render: (value) => <Tag color={statusColors[value]}>{value}</Tag>,
    },
    { title: '审核人', dataIndex: 'reviewer', width: 100 },
    { title: '处理时间', dataIndex: 'processedAt', width: 160 },
    { title: '驳回原因', dataIndex: 'rejectReason', width: 180 },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_, record) => (
        <Space size="small">
          <Button type="link" size="small" onClick={() => message.success(`已通过 ${record.doctorName} 的提现申请`)}>
            通过
          </Button>
          <Button type="link" size="small" danger onClick={() => message.warning(`已驳回 ${record.doctorName} 的提现申请`)}>
            驳回
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 16, gap: 16, overflow: 'hidden' }}>
      <div style={{ fontSize: 16, fontWeight: 500, color: '#333' }}>提现审核</div>

      <Row gutter={16}>
        <Col span={8}><Card><Statistic title="待审核申请" value={summary.pendingCount} suffix="笔" valueStyle={{ color: '#FF6B00' }} /></Card></Col>
        <Col span={8}><Card><Statistic title="审核通过待打款" value={summary.approvedCount} suffix="笔" /></Card></Col>
        <Col span={8}><Card><Statistic title="待审核金额" value={summary.pendingAmount} prefix="¥" /></Card></Col>
      </Row>

      <Card bodyStyle={{ paddingBottom: 8 }}>
        <Form layout="inline">
          <Form.Item label="提现状态">
            <Select
              placeholder="请选择"
              allowClear
              style={{ width: 140 }}
              onChange={(value) => setQuery({ ...query, status: value })}
            >
              <Select.Option value="待审核">待审核</Select.Option>
              <Select.Option value="审核通过">审核通过</Select.Option>
              <Select.Option value="已打款">已打款</Select.Option>
              <Select.Option value="已驳回">已驳回</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="医生搜索">
            <Input
              allowClear
              placeholder="请输入医生姓名"
              style={{ width: 200 }}
              onChange={(event) => setQuery({ ...query, keyword: event.target.value })}
            />
          </Form.Item>
        </Form>
      </Card>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={filteredData}
        pagination={{ pageSize: 10, showSizeChanger: false }}
        scroll={{ x: 1300, y: 'calc(100vh - 360px)' }}
        style={{ flex: 1 }}
      />
    </div>
  )
}
