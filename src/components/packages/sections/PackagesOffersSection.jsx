import { useEffect, useState } from 'react'
import { addOns, cottages, dayTourOffers, overnightOffers } from '../../../data/packages'
import { addDaysToISODate, getStayNightsByTab, getTodayISODate, isItemAvailableForDate } from '../utils/availability-utils'
import PackageOfferCard from '../cards/PackageOfferCard'
import BookingGuardPopup from '../feedback/BookingGuardPopup'

const OFFERS_FILTERS_STORAGE_KEY = 'resortPackagesOffersFiltersV1'

const defaultFilters = {
  sortBy: 'recommended',
  paxValue: '',
  checkInDate: '',
}

function readStoredFilters() {
  if (typeof window === 'undefined') return {}

  try {
    const rawValue = window.localStorage.getItem(OFFERS_FILTERS_STORAGE_KEY)
    if (!rawValue) return {}
    const parsed = JSON.parse(rawValue)
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

function normalizeFilters(entry) {
  if (!entry || typeof entry !== 'object') return defaultFilters

  return {
    sortBy: typeof entry.sortBy === 'string' ? entry.sortBy : defaultFilters.sortBy,
    paxValue: typeof entry.paxValue === 'string' ? entry.paxValue : defaultFilters.paxValue,
    checkInDate: typeof entry.checkInDate === 'string' ? entry.checkInDate : defaultFilters.checkInDate,
  }
}

export default function PackagesOffersSection({ activeTab }) {
  const [filtersByTab, setFiltersByTab] = useState(() => readStoredFilters())
  const [popupState, setPopupState] = useState({
    isOpen: false,
    title: '',
    message: '',
  })

  const activeFilters = normalizeFilters(filtersByTab?.[activeTab])
  const { sortBy, paxValue, checkInDate } = activeFilters

  const updateActiveFilters = (patch) => {
    setFiltersByTab((prev) => ({
      ...prev,
      [activeTab]: {
        ...normalizeFilters(prev?.[activeTab]),
        ...patch,
      },
    }))
  }

  useEffect(() => {
    if (typeof window === 'undefined') return

    window.localStorage.setItem(OFFERS_FILTERS_STORAGE_KEY, JSON.stringify(filtersByTab))
  }, [filtersByTab])

  const heading =
    activeTab === 'overnight' ? 'Overnight Offers' : activeTab === 'addons' ? 'Add-Ons List' : 'Day Tour Options'

  const sortByLabelByValue = {
    recommended: 'Recommended',
    'price-asc': 'Price: Low to High',
    'price-desc': 'Price: High to Low',
    'name-asc': 'Name: A to Z',
    'name-desc': 'Name: Z to A',
  }

  const sortItems = (items, getTitle, getPrice) => {
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

  const getPaxMax = (item) => (Number.isFinite(item.paxMax) ? item.paxMax : Number.POSITIVE_INFINITY)

  const requiresStayDates = activeTab === 'overnight' || activeTab === 'daytour'
  const stayNights = getStayNightsByTab(activeTab)
  const checkOutDate = checkInDate ? addDaysToISODate(checkInDate, stayNights) : ''
  const prefillGuestCount = paxValue.trim()

  const buildDetailsTo = (basePath) => {
    const params = new URLSearchParams()

    if (checkInDate) {
      params.set('checkInDate', checkInDate)
      params.set('checkOutDate', checkOutDate)
    }

    if (prefillGuestCount) params.set('guests', prefillGuestCount)

    if (!params.toString()) return basePath

    return `${basePath}?${params.toString()}`
  }

  const buildBookingTo = (offerType, offerId) => {
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

  const bookingPrefillState =
    checkInDate || prefillGuestCount
      ? {
          prefillStayDates: {
            checkInDate,
            checkOutDate,
          },
          prefillGuestCount: prefillGuestCount || undefined,
        }
      : undefined

  const filterByPax = (items, getPax) => {
    const paxNeeded = paxValue === '' ? null : Number(paxValue)

    return items.filter((item) => {
      const itemPax = getPax(item)

      const paxValid = paxNeeded === null || (Number.isFinite(itemPax) && itemPax >= paxNeeded)

      return paxValid
    })
  }

  const markAndOrderByAvailability = (items) => {
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

  const sortedOvernightOffers = markAndOrderByAvailability(
    sortItems(filterByPax(overnightOffers, getPaxMax), (item) => item.title, (item) => item.price),
  )

  const sortedAddOns = sortItems(
    filterByPax(addOns, () => Number.POSITIVE_INFINITY),
    (item) => item.title,
    () => Number.POSITIVE_INFINITY,
  )

  const sortedDayTourOffers = markAndOrderByAvailability(
    sortItems(filterByPax(dayTourOffers, () => Number.POSITIVE_INFINITY), (item) => item.title, (item) => item.price),
  )

  const sortedCottages = markAndOrderByAvailability(
    sortItems(filterByPax(cottages, (item) => item.paxMax), (item) => item.name, (item) => item.price),
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

    if (isUnavailableForSelectedDate) {
      showBookingGuardPopup('Offer Unavailable', `${offerTitle} is not available on the selected date.`)
      return false
    }

    return true
  }

  const hasActiveFilters = sortBy !== defaultFilters.sortBy || Boolean(paxValue) || Boolean(checkInDate)

  const clearAllFilters = () => {
    updateActiveFilters(defaultFilters)
  }

  const activeFilterChips = []

  if (sortBy !== defaultFilters.sortBy) activeFilterChips.push(`Sort: ${sortByLabelByValue[sortBy] ?? sortBy}`)
  if (paxValue) activeFilterChips.push(`Pax: ${paxValue}+`)
  if (checkInDate) activeFilterChips.push(`Check-in: ${checkInDate}`)

  return (
    <section className="packagesListSection" aria-labelledby="packages-list-heading">
      <p className="packagesSectionKicker">Our Offers</p>
      <h2 id="packages-list-heading">{heading}</h2>

      <div className="offersSortBar">
        <div className="offersSortBlock">
          <label htmlFor="offers-sort" className="offersSortLabel">
            Sort by
          </label>
          <select
            id="offers-sort"
            className="offersSortSelect"
            value={sortBy}
            onChange={(event) => updateActiveFilters({ sortBy: event.target.value })}
          >
            <option value="recommended">Recommended</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A to Z</option>
            <option value="name-desc">Name: Z to A</option>
          </select>
        </div>

        <div className="offersFilterBlock">
          <span className="offersSortLabel">Pax Needed</span>
          <div className="rangeInputs">
            <input
              type="number"
              min="0"
              className="offersRangeInput"
              placeholder="e.g. 12"
              value={paxValue}
              onChange={(event) => updateActiveFilters({ paxValue: event.target.value })}
            />
          </div>
        </div>

        {requiresStayDates ? (
          <>
            <div className="offersFilterBlock">
              <label htmlFor="offers-checkin" className="offersSortLabel">
                Check-in
              </label>
              <div className="rangeInputs">
                <input
                  id="offers-checkin"
                  type="date"
                  min={getTodayISODate()}
                  className="offersRangeInput offersDateInput"
                  value={checkInDate}
                  onChange={(event) => updateActiveFilters({ checkInDate: event.target.value })}
                />
              </div>
            </div>

            <div className="offersFilterBlock">
              <label htmlFor="offers-checkout" className="offersSortLabel">
                Check-out
              </label>
              <div className="rangeInputs">
                <input
                  id="offers-checkout"
                  type="date"
                  className="offersRangeInput offersDateInput"
                  value={checkOutDate}
                  readOnly
                  aria-readonly="true"
                />
              </div>
            </div>
          </>
        ) : null}
      </div>

      {hasActiveFilters ? (
        <div className="offersActiveFilters" aria-live="polite">
          <div className="offersFilterChips" aria-label="Active filters">
            {activeFilterChips.map((chip) => (
              <span className="offersFilterChip" key={chip}>
                {chip}
              </span>
            ))}
          </div>
          <button type="button" className="offersClearFiltersBtn" onClick={clearAllFilters}>
            Clear all
          </button>
        </div>
      ) : null}

      {requiresStayDates && !checkInDate ? (
        <p className="offersDateNotice">All offers are shown. Pick a check-in date to prioritize available options.</p>
      ) : null}

      {requiresStayDates && checkInDate && activeTab === 'overnight' && overnightAvailableCount === 0 ? (
        <p className="offersDateNotice">No overnight offers are available for the selected date. Unavailable offers are listed below.</p>
      ) : null}

      {requiresStayDates && checkInDate && activeTab === 'daytour' && daytourAvailableCount === 0 ? (
        <p className="offersDateNotice">No day tour offers are available for the selected date. Unavailable offers are listed below.</p>
      ) : null}

      {requiresStayDates && checkInDate && activeTab === 'daytour' && cottagesAvailableCount === 0 ? (
        <p className="offersDateNotice">No cottages are available for the selected date. Unavailable cottages are listed below.</p>
      ) : null}

      <div className="offersCardsScroll" aria-label="Offers cards scroll area">
        {activeTab === 'overnight' ? (
          <div className="overnightOffersGrid" role="list" aria-label="Overnight package offers">
            {sortedOvernightOffers.map((offer) => (
              <PackageOfferCard
                key={offer.id}
                offer={offer}
                to={buildDetailsTo(`/packages/offers/overnight/${offer.id}`)}
                bookingTo={buildBookingTo('overnight', offer.id)}
                bookingState={bookingPrefillState}
                isUnavailable={offer.isUnavailableForSelectedDate}
                onBookNowClick={() => handleBookNowClick(offer.title, offer.isUnavailableForSelectedDate)}
              />
            ))}
          </div>
        ) : activeTab === 'addons' ? (
          <div className="addonsGrid" role="list" aria-label="Available add-ons">
            {sortedAddOns.map((item) => (
              <PackageOfferCard key={item.id} offer={item} to={buildDetailsTo(`/packages/offers/addons/${item.id}`)} />
            ))}
          </div>
        ) : (
          <>
            <div className="daytourOffersGrid" role="list" aria-label="Day tour options">
              {sortedDayTourOffers.map((offer) => (
                <PackageOfferCard
                  key={offer.id}
                  offer={offer}
                  to={buildDetailsTo(`/packages/offers/daytour/${offer.id}`)}
                  bookingTo={buildBookingTo('daytour', offer.id)}
                  bookingState={bookingPrefillState}
                  isUnavailable={offer.isUnavailableForSelectedDate}
                  onBookNowClick={() => handleBookNowClick(offer.title, offer.isUnavailableForSelectedDate)}
                />
              ))}
            </div>

            <div className="packageTypeHeader">
              <h3>Cottage Rental Choices</h3>
              <p>Select one cottage option to add to your day tour booking.</p>
            </div>

            <div className="cottageGrid" role="list" aria-label="Available cottage options">
              {sortedCottages.map((cottage) => (
                <PackageOfferCard
                  key={cottage.id}
                  offer={cottage}
                  to={buildDetailsTo(`/packages/offers/daytour/cottage-${cottage.id}`)}
                  bookingTo={buildBookingTo('daytour', `cottage-${cottage.id}`)}
                  bookingState={bookingPrefillState}
                  cardClassName="cottageCard"
                  isUnavailable={cottage.isUnavailableForSelectedDate}
                  onBookNowClick={() => handleBookNowClick(cottage.name, cottage.isUnavailableForSelectedDate)}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <BookingGuardPopup
        isOpen={popupState.isOpen}
        title={popupState.title}
        message={popupState.message}
        onClose={closeBookingGuardPopup}
      />
    </section>
  )
}
