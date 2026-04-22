export const CUSTOMER_BOOKINGS_STORAGE_KEY = "munimuni-customer-bookings";
export const BOOKINGS_CHANGED_EVENT = "munimuni-bookings-changed";

function toSafeNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeBookingRecord(booking) {
  const itemizedCosts = {
    room: toSafeNumber(booking?.itemizedCosts?.room, 0),
    addOns: toSafeNumber(booking?.itemizedCosts?.addOns, 0),
    rentals: toSafeNumber(booking?.itemizedCosts?.rentals, 0),
  };

  const fallbackTotal =
    itemizedCosts.room + itemizedCosts.addOns + itemizedCosts.rentals;
  const totalAmount = toSafeNumber(booking?.totalAmount, fallbackTotal);
  const fallbackPaid =
    String(booking?.paymentStatus ?? booking?.status ?? "").toLowerCase() === "paid"
      ? totalAmount
      : 0;
  const amountPaid = toSafeNumber(booking?.amountPaid, fallbackPaid);
  const outstandingBalance = Math.max(
    0,
    toSafeNumber(booking?.outstandingBalance, totalAmount - amountPaid),
  );

  const paymentStatus =
    booking?.paymentStatus
    || (outstandingBalance === 0 ? "Paid" : amountPaid > 0 ? "Partially Paid" : "Unpaid");
  const status =
    booking?.status
    || (paymentStatus === "Paid" ? "Paid" : paymentStatus === "Partially Paid" ? "Confirmed" : "Pending Payment");

  return {
    ...booking,
    bookingReference: booking?.bookingReference ?? null,
    itemizedCosts,
    totalAmount,
    amountPaid,
    outstandingBalance,
    paymentStatus,
    paymentMode: booking?.paymentMode || null,
    status,
  };
}

function dispatchBookingsChanged() {
  window.dispatchEvent(new Event(BOOKINGS_CHANGED_EVENT));
}

// get bookings for all customers, keyed by customer ID
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

// get list of bookings for a specific customer ID
export function getCustomerBookingList(customerId) {
  if (!customerId) {
    return [];
  }
  const allBookings = readCustomerBookings();
  const bookings = allBookings[customerId] ?? [];
  return Array.isArray(bookings)
    ? bookings.map((booking) => normalizeBookingRecord(booking))
    : [];
}

export function addCustomerBooking(customerId, booking) {
  if (!customerId) {
    return;
  }
  const allBookings = readCustomerBookings();
  if (!allBookings[customerId]) {
    allBookings[customerId] = [];
  }
  const bookingWithTimestamp = normalizeBookingRecord({
    ...booking,
    createdAt: booking.createdAt || new Date().toISOString(),
  });
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
    allBookings[customerId][index] = normalizeBookingRecord({
      ...allBookings[customerId][index],
      ...updatedBooking,
      updatedAt: new Date().toISOString(),
    });
    writeCustomerBookings(allBookings);
    return true;
  }
  return false;
}

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
