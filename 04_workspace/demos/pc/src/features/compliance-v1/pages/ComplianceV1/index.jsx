import { useMemo, useState } from 'react'
import {
  Alert,
  Button,
  Card,
  Col,
  Descriptions,
  Drawer,
  Input,
  Modal,
  Progress,
  Row,
  Select,
  Space,
  Statistic,
  Table,
  Tag,
  Timeline,
  Typography,
  message,
} from 'antd'
import {
  AuditOutlined,
  BankOutlined,
  BarChartOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  LinkOutlined,
  ReloadOutlined,
  SafetyCertificateOutlined,
  StopOutlined,
  TeamOutlined,
  UserAddOutlined,
  UserSwitchOutlined,
} from '@ant-design/icons'
import {
  complianceDashboardV1,
  doctorApplicationsV1,
  doctorsV1,
  operatorBindingsV1,
  withdrawalsV1,
} from '../../../../shared/mocks/complianceV1'
import './ComplianceV1.css'

const { Paragraph, Text } = Typography

const statusColors = {
  待审核: 'orange',
  已通过: 'green',
  已拒绝: 'red',
  有效: 'green',
  已解绑: 'default',
  正常: 'green',
  即将到期: 'orange',
  已到期: 'red',
  待运营审核: 'orange',
  待财务审核: 'blue',
  已打款: 'green',
}

function money(value) {
  return `¥${Number(value || 0).toLocaleString()}`
}

function StatusTag({ value }) {
  return <Tag color={statusColors[value] || 'default'}>{value}</Tag>
}

function PageFrame({ title, subtitle, icon, children, extra }) {
  return (
    <div className="compliance-v1-page">
      <div className="compliance-v1-header">
        <div className="compliance-v1-title-wrap">
          <span className="compliance-v1-title-icon">{icon}</span>
          <div>
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>
        </div>
        {extra}
      </div>
      {children}
    </div>
  )
}

function FilterCard({ children }) {
  return <Card className="compliance-v1-filter" bordered={false}>{children}</Card>
}

function DetailDrawer({ title, open, onClose, children }) {
  return (
    <Drawer title={title} width={620} open={open} onClose={onClose}>
      {children}
    </Drawer>
  )
}

function useKeywordFilter(rows, keys) {
  const [keyword, setKeyword] = useState('')
  const filteredRows = useMemo(() => {
    const normalized = keyword.trim().toLowerCase()
    if (!normalized) return rows
    return rows.filter((row) => keys.some((key) => String(row[key] || '').toLowerCase().includes(normalized)))
  }, [keyword, keys, rows])

  return { keyword, setKeyword, filteredRows }
}

