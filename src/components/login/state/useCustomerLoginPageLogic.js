import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  readCurrentCustomer,
  readCustomerAccounts,
  writeCustomerAccounts,
  writeCurrentCustomer,
} from '../auth-storage'

export default function useCustomerLoginPageLogic() {
  const currentCustomer = readCurrentCustomer() // Check if a customer is already signed in.
  const navigate = useNavigate()
  // Determine where to redirect after login. Otherwise, default to '/customer/dashboard'.
  const location = useLocation()
  const loginState = location.state ?? {}
  const returnTo = typeof loginState.returnTo === 'string' && loginState.returnTo ? loginState.returnTo : '/customer/dashboard'
  // Form states
  const [authMode, setAuthMode] = useState(loginState.authMode === 'signup' ? 'signup' : 'signin')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitNotice, setSubmitNotice] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [confirmPasswordError, setConfirmPasswordError] = useState('')

  /**
   * @param {string} value - The password input value to validate.
   * Validate password length for sign up.
   */
  const getPasswordValidationMessage = (value) => {
    return value.length > 0 && value.length < 6 ? 'Password must be at least 6 characters long' : ''
  }

  /**
   * @param {string} value - The confirm password input value to validate.
   * @param {string} passwordValue - The password input value.
   * Validate password confirmation for sign up.
   */
  const getConfirmPasswordValidationMessage = (value, passwordValue) => {
    return value.length > 0 && value !== passwordValue ? 'Passwords do not match' : ''
  }

  /**
   * @param {string} nextMode - The next authentication mode (sign in or sign up).
   * Handle change of authentication mode (sign in or sign up) and reset form states.
   */
  const handleAuthModeChange = (nextMode) => {
    setAuthMode(nextMode)
    setSubmitNotice('')
    setPasswordError('')
    setConfirmPasswordError('')
  }

  /**
   * @param {string} value - The password input value.
   * Handle password input change and validate password and confirmation fields.
   */
  const handlePasswordChange = (value) => {
    setPassword(value)
    setPasswordError(getPasswordValidationMessage(value))
    if (authMode === 'signup') {
      setConfirmPasswordError(getConfirmPasswordValidationMessage(confirmPassword, value))
    }
  }

  /**
   * @param {string} value - The confirm password input value.
   * Handle confirm password input change and validate confirmation field (sign up mode).
   */
  const handleConfirmPasswordChange = (value) => {
    setConfirmPassword(value)
    setConfirmPasswordError(getConfirmPasswordValidationMessage(value, password))
  }

  /**
   * @param {object} event - The form submission event.
   * Handle form submission and validate all fields.
   */
  const handleSubmit = (event) => {
    event.preventDefault() // Prevent default form submission behavior

    // Validate password field
    if (password.length < 6) {
      setSubmitNotice('Password must be at least 6 characters long.')
      return
    }

    // Validations (sign up mode)
    if (authMode === 'signup') {
      if (password !== confirmPassword) {
        setSubmitNotice('Passwords do not match. Please re-check your password entries.')
        return
      }

      // Normalize email and check for existing account
      const normalizedEmail = email.trim().toLowerCase()
      const existing = readCustomerAccounts()
      const emailAlreadyExists = existing.some((account) => account.email === normalizedEmail)

      if (emailAlreadyExists) {
        setSubmitNotice(`An account with ${normalizedEmail} already exists. Please sign in instead.`)
        return
      }

      // Create new account record
      const nextRecord = {
        id: `cust-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        fullName: fullName.trim(),
        email: normalizedEmail,
        password,
        createdAt: new Date().toISOString(),
      }

      const nextAccounts = [...existing, nextRecord] // Save new account

      // Update accounts and current customer, then navigate to the intended page or dashboard
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
      navigate(returnTo, { replace: true }) // true to replace the login page in history, preventing back navigation to it after login
      return
    }

    // Sign in flow: Validate credentials and navigate to the intended page or dashboard
    const accounts = readCustomerAccounts()
    const normalizedEmail = email.trim().toLowerCase()
    const matchedAccount = accounts.find((account) => account.email === normalizedEmail && account.password === password)

    // If no matching account, show error notice
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

    // Set current customer and navigate to the intended page or dashboard
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

  const handleTogglePassword = () => {
    setShowPassword((current) => !current)
  }

  return {
    currentCustomer,
    returnTo,
    authMode,
    fullName,
    email,
    password,
    confirmPassword,
    showPassword,
    submitNotice,
    passwordError,
    confirmPasswordError,
    handleAuthModeChange,
    setFullName,
    setEmail,
    handlePasswordChange,
    handleConfirmPasswordChange,
    handleTogglePassword,
    handleSubmit,
  }
}
