import { useEffect, useMemo, useState } from 'react'
import {
  Button,
  Card,
  DatePicker,
  Descriptions,
  Input,
  Modal,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import {
  cloneOrderAssociationOrders,
  ORDER_ASSOCIATION_STORAGE_KEY,
  orderAssociationDoctors,
} from '../../../../../shared/mocks/orderAssociation'

const { Text } = Typography

const paymentStatusColorMap = {
  已缴费: 'green',
  待缴费: 'orange',
}

function matchKeyword(record, keyword) {
  if (!keyword.trim()) return true
  const text = keyword.trim()
  return record.doctorName.includes(text)
    || record.phone.includes(text)
    || record.clinicName.includes(text)
    || record.operatorName.includes(text)
}

export default function OrderAssociation() {
  const [orders, setOrders] = useState(() => {
    if (typeof window === 'undefined') return cloneOrderAssociationOrders()
    const saved = window.localStorage.getItem(ORDER_ASSOCIATION_STORAGE_KEY)
    if (!saved) return cloneOrderAssociationOrders()
    try {
      return JSON.parse(saved)
    } catch {
      return cloneOrderAssociationOrders()
    }
  })
  const [draftFilters, setDraftFilters] = useState({
    startDate: null,
    endDate: null,
    paymentStatus: undefined,
    orderNo: '',
  })
  const [queryFilters, setQueryFilters] = useState({
    startDate: null,
    endDate: null,
    paymentStatus: undefined,
    orderNo: '',
  })
  const [detailOpen, setDetailOpen] = useState(false)
  const [associateOpen, setAssociateOpen] = useState(false)
  const [activeRow, setActiveRow] = useState(null)
  const [doctorKeyword, setDoctorKeyword] = useState('')
  const [selectedDoctorId, setSelectedDoctorId] = useState(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(ORDER_ASSOCIATION_STORAGE_KEY, JSON.stringify(orders))
  }, [orders])

  const filteredRows = useMemo(() => orders.filter((item) => {
    if (queryFilters.paymentStatus && item.paymentStatus !== queryFilters.paymentStatus) return false
    if (queryFilters.orderNo.trim() && !item.orderNo.includes(queryFilters.orderNo.trim())) return false

    const currentTime = dayjs(item.createdAt)

    if (queryFilters.startDate && currentTime.isBefore(dayjs(queryFilters.startDate).startOf('day'))) return false
    if (queryFilters.endDate && currentTime.isAfter(dayjs(queryFilters.endDate).endOf('day'))) return false

    return true
  }), [orders, queryFilters])

  const filteredDoctors = useMemo(
    () => orderAssociationDoctors.filter((item) => matchKeyword(item, doctorKeyword)),
    [doctorKeyword],
  )

  const openDetailModal = (row) => {
    setActiveRow(row)
    setDetailOpen(true)
  }

  const openAssociateModal = (row) => {
    setActiveRow(row)
    setSelectedDoctorId(row.associatedDoctorId || null)
    setDoctorKeyword('')
    setAssociateOpen(true)
  }

  const handleSearch = () => {
    setQueryFilters({ ...draftFilters })
  }

  const handleExport = () => {
    message.success(`已导出 ${filteredRows.length} 条订单`)
  }

  const handleAssociateConfirm = () => {
    if (!activeRow) return
    if (!selectedDoctorId) {
      message.error('请先选择要关联的医生')
      return
    }

    const selectedDoctor = orderAssociationDoctors.find((item) => item.id === selectedDoctorId)
    if (!selectedDoctor) {
      message.error('未找到对应医生，请重新选择')
      return
    }

    const associatedAt = dayjs().format('YYYY-MM-DD HH:mm')
    setOrders((prev) => prev.map((item) => (
      item.id === activeRow.id
        ? {
          ...item,
          associatedDoctorId: selectedDoctor.id,
          associatedDoctorName: selectedDoctor.doctorName,
          associatedDoctorPhone: selectedDoctor.phone,
          associatedClinicName: selectedDoctor.clinicName,
          associatedOperatorName: selectedDoctor.operatorName,
          associatedAt,
        }
        : item
    )))

    setActiveRow((prev) => (prev ? {
      ...prev,
      associatedDoctorId: selectedDoctor.id,
      associatedDoctorName: selectedDoctor.doctorName,
      associatedDoctorPhone: selectedDoctor.phone,
      associatedClinicName: selectedDoctor.clinicName,
      associatedOperatorName: selectedDoctor.operatorName,
      associatedAt,
    } : prev))
    setAssociateOpen(false)
    message.success(`订单 ${activeRow.orderNo} 已关联至 ${selectedDoctor.doctorName}`)
  }

  const orderColumns = [
    { title: '订单号', dataIndex: 'orderNo', width: 220, render: (value) => <Text strong>{value}</Text> },
    { title: '开单医院', dataIndex: 'openHospital', width: 170, ellipsis: true },
    {
      title: '关联医生',
      dataIndex: 'associatedDoctorName',
      width: 140,
      render: (value) => value || <span style={{ color: '#999' }}>未关联</span>,
    },
    { title: '检查项目名称', dataIndex: 'projectName', width: 170, ellipsis: true },
    { title: '检查项目编码', dataIndex: 'projectCode', width: 130 },
    { title: '金额', dataIndex: 'amount', width: 100, align: 'right', render: (value) => `¥${value.toFixed(2)}` },
    { title: '患者姓名', dataIndex: 'patientName', width: 100 },
    { title: '手机号', dataIndex: 'phone', width: 130 },
    { title: '支付渠道', dataIndex: 'paymentChannel', width: 100 },
    { title: '支付交易号', dataIndex: 'tradeNo', width: 170, ellipsis: true },
    {
      title: '支付状态',
      dataIndex: 'paymentStatus',
      width: 100,
      render: (value) => <Tag color={paymentStatusColorMap[value] || 'default'}>{value}</Tag>,
    },
    { title: '支付时间', dataIndex: 'paymentTime', width: 160 },
    { title: '创建时间', dataIndex: 'createdAt', width: 160 },
    {
      title: '操作',
      key: 'action',
      width: 120,
      fixed: 'right',
      render: (_, row) => (
        <Space size={0}>
          <Button type="link" size="small" onClick={() => openDetailModal(row)}>详情</Button>
          <Button type="link" size="small" onClick={() => openAssociateModal(row)}>关联</Button>
        </Space>
      ),
    },
  ]

  const doctorColumns = [
    { title: '医生姓名', dataIndex: 'doctorName', width: 120 },
    { title: '手机号', dataIndex: 'phone', width: 140 },
    { title: '机构名称', dataIndex: 'clinicName', width: 180, ellipsis: true },
    { title: '所属科室', dataIndex: 'department', width: 120 },
    { title: '关联运营', dataIndex: 'operatorName', width: 120 },
    {
      title: '状态',
      dataIndex: 'enabledStatus',
      width: 100,
      render: (value) => <Tag color={value === '已启用' ? 'green' : 'default'}>{value}</Tag>,
    },
  ]

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 16, padding: 16, overflow: 'hidden' }}>
      <div style={{ fontSize: 16, fontWeight: 500, color: '#333' }}>执行机构订单列表</div>

      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <Space wrap size={12}>
            <DatePicker
              placeholder="开始时间"
              value={draftFilters.startDate}
              onChange={(value) => setDraftFilters((prev) => ({ ...prev, startDate: value }))}
            />
            <span style={{ color: '#666' }}>至</span>
            <DatePicker
              placeholder="结束时间"
              value={draftFilters.endDate}
              onChange={(value) => setDraftFilters((prev) => ({ ...prev, endDate: value }))}
            />
            <Select
              placeholder="支付状态"
              allowClear
              style={{ width: 140 }}
              value={draftFilters.paymentStatus}
              onChange={(value) => setDraftFilters((prev) => ({ ...prev, paymentStatus: value }))}
            >
              <Select.Option value="已缴费">已缴费</Select.Option>
              <Select.Option value="待缴费">待缴费</Select.Option>
            </Select>
            <Input
              allowClear
              value={draftFilters.orderNo}
              placeholder="订单号"
              style={{ width: 220 }}
              onChange={(event) => setDraftFilters((prev) => ({ ...prev, orderNo: event.target.value }))}
            />
          </Space>

          <Space>
            <Button type="primary" onClick={handleSearch}>查询</Button>
            <Button
              type="primary"
              style={{ background: '#67c23a', borderColor: '#67c23a' }}
              onClick={handleExport}
            >
              导出Excel
            </Button>
          </Space>
        </div>
      </Card>

      <Table
        rowKey="id"
        columns={orderColumns}
        dataSource={filteredRows}
        pagination={{ pageSize: 8, showSizeChanger: false }}
        scroll={{ x: 1900, y: 'calc(100vh - 270px)' }}
        style={{ flex: 1 }}
      />

      <Modal
        title="订单详情"
        open={detailOpen}
        onCancel={() => setDetailOpen(false)}
        footer={<Button onClick={() => setDetailOpen(false)}>关闭</Button>}
        width={900}
        destroyOnClose
      >
        {activeRow && (
          <Descriptions bordered size="small" column={2}>
            <Descriptions.Item label="订单号">{activeRow.orderNo}</Descriptions.Item>
            <Descriptions.Item label="开单医院">{activeRow.openHospital}</Descriptions.Item>
            <Descriptions.Item label="订单来源">{activeRow.orderSource}</Descriptions.Item>
            <Descriptions.Item label="检查项目名称">{activeRow.projectName}</Descriptions.Item>
            <Descriptions.Item label="检查项目编码">{activeRow.projectCode}</Descriptions.Item>
            <Descriptions.Item label="金额">¥{activeRow.amount.toFixed(2)}</Descriptions.Item>
            <Descriptions.Item label="患者姓名">{activeRow.patientName}</Descriptions.Item>
            <Descriptions.Item label="手机号">{activeRow.phone}</Descriptions.Item>
            <Descriptions.Item label="支付渠道">{activeRow.paymentChannel}</Descriptions.Item>
            <Descriptions.Item label="支付交易号">{activeRow.tradeNo}</Descriptions.Item>
            <Descriptions.Item label="支付状态">
              <Tag color={paymentStatusColorMap[activeRow.paymentStatus] || 'default'}>{activeRow.paymentStatus}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="支付时间">{activeRow.paymentTime}</Descriptions.Item>
            <Descriptions.Item label="创建时间">{activeRow.createdAt}</Descriptions.Item>
            <Descriptions.Item label="当前关联医生">
              {activeRow.associatedDoctorName || <span style={{ color: '#999' }}>未关联</span>}
            </Descriptions.Item>
            <Descriptions.Item label="医生手机号">{activeRow.associatedDoctorPhone || '-'}</Descriptions.Item>
            <Descriptions.Item label="医生机构">{activeRow.associatedClinicName || '-'}</Descriptions.Item>
            <Descriptions.Item label="关联运营">{activeRow.associatedOperatorName || '-'}</Descriptions.Item>
            <Descriptions.Item label="关联时间">{activeRow.associatedAt || '-'}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      <Modal
        title="关联医生"
        open={associateOpen}
        onCancel={() => setAssociateOpen(false)}
        onOk={handleAssociateConfirm}
        okText="确认关联"
        cancelText="取消"
        width={920}
        destroyOnClose
      >
        {activeRow && (
          <>
            <Card size="small" style={{ marginBottom: 16, background: '#fafafa' }}>
              <Space split={<span style={{ color: '#d9d9d9' }}>|</span>} wrap>
                <span>订单号：{activeRow.orderNo}</span>
                <span>患者：{activeRow.patientName}</span>
                <span>项目：{activeRow.projectName}</span>
                <span>
                  当前关联：
                  {activeRow.associatedDoctorName ? (
                    <Tag color="blue" style={{ marginInlineStart: 8 }}>{activeRow.associatedDoctorName}</Tag>
                  ) : (
                    <span style={{ color: '#999' }}> 未关联</span>
                  )}
                </span>
              </Space>
            </Card>

            <Input
              allowClear
              value={doctorKeyword}
              prefix={<SearchOutlined />}
              placeholder="搜索医生姓名 / 手机号 / 机构名称 / 关联运营"
              style={{ width: 360, marginBottom: 16 }}
              onChange={(event) => setDoctorKeyword(event.target.value)}
            />

            <Table
              rowKey="id"
              columns={doctorColumns}
              dataSource={filteredDoctors}
              pagination={{ pageSize: 6, showSizeChanger: false }}
              scroll={{ x: 760, y: 320 }}
              rowSelection={{
                type: 'radio',
                selectedRowKeys: selectedDoctorId ? [selectedDoctorId] : [],
                onChange: (selectedRowKeys) => setSelectedDoctorId(selectedRowKeys[0] || null),
              }}
              onRow={(record) => ({
                onClick: () => setSelectedDoctorId(record.id),
              })}
            />
          </>
        )}
      </Modal>
    </div>
  )
}
