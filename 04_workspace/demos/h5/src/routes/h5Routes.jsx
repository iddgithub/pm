import DoctorWorkbench from '../features/doctor/pages/DoctorWorkbench'
import DoctorReportingPrototype from '../features/doctor-reporting/pages/DoctorReportingPrototype'
import DoctorOrderingReplica from '../features/doctor-ordering/pages/DoctorOrderingReplica'
import PatientSharedOrderEntry from '../features/doctor-ordering/pages/PatientSharedOrderEntry'
import OperatorWorkbench from '../features/operator/pages/OperatorWorkbench'
import QingtengDoctorPromoVideo from '../features/qingteng-doctor-promo/pages/QingtengDoctorPromoVideo'

export const h5Routes = [
  { path: '/qingteng-doctor-promo-video', label: '青藤医生推广视频', component: QingtengDoctorPromoVideo },
  { path: '/doctor-reporting', label: '医生端报告确认 H5', component: DoctorReportingPrototype },
  { path: '/doctor', label: '医生端 H5', component: DoctorWorkbench },
  { path: '/doctor-ordering', label: '医生开单 H5', component: DoctorOrderingReplica },
  { path: '/doctor-ordering/share/:shareToken', label: '患者开单分享页', component: PatientSharedOrderEntry },
  { path: '/operator', label: '运营端 H5', component: OperatorWorkbench },
]
