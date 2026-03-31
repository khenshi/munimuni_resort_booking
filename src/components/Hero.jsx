import heroBg from '../assets/herobg.jpg'
import resortImage from '../assets/resort_sectionbg.jpg'
import { Link } from 'react-scroll'

export default function Hero() {
  return (
    <section className="heroSection" id="top" aria-label="Beach Resort Hero">
      <div className="heroBg" style={{ backgroundImage: `url(${heroBg})` }} aria-hidden="true" />

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
              <Link className="primaryCta" to="booking" spy={true} smooth={true} offset={-70} duration={450}>
                Book Now
              </Link>
              <Link
                className="secondaryCta"
                to="resort-gallery"
                spy={true}
                smooth={true}
                offset={-70}
                duration={450}
              >
                View Gallery
              </Link>
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

