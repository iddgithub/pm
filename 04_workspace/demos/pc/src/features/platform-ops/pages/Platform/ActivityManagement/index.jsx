import { useMemo, useState, useRef, useEffect } from 'react'
import {
  ConfigProvider,
  Button,
  Card,
  DatePicker,
  Descriptions,
  Empty,
  Form,
  Input,
  InputNumber,
  Modal,
  Popover,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from 'antd'
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  StopOutlined,
  CloseOutlined,
} from '@ant-design/icons'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { createPortal } from 'react-dom'
import dayjs from 'dayjs'
import {
  ACTIVITY_MANAGEMENT_BASE_PATH,
  ACTIVITY_MANAGEMENT_SHARE_BASE_PATH,
} from '../../../../../routes/pcRoutes'
import './ActivityManagement.css'

const { Paragraph, Text } = Typography

// 标注数据
const ANNOTATIONS = [
  {
    id: 1,
    title: '需求描述：活动列表页',
    content: `**功能描述**：展示活动管理总览，支持查看活动基础信息并执行查看、编辑、上架/下架、删除操作。

**页面模块**：
- 页面标题：活动管理
- 页面副标题：统一由示例运营账号创建；一个活动可绑定同一渠道下多个机构，每个机构独立维护项目活动价。
- 顶部操作：新建活动按钮
- 表格字段：序号、活动名称、所属渠道、所属机构、机构数、活动项目数、活动时间、状态、创建人、更新时间、操作

**交互行为**：
- 点击"新建活动"进入新建页
- 点击"查看"进入详情页
- 点击"编辑"进入编辑页
- 点击"下架"弹出确认框，确认后将活动状态更新为"已下架"
- 点击"上架"弹出确认框，确认后将活动状态更新为"已上架"
- 点击"删除"弹出危险确认框，确认后删除活动且不可恢复

**状态规则**：
- 已下架：手动下架，或活动结束时间早于当前时间
- 已上架：活动未开始但已保存上架，开始时间晚于当前时间
- 进行中：当前时间处于活动开始和结束时间之间，且未手动下架`
  },
  {
    id: 2,
    title: '需求描述：基础信息表单',
    content: `**基础信息表单**：
- 字段：
  - 活动名称：输入框，必填，最大长度 30
  - 所属渠道：单选下拉，必填
  - 所属机构：多选下拉，必填，需先选择所属渠道后可选
  - 活动时间：起止时间范围选择，必填
  - 活动说明：多行文本，必填，最大长度 120

**保存校验规则**：
- 活动名称不能为空
- 活动说明不能为空
- 所属渠道不能为空
- 所属机构至少选择 1 个
- 活动开始和结束时间必须完整选择
- 结束时间必须晚于开始时间
- 每个已选机构至少添加 1 个检查项目
- 每个已选机构的每个检查项目都必须填写活动价
- 同一渠道下，同一机构的同一检查项目在相同时间内只能存在一个活动价`
  },
  {
    id: 3,
    title: '需求描述：机构项目活动价模块',
    content: `**机构项目活动价模块**：
- 模块目标：按机构分别维护活动项目和活动价
- 模块说明：当前渠道下，每个机构独立配置项目和活动价；活动价只作用在该渠道下的当前机构
- 机构切换：当所属机构有多个时，以切换按钮形式展示已选机构
- 表格字段：项目名称、编码、原价、活动价、操作
- 操作说明：点击"添加检查项目"打开一级平台项目库弹窗；在已选项目表格中可编辑活动价；在已选项目表格中可点击"移除"移除项目`
  },
  {
    id: 4,
    title: '需求描述：一级平台项目库弹窗',
    content: `**一级平台项目库弹窗**：
- 功能描述：从标准检查项目库中为当前机构选择活动项目
- 标题：一级平台项目库
- 冲突提示：同渠道下，当前机构在所选活动时间内已被其他活动占用的项目将禁止选择，避免活动价格冲突
- 查询区字段：检查类型、编码/名称关键字
- 行选择规则：
  - 已添加到当前机构的项目禁选
  - 当前机构未选中时全部禁选
  - 与其他活动冲突的项目禁选，并显示冲突活动名称与时间提示`
  },
  {
    id: 5,
    title: '需求描述：活动详情页',
    content: `**活动详情页**：
- 功能描述：查看活动的基础信息、机构范围和每个机构下的项目活动价，并可从详情页返回、编辑或下架活动

**基础信息区域**：
- 展示字段：活动名称、所属渠道、活动状态、活动时间、创建人、更新时间、所属机构、机构数、活动项目数、活动说明
- 状态展示：使用标签展示"已上架 / 进行中 / 已下架"

**机构活动项目价格区域**：
- 机构切换：展示该活动下全部机构按钮，点击切换当前查看机构
- 表格字段：项目名称、所属分类、编码、检查类型、原价、活动价、价格变化`
  }
]

