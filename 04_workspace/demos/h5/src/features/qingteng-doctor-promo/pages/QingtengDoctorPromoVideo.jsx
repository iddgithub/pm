import { useEffect, useMemo, useRef, useState } from 'react'
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  FileDoneOutlined,
  MedicineBoxOutlined,
  MobileOutlined,
  PlayCircleFilled,
  PauseCircleFilled,
  QrcodeOutlined,
  SafetyCertificateOutlined,
  TeamOutlined,
  UserOutlined,
  WalletOutlined,
} from '@ant-design/icons'
import { TOTAL_DURATION, scenes, sourceAssets } from '../data/scenes'
import './qingtengDoctorPromoVideo.css'

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

function getInitialTime() {
  const params = new URLSearchParams(window.location.search)
  const timeParam = Number(params.get('t') ?? 0)
  return Number.isFinite(timeParam) ? clamp(timeParam, 0, TOTAL_DURATION) : 0
}

function useVideoClock() {
  const [time, setTime] = useState(getInitialTime)
  const [playing, setPlaying] = useState(false)
  const startedAtRef = useRef(0)
  const baseTimeRef = useRef(0)

  useEffect(() => {
    if (!playing) return undefined

    startedAtRef.current = performance.now()
    baseTimeRef.current = time
    let frameId = 0

    const tick = (now) => {
      const nextTime = clamp(baseTimeRef.current + (now - startedAtRef.current) / 1000, 0, TOTAL_DURATION)
      setTime(nextTime)
      if (nextTime >= TOTAL_DURATION) {
        setPlaying(false)
        return
      }
      frameId = requestAnimationFrame(tick)
    }

    frameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameId)
  }, [playing, time])

  const seek = (nextTime) => {
    setTime(clamp(nextTime, 0, TOTAL_DURATION))
    baseTimeRef.current = clamp(nextTime, 0, TOTAL_DURATION)
    startedAtRef.current = performance.now()
  }

  const toggle = () => {
    if (time >= TOTAL_DURATION) {
      setTime(0)
      baseTimeRef.current = 0
    }
    setPlaying((value) => !value)
  }

  return { time, playing, seek, toggle }
}

function getCurrentScene(time) {
  return scenes.find((scene) => time >= scene.start && time < scene.end) ?? scenes[scenes.length - 1]
}

function getSceneProgress(scene, time) {
  return clamp((time - scene.start) / (scene.end - scene.start), 0, 1)
}

function SceneHeader({ scene, progress }) {
  return (
    <header className="promo-scene-header">
      <div className="promo-brand">
        <span className="promo-brand-mark">青</span>
        <span>青藤医生平台</span>
      </div>
      <div className="promo-scene-count">
        <span>{scene.index}</span>
        <i style={{ transform: `scaleX(${progress})` }} />
      </div>
    </header>
  )
}

function FlowLoop({ progress }) {
  const nodes = [
    { label: '患者预约支付', icon: <MobileOutlined /> },
    { label: '到院检查', icon: <MedicineBoxOutlined /> },
    { label: '报告回传', icon: <FileDoneOutlined /> },
    { label: '医生解读', icon: <UserOutlined /> },
    { label: '患者管理', icon: <TeamOutlined /> },
  ]

  return (
    <div className="flow-loop">
      <div className="loop-center">
        <strong>患者检查服务闭环</strong>
        <span>预约 · 检查 · 报告 · 解读 · 管理</span>
      </div>
      {nodes.map((node, index) => (
        <div
          key={node.label}
          className={`loop-node loop-node-${index + 1} ${progress > index * 0.16 ? 'is-lit' : ''}`}
        >
          <em>{node.icon}</em>
          <span>{node.label}</span>
        </div>
      ))}
      <div className="loop-orbit" />
    </div>
  )
}

function OnboardingSteps({ progress }) {
  const steps = [
    { title: '签署劳务协议', meta: '规范合作基础', icon: <FileDoneOutlined /> },
    { title: '运营扫码提交信息', meta: '协助完成资料', icon: <QrcodeOutlined /> },
    { title: '审核通过开通服务', meta: '进入医生端', icon: <SafetyCertificateOutlined /> },
  ]

  return (
    <div className="onboarding-steps">
      {steps.map((step, index) => (
        <div key={step.title} className={`step-card ${progress > index * 0.26 ? 'is-active' : ''}`}>
          <div className="step-index">0{index + 1}</div>
          <div className="step-icon">{step.icon}</div>
          <strong>{step.title}</strong>
          <span>{step.meta}</span>
        </div>
      ))}
    </div>
  )
}

