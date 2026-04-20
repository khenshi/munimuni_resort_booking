/**
 * History page display models for list rendering.
 * Keeps UI mapping stable while data sources evolve.
 * Used by history list item components and mappers.
 */

/**
 * A normalized view model for rendering one booking row in the "Previous Stays" tab.
 * @typedef {Object} BookingListItemModel
 * @property {string} id
 * @property {string} title
 * @property {string} dateRange
 * @property {string | undefined} guests
 * @property {string | undefined} category
 * @property {string | undefined} status
 * @property {string | undefined} total
 * @property {string | number | undefined} year
 */

/**
 * A normalized view model for rendering one ledger row in the "Billing & Receipts" tab.
 * @typedef {Object} ReceiptLedgerItemModel
 * @property {string} id
 * @property {string} label
 * @property {string} date
 * @property {string} amount
 * @property {string | undefined} status
 * @property {string | number | undefined} year
 */

/**
 * Create a booking display model.
 * @param {BookingListItemModel} model
 * @returns {BookingListItemModel}
 */
export function createBookingListItemModel(model) {
  return model
}

/**
 * Create a receipt display model.
 * @param {ReceiptLedgerItemModel} model
 * @returns {ReceiptLedgerItemModel}
 */
export function createReceiptLedgerItemModel(model) {
  return model
}
