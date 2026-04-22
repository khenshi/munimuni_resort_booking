export default function PackageOfferGallerySection({ headingId, galleryImages = [] }) {
  const visibleImages = galleryImages.slice(0, 4)

  return (
    <section className="offerDetailsGallerySection" aria-labelledby={headingId}>
      <div className="offerDetailsSectionHeader">
        <div>
          <p className="packagesSectionKicker">Package Gallery</p>
          <h3 id={headingId}>Pictures of the package</h3>
        </div>
      </div>

      <div className="offerDetailsGalleryGrid">
        {visibleImages.map((imageSrc, index) => (
          <div key={`${imageSrc}-${index}`} className="offerDetailsGalleryCard" role="presentation">
            <div className="offerDetailsGalleryPlaceholder">
              <img className="offerDetailsGalleryImage" src={imageSrc} alt={`Package view ${index + 1}`} loading="lazy" />
            </div>
            <p>{`View ${index + 1}`}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
