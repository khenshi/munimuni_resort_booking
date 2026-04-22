
// function for date parsing that normalizes to start of day for consistent comparison
function parseDateAtStartOfDay(dateText) {
  if (!dateText) return null
  const parsedDate = new Date(dateText)
  if (Number.isNaN(parsedDate.getTime())) return null
  parsedDate.setHours(0, 0, 0, 0)
  return parsedDate
}

// Determine if a booking is upcoming or completed based on current date and check-out date
export function resolveBookingTimelineStatus(booking) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const checkOutDate = parseDateAtStartOfDay(booking.checkOutDate || booking.checkInDate)
  if (!checkOutDate) {
    return 'upcoming'
  }

  return checkOutDate < today ? 'completed' : 'upcoming'
}

// Determine booking type based on offerType
export function resolveBookingType(booking) {
  const offerType = booking.selectedOffer?.offerType
  if (offerType === 'daytour') return 'day-tour'
  if (offerType === 'overnight') return 'overnight'
  return null
}

// function for filtering bookings
export function filterBookings(bookings, { searchQuery = '', selectedYear = 'All', selectedType = 'all' } = {}) {
  return bookings.filter((booking) => {
    // Search filter (by accommodation name)
    const normalizedQuery = searchQuery.trim().toLowerCase()
    const bookingTitle = (booking.selectedOffer?.title || booking.propertyName || '').toLowerCase()
    const bookingReference = (booking.bookingReference || booking.id || '').toLowerCase()

    // A booking matches the search query if the query is empty or if it is included in either the booking title or reference.
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

// function for sorting bookings
export function sortBookings(bookings, sortBy = 'newest-checkin') {
  const sorted = [...bookings]
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const getDaysFromToday = (dateText) => {
    const parsedDate = parseDateAtStartOfDay(dateText)
    if (!parsedDate) return Number.POSITIVE_INFINITY
    return Math.abs((parsedDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  }
  
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
        const leftDistance = getDaysFromToday(left.checkInDate)
        const rightDistance = getDaysFromToday(right.checkInDate)
        if (leftDistance !== rightDistance) {
          return leftDistance - rightDistance
        }

        const leftDate = parseDateAtStartOfDay(left.checkInDate) || new Date(0)
        const rightDate = parseDateAtStartOfDay(right.checkInDate) || new Date(0)
        return leftDate - rightDate
      })
      break
      
    case 'oldest-checkin':
      sorted.sort((left, right) => {
        const leftDistance = getDaysFromToday(left.checkInDate)
        const rightDistance = getDaysFromToday(right.checkInDate)
        if (leftDistance !== rightDistance) {
          return rightDistance - leftDistance
        }

        const leftDate = parseDateAtStartOfDay(left.checkInDate) || new Date(0)
        const rightDate = parseDateAtStartOfDay(right.checkInDate) || new Date(0)
        return rightDate - leftDate
      })
      break
      
    default:
      // Default to nearest check-in date
      sorted.sort((left, right) => {
        const leftDistance = getDaysFromToday(left.checkInDate)
        const rightDistance = getDaysFromToday(right.checkInDate)
        if (leftDistance !== rightDistance) {
          return leftDistance - rightDistance
        }

        const leftDate = parseDateAtStartOfDay(left.checkInDate) || new Date(0)
        const rightDate = parseDateAtStartOfDay(right.checkInDate) || new Date(0)
        return leftDate - rightDate
      })
  }
  
  return sorted
}

// function for normalizing booking data for display in the history list
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

// function for filtering receipts
export function filterReceipts(receipts, { searchQuery = '', selectedYear = 'All', selectedPaymentType = 'all' } = {}) {
  return receipts.filter((receipt) => {
    // Search filter (by customer name or invoice number)
    const normalizedQuery = searchQuery.trim().toLowerCase()
    const customerName = (receipt.guestName || '').toLowerCase()
    const invoiceNumber = (receipt.invoiceNumber || '').toLowerCase()
    const stayLabel = (receipt.stayLabel || '').toLowerCase()

    // A receipt matches the search query if the query is empty or if it is included in the customer name, invoice number, or stay label.
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

// function for normalizing receipt data for display in the history list
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
