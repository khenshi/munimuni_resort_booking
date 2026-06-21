import { useEffect, useRef, useState } from 'react'
import { Link as ScrollLink } from 'react-scroll'
import { Link as RouterLink } from 'react-router-dom'

/**
 * @param {Object[]} navItems - An array of navigation items, each containing a 'label' for display and a 'targetId' corresponding to the ID of the section to scroll to when clicked.
 * @returns {JSX.Element} The top navigation component.
 */
export default function TopNav({ navItems }) {
  const [menuOpen, setMenuOpen] = useState(false)

  const menuButtonRef = useRef(null)
  const mobileMenuRef = useRef(null)

  useEffect(() => {
    const onDocMouseDown = (event) => {
      if (!menuButtonRef.current?.contains(event.target) && !mobileMenuRef.current?.contains(event.target)) {
        setMenuOpen(false)
      }

    }
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', onDocMouseDown)
    document.addEventListener('keydown', onKeyDown)

    return () => {
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
          <a href="/faq" className="navLink" target="_blank" >
          FAQ
          </a>
        </nav>

        <div className="navActions">
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

