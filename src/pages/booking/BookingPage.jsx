import { BookingPageFlow, BookingPageHeader, useBookingPageLogic } from '../../components/booking'
import '../../styles/pages/booking-page.css'

export default function BookingPage() {
  const booking = useBookingPageLogic()

  return (
    <div className="bookingPage">
      <BookingPageHeader detailsTo={booking.detailsTo} />
      <BookingPageFlow {...booking} />
    </div>
  )
}