export function DoctorAuditV1Page() {
  const [rows, setRows] = useState(doctorApplicationsV1)
  const [doctorType, setDoctorType] = useState('全部')
  const [auditStatus, setAuditStatus] = useState('全部')
  const [selected, setSelected] = useState(null)
  const { keyword, setKeyword, filteredRows } = useKeywordFilter(rows, ['name', 'phone', 'clinicName', 'institutionName', 'id'])

  const tableRows = filteredRows.filter((row) => (
    (doctorType === '全部' || row.doctorType === doctorType)
    && (auditStatus === '全部' || row.status === auditStatus)
  ))

  const updateStatus = (record, status) => {
    setRows((prev) => prev.map((item) => (
      item.id === record.id ? { ...item, status, reviewer: '当前审核员' } : item
    )))
    message.success(`申请单已${status === '已通过' ? '通过' : '拒绝'}`)
  }

  const columns = [
    { title: '申请单号', dataIndex: 'id', width: 150 },
    { title: '医生类型', dataIndex: 'doctorType', width: 130, render: (value) => <Tag color={value === '诊所医生' ? 'cyan' : 'purple'}>{value}</Tag> },
    { title: '姓名', dataIndex: 'name', width: 100 },
    { title: '手机号', dataIndex: 'phone', width: 140 },
    { title: '诊所/机构名称', dataIndex: 'clinicName', width: 190 },
    { title: '执业类别', dataIndex: 'category', width: 160 },
    { title: '职称', dataIndex: 'title', width: 120 },
    { title: '申请时间', dataIndex: 'submittedAt', width: 160 },
    { title: '状态', dataIndex: 'status', width: 100, render: (value) => <StatusTag value={value} /> },
    {
      title: '操作',
      fixed: 'right',
      width: 220,
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => setSelected(record)}>详情</Button>
          {record.status === '待审核' ? (
            <>
              <Button type="link" icon={<CheckCircleOutlined />} onClick={() => updateStatus(record, '已通过')}>通过</Button>
              <Button type="link" danger icon={<CloseCircleOutlined />} onClick={() => updateStatus(record, '已拒绝')}>拒绝</Button>
            </>
          ) : null}
        </Space>
      ),
    },
  ]

  return (
    <PageFrame
      title="医生审核"
      subtitle="审核诊所医生和互联网医院医生入驻申请，区分轻量信息与多点执业资质材料。"
      icon={<AuditOutlined />}
    >
      <FilterCard>
        <Space wrap>
          <Select value={doctorType} onChange={setDoctorType} options={['全部', '诊所医生', '互联网医院医生'].map((value) => ({ value, label: value }))} />
          <Select value={auditStatus} onChange={setAuditStatus} options={['全部', '待审核', '已通过', '已拒绝'].map((value) => ({ value, label: value }))} />
          <Input.Search placeholder="搜索姓名、手机号、机构、申请单号" value={keyword} onChange={(event) => setKeyword(event.target.value)} allowClear className="compliance-v1-search" />
        </Space>
      </FilterCard>
      <Table className="compliance-v1-table" rowKey="id" columns={columns} dataSource={tableRows} scroll={{ x: 1400 }} pagination={{ pageSize: 8 }} />
      <DetailDrawer title="医生审核详情" open={Boolean(selected)} onClose={() => setSelected(null)}>
        {selected ? (
          <Space direction="vertical" size={18} className="compliance-v1-drawer-body">
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="基础信息">{selected.name} / {selected.phone} / {selected.doctorType}</Descriptions.Item>
              <Descriptions.Item label="诊所或机构">{selected.clinicName}</Descriptions.Item>
              <Descriptions.Item label="主要执业机构">{selected.institutionName}</Descriptions.Item>
              <Descriptions.Item label="执业类别">{selected.category}</Descriptions.Item>
              <Descriptions.Item label="职称">{selected.title}</Descriptions.Item>
              <Descriptions.Item label="资质有效期">{selected.licenseExpireAt}</Descriptions.Item>
              <Descriptions.Item label="材料">{selected.materials.join('、')}</Descriptions.Item>
              <Descriptions.Item label="审核说明">{selected.notes}</Descriptions.Item>
            </Descriptions>
            <Alert type={selected.doctorType === '互联网医院医生' ? 'warning' : 'info'} showIcon message={selected.doctorType === '互联网医院医生' ? '需核验多点执业备案、互联网医院签约协议与执业证一致性。' : '诊所医生按轻量资料准入，后续在医生管理中补充信息。'} />
          </Space>
        ) : null}
      </DetailDrawer>
    </PageFrame>
  )
}

