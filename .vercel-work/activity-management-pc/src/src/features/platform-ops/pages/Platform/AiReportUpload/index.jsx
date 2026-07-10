import { useEffect, useMemo, useState } from 'react'
import {
  Alert,
  Button,
  Card,
  Descriptions,
  Empty,
  Input,
  Modal,
  Space,
  Table,
  Tag,
  Typography,
  Upload,
  message,
} from 'antd'
import {
  ArrowLeftOutlined,
  EyeOutlined,
  FileSearchOutlined,
  SearchOutlined,
  UploadOutlined,
} from '@ant-design/icons'
import dayjs from 'dayjs'
import { AI_REPORT_STORAGE_KEY, cloneAiReportOrders } from '../../../../../shared/mocks/aiReports'

const { Paragraph, Text } = Typography

const ACCEPTED_TYPES = ['application/pdf', 'image/png', 'image/jpeg']
const ACCEPTED_EXTENSIONS = ['.pdf', '.png', '.jpg', '.jpeg']

const statusColorMap = {
  待上传: 'default',
  已上传待发布: 'orange',
  已发布: 'green',
  已替换: 'blue',
}

function inferExtension(name = '') {
  const lowerName = name.toLowerCase()
  return ACCEPTED_EXTENSIONS.find((item) => lowerName.endsWith(item)) || ''
}

function isAcceptedFile(file) {
  const ext = inferExtension(file.name)
  return ACCEPTED_TYPES.includes(file.type) || Boolean(ext)
}

function now() {
  return dayjs().format('YYYY-MM-DD HH:mm')
}

function toRow(order, project) {
  return {
    key: project.id,
    orderId: order.id,
    projectId: project.id,
    orderNo: order.orderNo,
    orderName: project.projectName,
    openHospital: order.clinicName,
    projectName: project.projectName,
    projectCode: project.projectCode,
    amount: project.amount,
    patientName: order.patientName,
    phone: order.phone,
    paymentChannel: order.paymentChannel,
    tradeNo: order.tradeNo,
    paymentStatus: order.paymentStatus,
    paymentTime: order.paymentTime,
    createdAt: order.createdAt,
    aiReportName: project.aiProductName,
    aiReportStatus: project.aiReportStatus,
    updatedAt: project.updatedAt,
    imageNo: order.imageNo,
    examTime: order.examTime,
    currentFileName: project.currentFileName,
    currentVersion: project.currentVersion,
    uploadTime: project.uploadTime,
    publishedAt: project.publishedAt,
    uploadOperator: project.uploadOperator,
    history: project.history || [],
  }
}

