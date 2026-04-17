export default function BookingStepContent({
  step,
  selectedOffer,
  formData,
  minCheckInDate,
  checkInValidationMessage,
  guestValidationMessage,
  guestInfoErrors,
  guestCapacityHint,
  maxAllowedGuests,
  onChange,
  toggleAddOn,
  addOns,
  selectedAddOnLabels,
  availabilityMessage,
  disabled = false,
  restrictionMessage = '',
}) {
  const formatCurrency = (value) => `PHP ${value.toLocaleString('en-US')}`
  const maxGuests = Number.isFinite(Number(maxAllowedGuests)) ? Number(maxAllowedGuests) : undefined

  if (step === 1) {
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
            disabled={disabled}
          />
          {checkInValidationMessage ? <p className="bookingFieldError">{checkInValidationMessage}</p> : null}
        </div>

        <div className="bookingField">
          <label htmlFor="checkOutDate">Check-out Date</label>
          <input
            id="checkOutDate"
            type="date"
            value={formData.checkOutDate}
<<<<<<< HEAD
            onChange={(e) => onChange('checkOutDate', e.target.value)}
            disabled={disabled}
=======
            readOnly
>>>>>>> 43ef20c (log in)
          />
        </div>

        {availabilityMessage ? <p className="bookingInlineWarning">{availabilityMessage}</p> : null}
        {restrictionMessage ? <p className="bookingInlineWarning">{restrictionMessage}</p> : null}

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
            disabled={disabled}
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
            disabled={disabled}
          />
        </div>
      </div>
    )
  }

  if (step === 2) {
    return (
      <div className="bookingGrid">
        <div className="bookingField">
          <label htmlFor="firstName">First Name</label>
          <input
            id="firstName"
            type="text"
            value={formData.firstName}
            onChange={(e) => onChange('firstName', e.target.value)}
            required
            disabled={disabled}
          />
          {guestInfoErrors?.firstName ? <p className="bookingFieldError">{guestInfoErrors.firstName}</p> : null}
        </div>

        <div className="bookingField">
          <label htmlFor="lastName">Last Name</label>
          <input
            id="lastName"
            type="text"
            value={formData.lastName}
            onChange={(e) => onChange('lastName', e.target.value)}
            required
          />
          {guestInfoErrors?.lastName ? <p className="bookingFieldError">{guestInfoErrors.lastName}</p> : null}
        </div>

        <div className="bookingField">
          <label htmlFor="phone">Mobile Number</label>
          <input
            id="phone"
            type="tel"
            inputMode="numeric"
            maxLength={13}
            value={formData.phone}
            onChange={(e) => onChange('phone', e.target.value)}
            placeholder="09XXXXXXXXX"
            required
            disabled={disabled}
          />
          {guestInfoErrors?.phone ? <p className="bookingFieldError">{guestInfoErrors.phone}</p> : null}
        </div>

        <div className="bookingField">
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => onChange('email', e.target.value)}
            required
            disabled={disabled}
          />
          {guestInfoErrors?.email ? <p className="bookingFieldError">{guestInfoErrors.email}</p> : null}
        </div>

        <div className="bookingField isFull">
          <label htmlFor="address">Address (Optional)</label>
          <input
            id="address"
            type="text"
            value={formData.address}
            onChange={(e) => onChange('address', e.target.value)}
            disabled={disabled}
          />
        </div>
      </div>
    )
  }

  if (step === 3) {
    return (
      <div className="bookingAddOnsList">
        {addOns.slice(0, 3).map((item) => {
          const checked = formData.selectedAddOns.includes(item.id)
          return (
            <label key={item.id} className={`bookingAddOn ${checked ? 'isChecked' : ''}`}>
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggleAddOn(item.id)}
                disabled={disabled}
              />
              <span>
                <strong>{item.title}</strong>
                <small>{item.priceLabel}</small>
              </span>
            </label>
          )
        })}
      </div>
    )
  }

  const calculateCostBreakdown = () => {
    const guestCount = Math.max(1, Number.parseInt(formData.guests, 10) || 1)
    let offerCost = Number(selectedOffer?.price) || 0
    let addOnsCost = 0
    let offerLabel = selectedOffer.title
    const addOnCostLines = []

    if (selectedOffer?.offerType === 'daytour' && selectedOffer?.offerId === 'basic') {
      offerCost = (Number(selectedOffer?.price) || 0) * guestCount
      offerLabel = `${selectedOffer.title} (${guestCount} guest${guestCount > 1 ? 's' : ''})`
    }

    formData.selectedAddOns.forEach((addOnId) => {
      const addOn = addOns.find((item) => item.id === addOnId)
      if (addOn?.price) {
        addOnsCost += addOn.price
        addOnCostLines.push({
          id: addOn.id,
          title: addOn.title,
          price: addOn.price,
        })
      }
    })

    const totalCost = offerCost + addOnsCost

    return {
      offerLabel,
      offerCost,
      addOnsCost,
      addOnCostLines,
      totalCost,
    }
  }

  const { offerLabel, offerCost, addOnsCost, addOnCostLines, totalCost } = calculateCostBreakdown()
  const guestDisplayName = [formData.firstName, formData.lastName].map((value) => String(value ?? '').trim()).filter(Boolean).join(' ')

  return (
    <div className="bookingReview">
      <p>
        <strong>Offer:</strong> {selectedOffer.title}
      </p>
      <p>
        <strong>Date:</strong> {formData.checkInDate || 'Not set'}
      </p>
      {formData.checkOutDate ? (
        <p>
          <strong>Check-out:</strong> {formData.checkOutDate}
        </p>
      ) : null}
      <p>
        <strong>Guests:</strong> {formData.guests || 'Not set'}
      </p>
      <p>
        <strong>Guest Name:</strong> {guestDisplayName || 'Not set'}
      </p>
      <p>
        <strong>Email:</strong> {formData.email || 'Not set'}
      </p>
      <p>
        <strong>Add-ons:</strong> {selectedAddOnLabels.length ? selectedAddOnLabels.join(', ') : 'None'}
      </p>

      <div className="bookingCostBreakdown">
        <h3>Cost Breakdown</h3>
        <div className="costLine">
          <span>{offerLabel}</span>
          <span className="costAmount">{formatCurrency(offerCost)}</span>
        </div>

        {addOnCostLines.map((line) => (
          <div className="costLine" key={line.id}>
            <span>{line.title}</span>
            <span className="costAmount">{formatCurrency(line.price)}</span>
          </div>
        ))}

        {addOnsCost > 0 ? (
          <div className="costLine">
            <span>Add-ons subtotal</span>
            <span className="costAmount">{formatCurrency(addOnsCost)}</span>
          </div>
        ) : null}

        <div className="costLine costTotal">
          <span>Total Amount</span>
          <span className="costAmount">{formatCurrency(totalCost)}</span>
        </div>
      </div>

      <label className="bookingTerms">
        <input
          type="checkbox"
          checked={formData.termsAccepted}
          onChange={(e) => onChange('termsAccepted', e.target.checked)}
          disabled={disabled}
        />
        <span>I agree to the booking and cancellation policy.</span>
      </label>
    </div>
  )
}