export function DoctorManagementV1Page() {
  const [rows, setRows] = useState(doctorsV1)
  const [doctorType, setDoctorType] = useState('全部')
  const [licenseStatus, setLicenseStatus] = useState('全部')
  const [selected, setSelected] = useState(null)
  const { keyword, setKeyword, filteredRows } = useKeywordFilter(rows, ['name', 'phone', 'clinicName', 'institutionName', 'operator'])

  const tableRows = filteredRows.filter((row) => (
    (doctorType === '全部' || row.doctorType === doctorType)
    && (licenseStatus === '全部' || row.licenseStatus === licenseStatus)
  ))

  const toggleEnabled = (record) => {
    setRows((prev) => prev.map((item) => item.id === record.id ? { ...item, enabled: !item.enabled } : item))
    message.success(record.enabled ? '医生已停用' : '医生已启用')
  }

  const columns = [
    { title: '医生ID', dataIndex: 'id', width: 120 },
    { title: '医生类型', dataIndex: 'doctorType', width: 130, render: (value) => <Tag color={value === '诊所医生' ? 'cyan' : 'purple'}>{value}</Tag> },
    { title: '姓名', dataIndex: 'name', width: 100 },
    { title: '手机号', dataIndex: 'phone', width: 140 },
    { title: '诊所/互联网医院', dataIndex: 'clinicName', width: 190 },
    { title: '绑定运营', dataIndex: 'operator', width: 120 },
    { title: '累计开单', dataIndex: 'orderCount', width: 100 },
    { title: '累计佣金', dataIndex: 'commission', width: 110, render: money },
    { title: '资质状态', dataIndex: 'licenseStatus', width: 110, render: (value) => <StatusTag value={value} /> },
    { title: '启用状态', dataIndex: 'enabled', width: 100, render: (value) => <Tag color={value ? 'green' : 'red'}>{value ? '启用' : '停用'}</Tag> },
    {
      title: '操作',
      fixed: 'right',
      width: 230,
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => setSelected(record)}>详情</Button>
          <Button type="link" icon={<EditOutlined />} onClick={() => message.info('原型中展示编辑入口，正式版打开资料编辑弹窗。')}>编辑</Button>
          <Button type="link" danger={record.enabled} icon={record.enabled ? <StopOutlined /> : <ReloadOutlined />} onClick={() => toggleEnabled(record)}>
            {record.enabled ? '停用' : '启用'}
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <PageFrame
      title="医生管理"
      subtitle="管理审核通过医生，互联网医院医生只做资质和开单准入，诊所医生参与绑定、分佣和提现。"
      icon={<SafetyCertificateOutlined />}
      extra={<Alert type="warning" showIcon message="资质已到期医生应自动停用或进入人工处理队列。" />}
    >
      <FilterCard>
        <Space wrap>
          <Select value={doctorType} onChange={setDoctorType} options={['全部', '诊所医生', '互联网医院医生'].map((value) => ({ value, label: value }))} />
          <Select value={licenseStatus} onChange={setLicenseStatus} options={['全部', '正常', '即将到期', '已到期'].map((value) => ({ value, label: value }))} />
          <Input.Search placeholder="搜索医生、手机号、机构、运营" value={keyword} onChange={(event) => setKeyword(event.target.value)} allowClear className="compliance-v1-search" />
        </Space>
      </FilterCard>
      <Table className="compliance-v1-table" rowKey="id" columns={columns} dataSource={tableRows} scroll={{ x: 1500 }} pagination={{ pageSize: 8 }} />
      <DetailDrawer title="医生档案详情" open={Boolean(selected)} onClose={() => setSelected(null)}>
        {selected ? (
          <Space direction="vertical" size={18} className="compliance-v1-drawer-body">
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="医生">{selected.name} / {selected.doctorType}</Descriptions.Item>
              <Descriptions.Item label="机构">{selected.institutionName}</Descriptions.Item>
              <Descriptions.Item label="绑定运营">{selected.operator}</Descriptions.Item>
              <Descriptions.Item label="资质有效期">{selected.licenseExpireAt}</Descriptions.Item>
              <Descriptions.Item label="开单与毛利">{selected.orderCount}单 / {money(selected.grossProfit)}</Descriptions.Item>
              <Descriptions.Item label="佣金">{selected.doctorType === '互联网医院医生' ? '不参与分佣提现' : money(selected.commission)}</Descriptions.Item>
            </Descriptions>
            <Timeline
              items={[
                { color: 'green', children: '审核通过后进入医生管理' },
                { color: selected.licenseStatus === '已到期' ? 'red' : 'blue', children: `资质状态：${selected.licenseStatus}` },
                { color: selected.enabled ? 'green' : 'red', children: `当前${selected.enabled ? '可开单' : '已停用'}` },
              ]}
            />
          </Space>
        ) : null}
      </DetailDrawer>
    </PageFrame>
  )
}

