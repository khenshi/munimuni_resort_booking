/**
 * Utility functions for filtering and sorting bookings and receipts
 * These functions support composable filtering across multiple criteria
 */

/**
 * Parse a date string to the start of the day
 * @param {string} dateText - ISO date string
 * @returns {Date | null}
 */
function parseDateAtStartOfDay(dateText) {
  if (!dateText) return null
  const parsedDate = new Date(dateText)
  if (Number.isNaN(parsedDate.getTime())) return null
  parsedDate.setHours(0, 0, 0, 0)
  return parsedDate
}

/**
 * Resolve booking status (upcoming or completed)
 * @param {Object} booking - Booking object
 * @returns {string}
 */
export function resolveBookingTimelineStatus(booking) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const checkOutDate = parseDateAtStartOfDay(booking.checkOutDate || booking.checkInDate)
  if (!checkOutDate) {
    return 'upcoming'
  }

  return checkOutDate < today ? 'completed' : 'upcoming'
}

/**
 * Determine booking type (day-tour or overnight)
 * @param {Object} booking - Booking object
 * @returns {string | null}
 */
export function resolveBookingType(booking) {
  const offerType = booking.selectedOffer?.offerType
  if (offerType === 'daytour') return 'day-tour'
  if (offerType === 'overnight') return 'overnight'
  return null
}

/**
 * Filter bookings based on multiple criteria
 * @param {Array} bookings - Array of booking objects
 * @param {Object} filters - Filter criteria
 * @param {string} filters.searchQuery - Search term for accommodation name
 * @param {string} filters.selectedYear - Year filter ('All' or specific year)
 * @param {string} filters.selectedType - Booking type filter ('all', 'day-tour', 'overnight', 'upcoming', 'completed')
 * @returns {Array} Filtered bookings
 */
export function filterBookings(bookings, { searchQuery = '', selectedYear = 'All', selectedType = 'all' } = {}) {
  return bookings.filter((booking) => {
    // Search filter (by accommodation name)
    const normalizedQuery = searchQuery.trim().toLowerCase()
    const bookingTitle = (booking.selectedOffer?.title || booking.propertyName || '').toLowerCase()
    const bookingReference = (booking.bookingReference || booking.id || '').toLowerCase()

    const matchesQuery = !normalizedQuery
      || bookingTitle.includes(normalizedQuery)
      || bookingReference.includes(normalizedQuery)

    // Year filter
    const bookingYear = (booking.checkInDate || booking.checkOutDate || booking.createdAt || '').slice(0, 4)
    const matchesYear = selectedYear === 'All' || bookingYear === selectedYear

    // Type/Status filter
    let matchesType = true
    if (selectedType !== 'all') {
      const bookingType = resolveBookingType(booking)
      const timelineStatus = resolveBookingTimelineStatus(booking)
      
      if (selectedType === 'day-tour') {
        matchesType = bookingType === 'day-tour'
      } else if (selectedType === 'overnight') {
        matchesType = bookingType === 'overnight'
      } else if (selectedType === 'upcoming') {
        matchesType = timelineStatus === 'upcoming'
      } else if (selectedType === 'completed') {
        matchesType = timelineStatus === 'completed'
      }
    }

    return matchesQuery && matchesYear && matchesType
  })
}

/**
 * Sort bookings by specified criteria
 * @param {Array} bookings - Array of booking objects
 * @param {string} sortBy - Sort criteria ('newest-booked', 'oldest-booked', 'newest-checkin', 'oldest-checkin')
 * @returns {Array} Sorted bookings
 */
export function sortBookings(bookings, sortBy = 'newest-checkin') {
  const sorted = [...bookings]
  
  switch (sortBy) {
    case 'newest-booked':
      sorted.sort((left, right) => {
        const leftDate = new Date(left.createdAt) || new Date(0)
        const rightDate = new Date(right.createdAt) || new Date(0)
        return rightDate - leftDate
      })
      break
      
    case 'oldest-booked':
      sorted.sort((left, right) => {
        const leftDate = new Date(left.createdAt) || new Date(0)
        const rightDate = new Date(right.createdAt) || new Date(0)
        return leftDate - rightDate
      })
      break
      
    case 'newest-checkin':
      sorted.sort((left, right) => {
        const leftDate = parseDateAtStartOfDay(left.checkInDate) || new Date(0)
        const rightDate = parseDateAtStartOfDay(right.checkInDate) || new Date(0)
        return rightDate - leftDate
      })
      break
      
    case 'oldest-checkin':
      sorted.sort((left, right) => {
        const leftDate = parseDateAtStartOfDay(left.checkInDate) || new Date(0)
        const rightDate = parseDateAtStartOfDay(right.checkInDate) || new Date(0)
        return leftDate - rightDate
      })
      break
      
    default:
      // Default to newest check-in
      sorted.sort((left, right) => {
        const leftDate = parseDateAtStartOfDay(left.checkInDate) || new Date(0)
        const rightDate = parseDateAtStartOfDay(right.checkInDate) || new Date(0)
        return rightDate - leftDate
      })
  }
  
  return sorted
}

