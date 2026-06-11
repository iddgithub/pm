import { useMemo, useState } from 'react'
import { Button, Card, Col, Form, Input, Row, Select, Space, Statistic, Table, Tag, message } from 'antd'
import { doctorBindings } from '../../../../../shared/mocks/incentive'

export default function Binding() {
  const [query, setQuery] = useState({ operatorName: undefined, keyword: '' })

  const filteredData = useMemo(() => {
    return doctorBindings.filter((item) => {
      if (query.operatorName && item.operatorName !== query.operatorName) return false
      if (query.keyword) {
        const keyword = query.keyword.trim()
        const hit = item.doctorName.includes(keyword) || item.operatorName.includes(keyword)
        if (!hit) return false
      }
      return true
    })
  }, [query])

  const operatorOptions = Array.from(new Set(doctorBindings.map((item) => item.operatorName)))

  const summary = useMemo(() => ({
    bindingCount: filteredData.filter((item) => item.bindingStatus === '已绑定').length,
    enabledCount: filteredData.filter((item) => item.enabledStatus === '已启用').length,
    disabledCount: filteredData.filter((item) => item.enabledStatus === '已停用').length,
  }), [filteredData])

  const columns = [
    { title: '关联运营', dataIndex: 'operatorName', width: 120, fixed: 'left' },
    { title: '医生姓名', dataIndex: 'doctorName', width: 100, fixed: 'left' },
    { title: '手机号', dataIndex: 'phone', width: 130 },
    { title: '医生提成比例', dataIndex: 'doctorRate', width: 110, render: (value) => `${value}%` },
    { title: '运营提成比例', dataIndex: 'operatorRate', width: 110, render: (value) => `${value}%` },
    { title: '绑定生效时间', dataIndex: 'effectiveAt', width: 130 },
    {
      title: '启用状态',
      dataIndex: 'enabledStatus',
      width: 100,
      render: (value) => <Tag color={value === '已启用' ? 'green' : 'default'}>{value}</Tag>,
    },
    {
      title: '绑定状态',
      dataIndex: 'bindingStatus',
      width: 100,
      render: (value) => <Tag color="blue">{value}</Tag>,
    },
    {
      title: '操作',
      key: 'action',
      width: 160,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button type="link" size="small" onClick={() => message.success(`已为 ${record.doctorName} 打开改绑编辑器`)}>
            改绑
          </Button>
          <Button type="link" size="small" onClick={() => message.success(`已为 ${record.doctorName} 打开比例编辑器`)}>
            调比例
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 16, gap: 16, overflow: 'hidden' }}>
      <div style={{ fontSize: 16, fontWeight: 500, color: '#333' }}>医生与运营绑定管理</div>

      <Row gutter={16}>
        <Col span={8}><Card><Statistic title="已绑定医生" value={summary.bindingCount} suffix="人" /></Card></Col>
        <Col span={8}><Card><Statistic title="启用中的关系" value={summary.enabledCount} suffix="条" valueStyle={{ color: '#52c41a' }} /></Card></Col>
        <Col span={8}><Card><Statistic title="已停用关系" value={summary.disabledCount} suffix="条" /></Card></Col>
      </Row>

      <Card bodyStyle={{ paddingBottom: 8 }}>
        <Form layout="inline">
          <Form.Item label="运营筛选">
            <Select
              placeholder="请选择运营"
              allowClear
              style={{ width: 180 }}
              onChange={(value) => setQuery({ ...query, operatorName: value })}
            >
              {operatorOptions.map((item) => (
                <Select.Option key={item} value={item}>{item}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="医生/运营搜索">
            <Input
              allowClear
              placeholder="医生姓名/运营姓名"
              style={{ width: 220 }}
              onChange={(event) => setQuery({ ...query, keyword: event.target.value })}
            />
          </Form.Item>
          <Form.Item>
            <Button onClick={() => setQuery({ operatorName: undefined, keyword: '' })}>重置</Button>
          </Form.Item>
        </Form>
      </Card>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={filteredData}
        pagination={{ pageSize: 10, showSizeChanger: false }}
        scroll={{ x: 1100, y: 'calc(100vh - 360px)' }}
        style={{ flex: 1 }}
      />
    </div>
  )
}
