import { Navigate, Route, Routes } from 'react-router-dom'
import H5RoleSelectPage from './H5RoleSelectPage'
import { h5Routes } from '../routes/h5Routes'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<H5RoleSelectPage />} />
      {h5Routes.map((route) => {
        const Component = route.component
        return <Route key={route.path} path={route.path} element={<Component />} />
      })}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
