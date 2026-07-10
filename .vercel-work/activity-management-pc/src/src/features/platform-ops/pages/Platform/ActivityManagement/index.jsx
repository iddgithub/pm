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
  ACTIVITY_MANAGEMENT_COPY_BASE_PATH,
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
- 页面标题：活动价格管理
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
- 已上架：未手动下架且活动结束时间未过期`
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
- 操作说明：点击"添加检查项目"打开检查项目已对码表；在已选项目表格中可编辑规则价；组套优惠可选择多个项目共同组成套餐`
  },
  {
    id: 4,
    title: '需求描述：检查项目已对码表弹窗',
    content: `**检查项目已对码表弹窗**：
- 功能描述：从已对码检查项目中为当前活动对象选择适用项目
- 标题：检查项目已对码表
- 查询区字段：检查类型、编码/名称关键字
- 行选择规则：
  - 已添加到当前活动的项目禁选
  - 当前活动对象未选中时全部禁选
  - 与同类型价格规则冲突的项目禁选，并显示冲突规则名称与时间提示`
  },
  {
    id: 5,
    title: '需求描述：价格规则详情页',
    content: `**价格规则详情页**：
- 功能描述：查看价格规则基础信息、适用范围和每个签约中心下的规则价格，并可从详情页返回、编辑或下架

**基础信息区域**：
- 展示字段：价格规则名称、规则类型、业务通道、来源平台、状态、生效时间、创建人、更新时间、适用签约中心、中心数、项目/组套数、规则说明
- 状态展示：使用标签展示"已上架 / 已下架"

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

const STORAGE_KEY_BACKSTAGE = 'pm-agent-activity-management-v8'
const STORAGE_KEY_COPY = 'pm-agent-activity-management-copy-v1'
const STORAGE_KEY_SHARE = 'pm-agent-activity-management-share-v5'
const DEMO_OPERATOR_NAME = '运营账号A'

const channels = [
  { label: '互联网医院', value: 'internet-hospital' },
  { label: '一脉中心', value: 'yimai-center' },
  { label: '青藤自助开单', value: 'qingteng-self-order' },
]

const activityObjectOptionsByRuleType = {
  'internet-hospital-activity': [
    { label: '蚂蚁好大夫', value: 'mayi-doctor' },
    { label: '平安', value: 'pingan' },
    { label: '华西', value: 'huaxi' },
  ],
  'delivery-center-activity': [
    { label: '北京一脉阳光医学诊断中心（193）', value: 'yimai-beijing' },
    { label: '福州一脉阳光医学诊断中心（142）', value: 'yimai-fuzhou' },
    { label: '辽宁一脉阳光医学诊断中心（513）', value: 'yimai-liaoning' },
    { label: '南昌一脉阳光医学诊断中心（358）', value: 'yimai-nanchang' },
    { label: '温州一脉颐影医学影像诊断中心（190）', value: 'yimai-wenzhou' },
    { label: '湘潭一脉阳光医学诊断中心（48）', value: 'yimai-xiangtan' },
    { label: '一脉阳光上海正影医学影像诊断中心（530）', value: 'yimai-shanghai' },
    { label: '长春一脉阳光医学诊断中心（517）', value: 'yimai-changchun' },
    { label: '长沙一脉阳光医学诊断中心（224）', value: 'yimai-changsha' },
    { label: '郑州一脉阳光医学诊断中心（313）', value: 'yimai-zhengzhou' },
  ],
  'platform-activity': [
    { label: '满减活动', value: 'full-reduction' },
    { label: '折扣活动', value: 'discount' },
    { label: '新客优惠券', value: 'new-user-coupon' },
    { label: '组合项目优惠', value: 'combo-project-discount' },
  ],
}

const yimaiCenterOptions = [
  { label: '北京一脉阳光医学诊断中心（193）', value: 'yimai-beijing' },
  { label: '福州一脉阳光医学诊断中心（142）', value: 'yimai-fuzhou' },
  { label: '辽宁一脉阳光医学诊断中心（513）', value: 'yimai-liaoning' },
  { label: '南昌一脉阳光医学诊断中心（358）', value: 'yimai-nanchang' },
  { label: '温州一脉颐影医学影像诊断中心（190）', value: 'yimai-wenzhou' },
  { label: '湘潭一脉阳光医学诊断中心（48）', value: 'yimai-xiangtan' },
  { label: '一脉阳光上海正影医学影像诊断中心（530）', value: 'yimai-shanghai' },
  { label: '长春一脉阳光医学诊断中心（517）', value: 'yimai-changchun' },
  { label: '长沙一脉阳光医学诊断中心（224）', value: 'yimai-changsha' },
  { label: '郑州一脉阳光医学诊断中心（313）', value: 'yimai-zhengzhou' },
]

const ACTIVITY_SCOPE_ID = 'activity-scope'
const PLATFORM_COMMISSION_RATE = 0.25
const LEGACY_EXAM_DISCOUNT_RATE = 0.7
const DEFAULT_PLATFORM_ACTIVITY_CONFIGS = {
  'full-reduction': {
    actionType: 'amount-off',
    thresholdAmount: 300,
    discountAmount: 30,
    displayName: '满300减30',
    patientHint: '患者下单页自动展示，达到门槛后结算时直接抵扣',
    eligibility: '全部患者',
    scopeText: '青藤平台全部影像检查订单',
    triggerText: '按订单实付前项目费用累计判断门槛',
    settlementText: '结算时自动抵扣青藤平台优惠金额',
  },
  discount: {
    actionType: 'percentage-off',
    discountRate: 8.5,
    maxDiscountAmount: 80,
    displayName: '全场8.5折',
    patientHint: '患者下单页展示青藤平台折扣，结算时按订单项目金额自动计算优惠',
    eligibility: '全部患者',
    scopeText: '青藤平台全部影像检查订单',
    triggerText: '订单进入确认页后按项目费用计算折扣',
    settlementText: '结算时按折扣率抵扣，超过封顶金额按封顶抵扣',
  },
  'new-user-coupon': {
    actionType: 'new-user-coupon',
    thresholdAmount: 200,
    discountAmount: 25,
    displayName: '新客满200减25',
    patientHint: '首次下单患者自动领券并在订单确认页使用',
    eligibility: '青藤平台首次下单患者',
    scopeText: '新客首单影像检查订单',
    triggerText: '患者首次提交订单且订单金额达到门槛',
    settlementText: '支付前自动匹配新客券并完成抵扣',
  },
  'combo-project-discount': {
    actionType: 'combo-benefit',
    comboCount: 2,
    discountAmount: 50,
    displayName: '组合检查减50',
    patientHint: '患者同一订单选择多个检查项目时自动展示组合优惠',
    eligibility: '同单多项目患者',
    scopeText: '同一订单内多个影像检查项目',
    triggerText: '订单内检查项目数量达到组合条件',
    settlementText: '按组合项目规则在结算时自动抵扣',
  },
}

const sourcePlatforms = [
  { label: '全部平台', value: 'all' },
  { label: '平安', value: 'pingan' },
  { label: '青藤自营', value: 'qingteng' },
  { label: '一脉', value: 'yimai' },
  { label: '其他合作平台', value: 'partner-other' },
]

const priceRuleTypes = [
  {
    label: '互联网医院',
    value: 'internet-hospital-activity',
    tagColor: 'blue',
    priority: 30,
    formTitle: '互联网医院活动',
    priceColumnTitle: '活动价',
    description: '用于互联网医院侧的项目价格活动，解决不同互联网医院/合作渠道展示不同价格的问题。',
  },
  {
    label: '交付中心',
    value: 'delivery-center-activity',
    tagColor: 'green',
    priority: 20,
    formTitle: '交付中心活动',
    priceColumnTitle: '活动价',
    description: '用于交付中心自身项目的阶段性价格活动。',
  },
  {
    label: '青藤平台',
    value: 'platform-activity',
    tagColor: 'purple',
    priority: 40,
    formTitle: '青藤平台活动',
    priceColumnTitle: '优惠后价',
    description: '用于青藤平台层面的通用优惠、用户券或折扣活动。',
  },
]

const internetHospitalActivityMethodOptions = [
  { label: '满减活动', value: 'full-reduction' },
  { label: '折扣活动', value: 'discount' },
]

const legacyRuleTypeMap = {
  'platform-price': 'internet-hospital-activity',
  'project-activity': 'delivery-center-activity',
  'user-discount': 'platform-activity',
  'bundle-discount': 'platform-activity',
}

const institutionsByChannel = {
  'internet-hospital': [
    { label: '成都高新影像交付中心', value: 'center-ih-001' },
    { label: '南昌红谷滩影像交付中心', value: 'center-ih-002' },
    { label: '南昌西湖影像交付中心', value: 'center-ih-003' },
    { label: '杭州滨江影像交付中心', value: 'center-ih-004' },
  ],
  'yimai-center': yimaiCenterOptions,
  'qingteng-self-order': [
    { label: '青藤成都自助开单中心', value: 'center-qt-001' },
    { label: '青藤南昌自助开单中心', value: 'center-qt-002' },
    { label: '青藤杭州自助开单中心', value: 'center-qt-003' },
  ],
}

const ctMappedProjectNames = [
  'CT颅脑平扫',
  'CT颅脑增强',
  'CT颅底平扫',
  'CT颅底增强',
  'CT颌面部平扫',
  'CT颌面部增强',
  'CT眼部平扫',
  'CT眼部增强',
  'CT副鼻窦平扫',
  'CT副鼻窦增强',
]

const standardProjects = ctMappedProjectNames.map((name, index) => {
  const platformCode = String(30010100510000 + index).padStart(14, '0')
  return {
    id: `p-${String(index + 1).padStart(3, '0')}`,
    name,
    type: 'CT',
    platformCode,
    platformName: name,
    examFee: 60,
    materialFee: 10,
    drugFee: 10,
    code: platformCode,
    category: 'CT',
    originPrice: 80,
  }
})

const seedActivities = [
  {
    id: 'act-001',
    name: '好大夫价格活动',
    description: '互联网医院活动：面向蚂蚁好大夫维护已对码项目的活动价。',
    ruleType: 'internet-hospital-activity',
    sourcePlatformId: 'all',
    channelId: 'mayi-doctor',
    institutionIds: [ACTIVITY_SCOPE_ID],
    startAt: '2026-07-03 00:00',
    endAt: '2026-08-02 23:59',
    status: 'listed',
    creator: DEMO_OPERATOR_NAME,
    updatedAt: '2026-07-02 18:00',
    priority: 30,
    institutionConfigs: {
      [ACTIVITY_SCOPE_ID]: [
        { projectId: 'p-001', activityPrice: 100 },
      ],
    },
    logs: [
      { action: '创建活动', operator: DEMO_OPERATOR_NAME, at: '2026-07-02 18:00', detail: '创建好大夫价格活动' },
      { action: '上架活动', operator: DEMO_OPERATOR_NAME, at: '2026-07-02 18:00', detail: '活动已上架' },
    ],
  },
]

const statusMeta = {
  listed: { label: '已上架', className: 'activity-status-listed', tagColor: 'blue' },
  offline: { label: '已下架', className: 'activity-status-offline', tagColor: 'orange' },
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function isSharePath(pathname) {
  return pathname.startsWith(ACTIVITY_MANAGEMENT_SHARE_BASE_PATH)
}

function isCopyPath(pathname) {
  return pathname.startsWith(ACTIVITY_MANAGEMENT_COPY_BASE_PATH)
}

function getActivityVariant(pathname, explicitVariant) {
  if (explicitVariant) return explicitVariant
  if (isSharePath(pathname)) return 'share'
  if (isCopyPath(pathname)) return 'copy'
  return 'default'
}

function getActivityBasePath(variant) {
  if (variant === 'share') return ACTIVITY_MANAGEMENT_SHARE_BASE_PATH
  if (variant === 'copy') return ACTIVITY_MANAGEMENT_COPY_BASE_PATH
  return ACTIVITY_MANAGEMENT_BASE_PATH
}

function getActivityStorageKey(variant) {
  if (variant === 'share') return STORAGE_KEY_SHARE
  if (variant === 'copy') return STORAGE_KEY_COPY
  return STORAGE_KEY_BACKSTAGE
}

function getActivityPageTitle(variant) {
  return variant === 'copy' ? '活动价格管理副本' : '活动价格管理'
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
  if (action.includes('下架')) return '下架活动并恢复基础价格'
  return '更新价格规则配置'
}

function normalizeRuleType(ruleType) {
  const normalized = legacyRuleTypeMap[ruleType] || ruleType
  return priceRuleTypes.some((item) => item.value === normalized) ? normalized : 'internet-hospital-activity'
}

function getRuleTypeMeta(ruleType) {
  const normalized = normalizeRuleType(ruleType)
  return priceRuleTypes.find((item) => item.value === normalized) || priceRuleTypes[0]
}

function getSourcePlatformName(id) {
  return sourcePlatforms.find((item) => item.value === id)?.label || '全部平台'
}

function getActivityObjectOptions(ruleType) {
  return activityObjectOptionsByRuleType[normalizeRuleType(ruleType)] || []
}

function isInternetHospitalActivity(ruleType) {
  return normalizeRuleType(ruleType) === 'internet-hospital-activity'
}

function getDefaultActivityObjectId(ruleType) {
  return getActivityObjectOptions(ruleType)[0]?.value
}

function isActivityObjectValid(ruleType, activityObjectId) {
  return getActivityObjectOptions(ruleType).some((item) => item.value === activityObjectId)
}

function isPlatformActivity(ruleType) {
  return normalizeRuleType(ruleType) === 'platform-activity'
}

function isPlatformActivityConfig(ruleType, channelId) {
  return isPlatformActivity(ruleType) && Boolean(DEFAULT_PLATFORM_ACTIVITY_CONFIGS[channelId])
}

function isInternetHospitalActivityMethod(value) {
  return internetHospitalActivityMethodOptions.some((item) => item.value === value)
}

function getActivityDiscountConfigKey(ruleType, channelId, activityMethod) {
  if (isPlatformActivityConfig(ruleType, channelId)) return channelId
  if (isInternetHospitalActivity(ruleType) && isInternetHospitalActivityMethod(activityMethod)) return activityMethod
  return undefined
}

function getActivityMethodName(activityMethod) {
  return internetHospitalActivityMethodOptions.find((item) => item.value === activityMethod)?.label || '-'
}

function getPlatformActivityTemplate(activityObjectId) {
  return DEFAULT_PLATFORM_ACTIVITY_CONFIGS[activityObjectId] || DEFAULT_PLATFORM_ACTIVITY_CONFIGS['full-reduction']
}

function getNumericConfigValue(value, fallback) {
  const numberValue = Number(value)
  return Number.isNaN(numberValue) ? fallback : numberValue
}

function getPlatformActivityDisplayName(activityObjectId, config) {
  if (activityObjectId === 'discount') return `全场${config.discountRate}折`
  if (activityObjectId === 'new-user-coupon') return `新客满${config.thresholdAmount}减${config.discountAmount}`
  if (activityObjectId === 'combo-project-discount') return `组合检查减${config.discountAmount}`
  return `满${config.thresholdAmount}减${config.discountAmount}`
}

function normalizePlatformActivityConfig(activityObjectId, config = {}) {
  const template = getPlatformActivityTemplate(activityObjectId)
  const normalized = {
    ...template,
    ...config,
    activityObjectId,
    thresholdAmount: getNumericConfigValue(config.thresholdAmount, template.thresholdAmount),
    discountAmount: getNumericConfigValue(config.discountAmount, template.discountAmount),
    discountRate: getNumericConfigValue(config.discountRate, template.discountRate),
    maxDiscountAmount: getNumericConfigValue(config.maxDiscountAmount, template.maxDiscountAmount),
    comboCount: getNumericConfigValue(config.comboCount, template.comboCount),
    eligibility: config.eligibility?.trim() || template.eligibility,
    patientHint: config.patientHint?.trim() || template.patientHint,
    scopeText: config.scopeText?.trim() || template.scopeText,
    triggerText: config.triggerText?.trim() || template.triggerText,
    settlementText: config.settlementText?.trim() || template.settlementText,
  }

  normalized.displayName = config.displayName?.trim() || getPlatformActivityDisplayName(activityObjectId, normalized)
  return normalized
}

function getPlatformActivityConfig(activityOrChannelId, config) {
  if (typeof activityOrChannelId === 'string') {
    return normalizePlatformActivityConfig(activityOrChannelId, config)
  }

  const activity = activityOrChannelId
  const activityObjectId = activity?.channelId || 'full-reduction'
  return normalizePlatformActivityConfig(
    activityObjectId,
    activity?.platformActivityConfig || activity?.fullReductionRule,
  )
}

function getPlatformActivityText(activityObjectId, config) {
  return normalizePlatformActivityConfig(activityObjectId, config).displayName
}

function applyActivityDiscountContext(config, context, activityObjectName) {
  if (context !== 'internet-hospital') return config

  return {
    ...config,
    scopeText: `互联网医院「${activityObjectName || '活动对象'}」活动订单`,
    patientHint: config.activityObjectId === 'discount'
      ? '患者下单页展示互联网医院折扣，结算时按订单项目金额自动计算优惠'
      : '患者下单页自动展示互联网医院满减，达到门槛后结算时直接抵扣',
    settlementText: config.activityObjectId === 'discount'
      ? '结算时按折扣率抵扣，超过封顶金额按封顶抵扣'
      : '结算时自动抵扣活动优惠金额',
  }
}

function getPlatformActivityConfigIntro(activityObjectId, context = 'qingteng') {
  const orderLabel = context === 'internet-hospital' ? '互联网医院订单' : '青藤平台订单'
  const promoLabel = context === 'internet-hospital' ? '互联网医院活动' : '青藤平台促销'

  if (activityObjectId === 'discount') return `面向${orderLabel}的统一折扣配置，适合阶段性${promoLabel}或节假日折扣。`
  if (activityObjectId === 'new-user-coupon') return '面向首次下单患者的拉新优惠配置，自动识别新客资格并在下单链路展示。'
  if (activityObjectId === 'combo-project-discount') return '面向同单多项目检查的组合优惠配置，适合 CT/MR 多项目组合转化。'
  return `面向${orderLabel}的满减优惠配置，适合按订单金额门槛做${promoLabel}。`
}

function getPlatformActivityFieldConfigs(activityObjectId) {
  if (activityObjectId === 'discount') {
    return [
      { key: 'discountRate', label: '折扣力度', type: 'number', addonBefore: '折', min: 0.1, max: 9.9, precision: 1 },
      { key: 'maxDiscountAmount', label: '最高优惠金额', type: 'number', addonBefore: '￥', min: 1, precision: 2 },
      { key: 'displayName', label: '患者端优惠文案', type: 'text', wide: true, maxLength: 20 },
    ]
  }

  if (activityObjectId === 'combo-project-discount') {
    return [
      { key: 'comboCount', label: '组合项目数量', type: 'number', addonBefore: '满', addonAfter: '项', min: 2, precision: 0 },
      { key: 'discountAmount', label: '组合优惠金额', type: 'number', addonBefore: '减￥', min: 1, precision: 2 },
      { key: 'displayName', label: '患者端优惠文案', type: 'text', wide: true, maxLength: 20 },
    ]
  }

  return [
    { key: 'thresholdAmount', label: activityObjectId === 'new-user-coupon' ? '首单优惠门槛' : '订单满减门槛', type: 'number', addonBefore: '满￥', min: 1, precision: 2 },
    { key: 'discountAmount', label: '优惠金额', type: 'number', addonBefore: '减￥', min: 1, precision: 2 },
    { key: 'displayName', label: '患者端优惠文案', type: 'text', wide: true, maxLength: 20 },
  ]
}

function getPlatformActivitySummaryItems(activityObjectId, config) {
  if (activityObjectId === 'discount') {
    return [
      { label: '患者端优惠文案', value: config.displayName },
      { label: '折扣力度', value: `${config.discountRate} 折` },
      { label: '最高优惠金额', value: `￥${config.maxDiscountAmount}` },
    ]
  }

  if (activityObjectId === 'combo-project-discount') {
    return [
      { label: '患者端优惠文案', value: config.displayName },
      { label: '组合项目数量', value: `${config.comboCount} 项` },
      { label: '组合优惠金额', value: `￥${config.discountAmount}` },
    ]
  }

  return [
    { label: '患者端优惠文案', value: config.displayName },
    { label: activityObjectId === 'new-user-coupon' ? '首单优惠门槛' : '订单满减门槛', value: `￥${config.thresholdAmount}` },
    { label: '优惠金额', value: `￥${config.discountAmount}` },
  ]
}

function PlatformActivitySummary({ activityObjectId, config }) {
  return (
    <div className="activity-discount-summary">
      {getPlatformActivitySummaryItems(activityObjectId, config).map((item) => (
        <div key={item.label} className="activity-discount-summary__item">
          <span>{item.label}</span>
          <strong>{item.value}</strong>
        </div>
      ))}
    </div>
  )
}

function PlatformActivityRuleNote({ config }) {
  const ruleItems = [
    { label: '适用范围', value: config.scopeText },
    { label: '触发方式', value: config.triggerText },
    { label: '患者展示', value: '下单页、确认订单页、支付页同步展示' },
    { label: '抵扣方式', value: config.settlementText },
  ]

  return (
    <div className="activity-discount-note">
      <div className="activity-discount-note__title">规则说明</div>
      <div className="activity-discount-note__grid">
        {ruleItems.map((item) => (
          <div key={item.label} className="activity-discount-note__item">
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </div>
        ))}
      </div>
      <div className="activity-discount-note__flow">
        <span>业务闭环</span>
        <strong>配置规则、患者展示、支付抵扣、活动核销</strong>
      </div>
    </div>
  )
}

function sanitizeActivitiesForDemo(activities = []) {
  return activities.map((activity, index) => {
    const ruleType = normalizeRuleType(activity.ruleType || 'internet-hospital-activity')
    const ruleMeta = getRuleTypeMeta(ruleType)
    const activityMethod = isInternetHospitalActivity(ruleType) && isInternetHospitalActivityMethod(activity.activityMethod)
      ? activity.activityMethod
      : undefined
    const discountConfigKey = getActivityDiscountConfigKey(ruleType, activity.channelId, activityMethod)
    const platformActivityConfig = discountConfigKey
      ? getPlatformActivityConfig(discountConfigKey, activity.platformActivityConfig || activity.fullReductionRule)
      : undefined
    return {
      ...activity,
      activityMethod,
      name: activity.name || getDemoActivityName(activity.id, index),
      description: activity.description || '活动说明，用于演示后台活动配置与维护流程。',
      ruleType,
      sourcePlatformId: activity.sourcePlatformId || 'all',
      priority: activity.priority || ruleMeta.priority,
      institutionConfigs: normalizeInstitutionConfigPrices(activity.institutionConfigs),
      platformActivityConfig,
      fullReductionRule: undefined,
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
  return [
    ...channels,
    ...Object.values(activityObjectOptionsByRuleType).flat(),
  ].find((item) => item.value === id)?.label || '-'
}

function getInstitutionName(id) {
  if (id === ACTIVITY_SCOPE_ID) return '活动通用范围'
  return Object.values(institutionsByChannel)
    .flat()
    .find((item) => item.value === id)?.label || getChannelName(id)
}

function getDeliveryScopeOptions() {
  return yimaiCenterOptions
}

function getValidDeliveryScopeIds(ids = []) {
  const validIds = new Set(getDeliveryScopeOptions().map((item) => item.value))
  return ids.filter((id) => validIds.has(id))
}

function getDefaultInstitutionIds(ruleType, channelId, existingIds = []) {
  if (isPlatformActivityConfig(ruleType, channelId)) return [ACTIVITY_SCOPE_ID]
  if (isInternetHospitalActivity(ruleType)) return getValidDeliveryScopeIds(existingIds)
  if (normalizeRuleType(ruleType) === 'delivery-center-activity') return channelId ? [channelId] : []
  return existingIds.length ? existingIds : [ACTIVITY_SCOPE_ID]
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

function isBundleConfig(value) {
  return Boolean(value && typeof value === 'object' && value.type === 'bundle')
}

function getBundleProjects(projectIds = []) {
  return projectIds.map(getProject).filter(Boolean)
}

function getBundleProjectNameText(projectIds = []) {
  const names = getBundleProjects(projectIds).map((project) => project.name)
  return names.length ? names.join('、') : '-'
}

function renderPlatformProjectName(_, row) {
  if (row.rowType !== 'bundle') return row.platformName

  const projects = row.projects || []
  if (!projects.length) return row.platformName || '-'

  return (
    <div className="activity-platform-project-names">
      {projects.map((project) => (
        <span key={project.id}>{project.name}</span>
      ))}
    </div>
  )
}

function sumProjectFee(projects, key) {
  return projects.reduce((sum, project) => sum + Number(project?.[key] || 0), 0)
}

function getBundleDefaultPrice(projectIds = []) {
  return getBundleProjects(projectIds).reduce((sum, project) => sum + calculatePatientDisplayPrice(project), 0)
}

function getBundleDisplayName(projectIds = []) {
  const projects = getBundleProjects(projectIds)
  if (!projects.length) return '组套项目SKU'
  if (projects.length <= 2) return `组套SKU：${projects.map((project) => project.name).join(' + ')}`
  return `组套SKU：${projects.slice(0, 2).map((project) => project.name).join(' + ')} 等${projects.length}项`
}

function getSavedConfigProjectIds(config) {
  if (config?.type === 'bundle' || config?.projectIds?.length) return config.projectIds || []
  return config?.projectId ? [config.projectId] : []
}

function getProjectMapProjectIds(projectMap = {}) {
  return Object.entries(projectMap).flatMap(([projectId, config]) => (
    isBundleConfig(config) ? config.projectIds || [] : [projectId]
  ))
}

function getConfigActivityPrice(config) {
  return isBundleConfig(config) ? config.activityPrice : config
}

function getConfigMapFromSavedConfigs(configs = []) {
  return Object.fromEntries(configs.map((item, index) => {
    if (item.type === 'bundle' || item.projectIds?.length) {
      const skuId = item.skuId || `bundle-${index + 1}`
      return [skuId, {
        type: 'bundle',
        skuId,
        skuName: item.skuName || getBundleDisplayName(item.projectIds),
        projectIds: item.projectIds || [],
        activityPrice: item.activityPrice,
      }]
    }

    return [item.projectId, item.activityPrice]
  }))
}

function getInstitutionConfigMap(activity) {
  return Object.fromEntries(
    Object.entries(activity.institutionConfigs || {}).map(([institutionId, configs]) => (
      [institutionId, getConfigMapFromSavedConfigs(configs)]
    )),
  )
}

function toInstitutionConfigs(configMap, institutionIds) {
  return Object.fromEntries(
    institutionIds.map((institutionId) => {
      const projectMap = configMap[institutionId] || {}
      return [institutionId, Object.entries(projectMap).map(([projectId, config]) => {
        if (isBundleConfig(config)) {
          return {
            type: 'bundle',
            skuId: projectId,
            skuName: config.skuName || getBundleDisplayName(config.projectIds),
            projectIds: config.projectIds || [],
            activityPrice: config.activityPrice,
          }
        }

        return { projectId, activityPrice: config }
      })]
    }),
  )
}

function cloneProjectMap(projectMap = {}) {
  return Object.fromEntries(Object.entries(projectMap).map(([projectId, config]) => [
    projectId,
    isBundleConfig(config)
      ? { ...config, projectIds: [...(config.projectIds || [])] }
      : config,
  ]))
}

function getSharedInstitutionProjectMap(configMap, institutionIds, sourceInstitutionId) {
  const sourceProjectMap = [
    configMap[sourceInstitutionId],
    ...institutionIds.map((institutionId) => configMap[institutionId]),
  ]
    .filter(Boolean)
    .find((projectMap) => Object.keys(projectMap).length) || {}

  return Object.fromEntries(
    institutionIds.map((institutionId) => [institutionId, cloneProjectMap(sourceProjectMap)]),
  )
}

function getProject(projectId) {
  return standardProjects.find((item) => item.id === projectId)
}

function calculatePatientDisplayPrice(project) {
  if (!project) return 0
  return Number(project.examFee || 0) + Number(project.materialFee || 0) + Number(project.drugFee || 0)
}

function getDefaultActivityPrice(projectId) {
  const project = getProject(projectId)
  return calculatePatientDisplayPrice(project)
}

function getSelectedConfigRows(projectMap = {}) {
  return Object.entries(projectMap).map(([rowId, config]) => {
    if (isBundleConfig(config)) {
      const projects = getBundleProjects(config.projectIds)
      return {
        id: rowId,
        rowType: 'bundle',
        skuName: config.skuName || getBundleDisplayName(config.projectIds),
        projectIds: config.projectIds || [],
        projects,
        name: config.skuName || getBundleDisplayName(config.projectIds),
        type: '组套SKU',
        platformCode: projects.map((project) => project.platformCode).join(' / '),
        platformName: getBundleProjectNameText(config.projectIds),
        examFee: sumProjectFee(projects, 'examFee'),
        materialFee: sumProjectFee(projects, 'materialFee'),
        drugFee: sumProjectFee(projects, 'drugFee'),
        activityPrice: config.activityPrice,
      }
    }

    const project = getProject(rowId)
    if (!project) return null
    return {
      ...project,
      id: rowId,
      rowType: 'project',
      activityPrice: config,
    }
  }).filter(Boolean)
}

function getLegacyActivityPrice(project) {
  if (!project) return 0
  const legacyExamDisplayPrice = Number(project.examFee || 0) * LEGACY_EXAM_DISCOUNT_RATE / (1 - PLATFORM_COMMISSION_RATE)
  return legacyExamDisplayPrice + Number(project.materialFee || 0) + Number(project.drugFee || 0)
}

function normalizeActivityPrice(projectId, activityPrice) {
  const project = getProject(projectId)
  const numericPrice = Number(activityPrice)
  if (!project || Number.isNaN(numericPrice)) return activityPrice

  const legacyDefaultPrice = getLegacyActivityPrice(project)
  if (Math.abs(numericPrice - legacyDefaultPrice) > 0.01) return activityPrice

  return Number(calculatePatientDisplayPrice(project).toFixed(2))
}

function normalizeInstitutionConfigPrices(institutionConfigs = {}) {
  return Object.fromEntries(
    Object.entries(institutionConfigs || {}).map(([institutionId, configs = []]) => [
      institutionId,
      configs.map((config, index) => {
        if (config.type === 'bundle' || config.projectIds?.length) {
          const projectIds = config.projectIds || []
          return {
            ...config,
            type: 'bundle',
            skuId: config.skuId || `bundle-${index + 1}`,
            skuName: config.skuName || getBundleDisplayName(projectIds),
            projectIds,
            activityPrice: config.activityPrice,
          }
        }

        return {
          ...config,
          activityPrice: normalizeActivityPrice(config.projectId, config.activityPrice),
        }
      }),
    ]),
  )
}

function normalizeStatus(activity) {
  if (activity.status === 'offline') return 'offline'
  if (activity.endAt && dayjs(activity.endAt).isBefore(dayjs())) {
    return 'offline'
  }
  return 'listed'
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

function canPassIntegrity(values, institutionProjectMap, activities, editingId, effectiveInstitutionIds = []) {
  if (!values.name?.trim()) return '请填写活动名称'
  if (!values.ruleType) return '请选择活动类型'
  if (!values.channelId) return '请选择活动对象'
  if (!effectiveInstitutionIds.length) {
    return isInternetHospitalActivity(values.ruleType) ? '请选择交付范围' : '请先选择活动对象'
  }
  if (!values.timeRange?.[0] || !values.timeRange?.[1]) return '请设置生效开始和结束时间'

  const [startAt, endAt] = values.timeRange
  if (!endAt.isAfter(startAt)) return '结束时间必须晚于开始时间'

  const discountConfigKey = getActivityDiscountConfigKey(values.ruleType, values.channelId, values.activityMethod)
  if (discountConfigKey) {
    const platformConfig = normalizePlatformActivityConfig(discountConfigKey, values.platformActivityConfig)
    if (discountConfigKey === 'discount') {
      if (!platformConfig.discountRate || platformConfig.discountRate <= 0 || platformConfig.discountRate >= 10) return '请填写 0-10 之间的折扣'
      if (!platformConfig.maxDiscountAmount || platformConfig.maxDiscountAmount <= 0) return '请填写折扣封顶金额'
    } else if (discountConfigKey === 'combo-project-discount') {
      if (!platformConfig.comboCount || platformConfig.comboCount < 2) return '组合项目数量至少为 2 项'
      if (!platformConfig.discountAmount || platformConfig.discountAmount <= 0) return '请填写组合优惠金额'
    } else {
      if (!platformConfig.thresholdAmount || platformConfig.thresholdAmount <= 0) return '请填写订单优惠门槛'
      if (!platformConfig.discountAmount || platformConfig.discountAmount <= 0) return '请填写优惠金额'
      if (platformConfig.discountAmount >= platformConfig.thresholdAmount) return '优惠金额必须小于优惠门槛'
    }
    if (!platformConfig.displayName?.trim()) return '请填写患者端展示文案'
  }

  if (!discountConfigKey) {
    for (const institutionId of effectiveInstitutionIds) {
      const projectMap = institutionProjectMap[institutionId] || {}
      const projectIds = Object.keys(projectMap)
      if (!projectIds.length) return '请先添加检查项目'
      const hasInvalidBundle = Object.values(projectMap).some((config) => isBundleConfig(config) && (config.projectIds || []).length < 2)
      if (hasInvalidBundle) return '组套项目SKU至少需要包含 2 个检查项目'
      const hasMissingPrice = projectIds.some((projectId) => {
        const price = getConfigActivityPrice(projectMap[projectId])
        return price === null || price === undefined
      })
      if (hasMissingPrice) return '请填写完整活动价'
    }
  }

  const hasConflict = activities.some((activity) => {
    if (activity.id === editingId) return false
    if (normalizeStatus(activity) === 'offline') return false
    if (activity.channelId !== values.channelId) return false
    if (normalizeRuleType(activity.ruleType || 'internet-hospital-activity') !== values.ruleType) return false
    const existingStart = dayjs(activity.startAt)
    const existingEnd = dayjs(activity.endAt)
    if (!(startAt.isBefore(existingEnd) && endAt.isAfter(existingStart))) return false

    if (discountConfigKey) {
      if (isPlatformActivity(values.ruleType)) return true
      if (activity.activityMethod !== values.activityMethod) return false
      return effectiveInstitutionIds.some((institutionId) => activity.institutionIds?.includes(institutionId))
    }

    return effectiveInstitutionIds.some((institutionId) => {
      if (!activity.institutionIds?.includes(institutionId)) return false
      const currentProjectIds = getProjectMapProjectIds(institutionProjectMap[institutionId] || {})
      const existingProjectIds = (activity.institutionConfigs?.[institutionId] || []).flatMap(getSavedConfigProjectIds)
      return currentProjectIds.some((projectId) => existingProjectIds.includes(projectId))
    })
  })

  if (hasConflict) {
    return discountConfigKey
      ? '同一活动对象、活动方式和交付范围在重叠时间内只能存在一条有效活动'
      : '同一活动对象、活动类型和项目在重叠时间内只能存在一条有效活动'
  }
  return ''
}

function ActivityListPage({ activities, commit, basePath, standalone, pageTitle }) {
  const navigate = useNavigate()
  const rows = useMemo(() => activities.map(enrichActivity), [activities])
  const overviewCards = useMemo(() => {
    const internetHospitalActivities = rows.filter((item) => normalizeRuleType(item.ruleType) === 'internet-hospital-activity')
    const deliveryCenterActivities = rows.filter((item) => normalizeRuleType(item.ruleType) === 'delivery-center-activity')
    const platformActivities = rows.filter((item) => normalizeRuleType(item.ruleType) === 'platform-activity')
    const totalProjects = rows.reduce((sum, item) => sum + (item.projectCount || 0), 0)

    return [
      { label: '活动总数', value: `${rows.length}个`, accentClass: 'activity-overview-card__value' },
      { label: '互联网医院活动', value: `${internetHospitalActivities.length}个`, accentClass: 'activity-overview-card__value activity-overview-card__value--green' },
      { label: '交付中心活动', value: `${deliveryCenterActivities.length}个`, accentClass: 'activity-overview-card__value' },
      { label: '青藤平台', value: `${platformActivities.length}个`, accentClass: 'activity-overview-card__value activity-overview-card__value--orange' },
      { label: '已关联项目数', value: `${totalProjects}项`, accentClass: 'activity-overview-card__value' },
    ]
  }, [rows])

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
    { title: '活动名称', dataIndex: 'name', width: 230 },
    {
      title: '活动类型',
      width: 160,
      render: (_, row) => <Tag color={row.ruleTypeMeta.tagColor}>{row.ruleTypeLabel}</Tag>,
    },
    { title: '活动对象', dataIndex: 'channelName', width: 180 },
    {
      title: '生效时间',
      width: 260,
      render: (_, row) => `${row.startAt} 至 ${row.endAt}`,
    },
    {
      title: '状态',
      width: 110,
      render: (_, row) => <StatusText status={row.status} />,
    },
    { title: '更新时间', dataIndex: 'updatedAt', width: 160 },
    {
      title: '操作',
      width: 260,
      render: (_, row) => (
        <Space size={14}>
          <Button type="link" className="activity-link" icon={<EyeOutlined />} onClick={() => navigate(`${basePath}/${row.id}`)}>
            查看
          </Button>
          <Button type="link" className="activity-link" icon={<EditOutlined />} onClick={() => navigate(`${basePath}/edit/${row.id}`)}>
            编辑
          </Button>
          {row.status === 'listed' ? (
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
        title={pageTitle}
        extra={(
          <Button className="activity-green-btn" icon={<PlusOutlined />} onClick={() => navigate(`${basePath}/create`)}>
            新建活动
          </Button>
        )}
        standalone={standalone}
      >
        <section className="activity-overview" aria-label={`${pageTitle}业务数据概览`}>
          <div className="activity-overview__title">业务数据概览</div>
          <div className="activity-overview__grid">
            {overviewCards.map((card) => (
              <div key={card.label} className="activity-overview-card">
                <div className="activity-overview-card__label">{card.label}</div>
                <div className={card.accentClass}>{card.value}</div>
              </div>
            ))}
          </div>
        </section>
        <Table
          className="activity-table"
          rowKey="id"
          columns={columns}
          dataSource={rows}
          pagination={{ pageSize: 10, showTotal: (total) => `共${total}条记录  当前显示${total}条记录` }}
        />
      </ActivityFrame>
    </Annotatable>
  )
}

function ActivityFormPage({ activities, commit, basePath, standalone, variant }) {
  const navigate = useNavigate()
  const { id } = useParams()
  const editingActivity = activities.find((item) => item.id === id)
  const isEdit = Boolean(editingActivity)
  const [form] = Form.useForm()
  const allowInternetHospitalActivityMethod = variant === 'copy'
  const defaultRuleType = normalizeRuleType(editingActivity?.ruleType || 'internet-hospital-activity')
  const defaultChannelId = isActivityObjectValid(defaultRuleType, editingActivity?.channelId)
    ? editingActivity.channelId
    : getDefaultActivityObjectId(defaultRuleType)
  const defaultActivityMethod = allowInternetHospitalActivityMethod
    && isInternetHospitalActivity(defaultRuleType)
    && isInternetHospitalActivityMethod(editingActivity?.activityMethod)
    ? editingActivity.activityMethod
    : undefined
  const defaultDiscountConfigKey = getActivityDiscountConfigKey(defaultRuleType, defaultChannelId, defaultActivityMethod)
  const defaultInstitutionIds = getDefaultInstitutionIds(defaultRuleType, defaultChannelId, editingActivity?.institutionIds || [])
  const [projectModalOpen, setProjectModalOpen] = useState(false)
  const [projectModalMode, setProjectModalMode] = useState('project')
  const [ruleType, setRuleType] = useState(defaultRuleType)
  const [channelId, setChannelId] = useState(defaultChannelId)
  const [activityMethod, setActivityMethod] = useState(defaultActivityMethod)
  const [selectedInstitutionIds, setSelectedInstitutionIds] = useState(() => defaultInstitutionIds)
  const [activeInstitutionId, setActiveInstitutionId] = useState(() => defaultInstitutionIds[0])
  const [institutionProjectMap, setInstitutionProjectMap] = useState(() => (
    editingActivity ? getInstitutionConfigMap(editingActivity) : {}
  ))
  const [projectKeywordInput, setProjectKeywordInput] = useState('')
  const [projectKeyword, setProjectKeyword] = useState('')
  const [projectTypeInput, setProjectTypeInput] = useState(undefined)
  const [projectType, setProjectType] = useState(undefined)
  const [librarySelectedIds, setLibrarySelectedIds] = useState([])
  const [platformActivityConfig, setPlatformActivityConfig] = useState(() => (
    getPlatformActivityConfig(defaultDiscountConfigKey || 'full-reduction', editingActivity?.platformActivityConfig || editingActivity?.fullReductionRule)
  ))

  const initialValues = isEdit ? {
    name: editingActivity.name,
    ruleType: defaultRuleType,
    channelId: defaultChannelId,
    activityMethod: defaultActivityMethod,
    deliveryScopeIds: isInternetHospitalActivity(defaultRuleType) ? defaultInstitutionIds : undefined,
    timeRange: [dayjs(editingActivity.startAt), dayjs(editingActivity.endAt)],
  } : {
    ruleType: 'internet-hospital-activity',
    channelId: getDefaultActivityObjectId('internet-hospital-activity'),
    activityMethod: undefined,
    deliveryScopeIds: [],
    timeRange: [dayjs().add(1, 'day').hour(0).minute(0), dayjs().add(31, 'day').hour(23).minute(59)],
  }

  const activeRuleMeta = getRuleTypeMeta(ruleType)
  const activityObjectOptions = getActivityObjectOptions(ruleType)
  const activeActivityObjectName = getChannelName(channelId)
  const deliveryScopeOptions = getDeliveryScopeOptions()
  const activeInstitutionName = getInstitutionName(activeInstitutionId)
  const isInternetHospitalConfig = isInternetHospitalActivity(ruleType)
  const watchedTimeRange = Form.useWatch('timeRange', form)
  const watchedRuleType = Form.useWatch('ruleType', form)
  const isPlatformConfig = isPlatformActivityConfig(ruleType, channelId)
  const effectiveActivityMethod = allowInternetHospitalActivityMethod ? activityMethod : undefined
  const activityDiscountConfigKey = getActivityDiscountConfigKey(ruleType, channelId, effectiveActivityMethod)
  const activityDiscountContext = isPlatformConfig ? 'qingteng' : 'internet-hospital'
  const canAddProjectConfig = !activityDiscountConfigKey && Boolean(activeInstitutionId)
  const normalizedPlatformActivityConfig = applyActivityDiscountContext(
    getPlatformActivityConfig(activityDiscountConfigKey || 'full-reduction', platformActivityConfig),
    activityDiscountContext,
    activeActivityObjectName,
  )
  const platformActivityFieldConfigs = activityDiscountConfigKey ? getPlatformActivityFieldConfigs(activityDiscountConfigKey) : []

  const conflictProjectMap = useMemo(() => {
    if (!activeInstitutionId || !channelId) return {}

    const [startAt, endAt] = watchedTimeRange || []
    const currentRuleType = watchedRuleType || ruleType

    return activities.reduce((acc, activity) => {
      if (activity.id === editingActivity?.id) return acc
      if (normalizeStatus(activity) === 'offline') return acc
      if (activity.channelId !== channelId) return acc
      if (normalizeRuleType(activity.ruleType || 'internet-hospital-activity') !== currentRuleType) return acc
      if (!activity.institutionIds?.includes(activeInstitutionId)) return acc

      if (startAt && endAt) {
        const existingStart = dayjs(activity.startAt)
        const existingEnd = dayjs(activity.endAt)
        if (!(startAt.isBefore(existingEnd) && endAt.isAfter(existingStart))) return acc
      }

      const configs = activity.institutionConfigs?.[activeInstitutionId] || []
      configs.forEach((item) => {
        getSavedConfigProjectIds(item).forEach((projectId) => {
          acc[projectId] = {
          activityName: activity.name,
          period: `${activity.startAt} 至 ${activity.endAt}`,
          }
        })
      })
      return acc
    }, {})
  }, [activities, activeInstitutionId, channelId, editingActivity?.id, ruleType, watchedRuleType, watchedTimeRange])

  const projectLibraryColumns = [
    { title: '项目名称', dataIndex: 'name', width: 150 },
    {
      title: '检查类型',
      dataIndex: 'type',
      width: 100,
      render: (type) => <Tag color="green">{type}</Tag>,
    },
    { title: '平台项目编码', dataIndex: 'platformCode', width: 170 },
    { title: '平台项目名称', dataIndex: 'platformName', width: 150 },
    {
      title: '项目检查费用',
      dataIndex: 'examFee',
      width: 130,
      render: (price) => Number(price).toFixed(1),
    },
    {
      title: '项目耗材费用',
      dataIndex: 'materialFee',
      width: 130,
      render: (price) => Number(price).toFixed(1),
    },
    {
      title: '项目药品费用',
      dataIndex: 'drugFee',
      width: 130,
      render: (price) => Number(price).toFixed(1),
    },
    {
      title: '检查项目总金额',
      width: 130,
      render: (_, row) => calculatePatientDisplayPrice(row).toFixed(1),
    },
  ]

  const selectedProjectMap = activeInstitutionId ? (institutionProjectMap[activeInstitutionId] || {}) : {}
  const selectedLibraryProjectIds = getProjectMapProjectIds(selectedProjectMap)
  const selectedProjectRows = getSelectedConfigRows(selectedProjectMap)
  const selectedBundleCount = selectedProjectRows.filter((row) => row.rowType === 'bundle').length

  const updateBundleSkuName = (bundleId, skuName) => {
    setInstitutionProjectMap((prev) => {
      const current = { ...(prev[activeInstitutionId] || {}) }
      const currentConfig = current[bundleId]
      if (!isBundleConfig(currentConfig)) return prev

      return {
        ...prev,
        [activeInstitutionId]: {
          ...current,
          [bundleId]: {
            ...currentConfig,
            skuName,
          },
        },
      }
    })
  }

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
        || project.platformCode.toLowerCase().includes(keyword)
        || project.platformName.toLowerCase().includes(keyword)
      )
    ))
  }, [projectKeyword, projectType])

  const selectedProjectColumns = [
    {
      title: '项目名称',
      dataIndex: 'name',
      width: 150,
      ellipsis: true,
      render: (_, row) => row.rowType === 'bundle' ? (
        <div className="activity-bundle-name">
          <Input
            className="activity-bundle-name__input"
            size="small"
            value={row.skuName}
            maxLength={40}
            onChange={(event) => updateBundleSkuName(row.id, event.target.value)}
          />
        </div>
      ) : row.name,
    },
    {
      title: '检查类型',
      dataIndex: 'type',
      width: 78,
      render: (_, row) => row.rowType === 'bundle' ? <Tag color="orange">组套SKU</Tag> : <Tag color="green">{row.type}</Tag>,
    },
    { title: '平台项目编码', dataIndex: 'platformCode', width: 118, ellipsis: true },
    { title: '平台项目名称', dataIndex: 'platformName', width: 126, render: renderPlatformProjectName },
    {
      title: '项目检查费用',
      dataIndex: 'examFee',
      width: 88,
      render: (price) => Number(price).toFixed(1),
    },
    {
      title: '项目耗材费用',
      dataIndex: 'materialFee',
      width: 88,
      render: (price) => Number(price).toFixed(1),
    },
    {
      title: '项目药品费用',
      dataIndex: 'drugFee',
      width: 88,
      render: (price) => Number(price).toFixed(1),
    },
    {
      title: '检查项目总金额',
      width: 98,
      render: (_, row) => <span className="activity-price-origin">￥{calculatePatientDisplayPrice(row).toFixed(1)}</span>,
    },
    {
      title: activeRuleMeta.priceColumnTitle,
      width: 126,
      render: (_, row) => (
        <div className={row.rowType === 'bundle' ? 'activity-bundle-price' : undefined}>
          {row.rowType === 'bundle' ? <span>组合项目一口价</span> : null}
          <InputNumber
            min={0}
            precision={2}
            value={getConfigActivityPrice(selectedProjectMap[row.id])}
            placeholder="填写价格"
            addonBefore="￥"
            disabled={!activeInstitutionId}
            onChange={(value) => setInstitutionProjectMap((prev) => {
              const current = { ...(prev[activeInstitutionId] || {}) }
              const currentConfig = current[row.id]
              current[row.id] = isBundleConfig(currentConfig)
                ? { ...currentConfig, activityPrice: value }
                : value

              return {
                ...prev,
                [activeInstitutionId]: current,
              }
            })}
          />
        </div>
      ),
    },
    {
      title: '操作',
      width: 58,
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

  const resetProjectModalState = () => {
    setProjectModalOpen(false)
    setLibrarySelectedIds([])
    setProjectKeywordInput('')
    setProjectKeyword('')
    setProjectTypeInput(undefined)
    setProjectType(undefined)
  }

  const openProjectModal = (mode) => {
    if (!activeInstitutionId) {
      message.warning(isInternetHospitalConfig ? '请先选择交付范围' : '请先选择活动对象')
      return
    }
    setProjectModalMode(mode)
    setLibrarySelectedIds([])
    setProjectModalOpen(true)
  }

  const handleAddProjects = () => {
    if (!librarySelectedIds.length) {
      message.warning('请先从检查项目已对码表选择检查项目')
      return
    }

    if (projectModalMode === 'bundle' && librarySelectedIds.length < 2) {
      message.warning('组套项目SKU至少需要选择 2 个检查项目')
      return
    }

    setInstitutionProjectMap((prev) => {
      const currentProjectMap = { ...(prev[activeInstitutionId] || {}) }

      if (projectModalMode === 'bundle') {
        const bundleId = `bundle-${Date.now()}`
        const bundleProjectIds = [...librarySelectedIds]
        currentProjectMap[bundleId] = {
          type: 'bundle',
          skuId: bundleId,
          skuName: getBundleDisplayName(bundleProjectIds),
          projectIds: bundleProjectIds,
          activityPrice: Number(getBundleDefaultPrice(bundleProjectIds).toFixed(2)),
        }
      } else {
        librarySelectedIds.forEach((projectId) => {
          currentProjectMap[projectId] = currentProjectMap[projectId] ?? getDefaultActivityPrice(projectId)
        })
      }

      return {
        ...prev,
        [activeInstitutionId]: currentProjectMap,
      }
    })
    resetProjectModalState()
  }

  const handleProjectSearch = () => {
    setProjectKeyword(projectKeywordInput.trim())
    setProjectType(projectTypeInput)
  }

  const handleChannelChange = (value) => {
    setChannelId(value)
    const nextInstitutionIds = getDefaultInstitutionIds(ruleType, value)
    setSelectedInstitutionIds(nextInstitutionIds)
    setActiveInstitutionId(nextInstitutionIds[0])
    setInstitutionProjectMap({})
    const nextDiscountConfigKey = getActivityDiscountConfigKey(ruleType, value, effectiveActivityMethod)
    if (nextDiscountConfigKey) {
      setPlatformActivityConfig(getPlatformActivityConfig(nextDiscountConfigKey))
    }
    form.setFieldValue('deliveryScopeIds', isInternetHospitalActivity(ruleType) ? nextInstitutionIds : undefined)
  }

  const handleRuleTypeChange = (value) => {
    const nextActivityObjectId = getDefaultActivityObjectId(value)
    const nextInstitutionIds = getDefaultInstitutionIds(value, nextActivityObjectId)
    const nextActivityMethod = undefined
    const nextDiscountConfigKey = getActivityDiscountConfigKey(value, nextActivityObjectId, nextActivityMethod)
    setRuleType(value)
    setChannelId(nextActivityObjectId)
    setActivityMethod(nextActivityMethod)
    setSelectedInstitutionIds(nextInstitutionIds)
    setActiveInstitutionId(nextInstitutionIds[0])
    setInstitutionProjectMap({})
    setPlatformActivityConfig(getPlatformActivityConfig(nextDiscountConfigKey || 'full-reduction'))
    form.setFieldValue('channelId', nextActivityObjectId)
    form.setFieldValue('activityMethod', nextActivityMethod)
    form.setFieldValue('deliveryScopeIds', isInternetHospitalActivity(value) ? nextInstitutionIds : undefined)
  }

  const handleActivityMethodChange = (value) => {
    setActivityMethod(value)
    setInstitutionProjectMap({})
    if (value) {
      setPlatformActivityConfig(getPlatformActivityConfig(value))
    }
  }

  const handleDeliveryScopeChange = (values = []) => {
    setSelectedInstitutionIds(values)
    setActiveInstitutionId((current) => values.includes(current) ? current : values[0])
    setInstitutionProjectMap((prev) => (
      Object.fromEntries(Object.entries(prev).filter(([institutionId]) => values.includes(institutionId)))
    ))
  }

  const updatePlatformActivityConfig = (key, value) => {
    setPlatformActivityConfig((prev) => normalizePlatformActivityConfig(activityDiscountConfigKey || 'full-reduction', {
      ...prev,
      [key]: value,
    }))
  }

  const handleSubmit = async () => {
    const values = await form.validateFields()
    const submittedActivityMethod = allowInternetHospitalActivityMethod ? values.activityMethod : undefined
    const submitValues = {
      ...values,
      activityMethod: submittedActivityMethod,
      platformActivityConfig: normalizedPlatformActivityConfig,
    }
    const discountConfigKey = getActivityDiscountConfigKey(values.ruleType, values.channelId, submittedActivityMethod)
    const isSubmittingPlatformConfig = isPlatformActivityConfig(values.ruleType, values.channelId)
    const isSubmittingDiscountConfig = Boolean(discountConfigKey)
    const isSubmittingInternetHospitalMethodConfig = allowInternetHospitalActivityMethod
      && isInternetHospitalActivity(values.ruleType)
      && isInternetHospitalActivityMethod(submittedActivityMethod)
    const effectiveInstitutionIds = isSubmittingPlatformConfig
      ? [ACTIVITY_SCOPE_ID]
      : selectedInstitutionIds.length
      ? selectedInstitutionIds
      : [activeInstitutionId].filter(Boolean)
    const submitInstitutionProjectMap = isInternetHospitalActivity(values.ruleType) && !isSubmittingDiscountConfig
      ? getSharedInstitutionProjectMap(institutionProjectMap, effectiveInstitutionIds, activeInstitutionId)
      : institutionProjectMap
    const error = canPassIntegrity(submitValues, submitInstitutionProjectMap, activities, editingActivity?.id, effectiveInstitutionIds)
    if (error) {
      message.error(error)
      return
    }

    const actionAt = now()
    const activityId = editingActivity?.id || `act-${actionAt.replace(/\D/g, '')}`
    const nextRuleMeta = getRuleTypeMeta(values.ruleType)
    const nextActivity = {
      id: activityId,
      name: values.name.trim(),
      description: isSubmittingDiscountConfig
        ? `${isSubmittingPlatformConfig ? '青藤平台' : `互联网医院${getChannelName(values.channelId)}`}：${getPlatformActivityText(discountConfigKey, normalizedPlatformActivityConfig)}，患者下单链路自动展示并在结算时抵扣。`
        : activeRuleMeta.description,
      ruleType: values.ruleType,
      activityMethod: isSubmittingInternetHospitalMethodConfig ? submittedActivityMethod : undefined,
      sourcePlatformId: 'all',
      channelId: values.channelId,
      institutionIds: effectiveInstitutionIds,
      startAt: values.timeRange[0].format(DATE_TIME_FORMAT),
      endAt: values.timeRange[1].format(DATE_TIME_FORMAT),
      status: 'listed',
      creator: editingActivity?.creator || DEMO_OPERATOR_NAME,
      updatedAt: actionAt,
      priority: nextRuleMeta.priority,
      institutionConfigs: isSubmittingDiscountConfig
        ? {}
        : toInstitutionConfigs(submitInstitutionProjectMap, effectiveInstitutionIds),
      platformActivityConfig: isSubmittingDiscountConfig ? normalizedPlatformActivityConfig : undefined,
      fullReductionRule: undefined,
      logs: [
        ...(editingActivity?.logs || []),
        {
          action: isEdit ? '编辑活动' : '创建活动',
          operator: DEMO_OPERATOR_NAME,
          at: actionAt,
          detail: isSubmittingPlatformConfig
            ? `配置青藤平台活动：${getPlatformActivityText(values.channelId, normalizedPlatformActivityConfig)}`
            : isSubmittingInternetHospitalMethodConfig
              ? `配置互联网医院活动方式：${getActivityMethodName(submittedActivityMethod)}`
            : `配置${nextRuleMeta.label}类型的活动项目`,
        },
        ...(editingActivity?.status !== 'listed'
          ? [{ action: '上架活动', operator: DEMO_OPERATOR_NAME, at: actionAt, detail: '手动上架活动' }]
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
                <Input placeholder="例如：平安肺结节专项活动" maxLength={30} showCount />
              </Form.Item>
              <Form.Item name="ruleType" label="活动类型" rules={[{ required: true, message: '请选择活动类型' }]}>
                <Select placeholder="请选择活动类型" options={priceRuleTypes} onChange={handleRuleTypeChange} />
              </Form.Item>
              <Form.Item name="channelId" label="活动对象" rules={[{ required: true, message: '请选择活动对象' }]}>
                <Select placeholder="请选择活动对象" options={activityObjectOptions} onChange={handleChannelChange} />
              </Form.Item>
              {isInternetHospitalConfig ? (
                <>
                  {allowInternetHospitalActivityMethod ? (
                    <Form.Item name="activityMethod" label="活动方式">
                      <Select
                        allowClear
                        placeholder="请选择活动方式（选填）"
                        options={internetHospitalActivityMethodOptions}
                        onChange={handleActivityMethodChange}
                      />
                    </Form.Item>
                  ) : null}
                  <Form.Item name="deliveryScopeIds" label="交付范围" rules={[{ required: true, message: '请选择交付范围' }]}>
                    <Select
                      mode="multiple"
                      placeholder="请选择一脉中心机构，可多选"
                      options={deliveryScopeOptions}
                      onChange={handleDeliveryScopeChange}
                    />
                  </Form.Item>
                </>
              ) : null}
              <Form.Item name="timeRange" label="生效时间" rules={[{ required: true, message: '请选择生效开始和结束时间' }]}>
                <RangePicker showTime format={DATE_TIME_FORMAT} style={{ width: '100%' }} />
              </Form.Item>
            </Form>
          </Card>
        </Annotatable>

        <div className="activity-project-flow">
          <Annotatable id={3}>
            {activityDiscountConfigKey ? (
              <Card
                className="activity-panel"
                title={isPlatformConfig ? '青藤平台配置方案' : '互联网医院活动方式配置'}
                extra={<Tag color="purple">{isPlatformConfig ? activeActivityObjectName : getActivityMethodName(activityMethod)}</Tag>}
              >
                <div className="activity-discount-layout">
                  <div className="activity-discount-config">
                    <div className="activity-discount-config__header">
                      <Text strong>{isPlatformConfig ? `青藤平台对象：${activeActivityObjectName}` : `活动对象：${activeActivityObjectName} / 活动方式：${getActivityMethodName(activityMethod)}`}</Text>
                      <Text type="secondary">{getPlatformActivityConfigIntro(activityDiscountConfigKey, activityDiscountContext)}</Text>
                    </div>
                    <div className="activity-discount-fields">
                      {platformActivityFieldConfigs.map((field) => (
                        <label
                          key={field.key}
                          className={`activity-discount-field${field.wide ? ' activity-discount-field--wide' : ''}`}
                        >
                          <span>{field.label}</span>
                          {field.type === 'text' ? (
                            <Input
                              value={normalizedPlatformActivityConfig[field.key]}
                              maxLength={field.maxLength}
                              onChange={(event) => updatePlatformActivityConfig(field.key, event.target.value)}
                            />
                          ) : (
                            <InputNumber
                              min={field.min}
                              max={field.max}
                              precision={field.precision}
                              value={normalizedPlatformActivityConfig[field.key]}
                              addonBefore={field.addonBefore}
                              addonAfter={field.addonAfter}
                              onChange={(value) => updatePlatformActivityConfig(field.key, value)}
                            />
                          )}
                        </label>
                      ))}
                    </div>
                    <PlatformActivityRuleNote config={normalizedPlatformActivityConfig} />
                  </div>
                </div>
              </Card>
            ) : (
            <Card
              className="activity-panel"
              title="适用项目与规则价格"
              extra={(
                <Space>
                  <Button icon={<PlusOutlined />} disabled={!canAddProjectConfig} onClick={() => openProjectModal('project')}>
                    添加检查项目
                  </Button>
                </Space>
              )}
            >
              <div className="activity-project-hint">
                <div>
                  <Text strong>{activeRuleMeta.formTitle}</Text>
                </div>
                <Tag color="green">
                  {activeInstitutionId
                    ? `已添加 ${selectedProjectRows.length} 项${selectedBundleCount ? `，含 ${selectedBundleCount} 个组套` : ''}`
                    : isInternetHospitalConfig ? '请选择交付范围' : '未选择活动对象'}
                </Tag>
              </div>
              <Table
                className="activity-table activity-price-config-table"
                size="small"
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
                scroll={{ x: 1018 }}
              />
            </Card>
            )}
          </Annotatable>
        </div>
        <Annotatable id={4}>
          <Modal
            title={projectModalMode === 'bundle' ? '添加组套项目SKU' : '检查项目已对码表'}
            open={projectModalOpen}
            width={980}
            okText={projectModalMode === 'bundle' ? '生成组套SKU' : '确认添加'}
            cancelText="取消"
            okButtonProps={{
              disabled: !canAddProjectConfig || (projectModalMode === 'bundle' ? librarySelectedIds.length < 2 : !librarySelectedIds.length),
            }}
            onOk={handleAddProjects}
            onCancel={resetProjectModalState}
          >
            <Paragraph type="secondary">
              {activeInstitutionId
                ? projectModalMode === 'bundle'
                  ? `为“${activeActivityObjectName} / ${activeInstitutionName}”选择多个已对码项目，提交后会合并为一个组套项目SKU，并在右侧只维护一个组合项目一口价。`
                  : `为“${activeActivityObjectName} / ${activeInstitutionName}”添加已对码检查项目。已添加项目会自动禁选。`
                : isInternetHospitalConfig ? '请先选择交付范围。' : '请先选择活动对象。'}
            </Paragraph>
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
                      disabled: selectedLibraryProjectIds.includes(record.id) || !activeInstitutionId || Boolean(conflict),
                      title: conflict
                        ? `与活动“${conflict.activityName}”冲突，时间：${conflict.period}`
                        : selectedLibraryProjectIds.includes(record.id)
                          ? '当前活动已添加该项目'
                          : !activeInstitutionId
                            ? isInternetHospitalConfig ? '请先选择交付范围' : '请先选择活动对象'
                            : '',
                    }
                  },
                }}
                scroll={{ x: 1190 }}
              />
          </Modal>
        </Annotatable>
      </div>
    </ActivityFrame>
  )
}

function ActivityDetailPage({ activities, basePath, standalone, variant }) {
  const navigate = useNavigate()
  const { id } = useParams()
  const activity = activities.find((item) => item.id === id)
  const [activeInstitutionId, setActiveInstitutionId] = useState(() => activity?.institutionIds?.[0])
  const allowInternetHospitalActivityMethod = variant === 'copy'

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
  const detailActivityMethod = allowInternetHospitalActivityMethod ? activity.activityMethod : undefined
  const detailDiscountConfigKey = getActivityDiscountConfigKey(activity.ruleType, activity.channelId, detailActivityMethod)
  const isPlatformActivityDetail = isPlatformActivityConfig(activity.ruleType, activity.channelId)
  const detailDiscountContext = isPlatformActivityDetail ? 'qingteng' : 'internet-hospital'
  const detailPlatformActivityConfig = detailDiscountConfigKey
    ? applyActivityDiscountContext(getPlatformActivityConfig(detailDiscountConfigKey, activity.platformActivityConfig), detailDiscountContext, row.channelName)
    : undefined
  const activeConfigs = activity.institutionConfigs?.[activeInstitutionId] || []
  const projectRows = getSelectedConfigRows(getConfigMapFromSavedConfigs(activeConfigs))

  const projectColumns = [
    {
      title: '项目名称',
      dataIndex: 'name',
      width: 150,
      ellipsis: true,
      render: (_, projectRow) => projectRow.rowType === 'bundle' ? (
        <div className="activity-bundle-name">
          <Text strong>{projectRow.skuName}</Text>
        </div>
      ) : projectRow.name,
    },
    {
      title: '检查类型',
      dataIndex: 'type',
      width: 78,
      render: (_, projectRow) => projectRow.rowType === 'bundle' ? <Tag color="orange">组套SKU</Tag> : <Tag color="green">{projectRow.type}</Tag>,
    },
    { title: '平台项目编码', dataIndex: 'platformCode', width: 118, ellipsis: true },
    { title: '平台项目名称', dataIndex: 'platformName', width: 126, render: renderPlatformProjectName },
    {
      title: '项目检查费用',
      dataIndex: 'examFee',
      width: 88,
      render: (price) => Number(price).toFixed(1),
    },
    {
      title: '项目耗材费用',
      dataIndex: 'materialFee',
      width: 88,
      render: (price) => Number(price).toFixed(1),
    },
    {
      title: '项目药品费用',
      dataIndex: 'drugFee',
      width: 88,
      render: (price) => Number(price).toFixed(1),
    },
    {
      title: '检查项目总金额',
      width: 98,
      render: (_, projectRow) => <span className="activity-price-origin">￥{calculatePatientDisplayPrice(projectRow).toFixed(1)}</span>,
    },
    {
      title: row.ruleTypeMeta.priceColumnTitle,
      dataIndex: 'activityPrice',
      width: 126,
      render: (price, projectRow) => (
        <div className={projectRow.rowType === 'bundle' ? 'activity-bundle-price' : undefined}>
          {projectRow.rowType === 'bundle' ? <span>组合项目一口价</span> : null}
          <Text strong style={{ color: '#14916a' }}>￥{Number(price).toFixed(2)}</Text>
        </div>
      ),
    },
  ]

  return (
    <Annotatable id={5}>
      <ActivityFrame
        title="活动详情"
        extra={(
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(basePath)}>返回列表</Button>
        )}
        standalone={standalone}
      >
        <Card className="activity-panel" title="基础信息">
          <Descriptions column={3} bordered size="middle">
            <Descriptions.Item label="活动名称">{activity.name}</Descriptions.Item>
            <Descriptions.Item label="活动类型"><Tag color={row.ruleTypeMeta.tagColor}>{row.ruleTypeLabel}</Tag></Descriptions.Item>
            <Descriptions.Item label="状态">
              <Tag color={statusMeta[row.status]?.tagColor}>{statusMeta[row.status]?.label}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="活动对象">{row.channelName}</Descriptions.Item>
            {allowInternetHospitalActivityMethod && activity.activityMethod ? <Descriptions.Item label="活动方式">{getActivityMethodName(activity.activityMethod)}</Descriptions.Item> : null}
            <Descriptions.Item label="项目数">{row.projectCount}</Descriptions.Item>
            <Descriptions.Item label="更新时间">{activity.updatedAt}</Descriptions.Item>
            <Descriptions.Item label="生效时间" span={2}>{activity.startAt} 至 {activity.endAt}</Descriptions.Item>
            <Descriptions.Item label="创建人">{activity.creator}</Descriptions.Item>
          </Descriptions>
        </Card>

        {detailDiscountConfigKey ? (
          <Card className="activity-panel activity-log" title={isPlatformActivityDetail ? '青藤平台配置方案' : '互联网医院活动方式配置'}>
            <div className="activity-discount-detail">
              <PlatformActivitySummary activityObjectId={detailDiscountConfigKey} config={detailPlatformActivityConfig} />
              <PlatformActivityRuleNote config={detailPlatformActivityConfig} />
            </div>
          </Card>
        ) : (
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
          <Table
            className="activity-table activity-price-config-table"
            size="small"
            rowKey="id"
            columns={projectColumns}
            dataSource={projectRows}
            pagination={false}
            scroll={{ x: 960 }}
          />
        </Card>
        )}
      </ActivityFrame>
    </Annotatable>
  )
}

export function ActivityManagementCopyPage() {
  return <ActivityManagementPage variant="copy" />
}

export default function ActivityManagementPage({ variant: explicitVariant }) {
  const location = useLocation()
  const variant = getActivityVariant(location.pathname, explicitVariant)
  const basePath = getActivityBasePath(variant)
  const standalone = variant === 'share'
  const pageTitle = getActivityPageTitle(variant)
  const [activities, commit] = useActivityStore(getActivityStorageKey(variant))

  if (isCreatePath(location.pathname, basePath) || isEditPath(location.pathname, basePath)) {
    return <ActivityFormPage activities={activities} commit={commit} basePath={basePath} standalone={standalone} variant={variant} />
  }

  if (isDetailPath(location.pathname, basePath) && !isCreatePath(location.pathname, basePath) && !isEditPath(location.pathname, basePath)) {
    return <ActivityDetailPage activities={activities} basePath={basePath} standalone={standalone} variant={variant} />
  }

  return <ActivityListPage activities={activities} commit={commit} basePath={basePath} standalone={standalone} pageTitle={pageTitle} />
}
