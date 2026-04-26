import { useMemo, useState } from 'react'
import { Button, Card, Empty, List, Space, Tag } from 'antd'
import MobileFrame from '../../../shared/components/MobileFrame'
import { patientTabs } from '../config/tabs'
import {
  AI_REPORT_STORAGE_KEY,
  buildPatientReportsFromOrders,
  getPatientSummary,
  patientReportList,
  patientSummary as patientSummaryFallback,
} from '../mock/reports'

function SectionTitle({ title, extra }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{title}</div>
      {extra}
    </div>
  )
}

const reportColorMap = {
  AI报告可见: 'green',
  待发布: 'orange',
  待上传: 'default',
}

export default function PatientReportCenter() {
  const [page, setPage] = useState('reports')
  const [selectedReport, setSelectedReport] = useState(null)
  const reports = useMemo(() => {
    if (typeof window === 'undefined') return patientReportList
    const saved = window.localStorage.getItem(AI_REPORT_STORAGE_KEY)
    if (!saved) return patientReportList
    try {
      return buildPatientReportsFromOrders(JSON.parse(saved))
    } catch {
      return patientReportList
    }
  }, [])
  const patientSummary = useMemo(() => (reports === patientReportList ? patientSummaryFallback : getPatientSummary(reports)), [reports])

  const title = useMemo(() => {
    if (selectedReport) return '报告详情'
    if (page === 'service') return 'AI服务'
    if (page === 'profile') return '我的'
    return '我的报告'
  }, [page, selectedReport])

  const visibleReports = reports.filter((item) => item.reportStatus === 'AI报告可见')

  const renderReports = selectedReport ? (
    <>
      <Card size="small">
        <SectionTitle title={selectedReport.projectName} extra={<Tag color={reportColorMap[selectedReport.reportStatus]}>{selectedReport.reportStatus}</Tag>} />
        <div className="list-note" style={{ marginTop: 8 }}>{selectedReport.clinicName}</div>
        <div className="list-note" style={{ marginTop: 4 }}>{selectedReport.orderNo} · 影像号 {selectedReport.imageNo}</div>
        <div className="list-note" style={{ marginTop: 4 }}>检查时间：{selectedReport.examTime}</div>
      </Card>

      <Card size="small">
        <SectionTitle title="AI报告版本" extra={<Tag color="blue">V{selectedReport.visibleVersion || 0}</Tag>} />
        <div style={{ marginTop: 10, fontWeight: 600 }}>{selectedReport.aiFileName || '暂无可见 AI 报告文件'}</div>
        <div className="list-note" style={{ marginTop: 6 }}>发布时间：{selectedReport.publishedAt}</div>
        <div className="list-note" style={{ marginTop: 6 }}>{selectedReport.updateNote}</div>
      </Card>

      <Card size="small">
        <SectionTitle title="普通报告承接" />
        <div className="list-note" style={{ marginTop: 8 }}>普通报告与 AI 报告统一归属到“我的报告”链路，患者查看时始终展示当前最新 AI 版本。</div>
        <Space style={{ marginTop: 12 }}>
          <Button type="primary">查看 AI 报告</Button>
          <Button onClick={() => setSelectedReport(null)}>返回列表</Button>
        </Space>
      </Card>
    </>
  ) : (
    <>
      <div className="summary-grid">
        <div className="mini-stat">
          <div className="label">AI报告可见</div>
          <div className="value">{patientSummary.visibleReports}</div>
        </div>
        <div className="mini-stat">
          <div className="label">待发布</div>
          <div className="value">{patientSummary.waitingReports}</div>
        </div>
      </div>

      <Card size="small">
        <SectionTitle title="最新同步" extra={<Tag color="blue">{patientSummary.latestUpdatedAt}</Tag>} />
        <div className="list-note" style={{ marginTop: 8 }}>首次发布后患者可立即查看；如果后台做了替换，患者默认只看到最新版本，不再次收到提醒。</div>
      </Card>

      <List
        dataSource={reports}
        renderItem={(item) => (
          <List.Item style={{ padding: 0, border: 'none', marginBottom: 12 }}>
            <Card size="small" style={{ width: '100%' }}>
              <SectionTitle title={item.projectName} extra={<Tag color={reportColorMap[item.reportStatus]}>{item.reportStatus}</Tag>} />
              <div className="list-note" style={{ marginTop: 8 }}>{item.clinicName}</div>
              <div className="list-note" style={{ marginTop: 4 }}>{item.orderNo} · 影像号 {item.imageNo}</div>
              <div className="list-note" style={{ marginTop: 4 }}>检查时间：{item.examTime}</div>
              <div className="list-note" style={{ marginTop: 8 }}>AI服务：{item.aiProductName}</div>
              <div className="list-note" style={{ marginTop: 4 }}>{item.updateNote}</div>
              <Space style={{ marginTop: 12 }}>
                <Button type="primary" size="small" disabled={item.reportStatus !== 'AI报告可见'} onClick={() => setSelectedReport(item)}>
                  查看详情
                </Button>
                {item.reportStatus === 'AI报告可见' && <Tag color="blue">当前展示 V{item.visibleVersion}</Tag>}
              </Space>
            </Card>
          </List.Item>
        )}
      />
    </>
  )

  const renderService = (
    <Card size="small">
      <SectionTitle title="AI服务说明" />
      <div className="list-note" style={{ marginTop: 8 }}>AI服务由医生在开单时推荐，患者支付后进入检查链路。AI 报告发布前不会在患者侧展示。</div>
      <List
        dataSource={visibleReports}
        style={{ marginTop: 12 }}
        locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无可见 AI 服务" /> }}
        renderItem={(item) => (
          <List.Item style={{ padding: '12px 0' }}>
            <div style={{ width: '100%' }}>
              <div style={{ fontWeight: 600 }}>{item.aiProductName}</div>
              <div className="list-note" style={{ marginTop: 4 }}>{item.projectName} · 当前版本 V{item.visibleVersion}</div>
            </div>
          </List.Item>
        )}
      />
    </Card>
  )

  const renderProfile = (
    <Card size="small">
      <SectionTitle title="患者侧规则" />
      <List
        dataSource={[
          '普通报告和 AI 报告统一进入“我的报告”查看。',
          '运营发布后患者立即可见，并收到首次提醒。',
          '后台替换后患者默认查看最新版本，不额外发送提醒。',
        ]}
        renderItem={(item) => <List.Item style={{ padding: '10px 0' }}>{item}</List.Item>}
      />
    </Card>
  )

  return (
    <MobileFrame
      title={title}
      pageKey={page}
      tabs={patientTabs}
      canBack={Boolean(selectedReport)}
      onBack={() => setSelectedReport(null)}
      onTabChange={(nextPage) => {
        setSelectedReport(null)
        setPage(nextPage)
      }}
    >
      {page === 'reports' && renderReports}
      {page === 'service' && renderService}
      {page === 'profile' && renderProfile}
    </MobileFrame>
  )
}
