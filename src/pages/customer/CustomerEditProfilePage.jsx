import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import {
  AUTH_CHANGED_EVENT,
  readCurrentCustomer,
  readCustomerAccounts,
  updateCustomerContactDetails,
  updateCustomerPassword,
} from '../../components/login'
import { AccountLayout } from '../../components/dashboard'
import '../../styles/pages/customer-profile-page.css'

function readEditableProfile(customerId, fallbackCustomer) {
  const matchedAccount = readCustomerAccounts().find((account) => account.id === customerId)

  return {
    fullName: String(matchedAccount?.fullName ?? fallbackCustomer?.fullName ?? '').trim(),
    email: String(matchedAccount?.email ?? fallbackCustomer?.email ?? '').trim(),
    phone: String(matchedAccount?.phone ?? fallbackCustomer?.phone ?? '').trim(),
    address: String(matchedAccount?.address ?? fallbackCustomer?.address ?? '').trim(),
  }
}

function isValidPhoneNumber(phoneValue) {
  return /^(09\d{9}|\+639\d{9})$/.test(phoneValue)
}

function sanitizePhoneInput(rawValue) {
  const normalizedValue = String(rawValue ?? '')
  if (normalizedValue.startsWith('+')) {
    const digitsAfterPlus = normalizedValue.slice(1).replace(/\D/g, '').slice(0, 12)
    return `+${digitsAfterPlus}`
  }

  return normalizedValue.replace(/\D/g, '').slice(0, 11)
}

function getPhoneValidationMessage(phoneValue) {
  if (!phoneValue) return ''
  if (isValidPhoneNumber(phoneValue)) return ''

  if (phoneValue.startsWith('+') && !phoneValue.startsWith('+63')) {
    return 'Phone number must start with +63.'
  }

  if (!phoneValue.startsWith('+') && !phoneValue.startsWith('09')) {
    return 'Phone number must start with 09 or +63.'
  }

  return 'Use 09XXXXXXXXX or +639XXXXXXXXX format.'
}

