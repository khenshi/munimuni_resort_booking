export default function PaymentSuccessState({
  transactionSummary,
  formatCurrency,
  onReturnToDashboard,
  onViewHistory,
}) {
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
          <p><strong>Total Amount:</strong> {formatCurrency(transactionSummary.totalAmount)}</p>
          <p><strong>Amount Paid:</strong> {formatCurrency(transactionSummary.amountPaid)}</p>
          <p><strong>Outstanding Balance:</strong> {formatCurrency(transactionSummary.outstandingBalance)}</p>
        </div>
      </div>

      <div className="payment-actions">
        <button type="button" onClick={onReturnToDashboard} className="primary-btn">
          Return to Dashboard
        </button>
        <button type="button" onClick={onViewHistory} className="secondary-btn">
          View Booking History
        </button>
      </div>
    </>
  )
}
