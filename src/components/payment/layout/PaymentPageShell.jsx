export default function PaymentPageShell({ title, onBack, children }) {
  return (
    <div className="payment-page">
      <div className="container">
        {onBack && (
          <button type="button" onClick={onBack} className="back-btn">
            ← Back to Dashboard
          </button>
        )}
        {title ? <h1>{title}</h1> : null}
        {children}
      </div>
    </div>
  )
}
