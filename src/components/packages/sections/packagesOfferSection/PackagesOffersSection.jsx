import { useState } from 'react'
import { addOns, cottages, dayTourOffers, overnightOffers } from '../../../../data/packages'
import { addDaysToISODate, getStayNightsByTab, getTodayISODate, isItemAvailableForDate } from '../../utils/availability-utils'
import BookingGuardPopup from '../../feedback/BookingGuardPopup'
import usePackagesOfferFilters from './hooks/use-packages-offer-filters'
import OffersActiveFilters from './components/OffersActiveFilters'
import OffersCardsByTab from './components/OffersCardsByTab'
import OffersDateNotices from './components/OffersDateNotices'
import OffersFiltersBar from './components/OffersFiltersBar'
import {
  buildBookingTo,
  buildDetailsTo,
  filterByPax,
  getActiveFilterChips,
  getBookingPrefillState,
  getOffersHeading,
  getPaxMax,
  hasActiveFilters,
  markAndOrderByAvailability,
  sortItems,
} from './utils/offers-logic'

export default function PackagesOffersSection({ activeTab }) {
  const { activeFilters, updateActiveFilters, clearAllFilters } = usePackagesOfferFilters(activeTab)
  const [popupState, setPopupState] = useState({
    isOpen: false,
    title: '',
    message: '',
  })

  const { sortBy, paxValue, checkInDate } = activeFilters
  const heading = getOffersHeading(activeTab)

  const requiresStayDates = activeTab === 'overnight' || activeTab === 'daytour'
  const todayISODate = getTodayISODate()
  const minCheckInDate = addDaysToISODate(todayISODate, 1)
  const isPastOrTodaySelected = Boolean(checkInDate) && checkInDate <= todayISODate
  const stayNights = getStayNightsByTab(activeTab)
  const checkOutDate = checkInDate ? addDaysToISODate(checkInDate, stayNights) : ''
  const prefillGuestCount = paxValue.trim()
  const bookingPrefillState = getBookingPrefillState(checkInDate, checkOutDate, prefillGuestCount)

  const buildDetailsToForFilters = (basePath) => buildDetailsTo(basePath, checkInDate, checkOutDate, prefillGuestCount)
  const buildBookingToForFilters = (offerType, offerId) =>
    buildBookingTo(offerType, offerId, checkInDate, checkOutDate, prefillGuestCount)

  const sortedOvernightOffers = markAndOrderByAvailability(
    sortItems(filterByPax(overnightOffers, paxValue, getPaxMax), sortBy, (item) => item.title, (item) => item.price),
    checkInDate,
    requiresStayDates,
    isItemAvailableForDate,
  )

  const sortedAddOns = sortItems(
    filterByPax(addOns, paxValue, () => Number.POSITIVE_INFINITY),
    sortBy,
    (item) => item.title,
    (item) => item.price,
  )

  const sortedDayTourOffers = markAndOrderByAvailability(
    sortItems(filterByPax(dayTourOffers, paxValue, () => Number.POSITIVE_INFINITY), sortBy, (item) => item.title, (item) => item.price),
    checkInDate,
    requiresStayDates,
    isItemAvailableForDate,
  )

  const sortedCottages = markAndOrderByAvailability(
    sortItems(filterByPax(cottages, paxValue, (item) => item.paxMax), sortBy, (item) => item.name, (item) => item.price),
    checkInDate,
    requiresStayDates,
    isItemAvailableForDate,
  )

  const overnightAvailableCount = sortedOvernightOffers.filter((item) => !item.isUnavailableForSelectedDate).length
  const daytourAvailableCount = sortedDayTourOffers.filter((item) => !item.isUnavailableForSelectedDate).length
  const cottagesAvailableCount = sortedCottages.filter((item) => !item.isUnavailableForSelectedDate).length

  const showBookingGuardPopup = (title, message) => {
    setPopupState({
      isOpen: true,
      title,
      message,
    })
  }

  const closeBookingGuardPopup = () => {
    setPopupState((prev) => ({
      ...prev,
      isOpen: false,
    }))
  }

  const handleBookNowClick = (offerTitle, isUnavailableForSelectedDate) => {
    if (!checkInDate) {
      showBookingGuardPopup('Select Date First', 'Please select a check-in date first before booking this offer.')
      return false
    }

    if (isPastOrTodaySelected) {
      showBookingGuardPopup('Invalid Check-in Date', 'Check-in date must be a future date (starting tomorrow).')
      return false
    }

    if (isUnavailableForSelectedDate) {
      showBookingGuardPopup('Offer Unavailable', `${offerTitle} is not available on the selected date.`)
      return false
    }

    return true
  }

  const showActiveFilters = hasActiveFilters(sortBy, paxValue, checkInDate)
  const activeFilterChips = getActiveFilterChips(sortBy, paxValue, checkInDate)

  return (
    <section className="packagesListSection" aria-labelledby="packages-list-heading">
      <p className="packagesSectionKicker">Our Offers</p>
      <h2 id="packages-list-heading">{heading}</h2>

      <OffersFiltersBar
        sortBy={sortBy}
        paxValue={paxValue}
        checkInDate={checkInDate}
        checkOutDate={checkOutDate}
        requiresStayDates={requiresStayDates}
        minCheckInDate={minCheckInDate}
        onSortChange={(value) => updateActiveFilters({ sortBy: value })}
        onPaxValueChange={(value) => updateActiveFilters({ paxValue: value })}
        onCheckInDateChange={(value) => updateActiveFilters({ checkInDate: value })}
      />

      <OffersActiveFilters hasActiveFilters={showActiveFilters} activeFilterChips={activeFilterChips} onClearAll={clearAllFilters} />

      <OffersDateNotices
        requiresStayDates={requiresStayDates}
        checkInDate={checkInDate}
        isPastOrTodaySelected={isPastOrTodaySelected}
        activeTab={activeTab}
        overnightAvailableCount={overnightAvailableCount}
        daytourAvailableCount={daytourAvailableCount}
        cottagesAvailableCount={cottagesAvailableCount}
      />

      <OffersCardsByTab
        activeTab={activeTab}
        sortedOvernightOffers={sortedOvernightOffers}
        sortedAddOns={sortedAddOns}
        sortedDayTourOffers={sortedDayTourOffers}
        sortedCottages={sortedCottages}
        buildDetailsTo={buildDetailsToForFilters}
        buildBookingTo={buildBookingToForFilters}
        bookingPrefillState={bookingPrefillState}
        onBookNowClick={handleBookNowClick}
      />

      <BookingGuardPopup
        isOpen={popupState.isOpen}
        title={popupState.title}
        message={popupState.message}
        onClose={closeBookingGuardPopup}
      />
    </section>
  )
}
