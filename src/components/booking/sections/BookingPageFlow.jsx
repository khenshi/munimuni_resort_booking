import BookingStateNotice from './BookingStateNotice'
import BookingStepContent from './BookingStepContent'
import BookingStepsIndicator from '../layout/BookingStepsIndicator'

export default function BookingPageFlow({
  pageHeading,
  selectedOffer,
  prefilledCheckInDate,
  isMissingPrefilledDate,
  prefilledDateUnavailable,
  formData,
  step,
  setStep,
  submitBooking,
  canProceed,
  minCheckInDate,
  checkInValidationMessage,
  guestValidationMessage,
  guestInfoErrors,
  guestCapacityHint,
  maxAllowedGuests,
  onChange,
  activeDateUnavailable,
}) {
  return (
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
        ) : (
          <form className="bookingForm" onSubmit={submitBooking}>
            <BookingStepsIndicator step={step} />

            <div className="bookingPanel">
              <BookingStepContent
                step={step}
                selectedOffer={selectedOffer}
                formData={formData}
                minCheckInDate={minCheckInDate}
                checkInValidationMessage={checkInValidationMessage}
                guestValidationMessage={guestValidationMessage}
                guestInfoErrors={guestInfoErrors}
                guestCapacityHint={guestCapacityHint}
                maxAllowedGuests={maxAllowedGuests}
                onChange={onChange}
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

              {step < 3 ? (
                <button
                  type="button"
                  className="bookingActionBtn isPrimary"
                  disabled={!canProceed}
                  onClick={() => setStep((s) => Math.min(3, s + 1))}
                >
                  Next Step
                </button>
              ) : (
                <button type="submit" className="bookingActionBtn isPrimary" disabled={!canProceed}>
                  Proceed to Payment
                </button>
              )}
            </div>
          </form>
        )}
      </section>
    </main>
  )
}
