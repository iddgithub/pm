import { useEffect, useMemo, useState } from 'react'
import '../styles/doctorOrdering.css'
import {
  aiPromptChips,
  aiRecommendationCards,
  calendarMonths,
  defaultOrderNo,
  detailDescription,
  detailStatusMeta,
  homeOrders,
  institutionDateCards,
  institutionFilters,
  institutions,
  mineOrders,
  modalityTabs,
  patientRelationOptions,
  projectCatalog,
  projectGroups,
  quickDateOptions,
  searchHistorySeed,
  sharedPatientOrderSeed,
  timeSlotGroups,
} from '../mock/orderFlow'

function cx(...items) {
  return items.filter(Boolean).join(' ')
}

function formatAmount(value) {
  return `¥${value.toFixed(2)}`
}

function normalizeDateLabel(value) {
  return value.replace(/号/g, '日')
}

function AppHeader({ title, backType = 'back', right = 'dots', subtitle, onBack }) {
  return (
    <header className="doctor-h5-header">
      <button type="button" className="doctor-h5-header__action" onClick={onBack} aria-label="返回">
        {backType === 'close' ? '×' : '‹'}
      </button>
      <div className="doctor-h5-header__title-group">
        <div className="doctor-h5-header__title">{title}</div>
        {subtitle ? <div className="doctor-h5-header__subtitle">{subtitle}</div> : null}
      </div>
      <div className="doctor-h5-header__action doctor-h5-header__action--right" aria-hidden="true">
        {right === 'dots' ? '···' : right === 'search' ? '⌕' : ''}
      </div>
    </header>
  )
}

function BottomTabBar({ activeTab, onTabChange }) {
  const tabs = [
    { key: 'ai', label: '青藤AI', icon: '⌘' },
    { key: 'check', label: '检查', icon: '⚕' },
    { key: 'mine', label: '我的', icon: '◌' },
  ]

  return (
    <nav className="doctor-h5-tabbar">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          className={cx('doctor-h5-tabbar__item', activeTab === tab.key && 'is-active')}
          onClick={() => onTabChange(tab.key)}
        >
          <span className="doctor-h5-tabbar__icon">{tab.icon}</span>
          <span>{tab.label}</span>
        </button>
      ))}
    </nav>
  )
}

function Toast({ message }) {
  if (!message) return null

  return <div className="doctor-h5-toast">{message}</div>
}

