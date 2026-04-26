import {
  CalendarOutlined,
  CustomerServiceOutlined,
  MinusCircleFilled,
  PlusOutlined,
} from '@ant-design/icons'

function BrandMark() {
  return (
    <div className="prototype-brand">
      <div className="prototype-brand-icon" aria-hidden="true">
        <span />
      </div>
      <div>
        <div className="prototype-brand-cn">一脉青藤</div>
        <div className="prototype-brand-en">Imavine</div>
      </div>
    </div>
  )
}

export function H5PrototypeShowcase({ roleTitle, roleSummary, flowSteps, children }) {
  return (
    <div className="prototype-page">
      <div className="prototype-container">
        <header className="prototype-header">
          <div className="prototype-header-copy">
            <div className="prototype-eyebrow">运营 / 医生激励方案</div>
            <h1 className="prototype-title">{roleTitle}</h1>
            <p className="prototype-summary">{roleSummary}</p>

            <div className="prototype-flow">
              {flowSteps.map((step, index) => (
                <div key={step} className="prototype-flow-item">
                  <span className="prototype-flow-step">{step}</span>
                  {index < flowSteps.length - 1 ? <span className="prototype-flow-arrow">→</span> : null}
                </div>
              ))}
            </div>
          </div>

          <BrandMark />
        </header>

        <section className="prototype-grid">{children}</section>
      </div>
    </div>
  )
}

export function PrototypePhone({ label, tabs = [], activeTab, onTabChange, children }) {
  return (
    <article className="prototype-panel">
      <div className="prototype-phone">
        <div className="prototype-phone-status">
          <span>11:34</span>
          <span>5G 12%</span>
        </div>

        <div className="prototype-phone-browser">
          <button type="button" className="prototype-browser-action" aria-label="close">
            ×
          </button>
          <div className="prototype-browser-center">
            <div className="prototype-browser-title">一脉青藤</div>
            <div className="prototype-browser-subtitle">m.imavine.com</div>
          </div>
          <div className="prototype-browser-actions" aria-hidden="true">
            <span>⌕</span>
            <span>⋯</span>
          </div>
        </div>

        {tabs.length ? (
          <div className="prototype-segment">
            {tabs.map((tab) => (
              <button
                type="button"
                key={tab}
                className={`prototype-segment-item ${tab === activeTab ? 'active' : ''}`}
                onClick={() => onTabChange?.(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        ) : null}

        <div className="prototype-phone-body">{children}</div>

        <div className="prototype-phone-nav" aria-hidden="true">
          <span>‹</span>
          <span>›</span>
        </div>
      </div>

      <div className="prototype-panel-tag">{label}</div>
    </article>
  )
}

export function CheckExamPage({ ownerName = '张医生' }) {
  return (
    <div className="proto-exam-screen">
      <section className="proto-exam-card">
        <label className="proto-form-label required">主诉描述：</label>
        <div className="proto-textarea-placeholder">请输入患者主诉病史和检查目的</div>

        <div className="proto-form-row">
          <label className="proto-form-label required">预约时间：</label>
          <div className="proto-date-shortcuts">
            <button type="button">明天</button>
            <button type="button">后天</button>
          </div>
        </div>

        <button type="button" className="proto-date-card">
          <span>2026年03月23号</span>
          <span>
            今天
            <CalendarOutlined />
          </span>
        </button>

        <label className="proto-form-label required">检查项目：</label>
        <div className="proto-project-grid">
          <button type="button" className="proto-project-card add">
            <PlusOutlined />
            <span>添加项目</span>
          </button>
          <button type="button" className="proto-project-card ai">
            <span className="proto-ai-mark">AI</span>
            <span>AI项目推荐</span>
          </button>
          <button type="button" className="proto-project-card disabled">
            <CustomerServiceOutlined />
            <span>专家咨询</span>
            <small>已规划</small>
          </button>
        </div>

        <div className="proto-selected-project">
          <span className="proto-project-dot" aria-hidden="true" />
          <strong>* CT颅脑(平扫)</strong>
          <MinusCircleFilled />
        </div>
      </section>

      <div className="proto-exam-spacer" />

      <button type="button" className="proto-exam-submit">
        查询机构
      </button>

      <div className="proto-exam-owner">{ownerName}可在此完成检查检验开单</div>
    </div>
  )
}

export function FilterChip({ active, children, onClick }) {
  return (
    <button
      type="button"
      className={`proto-chip ${active ? 'active' : ''}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export function StatusBadge({ tone = 'default', children }) {
  return <span className={`proto-status proto-status--${tone}`}>{children}</span>
}

export function MetricRow({ items }) {
  return (
    <div className="proto-metric-row">
      {items.map((item) => (
        <div key={item.label} className="proto-metric-item">
          <span>{item.label}</span>
          <strong>{item.value}</strong>
        </div>
      ))}
    </div>
  )
}

export function EmptyState({ children }) {
  return (
    <div className="proto-empty-state">
      <div className="proto-empty-dot" aria-hidden="true" />
      <span>{children}</span>
    </div>
  )
}

export function ListCard({
  eyebrow,
  title,
  status,
  statusTone = 'default',
  amount,
  amountLabel,
  meta = [],
  metrics = [],
  actions = [],
  children,
}) {
  return (
    <article className="proto-list-card">
      <div className="proto-list-card-head">
        <div className="proto-list-card-title-block">
          {eyebrow ? <div className="proto-list-card-eyebrow">{eyebrow}</div> : null}
          <div className="proto-list-card-title">{title}</div>
        </div>
        {status ? <StatusBadge tone={statusTone}>{status}</StatusBadge> : null}
      </div>

      {amount ? (
        <div className="proto-list-card-amount">
          <span>{amountLabel}</span>
          <strong>{amount}</strong>
        </div>
      ) : null}

      {meta.length ? (
        <div className="proto-meta-grid">
          {meta.map((item) => (
            <div key={item.label} className="proto-meta-item">
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </div>
      ) : null}

      {metrics.length ? <MetricRow items={metrics} /> : null}

      {children}

      {actions.length ? (
        <div className="proto-card-actions">
          {actions.map((action) => (
            <button
              key={action.label}
              type="button"
              className={`proto-action-button ${action.variant === 'primary' ? 'primary' : ''}`}
              onClick={action.onClick}
            >
              {action.label}
            </button>
          ))}
        </div>
      ) : null}
    </article>
  )
}
