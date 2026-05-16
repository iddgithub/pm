import HomeDashboard from '../features/home/pages/HomeDashboard'
import SalesOrderList from '../features/commerce/pages/Sales/OrderList'
import SalesReturnList from '../features/commerce/pages/Sales/ReturnList'
import DoctorReview from '../features/incentive-admin/pages/Incentive/DoctorReview'
import DoctorManagement from '../features/incentive-admin/pages/Incentive/DoctorManagement'
import Binding from '../features/incentive-admin/pages/Incentive/Binding'
import BonusManagement from '../features/incentive-admin/pages/Incentive/BonusManagement'
import OperatorManagement from '../features/incentive-admin/pages/Incentive/OperatorManagement'
import Withdrawal from '../features/incentive-admin/pages/Incentive/Withdrawal'
import Dashboard from '../features/platform-ops/pages/Platform/Dashboard'
import Analysis from '../features/platform-ops/pages/Platform/Analysis'
import DoctorAnalysis from '../features/platform-ops/pages/Platform/DoctorAnalysis'
import AiReportUpload from '../features/platform-ops/pages/Platform/AiReportUpload'
import ActivityManagement from '../features/platform-ops/pages/Platform/ActivityManagement'
import {
  DoctorAuditV1Page,
  DoctorManagementV1Page,
  ManagementDashboardV1Page,
  OperatorBindingV1Page,
  WithdrawalReviewV1Page,
} from '../features/compliance-v1/pages/ComplianceV1'

export const ACTIVITY_MANAGEMENT_BASE_PATH = '/platform/activity-management'
export const ACTIVITY_MANAGEMENT_SHARE_BASE_PATH = '/share/activity-management'

export const menuItems = [
  {
    key: 'compliance-order',
    label: '合规开单',
    children: [
      { key: '/incentive/review', label: '医生审核' },
      { key: '/incentive/operator-management', label: '运营管理' },
      { key: '/incentive/doctor-management', label: '医生管理' },
      { key: '/incentive/binding', label: '绑定分佣' },
      { key: '/incentive/bonus-management', label: '提成管理' },
      { key: '/incentive/withdrawal', label: '提现审核' },
      { key: '/platform/dashboard', label: '业务总览' },
      { key: '/platform/analysis', label: '运营业绩分析' },
      { key: '/platform/doctor-analysis', label: '医生业绩分析' },
    ],
  },
  {
    key: 'compliance-v1',
    label: '合规开单1.0',
    children: [
      { key: '/compliance-v1/doctor-audit', label: '医生审核' },
      { key: '/compliance-v1/doctor-management', label: '医生管理' },
      { key: '/compliance-v1/operator-binding', label: '运营医生绑定' },
      { key: '/compliance-v1/withdrawal-review', label: '提现审核' },
      { key: '/compliance-v1/management-dashboard', label: '管理层数据看板' },
    ],
  },
  {
    key: 'commerce',
    label: '经营业务',
    children: [
      {
        key: 'sales',
        label: '销售中心',
        children: [
          { key: '/sales/order', label: '订单列表' },
          { key: '/sales/return', label: '退货单列表' },
        ],
      },
    ],
  },
  {
    key: 'product-features',
    label: '产品功能',
    children: [
      { key: '/platform/ai-report-upload', label: 'AI报告上传' },
      { key: '/platform/activity-management', label: '活动管理' },
    ],
  },
]

export const appRouteConfig = {
  '/home': { label: '首页', component: HomeDashboard },
  '/sales/order': { label: '订单列表', component: SalesOrderList },
  '/sales/return': { label: '退货单列表', component: SalesReturnList },
  '/incentive/review': { label: '医生审核', component: DoctorReview },
  '/incentive/operator-management': { label: '运营管理', component: OperatorManagement },
  '/incentive/doctor-management': { label: '医生管理', component: DoctorManagement },
  '/incentive/binding': { label: '绑定分佣', component: Binding },
  '/incentive/bonus-management': { label: '提成管理', component: BonusManagement },
  '/incentive/withdrawal': { label: '提现审核', component: Withdrawal },
  '/platform/dashboard': { label: '业务总览', component: Dashboard },
  '/platform/analysis': { label: '运营业绩分析', component: Analysis },
  '/platform/doctor-analysis': { label: '医生业绩分析', component: DoctorAnalysis },
  '/platform/ai-report-upload': { label: 'AI报告上传', component: AiReportUpload },
  '/compliance-v1/doctor-audit': { label: '医生审核', component: DoctorAuditV1Page },
  '/compliance-v1/doctor-management': { label: '医生管理', component: DoctorManagementV1Page },
  '/compliance-v1/operator-binding': { label: '运营医生绑定', component: OperatorBindingV1Page },
  '/compliance-v1/withdrawal-review': { label: '提现审核', component: WithdrawalReviewV1Page },
  '/compliance-v1/management-dashboard': { label: '管理层数据看板', component: ManagementDashboardV1Page },
  [ACTIVITY_MANAGEMENT_BASE_PATH]: { label: '活动管理', component: ActivityManagement },
  [`${ACTIVITY_MANAGEMENT_BASE_PATH}/create`]: { label: '新建活动', component: ActivityManagement },
  [`${ACTIVITY_MANAGEMENT_BASE_PATH}/edit/:id`]: { label: '编辑活动', component: ActivityManagement },
  [`${ACTIVITY_MANAGEMENT_BASE_PATH}/:id`]: { label: '活动详情', component: ActivityManagement },
}

export const shareRouteConfig = {
  [ACTIVITY_MANAGEMENT_SHARE_BASE_PATH]: { label: '活动管理分享', component: ActivityManagement },
  [`${ACTIVITY_MANAGEMENT_SHARE_BASE_PATH}/create`]: { label: '活动管理分享新建', component: ActivityManagement },
  [`${ACTIVITY_MANAGEMENT_SHARE_BASE_PATH}/edit/:id`]: { label: '活动管理分享编辑', component: ActivityManagement },
  [`${ACTIVITY_MANAGEMENT_SHARE_BASE_PATH}/:id`]: { label: '活动管理分享详情', component: ActivityManagement },
}
