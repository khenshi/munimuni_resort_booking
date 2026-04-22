import { useEffect, useMemo, useRef, useState } from 'react'
import { Link as ScrollLink } from 'react-scroll'
import { Link as RouterLink } from 'react-router-dom'
import {
  AUTH_CHANGED_EVENT,
  clearCurrentCustomer,
  readCurrentCustomer,
} from '../../login/auth-storage'


/**
 * @param {Object[]} navItems - An array of navigation items, each containing a 'label' for display and a 'targetId' corresponding to the ID of the section to scroll to when clicked.
 * @returns {JSX.Element} The top navigation component.
 */
export default function TopNav({ navItems }) {
  //dropdown states
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  //customer account state
  const [currentCustomer, setCurrentCustomer] = useState(() => readCurrentCustomer())

  //references for DOMS
  const profileMenuRef = useRef(null)
  const menuButtonRef = useRef(null)
  const mobileMenuRef = useRef(null)

  //derive customer initials for profile button
  const customerInitials = useMemo(() => {
    const name = currentCustomer?.fullName?.trim() ?? ''
    if (!name) return 'P'

    const segments = name.split(/\s+/).filter(Boolean) //regex to split by whitespace and filter out empty segments (in case of multiple spaces)
    if (segments.length === 1) return segments[0].slice(0, 1).toUpperCase()
    return `${segments[0].slice(0, 1)}${segments[segments.length - 1].slice(0, 1)}`.toUpperCase()
  }, [currentCustomer])

  // sync current customer on auth change and handle outside clicks for dropdowns and escape key to close
  useEffect(() => {
    // Sync current customer when auth changes in other tabs or on sign in/sign out
    const syncCurrentCustomer = () => setCurrentCustomer(readCurrentCustomer())
    // Close dropdowns when clicking outside or pressing escape
    const onDocMouseDown = (event) => {
      if (!profileMenuRef.current?.contains(event.target)) {
        setProfileMenuOpen(false)
      }

      if (!menuButtonRef.current?.contains(event.target) && !mobileMenuRef.current?.contains(event.target)) {
        setMenuOpen(false)
      }

    }
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setProfileMenuOpen(false)
        setMenuOpen(false)
      }
    }

    window.addEventListener('storage', syncCurrentCustomer) // Listen to storage events to handle auth changes across tabs
    window.addEventListener(AUTH_CHANGED_EVENT, syncCurrentCustomer) // Custom event for auth changes within the same tab
    document.addEventListener('mousedown', onDocMouseDown)
    document.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('storage', syncCurrentCustomer)
      window.removeEventListener(AUTH_CHANGED_EVENT, syncCurrentCustomer)
      document.removeEventListener('mousedown', onDocMouseDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  // Handle navigation to sections and close mobile menu
  const onNavigateTo = (event, targetId) => {
    event.preventDefault()

    const target = document.getElementById(targetId)
    if (target) {
      const navOffset = 70
      const top = target.getBoundingClientRect().top + window.scrollY - navOffset
      window.scrollTo({ top, behavior: 'smooth' })
    }

    setMenuOpen(false)
  }

  // Close mobile menu when clicking "Book Here" in mobile menu
  const onMobileBookNowClick = () => {
    setMenuOpen(false)
  }

  // Handle sign out action
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
          {/* Render navigation links using react-scroll's ScrollLink for smooth scrolling to sections */}
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
          <a href={`${window.location.origin}/faq`} className="navLink" target="_blank" >
            FAQ
          </a>
        </nav>

        {/* Profile menu, Book Now button, and mobile menu button */}
        <div className="navActions">
          {/* Profile menu with conditional rendering based on authentication state */}
          <div className="profileMenuWrap" ref={profileMenuRef}>
            <button
              type="button"
              className="profileFabButton"
              aria-label="Open profile menu"
              aria-haspopup="menu"
              aria-expanded={profileMenuOpen}
              onClick={() => {
                setProfileMenuOpen((prev) => !prev)
                setMenuOpen(false)
              }}
            >
              {customerInitials}
            </button>

            {/* Dropdown menu for profile actions, conditionally rendered based on authentication state */}  
            {profileMenuOpen ? (
              <div className="profileDropdownMenu" role="menu" aria-label="Profile menu">
                {currentCustomer ? (
                  <>
                    <p className="profileDropdownTitle">{currentCustomer.fullName || currentCustomer.email}</p>
                    <RouterLink
                      to="/customer/history"
                      className="profileDropdownLink"
                      role="menuitem"
                      onClick={() => setProfileMenuOpen(false)}
                    >
                      History & Receipts
                    </RouterLink>
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

          {/* Mobile menu button, visible on smaller screens */}
          <button
            type="button"
            className="menuButton"
            ref={menuButtonRef}
            aria-label="Open menu"
            aria-expanded={menuOpen}
            onClick={() => {
              setMenuOpen((prev) => !prev)
              setProfileMenuOpen(false)
            }}
          >
            <span className="menuIcon" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile menu, conditionally rendered based on menuOpen state */}
      {menuOpen && (
        <div className="mobileMenu" ref={mobileMenuRef} role="dialog" aria-label="Mobile menu">
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
              Book Here
            </RouterLink>
          </div>
        </div>
      )}
    </header>
  )
}

