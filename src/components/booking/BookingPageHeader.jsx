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
            View Packages
          </Link>
          <Link to="/" className="bookingPageNavLink">
            Explore
          </Link>
        </nav>
      </div>
    </header>
  )
}