export function OperatorBindingV1Page() {
  const [rows, setRows] = useState(operatorBindingsV1)
  const [commissionMode, setCommissionMode] = useState('全部')
  const [selected, setSelected] = useState(null)
  const { keyword, setKeyword, filteredRows } = useKeywordFilter(rows, ['operatorName', 'operatorPhone', 'doctorName', 'doctorPhone', 'clinicName'])

  const tableRows = filteredRows.filter((row) => commissionMode === '全部' || row.commissionMode === commissionMode)

  const unbind = (record) => {
    Modal.confirm({
      title: '确认解绑',
      content: '解绑后新订单不再归属当前运营，历史订单仍按下单时绑定关系结算。',
      okText: '确认解绑',
      cancelText: '取消',
      onOk: () => {
        setRows((prev) => prev.map((item) => item.id === record.id ? { ...item, status: '已解绑', updatedAt: '刚刚' } : item))
        message.success('绑定关系已解绑')
      },
    })
  }

  const columns = [
    { title: '绑定ID', dataIndex: 'id', width: 120 },
    { title: '运营', dataIndex: 'operatorName', width: 110 },
    { title: '运营手机号', dataIndex: 'operatorPhone', width: 140 },
    { title: '诊所医生', dataIndex: 'doctorName', width: 110 },
    { title: '医生手机号', dataIndex: 'doctorPhone', width: 140 },
    { title: '诊所名称', dataIndex: 'clinicName', width: 190 },
    { title: '分佣方式', dataIndex: 'commissionMode', width: 140, render: (value) => <Tag color={value === '固定比例' ? 'blue' : 'gold'}>{value}</Tag> },
    { title: '运营分佣', dataIndex: 'operatorCommission', width: 230 },
    { title: '医生分佣', dataIndex: 'doctorCommission', width: 230 },
    { title: '状态', dataIndex: 'status', width: 90, render: (value) => <StatusTag value={value} /> },
    {
      title: '操作',
      fixed: 'right',
      width: 260,
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => setSelected(record)}>详情</Button>
          <Button type="link" icon={<UserSwitchOutlined />} onClick={() => message.info('原型中展示换绑入口：选择新运营后生成换绑记录。')}>换绑</Button>
          <Button type="link" icon={<EditOutlined />} onClick={() => message.info('原型中展示分佣编辑入口：支持固定比例与阶梯固定金额。')}>分佣</Button>
          {record.status === '有效' ? <Button type="link" danger onClick={() => unbind(record)}>解绑</Button> : null}
        </Space>
      ),
    },
  ]

  return (
    <PageFrame
      title="运营医生绑定"
      subtitle="诊所医生同一时间只允许绑定一个有效运营，换绑后仅影响新订单。"
      icon={<LinkOutlined />}
    >
      <FilterCard>
        <Space wrap>
          <Select value={commissionMode} onChange={setCommissionMode} options={['全部', '固定比例', '阶梯固定金额'].map((value) => ({ value, label: value }))} />
          <Input.Search placeholder="搜索运营、医生、手机号、诊所" value={keyword} onChange={(event) => setKeyword(event.target.value)} allowClear className="compliance-v1-search" />
        </Space>
      </FilterCard>
      <Table className="compliance-v1-table" rowKey="id" columns={columns} dataSource={tableRows} scroll={{ x: 1900 }} pagination={{ pageSize: 8 }} />
      <DetailDrawer title="绑定关系详情" open={Boolean(selected)} onClose={() => setSelected(null)}>
        {selected ? (
          <Space direction="vertical" size={18} className="compliance-v1-drawer-body">
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="运营">{selected.operatorName} / {selected.operatorPhone}</Descriptions.Item>
              <Descriptions.Item label="诊所医生">{selected.doctorName} / {selected.doctorPhone}</Descriptions.Item>
              <Descriptions.Item label="诊所名称">{selected.clinicName}</Descriptions.Item>
              <Descriptions.Item label="扫码来源">{selected.source}</Descriptions.Item>
              <Descriptions.Item label="分佣方式">{selected.commissionMode}</Descriptions.Item>
              <Descriptions.Item label="运营分佣">{selected.operatorCommission}</Descriptions.Item>
              <Descriptions.Item label="医生分佣">{selected.doctorCommission}</Descriptions.Item>
            </Descriptions>
            <Alert type="info" showIcon message="固定比例按照平台毛利计算；阶梯式分佣按照每单价格区间固定金额计算。" />
          </Space>
        ) : null}
      </DetailDrawer>
    </PageFrame>
  )
}

