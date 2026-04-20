import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { resolveAutoCheckOutDate, resolveSelectedOffer } from '../utils/booking-utils'
import { addDaysToISODate, getTodayISODate } from '../../packages/utils/availability-utils'
import { isItemAvailableForDate } from '../../packages'
import { readCurrentCustomer } from '../../login/auth-storage'
import { addOns, cottages, dayTourOffers, overnightOffers } from '../../../data/packages'
import {
  buildFullName,
  createInitialBookingFormData,
  getGuestCapacityHint,
  getGuestInfoErrors,
  getGuestValidationMessage,
  getSelectedAddOnLabels,
  sanitizeGuestCountInput,
  sanitizePhoneInput,
} from '../utils/booking-form-utils'

const PAYMENT_DRAFT_STORAGE_KEY = 'munimuni-payment-draft'

function calculateCostBreakdown(selectedOffer, formData) {
  const guestCount = Math.max(1, Number.parseInt(formData.guests, 10) || 1)
  let offerCost = Number(selectedOffer?.price) || 0

  if (selectedOffer?.offerType === 'daytour' && selectedOffer?.offerId === 'basic') {
    offerCost = (Number(selectedOffer?.price) || 0) * guestCount
  }

  const addOnsCost = formData.selectedAddOns.reduce((total, addOnId) => {
    const addOn = addOns.find((item) => item.id === addOnId)
    return total + (Number(addOn?.price) || 0)
  }, 0)

  return {
    room: offerCost,
    addOns: addOnsCost,
    rentals: 0,
    totalAmount: offerCost + addOnsCost,
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

  const availabilityOfferType = selectedOffer?.offerType ?? offerType
  const availabilityOfferId = selectedOffer?.offerId ?? offerId

  const selectedAvailabilityItem = useMemo(() => {
    if (availabilityOfferType === 'daytour' && availabilityOfferId === 'basic') {
      return dayTourOffers.find((item) => item.id === 'basic') ?? null
    }

    if (availabilityOfferType === 'daytour' && availabilityOfferId.startsWith('cottage-')) {
      const cottageId = availabilityOfferId.replace('cottage-', '')
      return cottages.find((item) => item.id === cottageId) ?? null
    }

    if (availabilityOfferType === 'overnight') {
      return overnightOffers.find((item) => item.id === availabilityOfferId) ?? null
    }

    return null
  }, [availabilityOfferType, availabilityOfferId])

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

  const maxAllowedGuests = useMemo(() => {
    if (selectedOffer?.offerType === 'daytour' && selectedOffer?.offerId === 'basic') {
      const capacity = Number(selectedAvailabilityItem?.availability?.dailySlotCapacity)
      if (!Number.isFinite(capacity) || capacity <= 0) return null

      if (!formData.checkInDate) return capacity

      const blockedDates = selectedAvailabilityItem?.availability?.unavailableCheckInDates ?? []
      if (blockedDates.includes(formData.checkInDate)) return 0

      const reservedGuestsByDate = selectedAvailabilityItem?.availability?.reservedGuestsByDate ?? {}
      const reservedGuests = Number(reservedGuestsByDate[formData.checkInDate] ?? 0)
      const safeReservedGuests = Number.isFinite(reservedGuests) ? reservedGuests : 0
      return Math.max(0, capacity - safeReservedGuests)
    }

    const staticMaxGuests = Number(selectedOffer?.paxMax)
    return Number.isFinite(staticMaxGuests) ? staticMaxGuests : null
  }, [selectedOffer, selectedAvailabilityItem, formData.checkInDate])

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
  const guestInfoErrors = useMemo(
    () => getGuestInfoErrors(formData),
    [formData],
  )
  const hasGuestInfoErrors = Object.values(guestInfoErrors).some(Boolean)
  const checkInValidationMessage = useMemo(() => {
    if (!formData.checkInDate) return ''
    return formData.checkInDate <= todayISODate
      ? 'Check-in date cannot be today or in the past.'
      : ''
  }, [formData.checkInDate, todayISODate])

  const prefilledDateUnavailable = useMemo(
    () => Boolean(prefilledCheckInDate && selectedAvailabilityItem && !isItemAvailableForDate(selectedAvailabilityItem, prefilledCheckInDate)),
    [prefilledCheckInDate, selectedAvailabilityItem],
  )
  const isMissingPrefilledDate = Boolean(selectedAvailabilityItem) && !prefilledCheckInDate
  const activeDateUnavailable = useMemo(
    () => Boolean(formData.checkInDate && selectedAvailabilityItem && !isItemAvailableForDate(selectedAvailabilityItem, formData.checkInDate)),
    [formData.checkInDate, selectedAvailabilityItem],
  )

  const pageHeading = 'Book Your Stay'
  const isAuthenticated = Boolean(currentCustomer?.id)

  const selectedAddOnLabels = useMemo(
    () => getSelectedAddOnLabels(formData.selectedAddOns, addOns),
    [formData.selectedAddOns],
  )

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
    if (step === 3) return true
    if (step === 4) return Boolean(formData.termsAccepted)
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
        price: selectedOffer?.price,
        offerType: selectedOffer?.offerType,
        offerId: selectedOffer?.offerId,
        priceInfo: selectedOffer?.priceInfo,
      },
      checkInDate: formData.checkInDate,
      checkOutDate: formData.checkOutDate,
      guests: formData.guests,
      specialRequest: formData.specialRequest,
      fullName,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      selectedAddOns: formData.selectedAddOns,
      termsAccepted: formData.termsAccepted,
      itemizedCosts: {
        room: costBreakdown.room,
        addOns: costBreakdown.addOns,
        rentals: costBreakdown.rentals,
      },
      totalAmount: costBreakdown.totalAmount,
    }

    window.sessionStorage.setItem(PAYMENT_DRAFT_STORAGE_KEY, JSON.stringify(bookingDraft))
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
    toggleAddOn,
    minCheckInDate,
    checkInValidationMessage,
    guestValidationMessage,
    guestInfoErrors,
    guestCapacityHint,
    maxAllowedGuests,
    selectedAddOnLabels,
    activeDateUnavailable,
    isAuthenticated,
    loginActionState: {
      returnTo: currentPath,
      authMode: 'signin',
    },
  }
}