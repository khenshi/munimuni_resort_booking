import { useEffect, useMemo } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import {
  PackageOfferDateEditor,
  PackageOfferDetailsCard,
  PackageOfferGallerySection,
  gallerySlots,
  resolveOfferDetail,
  resolveSelectedAvailabilityItem,
} from '../../components/packages/details'
import '../../styles/pages/packages-page.css'

export default function PackageOfferDetailsPage() {
  const { offerType, offerId } = useParams()
  const location = useLocation()
  const query = new URLSearchParams(location.search)
  const prefillCheckInDate = query.get('checkInDate') ?? ''
  const prefillGuests = query.get('guests') ?? ''

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [offerType, offerId])

  const detail = useMemo(() => resolveOfferDetail(offerType, offerId), [offerType, offerId])

  const selectedAvailabilityItem = useMemo(() => resolveSelectedAvailabilityItem(offerType, offerId), [offerType, offerId])

  return (
    <div className="packagesPage">
      <main className="packagesPageMain">
        <section className="packagesListSection" aria-labelledby="offer-detail-heading">
          <p className="packagesSectionKicker">Offer Details</p>

          <PackageOfferDetailsCard detail={detail} headingId="offer-detail-heading" />

          {detail ? (
            <PackageOfferGallerySection headingId="offer-gallery-heading" slots={gallerySlots} />
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
