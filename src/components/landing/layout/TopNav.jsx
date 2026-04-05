import { Link as ScrollLink } from 'react-scroll'
import { Link as RouterLink } from 'react-router-dom'

export default function TopNav({ navItems, menuOpen, onMenuToggle }) {
  const onNavigateTo = (event, targetId) => {
    event.preventDefault()

    const target = document.getElementById(targetId)
    if (target) {
      const navOffset = 70
      const top = target.getBoundingClientRect().top + window.scrollY - navOffset
      window.scrollTo({ top, behavior: 'smooth' })
    }

    onMenuToggle?.()
  }

  const onMobileBookNowClick = () => {
    onMenuToggle?.()
  }

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
            to="/packages"
          >
            Book Here
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
              <button
                type="button"
                key={item.targetId}
                className="mobileNavLink"
                onClick={(e) => onNavigateTo(e, item.targetId)}
              >
                {item.label}
              </button>
            ))}
            <RouterLink
              to="/packages"
              className="mobileBookNow"
              onClick={onMobileBookNowClick}
            >
              Book Now
            </RouterLink>
          </div>
        </div>
      )}
    </header>
  )
}

