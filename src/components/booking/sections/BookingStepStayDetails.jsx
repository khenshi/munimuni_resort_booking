export default function BookingStepStayDetails({
  selectedOffer,
  formData,
  minCheckInDate,
  checkInValidationMessage,
  guestValidationMessage,
  guestCapacityHint,
  maxAllowedGuests,
  onChange,
  availabilityMessage,
}) {
  const maxGuests = Number.isFinite(Number(maxAllowedGuests)) ? Number(maxAllowedGuests) : undefined

  return (
    <div className="bookingGrid">
      <div className="bookingField isFull">
        <label>Selected Offer</label>
        <div className="bookingStaticValue">
          {selectedOffer.imageUrl ? (
            <img
              className="bookingOfferPreviewImage"
              src={selectedOffer.imageUrl}
              alt={`${selectedOffer.title} preview`}
            />
          ) : null}
          <div className="bookingOfferDetails">
            <span>
              <strong>Name:</strong> {selectedOffer.title}
            </span>
            <span>
              <strong>Price:</strong> {selectedOffer.priceInfo}
            </span>
            <span>
              <strong>Number of Pax:</strong> {selectedOffer.paxLabel || 'Not specified'}
            </span>
          </div>
        </div>
      </div>

      <div className="bookingField">
        <label htmlFor="checkInDate">Check-in / Visit Date</label>
        <input
          id="checkInDate"
          type="date"
          min={minCheckInDate}
          value={formData.checkInDate}
          onChange={(e) => onChange('checkInDate', e.target.value)}
          required
        />
        {checkInValidationMessage ? <p className="bookingFieldError">{checkInValidationMessage}</p> : null}
      </div>

      <div className="bookingField">
        <label htmlFor="checkOutDate">Check-out Date</label>
        <input
          id="checkOutDate"
          type="date"
          value={formData.checkOutDate}
          readOnly
        />
      </div>

      {availabilityMessage ? <p className="bookingInlineWarning">{availabilityMessage}</p> : null}

      <div className="bookingField">
        <label htmlFor="guests">Number of Guests</label>
        <input
          id="guests"
          type="number"
          min="1"
          max={maxGuests}
          value={formData.guests}
          onChange={(e) => onChange('guests', e.target.value)}
          placeholder="Enter guest count"
          required
        />
        {guestValidationMessage ? <p className="bookingFieldError">{guestValidationMessage}</p> : null}
        {guestCapacityHint ? <p className="bookingFieldHint">{guestCapacityHint}</p> : null}
      </div>

      <div className="bookingField isFull">
        <label htmlFor="specialRequest">Special Request (Optional)</label>
        <textarea
          id="specialRequest"
          rows="3"
          value={formData.specialRequest}
          onChange={(e) => onChange('specialRequest', e.target.value)}
          placeholder="Any setup requests, celebration notes, or reminders"
        />
      </div>
    </div>
  )
}