import { useMemo, useState } from 'react'
import { Button, Card, Col, Descriptions, Form, Input, Modal, Row, Select, Statistic, Table, Tag } from 'antd'
import dayjs from 'dayjs'
import { doctorBindings } from '../../../../../shared/mocks/incentive'

const projects = ['CT颅脑平扫', '肺部CT筛查', '骨密度检查', '冠脉CTA']
const operatorPhones = {
  运营A: '13600001001',
  运营B: '13600001002',
  运营C: '13600001003',
  运营D: '13600001004',
}

function buildOrderDetails(record, rowIndex) {
  const count = 4 + (rowIndex % 3)

  return Array.from({ length: count }, (_, index) => {
    const orderAmount = 180 + ((rowIndex + index) % 5) * 60
    const grossProfit = Math.round(orderAmount * 0.35)
    const commissionAmount = Math.round(grossProfit * (record.doctorRate / 100))
    const completed = index % 4 !== 0

    return {
      id: `${record.id}-${index + 1}`,
      orderNo: `TC${dayjs().format('YYYYMM')}${String(record.id).padStart(3, '0')}${String(index + 1).padStart(2, '0')}`,
      patientName: `患者${rowIndex + index + 1}`,
      projectName: projects[(rowIndex + index) % projects.length],
      orderAmount,
      grossProfit,
      doctorRate: record.doctorRate,
      commissionAmount,
      reportStatus: completed ? '已完成解读' : '未完成解读',
      completedAt: completed ? dayjs().subtract(index + rowIndex, 'day').format('YYYY-MM-DD HH:mm') : '-',
    }
  })
}

const seedBonusRows = doctorBindings.map((item, index) => {
  const orderList = buildOrderDetails(item, index)
  const completedReportCount = orderList.filter((order) => order.reportStatus === '已完成解读').length
  const pendingReportCount = orderList.length - completedReportCount

  return {
    id: item.id,
    operatorName: item.operatorName,
    operatorPhone: operatorPhones[item.operatorName],
    doctorName: item.doctorName,
    phone: item.phone,
    clinicName: item.clinicName,
    monthOrderCount: orderList.length,
    completedReportCount,
    pendingReportCount,
    totalCommission: orderList.reduce((sum, order) => sum + order.commissionAmount, 0),
    orderList,
  }
})

