import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { addOns, cottages, dayTourOffers, overnightOffers } from './data'
import { addDaysToISODate, getStayNightsByTab, getTodayISODate, isItemAvailableForDate } from './availability-utils'
import PackageOfferCard from './PackageOfferCard'
import BookingGuardPopup from './BookingGuardPopup'
import { getSavedScrollTop, readPackagesViewState, writePackagesViewState } from './packages-view-state'

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

function getFiltersForTab(tab) {
  const stored = readStoredFilters()
  const entry = stored?.[tab]
  if (!entry || typeof entry !== 'object') return defaultFilters

  return {
    sortBy: typeof entry.sortBy === 'string' ? entry.sortBy : defaultFilters.sortBy,
    paxValue: typeof entry.paxValue === 'string' ? entry.paxValue : defaultFilters.paxValue,
    checkInDate: typeof entry.checkInDate === 'string' ? entry.checkInDate : defaultFilters.checkInDate,
  }
}

export default function PackagesOffersSection({ activeTab }) {
  const initialFilters = getFiltersForTab(activeTab)
  const [sortBy, setSortBy] = useState(initialFilters.sortBy)
  const [paxValue, setPaxValue] = useState(initialFilters.paxValue)
  const [checkInDate, setCheckInDate] = useState(initialFilters.checkInDate)
  const [popupState, setPopupState] = useState({
    isOpen: false,
    title: '',
    message: '',
  })
  const scrollContainerRef = useRef(null)

  useEffect(() => {
    const tabFilters = getFiltersForTab(activeTab)
    setSortBy(tabFilters.sortBy)
    setPaxValue(tabFilters.paxValue)
    setCheckInDate(tabFilters.checkInDate)
  }, [activeTab])

  useLayoutEffect(() => {
    const scrollContainer = scrollContainerRef.current
    if (!scrollContainer) return

    scrollContainer.scrollTop = getSavedScrollTop(activeTab)
  }, [activeTab])

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current
    if (!scrollContainer) return

    const handleScroll = () => {
      const currentState = readPackagesViewState()
      writePackagesViewState({
        ...currentState,
        activeTab,
        scrollTopByTab: {
          ...(currentState.scrollTopByTab ?? {}),
          [activeTab]: scrollContainer.scrollTop,
        },
      })
    }

    scrollContainer.addEventListener('scroll', handleScroll, { passive: true })
    return () => scrollContainer.removeEventListener('scroll', handleScroll)
  }, [activeTab])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const stored = readStoredFilters()
    const nextStored = {
      ...stored,
      [activeTab]: {
        sortBy,
        paxValue,
        checkInDate,
      },
    }

    window.localStorage.setItem(OFFERS_FILTERS_STORAGE_KEY, JSON.stringify(nextStored))
  }, [activeTab, sortBy, paxValue, checkInDate])

  const heading =
    activeTab === 'overnight' ? 'Overnight Offers' : activeTab === 'addons' ? 'Add-Ons List' : 'Day Tour Options'

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

  const sortedOvernightOffers = useMemo(
    () => {
      const filtered = filterByPax(overnightOffers, getPaxMax)
      const sorted = sortItems(filtered, (item) => item.title, (item) => item.price)
      return markAndOrderByAvailability(sorted)
    },
    [sortBy, paxValue, checkInDate, activeTab],
  )

  const sortedAddOns = useMemo(
    () => {
      const filtered = filterByPax(addOns, () => Number.POSITIVE_INFINITY)
      return sortItems(filtered, (item) => item.title, () => Number.POSITIVE_INFINITY)
    },
    [sortBy, paxValue],
  )

  const sortedDayTourOffers = useMemo(
    () => {
      const filtered = filterByPax(dayTourOffers, () => Number.POSITIVE_INFINITY)
      const sorted = sortItems(filtered, (item) => item.title, (item) => item.price)
      return markAndOrderByAvailability(sorted)
    },
    [sortBy, paxValue, checkInDate, activeTab],
  )

  const sortedCottages = useMemo(
    () => {
      const filtered = filterByPax(cottages, (item) => item.paxMax)
      const sorted = sortItems(filtered, (item) => item.name, (item) => item.price)
      return markAndOrderByAvailability(sorted)
    },
    [sortBy, paxValue, checkInDate, activeTab],
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
            onChange={(event) => setSortBy(event.target.value)}
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
              onChange={(event) => setPaxValue(event.target.value)}
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
                  onChange={(event) => setCheckInDate(event.target.value)}
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

      <div ref={scrollContainerRef} className="offersCardsScroll" aria-label="Offers cards scroll area">
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
