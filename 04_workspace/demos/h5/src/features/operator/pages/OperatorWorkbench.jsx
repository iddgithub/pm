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
  operatorCommissionRows,
  operatorDoctorRows,
  operatorMonths,
  operatorOrderRows,
  operatorOverview,
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

export default function OperatorWorkbench() {
  const [primaryTab, setPrimaryTab] = useState('我的管理')
  const [manageMonth, setManageMonth] = useState('全部月份')
  const [manageKeyword, setManageKeyword] = useState('')
  const [manageStatus, setManageStatus] = useState('全部状态')
  const [commissionMonth, setCommissionMonth] = useState('4月')
  const [commissionKeyword, setCommissionKeyword] = useState('')
  const [doctorKeyword, setDoctorKeyword] = useState('')

  const filteredOrders = operatorOrderRows.filter((item) => {
    if (manageMonth !== '全部月份' && item.month !== manageMonth) return false
    if (manageStatus !== '全部状态' && item.status !== manageStatus) return false
    return includesKeyword(manageKeyword, [item.doctorName, item.patientName, item.phone])
  })

  const filteredCommissionRows = operatorCommissionRows.filter((item) => {
    if (commissionMonth !== '全部月份' && item.month !== commissionMonth) return false
    return includesKeyword(commissionKeyword, [item.doctorName, item.phone])
  })

  const filteredDoctors = operatorDoctorRows.filter((item) =>
    includesKeyword(doctorKeyword, [item.doctorName, item.phone, item.clinicName]),
  )

  return (
    <H5PrototypeShowcase
      roleTitle="运营端"
      roleSummary="围绕医生绑定、业务完成跟踪和运营提成查看，把运营端一级页面统一成与医生端对称的浏览器展示稿。"
      flowSteps={['平台绑定医生', '配置分佣比例', '跟进开单与出报告', '运营查看医生与收益表现']}
    >
      <PrototypePhone
        label={primaryTab}
        tabs={['检查检验', '我的管理']}
        activeTab={primaryTab}
        onTabChange={setPrimaryTab}
      >
        {primaryTab === '检查检验' ? (
          <CheckExamPage ownerName={operatorOverview.operatorName} />
        ) : (
          <>
            <div className="proto-profile-card">
              <div className="proto-avatar" aria-hidden="true" />
              <div className="proto-profile-copy">
                <div className="proto-profile-name">{operatorOverview.operatorName}</div>
                <div className="proto-tag-row">
                  <span className="proto-tag">{operatorOverview.level}</span>
                  <span className="proto-tag">已绑定医生 {operatorOverview.doctorCount} 名</span>
                </div>
                <div className="proto-note">{operatorOverview.bindNote}</div>
                <div className="proto-inline-actions">
                  <button type="button" className="proto-link-button">查看我的医生</button>
                  <button type="button" className="proto-link-button">查看我的提成</button>
                </div>
              </div>
            </div>

            <div className="proto-stat-card">
              <div className="proto-stat-item">
                <div className="proto-stat-value">{operatorOverview.commissionAmount}元</div>
                <div className="proto-stat-caption">我的提成 &gt;</div>
              </div>
              <div className="proto-stat-item">
                <div className="proto-stat-value">{operatorOverview.doctorCount}人</div>
                <div className="proto-stat-caption">我的医生 &gt;</div>
              </div>
            </div>

            <div className="proto-toolbar">
              <select
                className="proto-select"
                value={manageMonth}
                onChange={(event) => setManageMonth(event.target.value)}
              >
                {operatorMonths.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>

              <input
                className="proto-input"
                value={manageKeyword}
                placeholder="请输入医生/患者/手机号"
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
                    eyebrow={`${item.month} · ${item.doctorName}`}
                    title={item.patientName}
                    status={item.status}
                    statusTone={orderStatusTone(item.status)}
                    amount={`￥${item.amount}.00`}
                    amountLabel="订单金额"
                    meta={[
                      { label: '手机号', value: item.phone },
                      { label: '项目数', value: `${item.itemCount} 项` },
                      { label: '订单时间', value: item.time },
                    ]}
                    metrics={[
                      { label: '负责医生', value: item.doctorName },
                      { label: '运营跟进', value: item.status === '已出报告' ? '可结算' : '待跟进' },
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

      <PrototypePhone label="我的提成">
        <div className="proto-section-head">
          <div className="proto-section-title">我的提成： ￥{operatorOverview.commissionAmount}.00</div>
          <button type="button" className="proto-primary-button">提现</button>
        </div>

        <div className="proto-toolbar">
          <select
            className="proto-select"
            value={commissionMonth}
            onChange={(event) => setCommissionMonth(event.target.value)}
          >
            {operatorMonths.map((month) => (
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
                eyebrow={`${item.month} · 分佣明细`}
                title={item.doctorName}
                status={`比例 ${item.ratio}`}
                statusTone="info"
                amount={`￥${item.operatorBonus}.00`}
                amountLabel="运营提成"
                metrics={[
                  { label: '完成订单', value: `${item.finishedOrders} 单` },
                  { label: '医生提成', value: `￥${item.doctorBonus}.00` },
                ]}
                actions={[
                  { label: '明细', variant: 'primary' },
                  { label: '查看医生' },
                ]}
              />
            ))
          ) : (
            <EmptyState>暂无符合条件的提成记录</EmptyState>
          )}
        </div>
      </PrototypePhone>

      <PrototypePhone label="我的医生">
        <div className="proto-section-title">我的医生： {operatorOverview.doctorCount}名</div>

        <div className="proto-toolbar proto-toolbar--single">
          <input
            className="proto-input"
            value={doctorKeyword}
            placeholder="请输入姓名/手机号"
            onChange={(event) => setDoctorKeyword(event.target.value)}
          />

          <button type="button" className="proto-search-button">
            查询
          </button>
        </div>

        <div className="proto-stack-list">
          {filteredDoctors.length ? (
            filteredDoctors.map((item) => (
              <ListCard
                key={item.id}
                eyebrow={`${item.region} · ${item.department}`}
                title={item.doctorName}
                status={item.status}
                statusTone={item.status === '启用' ? 'success' : 'danger'}
                meta={[
                  { label: '手机号', value: item.phone },
                  { label: '诊所', value: item.clinicName },
                ]}
                metrics={[
                  { label: '提成比例', value: item.ratio },
                  { label: '绑定状态', value: item.status === '启用' ? '可开单' : '已暂停' },
                ]}
                actions={[{ label: '详情', variant: 'primary' }]}
              />
            ))
          ) : (
            <EmptyState>暂无符合条件的医生</EmptyState>
          )}
        </div>
      </PrototypePhone>
    </H5PrototypeShowcase>
  )
}
