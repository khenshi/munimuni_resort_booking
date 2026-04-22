import { buildFullName } from '../utils/booking-form-utils'

function formatCurrency(value) {
  return `PHP ${value.toLocaleString('en-US')}`
}

function calculateCostBreakdown(selectedOffer, formData) {
  const guestCount = Math.max(1, Number.parseInt(formData.guests, 10) || 1)
  let offerCost = Number(selectedOffer?.price) || 0
  let offerLabel = selectedOffer.title

  if (selectedOffer?.offerType === 'daytour' && selectedOffer?.offerId === 'basic') {
    offerCost = (Number(selectedOffer?.price) || 0) * guestCount
    offerLabel = `${selectedOffer.title} (${guestCount} guest${guestCount > 1 ? 's' : ''})`
  }

  const totalCost = offerCost

  return {
    offerLabel,
    offerCost,
    totalCost,
  }
}

export default function BookingStepReview({ formData, selectedOffer, onChange }) {
  const { offerLabel, offerCost, totalCost } = calculateCostBreakdown(selectedOffer, formData)
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

      <div className="bookingCostBreakdown">
        <h3>Cost Breakdown</h3>
        <div className="costLine">
          <span>{offerLabel}</span>
          <span className="costAmount">{formatCurrency(offerCost)}</span>
        </div>

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
        <span>
          I agree to the{' '}
          <a href="/policies" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline', color: '#007bff' }}>
            booking and cancellation policy
          </a>.
        </span>
      </label>
    </div>
  )
}