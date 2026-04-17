export default function PackageOfferDetailsCard({ detail, headingId }) {
  if (!detail) {
    return (
      <div className="packageCard" role="status" aria-live="polite">
        <h2 id={headingId}>Offer Not Found</h2>
        <p className="packageSubtitle">The selected offer does not exist or may have been removed.</p>
      </div>
    )
  }

  return (
    <div className="packageCard" role="article" aria-label="Selected offer details">
      <h2 id={headingId}>{detail.title}</h2>
      <p className="packageSubtitle">{detail.subtitle}</p>
      {detail.priceInfo ? <p className="packagePrice">{detail.priceInfo}</p> : null}
      <ul className="packageDetailsList">
        {detail.details.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  )
}
