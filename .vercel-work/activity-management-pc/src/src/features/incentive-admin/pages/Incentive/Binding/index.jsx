import { useMemo, useState } from 'react'
import { Button, Card, Col, Form, Input, Modal, Row, Select, Space, Statistic, Table, Tag, message } from 'antd'
import { doctorBindings } from '../../../../../shared/mocks/incentive'

export default function Binding() {
  const [bindings, setBindings] = useState(doctorBindings)
  const [query, setQuery] = useState({ operatorName: undefined, keyword: '' })
  const [rebindRecord, setRebindRecord] = useState(null)
  const [selectedOperatorName, setSelectedOperatorName] = useState()

  const filteredData = useMemo(() => {
    return bindings.filter((item) => {
      if (query.operatorName && item.operatorName !== query.operatorName) return false
      if (query.keyword) {
        const keyword = query.keyword.trim()
        const hit = item.doctorName.includes(keyword) || item.operatorName.includes(keyword)
        if (!hit) return false
      }
      return true
    })
  }, [bindings, query])

  const operatorRows = useMemo(() => {
    const operatorMap = new Map()
    bindings.forEach((item) => {
      const current = operatorMap.get(item.operatorName) || {
        operatorName: item.operatorName,
        operatorRegion: item.operatorRegion,
        operatorDepartment: item.operatorDepartment,
        bindingDoctors: 0,
      }
      operatorMap.set(item.operatorName, {
        ...current,
        bindingDoctors: current.bindingDoctors + 1,
      })
    })

    return Array.from(operatorMap.values()).map((item, index) => ({
      id: item.operatorName,
      operatorName: item.operatorName,
      phone: `1360000100${index + 1}`,
      location: item.operatorRegion,
      department: item.operatorDepartment,
      bindingDoctors: item.bindingDoctors,
      enabledStatus: item.operatorName === '运营C' ? '已停用' : '已启用',
    }))
  }, [bindings])

  const operatorOptions = operatorRows.map((item) => item.operatorName)

  const summary = useMemo(() => ({
    bindingCount: filteredData.filter((item) => item.bindingStatus === '已绑定').length,
    enabledCount: filteredData.filter((item) => item.enabledStatus === '已启用').length,
    disabledCount: filteredData.filter((item) => item.enabledStatus === '已停用').length,
  }), [filteredData])

  const openRebindModal = (record) => {
    setRebindRecord(record)
    setSelectedOperatorName(undefined)
  }

  const closeRebindModal = () => {
    setRebindRecord(null)
    setSelectedOperatorName(undefined)
  }

  const handleConfirmRebind = () => {
    const nextOperator = operatorRows.find((item) => item.operatorName === selectedOperatorName)
    if (!rebindRecord || !nextOperator) {
      message.warning('请先选择新的运营人员')
      return
    }

    setBindings((list) => list.map((item) => (
      item.id === rebindRecord.id
        ? {
            ...item,
            operatorName: nextOperator.operatorName,
            operatorRegion: nextOperator.location,
            operatorDepartment: nextOperator.department,
            effectiveAt: new Date().toISOString().slice(0, 10),
          }
        : item
    )))
    message.success(`已将 ${rebindRecord.doctorName} 改绑至 ${nextOperator.operatorName}`)
    closeRebindModal()
  }

  const columns = [
    { title: '关联运营', dataIndex: 'operatorName', width: 120, fixed: 'left' },
    { title: '医生姓名', dataIndex: 'doctorName', width: 100, fixed: 'left' },
    { title: '手机号', dataIndex: 'phone', width: 130 },
    { title: '医生提成比例', dataIndex: 'doctorRate', width: 110, render: (value) => `${value}%` },
    { title: '运营提成比例', dataIndex: 'operatorRate', width: 110, render: (value) => `${value}%` },
    { title: '绑定生效时间', dataIndex: 'effectiveAt', width: 130 },
    {
      title: '启用状态',
      dataIndex: 'enabledStatus',
      width: 100,
      render: (value) => <Tag color={value === '已启用' ? 'green' : 'default'}>{value}</Tag>,
    },
    {
      title: '绑定状态',
      dataIndex: 'bindingStatus',
      width: 100,
      render: (value) => <Tag color="blue">{value}</Tag>,
    },
    {
      title: '操作',
      key: 'action',
      width: 160,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button type="link" size="small" onClick={() => openRebindModal(record)}>
            改绑
          </Button>
          <Button type="link" size="small" onClick={() => message.success(`已为 ${record.doctorName} 打开比例编辑器`)}>
            调比例
          </Button>
        </Space>
      ),
    },
  ]

  const rebindOperatorColumns = [
    { title: '运营姓名', dataIndex: 'operatorName', width: 110 },
    { title: '手机号', dataIndex: 'phone', width: 140 },
    { title: '所在位置', dataIndex: 'location', width: 160 },
    { title: '负责科室', dataIndex: 'department', width: 110 },
    { title: '已绑定医生数', dataIndex: 'bindingDoctors', width: 120, render: (value) => `${value}人` },
    {
      title: '启用状态',
      dataIndex: 'enabledStatus',
      width: 100,
      render: (value) => <Tag color={value === '已启用' ? 'green' : 'default'}>{value}</Tag>,
    },
  ]

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 16, gap: 16, overflow: 'hidden' }}>
      <div style={{ fontSize: 16, fontWeight: 500, color: '#333' }}>医生与运营绑定管理</div>

      <Row gutter={16}>
        <Col span={8}><Card><Statistic title="已绑定医生" value={summary.bindingCount} suffix="人" /></Card></Col>
        <Col span={8}><Card><Statistic title="启用中的关系" value={summary.enabledCount} suffix="条" valueStyle={{ color: '#52c41a' }} /></Card></Col>
        <Col span={8}><Card><Statistic title="已停用关系" value={summary.disabledCount} suffix="条" /></Card></Col>
      </Row>

      <Card bodyStyle={{ paddingBottom: 8 }}>
        <Form layout="inline">
          <Form.Item label="运营筛选">
            <Select
              placeholder="请选择运营"
              allowClear
              style={{ width: 180 }}
              onChange={(value) => setQuery({ ...query, operatorName: value })}
            >
              {operatorOptions.map((item) => (
                <Select.Option key={item} value={item}>{item}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="医生/运营搜索">
            <Input
              allowClear
              placeholder="医生姓名/运营姓名"
              style={{ width: 220 }}
              onChange={(event) => setQuery({ ...query, keyword: event.target.value })}
            />
          </Form.Item>
          <Form.Item>
            <Button onClick={() => setQuery({ operatorName: undefined, keyword: '' })}>重置</Button>
          </Form.Item>
        </Form>
      </Card>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={filteredData}
        pagination={{ pageSize: 10, showSizeChanger: false }}
        scroll={{ x: 1100, y: 'calc(100vh - 360px)' }}
        style={{ flex: 1 }}
      />

      <Modal
        title="改绑运营人员"
        open={Boolean(rebindRecord)}
        width={860}
        okText="确认改绑"
        cancelText="取消"
        okButtonProps={{ disabled: !selectedOperatorName }}
        onOk={handleConfirmRebind}
        onCancel={closeRebindModal}
        destroyOnClose
      >
        {rebindRecord ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Card size="small" style={{ background: '#fafafa' }}>
              <Space size={32} wrap>
                <span>医生姓名：<strong>{rebindRecord.doctorName}</strong></span>
                <span>手机号：{rebindRecord.phone}</span>
                <span>当前关联运营：<Tag color="blue">{rebindRecord.operatorName}</Tag></span>
              </Space>
            </Card>
            <div style={{ color: '#666' }}>
              请选择新的运营人员。已停用运营不可选择；当前关联运营仅展示，不可重复选择。
            </div>
            <Table
              rowKey="operatorName"
              columns={rebindOperatorColumns}
              dataSource={operatorRows}
              pagination={false}
              size="small"
              rowSelection={{
                type: 'radio',
                selectedRowKeys: selectedOperatorName ? [selectedOperatorName] : [],
                onChange: (keys) => setSelectedOperatorName(keys[0]),
                getCheckboxProps: (record) => ({
                  disabled: record.enabledStatus !== '已启用' || record.operatorName === rebindRecord.operatorName,
                  title: record.operatorName === rebindRecord.operatorName
                    ? '当前已绑定运营'
                    : record.enabledStatus !== '已启用'
                      ? '已停用运营不可选择'
                      : '',
                }),
              }}
              scroll={{ x: 760, y: 280 }}
            />
          </div>
        ) : null}
      </Modal>
    </div>
  )
}
