import { Link, useLocation } from 'react-router-dom'
import { readCurrentCustomer } from '../../login/auth-storage'

export default function AccountSidebar() {
  const location = useLocation()
  const currentCustomer = readCurrentCustomer() || {}

  const navItems = [
    { label: 'Account Overview', path: '/customer/dashboard' },
    { label: 'Stay History', path: '/customer/history', search: '?tab=bookings' },
    { label: 'Billing & Receipts', path: '/customer/history', search: '?tab=billing' },
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
          <span className="memberIcon">MEMBER</span>
        </div>
        <div className="memberProfileBody">
          <p className="memberSince">Member since {new Date().getFullYear()}</p>
          <p className="memberId">1000{currentCustomer.id || '1234'}</p>
        </div>
        <div className="memberProfileFooter">
          {currentCustomer.fullName?.toUpperCase() || currentCustomer.email?.toUpperCase()}
        </div>
      </div>

      <nav className="dashboardSidebarNav">
        <div className="navSection">
          <p className="navSectionTitle">MY ACCOUNT</p>
          <ul className="navList">
            {navItems.map((item) => (
              <li 
                key={item.label} 
                className={`navItem ${isActive(item.path, item.search) ? 'isActive' : ''}`}
              >
                <Link to={item.path + (item.search || '')}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="navSection">
          <p className="navSectionTitle">MY PROFILE</p>
          <ul className="navList">
            {profileItems.map((item) => (
              <li 
                key={item.label} 
                className={`navItem ${isActive(item.path) ? 'isActive' : ''}`}
              >
                <Link to={item.path}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </aside>
  )
}
