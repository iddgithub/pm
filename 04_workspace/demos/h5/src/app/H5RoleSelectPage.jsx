import { ArrowRightOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

const roleCards = [
  {
    key: 'doctor',
    route: '/doctor',
    label: '医生端 H5',
    title: '医生端',
    summary: '签约申请、开单业务、报告解读费与患者维护。',
    pages: ['我的管理', '医生报告解读费', '我的患者'],
    metrics: [
      { label: '报告解读费', value: '2000元' },
      { label: '患者数', value: '80人' },
    ],
  },
  {
    key: 'operator',
    route: '/operator',
    label: '运营端 H5',
    title: '运营端',
    summary: '医生绑定、开单跟进、运营提成与医生管理。',
    pages: ['我的管理', '我的提成', '我的医生'],
    metrics: [
      { label: '我的提成', value: '2000元' },
      { label: '医生数', value: '10人' },
    ],
  },
]

function EntryBrand() {
  return (
    <div className="entry-brand">
      <div className="entry-brand-mark" aria-hidden="true">
        <span />
      </div>
      <div>
        <div className="entry-brand-name">一脉青藤</div>
        <div className="entry-brand-subtitle">H5 演示入口</div>
      </div>
    </div>
  )
}

export default function H5RoleSelectPage() {
  const navigate = useNavigate()

  return (
    <main className="role-select-shell">
      <section className="role-select-hero">
        <EntryBrand />
        <div className="role-select-copy">
          <div className="role-select-kicker">运营 / 医生激励方案</div>
          <h1>选择要查看的 H5 端</h1>
          <p>两个入口共用同一套高保真原型风格，便于对照医生视角和运营视角的一层页面结构。</p>
        </div>
      </section>

      <section className="role-select-grid" aria-label="H5 端选择">
        {roleCards.map((role) => (
          <button
            key={role.key}
            type="button"
            className={`role-card role-card--${role.key}`}
            onClick={() => navigate(role.route)}
          >
            <span className="role-card-eyebrow">{role.label}</span>
            <span className="role-card-title-row">
              <span>{role.title}</span>
              <ArrowRightOutlined />
            </span>
            <span className="role-card-summary">{role.summary}</span>

            <span className="role-card-pages">
              {role.pages.map((page) => (
                <span key={page}>{page}</span>
              ))}
            </span>

            <span className="role-card-metrics">
              {role.metrics.map((metric) => (
                <span key={metric.label} className="role-card-metric">
                  <span>{metric.label}</span>
                  <strong>{metric.value}</strong>
                </span>
              ))}
            </span>
          </button>
        ))}
      </section>
    </main>
  )
}
