import { useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import BookingPageHeader from '../components/booking/BookingPageHeader'
import BookingStateNotice from '../components/booking/BookingStateNotice'
import BookingStepContent from '../components/booking/BookingStepContent'
import BookingStepsIndicator from '../components/booking/BookingStepsIndicator'
import { resolveSelectedOffer } from '../components/booking/booking-utils'
import { isItemAvailableForDate } from '../components/packages'
import { readCurrentCustomer } from '../components/login/auth-storage'
import { addCustomerBooking, updateCustomerBooking } from '../components/login/bookings-storage'
import { addOns, cottages, dayTourOffers, overnightOffers } from '../data/packages'
import '../styles/pages/booking-page.css'

function generateBookingReference(selectedOffer) {
  const offerTypePrefix = (selectedOffer?.offerType ?? 'gen').slice(0, 3).toUpperCase()
  const randomCode = Math.floor(1000 + Math.random() * 9000)
  const dateCode = new Date().toISOString().slice(2, 10).replace(/-/g, '')

  return `MMR-${offerTypePrefix}-${dateCode}-${randomCode}`
}

function getDaysUntilISODate(isoDate) {
  if (!isoDate) return Infinity
  const [year, month, day] = isoDate.split('-').map(Number)
  if (!year || !month || !day) return Infinity

  const checkInUtc = Date.UTC(year, month - 1, day)
  const today = new Date()
  const todayUtc = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())

  return Math.floor((checkInUtc - todayUtc) / (1000 * 60 * 60 * 24))
}

export default function BookingPage() {
  const location = useLocation()
  const query = new URLSearchParams(location.search)
  const offerType = query.get('offerType') ?? ''
  const offerId = query.get('offerId') ?? ''
  const isEditMode = location.state?.mode === 'edit' || query.get('mode') === 'edit'
  const bookingData = location.state?.booking ?? null
  const prefilledCheckInDate = bookingData?.checkInDate ?? location.state?.prefillStayDates?.checkInDate ?? query.get('checkInDate') ?? ''
  const prefilledCheckOutDate = bookingData?.checkOutDate ?? location.state?.prefillStayDates?.checkOutDate ?? query.get('checkOutDate') ?? ''
  const prefilledGuests = bookingData?.guests ?? location.state?.prefillGuestCount ?? query.get('guests') ?? ''
  const prefilledFullName = bookingData?.fullName ?? ''
  const prefilledPhone = bookingData?.phone ?? ''
  const prefilledEmail = bookingData?.email ?? ''
  const prefilledAddress = bookingData?.address ?? ''
  const prefilledSpecialRequest = bookingData?.specialRequest ?? ''
  const prefilledSelectedAddOns = bookingData?.selectedAddOns ?? []
  const prefilledTermsAccepted = bookingData?.termsAccepted ?? false

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
    specialRequest: prefilledSpecialRequest,
    fullName: prefilledFullName,
    phone: prefilledPhone,
    email: prefilledEmail,
    address: prefilledAddress,
    selectedAddOns: prefilledSelectedAddOns,
    termsAccepted: prefilledTermsAccepted,
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
    if (isFormDisabled) return false

    if (step === 1) {
      const guestCount = Number.parseInt(formData.guests, 10)
      const hasBasicDetails = Boolean(formData.checkInDate) && Number.isFinite(guestCount) && guestCount > 0
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

  const daysUntilCheckIn = getDaysUntilISODate(formData.checkInDate)
  const editAllowed = !isEditMode || daysUntilCheckIn > 7
  const editRestrictionMessage = isEditMode && formData.checkInDate && !editAllowed
    ? `Booking edits are only allowed more than 7 days before check-in. Only ${Math.max(daysUntilCheckIn, 0)} day(s) remain until ${formData.checkInDate}.`
    : ''
  const isFormDisabled = isEditMode && !editAllowed
  const pageHeading = isEditMode ? 'Edit Your Reservation' : 'Book Your Stay'

  const selectedAddOnLabels = formData.selectedAddOns
    .map((id) => addOns.find((item) => item.id === id)?.title)
    .filter(Boolean)

  const submitBooking = (e) => {
    e.preventDefault()
    if (!canProceed()) return

    const reference = generateBookingReference(selectedOffer)
    setBookingReference(reference)

    // Save booking to storage
    const currentCustomer = readCurrentCustomer()
    
    if (currentCustomer?.id) {
      const bookingData = {
        bookingReference: reference,
        selectedOffer: {
          title: selectedOffer?.title,
          price: selectedOffer?.price,
          offerType: selectedOffer?.offerType,
          offerId: selectedOffer?.offerId,
          priceInfo: selectedOffer?.priceInfo,
        },
        checkInDate: formData.checkInDate,
        checkOutDate: formData.checkOutDate,
        guests: formData.guests,
        specialRequest: formData.specialRequest,
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        selectedAddOns: formData.selectedAddOns,
        termsAccepted: formData.termsAccepted,
      }

      if (isEditMode && bookingData.bookingReference) {
        updateCustomerBooking(currentCustomer.id, bookingData.bookingReference, bookingData)
      } else {
        addCustomerBooking(currentCustomer.id, bookingData)
      }
    }

    setIsSubmitted(true)
  }

  return (
    <div className="bookingPage">
      <BookingPageHeader detailsTo={detailsTo} />
      <main className="bookingMain">
        <section className="bookingShell" aria-labelledby="booking-heading">
          <p className="bookingKicker">Reservation</p>
          <h1 id="booking-heading">{pageHeading}</h1>

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
              title={isEditMode ? 'Booking update submitted' : 'Booking request submitted'}
              message={isEditMode ? `Thank you, ${formData.fullName || 'guest'}. Your update request for ${selectedOffer.title} is in our queue. Reference: ${bookingReference}. Our reservations team will contact you within 24 hours via ${formData.email || 'your contact details'} to confirm the final details.` : `Thank you, ${formData.fullName || 'guest'}. Your request for ${selectedOffer.title} is in our queue.
Reference: ${bookingReference}
Our reservations team will contact you within 24 hours via ${formData.email || 'your contact details'} to confirm availability and final payment details.`}
              actionTo="/packages"
              actionLabel="Back to Offers"
            />
          ) : (
            <form className="bookingForm" onSubmit={submitBooking}>
              <BookingStepsIndicator step={step} />

              <div className="bookingPanel">
                {editRestrictionMessage ? <p className="bookingInlineWarning">{editRestrictionMessage}</p> : null}
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
                  disabled={isFormDisabled}
                  restrictionMessage={editRestrictionMessage}
                />
              </div>

              <div className="bookingActions">
                <button
                  type="button"
                  className="bookingActionBtn"
                  disabled={step === 1 || isFormDisabled}
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
