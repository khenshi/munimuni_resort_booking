import TopNav from './TopNav'
import heroBg from '../assets/herobg.jpg'
import resortImage from '../assets/resort_sectionbg.jpg'

export default function Hero({ navItems, menuOpen, onMenuToggle, onNavigateTo }) {
  return (
    <section className="heroSection" id="top" aria-label="Beach Resort Hero">
      <div className="heroBg" style={{ backgroundImage: `url(${heroBg})` }} aria-hidden="true" />

      <TopNav
        navItems={navItems}
        menuOpen={menuOpen}
        onMenuToggle={onMenuToggle}
        onNavigateTo={onNavigateTo}
      />

      <main className="heroContent">
        <div className="heroGrid">
          <div className="heroCopy">
            <div className="kicker">Sea, Sand, Serenity</div>
            <h1>
              <span className="heroHeadingAccent">Muni-Muni</span> Beach Resort Samal Island
            </h1>
            <p>
              Discover your perfect escape, where golden sands, crystal waters, and peaceful moments come together.
            </p>

            <div className="heroCtas">
              <a className="primaryCta" href="#booking" onClick={(e) => onNavigateTo(e, 'booking')}>
                Book Now
              </a>
              <a
                className="secondaryCta"
                href="#gallery"
                onClick={(e) => onNavigateTo(e, 'gallery')}
              >
                View Gallery
              </a>
            </div>
          </div>

          <aside className="heroResortPanel" aria-label="Muni-Muni Beach Resort image">
            <img src={resortImage} alt="Beachfront view of Muni-Muni Beach Resort" />
          </aside>
        </div>
      </main>

      {/* Anchors for the sections */}
      <div id="resort" className="sectionAnchor" />
      <div id="experiences" className="sectionAnchor" />
      <div id="gallery" className="sectionAnchor" />
      <div id="booking" className="sectionAnchor bookingAnchor" />
    </section>
  )
}

