import { useMemo, useState } from 'react'
import { getCustomerBooking, updateCustomerBooking } from '../../login/bookings-storage'
import { resolveAutoCheckOutDate, resolveSelectedOffer } from '../utils/booking-utils'
import { getTodayISODate, addDaysToISODate } from '../../packages/utils/availability-utils'
import { isItemAvailableForDate } from '../../packages'
import { addOns } from '../../../data/packages'
import {
  getGuestCapacityHint,
  getGuestInfoErrors,
  getGuestValidationMessage,
  getSelectedAddOnLabels,
  sanitizeGuestCountInput,
  sanitizePhoneInput,
} from '../utils/booking-form-utils'
import {
  getActiveDateUnavailable,
  getCheckInValidationMessage,
  getMaxAllowedGuests,
  resolveSelectedAvailabilityItem,
} from '../utils/booking-validation-utils'

function createInitialEditBookingFormData(existingBooking) {
  return {
    checkInDate: existingBooking?.checkInDate || '',
    checkOutDate: existingBooking?.checkOutDate || '',
    guests: String(existingBooking?.guests ?? ''),
    firstName: existingBooking?.fullName?.split(' ')[0] || '',
    lastName: existingBooking?.fullName?.split(' ').slice(1).join(' ') || '',
    phone: existingBooking?.phone || '',
    email: existingBooking?.email || '',
    address: existingBooking?.address || '',
    specialRequest: existingBooking?.specialRequest || '',
    selectedAddOns: Array.isArray(existingBooking?.selectedAddOns) ? [...existingBooking.selectedAddOns] : [],
    termsAccepted: existingBooking?.termsAccepted || false,
  }
}

