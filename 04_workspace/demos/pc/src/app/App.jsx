import { Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from '../shared/layouts/MainLayout'
import { routeConfig } from '../routes/pcRoutes'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Navigate to="/home" replace />} />
        {Object.entries(routeConfig).map(([path, config]) => {
          const Component = config.component
          return <Route key={path} path={path} element={<Component />} />
        })}
      </Route>
    </Routes>
  )
}
