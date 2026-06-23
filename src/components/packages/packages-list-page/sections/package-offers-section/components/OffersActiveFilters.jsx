export default function OffersActiveFilters({ hasActiveFilters, activeFilterChips, onClearAll }) {
  if (!hasActiveFilters) return null

  return (
    <div className="offersActiveFilters" aria-live="polite">
      <div className="offersFilterChips" aria-label="Active filters">
        {activeFilterChips.map((chip) => (
          <span className="offersFilterChip" key={chip}>
            {chip}
          </span>
        ))}
      </div>
      <button type="button" className="offersClearFiltersBtn" onClick={onClearAll}>
        Clear all
      </button>
    </div>
  )
}
