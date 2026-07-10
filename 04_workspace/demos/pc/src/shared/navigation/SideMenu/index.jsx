import { useMemo, useState } from 'react'
import { Layout, Menu } from 'antd'
import { UserOutlined, BellOutlined } from '@ant-design/icons'
import { useLocation, useNavigate } from 'react-router-dom'
import { menuItems as rawMenuItems } from '../../../routes/pcRoutes'
import { useTab } from '../../stores/tabStore'

const { Sider } = Layout
const defaultOpenMenuKeys = ['product-features']

function findLabel(key, items) {
  for (const item of items) {
    if (item.key === key) return item.label
    if (item.children) {
      const found = findLabel(key, item.children)
      if (found) return found
    }
  }
  return null
}

function findMenuMatch(pathname, items, parents = []) {
  for (const item of items) {
    if (item.children) {
      const found = findMenuMatch(pathname, item.children, [...parents, item.key])
      if (found) return found
    }

    if (typeof item.key === 'string' && item.key.startsWith('/') && (pathname === item.key || pathname.startsWith(`${item.key}/`))) {
      return {
        selectedKey: item.key,
        openKeys: parents,
      }
    }
  }

  return null
}

function getMenuState(pathname) {
  const normalizedPathname = pathname === '/' ? '/home' : pathname
  const match = findMenuMatch(normalizedPathname, rawMenuItems)

  return {
    selectedKey: match?.selectedKey || normalizedPathname,
    openKeys: [...new Set([...defaultOpenMenuKeys, ...(match?.openKeys || [])])],
  }
}

// 给菜单项添加样式
function processMenuItems(items, level = 1) {
  return items.map(item => {
    const fontSize = level === 1 ? 15 : level === 2 ? 14 : 13
    const result = {
      ...item,
      style: { fontSize, fontWeight: level === 1 ? 500 : 400 },
      label: item.label,
    }
    if (item.children) {
      result.children = processMenuItems(item.children, level + 1)
    }
    return result
  })
}

const menuItems = processMenuItems(rawMenuItems)

export default function SideMenu() {
  const navigate = useNavigate()
  const location = useLocation()
  const { addTab } = useTab()
  const menuState = useMemo(() => getMenuState(location.pathname), [location.pathname])
  const [userOpenKeys, setUserOpenKeys] = useState(menuState.openKeys)
  const openKeys = useMemo(() => (
    [...new Set([...userOpenKeys, ...menuState.openKeys])]
  ), [menuState.openKeys, userOpenKeys])

  const handleMenuClick = ({ key }) => {
    if (key === '/home') {
      navigate('/')
    } else {
      navigate(key)
    }
    addTab({ key, label: findLabel(key, rawMenuItems) || key })
  }

  return (
    <Sider
      width={200}
      style={{
        background: '#fff',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          height: 56,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: '1px solid #f0f0f0',
          fontSize: 18,
          fontWeight: 'bold',
          color: '#FF6B00',
        }}
      >
        PC后台
      </div>
      <Menu
        mode="inline"
        selectedKeys={[menuState.selectedKey]}
        openKeys={openKeys}
        onOpenChange={setUserOpenKeys}
        style={{ height: 'calc(100vh - 56px - 60px)', borderRight: 0, flex: 1 }}
        items={menuItems}
        onClick={handleMenuClick}
      />
      <div
        style={{
          height: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 24,
          borderTop: '1px solid #f0f0f0',
          background: '#fff',
        }}
      >
        <UserOutlined style={{ fontSize: 20, cursor: 'pointer' }} />
        <BellOutlined style={{ fontSize: 20, cursor: 'pointer' }} />
      </div>
    </Sider>
  )
}
