import { useMemo, useRef, useState } from 'react'
import { Button, Card, Col, Descriptions, Form, Input, Modal, QRCode, Row, Select, Space, Statistic, Table, Tag, message } from 'antd'
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
  const [doctors, setDoctors] = useState(seedDoctors)
  const [query, setQuery] = useState({ doctorType: undefined, enabledStatus: undefined, keyword: '' })
  const [qrPreviewDoctor, setQrPreviewDoctor] = useState(null)
  const qrWrapperRef = useRef(null)

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

  const openQrPreview = (record) => {
    setQrPreviewDoctor(record)
  }

  const downloadQrCode = () => {
    if (!qrPreviewDoctor || !qrWrapperRef.current) return

    const canvas = qrWrapperRef.current.querySelector('canvas')
    const svg = qrWrapperRef.current.querySelector('svg')
    let downloadUrl = ''

    if (canvas) {
      downloadUrl = canvas.toDataURL('image/png')
    } else if (svg) {
      const serializer = new XMLSerializer()
      const svgString = serializer.serializeToString(svg)
      downloadUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`
    }

    if (!downloadUrl) {
      message.error('二维码生成失败，请稍后重试')
      return
    }

    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = `${qrPreviewDoctor.doctorName}-二维码.${canvas ? 'png' : 'svg'}`
    link.click()
    message.success(`${qrPreviewDoctor.doctorName} 的二维码已开始下载`)
  }

  const getQrValue = (record) => (
    `https://pm-agent.local/doctor-entry?doctorNo=${record.doctorNo}&doctorName=${encodeURIComponent(record.doctorName)}&phone=${record.phone}`
  )

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
      width: 180,
      fixed: 'right',
      render: (_, record) => (
        <Space size={0}>
          <Button type="link" size="small" onClick={() => toggleStatus(record)}>
            {record.enabledStatus === '已启用' ? '停用' : '启用'}
          </Button>
          <Button type="link" size="small" onClick={() => openQrPreview(record)}>
            下载二维码
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 16, gap: 16, overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 16, fontWeight: 500, color: '#333' }}>医生管理</div>
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
        title="二维码预览"
        open={Boolean(qrPreviewDoctor)}
        onCancel={() => setQrPreviewDoctor(null)}
        footer={(
          <Space>
            <Button onClick={() => setQrPreviewDoctor(null)}>关闭</Button>
            <Button type="primary" onClick={downloadQrCode}>下载二维码</Button>
          </Space>
        )}
        destroyOnClose
      >
        {qrPreviewDoctor && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'center' }}>
            <Descriptions bordered size="small" column={1} style={{ width: '100%' }}>
              <Descriptions.Item label="医生姓名">{qrPreviewDoctor.doctorName}</Descriptions.Item>
              <Descriptions.Item label="医生编号">{qrPreviewDoctor.doctorNo}</Descriptions.Item>
              <Descriptions.Item label="手机号">{qrPreviewDoctor.phone}</Descriptions.Item>
              <Descriptions.Item label="医院名称">{qrPreviewDoctor.hospitalName}</Descriptions.Item>
            </Descriptions>
            <div
              ref={qrWrapperRef}
              style={{
                padding: 16,
                background: '#fff',
                border: '1px solid #f0f0f0',
                borderRadius: 12,
                boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06)',
              }}
            >
              <QRCode
                value={getQrValue(qrPreviewDoctor)}
                size={220}
                bordered={false}
                status="active"
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