export function WithdrawalReviewV1Page() {
  const [rows, setRows] = useState(withdrawalsV1)
  const [targetType, setTargetType] = useState('全部')
  const [status, setStatus] = useState('全部')
  const [selected, setSelected] = useState(null)
  const { keyword, setKeyword, filteredRows } = useKeywordFilter(rows, ['id', 'name', 'phone', 'operator'])

  const tableRows = filteredRows.filter((row) => (
    (targetType === '全部' || row.targetType === targetType)
    && (status === '全部' || row.status === status)
  ))

  const progress = (record) => {
    if (record.status === '已打款') return 100
    if (record.status === '待财务审核') return record.targetType === '运营' ? 50 : 66
    if (record.status === '待运营审核') return 33
    return 0
  }

  const advance = (record) => {
    const next = record.targetType === '诊所医生' && record.status === '待运营审核'
      ? { status: '待财务审核', currentNode: '待财务审核' }
      : { status: '已打款', currentNode: '已打款', paidAt: '刚刚' }
    setRows((prev) => prev.map((item) => item.id === record.id ? { ...item, ...next } : item))
    message.success(next.status === '已打款' ? '已标记财务审核通过并打款' : '运营审核已通过')
  }

  const reject = (record) => {
    setRows((prev) => prev.map((item) => item.id === record.id ? { ...item, status: '已拒绝', currentNode: '已拒绝' } : item))
    message.success('提现申请已拒绝')
  }

  const columns = [
    { title: '提现单号', dataIndex: 'id', width: 150 },
    { title: '提现对象', dataIndex: 'targetType', width: 110, render: (value) => <Tag color={value === '运营' ? 'blue' : 'cyan'}>{value}</Tag> },
    { title: '姓名', dataIndex: 'name', width: 100 },
    { title: '手机号', dataIndex: 'phone', width: 140 },
    { title: '关联运营', dataIndex: 'operator', width: 120 },
    { title: '金额', dataIndex: 'amount', width: 110, render: money },
    { title: '关联订单数', dataIndex: 'orderCount', width: 110 },
    { title: '当前节点', dataIndex: 'currentNode', width: 130 },
    { title: '状态', dataIndex: 'status', width: 120, render: (value) => <StatusTag value={value} /> },
    { title: '申请时间', dataIndex: 'appliedAt', width: 160 },
    {
      title: '操作',
      fixed: 'right',
      width: 230,
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => setSelected(record)}>详情</Button>
          {!['已打款', '已拒绝'].includes(record.status) ? (
            <>
              <Button type="link" icon={<CheckCircleOutlined />} onClick={() => advance(record)}>通过</Button>
              <Button type="link" danger icon={<CloseCircleOutlined />} onClick={() => reject(record)}>拒绝</Button>
            </>
          ) : null}
        </Space>
      ),
    },
  ]

  return (
    <PageFrame
      title="提现审核"
      subtitle="诊所医生提现先由上级运营审核，再由财务审核；运营提现直接进入财务审核。"
      icon={<BankOutlined />}
    >
      <FilterCard>
        <Space wrap>
          <Select value={targetType} onChange={setTargetType} options={['全部', '诊所医生', '运营'].map((value) => ({ value, label: value }))} />
          <Select value={status} onChange={setStatus} options={['全部', '待运营审核', '待财务审核', '已打款', '已拒绝'].map((value) => ({ value, label: value }))} />
          <Input.Search placeholder="搜索提现单、姓名、手机号、运营" value={keyword} onChange={(event) => setKeyword(event.target.value)} allowClear className="compliance-v1-search" />
        </Space>
      </FilterCard>
      <Table className="compliance-v1-table" rowKey="id" columns={columns} dataSource={tableRows} scroll={{ x: 1500 }} pagination={{ pageSize: 8 }} />
      <DetailDrawer title="提现审核详情" open={Boolean(selected)} onClose={() => setSelected(null)}>
        {selected ? (
          <Space direction="vertical" size={18} className="compliance-v1-drawer-body">
            <Progress percent={progress(selected)} status={selected.status === '已拒绝' ? 'exception' : 'active'} />
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="提现人">{selected.name} / {selected.targetType}</Descriptions.Item>
              <Descriptions.Item label="提现金额">{money(selected.amount)}</Descriptions.Item>
              <Descriptions.Item label="平台毛利">{money(selected.grossProfit)}</Descriptions.Item>
              <Descriptions.Item label="关联订单">{selected.orderCount}单，完成闭环时间：{selected.completedAt}</Descriptions.Item>
              <Descriptions.Item label="佣金明细">{selected.commissionDetail}</Descriptions.Item>
              <Descriptions.Item label="打款信息">无需上传截图，仅记录状态、时间和操作人。当前打款时间：{selected.paidAt}</Descriptions.Item>
            </Descriptions>
          </Space>
        ) : null}
      </DetailDrawer>
    </PageFrame>
  )
}

