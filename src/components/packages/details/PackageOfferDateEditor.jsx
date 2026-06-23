import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addDaysToISODate, getStayNightsByTab, getTodayISODate, isItemAvailableForDate } from '../packages-list-page/utils/availability-utils'

export default function PackageOfferDateEditor({
  offerType,
  offerId,
  offerTitle,
  offerSubtitle,
  offerPriceInfo,
  selectedAvailabilityItem,
  initialCheckInDate = '',
  initialGuests = '',
}) {
  const navigate = useNavigate()
  const [checkInDate, setCheckInDate] = useState(initialCheckInDate)
  const todayISODate = getTodayISODate()
  const minCheckInDate = addDaysToISODate(todayISODate, 1)

  const stayNights = getStayNightsByTab(offerType)
  const checkOutDate = useMemo(() => addDaysToISODate(checkInDate, stayNights), [checkInDate, stayNights])

  const isDateSelected = Boolean(checkInDate)
  const isPastOrTodaySelected = isDateSelected && checkInDate <= todayISODate
  const isUnavailableForSelectedDate = Boolean(
    isDateSelected && !isPastOrTodaySelected && selectedAvailabilityItem && !isItemAvailableForDate(selectedAvailabilityItem, checkInDate),
  )

  const statusMessage = !isDateSelected
    ? 'Pick a check-in date to continue booking this offer.'
    : isPastOrTodaySelected
      ? 'Check-in date must be a future date (starting tomorrow).'
      : isUnavailableForSelectedDate
        ? `This offer is unavailable on ${checkInDate}. Choose another date to continue.`
        : 'Your booking will continue with the selected date.'

  const handleBookNow = () => {
    if (!isDateSelected || isPastOrTodaySelected || isUnavailableForSelectedDate) return

    const params = new URLSearchParams({
      offerType,
      offerId,
      checkInDate,
    })

    if (checkOutDate) {
      params.set('checkOutDate', checkOutDate)
    }

    if (initialGuests) {
      params.set('guests', initialGuests)
    }

    navigate(`/booking?${params.toString()}`, {
      state: {
        selectedOffer: {
          offerType,
          offerId,
          title: offerTitle,
          subtitle: offerSubtitle,
          priceInfo: offerPriceInfo ?? 'Price available upon confirmation',
        },
        prefillStayDates: {
          checkInDate,
          checkOutDate,
        },
        prefillGuestCount: initialGuests || undefined,
      },
    })
  }

  return (
    <section className="offerDetailsBookingPanel" aria-labelledby="offer-booking-panel-heading">
      <div className="offerDetailsBookingPanelHeader">
        <p className="packagesSectionKicker">Book This Offer</p>
        <h3 id="offer-booking-panel-heading">Choose your dates</h3>
        <p className="offerDetailsBookingPanelCopy">
          Adjust the stay dates below, then continue straight to booking without returning to the offers list.
        </p>
      </div>

      <div className="offerDetailsBookingFields">
        <div className="offerDetailsBookingField">
          <label htmlFor="offer-details-checkin" className="offersSortLabel">
            Check-in
          </label>
          <input
            id="offer-details-checkin"
            type="date"
            min={minCheckInDate}
            className="offersRangeInput offersDateInput offerDetailsDateInput"
            value={checkInDate}
            onChange={(event) => setCheckInDate(event.target.value)}
          />
        </div>

        <div className="offerDetailsBookingField">
          <label htmlFor="offer-details-checkout" className="offersSortLabel">
            Check-out
          </label>
          <input
            id="offer-details-checkout"
            type="date"
            className="offersRangeInput offersDateInput offerDetailsDateInput"
            value={checkOutDate}
            readOnly
            aria-readonly="true"
          />
        </div>
      </div>

      <p className={`offerDetailsBookingNotice ${isUnavailableForSelectedDate ? 'isWarning' : ''}`} role="status" aria-live="polite">
        {statusMessage}
      </p>

      <div className="offerDetailsBookingActions">
        <button
          type="button"
          className="cottageSelectBtn"
          onClick={handleBookNow}
          disabled={!isDateSelected || isPastOrTodaySelected || isUnavailableForSelectedDate}
        >
          Book now
        </button>
      </div>
    </section>
  )
}
