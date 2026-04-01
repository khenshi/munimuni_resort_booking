import { Link } from 'react-router-dom'

export default function BookingPageHeader({ detailsTo = '/packages' }) {
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
          <Link to={detailsTo} className="bookingPageNavLink">
            ← Back to Details
          </Link>
        </nav>
      </div>
    </header>
  )
}
