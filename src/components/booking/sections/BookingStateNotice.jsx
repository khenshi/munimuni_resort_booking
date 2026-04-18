import { Link } from 'react-router-dom'

export default function BookingStateNotice({
  title,
  message,
  actionTo,
  actionLabel,
  actionState,
}) {
  return (
    <div className="bookingNotice" role="status" aria-live="polite">
      <h2>{title}</h2>
      <p>{message}</p>
      <Link to={actionTo} state={actionState} className="bookingActionBtn isPrimary">
        {actionLabel}
      </Link>
    </div>
  )
}