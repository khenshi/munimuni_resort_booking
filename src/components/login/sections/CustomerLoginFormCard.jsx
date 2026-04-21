import { Link } from 'react-router-dom'

export default function CustomerLoginFormCard({
  authMode,
  fullName,
  email,
  password,
  confirmPassword,
  showPassword,
  submitNotice,
  passwordError,
  confirmPasswordError,
  onAuthModeChange,
  onFullNameChange,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onTogglePassword,
  onSubmit,
}) {
  const isSignUp = authMode === 'signup'

  return (
    <section className="customerLoginCard" aria-labelledby="customer-login-title">
      <div className="customerLoginCardTop">
        <h2 id="customer-login-title">{isSignUp ? 'Create Account' : 'Customer Login'}</h2>
        <p>
          {isSignUp
            ? 'Create your customer profile to get started.'
            : 'Use your account credentials to continue your reservation flow.'}
        </p>
      </div>

      <div className="customerAuthModeSwitch" role="tablist" aria-label="Authentication mode">
        <button
          type="button"
          role="tab"
          aria-selected={!isSignUp}
          className={`customerAuthModeBtn ${!isSignUp ? 'active' : ''}`}
          onClick={() => onAuthModeChange('signin')}
        >
          Sign In
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={isSignUp}
          className={`customerAuthModeBtn ${isSignUp ? 'active' : ''}`}
          onClick={() => onAuthModeChange('signup')}
        >
          Sign Up
        </button>
      </div>

      <form className="customerLoginForm" onSubmit={onSubmit}>
        {isSignUp ? (
          <label className="customerLoginField" htmlFor="customer-full-name">
            Full name
            <input
              id="customer-full-name"
              type="text"
              value={fullName}
              onChange={(event) => onFullNameChange(event.target.value)}
              placeholder="Juan Dela Cruz"
              required
            />
          </label>
        ) : null}

        <label className="customerLoginField" htmlFor="customer-email">
          Email address
          <input
            id="customer-email"
            type="email"
            value={email}
            onChange={(event) => onEmailChange(event.target.value)}
            placeholder="name@example.com"
            required
          />
        </label>

        <label className="customerLoginField" htmlFor="customer-password">
          Password
          <div className="customerPasswordFieldWrap">
            <input
              id="customer-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(event) => onPasswordChange(event.target.value)}
              placeholder="Enter your password"
              minLength={6}
              required
            />
            <button type="button" className="customerPasswordToggle" onClick={onTogglePassword}>
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          {passwordError ? <p className="customerLoginNotice error">{passwordError}</p> : null}
        </label>

        {isSignUp ? (
          <label className="customerLoginField" htmlFor="customer-confirm-password">
            Confirm password
            <input
              id="customer-confirm-password"
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(event) => onConfirmPasswordChange(event.target.value)}
              placeholder="Confirm your password"
              minLength={6}
              required
            />
            {confirmPasswordError ? <p className="customerLoginNotice error">{confirmPasswordError}</p> : null}
          </label>
        ) : null}

        {!isSignUp ? (
          <div className="customerLoginRow">
            <a className="customerForgotLink" href="#" onClick={(event) => event.preventDefault()}>
              Forgot password?
            </a>
          </div>
        ) : null}

        <button type="submit" className="customerLoginSubmitBtn">
          {isSignUp ? 'Create Account' : 'Sign In'}
        </button>

        {submitNotice ? (
          <p className="customerLoginNotice" role="status">
            {submitNotice}
          </p>
        ) : null}

        <p className="customerCreateAccountText">
          {isSignUp ? 'Already have an account?' : 'New here?'}{' '}
          <button
            type="button"
            className="customerCreateAccountLink customerCreateAccountBtn"
            onClick={() => onAuthModeChange(isSignUp ? 'signin' : 'signup')}
          >
            {isSignUp ? 'Sign in instead' : 'Create an account'}
          </button>
          {' or '}
          <Link to="/" className="customerCreateAccountLink">
            Explore first
          </Link>
        </p>
      </form>
    </section>
  )
}
