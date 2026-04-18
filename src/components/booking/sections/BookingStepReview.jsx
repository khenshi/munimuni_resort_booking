import { buildFullName } from '../utils/booking-form-utils'

function formatCurrency(value) {
  return `PHP ${value.toLocaleString('en-US')}`
}

function calculateCostBreakdown(selectedOffer, formData, addOns) {
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

export default function BookingStepReview({ formData, selectedOffer, addOns, selectedAddOnLabels, onChange }) {
  const { offerLabel, offerCost, addOnsCost, addOnCostLines, totalCost } = calculateCostBreakdown(selectedOffer, formData, addOns)
  const guestDisplayName = buildFullName(formData.firstName, formData.lastName)

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
        />
        <span>I agree to the booking and cancellation policy.</span>
      </label>
    </div>
  )
}