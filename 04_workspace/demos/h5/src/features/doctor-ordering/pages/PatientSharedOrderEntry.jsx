import { useParams } from 'react-router-dom'
import DoctorOrderingReplica from './DoctorOrderingReplica'

export default function PatientSharedOrderEntry() {
  const { shareToken = 'demo-order-20251215' } = useParams()

  return <DoctorOrderingReplica entryMode="patient" shareToken={shareToken} />
}
