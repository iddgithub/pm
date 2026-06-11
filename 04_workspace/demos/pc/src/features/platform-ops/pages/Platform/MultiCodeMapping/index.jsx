import { useMemo, useState } from 'react'
import {
  Alert,
  Button,
  Card,
  Drawer,
  Empty,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Space,
  Switch,
  Table,
  Tag,
  Typography,
  message,
} from 'antd'
import {
  PlusOutlined,
  ReloadOutlined,
  UploadOutlined,
} from '@ant-design/icons'
import { Navigate, useLocation } from 'react-router-dom'
import {
  deliveryMappings,
  mappingGroups,
  matchLogs,
  standardProjects,
} from '../../../../../shared/mocks/multiCodeMapping'
import './MultiCodeMapping.css'

const { Text } = Typography

export const MULTI_CODE_MAPPING_BASE_PATH = '/platform/multi-code-mapping'

const pageMeta = {
  standard: {
    title: '检查项目组合对码',
    description: '支持平台标准项目与交付中心院内项目的多对多映射配置。',
  },
  upstream: {
    title: '平台标准项目库',
    description: '维护组合对码使用的平台标准项目，作为对码组配置底座。',
  },
  delivery: {
    title: '交付中心院内项目库',
    description: '维护交付中心 HIS 可接收的院内项目，供组合对码组引用。',
  },
  logs: {
    title: '匹配日志 / 待人工对码',
    description: '组合对码未命中或存在冲突时，统一进入人工处理与重试闭环。',
  },
}

const inspectionTypeOptions = ['全部类型', 'CT', 'MR', 'DR', 'PET']
const groupStatusOptions = ['全部状态', '启用', '停用']
const standardStatusOptions = ['全部状态', '启用', '待确认', '停用']
const deliveryTypeOptions = ['全部类型', '组合套餐', '单项目', '加收项']
const logStatusOptions = ['全部结果', '匹配成功', '异常待处理', '已补配待重试']
const deviceOptions = ['CT_64排', 'MR_3.0T', 'DR_无', 'PET_CT']
const platformRoleOptions = ['主部位', '附加部位', '增强']
const deliveryRoleOptions = ['主收费项目', '部位加收', '耗材', '药品']

function includesKeyword(targets, keyword) {
  if (!keyword.trim()) return true
  const text = keyword.trim()
  return targets.some((item) => String(item).includes(text))
}

