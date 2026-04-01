import { Link } from 'react-router-dom'

export default function PackageOfferCard({
  offer,
  to,
  cardClassName = 'cottageCard',
  isUnavailable = false,
}) {
  const title = offer.name ?? offer.title

  return (
    <article className={`${cardClassName} ${isUnavailable ? 'isUnavailable' : ''}`} role="listitem" key={offer.id ?? title}>
      <div className={`offerCardContent ${isUnavailable ? 'isUnavailable' : ''}`}>
        <div className="offerCardDetails">
          {isUnavailable ? <p className="offerUnavailableBadge">Unavailable on selected date</p> : null}
          <h4>{title}</h4>
          <p className="offerPrice">{offer.priceLabel}</p>
          {offer.paxLabel ? <p className="paxInfo">{offer.paxLabel}</p> : null}
          <p>{offer.description}</p>
          <Link to={to} className="cottageSelectBtn">
            View details
          </Link>
        </div>
        <div className="offerCardImage">
          <div className="imagePlaceholder">Image</div>
        </div>
      </div>
    </article>
  )
}