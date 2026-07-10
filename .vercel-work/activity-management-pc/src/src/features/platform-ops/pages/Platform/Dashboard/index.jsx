import { useMemo, useState } from 'react'
import { Button, Card, Col, DatePicker, Empty, Modal, Row, Statistic, Table } from 'antd'
import dayjs from 'dayjs'
import { dashboardMetrics, doctorPerformance, operatorSummary, orderDetails } from '../../../../../shared/mocks/incentive'

const dailyOrderTrend = Array.from({ length: 30 }, (_, index) => {
  const date = dayjs().subtract(29 - index, 'day')
  return {
    date: date.format('YYYY-MM-DD'),
    label: date.format('MM-DD'),
    orderCount: 96 + index * 3 + (index % 5) * 8,
  }
})

const appointmentSlots = ['09:00-10:00', '10:30-11:30', '14:00-15:00', '15:30-16:30', '17:00-18:00']
const deliveryCenters = ['南昌红谷滩影像交付中心', '南昌西湖影像交付中心', '南昌青山湖影像交付中心', '南昌东湖影像交付中心', '南昌高新影像交付中心']

function OrderLineChart({ data }) {
  if (!data.length) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="当前时间范围暂无开单数据" />
  }

  const width = 1400
  const height = 260
  const padding = { top: 34, right: 42, bottom: 46, left: 52 }
  const maxValue = Math.max(...data.map((item) => item.orderCount), 1)
  const minValue = Math.min(...data.map((item) => item.orderCount), 0)
  const valueRange = Math.max(maxValue - minValue, 1)
  const xStep = data.length > 1 ? (width - padding.left - padding.right) / (data.length - 1) : 0

  const points = data.map((item, index) => {
    const x = padding.left + index * xStep
    const y = padding.top + ((maxValue - item.orderCount) / valueRange) * (height - padding.top - padding.bottom)
    return { ...item, x, y }
  })
  const path = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ')
  const xLabels = points.filter((_, index) => index === 0 || index === points.length - 1 || index === Math.floor(points.length / 2))

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <svg viewBox={`0 0 ${width} ${height}`} style={{ display: 'block', width: '100%', minWidth: 860, height }}>
        <defs>
          <linearGradient id="orderTrendArea" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#1677ff" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#1677ff" stopOpacity="0.03" />
          </linearGradient>
        </defs>
        {[0, 1, 2, 3].map((item) => {
          const y = padding.top + item * ((height - padding.top - padding.bottom) / 3)
          const value = Math.round(maxValue - item * (valueRange / 3))
          return (
            <g key={item}>
              <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="#eef1f4" />
              <text x={padding.left - 12} y={y + 4} textAnchor="end" fontSize="12" fill="#8c8c8c">{value}</text>
            </g>
          )
        })}
        {points.map((point) => (
          <line key={`guide-${point.date}`} x1={point.x} y1={padding.top} x2={point.x} y2={height - padding.bottom} stroke="#f2f5f8" strokeDasharray="4 8" />
        ))}
        <path
          d={`${path} L ${points[points.length - 1]?.x || padding.left} ${height - padding.bottom} L ${padding.left} ${height - padding.bottom} Z`}
          fill="url(#orderTrendArea)"
        />
        <path d={path} fill="none" stroke="#1677ff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((point) => (
          <g key={point.date}>
            <circle cx={point.x} cy={point.y} r="7" fill="#ffffff" stroke="#1677ff" strokeWidth="3" />
            <text x={point.x} y={point.y - 14} textAnchor="middle" fontSize="12" fill="#1677ff">{point.orderCount}</text>
            <title>{`${point.date}：${point.orderCount} 单`}</title>
          </g>
        ))}
        {xLabels.map((point) => (
          <text key={point.date} x={point.x} y={height - 14} textAnchor="middle" fontSize="12" fill="#8c8c8c">{point.label}</text>
        ))}
      </svg>
    </div>
  )
}

