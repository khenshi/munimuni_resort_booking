
import cottageOne from '../../assets/3.png'
import cottageTwo from '../../assets/5.png'
import cottageThree from '../../assets/7.png'
import { cottages } from '../packages/data'

const cottageImageById = {
  cove: { src: cottageOne, alt: 'Cove cottage with ocean-facing lounge area' },
  jungle: { src: cottageTwo, alt: 'Jungle cottage surrounded by tropical greenery' },
  cliffside: { src: cottageThree, alt: 'Cliffside cottage with panoramic sea view' },
}

const featuredOffers = cottages.slice(0, 3).map((cottage) => ({
  ...cottage,
  image: cottageImageById[cottage.id]?.src ?? cottageOne,
  alt: cottageImageById[cottage.id]?.alt ?? `${cottage.name} cottage`,
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
              <img src={offer.image} alt={offer.alt} className="featuredOfferImage" />

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
          <a className="featuredOffersCta" href="/packages">
            View All Offers
          </a>
        </div>
      </div>
    </section>
  )
}