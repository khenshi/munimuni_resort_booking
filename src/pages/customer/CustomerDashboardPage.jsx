import { useCallback, useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import {
  BOOKINGS_CHANGED_EVENT,
  AUTH_CHANGED_EVENT,
  OUTSTANDING_BALANCE_CHANGED_EVENT,
  getCustomerOutstandingBalance,
  getCustomerBookingList,
  readCurrentCustomer,
} from '../../components/login'
import {
  AccountLayout,
  CustomerBookingsList,
  DigitalConciergePanel,
  DigitalConciergeSection,
  FinancialWalletSection,
  PreviousBookingsWidget,
} from '../../components/dashboard'
import '../../styles/pages/customer-dashboard-page.css'
import '../../styles/components/dashboard/digital-concierge-panel.css'

export default function CustomerDashboardPage() {
  const navigate = useNavigate()
  // State for current customer, their bookings, and outstanding balance
  const [currentCustomer, setCurrentCustomer] = useState(() => readCurrentCustomer())
  const [customerBookings, setCustomerBookings] = useState([])
  const [outstandingBalance, setOutstandingBalance] = useState(0)

  // Centralized sync function (used useCallback to avoid unnecessary re-renders)
  const syncAll = useCallback(() => {
    const customer = readCurrentCustomer()
    setCurrentCustomer(customer)

    if (customer?.id) {
      setCustomerBookings(getCustomerBookingList(customer.id))
      setOutstandingBalance(getCustomerOutstandingBalance(customer.id))
    } else {
      // Reset when logged out
      setCustomerBookings([])
      setOutstandingBalance(0)
    }
  }, [])

  // Initial load
  useEffect(() => {
    syncAll()
  }, [syncAll])

  // Event listeners 
  useEffect(() => {
    window.addEventListener('storage', syncAll)
    window.addEventListener(AUTH_CHANGED_EVENT, syncAll)
    window.addEventListener(BOOKINGS_CHANGED_EVENT, syncAll)
    window.addEventListener(OUTSTANDING_BALANCE_CHANGED_EVENT, syncAll)

    return () => {
      window.removeEventListener('storage', syncAll)
      window.removeEventListener(AUTH_CHANGED_EVENT, syncAll)
      window.removeEventListener(BOOKINGS_CHANGED_EVENT, syncAll)
      window.removeEventListener(OUTSTANDING_BALANCE_CHANGED_EVENT, syncAll)
    }
  }, [syncAll])

  // If not logged in, redirect to login page
  if (!currentCustomer) {
    return <Navigate to="/customer/login" replace />
  }

  // Get today's date in ISO format (YYYY-MM-DD) to avoid timezone issues
  const getTodayISODate = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  // Filter for upcoming bookings (check-in date in the future) and sort by check-in date
  const todayISO = getTodayISODate()
  const upcomingBookings = customerBookings
    .filter((b) => b.checkInDate && b.checkInDate > todayISO)
    .sort((a, b) => a.checkInDate.localeCompare(b.checkInDate))

  return (
    <AccountLayout>
      <header className="dashboardIntro">
        <div className="dashboardIntroText">
          <p className="dashboardKicker">Customer Dashboard</p>
          <h1 className="dashboardTitle">
            Welcome back, {currentCustomer.fullName.slice(0, 1).toUpperCase() + currentCustomer.fullName.slice(1) || currentCustomer.email}.
          </h1>
          <p className="dashboardCopy">
            Manage your resort experience, track stays, and handle billing from your personal hub.
          </p>
        </div>
        <button className="createNewBookingBtn" onClick={() => navigate('/packages')}>
          + Create New Booking
        </button>
      </header>

      <div className="dashboardContentStack">
        <div className="dashboardTopGrid">
          <FinancialWalletSection
            customerName={currentCustomer.fullName || currentCustomer.email}
            outstandingBalance={outstandingBalance}
            onPayNow={() => navigate('/customer/payment', { state: { source: 'dashboard-wallet' } })}
          />
        </div>

        <section className="nextStaySection">
          <div className="sectionHeader">
            <h2 className="sectionTitle">Current & Upcoming Stays</h2>
            <Link to="/customer/history?tab=bookings" className="sectionLink">View All Stays</Link>
          </div>
          {upcomingBookings.length > 0 ? (
            <div className="nextStayGrid">
              <div className="nextStayMain">
                <CustomerBookingsList bookings={upcomingBookings} currentCustomerId={currentCustomer.id} />
              </div>
            </div>
          ) : (
            <div className="placeholderBox fullWidthPlaceholder">
              <span className="placeholderLabel">No Upcoming Stays</span>
              <div className="dynamicData">
                <p style={{ margin: 0, fontSize: '1rem' }}>You don&apos;t have any upcoming reservations. Ready for your next getaway?</p>
                <button className="dashboardInlineLink" onClick={() => navigate('/packages')}>Book a stay now</button>
              </div>
            </div>
          )}
        </section>

        <div className="dashboardBottomStack">
          <div className="dashboardWidgetRow">
            <PreviousBookingsWidget />
          </div>

          <div className="dashboardWidgetRow">
            <DigitalConciergeSection />
          </div>

          <div className="dashboardWidgetRow">
            <DigitalConciergePanel />
          </div>
        </div>
      </div>
    </AccountLayout>
  )
}
