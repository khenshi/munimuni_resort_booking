import { useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import BookingPageHeader from '../components/booking/BookingPageHeader'
import BookingStateNotice from '../components/booking/BookingStateNotice'
import BookingStepContent from '../components/booking/BookingStepContent'
import BookingStepsIndicator from '../components/booking/BookingStepsIndicator'
import { resolveSelectedOffer } from '../components/booking/booking-utils'
import { isItemAvailableForDate } from '../components/packages'
import { addOns, cottages, dayTourOffers, overnightOffers } from '../data/packages'
import '../styles/pages/booking-page.css'

function generateBookingReference(selectedOffer) {
  const offerTypePrefix = (selectedOffer?.offerType ?? 'gen').slice(0, 3).toUpperCase()
  const randomCode = Math.floor(1000 + Math.random() * 9000)
  const dateCode = new Date().toISOString().slice(2, 10).replace(/-/g, '')

  return `MMR-${offerTypePrefix}-${dateCode}-${randomCode}`
}

export default function BookingPage() {
  const location = useLocation()
  const query = new URLSearchParams(location.search)
  const offerType = query.get('offerType') ?? ''
  const offerId = query.get('offerId') ?? ''
  const prefilledCheckInDate = location.state?.prefillStayDates?.checkInDate ?? query.get('checkInDate') ?? ''
  const prefilledCheckOutDate = location.state?.prefillStayDates?.checkOutDate ?? query.get('checkOutDate') ?? ''
  const prefilledGuests = location.state?.prefillGuestCount ?? query.get('guests') ?? ''

  const selectedOffer = useMemo(() => {
    const fromState = location.state?.selectedOffer
    if (fromState?.title) return fromState
    return resolveSelectedOffer(offerType, offerId)
  }, [location.state, offerId, offerType])

  const detailsTo = useMemo(() => {
    const detailOfferType = selectedOffer?.offerType ?? offerType
    const detailOfferId = selectedOffer?.offerId ?? offerId

    if (!detailOfferType || !detailOfferId) return '/packages'
    return `/packages/offers/${detailOfferType}/${detailOfferId}`
  }, [selectedOffer, offerType, offerId])

  const selectedAvailabilityItem = useMemo(() => {
    if (offerType === 'daytour' && offerId === 'basic') {
      return dayTourOffers.find((item) => item.id === 'basic') ?? null
    }

    if (offerType === 'daytour' && offerId.startsWith('cottage-')) {
      const cottageId = offerId.replace('cottage-', '')
      return cottages.find((item) => item.id === cottageId) ?? null
    }

    if (offerType === 'overnight') {
      return overnightOffers.find((item) => item.id === offerId) ?? null
    }

    return null
  }, [offerType, offerId])

  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    checkInDate: prefilledCheckInDate,
    checkOutDate: prefilledCheckOutDate,
    guests: prefilledGuests,
    specialRequest: '',
    fullName: '',
    phone: '',
    email: '',
    address: '',
    selectedAddOns: [],
    termsAccepted: false,
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [bookingReference, setBookingReference] = useState('')

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
    if (step === 1) {
      const hasBasicDetails = Boolean(formData.checkInDate && formData.guests)
      if (!hasBasicDetails) return false

      if (!selectedAvailabilityItem) return true
      return isItemAvailableForDate(selectedAvailabilityItem, formData.checkInDate)
    }
    if (step === 2) return Boolean(formData.fullName && formData.phone && formData.email)
    if (step === 3) return true
    if (step === 4) return Boolean(formData.termsAccepted)
    return false
  }

  const prefilledDateUnavailable = Boolean(
    prefilledCheckInDate && selectedAvailabilityItem && !isItemAvailableForDate(selectedAvailabilityItem, prefilledCheckInDate),
  )
  const isMissingPrefilledDate = Boolean(selectedAvailabilityItem) && !prefilledCheckInDate

  const activeDateUnavailable = Boolean(
    formData.checkInDate && selectedAvailabilityItem && !isItemAvailableForDate(selectedAvailabilityItem, formData.checkInDate),
  )

  const selectedAddOnLabels = formData.selectedAddOns
    .map((id) => addOns.find((item) => item.id === id)?.title)
    .filter(Boolean)

  const submitBooking = (e) => {
    e.preventDefault()
    if (!canProceed()) return

    setBookingReference(generateBookingReference(selectedOffer))
    setIsSubmitted(true)
  }

  return (
    <div className="bookingPage">
      <BookingPageHeader detailsTo={detailsTo} />
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
          ) : isMissingPrefilledDate ? (
            <BookingStateNotice
              title="Select date first"
              message="Please choose a check-in date from the offers page before continuing to booking."
              actionTo="/packages"
              actionLabel="Choose Date"
            />
          ) : prefilledDateUnavailable ? (
            <BookingStateNotice
              title="Selected date is unavailable"
              message={`The selected offer is not available on ${prefilledCheckInDate}. Please choose another date before booking.`}
              actionTo="/packages"
              actionLabel="Choose Another Date"
            />
          ) : isSubmitted ? (
            <BookingStateNotice
              title="Booking request submitted"
              message={`Thank you, ${formData.fullName || 'guest'}. Your request for ${selectedOffer.title} is in our queue.
Reference: ${bookingReference}
Our reservations team will contact you within 24 hours via ${formData.email || 'your contact details'} to confirm availability and final payment details.`}
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
                  availabilityMessage={
                    activeDateUnavailable ? `This offer is unavailable on ${formData.checkInDate}. Pick another check-in date to continue.` : ''
                  }
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
