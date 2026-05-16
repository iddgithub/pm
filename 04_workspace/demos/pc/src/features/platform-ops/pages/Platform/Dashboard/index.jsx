import { useMemo, useState } from 'react'
import { Card, Col, DatePicker, Empty, Row, Statistic, Table } from 'antd'
import dayjs from 'dayjs'
import { dashboardMetrics, doctorRanking, operatorRanking } from '../../../../../shared/mocks/incentive'

const dailyOrderTrend = Array.from({ length: 30 }, (_, index) => {
  const date = dayjs().subtract(29 - index, 'day')
  return {
    date: date.format('YYYY-MM-DD'),
    label: date.format('MM-DD'),
    orderCount: 96 + index * 3 + (index % 5) * 8,
  }
})

function OrderLineChart({ data }) {
  if (!data.length) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="当前时间范围暂无开单数据" />
  }

  const width = 920
  const height = 220
  const padding = { top: 24, right: 28, bottom: 42, left: 48 }
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
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', minWidth: 520, height }}>
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
        <path d={path} fill="none" stroke="#1677ff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path
          d={`${path} L ${points[points.length - 1]?.x || padding.left} ${height - padding.bottom} L ${padding.left} ${height - padding.bottom} Z`}
          fill="rgba(22,119,255,0.08)"
        />
        {points.map((point) => (
          <g key={point.date}>
            <circle cx={point.x} cy={point.y} r="4" fill="#1677ff" />
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

function StarDoctorBarChart({ data }) {
  if (!data.length) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="当前时间范围暂无明星医生数据" />
  }

  const width = 920
  const height = 220
  const padding = { top: 28, right: 32, bottom: 56, left: 52 }
  const maxOrder = Math.max(...data.map((item) => item.orderCount), 1)
  const maxBonus = Math.max(...data.map((item) => item.doctorBonus), 1)
  const groupWidth = (width - padding.left - padding.right) / data.length
  const barWidth = Math.min(28, groupWidth / 4)

  const scaleY = (value, maxValue) => padding.top + (1 - value / maxValue) * (height - padding.top - padding.bottom)

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', minWidth: 520, height }}>
        {[0, 1, 2, 3].map((item) => {
          const y = padding.top + item * ((height - padding.top - padding.bottom) / 3)
          const value = Math.round(maxOrder - item * (maxOrder / 3))
          return (
            <g key={item}>
              <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="#eef1f4" />
              <text x={padding.left - 12} y={y + 4} textAnchor="end" fontSize="12" fill="#8c8c8c">{value}</text>
            </g>
          )
        })}
        {data.map((item, index) => {
          const centerX = padding.left + groupWidth * index + groupWidth / 2
          const orderHeight = height - padding.bottom - scaleY(item.orderCount, maxOrder)
          const bonusHeight = height - padding.bottom - scaleY(item.doctorBonus, maxBonus)
          return (
            <g key={item.doctorName}>
              <rect x={centerX - barWidth - 3} y={height - padding.bottom - orderHeight} width={barWidth} height={orderHeight} rx="6" fill="#1677ff" />
              <rect x={centerX + 3} y={height - padding.bottom - bonusHeight} width={barWidth} height={bonusHeight} rx="6" fill="#ff8f1f" />
              <text x={centerX} y={height - 28} textAnchor="middle" fontSize="12" fill="#595959">{item.doctorName}</text>
              <text x={centerX} y={height - 10} textAnchor="middle" fontSize="11" fill="#8c8c8c">{item.orderCount}单 / ¥{item.doctorBonus.toLocaleString()}</text>
              <title>{`${item.doctorName}：开单 ${item.orderCount} 单，提成 ¥${item.doctorBonus.toLocaleString()}`}</title>
            </g>
          )
        })}
        <g transform={`translate(${width - 190}, 10)`}>
          <rect width="10" height="10" rx="3" fill="#1677ff" />
          <text x="16" y="10" fontSize="12" fill="#595959">开单数</text>
          <rect x="72" width="10" height="10" rx="3" fill="#ff8f1f" />
          <text x="88" y="10" fontSize="12" fill="#595959">提成金额</text>
        </g>
      </svg>
    </div>
  )
}

export default function Dashboard() {
  const [range, setRange] = useState([dayjs().subtract(6, 'day'), dayjs()])

  const filteredTrend = useMemo(() => {
    if (!range?.[0] || !range?.[1]) return dailyOrderTrend.slice(-7)
    return dailyOrderTrend.filter((item) => {
      const current = dayjs(item.date)
      return current.isAfter(range[0].subtract(1, 'day')) && current.isBefore(range[1].add(1, 'day'))
    })
  }, [range])

  const trendSummary = useMemo(() => ({
    total: filteredTrend.reduce((sum, item) => sum + item.orderCount, 0),
    average: filteredTrend.length
      ? Math.round(filteredTrend.reduce((sum, item) => sum + item.orderCount, 0) / filteredTrend.length)
      : 0,
  }), [filteredTrend])

  const starDoctors = useMemo(() => {
    const days = Math.max(filteredTrend.length, 1)
    return doctorRanking.slice(0, 6).map((item, index) => ({
      ...item,
      orderCount: Math.max(1, Math.round(item.orderCount * days / 7)),
      doctorBonus: Math.max(100, Math.round(item.doctorBonus * days / 7)),
      rank: index + 1,
    }))
  }, [filteredTrend])

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 16, gap: 16, overflow: 'auto' }}>
      <div style={{ fontSize: 16, fontWeight: 500, color: '#333' }}>平台业务总览</div>

      <Row gutter={[16, 16]}>
        {dashboardMetrics.map((item) => (
          <Col span={8} key={item.key}>
            <Card>
              <Statistic title={item.label} value={item.value} prefix={item.prefix} suffix={item.suffix} valueStyle={item.key === 'doctorBonus' ? { color: '#FF6B00' } : undefined} />
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card
            title="每日开单趋势"
            extra={(
              <DatePicker.RangePicker
                allowClear={false}
                value={range}
                onChange={(value) => setRange(value)}
              />
            )}
          >
            <Row gutter={16} style={{ marginBottom: 12 }}>
              <Col span={8}><Statistic title="筛选期开单数" value={trendSummary.total} suffix="单" /></Col>
              <Col span={8}><Statistic title="日均开单数" value={trendSummary.average} suffix="单" /></Col>
              <Col span={8}><Statistic title="统计天数" value={filteredTrend.length} suffix="天" /></Col>
            </Row>
            <OrderLineChart data={filteredTrend} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="明星开单医生">
            <Row gutter={16} style={{ marginBottom: 12 }}>
              <Col span={8}><Statistic title="上榜医生数" value={starDoctors.length} suffix="人" /></Col>
              <Col span={8}><Statistic title="明星医生开单数" value={starDoctors.reduce((sum, item) => sum + item.orderCount, 0)} suffix="单" /></Col>
              <Col span={8}><Statistic title="明星医生提成" value={starDoctors.reduce((sum, item) => sum + item.doctorBonus, 0)} prefix="¥" valueStyle={{ color: '#FF6B00' }} /></Col>
            </Row>
            <StarDoctorBarChart data={starDoctors} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="运营排行">
            <Table
              rowKey="name"
              size="small"
              pagination={false}
              columns={[
                { title: '运营', dataIndex: 'name' },
                { title: '区域', dataIndex: 'region' },
                { title: '绑定医生', dataIndex: 'bindingDoctors' },
                { title: '开单数', dataIndex: 'orderCount' },
                { title: '提成', dataIndex: 'operatorBonus', render: (value) => `¥${value.toLocaleString()}` },
              ]}
              dataSource={operatorRanking}
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
                { title: '科室', dataIndex: 'department' },
                { title: '开单数', dataIndex: 'orderCount' },
                { title: '提成', dataIndex: 'doctorBonus', render: (value) => `¥${value.toLocaleString()}` },
              ]}
              dataSource={doctorRanking}
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}
