export default function PackageOfferGallerySection({ headingId, slots }) {
  return (
    <section className="offerDetailsGallerySection" aria-labelledby={headingId}>
      <div className="offerDetailsSectionHeader">
        <div>
          <p className="packagesSectionKicker">Package Gallery</p>
          <h3 id={headingId}>Pictures of the package</h3>
        </div>
      </div>

      <div className="offerDetailsGalleryGrid">
        {slots.map((slotLabel) => (
          <div key={slotLabel} className="offerDetailsGalleryCard" role="presentation">
            <div className="offerDetailsGalleryPlaceholder" aria-hidden="true">
              <span>{slotLabel}</span>
            </div>
            <p>{slotLabel}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
