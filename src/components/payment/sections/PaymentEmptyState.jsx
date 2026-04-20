export default function PaymentEmptyState({
  title,
  message,
  actionLabel,
  onAction,
}) {
  return (
    <div className="empty-state">
      <h1>{title}</h1>
      <p>{message}</p>
      <button type="button" onClick={onAction} className="primary-btn">
        {actionLabel}
      </button>
    </div>
  )
}