/**
 * Normalize booking for display
 * @param {Object} booking - Booking object
 * @returns {Object} Normalized booking display model
 */
export function normalizeBookingForDisplay(booking) {
  return {
    ...booking,
    id: booking.bookingReference || booking.id,
    title: booking.selectedOffer?.title || booking.propertyName || 'Resort Booking',
    dateRange: `${booking.checkInDate || 'TBD'} to ${booking.checkOutDate || 'TBD'}`,
    guests: booking.guests || booking.guestCount ? `${booking.guests || booking.guestCount} guests` : '',
    total: typeof (booking.totalAmount ?? booking.totalPaid) === 'number'
      ? `PHP ${(booking.totalAmount ?? booking.totalPaid).toLocaleString('en-PH')}`
      : undefined,
    status: resolveBookingTimelineStatus(booking),
    type: resolveBookingType(booking),
  }
}

/**
 * Filter receipts based on multiple criteria
 * @param {Array} receipts - Array of receipt objects
 * @param {Object} filters - Filter criteria
 * @param {string} filters.searchQuery - Search term for customer name or invoice number
 * @param {string} filters.selectedYear - Year filter ('All' or specific year)
 * @param {string} filters.selectedPaymentType - Payment type filter ('all', 'qr', 'debit', 'credit')
 * @returns {Array} Filtered receipts
 */
export function filterReceipts(receipts, { searchQuery = '', selectedYear = 'All', selectedPaymentType = 'all' } = {}) {
  return receipts.filter((receipt) => {
    // Search filter (by customer name or invoice number)
    const normalizedQuery = searchQuery.trim().toLowerCase()
    const customerName = (receipt.guestName || '').toLowerCase()
    const invoiceNumber = (receipt.invoiceNumber || '').toLowerCase()
    const stayLabel = (receipt.stayLabel || '').toLowerCase()

    const matchesQuery = !normalizedQuery
      || customerName.includes(normalizedQuery)
      || invoiceNumber.includes(normalizedQuery)
      || stayLabel.includes(normalizedQuery)

    // Year filter
    const receiptYear = receipt.issuedDate.slice(0, 4)
    const matchesYear = selectedYear === 'All' || receiptYear === selectedYear

    // Payment type filter
    let matchesPaymentType = true
    if (selectedPaymentType !== 'all') {
      const paymentMethod = (receipt.paymentMethod || '').toLowerCase()
      matchesPaymentType = paymentMethod === selectedPaymentType
    }

    return matchesQuery && matchesYear && matchesPaymentType
  })
}

/**
 * Sort receipts by specified criteria
 * @param {Array} receipts - Array of receipt objects
 * @param {string} sortBy - Sort criteria ('newest-issued', 'oldest-issued')
 * @returns {Array} Sorted receipts
 */
export function sortReceipts(receipts, sortBy = 'newest-issued') {
  const sorted = [...receipts]
  
  switch (sortBy) {
    case 'newest-issued':
      sorted.sort((left, right) => {
        const leftDate = new Date(left.issuedDate)
        const rightDate = new Date(right.issuedDate)
        return rightDate - leftDate
      })
      break
      
    case 'oldest-issued':
      sorted.sort((left, right) => {
        const leftDate = new Date(left.issuedDate)
        const rightDate = new Date(right.issuedDate)
        return leftDate - rightDate
      })
      break
      
    default:
      // Default to newest issued
      sorted.sort((left, right) => {
        const leftDate = new Date(left.issuedDate)
        const rightDate = new Date(right.issuedDate)
        return rightDate - leftDate
      })
  }
  
  return sorted
}

/**
 * Normalize receipt for display
 * @param {Object} receipt - Receipt object
 * @returns {Object} Normalized receipt display model
 */
export function normalizeReceiptForDisplay(receipt) {
  return {
    ...receipt,
    label: receipt.stayLabel,
    date: receipt.issuedDate,
    amount: `PHP ${receipt.amountPaid.toLocaleString('en-PH')}`,
    id: receipt.invoiceNumber,
    originalId: receipt.id,
  }
}
