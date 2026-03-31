import { Link } from 'react-scroll'

export default function TopNav({ navItems, menuOpen, onMenuToggle}) {
  return (
    <header className="navHeader">
      <div className="navInner">

        {/* to be replaced with logo*/} 
        <Link
          className="brand"
          to="heroSection"
          spy
          smooth
          offset={-70}
          duration={450}
          aria-label="BeachResort home"
        >
          MuniMuni
        </Link>

        <nav className="navLinks" aria-label="Primary navigation">
          {navItems.map((item) => (
            <Link
              activeClass="activeNavLink"
              spy
              smooth
              offset={-70}
              duration={450}
              key={item.targetId}
              className="navLink"
              to={item.targetId}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="navActions">
          <Link
            className="bookNowBtn"
            to="resort-highlights"
            spy
            smooth
            offset={-70}
            duration={450}
          >
            Book Now
          </Link>

          <button
            type="button"
            className="menuButton"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            onClick={onMenuToggle}
          >
            <span className="menuIcon" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="mobileMenu" role="dialog" aria-label="Mobile menu">
          <div className="mobileMenuInner">
            {navItems.map((item) => (
              <a
                key={item.targetId}
                href={`#${item.targetId}`}
                className="mobileNavLink"
                onClick={(e) => onNavigateTo(e, item.targetId)}
              >
                {item.label}
              </a>
            ))}
            <a
              href="#booking"
              className="mobileBookNow"
              onClick={(e) => onNavigateTo(e, 'booking')}
            >
              Book Now
            </a>
          </div>
        </div>
      )}
    </header>
  )
}

