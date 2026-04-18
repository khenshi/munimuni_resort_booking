import { Link } from 'react-router-dom'
import { previousBookings } from '../../data/previous-bookings'
import '../../styles/components/dashboard/dashboard-widgets.css'

/**
 * @typedef {import('../../types/booking').BookingHistoryEntry} BookingHistoryEntry
 */

export default function PreviousBookingsWidget() {
  const recentBookings = [...previousBookings]
    .sort((a, b) => new Date(b.checkOutDate) - new Date(a.checkOutDate))
    .slice(0, 3)

  const totalNightsStayed = previousBookings.reduce((total, booking) => {
    const nights = Number(booking.nights)
    return total + (Number.isFinite(nights) && nights > 0 ? nights : 0)
  }, 0)

  return (
    <section className="dashboardCard dashboardBookingsCard" aria-labelledby="previous-bookings-heading">
      <div className="dashboardCardHeader">
        <div>
          <p className="dashboardKicker">Previous bookings</p>
          <h2 id="previous-bookings-heading">Total Nights Stayed</h2>
        </div>
        <div className="dashboardStatValue">{totalNightsStayed}</div>
      </div>

      <div className="bookingOverviewList">
        {recentBookings.map((booking) => (
          <article key={booking.id} className="bookingOverviewItem">
            <div className="bookingOverviewPrimary">
              <p className="bookingPropertyName">{booking.propertyName}</p>
              <p className="bookingDates">
                {booking.checkInDate} – {booking.checkOutDate}
              </p>
              <Link className="dashboardWidgetAction" to={`/customer/bookings/${encodeURIComponent(booking.id)}`}>
                View Booking Detail
              </Link>
            </div>
            <div className="bookingOverviewMeta">
              <span>{booking.nights} night{booking.nights === 1 ? '' : 's'}</span>
              <span>{booking.guestCount} guest{booking.guestCount === 1 ? '' : 's'}</span>
            </div>
          </article>
        ))}
      </div>

      <div className="dashboardCardFooter">
        <Link className="dashboardWidgetAction primaryCta" to="/customer/history">
          View All
        </Link>
      </div>
    </section>
  )
}
