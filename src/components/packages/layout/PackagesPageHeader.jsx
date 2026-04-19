import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AUTH_CHANGED_EVENT,
  clearCurrentCustomer,
  readCurrentCustomer,
} from '../../login/auth-storage'

export default function PackagesPageHeader({ activeTab, onTabChange }) {
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
    <header className="packagesPageHeader">
      <div className="packagesPageHeaderInner">
        <Link to="/" className="packagesPageBrand">
          MuniMuni
        </Link>

        <div className="packagesToggleGroup">
          <button
            type="button"
            className={`packagesToggle ${activeTab === 'overnight' ? 'active' : ''}`}
            onClick={() => onTabChange('overnight')}
          >
            Overnight Packages
          </button>
          <button
            type="button"
            className={`packagesToggle ${activeTab === 'daytour' ? 'active' : ''}`}
            onClick={() => onTabChange('daytour')}
          >
            Day Tour Packages
          </button>
          <button
            type="button"
            className={`packagesToggle ${activeTab === 'addons' ? 'active' : ''}`}
            onClick={() => onTabChange('addons')}
          >
            Add Ons
          </button>
        </div>

        <div className="packagesHeaderActions">
          <div className="packagesProfileMenuWrap" ref={profileMenuRef}>
            <button
              type="button"
              className="packagesProfileFabButton"
              aria-label="Open profile menu"
              aria-haspopup="menu"
              aria-expanded={profileMenuOpen}
              onClick={() => setProfileMenuOpen((prev) => !prev)}
            >
              {customerInitials}
            </button>

            {profileMenuOpen ? (
              <div className="packagesProfileDropdownMenu" role="menu" aria-label="Profile menu">
                {currentCustomer ? (
                  <>
                    <p className="packagesProfileDropdownTitle">{currentCustomer.fullName || currentCustomer.email}</p>
                    <Link
                      to="/customer/history"
                      className="packagesProfileDropdownLink"
                      role="menuitem"
                      onClick={() => setProfileMenuOpen(false)}
                    >
                      History and Receipts
                    </Link>
                    <Link
                      to="/customer/dashboard"
                      className="packagesProfileDropdownLink"
                      role="menuitem"
                      onClick={() => setProfileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/customer/profile"
                      className="packagesProfileDropdownLink"
                      role="menuitem"
                      onClick={() => setProfileMenuOpen(false)}
                    >
                      Edit Profile
                    </Link>
                    <button
                      type="button"
                      className="packagesProfileDropdownButton"
                      role="menuitem"
                      onClick={handleSignOut}
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link
                    to="/customer/login"
                    className="packagesProfileDropdownLink"
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
