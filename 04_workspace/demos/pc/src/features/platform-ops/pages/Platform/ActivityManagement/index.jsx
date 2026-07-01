import { useMemo, useState, useRef, useEffect } from 'react'
import {
  Alert,
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
    title: '需求描述：价格规则列表页',
    content: `**功能描述**：展示互联网医院侧价格规则总览，支持查看、编辑、上架、下架和删除。

**页面模块**：
- 页面标题：活动管理
- 页面副标题：统一管理平台差异价、用户优惠券/折扣券、组套优惠和项目活动价。
- 顶部操作：新建价格规则按钮
- 表格字段：序号、价格规则名称、规则类型、业务通道、来源平台、适用签约中心、中心数、项目/组套数、生效时间、状态、优先级、更新时间、操作

**交互行为**：
- 点击"新建价格规则"进入新建页
- 点击"查看"进入详情页
- 点击"编辑"进入编辑页
- 点击"下架"弹出确认框，确认后将价格规则状态更新为"已下架"
- 点击"上架"弹出确认框，确认后将价格规则状态更新为"已上架"
- 点击"删除"弹出危险确认框，确认后删除价格规则且不可恢复

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
  - 价格规则名称：输入框，必填，最大长度 30
  - 价格规则类型：平台差异价、项目活动价、用户优惠券/折扣券、组套优惠
  - 业务通道：当前重点为互联网医院
  - 来源平台/合作平台：平安、青藤自营、一脉、全部平台等
  - 适用签约交付中心：多选，表示规则适用范围，不是活动主体
  - 生效时间：起止时间范围选择，必填
  - 规则说明：多行文本，必填，最大长度 160

**保存校验规则**：
- 价格规则名称不能为空
- 规则类型、业务通道、来源平台不能为空
- 至少选择 1 个适用签约交付中心
- 活动开始和结束时间必须完整选择
- 结束时间必须晚于开始时间
- 每个适用中心至少添加 1 个检查项目
- 每个项目都必须填写规则价
- 同一业务通道、来源平台、规则类型、签约中心、项目在重叠时间内只能存在一条有效规则`
  },
  {
    id: 3,
    title: '需求描述：适用项目与规则价格',
    content: `**适用项目与规则价格模块**：
- 模块目标：按签约交付中心维护适用项目和规则价
- 模块说明：交付中心只是规则适用范围，价格规则主体是业务通道/来源平台
- 中心切换：当适用中心有多个时，以切换按钮展示
- 表格字段：项目名称、编码、门市价、规则价、操作
- 操作说明：点击"添加检查项目"打开平台标准项目库；在已选项目表格中可编辑规则价；组套优惠可选择多个项目共同组成套餐`
  },
  {
    id: 4,
    title: '需求描述：平台标准项目库弹窗',
    content: `**平台标准项目库弹窗**：
- 功能描述：从标准检查项目库中为当前签约中心选择适用项目
- 标题：平台标准项目库
- 冲突提示：同一业务通道、来源平台、规则类型、签约中心、项目在重叠时间内只能存在一条有效价格规则
- 查询区字段：检查类型、编码/名称关键字
- 行选择规则：
  - 已添加到当前中心的项目禁选
  - 当前中心未选中时全部禁选
  - 与同类型价格规则冲突的项目禁选，并显示冲突规则名称与时间提示`
  },
  {
    id: 5,
    title: '需求描述：价格规则详情页',
    content: `**价格规则详情页**：
- 功能描述：查看价格规则基础信息、适用范围和每个签约中心下的规则价格，并可从详情页返回、编辑或下架

**基础信息区域**：
- 展示字段：价格规则名称、规则类型、业务通道、来源平台、状态、生效时间、创建人、更新时间、适用签约中心、中心数、项目/组套数、规则说明
- 状态展示：使用标签展示"已上架 / 进行中 / 已下架"

**规则价格区域**：
- 签约中心切换：展示该规则下全部适用中心按钮
- 表格字段：项目名称、所属分类、编码、检查类型、门市价、规则价、价格变化`
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

const STORAGE_KEY_BACKSTAGE = 'pm-agent-activity-management-v7'
const STORAGE_KEY_SHARE = 'pm-agent-activity-management-share-v5'
const DEMO_OPERATOR_NAME = '运营账号A'

const channels = [
  { label: '互联网医院', value: 'internet-hospital' },
  { label: '一脉中心', value: 'yimai-center' },
  { label: '青藤自助开单', value: 'qingteng-self-order' },
]

const sourcePlatforms = [
  { label: '全部平台', value: 'all' },
  { label: '平安', value: 'pingan' },
  { label: '青藤自营', value: 'qingteng' },
  { label: '一脉', value: 'yimai' },
  { label: '其他合作平台', value: 'partner-other' },
]

const priceRuleTypes = [
  {
    label: '不同平台不同价格',
    value: 'platform-price',
    tagColor: 'blue',
    priority: 30,
    formTitle: '互联网医院侧来源平台展示价',
    priceColumnTitle: '平台展示价',
    description: '用于平安等特定来源平台，在互联网医院业务通道下对同一项目展示不同价格。',
  },
  {
    label: '项目活动价格',
    value: 'project-activity',
    tagColor: 'green',
    priority: 20,
    formTitle: '签约中心项目活动价',
    priceColumnTitle: '活动价',
    description: '用于在互联网医院业务通道下，为特定签约交付中心的特定项目设置阶段性活动价格。',
  },
  {
    label: '用户优惠券/折扣券',
    value: 'user-discount',
    tagColor: 'purple',
    priority: 40,
    formTitle: '用户侧优惠后价格',
    priceColumnTitle: '优惠后价',
    description: '用于面向指定用户、人群或券码提供优惠，需要后续明确是否可与平台价、活动价和套餐价叠加。',
  },
  {
    label: '组套优惠',
    value: 'bundle-discount',
    tagColor: 'orange',
    priority: 50,
    formTitle: '组套优惠价',
    priceColumnTitle: '组套价',
    description: '用于多个项目组合后的套餐优惠，需明确套餐展示、明细拆分和下发到交付中心的规则。',
  },
]

const institutionsByChannel = {
  'internet-hospital': [
    { label: '成都高新影像交付中心', value: 'center-ih-001' },
    { label: '南昌红谷滩影像交付中心', value: 'center-ih-002' },
    { label: '南昌西湖影像交付中心', value: 'center-ih-003' },
    { label: '杭州滨江影像交付中心', value: 'center-ih-004' },
  ],
  'yimai-center': [
    { label: '一脉成都中心', value: 'center-yimai-001' },
    { label: '一脉南昌中心', value: 'center-yimai-002' },
    { label: '一脉杭州中心', value: 'center-yimai-003' },
  ],
  'qingteng-self-order': [
    { label: '青藤成都自助开单中心', value: 'center-qt-001' },
    { label: '青藤南昌自助开单中心', value: 'center-qt-002' },
    { label: '青藤杭州自助开单中心', value: 'center-qt-003' },
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
    name: '平安平台肺结节专项价',
    description: '互联网医院侧来源平台差异价：平安平台访问时展示肺结节项目专项价格，交付中心只作为适用范围。',
    ruleType: 'platform-price',
    sourcePlatformId: 'pingan',
    channelId: 'internet-hospital',
    institutionIds: ['center-ih-001', 'center-ih-002'],
    startAt: '2026-06-20 00:00',
    endAt: '2026-08-31 23:59',
    status: 'listed',
    creator: DEMO_OPERATOR_NAME,
    updatedAt: '2026-06-27 10:20',
    priority: 30,
    institutionConfigs: {
      'center-ih-001': [
        { projectId: 'p-006', activityPrice: 129 },
      ],
      'center-ih-002': [
        { projectId: 'p-006', activityPrice: 135 },
      ],
    },
    logs: [
      { action: '创建价格规则', operator: DEMO_OPERATOR_NAME, at: '2026-06-27 10:00', detail: '创建平安平台来源差异价规则' },
      { action: '上架价格规则', operator: DEMO_OPERATOR_NAME, at: '2026-06-27 10:20', detail: '上架后平安平台按专项价展示' },
    ],
  },
  {
    id: 'act-002',
    name: '互联网医院新客折扣券',
    description: '用户侧优惠券/折扣券：面向互联网医院新客，命中项目后展示优惠后价；叠加规则后续需与价格引擎确认。',
    ruleType: 'user-discount',
    sourcePlatformId: 'all',
    channelId: 'internet-hospital',
    institutionIds: ['center-ih-001', 'center-ih-003'],
    startAt: '2026-07-01 00:00',
    endAt: '2026-07-31 23:59',
    status: 'listed',
    creator: DEMO_OPERATOR_NAME,
    updatedAt: '2026-06-27 11:05',
    priority: 40,
    institutionConfigs: {
      'center-ih-001': [
        { projectId: 'p-001', activityPrice: 150 },
        { projectId: 'p-002', activityPrice: 138 },
      ],
      'center-ih-003': [
        { projectId: 'p-002', activityPrice: 145 },
      ],
    },
    logs: [
      { action: '创建价格规则', operator: DEMO_OPERATOR_NAME, at: '2026-06-27 11:05', detail: '创建用户侧新客折扣券规则' },
    ],
  },
  {
    id: 'act-003',
    name: '胸部CT筛查组套优惠',
    description: '组套优惠：肺结节筛查与三维重建能力组合展示为套餐价，后续需明确是否拆分下发到交付中心。',
    ruleType: 'bundle-discount',
    sourcePlatformId: 'qingteng',
    channelId: 'internet-hospital',
    institutionIds: ['center-ih-002'],
    startAt: '2026-07-05 00:00',
    endAt: '2026-09-30 23:59',
    status: 'listed',
    creator: DEMO_OPERATOR_NAME,
    updatedAt: '2026-06-27 11:30',
    priority: 50,
    institutionConfigs: {
      'center-ih-002': [
        { projectId: 'p-004', activityPrice: 299 },
        { projectId: 'p-006', activityPrice: 99 },
      ],
    },
    logs: [
      { action: '创建价格规则', operator: DEMO_OPERATOR_NAME, at: '2026-06-27 11:30', detail: '创建胸部 CT 组套优惠规则' },
    ],
  },
  {
    id: 'act-004',
    name: '一脉中心门市价展示口径',
    description: '价格口径校正：一脉侧按实际门市价展示，系统内记录 7 折后价格。该类规则不等同普通项目活动价。',
    ruleType: 'platform-price',
    sourcePlatformId: 'yimai',
    channelId: 'yimai-center',
    institutionIds: ['center-yimai-001', 'center-yimai-002'],
    startAt: '2026-06-01 00:00',
    endAt: '2026-12-31 23:59',
    status: 'offline',
    creator: DEMO_OPERATOR_NAME,
    updatedAt: '2026-06-26 16:35',
    priority: 30,
    institutionConfigs: {
      'center-yimai-001': [
        { projectId: 'p-001', activityPrice: 140 },
        { projectId: 'p-005', activityPrice: 196 },
      ],
      'center-yimai-002': [
        { projectId: 'p-002', activityPrice: 126 },
      ],
    },
    logs: [
      { action: '创建价格规则', operator: DEMO_OPERATOR_NAME, at: '2026-06-26 15:00', detail: '记录一脉展示价与系统记录价口径' },
      { action: '下架价格规则', operator: DEMO_OPERATOR_NAME, at: '2026-06-26 16:35', detail: '等待结算配置页确认后再上架' },
    ],
  },
  {
    id: 'act-005',
    name: '青藤自助开单抽成比例调整',
    description: '青藤自助开单抽成比例从 25% 调整至 30%，用于展示结算口径变化，不应与普通项目活动价混淆。',
    ruleType: 'platform-price',
    sourcePlatformId: 'qingteng',
    channelId: 'qingteng-self-order',
    institutionIds: ['center-qt-001'],
    startAt: '2026-07-01 00:00',
    endAt: '2026-12-31 23:59',
    status: 'listed',
    creator: DEMO_OPERATOR_NAME,
    updatedAt: '2026-06-27 12:00',
    priority: 30,
    institutionConfigs: {
      'center-qt-001': [
        { projectId: 'p-005', activityPrice: 280 },
      ],
    },
    logs: [
      { action: '创建价格规则', operator: DEMO_OPERATOR_NAME, at: '2026-06-27 12:00', detail: '记录青藤自助开单抽成比例调整' },
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
  return `价格规则${getDemoActivityCode(activityId, index)}`
}

function getDemoLogDetail(action) {
  if (action.includes('创建') && action.includes('上架')) return '创建价格规则并直接上架'
  if (action.includes('创建')) return '创建价格规则并完成基础配置'
  if (action.includes('编辑')) return '更新价格规则配置'
  if (action.includes('上架')) return '上架价格规则并展示规则价格'
  if (action.includes('下架')) return '下架价格规则并恢复基础价格'
  return '更新价格规则配置'
}

function getRuleTypeMeta(ruleType) {
  return priceRuleTypes.find((item) => item.value === ruleType) || priceRuleTypes[1]
}

function getSourcePlatformName(id) {
  return sourcePlatforms.find((item) => item.value === id)?.label || '全部平台'
}

function sanitizeActivitiesForDemo(activities = []) {
  return activities.map((activity, index) => {
    const ruleType = activity.ruleType || 'project-activity'
    const ruleMeta = getRuleTypeMeta(ruleType)
    return {
      ...activity,
      name: activity.name || getDemoActivityName(activity.id, index),
      description: activity.description || '价格规则说明，用于演示后台价格规则配置与维护流程。',
      ruleType,
      sourcePlatformId: activity.sourcePlatformId || 'all',
      priority: activity.priority || ruleMeta.priority,
      creator: activity.creator || DEMO_OPERATOR_NAME,
      logs: (activity.logs || []).map((log) => ({
        ...log,
        operator: log.operator || DEMO_OPERATOR_NAME,
        detail: log.detail || getDemoLogDetail(log.action || ''),
      })),
    }
  })
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
  const ruleMeta = getRuleTypeMeta(activity.ruleType)
  return {
    ...activity,
    status: normalizedStatus,
    ruleTypeMeta: ruleMeta,
    ruleTypeLabel: ruleMeta.label,
    channelName: getChannelName(activity.channelId),
    sourcePlatformName: getSourcePlatformName(activity.sourcePlatformId),
    institutionSummary: getInstitutionSummary(activity.institutionIds),
    institutionCount: activity.institutionIds?.length || 0,
    projectCount: getInstitutionProjectCount(activity),
    priority: activity.priority || ruleMeta.priority,
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
  if (!values.name?.trim()) return '请填写价格规则名称'
  if (!values.ruleType) return '请选择价格规则类型'
  if (!values.description?.trim()) return '请填写规则说明'
  if (!values.channelId) return '请选择业务通道'
  if (!values.sourcePlatformId) return '请选择来源平台/合作平台'
  if (!values.institutionIds?.length) return '请至少选择一个适用签约交付中心'
  if (!values.timeRange?.[0] || !values.timeRange?.[1]) return '请设置生效开始和结束时间'

  const [startAt, endAt] = values.timeRange
  if (!endAt.isAfter(startAt)) return '结束时间必须晚于开始时间'

  for (const institutionId of values.institutionIds) {
    const projectMap = institutionProjectMap[institutionId] || {}
    const projectIds = Object.keys(projectMap)
    if (!projectIds.length) return `请先为签约中心“${getInstitutionName(institutionId)}”添加检查项目`
    const hasMissingPrice = projectIds.some((projectId) => projectMap[projectId] === null || projectMap[projectId] === undefined)
    if (hasMissingPrice) return `请为签约中心“${getInstitutionName(institutionId)}”填写完整规则价`
  }

  const hasConflict = activities.some((activity) => {
    if (activity.id === editingId) return false
    if (normalizeStatus(activity) === 'offline') return false
    if (activity.channelId !== values.channelId) return false
    if ((activity.sourcePlatformId || 'all') !== values.sourcePlatformId) return false
    if ((activity.ruleType || 'project-activity') !== values.ruleType) return false
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

  if (hasConflict) return '同一业务通道、来源平台、规则类型、签约中心和项目在重叠时间内只能存在一条有效价格规则'
  return ''
}

function ActivityListPage({ activities, commit, basePath, standalone }) {
  const navigate = useNavigate()
  const rows = useMemo(() => activities.map(enrichActivity), [activities])

  const updateStatus = (activity, nextStatus, label) => {
    Modal.confirm({
      title: `确认${label}`,
      content: `${label}后，相关价格规则会按当前状态同步展示。`,
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
                detail: nextStatus === 'listed' ? '手动上架价格规则' : '手动下架并恢复基础价格',
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
      title: '确认删除价格规则',
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
    { title: '价格规则名称', dataIndex: 'name', width: 230 },
    {
      title: '规则类型',
      width: 160,
      render: (_, row) => <Tag color={row.ruleTypeMeta.tagColor}>{row.ruleTypeLabel}</Tag>,
    },
    { title: '业务通道', dataIndex: 'channelName', width: 130 },
    { title: '来源平台', dataIndex: 'sourcePlatformName', width: 130 },
    {
      title: '适用签约中心',
      width: 300,
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
              <button type="button" className="activity-institution-brief__link">查看中心</button>
            </Popover>
          ) : null}
        </div>
      ),
    },
    { title: '中心数', dataIndex: 'institutionCount', width: 90 },
    { title: '项目/组套数', dataIndex: 'projectCount', width: 120 },
    {
      title: '生效时间',
      width: 280,
      render: (_, row) => `${row.startAt} 至 ${row.endAt}`,
    },
    {
      title: '状态',
      width: 110,
      render: (_, row) => <StatusText status={row.status} />,
    },
    { title: '优先级', dataIndex: 'priority', width: 90 },
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
        subtitle="统一管理互联网医院侧价格规则，覆盖平台差异价、用户优惠券/折扣券、组套优惠和项目活动价。"
        extra={(
          <Button className="activity-green-btn" icon={<PlusOutlined />} onClick={() => navigate(`${basePath}/create`)}>
            新建价格规则
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
          scroll={{ x: 1780 }}
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
  const [ruleType, setRuleType] = useState(editingActivity?.ruleType || 'platform-price')
  const [channelId, setChannelId] = useState(editingActivity?.channelId || 'internet-hospital')
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
    ruleType: editingActivity.ruleType || 'project-activity',
    sourcePlatformId: editingActivity.sourcePlatformId || 'all',
    description: editingActivity.description,
    channelId: editingActivity.channelId,
    institutionIds: editingActivity.institutionIds,
    timeRange: [dayjs(editingActivity.startAt), dayjs(editingActivity.endAt)],
  } : {
    ruleType: 'platform-price',
    sourcePlatformId: 'pingan',
    channelId: 'internet-hospital',
    timeRange: [dayjs().add(1, 'day').hour(0).minute(0), dayjs().add(31, 'day').hour(23).minute(59)],
  }

  const availableInstitutions = getInstitutionsByChannel(channelId)
  const activeInstitutionName = activeInstitutionId ? getInstitutionName(activeInstitutionId) : ''
  const activeRuleMeta = getRuleTypeMeta(ruleType)
  const watchedTimeRange = Form.useWatch('timeRange', form)
  const watchedSourcePlatformId = Form.useWatch('sourcePlatformId', form)
  const watchedRuleType = Form.useWatch('ruleType', form)

  const conflictProjectMap = useMemo(() => {
    if (!activeInstitutionId || !channelId) return {}

    const [startAt, endAt] = watchedTimeRange || []
    const currentSourcePlatformId = watchedSourcePlatformId || 'all'
    const currentRuleType = watchedRuleType || ruleType

    return activities.reduce((acc, activity) => {
      if (activity.id === editingActivity?.id) return acc
      if (normalizeStatus(activity) === 'offline') return acc
      if (activity.channelId !== channelId) return acc
      if ((activity.sourcePlatformId || 'all') !== currentSourcePlatformId) return acc
      if ((activity.ruleType || 'project-activity') !== currentRuleType) return acc
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
  }, [activities, activeInstitutionId, channelId, editingActivity?.id, ruleType, watchedRuleType, watchedSourcePlatformId, watchedTimeRange])

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
              已被规则「{conflict.activityName}」占用
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
      title: '门市价',
      dataIndex: 'originPrice',
      width: 110,
      render: (price) => <span className="activity-price-origin">￥{price.toFixed(2)}</span>,
    },
    {
      title: activeRuleMeta.priceColumnTitle,
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
      message.warning('请先选择业务通道和适用签约交付中心')
      return
    }
    if (!librarySelectedIds.length) {
      message.warning('请先从平台标准项目库选择检查项目')
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

  const handleRuleTypeChange = (value) => {
    setRuleType(value)
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
      ruleType: values.ruleType,
      sourcePlatformId: values.sourcePlatformId,
      channelId: values.channelId,
      institutionIds: values.institutionIds,
      startAt: values.timeRange[0].format(DATE_TIME_FORMAT),
      endAt: values.timeRange[1].format(DATE_TIME_FORMAT),
      status: 'listed',
      creator: editingActivity?.creator || DEMO_OPERATOR_NAME,
      updatedAt: actionAt,
      priority: getRuleTypeMeta(values.ruleType).priority,
      institutionConfigs: toInstitutionConfigs(institutionProjectMap, values.institutionIds),
      logs: [
        ...(editingActivity?.logs || []),
        {
          action: isEdit ? '编辑价格规则' : '创建价格规则',
          operator: DEMO_OPERATOR_NAME,
          at: actionAt,
          detail: `配置 ${values.institutionIds.length} 个适用中心的${getRuleTypeMeta(values.ruleType).label}`,
        },
        ...(editingActivity?.status !== 'listed'
          ? [{ action: '上架价格规则', operator: DEMO_OPERATOR_NAME, at: actionAt, detail: '手动上架价格规则' }]
          : []),
      ],
    }

    commit((prev) => {
      if (isEdit) return prev.map((item) => item.id === nextActivity.id ? nextActivity : item)
      return [nextActivity, ...prev]
    })
    message.success('价格规则已保存并上架')
    navigate(basePath)
  }

  return (
    <ActivityFrame
      title={isEdit ? '编辑价格规则' : '新建价格规则'}
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
              <Form.Item name="name" label="价格规则名称" rules={[{ required: true, message: '请填写价格规则名称' }]}>
                <Input placeholder="例如：平安平台肺结节专项价" maxLength={30} showCount />
              </Form.Item>
              <Form.Item name="ruleType" label="价格规则类型" rules={[{ required: true, message: '请选择价格规则类型' }]}>
                <Select placeholder="请选择价格规则类型" options={priceRuleTypes} onChange={handleRuleTypeChange} />
              </Form.Item>
              <Form.Item name="channelId" label="业务通道" rules={[{ required: true, message: '请选择业务通道' }]}>
                <Select placeholder="请选择业务通道" options={channels} onChange={handleChannelChange} />
              </Form.Item>
              <Form.Item name="sourcePlatformId" label="来源平台/合作平台" rules={[{ required: true, message: '请选择来源平台/合作平台' }]}>
                <Select placeholder="请选择来源平台/合作平台" options={sourcePlatforms} />
              </Form.Item>
              <Form.Item name="institutionIds" label="适用签约交付中心" rules={[{ required: true, message: '请至少选择一个适用签约交付中心' }]}>
                <Select
                  mode="multiple"
                  placeholder={channelId ? '请选择适用签约交付中心，可多选' : '请先选择业务通道'}
                  options={availableInstitutions}
                  disabled={!channelId}
                  onChange={handleInstitutionChange}
                />
              </Form.Item>
              <Form.Item name="timeRange" label="生效时间" rules={[{ required: true, message: '请选择生效开始和结束时间' }]}>
                <RangePicker showTime format={DATE_TIME_FORMAT} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name="description" label="规则说明" rules={[{ required: true, message: '请填写规则说明' }]}>
                <Input.TextArea rows={5} placeholder="填写价格背景、适用范围、展示价/记录价口径或叠加说明" maxLength={160} showCount />
              </Form.Item>
              <Alert
                className="activity-rule-note"
                type="info"
                showIcon
                title={activeRuleMeta.formTitle}
                description={activeRuleMeta.description}
              />
            </Form>
          </Card>
        </Annotatable>

        <div className="activity-project-flow">
          <Annotatable id={3}>
            <Card
              className="activity-panel"
              title="适用项目与规则价格"
              extra={(
                <Button icon={<PlusOutlined />} disabled={!activeInstitutionId} onClick={() => setProjectModalOpen(true)}>
                  添加检查项目
                </Button>
              )}
            >
              <div className="activity-project-hint">
                <div>
                  <Text strong>{activeRuleMeta.formTitle}</Text>
                  <Paragraph type="secondary">
                    先选择业务通道、来源平台和适用签约中心，再切换到当前中心维护项目。交付中心只是适用范围，价格规则主体是业务通道与来源平台。
                  </Paragraph>
                </div>
                <Tag color="green">
                  {activeInstitutionId ? `${activeInstitutionName} 已添加 ${selectedProjectRows.length} 项` : '未选择中心'}
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
            title="平台标准项目库"
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
                ? `当前为“${activeInstitutionName}”添加平台标准检查项目。已添加项目和与同类型价格规则冲突的项目会自动禁选。`
                : '请先选择适用签约交付中心。'}
            </Paragraph>
            {activeInstitutionId ? (
              <div className="activity-project-conflict-tip">
                同一业务通道、来源平台、规则类型、签约中心、项目在重叠时间内只能存在一条有效价格规则；不同类型规则后续由优先级和叠加规则决定最终价格。
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
                        ? `与价格规则“${conflict.activityName}”冲突，时间：${conflict.period}`
                        : selectedProjectIds.includes(record.id)
                          ? '当前中心已添加该项目'
                          : !activeInstitutionId
                            ? '请先选择适用签约交付中心'
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
      <ActivityFrame title="价格规则详情" extra={<Button onClick={() => navigate(basePath)}>返回列表</Button>} standalone={standalone}>
        <Card>
          <Text type="secondary">未找到该价格规则。</Text>
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
      title: '确认下架价格规则',
      content: '下架后，相关项目将恢复基础价格或由其他优先级规则接管。',
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
            { action: '下架价格规则', operator: DEMO_OPERATOR_NAME, at: actionAt, detail: '手动下架并恢复基础价格' },
          ],
        } : item))
        message.success('价格规则已下架')
      },
    })
  }

  const projectColumns = [
    { title: '项目名称', dataIndex: 'name', width: 230 },
    { title: '所属分类', dataIndex: 'category', width: 120 },
    { title: '编码', dataIndex: 'code', width: 100 },
    { title: '检查类型', dataIndex: 'type', width: 100, render: (type) => <Tag color="green">{type}</Tag> },
    { title: '门市价', dataIndex: 'originPrice', width: 110, render: (price) => <span className="activity-price-origin">￥{price.toFixed(2)}</span> },
    { title: row.ruleTypeMeta.priceColumnTitle, dataIndex: 'activityPrice', width: 120, render: (price) => <Text strong style={{ color: '#14916a' }}>￥{price.toFixed(2)}</Text> },
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
        title="价格规则详情"
        extra={(
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(basePath)}>返回列表</Button>
            <Button icon={<EditOutlined />} onClick={() => navigate(`${basePath}/edit/${activity.id}`)}>编辑价格规则</Button>
            {row.status === 'running' || row.status === 'listed' ? <Button danger icon={<StopOutlined />} onClick={handleOffline}>下架价格规则</Button> : null}
          </Space>
        )}
        standalone={standalone}
      >
        <Card className="activity-panel" title="基础信息">
          <Descriptions column={3} bordered size="middle">
            <Descriptions.Item label="价格规则名称">{activity.name}</Descriptions.Item>
            <Descriptions.Item label="规则类型"><Tag color={row.ruleTypeMeta.tagColor}>{row.ruleTypeLabel}</Tag></Descriptions.Item>
            <Descriptions.Item label="状态">
              <Tag color={statusMeta[row.status]?.tagColor}>{statusMeta[row.status]?.label}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="业务通道">{row.channelName}</Descriptions.Item>
            <Descriptions.Item label="来源平台">{row.sourcePlatformName}</Descriptions.Item>
            <Descriptions.Item label="优先级">{row.priority}</Descriptions.Item>
            <Descriptions.Item label="生效时间" span={2}>{activity.startAt} 至 {activity.endAt}</Descriptions.Item>
            <Descriptions.Item label="创建人">{activity.creator}</Descriptions.Item>
            <Descriptions.Item label="更新时间">{activity.updatedAt}</Descriptions.Item>
            <Descriptions.Item label="适用签约中心" span={2}>{row.institutionSummary}</Descriptions.Item>
            <Descriptions.Item label="中心数">{row.institutionCount}</Descriptions.Item>
            <Descriptions.Item label="项目/组套数">{row.projectCount}</Descriptions.Item>
            <Descriptions.Item label="规则说明" span={3}>{activity.description}</Descriptions.Item>
          </Descriptions>
        </Card>

        <Card className="activity-panel activity-log" title="适用项目与规则价格">
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
            当前查看签约中心：{getInstitutionName(activeInstitutionId)}。该中心仅表示规则适用范围，最终价格由规则类型、来源平台、优先级与叠加规则共同决定。
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
