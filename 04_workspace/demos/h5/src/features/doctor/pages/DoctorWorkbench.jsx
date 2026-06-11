import { useState } from 'react'
import {
  EmptyState,
  FilterChip,
  CheckExamPage,
  H5PrototypeShowcase,
  ListCard,
  PrototypePhone,
} from '../../../shared/components/H5PrototypeShowcase'
import {
  doctorCommissionRows,
  doctorMonths,
  doctorOrderRows,
  doctorOverview,
  doctorPatientRows,
} from '../mock/incentive'
import { mockPatients, mockPatientReports, mockPatientTags, mockFollowupTemplates } from '../../patient-management/mock/patientData'

const orderStatuses = ['全部状态', '已支付', '已取消', '已检查', '已出报告']

function includesKeyword(keyword, values) {
  if (!keyword.trim()) return true
  return values.some((value) => String(value).includes(keyword.trim()))
}

function orderStatusTone(status) {
  if (status === '已出报告') return 'success'
  if (status === '已取消') return 'danger'
  if (status === '已检查') return 'info'
  return 'default'
}

function getFollowupStatusText(status) {
  if (status === 'pending') return '待随访'
  if (status === 'overdue') return '已逾期'
  if (status === 'completed') return '已完成'
  return '待随访'
}

function getFollowupStatusTone(status) {
  if (status === 'pending') return 'warning'
  if (status === 'overdue') return 'danger'
  if (status === 'completed') return 'success'
  return 'warning'
}

function getTagClass(tag) {
  if (tag === '新患者') return 'new'
  if (tag === '术后随访') return 'post-op'
  if (tag === '常规随访') return 'followup'
  if (tag === '重点关注') return 'attention'
  return 'chronic'
}

