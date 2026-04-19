export const CUSTOMER_BOOKINGS_STORAGE_KEY = "munimuni-customer-bookings";
export const BOOKINGS_CHANGED_EVENT = "munimuni-bookings-changed";

function dispatchBookingsChanged() {
  window.dispatchEvent(new Event(BOOKINGS_CHANGED_EVENT));
}

export function readCustomerBookings() {
  try {
    const parsed = JSON.parse(
      window.localStorage.getItem(CUSTOMER_BOOKINGS_STORAGE_KEY) ?? "{}",
    );
    return typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function writeCustomerBookings(bookingsMap) {
  window.localStorage.setItem(
    CUSTOMER_BOOKINGS_STORAGE_KEY,
    JSON.stringify(bookingsMap),
  );
  dispatchBookingsChanged();
}

export function getCustomerBookingList(customerId) {
  if (!customerId) {
    return [];
  }
  const allBookings = readCustomerBookings();
  const bookings = allBookings[customerId] ?? [];
  return Array.isArray(bookings) ? bookings : [];
}

export function addCustomerBooking(customerId, booking) {
  if (!customerId) {
    return;
  }
  const allBookings = readCustomerBookings();
  if (!allBookings[customerId]) {
    allBookings[customerId] = [];
  }
  const bookingWithTimestamp = {
    ...booking,
    createdAt: booking.createdAt || new Date().toISOString(),
  };
  allBookings[customerId].push(bookingWithTimestamp);
  writeCustomerBookings(allBookings);
}

export function updateCustomerBooking(
  customerId,
  bookingReference,
  updatedBooking,
) {
  if (!customerId) return false;
  const allBookings = readCustomerBookings();
  if (!allBookings[customerId]) {
    return false;
  }
  const index = allBookings[customerId].findIndex(
    (b) => b.bookingReference === bookingReference,
  );
  if (index !== -1) {
    allBookings[customerId][index] = {
      ...allBookings[customerId][index],
      ...updatedBooking,
      updatedAt: new Date().toISOString(),
    };
    writeCustomerBookings(allBookings);
    return true;
  }
  return false;
}

/**
 * Delete a customer booking by reference.
 *
 * @param {string} customerId
 * @param {string} bookingReference
 * @returns {boolean}
 */
export function deleteCustomerBooking(customerId, bookingReference) {
  if (!customerId) return false;
  const allBookings = readCustomerBookings();
  const customerBookings = allBookings[customerId];
  if (!Array.isArray(customerBookings)) {
    return false;
  }

  const nextBookings = customerBookings.filter(
    (booking) => booking.bookingReference !== bookingReference,
  );

  if (nextBookings.length === customerBookings.length) {
    return false;
  }

  allBookings[customerId] = nextBookings;
  writeCustomerBookings(allBookings);
  return true;
}

export function getCustomerBooking(customerId, bookingReference) {
  if (!customerId) return null;
  const bookings = getCustomerBookingList(customerId);
  return bookings.find((b) => b.bookingReference === bookingReference) || null;
}
