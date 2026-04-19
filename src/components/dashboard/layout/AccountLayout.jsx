import { Navigate } from 'react-router-dom'
import LandingFooter from '../../landing/layout/LandingFooter'
import AccountSidebar from './AccountSidebar'
import { readCurrentCustomer } from '../../login/auth-storage'
import '../../../styles/pages/customer-dashboard-page.css'

export default function AccountLayout({ children }) {
  const currentCustomer = readCurrentCustomer()

  if (!currentCustomer) {
    return <Navigate to="/customer/login" replace />
  }

  return (
    <div className="customerDashboard">
      <main className="dashboardMain">
        <div className="dashboardLayoutArea">
          <AccountSidebar />
          <div className="dashboardMainContent">
            {children}
          </div>
        </div>
      </main>
      <LandingFooter />
    </div>
  )
}