// 可标注的容器组件
function Annotatable({ id, children }) {
  const containerRef = useRef(null)
  const [showTooltip, setShowTooltip] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const annotation = ANNOTATIONS.find(a => a.id === id)

  const handleMouseEnter = (e) => {
    setShowTooltip(true)
    const rect = e.currentTarget.getBoundingClientRect()
    setTooltipPosition({
      top: rect.bottom + window.scrollY + 8,
      left: rect.left + window.scrollX
    })
  }

  const handleTooltipMouseDown = (e) => {
    if (e.target.closest('.tooltip-close')) return
    setIsDragging(true)
    setDragOffset({
      x: e.clientX - tooltipPosition.left,
      y: e.clientY - tooltipPosition.top
    })
  }

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        setTooltipPosition({
          top: e.clientY - dragOffset.y,
          left: e.clientX - dragOffset.x
        })
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, dragOffset])

  const renderMarkdown = (content) => {
    return content.split('\n').map((line, idx) => {
      let processedLine = line
      processedLine = processedLine.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      processedLine = processedLine.replace(/\*(.*?)\*/g, '<em>$1</em>')
      processedLine = processedLine.replace(/^- /, '&bull; ')

      return <p key={idx} dangerouslySetInnerHTML={{ __html: processedLine }} />
    })
  }

  return (
    <div ref={containerRef} style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
      {children}
      {annotation && (
        <>
          <div
            className="annotation-badge"
            style={{
              position: 'absolute',
              top: -8,
              right: -4,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgb(250, 173, 20)',
              color: '#fff',
              fontSize: '10px',
              fontWeight: 'bold',
              lineHeight: '14px',
              padding: '0 4px',
              borderRadius: '2px',
              border: '0',
              cursor: 'pointer',
              zIndex: 1000
            }}
            onMouseEnter={handleMouseEnter}
          >
            {id}
          </div>
          {showTooltip && typeof document !== 'undefined' && createPortal(
            <div
              className="annotation-tooltip"
              style={{
                position: 'fixed',
                top: tooltipPosition.top,
                left: tooltipPosition.left,
                background: '#f0efef',
                borderRadius: '4px',
                width: '450px',
                maxHeight: '80vh',
                overflow: 'auto',
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                zIndex: 9999,
                cursor: 'move'
              }}
              onMouseDown={handleTooltipMouseDown}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 16px',
                borderBottom: '1px solid #ddd',
                position: 'sticky',
                top: 0,
                background: '#f0efef',
                zIndex: 1
              }}>
                <span style={{ fontWeight: 600, color: '#333', fontSize: '14px' }}>
                  [{id}] {annotation.title}
                </span>
                <button
                  className="tooltip-close"
                  onClick={() => setShowTooltip(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '16px',
                    color: '#666',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <CloseOutlined />
                </button>
              </div>
              <div style={{ padding: '16px', lineHeight: '1.6' }}>
                {renderMarkdown(annotation.content)}
              </div>
            </div>,
            document.body
          )}
        </>
      )}
    </div>
  )
}

const { RangePicker } = DatePicker

const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm'

const STORAGE_KEY_BACKSTAGE = 'pm-agent-activity-management-v6'
const STORAGE_KEY_SHARE = 'pm-agent-activity-management-share-v4'
const DEMO_OPERATOR_NAME = '运营账号A'

const channels = [
  { label: '渠道A', value: 'channel-qt' },
  { label: '渠道B', value: 'channel-ant' },
  { label: '渠道C', value: 'channel-pa' },
]

const institutionsByChannel = {
  'channel-qt': [
    { label: '机构A-01', value: 'org-qt-001' },
    { label: '机构A-02', value: 'org-qt-002' },
    { label: '机构A-03', value: 'org-qt-003' },
    { label: '机构A-04', value: 'org-qt-004' },
  ],
  'channel-ant': [
    { label: '机构B-01', value: 'org-ant-001' },
    { label: '机构B-02', value: 'org-ant-002' },
    { label: '机构B-03', value: 'org-ant-003' },
    { label: '机构B-04', value: 'org-ant-004' },
  ],
  'channel-pa': [
    { label: '机构C-01', value: 'org-pa-001' },
    { label: '机构C-02', value: 'org-pa-002' },
    { label: '机构C-03', value: 'org-pa-003' },
    { label: '机构C-04', value: 'org-pa-004' },
    { label: '机构C-05', value: 'org-pa-005' },
  ],
}

const standardProjects = [
  { id: 'p-001', name: 'CT门控钙化积分辅助诊断', category: '心脏', code: 'PKG006', type: 'CT', originPrice: 200 },
  { id: 'p-002', name: 'CT骨密度辅助诊断', category: '脊柱', code: 'PKG012', type: 'CT', originPrice: 180 },
  { id: 'p-003', name: '骨龄DR量化评估', category: '骨关节', code: 'PKG018', type: 'DR', originPrice: 120 },
  { id: 'p-004', name: '癌症筛查影像分析', category: '癌症筛查', code: 'PKG026', type: 'MR', originPrice: 360 },
  { id: 'p-005', name: '头颅MRI平扫', category: '神经系统', code: 'PKG031', type: 'MR', originPrice: 280 },
  { id: 'p-006', name: '肺结节AI辅助筛查', category: '胸部', code: 'PKG040', type: 'CT', originPrice: 160 },
]

const defaultActivityPriceMap = {
  'p-001': 160,
}

