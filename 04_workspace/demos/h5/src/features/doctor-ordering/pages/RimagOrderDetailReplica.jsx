import { useMemo, useRef, useState } from 'react'
import {
  CheckCircleFilled,
  CloseOutlined,
  EllipsisOutlined,
  EnvironmentOutlined,
  LeftOutlined,
  MoreOutlined,
  PhoneOutlined,
  PlusCircleOutlined,
  RightOutlined,
  SignalFilled,
  WifiOutlined,
} from '@ant-design/icons'
import logoCard from '../assets/rimag-order-detail/rimag-logo-card.jpg'
import ctBackground from '../assets/rimag-order-detail/rimag-ct-background.png'
import '../styles/rimagOrderDetail.css'

const projects = [
  {
    id: 'plain',
    title: '鞍区CT平扫',
    price: 196,
    alias: '* CT鞍区(平扫)',
  },
  {
    id: 'enhanced',
    title: '鞍区CT增强',
    price: 794,
    alias: '* CT鞍区(增强)',
  },
]

const timeSlots = ['08:30-09:00', '09:00-09:30', '10:00-10:30', '14:00-14:30']

function formatMoney(value) {
  return `￥ ${value.toFixed(2)}`
}

function Toast({ message }) {
  if (!message) return null
  return <div className="rimag-toast">{message}</div>
}

