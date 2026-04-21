import { useState } from 'react'

export default function PaymentPaymentForm({
  checkoutMode,
  paymentOption,
  setPaymentOption,
  paymentMethod,
  setPaymentMethod,
  paymentAmount,
  remainingBalanceAfterPayment,
  errorMessage: externalErrorMessage,
  isProcessing,
  onSubmit,
  formatCurrency,
}) {
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: '',
  })
  const [localErrors, setLocalErrors] = useState({})

  const handleCardChange = (e) => {
    let { name, value } = e.target
    
    // simple formatting
    if (name === 'number') {
      value = value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ').trim().substring(0, 19)
    } else if (name === 'expiry') {
      value = value.replace(/\D/g, '').replace(/(\d{2})(\d{0,2})/, '$1/$2').substring(0, 5)
    } else if (name === 'cvv') {
      value = value.replace(/\D/g, '').substring(0, 3)
    } else if (name === 'name') {
      value = value.replace(/[^a-zA-Z ]/g, '')
    }

    setCardDetails(prev => ({ ...prev, [name]: value }))
    // clear errors when user types
    if (localErrors[name]) {
      setLocalErrors(prev => ({ ...prev, [name]: null }))
    }
  }

  const validateAndSubmit = () => {
    if (paymentMethod === 'QR Ph') return onSubmit()

    const errors = {}
    // basic format checks
    if (!cardDetails.name.trim()) errors.name = 'Required'
    if (cardDetails.number.replace(/\s/g, '').length < 13) errors.number = 'Invalid Card'
    if (!/^\d{2}\/\d{2}$/.test(cardDetails.expiry)) {
      errors.expiry = 'Invalid (MM/YY)'
    } else {
      const [m, y] = cardDetails.expiry.split('/').map(Number)
      if (m < 1 || m > 12) {
        errors.expiry = 'Invalid Month'
      } else {
        const now = new Date()
        const currentMonth = now.getMonth() + 1
        const currentYear = Number(now.getFullYear().toString().slice(-2))
        
        if (y < currentYear || (y === currentYear && m < currentMonth)) {
          errors.expiry = 'Expired Card'
        }
      }
    }
    if (cardDetails.cvv.length < 3) errors.cvv = 'Invalid CVV'

    if (Object.keys(errors).length > 0) {
      setLocalErrors(errors)
      return
    }

    onSubmit(cardDetails)
  }

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
          onChange={(event) => {
            setPaymentMethod(event.target.value)
            setLocalErrors({})
          }}
        >
          <option value="Credit Card">Credit Card</option>
          <option value="Debit Card">Debit Card</option>
          <option value="QR Ph">QR Ph</option>
        </select>
      </div>

      {(paymentMethod === 'Credit Card' || paymentMethod === 'Debit Card') && (
        <div className="card-details-fields">
          <div className="form-group">
            <label>Cardholder Name</label>
            <input
              type="text"
              name="name"
              placeholder="John Doe"
              className={localErrors.name ? 'input-error' : ''}
              value={cardDetails.name}
              onChange={handleCardChange}
            />
            {localErrors.name && <span className="error-text">{localErrors.name}</span>}
          </div>
          <div className="form-group">
            <label>Card Number</label>
            <input
              type="text"
              name="number"
              placeholder="0000 0000 0000 0000"
              className={localErrors.number ? 'input-error' : ''}
              value={cardDetails.number}
              onChange={handleCardChange}
            />
            {localErrors.number && <span className="error-text">{localErrors.number}</span>}
          </div>
          <div className="card-row">
            <div className="form-group">
              <label>Expiry Date</label>
              <input
                type="text"
                name="expiry"
                placeholder="MM/YY"
                className={localErrors.expiry ? 'input-error' : ''}
                value={cardDetails.expiry}
                onChange={handleCardChange}
              />
              {localErrors.expiry && <span className="error-text">{localErrors.expiry}</span>}
            </div>
            <div className="form-group">
              <label>CVV</label>
              <input
                type="password"
                name="cvv"
                placeholder="***"
                className={localErrors.cvv ? 'input-error' : ''}
                value={cardDetails.cvv}
                onChange={handleCardChange}
              />
              {localErrors.cvv && <span className="error-text">{localErrors.cvv}</span>}
            </div>
          </div>
        </div>
      )}

      {paymentMethod === 'QR Ph' && (
        <div className="qr-code-container">
          <img src="/images/qr-ph-demo.png" alt="QR Ph" className="qr-code-img" />
          <p>Scan the code above to pay using any QR Ph-compatible app</p>
        </div>
      )}

      <div className="payment-preview">
        <p><strong>Payable Now:</strong> {formatCurrency(paymentAmount)}</p>
        <p><strong>Outstanding After Payment:</strong> {formatCurrency(remainingBalanceAfterPayment)}</p>
      </div>

      {externalErrorMessage ? <p className="payment-error">{externalErrorMessage}</p> : null}

      <button
        type="button"
        onClick={validateAndSubmit}
        disabled={isProcessing || paymentAmount <= 0}
        className="confirm-payment-btn"
      >
        {isProcessing ? 'Processing...' : checkoutMode === 'new' ? 'Confirm Payment' : 'Settle Balance'}
      </button>
    </div>
  )
}
