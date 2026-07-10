import { useMemo, useState } from 'react'
import { Button, Card, Col, Form, Input, Row, Select, Statistic, Table, Tag, message } from 'antd'
import dayjs from 'dayjs'
import { doctorBindings, orderDetails } from '../../../../../shared/mocks/incentive'

const assignmentStatuses = ['已解读', '未解读', '待分配']

const seedRows = Array.from({ length: 24 }, (_, index) => {
  const binding = doctorBindings[index % doctorBindings.length]
  const order = orderDetails[index % orderDetails.length]
  const status = index % 5 === 0 ? '待分配' : index % 3 === 0 ? '未解读' : '已解读'

  return {
    id: `read-${index + 1}`,
    reportNo: `BG${dayjs().subtract(index, 'day').format('YYYYMMDD')}${String(index + 1).padStart(4, '0')}`,
    patientName: order.patientName,
    patientPhone: `1370000${String(600 + index).padStart(4, '0')}`,
    projectName: order.projectName,
    clinicName: binding.clinicName,
    doctorName: status === '待分配' ? '-' : binding.doctorName,
    doctorPhone: status === '待分配' ? '-' : binding.phone,
    status,
    serviceFee: 45 + (index % 4) * 15,
    reportTime: dayjs().subtract(index % 9, 'day').format('YYYY-MM-DD HH:mm'),
  }
})

const statusColors = {
  已解读: 'green',
  未解读: 'orange',
  待分配: 'default',
}

function maskPhone(phone) {
  return phone.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2')
}

export default function InterpretationAssignment() {
  const [rows, setRows] = useState(seedRows)
  const [query, setQuery] = useState({ doctorName: undefined, status: undefined, keyword: '' })

  const doctorOptions = useMemo(() => (
    Array.from(new Set(seedRows.filter((item) => item.doctorName !== '-').map((item) => item.doctorName)))
  ), [])

  const filteredData = useMemo(() => {
    return rows.filter((item) => {
      if (query.doctorName && item.doctorName !== query.doctorName) return false
      if (query.status && item.status !== query.status) return false
      if (query.keyword) {
        const keyword = query.keyword.trim()
        const hit = item.reportNo.includes(keyword)
          || item.patientName.includes(keyword)
          || item.patientPhone.includes(keyword)
          || item.projectName.includes(keyword)
          || item.clinicName.includes(keyword)
          || item.doctorName.includes(keyword)
        if (!hit) return false
      }
      return true
    })
  }, [query, rows])

  const summary = useMemo(() => ({
    total: filteredData.length,
    completed: filteredData.filter((item) => item.status === '已解读').length,
    pending: filteredData.filter((item) => item.status === '未解读').length,
    unassigned: filteredData.filter((item) => item.status === '待分配').length,
  }), [filteredData])

  const unbindDoctor = (record) => {
    setRows((list) => list.map((item) => (
      item.id === record.id
        ? { ...item, doctorName: '-', doctorPhone: '-', status: '待分配' }
        : item
    )))
    message.success(`${record.reportNo} 已解绑医生，报告状态已变为待分配`)
  }

  const columns = [
    { title: '报告单号', dataIndex: 'reportNo', width: 160, fixed: 'left' },
    { title: '患者', dataIndex: 'patientName', width: 100 },
    { title: '患者手机号', dataIndex: 'patientPhone', width: 130, render: maskPhone },
    { title: '检查项目', dataIndex: 'projectName', width: 130 },
    { title: '机构名称', dataIndex: 'clinicName', width: 160 },
    { title: '分配医生', dataIndex: 'doctorName', width: 110 },
    { title: '医生手机号', dataIndex: 'doctorPhone', width: 140 },
    { title: '解读服务费', dataIndex: 'serviceFee', width: 120, render: (value) => `¥${value}` },
    {
      title: '报告状态',
      dataIndex: 'status',
      width: 110,
      render: (value) => <Tag color={statusColors[value]}>{value}</Tag>,
    },
    { title: '出报告时间', dataIndex: 'reportTime', width: 160 },
    {
      title: '操作',
      key: 'action',
      width: 110,
      fixed: 'right',
      render: (_, record) => (
        record.status === '待分配'
          ? <span style={{ color: '#999' }}>待分配</span>
          : <Button type="link" size="small" danger onClick={() => unbindDoctor(record)}>解绑</Button>
      ),
    },
  ]

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 16, gap: 16, overflow: 'hidden' }}>
      <div style={{ fontSize: 16, fontWeight: 500, color: '#333' }}>解读分配</div>

      <Row gutter={16}>
        <Col span={6}><Card><Statistic title="报告总数" value={summary.total} suffix="份" /></Card></Col>
        <Col span={6}><Card><Statistic title="已解读报告" value={summary.completed} suffix="份" valueStyle={{ color: '#52c41a' }} /></Card></Col>
        <Col span={6}><Card><Statistic title="未解读报告" value={summary.pending} suffix="份" valueStyle={{ color: '#FF6B00' }} /></Card></Col>
        <Col span={6}><Card><Statistic title="待分配报告" value={summary.unassigned} suffix="份" valueStyle={{ color: '#999' }} /></Card></Col>
      </Row>

      <Card bodyStyle={{ paddingBottom: 8 }}>
        <Form layout="inline">
          <Form.Item label="医生筛选">
            <Select
              placeholder="请选择医生"
              allowClear
              style={{ width: 180 }}
              value={query.doctorName}
              onChange={(value) => setQuery({ ...query, doctorName: value })}
            >
              {doctorOptions.map((item) => (
                <Select.Option key={item} value={item}>{item}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="报告状态">
            <Select
              placeholder="请选择状态"
              allowClear
              style={{ width: 160 }}
              value={query.status}
              onChange={(value) => setQuery({ ...query, status: value })}
            >
              {assignmentStatuses.map((item) => (
                <Select.Option key={item} value={item}>{item}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="报告搜索">
            <Input
              allowClear
              value={query.keyword}
              placeholder="报告单号/患者/手机号/项目/机构"
              style={{ width: 260 }}
              onChange={(event) => setQuery({ ...query, keyword: event.target.value })}
            />
          </Form.Item>
          <Form.Item>
            <Button onClick={() => setQuery({ doctorName: undefined, status: undefined, keyword: '' })}>重置</Button>
          </Form.Item>
        </Form>
      </Card>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={filteredData}
        pagination={{ pageSize: 10, showSizeChanger: false }}
        scroll={{ x: 1460, y: 'calc(100vh - 360px)' }}
        style={{ flex: 1 }}
      />
    </div>
  )
}
