import { useEffect } from "react";
import {
  getCustomerBookingList,
  BOOKINGS_CHANGED_EVENT,
} from "../../login/bookings-storage";

/**
 * useBookingStateSync
 * Synchronize booking state across the application using localStorage and custom events.
 *
 * @param {string|null|undefined} customerId
 * @param {function(Array):void} onBookingsChanged
 */
export default function useBookingStateSync(customerId, onBookingsChanged) {
  useEffect(() => {
    if (!customerId) return undefined;

    const refreshBookings = () => {
      const customerBookings = getCustomerBookingList(customerId);
      onBookingsChanged(customerBookings);
    };

    // Load the latest customer bookings on mount and whenever storage updates.
    refreshBookings();

    window.addEventListener(BOOKINGS_CHANGED_EVENT, refreshBookings);
    window.addEventListener("storage", refreshBookings);

    return () => {
      window.removeEventListener(BOOKINGS_CHANGED_EVENT, refreshBookings);
      window.removeEventListener("storage", refreshBookings);
    };
  }, [customerId, onBookingsChanged]);
}
