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
import MonthlyReview from '../features/platform-ops/pages/Platform/MonthlyReview'
import AiReportUpload from '../features/platform-ops/pages/Platform/AiReportUpload'

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
    label: '激励管理',
    children: [
      {
        key: 'incentive',
        label: '签约与结算',
        children: [
          { key: '/incentive/review', label: '医生审核' },
          { key: '/incentive/binding', label: '绑定管理' },
          { key: '/incentive/commission', label: '分佣配置' },
          { key: '/incentive/withdrawal', label: '提现审核' },
        ],
      },
    ],
  },
  {
    key: 'platform-ops',
    label: '平台运营',
    children: [
      {
        key: 'platform',
        label: '经营分析',
        children: [
          { key: '/platform/dashboard', label: '业务总览' },
          { key: '/platform/analysis', label: '业绩分析' },
          { key: '/platform/doctor-analysis', label: '医生业绩分析' },
          { key: '/platform/monthly-review', label: '月度复盘' },
          { key: '/platform/ai-report-upload', label: 'AI报告上传' },
        ],
      },
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
  '/platform/monthly-review': { label: '月度复盘', component: MonthlyReview },
  '/platform/ai-report-upload': { label: 'AI报告上传', component: AiReportUpload },
}
