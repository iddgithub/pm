import { useMemo, useState } from 'react'
import { Button, Card, Col, Descriptions, Drawer, Form, Input, Row, Select, Space, Statistic, Table, Tag, message } from 'antd'
import { CheckCircleOutlined, CloseCircleOutlined, SettingOutlined } from '@ant-design/icons'
import { doctorApplications } from '../../../../../shared/mocks/incentive'

const statusColors = {
  '待审核': 'orange',
  '审核通过': 'green',
  '审核驳回': 'red',
}

export default function DoctorReview() {
  const [applications, setApplications] = useState(doctorApplications)
  const [query, setQuery] = useState({ keyword: '', auditStatus: undefined, doctorType: undefined })
  const [selected, setSelected] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const filteredData = useMemo(() => {
    return applications.filter((item) => {
      if (query.keyword) {
        const keyword = query.keyword.trim()
        const hit = item.doctorName.includes(keyword)
          || item.phone.includes(keyword)
          || item.applicationNo.includes(keyword)
        if (!hit) return false
      }
      if (query.auditStatus && item.auditStatus !== query.auditStatus) return false
      if (query.doctorType && item.doctorType !== query.doctorType) return false
      return true
    })
  }, [applications, query])

  const metrics = useMemo(() => {
    return {
      total: applications.length,
      pending: applications.filter((item) => item.auditStatus === '待审核').length,
      approved: applications.filter((item) => item.auditStatus === '审核通过').length,
    }
  }, [applications])

  const openDetail = (record) => {
    setSelected(record)
    setDrawerOpen(true)
  }

  const updateAuditStatus = (record, auditStatus) => {
    const nextRecord = { ...record, auditStatus }
    setApplications((prev) => prev.map((item) => (item.id === record.id ? nextRecord : item)))
    setSelected(nextRecord)
    message.success(auditStatus === '审核通过'
      ? `已通过 ${record.doctorName}，系统将自动短信通知医生`
      : `已驳回 ${record.doctorName}，请补充资质后重新提交`)
  }

  const columns = [
    { title: '申请单号', dataIndex: 'applicationNo', width: 160 },
    { title: '申请时间', dataIndex: 'applyTime', width: 150 },
    { title: '医生类型', dataIndex: 'doctorType', width: 110 },
    { title: '医生姓名', dataIndex: 'doctorName', width: 110 },
    { title: '手机号', dataIndex: 'phone', width: 130 },
    { title: '医院名称', dataIndex: 'clinicName', width: 160 },
    { title: '所在位置', dataIndex: 'region', width: 210 },
    {
      title: '审核状态',
      dataIndex: 'auditStatus',
      width: 100,
      render: (value) => <Tag color={statusColors[value]}>{value}</Tag>,
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 110,
      render: (_, record) => (
        <Button type="link" size="small" icon={<SettingOutlined />} onClick={() => openDetail(record)}>
          操作
        </Button>
      ),
    },
  ]

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 16, gap: 16, overflow: 'hidden' }}>
      <div style={{ fontSize: 16, fontWeight: 500, color: '#333' }}>医生审核列表</div>

      <Row gutter={16}>
        <Col span={8}>
          <Card><Statistic title="申请总数" value={metrics.total} suffix="条" /></Card>
        </Col>
        <Col span={8}>
          <Card><Statistic title="待审核" value={metrics.pending} suffix="条" valueStyle={{ color: '#FF6B00' }} /></Card>
        </Col>
        <Col span={8}>
          <Card><Statistic title="已通过" value={metrics.approved} suffix="条" valueStyle={{ color: '#52c41a' }} /></Card>
        </Col>
      </Row>

      <Card bodyStyle={{ paddingBottom: 8 }}>
        <Form layout="inline">
          <Form.Item label="医生类型">
            <Select
              placeholder="请选择"
              allowClear
              value={query.doctorType}
              style={{ width: 140 }}
              onChange={(value) => setQuery({ ...query, doctorType: value })}
            >
              <Select.Option value="互联网医生">互联网医生</Select.Option>
              <Select.Option value="线下医生">线下医生</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="审核状态">
            <Select
              placeholder="请选择"
              allowClear
              value={query.auditStatus}
              style={{ width: 140 }}
              onChange={(value) => setQuery({ ...query, auditStatus: value })}
            >
              <Select.Option value="待审核">待审核</Select.Option>
              <Select.Option value="审核通过">审核通过</Select.Option>
              <Select.Option value="审核驳回">审核驳回</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="医生搜索">
            <Input
              placeholder="医生姓名/手机号"
              allowClear
              value={query.keyword}
              style={{ width: 220 }}
              onChange={(event) => setQuery({ ...query, keyword: event.target.value })}
            />
          </Form.Item>
          <Form.Item>
            <Button onClick={() => setQuery({ keyword: '', auditStatus: undefined, doctorType: undefined })}>重置</Button>
          </Form.Item>
        </Form>
      </Card>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={filteredData}
        pagination={{ pageSize: 10, showSizeChanger: false }}
        scroll={{ x: 1380, y: 'calc(100vh - 360px)' }}
        style={{ flex: 1 }}
      />

      <Drawer
        title="申请资料详情"
        width={520}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        {selected && (
          <Descriptions column={1} size="small" bordered>
            <Descriptions.Item label="申请单号">{selected.applicationNo}</Descriptions.Item>
            <Descriptions.Item label="申请时间">{selected.applyTime}</Descriptions.Item>
            <Descriptions.Item label="医生类型">{selected.doctorType}</Descriptions.Item>
            <Descriptions.Item label="医生姓名">{selected.doctorName}</Descriptions.Item>
            <Descriptions.Item label="手机号">{selected.phone}</Descriptions.Item>
            <Descriptions.Item label="医院名称">{selected.clinicName}</Descriptions.Item>
            <Descriptions.Item label="所在位置">{selected.region}</Descriptions.Item>
          </Descriptions>
        )}
        {selected && (
          <Space style={{ marginTop: 16 }}>
            <Button
              type="primary"
              icon={<CheckCircleOutlined />}
              onClick={() => updateAuditStatus(selected, '审核通过')}
            >
              通过
            </Button>
            <Button
              danger
              icon={<CloseCircleOutlined />}
              onClick={() => updateAuditStatus(selected, '审核驳回')}
            >
              拒绝
            </Button>
          </Space>
        )}
      </Drawer>
    </div>
  )
}
