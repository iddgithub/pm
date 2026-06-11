import { CalendarOutlined, CaretDownFilled, PhoneFilled, RightOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { EmptyState, H5PrototypeShowcase, PrototypePhone } from '../../../shared/components/H5PrototypeShowcase'
import '../styles/operatorWorkbench.css'

const orderStatuses = ['全部', '已支付', '已检查', '已出报告', '已解读']
const months = ['2026年5月', '2026年6月']
const doctorOptions = ['所属医生', '张医生', '姜医生', '李医生']

const operatorOverview = {
  operatorName: '刘大福',
  roleLabel: '运营人员',
  doctorCount: 8,
}

const operatorOrders = [
  {
    id: 1,
    orderNo: 'QT88888888888888',
    month: '2026年5月',
    doctorName: '张医生',
    patientName: '刘大福',
    patientAge: 58,
    phone: '134****0750',
    schedule: '2026-06-18 12:12:12',
    amount: '￥180',
    status: '已出报告',
  },
  {
    id: 2,
    orderNo: 'QT88888888888888',
    month: '2026年5月',
    doctorName: '张医生',
    patientName: '刘大福',
    patientAge: 58,
    phone: '134****0750',
    schedule: '2026-06-18 12:12:12',
    amount: '￥180',
    status: '已支付',
  },
  {
    id: 3,
    month: '2026年6月',
    doctorName: '李医生',
    patientName: '陈美玲',
    patientAge: 41,
    phone: '137****2218',
    schedule: '2026-06-03 14:15:20',
    amount: '￥120',
    status: '已检查',
  },
  {
    id: 4,
    month: '2026年6月',
    doctorName: '姜医生',
    patientName: '周海青',
    patientAge: 36,
    phone: '136****8172',
    schedule: '2026-06-10 09:30:10',
    amount: '￥160',
    status: '已解读',
  },
]

function includesKeyword(keyword, values) {
  const normalizedKeyword = keyword.trim()
  if (!normalizedKeyword) return true
  return values.some((value) => String(value).includes(normalizedKeyword))
}

function orderStatusTone(status) {
  if (status === '已出报告') return 'report'
  if (status === '已支付') return 'paid'
  if (status === '已检查') return 'checked'
  if (status === '已解读') return 'interpreted'
  return 'default'
}

function StatusPill({ status }) {
  return <span className={`operator-replica-status operator-replica-status--${orderStatusTone(status)}`}>{status}</span>
}

function OrderCard({ order }) {
  return (
    <article className="operator-replica-order-card">
      <div className="operator-replica-order-head">
        <div className="operator-replica-order-title">{order.orderNo ?? `QT${String(order.id).padStart(14, '8')}`}</div>
        <StatusPill status={order.status} />
      </div>

      <div className="operator-replica-order-row">
        <span className="operator-replica-order-info">
          <UserOutlined />
          {order.patientName}
          <span className="operator-replica-order-divider">|</span>
          {order.patientAge}岁
        </span>
        <span className="operator-replica-order-info operator-replica-order-info--phone">
          <PhoneFilled />
          {order.phone}
        </span>
      </div>

      <div className="operator-replica-order-row">
        <span className="operator-replica-order-info">
          <CalendarOutlined />
          {order.schedule}
        </span>
        <span className="operator-replica-order-price">{order.amount}</span>
      </div>

      <div className="operator-replica-order-foot">
        <span className="operator-replica-order-note">关联医生：{order.doctorName}</span>
        <button type="button" className="operator-replica-order-link">
          订单详情
          <RightOutlined />
        </button>
      </div>
    </article>
  )
}

export default function OperatorWorkbench() {
  const [manageMonth, setManageMonth] = useState('2026年5月')
  const [doctorFilter, setDoctorFilter] = useState('所属医生')
  const [keyword, setKeyword] = useState('')
  const [activeStatus, setActiveStatus] = useState('全部')

  const filteredOrders = operatorOrders.filter((order) => {
    if (manageMonth && order.month !== manageMonth) return false
    if (doctorFilter !== '所属医生' && order.doctorName !== doctorFilter) return false
    if (activeStatus !== '全部' && order.status !== activeStatus) return false

    return includesKeyword(keyword, [
      order.patientName,
      order.phone,
      order.orderNo,
      order.doctorName,
    ])
  })

  return (
    <H5PrototypeShowcase
      roleTitle="运营端"
      roleSummary="按运营人员微信内页的视觉稿还原“我的管理”主屏，突出绑定医生概览、条件筛选和订单状态跟踪。"
      flowSteps={['绑定医生', '查看订单状态', '跟进出报告', '继续维护患者']}
    >
      <PrototypePhone
        label="运营人员管理页"
        tabs={['检查检验', '我的管理']}
        activeTab="我的管理"
      >
        <div className="operator-replica-screen">
          <section className="operator-replica-hero">
            <div className="operator-replica-hero-card">
              <div className="operator-replica-user">
                <div className="operator-replica-avatar" aria-hidden="true">
                  <span className="operator-replica-avatar-head" />
                  <span className="operator-replica-avatar-body" />
                </div>

                <div className="operator-replica-user-copy">
                  <div className="operator-replica-user-name">{operatorOverview.operatorName}</div>
                  <div className="operator-replica-user-role">{operatorOverview.roleLabel}</div>
                </div>
              </div>

              <button type="button" className="operator-replica-doctor-card">
                <span className="operator-replica-doctor-label">绑定医生</span>
                <div className="operator-replica-doctor-value">
                  <strong>{operatorOverview.doctorCount}人</strong>
                  <RightOutlined />
                </div>
              </button>
            </div>
          </section>

          <div className="operator-replica-filter-bar">
            <label className="operator-replica-select operator-replica-select--month">
              <select value={manageMonth} onChange={(event) => setManageMonth(event.target.value)}>
                {months.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
              <CaretDownFilled />
            </label>

            <span className="operator-replica-filter-divider" aria-hidden="true" />

            <label className="operator-replica-select operator-replica-select--doctor">
              <select value={doctorFilter} onChange={(event) => setDoctorFilter(event.target.value)}>
                {doctorOptions.map((doctor) => (
                  <option key={doctor} value={doctor}>
                    {doctor}
                  </option>
                ))}
              </select>
              <CaretDownFilled />
            </label>
          </div>

          <div className="operator-replica-search">
            <div className="operator-replica-search-box">
              <SearchOutlined />
              <input
                value={keyword}
                placeholder="请输入姓名/手机号"
                onChange={(event) => setKeyword(event.target.value)}
              />
            </div>

            <button type="button" className="operator-replica-search-button">
              搜索
            </button>
          </div>

          <div className="operator-replica-status-row">
            {orderStatuses.map((status) => (
              <button
                key={status}
                type="button"
                className={`operator-replica-chip ${status === activeStatus ? 'active' : ''}`}
                onClick={() => setActiveStatus(status)}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="operator-replica-order-list">
            {filteredOrders.length ? (
              filteredOrders.map((order) => <OrderCard key={order.id} order={order} />)
            ) : (
              <EmptyState>暂无符合条件的订单</EmptyState>
            )}
          </div>
        </div>
      </PrototypePhone>
    </H5PrototypeShowcase>
  )
}
