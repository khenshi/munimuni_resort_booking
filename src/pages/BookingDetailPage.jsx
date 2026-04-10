import { Navigate, Link, useParams } from 'react-router-dom'
import LoginPageHeader from '../components/login/layout/LoginPageHeader'
import { readCurrentCustomer } from '../components/login/auth-storage'
import { getCustomerBookingList } from '../components/login/bookings-storage'
import { previousBookings } from '../data/previous-bookings'
import '../styles/pages/customer-detail-pages.css'

function formatDate(dateText) {
  if (!dateText) return 'TBD'
  const parsedDate = new Date(dateText)
  if (Number.isNaN(parsedDate.getTime())) return dateText
  return parsedDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function calculateNights(checkInDate, checkOutDate) {
  if (!checkInDate || !checkOutDate) return null
  const checkIn = new Date(checkInDate)
  const checkOut = new Date(checkOutDate)
  if (Number.isNaN(checkIn.getTime()) || Number.isNaN(checkOut.getTime())) return null
  const nights = Math.round((checkOut - checkIn) / (1000 * 60 * 60 * 24))
  return nights > 0 ? nights : null
}

export default function BookingDetailPage() {
  const { bookingId } = useParams()
  const currentCustomer = readCurrentCustomer()

  if (!currentCustomer) {
    return <Navigate to="/customer/login" replace />
  }

  const decodedBookingId = decodeURIComponent(bookingId || '')
  const customerBookings = getCustomerBookingList(currentCustomer.id)

  const liveBooking = customerBookings.find(
    (booking) => booking.bookingReference === decodedBookingId,
  )

  const archivedBooking = previousBookings.find(
    (booking) => booking.id === decodedBookingId || booking.bookingReference === decodedBookingId,
  )

  const booking = liveBooking || archivedBooking

  if (!booking) {
    return (
      <div className="customerDetailPage">
        <LoginPageHeader />
        <main className="customerDetailMain">
          <section className="customerDetailCard">
            <p className="customerDetailKicker">Booking Detail</p>
            <h1 className="customerDetailTitle">Booking not found</h1>
            <p className="customerDetailDescription">
              We could not find a booking record for ID <strong>{decodedBookingId}</strong>.
            </p>
            <div className="customerDetailActions">
              <Link className="customerDetailBtn isPrimary" to="/customer/dashboard">
                Back to Dashboard
              </Link>
              <Link className="customerDetailBtn" to="/customer/history">
                Open History
              </Link>
            </div>
          </section>
        </main>
      </div>
    )
  }

  const nights = booking.nights || calculateNights(booking.checkInDate, booking.checkOutDate)
  const guestCount = booking.guests || booking.guestCount || 'N/A'
  const bookingLabel = booking.selectedOffer?.title || booking.propertyName || 'Resort Booking'

  return (
    <div className="customerDetailPage">
      <LoginPageHeader />
      <main className="customerDetailMain">
        <section className="customerDetailCard">
          <p className="customerDetailKicker">Booking Detail</p>
          <h1 className="customerDetailTitle">{bookingLabel}</h1>
          <p className="customerDetailDescription">
            Full itinerary and guest details for booking <strong>{decodedBookingId}</strong>.
          </p>

          <div className="customerDetailGrid">
            <article className="customerDetailPanel">
              <h2>Itinerary</h2>
              <div className="customerDetailRow">
                <span>Booking reference</span>
                <strong>{booking.bookingReference || booking.id}</strong>
              </div>
              <div className="customerDetailRow">
                <span>Check-in date</span>
                <strong>{formatDate(booking.checkInDate)}</strong>
              </div>
              <div className="customerDetailRow">
                <span>Check-out date</span>
                <strong>{formatDate(booking.checkOutDate)}</strong>
              </div>
              <div className="customerDetailRow">
                <span>Total nights</span>
                <strong>{nights || 'N/A'}</strong>
              </div>
              <div className="customerDetailRow">
                <span>Guests</span>
                <strong>{guestCount}</strong>
              </div>
              <div className="customerDetailRow">
                <span>Status</span>
                <strong className="customerDetailBadge">{booking.status || 'Pending'}</strong>
              </div>
            </article>

            <article className="customerDetailPanel">
              <h2>Guest & preferences</h2>
              <div className="customerDetailRow">
                <span>Guest name</span>
                <strong>{booking.fullName || currentCustomer.fullName || currentCustomer.email}</strong>
              </div>
              <div className="customerDetailRow">
                <span>Email</span>
                <strong>{booking.email || currentCustomer.email || 'N/A'}</strong>
              </div>
              <div className="customerDetailRow">
                <span>Phone</span>
                <strong>{booking.phone || 'N/A'}</strong>
              </div>
              <div className="customerDetailRow">
                <span>Address</span>
                <strong>{booking.address || 'N/A'}</strong>
              </div>
              <div className="customerDetailStackedRow">
                <span>Selected add-ons</span>
                <ul>
                  {Array.isArray(booking.selectedAddOns) && booking.selectedAddOns.length > 0 ? (
                    booking.selectedAddOns.map((addOnId) => <li key={addOnId}>{addOnId}</li>)
                  ) : (
                    <li>No add-ons selected</li>
                  )}
                </ul>
              </div>
              <div className="customerDetailStackedRow">
                <span>Special requests</span>
                <p>{booking.specialRequest || 'No special requests provided.'}</p>
              </div>
            </article>
          </div>

          <div className="customerDetailActions">
            <Link className="customerDetailBtn isPrimary" to="/customer/dashboard">
              Back to Dashboard
            </Link>
            <Link className="customerDetailBtn" to="/customer/history">
              View History
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}