export default function CustomerEditProfilePage() {
  const [currentCustomer, setCurrentCustomer] = useState(() => readCurrentCustomer())
  const [contactForm, setContactForm] = useState(() => {
    const initialCustomer = readCurrentCustomer()
    if (!initialCustomer?.id) {
      return { fullName: '', email: '', phone: '', address: '' }
    }
    return readEditableProfile(initialCustomer.id, initialCustomer)
  })

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [showPasswords, setShowPasswords] = useState(false)
  const [contactNotice, setContactNotice] = useState('')
  const [contactNoticeType, setContactNoticeType] = useState('success')
  const [passwordNotice, setPasswordNotice] = useState('')
  const [passwordNoticeType, setPasswordNoticeType] = useState('error')
  const phoneValidationMessage = getPhoneValidationMessage(contactForm.phone)

  useEffect(() => {
    const syncCustomer = () => {
      const nextCustomer = readCurrentCustomer()
      setCurrentCustomer(nextCustomer)

      if (nextCustomer?.id) {
        setContactForm(readEditableProfile(nextCustomer.id, nextCustomer))
      }
    }

    window.addEventListener('storage', syncCustomer)
    window.addEventListener(AUTH_CHANGED_EVENT, syncCustomer)

    return () => {
      window.removeEventListener('storage', syncCustomer)
      window.removeEventListener(AUTH_CHANGED_EVENT, syncCustomer)
    }
  }, [currentCustomer?.id])

  if (!currentCustomer) {
    return <Navigate to="/customer/login" replace />
  }

  const handleContactSubmit = (event) => {
    event.preventDefault()

    const normalizedPhone = String(contactForm.phone ?? '').trim()
    if (normalizedPhone && !isValidPhoneNumber(normalizedPhone)) {
      setContactNoticeType('error')
      setContactNotice('Phone number must be in 09XXXXXXXXX or +639XXXXXXXXX format.')
      return
    }

    const result = updateCustomerContactDetails(currentCustomer.id, contactForm)

    if (!result.ok) {
      setContactNoticeType('error')
      setContactNotice(result.error || 'Unable to update contact details.')
      return
    }

    setContactNoticeType('success')
    setContactNotice('Contact details updated successfully.')
  }

  const handlePasswordSubmit = (event) => {
    event.preventDefault()

    if (currentPassword === newPassword) {
      setPasswordNoticeType('error')
      setPasswordNotice('New password must be different from your current password.')
      return
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordNoticeType('error')
      setPasswordNotice('New password and confirmation do not match.')
      return
    }

    const result = updateCustomerPassword(currentCustomer.id, currentPassword, newPassword)

    if (!result.ok) {
      setPasswordNoticeType('error')
      setPasswordNotice(result.error || 'Unable to update password.')
      return
    }

    setPasswordNoticeType('success')
    setPasswordNotice('Password updated successfully.')
    setCurrentPassword('')
    setNewPassword('')
    setConfirmNewPassword('')
  }

  return (
    <AccountLayout>
      <section className="customerProfileShell" aria-labelledby="customer-profile-title">
        <header className="customerProfileHero">
          <div className="heroText">
            <p className="customerProfileKicker">My Account</p>
            <h1 id="customer-profile-title">Personal Information & Security</h1>
            <p className="customerProfileDescription">
              Update your account details and manage security settings below.
            </p>
          </div>
        </header>

        <div className="customerProfileGrid">
          <article className="customerProfileCard">
            <div className="cardHeader">
              <h2 className="cardTitle">Contact Details</h2>
              <p className="cardDescription">How we can reach you for stay updates.</p>
            </div>
            <form onSubmit={handleContactSubmit} className="customerProfileForm">
              <div className="formField">
                <label htmlFor="profile-full-name">Full Name</label>
                <input
                  id="profile-full-name"
                  type="text"
                  value={contactForm.fullName}
                  onChange={(event) => setContactForm((prev) => ({ ...prev, fullName: event.target.value }))}
                  placeholder="Your full name"
                />
              </div>

              <div className="formField">
                <label htmlFor="profile-email">Email Address</label>
                <input
                  id="profile-email"
                  type="email"
                  value={contactForm.email}
                  onChange={(event) => setContactForm((prev) => ({ ...prev, email: event.target.value }))}
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="formField">
                <label htmlFor="profile-phone">Phone Number</label>
                <input
                  id="profile-phone"
                  type="text"
                  value={contactForm.phone}
                  onChange={(event) => {
                    const sanitizedPhone = sanitizePhoneInput(event.target.value)
                    setContactForm((prev) => ({ ...prev, phone: sanitizedPhone }))
                  }}
                  placeholder="09xx xxx xxxx"
                  inputMode="numeric"
                  maxLength={contactForm.phone.startsWith('+') ? 13 : 11}
                />
                {phoneValidationMessage ? <p className="customerProfileNotice error">{phoneValidationMessage}</p> : null}
              </div>

              <div className="formField">
                <label htmlFor="profile-address">Mailing Address</label>
                <textarea
                  id="profile-address"
                  rows={3}
                  value={contactForm.address}
                  onChange={(event) => setContactForm((prev) => ({ ...prev, address: event.target.value }))}
                  placeholder="Street, city, province"
                />
              </div>

              <div className="formActions">
                <button type="submit" className="saveProfileBtn">Save Changes</button>
                {contactNotice && <p className={`customerProfileNotice ${contactNoticeType}`}>{contactNotice}</p>}
              </div>
            </form>
          </article>

          <article className="customerProfileCard">
            <div className="cardHeader">
              <h2 className="cardTitle">Account Security</h2>
              <p className="cardDescription">Keep your account safe with a strong password.</p>
            </div>
            <form onSubmit={handlePasswordSubmit} className="customerProfileForm">
              <div className="formField">
                <label htmlFor="profile-current-password">Current Password</label>
                <input
                  id="profile-current-password"
                  type={showPasswords ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                  required
                />
              </div>

              <div className="formField">
                <label htmlFor="profile-new-password">New Password</label>
                <input
                  id="profile-new-password"
                  type={showPasswords ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  minLength={6}
                  required
                />
              </div>

              <div className="formField">
                <label htmlFor="profile-confirm-password">Confirm New Password</label>
                <input
                  id="profile-confirm-password"
                  type={showPasswords ? 'text' : 'password'}
                  value={confirmNewPassword}
                  onChange={(event) => setConfirmNewPassword(event.target.value)}
                  minLength={6}
                  required
                />
              </div>

              <div className="formField">
                <label htmlFor="profile-show-password" className="profileCheckboxLabel">
                  <input
                    id="profile-show-password"
                    type="checkbox"
                    checked={showPasswords}
                    onChange={(event) => setShowPasswords(event.target.checked)}
                  />{' '}
                  Show passwords
                </label>
              </div>

              <div className="formActions">
                <button type="submit" className="saveProfileBtn secondary">Update Password</button>
                {passwordNotice && <p className={`customerProfileNotice ${passwordNoticeType}`}>{passwordNotice}</p>}
              </div>
            </form>
          </article>
        </div>
      </section>
    </AccountLayout>
  )
}
