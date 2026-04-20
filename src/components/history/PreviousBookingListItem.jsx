/**
 * History "Previous Stays" list row component.
 * Renders a normalized booking display model for Member 5 mapping.
 * Delegates navigation via the onViewDetails callback.
 */

/**
 * Render one booking row for the History page.
 * @param {{ booking: import('./historyDisplayModels').BookingListItemModel, onViewDetails?: (booking: any) => void }} props
 * @returns {import('react').JSX.Element}
 */
export default function PreviousBookingListItem({ booking, onViewDetails }) {
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
        </div>

        <div className="historyRowAside">
          {booking.total ? <p className="historyRowAmount">{booking.total}</p> : null}
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

