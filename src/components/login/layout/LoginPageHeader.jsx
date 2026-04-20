import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AUTH_CHANGED_EVENT,
  clearCurrentCustomer,
  readCurrentCustomer,
} from '../auth-storage'

export default function LoginPageHeader() {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [currentCustomer, setCurrentCustomer] = useState(() => readCurrentCustomer())
  const profileMenuRef = useRef(null)

  const customerInitials = useMemo(() => {
    const name = currentCustomer?.fullName?.trim() ?? ''
    if (!name) {
      const emailName = (currentCustomer?.email ?? '').trim()
      return emailName ? emailName.slice(0, 1).toUpperCase() : 'P'
    }

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

  const handleSignOut = () => {
    clearCurrentCustomer()
    setProfileMenuOpen(false)
  }

  return (
    <header className="loginPageHeader">
      <div className="loginPageHeaderInner">
        <Link to="/" className="loginPageBrand">
          MuniMuni
        </Link>

        <div className="loginPageHeaderActions">
          <nav className="loginPageNav" aria-label="Customer login navigation">
            <Link to="/" className="loginPageNavLink">
              Explore
            </Link>
            <Link to="/packages" className="loginPageNavLink">
              Browse Packages
            </Link>
          </nav>

          <div className="loginProfileMenuWrap" ref={profileMenuRef}>
            <button
              type="button"
              className="loginProfileFabButton"
              aria-label="Open profile menu"
              aria-haspopup="menu"
              aria-expanded={profileMenuOpen}
              onClick={() => setProfileMenuOpen((prev) => !prev)}
            >
              {customerInitials}
            </button>

            {profileMenuOpen ? (
              <div className="loginProfileDropdownMenu" role="menu" aria-label="Profile menu">
                {currentCustomer ? (
                  <>
                    <p className="loginProfileDropdownTitle">{currentCustomer.fullName || currentCustomer.email}</p>
                    <Link
                      to="/customer/history"
                      className="loginProfileDropdownLink"
                      role="menuitem"
                      onClick={() => setProfileMenuOpen(false)}
                    >
                      History and Receipts
                    </Link>
                    <Link
                      to="/customer/payment"
                      className="packagesProfileDropdownLink"
                      role="menuitem"
                      onClick={() => setProfileMenuOpen(false)}
                    >
                      Payment
                    </Link>
                    <Link
                      to="/customer/dashboard"
                      className="loginProfileDropdownLink"
                      role="menuitem"
                      onClick={() => setProfileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/customer/profile"
                      className="loginProfileDropdownLink"
                      role="menuitem"
                      onClick={() => setProfileMenuOpen(false)}
                    >
                      Edit Profile
                    </Link>
                    <button
                      type="button"
                      className="loginProfileDropdownButton"
                      role="menuitem"
                      onClick={handleSignOut}
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link
                    to="/customer/login"
                    className="loginProfileDropdownLink"
                    role="menuitem"
                    onClick={() => setProfileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  )
}
