import { useRef, useState } from 'react'
import { resortImages } from '../../../data/landing'

export default function ResortGallery() {
  const [activeIndex, setActiveIndex] = useState(0)
  const touchStartX = useRef(0)
  const touchCurrentX = useRef(0)

  const goToPrev = () => {
    setActiveIndex((index) => (index === 0 ? resortImages.length - 1 : index - 1))
  }

  const goToNext = () => {
    setActiveIndex((index) => (index + 1) % resortImages.length)
  }

  const onTouchStart = (event) => {
    touchStartX.current = event.changedTouches[0].clientX
    touchCurrentX.current = event.changedTouches[0].clientX
  }

  const onTouchMove = (event) => {
    touchCurrentX.current = event.changedTouches[0].clientX
  }

  const onTouchEnd = () => {
    const distance = touchStartX.current - touchCurrentX.current

    if (Math.abs(distance) < 40) return

    if (distance > 0) goToNext()
    else goToPrev()
  }

  return (
    <section className="resortSection" id="resort-gallery">
      <header className="resortSectionHeader">
        <p className="resortSectionKicker">At A Glance</p>
        <h2 className="resortSectionTitle">Resort Gallery</h2>
      </header>

      <div className="sectionFirst">
        <div
          className="resortGallery"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <button
            type="button"
            className="galleryNavButton galleryNavButtonPrev"
            onClick={goToPrev}
            aria-label="Previous image"
          >
            <span aria-hidden="true">‹</span>
          </button>

          <figure className="resortFrame">
            <img
              src={resortImages[activeIndex].src}
              alt={resortImages[activeIndex].alt}
              className="resortImg"
            />
          </figure>

          <button
            type="button"
            className="galleryNavButton galleryNavButtonNext"
            onClick={goToNext}
            aria-label="Next image"
          >
            <span aria-hidden="true">›</span>
          </button>

          <div className="resortThumbRow" role="tablist" aria-label="Resort gallery thumbnails">
            {resortImages.map((image, index) => (
              <button
                key={image.alt}
                type="button"
                className={`resortThumb ${activeIndex === index ? 'isActive' : ''}`}
                onClick={() => setActiveIndex(index)}
                aria-label={`Show image ${index + 1}`}
                aria-selected={activeIndex === index}
                role="tab"
              >
                <img src={image.src} alt="" aria-hidden="true" />
              </button>
            ))}
          </div>

          <div className="resortGalleryMeta" aria-live="polite">
            <span className="resortGalleryCount">
              {activeIndex + 1} / {resortImages.length}
            </span>
            <span className="resortGalleryHint">Swipe or tap thumbnails</span>
          </div>
        </div>

        <div className="textContainer">
          <h2>Experience Inner Peace</h2>
          <p>World class beach, with stunning corals and shit.</p>
          <p>
            <strong>improve typography</strong>
          </p>
        </div>
      </div>
    </section>
  )
}