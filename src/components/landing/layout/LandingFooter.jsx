const currentYear = new Date().getFullYear()

export default function LandingFooter() {
  return (
    <footer className="landingFooter" id="footer">
      <div className="landingFooterInner">
        <div className="landingFooterBrand">
          <h3>MuniMuni Beach Resort</h3>
          <p>Relax by the shore, stay for the memories.</p>
        </div>

        <nav className="landingFooterNav" aria-label="Footer navigation">
          <a href="/#resort-highlights">Highlights</a>
          <a href="/#resort-gallery">Gallery</a>
          <a href="/#featured-offers">Offers</a>
          <a href="/#resort-contact">Contact</a>
          <a href="/faq" target="_blank" rel="noreferrer">
            FAQ
          </a>
        </nav>

        <div className="landingFooterContact">
          <a href="tel:+639171234567">+63 917 123 4567</a>
          <a href="mailto:munimunibeachresort@gmail.com">munimunibeachresort@gmail.com</a>
          <a href="https://maps.app.goo.gl/Ukzys2Q58NGMzrad7" target="_blank" rel="noreferrer">
            Open in Maps
          </a>
        </div>
      </div>

      <p className="landingFooterCopy">{currentYear} MuniMuni Beach Resort. All rights reserved.</p>
    </footer>
  )
}
