import { Link as ScrollLink } from 'react-scroll'
import { Link as RouterLink } from 'react-router-dom'

export default function TopNav({ navItems, menuOpen, onMenuToggle}) {
  return (
    <header className="navHeader">
      <div className="navInner">

        {/* to be replaced with logo*/} 
        <ScrollLink
          className="brand"
          to="heroSection"
          spy
          smooth
          offset={-70}
          duration={450}
          aria-label="BeachResort home"
        >
          MuniMuni
        </ScrollLink>

        <nav className="navLinks" aria-label="Primary navigation">
          {navItems.map((item) => (
            <ScrollLink
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
            </ScrollLink>
          ))}
        </nav>

        <div className="navActions">
          <RouterLink
            className="bookNowBtn"
            to="/booking"
          >
            Book Now
          </RouterLink>

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

