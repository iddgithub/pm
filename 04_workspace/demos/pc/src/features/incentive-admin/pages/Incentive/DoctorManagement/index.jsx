import { useMemo, useState } from 'react'
import { Button, Card, Col, Form, Input, Modal, Row, Select, Statistic, Table, Tag, message } from 'antd'
import { doctorApplications } from '../../../../../shared/mocks/incentive'

const seedDoctors = doctorApplications
  .filter((item) => item.auditStatus === '审核通过')
  .map((item) => ({
    id: item.id,
    doctorNo: item.applicationNo.replace('SQ', 'YS'),
    doctorType: item.doctorType === '线下医生' ? '机构医生' : item.doctorType,
    doctorName: item.doctorName,
    phone: item.phone,
    hospitalName: item.clinicName,
    location: item.region,
    enabledStatus: item.enabledStatus,
    joinedAt: item.applyTime.slice(0, 10),
  }))

export default function DoctorManagement() {
  const [form] = Form.useForm()
  const [doctors, setDoctors] = useState(seedDoctors)
  const [query, setQuery] = useState({ doctorType: undefined, enabledStatus: undefined, keyword: '' })
  const [open, setOpen] = useState(false)

  const filteredData = useMemo(() => {
    return doctors.filter((item) => {
      if (query.doctorType && item.doctorType !== query.doctorType) return false
      if (query.enabledStatus && item.enabledStatus !== query.enabledStatus) return false
      if (query.keyword) {
        const keyword = query.keyword.trim()
        const hit = item.doctorName.includes(keyword) || item.phone.includes(keyword)
        if (!hit) return false
      }
      return true
    })
  }, [doctors, query])

  const summary = useMemo(() => ({
    total: doctors.length,
    enabled: doctors.filter((item) => item.enabledStatus === '已启用').length,
    disabled: doctors.filter((item) => item.enabledStatus === '已停用').length,
  }), [doctors])

  const toggleStatus = (record) => {
    const nextStatus = record.enabledStatus === '已启用' ? '已停用' : '已启用'
    setDoctors((list) => list.map((item) => (
      item.id === record.id ? { ...item, enabledStatus: nextStatus } : item
    )))
    message.success(`${record.doctorName} 已${nextStatus === '已启用' ? '启用' : '停用'}`)
  }

  const handleCreate = async () => {
    const values = await form.validateFields()
    const nextId = doctors.length + 1
    setDoctors([
      {
        id: `new-${nextId}`,
        doctorNo: `YS20260517${String(nextId).padStart(3, '0')}`,
        enabledStatus: '已启用',
        joinedAt: '2026-05-17',
        ...values,
      },
      ...doctors,
    ])
    form.resetFields()
    setOpen(false)
    message.success('已新增医生人员')
  }

  const columns = [
    { title: '医生编号', dataIndex: 'doctorNo', width: 150, fixed: 'left' },
    { title: '医生类型', dataIndex: 'doctorType', width: 120 },
    { title: '医生姓名', dataIndex: 'doctorName', width: 120 },
    { title: '手机号', dataIndex: 'phone', width: 140 },
    { title: '医院名称', dataIndex: 'hospitalName', width: 160 },
    { title: '所在位置', dataIndex: 'location', width: 240 },
    {
      title: '启用状态',
      dataIndex: 'enabledStatus',
      width: 120,
      render: (value) => <Tag color={value === '已启用' ? 'green' : 'default'}>{value}</Tag>,
    },
    { title: '入驻时间', dataIndex: 'joinedAt', width: 140 },
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
        <div style={{ fontSize: 16, fontWeight: 500, color: '#333' }}>医生管理</div>
        <Button type="primary" onClick={() => setOpen(true)}>新增医生人员</Button>
      </div>

      <Row gutter={16}>
        <Col span={8}><Card><Statistic title="医生总数" value={summary.total} suffix="人" /></Card></Col>
        <Col span={8}><Card><Statistic title="已启用" value={summary.enabled} suffix="人" valueStyle={{ color: '#52c41a' }} /></Card></Col>
        <Col span={8}><Card><Statistic title="已停用" value={summary.disabled} suffix="人" valueStyle={{ color: '#999' }} /></Card></Col>
      </Row>

      <Card bodyStyle={{ paddingBottom: 8 }}>
        <Form layout="inline">
          <Form.Item label="医生类型">
            <Select
              placeholder="请选择类型"
              allowClear
              style={{ width: 160 }}
              value={query.doctorType}
              onChange={(value) => setQuery({ ...query, doctorType: value })}
            >
              <Select.Option value="互联网医生">互联网医生</Select.Option>
              <Select.Option value="机构医生">机构医生</Select.Option>
            </Select>
          </Form.Item>
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
          <Form.Item label="医生搜索">
            <Input
              allowClear
              value={query.keyword}
              placeholder="医生姓名/手机号"
              style={{ width: 220 }}
              onChange={(event) => setQuery({ ...query, keyword: event.target.value })}
            />
          </Form.Item>
          <Form.Item>
            <Button onClick={() => setQuery({ doctorType: undefined, enabledStatus: undefined, keyword: '' })}>重置</Button>
          </Form.Item>
        </Form>
      </Card>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={filteredData}
        pagination={{ pageSize: 10, showSizeChanger: false }}
        scroll={{ x: 1530, y: 'calc(100vh - 360px)' }}
        style={{ flex: 1 }}
      />

      <Modal
        title="新增医生人员"
        open={open}
        onCancel={() => setOpen(false)}
        onOk={handleCreate}
        okText="提交"
        cancelText="取消"
        destroyOnClose
      >
        <Form form={form} layout="vertical" preserve={false}>
          <Form.Item label="医生类型" name="doctorType" rules={[{ required: true, message: '请选择医生类型' }]}>
            <Select placeholder="请选择医生类型">
              <Select.Option value="互联网医生">互联网医生</Select.Option>
              <Select.Option value="机构医生">机构医生</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="医生姓名" name="doctorName" rules={[{ required: true, message: '请输入医生姓名' }]}>
            <Input placeholder="请输入医生姓名" />
          </Form.Item>
          <Form.Item label="手机号" name="phone" rules={[{ required: true, message: '请输入手机号' }]}>
            <Input placeholder="请输入手机号" />
          </Form.Item>
          <Form.Item label="医院名称" name="hospitalName" rules={[{ required: true, message: '请输入医院名称' }]}>
            <Input placeholder="请输入医院名称" />
          </Form.Item>
          <Form.Item label="所在位置" name="location" rules={[{ required: true, message: '请输入所在位置' }]}>
            <Input placeholder="例如：江西省南昌市某某地址" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