function Modal({ title = '提示', children, actions }) {
  return (
    <div className="doctor-h5-overlay">
      <div className="doctor-h5-modal">
        <div className="doctor-h5-modal__title">{title}</div>
        <div className="doctor-h5-modal__content">{children}</div>
        <div className={cx('doctor-h5-modal__actions', actions.length === 1 && 'is-single')}>
          {actions.map((action) => (
            <button
              key={action.label}
              type="button"
              className={cx('doctor-h5-modal__button', action.emphasis && 'is-emphasis')}
              onClick={action.onClick}
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function ProjectBadge({ item }) {
  return (
    <div className="doctor-h5-project-pill">
      <span className="doctor-h5-project-pill__icon">◔</span>
      <span>{item.name}</span>
      <button type="button" className="doctor-h5-project-pill__remove" onClick={item.onRemove} aria-label="删除">
        －
      </button>
    </div>
  )
}

function SearchEmpty({ type = 'magnifier' }) {
  return (
    <div className="doctor-h5-empty">
      <div className={cx('doctor-h5-empty__illustration', type === 'box' && 'is-box')} />
      <div className="doctor-h5-empty__text">{type === 'box' ? '暂无数据' : ''}</div>
    </div>
  )
}

function PhoneShell({ children }) {
  return (
    <div className="doctor-h5-shell">
      <div className="doctor-h5-device">{children}</div>
    </div>
  )
}

function DoctorOrderingReplica({
  entryMode = 'doctor',
  shareToken = sharedPatientOrderSeed.shareToken,
  initialStatus = sharedPatientOrderSeed.status,
}) {
  const isPatientEntry = entryMode === 'patient'
  const initialProjectIds = isPatientEntry
    ? sharedPatientOrderSeed.projectIds
    : ['brain-ct-plain-1', 'brain-ct-plain-2']
  const [screenStack, setScreenStack] = useState(() =>
    isPatientEntry ? [{ name: 'patientOrder', payload: { status: initialStatus } }] : [{ name: 'orderForm' }],
  )
  const [activeTab, setActiveTab] = useState('check')
  const [toastMessage, setToastMessage] = useState('')

  const [symptomText, setSymptomText] = useState('')
  const [diagnosisText, setDiagnosisText] = useState('')
  const [quickDate, setQuickDate] = useState('明天')
  const [appointmentDate, setAppointmentDate] = useState(
    isPatientEntry ? sharedPatientOrderSeed.appointmentDate : '2026年2月7号',
  )
  const [appointmentHint, setAppointmentHint] = useState(
    isPatientEntry ? sharedPatientOrderSeed.appointmentHint : '今天',
  )

  const [selectedProjectIds, setSelectedProjectIds] = useState(initialProjectIds)
  const [draftProjectIds, setDraftProjectIds] = useState([])
  const [pickerModality, setPickerModality] = useState('CT')
  const [pickerGroup, setPickerGroup] = useState('头部')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchSubmitted, setSearchSubmitted] = useState(false)
  const [searchHistory, setSearchHistory] = useState(searchHistorySeed)

  const [selectedInstitutionId, setSelectedInstitutionId] = useState(
    isPatientEntry ? sharedPatientOrderSeed.institutionId : institutions[0].id,
  )
  const [selectedInstitutionDateKey, setSelectedInstitutionDateKey] = useState('today')
  const [activeFilters, setActiveFilters] = useState({
    距离最近: false,
    只看三甲: false,
    只看公立: false,
  })

  const [showShareGuide, setShowShareGuide] = useState(false)
  const [showQrModal, setShowQrModal] = useState(false)
  const [qrCountdown, setQrCountdown] = useState(60)
  const [qrExpired, setQrExpired] = useState(false)

  const [patientInfo, setPatientInfo] = useState(null)
  const [patientDraft, setPatientDraft] = useState({
    relation: patientRelationOptions[0],
    name: '',
    idType: '身份证',
    idNo: '',
    phone: '',
  })
  const [showPatientLockedModal, setShowPatientLockedModal] = useState(false)
  const [showReadonlyModal, setShowReadonlyModal] = useState(false)

  const [projectTimes, setProjectTimes] = useState(
    isPatientEntry ? sharedPatientOrderSeed.projectTimes : {},
  )
  const [timePickerProjectId, setTimePickerProjectId] = useState('')
  const [timeDraft, setTimeDraft] = useState('')
  const [agreementChecked, setAgreementChecked] = useState(false)

  const [liveOrderStatus, setLiveOrderStatus] = useState('pending')
  const [paymentDetailStatus, setPaymentDetailStatus] = useState('paid')

  const currentScreen = screenStack[screenStack.length - 1]
  const selectedProjects = useMemo(
    () => projectCatalog.filter((project) => selectedProjectIds.includes(project.id)),
    [selectedProjectIds],
  )
  const draftProjects = useMemo(
    () => projectCatalog.filter((project) => draftProjectIds.includes(project.id)),
    [draftProjectIds],
  )
  const selectedInstitution = useMemo(
    () => institutions.find((institution) => institution.id === selectedInstitutionId) ?? institutions[0],
    [selectedInstitutionId],
  )
  const currentTotal = useMemo(
    () => selectedProjects.reduce((sum, project) => sum + project.price, 0),
    [selectedProjects],
  )
  const visiblePickerProjects = useMemo(
    () =>
      projectCatalog
        .filter((project) => project.modality === pickerModality && (pickerGroup === '全部部位' || project.group === pickerGroup))
        .sort((left, right) => right.score - left.score),
    [pickerGroup, pickerModality],
  )
  const searchResults = useMemo(() => {
    const keyword = searchQuery.trim()
    if (!keyword) return []

    return projectCatalog.filter((project) =>
      [project.name, project.group, ...project.keywords].some((value) => value.includes(keyword)),
    )
  }, [searchQuery])
  const canSubmitPatient = patientDraft.name && patientDraft.idNo && patientDraft.phone
  const normalizedAppointmentDate = useMemo(() => normalizeDateLabel(appointmentDate), [appointmentDate])
  const appointmentDateForDisplay = useMemo(
    () => normalizedAppointmentDate.replace(/日$/, '号'),
    [normalizedAppointmentDate],
  )

  useEffect(() => {
    if (!toastMessage) return undefined
    const timer = window.setTimeout(() => setToastMessage(''), 1600)
    return () => window.clearTimeout(timer)
  }, [toastMessage])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
    window.requestAnimationFrame(() => {
      const page = document.querySelector('.doctor-h5-page')
      if (page) {
        page.scrollTo({ top: 0, behavior: 'auto' })
      }
    })
  }, [currentScreen.name])

  useEffect(() => {
    if (!showQrModal || qrExpired) return undefined
    if (qrCountdown <= 0) {
      setQrExpired(true)
      return undefined
    }

    const timer = window.setTimeout(() => setQrCountdown((value) => value - 1), 1000)
    return () => window.clearTimeout(timer)
  }, [qrCountdown, qrExpired, showQrModal])

  function pushScreen(name, payload = {}) {
    setScreenStack((current) => [...current, { name, payload }])
  }

  function replaceScreen(name, payload = {}) {
    setScreenStack((current) => [...current.slice(0, -1), { name, payload }])
  }

  function resetToScreen(name, payload = {}) {
    setScreenStack([{ name, payload }])
  }

  function goBack() {
    setScreenStack((current) => (current.length > 1 ? current.slice(0, -1) : current))
  }

  function showToast(message) {
    setToastMessage(message)
  }

  function openManualPicker() {
    setDraftProjectIds(selectedProjectIds)
    setPickerModality('CT')
    setPickerGroup('头部')
    pushScreen('manualPicker')
  }

  function openSearchScreen() {
    setSearchQuery('')
    setSearchSubmitted(false)
    pushScreen('search')
  }

  function toggleDraftProject(projectId) {
    setDraftProjectIds((current) =>
      current.includes(projectId) ? current.filter((item) => item !== projectId) : [...current, projectId],
    )
  }

  function confirmDraftProjects() {
    setSelectedProjectIds(draftProjectIds)
    goBack()
  }

  function runSearch(keyword = searchQuery) {
    const value = keyword.trim()
    setSearchQuery(value)
    setSearchSubmitted(true)
    if (value) {
      setSearchHistory((current) => [value, ...current.filter((item) => item !== value)].slice(0, 4))
    }
  }

  function chooseCalendarDate(day) {
    if (day.includes('17')) {
      setAppointmentDate('2025年12月17日')
      setAppointmentHint('周三')
    } else if (day.includes('18')) {
      setAppointmentDate('2025年12月18日')
      setAppointmentHint('周四')
    } else {
      setAppointmentDate('2025年12月15日')
      setAppointmentHint('明天')
    }
    goBack()
  }

  function queryInstitution() {
    if (!selectedProjectIds.length) {
      showToast('请先添加检查项目')
      return
    }
    pushScreen('institutionList')
  }

  function openInstitutionDetail(institutionId) {
    setSelectedInstitutionId(institutionId)
    pushScreen('doctorShare')
  }

  function openQrModal() {
    setQrCountdown(60)
    setQrExpired(false)
    setShowQrModal(true)
  }

  function refreshQr() {
    setQrCountdown(60)
    setQrExpired(false)
  }

  function confirmShareGuide() {
    setShowShareGuide(false)
    ensureProjectTimes(selectedProjectIds)
    pushScreen('patientOrder', { status: 'pending' })
  }

  function ensureProjectTimes(projectIds) {
    setProjectTimes((current) => {
      const next = { ...current }
      projectIds.forEach((projectId, index) => {
        if (!next[projectId]) {
          next[projectId] = index === 0 ? '11:00-12:00' : ''
        }
      })
      return next
    })
  }

  function openPatientForm() {
    setPatientDraft(
      patientInfo ?? {
        relation: patientRelationOptions[0],
        name: '',
        idType: '身份证',
        idNo: '',
        phone: '',
      },
    )
    pushScreen('patientForm')
  }

  function savePatient() {
    if (!canSubmitPatient) return
    setPatientInfo(patientDraft)
    setAgreementChecked(true)
    goBack()
  }

  function selectTimeForProject(projectId) {
    setTimePickerProjectId(projectId)
    setTimeDraft(projectTimes[projectId] || '9:00-10:00')
  }

  function confirmProjectTime() {
    if (!timePickerProjectId || !timeDraft) return
    setProjectTimes((current) => ({
      ...current,
      [timePickerProjectId]: timeDraft,
    }))
    setTimePickerProjectId('')
  }

  function submitPayment() {
    if (!patientInfo) {
      showToast('请填写就诊人信息')
      return
    }

    const missingTime = selectedProjectIds.some((projectId) => !projectTimes[projectId])
    if (missingTime) {
      showToast('请选择受检时间')
      return
    }

    if (!agreementChecked) {
      showToast('请勾选协议')
      return
    }

    setLiveOrderStatus('paid')
    setPaymentDetailStatus('paid')
    pushScreen('paymentSuccess')
  }

  function finishPayment() {
    setPaymentDetailStatus('paid')
    setActiveTab('check')
    resetToScreen('checkHome')
  }

  function openStatusDetail(status) {
    if (status === 'pending' || status === 'expired') {
      ensureProjectTimes(selectedProjectIds.length ? selectedProjectIds : ['brain-ct-plain-1', 'brain-mr-plain'])
      pushScreen('patientOrder', { status })
      return
    }

    setPaymentDetailStatus(status)
    pushScreen('paymentDetail', { status })
  }

  function switchTab(tabKey) {
    setActiveTab(tabKey)
    if (tabKey === 'ai') {
      resetToScreen('aiRecommend')
      return
    }
    if (tabKey === 'mine') {
      resetToScreen('mine')
      return
    }
    resetToScreen('checkHome')
  }

  function formatProjectSchedule(projectId, fallbackText = '请选择时间') {
    const slot = projectTimes[projectId]
    if (!slot) return fallbackText
    return `${normalizedAppointmentDate} ${slot}`
  }

  function renderOrderForm() {
    return (
      <>
        <AppHeader title="患者开单" backType="close" onBack={() => {}} />
        <div className="doctor-h5-page doctor-h5-page--form doctor-h5-page--form-first">
          <div className="doctor-h5-card doctor-h5-card--form doctor-h5-card--order-first">
            <div className="doctor-h5-field doctor-h5-field--tight">
              <div className="doctor-h5-field__label">症状描述：</div>
              <textarea
                className="doctor-h5-textarea doctor-h5-textarea--order"
                placeholder="请输入患者症状"
                value={symptomText}
                onChange={(event) => setSymptomText(event.target.value)}
              />
            </div>

            <div className="doctor-h5-field doctor-h5-field--tight">
              <div className="doctor-h5-field__label">诊断描述：</div>
              <textarea
                className="doctor-h5-textarea doctor-h5-textarea--order"
                placeholder="请输入诊断建议"
                value={diagnosisText}
                onChange={(event) => setDiagnosisText(event.target.value)}
              />
            </div>

            <div className="doctor-h5-field doctor-h5-field--tight">
              <div className="doctor-h5-field__label doctor-h5-field__label--required">预约时间：</div>
              <div className="doctor-h5-chip-row doctor-h5-chip-row--order">
                {quickDateOptions.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={cx('doctor-h5-chip doctor-h5-chip--order', quickDate === item && 'is-active')}
                    onClick={() => setQuickDate(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="doctor-h5-selector doctor-h5-selector--order"
                onClick={() => pushScreen('calendar')}
              >
                <span>{appointmentDateForDisplay}</span>
                <span className="doctor-h5-selector__hint">{appointmentHint} ›</span>
              </button>
            </div>

            <div className="doctor-h5-field doctor-h5-field--tight">
              <div className="doctor-h5-field__label doctor-h5-field__label--required">检查项目：</div>
              <div className="doctor-h5-action-grid doctor-h5-action-grid--order">
                <button
                  type="button"
                  className="doctor-h5-action-card doctor-h5-action-card--add doctor-h5-action-card--order"
                  onClick={openManualPicker}
                >
                  <span className="doctor-h5-action-card__icon doctor-h5-action-card__icon--add">＋</span>
                  <span>添加项目</span>
                </button>
                <button
                  type="button"
                  className="doctor-h5-action-card doctor-h5-action-card--order"
                  onClick={() => pushScreen('aiRecommend')}
                >
                  <span className="doctor-h5-action-card__ai">AI</span>
                  <span>AI项目推荐</span>
                </button>
                <button type="button" className="doctor-h5-action-card doctor-h5-action-card--disabled doctor-h5-action-card--order">
                  <span className="doctor-h5-action-card__heart">♡</span>
                  <span>专家咨询</span>
                  <small>已规划</small>
                </button>
              </div>

              {selectedProjects.length ? (
                <div className="doctor-h5-project-list">
                  <div className="doctor-h5-project-list__divider" />
                  {selectedProjects.map((project) => (
                    <ProjectBadge
                      key={project.id}
                      item={{
                        name: project.name,
                        onRemove: () =>
                          setSelectedProjectIds((current) => current.filter((projectId) => projectId !== project.id)),
                      }}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>
        <div className="doctor-h5-footer doctor-h5-footer--single doctor-h5-footer--order-first">
          <button type="button" className="doctor-h5-primary-button" onClick={queryInstitution}>
            查询机构
          </button>
        </div>
      </>
    )
  }

  function renderManualPicker() {
    return (
      <>
        <AppHeader title="手动添加项目" onBack={goBack} />
        <div className="doctor-h5-page doctor-h5-page--picker">
          <button type="button" className="doctor-h5-search-bar" onClick={openSearchScreen}>
            <span className="doctor-h5-search-bar__icon">⌕</span>
            <span className="doctor-h5-search-bar__placeholder">请输入部位或者项目名称</span>
          </button>

          <div className="doctor-h5-picker-toolbar">
            <div className="doctor-h5-pill-tabs">
              {modalityTabs.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={cx('doctor-h5-pill-tab', pickerModality === item && 'is-active')}
                  onClick={() => setPickerModality(item)}
                >
                  {item}
                </button>
              ))}
            </div>
            <button type="button" className="doctor-h5-link-button">
              智能排序 ⇅
            </button>
          </div>

          <div className="doctor-h5-picker-layout">
            <div className="doctor-h5-picker-layout__menu">
              {projectGroups.map((group) => (
                <button
                  key={group}
                  type="button"
                  className={cx('doctor-h5-group-item', pickerGroup === group && 'is-active')}
                  onClick={() => setPickerGroup(group)}
                >
                  <span>{group}</span>
                  {group !== '全部部位' ? <span>⌄</span> : null}
                </button>
              ))}
            </div>

            <div className="doctor-h5-picker-layout__content">
              {visiblePickerProjects.map((project) => {
                const selected = draftProjectIds.includes(project.id)
                return (
                  <button
                    key={project.id}
                    type="button"
                    className={cx('doctor-h5-project-option', selected && 'is-selected')}
                    onClick={() => toggleDraftProject(project.id)}
                  >
                    <span>{project.name}</span>
                    <span className={cx('doctor-h5-project-option__check', selected && 'is-selected')}>
                      {selected ? '✓' : '◌'}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
        <div className="doctor-h5-footer doctor-h5-footer--split">
          <div className="doctor-h5-footer__count">已选{draftProjects.length}个</div>
          <button type="button" className="doctor-h5-primary-button doctor-h5-primary-button--compact" onClick={confirmDraftProjects}>
            确认
          </button>
        </div>
      </>
    )
  }

  function renderSearch() {
    const hasKeyword = Boolean(searchQuery.trim())
    const showHistory = !searchSubmitted && !hasKeyword
    const showResultList = searchSubmitted && hasKeyword && searchResults.length
    const showEmptyBox = searchSubmitted && hasKeyword && !searchResults.length

    return (
      <>
        <AppHeader title="搜索" onBack={goBack} />
        <div className="doctor-h5-page doctor-h5-page--search">
          <div className="doctor-h5-search-entry">
            <input
              className="doctor-h5-search-entry__input"
              value={searchQuery}
              placeholder="请输入部位或者项目名称"
              onChange={(event) => {
                setSearchQuery(event.target.value)
                setSearchSubmitted(false)
              }}
            />
            {hasKeyword ? (
              <button type="button" className="doctor-h5-search-entry__clear" onClick={() => setSearchQuery('')}>
                ×
              </button>
            ) : null}
            <button type="button" className="doctor-h5-search-entry__submit" onClick={() => runSearch()}>
              搜索
            </button>
          </div>

          {showHistory ? (
            <div className="doctor-h5-history">
              <div className="doctor-h5-history__header">
                <span>历史记录</span>
                <button type="button" className="doctor-h5-link-button" onClick={() => setSearchHistory([])}>
                  清空
                </button>
              </div>
              <div className="doctor-h5-history__chips">
                {searchHistory.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className="doctor-h5-history__chip"
                    onClick={() => runSearch(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {!showHistory && !showResultList && !showEmptyBox && !hasKeyword ? <SearchEmpty /> : null}

          {showEmptyBox ? <SearchEmpty type="box" /> : null}

          {showResultList ? (
            <div className="doctor-h5-search-results">
              <div className="doctor-h5-search-results__title">搜索结果</div>
              <div className="doctor-h5-search-results__list">
                {searchResults.map((project) => {
                  const selected = draftProjectIds.includes(project.id)
                  return (
                    <button
                      key={project.id}
                      type="button"
                      className={cx('doctor-h5-project-option', selected && 'is-selected')}
                      onClick={() => toggleDraftProject(project.id)}
                    >
                      <span>{project.name}</span>
                      <span className={cx('doctor-h5-project-option__check', selected && 'is-selected')}>
                        {selected ? '✓' : '◌'}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          ) : null}
        </div>
        {showResultList ? (
          <div className="doctor-h5-footer doctor-h5-footer--split">
            <div className="doctor-h5-footer__count">已选{draftProjectIds.length}个</div>
            <button
              type="button"
              className="doctor-h5-primary-button doctor-h5-primary-button--compact"
              onClick={goBack}
            >
              确认
            </button>
          </div>
        ) : null}
      </>
    )
  }

  function renderAiRecommend() {
    return (
      <>
        <AppHeader title="一脉青藤" subtitle="" onBack={goBack} />
        <div className="doctor-h5-page doctor-h5-page--ai">
          <section className="doctor-h5-ai-hero">
            <div className="doctor-h5-ai-hero__brand">AI影像检查推荐</div>
            <div className="doctor-h5-ai-hero__doctor" aria-hidden="true" />
            <p>我是青藤AI，将智能分析你的主诉症状，给你推荐影像检查项目，请描述你的主诉症状如：</p>
            <div className="doctor-h5-ai-hero__chips">
              {aiPromptChips.map((item, index) => (
                <div key={`${item}-${index}`} className="doctor-h5-ai-hero__chip">
                  # {item}
                </div>
              ))}
            </div>
            <div className="doctor-h5-ai-hero__bubble">头疼胸闷</div>
          </section>

          <section className="doctor-h5-card doctor-h5-card--ai">
            <div className="doctor-h5-ai-block__title">CDSS-检查推荐：</div>
            <div className="doctor-h5-ai-block__subtitle">临床分析与红旗征</div>
            <p className="doctor-h5-ai-block__copy">
              患者主诉“头痛胸闷”，但信息有限，缺乏关键细节如病程、年龄、性别、症状具体特征及任何“红旗征”。
              这导致无法明确区分症状是源于神经系统、心血管系统还是其他原因，胸闷是需要高度警惕的症状，可能提示心肺急症。
            </p>

            <div className="doctor-h5-ai-card-banner">
              <div>
                <strong>AI检查项目推荐</strong>
                <span>选择项目快速开单检查，剩50次/月</span>
              </div>
              <div className="doctor-h5-ai-card-banner__art" />
            </div>

            <div className="doctor-h5-ai-card-list">
              {aiRecommendationCards.map((card) => {
                const project = projectCatalog.find((item) => item.id === card.id)
                const selected = draftProjectIds.includes(card.id)
                return (
                  <button
                    key={card.id}
                    type="button"
                    className={cx('doctor-h5-ai-project', selected && 'is-selected')}
                    onClick={() => toggleDraftProject(card.id)}
                  >
                    <div className="doctor-h5-ai-project__header">
                      <span className="doctor-h5-ai-project__icon">☤</span>
                      <strong>{project?.name ?? card.id}</strong>
                      <span className={cx('doctor-h5-ai-project__check', selected && 'is-selected')}>
                        {selected ? '✓' : '◌'}
                      </span>
                    </div>
                    <p>推荐理由：{card.reason}</p>
                  </button>
                )
              })}
            </div>
          </section>

          <div className="doctor-h5-ai-input">有什么健康问题问我 ~</div>
        </div>
        <div className="doctor-h5-footer doctor-h5-footer--single">
          <button
            type="button"
            className="doctor-h5-primary-button"
            onClick={() => {
              setSelectedProjectIds(draftProjectIds.length ? draftProjectIds : ['brain-mr-plain', 'chest-ct-plain-1'])
              goBack()
            }}
          >
            确认
          </button>
        </div>
      </>
    )
  }

  function renderCalendar() {
    return (
      <>
        <AppHeader title="一脉青藤" onBack={goBack} />
        <div className="doctor-h5-page doctor-h5-page--calendar">
          <div className="doctor-h5-week-row">
            {['日', '一', '二', '三', '四', '五', '六'].map((item) => (
              <span key={item} className={item === '日' || item === '六' ? 'is-accent' : ''}>
                {item}
              </span>
            ))}
          </div>

          {calendarMonths.map((month) => (
            <section key={month.monthLabel} className="doctor-h5-calendar-month">
              <div className="doctor-h5-calendar-month__title">{month.monthLabel}</div>
              <div className="doctor-h5-calendar-grid">
                {month.rows.flat().map((cell, index) => (
                  <button
                    key={`${month.monthLabel}-${index}`}
                    type="button"
                    className={cx(
                      'doctor-h5-calendar-cell',
                      cell.selected && 'is-selected',
                      cell.isToday && 'is-today',
                      cell.accent && 'is-accent',
                      cell.muted && 'is-muted',
                    )}
                    onClick={() => chooseCalendarDate(cell.day)}
                  >
                    <strong>{cell.day}</strong>
                    {cell.sub ? <span>{cell.sub}</span> : null}
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>
      </>
    )
  }

  function renderInstitutionList() {
    return (
      <>
        <AppHeader title="选择机构" onBack={goBack} />
        <div className="doctor-h5-page doctor-h5-page--institution">
          <div className="doctor-h5-date-cards">
            {institutionDateCards.map((item) => (
              <button
                key={item.key}
                type="button"
                className={cx('doctor-h5-date-card', selectedInstitutionDateKey === item.key && 'is-active')}
                onClick={() => setSelectedInstitutionDateKey(item.key)}
              >
                <span>{item.week}</span>
                <strong>{item.date}</strong>
              </button>
            ))}
          </div>

          <div className="doctor-h5-filter-row">
            {institutionFilters.map((filter) => (
              <label key={filter} className="doctor-h5-filter-row__item">
                <input
                  type="checkbox"
                  checked={activeFilters[filter]}
                  onChange={() =>
                    setActiveFilters((current) => ({
                      ...current,
                      [filter]: !current[filter],
                    }))
                  }
                />
                <span>{filter}</span>
              </label>
            ))}
            <button type="button" className="doctor-h5-link-button">
              搜索
            </button>
            <button type="button" className="doctor-h5-link-button">
              筛选
            </button>
          </div>

          <div className="doctor-h5-institution-list">
            {institutions.map((institution) => (
              <button
                key={institution.id}
                type="button"
                className={cx('doctor-h5-institution-card', selectedInstitutionId === institution.id && 'is-selected')}
                onClick={() => openInstitutionDetail(institution.id)}
              >
                <div className="doctor-h5-institution-card__logo">✚</div>
                <div className="doctor-h5-institution-card__content">
                  <strong>{institution.name}</strong>
                  <p>{institution.address}</p>
                  <div className="doctor-h5-institution-card__badges">
                    <span className="doctor-h5-badge doctor-h5-badge--green">{institution.grade}</span>
                    <span className="doctor-h5-badge doctor-h5-badge--mint">{institution.type}</span>
                    {institution.modalities.map((modality) => (
                      <span key={modality} className="doctor-h5-badge doctor-h5-badge--soft">
                        {modality}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="doctor-h5-institution-card__distance">{institution.distance}</div>
              </button>
            ))}
          </div>
        </div>
        <BottomTabBar activeTab={activeTab} onTabChange={switchTab} />
      </>
    )
  }

  function renderDoctorShare() {
    return (
      <>
        <AppHeader title="订单详情" onBack={goBack} />
        <div className="doctor-h5-page doctor-h5-page--detail doctor-h5-page--hero">
          <section className="doctor-h5-hospital-hero">
            <div className="doctor-h5-hospital-hero__logo">✚</div>
            <div className="doctor-h5-hospital-hero__main">
              <strong>{selectedInstitution.name}</strong>
              <div className="doctor-h5-hospital-hero__tags">
                <span className="doctor-h5-badge doctor-h5-badge--green">三甲</span>
                <span className="doctor-h5-badge doctor-h5-badge--mint">公立医院</span>
              </div>
            </div>
          </section>

          <section className="doctor-h5-detail-card">
            <p className="doctor-h5-detail-card__desc">{detailDescription}</p>
            <button type="button" className="doctor-h5-detail-card__more">
              查看更多 &gt;
            </button>
            <div className="doctor-h5-detail-card__meta">
              <div>
                <strong>5.3km</strong>
                <span>南昌市XXXXXXXXXXXXXX</span>
              </div>
              <div className="doctor-h5-detail-card__actions">
                <span>导航</span>
                <span>致电</span>
              </div>
            </div>
          </section>

          <section className="doctor-h5-inline-card">
            <strong>当前预约日期：{appointmentDateForDisplay}</strong>
          </section>

          <section className="doctor-h5-inline-card doctor-h5-inline-card--action">
            <span>*就诊人：</span>
            <button type="button" className="doctor-h5-link-button" onClick={openPatientForm}>
              添加就诊人
            </button>
          </section>

          <section className="doctor-h5-fee-card">
            <div className="doctor-h5-fee-card__header">
              <strong>检查费用</strong>
              <span>XX第一人民医院收取</span>
            </div>
            {selectedProjects.map((project, index) => (
              <div key={project.id} className="doctor-h5-fee-card__row">
                <div className="doctor-h5-fee-card__row-main">
                  <strong>{project.name}</strong>
                  <span>* 预约受检时间 {index === 0 ? formatProjectSchedule(project.id, `${normalizedAppointmentDate} 11:00-12:00`) : formatProjectSchedule(project.id)} ›</span>
                </div>
                <strong>{formatAmount(project.price)}</strong>
              </div>
            ))}
            <div className="doctor-h5-fee-card__summary">
              <span>检查费用</span>
              <span>{formatAmount(currentTotal || 389.86)}</span>
            </div>
            <div className="doctor-h5-fee-card__summary">
              <strong>总金额</strong>
              <strong className="is-red">{formatAmount(currentTotal || 389.86)}</strong>
            </div>
          </section>
        </div>
        <div className="doctor-h5-footer doctor-h5-footer--double">
          <button type="button" className="doctor-h5-scan-button" onClick={openQrModal}>
            <span>▣</span>
            <span>扫码开单</span>
          </button>
          <button type="button" className="doctor-h5-primary-button doctor-h5-primary-button--wide" onClick={() => setShowShareGuide(true)}>
            分享订单给患者
          </button>
        </div>
      </>
    )
  }

  function renderPatientOrder() {
    const status = currentScreen.payload?.status ?? liveOrderStatus
    const meta = detailStatusMeta[status]
    const patientActionLabel = patientInfo ? '切换就诊人' : '添加就诊人'
    const statusLabel =
      status === 'expired' ? '已失效' : status === 'paid' ? '已支付' : status === 'refund' ? '已退费' : '待支付'

    return (
      <>
        <AppHeader title={meta.screenTitle} onBack={goBack} right={isPatientEntry ? '' : 'dots'} />
        <div className="doctor-h5-page doctor-h5-page--detail doctor-h5-page--hero doctor-h5-page--patient-order">
          <section className="doctor-h5-patient-hero">
            <div className="doctor-h5-patient-hero__top">
              <div className="doctor-h5-hospital-hero__logo doctor-h5-hospital-hero__logo--soft">+</div>
              <div className="doctor-h5-hospital-hero__main">
                <div className="doctor-h5-patient-hero__eyebrow">影像检查预约单</div>
                <strong>{selectedInstitution.name}</strong>
                <div className="doctor-h5-hospital-hero__tags">
                  <span className="doctor-h5-badge doctor-h5-badge--green">三甲</span>
                  <span className="doctor-h5-badge doctor-h5-badge--mint">公立医院</span>
                </div>
              </div>
              <div className={cx('doctor-h5-patient-hero__status', `is-${status}`)}>{statusLabel}</div>
            </div>

            <div className="doctor-h5-patient-hero__summary">
              <div>
                <span>预约日期</span>
                <strong>{appointmentDateForDisplay}</strong>
              </div>
              <div>
                <span>应付金额</span>
                <strong className="is-accent">{formatAmount(currentTotal || 389.86)}</strong>
              </div>
            </div>
          </section>

          <section className="doctor-h5-detail-card doctor-h5-detail-card--patient">
            <div className="doctor-h5-section-head">
              <strong>机构说明</strong>
              <button type="button" className="doctor-h5-detail-card__more">
                查看详情
              </button>
            </div>
            <p className="doctor-h5-detail-card__desc">{detailDescription}</p>
            <div className="doctor-h5-detail-card__meta">
              <div>
                <strong>距您 5.3km</strong>
                <span>南昌市XXXXXXXXXXXXXX</span>
              </div>
              <div className="doctor-h5-detail-card__action-buttons">
                <button type="button" className="doctor-h5-utility-chip">
                  导航
                </button>
                <button type="button" className="doctor-h5-utility-chip">
                  致电
                </button>
              </div>
            </div>
          </section>

          <section className="doctor-h5-inline-card doctor-h5-inline-card--rich">
            <span className="doctor-h5-inline-card__label">预约日期</span>
            <strong className="doctor-h5-inline-card__value">{appointmentDateForDisplay}</strong>
          </section>

          <section className="doctor-h5-inline-card doctor-h5-inline-card--action doctor-h5-inline-card--rich">
            <span className="doctor-h5-inline-card__label">就诊人信息</span>
            <button
              type="button"
              className="doctor-h5-inline-card__action-link"
              onClick={() => {
                if (!patientInfo) {
                  openPatientForm()
                  return
                }
                if (status === 'expired') {
                  setShowReadonlyModal(true)
                  return
                }
                setShowPatientLockedModal(true)
              }}
            >
              {patientInfo ? `${patientInfo.name} · ${patientInfo.phone}` : patientActionLabel}
            </button>
          </section>

          <section className="doctor-h5-fee-card doctor-h5-fee-card--patient">
            <div className="doctor-h5-fee-card__header doctor-h5-fee-card__header--patient">
              <div>
                <strong>检查费用</strong>
                <span>费用由 {selectedInstitution.name} 收取</span>
              </div>
              <div className="doctor-h5-fee-card__price">{formatAmount(currentTotal || 389.86)}</div>
            </div>
            {selectedProjects.map((project) => (
              <div key={project.id} className="doctor-h5-fee-card__row doctor-h5-fee-card__row--patient">
                <div className="doctor-h5-fee-card__row-main">
                  <strong>{project.name}</strong>
                  <button type="button" className="doctor-h5-time-button" onClick={() => selectTimeForProject(project.id)}>
                    预约受检时间 {formatProjectSchedule(project.id)} ›
                  </button>
                </div>
                <strong>{formatAmount(project.price)}</strong>
              </div>
            ))}
            <div className="doctor-h5-fee-card__summary">
              <span>检查费用</span>
              <span>{formatAmount(currentTotal || 389.86)}</span>
            </div>
            <div className="doctor-h5-fee-card__summary">
              <strong>总金额</strong>
              <strong className="is-red">{formatAmount(currentTotal || 389.86)}</strong>
            </div>
          </section>

          <label className="doctor-h5-agreement doctor-h5-agreement--patient">
            <input type="checkbox" checked={agreementChecked} onChange={() => setAgreementChecked((value) => !value)} />
            <span>
              我已阅读并同意 <strong>《用户协议》</strong>、<strong>《隐私协议》</strong>
            </span>
          </label>
        </div>
        <div className="doctor-h5-notice doctor-h5-notice--patient">{meta.summary}</div>
        <div className="doctor-h5-footer doctor-h5-footer--checkout">
          <div className="doctor-h5-footer__money">
            <span>应付金额</span>
            <strong>{formatAmount(currentTotal || 389.86)}</strong>
          </div>
          <button
            type="button"
            className={cx(
              'doctor-h5-primary-button doctor-h5-primary-button--checkout',
              meta.buttonTone === 'disabled' && 'doctor-h5-primary-button--disabled',
            )}
            onClick={status === 'pending' ? submitPayment : undefined}
          >
            {meta.buttonLabel}
          </button>
        </div>
      </>
    )
  }

  function renderPatientForm() {
    return (
      <>
        <AppHeader title="添加就诊人" onBack={goBack} />
        <div className="doctor-h5-page doctor-h5-page--patient-form">
          <div className="doctor-h5-warning">请您务必认真核对个人信息，避免因信息有误，影响您的就医服务体验!</div>
          <section className="doctor-h5-card doctor-h5-card--patient">
            <button
              type="button"
              className="doctor-h5-form-row"
              onClick={() => {
                const index = patientRelationOptions.indexOf(patientDraft.relation)
                setPatientDraft((current) => ({
                  ...current,
                  relation: patientRelationOptions[(index + 1) % patientRelationOptions.length],
                }))
              }}
            >
              <span className="is-required">关系：</span>
              <span>{patientDraft.relation}</span>
            </button>

            <label className="doctor-h5-form-row doctor-h5-form-row--input">
              <span className="is-required">姓名：</span>
              <input
                value={patientDraft.name}
                placeholder="请输入姓名"
                onChange={(event) => setPatientDraft((current) => ({ ...current, name: event.target.value }))}
              />
            </label>

            <button type="button" className="doctor-h5-form-row">
              <span className="is-required">证件类型</span>
              <span>{patientDraft.idType}</span>
            </button>

            <label className="doctor-h5-form-row doctor-h5-form-row--input">
              <span className="is-required">证件号码</span>
              <input
                value={patientDraft.idNo}
                placeholder="请填写证件号码"
                onChange={(event) => setPatientDraft((current) => ({ ...current, idNo: event.target.value }))}
              />
            </label>

            <label className="doctor-h5-form-row doctor-h5-form-row--input">
              <span className="is-required">手机号</span>
              <input
                value={patientDraft.phone}
                placeholder="请输入11位手机号"
                onChange={(event) => setPatientDraft((current) => ({ ...current, phone: event.target.value }))}
              />
            </label>
          </section>
        </div>
        <div className="doctor-h5-footer doctor-h5-footer--single">
          <button
            type="button"
            className={cx('doctor-h5-primary-button', !canSubmitPatient && 'doctor-h5-primary-button--disabled')}
            onClick={savePatient}
          >
            确定
          </button>
        </div>
      </>
    )
  }

  function renderPaymentSuccess() {
    return (
      <>
        <AppHeader title="支付" onBack={goBack} />
        <div className="doctor-h5-page doctor-h5-page--success">
          <div className="doctor-h5-success">
            <div className="doctor-h5-success__state">✔ 支付成功</div>
            <div className="doctor-h5-success__brand">一脉青藤</div>
            <div className="doctor-h5-success__amount">{formatAmount(currentTotal || 161.7)}</div>
          </div>
        </div>
        <div className="doctor-h5-footer doctor-h5-footer--single">
          <button type="button" className="doctor-h5-primary-button doctor-h5-primary-button--ghost" onClick={finishPayment}>
            完成
          </button>
        </div>
      </>
    )
  }

  function renderPaymentDetail() {
    const status = currentScreen.payload?.status ?? paymentDetailStatus
    const meta = detailStatusMeta[status]
    const orderNo = isPatientEntry ? shareToken : defaultOrderNo

    return (
      <>
        <AppHeader title={meta.screenTitle} onBack={goBack} />
        <div className="doctor-h5-page doctor-h5-page--detail doctor-h5-page--hero">
          <section className="doctor-h5-status-hero">
            <div>
              <div className="doctor-h5-status-hero__title">{meta.orderTitle}</div>
              <div className="doctor-h5-status-hero__summary">{meta.summary}</div>
            </div>
            <div className="doctor-h5-status-hero__mark" aria-hidden="true" />
          </section>

          <section className="doctor-h5-order-code">
            <strong>订单编号：{orderNo}</strong>
          </section>

          <section className="doctor-h5-fee-card doctor-h5-fee-card--compact">
            <div className="doctor-h5-payment-institution">
              <div className="doctor-h5-payment-institution__logo">✚</div>
              <div>
                <strong>{selectedInstitution.name}</strong>
                <div className="doctor-h5-hospital-hero__tags">
                  <span className="doctor-h5-badge doctor-h5-badge--green">三甲</span>
                  <span className="doctor-h5-badge doctor-h5-badge--mint">公立医院</span>
                </div>
              </div>
            </div>
          </section>

          <section className="doctor-h5-fee-card">
            <div className="doctor-h5-fee-card__header">
              <strong>检查费用</strong>
              <span>XX第一人民医院收取</span>
            </div>
            {selectedProjects.map((project) => (
              <div key={project.id} className="doctor-h5-fee-card__row">
                <div className="doctor-h5-fee-card__row-main">
                  <strong>{project.name}</strong>
                  <span>* 预约受检时间 {formatProjectSchedule(project.id, `${normalizedAppointmentDate} 11:00-12:00`)} ›</span>
                </div>
                <strong>{formatAmount(project.price)}</strong>
              </div>
            ))}
            <div className="doctor-h5-fee-card__summary">
              <strong>总金额</strong>
              <strong className="is-red">{formatAmount(currentTotal || 389.86)}</strong>
            </div>
          </section>

          <section className="doctor-h5-card doctor-h5-card--info-grid">
            <div className="doctor-h5-info-grid">
              <span>预约人姓名</span>
              <strong>{patientInfo?.name || '刘*福'}</strong>
              <span>预约人手机号</span>
              <strong>{patientInfo?.phone || '13000000000'}</strong>
              <span>证件类型</span>
              <strong>{patientInfo?.idType || '身份证'}</strong>
              <span>证件号</span>
              <strong>{patientInfo?.idNo || '420102********6666'}</strong>
              <span>创建时间</span>
              <strong>2025-10-10 12:40</strong>
            </div>
          </section>
        </div>
        {meta.buttonTone === 'outline' ? (
          <div className="doctor-h5-footer doctor-h5-footer--single">
            <button
              type="button"
              className="doctor-h5-outline-button"
              onClick={() => {
                setPaymentDetailStatus('refund')
                replaceScreen('paymentDetail', { status: 'refund' })
              }}
            >
              取消预约
            </button>
          </div>
        ) : null}
      </>
    )
  }

  function renderCheckHome() {
    const liveCard = homeOrders[0]
    const liveBadge = liveOrderStatus === 'paid' ? '待完成' : liveOrderStatus === 'refund' ? '已退费' : '待支付'

    return (
      <>
        <AppHeader title="一脉青藤" onBack={() => {}} right="" />
        <div className="doctor-h5-page doctor-h5-page--home">
          <section className="doctor-h5-home-hero">
            <div className="doctor-h5-home-hero__copy">
              <div className="doctor-h5-home-hero__brand">一脉青藤 Imavine</div>
              <strong>检查无界，健康同心</strong>
            </div>
            <div className="doctor-h5-home-hero__doctor" aria-hidden="true" />
          </section>

          <section className="doctor-h5-card doctor-h5-card--summary">
            <div className="doctor-h5-card__patient">{liveCard.patientName}</div>
            <div className="doctor-h5-card__code">检查单号：{liveCard.orderNo}</div>
            <div className="doctor-h5-home-project">{selectedProjects[0]?.name || liveCard.projectName}</div>
            <div className="doctor-h5-home-time">
              检查时间：{liveCard.checkTime} <span>›</span>
            </div>
            <button type="button" className="doctor-h5-primary-button doctor-h5-primary-button--small" onClick={queryInstitution}>
              查询
            </button>
          </section>

          <section className="doctor-h5-card doctor-h5-card--home-order">
            <div className="doctor-h5-home-order__header">
              <div className="doctor-h5-home-order__institution">XX第一人民医院</div>
              <span className={cx('doctor-h5-home-order__badge', `is-${liveOrderStatus}`)}>{liveBadge}</span>
            </div>
            <div className="doctor-h5-home-order__line">
              检查时间：{formatProjectSchedule(selectedProjects[0]?.id, `${normalizedAppointmentDate} 11:00-12:00`)}
            </div>
            <div className="doctor-h5-home-order__line">检查项目：{selectedProjects[0]?.name || liveCard.detail}</div>
            <div className="doctor-h5-home-order__actions">
              <button type="button" className="doctor-h5-chip-button">
                快捷导航
              </button>
              <button type="button" className="doctor-h5-chip-button">
                客服咨询
              </button>
              <button
                type="button"
                className="doctor-h5-chip-button doctor-h5-chip-button--filled"
                onClick={() => openStatusDetail(liveOrderStatus)}
              >
                预约详情
              </button>
            </div>
          </section>
        </div>
        <BottomTabBar activeTab={activeTab} onTabChange={switchTab} />
      </>
    )
  }

  function renderMine() {
    return (
      <>
        <AppHeader title="我的订单" onBack={() => {}} right="" />
        <div className="doctor-h5-page doctor-h5-page--mine">
          <section className="doctor-h5-card doctor-h5-card--mine">
            <div className="doctor-h5-mine-title">状态订单</div>
            <div className="doctor-h5-mine-list">
              {mineOrders.map((order) => (
                <button key={order.id} type="button" className="doctor-h5-mine-item" onClick={() => openStatusDetail(order.status)}>
                  <div>
                    <strong>{order.label}</strong>
                    <span>{selectedInstitution.name}</span>
                  </div>
                  <span>›</span>
                </button>
              ))}
            </div>
          </section>
        </div>
        <BottomTabBar activeTab={activeTab} onTabChange={switchTab} />
      </>
    )
  }

  return (
    <PhoneShell>
      {currentScreen.name === 'orderForm' ? renderOrderForm() : null}
      {currentScreen.name === 'manualPicker' ? renderManualPicker() : null}
      {currentScreen.name === 'search' ? renderSearch() : null}
      {currentScreen.name === 'aiRecommend' ? renderAiRecommend() : null}
      {currentScreen.name === 'calendar' ? renderCalendar() : null}
      {currentScreen.name === 'institutionList' ? renderInstitutionList() : null}
      {currentScreen.name === 'doctorShare' ? renderDoctorShare() : null}
      {currentScreen.name === 'patientOrder' ? renderPatientOrder() : null}
      {currentScreen.name === 'patientForm' ? renderPatientForm() : null}
      {currentScreen.name === 'paymentSuccess' ? renderPaymentSuccess() : null}
      {currentScreen.name === 'paymentDetail' ? renderPaymentDetail() : null}
      {currentScreen.name === 'checkHome' ? renderCheckHome() : null}
      {currentScreen.name === 'mine' ? renderMine() : null}

      {showShareGuide ? (
        <div className="doctor-h5-overlay doctor-h5-overlay--guide">
          <div className="doctor-h5-guide">
            <div className="doctor-h5-guide__art" aria-hidden="true" />
            <div className="doctor-h5-guide__text">点击右上角分享患者</div>
            <button type="button" className="doctor-h5-guide__button" onClick={confirmShareGuide}>
              我知道了
            </button>
          </div>
        </div>
      ) : null}

      {showQrModal ? (
        <div className="doctor-h5-overlay">
          <div className="doctor-h5-qr-modal">
            <button type="button" className="doctor-h5-qr-modal__close" onClick={() => setShowQrModal(false)}>
              ×
            </button>
            <div className="doctor-h5-qr-modal__title">面对面给患者扫码下单</div>
            <div className="doctor-h5-qr-modal__qr">
              <div className="doctor-h5-qr-modal__qr-grid" />
              {qrExpired ? <div className="doctor-h5-qr-modal__expired">开单二维码已失效</div> : null}
            </div>
            <button
              type="button"
              className="doctor-h5-primary-button doctor-h5-primary-button--compact"
              onClick={qrExpired ? refreshQr : undefined}
            >
              {qrExpired ? '刷新 ⟳' : `${qrCountdown}s后失效`}
            </button>
          </div>
        </div>
      ) : null}

      {timePickerProjectId ? (
        <div className="doctor-h5-sheet-mask">
          <div className="doctor-h5-sheet">
            <div className="doctor-h5-sheet__header">
              <strong>选择</strong>
              <button type="button" className="doctor-h5-sheet__close" onClick={() => setTimePickerProjectId('')}>
                ×
              </button>
            </div>
            <div className="doctor-h5-sheet__date">当前预约日期：2025年12月15日</div>
            {timeSlotGroups.map((group) => (
              <div key={group.label} className="doctor-h5-sheet__group">
                <div className="doctor-h5-sheet__group-title">{group.label}</div>
                <div className="doctor-h5-sheet__slots">
                  {group.slots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      className={cx('doctor-h5-sheet__slot', timeDraft === slot && 'is-active')}
                      onClick={() => setTimeDraft(slot)}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <div className="doctor-h5-sheet__footer">
              <button type="button" className="doctor-h5-outline-button doctor-h5-outline-button--sheet" onClick={() => setTimePickerProjectId('')}>
                取消
              </button>
              <button type="button" className="doctor-h5-primary-button doctor-h5-primary-button--compact" onClick={confirmProjectTime}>
                确定
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {showPatientLockedModal ? (
        <Modal
          actions={[
            { label: '取消', onClick: () => setShowPatientLockedModal(false) },
            {
              label: '确定',
              emphasis: true,
              onClick: () => {
                setShowPatientLockedModal(false)
                setPatientDraft({
                  relation: patientRelationOptions[0],
                  name: '',
                  idType: '身份证',
                  idNo: '',
                  phone: '',
                })
                pushScreen('patientForm')
              },
            },
          ]}
        >
          当前就诊人信息不支持修改，如果信息有误，可返回上一页点击切换就诊人按钮，添加新的就诊人信息下单支付
        </Modal>
      ) : null}

      {showReadonlyModal ? (
        <Modal
          actions={[{ label: '我知道了', emphasis: true, onClick: () => setShowReadonlyModal(false) }]}
        >
          当前就诊人信息不支持修改，如果信息有误，可返回上一页点击切换就诊人按钮，添加新的就诊人信息下单支付
        </Modal>
      ) : null}

      <Toast message={toastMessage} />
    </PhoneShell>
  )
}

export default DoctorOrderingReplica
