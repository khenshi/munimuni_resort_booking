import { useMemo, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import LoginPageHeader from '../components/login/layout/LoginPageHeader'
import { readCurrentCustomer } from '../components/login/auth-storage'
import EditBookingForm from '../components/booking/forms/EditBookingForm'
import useEditBookingLogic from '../components/booking/state/useEditBookingLogic'
import { addOns } from '../data/packages'
import '../styles/pages/customer-detail-pages.css'

/**
 * EditBookingPage
 * Page wrapper that renders the booking edit form for an authenticated customer.
 * It uses a booking reference from the route and loads booking data from local storage.
 */
export default function EditBookingPage() {
  const { bookingReference } = useParams()
  const navigate = useNavigate()
  const currentCustomer = readCurrentCustomer()
  const decodedReference = useMemo(
    () => decodeURIComponent(bookingReference || ''),
    [bookingReference],
  )

  if (!currentCustomer) {
    return <Navigate to="/customer/login" replace />
  }

  const {
    existingBooking,
    selectedOffer,
    formData,
    onChange,
    toggleAddOn,
    submitBooking,
    canProceed,
    minCheckInDate,
    checkInValidationMessage,
    guestValidationMessage,
    guestInfoErrors,
    guestCapacityHint,
    maxAllowedGuests,
    selectedAddOnLabels,
    activeDateUnavailable,
    isSubmitting,
    submitError,
    submitSuccess,
  } = useEditBookingLogic(decodedReference, currentCustomer.id)

  const [step, setStep] = useState(1)

  const handleCancel = () => {
    if (existingBooking) {
      navigate(`/customer/bookings/${encodeURIComponent(decodedReference)}`)
    } else {
      navigate('/customer/dashboard')
    }
  }

  if (!existingBooking) {
    return (
      <div className="customerDetailPage">
        <LoginPageHeader />
        <main className="customerDetailMain">
          <section className="customerDetailCard">
            <p className="customerDetailKicker">Edit Booking</p>
            <h1 className="customerDetailTitle">Booking not found</h1>
            <p className="customerDetailDescription">
              We could not load the booking with reference <strong>{decodedReference}</strong>.
              Please return to your dashboard and try again.
            </p>
            <div className="customerDetailActions">
              <button className="customerDetailBtn isPrimary" onClick={() => navigate('/customer/dashboard')}>
                Back to Dashboard
              </button>
            </div>
          </section>
        </main>
      </div>
    )
  }

  return (
    <div className="customerDetailPage">
      <LoginPageHeader />
      <main className="customerDetailMain">
        <EditBookingForm
          pageHeading={`Edit booking for ${selectedOffer?.title ?? 'your stay'}`}
          selectedOffer={selectedOffer}
          formData={formData}
          step={step}
          setStep={setStep}
          submitBooking={submitBooking}
          canProceed={canProceed}
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
          activeDateUnavailable={activeDateUnavailable}
          isSubmitting={isSubmitting}
          submitError={submitError}
          submitSuccess={submitSuccess}
          onCancel={handleCancel}
        />
      </main>
    </div>
  )
}
