import { Link } from 'react-router-dom'

export default function PackageOfferCard({
  offer,
  to,
  cardClassName = 'cottageCard',
  isUnavailable = false,
  bookingTo,
  bookingState,
  onBookNowClick,
}) {
  const title = offer.name ?? offer.title

  const handleBookNowClick = (event) => {
    const canProceed = onBookNowClick ? onBookNowClick() : true
    if (!canProceed) event.preventDefault()
  }

  const imageAlt = `${title} resort offer`

  return (
    <article className={`${cardClassName} ${isUnavailable ? 'isUnavailable' : ''}`} role="listitem" key={offer.id ?? title}>
      <div className={`offerCardContent ${isUnavailable ? 'isUnavailable' : ''}`}>
        <div className="offerCardDetails">
          {isUnavailable ? <p className="offerUnavailableBadge">Unavailable on selected date</p> : null}
          <h4>{title}</h4>
          <p className="offerPrice">{offer.priceLabel}</p>
          {offer.paxLabel ? <p className="paxInfo">{offer.paxLabel}</p> : null}
          <p>{offer.description}</p>
          <div className="offerCardActions">
            {to ? (
              <Link to={to} className="offerCardSecondaryBtn">
                View details
              </Link>
            ) : null}
            {bookingTo ? (
              <Link to={bookingTo} state={bookingState} className="cottageSelectBtn" onClick={handleBookNowClick}>
                Book now
              </Link>
            ) : null}
          </div>
        </div>
        <div className="offerCardImage">
          {offer.imageUrl ? (
            <img src={offer.imageUrl} alt={imageAlt} loading="lazy" />
          ) : (
            <div className="imagePlaceholder">{title}</div>
          )}
        </div>
      </div>
    </article>
  )
}
