import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import LoginPageHeader from '../components/login/layout/LoginPageHeader'
import CustomerLoginFormCard from '../components/login/sections/CustomerLoginFormCard'
import {
  readCurrentCustomer,
  readCustomerAccounts,
  writeCustomerAccounts,
  writeCurrentCustomer,
} from '../components/login/auth-storage'
import '../styles/pages/customer-login-page.css'

export default function CustomerLoginPage() {
  const currentCustomer = readCurrentCustomer()
  const navigate = useNavigate()
  const [authMode, setAuthMode] = useState('signin')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitNotice, setSubmitNotice] = useState('')

  if (currentCustomer) {
    return <Navigate to="/customer/dashboard" replace />
  }

  const handleSubmit = (event) => {
    event.preventDefault()

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
      setSubmitNotice(`Account created for ${normalizedEmail}. You can now sign in.`)
      setAuthMode('signin')
      setConfirmPassword('')
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
      signedInAt: new Date().toISOString(),
    })

    navigate('/customer/dashboard')
  }

  return (
    <div className="customerLoginPage">
      <LoginPageHeader />
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
            onAuthModeChange={(nextMode) => {
              setAuthMode(nextMode)
              setSubmitNotice('')
            }}
            onFullNameChange={setFullName}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            onConfirmPasswordChange={setConfirmPassword}
            onTogglePassword={() => setShowPassword((current) => !current)}
            onSubmit={handleSubmit}
          />
        </div>
      </main>
    </div>
  )
}
