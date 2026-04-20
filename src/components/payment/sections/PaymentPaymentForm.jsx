export default function PaymentPaymentForm({
  checkoutMode,
  paymentOption,
  setPaymentOption,
  paymentMethod,
  setPaymentMethod,
  paymentAmount,
  remainingBalanceAfterPayment,
  errorMessage,
  isProcessing,
  onSubmit,
  formatCurrency,
}) {
  return (
    <div className="payment-form">
      <h2>Payment Details</h2>

      {checkoutMode === 'new' ? (
        <div className="form-group">
          <label>Payment Type</label>
          <div className="paymentTypeOptions">
            <label>
              <input
                type="radio"
                name="paymentType"
                value="full"
                checked={paymentOption === 'full'}
                onChange={(event) => setPaymentOption(event.target.value)}
              />
              Full Payment
            </label>
            <label>
              <input
                type="radio"
                name="paymentType"
                value="downpayment"
                checked={paymentOption === 'downpayment'}
                onChange={(event) => setPaymentOption(event.target.value)}
              />
              Downpayment (50%)
            </label>
          </div>
        </div>
      ) : (
        <div className="form-group">
          <label>Payment Type</label>
          <p>Balance Payment (Remaining amount only)</p>
        </div>
      )}

      <div className="form-group">
        <label htmlFor="payment-method">Payment Method</label>
        <select
          id="payment-method"
          value={paymentMethod}
          onChange={(event) => setPaymentMethod(event.target.value)}
        >
          <option value="Credit Card">Credit Card</option>
          <option value="Debit Card">Debit Card</option>
          <option value="Bank Transfer">Bank Transfer</option>
          <option value="Cash">Cash</option>
        </select>
      </div>

      <div className="payment-preview">
        <p><strong>Payable Now:</strong> {formatCurrency(paymentAmount)}</p>
        <p><strong>Outstanding After Payment:</strong> {formatCurrency(remainingBalanceAfterPayment)}</p>
      </div>

      {errorMessage ? <p className="payment-error">{errorMessage}</p> : null}

      <button
        type="button"
        onClick={onSubmit}
        disabled={isProcessing || paymentAmount <= 0}
        className="confirm-payment-btn"
      >
        {isProcessing ? 'Processing...' : checkoutMode === 'new' ? 'Confirm Payment' : 'Settle Balance'}
      </button>
    </div>
  )
}
