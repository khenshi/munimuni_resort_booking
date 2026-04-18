export default function OffersFiltersBar({
  sortBy,
  paxValue,
  checkInDate,
  checkOutDate,
  requiresStayDates,
  minCheckInDate,
  onSortChange,
  onPaxValueChange,
  onCheckInDateChange,
}) {
  return (
    <div className="offersSortBar">
      <div className="offersSortBlock">
        <label htmlFor="offers-sort" className="offersSortLabel">
          Sort by
        </label>
        <select id="offers-sort" className="offersSortSelect" value={sortBy} onChange={(event) => onSortChange(event.target.value)}>
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
            onChange={(event) => onPaxValueChange(event.target.value)}
          />
        </div>
      </div>

      {requiresStayDates ? (
        <>
          <div className="offersFilterBlock">
            <label htmlFor="offers-checkin" className="offersSortLabel">
              Check-in
            </label>
            <div className="rangeInputs">
              <input
                id="offers-checkin"
                type="date"
                min={minCheckInDate}
                className="offersRangeInput offersDateInput"
                value={checkInDate}
                onChange={(event) => onCheckInDateChange(event.target.value)}
              />
            </div>
          </div>

          <div className="offersFilterBlock">
            <label htmlFor="offers-checkout" className="offersSortLabel">
              Check-out
            </label>
            <div className="rangeInputs">
              <input
                id="offers-checkout"
                type="date"
                className="offersRangeInput offersDateInput"
                value={checkOutDate}
                readOnly
                aria-readonly="true"
              />
            </div>
          </div>
        </>
      ) : null}
    </div>
  )
}
