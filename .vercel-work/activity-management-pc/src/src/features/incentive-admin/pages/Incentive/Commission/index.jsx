import { useMemo, useState } from 'react'
import { Button, Card, Col, Form, Input, Row, Select, Space, Statistic, Table, Tag, message } from 'antd'
import { commissionConfigs } from '../../../../../shared/mocks/incentive'

export default function Commission() {
  const [query, setQuery] = useState({ keyword: '', status: undefined })

  const filteredData = useMemo(() => {
    return commissionConfigs.filter((item) => {
      if (query.keyword) {
        const keyword = query.keyword.trim()
        const hit = item.doctorName.includes(keyword) || item.operatorName.includes(keyword)
        if (!hit) return false
      }
      if (query.status && item.status !== query.status) return false
      return true
    })
  }, [query])

  const summary = useMemo(() => {
    const active = filteredData.filter((item) => item.status === '生效中')
    return {
      activeCount: active.length,
      avgDoctorRate: active.length ? (active.reduce((sum, item) => sum + item.doctorRate, 0) / active.length).toFixed(1) : 0,
      avgOperatorRate: active.length ? (active.reduce((sum, item) => sum + item.operatorRate, 0) / active.length).toFixed(1) : 0,
    }
  }, [filteredData])

  const columns = [
    { title: '医生姓名', dataIndex: 'doctorName', width: 110 },
    { title: '运营姓名', dataIndex: 'operatorName', width: 110 },
    { title: '平台给运营总比例', dataIndex: 'platformRate', width: 150, render: (value) => `${value}%` },
    { title: '医生分佣比例', dataIndex: 'doctorRate', width: 130, render: (value) => `${value}%` },
    { title: '运营实际提成比例', dataIndex: 'operatorRate', width: 150, render: (value) => `${value}%` },
    { title: '生效时间', dataIndex: 'effectiveAt', width: 120 },
    { title: '失效时间', dataIndex: 'expireAt', width: 120 },
    {
      title: '状态',
      dataIndex: 'status',
      width: 110,
      render: (value) => <Tag color={value === '生效中' ? 'green' : 'orange'}>{value}</Tag>,
    },
    { title: '最近修改人', dataIndex: 'updatedBy', width: 120 },
    {
      title: '操作',
      key: 'action',
      width: 140,
      render: (_, record) => (
        <Space size="small">
          <Button type="link" size="small" onClick={() => message.success(`已打开 ${record.doctorName} 的比例配置`)}>编辑</Button>
          <Button type="link" size="small" onClick={() => message.info(`正在查看 ${record.doctorName} 的历史版本`)}>历史</Button>
        </Space>
      ),
    },
  ]

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 16, gap: 16, overflow: 'hidden' }}>
      <div style={{ fontSize: 16, fontWeight: 500, color: '#333' }}>分佣比例配置</div>

      <Row gutter={16}>
        <Col span={8}><Card><Statistic title="生效中配置" value={summary.activeCount} suffix="条" /></Card></Col>
        <Col span={8}><Card><Statistic title="平均医生分佣比例" value={summary.avgDoctorRate} suffix="%" valueStyle={{ color: '#FF6B00' }} /></Card></Col>
        <Col span={8}><Card><Statistic title="平均运营提成比例" value={summary.avgOperatorRate} suffix="%" valueStyle={{ color: '#1890ff' }} /></Card></Col>
      </Row>

      <Card bodyStyle={{ paddingBottom: 8 }}>
        <Form layout="inline">
          <Form.Item label="医生/运营搜索">
            <Input
              allowClear
              placeholder="医生姓名/运营姓名"
              style={{ width: 220 }}
              onChange={(event) => setQuery({ ...query, keyword: event.target.value })}
            />
          </Form.Item>
          <Form.Item label="状态">
            <Select
              placeholder="请选择"
              allowClear
              style={{ width: 140 }}
              onChange={(value) => setQuery({ ...query, status: value })}
            >
              <Select.Option value="生效中">生效中</Select.Option>
              <Select.Option value="即将失效">即将失效</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={() => message.success('已打开新增比例配置表单')}>新增配置</Button>
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