export default function RimagOrderDetailReplica() {
  const [expanded, setExpanded] = useState(false)
  const [patient, setPatient] = useState(null)
  const [patientSheetOpen, setPatientSheetOpen] = useState(false)
  const [activeTimeProject, setActiveTimeProject] = useState(null)
  const [times, setTimes] = useState({})
  const [toast, setToast] = useState('')
  const [paid, setPaid] = useState(false)
  const toastTimerRef = useRef(null)

  const total = useMemo(() => projects.reduce((sum, project) => sum + project.price, 0), [])
  const allTimesSelected = projects.every((project) => times[project.id])

  function showToast(message) {
    setToast(message)
    window.clearTimeout(toastTimerRef.current)
    toastTimerRef.current = window.setTimeout(() => setToast(''), 1600)
  }

  function handlePay() {
    if (!patient) {
      showToast('请先添加就诊人')
      return
    }
    if (!allTimesSelected) {
      showToast('请选择预约受检时间')
      return
    }
    setPaid(true)
    showToast('订单支付成功')
  }

  return (
    <main className="rimag-order-stage">
      <section className="rimag-order-device">
        <div className="rimag-hero">
          <img className="rimag-hero__bg" src={ctBackground} alt="" aria-hidden="true" />
          <div className="rimag-status">
            <span>16:10</span>
            <span className="rimag-status__icons">
              <SignalFilled />
              <WifiOutlined />
              <span className="rimag-battery">96</span>
            </span>
          </div>

          <header className="rimag-nav">
            <button type="button" className="rimag-icon-button rimag-icon-button--plain" aria-label="返回" onClick={() => showToast('返回上一页')}>
              <LeftOutlined />
            </button>
            <h1>订单详情</h1>
            <div className="rimag-mini-capsule" aria-label="小程序菜单">
              <EllipsisOutlined />
              <span />
              <MoreOutlined />
            </div>
          </header>

          <section className="rimag-institution">
            <img className="rimag-institution__logo" src={logoCard} alt="RIMAG 一脉阳光" />
            <div className="rimag-institution__main">
              <strong>南昌一脉阳光医学诊断中心</strong>
              <div className="rimag-tags">
                <span className="rimag-tag rimag-tag--solid">一级医疗机构</span>
                <span className="rimag-tag rimag-tag--soft">影像中心</span>
              </div>
            </div>
          </section>
        </div>

        <div className="rimag-content">
          <section className="rimag-card rimag-summary-card">
            <p>
              南昌一脉阳光医学影像诊断中心作为一脉阳光影像医院集团布局在江西的省会级旗舰中心。引入一脉阳光影像集团自主研发的“一脉云”服务，
              {expanded ? '覆盖影像数据存储、远程诊断、质量控制与智能排班等能力，为患者提供标准化影像检查服务。' : '充分解决了影像数据从存储到'}
            </p>
            <button type="button" className="rimag-text-link" onClick={() => setExpanded((value) => !value)}>
              {expanded ? '收起' : '查看更多'}
            </button>
            <div className="rimag-address-row">
              <div>
                <strong>249.51km</strong>
                <span>南昌市西湖区抚生路858号嘉佑健康城F...</span>
              </div>
              <button type="button" onClick={() => showToast('已打开导航')}>
                <EnvironmentOutlined />
                <span>导航</span>
              </button>
              <button type="button" onClick={() => showToast('正在呼叫影像中心')}>
                <PhoneOutlined />
                <span>致电</span>
              </button>
            </div>
          </section>

          <section className="rimag-card rimag-date-card">
            <strong>当前预约日期： 2026年07月08号</strong>
          </section>

          <section className="rimag-card rimag-patient-card">
            <span>就诊人:</span>
            <button type="button" onClick={() => setPatientSheetOpen(true)}>
              <PlusCircleOutlined />
              <span>{patient ? `${patient.name} ${patient.phone}` : '添加就诊人'}</span>
            </button>
          </section>

          <section className="rimag-fee-card">
            <header>检查费用</header>
            <div className="rimag-fee-list">
              {projects.map((project, index) => (
                <article key={project.id} className="rimag-project">
                  <div className="rimag-project__title-row">
                    <strong>{project.title}</strong>
                    <span>{formatMoney(project.price)}</span>
                  </div>
                  <div className="rimag-project__alias">原医嘱名： {project.alias}</div>
                  <button type="button" className="rimag-time-row" onClick={() => setActiveTimeProject(project)}>
                    <span>
                      <b>*</b> 预约受检时间
                    </span>
                    <span className={times[project.id] ? 'is-selected' : ''}>
                      {times[project.id] ?? '请选择时间'} <RightOutlined />
                    </span>
                  </button>
                  {index < projects.length - 1 ? <div className="rimag-project__divider" /> : null}
                </article>
              ))}
            </div>
          </section>

          <section className="rimag-card rimag-total-card">
            <div>
              <strong>检查费用</strong>
              <span>{formatMoney(total)}</span>
            </div>
            <div>
              <strong>总金额</strong>
              <span className="is-red">{formatMoney(total)}</span>
            </div>
          </section>
        </div>

        <footer className="rimag-paybar">
          <button type="button" className={paid ? 'is-paid' : ''} onClick={handlePay}>
            {paid ? (
              <>
                <CheckCircleFilled />
                已支付
              </>
            ) : (
              '支付订单'
            )}
          </button>
        </footer>

        {patientSheetOpen ? (
          <div className="rimag-sheet-backdrop" onClick={() => setPatientSheetOpen(false)}>
            <section className="rimag-sheet" onClick={(event) => event.stopPropagation()}>
              <header>
                <strong>选择就诊人</strong>
                <button type="button" aria-label="关闭" onClick={() => setPatientSheetOpen(false)}>
                  <CloseOutlined />
                </button>
              </header>
              <button
                type="button"
                className="rimag-patient-option"
                onClick={() => {
                  setPatient({ name: '陈女士', phone: '138****7098' })
                  setPatientSheetOpen(false)
                  showToast('已添加就诊人')
                }}
              >
                <span>
                  <strong>陈女士</strong>
                  <small>身份证 3601**********2048</small>
                </span>
                <CheckCircleFilled />
              </button>
            </section>
          </div>
        ) : null}

        {activeTimeProject ? (
          <div className="rimag-sheet-backdrop" onClick={() => setActiveTimeProject(null)}>
            <section className="rimag-sheet rimag-sheet--time" onClick={(event) => event.stopPropagation()}>
              <header>
                <strong>{activeTimeProject.title}</strong>
                <button type="button" aria-label="关闭" onClick={() => setActiveTimeProject(null)}>
                  <CloseOutlined />
                </button>
              </header>
              <div className="rimag-slot-grid">
                {timeSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    className={times[activeTimeProject.id] === slot ? 'is-active' : ''}
                    onClick={() => {
                      setTimes((current) => ({ ...current, [activeTimeProject.id]: slot }))
                      setActiveTimeProject(null)
                      showToast('已选择受检时间')
                    }}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </section>
          </div>
        ) : null}

        <Toast message={toast} />
      </section>
    </main>
  )
}
