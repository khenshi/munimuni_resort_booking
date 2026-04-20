export default function PaymentBookingSelection({
  payableBookings,
  onSelectBooking,
  formatCurrency,
}) {
  return (
    <div className="booking-selection-grid">
      {payableBookings.map((booking) => (
        <div
          key={booking.bookingReference}
          className="booking-card"
          onClick={() => onSelectBooking(booking)}
        >
          <h3>{booking.bookingReference}</h3>
          <p><strong>Property:</strong> {booking.selectedOffer?.title || booking.propertyName || 'Resort Stay'}</p>
          <p><strong>Total:</strong> {formatCurrency(booking.totalAmount)}</p>
          <p><strong>Outstanding:</strong> {formatCurrency(booking.outstandingBalance)}</p>
        </div>
      ))}
    </div>
  )
}
