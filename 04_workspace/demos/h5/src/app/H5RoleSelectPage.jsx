import { ArrowRightOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

const roleCards = [
  {
    key: 'rimag-order-detail',
    route: '/doctor-ordering/rimag-order-detail',
    label: '患者端订单详情',
    title: '订单详情',
    summary: '按一脉阳光影像中心截图复刻的患者支付订单页，含添加就诊人、选择受检时间和支付反馈。',
    pages: ['机构说明', '检查费用', '支付订单'],
    metrics: [
      { label: '预约日期', value: '07月08号' },
      { label: '总金额', value: '990元' },
    ],
  },
  {
    key: 'promo-video',
    route: '/qingteng-doctor-promo-video',
    label: '竖版视频工程',
    title: '推广视频',
    summary: '青藤医生入驻推广视频，70 秒竖版时间轴、字幕、动效与 scene 清单。',
    pages: ['患者检查闭环', '医生入驻', '报告解读与提现'],
    metrics: [
      { label: '视频时长', value: '70秒' },
      { label: 'Scene 数', value: '8段' },
    ],
  },
  {
    key: 'doctor',
    route: '/doctor-reporting',
    label: '医生端 H5',
    title: '医生端',
    summary: '检查检验、报告确认、服务费提现与提现记录。',
    pages: ['我的管理', '确认报告', '提现记录'],
    metrics: [
      { label: '总解读服务费', value: '788元' },
      { label: '待确认报告', value: '1份' },
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
