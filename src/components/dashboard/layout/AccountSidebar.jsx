import { Link, useLocation } from 'react-router-dom'
import { readCurrentCustomer } from '../../login/auth-storage'

export default function AccountSidebar() {
  const location = useLocation()
  const currentCustomer = readCurrentCustomer() || {}

  const navItems = [
    { label: 'Account Overview', path: '/customer/dashboard' },
    { label: 'History', path: '/customer/history'},
  ]

  const profileItems = [
    { label: 'Personal Information', path: '/customer/profile' },
  ]

  const isActive = (path, search = '') => {
    if (search) {
      return location.pathname === path && location.search === search
    }
    return location.pathname === path
  }

  return (
    <aside className="dashboardSidebar">
      <div className="memberProfileCard">
        <div className="memberProfileHeader">
          <span className="memberIcon">{currentCustomer.fullName?.toUpperCase() || currentCustomer.email?.toUpperCase()}</span>
        </div>
        <div className="memberProfileBody">
          <p className="memberSince">Member since {new Date().getFullYear()}</p>
          <p className="memberSince">{currentCustomer.email}</p>
        </div>
      </div>

      <nav className="dashboardSidebarNav">
        <div className="navSection">
          <p className="navSectionTitle">MY ACCOUNT</p>
          <ul className="navList">
            {navItems.map((item) => (
              <Link to={item.path + (item.search || '')}>
                <li 
                  key={item.label} 
                  className={`navItem ${isActive(item.path, item.search) ? 'isActive' : ''}`}
                >
                  {item.label}
                </li>
              </Link>
            ))}
          </ul>
        </div>
        <div className="navSection">
          <p className="navSectionTitle">MY PROFILE</p>
          <ul className="navList">
            {profileItems.map((item) => (
              <Link to={item.path}>
              <li 
                key={item.label} 
                className={`navItem ${isActive(item.path) ? 'isActive' : ''}`}
              >
                {item.label}
              </li>
              </Link>
            ))}
          </ul>
        </div>
      </nav>
    </aside>
  )
}
