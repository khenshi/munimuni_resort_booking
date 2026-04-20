export default function PaymentBookingSummary({
  bookingData,
  totalAmount,
  formatCurrency,
}) {
  return (
    <div className="booking-summary">
      <h2>Booking Summary</h2>
      <div className="summary-details">
        <p><strong>Booking Reference:</strong> {bookingData.bookingReference || 'Will be generated after payment'}</p>
        <p><strong>Property:</strong> {bookingData.selectedOffer?.title || bookingData.propertyName || 'Resort Stay'}</p>
        <p><strong>Check-in:</strong> {bookingData.checkInDate || 'N/A'}</p>
        <p><strong>Check-out:</strong> {bookingData.checkOutDate || 'N/A'}</p>
        <p><strong>Guests:</strong> {bookingData.guests || bookingData.guestCount || 'N/A'}</p>
        <p><strong>Outstanding:</strong> {formatCurrency(bookingData.outstandingBalance || 0)}</p>
      </div>

      <div className="cost-breakdown">
        <h3>Cost Breakdown</h3>
        <div className="cost-item">
          <span>Room Charges</span>
          <span>{formatCurrency(bookingData.itemizedCosts?.room || 0)}</span>
        </div>
        <div className="cost-item">
          <span>Add-ons</span>
          <span>{formatCurrency(bookingData.itemizedCosts?.addOns || 0)}</span>
        </div>
        <div className="cost-item total">
          <span><strong>Total</strong></span>
          <span><strong>{formatCurrency(totalAmount)}</strong></span>
        </div>
      </div>
    </div>
  )
}
