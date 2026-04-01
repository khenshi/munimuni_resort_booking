import { useMemo } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import PackagesPageHeader from '../components/packages/PackagesPageHeader'
import { addOns, cottages, overnightOffers } from '../components/packages/data'
import '../styles/pages/packages-page.css'

const tabByType = {
  daytour: 'daytour',
  overnight: 'overnight',
  addons: 'addons',
}

export default function PackageOfferDetailsPage() {
  const { offerType, offerId } = useParams()
  const location = useLocation()
  const query = new URLSearchParams(location.search)
  const prefillCheckInDate = query.get('checkInDate') ?? ''
  const prefillCheckOutDate = query.get('checkOutDate') ?? ''
  const prefillGuests = query.get('guests') ?? ''
  const activeTab = tabByType[offerType] ?? 'daytour'

  const detail = useMemo(() => {
    if (offerType === 'daytour' && offerId === 'basic') {
      return {
        title: 'Basic Type - Entrance Fee',
        subtitle: 'Entrance & facilities access',
        details: [
          'Monday to Thursday: PHP 275 per person',
          'Friday to Sunday and Holidays: PHP 325 per person',
          'Hours: 8:00 AM to 5:00 PM',
          'Includes free use of tables and chairs',
          'Walk-ins welcome, subject to availability',
        ],
      }
    }

    if (offerType === 'daytour' && offerId?.startsWith('cottage-')) {
      const cottageId = offerId.replace('cottage-', '')
      const cottage = cottages.find((item) => item.id === cottageId)
      if (!cottage) return null

      return {
        title: cottage.name,
        subtitle: cottage.description,
        priceInfo: `${cottage.priceLabel} (${cottage.paxLabel})`,
        details: cottage.details,
      }
    }

    if (offerType === 'overnight') {
      const offer = overnightOffers.find((item) => item.id === offerId)
      if (!offer) return null

      return {
        title: offer.title,
        subtitle: offer.description,
        priceInfo: offer.priceLabel,
        details: offer.details,
      }
    }

    if (offerType === 'addons') {
      const addOn = addOns.find((item) => item.id === offerId)
      if (!addOn) return null

      return {
        title: addOn.title,
        subtitle: addOn.description,
        priceInfo: addOn.priceLabel,
        details: addOn.details,
      }
    }

    return null
  }, [offerType, offerId])

  return (
    <div className="packagesPage">
      <PackagesPageHeader activeTab={activeTab} onTabChange={() => {}} />
      <main className="packagesPageMain">
        <section className="packagesListSection" aria-labelledby="offer-detail-heading">
          <p className="packagesSectionKicker">Offer Details</p>

          {detail ? (
            <div className="packageCard" role="article" aria-label="Selected offer details">
              <h2 id="offer-detail-heading">{detail.title}</h2>
              <p className="packageSubtitle">{detail.subtitle}</p>
              {detail.priceInfo && <p className="packagePrice">{detail.priceInfo}</p>}
              <ul className="packageDetailsList">
                {detail.details.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="packageCard" role="status" aria-live="polite">
              <h2 id="offer-detail-heading">Offer Not Found</h2>
              <p className="packageSubtitle">The selected offer does not exist or may have been removed.</p>
            </div>
          )}

          <Link to="/packages" className="cottageSelectBtn">
            Back to Packages
          </Link>

          {detail && offerType !== 'addons' ? (
            <Link
              to={`/booking?offerType=${encodeURIComponent(offerType ?? '')}&offerId=${encodeURIComponent(offerId ?? '')}${prefillCheckInDate ? `&checkInDate=${encodeURIComponent(prefillCheckInDate)}` : ''}${prefillCheckOutDate ? `&checkOutDate=${encodeURIComponent(prefillCheckOutDate)}` : ''}${prefillGuests ? `&guests=${encodeURIComponent(prefillGuests)}` : ''}`}
              state={{
                selectedOffer: {
                  offerType,
                  offerId,
                  title: detail.title,
                  subtitle: detail.subtitle,
                  priceInfo: detail.priceInfo ?? 'Price available upon confirmation',
                },
                prefillStayDates: prefillCheckInDate
                  ? {
                      checkInDate: prefillCheckInDate,
                      checkOutDate: prefillCheckOutDate,
                    }
                  : undefined,
                prefillGuestCount: prefillGuests || undefined,
              }}
              className="cottageSelectBtn"
            >
              Proceed to Booking
            </Link>
          ) : null}
        </section>
      </main>
    </div>
  )
}
