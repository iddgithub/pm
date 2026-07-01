import { useEffect, useMemo, useState } from 'react'
import dayjs from 'dayjs'
import {
  CalendarOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
  CloseOutlined,
  DownOutlined,
  FileTextOutlined,
  LeftOutlined,
  PhoneOutlined,
  PictureOutlined,
  SearchOutlined,
  UserOutlined,
} from '@ant-design/icons'
import doctorAvatar from '../assets/doctor-avatar.png'
import emptyRecords from '../assets/empty-records.png'
import './doctorReportingPrototype.css'
import {
  doctorProfile,
  initialReports,
  initialServiceStats,
  initialWithdrawalRecords,
  manageFilters,
  monthOptions,
} from '../mock/reportFlow'

const HOME_VIEW = 'home'
const CONFIRM_VIEW = 'confirm'
const SERVICE_VIEW = 'service'
const WITHDRAW_VIEW = 'withdraw'
const RECORDS_VIEW = 'records'

function formatMoney(value) {
  return Number(value).toFixed(2)
}

function normalizeMoneyInput(value) {
  return value.replace(/[^\d.]/g, '').replace(/(\..*)\./g, '$1')
}

function statusMeta(status) {
  if (status === 'pending') return { label: '待解读', className: 'pending' }
  return { label: '已解读', className: 'done' }
}

function withdrawalStatusMeta(status) {
  if (status === 'processing') return { label: '处理中', className: 'processing', icon: null }
  if (status === 'paid') return { label: '已到账', className: 'paid', icon: <CheckCircleFilled /> }
  return { label: '已驳回', className: 'rejected', icon: <CloseCircleFilled /> }
}

function canSubmitWithdrawal(value, balance) {
  const amount = Number(value)
  return Number.isFinite(amount) && amount > 0 && amount <= balance
}

function PageHeader({ title, back, close, rightSlot }) {
  return (
    <div className="drp-header">
      <button type="button" className="drp-nav-button" onClick={back || close} aria-label="关闭或返回">
        {back ? <LeftOutlined /> : <CloseOutlined />}
      </button>
      <h1>{title}</h1>
      <div className="drp-header-side">{rightSlot}</div>
    </div>
  )
}

function HomeReportCard({ report, onClick }) {
  const meta = statusMeta(report.status)

  return (
    <button type="button" className="drp-report-card" onClick={onClick}>
      <span className={`drp-report-status drp-report-status--${meta.className}`}>{meta.label}</span>
      <div className="drp-report-title">{report.title}</div>
      <div className="drp-report-divider" />
      <div className="drp-report-grid">
        <span>
          <UserOutlined /> {report.patientName}
          <em>{report.age}岁</em>
        </span>
        <span>
          <PhoneOutlined /> {report.phone}
        </span>
        <span>
          <CalendarOutlined /> {report.reportTime}
        </span>
        <span>
          <b>¥</b>
          {report.amount}
        </span>
      </div>
    </button>
  )
}

function WithdrawalRecord({ record }) {
  const meta = withdrawalStatusMeta(record.status)

  return (
    <div className="drp-record-card">
      <div className="drp-record-row drp-record-row--head">
        <div className="drp-record-title">{record.title}</div>
        <div className={`drp-record-badge drp-record-badge--${meta.className}`}>
          {meta.icon}
          <span>{meta.label}</span>
        </div>
        <strong>+{record.amount.toFixed(2)}</strong>
      </div>
      <div className="drp-record-sub">申请时间：{record.requestedAt}</div>
      <div className="drp-record-sub">到账时间：{record.arrivedAt}</div>
    </div>
  )
}

