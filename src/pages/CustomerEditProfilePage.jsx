import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import LoginPageHeader from '../components/login/layout/LoginPageHeader'
import {
  AUTH_CHANGED_EVENT,
  readCurrentCustomer,
  readCustomerAccounts,
  updateCustomerContactDetails,
  updateCustomerPassword,
} from '../components/login/auth-storage'
import '../styles/pages/customer-profile-page.css'

function readEditableProfile(customerId, fallbackCustomer) {
  const matchedAccount = readCustomerAccounts().find((account) => account.id === customerId)

  return {
    fullName: String(matchedAccount?.fullName ?? fallbackCustomer?.fullName ?? '').trim(),
    email: String(matchedAccount?.email ?? fallbackCustomer?.email ?? '').trim(),
    phone: String(matchedAccount?.phone ?? fallbackCustomer?.phone ?? '').trim(),
    address: String(matchedAccount?.address ?? fallbackCustomer?.address ?? '').trim(),
  }
}

import AccountLayout from '../components/dashboard/layout/AccountLayout'

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
  const [contactNotice, setContactNotice] = useState('')
  const [passwordNotice, setPasswordNotice] = useState('')

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
    const result = updateCustomerContactDetails(currentCustomer.id, contactForm)

    if (!result.ok) {
      setContactNotice(result.error || 'Unable to update contact details.')
      return
    }

    setContactNotice('Contact details updated successfully.')
  }

  const handlePasswordSubmit = (event) => {
    event.preventDefault()

    if (newPassword !== confirmNewPassword) {
      setPasswordNotice('New password and confirmation do not match.')
      return
    }

    const result = updateCustomerPassword(currentCustomer.id, currentPassword, newPassword)

    if (!result.ok) {
      setPasswordNotice(result.error || 'Unable to update password.')
      return
    }

    setPasswordNotice('Password updated successfully.')
    setCurrentPassword('')
    setNewPassword('')
    setConfirmNewPassword('')
  }

  return (
    <AccountLayout>
      <section className="customerProfileShell" aria-labelledby="customer-profile-title">
        <header className="customerProfileHero">
          <p className="customerProfileKicker">My Account</p>
          <h1 id="customer-profile-title">Edit profile and account security</h1>
          <p>
            Changes are saved locally and scoped to your account id to keep user data isolated.
          </p>
        </header>

        <div className="customerProfileGrid">
          <article className="customerProfileCard">
            <h2>Contact details</h2>
            <form onSubmit={handleContactSubmit} className="customerProfileForm">
              <label htmlFor="profile-full-name">Full name</label>
              <input
                id="profile-full-name"
                type="text"
                value={contactForm.fullName}
                onChange={(event) => setContactForm((prev) => ({ ...prev, fullName: event.target.value }))}
                placeholder="Your full name"
              />

              <label htmlFor="profile-email">Email</label>
              <input
                id="profile-email"
                type="email"
                value={contactForm.email}
                onChange={(event) => setContactForm((prev) => ({ ...prev, email: event.target.value }))}
                placeholder="you@example.com"
                required
              />

              <label htmlFor="profile-phone">Phone</label>
              <input
                id="profile-phone"
                type="text"
                value={contactForm.phone}
                onChange={(event) => setContactForm((prev) => ({ ...prev, phone: event.target.value }))}
                placeholder="09xx xxx xxxx"
              />

              <label htmlFor="profile-address">Address</label>
              <textarea
                id="profile-address"
                rows={3}
                value={contactForm.address}
                onChange={(event) => setContactForm((prev) => ({ ...prev, address: event.target.value }))}
                placeholder="Street, city, province"
              />

              <button type="submit">Save contact details</button>
              {contactNotice ? <p className="customerProfileNotice">{contactNotice}</p> : null}
            </form>
          </article>

          <article className="customerProfileCard">
            <h2>Update password</h2>
            <form onSubmit={handlePasswordSubmit} className="customerProfileForm">
              <label htmlFor="profile-current-password">Current password</label>
              <input
                id="profile-current-password"
                type="password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                required
              />

              <label htmlFor="profile-new-password">New password</label>
              <input
                id="profile-new-password"
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                minLength={6}
                required
              />

              <label htmlFor="profile-confirm-password">Confirm new password</label>
              <input
                id="profile-confirm-password"
                type="password"
                value={confirmNewPassword}
                onChange={(event) => setConfirmNewPassword(event.target.value)}
                minLength={6}
                required
              />

              <button type="submit">Save new password</button>
              {passwordNotice ? <p className="customerProfileNotice">{passwordNotice}</p> : null}
            </form>
          </article>
        </div>
      </section>
    </AccountLayout>
  )
}
