import { useMemo, useState } from 'react'
import { Button, Card, Col, Form, Input, Modal, Row, Select, Space, Statistic, Table, Tag, message } from 'antd'

const seedOperators = [
  {
    id: 1,
    operatorNo: 'YY20260516001',
    operatorName: '运营A',
    phone: '13600001001',
    location: '江西省南昌市红谷滩区某某地址',
    bindingDoctors: 8,
    enabledStatus: '已启用',
    createdAt: '2026-05-16',
  },
  {
    id: 2,
    operatorNo: 'YY20260515002',
    operatorName: '运营B',
    phone: '13600001002',
    location: '江西省南昌市西湖区某某地址',
    bindingDoctors: 6,
    enabledStatus: '已启用',
    createdAt: '2026-05-15',
  },
  {
    id: 3,
    operatorNo: 'YY20260514003',
    operatorName: '运营C',
    phone: '13600001003',
    location: '江西省南昌市青山湖区某某地址',
    bindingDoctors: 4,
    enabledStatus: '已停用',
    createdAt: '2026-05-14',
  },
]

export default function OperatorManagement() {
  const [form] = Form.useForm()
  const [operators, setOperators] = useState(seedOperators)
  const [query, setQuery] = useState({ enabledStatus: undefined, keyword: '' })
  const [open, setOpen] = useState(false)

  const filteredData = useMemo(() => {
    return operators.filter((item) => {
      if (query.enabledStatus && item.enabledStatus !== query.enabledStatus) return false
      if (query.keyword) {
        const keyword = query.keyword.trim()
        const hit = item.operatorName.includes(keyword) || item.phone.includes(keyword)
        if (!hit) return false
      }
      return true
    })
  }, [operators, query])

  const summary = useMemo(() => ({
    total: operators.length,
    enabled: operators.filter((item) => item.enabledStatus === '已启用').length,
    disabled: operators.filter((item) => item.enabledStatus === '已停用').length,
  }), [operators])

  const handleCreate = async () => {
    const values = await form.validateFields()
    const nextId = operators.length + 1
    setOperators([
      {
        id: nextId,
        operatorNo: `YY20260516${String(nextId).padStart(3, '0')}`,
        bindingDoctors: 0,
        enabledStatus: '已启用',
        createdAt: '2026-05-16',
        ...values,
      },
      ...operators,
    ])
    form.resetFields()
    setOpen(false)
    message.success('已新增运营人员')
  }

  const toggleStatus = (record) => {
    const nextStatus = record.enabledStatus === '已启用' ? '已停用' : '已启用'
    setOperators((list) => list.map((item) => (
      item.id === record.id ? { ...item, enabledStatus: nextStatus } : item
    )))
    message.success(`${record.operatorName} 已${nextStatus === '已启用' ? '启用' : '停用'}`)
  }

  const columns = [
    { title: '运营编号', dataIndex: 'operatorNo', width: 150, fixed: 'left' },
    { title: '运营姓名', dataIndex: 'operatorName', width: 120 },
    { title: '手机号', dataIndex: 'phone', width: 140 },
    { title: '所在位置', dataIndex: 'location', width: 240 },
    { title: '绑定医生数', dataIndex: 'bindingDoctors', width: 120, render: (value) => `${value}人` },
    {
      title: '启用状态',
      dataIndex: 'enabledStatus',
      width: 120,
      render: (value) => <Tag color={value === '已启用' ? 'green' : 'default'}>{value}</Tag>,
    },
    { title: '录入时间', dataIndex: 'createdAt', width: 140 },
    {
      title: '操作',
      key: 'action',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Button type="link" size="small" onClick={() => toggleStatus(record)}>
          {record.enabledStatus === '已启用' ? '停用' : '启用'}
        </Button>
      ),
    },
  ]

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 16, gap: 16, overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 16, fontWeight: 500, color: '#333' }}>运营管理</div>
        <Button type="primary" onClick={() => setOpen(true)}>新增运营人员</Button>
      </div>

      <Row gutter={16}>
        <Col span={8}><Card><Statistic title="运营人员总数" value={summary.total} suffix="人" /></Card></Col>
        <Col span={8}><Card><Statistic title="已启用" value={summary.enabled} suffix="人" valueStyle={{ color: '#52c41a' }} /></Card></Col>
        <Col span={8}><Card><Statistic title="已停用" value={summary.disabled} suffix="人" valueStyle={{ color: '#999' }} /></Card></Col>
      </Row>

      <Card bodyStyle={{ paddingBottom: 8 }}>
        <Form layout="inline">
          <Form.Item label="启用状态">
            <Select
              placeholder="请选择状态"
              allowClear
              style={{ width: 160 }}
              value={query.enabledStatus}
              onChange={(value) => setQuery({ ...query, enabledStatus: value })}
            >
              <Select.Option value="已启用">已启用</Select.Option>
              <Select.Option value="已停用">已停用</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="运营搜索">
            <Input
              allowClear
              value={query.keyword}
              placeholder="运营姓名/手机号"
              style={{ width: 220 }}
              onChange={(event) => setQuery({ ...query, keyword: event.target.value })}
            />
          </Form.Item>
          <Form.Item>
            <Button onClick={() => setQuery({ enabledStatus: undefined, keyword: '' })}>重置</Button>
          </Form.Item>
        </Form>
      </Card>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={filteredData}
        pagination={{ pageSize: 10, showSizeChanger: false }}
        scroll={{ x: 1160, y: 'calc(100vh - 380px)' }}
        style={{ flex: 1 }}
      />

      <Modal
        title="新增运营人员"
        open={open}
        onCancel={() => setOpen(false)}
        onOk={handleCreate}
        okText="提交"
        cancelText="取消"
        destroyOnClose
      >
        <Form form={form} layout="vertical" preserve={false}>
          <Form.Item label="运营姓名" name="operatorName" rules={[{ required: true, message: '请输入运营姓名' }]}>
            <Input placeholder="请输入运营姓名" />
          </Form.Item>
          <Form.Item label="手机号" name="phone" rules={[{ required: true, message: '请输入手机号' }]}>
            <Input placeholder="请输入手机号" />
          </Form.Item>
          <Form.Item label="所在位置" name="location" rules={[{ required: true, message: '请输入所在位置' }]}>
            <Input placeholder="例如：江西省南昌市某某地址" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
