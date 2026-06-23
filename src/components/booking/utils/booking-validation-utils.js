import { cottages, dayTourOffers, overnightOffers } from '../../../data/packages'
import { isItemAvailableForDate } from '../../packages/packages-list-page'

export function resolveSelectedAvailabilityItem(offerType, offerId) {
  if (offerType === 'daytour' && offerId === 'basic') {
    return dayTourOffers.find((item) => item.id === 'basic') ?? null
  }

  if (offerType === 'daytour' && offerId?.startsWith('cottage-')) {
    const cottageId = offerId.replace('cottage-', '')
    return cottages.find((item) => item.id === cottageId) ?? null
  }

  if (offerType === 'overnight') {
    return overnightOffers.find((item) => item.id === offerId) ?? null
  }

  return null
}

export function getMaxAllowedGuests(selectedOffer, selectedAvailabilityItem, checkInDate) {
  if (selectedOffer?.offerType === 'daytour' && selectedOffer?.offerId === 'basic') {
    const capacity = Number(selectedAvailabilityItem?.availability?.dailySlotCapacity)
    if (!Number.isFinite(capacity) || capacity <= 0) return null

    if (!checkInDate) return capacity

    const blockedDates = selectedAvailabilityItem?.availability?.unavailableCheckInDates ?? []
    if (blockedDates.includes(checkInDate)) return 0

    const reservedGuestsByDate = selectedAvailabilityItem?.availability?.reservedGuestsByDate ?? {}
    const reservedGuests = Number(reservedGuestsByDate[checkInDate] ?? 0)
    const safeReservedGuests = Number.isFinite(reservedGuests) ? reservedGuests : 0
    return Math.max(0, capacity - safeReservedGuests)
  }

  const staticMaxGuests = Number(selectedOffer?.paxMax)
  return Number.isFinite(staticMaxGuests) ? staticMaxGuests : null
}

export function getCheckInValidationMessage(checkInDate, todayISODate) {
  if (!checkInDate) return ''
  return checkInDate <= todayISODate ? 'Check-in date cannot be today or in the past.' : ''
}

export function getActiveDateUnavailable(selectedAvailabilityItem, checkInDate) {
  return Boolean(checkInDate && selectedAvailabilityItem && !isItemAvailableForDate(selectedAvailabilityItem, checkInDate))
}