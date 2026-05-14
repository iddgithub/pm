import HomeDashboard from '../features/home/pages/HomeDashboard'
import SalesOrderList from '../features/commerce/pages/Sales/OrderList'
import SalesReturnList from '../features/commerce/pages/Sales/ReturnList'
import DoctorReview from '../features/incentive-admin/pages/Incentive/DoctorReview'
import Binding from '../features/incentive-admin/pages/Incentive/Binding'
import Commission from '../features/incentive-admin/pages/Incentive/Commission'
import Withdrawal from '../features/incentive-admin/pages/Incentive/Withdrawal'
import Dashboard from '../features/platform-ops/pages/Platform/Dashboard'
import Analysis from '../features/platform-ops/pages/Platform/Analysis'
import DoctorAnalysis from '../features/platform-ops/pages/Platform/DoctorAnalysis'
import AiReportUpload from '../features/platform-ops/pages/Platform/AiReportUpload'
import ActivityManagement from '../features/platform-ops/pages/Platform/ActivityManagement'

export const menuItems = [
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
    key: 'incentive-admin',
    label: '签约与结算',
    children: [
      { key: '/incentive/review', label: '医生审核' },
      { key: '/incentive/binding', label: '绑定管理' },
      { key: '/incentive/commission', label: '分佣配置' },
      { key: '/incentive/withdrawal', label: '提现审核' },
    ],
  },
  {
    key: 'platform-ops',
    label: '经营分析',
    children: [
      { key: '/platform/dashboard', label: '业务总览' },
      { key: '/platform/analysis', label: '业绩分析' },
      { key: '/platform/doctor-analysis', label: '医生业绩分析' },
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

export const routeConfig = {
  '/home': { label: '首页', component: HomeDashboard },
  '/sales/order': { label: '订单列表', component: SalesOrderList },
  '/sales/return': { label: '退货单列表', component: SalesReturnList },
  '/incentive/review': { label: '医生审核', component: DoctorReview },
  '/incentive/binding': { label: '绑定管理', component: Binding },
  '/incentive/commission': { label: '分佣配置', component: Commission },
  '/incentive/withdrawal': { label: '提现审核', component: Withdrawal },
  '/platform/dashboard': { label: '业务总览', component: Dashboard },
  '/platform/analysis': { label: '业绩分析', component: Analysis },
  '/platform/doctor-analysis': { label: '医生业绩分析', component: DoctorAnalysis },
  '/platform/ai-report-upload': { label: 'AI报告上传', component: AiReportUpload },
  '/platform/activity-management': { label: '活动管理', component: ActivityManagement },
  '/platform/activity-management/create': { label: '新建活动', component: ActivityManagement },
  '/platform/activity-management/edit/:id': { label: '编辑活动', component: ActivityManagement },
  '/platform/activity-management/:id': { label: '活动详情', component: ActivityManagement },
}
