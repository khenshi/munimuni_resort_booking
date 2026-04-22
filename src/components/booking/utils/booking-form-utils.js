import { resolveAutoCheckOutDate } from './booking-utils'

export function createInitialBookingFormData({
  prefilledCheckInDate,
  prefilledCheckOutDate,
  prefilledGuests,
  stayTab,
}) {
  return {
    checkInDate: prefilledCheckInDate,
    checkOutDate: prefilledCheckInDate
      ? resolveAutoCheckOutDate(prefilledCheckInDate, stayTab)
      : prefilledCheckOutDate,
    guests: prefilledGuests,
    specialRequest: '',
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    address: '',
    termsAccepted: false,
  }
}

export function sanitizeGuestCountInput(rawValue, maxAllowedGuests) {
  const digitsOnly = String(rawValue ?? '').replace(/\D/g, '').slice(0, 3)
  if (!digitsOnly) return ''

  let nextGuestCount = Number.parseInt(digitsOnly, 10)
  if (maxAllowedGuests !== null && maxAllowedGuests > 0) {
    nextGuestCount = Math.min(nextGuestCount, maxAllowedGuests)
  }

  return String(nextGuestCount)
}

export function sanitizePhoneInput(rawValue) {
  const normalizedValue = String(rawValue ?? '')
  if (normalizedValue.startsWith('+')) {
    const digitsAfterPlus = normalizedValue.slice(1).replace(/\D/g, '').slice(0, 12)
    return `+${digitsAfterPlus}`
  }

  return normalizedValue.replace(/\D/g, '').slice(0, 11)
}

export function getGuestValidationMessage(guests, maxAllowedGuests) {
  const guestValue = String(guests ?? '').trim()
  if (!guestValue) return ''

  const guestCount = Number.parseInt(guestValue, 10)
  if (!Number.isFinite(guestCount) || guestCount <= 0) {
    return 'Number of guests must be greater than 0.'
  }

  if (maxAllowedGuests === 0) {
    return 'No available slots left for the selected date.'
  }

  if (maxAllowedGuests !== null && guestCount > maxAllowedGuests) {
    return `Number of guests cannot exceed ${maxAllowedGuests} for this offer.`
  }

  return ''
}

export function getGuestInfoErrors({ firstName, lastName, phone, email }) {
  const errors = {
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
  }

  const firstNameValue = String(firstName ?? '').trim()
  if (firstNameValue && firstNameValue.length < 2) {
    errors.firstName = 'First name must be at least 2 characters.'
  } else if (firstNameValue && !/^[a-zA-Z .'-]+$/.test(firstNameValue)) {
    errors.firstName = 'First name contains invalid characters.'
  }

  const lastNameValue = String(lastName ?? '').trim()
  if (lastNameValue && lastNameValue.length < 2) {
    errors.lastName = 'Last name must be at least 2 characters.'
  } else if (lastNameValue && !/^[a-zA-Z .'-]+$/.test(lastNameValue)) {
    errors.lastName = 'Last name contains invalid characters.'
  }

  const phoneValue = String(phone ?? '').trim()
  if (phoneValue && !/^(09\d{9}|\+639\d{9})$/.test(phoneValue)) {
    errors.phone = 'Use 11 digits (09XXXXXXXXX) or +639XXXXXXXXX.'
  }

  const emailValue = String(email ?? '').trim()
  if (emailValue && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
    errors.email = 'Enter a valid email address.'
  }

  return errors
}

export function buildFullName(firstName, lastName) {
  return [firstName, lastName]
    .map((value) => String(value ?? '').trim())
    .filter(Boolean)
    .join(' ')
}

export function getGuestCapacityHint(selectedOffer, checkInDate, maxAllowedGuests) {
  const isBasicDayTour = selectedOffer?.offerType === 'daytour' && selectedOffer?.offerId === 'basic'
  if (!isBasicDayTour || !checkInDate || maxAllowedGuests === null) return ''

  if (maxAllowedGuests > 0) {
    return `${maxAllowedGuests} resort slot${maxAllowedGuests > 1 ? 's' : ''} available on selected date.`
  }

  return 'No resort slots left on selected date.'
}