export default function DoctorWorkbench() {
  const [primaryTab, setPrimaryTab] = useState('检查检验')
  const [manageMonth, setManageMonth] = useState('全部月份')
  const [manageKeyword, setManageKeyword] = useState('')
  const [manageStatus, setManageStatus] = useState('全部状态')
  const [commissionMonth, setCommissionMonth] = useState('4月')
  const [commissionKeyword, setCommissionKeyword] = useState('')
  const [patientKeyword, setPatientKeyword] = useState('')
  const [pmKeyword, setPmKeyword] = useState('')
  const [pmFilter, setPmFilter] = useState('全部')
  const [pmDateRange, setPmDateRange] = useState('')
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [showFollowupModal, setShowFollowupModal] = useState(false)
  const [followupQuestions, setFollowupQuestions] = useState([''])
  const [followupDate, setFollowupDate] = useState('')

  const filteredOrders = doctorOrderRows.filter((item) => {
    if (manageMonth !== '全部月份' && item.month !== manageMonth) return false
    if (manageStatus !== '全部状态' && item.status !== manageStatus) return false
    return includesKeyword(manageKeyword, [item.patientName, item.phone])
  })

  const filteredCommissionRows = doctorCommissionRows.filter((item) => {
    if (commissionMonth !== '全部月份' && item.month !== commissionMonth) return false
    return includesKeyword(commissionKeyword, [item.patientName, item.phone, item.projectName])
  })

  const filteredPatients = doctorPatientRows.filter((item) =>
    includesKeyword(patientKeyword, [item.patientName, item.phone]),
  )

  const filteredPatientList = mockPatients.filter((item) => {
    if (!includesKeyword(pmKeyword, [item.name, item.phone])) return false
    if (pmFilter === '待随访' && item.followupStatus !== 'pending') return false
    if (pmFilter === '已逾期' && item.followupStatus !== 'overdue') return false
    if (pmFilter === '已完成' && item.followupStatus !== 'completed') return false
    return true
  })

  const handleAddFollowup = (patient) => {
    setSelectedPatient(patient)
    setFollowupQuestions([''])
    setFollowupDate('')
    setShowFollowupModal(true)
  }

  const handleSaveFollowup = () => {
    alert(`随访提醒已设置！将在 ${followupDate} 向 ${selectedPatient.name} 发送微信模板消息。`)
    setShowFollowupModal(false)
  }

  const handleViewReports = (patient) => {
    setSelectedPatient(patient)
  }

  const renderPatientManagement = () => (
    <>
      <div className="pm-content">
        <div className="pm-search-section">
          <div className="pm-search-bar">
            <div className="pm-search-input-wrapper">
              <span className="pm-search-icon">🔍</span>
              <input
                className="pm-search-input"
                placeholder="搜索患者姓名/手机号"
                value={pmKeyword}
                onChange={(e) => setPmKeyword(e.target.value)}
              />
            </div>
            <button className="pm-search-btn">搜索</button>
          </div>
          <div className="pm-filter-bar">
            {['全部', '待随访', '已逾期', '已完成'].map((filter) => (
              <button
                key={filter}
                className={`pm-filter-tag ${pmFilter === filter ? 'active' : ''}`}
                onClick={() => setPmFilter(filter)}
              >
                {filter}
              </button>
            ))}
            <button className="pm-date-filter" onClick={() => alert('日期筛选器')}>
              📅 时间筛选
            </button>
          </div>
        </div>

        <div className="pm-list">
          {filteredPatientList.length ? (
            filteredPatientList.map((patient) => (
              <div
                key={patient.id}
                className="pm-patient-card"
                onClick={() => handleViewReports(patient)}
              >
                <div className="pm-patient-header">
                  <div className="pm-patient-info">
                    <h3 className="pm-patient-name">{patient.name}</h3>
                    <div className="pm-patient-meta">
                      <span>👤 {patient.gender} · {patient.age}岁</span>
                      <span>📞 {patient.phone}</span>
                    </div>
                  </div>
                  <span className={`pm-followup-badge ${patient.followupStatus}`}>
                    {getFollowupStatusText(patient.followupStatus)}
                  </span>
                </div>
                <div className="pm-tags">
                  {patient.tags.map((tag, idx) => (
                    <span key={idx} className={`pm-tag ${getTagClass(tag)}`}>
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="pm-patient-footer">
                  <div className="pm-patient-stats">
                    <span className="pm-stat-item">📄 {patient.reportCount} 份报告</span>
                    <span className="pm-stat-item">📅 下次随访: {patient.nextFollowupDate}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <EmptyState>暂无符合条件的患者</EmptyState>
          )}
        </div>
      </div>

      {showFollowupModal && selectedPatient && (
        <>
          <div className="pm-overlay" onClick={() => setShowFollowupModal(false)} />
          <div className="pm-followup-modal">
            <button className="pm-modal-close" onClick={() => setShowFollowupModal(false)}>
              ✕
            </button>
            <h3 className="pm-modal-title">为 {selectedPatient.name} 设置随访</h3>
            
            <div className="pm-form-group">
              <label className="pm-form-label">随访时间</label>
              <input
                type="date"
                className="pm-form-input"
                value={followupDate}
                onChange={(e) => setFollowupDate(e.target.value)}
              />
            </div>

            <div className="pm-form-group">
              <label className="pm-form-label">随访问题</label>
              {followupQuestions.map((question, idx) => (
                <div key={idx} className="pm-question-item">
                  <input
                    type="text"
                    className="pm-question-input"
                    placeholder="输入问题..."
                    value={question}
                    onChange={(e) => {
                      const newQuestions = [...followupQuestions]
                      newQuestions[idx] = e.target.value
                      setFollowupQuestions(newQuestions)
                    }}
                  />
                  {followupQuestions.length > 1 && (
                    <button
                      className="pm-question-remove"
                      onClick={() => {
                        setFollowupQuestions(followupQuestions.filter((_, i) => i !== idx))
                      }}
                    >
                      −
                    </button>
                  )}
                </div>
              ))}
              <button
                className="pm-add-question"
                onClick={() => setFollowupQuestions([...followupQuestions, ''])}
              >
                + 添加问题
              </button>
            </div>

            <div className="pm-form-group">
              <label className="pm-form-label">选择随访模板</label>
              <select
                className="pm-form-input"
                onChange={(e) => {
                  const template = mockFollowupTemplates.find(t => t.id === e.target.value)
                  if (template) {
                    setFollowupQuestions([...template.questions])
                  }
                }}
              >
                <option value="">-- 选择模板 --</option>
                {mockFollowupTemplates.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>

            <div className="pm-modal-actions">
              <button className="pm-modal-btn cancel" onClick={() => setShowFollowupModal(false)}>
                取消
              </button>
              <button className="pm-modal-btn confirm" onClick={handleSaveFollowup}>
                保存并发送提醒
              </button>
            </div>
          </div>
        </>
      )}
    </>
  )

  const renderPatientReports = () => {
    const reports = mockPatientReports[selectedPatient?.id] || []
    
    return (
      <>
        <div className="pm-detail-header">
          <div className="pm-detail-info">
            <div className="pm-detail-avatar">
              {selectedPatient?.name?.charAt(0)}
            </div>
            <div className="pm-detail-basic">
              <h2 className="pm-detail-name">{selectedPatient?.name}</h2>
              <p className="pm-detail-desc">
                {selectedPatient?.gender} · {selectedPatient?.age}岁 · {selectedPatient?.phone}
              </p>
              <div className="pm-tags">
                {selectedPatient?.tags.map((tag, idx) => (
                  <span key={idx} className={`pm-tag ${getTagClass(tag)}`}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="pm-detail-actions">
            <button
              className="pm-action-btn secondary"
              onClick={() => handleAddFollowup(selectedPatient)}
            >
              📋 随访
            </button>
            <button
              className="pm-action-btn primary"
              onClick={() => setSelectedPatient(null)}
            >
              返回列表
            </button>
          </div>
        </div>

        <div className="pm-report-list">
          <div className="proto-section-title">影像报告历史 ({reports.length}份)</div>
          
          {reports.length ? (
            reports.map((report) => (
              <div key={report.id} className="pm-report-card">
                <div className="pm-report-header">
                  <div>
                    <h4 className="pm-report-title">{report.title}</h4>
                    <div className="pm-report-meta">
                      <span>📋 {report.reportNo}</span>
                      <span>📅 {report.examDate}</span>
                      <span>🏥 {report.institution}</span>
                    </div>
                  </div>
                  <span className="pm-report-type-tag">{report.examType}</span>
                </div>

                <div className="pm-report-content">
                  <div className="pm-report-section">
                    <h5 className="pm-section-title">
                      <span>📝</span> 影像学表现
                    </h5>
                    <p className="pm-section-text">{report.findings}</p>
                  </div>
                  
                  <div className="pm-report-section">
                    <h5 className="pm-section-title">
                      <span>💡</span> 影像学诊断
                    </h5>
                    <p className="pm-section-text">{report.diagnosis}</p>
                  </div>

                  {report.hasImage && (
                    <div className="pm-report-viewer">
                      <button className="pm-viewer-btn">
                        📷 查看影像
                      </button>
                      <button className="pm-viewer-btn">
                        📄 查看报告
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <EmptyState>暂无报告</EmptyState>
          )}
        </div>
      </>
    )
  }

  return (
    <H5PrototypeShowcase
      roleTitle="医生端"
      roleSummary="围绕签约申请、业务开单、报告解读费与患者维护，把一级页面统一整理成和磨刀原型更一致的浏览器展示稿。"
      flowSteps={['申请签约', '平台审核并绑定运营', '患者完成检查并出报告', '医生查看收益与患者维护']}
    >
      <PrototypePhone
        label={selectedPatient ? `${selectedPatient.name} - 报告详情` : primaryTab}
        tabs={['检查检验', '我的任务', '患者管理']}
        activeTab={primaryTab}
        onTabChange={(tab) => {
          setPrimaryTab(tab)
          setSelectedPatient(null)
        }}
        showTabs={!selectedPatient}
      >
        {selectedPatient ? (
          <div className="pm-detail-page">
            {renderPatientReports()}
          </div>
        ) : primaryTab === '检查检验' ? (
          <CheckExamPage ownerName={doctorOverview.doctorName} />
        ) : primaryTab === '我的任务' ? (
          <>
            <div className="proto-profile-card">
              <div className="proto-avatar" aria-hidden="true" />
              <div className="proto-profile-copy">
                <div className="proto-profile-name">{doctorOverview.doctorName}</div>
                <div className="proto-tag-row">
                  <span className="proto-tag">{doctorOverview.clinicName}</span>
                  <span className="proto-tag">{doctorOverview.department}</span>
                  <span className="proto-tag proto-tag--accent">{doctorOverview.signStatus}</span>
                </div>
                <div className="proto-note">{doctorOverview.signNote}</div>
                <div className="proto-inline-actions">
                  <button type="button" className="proto-link-button">签约申请</button>
                  <button type="button" className="proto-link-button">提现记录</button>
                </div>
              </div>
            </div>

            <div className="proto-stat-card">
              <div className="proto-stat-item">
                <div className="proto-stat-value">{doctorOverview.reportFee}元</div>
                <div className="proto-stat-caption">报告解读费 &gt;</div>
              </div>
              <div className="proto-stat-item">
                <div className="proto-stat-value">{doctorOverview.patientCount}人</div>
                <div className="proto-stat-caption">我的患者 &gt;</div>
              </div>
            </div>

            <div className="proto-toolbar">
              <select
                className="proto-select"
                value={manageMonth}
                onChange={(event) => setManageMonth(event.target.value)}
              >
                {doctorMonths.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>

              <input
                className="proto-input"
                value={manageKeyword}
                placeholder="请输入姓名/手机号"
                onChange={(event) => setManageKeyword(event.target.value)}
              />

              <button type="button" className="proto-search-button">
                查询
              </button>
            </div>

            <div className="proto-chip-row">
              {orderStatuses.map((status) => (
                <FilterChip
                  key={status}
                  active={status === manageStatus}
                  onClick={() => setManageStatus(status)}
                >
                  {status}
                </FilterChip>
              ))}
            </div>

            <div className="proto-stack-list">
              {filteredOrders.length ? (
                filteredOrders.map((item) => (
                  <ListCard
                    key={item.id}
                    eyebrow={`${item.month} · 检查检验订单`}
                    title={item.patientName}
                    status={item.status}
                    statusTone={orderStatusTone(item.status)}
                    amount={`￥${item.amount}.00`}
                    amountLabel="订单金额"
                    meta={[
                      { label: '手机号', value: item.phone },
                      { label: '项目数', value: `${item.itemCount} 项` },
                    ]}
                    metrics={[
                      { label: '结算口径', value: item.status === '已出报告' ? '可确认' : '待流转' },
                      { label: '操作', value: '查看详情' },
                    ]}
                    actions={[{ label: '详情', variant: 'primary' }]}
                  />
                ))
              ) : (
                <EmptyState>暂无符合条件的订单</EmptyState>
              )}
            </div>
          </>
        ) : (
          <div className="patient-management-page">
            <div className="pm-header">
              <div className="pm-header-top">
                <button className="pm-back-btn">←</button>
                <h1 className="pm-title">患者管理</h1>
                <div style={{ width: 36 }} />
              </div>
            </div>
            {renderPatientManagement()}
          </div>
        )}
      </PrototypePhone>

      <PrototypePhone label="医生报告解读费">
        <div className="proto-section-head">
          <div className="proto-section-title">报告解读费： ￥{doctorOverview.reportFee}.00</div>
          <button type="button" className="proto-primary-button">提现</button>
        </div>

        <div className="proto-toolbar">
          <select
            className="proto-select"
            value={commissionMonth}
            onChange={(event) => setCommissionMonth(event.target.value)}
          >
            {doctorMonths.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>

          <input
            className="proto-input"
            value={commissionKeyword}
            placeholder="请输入姓名/手机号"
            onChange={(event) => setCommissionKeyword(event.target.value)}
          />

          <button type="button" className="proto-search-button">
            查询
          </button>
        </div>

        <div className="proto-stack-list">
          {filteredCommissionRows.length ? (
            filteredCommissionRows.map((item) => (
              <ListCard
                key={item.id}
                eyebrow={`订单号 ${item.orderNo}`}
                title={item.projectName}
                status="已确认"
                statusTone="success"
                amount={`+ ￥${item.bonus}`}
                amountLabel="解读费"
                meta={[
                  { label: '患者', value: item.patientName },
                  { label: '手机号', value: item.phone },
                  { label: '项目金额', value: `￥${item.projectAmount}.00` },
                  { label: '结算时间', value: item.settledAt },
                ]}
                actions={[
                  { label: '订单详情' },
                  { label: '患者详情', variant: 'primary' },
                ]}
              />
            ))
          ) : (
            <EmptyState>暂无符合条件的解读费记录</EmptyState>
          )}
        </div>
      </PrototypePhone>

      <PrototypePhone label="我的患者">
        <div className="proto-section-title">我的患者： {doctorOverview.patientCount}名</div>

        <div className="proto-toolbar proto-toolbar--single">
          <input
            className="proto-input"
            value={patientKeyword}
            placeholder="请输入姓名/手机号"
            onChange={(event) => setPatientKeyword(event.target.value)}
          />

          <button type="button" className="proto-search-button">
            查询
          </button>
        </div>

        <div className="proto-stack-list">
          {filteredPatients.length ? (
            filteredPatients.map((item) => (
              <ListCard
                key={item.id}
                eyebrow={`出报告时间 ${item.reportTime}`}
                title={item.patientName}
                status={item.followStatus}
                statusTone={item.followStatus === '已随访' ? 'success' : 'info'}
                meta={[
                  { label: '手机号', value: item.phone },
                  { label: '检查项目', value: item.projectName },
                ]}
                actions={[
                  { label: '添加随访', variant: item.followStatus === '待随访' ? 'primary' : undefined },
                  { label: '复查提醒' },
                ]}
              >
                <div className="proto-card-note">{item.history}</div>
              </ListCard>
            ))
          ) : (
            <EmptyState>暂无符合条件的患者</EmptyState>
          )}
        </div>
      </PrototypePhone>
    </H5PrototypeShowcase>
  )
}