const seedActivities = [
  {
    id: 'act-001',
    name: '示例活动01',
    description: '示例活动说明，用于演示阶段性活动价格配置。',
    channelId: 'channel-qt',
    institutionIds: ['org-qt-001', 'org-qt-002'],
    startAt: '2026-05-01 00:00',
    endAt: '2026-06-10 23:59',
    status: 'listed',
    creator: DEMO_OPERATOR_NAME,
    updatedAt: '2026-05-08 14:20',
    institutionConfigs: {
      'org-qt-001': [
        { projectId: 'p-001', activityPrice: 168 },
        { projectId: 'p-002', activityPrice: 158 },
      ],
      'org-qt-002': [
        { projectId: 'p-001', activityPrice: 169 },
        { projectId: 'p-006', activityPrice: 129 },
      ],
    },
    logs: [
      { action: '创建活动', operator: DEMO_OPERATOR_NAME, at: '2026-05-08 13:50', detail: '创建示例活动并完成基础配置' },
      { action: '上架活动', operator: DEMO_OPERATOR_NAME, at: '2026-05-08 14:20', detail: '上架示例活动并展示活动价格' },
    ],
  },
  {
    id: 'act-002',
    name: '肺结节专项活动价格',
    description: '面向机构配置肺结节 AI 辅助筛查项目活动价。',
    channelId: 'channel-ant',
    institutionIds: ['org-ant-002'],
    startAt: '2026-05-18 00:00',
    endAt: '2026-05-31 23:59',
    status: 'listed',
    creator: DEMO_OPERATOR_NAME,
    updatedAt: '2026-05-07 18:10',
    institutionConfigs: {
      'org-ant-002': [
        { projectId: 'p-006', activityPrice: 139 },
      ],
    },
    logs: [
      { action: '创建并上架活动', operator: DEMO_OPERATOR_NAME, at: '2026-05-07 18:10', detail: '创建示例活动并直接上架' },
    ],
  },
  {
    id: 'act-003',
    name: '骨密度检查五月活动',
    description: '示例活动说明，用于演示骨密度检查活动价格配置。',
    channelId: 'channel-pa',
    institutionIds: ['org-pa-001', 'org-pa-003'],
    startAt: '2026-05-06 00:00',
    endAt: '2026-05-20 23:59',
    status: 'listed',
    creator: DEMO_OPERATOR_NAME,
    updatedAt: '2026-05-06 09:42',
    institutionConfigs: {
      'org-pa-001': [
        { projectId: 'p-002', activityPrice: 169 },
        { projectId: 'p-003', activityPrice: 99 },
      ],
      'org-pa-003': [
        { projectId: 'p-003', activityPrice: 105 },
      ],
    },
    logs: [
      { action: '创建并上架活动', operator: DEMO_OPERATOR_NAME, at: '2026-05-06 09:42', detail: '创建示例活动并直接上架' },
    ],
  },
  {
    id: 'act-004',
    name: '示例活动04',
    description: '因机构侧活动暂停，运营已手动下架。',
    channelId: 'channel-qt',
    institutionIds: ['org-qt-004'],
    startAt: '2026-04-20 00:00',
    endAt: '2026-05-25 23:59',
    status: 'offline',
    creator: DEMO_OPERATOR_NAME,
    updatedAt: '2026-05-04 16:35',
    institutionConfigs: {
      'org-qt-004': [
        { projectId: 'p-004', activityPrice: 328 },
      ],
    },
    logs: [
      { action: '创建并上架活动', operator: DEMO_OPERATOR_NAME, at: '2026-04-20 10:00', detail: '创建示例活动并直接上架' },
      { action: '下架活动', operator: DEMO_OPERATOR_NAME, at: '2026-05-04 16:35', detail: '下架示例活动并恢复默认价格' },
    ],
  },
  {
    id: 'act-005',
    name: '头颅MRI专项活动',
    description: '示例活动说明，用于演示头颅 MRI 阶段性活动价配置。',
    channelId: 'channel-pa',
    institutionIds: ['org-pa-002'],
    startAt: '2026-06-15 00:00',
    endAt: '2026-06-30 23:59',
    status: 'listed',
    creator: DEMO_OPERATOR_NAME,
    updatedAt: '2026-05-08 10:30',
    institutionConfigs: {
      'org-pa-002': [
        { projectId: 'p-005', activityPrice: 260 },
      ],
    },
    logs: [
      { action: '创建并上架活动', operator: DEMO_OPERATOR_NAME, at: '2026-05-08 10:30', detail: '创建示例活动并直接上架' },
    ],
  },
]

const statusMeta = {
  listed: { label: '已上架', className: 'activity-status-listed', tagColor: 'blue' },
  running: { label: '进行中', className: 'activity-status-running', tagColor: 'green' },
  offline: { label: '已下架', className: 'activity-status-offline', tagColor: 'orange' },
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function isSharePath(pathname) {
  return pathname.startsWith(ACTIVITY_MANAGEMENT_SHARE_BASE_PATH)
}

function getActivityBasePath(pathname) {
  return isSharePath(pathname) ? ACTIVITY_MANAGEMENT_SHARE_BASE_PATH : ACTIVITY_MANAGEMENT_BASE_PATH
}

function getActivityStorageKey(pathname) {
  return isSharePath(pathname) ? STORAGE_KEY_SHARE : STORAGE_KEY_BACKSTAGE
}

function isCreatePath(pathname, basePath) {
  return pathname === `${basePath}/create`
}

function isEditPath(pathname, basePath) {
  return new RegExp(`^${escapeRegExp(basePath)}/edit/[^/]+$`).test(pathname)
}

function isDetailPath(pathname, basePath) {
  return new RegExp(`^${escapeRegExp(basePath)}/[^/]+$`).test(pathname)
}

function getDemoActivityCode(activityId, index) {
  const digits = String(activityId || '').replace(/\D/g, '')
  return digits ? digits.slice(-2).padStart(2, '0') : String(index + 1).padStart(2, '0')
}

function getDemoActivityName(activityId, index) {
  return `示例活动${getDemoActivityCode(activityId, index)}`
}

function getDemoLogDetail(action) {
  if (action.includes('创建') && action.includes('上架')) return '创建示例活动并直接上架'
  if (action.includes('创建')) return '创建示例活动并完成基础配置'
  if (action.includes('编辑')) return '更新示例活动配置'
  if (action.includes('上架')) return '上架示例活动并展示活动价格'
  if (action.includes('下架')) return '下架示例活动并恢复默认价格'
  return '更新示例活动配置'
}

function sanitizeActivitiesForDemo(activities = []) {
  return activities.map((activity, index) => ({
    ...activity,
    name: getDemoActivityName(activity.id, index),
    description: '示例活动说明，用于直播演示后台活动配置与价格维护流程。',
    creator: DEMO_OPERATOR_NAME,
    logs: (activity.logs || []).map((log) => ({
      ...log,
      operator: DEMO_OPERATOR_NAME,
      detail: getDemoLogDetail(log.action || ''),
    })),
  }))
}

function cloneSeedActivities() {
  return sanitizeActivitiesForDemo(JSON.parse(JSON.stringify(seedActivities)))
}

function loadActivities(storageKey) {
  if (typeof window === 'undefined') return cloneSeedActivities()
  const saved = window.localStorage.getItem(storageKey)
  if (!saved) return cloneSeedActivities()
  try {
    return sanitizeActivitiesForDemo(JSON.parse(saved))
  } catch {
    return cloneSeedActivities()
  }
}

function saveActivities(storageKey, activities) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(storageKey, JSON.stringify(sanitizeActivitiesForDemo(activities)))
}

function now() {
  return dayjs().format(DATE_TIME_FORMAT)
}

function getChannelName(id) {
  return channels.find((item) => item.value === id)?.label || '-'
}

function getInstitutionsByChannel(channelId) {
  return institutionsByChannel[channelId] || []
}

function getInstitutionName(id) {
  return Object.values(institutionsByChannel)
    .flat()
    .find((item) => item.value === id)?.label || '-'
}

