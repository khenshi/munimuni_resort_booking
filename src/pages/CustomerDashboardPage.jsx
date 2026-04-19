import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import LoginPageHeader from '../components/login/layout/LoginPageHeader'
import FinancialWalletSection from '../components/dashboard/sections/FinancialWalletSection'
import { BOOKINGS_CHANGED_EVENT } from '../components/login/bookings-storage'
import {
  AUTH_CHANGED_EVENT,
  BALANCE_CHANGED_EVENT,
  getCustomerBalance,
  readCurrentCustomer,
} from '../components/login/auth-storage'
import PreviousBookingsWidget from '../components/dashboard/PreviousBookingsWidget'
import DigitalConciergeSection from '../components/dashboard/DigitalConciergeSection'
import CustomerBookingsList from '../components/login/CustomerBookingsList'
import { getCustomerBookingList } from '../components/login/bookings-storage'
import useBookingStateSync from '../components/booking/state/useBookingStateSync'
import '../styles/pages/customer-dashboard-page.css'
import LandingFooter from '../components/landing/layout/LandingFooter'

export default function CustomerDashboardPage() {
  const navigate = useNavigate()
  const [currentCustomer, setCurrentCustomer] = useState(() => readCurrentCustomer())
  const [customerBookings, setCustomerBookings] = useState(() => {
    const initialCustomer = readCurrentCustomer()
    return initialCustomer?.id ? getCustomerBookingList(initialCustomer.id) : []
  })
  const [customerBalance, setCustomerBalance] = useState(() => {
    const initialCustomer = readCurrentCustomer()
    return initialCustomer?.id ? getCustomerBalance(initialCustomer.id) : 0
  })

  useEffect(() => {
    const syncCurrentCustomer = () => {
      const nextCustomer = readCurrentCustomer()
      setCurrentCustomer(nextCustomer)

      if (!nextCustomer) {
        navigate('/customer/login', { replace: true })
      } else {
        const bookings = getCustomerBookingList(nextCustomer.id)
        setCustomerBookings(bookings)
        setCustomerBalance(getCustomerBalance(nextCustomer.id))
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
        setCustomerBalance(getCustomerBalance(currentCustomer.id))
      }
    }

    window.addEventListener('storage', syncCurrentCustomer)
    window.addEventListener(AUTH_CHANGED_EVENT, syncCurrentCustomer)
    window.addEventListener(BOOKINGS_CHANGED_EVENT, refreshBookings)
    window.addEventListener(BALANCE_CHANGED_EVENT, refreshBalance)
    window.addEventListener('storage', syncCurrentCustomer)
    window.addEventListener(AUTH_CHANGED_EVENT, syncCurrentCustomer)

    return () => {
      window.removeEventListener('storage', syncCurrentCustomer)
      window.removeEventListener(AUTH_CHANGED_EVENT, syncCurrentCustomer)
      window.removeEventListener(BOOKINGS_CHANGED_EVENT, refreshBookings)
      window.removeEventListener(BALANCE_CHANGED_EVENT, refreshBalance)
    }
  }, [navigate])

  useBookingStateSync(currentCustomer?.id, setCustomerBookings)

  if (!currentCustomer) {
    return <Navigate to="/customer/login" replace />
  }

  const upcomingBookings = customerBookings
    .filter((b) => b.checkInDate && new Date(b.checkInDate) > new Date())
    .sort((a, b) => new Date(a.checkInDate) - new Date(b.checkInDate));

  const nextStay = upcomingBookings.length > 0 ? upcomingBookings[0] : null;

  return (
    <div className="customerDashboard">
      <LoginPageHeader />
      
      <main className="dashboardMain">
        <div className="dashboardLayoutArea">
          {/*separate component. here for the meatime*/}
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
                  <li className="navItem isActive">Account Overview</li>
                  <li className="navItem">Account Activity</li>
                  <li className="navItem">My Stays</li>
                </ul>
              </div>
              <div className="navSection">
                <p className="navSectionTitle">MY PROFILE</p>
                <ul className="navList">
                  <li className="navItem">
                    <Link to="/customer/profile">Personal Information</Link>
                  </li>
                </ul>
              </div>
            </nav>
          </aside>

        <div className="dashboardMainContent">
        <div className="dashboardIntro">
          <p className="dashboardKicker">Customer Dashboard</p>
          <h1 className="dashboardTitle">
            Welcome back, {currentCustomer.fullName || currentCustomer.email}.
          </h1>
          <p className="dashboardCopy">
            Manage balances, review recent receipts, and keep your stay history in one place.
          </p>
          <button className="createNewBookingBtn" onClick={() => navigate('/packages')}>
            Create New Booking
          </button>
        </div>

        <div className="dashboardContentStack">
          
          <FinancialWalletSection
            customerName={currentCustomer.fullName || currentCustomer.email}
            accountBalance={customerBalance}
          />
          
          <section className="nextStaySection">
            <h2 className="sectionTitle">Current & Upcoming Bookings</h2>
            {nextStay ? (
              <div className="nextStayGrid">
                <div className="nextStayMain">
                  <CustomerBookingsList bookings={customerBookings} currentCustomerId={currentCustomer.id} />
                </div>
                {/* <div className="nextStaySidebar">
                  <div className="placeholderBox">
                    <span className="placeholderLabel">Countdown Timer</span>
                    <div className="dynamicData">
                      <strong>{Math.max(daysUntilCheckIn, 0)} Days</strong> 
                      <span style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.25rem' }}>until check-in</span>
                    </div>
                  </div>

                  <div className="placeholderBox">
                    <span className="placeholderLabel">Upcoming Booking</span>
                    <div className="dynamicData">
                      <strong style={{ textAlign: 'center' }}>{nextStay.selectedOffer?.title || 'Booking'}</strong>
                      <span style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.25rem' }}>{nextStay.checkInDate}</span>
                    </div>
                  </div>
                  
                  <div className="placeholderBox">
                    <span className="placeholderLabel">Quick Actions</span>
                    <div className="dynamicData" style={{ width: '100%', gap: '0.75rem', display: 'flex', flexDirection: 'column', marginTop: '0.5rem' }}>
                       <button disabled className="placeholderBtn">Request Late Check-out</button>
                       <button disabled className="placeholderBtn">Modify Booking</button>
                    </div>
                  </div>
                </div> */}
              </div>
            ) : (
              <div className="placeholderBox fullWidthPlaceholder">
                <span className="placeholderLabel">No Upcoming Stays</span>
                <div className="dynamicData">
                  <p style={{ margin: 0, fontSize: '1rem' }}>Time for a vacation?</p>
                </div>
              </div>
            )}
          </section>

          <div className="dashboardWidgetsRow">
            <PreviousBookingsWidget />
            <DigitalConciergeSection />
          </div>       
          
        </div>
          </div>
        </div>
      </main>
      <LandingFooter />
    </div>
  )
}