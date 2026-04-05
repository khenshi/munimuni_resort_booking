import { useEffect, useMemo } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { PackageOfferDateEditor, PackagesPageHeader } from '../components/packages'
import { addOns, cottages, dayTourOffers, overnightOffers } from '../data/packages'
import '../styles/pages/packages-page.css'

const tabByType = {
  daytour: 'daytour',
  overnight: 'overnight',
  addons: 'addons',
}

const gallerySlots = [
  'Front view',
  'Cottage view',
  'Dining area',
  'Evening view',
]

export default function PackageOfferDetailsPage() {
  const { offerType, offerId } = useParams()
  const location = useLocation()
  const query = new URLSearchParams(location.search)
  const prefillCheckInDate = query.get('checkInDate') ?? ''
  const prefillGuests = query.get('guests') ?? ''
  const activeTab = tabByType[offerType] ?? 'daytour'

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [offerType, offerId])

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

  const selectedAvailabilityItem = useMemo(() => {
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

          {detail ? (
            <section className="offerDetailsGallerySection" aria-labelledby="offer-gallery-heading">
              <div className="offerDetailsSectionHeader">
                <div>
                  <p className="packagesSectionKicker">Package Gallery</p>
                  <h3 id="offer-gallery-heading">Pictures of the package</h3>
                </div>
              </div>

              <div className="offerDetailsGalleryGrid">
                {gallerySlots.map((slotLabel) => (
                  <div key={slotLabel} className="offerDetailsGalleryCard" role="presentation">
                    <div className="offerDetailsGalleryPlaceholder" aria-hidden="true">
                      <span>{slotLabel}</span>
                    </div>
                    <p>{slotLabel}</p>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {detail && offerType !== 'addons' ? (
            <PackageOfferDateEditor
              key={`${offerType}-${offerId}-${location.search}`}
              offerType={offerType}
              offerId={offerId}
              offerTitle={detail.title}
              offerSubtitle={detail.subtitle}
              offerPriceInfo={detail.priceInfo}
              selectedAvailabilityItem={selectedAvailabilityItem}
              initialCheckInDate={prefillCheckInDate}
              initialGuests={prefillGuests}
            />
          ) : null}

          <Link to="/packages" className="offerDetailsBackLink">
            Back to Packages
          </Link>
        </section>
      </main>
    </div>
  )
}
