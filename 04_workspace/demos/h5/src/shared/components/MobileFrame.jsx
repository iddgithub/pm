export default function MobileFrame({ title, pageKey, tabs, canBack = false, onBack, onTabChange, children }) {
  return (
    <div className="mobile-stage">
      <div className="mobile-device">
        <header className="mobile-header">
          <div className="mobile-status">
            <span>9:41</span>
            <span>5G</span>
          </div>
          <div className="mobile-title-row">
            <button
              type="button"
              className={`mobile-back ${canBack ? 'visible' : ''}`}
              onClick={onBack}
            >
              返回
            </button>
            <div className="mobile-title">{title}</div>
            <div className="mobile-back-placeholder" />
          </div>
        </header>
        <main className="mobile-content">{children}</main>
        <nav className="mobile-tabbar">
          {tabs.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              className={`mobile-tab ${pageKey === key ? 'active' : ''}`}
              onClick={() => onTabChange(key)}
            >
              {label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  )
}