function getInstitutionSummary(ids = []) {
  const names = ids.map(getInstitutionName).filter(Boolean)
  if (!names.length) return '-'
  if (names.length <= 2) return names.join('、')
  return `${names.slice(0, 2).join('、')} 等${names.length}家`
}

function getInstitutionProjectCount(activity) {
  return Object.values(activity.institutionConfigs || {}).reduce((sum, configs) => sum + configs.length, 0)
}

function getInstitutionConfigMap(activity) {
  return Object.fromEntries(
    Object.entries(activity.institutionConfigs || {}).map(([institutionId, configs]) => (
      [institutionId, Object.fromEntries(configs.map((item) => [item.projectId, item.activityPrice]))]
    )),
  )
}

function toInstitutionConfigs(configMap, institutionIds) {
  return Object.fromEntries(
    institutionIds.map((institutionId) => {
      const projectMap = configMap[institutionId] || {}
      return [institutionId, Object.entries(projectMap).map(([projectId, activityPrice]) => ({ projectId, activityPrice }))]
    }),
  )
}

function getProject(projectId) {
  return standardProjects.find((item) => item.id === projectId)
}

function getDefaultActivityPrice(projectId) {
  const project = getProject(projectId)
  return defaultActivityPriceMap[projectId] ?? project?.originPrice ?? 0
}

function normalizeStatus(activity) {
  if (activity.status === 'offline') return 'offline'
  if (activity.endAt && dayjs(activity.endAt).isBefore(dayjs())) {
    return 'offline'
  }
  if (activity.startAt && dayjs(activity.startAt).isAfter(dayjs())) {
    return 'listed'
  }
  return 'running'
}

function StatusText({ status }) {
  const meta = statusMeta[status] || statusMeta.listed
  return <span className={`activity-status-dot ${meta.className}`}>{meta.label}</span>
}

function ActivityFrame({ title, subtitle, extra, children, standalone = false }) {
  return (
    <div className={`activity-page${standalone ? ' activity-page--standalone' : ''}`}>
      <div className={`activity-shell${standalone ? ' activity-shell--standalone' : ''}`}>
        <div className="activity-header">
          <div>
            <h1 className="activity-title">{title}</h1>
            {subtitle ? <div className="activity-subtitle">{subtitle}</div> : null}
          </div>
          {extra}
        </div>
        <div className="activity-content">{children}</div>
      </div>
    </div>
  )
}

function enrichActivity(activity) {
  const normalizedStatus = normalizeStatus(activity)
  return {
    ...activity,
    status: normalizedStatus,
    channelName: getChannelName(activity.channelId),
    institutionSummary: getInstitutionSummary(activity.institutionIds),
    institutionCount: activity.institutionIds?.length || 0,
    projectCount: getInstitutionProjectCount(activity),
  }
}

function useActivityStore(storageKey) {
  const [activities, setActivities] = useState(() => loadActivities(storageKey))

  const commit = (updater) => {
    setActivities((prev) => {
      const next = updater(prev)
      saveActivities(storageKey, next)
      return next
    })
  }

  return [activities, commit]
}

function canPassIntegrity(values, institutionProjectMap, activities, editingId) {
  if (!values.name?.trim()) return '请填写活动名称'
  if (!values.description?.trim()) return '请填写活动说明'
  if (!values.channelId) return '请先选择所属渠道'
  if (!values.institutionIds?.length) return '请至少选择一个所属机构'
  if (!values.timeRange?.[0] || !values.timeRange?.[1]) return '请设置活动开始和结束时间'

  const [startAt, endAt] = values.timeRange
  if (!endAt.isAfter(startAt)) return '结束时间必须晚于开始时间'

  for (const institutionId of values.institutionIds) {
    const projectMap = institutionProjectMap[institutionId] || {}
    const projectIds = Object.keys(projectMap)
    if (!projectIds.length) return `请先为机构“${getInstitutionName(institutionId)}”添加检查项目`
    const hasMissingPrice = projectIds.some((projectId) => projectMap[projectId] === null || projectMap[projectId] === undefined)
    if (hasMissingPrice) return `请为机构“${getInstitutionName(institutionId)}”填写完整活动价`
  }

  const hasConflict = activities.some((activity) => {
    if (activity.id === editingId) return false
    if (normalizeStatus(activity) === 'offline') return false
    const existingStart = dayjs(activity.startAt)
    const existingEnd = dayjs(activity.endAt)
    if (!(startAt.isBefore(existingEnd) && endAt.isAfter(existingStart))) return false

    return values.institutionIds.some((institutionId) => {
      if (!activity.institutionIds?.includes(institutionId)) return false
      const currentProjectIds = Object.keys(institutionProjectMap[institutionId] || {})
      const existingProjectIds = (activity.institutionConfigs?.[institutionId] || []).map((item) => item.projectId)
      return currentProjectIds.some((projectId) => existingProjectIds.includes(projectId))
    })
  })

  if (hasConflict) return '同一渠道下，同一机构的同一检查项目在相同时间内只能存在一个活动价'
  return ''
}

