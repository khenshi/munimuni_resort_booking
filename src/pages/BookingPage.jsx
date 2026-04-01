import { useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import BookingPageHeader from '../components/booking/BookingPageHeader'
import BookingStateNotice from '../components/booking/BookingStateNotice'
import BookingStepContent from '../components/booking/BookingStepContent'
import BookingStepsIndicator from '../components/booking/BookingStepsIndicator'
import { resolveSelectedOffer } from '../components/booking/booking-utils'
import { addOns } from '../components/packages/data'
import '../styles/pages/booking-page.css'

export default function BookingPage() {
  const location = useLocation()
  const query = new URLSearchParams(location.search)
  const offerType = query.get('offerType') ?? ''
  const offerId = query.get('offerId') ?? ''

  const selectedOffer = useMemo(() => {
    const fromState = location.state?.selectedOffer
    if (fromState?.title) return fromState
    return resolveSelectedOffer(offerType, offerId)
  }, [location.state, offerId, offerType])

  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    checkInDate: '',
    checkOutDate: '',
    guests: '',
    specialRequest: '',
    fullName: '',
    phone: '',
    email: '',
    address: '',
    selectedAddOns: [],
    termsAccepted: false,
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const onChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const toggleAddOn = (addOnId) => {
    setFormData((prev) => {
      const alreadySelected = prev.selectedAddOns.includes(addOnId)
      return {
        ...prev,
        selectedAddOns: alreadySelected
          ? prev.selectedAddOns.filter((id) => id !== addOnId)
          : [...prev.selectedAddOns, addOnId],
      }
    })
  }

  const canProceed = () => {
    if (step === 1) return Boolean(formData.checkInDate && formData.guests)
    if (step === 2) return Boolean(formData.fullName && formData.phone && formData.email)
    if (step === 3) return true
    if (step === 4) return Boolean(formData.termsAccepted)
    return false
  }

  const selectedAddOnLabels = formData.selectedAddOns
    .map((id) => addOns.find((item) => item.id === id)?.title)
    .filter(Boolean)

  const submitBooking = (e) => {
    e.preventDefault()
    if (!canProceed()) return
    setIsSubmitted(true)
  }

  return (
    <div className="bookingPage">
      <BookingPageHeader />
      <main className="bookingMain">
        <section className="bookingShell" aria-labelledby="booking-heading">
          <p className="bookingKicker">Reservation</p>
          <h1 id="booking-heading">Book Your Stay</h1>

          {!selectedOffer ? (
            <BookingStateNotice
              title="No selected offer yet"
              message="Please choose an offer first so we can pre-fill your booking details."
              actionTo="/packages"
              actionLabel="Browse Offers"
            />
          ) : isSubmitted ? (
            <BookingStateNotice
              title="Booking request submitted"
              message={`Thank you, ${formData.fullName || 'guest'}. We received your request for ${selectedOffer.title}. Our team will contact you shortly.`}
              actionTo="/packages"
              actionLabel="Back to Offers"
            />
          ) : (
            <form className="bookingForm" onSubmit={submitBooking}>
              <BookingStepsIndicator step={step} />

              <div className="bookingPanel">
                <BookingStepContent
                  step={step}
                  selectedOffer={selectedOffer}
                  formData={formData}
                  onChange={onChange}
                  toggleAddOn={toggleAddOn}
                  addOns={addOns}
                  selectedAddOnLabels={selectedAddOnLabels}
                />
              </div>

              <div className="bookingActions">
                <button
                  type="button"
                  className="bookingActionBtn"
                  disabled={step === 1}
                  onClick={() => setStep((s) => Math.max(1, s - 1))}
                >
                  Previous
                </button>

                {step < 4 ? (
                  <button
                    type="button"
                    className="bookingActionBtn isPrimary"
                    disabled={!canProceed()}
                    onClick={() => setStep((s) => Math.min(4, s + 1))}
                  >
                    Next Step
                  </button>
                ) : (
                  <button type="submit" className="bookingActionBtn isPrimary" disabled={!canProceed()}>
                    Confirm Booking
                  </button>
                )}
              </div>
            </form>
          )}
        </section>
      </main>
    </div>
  )
}