export default function BonusManagement() {
  const [query, setQuery] = useState({ operatorName: undefined, doctorName: undefined, keyword: '' })
  const [selected, setSelected] = useState(null)
  const [detailOpen, setDetailOpen] = useState(false)

  const operatorOptions = Array.from(new Set(seedBonusRows.map((item) => item.operatorName)))
  const doctorOptions = Array.from(new Set(seedBonusRows.map((item) => item.doctorName)))

  const filteredData = useMemo(() => {
    return seedBonusRows.filter((item) => {
      if (query.operatorName && item.operatorName !== query.operatorName) return false
      if (query.doctorName && item.doctorName !== query.doctorName) return false
      if (query.keyword) {
        const keyword = query.keyword.trim()
        const hit = item.doctorName.includes(keyword)
          || item.phone.includes(keyword)
          || item.operatorName.includes(keyword)
          || item.operatorPhone.includes(keyword)
        if (!hit) return false
      }
      return true
    })
  }, [query])

  const summary = useMemo(() => ({
    doctorCount: filteredData.length,
    orderCount: filteredData.reduce((sum, item) => sum + item.monthOrderCount, 0),
    completedCount: filteredData.reduce((sum, item) => sum + item.completedReportCount, 0),
    totalCommission: filteredData.reduce((sum, item) => sum + item.totalCommission, 0),
  }), [filteredData])

  const openDetail = (record) => {
    setSelected(record)
    setDetailOpen(true)
  }

  const columns = [
    { title: '关联运营', dataIndex: 'operatorName', width: 120, fixed: 'left' },
    { title: '医生姓名', dataIndex: 'doctorName', width: 120 },
    { title: '手机号', dataIndex: 'phone', width: 140 },
    { title: '本月开单数', dataIndex: 'monthOrderCount', width: 120, render: (value) => `${value}单` },
    { title: '已完成解读报告数', dataIndex: 'completedReportCount', width: 150, render: (value) => `${value}份` },
    { title: '未完成解读报告数', dataIndex: 'pendingReportCount', width: 150, render: (value) => <Tag color={value > 0 ? 'orange' : 'green'}>{value}份</Tag> },
    { title: '总提成金额', dataIndex: 'totalCommission', width: 130, render: (value) => `¥${value.toLocaleString()}` },
    {
      title: '操作',
      key: 'action',
      width: 100,
      fixed: 'right',
      render: (_, record) => (
        <Button type="link" size="small" onClick={() => openDetail(record)}>
          详情
        </Button>
      ),
    },
  ]

  const detailColumns = [
    { title: '订单号', dataIndex: 'orderNo', width: 150 },
    { title: '患者', dataIndex: 'patientName', width: 90 },
    { title: '检查项目', dataIndex: 'projectName', width: 130 },
    { title: '订单金额', dataIndex: 'orderAmount', width: 100, render: (value) => `¥${value}` },
    { title: '医生提成比例', dataIndex: 'doctorRate', width: 120, render: (value) => `${value}%` },
    { title: '本单提成', dataIndex: 'commissionAmount', width: 100, render: (value) => `¥${value}` },
    {
      title: '解读状态',
      dataIndex: 'reportStatus',
      width: 120,
      render: (value) => <Tag color={value === '已完成解读' ? 'green' : 'orange'}>{value}</Tag>,
    },
    { title: '完成时间', dataIndex: 'completedAt', width: 150 },
  ]

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 16, gap: 16, overflow: 'hidden' }}>
      <div style={{ fontSize: 16, fontWeight: 500, color: '#333' }}>业务管理</div>

      <Row gutter={16}>
        <Col span={6}><Card><Statistic title="关联医生数" value={summary.doctorCount} suffix="人" /></Card></Col>
        <Col span={6}><Card><Statistic title="本月开单数" value={summary.orderCount} suffix="单" /></Card></Col>
        <Col span={6}><Card><Statistic title="已完成解读报告数" value={summary.completedCount} suffix="份" valueStyle={{ color: '#52c41a' }} /></Card></Col>
        <Col span={6}><Card><Statistic title="总提成金额" value={summary.totalCommission} prefix="¥" valueStyle={{ color: '#FF6B00' }} /></Card></Col>
      </Row>

      <Card bodyStyle={{ paddingBottom: 8 }}>
        <Form layout="inline">
          <Form.Item label="运营筛选">
            <Select
              placeholder="请选择运营"
              allowClear
              style={{ width: 180 }}
              value={query.operatorName}
              onChange={(value) => setQuery({ ...query, operatorName: value })}
            >
              {operatorOptions.map((item) => (
                <Select.Option key={item} value={item}>{item}</Select.Option>
              ))}
            </Select>
          </Form.Item>
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
          <Form.Item label="医生搜索">
            <Input
              allowClear
              value={query.keyword}
              placeholder="医生/运营姓名或手机号"
              style={{ width: 240 }}
              onChange={(event) => setQuery({ ...query, keyword: event.target.value })}
            />
          </Form.Item>
          <Form.Item>
            <Button onClick={() => setQuery({ operatorName: undefined, doctorName: undefined, keyword: '' })}>重置</Button>
          </Form.Item>
        </Form>
      </Card>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={filteredData}
        pagination={{ pageSize: 10, showSizeChanger: false }}
        scroll={{ x: 1120, y: 'calc(100vh - 380px)' }}
        style={{ flex: 1 }}
      />

      <Modal
        title="医生提成明细"
        width={980}
        open={detailOpen}
        onCancel={() => setDetailOpen(false)}
        footer={null}
        centered
        destroyOnClose
      >
        {selected && (
          <>
            <Descriptions column={2} size="small" bordered style={{ marginBottom: 16 }}>
              <Descriptions.Item label="关联运营">{selected.operatorName}</Descriptions.Item>
              <Descriptions.Item label="医生姓名">{selected.doctorName}</Descriptions.Item>
              <Descriptions.Item label="手机号">{selected.phone}</Descriptions.Item>
              <Descriptions.Item label="机构名称">{selected.clinicName}</Descriptions.Item>
              <Descriptions.Item label="本月开单数">{selected.monthOrderCount}单</Descriptions.Item>
              <Descriptions.Item label="总提成金额">¥{selected.totalCommission.toLocaleString()}</Descriptions.Item>
            </Descriptions>
            <Table
              rowKey="id"
              columns={detailColumns}
              dataSource={selected.orderList}
              pagination={false}
              scroll={{ x: 960 }}
            />
          </>
        )}
      </Modal>
    </div>
  )
}
