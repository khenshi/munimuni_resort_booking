import { useMemo, useState } from 'react'
import { addOns, cottages, overnightOffers } from './data'

export default function PackagesOffersSection({ activeTab }) {
  const [selectedCottageId, setSelectedCottageId] = useState(cottages[0].id)

  const selectedCottage = useMemo(
    () => cottages.find((cottage) => cottage.id === selectedCottageId) ?? cottages[0],
    [selectedCottageId],
  )

  const heading =
    activeTab === 'overnight' ? 'Overnight Offers' : activeTab === 'addons' ? 'Add-Ons List' : 'Day Tour Options'

  return (
    <section className="packagesListSection" aria-labelledby="packages-list-heading">
      <p className="packagesSectionKicker">Our Offers</p>
      <h2 id="packages-list-heading">{heading}</h2>

      {activeTab === 'overnight' ? (
        <div className="overnightOffersGrid" role="list" aria-label="Overnight package offers">
          {overnightOffers.map((offer) => (
            <article className="overnightOfferCard" role="listitem" key={offer.title}>
              <h3>{offer.title}</h3>
              <p>{offer.description}</p>
            </article>
          ))}
        </div>
      ) : activeTab === 'addons' ? (
        <div className="addonsGrid" role="list" aria-label="Available add-ons">
          {addOns.map((item) => (
            <article className="addonCard" role="listitem" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      ) : (
        <>
          <div className="packageCard" role="article" aria-label="Day tour basic option details">
            <h3>Basic Type - Entrance Fee</h3>
            <p className="packageSubtitle">Includes free use of tables and chairs.</p>

            <ul className="packageDetailsList">
              <li>
                <strong>Monday to Thursday:</strong> PHP 275 per person
              </li>
              <li>
                <strong>Friday to Sunday and Holidays:</strong> PHP 325 per person
              </li>
              <li>
                <strong>Hours:</strong> 8:00 AM to 5:00 PM
              </li>
            </ul>
          </div>

          <div className="packageTypeHeader">
            <h3>Cottage Rental Choices</h3>
            <p>Select one cottage option to add to your day tour booking.</p>
          </div>

          <div className="cottageGrid" role="list" aria-label="Available cottage options">
            {cottages.map((cottage) => (
              <article
                className={`cottageCard ${selectedCottageId === cottage.id ? 'isSelected' : ''}`}
                role="listitem"
                key={cottage.id}
              >
                <h4>{cottage.name}</h4>
                <p>
                  Cottage rate: {cottage.rate} ({cottage.pax})
                </p>
                <button
                  type="button"
                  className="cottageSelectBtn"
                  onClick={() => setSelectedCottageId(cottage.id)}
                >
                  View details
                </button>
              </article>
            ))}
          </div>

          <div className="cottageDetailsPanel" aria-live="polite">
            <h3>{selectedCottage.name} Details</h3>
            <p className="cottageDetailsRate">
              Cottage rate: {selectedCottage.rate} ({selectedCottage.pax})
            </p>
            <ul>
              {selectedCottage.details.map((detail) => (
                <li key={detail}>{detail}</li>
              ))}
            </ul>
          </div>
        </>
      )}
    </section>
  )
}
