export default function BookingStepContent({
  step,
  selectedOffer,
  formData,
  onChange,
  toggleAddOn,
  addOns,
  selectedAddOnLabels,
}) {
  if (step === 1) {
    return (
      <div className="bookingGrid">
        <div className="bookingField isFull">
          <label>Selected Offer</label>
          <div className="bookingStaticValue">
            <strong>{selectedOffer.title}</strong>
            <span>{selectedOffer.priceInfo}</span>
            <span>{selectedOffer.subtitle}</span>
          </div>
        </div>

        <div className="bookingField">
          <label htmlFor="checkInDate">Check-in / Visit Date</label>
          <input
            id="checkInDate"
            type="date"
            value={formData.checkInDate}
            onChange={(e) => onChange('checkInDate', e.target.value)}
            required
          />
        </div>

        <div className="bookingField">
          <label htmlFor="checkOutDate">Check-out Date (Optional)</label>
          <input
            id="checkOutDate"
            type="date"
            value={formData.checkOutDate}
            onChange={(e) => onChange('checkOutDate', e.target.value)}
          />
        </div>

        <div className="bookingField">
          <label htmlFor="guests">Number of Guests</label>
          <input
            id="guests"
            type="number"
            min="1"
            value={formData.guests}
            onChange={(e) => onChange('guests', e.target.value)}
            placeholder="Enter guest count"
            required
          />
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

  if (step === 2) {
    return (
      <div className="bookingGrid">
        <div className="bookingField">
          <label htmlFor="fullName">Full Name</label>
          <input
            id="fullName"
            type="text"
            value={formData.fullName}
            onChange={(e) => onChange('fullName', e.target.value)}
            required
          />
        </div>

        <div className="bookingField">
          <label htmlFor="phone">Mobile Number</label>
          <input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => onChange('phone', e.target.value)}
            required
          />
        </div>

        <div className="bookingField">
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => onChange('email', e.target.value)}
            required
          />
        </div>

        <div className="bookingField isFull">
          <label htmlFor="address">Address (Optional)</label>
          <input
            id="address"
            type="text"
            value={formData.address}
            onChange={(e) => onChange('address', e.target.value)}
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
              <input type="checkbox" checked={checked} onChange={() => toggleAddOn(item.id)} />
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

  //cost calculation
  const calculateCostBreakdown = () => {
    let offerCost = 0
    let addOnsCost = 0

    if (selectedOffer?.price && selectedOffer?.offerType === 'daytour' && selectedOffer?.offerId === 'basic') {
      offerCost = selectedOffer.price * (parseInt(formData.guests) || 1)
    } else if (selectedOffer?.price) {
      offerCost = selectedOffer.price
    }

    //add-ons cost
    formData.selectedAddOns.forEach((addOnId) => {
      const addOn = addOns.find((item) => item.id === addOnId)
      if (addOn?.price) {
        addOnsCost += addOn.price
      }
    })

    const totalCost = offerCost + addOnsCost

    return {
      offerCost,
      addOnsCost,
      totalCost,
    }
  }

  const { offerCost, addOnsCost, totalCost } = calculateCostBreakdown()

  return (
    <div className="bookingReview">
      <p>
        <strong>Offer:</strong> {selectedOffer.title}
      </p>
      <p>
        <strong>Date:</strong> {formData.checkInDate || 'Not set'}
      </p>
      <p>
        <strong>Guests:</strong> {formData.guests || 'Not set'}
      </p>
      <p>
        <strong>Guest Name:</strong> {formData.fullName || 'Not set'}
      </p>
      <p>
        <strong>Add-ons:</strong> {selectedAddOnLabels.length ? selectedAddOnLabels.join(', ') : 'None'}
      </p>

      <div className="bookingCostBreakdown">
        <h3>Cost Breakdown</h3>
        <div className="costLine">
          <span>{selectedOffer.title}</span>
          <span className="costAmount">₱ {offerCost.toLocaleString('en-US')}</span>
        </div>
        {addOnsCost > 0 && (
          <div className="costLine">
            <span>Add-ons</span>
            <span className="costAmount">₱ {addOnsCost.toLocaleString('en-US')}</span>
          </div>
        )}
        <div className="costLine costTotal">
          <span>Total Amount</span>
          <span className="costAmount">₱ {totalCost.toLocaleString('en-US')}</span>
        </div>
      </div>

      <label className="bookingTerms">
        <input
          type="checkbox"
          checked={formData.termsAccepted}
          onChange={(e) => onChange('termsAccepted', e.target.checked)}
        />
        <span>I agree to the booking and cancellation policy.</span>
      </label>
    </div>
  )
}
