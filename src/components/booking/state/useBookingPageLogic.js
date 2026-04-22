import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { resolveAutoCheckOutDate, resolveSelectedOffer } from '../utils/booking-utils'
import { addDaysToISODate, getTodayISODate } from '../../packages/utils/availability-utils'
import { isItemAvailableForDate } from '../../packages'
import { readCurrentCustomer } from '../../login/auth-storage'
import {
  buildFullName,
  createInitialBookingFormData,
  getGuestCapacityHint,
  getGuestInfoErrors,
  getGuestValidationMessage,
  sanitizeGuestCountInput,
  sanitizePhoneInput,
} from '../utils/booking-form-utils'
import {
  getActiveDateUnavailable,
  getCheckInValidationMessage,
  getMaxAllowedGuests,
  resolveSelectedAvailabilityItem,
} from '../utils/booking-validation-utils'


function calculateCostBreakdown(selectedOffer, formData) {
  const guestCount = Math.max(1, Number.parseInt(formData.guests, 10) || 1)
  let offerCost = Number(selectedOffer?.price) || 0

  if (selectedOffer?.offerType === 'daytour' && selectedOffer?.offerId === 'basic') {
    offerCost = (Number(selectedOffer?.price) || 0) * guestCount
  }

  return {
    room: offerCost,
    addOns: 0,
    rentals: 0,
    totalAmount: offerCost,
  }
}