function ServiceMode({ progress }) {
  return (
    <div className="service-mode">
      <div className="consult-illustration">
        <div className="person doctor-person">
          <UserOutlined />
          <span>医生</span>
        </div>
        <div className="consult-line">
          <i style={{ transform: `scaleX(${progress})` }} />
          <span>沟通服务场景</span>
        </div>
        <div className="person operator-person">
          <TeamOutlined />
          <span>运营</span>
        </div>
      </div>
      <div className="support-stack">
        {['运营协助', '平台赋能', '流程支持', '物料引导'].map((item, index) => (
          <span key={item} className={progress > index * 0.18 ? 'is-active' : ''}>
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

function PhoneShell({ children, label = '一脉青藤' }) {
  return (
    <div className="phone-shell">
      <div className="phone-speaker" />
      <div className="phone-screen">
        <div className="mini-app-header">
          <span>{label}</span>
          <i />
        </div>
        {children}
      </div>
    </div>
  )
}

function PatientBooking({ progress }) {
  const steps = [
    '扫码进入',
    '自助检查',
    '选择项目',
    '填写主诉',
    '预约时间',
    '就近机构',
    '就诊信息',
    '支付成功',
    '到院检查',
    '报告提醒',
  ]
  const active = Math.min(Math.floor(progress * steps.length), steps.length - 1)

  return (
    <div className="booking-layout">
      <PhoneShell>
        <div className="booking-hero">
          <QrcodeOutlined />
          <strong>{steps[active]}</strong>
          <span>{active < 7 ? '患者端自助预约流程' : '报告回传至平台'}</span>
        </div>
        <div className="booking-form">
          <label>检查项目</label>
          <div className="select-row">胸部 CT 平扫 <CheckCircleOutlined /></div>
          <label>预约机构</label>
          <div className="select-row">就近交付中心 <ClockCircleOutlined /></div>
          <button type="button">{active >= 7 ? '预约成功' : '确认提交'}</button>
        </div>
      </PhoneShell>
      <div className="booking-rail">
        {steps.map((step, index) => (
          <span key={step} className={index <= active ? 'is-active' : ''}>
            {index + 1}. {step}
          </span>
        ))}
      </div>
    </div>
  )
}

function DoctorReport({ progress }) {
  const active = Math.min(Math.floor(progress * 4), 3)
  const states = ['待解读任务', '查看详情', 'AI 辅助确认', '完成解读']

  return (
    <div className="doctor-report">
      <PhoneShell label="医生端">
        <div className="task-topline">
          <span>我的任务</span>
          <strong>{active >= 3 ? '已完成' : '待处理'}</strong>
        </div>
        <div className="task-card">
          <span className="task-status">{states[active]}</span>
          <strong>报告解读服务</strong>
          <p>模拟患者 A · 影像报告已回传</p>
          <div className="ai-note">AI 辅助信息仅供医生确认参考</div>
        </div>
      </PhoneShell>
      <div className="report-panels">
        {states.map((state, index) => (
          <span key={state} className={index <= active ? 'is-active' : ''}>
            {state}
          </span>
        ))}
      </div>
    </div>
  )
}

function WithdrawFlow({ progress }) {
  const steps = ['完成报告解读', '生成劳务费明细', '发起提现', '平台审核', '完成打款']
  const active = Math.min(Math.floor(progress * steps.length), steps.length - 1)

  return (
    <div className="withdraw-flow">
      <div className="fee-card">
        <span>规范劳务费明细</span>
        <strong>¥128.00</strong>
        <p>模拟数据 · 已完成 2 项报告解读服务</p>
      </div>
      <div className="withdraw-chain">
        {steps.map((step, index) => (
          <div key={step} className={index <= active ? 'is-active' : ''}>
            <CheckCircleOutlined />
            <span>{step}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function FutureMap({ progress }) {
  const items = ['医生个人 IP', '患者资源沉淀', 'AI 数字分身', '院后管理', '复查提醒', '长期服务']
  return (
    <div className="future-map">
      {items.map((item, index) => (
        <div key={item} className={progress > index * 0.13 ? 'is-active' : ''}>
          <span>{item}</span>
        </div>
      ))}
      <div className="future-core">
        <strong>持续服务价值</strong>
        <span>规范、长期、可管理</span>
      </div>
    </div>
  )
}

function EndingScene() {
  return (
    <div className="ending-scene">
      <div className="ending-logo">青藤医生平台</div>
      <div className="dual-loop">
        <span>医生端</span>
        <i />
        <span>患者端</span>
      </div>
      <h2>让医生服务更规范</h2>
      <p>让患者管理更持续</p>
    </div>
  )
}

function SceneVisual({ scene, progress }) {
  if (scene.id === 'value-loop') return <FlowLoop progress={progress} />
  if (scene.id === 'onboarding') return <OnboardingSteps progress={progress} />
  if (scene.id === 'service-mode') return <ServiceMode progress={progress} />
  if (scene.id === 'patient-booking') return <PatientBooking progress={progress} />
  if (scene.id === 'doctor-report') return <DoctorReport progress={progress} />
  if (scene.id === 'withdraw') return <WithdrawFlow progress={progress} />
  if (scene.id === 'future') return <FutureMap progress={progress} />
  return <EndingScene />
}

function Subtitle({ scene, progress }) {
  const captionIndex = Math.min(Math.floor(progress * scene.captions.length), scene.captions.length - 1)
  return (
    <div className="promo-subtitle">
      <span>{scene.captions[captionIndex]}</span>
    </div>
  )
}

function VideoStage({ time }) {
  const scene = getCurrentScene(time)
  const progress = getSceneProgress(scene, time)

  return (
    <section className={`promo-stage scene-${scene.id}`} style={{ '--scene-progress': progress }}>
      {/* Scene timeline: each scene is selected by current video seconds from scenes.js. */}
      <SceneHeader scene={scene} progress={progress} />
      <div className="promo-copy-block">
        <span>{scene.index}</span>
        <h1>{scene.title}</h1>
        <p>{scene.subtitle}</p>
      </div>
      <SceneVisual scene={scene} progress={progress} />
      <div className="keyword-strip">
        {scene.keywords.map((keyword) => (
          <strong key={keyword}>{keyword}</strong>
        ))}
      </div>
      <Subtitle scene={scene} progress={progress} />
    </section>
  )
}

function Timeline({ time, seek }) {
  return (
    <div className="promo-timeline">
      {scenes.map((scene) => (
        <button
          key={scene.id}
          type="button"
          className={time >= scene.start && time < scene.end ? 'is-active' : ''}
          style={{ flexGrow: scene.end - scene.start }}
          onClick={() => seek(scene.start)}
          title={`${scene.title} ${scene.start}-${scene.end}s`}
        >
          <span>{scene.index}</span>
        </button>
      ))}
    </div>
  )
}

export default function QingtengDoctorPromoVideo() {
  const { time, playing, seek, toggle } = useVideoClock()
  const currentScene = getCurrentScene(time)
  const renderStageOnly = new URLSearchParams(window.location.search).get('render') === 'stage'
  const sceneRows = useMemo(
    () =>
      scenes.map((scene) => ({
        ...scene,
        duration: scene.end - scene.start,
      })),
    [],
  )

  if (renderStageOnly) {
    return (
      <main className="promo-render-page">
        <VideoStage time={time} />
      </main>
    )
  }

  return (
    <main className="promo-video-page">
      <section className="video-plan-panel">
        <div>
          <span className="plan-label">视频方案</span>
          <h1>青藤医生入驻推广视频</h1>
          <p>
            9:16 竖版，70 秒。以流程图、卡片、手机 UI 和轻商务动效表达医生入驻、患者预约、报告解读、提现与院后管理愿景。
          </p>
        </div>
        <div className="plan-meta">
          <span>1080 x 1920</span>
          <span>70s</span>
          <span>医疗 · 商务 · 可信</span>
        </div>
      </section>

      <section className="promo-workbench">
        <div className="stage-shell">
          <VideoStage time={time} />
        </div>

        <aside className="promo-controls">
          <button type="button" className="play-button" onClick={toggle}>
            {playing ? <PauseCircleFilled /> : <PlayCircleFilled />}
            <span>{playing ? '暂停预览' : '播放预览'}</span>
          </button>
          <input
            aria-label="视频进度"
            type="range"
            min="0"
            max={TOTAL_DURATION}
            step="0.1"
            value={time}
            onChange={(event) => seek(Number(event.target.value))}
          />
          <div className="time-readout">
            <strong>{time.toFixed(1)}s</strong>
            <span>/ {TOTAL_DURATION}s</span>
          </div>
          <Timeline time={time} seek={seek} />
          <div className="current-scene">
            <span>当前段落</span>
            <strong>{currentScene.title}</strong>
            <p>{currentScene.voiceover}</p>
          </div>
        </aside>
      </section>

      <section className="scene-sheet">
        <h2>Scene 清单</h2>
        <div className="scene-grid">
          {sceneRows.map((scene) => (
            <article key={scene.id}>
              <span>
                {scene.start}-{scene.end}s · {scene.duration}s
              </span>
              <h3>{scene.title}</h3>
              <p>{scene.visual}</p>
              <small>{scene.voiceover}</small>
            </article>
          ))}
        </div>
      </section>

      <section className="asset-sheet">
        <h2>已接入素材</h2>
        <div className="asset-list">
          {sourceAssets.map((asset) => (
            <div key={asset.path}>
              <strong>{asset.name}</strong>
              <span>{asset.path}</span>
              <p>{asset.usage}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
