import BookingStepsIndicator from '../layout/BookingStepsIndicator'
import BookingStepContent from '../sections/BookingStepContent'

export default function EditBookingForm({
  pageHeading,
  selectedOffer,
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
  isSubmitting,
  submitError,
  submitSuccess,
  onCancel,
  onBackToDashboard,
}) {
  return (
    <main className="bookingMain">
      <section className="bookingShell" aria-labelledby="edit-booking-heading">
        <p className="bookingKicker">Edit Reservation</p>
        <h1 id="edit-booking-heading">{pageHeading}</h1>

        {submitSuccess ? (
          <section className="bookingForm editBookingSuccessShell" aria-live="polite">
            <header className="editBookingSuccessHeader">
              <p className="editBookingSuccessKicker">Confirmation</p>
              <h2>Booking Updated Successfully</h2>
            </header>

            <div className="bookingPanel editBookingSuccessPanel">
              <p className="editBookingSuccessMessage">
                Your edits for <strong>{selectedOffer?.title ?? 'this booking'}</strong> were saved.
                You can review your latest booking details anytime in your dashboard.
              </p>

              <div className="bookingActions editBookingSuccessActions">
                <button
                  type="button"
                  className="bookingActionBtn isPrimary"
                  onClick={onBackToDashboard}
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          </section>
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
                  activeDateUnavailable
                    ? `This offer is unavailable on ${formData.checkInDate}. Pick another check-in date to continue.`
                    : ''
                }
              />
            </div>

            <div className="bookingActions">
              <button
                type="button"
                className="bookingActionBtn isDanger"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </button>

              <button
                type="button"
                className="bookingActionBtn"
                disabled={step === 1 || isSubmitting}
                onClick={() => setStep((current) => Math.max(1, current - 1))}
              >
                Previous
              </button>

              {step < 3 ? (
                <button
                  type="button"
                  className="bookingActionBtn isPrimary"
                  disabled={!canProceed || isSubmitting}
                  onClick={() => setStep((current) => Math.min(3, current + 1))}
                >
                  Next Step
                </button>
              ) : (
                <button
                  type="submit"
                  className="bookingActionBtn isPrimary"
                  disabled={!canProceed || isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              )}
            </div>

            {submitError ? <p className="bookingFieldError">{submitError}</p> : null}
          </form>
        )}
      </section>
    </main>
  )
}
