import { Link, useNavigate } from 'react-router-dom'

/**
 * 
 * @param {Array} bookings - List of customer bookings to display 
 * @returns 
 */
export default function CustomerBookingsList({ bookings }) {
  const navigate = useNavigate()

  /**
   * Handles click on "Edit Booking" button, navigates to the edit page for the selected booking
   * @param {Object} booking - The booking to edit
   */
  const handleEdit = (booking) => {
    navigate(
      `/customer/bookings/${encodeURIComponent(booking.bookingReference)}/edit`,
    )
  }

  return (
    <div className="bookingsList">
      <div className="bookingsContainer">
        {/* maps through each booking */}
        {bookings.map((booking) => {
          const createdDate = booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : 'N/A'
          const checkInDate = booking.checkInDate || 'TBD'
          const daysUntilCheckIn = booking.checkInDate
            ? Math.floor((new Date(booking.checkInDate) - new Date()) / (1000 * 60 * 60 * 24))
            : null

          {/* Booking is editable if check-in date is more than 7 days away. Otherwise, it's locked. */}
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
                  <span className="bookingLabel">Check-in</span>
                  <span className="bookingValue">{checkInDate}</span>
                </div>
                {booking.checkOutDate && (
                  <div className="bookingDetailRow">
                    <span className="bookingLabel">Check-out</span>
                    <span className="bookingValue">{booking.checkOutDate}</span>
                  </div>
                )}
                <div className="bookingDetailRow">
                  <span className="bookingLabel">Guests</span>
                  <span className="bookingValue">{booking.guests || 'N/A'}</span>
                </div>
                <div className="bookingDetailRow">
                  <span className="bookingLabel">Guest Name</span>
                  <span className="bookingValue">{booking.fullName || 'N/A'}</span>
                </div>
                <div className="bookingDetailRow">
                  <span className="bookingLabel">Booked on</span>
                  <span className="bookingValue">{createdDate}</span>
                </div>
                {daysUntilCheckIn !== null && (
                  <div className={`bookingDetailRow ${daysUntilCheckIn <= 7 ? 'isWarning' : ''}`}>
                    <span className="bookingLabel">Days Until Check-in</span>
                    <span className="bookingValue">{Math.max(daysUntilCheckIn, 0)} days</span>
                  </div>
                )}
              </div>

              {/* If booking is locked, show a message indicating that edits are not allowed. Otherwise, show the edit button. */}  
              {!canEdit && (
                <p className="bookingEditMessage">
                  Booking is locked. Edits are only allowed more than 7 days before check-in.
                </p>
              )}

              <div className="bookingCardActions">
                <Link
                  to={`/customer/bookings/${encodeURIComponent(booking.bookingReference)}`}
                  className="bookingViewBtn"
                >
                  View Details
                </Link>
                <button
                  onClick={() => handleEdit(booking)}
                  disabled={!canEdit}
                  className={`bookingEditBtn ${canEdit ? 'isEnabled' : 'isDisabled'}`}
                >
                  {canEdit ? 'Edit Booking' : 'Locked'}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
