import { Link, useNavigate } from 'react-router-dom'

export default function CustomerBookingsList({ bookings, currentCustomerId }) {
  const navigate = useNavigate()

  if (!bookings || bookings.length === 0) {
    return (
      <div className="bookingsList">
        <p className="bookingsEmpty">You don&apos;t have any bookings yet.</p>
        <Link to="/packages" className="bookingsEmptyLink">
          Browse Offers
        </Link>
      </div>
    )
  }

  const handleEdit = (booking) => {
    navigate('/booking', {
      state: {
        mode: 'edit',
        booking,
        selectedOffer: booking.selectedOffer,
      },
    })
  }

  return (
    <div className="bookingsList">
      <h2 className="bookingsHeading">My Bookings</h2>
      <div className="bookingsContainer">
        {bookings.map((booking) => {
          const createdDate = booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : 'N/A'
          const checkInDate = booking.checkInDate || 'TBD'
          const daysUntilCheckIn = booking.checkInDate
            ? Math.floor((new Date(booking.checkInDate) - new Date()) / (1000 * 60 * 60 * 24))
            : null

          const canEdit = daysUntilCheckIn !== null && daysUntilCheckIn > 7

          return (
            <div key={booking.bookingReference} className="bookingCard">
              <div className="bookingCardHeader">
                <div>
                  <h3 className="bookingTitle">{booking.selectedOffer?.title || 'Booking'}</h3>
                  <p className="bookingReference">Ref: {booking.bookingReference}</p>
                </div>
                <span className={`bookingStatus ${canEdit ? 'isEditable' : 'isLocked'}`}>
                  {canEdit ? 'Editable' : 'Locked'}
                </span>
              </div>

              <div className="bookingCardDetails">
                <div className="bookingDetailRow">
                  <span className="bookingLabel">Check-in:</span>
                  <span className="bookingValue">{checkInDate}</span>
                </div>
                {booking.checkOutDate && (
                  <div className="bookingDetailRow">
                    <span className="bookingLabel">Check-out:</span>
                    <span className="bookingValue">{booking.checkOutDate}</span>
                  </div>
                )}
                <div className="bookingDetailRow">
                  <span className="bookingLabel">Guests:</span>
                  <span className="bookingValue">{booking.guests || 'N/A'}</span>
                </div>
                <div className="bookingDetailRow">
                  <span className="bookingLabel">Guest Name:</span>
                  <span className="bookingValue">{booking.fullName || 'N/A'}</span>
                </div>
                <div className="bookingDetailRow">
                  <span className="bookingLabel">Booked:</span>
                  <span className="bookingValue">{createdDate}</span>
                </div>
                {daysUntilCheckIn !== null && (
                  <div className={`bookingDetailRow ${daysUntilCheckIn <= 7 ? 'isWarning' : ''}`}>
                    <span className="bookingLabel">Days Until Check-in:</span>
                    <span className="bookingValue">{Math.max(daysUntilCheckIn, 0)} days</span>
                  </div>
                )}
              </div>

              {!canEdit && (
                <p className="bookingEditMessage">
                  Edits are only allowed more than 7 days before check-in.
                </p>
              )}

              <div className="bookingCardActions">
                <button
                  onClick={() => handleEdit(booking)}
                  disabled={!canEdit}
                  className={`bookingEditBtn ${canEdit ? 'isEnabled' : 'isDisabled'}`}
                >
                  {canEdit ? 'Edit Booking' : 'Cannot Edit'}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
