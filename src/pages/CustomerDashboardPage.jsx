import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import LoginPageHeader from '../components/login/layout/LoginPageHeader'
import { AUTH_CHANGED_EVENT, readCurrentCustomer } from '../components/login/auth-storage'
import CustomerBookingsList from '../components/login/CustomerBookingsList'
import { getCustomerBookingList, BOOKINGS_CHANGED_EVENT } from '../components/login/bookings-storage'
import '../styles/pages/customer-dashboard-page.css'

export default function CustomerDashboardPage() {
  const navigate = useNavigate()
  const [currentCustomer, setCurrentCustomer] = useState(() => readCurrentCustomer())
  const [customerBookings, setCustomerBookings] = useState([])

  useEffect(() => {
    const syncCurrentCustomer = () => {
      const nextCustomer = readCurrentCustomer()
      setCurrentCustomer(nextCustomer)

      if (!nextCustomer) {
        navigate('/customer/login', { replace: true })
      } else {
        const bookings = getCustomerBookingList(nextCustomer.id)
        setCustomerBookings(bookings)
      }
    }

    const refreshBookings = () => {
      if (currentCustomer?.id) {
        const bookings = getCustomerBookingList(currentCustomer.id)
        setCustomerBookings(bookings)
      }
    }

    if (currentCustomer?.id) {
      const bookings = getCustomerBookingList(currentCustomer.id)
      setCustomerBookings(bookings)
    }

    window.addEventListener('storage', syncCurrentCustomer)
    window.addEventListener(AUTH_CHANGED_EVENT, syncCurrentCustomer)
    window.addEventListener(BOOKINGS_CHANGED_EVENT, refreshBookings)

    return () => {
      window.removeEventListener('storage', syncCurrentCustomer)
      window.removeEventListener(AUTH_CHANGED_EVENT, syncCurrentCustomer)
      window.removeEventListener(BOOKINGS_CHANGED_EVENT, refreshBookings)
    }
  }, [navigate, currentCustomer?.id])

  if (!currentCustomer) {
    return <Navigate to="/customer/login" replace />
  }

  return (
    <div className="customerDashboard">
      <LoginPageHeader />
      {/* The fix is usually applied to this 'dashboardMain' class in your CSS */}
      <main className="dashboardMain">
        <section className="dashboardContent">
          <div className="dashboardHeader">
            <h1>Welcome, {currentCustomer.fullName || 'Guest'}</h1>
            <p>Manage your bookings below</p>
          </div>
          <CustomerBookingsList bookings={customerBookings} currentCustomerId={currentCustomer.id} />
        </section>
      </main>
    </div>
  )
}