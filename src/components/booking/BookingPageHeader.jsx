import { Link } from 'react-router-dom'

export default function BookingPageHeader() {
  return (
    <header className="bookingPageHeader">
      <div className="bookingPageHeaderInner">
        <Link to="/" className="bookingPageBrand">
          MuniMuni
        </Link>

        <nav className="bookingPageNav">
          <Link to="/packages" className="bookingPageNavLink">
            View More Packages
          </Link>
          <button onClick={() => window.history.back()} className="bookingPageNavLink">
            ← Back to Details
          </button>
        </nav>
      </div>
    </header>
  )
}
