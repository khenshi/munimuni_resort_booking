import { Navigate } from 'react-router-dom'
import {
  CustomerLoginFormCard,
  useCustomerLoginPageLogic,
} from '../../components/login'
import '../../styles/pages/customer-login-page.css'

export default function CustomerLoginPage() {
  const {
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
  } = useCustomerLoginPageLogic()

  // If already signed in, redirect to the intended page or dashboard
  if (currentCustomer) {
    return <Navigate to={returnTo} replace />
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
            onTogglePassword={handleTogglePassword}
            onSubmit={handleSubmit}
          />
        </div>
      </main>
    </div>
  )
}
