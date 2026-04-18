export const defaultFilters = {
  sortBy: 'recommended',
  paxValue: '',
  checkInDate: '',
}

export const sortByLabelByValue = {
  recommended: 'Recommended',
  'price-asc': 'Price: Low to High',
  'price-desc': 'Price: High to Low',
  'name-asc': 'Name: A to Z',
  'name-desc': 'Name: Z to A',
}

export function getOffersHeading(activeTab) {
  return activeTab === 'overnight' ? 'Overnight Offers' : activeTab === 'addons' ? 'Add-Ons List' : 'Day Tour Options'
}

export function sortItems(items, sortBy, getTitle, getPrice) {
  const sorted = [...items]

  if (sortBy === 'price-asc') {
    sorted.sort((a, b) => getPrice(a) - getPrice(b))
  } else if (sortBy === 'price-desc') {
    sorted.sort((a, b) => getPrice(b) - getPrice(a))
  } else if (sortBy === 'name-asc') {
    sorted.sort((a, b) => getTitle(a).localeCompare(getTitle(b)))
  } else if (sortBy === 'name-desc') {
    sorted.sort((a, b) => getTitle(b).localeCompare(getTitle(a)))
  }

  return sorted
}

export function getPaxMax(item) {
  return Number.isFinite(item.paxMax) ? item.paxMax : Number.POSITIVE_INFINITY
}

export function filterByPax(items, paxValue, getPax) {
  const paxNeeded = paxValue === '' ? null : Number(paxValue)

  return items.filter((item) => {
    const itemPax = getPax(item)
    return paxNeeded === null || (Number.isFinite(itemPax) && itemPax >= paxNeeded)
  })
}

export function markAndOrderByAvailability(items, checkInDate, requiresStayDates, isItemAvailableForDate) {
  if (!requiresStayDates || !checkInDate) {
    return items.map((item) => ({ ...item, isUnavailableForSelectedDate: false }))
  }

  const withAvailability = items.map((item) => ({
    ...item,
    isUnavailableForSelectedDate: !isItemAvailableForDate(item, checkInDate),
  }))

  return withAvailability.sort((a, b) => {
    if (a.isUnavailableForSelectedDate === b.isUnavailableForSelectedDate) return 0
    return a.isUnavailableForSelectedDate ? 1 : -1
  })
}

export function buildDetailsTo(basePath, checkInDate, checkOutDate, prefillGuestCount) {
  const params = new URLSearchParams()

  if (checkInDate) {
    params.set('checkInDate', checkInDate)
    params.set('checkOutDate', checkOutDate)
  }

  if (prefillGuestCount) params.set('guests', prefillGuestCount)

  if (!params.toString()) return basePath

  return `${basePath}?${params.toString()}`
}

export function buildBookingTo(offerType, offerId, checkInDate, checkOutDate, prefillGuestCount) {
  const params = new URLSearchParams({
    offerType,
    offerId,
  })

  if (checkInDate) {
    params.set('checkInDate', checkInDate)
    if (checkOutDate) params.set('checkOutDate', checkOutDate)
  }

  if (prefillGuestCount) params.set('guests', prefillGuestCount)

  return `/booking?${params.toString()}`
}

export function getBookingPrefillState(checkInDate, checkOutDate, prefillGuestCount) {
  if (!checkInDate && !prefillGuestCount) return undefined

  return {
    prefillStayDates: {
      checkInDate,
      checkOutDate,
    },
    prefillGuestCount: prefillGuestCount || undefined,
  }
}

export function hasActiveFilters(sortBy, paxValue, checkInDate) {
  return sortBy !== defaultFilters.sortBy || Boolean(paxValue) || Boolean(checkInDate)
}

export function getActiveFilterChips(sortBy, paxValue, checkInDate) {
  const chips = []

  if (sortBy !== defaultFilters.sortBy) chips.push(`Sort: ${sortByLabelByValue[sortBy] ?? sortBy}`)
  if (paxValue) chips.push(`Pax: ${paxValue}+`)
  if (checkInDate) chips.push(`Check-in: ${checkInDate}`)

  return chips
}
