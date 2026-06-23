import PackageOfferCard from './PackageOfferCard'

export default function OffersCardsByTab({
  activeTab,
  sortedOvernightOffers,
  sortedAddOns,
  sortedDayTourOffers,
  sortedCottages,
  buildDetailsTo,
  buildBookingTo,
  bookingPrefillState,
  onBookNowClick,
}) {
  return (
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
              onBookNowClick={() => onBookNowClick(offer.title, offer.isUnavailableForSelectedDate)}
            />
          ))}
        </div>
      ) : activeTab === 'addons' ? (
        <div className="addonsGrid" role="list" aria-label="Available add-ons">
          {sortedAddOns.map((item) => (
            <PackageOfferCard key={item.id} offer={item} />
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
                onBookNowClick={() => onBookNowClick(offer.title, offer.isUnavailableForSelectedDate)}
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
                onBookNowClick={() => onBookNowClick(cottage.name, cottage.isUnavailableForSelectedDate)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
