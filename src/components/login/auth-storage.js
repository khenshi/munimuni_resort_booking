export const CUSTOMER_ACCOUNTS_STORAGE_KEY = 'munimuni-customer-accounts'
export const CURRENT_CUSTOMER_STORAGE_KEY = 'munimuni-current-customer'
export const AUTH_CHANGED_EVENT = 'munimuni-auth-changed'
export const CUSTOMER_OUTSTANDING_BALANCES_STORAGE_KEY = 'munimuni-customer-outstanding-balances'
export const OUTSTANDING_BALANCE_CHANGED_EVENT = 'munimuni-outstanding-balance-changed'

function normalizeEmail(emailValue) {
  return String(emailValue ?? '').trim().toLowerCase()
}

function dispatchOutstandingBalanceChanged() {
  window.dispatchEvent(new Event(OUTSTANDING_BALANCE_CHANGED_EVENT))
}

export function readCustomerAccounts() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(CUSTOMER_ACCOUNTS_STORAGE_KEY) ?? '[]')
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function writeCustomerAccounts(accounts) {
  window.localStorage.setItem(CUSTOMER_ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts))
}

function updateCurrentCustomerFromAccount(account) {
  const currentCustomer = readCurrentCustomer()
  if (!currentCustomer || currentCustomer.id !== account.id) {
    return
  }

  writeCurrentCustomer({
    ...currentCustomer,
    fullName: account.fullName,
    email: account.email,
    phone: account.phone || '',
    address: account.address || '',
  })
}

export function readCurrentCustomer() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(CURRENT_CUSTOMER_STORAGE_KEY) ?? 'null')
    return parsed && typeof parsed === 'object' ? parsed : null
  } catch {
    return null
  }
}

export function writeCurrentCustomer(customer) {
  window.localStorage.setItem(CURRENT_CUSTOMER_STORAGE_KEY, JSON.stringify(customer))
  dispatchAuthChanged()
}

export function clearCurrentCustomer() {
  window.localStorage.removeItem(CURRENT_CUSTOMER_STORAGE_KEY)
  dispatchAuthChanged()
}

export function dispatchAuthChanged() {
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT))
}

export function updateCustomerContactDetails(customerId, contactDetails) {
  if (!customerId) {
    return { ok: false, error: 'Missing customer id.' }
  }

  const accounts = readCustomerAccounts()
  const accountIndex = accounts.findIndex((account) => account.id === customerId)
  if (accountIndex === -1) {
    return { ok: false, error: 'Account not found.' }
  }

  const currentAccount = accounts[accountIndex]
  const nextEmail = normalizeEmail(contactDetails.email)
  if (!nextEmail) {
    return { ok: false, error: 'Email is required.' }
  }

  const duplicateEmail = accounts.some((account) => account.id !== customerId && account.email === nextEmail)
  if (duplicateEmail) {
    return { ok: false, error: `Email ${nextEmail} is already used by another account.` }
  }

  const updatedAccount = {
    ...currentAccount,
    fullName: String(contactDetails.fullName ?? '').trim(),
    email: nextEmail,
    phone: String(contactDetails.phone ?? '').trim(),
    address: String(contactDetails.address ?? '').trim(),
    updatedAt: new Date().toISOString(),
  }

  const nextAccounts = [...accounts]
  nextAccounts[accountIndex] = updatedAccount
  writeCustomerAccounts(nextAccounts)
  updateCurrentCustomerFromAccount(updatedAccount)
  dispatchAuthChanged()

  return { ok: true, account: updatedAccount }
}

export function updateCustomerPassword(customerId, currentPassword, nextPassword) {
  if (!customerId) {
    return { ok: false, error: 'Missing customer id.' }
  }

  const currentPasswordValue = String(currentPassword ?? '')
  const nextPasswordValue = String(nextPassword ?? '')

  if (nextPasswordValue.length < 6) {
    return { ok: false, error: 'New password must be at least 6 characters long.' }
  }

  const accounts = readCustomerAccounts()
  const accountIndex = accounts.findIndex((account) => account.id === customerId)
  if (accountIndex === -1) {
    return { ok: false, error: 'Account not found.' }
  }

  const currentAccount = accounts[accountIndex]
  if (currentAccount.password !== currentPasswordValue) {
    return { ok: false, error: 'Current password is incorrect.' }
  }

  const updatedAccount = {
    ...currentAccount,
    password: nextPasswordValue,
    updatedAt: new Date().toISOString(),
  }

  const nextAccounts = [...accounts]
  nextAccounts[accountIndex] = updatedAccount
  writeCustomerAccounts(nextAccounts)
  dispatchAuthChanged()

  return { ok: true }
}

export function readCustomerOutstandingBalances() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(CUSTOMER_OUTSTANDING_BALANCES_STORAGE_KEY) ?? '{}')
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

export function writeCustomerOutstandingBalances(balancesMap) {
  window.localStorage.setItem(CUSTOMER_OUTSTANDING_BALANCES_STORAGE_KEY, JSON.stringify(balancesMap))
  dispatchOutstandingBalanceChanged()
}

export function getCustomerOutstandingBalance(customerId) {
  if (!customerId) {
    return 0
  }

  const balancesMap = readCustomerOutstandingBalances()
  const parsedValue = Number(balancesMap[customerId] ?? 0)
  if (!Number.isFinite(parsedValue)) {
    return 0
  }

  return Math.max(0, parsedValue)
}

export function setCustomerOutstandingBalance(customerId, nextBalance) {
  if (!customerId) {
    return 0
  }

  const parsedValue = Number(nextBalance)
  const safeBalance = Number.isFinite(parsedValue) ? Math.max(0, parsedValue) : 0
  const balancesMap = readCustomerOutstandingBalances()
  balancesMap[customerId] = safeBalance
  writeCustomerOutstandingBalances(balancesMap)

  return safeBalance
}

export function adjustCustomerOutstandingBalance(customerId, deltaAmount) {
  if (!customerId) {
    return 0
  }

  const currentBalance = getCustomerOutstandingBalance(customerId)
  const parsedDelta = Number(deltaAmount)
  const safeDelta = Number.isFinite(parsedDelta) ? parsedDelta : 0
  const nextBalance = Math.max(0, currentBalance + safeDelta)
  return setCustomerOutstandingBalance(customerId, nextBalance)
}
