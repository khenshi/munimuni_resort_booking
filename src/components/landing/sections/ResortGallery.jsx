import { useRef, useState } from 'react'
import { resortImages } from '../../../data/landing'

export default function ResortGallery() {
  const [activeIndex, setActiveIndex] = useState(0)   // State to track the currently active image index in the gallery
  const touchStartX = useRef(0) // Ref to store the starting X coordinate of a touch event for swipe detection
  const touchCurrentX = useRef(0) // Ref to store the current X coordinate during a touch move event for swipe detection

  // Handlers for navigating to the previous and next images in the gallery, with wrap-around logic
  const goToPrev = () => {
    setActiveIndex((index) => (index === 0 ? resortImages.length - 1 : index - 1))
  }

  const goToNext = () => {
    setActiveIndex((index) => (index + 1) % resortImages.length) 
  }

  // Handlers for touch events to enable swipe navigation on mobile devices
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

          {/* Main image display area, showing the currently active image in the gallery with appropriate alt text for accessibility */}
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

          {/* Thumbnail navigation row, allowing users to click on thumbnails to navigate directly to a specific image in the gallery, with ARIA attributes for accessibility */}
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

          {/* Meta information about the gallery, including the current image index and a hint for users to swipe or tap thumbnails for navigation, with ARIA live region for announcing changes to assistive technologies */}
          <div className="resortGalleryMeta" aria-live="polite">
            <span className="resortGalleryCount">
              {activeIndex + 1} / {resortImages.length}
            </span>
            <span className="resortGalleryHint">Swipe or tap thumbnails</span>
          </div>
        </div>

        <div className="textContainer">
          <h2>Experience Inner Peace</h2>
          <p>Discover a sanctuary where the rhythm of the waves meets the stillness of the cliffs. Immerse yourself in crystal-clear waters and vibrant coral gardens designed by nature.</p>
          <p>
            <strong>Explore Our Oasis</strong>
          </p>
        </div>
      </div>
    </section>
  )
}