import { Link } from 'react-router-dom'
import { readCurrentCustomer } from '../../login/auth-storage'
import { getCustomerBookingList } from '../../login/bookings-storage'
import '../../../styles/components/dashboard/dashboard-widgets.css'

export default function PreviousBookingsWidget() {
  const currentCustomer = readCurrentCustomer()
  const allBookings = currentCustomer?.id ? getCustomerBookingList(currentCustomer.id) : []

  // Get today's date in ISO format (YYYY-MM-DD) to avoid timezone issues
  const getTodayISODate = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const todayISO = getTodayISODate()

  // Filter for completed/past bookings (check-out date is in the past)
  const completedBookings = allBookings.filter((booking) => {
    if (!booking.checkOutDate) return false
    return booking.checkOutDate < todayISO
  }).sort((a, b) => b.checkOutDate.localeCompare(a.checkOutDate))

  const recentBookings = completedBookings.slice(0, 3)

  const totalNightsStayed = completedBookings.reduce((total, booking) => {
    const checkIn = new Date(booking.checkInDate)
    const checkOut = new Date(booking.checkOutDate)
    if (isNaN(checkIn) || isNaN(checkOut)) return total
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24))
    return total + (nights > 0 ? nights : 0)
  }, 0)

  return (
    <section className="dashboardCard dashboardBookingsCard" aria-labelledby="previous-bookings-heading">
      <div className="dashboardCardHeader">
        <div>
          <p className="dashboardKicker">Stay History</p>
          <h2 id="previous-bookings-heading">Total Nights Stayed</h2>
        </div>
        <div className="dashboardStatValue">{totalNightsStayed}</div>
      </div>

      <div className="bookingOverviewList">
        {recentBookings.length > 0 ? (
          recentBookings.map((booking) => (
            <article key={booking.bookingReference} className="bookingOverviewItem">
              <div className="bookingOverviewPrimary">
                <p className="bookingPropertyName">{booking.selectedOffer?.title || 'Resort Stay'}</p>
                <p className="bookingDates">
                  {booking.checkInDate} – {booking.checkOutDate}
                </p>
                <Link 
                  className="dashboardWidgetAction" 
                  to={`/customer/bookings/${encodeURIComponent(booking.bookingReference)}`}
                >
                  View Details
                </Link>
              </div>
              <div className="bookingOverviewMeta">
                <span>Ref: {booking.bookingReference}</span>
                <span>{booking.guests} guest{booking.guests === 1 ? '' : 's'}</span>
              </div>
            </article>
          ))
        ) : (
          <div className="emptyWidgetState">
            <p>No past stays recorded yet.</p>
          </div>
        )}
      </div>

      <div className="dashboardCardFooter">
        <Link className="dashboardWidgetAction primaryCta" to="/customer/history?tab=bookings">
          View All History
        </Link>
      </div>
    </section>
  )
}
