import BookingStepsIndicator from '../layout/BookingStepsIndicator'
import BookingStepContent from '../sections/BookingStepContent'

/**
 * EditBookingForm
 * Reusable booking edit form that renders the same multi-step booking flow
 * used by the regular booking page, but with edit-specific actions.
 *
 * @param {object} props
 * @param {string} props.pageHeading
 * @param {object} props.selectedOffer
 * @param {object} props.formData
 * @param {number} props.step
 * @param {function} props.setStep
 * @param {function} props.submitBooking
 * @param {boolean} props.canProceed
 * @param {string} props.minCheckInDate
 * @param {string} props.checkInValidationMessage
 * @param {string} props.guestValidationMessage
 * @param {object} props.guestInfoErrors
 * @param {string} props.guestCapacityHint
 * @param {number|null} props.maxAllowedGuests
 * @param {function} props.onChange
 * @param {function} props.toggleAddOn
 * @param {Array} props.addOns
 * @param {Array} props.selectedAddOnLabels
 * @param {string} props.activeDateUnavailable
 * @param {boolean} props.isSubmitting
 * @param {string} props.submitError
 * @param {boolean} props.submitSuccess
 * @param {function} [props.onCancel]
 */
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
  toggleAddOn,
  addOns,
  selectedAddOnLabels,
  activeDateUnavailable,
  isSubmitting,
  submitError,
  submitSuccess,
  onCancel,
}) {
  return (
    <main className="bookingMain">
      <section className="bookingShell" aria-labelledby="edit-booking-heading">
        <p className="bookingKicker">Edit Reservation</p>
        <h1 id="edit-booking-heading">{pageHeading}</h1>

        {submitSuccess ? (
          <div className="bookingStateNotice bookingStateNoticeSuccess">
            <h2>Booking Updated</h2>
            <p>Your booking changes have been saved successfully.</p>
          </div>
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
                toggleAddOn={toggleAddOn}
                addOns={addOns}
                selectedAddOnLabels={selectedAddOnLabels}
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

              {step < 4 ? (
                <button
                  type="button"
                  className="bookingActionBtn isPrimary"
                  disabled={!canProceed || isSubmitting}
                  onClick={() => setStep((current) => Math.min(4, current + 1))}
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
