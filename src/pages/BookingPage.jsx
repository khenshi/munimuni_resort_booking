import BookingPageFlow from '../components/booking/BookingPageFlow'
import BookingPageHeader from '../components/booking/BookingPageHeader'
import useBookingPageLogic from '../components/booking/useBookingPageLogic'
import '../styles/pages/booking-page.css'

export default function BookingPage() {
  const booking = useBookingPageLogic()

  return (
    <div className="bookingPage">
      <BookingPageHeader detailsTo={booking.detailsTo} />
      <BookingPageFlow {...booking} />
    </div>
  )
}
