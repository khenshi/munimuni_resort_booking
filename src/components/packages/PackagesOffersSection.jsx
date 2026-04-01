import { Link } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { addOns, cottages, overnightOffers } from './data'

export default function PackagesOffersSection({ activeTab }) {
  const [sortBy, setSortBy] = useState('recommended')
  const [paxValue, setPaxValue] = useState('')

  const heading =
    activeTab === 'overnight' ? 'Overnight Offers' : activeTab === 'addons' ? 'Add-Ons List' : 'Day Tour Options'

  const sortItems = (items, getTitle, getPrice, getPax) => {
    const sorted = [...items]
    if (sortBy === 'price-asc') {
      sorted.sort((a, b) => getPrice(a) - getPrice(b))
    } else if (sortBy === 'price-desc') {
      sorted.sort((a, b) => getPrice(b) - getPrice(a))
    } else if (sortBy === 'pax-asc') {
      sorted.sort((a, b) => getPax(a) - getPax(b))
    } else if (sortBy === 'pax-desc') {
      sorted.sort((a, b) => getPax(b) - getPax(a))
    } else if (sortBy === 'name-asc') {
      sorted.sort((a, b) => getTitle(a).localeCompare(getTitle(b)))
    } else if (sortBy === 'name-desc') {
      sorted.sort((a, b) => getTitle(b).localeCompare(getTitle(a)))
    }
    return sorted
  }

  const filterByPax = (items, getPax) => {
    const paxNeeded = paxValue === '' ? null : Number(paxValue)

    return items.filter((item) => {
      const itemPax = getPax(item)

      const paxValid = paxNeeded === null || (Number.isFinite(itemPax) && itemPax >= paxNeeded)

      return paxValid
    })
  }

  const sortedOvernightOffers = useMemo(
    () => {
      const filtered = filterByPax(overnightOffers, () => Number.POSITIVE_INFINITY)
      return sortItems(filtered, (item) => item.title, () => Number.POSITIVE_INFINITY, () => Number.POSITIVE_INFINITY)
    },
    [sortBy, paxValue],
  )

  const sortedAddOns = useMemo(
    () => {
      const filtered = filterByPax(addOns, () => Number.POSITIVE_INFINITY)
      return sortItems(filtered, (item) => item.title, () => Number.POSITIVE_INFINITY, () => Number.POSITIVE_INFINITY)
    },
    [sortBy, paxValue],
  )

  const sortedCottages = useMemo(
    () => {
      const filtered = filterByPax(cottages, (item) => item.paxMax)
      return sortItems(filtered, (item) => item.name, (item) => item.price, (item) => item.paxMax)
    },
    [sortBy, paxValue],
  )

  return (
    <section className="packagesListSection" aria-labelledby="packages-list-heading">
      <p className="packagesSectionKicker">Our Offers</p>
      <h2 id="packages-list-heading">{heading}</h2>

      <div className="offersSortBar">
        <div className="offersSortBlock">
          <label htmlFor="offers-sort" className="offersSortLabel">
            Sort by
          </label>
          <select
            id="offers-sort"
            className="offersSortSelect"
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
          >
            <option value="recommended">Recommended</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A to Z</option>
            <option value="name-desc">Name: Z to A</option>
          </select>
        </div>

        <div className="offersFilterBlock">
          <span className="offersSortLabel">Pax Needed</span>
          <div className="rangeInputs">
            <input
              type="number"
              min="0"
              className="offersRangeInput"
              placeholder="e.g. 12"
              value={paxValue}
              onChange={(event) => setPaxValue(event.target.value)}
            />
          </div>
        </div>
      </div>

      {activeTab === 'overnight' ? (
        <div className="overnightOffersGrid" role="list" aria-label="Overnight package offers">
          {sortedOvernightOffers.map((offer) => (
            <article className="overnightOfferCard" role="listitem" key={offer.title}>
              <div className="offerCardContent">
                <div className="offerCardDetails">
                  <h3>{offer.title}</h3>
                  <p className="offerPrice">{offer.priceLabel}</p>
                  <p>{offer.description}</p>
                  <Link to={`/packages/offers/overnight/${offer.id}`} className="cottageSelectBtn">
                    View details
                  </Link>
                </div>
                <div className="offerCardImage">
                  <div className="imagePlaceholder">Image</div>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : activeTab === 'addons' ? (
        <div className="addonsGrid" role="list" aria-label="Available add-ons">
          {sortedAddOns.map((item) => (
            <article className="addonCard" role="listitem" key={item.title}>
              <div className="offerCardContent">
                <div className="offerCardDetails">
                  <h3>{item.title}</h3>
                  <p className="offerPrice">{item.priceLabel}</p>
                  <p>{item.description}</p>
                  <Link to={`/packages/offers/addons/${item.id}`} className="cottageSelectBtn">
                    View details
                  </Link>
                </div>
                <div className="offerCardImage">
                  <div className="imagePlaceholder">Image</div>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <>
          <div className="daytourOffersGrid" role="list" aria-label="Day tour options">
            <article className="daytourOfferCard" role="listitem">
              <div className="offerCardContent">
                <div className="offerCardDetails">
                  <h3>Basic Type - Entrance Fee</h3>
                  <p className="offerPrice">PHP 275-325 per person</p>
                  <p>Includes free use of tables and chairs.</p>
                  <Link to="/packages/offers/daytour/basic" className="cottageSelectBtn">
                    View details
                  </Link>
                </div>
                <div className="offerCardImage">
                  <div className="imagePlaceholder">Image</div>
                </div>
              </div>
            </article>
          </div>

          <div className="packageTypeHeader">
            <h3>Cottage Rental Choices</h3>
            <p>Select one cottage option to add to your day tour booking.</p>
          </div>

          <div className="cottageGrid" role="list" aria-label="Available cottage options">
            {sortedCottages.map((cottage) => (
              <article className="cottageCard" role="listitem" key={cottage.id}>
                <div className="offerCardContent">
                  <div className="offerCardDetails">
                    <h4>{cottage.name}</h4>
                    <p className="offerPrice">{cottage.priceLabel}</p>
                    <p className="paxInfo">{cottage.paxLabel}</p>
                    <p>{cottage.description}</p>
                    <Link to={`/packages/offers/daytour/cottage-${cottage.id}`} className="cottageSelectBtn">
                      View details
                    </Link>
                  </div>
                  <div className="offerCardImage">
                    <div className="imagePlaceholder">Image</div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  )
}
