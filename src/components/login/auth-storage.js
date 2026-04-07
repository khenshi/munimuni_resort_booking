export const CUSTOMER_ACCOUNTS_STORAGE_KEY = 'munimuni-customer-accounts'
export const CURRENT_CUSTOMER_STORAGE_KEY = 'munimuni-current-customer'
export const AUTH_CHANGED_EVENT = 'munimuni-auth-changed'

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