export default function useEditBookingLogic(bookingReference, customerId) {
  const existingBooking = useMemo(
    () => getCustomerBooking(customerId, bookingReference),
    [customerId, bookingReference],
  )

  const [formData, setFormData] = useState(() => createInitialEditBookingFormData(existingBooking))

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const selectedOffer = useMemo(() => {
    if (!existingBooking?.selectedOffer) return null

    const resolvedOffer = resolveSelectedOffer(
      existingBooking.selectedOffer.offerType,
      existingBooking.selectedOffer.offerId,
    )

    return {
      ...resolvedOffer,
      ...existingBooking.selectedOffer,
    }
  }, [existingBooking])

  const selectedAvailabilityItem = useMemo(
    () => resolveSelectedAvailabilityItem(selectedOffer?.offerType, selectedOffer?.offerId),
    [selectedOffer],
  )

  const todayISODate = getTodayISODate()
  const minCheckInDate = addDaysToISODate(todayISODate, 1)

  const maxAllowedGuests = useMemo(
    () => getMaxAllowedGuests(selectedOffer, selectedAvailabilityItem, formData.checkInDate),
    [selectedOffer, selectedAvailabilityItem, formData.checkInDate],
  )

  const onChange = (key, value) => {
    if (key === 'checkOutDate') return

    if (key === 'guests') {
      const sanitizedGuests = sanitizeGuestCountInput(value, maxAllowedGuests)
      setFormData((prev) => ({ ...prev, guests: sanitizedGuests }))
      return
    }

    if (key === 'phone') {
      const sanitizedPhone = sanitizePhoneInput(value)
      setFormData((prev) => ({ ...prev, phone: sanitizedPhone }))
      return
    }

    if (key === 'checkInDate') {
      const stayTab = selectedOffer?.offerType === 'overnight' ? 'overnight' : 'daytour'
      setFormData((prev) => ({
        ...prev,
        checkInDate: value,
        checkOutDate: resolveAutoCheckOutDate(value, stayTab),
      }))
      return
    }

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

  const guestValidationMessage = useMemo(
    () => getGuestValidationMessage(formData.guests, maxAllowedGuests),
    [formData.guests, maxAllowedGuests],
  )
  const guestInfoErrors = useMemo(() => getGuestInfoErrors(formData), [formData])
  const hasGuestInfoErrors = Object.values(guestInfoErrors).some(Boolean)

  const checkInValidationMessage = useMemo(
    () => getCheckInValidationMessage(formData.checkInDate, todayISODate),
    [formData.checkInDate, todayISODate],
  )

  const activeDateUnavailable = useMemo(
    () => getActiveDateUnavailable(selectedAvailabilityItem, formData.checkInDate),
    [selectedAvailabilityItem, formData.checkInDate],
  )

  const hasChanges = useMemo(() => {
    return (
      formData.checkInDate !== (existingBooking?.checkInDate || '') ||
      formData.checkOutDate !== (existingBooking?.checkOutDate || '') ||
      formData.guests !== String(existingBooking?.guests ?? '') ||
      formData.firstName !== (existingBooking?.fullName?.split(' ')[0] || '') ||
      formData.lastName !==
        (existingBooking?.fullName?.split(' ').slice(1).join(' ') || '') ||
      formData.phone !== (existingBooking?.phone || '') ||
      formData.email !== (existingBooking?.email || '') ||
      formData.address !== (existingBooking?.address || '') ||
      formData.specialRequest !== (existingBooking?.specialRequest || '') ||
      JSON.stringify(formData.selectedAddOns) !==
        JSON.stringify(
          Array.isArray(existingBooking?.selectedAddOns)
            ? existingBooking.selectedAddOns
            : [],
        )
    );
  }, [formData, existingBooking])

  const canProceed = useMemo(() => {
    const guestCount = Number.parseInt(formData.guests, 10);
    const hasBasicDetails =
      Boolean(formData.checkInDate) &&
      Number.isFinite(guestCount) &&
      guestCount > 0;
    if (!hasBasicDetails) return false;
    if (checkInValidationMessage) return false;
    if (guestValidationMessage) return false;

    if (!selectedAvailabilityItem) return true;
    return isItemAvailableForDate(
      selectedAvailabilityItem,
      formData.checkInDate,
    );
  }, [
    formData,
    checkInValidationMessage,
    guestValidationMessage,
    selectedAvailabilityItem,
  ]);

  const submitBooking = (e) => {
    e?.preventDefault?.()

    if (!canProceed || !customerId || !existingBooking) {
      setSubmitError('Cannot submit booking at this time.')
      return
    }

    if (!hasChanges) {
      setSubmitError('No changes detected. Please modify at least one field.')
      return
    }

    setIsSubmitting(true)
    setSubmitError('')
    setSubmitSuccess(false)

    try {
      const updatedBooking = {
        checkInDate: formData.checkInDate,
        checkOutDate: formData.checkOutDate,
        guests: formData.guests,
        specialRequest: formData.specialRequest,
        fullName: `${formData.firstName} ${formData.lastName}`.trim(),
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        selectedAddOns: formData.selectedAddOns,
        termsAccepted: formData.termsAccepted,
      }

      updateCustomerBooking(customerId, bookingReference, updatedBooking)
      setSubmitSuccess(true)
      setIsSubmitting(false)
    } catch (error) {
      setSubmitError(`Failed to update booking: ${error.message}`)
      setIsSubmitting(false)
    }
  }

  const selectedAddOnLabels = useMemo(
    () => getSelectedAddOnLabels(formData.selectedAddOns, addOns),
    [formData.selectedAddOns],
  )

  const guestCapacityHint = useMemo(
    () => getGuestCapacityHint(selectedOffer, formData.checkInDate, maxAllowedGuests),
    [selectedOffer, formData.checkInDate, maxAllowedGuests],
  )

  const error = existingBooking ? '' : 'Booking not found'

  return {
    existingBooking,
    error,
    selectedOffer,
    bookingReference,
    formData,
    onChange,
    toggleAddOn,
    guestValidationMessage,
    guestInfoErrors,
    checkInValidationMessage,
    guestCapacityHint,
    maxAllowedGuests,
    selectedAddOnLabels,
    activeDateUnavailable,
    submitBooking,
    canProceed,
    hasChanges,
    isSubmitting,
    submitError,
    submitSuccess,
    minCheckInDate,
    todayISODate,
  }
}