function createId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`
}

function createGroupNo() {
  const stamp = Date.now().toString().slice(-11)
  return `MAP${stamp}`
}

function normalizeProjectName(name) {
  return String(name || '').replaceAll('-', '').replaceAll('平扫', '')
}

function buildGroupName(items, standardMap) {
  const names = items
    .map((item) => standardMap[item.code]?.name)
    .filter(Boolean)
    .map(normalizeProjectName)

  return names.length ? `${names.join('+')} 对码` : ''
}

function formatAmount(value) {
  return Number(value || 0).toFixed(2)
}

function renderStatusTag(status) {
  if (status === '启用') return <Tag color="success">{status}</Tag>
  if (status === '待确认') return <Tag color="gold">{status}</Tag>
  return <Tag>{status}</Tag>
}

function renderMatchStatusTag(status) {
  if (status === '匹配成功') return <Tag color="success">{status}</Tag>
  if (status === '已补配待重试') return <Tag color="gold">{status}</Tag>
  return <Tag color="error">{status}</Tag>
}

function tagList(items) {
  return (
    <div className="multi-code-mapping__tags">
      {items.map((item, index) => (
        <span key={`${item}-${index}`} className="multi-code-mapping__tag">
          {item}
        </span>
      ))}
    </div>
  )
}

function DetailList({ items }) {
  return (
    <div className="multi-code-mapping__detail-list">
      {items.map((item) => (
        <div className="multi-code-mapping__detail-item" key={item.label}>
          <span>{item.label}</span>
          <strong>{item.value}</strong>
        </div>
      ))}
    </div>
  )
}

function defaultPlatformProject() {
  return { key: createId('platform-line'), code: undefined, role: '主部位' }
}

function defaultDeliveryProject() {
  return { key: createId('delivery-line'), code: undefined, role: '主收费项目', amount: 0 }
}

function mapItemTypeToRole(itemType) {
  if (itemType === '加收项') return '部位加收'
  return '主收费项目'
}

export default function MultiCodeMapping() {
  const location = useLocation()

  const [groupRows, setGroupRows] = useState(() => mappingGroups.map((item) => ({ ...item })))
  const [standardRows, setStandardRows] = useState(() => standardProjects.map((item) => ({ ...item })))
  const [deliveryRows, setDeliveryRows] = useState(() => deliveryMappings.map((item) => ({ ...item })))
  const [logRows, setLogRows] = useState(() => matchLogs.map((item) => ({ ...item })))

  const [groupType, setGroupType] = useState('全部类型')
  const [groupStatus, setGroupStatus] = useState('全部状态')
  const [groupKeyword, setGroupKeyword] = useState('')
  const [standardType, setStandardType] = useState('全部类型')
  const [standardStatus, setStandardStatus] = useState('全部状态')
  const [standardKeyword, setStandardKeyword] = useState('')
  const [deliveryType, setDeliveryType] = useState('全部类型')
  const [deliveryKeyword, setDeliveryKeyword] = useState('')
  const [logStatus, setLogStatus] = useState('全部结果')
  const [logKeyword, setLogKeyword] = useState('')

  const [groupModalOpen, setGroupModalOpen] = useState(false)
  const [editingGroupId, setEditingGroupId] = useState(null)
  const [groupPlatformItems, setGroupPlatformItems] = useState([])
  const [groupDeliveryItems, setGroupDeliveryItems] = useState([])
  const [groupAutoName, setGroupAutoName] = useState('')
  const [groupNameTouched, setGroupNameTouched] = useState(false)

  const [standardModalOpen, setStandardModalOpen] = useState(false)
  const [editingStandardId, setEditingStandardId] = useState(null)
  const [deliveryModalOpen, setDeliveryModalOpen] = useState(false)
  const [editingDeliveryId, setEditingDeliveryId] = useState(null)
  const [drawerRecord, setDrawerRecord] = useState(null)

  const [groupForm] = Form.useForm()
  const [standardForm] = Form.useForm()
  const [deliveryForm] = Form.useForm()

  const isBasePath = location.pathname === MULTI_CODE_MAPPING_BASE_PATH
  const view = location.pathname.startsWith(`${MULTI_CODE_MAPPING_BASE_PATH}/upstream`)
    ? 'upstream'
    : location.pathname.startsWith(`${MULTI_CODE_MAPPING_BASE_PATH}/delivery`)
      ? 'delivery'
      : location.pathname.startsWith(`${MULTI_CODE_MAPPING_BASE_PATH}/logs`)
        ? 'logs'
        : 'standard'

  const meta = pageMeta[view]

  const standardMap = useMemo(() => Object.fromEntries(
    standardRows.map((item) => [item.code, item]),
  ), [standardRows])

  const deliveryMap = useMemo(() => Object.fromEntries(
    deliveryRows.map((item) => [item.itemCode, item]),
  ), [deliveryRows])

  const standardOptions = useMemo(() => standardRows.map((item) => ({
    label: `${item.name} (${item.code})`,
    value: item.code,
  })), [standardRows])

  const deliveryOptions = useMemo(() => deliveryRows.map((item) => ({
    label: `${item.itemName} (${item.itemCode})`,
    value: item.itemCode,
  })), [deliveryRows])

  const filteredGroupRows = useMemo(() => groupRows.filter((item) => {
    if (groupType !== '全部类型' && item.inspectionType !== groupType) return false
    if (groupStatus !== '全部状态' && item.status !== groupStatus) return false

    const platformNames = item.platformProjects.map((project) => standardMap[project.code]?.name || project.code)
    const deliveryNames = item.deliveryProjects.map((project) => deliveryMap[project.code]?.itemName || project.code)

    return includesKeyword([
      item.groupNo,
      item.groupName,
      item.deviceBinding,
      ...platformNames,
      ...deliveryNames,
    ], groupKeyword)
  }), [deliveryMap, groupKeyword, groupRows, groupStatus, groupType, standardMap])

  const filteredStandardRows = useMemo(() => standardRows.filter((item) => {
    if (standardType !== '全部类型' && item.modality !== standardType) return false
    if (standardStatus !== '全部状态' && item.status !== standardStatus) return false
    return includesKeyword([item.code, item.name, item.bodyPart, item.method], standardKeyword)
  }), [standardKeyword, standardRows, standardStatus, standardType])

  const filteredDeliveryRows = useMemo(() => deliveryRows.filter((item) => {
    if (deliveryType !== '全部类型' && item.itemType !== deliveryType) return false
    return includesKeyword([item.centerName, item.itemCode, item.itemName], deliveryKeyword)
  }), [deliveryKeyword, deliveryRows, deliveryType])

  const filteredLogRows = useMemo(() => logRows.filter((item) => {
    if (logStatus !== '全部结果' && item.matchStatus !== logStatus) return false
    return includesKeyword([item.orderNo, item.originalProject, item.upstreamInstitution, item.deliveryCenter], logKeyword)
  }), [logKeyword, logRows, logStatus])

  const groupHospitalTotal = useMemo(() => groupDeliveryItems.reduce(
    (sum, item) => sum + Number(item.amount || 0), 0,
  ), [groupDeliveryItems])

  const syncGroupName = (nextItems) => {
    const generated = buildGroupName(nextItems, standardMap)
    const current = groupForm.getFieldValue('groupName')
    const shouldSync = !groupNameTouched || !current || current === groupAutoName

    setGroupAutoName(generated)
    if (shouldSync) {
      groupForm.setFieldValue('groupName', generated)
    }
  }

  const resetGroupModal = () => {
    setGroupModalOpen(false)
    setEditingGroupId(null)
    setGroupPlatformItems([])
    setGroupDeliveryItems([])
    setGroupAutoName('')
    setGroupNameTouched(false)
    groupForm.resetFields()
  }

  const openGroupModal = (record = null) => {
    groupForm.resetFields()

    if (record) {
      const nextPlatformItems = record.platformProjects.map((item) => ({ ...item }))
      const nextDeliveryItems = record.deliveryProjects.map((item) => ({ ...item }))
      const generated = buildGroupName(nextPlatformItems, standardMap)

      setEditingGroupId(record.id)
      setGroupPlatformItems(nextPlatformItems)
      setGroupDeliveryItems(nextDeliveryItems)
      setGroupAutoName(generated)
      setGroupNameTouched(record.groupName !== generated)
      groupForm.setFieldsValue({
        deliveryOrg: record.deliveryOrg,
        inspectionType: record.inspectionType,
        deviceBinding: record.deviceBinding,
        groupName: record.groupName,
        enabled: record.status === '启用',
        platformAmount: record.platformAmount,
        examFee: record.examFee,
        materialFee: record.materialFee,
        drugFee: record.drugFee,
      })
    } else {
      const nextPlatformItems = [defaultPlatformProject()]
      const nextDeliveryItems = [defaultDeliveryProject()]

      setEditingGroupId(null)
      setGroupPlatformItems(nextPlatformItems)
      setGroupDeliveryItems(nextDeliveryItems)
      setGroupAutoName('')
      setGroupNameTouched(false)
      groupForm.setFieldsValue({
        deliveryOrg: '南昌一脉阳光医学诊断中心',
        inspectionType: 'CT',
        deviceBinding: 'CT_64排',
        groupName: '',
        enabled: true,
        platformAmount: 0,
        examFee: 0,
        materialFee: 0,
        drugFee: 0,
      })
    }

    setGroupModalOpen(true)
  }

  const updateGroupPlatformItem = (key, patch) => {
    setGroupPlatformItems((prev) => {
      const next = prev.map((item) => (item.key === key ? { ...item, ...patch } : item))
      syncGroupName(next)
      return next
    })
  }

  const updateGroupDeliveryItem = (key, patch) => {
    setGroupDeliveryItems((prev) => prev.map((item) => (
      item.key === key ? { ...item, ...patch } : item
    )))
  }

  const addGroupPlatformItem = () => {
    setGroupPlatformItems((prev) => {
      const next = [...prev, defaultPlatformProject()]
      syncGroupName(next)
      return next
    })
  }

  const addGroupDeliveryItem = () => {
    setGroupDeliveryItems((prev) => [...prev, defaultDeliveryProject()])
  }

  const removeGroupPlatformItem = (key) => {
    setGroupPlatformItems((prev) => {
      const next = prev.filter((item) => item.key !== key)
      syncGroupName(next)
      return next.length ? next : [defaultPlatformProject()]
    })
  }

  const removeGroupDeliveryItem = (key) => {
    setGroupDeliveryItems((prev) => {
      const next = prev.filter((item) => item.key !== key)
      return next.length ? next : [defaultDeliveryProject()]
    })
  }

  const saveGroup = async () => {
    const values = await groupForm.validateFields()

    if (!groupPlatformItems.length || groupPlatformItems.some((item) => !item.code || !item.role)) {
      message.error('请至少添加 1 条完整的平台标准项目')
      return
    }

    if (!groupDeliveryItems.length || groupDeliveryItems.some((item) => !item.code || !item.role)) {
      message.error('请至少添加 1 条完整的交付中心院内项目')
      return
    }

    const chargeMode = Math.abs(Number(values.platformAmount || 0) - groupHospitalTotal) < 0.01
      ? '院内项目合计'
      : '手动维护金额'

    const payload = {
      deliveryOrg: values.deliveryOrg,
      inspectionType: values.inspectionType,
      deviceBinding: values.deviceBinding,
      groupName: values.groupName,
      platformProjects: groupPlatformItems.map((item) => ({ ...item })),
      deliveryProjects: groupDeliveryItems.map((item) => ({ ...item, amount: Number(item.amount || 0) })),
      chargeMode,
      platformAmount: Number(values.platformAmount || 0),
      examFee: Number(values.examFee || 0),
      materialFee: Number(values.materialFee || 0),
      drugFee: Number(values.drugFee || 0),
      status: values.enabled ? '启用' : '停用',
      updatedAt: '2026-06-10 20:10',
    }

    if (editingGroupId) {
      setGroupRows((prev) => prev.map((item) => (
        item.id === editingGroupId
          ? { ...item, ...payload }
          : item
      )))
      message.success('组合对码已更新')
    } else {
      setGroupRows((prev) => [
        {
          id: createId('group'),
          groupNo: createGroupNo(),
          usedCount: 0,
          ...payload,
        },
        ...prev,
      ])
      message.success(values.enabled ? '组合对码已保存并启用' : '组合对码已保存')
    }

    resetGroupModal()
  }

  const duplicateGroup = (record) => {
    setGroupRows((prev) => [
      {
        ...record,
        id: createId('group'),
        groupNo: createGroupNo(),
        groupName: `${record.groupName} - 复制`,
        status: '停用',
        usedCount: 0,
        updatedAt: '2026-06-10 20:10',
        platformProjects: record.platformProjects.map((item) => ({ ...item, key: createId('platform-line') })),
        deliveryProjects: record.deliveryProjects.map((item) => ({ ...item, key: createId('delivery-line') })),
      },
      ...prev,
    ])
    message.success('已生成复制版本，请确认后启用')
  }

  const toggleGroupStatus = (record) => {
    setGroupRows((prev) => prev.map((item) => (
      item.id === record.id
        ? {
          ...item,
          status: item.status === '启用' ? '停用' : '启用',
          updatedAt: '2026-06-10 20:10',
        }
        : item
    )))
    message.success(record.status === '启用' ? '组合对码已停用' : '组合对码已启用')
  }

  const deleteGroup = (record) => {
    if (record.usedCount > 0) {
      message.warning('当前对码组已被订单使用，不支持删除，可选择停用')
      return
    }
    setGroupRows((prev) => prev.filter((item) => item.id !== record.id))
    message.success('组合对码已删除')
  }

  const resetStandardModal = () => {
    setStandardModalOpen(false)
    setEditingStandardId(null)
    standardForm.resetFields()
  }

  const openStandardModal = (record = null) => {
    setEditingStandardId(record?.id || null)
    standardForm.setFieldsValue(record || {
      code: '',
      name: '',
      modality: 'CT',
      bodyPart: '',
      method: '平扫',
      status: '启用',
      notes: '',
    })
    setStandardModalOpen(true)
  }

  const saveStandard = async () => {
    const values = await standardForm.validateFields()
    if (editingStandardId) {
      setStandardRows((prev) => prev.map((item) => (
        item.id === editingStandardId
          ? { ...item, ...values, updatedAt: '2026-06-10 20:10' }
          : item
      )))
      message.success('标准项目已更新')
    } else {
      setStandardRows((prev) => [
        {
          id: createId('std'),
          upstreamRefs: 0,
          deliveryRefs: 0,
          updatedAt: '2026-06-10 20:10',
          notes: values.notes || '新建标准项目待补充说明。',
          ...values,
        },
        ...prev,
      ])
      message.success('标准项目已新增')
    }
    resetStandardModal()
  }

  const resetDeliveryModal = () => {
    setDeliveryModalOpen(false)
    setEditingDeliveryId(null)
    deliveryForm.resetFields()
  }

  const openDeliveryModal = (record = null) => {
    setEditingDeliveryId(record?.id || null)
    deliveryForm.setFieldsValue(record || {
      centerName: '南昌一脉阳光交付中心',
      itemCode: '',
      itemName: '',
      itemType: '组合套餐',
      coveredStandardCodes: [],
      priority: 'P1',
      status: '启用',
      dispatchRule: '套餐优先，单项目和加收项补齐',
      remark: '',
    })
    setDeliveryModalOpen(true)
  }

  const saveDelivery = async () => {
    const values = await deliveryForm.validateFields()
    if (!values.coveredStandardCodes?.length) {
      message.error('请至少选择 1 个覆盖的标准项目')
      return
    }

    const payload = {
      ...values,
      updatedAt: '2026-06-10 20:10',
      remark: values.remark || '院内项目库记录，供组合对码组选择引用。',
    }

    if (editingDeliveryId) {
      setDeliveryRows((prev) => prev.map((item) => (
        item.id === editingDeliveryId ? { ...item, ...payload } : item
      )))
      message.success('院内项目已更新')
    } else {
      setDeliveryRows((prev) => [{ id: createId('down'), ...payload }, ...prev])
      message.success('院内项目已新增')
    }

    resetDeliveryModal()
  }

  const retryRecord = (record) => {
    setLogRows((prev) => prev.map((item) => (
      item.id === record.id
        ? {
          ...item,
          processingStatus: '待重试',
          matchStatus: item.matchStatus === '异常待处理' ? '已补配待重试' : item.matchStatus,
          lastProcessedAt: '2026-06-10 20:10',
        }
        : item
    )))
    message.success(`订单 ${record.orderNo} 已加入重新匹配队列`)
  }

  const retryAllExceptions = () => {
    setLogRows((prev) => prev.map((item) => (
      item.matchStatus === '异常待处理'
        ? {
          ...item,
          matchStatus: '已补配待重试',
          processingStatus: '待重试',
          lastProcessedAt: '2026-06-10 20:10',
        }
        : item
    )))
    message.success('异常订单已批量加入重新匹配队列')
  }

  const groupColumns = [
    { title: '对码组编号', dataIndex: 'groupNo', width: 170, render: (value) => <Text strong>{value}</Text> },
    { title: '检查类型', dataIndex: 'inspectionType', width: 100 },
    {
      title: '平台标准项目组合',
      dataIndex: 'platformProjects',
      width: 320,
      render: (items) => tagList(items.map((item) => standardMap[item.code]?.name || item.code)),
    },
    {
      title: '交付中心院内项目组合',
      dataIndex: 'deliveryProjects',
      width: 320,
      render: (items) => tagList(items.map((item) => deliveryMap[item.code]?.itemName || item.code)),
    },
    { title: '绑定设备', dataIndex: 'deviceBinding', width: 130 },
    { title: '收费方式', dataIndex: 'chargeMode', width: 120 },
    { title: '平台金额', dataIndex: 'platformAmount', width: 120, render: (value) => formatAmount(value) },
    { title: '状态', dataIndex: 'status', width: 100, render: renderStatusTag },
    { title: '更新时间', dataIndex: 'updatedAt', width: 160 },
    {
      title: '操作',
      key: 'action',
      width: 220,
      fixed: 'right',
      render: (_, record) => (
        <Space size={4} wrap>
          <Button type="link" size="small" onClick={() => openGroupModal(record)}>编辑</Button>
          <Button type="link" size="small" onClick={() => duplicateGroup(record)}>复制</Button>
          <Button type="link" size="small" onClick={() => toggleGroupStatus(record)}>
            {record.status === '启用' ? '停用' : '启用'}
          </Button>
          <Button type="link" size="small" danger onClick={() => deleteGroup(record)}>删除</Button>
        </Space>
      ),
    },
  ]

  const standardColumns = [
    { title: '标准项目编码', dataIndex: 'code', width: 160 },
    { title: '标准项目名称', dataIndex: 'name', width: 180 },
    { title: '检查模态', dataIndex: 'modality', width: 100 },
    { title: '检查部位', dataIndex: 'bodyPart', width: 120 },
    { title: '检查方式', dataIndex: 'method', width: 120 },
    { title: '上游引用', dataIndex: 'upstreamRefs', width: 100 },
    { title: '下游引用', dataIndex: 'deliveryRefs', width: 100 },
    { title: '状态', dataIndex: 'status', width: 100, render: renderStatusTag },
    { title: '更新时间', dataIndex: 'updatedAt', width: 160 },
    {
      title: '操作',
      key: 'action',
      width: 100,
      fixed: 'right',
      render: (_, record) => <Button type="link" size="small" onClick={() => openStandardModal(record)}>编辑</Button>,
    },
  ]

  const deliveryColumns = [
    { title: '交付中心', dataIndex: 'centerName', width: 180 },
    { title: '院内项目编码', dataIndex: 'itemCode', width: 160 },
    { title: '院内项目名称', dataIndex: 'itemName', width: 220 },
    {
      title: '项目类型',
      dataIndex: 'itemType',
      width: 120,
      render: (value) => <Tag color={value === '组合套餐' ? 'processing' : value === '加收项' ? 'gold' : 'default'}>{value}</Tag>,
    },
    {
      title: '覆盖标准项目',
      dataIndex: 'coveredStandardCodes',
      width: 320,
      render: (codes) => tagList(codes.map((code) => standardMap[code]?.name || code)),
    },
    { title: '匹配优先级', dataIndex: 'priority', width: 100 },
    { title: '下发原则', dataIndex: 'dispatchRule', width: 220 },
    { title: '状态', dataIndex: 'status', width: 100, render: renderStatusTag },
    { title: '更新时间', dataIndex: 'updatedAt', width: 160 },
    {
      title: '操作',
      key: 'action',
      width: 100,
      fixed: 'right',
      render: (_, record) => <Button type="link" size="small" onClick={() => openDeliveryModal(record)}>编辑</Button>,
    },
  ]

  const logColumns = [
    { title: '订单号', dataIndex: 'orderNo', width: 170, render: (value) => <Text strong>{value}</Text> },
    { title: '上游机构', dataIndex: 'upstreamInstitution', width: 150 },
    { title: '上游原始项目', dataIndex: 'originalProject', width: 240 },
    {
      title: '标准项目集合',
      dataIndex: 'standardCodes',
      width: 320,
      render: (codes) => tagList(codes.map((code) => standardMap[code]?.name || code)),
    },
    { title: '目标交付中心', dataIndex: 'deliveryCenter', width: 180 },
    { title: '匹配结果', dataIndex: 'matchStatus', width: 130, render: renderMatchStatusTag },
    {
      title: '实际下发项目',
      dataIndex: 'matchedItems',
      width: 220,
      render: (value) => value.join(' + '),
    },
    { title: '异常类型', dataIndex: 'exceptionType', width: 140, render: (value) => value || '-' },
    { title: '处理状态', dataIndex: 'processingStatus', width: 120 },
    {
      title: '操作',
      key: 'action',
      width: 140,
      fixed: 'right',
      render: (_, record) => (
        <Space size={0}>
          <Button type="link" size="small" onClick={() => setDrawerRecord(record)}>详情</Button>
          <Button type="link" size="small" onClick={() => retryRecord(record)}>重试</Button>
        </Space>
      ),
    },
  ]

  const groupPlatformColumns = [
    {
      title: '平台项目编码',
      dataIndex: 'code',
      width: 280,
      render: (value, record) => (
        <Select
          allowClear
          value={value}
          style={{ width: '100%' }}
          options={standardOptions}
          placeholder="选择平台标准项目"
          onChange={(nextValue) => updateGroupPlatformItem(record.key, { code: nextValue })}
        />
      ),
    },
    {
      title: '平台项目名称',
      dataIndex: 'name',
      width: 220,
      render: (_, record) => standardMap[record.code]?.name || '-',
    },
    {
      title: '项目角色',
      dataIndex: 'role',
      width: 160,
      render: (value, record) => (
        <Select
          value={value}
          style={{ width: '100%' }}
          options={platformRoleOptions.map((item) => ({ label: item, value: item }))}
          onChange={(nextValue) => updateGroupPlatformItem(record.key, { role: nextValue })}
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 90,
      render: (_, record) => (
        <Button type="link" size="small" danger onClick={() => removeGroupPlatformItem(record.key)}>
          删除
        </Button>
      ),
    },
  ]

  const groupDeliveryColumns = [
    {
      title: '院内项目编码',
      dataIndex: 'code',
      width: 280,
      render: (value, record) => (
        <Select
          allowClear
          value={value}
          style={{ width: '100%' }}
          options={deliveryOptions}
          placeholder="选择交付中心院内项目"
          onChange={(nextValue) => {
            const matched = deliveryMap[nextValue]
            updateGroupDeliveryItem(record.key, {
              code: nextValue,
              role: matched ? mapItemTypeToRole(matched.itemType) : record.role,
              amount: matched?.itemType === '加收项' ? 120 : Number(record.amount || 0),
            })
          }}
        />
      ),
    },
    {
      title: '院内项目名称',
      dataIndex: 'name',
      width: 220,
      render: (_, record) => deliveryMap[record.code]?.itemName || '-',
    },
    {
      title: '项目角色',
      dataIndex: 'role',
      width: 150,
      render: (value, record) => (
        <Select
          value={value}
          style={{ width: '100%' }}
          options={deliveryRoleOptions.map((item) => ({ label: item, value: item }))}
          onChange={(nextValue) => updateGroupDeliveryItem(record.key, { role: nextValue })}
        />
      ),
    },
    {
      title: '院内金额',
      dataIndex: 'amount',
      width: 140,
      render: (value, record) => (
        <InputNumber
          min={0}
          precision={2}
          value={value}
          style={{ width: '100%' }}
          onChange={(nextValue) => updateGroupDeliveryItem(record.key, { amount: Number(nextValue || 0) })}
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 90,
      render: (_, record) => (
        <Button type="link" size="small" danger onClick={() => removeGroupDeliveryItem(record.key)}>
          删除
        </Button>
      ),
    },
  ]

  const renderToolbar = () => {
    if (view === 'standard') {
      return (
        <>
          <div className="multi-code-mapping__toolbar-filters">
            <div className="multi-code-mapping__field">
              <span>检查类型：</span>
              <Select
                value={groupType}
                style={{ width: 160 }}
                options={inspectionTypeOptions.map((item) => ({ label: item, value: item }))}
                onChange={setGroupType}
              />
            </div>
            <div className="multi-code-mapping__field">
              <span>项目名称 / 编码：</span>
              <Input
                allowClear
                value={groupKeyword}
                placeholder="搜索平台项目或院内项目"
                style={{ width: 260 }}
                onChange={(event) => setGroupKeyword(event.target.value)}
              />
            </div>
            <div className="multi-code-mapping__field">
              <span>对码状态：</span>
              <Select
                value={groupStatus}
                style={{ width: 140 }}
                options={groupStatusOptions.map((item) => ({ label: item, value: item }))}
                onChange={setGroupStatus}
              />
            </div>
            <Button className="multi-code-mapping__btn multi-code-mapping__btn--green">查询</Button>
          </div>
          <Space wrap>
            <Button className="multi-code-mapping__btn multi-code-mapping__btn--green" icon={<PlusOutlined />} onClick={() => openGroupModal()}>
              新增组合对码
            </Button>
            <Button className="multi-code-mapping__btn multi-code-mapping__btn--green" icon={<UploadOutlined />} onClick={() => message.success('批量导入入口已保留，用于初始化组合对码数据')}>
              批量导入
            </Button>
            <Button className="multi-code-mapping__btn multi-code-mapping__btn--green" onClick={() => message.success('项目导出入口已保留，用于线下核对')}>
              项目导出
            </Button>
          </Space>
        </>
      )
    }

    if (view === 'upstream') {
      return (
        <>
          <div className="multi-code-mapping__toolbar-filters">
            <div className="multi-code-mapping__field">
              <span>检查类型：</span>
              <Select
                value={standardType}
                style={{ width: 160 }}
                options={inspectionTypeOptions.map((item) => ({ label: item, value: item }))}
                onChange={setStandardType}
              />
            </div>
            <div className="multi-code-mapping__field">
              <span>项目名称 / 编码：</span>
              <Input
                allowClear
                value={standardKeyword}
                placeholder="标准项目名称 / 编码"
                style={{ width: 240 }}
                onChange={(event) => setStandardKeyword(event.target.value)}
              />
            </div>
            <div className="multi-code-mapping__field">
              <span>状态：</span>
              <Select
                value={standardStatus}
                style={{ width: 140 }}
                options={standardStatusOptions.map((item) => ({ label: item, value: item }))}
                onChange={setStandardStatus}
              />
            </div>
            <Button className="multi-code-mapping__btn multi-code-mapping__btn--green">查询</Button>
          </div>
          <Space wrap>
            <Button className="multi-code-mapping__btn multi-code-mapping__btn--green" icon={<PlusOutlined />} onClick={() => openStandardModal()}>
              新增标准项目
            </Button>
            <Button className="multi-code-mapping__btn multi-code-mapping__btn--green" icon={<UploadOutlined />} onClick={() => message.success('标准项目批量导入入口已保留')}>
              批量导入
            </Button>
          </Space>
        </>
      )
    }

    if (view === 'delivery') {
      return (
        <>
          <div className="multi-code-mapping__toolbar-filters">
            <div className="multi-code-mapping__field">
              <span>项目类型：</span>
              <Select
                value={deliveryType}
                style={{ width: 160 }}
                options={deliveryTypeOptions.map((item) => ({ label: item, value: item }))}
                onChange={setDeliveryType}
              />
            </div>
            <div className="multi-code-mapping__field">
              <span>项目名称 / 编码：</span>
              <Input
                allowClear
                value={deliveryKeyword}
                placeholder="院内项目名称 / 编码"
                style={{ width: 260 }}
                onChange={(event) => setDeliveryKeyword(event.target.value)}
              />
            </div>
            <Button className="multi-code-mapping__btn multi-code-mapping__btn--green">查询</Button>
          </div>
          <Space wrap>
            <Button className="multi-code-mapping__btn multi-code-mapping__btn--green" icon={<PlusOutlined />} onClick={() => openDeliveryModal()}>
              新增院内项目
            </Button>
            <Button className="multi-code-mapping__btn multi-code-mapping__btn--green" icon={<UploadOutlined />} onClick={() => message.success('院内项目批量导入入口已保留')}>
              批量导入
            </Button>
          </Space>
        </>
      )
    }

    return (
      <>
        <div className="multi-code-mapping__toolbar-filters">
          <div className="multi-code-mapping__field">
            <span>匹配结果：</span>
            <Select
              value={logStatus}
              style={{ width: 160 }}
              options={logStatusOptions.map((item) => ({ label: item, value: item }))}
              onChange={setLogStatus}
            />
          </div>
          <div className="multi-code-mapping__field">
            <span>订单 / 项目：</span>
            <Input
              allowClear
              value={logKeyword}
              placeholder="订单号 / 原始项目"
              style={{ width: 260 }}
              onChange={(event) => setLogKeyword(event.target.value)}
            />
          </div>
          <Button className="multi-code-mapping__btn multi-code-mapping__btn--green">查询</Button>
        </div>
        <Space wrap>
          <Button className="multi-code-mapping__btn multi-code-mapping__btn--green" icon={<ReloadOutlined />} onClick={retryAllExceptions}>
            重新匹配
          </Button>
          <Button className="multi-code-mapping__btn" onClick={() => setLogStatus('异常待处理')}>
            仅看异常
          </Button>
        </Space>
      </>
    )
  }

  const renderTable = () => {
    if (view === 'standard') {
      return (
        <Table
          rowKey="id"
          className="multi-code-mapping__table"
          columns={groupColumns}
          dataSource={filteredGroupRows}
          pagination={{ pageSize: 10, showSizeChanger: false }}
          locale={{ emptyText: <Empty description="暂无组合对码数据" /> }}
          scroll={{ x: 1900 }}
        />
      )
    }

    if (view === 'upstream') {
      return (
        <Table
          rowKey="id"
          className="multi-code-mapping__table"
          columns={standardColumns}
          dataSource={filteredStandardRows}
          pagination={{ pageSize: 10, showSizeChanger: false }}
          locale={{ emptyText: <Empty description="暂无平台标准项目" /> }}
          scroll={{ x: 1400 }}
        />
      )
    }

    if (view === 'delivery') {
      return (
        <Table
          rowKey="id"
          className="multi-code-mapping__table"
          columns={deliveryColumns}
          dataSource={filteredDeliveryRows}
          pagination={{ pageSize: 10, showSizeChanger: false }}
          locale={{ emptyText: <Empty description="暂无院内项目数据" /> }}
          scroll={{ x: 1700 }}
        />
      )
    }

    return (
      <Table
        rowKey="id"
        className="multi-code-mapping__table"
        columns={logColumns}
        dataSource={filteredLogRows}
        pagination={{ pageSize: 10, showSizeChanger: false }}
        locale={{ emptyText: <Empty description="暂无匹配日志" /> }}
        scroll={{ x: 1700 }}
      />
    )
  }

  const drawerStandardNames = drawerRecord
    ? drawerRecord.standardCodes.map((code) => standardMap[code]?.name || code)
    : []

  if (isBasePath) {
    return <Navigate to={`${MULTI_CODE_MAPPING_BASE_PATH}/standard`} replace />
  }

  return (
    <div className="multi-code-mapping">
      <Card bordered={false} className="multi-code-mapping__panel">
        <div className="multi-code-mapping__header">
          <div>
            <h2>{meta.title}</h2>
            <p>{meta.description}</p>
          </div>
        </div>

        <div className="multi-code-mapping__toolbar">
          {renderToolbar()}
        </div>

        <div className="multi-code-mapping__table-wrap">
          {renderTable()}
        </div>
      </Card>

      <Modal
        title={editingGroupId ? '编辑组合对码' : '新增组合对码'}
        open={groupModalOpen}
        width={1100}
        styles={{ body: { maxHeight: 760, overflow: 'auto', paddingTop: 16 } }}
        onCancel={resetGroupModal}
        destroyOnClose
        footer={[
          <Button key="cancel" onClick={resetGroupModal}>取消</Button>,
          <Button key="submit" type="primary" className="multi-code-mapping__btn multi-code-mapping__btn--green" onClick={saveGroup}>
            {editingGroupId ? '保存' : '保存并启用'}
          </Button>,
        ]}
      >
        <Form form={groupForm} layout="vertical">
          <div className="multi-code-mapping__modal-body">
            <div className="multi-code-mapping__section">
              <div className="multi-code-mapping__section-head">
                <div>
                  <h3>基础信息</h3>
                  <p>配置当前交付机构下的检查类型、设备和对码组状态。</p>
                </div>
              </div>
              <div className="multi-code-mapping__form-grid">
                <Form.Item label="交付机构" name="deliveryOrg" rules={[{ required: true, message: '请选择交付机构' }]}>
                  <Input disabled />
                </Form.Item>
                <Form.Item label="检查类型" name="inspectionType" rules={[{ required: true, message: '请选择检查类型' }]}>
                  <Select options={['CT', 'MR', 'DR', 'PET'].map((item) => ({ label: item, value: item }))} />
                </Form.Item>
                <Form.Item label="绑定设备" name="deviceBinding" rules={[{ required: true, message: '请选择绑定设备' }]}>
                  <Select options={deviceOptions.map((item) => ({ label: item, value: item }))} />
                </Form.Item>
                <Form.Item label="对码组名称" name="groupName" rules={[{ required: true, message: '请输入对码组名称' }]}>
                  <Input placeholder="自动生成后可手工调整" onChange={() => setGroupNameTouched(true)} />
                </Form.Item>
                <Form.Item label="对码状态" name="enabled" valuePropName="checked">
                  <Switch checkedChildren="启用" unCheckedChildren="停用" />
                </Form.Item>
              </div>
            </div>

            <div className="multi-code-mapping__section">
              <div className="multi-code-mapping__section-head">
                <div>
                  <h3>平台标准项目组合</h3>
                  <p>订单中的标准项目集合完全一致时，将命中该对码组。</p>
                </div>
                <Button className="multi-code-mapping__btn multi-code-mapping__btn--green" onClick={addGroupPlatformItem}>
                  添加平台标准项目
                </Button>
              </div>
              <Table
                rowKey="key"
                size="small"
                className="multi-code-mapping__table"
                columns={groupPlatformColumns}
                dataSource={groupPlatformItems}
                pagination={false}
                scroll={{ x: 760 }}
              />
            </div>

            <div className="multi-code-mapping__section">
              <div className="multi-code-mapping__section-head">
                <div>
                  <h3>交付中心院内项目组合</h3>
                  <p>命中该对码组后，系统将下发以下院内项目至交付中心 HIS。</p>
                </div>
                <Button className="multi-code-mapping__btn multi-code-mapping__btn--green" onClick={addGroupDeliveryItem}>
                  添加院内项目
                </Button>
              </div>
              <Table
                rowKey="key"
                size="small"
                className="multi-code-mapping__table"
                columns={groupDeliveryColumns}
                dataSource={groupDeliveryItems}
                pagination={false}
                scroll={{ x: 880 }}
              />
            </div>

            <div className="multi-code-mapping__section">
              <div className="multi-code-mapping__section-head">
                <div>
                  <h3>收费信息</h3>
                  <p>1.0 只做基础金额维护，不做复杂收费规则引擎。</p>
                </div>
              </div>
              <div className="multi-code-mapping__fee-grid">
                <div className="multi-code-mapping__fee-item">
                  <span>院内金额合计</span>
                  <strong>{formatAmount(groupHospitalTotal)}</strong>
                </div>
                <div className="multi-code-mapping__fee-form">
                  <Form.Item label="平台金额" name="platformAmount">
                    <InputNumber min={0} precision={2} style={{ width: '100%' }} />
                  </Form.Item>
                  <Form.Item label="检查费用" name="examFee">
                    <InputNumber min={0} precision={2} style={{ width: '100%' }} />
                  </Form.Item>
                  <Form.Item label="耗材费用" name="materialFee">
                    <InputNumber min={0} precision={2} style={{ width: '100%' }} />
                  </Form.Item>
                  <Form.Item label="药品费用" name="drugFee">
                    <InputNumber min={0} precision={2} style={{ width: '100%' }} />
                  </Form.Item>
                </div>
              </div>
              <Alert
                type="success"
                showIcon
                message="未单独设置折扣时，默认使用统一折扣率：检查费 70%，耗材费 100%，药品费 100%。"
              />
            </div>
          </div>
        </Form>
      </Modal>

      <Modal
        title={editingStandardId ? '编辑标准项目' : '新增标准项目'}
        open={standardModalOpen}
        width={760}
        onCancel={resetStandardModal}
        onOk={saveStandard}
        destroyOnClose
      >
        <div className="multi-code-mapping__modal-body">
          <Form form={standardForm} layout="vertical" className="multi-code-mapping__form-grid">
            <Form.Item label="标准项目编码" name="code" rules={[{ required: true, message: '请输入标准项目编码' }]}>
              <Input placeholder="例如：CT-HEAD-PLAIN" />
            </Form.Item>
            <Form.Item label="标准项目名称" name="name" rules={[{ required: true, message: '请输入标准项目名称' }]}>
              <Input placeholder="例如：CT-颅脑平扫" />
            </Form.Item>
            <Form.Item label="检查模态" name="modality" rules={[{ required: true, message: '请选择检查模态' }]}>
              <Select options={['CT', 'MR', 'DR', 'US'].map((item) => ({ label: item, value: item }))} />
            </Form.Item>
            <Form.Item label="检查部位" name="bodyPart" rules={[{ required: true, message: '请输入检查部位' }]}>
              <Input placeholder="例如：颅脑" />
            </Form.Item>
            <Form.Item label="检查方式" name="method" rules={[{ required: true, message: '请选择检查方式' }]}>
              <Select options={['平扫', '增强', 'CTA', 'MRA'].map((item) => ({ label: item, value: item }))} />
            </Form.Item>
            <Form.Item label="状态" name="status" rules={[{ required: true, message: '请选择状态' }]}>
              <Select options={['启用', '待确认', '停用'].map((item) => ({ label: item, value: item }))} />
            </Form.Item>
            <Form.Item className="multi-code-mapping__form-span-2" label="备注" name="notes">
              <Input.TextArea rows={3} placeholder="补充命名口径或特殊说明" />
            </Form.Item>
          </Form>
        </div>
      </Modal>

      <Modal
        title={editingDeliveryId ? '编辑院内项目' : '新增院内项目'}
        open={deliveryModalOpen}
        width={860}
        onCancel={resetDeliveryModal}
        onOk={saveDelivery}
        okText="确认保存"
        destroyOnClose
      >
        <div className="multi-code-mapping__modal-body">
          <Form form={deliveryForm} layout="vertical" className="multi-code-mapping__form-grid">
            <Form.Item label="交付中心" name="centerName" rules={[{ required: true, message: '请选择交付中心' }]}>
              <Select options={['南昌一脉阳光交付中心', '成都影像交付中心', '江西执行机构'].map((item) => ({ label: item, value: item }))} />
            </Form.Item>
            <Form.Item label="院内项目编码" name="itemCode" rules={[{ required: true, message: '请输入院内项目编码' }]}>
              <Input placeholder="请输入院内项目编码" />
            </Form.Item>
            <Form.Item className="multi-code-mapping__form-span-2" label="院内项目名称" name="itemName" rules={[{ required: true, message: '请输入院内项目名称' }]}>
              <Input placeholder="例如：头颈联合 CTA 套餐" />
            </Form.Item>
            <Form.Item label="项目类型" name="itemType" rules={[{ required: true, message: '请选择项目类型' }]}>
              <Select options={['单项目', '组合套餐', '加收项'].map((item) => ({ label: item, value: item }))} />
            </Form.Item>
            <Form.Item label="匹配优先级" name="priority" rules={[{ required: true, message: '请选择匹配优先级' }]}>
              <Select options={['P1', 'P2', 'P3', 'P4'].map((item) => ({ label: item, value: item }))} />
            </Form.Item>
            <Form.Item className="multi-code-mapping__form-span-2" label="覆盖标准项目" name="coveredStandardCodes" rules={[{ required: true, message: '请选择覆盖标准项目' }]}>
              <Select
                mode="multiple"
                allowClear
                options={standardOptions}
                placeholder="请选择该院内项目覆盖的标准项目"
              />
            </Form.Item>
            <Form.Item label="映射状态" name="status" rules={[{ required: true, message: '请选择映射状态' }]}>
              <Select options={['启用', '停用'].map((item) => ({ label: item, value: item }))} />
            </Form.Item>
            <Form.Item label="下发原则" name="dispatchRule">
              <Input placeholder="例如：套餐优先，单项目和加收项补齐" />
            </Form.Item>
            <Form.Item className="multi-code-mapping__form-span-2" label="备注" name="remark">
              <Input.TextArea rows={3} placeholder="补充优先级冲突或特殊配置说明" />
            </Form.Item>
          </Form>
        </div>
      </Modal>

      <Drawer
        title={drawerRecord ? `${drawerRecord.orderNo} 匹配详情` : '匹配详情'}
        width={560}
        open={Boolean(drawerRecord)}
        onClose={() => setDrawerRecord(null)}
        destroyOnClose
      >
        {drawerRecord ? (
          <Space direction="vertical" size={16} style={{ width: '100%' }}>
            <Alert
              type={drawerRecord.matchStatus === '匹配成功' ? 'success' : drawerRecord.matchStatus === '已补配待重试' ? 'warning' : 'error'}
              message={drawerRecord.matchStatus}
              description={drawerRecord.exceptionReason || '系统已完整覆盖并生成下发项目。'}
              showIcon
            />
            <Card size="small" title="订单关键字段">
              <DetailList
                items={[
                  { label: '上游机构', value: drawerRecord.upstreamInstitution },
                  { label: '原始项目', value: drawerRecord.originalProject },
                  { label: '交付中心', value: drawerRecord.deliveryCenter },
                  { label: '处理状态', value: drawerRecord.processingStatus },
                ]}
              />
            </Card>
            <Card size="small" title="解析出的中心标准项目">
              {tagList(drawerStandardNames)}
            </Card>
            <Card size="small" title="实际下发项目">
              <Space wrap>
                {drawerRecord.matchedItems.map((item) => <Tag key={item} color="green">{item}</Tag>)}
              </Space>
            </Card>
            <Card size="small" title="处理建议">
              <div className="multi-code-mapping__drawer-note">
                {drawerRecord.trace.map((item) => `${item.label}：${item.value}`).join('；')}
              </div>
            </Card>
            <Space>
              <Button icon={<ReloadOutlined />} onClick={() => retryRecord(drawerRecord)}>重新匹配</Button>
              <Button type="primary" className="multi-code-mapping__btn multi-code-mapping__btn--green" onClick={() => message.success(`订单 ${drawerRecord.orderNo} 处理记录已更新`)}>
                查看处理记录
              </Button>
            </Space>
          </Space>
        ) : null}
      </Drawer>
    </div>
  )
}
