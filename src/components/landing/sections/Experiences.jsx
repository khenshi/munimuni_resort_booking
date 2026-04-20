
import { Link } from 'react-router-dom'
import { cottages } from '../../../data/packages'

const featuredOffers = cottages.slice(0, 3).map((cottage) => ({
  ...cottage,
  to: `/packages/offers/daytour/cottage-${cottage.id}`,
}))

export default function Experiences() {
  return (
    <section className="featuredOffersSection" id="featured-offers">
      <div className="featuredOffersInner">
        <header className="featuredOffersHeader">
          <p className="featuredOffersKicker">Stay Selection</p>
          <h2 className="featuredOffersTitle">Featured Offers & Cottages</h2>
          <p className="featuredOffersLead">
            Discover our most loved stays, handpicked for comfort, privacy, and unforgettable views.
          </p>
        </header>

        <div className="featuredOffersGrid">
          {featuredOffers.map((offer) => (
            <article className="featuredOfferCard" key={offer.title}>
              <img src={offer.imageUrl} alt={offer.alt} className="featuredOfferImage" />

              <div className="featuredOfferBody">
                <h3>{offer.name}</h3>
                <p>{offer.description}</p>

                <div className="featuredOfferMeta">
                  <span>
                    <strong>{offer.priceLabel}</strong> · {offer.paxLabel}
                  </span>
                  <a href={offer.to}>View Offer</a>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="featuredOffersCtaWrap">
          <Link className="featuredOffersCta" to="/packages">
            View All Offers
          </Link>
        </div>
      </div>
    </section>
  )
}