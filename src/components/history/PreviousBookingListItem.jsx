/**
 * 
 * @param {object} - booking record to display in the list item, should contain at least id, title, dateRange, guests, status, and bookingReference fields
 * @param {Function} - onViewDetails - callback function to trigger when "View Details" button is clicked, receives the booking object as an argument 
 * @returns 
 */
export default function PreviousBookingListItem({ booking, onViewDetails }) {
  const bookingReference = booking.bookingReference || booking.reference || booking.id
  const statusVariant = String(booking.status ?? '')
    .trim()
    .toLowerCase()
  const statusClassName = statusVariant ? `historyStatusPill ${statusVariant.replace(/\s+/g, '-')}` : ''

  return (
    <div className="historyBookingRow" aria-label={`Booking ${booking.id}`}>
      <div className="historyRowMain">
        <div className="historyRowTitleGroup">
          <p className="historyRowTitle">{booking.title}</p>
          <p className="historyRowSubtle">
            <span className="historyRowMeta">{booking.dateRange}</span>
            {booking.guests ? <span className="historyRowMeta"> • {booking.guests}</span> : null}
            {booking.status ? (
              <>
                <span className="historyRowMeta"> • </span>
                <span className={statusClassName}>{booking.status}</span>
              </>
            ) : null}
          </p>
          <p className="historyRowSubtle">{bookingReference}</p>
        </div>

        <div className="historyRowAside">
          <button
            type="button"
            className="historyRowAction"
            onClick={() => onViewDetails?.(booking)}
            aria-label={`View details for booking ${booking.id}`}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  )
}

