import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import LoginPageHeader from '../components/login/layout/LoginPageHeader'
import FinancialWalletSection from '../components/dashboard/sections/FinancialWalletSection'
import { AUTH_CHANGED_EVENT, readCurrentCustomer } from '../components/login/auth-storage'
import PreviousBookingsWidget from '../components/dashboard/PreviousBookingsWidget'
import DigitalConciergeSection from '../components/dashboard/DigitalConciergeSection'
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
    <div className="customerDashboardPage">
      <LoginPageHeader />
      <PreviousBookingsWidget />
      <DigitalConciergeSection />
      <main className="customerDashboardMain">
        <section className="customerDashboardShell" aria-label="Customer dashboard overview">
          <div className="customerDashboardIntro">
            <p className="customerDashboardKicker">Customer Dashboard</p>
            <h1 className="customerDashboardTitle">
              Welcome back, {currentCustomer.fullName || currentCustomer.email}.
            </h1>
            <p className="customerDashboardCopy">
              Manage balances, review recent receipts, and keep your stay history in one place.
            </p>
          </div>

          <FinancialWalletSection customerName={currentCustomer.fullName || currentCustomer.email} />
        </section>
      </main>
    </div>
  )
}