export default function AiReportUploadPage() {
  const [orders, setOrders] = useState(() => {
    if (typeof window === 'undefined') return cloneAiReportOrders()
    const saved = window.localStorage.getItem(AI_REPORT_STORAGE_KEY)
    if (!saved) return cloneAiReportOrders()
    try {
      return JSON.parse(saved)
    } catch {
      return cloneAiReportOrders()
    }
  })
  const [keyword, setKeyword] = useState('')
  const [pageMode, setPageMode] = useState('list')
  const [activeRow, setActiveRow] = useState(null)
  const [fileList, setFileList] = useState([])
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [detailModalOpen, setDetailModalOpen] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(AI_REPORT_STORAGE_KEY, JSON.stringify(orders))
  }, [orders])

  const rows = useMemo(
    () => orders.flatMap((order) => order.projects.map((project) => toRow(order, project))),
    [orders],
  )

  const filteredRows = useMemo(() => {
    if (!keyword.trim()) return rows
    const text = keyword.trim()
    return rows.filter((item) => (
      item.orderNo.includes(text)
      || item.patientName.includes(text)
      || item.phone.includes(text)
      || item.projectName.includes(text)
    ))
  }, [keyword, rows])

  const updateProject = (row, updater) => {
    setOrders((prevOrders) => prevOrders.map((order) => {
      if (order.id !== row.orderId) return order
      return {
        ...order,
        projects: order.projects.map((project) => (
          project.id === row.projectId ? updater(project) : project
        )),
      }
    }))
  }

  const openUploadModal = (row) => {
    setActiveRow(row)
    setFileList([])
    setUploadModalOpen(true)
  }

  const closeUploadModal = () => {
    setUploadModalOpen(false)
    setFileList([])
  }

  const handleUploadConfirm = () => {
    const currentFile = fileList[0]?.originFileObj
    if (!activeRow) return
    if (!currentFile) {
      message.error('请先选择 AI 报告文件')
      return
    }
    if (!isAcceptedFile(currentFile)) {
      message.error('仅支持 PDF、PNG、JPG/JPEG 格式')
      return
    }

    const actionAt = now()
    const nextVersion = (activeRow.currentVersion || 0) + 1
    const isReplace = activeRow.aiReportStatus === '已上传待发布' || activeRow.aiReportStatus === '已发布' || activeRow.aiReportStatus === '已替换'
    const nextStatus = isReplace && activeRow.aiReportStatus !== '已上传待发布' ? '已替换' : '已上传待发布'

    updateProject(activeRow, (project) => ({
      ...project,
      aiReportStatus: nextStatus,
      currentFileName: currentFile.name,
      currentFileType: currentFile.type || 'application/octet-stream',
      currentFileSizeLabel: `${Math.max(1, Math.round(currentFile.size / 1024))} KB`,
      currentVersion: nextVersion,
      updatedAt: actionAt,
      uploadTime: project.uploadTime === '-' ? actionAt : project.uploadTime,
      publishedAt: nextStatus === '已替换' ? project.publishedAt : '-',
      uploadOperator: '当前运营',
      history: [
        ...(project.history || []),
        {
          version: nextVersion,
          action: isReplace ? '替换 AI 报告文件' : '上传 AI 报告文件',
          operator: '当前运营',
          actionAt,
          fileName: currentFile.name,
        },
      ],
    }))

    setActiveRow((prev) => prev ? {
      ...prev,
      aiReportStatus: nextStatus,
      currentFileName: currentFile.name,
      currentVersion: nextVersion,
      updatedAt: actionAt,
      uploadTime: prev.uploadTime === '-' ? actionAt : prev.uploadTime,
      uploadOperator: '当前运营',
    } : prev)
    message.success(isReplace ? 'AI 报告文件已替换' : 'AI 报告文件已上传')
    closeUploadModal()
  }

  const handlePublish = (row) => {
    Modal.confirm({
      title: '确认发布 AI 报告',
      content: '确认将当前 AI 报告状态更新为已发布？',
      okText: '确认发布',
      cancelText: '取消',
      onOk: () => {
        const actionAt = now()
        updateProject(row, (project) => ({
          ...project,
          aiReportStatus: '已发布',
          updatedAt: actionAt,
          publishedAt: actionAt,
          history: [
            ...(project.history || []),
            {
              version: project.currentVersion,
              action: '发布 AI 报告',
              operator: '当前运营',
              actionAt,
              fileName: project.currentFileName,
            },
          ],
        }))
        setActiveRow((prev) => prev && prev.projectId === row.projectId ? { ...prev, aiReportStatus: '已发布', updatedAt: actionAt, publishedAt: actionAt } : prev)
        message.success('AI 报告已发布')
      },
    })
  }

  const listColumns = [
    { title: '订单号', dataIndex: 'orderNo', width: 210, render: (value) => <Text strong>{value}</Text> },
    { title: '开单医院', dataIndex: 'openHospital', width: 170, ellipsis: true },
    { title: '检查项目名称', dataIndex: 'projectName', width: 180, ellipsis: true },
    { title: '检查项目编码', dataIndex: 'projectCode', width: 130 },
    { title: '金额', dataIndex: 'amount', width: 100, align: 'right', render: (value) => `¥${value.toFixed(2)}` },
    { title: '患者姓名', dataIndex: 'patientName', width: 100 },
    { title: '手机号', dataIndex: 'phone', width: 120 },
    { title: '支付渠道', dataIndex: 'paymentChannel', width: 100 },
    { title: '支付交易号', dataIndex: 'tradeNo', width: 170, ellipsis: true },
    {
      title: '支付状态',
      dataIndex: 'paymentStatus',
      width: 100,
      render: (value) => <Tag color={value === '已支付' ? 'green' : value === '待缴费' ? 'orange' : 'blue'}>{value}</Tag>,
    },
    { title: '支付时间', dataIndex: 'paymentTime', width: 160 },
    { title: '创建时间', dataIndex: 'createdAt', width: 160 },
    {
      title: 'AI报告上传状态',
      dataIndex: 'aiReportStatus',
      width: 140,
      render: (value) => <Tag color={statusColorMap[value]}>{value}</Tag>,
    },
    {
      title: '操作',
      key: 'action',
      width: 170,
      fixed: 'right',
      render: (_, row) => (
        <Space>
          <Button type="link" size="small">明细</Button>
          <Button
            type="link"
            size="small"
            icon={<FileSearchOutlined />}
            onClick={() => {
              setActiveRow(row)
              setPageMode('detail')
            }}
          >
            AI报告处理
          </Button>
        </Space>
      ),
    },
  ]

  const renderActionButtons = (row) => {
    if (row.aiReportStatus === '待上传') {
      return (
        <Button type="primary" icon={<UploadOutlined />} onClick={() => openUploadModal(row)}>
          上传
        </Button>
      )
    }

    if (row.aiReportStatus === '已上传待发布') {
      return (
        <Space>
          <Button icon={<UploadOutlined />} onClick={() => openUploadModal(row)}>替换</Button>
          <Button type="primary" icon={<EyeOutlined />} onClick={() => handlePublish(row)}>发布</Button>
        </Space>
      )
    }

    return (
      <Space>
        <Button icon={<UploadOutlined />} onClick={() => openUploadModal(row)}>替换</Button>
        <Button type="primary" icon={<EyeOutlined />} onClick={() => setDetailModalOpen(true)}>查看详情</Button>
      </Space>
    )
  }

  const detailBlocks = activeRow ? (
    <>
      <Card size="small" title="订单信息">
        <Descriptions column={2} size="small">
          <Descriptions.Item label="订单号">{activeRow.orderNo}</Descriptions.Item>
          <Descriptions.Item label="订单名称">{activeRow.orderName}</Descriptions.Item>
          <Descriptions.Item label="开单医院">{activeRow.openHospital}</Descriptions.Item>
          <Descriptions.Item label="患者姓名">{activeRow.patientName}</Descriptions.Item>
          <Descriptions.Item label="影像号">{activeRow.imageNo}</Descriptions.Item>
          <Descriptions.Item label="检查时间">{activeRow.examTime}</Descriptions.Item>
        </Descriptions>
      </Card>

      <Card size="small" title="AI 报告信息">
        <Descriptions column={2} size="small">
          <Descriptions.Item label="AI 报告名称">{activeRow.aiReportName}</Descriptions.Item>
          <Descriptions.Item label="AI 报告状态">
            <Tag color={statusColorMap[activeRow.aiReportStatus]}>{activeRow.aiReportStatus}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="最近更新时间">{activeRow.updatedAt}</Descriptions.Item>
          <Descriptions.Item label="当前文件名">{activeRow.currentFileName || '-'}</Descriptions.Item>
        </Descriptions>
      </Card>

      <Card size="small" title="操作记录">
        <Descriptions column={1} size="small">
          <Descriptions.Item label="上传时间">{activeRow.uploadTime || '-'}</Descriptions.Item>
          <Descriptions.Item label="发布时间">{activeRow.publishedAt || '-'}</Descriptions.Item>
          <Descriptions.Item label="最近操作人">{activeRow.uploadOperator || '-'}</Descriptions.Item>
        </Descriptions>
      </Card>

      <Card size="small" title="文件区">
        {activeRow.currentFileName ? (
          <Space wrap>
            <Tag color="blue">{activeRow.currentFileName}</Tag>
            <Button type="primary">预览</Button>
            <Button>下载</Button>
          </Space>
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="当前暂无 AI 报告文件" />
        )}
      </Card>
    </>
  ) : null

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 16, padding: 16, overflow: 'auto' }}>
      {pageMode === 'list' ? (
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: 20, fontWeight: 600, color: '#0f172a' }}>AI 报告上传</div>
              <div style={{ marginTop: 6, color: '#64748b' }}>复用正式线上订单列表字段，在订单维度增加 AI 报告上传状态与处理入口。</div>
            </div>
            <Alert
              showIcon
              type="info"
              style={{ minWidth: 360 }}
              message="当前原型范围"
              description="当前只聚焦平台后台里的 AI 报告上传、手动发布、替换和详情查看。"
            />
          </div>

          <Card>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
              <Input
                allowClear
                value={keyword}
                prefix={<SearchOutlined />}
                placeholder="订单号 / 患者姓名 / 手机号 / 检查项目"
                style={{ width: 320 }}
                onChange={(event) => setKeyword(event.target.value)}
              />
              <Space>
                <Button type="primary">查询</Button>
                <Button onClick={() => setKeyword('')}>重置</Button>
              </Space>
            </div>
          </Card>

          <Card title="订单列表">
            <Table
              rowKey="key"
              columns={listColumns}
              dataSource={filteredRows}
              pagination={{ pageSize: 8 }}
              scroll={{ x: 1900 }}
              locale={{ emptyText: '暂无匹配的订单记录。' }}
            />
          </Card>
        </>
      ) : (
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
            <Space>
              <Button icon={<ArrowLeftOutlined />} onClick={() => setPageMode('list')}>
                返回一级列表
              </Button>
              <div>
                <div style={{ fontSize: 18, fontWeight: 600, color: '#0f172a' }}>AI 报告处理</div>
                <div style={{ marginTop: 4, color: '#64748b' }}>按当前订单完成上传、发布、替换和详情查看。</div>
              </div>
            </Space>
            {activeRow && <Tag color={statusColorMap[activeRow.aiReportStatus]}>{activeRow.aiReportStatus}</Tag>}
          </div>

          {activeRow && (
            <>
              <Card title="订单基础信息" extra={<Tag color="blue">与一级列表字段保持一致</Tag>}>
                <Descriptions column={3} size="small">
                  <Descriptions.Item label="订单号">{activeRow.orderNo}</Descriptions.Item>
                  <Descriptions.Item label="开单医院">{activeRow.openHospital}</Descriptions.Item>
                  <Descriptions.Item label="检查项目名称">{activeRow.projectName}</Descriptions.Item>
                  <Descriptions.Item label="检查项目编码">{activeRow.projectCode}</Descriptions.Item>
                  <Descriptions.Item label="金额">¥{activeRow.amount.toFixed(2)}</Descriptions.Item>
                  <Descriptions.Item label="患者姓名">{activeRow.patientName}</Descriptions.Item>
                  <Descriptions.Item label="手机号">{activeRow.phone}</Descriptions.Item>
                  <Descriptions.Item label="支付渠道">{activeRow.paymentChannel}</Descriptions.Item>
                  <Descriptions.Item label="支付交易号">{activeRow.tradeNo}</Descriptions.Item>
                  <Descriptions.Item label="支付状态">{activeRow.paymentStatus}</Descriptions.Item>
                  <Descriptions.Item label="支付时间">{activeRow.paymentTime}</Descriptions.Item>
                  <Descriptions.Item label="创建时间">{activeRow.createdAt}</Descriptions.Item>
                  <Descriptions.Item label="AI报告上传状态">
                    <Tag color={statusColorMap[activeRow.aiReportStatus]}>{activeRow.aiReportStatus}</Tag>
                  </Descriptions.Item>
                </Descriptions>
              </Card>

              <Card title="AI 报告处理操作">
                <Descriptions column={2} size="small" style={{ marginBottom: 16 }}>
                  <Descriptions.Item label="AI 报告名称">{activeRow.aiReportName}</Descriptions.Item>
                  <Descriptions.Item label="最近更新时间">{activeRow.updatedAt}</Descriptions.Item>
                </Descriptions>
                <Space wrap>{renderActionButtons(activeRow)}</Space>
                <Paragraph style={{ marginTop: 16, marginBottom: 0, color: '#64748b' }}>
                  当前规则：待上传可直接上传；已上传待发布可替换或发布；已发布与已替换可替换并查看详情。
                </Paragraph>
              </Card>
            </>
          )}
        </>
      )}

      <Modal
        title={activeRow?.aiReportStatus === '待上传' ? '上传 AI 报告文件' : '替换 AI 报告文件'}
        open={uploadModalOpen}
        onCancel={closeUploadModal}
        onOk={handleUploadConfirm}
        okText="确认上传"
        cancelText="取消"
      >
        <Upload
          accept={ACCEPTED_EXTENSIONS.join(',')}
          maxCount={1}
          fileList={fileList}
          beforeUpload={(file) => {
            if (!isAcceptedFile(file)) {
              message.error('仅支持 PDF、PNG、JPG/JPEG 格式')
              return Upload.LIST_IGNORE
            }
            setFileList([{ uid: file.uid, name: file.name, status: 'done', originFileObj: file }])
            return false
          }}
          onRemove={() => {
            setFileList([])
          }}
        >
          <Button icon={<UploadOutlined />}>选择文件</Button>
        </Upload>
      </Modal>

      <Modal
        title="AI 报告详情"
        open={detailModalOpen}
        onCancel={() => setDetailModalOpen(false)}
        footer={<Button onClick={() => setDetailModalOpen(false)}>关闭</Button>}
        width={820}
      >
        {detailBlocks}
      </Modal>
    </div>
  )
}
