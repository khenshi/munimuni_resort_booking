import { useEffect, useState } from 'react'
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
import { useBookingStateSync } from '../../components/booking'
import '../../styles/pages/customer-dashboard-page.css'
import '../../styles/components/dashboard/digital-concierge-panel.css'

export default function CustomerDashboardPage() {
  const navigate = useNavigate()
  const [currentCustomer, setCurrentCustomer] = useState(() => readCurrentCustomer())
  const [customerBookings, setCustomerBookings] = useState(() => {
    const initialCustomer = readCurrentCustomer()
    return initialCustomer?.id ? getCustomerBookingList(initialCustomer.id) : []
  })
  const [outstandingBalance, setOutstandingBalance] = useState(() => {
    const initialCustomer = readCurrentCustomer()
    return initialCustomer?.id ? getCustomerOutstandingBalance(initialCustomer.id) : 0
  })

  useEffect(() => {
    const syncCurrentCustomer = () => {
      const nextCustomer = readCurrentCustomer()
      setCurrentCustomer(nextCustomer)

      if (nextCustomer) {
        const bookings = getCustomerBookingList(nextCustomer.id)
        setCustomerBookings(bookings)
        setOutstandingBalance(getCustomerOutstandingBalance(nextCustomer.id))
      }
    }

    const refreshBookings = () => {
      if (currentCustomer?.id) {
        const bookings = getCustomerBookingList(currentCustomer.id)
        setCustomerBookings(bookings)
      }
    }

    const refreshBalance = () => {
      if (currentCustomer?.id) {
        setOutstandingBalance(getCustomerOutstandingBalance(currentCustomer.id))
      }
    }

    window.addEventListener('storage', syncCurrentCustomer)
    window.addEventListener(AUTH_CHANGED_EVENT, syncCurrentCustomer)
    window.addEventListener(BOOKINGS_CHANGED_EVENT, refreshBookings)
    window.addEventListener(OUTSTANDING_BALANCE_CHANGED_EVENT, refreshBalance)

    return () => {
      window.removeEventListener('storage', syncCurrentCustomer)
      window.removeEventListener(AUTH_CHANGED_EVENT, syncCurrentCustomer)
      window.removeEventListener(BOOKINGS_CHANGED_EVENT, refreshBookings)
      window.removeEventListener(OUTSTANDING_BALANCE_CHANGED_EVENT, refreshBalance)
    }
  }, [currentCustomer?.id])

  useBookingStateSync(currentCustomer?.id, setCustomerBookings)

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
