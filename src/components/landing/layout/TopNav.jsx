import { useEffect, useMemo, useRef, useState } from 'react'
import { Link as ScrollLink } from 'react-scroll'
import { Link as RouterLink } from 'react-router-dom'
import {
  AUTH_CHANGED_EVENT,
  clearCurrentCustomer,
  readCurrentCustomer,
} from '../../login/auth-storage'

export default function TopNav({ navItems, menuOpen, onMenuToggle }) {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [currentCustomer, setCurrentCustomer] = useState(() => readCurrentCustomer())
  const profileMenuRef = useRef(null)

  const customerInitials = useMemo(() => {
    const name = currentCustomer?.fullName?.trim() ?? ''
    if (!name) return 'P'

    const segments = name.split(/\s+/).filter(Boolean)
    if (segments.length === 1) return segments[0].slice(0, 1).toUpperCase()
    return `${segments[0].slice(0, 1)}${segments[1].slice(0, 1)}`.toUpperCase()
  }, [currentCustomer])

  useEffect(() => {
    const syncCurrentCustomer = () => setCurrentCustomer(readCurrentCustomer())
    const onDocMouseDown = (event) => {
      if (!profileMenuRef.current?.contains(event.target)) {
        setProfileMenuOpen(false)
      }
    }
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setProfileMenuOpen(false)
    }

    window.addEventListener('storage', syncCurrentCustomer)
    window.addEventListener(AUTH_CHANGED_EVENT, syncCurrentCustomer)
    document.addEventListener('mousedown', onDocMouseDown)
    document.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('storage', syncCurrentCustomer)
      window.removeEventListener(AUTH_CHANGED_EVENT, syncCurrentCustomer)
      document.removeEventListener('mousedown', onDocMouseDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [])

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

  const handleSignOut = () => {
    clearCurrentCustomer()
    setProfileMenuOpen(false)
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
          <div className="profileMenuWrap" ref={profileMenuRef}>
            <button
              type="button"
              className="profileFabButton"
              aria-label="Open profile menu"
              aria-haspopup="menu"
              aria-expanded={profileMenuOpen}
              onClick={() => setProfileMenuOpen((prev) => !prev)}
            >
              {customerInitials}
            </button>

            {profileMenuOpen ? (
              <div className="profileDropdownMenu" role="menu" aria-label="Profile menu">
                {currentCustomer ? (
                  <>
                    <p className="profileDropdownTitle">{currentCustomer.fullName || currentCustomer.email}</p>
                    <RouterLink
                      to="/customer/dashboard"
                      className="profileDropdownLink"
                      role="menuitem"
                      onClick={() => setProfileMenuOpen(false)}
                    >
                      Dashboard
                    </RouterLink>
                    <button type="button" className="profileDropdownButton" role="menuitem" onClick={handleSignOut}>
                      Sign Out
                    </button>
                  </>
                ) : (
                  <RouterLink
                    to="/customer/login"
                    className="profileDropdownLink"
                    role="menuitem"
                    onClick={() => setProfileMenuOpen(false)}
                  >
                    Sign In
                  </RouterLink>
                )}
              </div>
            ) : null}
          </div>

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