export function ManagementDashboardV1Page() {
  const data = complianceDashboardV1
  const overviewCards = [
    { title: '总开单数', value: data.overview.orders, suffix: '单', icon: <UserAddOutlined /> },
    { title: '总GMV', value: data.overview.gmv, formatter: money, icon: <BarChartOutlined /> },
    { title: '平台毛利', value: data.overview.grossProfit, formatter: money, icon: <BankOutlined /> },
    { title: '佣金总额', value: data.overview.commission, formatter: money, icon: <TeamOutlined /> },
    { title: '待审核提现', value: data.overview.pendingWithdrawal, formatter: money, icon: <ExclamationCircleOutlined /> },
  ]

  const operatorColumns = [
    { title: '运营姓名', dataIndex: 'name' },
    { title: '绑定医生数', dataIndex: 'doctors' },
    { title: '医生开单数', dataIndex: 'orders' },
    { title: '订单金额', dataIndex: 'amount', render: money },
    { title: '平台毛利', dataIndex: 'grossProfit', render: money },
    { title: '运营佣金', dataIndex: 'operatorCommission', render: money },
    { title: '医生佣金', dataIndex: 'doctorCommission', render: money },
  ]

  const doctorColumns = [
    { title: '医生姓名', dataIndex: 'name' },
    { title: '医生类型', dataIndex: 'type', render: (value) => <Tag color={value === '诊所医生' ? 'cyan' : 'purple'}>{value}</Tag> },
    { title: '诊所/机构', dataIndex: 'clinic' },
    { title: '绑定运营', dataIndex: 'operator' },
    { title: '开单数', dataIndex: 'orders' },
    { title: '订单金额', dataIndex: 'amount', render: money },
    { title: '医生佣金', dataIndex: 'commission', render: money },
  ]

  return (
    <PageFrame
      title="管理层数据看板"
      subtitle="从资源、开单、平台毛利、佣金和提现风险看清合规开单业务质量。"
      icon={<BarChartOutlined />}
    >
      <Card className="compliance-v1-filter" bordered={false}>
        <Space wrap>
          <Select defaultValue="近30天" options={['今日', '近7天', '近30天', '本月'].map((value) => ({ value, label: value }))} />
          <Select defaultValue="全部地区" options={['全部地区', '湖南', '广东', '浙江'].map((value) => ({ value, label: value }))} />
          <Select defaultValue="全部医生类型" options={['全部医生类型', '诊所医生', '互联网医院医生'].map((value) => ({ value, label: value }))} />
        </Space>
      </Card>
      <Row gutter={[16, 16]}>
        {overviewCards.map((item) => (
          <Col span={item.title === '待审核提现' ? 4 : 5} key={item.title}>
            <Card className="compliance-v1-stat-card" bordered={false}>
              <span className="compliance-v1-stat-icon">{item.icon}</span>
              <Statistic title={item.title} value={item.value} suffix={item.suffix} formatter={item.formatter} />
            </Card>
          </Col>
        ))}
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card className="compliance-v1-card" title="资源概览" bordered={false}>
            <div className="compliance-v1-resource-grid">
              <div><strong>{data.resource.clinicDoctors}</strong><span>诊所医生</span></div>
              <div><strong>{data.resource.internetDoctors}</strong><span>互联网医院医生</span></div>
              <div><strong>{data.resource.enabledDoctors}</strong><span>启用医生</span></div>
              <div><strong>{data.resource.expiringDoctors}</strong><span>资质即将到期</span></div>
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card className="compliance-v1-card" title="开单转化" bordered={false}>
            <Space direction="vertical" className="compliance-v1-wide">
              <div>完成检查率 <Progress percent={Math.round((data.overview.completed / data.overview.orders) * 100)} /></div>
              <div>报告完成率 <Progress percent={Math.round((data.overview.reports / data.overview.completed) * 100)} /></div>
              <div>毛利率 <Progress percent={Math.round((data.overview.grossProfit / data.overview.gmv) * 100)} /></div>
            </Space>
          </Card>
        </Col>
        <Col span={8}>
          <Card className="compliance-v1-card" title="异常提醒" bordered={false}>
            <Space direction="vertical" size={10}>
              {data.alerts.map((item) => <Alert key={item} type="warning" showIcon message={item} />)}
            </Space>
          </Card>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card className="compliance-v1-card" title="运营排行" bordered={false}>
            <Table rowKey="name" size="small" columns={operatorColumns} dataSource={data.operatorRanking} pagination={false} scroll={{ x: 900 }} />
          </Card>
        </Col>
        <Col span={12}>
          <Card className="compliance-v1-card" title="医生排行" bordered={false}>
            <Table rowKey="name" size="small" columns={doctorColumns} dataSource={data.doctorRanking} pagination={false} scroll={{ x: 780 }} />
          </Card>
        </Col>
      </Row>
      <Card className="compliance-v1-card" title="业务闭环" bordered={false}>
        <div className="compliance-v1-flow">
          {['医生提交入驻', '平台审核', '医生启用', '诊所医生绑定运营', '开单履约', '佣金计算', '发起提现', '审核打款', '看板复盘'].map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </Card>
    </PageFrame>
  )
}