function ActivityListPage({ activities, commit, basePath, standalone }) {
  const navigate = useNavigate()
  const rows = useMemo(() => activities.map(enrichActivity), [activities])

  const updateStatus = (activity, nextStatus, label) => {
    Modal.confirm({
      title: `确认${label}`,
      content: `${label}后，相关项目价格会按当前状态同步展示。`,
      okText: `确认${label}`,
      cancelText: '取消',
      onOk: () => {
        const actionAt = now()
        commit((prev) => prev.map((item) => {
          if (item.id !== activity.id) return item
          return {
            ...item,
            status: nextStatus,
            updatedAt: actionAt,
            logs: [
              ...(item.logs || []),
              {
                action: label,
                operator: DEMO_OPERATOR_NAME,
                at: actionAt,
                detail: nextStatus === 'listed' ? '手动上架活动价格' : '手动下架并恢复机构原价格',
              },
            ],
          }
        }))
        message.success(`${label}成功`)
      },
    })
  }

  const removeActivity = (activity) => {
    Modal.confirm({
      title: '确认删除活动',
      content: `删除后将无法恢复，确定删除“${activity.name}”吗？`,
      okText: '确认删除',
      cancelText: '取消',
      okButtonProps: { danger: true },
      onOk: () => {
        commit((prev) => prev.filter((item) => item.id !== activity.id))
        message.success('活动已删除')
      },
    })
  }

  const columns = [
    { title: '序号', width: 72, render: (_, __, index) => index + 1 },
    { title: '活动名称', dataIndex: 'name', width: 210 },
    { title: '所属渠道', dataIndex: 'channelName', width: 140 },
    {
      title: '所属机构',
      width: 280,
      render: (_, row) => (
        <div className="activity-institution-brief">
          <span className="activity-institution-brief__text">{row.institutionSummary}</span>
          {row.institutionCount > 1 ? (
            <Popover
              placement="bottomLeft"
              content={(
                <div className="activity-institution-popover">
                  {row.institutionIds.map((institutionId) => (
                    <div key={institutionId} className="activity-institution-popover__item">
                      {getInstitutionName(institutionId)}
                    </div>
                  ))}
                </div>
              )}
            >
              <button type="button" className="activity-institution-brief__link">查看机构</button>
            </Popover>
          ) : null}
        </div>
      ),
    },
    { title: '机构数', dataIndex: 'institutionCount', width: 90 },
    { title: '活动项目数', dataIndex: 'projectCount', width: 110 },
    {
      title: '活动时间',
      width: 280,
      render: (_, row) => `${row.startAt} 至 ${row.endAt}`,
    },
    {
      title: '状态',
      width: 110,
      render: (_, row) => <StatusText status={row.status} />,
    },
    { title: '创建人', dataIndex: 'creator', width: 140 },
    { title: '更新时间', dataIndex: 'updatedAt', width: 160 },
    {
      title: '操作',
      fixed: 'right',
      width: 300,
      render: (_, row) => (
        <Space size={14}>
          <Button type="link" className="activity-link" icon={<EyeOutlined />} onClick={() => navigate(`${basePath}/${row.id}`)}>
            查看
          </Button>
          <Button type="link" className="activity-link" icon={<EditOutlined />} onClick={() => navigate(`${basePath}/edit/${row.id}`)}>
            编辑
          </Button>
          {row.status === 'running' || row.status === 'listed' ? (
            <Button type="link" danger icon={<StopOutlined />} onClick={() => updateStatus(row, 'offline', '下架')}>
              下架
            </Button>
          ) : (
            <Button type="link" className="activity-link" icon={<CheckCircleOutlined />} onClick={() => updateStatus(row, 'listed', '上架')}>
              上架
            </Button>
          )}
          <Button type="link" danger icon={<DeleteOutlined />} onClick={() => removeActivity(row)}>
            删除
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <Annotatable id={1}>
      <ActivityFrame
        title="活动管理"
      subtitle="统一由示例运营账号创建；一个活动可绑定同一渠道下多个机构，每个机构独立维护项目活动价。"
        extra={(
          <Button className="activity-green-btn" icon={<PlusOutlined />} onClick={() => navigate(`${basePath}/create`)}>
            新建活动
          </Button>
        )}
        standalone={standalone}
      >
        <Table
          className="activity-table"
          rowKey="id"
          columns={columns}
          dataSource={rows}
          pagination={{ pageSize: 10, showTotal: (total) => `共${total}条记录  当前显示${total}条记录` }}
          scroll={{ x: 1500 }}
        />
      </ActivityFrame>
    </Annotatable>
  )
}

function ActivityFormPage({ activities, commit, basePath, standalone }) {
  const navigate = useNavigate()
  const { id } = useParams()
  const editingActivity = activities.find((item) => item.id === id)
  const isEdit = Boolean(editingActivity)
  const [form] = Form.useForm()
  const [projectModalOpen, setProjectModalOpen] = useState(false)
  const [channelId, setChannelId] = useState(editingActivity?.channelId)
  const [selectedInstitutionIds, setSelectedInstitutionIds] = useState(() => editingActivity?.institutionIds || [])
  const [activeInstitutionId, setActiveInstitutionId] = useState(() => editingActivity?.institutionIds?.[0])
  const [institutionProjectMap, setInstitutionProjectMap] = useState(() => (
    editingActivity ? getInstitutionConfigMap(editingActivity) : {}
  ))
  const [projectKeywordInput, setProjectKeywordInput] = useState('')
  const [projectKeyword, setProjectKeyword] = useState('')
  const [projectTypeInput, setProjectTypeInput] = useState(undefined)
  const [projectType, setProjectType] = useState(undefined)
  const [librarySelectedIds, setLibrarySelectedIds] = useState([])

  const initialValues = isEdit ? {
    name: editingActivity.name,
    description: editingActivity.description,
    channelId: editingActivity.channelId,
    institutionIds: editingActivity.institutionIds,
    timeRange: [dayjs(editingActivity.startAt), dayjs(editingActivity.endAt)],
  } : {
    timeRange: [dayjs().add(1, 'day').hour(0).minute(0), dayjs().add(31, 'day').hour(23).minute(59)],
  }

  const availableInstitutions = getInstitutionsByChannel(channelId)
  const activeInstitutionName = activeInstitutionId ? getInstitutionName(activeInstitutionId) : ''
  const watchedTimeRange = Form.useWatch('timeRange', form)

  const conflictProjectMap = useMemo(() => {
    if (!activeInstitutionId || !channelId) return {}

    const [startAt, endAt] = watchedTimeRange || []

    return activities.reduce((acc, activity) => {
      if (activity.id === editingActivity?.id) return acc
      if (normalizeStatus(activity) === 'offline') return acc
      if (activity.channelId !== channelId) return acc
      if (!activity.institutionIds?.includes(activeInstitutionId)) return acc

      if (startAt && endAt) {
        const existingStart = dayjs(activity.startAt)
        const existingEnd = dayjs(activity.endAt)
        if (!(startAt.isBefore(existingEnd) && endAt.isAfter(existingStart))) return acc
      }

      const configs = activity.institutionConfigs?.[activeInstitutionId] || []
      configs.forEach((item) => {
        acc[item.projectId] = {
          activityName: activity.name,
          period: `${activity.startAt} 至 ${activity.endAt}`,
        }
      })
      return acc
    }, {})
  }, [activities, activeInstitutionId, channelId, editingActivity?.id, watchedTimeRange])

  const projectLibraryColumns = [
    {
      title: '项目名称',
      dataIndex: 'name',
      width: 260,
      render: (name, row) => {
        const conflict = conflictProjectMap[row.id]
        if (!conflict) return name
        return (
          <div className="activity-project-conflict-cell">
            <span>{name}</span>
            <Text type="danger">
              已被活动「{conflict.activityName}」占用
            </Text>
          </div>
        )
      },
    },
    { title: '所属分类', dataIndex: 'category', width: 120 },
    { title: '编码', dataIndex: 'code', width: 100 },
    {
      title: '适用检查类型',
      dataIndex: 'type',
      width: 130,
      render: (type) => <Tag color="green">{type}</Tag>,
    },
  ]

  const selectedProjectMap = activeInstitutionId ? (institutionProjectMap[activeInstitutionId] || {}) : {}
  const selectedProjectIds = Object.keys(selectedProjectMap)
  const selectedProjectRows = selectedProjectIds
    .map((projectId) => getProject(projectId))
    .filter(Boolean)

  const projectTypeOptions = [...new Set(standardProjects.map((project) => project.type))]
    .map((type) => ({ label: type, value: type }))

  const filteredStandardProjects = useMemo(() => {
    const keyword = projectKeyword.trim().toLowerCase()
    if (!keyword && !projectType) return standardProjects
    return standardProjects.filter((project) => (
      (!projectType || project.type === projectType)
      && (
        !keyword
        || project.name.toLowerCase().includes(keyword)
        || project.code.toLowerCase().includes(keyword)
      )
    ))
  }, [projectKeyword, projectType])

  const selectedProjectColumns = [
    { title: '项目名称', dataIndex: 'name', width: 230 },
    { title: '编码', dataIndex: 'code', width: 100 },
    {
      title: '原价',
      dataIndex: 'originPrice',
      width: 110,
      render: (price) => <span className="activity-price-origin">￥{price.toFixed(2)}</span>,
    },
    {
      title: '活动价',
      width: 150,
      render: (_, row) => (
        <InputNumber
          min={0}
          precision={2}
          value={selectedProjectMap[row.id]}
          placeholder="填写价格"
          addonBefore="￥"
          disabled={!activeInstitutionId}
          onChange={(value) => setInstitutionProjectMap((prev) => ({
            ...prev,
            [activeInstitutionId]: {
              ...(prev[activeInstitutionId] || {}),
              [row.id]: value,
            },
          }))}
        />
      ),
    },
    {
      title: '操作',
      width: 90,
      render: (_, row) => (
        <Button
          type="link"
          danger
          onClick={() => setInstitutionProjectMap((prev) => {
            const current = { ...(prev[activeInstitutionId] || {}) }
            delete current[row.id]
            return {
              ...prev,
              [activeInstitutionId]: current,
            }
          })}
        >
          移除
        </Button>
      ),
    },
  ]

  const handleAddProjects = () => {
    if (!activeInstitutionId) {
      message.warning('请先选择所属渠道和所属机构')
      return
    }
    if (!librarySelectedIds.length) {
      message.warning('请先从一级平台项目库选择检查项目')
      return
    }

    setInstitutionProjectMap((prev) => {
      const currentProjectMap = { ...(prev[activeInstitutionId] || {}) }
      librarySelectedIds.forEach((projectId) => {
        currentProjectMap[projectId] = currentProjectMap[projectId] ?? getDefaultActivityPrice(projectId)
      })
      return {
        ...prev,
        [activeInstitutionId]: currentProjectMap,
      }
    })
    setLibrarySelectedIds([])
    setProjectModalOpen(false)
  }

  const handleProjectSearch = () => {
    setProjectKeyword(projectKeywordInput.trim())
    setProjectType(projectTypeInput)
  }

  const handleChannelChange = (value) => {
    setChannelId(value)
    setSelectedInstitutionIds([])
    setActiveInstitutionId(undefined)
    setInstitutionProjectMap({})
    form.setFieldValue('institutionIds', [])
  }

  const handleInstitutionChange = (values) => {
    setSelectedInstitutionIds(values)
    setActiveInstitutionId((prev) => (values.includes(prev) ? prev : values[0]))
    setInstitutionProjectMap((prev) => Object.fromEntries(
      values.map((institutionId) => [institutionId, prev[institutionId] || {}]),
    ))
  }

  const handleSubmit = async () => {
    const values = await form.validateFields()
    const error = canPassIntegrity(values, institutionProjectMap, activities, editingActivity?.id)
    if (error) {
      message.error(error)
      return
    }

    const actionAt = now()
    const nextActivity = {
      id: editingActivity?.id || `act-${Date.now()}`,
      name: values.name.trim(),
      description: values.description.trim(),
      channelId: values.channelId,
      institutionIds: values.institutionIds,
      startAt: values.timeRange[0].format(DATE_TIME_FORMAT),
      endAt: values.timeRange[1].format(DATE_TIME_FORMAT),
      status: 'listed',
      creator: editingActivity?.creator || DEMO_OPERATOR_NAME,
      updatedAt: actionAt,
      institutionConfigs: toInstitutionConfigs(institutionProjectMap, values.institutionIds),
      logs: [
        ...(editingActivity?.logs || []),
        {
          action: isEdit ? '编辑活动' : '创建活动',
          operator: DEMO_OPERATOR_NAME,
          at: actionAt,
          detail: `配置 ${values.institutionIds.length} 个机构的活动项目价格`,
        },
        ...(editingActivity?.status !== 'listed'
          ? [{ action: '上架活动', operator: DEMO_OPERATOR_NAME, at: actionAt, detail: '手动上架活动价格' }]
          : []),
      ],
    }

    commit((prev) => {
      if (isEdit) return prev.map((item) => item.id === nextActivity.id ? nextActivity : item)
      return [nextActivity, ...prev]
    })
    message.success('活动已保存并上架')
    navigate(basePath)
  }

  return (
    <ActivityFrame
      title={isEdit ? '编辑活动' : '新建活动'}
      extra={(
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(basePath)}>返回列表</Button>
          <Button className="activity-green-btn" onClick={handleSubmit}>保存并上架</Button>
        </Space>
      )}
      standalone={standalone}
    >
      <div className="activity-form-grid">
        <Annotatable id={2}>
          <Card className="activity-panel" title="基础信息">
            <Form form={form} layout="vertical" initialValues={initialValues}>
              <Form.Item name="name" label="活动名称" rules={[{ required: true, message: '请填写活动名称' }]}>
              <Input placeholder="例如：示例活动01" maxLength={30} showCount />
              </Form.Item>
              <Form.Item name="channelId" label="所属渠道" rules={[{ required: true, message: '请选择所属渠道' }]}>
                <Select placeholder="请选择所属渠道" options={channels} onChange={handleChannelChange} />
              </Form.Item>
              <Form.Item name="institutionIds" label="所属机构" rules={[{ required: true, message: '请至少选择一个所属机构' }]}>
                <Select
                  mode="multiple"
                  placeholder={channelId ? '请选择所属机构，可多选' : '请先选择所属渠道'}
                  options={availableInstitutions}
                  disabled={!channelId}
                  onChange={handleInstitutionChange}
                />
              </Form.Item>
              <Form.Item name="timeRange" label="活动时间" rules={[{ required: true, message: '请选择活动开始和结束时间' }]}>
                <RangePicker showTime format={DATE_TIME_FORMAT} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name="description" label="活动说明" rules={[{ required: true, message: '请填写活动说明' }]}>
                <Input.TextArea rows={5} placeholder="填写活动背景、机构沟通结论或展示说明" maxLength={120} showCount />
              </Form.Item>
            </Form>
          </Card>
        </Annotatable>

        <div className="activity-project-flow">
          <Annotatable id={3}>
            <Card
              className="activity-panel"
              title="机构项目活动价"
              extra={(
                <Button icon={<PlusOutlined />} disabled={!activeInstitutionId} onClick={() => setProjectModalOpen(true)}>
                  添加检查项目
                </Button>
              )}
            >
              <div className="activity-project-hint">
                <div>
                  <Text strong>当前渠道下，每个机构独立配置项目和活动价</Text>
                  <Paragraph type="secondary">
                    先选择所属渠道和机构，再切换到当前机构维护检查项目，活动价只作用在该渠道下的当前机构。
                  </Paragraph>
                </div>
                <Tag color="green">
                  {activeInstitutionId ? `${activeInstitutionName} 已添加 ${selectedProjectRows.length} 项` : '未选择机构'}
                </Tag>
              </div>
              <div className="activity-institution-switcher">
                {selectedInstitutionIds.length ? selectedInstitutionIds.map((institutionId) => (
                  <button
                    key={institutionId}
                    type="button"
                    className={`activity-institution-chip${institutionId === activeInstitutionId ? ' activity-institution-chip--active' : ''}`}
                    onClick={() => setActiveInstitutionId(institutionId)}
                  >
                    {getInstitutionName(institutionId)}
                  </button>
                )) : null}
              </div>
              <Table
                className="activity-table"
                rowKey="id"
                columns={selectedProjectColumns}
                dataSource={selectedProjectRows}
                pagination={false}
                locale={{
                  emptyText: (
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description={false}
                      className="activity-table-empty"
                    />
                  ),
                }}
                scroll={{ x: 680 }}
              />
            </Card>
          </Annotatable>
        </div>
        <Annotatable id={4}>
          <Modal
            title="一级平台项目库"
            open={projectModalOpen}
            width={980}
            okText="确认添加"
            cancelText="取消"
            okButtonProps={{ disabled: !activeInstitutionId }}
            onOk={handleAddProjects}
            onCancel={() => {
              setProjectModalOpen(false)
              setLibrarySelectedIds([])
              setProjectKeywordInput('')
              setProjectKeyword('')
              setProjectTypeInput(undefined)
              setProjectType(undefined)
            }}
          >
            <Paragraph type="secondary">
              {activeInstitutionId
                ? `当前为“${activeInstitutionName}”添加平台标准检查项目。已添加项目和与其他活动冲突的项目会自动禁选。`
                : '请先选择所属机构。'}
            </Paragraph>
            {activeInstitutionId ? (
              <div className="activity-project-conflict-tip">
                同渠道下，当前机构在所选活动时间内已被其他活动占用的项目将禁止选择，避免活动价格冲突。
              </div>
            ) : null}
            <div className="activity-project-search-bar">
              <span className="activity-project-search-label">检查类型：</span>
              <ConfigProvider
                theme={{
                  token: {
                    colorPrimary: '#159269',
                  },
                }}
              >
                <Select
                  className="activity-project-search-select"
                  allowClear
                  placeholder="检查类型"
                  options={projectTypeOptions}
                  value={projectTypeInput}
                  onChange={setProjectTypeInput}
                />
              </ConfigProvider>
              <span className="activity-project-search-label">编码/名称关键字：</span>
              <Input
                className="activity-project-search-input"
                placeholder="编码/名称关键字"
                value={projectKeywordInput}
                onChange={(event) => setProjectKeywordInput(event.target.value)}
                onPressEnter={handleProjectSearch}
              />
              <Button className="activity-green-btn" onClick={handleProjectSearch}>
                查询
              </Button>
            </div>
              <Table
                className="activity-table"
                rowKey="id"
                columns={projectLibraryColumns}
                dataSource={filteredStandardProjects}
                pagination={false}
                rowSelection={{
                  selectedRowKeys: librarySelectedIds,
                  onChange: (keys) => setLibrarySelectedIds(keys),
                  getCheckboxProps: (record) => {
                    const conflict = conflictProjectMap[record.id]
                    return {
                      disabled: selectedProjectIds.includes(record.id) || !activeInstitutionId || Boolean(conflict),
                      title: conflict
                        ? `与活动“${conflict.activityName}”冲突，时间：${conflict.period}`
                        : selectedProjectIds.includes(record.id)
                          ? '当前机构已添加该项目'
                          : !activeInstitutionId
                            ? '请先选择所属机构'
                            : '',
                    }
                  },
                }}
                scroll={{ x: 760 }}
              />
          </Modal>
        </Annotatable>
      </div>
    </ActivityFrame>
  )
}

function ActivityDetailPage({ activities, commit, basePath, standalone }) {
  const navigate = useNavigate()
  const { id } = useParams()
  const activity = activities.find((item) => item.id === id)
  const [activeInstitutionId, setActiveInstitutionId] = useState(() => activity?.institutionIds?.[0])

  if (!activity) {
    return (
      <ActivityFrame title="活动详情" extra={<Button onClick={() => navigate(basePath)}>返回列表</Button>} standalone={standalone}>
        <Card>
          <Text type="secondary">未找到该活动。</Text>
        </Card>
      </ActivityFrame>
    )
  }

  const row = enrichActivity(activity)
  const activeConfigs = activity.institutionConfigs?.[activeInstitutionId] || []
  const projectRows = activeConfigs.map((item) => {
    const project = getProject(item.projectId)
    return {
      ...project,
      activityPrice: item.activityPrice,
      diff: item.activityPrice - project.originPrice,
    }
  })

  const handleOffline = () => {
    Modal.confirm({
      title: '确认下架活动',
      content: '下架后，该机构相关检查项目将恢复原价格展示。',
      okText: '确认下架',
      cancelText: '取消',
      onOk: () => {
        const actionAt = now()
        commit((prev) => prev.map((item) => item.id === activity.id ? {
          ...item,
          status: 'offline',
          updatedAt: actionAt,
          logs: [
            ...(item.logs || []),
            { action: '下架活动', operator: DEMO_OPERATOR_NAME, at: actionAt, detail: '手动下架并恢复机构原价格' },
          ],
        } : item))
        message.success('活动已下架')
      },
    })
  }

  const projectColumns = [
    { title: '项目名称', dataIndex: 'name', width: 230 },
    { title: '所属分类', dataIndex: 'category', width: 120 },
    { title: '编码', dataIndex: 'code', width: 100 },
    { title: '检查类型', dataIndex: 'type', width: 100, render: (type) => <Tag color="green">{type}</Tag> },
    { title: '原价', dataIndex: 'originPrice', width: 110, render: (price) => <span className="activity-price-origin">￥{price.toFixed(2)}</span> },
    { title: '活动价', dataIndex: 'activityPrice', width: 110, render: (price) => <Text strong style={{ color: '#14916a' }}>￥{price.toFixed(2)}</Text> },
    {
      title: '价格变化',
      dataIndex: 'diff',
      width: 110,
      render: (diff) => <Text type={diff > 0 ? 'danger' : 'secondary'}>{diff > 0 ? '+' : ''}{diff.toFixed(2)}</Text>,
    },
  ]

  return (
    <Annotatable id={5}>
      <ActivityFrame
        title="活动详情"
        extra={(
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(basePath)}>返回列表</Button>
            <Button icon={<EditOutlined />} onClick={() => navigate(`${basePath}/edit/${activity.id}`)}>编辑活动</Button>
            {row.status === 'running' || row.status === 'listed' ? <Button danger icon={<StopOutlined />} onClick={handleOffline}>下架活动</Button> : null}
          </Space>
        )}
        standalone={standalone}
      >
        <Card className="activity-panel" title="基础信息">
          <Descriptions column={3} bordered size="middle">
            <Descriptions.Item label="活动名称">{activity.name}</Descriptions.Item>
            <Descriptions.Item label="所属渠道">{row.channelName}</Descriptions.Item>
            <Descriptions.Item label="活动状态">
              <Tag color={statusMeta[row.status]?.tagColor}>{statusMeta[row.status]?.label}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="活动时间" span={2}>{activity.startAt} 至 {activity.endAt}</Descriptions.Item>
            <Descriptions.Item label="创建人">{activity.creator}</Descriptions.Item>
            <Descriptions.Item label="更新时间">{activity.updatedAt}</Descriptions.Item>
            <Descriptions.Item label="所属机构" span={2}>{row.institutionSummary}</Descriptions.Item>
            <Descriptions.Item label="机构数">{row.institutionCount}</Descriptions.Item>
            <Descriptions.Item label="活动项目数">{row.projectCount}</Descriptions.Item>
            <Descriptions.Item label="活动说明" span={3}>{activity.description}</Descriptions.Item>
          </Descriptions>
        </Card>

        <Card className="activity-panel activity-log" title="机构活动项目价格">
          <div className="activity-institution-switcher">
            {activity.institutionIds.map((institutionId) => (
              <button
                key={institutionId}
                type="button"
                className={`activity-institution-chip${institutionId === activeInstitutionId ? ' activity-institution-chip--active' : ''}`}
                onClick={() => setActiveInstitutionId(institutionId)}
              >
                {getInstitutionName(institutionId)}
              </button>
            ))}
          </div>
          <Paragraph type="secondary">
            当前查看机构：{getInstitutionName(activeInstitutionId)}。项目价格仅作用在该渠道下的当前机构。
          </Paragraph>
          <Table
            className="activity-table"
            rowKey="id"
            columns={projectColumns}
            dataSource={projectRows}
            pagination={false}
            scroll={{ x: 900 }}
          />
        </Card>
      </ActivityFrame>
    </Annotatable>
  )
}

export default function ActivityManagementPage() {
  const location = useLocation()
  const basePath = getActivityBasePath(location.pathname)
  const standalone = isSharePath(location.pathname)
  const [activities, commit] = useActivityStore(getActivityStorageKey(location.pathname))

  if (isCreatePath(location.pathname, basePath) || isEditPath(location.pathname, basePath)) {
    return <ActivityFormPage activities={activities} commit={commit} basePath={basePath} standalone={standalone} />
  }

  if (isDetailPath(location.pathname, basePath) && !isCreatePath(location.pathname, basePath) && !isEditPath(location.pathname, basePath)) {
    return <ActivityDetailPage activities={activities} commit={commit} basePath={basePath} standalone={standalone} />
  }

  return <ActivityListPage activities={activities} commit={commit} basePath={basePath} standalone={standalone} />
}
