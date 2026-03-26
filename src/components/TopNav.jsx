export default function TopNav({ navItems, menuOpen, onMenuToggle, onNavigateTo }) {
  return (
    <header className="navHeader">
      <div className="navInner">

        // to be replaced with logo 
        <a
          className="brand"
          href="#top"
          onClick={(e) => onNavigateTo(e, 'top')}
          aria-label="BeachResort home"
        >
          MuniMuni
        </a>

        <nav className="navLinks" aria-label="Primary navigation">
          {navItems.map((item) => (
            <a
              key={item.targetId}
              href={`#${item.targetId}`}
              className="navLink"
              onClick={(e) => onNavigateTo(e, item.targetId)}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="navActions">
          <a
            className="bookNowBtn"
            href="#booking"
            onClick={(e) => onNavigateTo(e, 'booking')}
          >
            Book Now
          </a>

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

