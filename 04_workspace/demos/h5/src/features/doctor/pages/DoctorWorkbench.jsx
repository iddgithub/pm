import { useState } from 'react'
import {
  EmptyState,
  FilterChip,
  CheckExamPage,
  H5PrototypeShowcase,
  ListCard,
  PrototypePhone,
} from '../../../shared/components/H5PrototypeShowcase'
import {
  doctorCommissionRows,
  doctorMonths,
  doctorOrderRows,
  doctorOverview,
  doctorPatientRows,
} from '../mock/incentive'

const orderStatuses = ['全部状态', '已支付', '已取消', '已检查', '已出报告']

function includesKeyword(keyword, values) {
  if (!keyword.trim()) return true
  return values.some((value) => String(value).includes(keyword.trim()))
}

function orderStatusTone(status) {
  if (status === '已出报告') return 'success'
  if (status === '已取消') return 'danger'
  if (status === '已检查') return 'info'
  return 'default'
}

export default function DoctorWorkbench() {
  const [primaryTab, setPrimaryTab] = useState('我的管理')
  const [manageMonth, setManageMonth] = useState('全部月份')
  const [manageKeyword, setManageKeyword] = useState('')
  const [manageStatus, setManageStatus] = useState('全部状态')
  const [commissionMonth, setCommissionMonth] = useState('4月')
  const [commissionKeyword, setCommissionKeyword] = useState('')
  const [patientKeyword, setPatientKeyword] = useState('')

  const filteredOrders = doctorOrderRows.filter((item) => {
    if (manageMonth !== '全部月份' && item.month !== manageMonth) return false
    if (manageStatus !== '全部状态' && item.status !== manageStatus) return false
    return includesKeyword(manageKeyword, [item.patientName, item.phone])
  })

  const filteredCommissionRows = doctorCommissionRows.filter((item) => {
    if (commissionMonth !== '全部月份' && item.month !== commissionMonth) return false
    return includesKeyword(commissionKeyword, [item.patientName, item.phone, item.projectName])
  })

  const filteredPatients = doctorPatientRows.filter((item) =>
    includesKeyword(patientKeyword, [item.patientName, item.phone]),
  )

  return (
    <H5PrototypeShowcase
      roleTitle="医生端"
      roleSummary="围绕签约申请、业务开单、报告解读费与患者维护，把一级页面统一整理成和磨刀原型更一致的浏览器展示稿。"
      flowSteps={['申请签约', '平台审核并绑定运营', '患者完成检查并出报告', '医生查看收益与患者维护']}
    >
      <PrototypePhone
        label={primaryTab}
        tabs={['检查检验', '我的管理']}
        activeTab={primaryTab}
        onTabChange={setPrimaryTab}
      >
        {primaryTab === '检查检验' ? (
          <CheckExamPage ownerName={doctorOverview.doctorName} />
        ) : (
          <>
            <div className="proto-profile-card">
              <div className="proto-avatar" aria-hidden="true" />
              <div className="proto-profile-copy">
                <div className="proto-profile-name">{doctorOverview.doctorName}</div>
                <div className="proto-tag-row">
                  <span className="proto-tag">{doctorOverview.clinicName}</span>
                  <span className="proto-tag">{doctorOverview.department}</span>
                  <span className="proto-tag proto-tag--accent">{doctorOverview.signStatus}</span>
                </div>
                <div className="proto-note">{doctorOverview.signNote}</div>
                <div className="proto-inline-actions">
                  <button type="button" className="proto-link-button">签约申请</button>
                  <button type="button" className="proto-link-button">提现记录</button>
                </div>
              </div>
            </div>

            <div className="proto-stat-card">
              <div className="proto-stat-item">
                <div className="proto-stat-value">{doctorOverview.reportFee}元</div>
                <div className="proto-stat-caption">报告解读费 &gt;</div>
              </div>
              <div className="proto-stat-item">
                <div className="proto-stat-value">{doctorOverview.patientCount}人</div>
                <div className="proto-stat-caption">我的患者 &gt;</div>
              </div>
            </div>

            <div className="proto-toolbar">
              <select
                className="proto-select"
                value={manageMonth}
                onChange={(event) => setManageMonth(event.target.value)}
              >
                {doctorMonths.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>

              <input
                className="proto-input"
                value={manageKeyword}
                placeholder="请输入姓名/手机号"
                onChange={(event) => setManageKeyword(event.target.value)}
              />

              <button type="button" className="proto-search-button">
                查询
              </button>
            </div>

            <div className="proto-chip-row">
              {orderStatuses.map((status) => (
                <FilterChip
                  key={status}
                  active={status === manageStatus}
                  onClick={() => setManageStatus(status)}
                >
                  {status}
                </FilterChip>
              ))}
            </div>

            <div className="proto-stack-list">
              {filteredOrders.length ? (
                filteredOrders.map((item) => (
                  <ListCard
                    key={item.id}
                    eyebrow={`${item.month} · 检查检验订单`}
                    title={item.patientName}
                    status={item.status}
                    statusTone={orderStatusTone(item.status)}
                    amount={`￥${item.amount}.00`}
                    amountLabel="订单金额"
                    meta={[
                      { label: '手机号', value: item.phone },
                      { label: '项目数', value: `${item.itemCount} 项` },
                    ]}
                    metrics={[
                      { label: '结算口径', value: item.status === '已出报告' ? '可确认' : '待流转' },
                      { label: '操作', value: '查看详情' },
                    ]}
                    actions={[{ label: '详情', variant: 'primary' }]}
                  />
                ))
              ) : (
                <EmptyState>暂无符合条件的订单</EmptyState>
              )}
            </div>
          </>
        )}
      </PrototypePhone>

      <PrototypePhone label="医生报告解读费">
        <div className="proto-section-head">
          <div className="proto-section-title">报告解读费： ￥{doctorOverview.reportFee}.00</div>
          <button type="button" className="proto-primary-button">提现</button>
        </div>

        <div className="proto-toolbar">
          <select
            className="proto-select"
            value={commissionMonth}
            onChange={(event) => setCommissionMonth(event.target.value)}
          >
            {doctorMonths.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>

          <input
            className="proto-input"
            value={commissionKeyword}
            placeholder="请输入姓名/手机号"
            onChange={(event) => setCommissionKeyword(event.target.value)}
          />

          <button type="button" className="proto-search-button">
            查询
          </button>
        </div>

        <div className="proto-stack-list">
          {filteredCommissionRows.length ? (
            filteredCommissionRows.map((item) => (
              <ListCard
                key={item.id}
                eyebrow={`订单号 ${item.orderNo}`}
                title={item.projectName}
                status="已确认"
                statusTone="success"
                amount={`+ ￥${item.bonus}`}
                amountLabel="解读费"
                meta={[
                  { label: '患者', value: item.patientName },
                  { label: '手机号', value: item.phone },
                  { label: '项目金额', value: `￥${item.projectAmount}.00` },
                  { label: '结算时间', value: item.settledAt },
                ]}
                actions={[
                  { label: '订单详情' },
                  { label: '患者详情', variant: 'primary' },
                ]}
              />
            ))
          ) : (
            <EmptyState>暂无符合条件的解读费记录</EmptyState>
          )}
        </div>
      </PrototypePhone>

      <PrototypePhone label="我的患者">
        <div className="proto-section-title">我的患者： {doctorOverview.patientCount}名</div>

        <div className="proto-toolbar proto-toolbar--single">
          <input
            className="proto-input"
            value={patientKeyword}
            placeholder="请输入姓名/手机号"
            onChange={(event) => setPatientKeyword(event.target.value)}
          />

          <button type="button" className="proto-search-button">
            查询
          </button>
        </div>

        <div className="proto-stack-list">
          {filteredPatients.length ? (
            filteredPatients.map((item) => (
              <ListCard
                key={item.id}
                eyebrow={`出报告时间 ${item.reportTime}`}
                title={item.patientName}
                status={item.followStatus}
                statusTone={item.followStatus === '已随访' ? 'success' : 'info'}
                meta={[
                  { label: '手机号', value: item.phone },
                  { label: '检查项目', value: item.projectName },
                ]}
                actions={[
                  { label: '添加随访', variant: item.followStatus === '待随访' ? 'primary' : undefined },
                  { label: '复查提醒' },
                ]}
              >
                <div className="proto-card-note">{item.history}</div>
              </ListCard>
            ))
          ) : (
            <EmptyState>暂无符合条件的患者</EmptyState>
          )}
        </div>
      </PrototypePhone>
    </H5PrototypeShowcase>
  )
}
