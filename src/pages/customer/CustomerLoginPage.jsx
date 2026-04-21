import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import {
  CustomerLoginFormCard,
  readCurrentCustomer,
  readCustomerAccounts,
  writeCustomerAccounts,
  writeCurrentCustomer,
} from '../../components/login'
import '../../styles/pages/customer-login-page.css'

export default function CustomerLoginPage() {
  const currentCustomer = readCurrentCustomer()
  const location = useLocation()
  const navigate = useNavigate()
  const loginState = location.state ?? {}
  const returnTo = typeof loginState.returnTo === 'string' && loginState.returnTo ? loginState.returnTo : '/customer/dashboard'
  const [authMode, setAuthMode] = useState(loginState.authMode === 'signup' ? 'signup' : 'signin')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitNotice, setSubmitNotice] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [confirmPasswordError, setConfirmPasswordError] = useState('')

  if (currentCustomer) {
    return <Navigate to={returnTo} replace />
  }

  const getPasswordValidationMessage = (value) => {
    return value.length > 0 && value.length < 6 ? 'Password must be at least 6 characters long' : ''
  }

  const getConfirmPasswordValidationMessage = (value, passwordValue) => {
    return value.length > 0 && value !== passwordValue ? 'Passwords do not match' : ''
  }

  const handleAuthModeChange = (nextMode) => {
    setAuthMode(nextMode)
    setSubmitNotice('')
    setPasswordError('')
    setConfirmPasswordError('')
  }

  const handlePasswordChange = (value) => {
    setPassword(value)
    setPasswordError(getPasswordValidationMessage(value))
    if (authMode === 'signup') {
      setConfirmPasswordError(getConfirmPasswordValidationMessage(confirmPassword, value))
    }
  }

  const handleConfirmPasswordChange = (value) => {
    setConfirmPassword(value)
    setConfirmPasswordError(getConfirmPasswordValidationMessage(value, password))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (password.length < 6) {
      setSubmitNotice('Password must be at least 6 characters long.')
      return
    }

    if (authMode === 'signup') {
      if (password !== confirmPassword) {
        setSubmitNotice('Passwords do not match. Please re-check your password entries.')
        return
      }

      const normalizedEmail = email.trim().toLowerCase()
      const existing = readCustomerAccounts()
      const emailAlreadyExists = existing.some((account) => account.email === normalizedEmail)

      if (emailAlreadyExists) {
        setSubmitNotice(`An account with ${normalizedEmail} already exists. Please sign in instead.`)
        return
      }

      const nextRecord = {
        id: `cust-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        fullName: fullName.trim(),
        email: normalizedEmail,
        password,
        createdAt: new Date().toISOString(),
      }

      const nextAccounts = [...existing, nextRecord]

      writeCustomerAccounts(nextAccounts)
      writeCurrentCustomer({
        id: nextRecord.id,
        fullName: nextRecord.fullName,
        email: nextRecord.email,
        phone: nextRecord.phone || '',
        address: nextRecord.address || '',
        signedInAt: new Date().toISOString(),
      })
      setSubmitNotice(`Account created for ${normalizedEmail}. You are now signed in.`)
      setConfirmPassword('')
      navigate(returnTo, { replace: true })
      return
    }

    const accounts = readCustomerAccounts()
    const normalizedEmail = email.trim().toLowerCase()
    const matchedAccount = accounts.find((account) => account.email === normalizedEmail && account.password === password)

    if (!matchedAccount) {
      setSubmitNotice('No local account matched this email and password. Please sign up first.')
      return
    }

    // Generate ID if account doesn't have one (migration for old accounts)
    const accountId = matchedAccount.id || `cust-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
    
    // Update account with ID if it didn't have one
    if (!matchedAccount.id) {
      const updatedAccounts = accounts.map((acc) =>
        acc.email === normalizedEmail ? { ...acc, id: accountId } : acc,
      )
      writeCustomerAccounts(updatedAccounts)
    }

    writeCurrentCustomer({
      id: accountId,
      fullName: matchedAccount.fullName,
      email: matchedAccount.email,
      phone: matchedAccount.phone || '',
      address: matchedAccount.address || '',
      signedInAt: new Date().toISOString(),
    })

    navigate(returnTo, { replace: true })
  }

  return (
    <div className="customerLoginPage">
      <main className="customerLoginMain">
        <div className="customerLoginShell">
          <CustomerLoginFormCard
            authMode={authMode}
            fullName={fullName}
            email={email}
            password={password}
            confirmPassword={confirmPassword}
            showPassword={showPassword}
            submitNotice={submitNotice}
            passwordError={passwordError}
            confirmPasswordError={confirmPasswordError}
            onAuthModeChange={handleAuthModeChange}
            onFullNameChange={setFullName}
            onEmailChange={setEmail}
            onPasswordChange={handlePasswordChange}
            onConfirmPasswordChange={handleConfirmPasswordChange}
            onTogglePassword={() => setShowPassword((current) => !current)}
            onSubmit={handleSubmit}
          />
        </div>
      </main>
    </div>
  )
}
