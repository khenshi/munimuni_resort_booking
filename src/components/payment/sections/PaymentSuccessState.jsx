export default function PaymentSuccessState({
  transactionSummary,
  bookingData,
  paymentMethod,
  formatCurrency,
  onReturnHome,
}) {
  const packageTitle = bookingData?.selectedOffer?.title || bookingData?.title || bookingData?.propertyName || 'Resort Stay'

  return (
    <>
      <div className="success-banner">
        <p>
          Booking {transactionSummary.bookingReference} was confirmed with a {transactionSummary.paymentType} payment.
        </p>
      </div>

      <div className="booking-summary">
        <h2>Transaction Summary</h2>
        <div className="summary-details">
          <p><strong>Booking Reference:</strong> {transactionSummary.bookingReference}</p>
          <p><strong>Package:</strong> {packageTitle}</p>
          <p><strong>Payment Method:</strong> {paymentMethod || 'Cash'}</p>
          <p><strong>Total Amount:</strong> {formatCurrency(transactionSummary.totalAmount)}</p>
          <p><strong>Amount Paid:</strong> {formatCurrency(transactionSummary.amountPaid)}</p>
          <p><strong>Outstanding Balance:</strong> {formatCurrency(transactionSummary.outstandingBalance)}</p>
        </div>
      </div>

      <div className="payment-actions">
        <button type="button" onClick={onReturnHome} className="primary-btn">
          Return Home
        </button>
      </div>
    </>
  )
}