export default function DoctorReportingPrototype() {
  const [view, setView] = useState(HOME_VIEW)
  const [overlay, setOverlay] = useState(null)
  const [toast, setToast] = useState('')
  const [reports, setReports] = useState(initialReports)
  const [selectedReportId, setSelectedReportId] = useState(initialReports[0].id)
  const [manageKeyword, setManageKeyword] = useState('')
  const [manageFilter, setManageFilter] = useState('全部')
  const [serviceStats, setServiceStats] = useState(initialServiceStats)
  const [withdrawDraft, setWithdrawDraft] = useState('')
  const [withdrawalRecords, setWithdrawalRecords] = useState(initialWithdrawalRecords)
  const [recordsMonth, setRecordsMonth] = useState(monthOptions[0])
  const [sheetMonth, setSheetMonth] = useState(monthOptions[0])

  useEffect(() => {
    if (!toast) return undefined
    const timer = window.setTimeout(() => setToast(''), 1800)
    return () => window.clearTimeout(timer)
  }, [toast])

  const selectedReport = useMemo(
    () => reports.find((item) => item.id === selectedReportId) || reports[0],
    [reports, selectedReportId],
  )

  const filteredReports = useMemo(() => {
    return reports.filter((item) => {
      if (manageFilter === '待解读' && item.status !== 'pending') return false
      if (manageFilter === '已解读' && item.status !== 'done') return false
      if (!manageKeyword.trim()) return true
      return [item.title, item.patientName, item.phone].some((value) =>
        String(value).includes(manageKeyword.trim()),
      )
    })
  }, [manageFilter, manageKeyword, reports])

  const recordsForMonth = useMemo(() => {
    if (recordsMonth !== '2026年5月') return []
    return withdrawalRecords
  }, [recordsMonth, withdrawalRecords])

  const confirmInterpretation = () => {
    if (selectedReport.status !== 'pending') {
      setView(HOME_VIEW)
      return
    }

    setReports((current) =>
      current.map((item) => (item.id === selectedReport.id ? { ...item, status: 'done' } : item)),
    )
    setServiceStats((current) => ({
      totalFee: current.totalFee + selectedReport.amount,
      withdrawableBalance: current.withdrawableBalance + selectedReport.amount,
      completedCount: current.completedCount + 1,
    }))
    setManageFilter('全部')
    setToast('报告已确认')
    setView(HOME_VIEW)
  }

  const submitWithdrawal = () => {
    if (!canSubmitWithdrawal(withdrawDraft, serviceStats.withdrawableBalance)) return

    const amount = Number(withdrawDraft)
    const now = dayjs()
    setServiceStats((current) => ({
      ...current,
      withdrawableBalance: Math.max(0, current.withdrawableBalance - amount),
    }))
    setWithdrawalRecords((current) => [
      {
        id: `withdraw-${now.valueOf()}`,
        month: '2026年5月',
        title: '2026年05月提现',
        status: 'processing',
        amount,
        requestedAt: now.format('MM-DD HH:mm:ss'),
        arrivedAt: '预计 1~3 个工作日',
      },
      ...current,
    ])
    setWithdrawDraft('')
    setRecordsMonth('2026年5月')
    setToast('提现申请已提交')
    setView(RECORDS_VIEW)
  }

  return (
    <main className="drp-shell">
      <div className="drp-prototype-shell">
        <div className="drp-phone-canvas">
          <div className="drp-status-bar">
            <div className="drp-status-side">
              <span className="drp-status-dots">●●●</span>
              <span>WeChat</span>
            </div>
            <div className="drp-status-time">1:21 AM</div>
            <div className="drp-status-side drp-status-side--right">
              <span>100%</span>
            </div>
          </div>

          <div className="drp-page-stack">
            <section className={`drp-page ${view === HOME_VIEW ? 'is-active' : ''}`} data-view={HOME_VIEW}>
              <PageHeader title="一脉青藤" close={() => {}} />

              <div className="drp-primary-tabs">
                <button type="button">检查检验</button>
                <button type="button" className="is-active">
                  我的管理
                </button>
              </div>

              <div className="drp-home-screen">
                <div className="drp-screen-pattern" />

                <div className="drp-management-card">
                  <div className="drp-profile">
                    <div className="drp-avatar">
                      <img src={doctorAvatar} alt="医生头像" />
                    </div>
                    <div>
                      <p className="drp-profile-name">{doctorProfile.name}</p>
                      <p className="drp-profile-role">{doctorProfile.role}</p>
                    </div>
                  </div>

                  <button type="button" className="drp-fee-card" onClick={() => setView(SERVICE_VIEW)}>
                    <div className="drp-fee-card-copy">
                      <span>总解读服务费</span>
                      <strong>¥{serviceStats.totalFee}</strong>
                    </div>
                    <i>›</i>
                  </button>
                </div>

                <div className="drp-search-row">
                  <label className="drp-search-box">
                    <SearchOutlined />
                    <input
                      value={manageKeyword}
                      onChange={(event) => setManageKeyword(event.target.value)}
                      placeholder="搜索患者/检查项目"
                    />
                  </label>
                  <button type="button" className="drp-search-button">
                    搜索
                  </button>
                </div>

                <div className="drp-status-filters">
                  {manageFilters.map((filter) => (
                    <button
                      key={filter}
                      type="button"
                      className={`drp-status-chip ${manageFilter === filter ? 'is-active' : ''}`}
                      onClick={() => setManageFilter(filter)}
                    >
                      {filter}
                    </button>
                  ))}
                </div>

                <div className="drp-report-list">
                  {filteredReports.length ? (
                    filteredReports.map((report) => (
                      <HomeReportCard
                        key={report.id}
                        report={report}
                        onClick={() => {
                          setSelectedReportId(report.id)
                          setView(CONFIRM_VIEW)
                        }}
                      />
                    ))
                  ) : (
                    <div className="drp-empty-card">
                      <img src={emptyRecords} alt="暂无数据" />
                      <span>暂无匹配报告</span>
                    </div>
                  )}
                </div>
              </div>
            </section>

            <section className={`drp-page ${view === CONFIRM_VIEW ? 'is-active' : ''}`} data-view={CONFIRM_VIEW}>
              <PageHeader title="确认报告" back={() => setView(HOME_VIEW)} />

              <div className="drp-sub-screen">
                <div className="drp-action-grid">
                  <button type="button" onClick={() => setOverlay('image')}>
                    <PictureOutlined />
                    <span>查看影像</span>
                  </button>
                  <button type="button" onClick={() => setOverlay('report')}>
                    <FileTextOutlined />
                    <span>查看报告</span>
                  </button>
                </div>

                <div className="drp-patient-card">
                  <div>
                    <div className="drp-patient-name">
                      {selectedReport.patientName} <small>{selectedReport.age}岁</small>
                    </div>
                    <div className="drp-patient-sub">检查单号　{selectedReport.examNo}</div>
                    <div className="drp-patient-sub">检查日期　{selectedReport.examTime}</div>
                  </div>
                  <span className="drp-viewer-tag">{selectedReport.viewerTag}</span>
                </div>

                <div className="drp-info-block">
                  <div className="drp-info-line">
                    <span>检查项目：</span>
                    <strong>{selectedReport.examItem}</strong>
                  </div>
                  <div className="drp-info-line">
                    <span>检查机构：</span>
                    <strong>{selectedReport.institution}</strong>
                  </div>
                  <div className="drp-info-line">
                    <span>报告医生：</span>
                    <strong>{selectedReport.reportDoctor}</strong>
                  </div>
                  <div className="drp-info-line">
                    <span>审核医生：</span>
                    <strong>{selectedReport.reviewDoctor}</strong>
                  </div>
                  <div className="drp-info-line">
                    <span>报告日期：</span>
                    <strong>{selectedReport.reportDate}</strong>
                  </div>
                </div>

                <div className="drp-interpret-card">
                  <div className="drp-interpret-head">
                    <div className="drp-interpret-title">
                      <FileTextOutlined />
                      <span>报告解读内容</span>
                    </div>
                    <button type="button">报告解读</button>
                  </div>
                  <p>{selectedReport.interpretation}</p>
                </div>
              </div>

              <div className="drp-bottom-actions">
                <button type="button" className="drp-primary-button" onClick={confirmInterpretation}>
                  确认报告解读内容
                </button>
              </div>
            </section>

            <section className={`drp-page ${view === SERVICE_VIEW ? 'is-active' : ''}`} data-view={SERVICE_VIEW}>
              <PageHeader title="服务费详情" back={() => setView(HOME_VIEW)} />

              <div className="drp-sub-screen">
                <div className="drp-service-card">
                  <div className="drp-service-head">
                    <span>解读服务费</span>
                    <button type="button" onClick={() => setView(RECORDS_VIEW)}>
                      提现记录
                    </button>
                  </div>
                  <strong>¥ {serviceStats.totalFee}</strong>
                  <div className="drp-service-meta">
                    <span>
                      已完成 <b>{serviceStats.completedCount}</b>
                    </span>
                    <span>月份筛选　5月</span>
                  </div>
                  <button type="button" className="drp-primary-button" onClick={() => setView(WITHDRAW_VIEW)}>
                    提现申请
                  </button>
                </div>

                <div className="drp-section-title">已解读报告</div>
                {reports
                  .filter((item) => item.status === 'done')
                  .map((report) => (
                    <div key={report.id} className="drp-report-card drp-report-card--compact">
                      <span className="drp-report-status drp-report-status--done">已解读</span>
                      <div className="drp-report-title">{report.patientName}-{report.title}</div>
                      <div className="drp-report-meta">
                        <span>
                          <UserOutlined /> {report.patientName}
                        </span>
                        <span>{report.age}岁</span>
                        <span>
                          <PhoneOutlined /> {report.phone}
                        </span>
                      </div>
                      <div className="drp-report-meta">
                        <span>
                          <CalendarOutlined /> {report.reportTime}
                        </span>
                        <span>¥{report.amount}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </section>

            <section className={`drp-page ${view === WITHDRAW_VIEW ? 'is-active' : ''}`} data-view={WITHDRAW_VIEW}>
              <PageHeader title="申请提现" back={() => setView(SERVICE_VIEW)} />

              <div className="drp-sub-screen">
                <div className="drp-balance-card">
                  <span>可提现金额（元）</span>
                  <strong>¥ {formatMoney(serviceStats.withdrawableBalance)}</strong>
                </div>

                <div className="drp-form-card">
                  <label className="drp-input-label">提现金额（元）</label>
                  <div className="drp-money-input">
                    <span>¥</span>
                    <input
                      value={withdrawDraft}
                      onChange={(event) => setWithdrawDraft(normalizeMoneyInput(event.target.value))}
                    />
                    <button
                      type="button"
                      className="drp-inline-link"
                      onClick={() => setWithdrawDraft(String(serviceStats.withdrawableBalance))}
                    >
                      全部提现
                    </button>
                  </div>

                  <button
                    type="button"
                    className={`drp-primary-button ${canSubmitWithdrawal(withdrawDraft, serviceStats.withdrawableBalance) ? '' : 'is-disabled'}`}
                    disabled={!canSubmitWithdrawal(withdrawDraft, serviceStats.withdrawableBalance)}
                    onClick={submitWithdrawal}
                  >
                    确定提现
                  </button>
                </div>

                <div className="drp-caption-row">
                  <span>预计到账时间</span>
                  <span>1~3个工作日</span>
                </div>

                <ol className="drp-rule-list">
                  <li>默认提现至微信钱包。</li>
                  <li>提现申请提交后不可撤回。</li>
                  <li>到账时间以微信等钱包处理为准。</li>
                </ol>
              </div>
            </section>

            <section className={`drp-page ${view === RECORDS_VIEW ? 'is-active' : ''}`} data-view={RECORDS_VIEW}>
              <PageHeader title="提现记录" back={() => setView(SERVICE_VIEW)} />

              <div className="drp-sub-screen">
                <div className="drp-month-trigger-row">
                  <button
                    type="button"
                    className="drp-month-trigger"
                    onClick={() => {
                      setSheetMonth(recordsMonth)
                      setOverlay('month-sheet')
                    }}
                  >
                    <span>{recordsMonth}</span>
                    <DownOutlined />
                  </button>
                </div>

                {recordsForMonth.length ? (
                  <div className="drp-record-list">
                    {recordsForMonth.map((record) => (
                      <WithdrawalRecord key={record.id} record={record} />
                    ))}
                  </div>
                ) : (
                  <div className="drp-empty-records drp-empty-records--plain">
                    <div className="drp-empty-records-figure">
                      <img src={emptyRecords} alt="暂无数据" />
                    </div>
                    <span>暂无数据</span>
                  </div>
                )}
              </div>
            </section>
          </div>

          <div
            className={`drp-backdrop ${overlay ? 'is-visible' : ''}`}
            onClick={() => setOverlay(null)}
            aria-hidden="true"
          />

          <section className={`drp-preview-sheet ${overlay === 'image' || overlay === 'report' ? 'is-active' : ''}`}>
            <div className="drp-preview-header">
              <h3>{overlay === 'image' ? '查看影像' : '查看报告'}</h3>
              <button type="button" onClick={() => setOverlay(null)}>
                <CloseOutlined />
              </button>
            </div>

            <div className="drp-preview-content">
              {overlay === 'image' ? (
                <>
                  <div className="drp-preview-image" />
                  <div className="drp-preview-image" />
                </>
              ) : (
                <>
                  <div className="drp-preview-line" />
                  <div className="drp-preview-line drp-preview-line--short" />
                  <div className="drp-preview-line" />
                  <div className="drp-preview-line drp-preview-line--medium" />
                </>
              )}
            </div>
          </section>

          <section className={`drp-bottom-sheet ${overlay === 'month-sheet' ? 'is-active' : ''}`}>
            <div className="drp-sheet-header">
              <h3>选择月份</h3>
              <button type="button" onClick={() => setOverlay(null)}>
                <CloseOutlined />
              </button>
            </div>

            <div className="drp-sheet-options">
              {monthOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`drp-sheet-option ${sheetMonth === option ? 'is-selected' : ''}`}
                  onClick={() => setSheetMonth(option)}
                >
                  {option}
                </button>
              ))}
            </div>

            <div className="drp-sheet-footer">
              <button type="button" className="drp-secondary-button" onClick={() => setOverlay(null)}>
                取消
              </button>
              <button
                type="button"
                className="drp-primary-button"
                onClick={() => {
                  setRecordsMonth(sheetMonth)
                  setOverlay(null)
                }}
              >
                确定
              </button>
            </div>
          </section>

          <div className={`drp-toast ${toast ? 'is-visible' : ''}`}>{toast}</div>
        </div>
      </div>
    </main>
  )
}