export default function useBookingPageLogic() {
  const location = useLocation()
  const navigate = useNavigate()
  const query = new URLSearchParams(location.search)
  const navigationState = location.state ?? {}
  const currentPath = `${location.pathname}${location.search}`
  const prefillStayDates = navigationState.prefillStayDates ?? {}
  const selectedOfferFromState = navigationState.selectedOffer
  const currentCustomer = readCurrentCustomer()

  const offerType = query.get('offerType') ?? ''
  const offerId = query.get('offerId') ?? ''
  const prefilledCheckInDate = prefillStayDates.checkInDate ?? query.get('checkInDate') ?? ''
  const prefilledCheckOutDate = prefillStayDates.checkOutDate ?? query.get('checkOutDate') ?? ''
  const prefilledGuests = navigationState.prefillGuestCount ?? query.get('guests') ?? ''

  const selectedOffer = useMemo(() => {
    const resolvedOffer = resolveSelectedOffer(offerType, offerId)
    if (!selectedOfferFromState?.title) return resolvedOffer

    return {
      ...resolvedOffer,
      ...Object.fromEntries(
        Object.entries(selectedOfferFromState).filter(([, value]) => value !== undefined),
      ),
    }
  }, [selectedOfferFromState, offerId, offerType])

  const detailsTo = useMemo(() => {
    const detailOfferType = selectedOffer?.offerType ?? offerType
    const detailOfferId = selectedOffer?.offerId ?? offerId

    if (!detailOfferType || !detailOfferId) return '/packages'
    return `/packages/offers/${detailOfferType}/${detailOfferId}`
  }, [selectedOffer, offerType, offerId])

  const selectedAvailabilityItem = useMemo(
    () => resolveSelectedAvailabilityItem(selectedOffer?.offerType ?? offerType, selectedOffer?.offerId ?? offerId),
    [selectedOffer, offerType, offerId],
  )

  const [step, setStep] = useState(1)
  const stayTab = (selectedOffer?.offerType ?? offerType) === 'overnight' ? 'overnight' : 'daytour'
  const [formData, setFormData] = useState(() => createInitialBookingFormData({
    prefilledCheckInDate,
    prefilledCheckOutDate,
    prefilledGuests,
    stayTab,
  }))
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
      setFormData((prev) => ({
        ...prev,
        checkInDate: value,
        checkOutDate: resolveAutoCheckOutDate(value, stayTab),
      }))
      return
    }

    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const guestValidationMessage = useMemo(() => getGuestValidationMessage(formData.guests, maxAllowedGuests), [formData.guests, maxAllowedGuests])
  const guestInfoErrors = useMemo(
    () => getGuestInfoErrors(formData),
    [formData],
  )
  const hasGuestInfoErrors = Object.values(guestInfoErrors).some(Boolean)
  const checkInValidationMessage = useMemo(() => getCheckInValidationMessage(formData.checkInDate, todayISODate), [formData.checkInDate, todayISODate])

  const prefilledDateUnavailable = useMemo(
    () => Boolean(prefilledCheckInDate && selectedAvailabilityItem && !isItemAvailableForDate(selectedAvailabilityItem, prefilledCheckInDate)),
    [prefilledCheckInDate, selectedAvailabilityItem],
  )
  const isMissingPrefilledDate = Boolean(selectedAvailabilityItem) && !prefilledCheckInDate
  const activeDateUnavailable = useMemo(
    () => getActiveDateUnavailable(selectedAvailabilityItem, formData.checkInDate),
    [selectedAvailabilityItem, formData.checkInDate],
  )

  const pageHeading = 'Book Your Stay'
  const isAuthenticated = Boolean(currentCustomer?.id)

  const guestCapacityHint = useMemo(
    () => getGuestCapacityHint(selectedOffer, formData.checkInDate, maxAllowedGuests),
    [selectedOffer, formData.checkInDate, maxAllowedGuests],
  )

  const canProceed = useMemo(() => {
    if (step === 1) {
      const guestCount = Number.parseInt(formData.guests, 10)
      const hasBasicDetails = Boolean(formData.checkInDate) && Number.isFinite(guestCount) && guestCount > 0
      if (!hasBasicDetails) return false
      if (checkInValidationMessage) return false
      if (guestValidationMessage) return false

      if (!selectedAvailabilityItem) return true
      return isItemAvailableForDate(selectedAvailabilityItem, formData.checkInDate)
    }
    if (step === 2) {
      return Boolean(formData.firstName && formData.lastName && formData.phone && formData.email) && !hasGuestInfoErrors
    }
    if (step === 3) return Boolean(formData.termsAccepted)
    return false
  }, [
    step,
    formData,
    checkInValidationMessage,
    guestValidationMessage,
    selectedAvailabilityItem,
    hasGuestInfoErrors,
  ])

  const submitBooking = (e) => {
    e.preventDefault()
    if (!canProceed) return

    const fullName = buildFullName(formData.firstName, formData.lastName)
    const costBreakdown = calculateCostBreakdown(selectedOffer, formData)
    const bookingDraft = {
      bookingReference: null,
      selectedOffer: {
        title: selectedOffer?.title,
        subtitle: selectedOffer?.subtitle,
        price: selectedOffer?.price,
        offerType: selectedOffer?.offerType,
        offerId: selectedOffer?.offerId,
        priceInfo: selectedOffer?.priceInfo,
        paxLabel: selectedOffer?.paxLabel,
        paxMin: selectedOffer?.paxMin,
        paxMax: selectedOffer?.paxMax,
        imageUrl: selectedOffer?.imageUrl,
      },
      checkInDate: formData.checkInDate,
      checkOutDate: formData.checkOutDate,
      guests: formData.guests,
      specialRequest: formData.specialRequest,
      fullName,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      termsAccepted: formData.termsAccepted,
      itemizedCosts: {
        room: costBreakdown.room,
        addOns: costBreakdown.addOns,
        rentals: costBreakdown.rentals,
      },
      totalAmount: costBreakdown.totalAmount,
    }

    navigate('/customer/payment', {
      state: {
        source: 'booking-checkout',
        bookingDraft,
      },
    })
  }

  return {
    detailsTo,
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
    onChange,
    minCheckInDate,
    checkInValidationMessage,
    guestValidationMessage,
    guestInfoErrors,
    guestCapacityHint,
    maxAllowedGuests,
    activeDateUnavailable,
    isAuthenticated,
    loginActionState: {
      returnTo: currentPath,
      authMode: 'signin',
    },
  }
}