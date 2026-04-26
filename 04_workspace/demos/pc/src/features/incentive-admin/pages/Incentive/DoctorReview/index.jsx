import { useMemo, useState } from 'react'
import { Button, Card, Col, Descriptions, Drawer, Form, Input, Row, Select, Space, Statistic, Table, Tag, message } from 'antd'
import { CheckCircleOutlined, CloseCircleOutlined, EyeOutlined } from '@ant-design/icons'
import { doctorApplications } from '../../../../../shared/mocks/incentive'

const statusColors = {
  '待审核': 'orange',
  '审核通过': 'green',
  '审核驳回': 'red',
}

export default function DoctorReview() {
  const [query, setQuery] = useState({ keyword: '', auditStatus: undefined })
  const [selected, setSelected] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const filteredData = useMemo(() => {
    return doctorApplications.filter((item) => {
      if (query.keyword) {
        const keyword = query.keyword.trim()
        const hit = item.doctorName.includes(keyword) || item.phone.includes(keyword)
        if (!hit) return false
      }
      if (query.auditStatus && item.auditStatus !== query.auditStatus) return false
      return true
    })
  }, [query])

  const metrics = useMemo(() => {
    return {
      total: doctorApplications.length,
      pending: doctorApplications.filter((item) => item.auditStatus === '待审核').length,
      approved: doctorApplications.filter((item) => item.auditStatus === '审核通过').length,
    }
  }, [])

  const columns = [
    { title: '申请时间', dataIndex: 'applyTime', width: 150 },
    { title: '医生姓名', dataIndex: 'doctorName', width: 110 },
    { title: '手机号', dataIndex: 'phone', width: 130 },
    { title: '诊所名称', dataIndex: 'clinicName', width: 160 },
    { title: '所在区域', dataIndex: 'region', width: 140 },
    { title: '所属科室', dataIndex: 'department', width: 100 },
    {
      title: '审核状态',
      dataIndex: 'auditStatus',
      width: 100,
      render: (value) => <Tag color={statusColors[value]}>{value}</Tag>,
    },
    { title: '启用状态', dataIndex: 'enabledStatus', width: 100 },
    { title: '备注', dataIndex: 'note', width: 180 },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 220,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => {
              setSelected(record)
              setDrawerOpen(true)
            }}
          >
            查看
          </Button>
          <Button
            type="link"
            size="small"
            icon={<CheckCircleOutlined />}
            onClick={() => message.success(`已通过 ${record.doctorName}，系统将自动短信通知医生`)}
          >
            通过
          </Button>
          <Button
            type="link"
            size="small"
            danger
            icon={<CloseCircleOutlined />}
            onClick={() => message.warning(`已驳回 ${record.doctorName}，请补充资质后重新提交`)}
          >
            驳回
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 16, gap: 16, overflow: 'hidden' }}>
      <div style={{ fontSize: 16, fontWeight: 500, color: '#333' }}>医生审核列表</div>

      <Row gutter={16}>
        <Col span={8}>
          <Card><Statistic title="申请总数" value={metrics.total} suffix="条" /></Card>
        </Col>
        <Col span={8}>
          <Card><Statistic title="待审核" value={metrics.pending} suffix="条" valueStyle={{ color: '#FF6B00' }} /></Card>
        </Col>
        <Col span={8}>
          <Card><Statistic title="已通过" value={metrics.approved} suffix="条" valueStyle={{ color: '#52c41a' }} /></Card>
        </Col>
      </Row>

      <Card bodyStyle={{ paddingBottom: 8 }}>
        <Form layout="inline">
          <Form.Item label="审核状态">
            <Select
              placeholder="请选择"
              allowClear
              style={{ width: 140 }}
              onChange={(value) => setQuery({ ...query, auditStatus: value })}
            >
              <Select.Option value="待审核">待审核</Select.Option>
              <Select.Option value="审核通过">审核通过</Select.Option>
              <Select.Option value="审核驳回">审核驳回</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="医生搜索">
            <Input
              placeholder="医生姓名/手机号"
              allowClear
              style={{ width: 220 }}
              onChange={(event) => setQuery({ ...query, keyword: event.target.value })}
            />
          </Form.Item>
          <Form.Item>
            <Button onClick={() => setQuery({ keyword: '', auditStatus: undefined })}>重置</Button>
          </Form.Item>
        </Form>
      </Card>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={filteredData}
        pagination={{ pageSize: 10, showSizeChanger: false }}
        scroll={{ x: 1500, y: 'calc(100vh - 360px)' }}
        style={{ flex: 1 }}
      />

      <Drawer
        title="申请资料详情"
        width={520}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        {selected && (
          <Descriptions column={1} size="small" bordered>
            <Descriptions.Item label="申请时间">{selected.applyTime}</Descriptions.Item>
            <Descriptions.Item label="医生姓名">{selected.doctorName}</Descriptions.Item>
            <Descriptions.Item label="手机号">{selected.phone}</Descriptions.Item>
            <Descriptions.Item label="诊所名称">{selected.clinicName}</Descriptions.Item>
            <Descriptions.Item label="所在区域">{selected.region}</Descriptions.Item>
            <Descriptions.Item label="所属科室">{selected.department}</Descriptions.Item>
            <Descriptions.Item label="资质状态">{selected.credentialStatus}</Descriptions.Item>
            <Descriptions.Item label="备注">{selected.note}</Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>
    </div>
  )
}
