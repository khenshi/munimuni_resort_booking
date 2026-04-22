export const CUSTOMER_ACCOUNTS_STORAGE_KEY = "munimuni-customer-accounts";
export const CURRENT_CUSTOMER_STORAGE_KEY = "munimuni-current-customer";
export const AUTH_CHANGED_EVENT = "munimuni-auth-changed";
export const CUSTOMER_OUTSTANDING_BALANCES_STORAGE_KEY =
  "munimuni-customer-outstanding-balances";
export const OUTSTANDING_BALANCE_CHANGED_EVENT =
  "munimuni-outstanding-balance-changed";
export const CUSTOMER_RECEIPTS_STORAGE_KEY = "munimuni-customer-receipts";

// Helper function to normalize email addresses for consistent storage and comparison
function normalizeEmail(emailValue) {
  return String(emailValue ?? "")
    .trim()
    .toLowerCase();
}

function dispatchOutstandingBalanceChanged() {
  window.dispatchEvent(new Event(OUTSTANDING_BALANCE_CHANGED_EVENT));
}

export function readCustomerAccounts() {
  try {
    const parsed = JSON.parse(
      window.localStorage.getItem(CUSTOMER_ACCOUNTS_STORAGE_KEY) ?? "[]",
    );
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// writes the full list of customer accounts.
export function writeCustomerAccounts(accounts) {
  window.localStorage.setItem(
    CUSTOMER_ACCOUNTS_STORAGE_KEY,
    JSON.stringify(accounts),
  );
}

// updates the current customer data
function updateCurrentCustomerFromAccount(account) {
  const currentCustomer = readCurrentCustomer();
  if (!currentCustomer || currentCustomer.id !== account.id) {
    return;
  }

  writeCurrentCustomer({
    ...currentCustomer,
    fullName: account.fullName,
    email: account.email,
    phone: account.phone || "",
    address: account.address || "",
  });
}

export function readCurrentCustomer() {
  try {
    const parsed = JSON.parse(
      window.localStorage.getItem(CURRENT_CUSTOMER_STORAGE_KEY) ?? "null",
    );
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

export function writeCurrentCustomer(customer) {
  window.localStorage.setItem(
    CURRENT_CUSTOMER_STORAGE_KEY,
    JSON.stringify(customer),
  );
  dispatchAuthChanged();
}

export function clearCurrentCustomer() {
  window.localStorage.removeItem(CURRENT_CUSTOMER_STORAGE_KEY);
  dispatchAuthChanged();
}

export function dispatchAuthChanged() {
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
}

// updates customer details
export function updateCustomerContactDetails(customerId, contactDetails) {
  // validates if there is an customer ID to update, if not return an error
  if (!customerId) {
    return { ok: false, error: "Missing customer id." };
  }

  // Get the list of customer accounts and find the index of the account to update. If not found, return an error.
  const accounts = readCustomerAccounts();
  const accountIndex = accounts.findIndex(
    (account) => account.id === customerId,
  );
  if (accountIndex === -1) {
    return { ok: false, error: "Account not found." };
  }

  // Validate the new email address (if provided) for proper format and uniqueness. If invalid, return an error.
  const currentAccount = accounts[accountIndex];
  const nextEmail = normalizeEmail(contactDetails.email);
  if (!nextEmail) {
    return { ok: false, error: "Email is required." };
  }

  // Check for duplicate email addresses in other accounts (excluding the current account). If a duplicate is found, return an error.
  const duplicateEmail = accounts.some(
    (account) => account.id !== customerId && account.email === nextEmail,
  );
  if (duplicateEmail) {
    return {
      ok: false,
      error: `Email ${nextEmail} is already used by another account.`,
    };
  }

  // If all validations pass, create an updated account object with the new contact details and current timestamp. 
  const updatedAccount = {
    ...currentAccount,
    fullName: String(contactDetails.fullName ?? "").trim(),
    email: nextEmail,
    phone: String(contactDetails.phone ?? "").trim(),
    address: String(contactDetails.address ?? "").trim(),
    updatedAt: new Date().toISOString(),
  };

  // Update the accounts list with the modified account, write it back to storage, update the current customer if it's the same account, and dispatch an auth change event to notify the app of the update.
  const nextAccounts = [...accounts];
  nextAccounts[accountIndex] = updatedAccount;
  writeCustomerAccounts(nextAccounts);
  updateCurrentCustomerFromAccount(updatedAccount);
  dispatchAuthChanged();

  return { ok: true, account: updatedAccount };
}

// updates the customer's password after validating the current password and ensuring the new password meets criteria. Returns an object indicating success or failure with an error message if applicable.
export function updateCustomerPassword(
  customerId,
  currentPassword,
  nextPassword,
) {
  if (!customerId) {
    return { ok: false, error: "Missing customer id." };
  }

  const currentPasswordValue = String(currentPassword ?? "");
  const nextPasswordValue = String(nextPassword ?? "");

  // Validate that the new password is at least 6 characters long. If not, return an error.
  if (nextPasswordValue.length < 6) {
    return {
      ok: false,
      error: "New password must be at least 6 characters long.",
    };
  }

  // Get the list of customer accounts and find the index of the account to update. If not found, return an error.
  const accounts = readCustomerAccounts();
  const accountIndex = accounts.findIndex(
    (account) => account.id === customerId,
  );
  if (accountIndex === -1) {
    return { ok: false, error: "Account not found." };
  }

  // Validate that the current password matches the stored password for the account. If it doesn't match, return an error.
  const currentAccount = accounts[accountIndex];
  if (currentAccount.password !== currentPasswordValue) {
    return { ok: false, error: "Current password is incorrect." };
  }

  // If all validations pass, create an updated account object with the new password and current timestamp. Update the accounts list with the modified account, write it back to storage, and dispatch an auth change event to notify the app of the update.
  const updatedAccount = {
    ...currentAccount,
    password: nextPasswordValue,
    updatedAt: new Date().toISOString(),
  };

  // Update the accounts list with the modified account, write it back to storage, and dispatch an auth change event to notify the app of the update.
  const nextAccounts = [...accounts];
  nextAccounts[accountIndex] = updatedAccount;
  writeCustomerAccounts(nextAccounts);
  dispatchAuthChanged();

  return { ok: true };
}

// Get outstanding balances for all customers, keyed by customer ID
export function readCustomerOutstandingBalances() {
  try {
    const parsed = JSON.parse(
      window.localStorage.getItem(CUSTOMER_OUTSTANDING_BALANCES_STORAGE_KEY) ??
        "{}",
    );
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function writeCustomerOutstandingBalances(balancesMap) {
  window.localStorage.setItem(
    CUSTOMER_OUTSTANDING_BALANCES_STORAGE_KEY,
    JSON.stringify(balancesMap),
  );
  dispatchOutstandingBalanceChanged();
}

// Get the outstanding balance for a specific customer ID, or 0 if not found or invalid
export function getCustomerOutstandingBalance(customerId) {
  if (!customerId) {
    return 0;
  }

  const balancesMap = readCustomerOutstandingBalances();
  const parsedValue = Number(balancesMap[customerId] ?? 0);
  if (!Number.isFinite(parsedValue)) {
    return 0;
  }

  return Math.max(0, parsedValue);
}

export function setCustomerOutstandingBalance(customerId, nextBalance) {
  if (!customerId) {
    return 0;
  }

  const parsedValue = Number(nextBalance);
  const safeBalance = Number.isFinite(parsedValue)
    ? Math.max(0, parsedValue)
    : 0;
  const balancesMap = readCustomerOutstandingBalances();
  balancesMap[customerId] = safeBalance;
  writeCustomerOutstandingBalances(balancesMap);

  return safeBalance;
}

export function adjustCustomerOutstandingBalance(customerId, deltaAmount) {
  if (!customerId) {
    return 0;
  }

  const currentBalance = getCustomerOutstandingBalance(customerId);
  const parsedDelta = Number(deltaAmount);
  const safeDelta = Number.isFinite(parsedDelta) ? parsedDelta : 0;
  const nextBalance = Math.max(0, currentBalance + safeDelta);
  return setCustomerOutstandingBalance(customerId, nextBalance);
}

export function readCustomerReceipts() {
  try {
    const parsed = JSON.parse(
      window.localStorage.getItem(CUSTOMER_RECEIPTS_STORAGE_KEY) ?? "{}",
    );
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function writeCustomerReceipts(receiptsMap) {
  window.localStorage.setItem(
    CUSTOMER_RECEIPTS_STORAGE_KEY,
    JSON.stringify(receiptsMap),
  );
}

export function getCustomerReceipts(customerId) {
  if (!customerId) {
    return [];
  }
  const receiptsMap = readCustomerReceipts();
  const receipts = receiptsMap[customerId] ?? [];
  return Array.isArray(receipts) ? receipts : [];
}

export function addCustomerReceipt(customerId, receipt) {
  if (!customerId || !receipt) {
    return;
  }
  const receiptsMap = readCustomerReceipts();
  if (!receiptsMap[customerId]) {
    receiptsMap[customerId] = [];
  }
  
  // Check if receipt with same invoiceNumber already exists
  const existingReceipt = receiptsMap[customerId].find(
    (existing) => existing.invoiceNumber === receipt.invoiceNumber
  );
  
  if (existingReceipt) {
    // Update existing receipt instead of adding duplicate
    const index = receiptsMap[customerId].indexOf(existingReceipt);
    receiptsMap[customerId][index] = receipt;
  } else {
    receiptsMap[customerId].push(receipt);
  }
  
  writeCustomerReceipts(receiptsMap);
}

export function cleanupDuplicateReceipts(customerId) {
  if (!customerId) {
    return;
  }
  const receiptsMap = readCustomerReceipts();
  if (!receiptsMap[customerId]) {
    return;
  }
  
  // Remove duplicates based on invoiceNumber, keeping the first occurrence
  const seen = new Set();
  receiptsMap[customerId] = receiptsMap[customerId].filter(receipt => {
    if (seen.has(receipt.invoiceNumber)) {
      return false;
    }
    seen.add(receipt.invoiceNumber);
    return true;
  });
  
  writeCustomerReceipts(receiptsMap);
}