function getMetricValue(key) {
  return dashboardMetrics.find((item) => item.key === key)?.value || 0
}

function buildRankingDetailOrders(record, type) {
  const source = type === 'operator' ? operatorSummary : doctorPerformance
  const sourceIndex = source.findIndex((item) => (
    type === 'operator'
      ? item.operatorName === record.operatorName
      : item.doctorName === record.doctorName
  ))
  const index = sourceIndex >= 0 ? sourceIndex : 0

  return orderDetails
    .filter((_, orderIndex) => orderIndex % source.length === index)
    .map((item) => ({
      ...item,
      ownerName: type === 'operator' ? record.operatorName : record.doctorName,
      commissionAmount: type === 'operator' ? item.operatorBonus : item.doctorBonus,
    }))
}

export default function Dashboard() {
  const [range, setRange] = useState([dayjs().subtract(6, 'day'), dayjs()])
  const [detail, setDetail] = useState({ open: false, type: 'operator', record: null })

  const filteredTrend = useMemo(() => {
    if (!range?.[0] || !range?.[1]) return dailyOrderTrend.slice(-7)
    return dailyOrderTrend.filter((item) => {
      const current = dayjs(item.date)
      return current.isAfter(range[0].subtract(1, 'day')) && current.isBefore(range[1].add(1, 'day'))
    })
  }, [range])

  const overviewMetrics = useMemo(() => ([
    { key: 'operatorCount', label: '平台运营人数', value: operatorSummary.length, suffix: '人' },
    { key: 'signedDoctors', label: '已签约医生人数', value: getMetricValue('signedDoctors'), suffix: '人' },
    { key: 'orderCount', label: '已开单数', value: getMetricValue('orderCount'), suffix: '单' },
    { key: 'reportCount', label: '已解读报告数', value: getMetricValue('reportCount'), suffix: '单' },
    { key: 'projectAmount', label: '总项目金额数', value: getMetricValue('orderCount') * 228, prefix: '¥' },
  ]), [])

  const operatorRankData = operatorSummary.slice(0, 5)
  const doctorRankData = doctorPerformance.slice(0, 5)
  const orderListData = orderDetails.slice(0, 5).map((item, index) => {
    const doctor = doctorPerformance[index % doctorPerformance.length]
    const operator = operatorSummary[index % operatorSummary.length]
    return {
      ...item,
      appointmentTime: `${dayjs().add(index + 1, 'day').format('YYYY-MM-DD')} ${appointmentSlots[index % appointmentSlots.length]}`,
      deliveryCenter: deliveryCenters[index % deliveryCenters.length],
      projectAmount: 200 + index * 80,
      doctorName: doctor.doctorName,
      clinicDoctorName: doctorPerformance[(index + 2) % doctorPerformance.length].doctorName,
      clinicName: doctor.clinicName,
      operatorName: operator.operatorName,
    }
  })
  const detailOrders = detail.record ? buildRankingDetailOrders(detail.record, detail.type) : []

  const openDetail = (record, type) => {
    setDetail({ open: true, type, record })
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 16, gap: 16, overflow: 'auto' }}>
      <div style={{ fontSize: 16, fontWeight: 500, color: '#333' }}>平台业务总览</div>

      <Row gutter={[16, 16]}>
        {overviewMetrics.map((item) => (
          <Col flex="1" key={item.key}>
            <Card>
              <Statistic title={item.label} value={item.value} prefix={item.prefix} suffix={item.suffix} valueStyle={item.key === 'projectAmount' ? { color: '#FF6B00' } : undefined} />
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card
            title="开单数据"
            extra={(
              <DatePicker.RangePicker
                allowClear={false}
                value={range}
                onChange={(value) => setRange(value)}
              />
            )}
          >
            <OrderLineChart data={filteredTrend} />
          </Card>
        </Col>
        <Col span={24}>
          <Card title="订单列表信息">
            <Table
              rowKey="orderNo"
              size="small"
              pagination={false}
              scroll={{ x: 1540 }}
              columns={[
                { title: '患者', dataIndex: 'patientName', width: 90 },
                { title: '预约日期时间段', dataIndex: 'appointmentTime', width: 170 },
                { title: '交付中心', dataIndex: 'deliveryCenter', width: 190 },
                { title: '影像检查项目', dataIndex: 'projectName', width: 130 },
                { title: '项目金额', dataIndex: 'projectAmount', width: 100, render: (value) => `¥${value.toLocaleString()}` },
                { title: '开单医生', dataIndex: 'doctorName', width: 100 },
                { title: '关联诊所医生', dataIndex: 'clinicDoctorName', width: 120 },
                { title: '关联诊所', dataIndex: 'clinicName', width: 140 },
                { title: '关联运营', dataIndex: 'operatorName', width: 100 },
                { title: '医生提成', dataIndex: 'doctorBonus', width: 100, render: (value) => `¥${value.toLocaleString()}` },
                { title: '运营提成', dataIndex: 'operatorBonus', width: 100, render: (value) => `¥${value.toLocaleString()}` },
              ]}
              dataSource={orderListData}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="运营排行">
            <Table
              rowKey="operatorName"
              size="small"
              pagination={false}
              columns={[
                { title: '运营', dataIndex: 'operatorName' },
                { title: '绑定医生', dataIndex: 'bindingDoctors' },
                { title: '开单数', dataIndex: 'orderCount' },
                { title: '已解读报告数', dataIndex: 'reportCount' },
                { title: '提成', dataIndex: 'operatorBonus', render: (value) => `¥${value.toLocaleString()}` },
                {
                  title: '详情',
                  key: 'detail',
                  render: (_, record) => (
                    <Button type="link" size="small" onClick={() => openDetail(record, 'operator')}>详情</Button>
                  ),
                },
              ]}
              dataSource={operatorRankData}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="医生排行">
            <Table
              rowKey="doctorName"
              size="small"
              pagination={false}
              columns={[
                { title: '医生', dataIndex: 'doctorName' },
                { title: '诊所', dataIndex: 'clinicName' },
                { title: '开单数', dataIndex: 'orderCount' },
                { title: '已解读报告数', dataIndex: 'reportCount' },
                { title: '提成', dataIndex: 'doctorBonus', render: (value) => `¥${value.toLocaleString()}` },
                {
                  title: '详情',
                  key: 'detail',
                  render: (_, record) => (
                    <Button type="link" size="small" onClick={() => openDetail(record, 'doctor')}>详情</Button>
                  ),
                },
              ]}
              dataSource={doctorRankData}
            />
          </Card>
        </Col>
      </Row>

      <Modal
        title={`${detail.type === 'operator' ? '运营' : '医生'}订单提成明细`}
        open={detail.open}
        onCancel={() => setDetail({ open: false, type: detail.type, record: null })}
        footer={null}
        centered
        width={980}
        destroyOnClose
      >
        <Table
          rowKey="orderNo"
          size="small"
          pagination={false}
          columns={[
            { title: '提成归属', dataIndex: 'ownerName', width: 100 },
            { title: '订单号', dataIndex: 'orderNo', width: 150 },
            { title: '患者姓名', dataIndex: 'patientName', width: 100 },
            { title: '检查项目', dataIndex: 'projectName', width: 130 },
            { title: '订单状态', dataIndex: 'orderStatus', width: 100 },
            { title: '医生提成', dataIndex: 'doctorBonus', width: 100, render: (value) => `¥${value.toLocaleString()}` },
            { title: '运营提成', dataIndex: 'operatorBonus', width: 100, render: (value) => `¥${value.toLocaleString()}` },
            { title: '本单提成', dataIndex: 'commissionAmount', width: 100, render: (value) => `¥${value.toLocaleString()}` },
          ]}
          dataSource={detailOrders}
          scroll={{ x: 880 }}
        />
      </Modal>
    </div>
  )
}
