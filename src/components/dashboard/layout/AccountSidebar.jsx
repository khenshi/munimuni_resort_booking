import { Link, useLocation } from 'react-router-dom'
import { readCurrentCustomer } from '../../login/auth-storage'

export default function AccountSidebar() {
  const location = useLocation()
  const currentCustomer = readCurrentCustomer() || {}

  // Define navigation items for the sidebar. Each item has a label and a path.
  const navItems = [
    { label: 'Account Overview', path: '/customer/dashboard' },
    { label: 'History', path: '/customer/history'},
  ]

  // Profile section is separate from main account navigation, but structured similarly for consistency.
  const profileItems = [
    { label: 'Personal Information', path: '/customer/profile' },
  ]

  /**
   *
   * @param {*} path
   * @returns
   */
  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <aside className="dashboardSidebar">
      {/* Member Profile Card at the top of the sidebar */}
      <div className="memberProfileCard">
        <div className="memberProfileHeader">
          <span className="memberIcon">{currentCustomer.fullName?.toUpperCase() || currentCustomer.email?.toUpperCase()}</span>
        </div>
        <div className="memberProfileBody">
          <p className="memberSince">{currentCustomer.email}</p>
        </div>
      </div>

      {/* Navigation sections below the profile card */}
      <nav className="dashboardSidebarNav">
        <div className="navSection">
          <p className="navSectionTitle">MY ACCOUNT</p>
          <ul className="navList">
            {navItems.map((item) => (
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
