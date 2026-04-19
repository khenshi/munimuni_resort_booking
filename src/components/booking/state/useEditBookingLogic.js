import { useMemo, useState } from "react";
import {
  getCustomerBooking,
  updateCustomerBooking,
} from "../../login/bookings-storage";
import { resolveAutoCheckOutDate } from "../utils/booking-utils";
import {
  getTodayISODate,
  addDaysToISODate,
} from "../../packages/utils/availability-utils";
import { isItemAvailableForDate } from "../../packages";
import {
  addOns,
  cottages,
  dayTourOffers,
  overnightOffers,
} from "../../../data/packages";
import {
  getGuestCapacityHint,
  getGuestInfoErrors,
  getGuestValidationMessage,
  getSelectedAddOnLabels,
  sanitizeGuestCountInput,
  sanitizePhoneInput,
} from "../utils/booking-form-utils";

export default function useEditBookingLogic(bookingReference, customerId) {
  // Load existing booking data
  const existingBooking = useMemo(
    () => getCustomerBooking(customerId, bookingReference),
    [customerId, bookingReference],
  );

  // Early return if booking not found
  if (!existingBooking) {
    return {
      isLoading: false,
      error: "Booking not found",
      existingBooking: null,
      formData: null,
      canProceed: false,
      submitBooking: () => {},
      onChange: () => {},
      toggleAddOn: () => {},
    };
  }

  // Initialize form state with existing booking data
  const [formData, setFormData] = useState(() => ({
    checkInDate: existingBooking.checkInDate || "",
    checkOutDate: existingBooking.checkOutDate || "",
    guests: String(existingBooking.guests ?? ""),
    firstName: existingBooking.fullName?.split(" ")[0] || "",
    lastName: existingBooking.fullName?.split(" ").slice(1).join(" ") || "",
    phone: existingBooking.phone || "",
    email: existingBooking.email || "",
    address: existingBooking.address || "",
    specialRequest: existingBooking.specialRequest || "",
    selectedAddOns: Array.isArray(existingBooking.selectedAddOns)
      ? [...existingBooking.selectedAddOns]
      : [],
    termsAccepted: existingBooking.termsAccepted || false,
  }));

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Resolve offer type and ID from existing booking
  const selectedOffer = useMemo(() => {
    if (!existingBooking?.selectedOffer) return null;
    return {
      title: existingBooking.selectedOffer.title,
      price: existingBooking.selectedOffer.price,
      offerType: existingBooking.selectedOffer.offerType,
      offerId: existingBooking.selectedOffer.offerId,
      priceInfo: existingBooking.selectedOffer.priceInfo,
      paxMax: existingBooking.selectedOffer.paxMax,
      imageUrl: existingBooking.selectedOffer.imageUrl,
    };
  }, [existingBooking]);

  // Get availability item for validation
  const selectedAvailabilityItem = useMemo(() => {
    const offerType = selectedOffer?.offerType;
    const offerId = selectedOffer?.offerId;

    if (offerType === "daytour" && offerId === "basic") {
      return dayTourOffers.find((item) => item.id === "basic") ?? null;
    }

    if (offerType === "daytour" && offerId?.startsWith("cottage-")) {
      const cottageId = offerId.replace("cottage-", "");
      return cottages.find((item) => item.id === cottageId) ?? null;
    }

    if (offerType === "overnight") {
      return overnightOffers.find((item) => item.id === offerId) ?? null;
    }

    return null;
  }, [selectedOffer]);

  const todayISODate = getTodayISODate();
  const minCheckInDate = addDaysToISODate(todayISODate, 1);

  const maxAllowedGuests = useMemo(() => {
    if (
      selectedOffer?.offerType === "daytour" &&
      selectedOffer?.offerId === "basic"
    ) {
      const capacity = Number(
        selectedAvailabilityItem?.availability?.dailySlotCapacity,
      );
      if (!Number.isFinite(capacity) || capacity <= 0) return null;

      if (!formData.checkInDate) return capacity;

      const blockedDates =
        selectedAvailabilityItem?.availability?.unavailableCheckInDates ?? [];
      if (blockedDates.includes(formData.checkInDate)) return 0;

      const reservedGuestsByDate =
        selectedAvailabilityItem?.availability?.reservedGuestsByDate ?? {};
      const reservedGuests = Number(
        reservedGuestsByDate[formData.checkInDate] ?? 0,
      );
      const safeReservedGuests = Number.isFinite(reservedGuests)
        ? reservedGuests
        : 0;
      return Math.max(0, capacity - safeReservedGuests);
    }

    const staticMaxGuests = Number(selectedOffer?.paxMax);
    return Number.isFinite(staticMaxGuests) ? staticMaxGuests : null;
  }, [selectedOffer, selectedAvailabilityItem, formData.checkInDate]);

  const onChange = (key, value) => {
    if (key === "checkOutDate") return;

    if (key === "guests") {
      const sanitizedGuests = sanitizeGuestCountInput(value, maxAllowedGuests);
      setFormData((prev) => ({ ...prev, guests: sanitizedGuests }));
      return;
    }

    if (key === "phone") {
      const sanitizedPhone = sanitizePhoneInput(value);
      setFormData((prev) => ({ ...prev, phone: sanitizedPhone }));
      return;
    }

    if (key === "checkInDate") {
      const stayTab =
        selectedOffer?.offerType === "overnight" ? "overnight" : "daytour";
      setFormData((prev) => ({
        ...prev,
        checkInDate: value,
        checkOutDate: resolveAutoCheckOutDate(value, stayTab),
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const toggleAddOn = (addOnId) => {
    setFormData((prev) => {
      const alreadySelected = prev.selectedAddOns.includes(addOnId);
      return {
        ...prev,
        selectedAddOns: alreadySelected
          ? prev.selectedAddOns.filter((id) => id !== addOnId)
          : [...prev.selectedAddOns, addOnId],
      };
    });
  };

  // Validation
  const guestValidationMessage = useMemo(
    () => getGuestValidationMessage(formData.guests, maxAllowedGuests),
    [formData.guests, maxAllowedGuests],
  );
  const guestInfoErrors = useMemo(
    () => getGuestInfoErrors(formData),
    [formData],
  );
  const hasGuestInfoErrors = Object.values(guestInfoErrors).some(Boolean);

  const checkInValidationMessage = useMemo(() => {
    if (!formData.checkInDate) return "";
    return formData.checkInDate <= todayISODate
      ? "Check-in date cannot be today or in the past."
      : "";
  }, [formData.checkInDate, todayISODate]);

  const activeDateUnavailable = useMemo(
    () =>
      Boolean(
        formData.checkInDate &&
        selectedAvailabilityItem &&
        !isItemAvailableForDate(selectedAvailabilityItem, formData.checkInDate),
      ),
    [formData.checkInDate, selectedAvailabilityItem],
  );

  // Check if form has been modified
  const hasChanges = useMemo(() => {
    return (
      formData.checkInDate !== (existingBooking.checkInDate || "") ||
      formData.checkOutDate !== (existingBooking.checkOutDate || "") ||
      formData.guests !== String(existingBooking.guests ?? "") ||
      formData.firstName !== (existingBooking.fullName?.split(" ")[0] || "") ||
      formData.lastName !==
        (existingBooking.fullName?.split(" ").slice(1).join(" ") || "") ||
      formData.phone !== (existingBooking.phone || "") ||
      formData.email !== (existingBooking.email || "") ||
      formData.address !== (existingBooking.address || "") ||
      formData.specialRequest !== (existingBooking.specialRequest || "") ||
      JSON.stringify(formData.selectedAddOns) !==
        JSON.stringify(
          Array.isArray(existingBooking.selectedAddOns)
            ? existingBooking.selectedAddOns
            : [],
        )
    );
  }, [formData, existingBooking]);

  // Can proceed validation
  const canProceed = useMemo(() => {
    const guestCount = Number.parseInt(formData.guests, 10);
    const hasBasicDetails =
      Boolean(formData.checkInDate) &&
      Number.isFinite(guestCount) &&
      guestCount > 0;
    if (!hasBasicDetails) return false;
    if (checkInValidationMessage) return false;
    if (guestValidationMessage) return false;

    if (!selectedAvailabilityItem) return true;
    return isItemAvailableForDate(
      selectedAvailabilityItem,
      formData.checkInDate,
    );
  }, [
    formData,
    checkInValidationMessage,
    guestValidationMessage,
    selectedAvailabilityItem,
  ]);

  const submitBooking = (e) => {
    e?.preventDefault?.();

    if (!canProceed || !customerId) {
      setSubmitError("Cannot submit booking at this time.");
      return;
    }

    if (!hasChanges) {
      setSubmitError("No changes detected. Please modify at least one field.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");
    setSubmitSuccess(false);

    try {
      const updatedBooking = {
        checkInDate: formData.checkInDate,
        checkOutDate: formData.checkOutDate,
        guests: formData.guests,
        specialRequest: formData.specialRequest,
        fullName: `${formData.firstName} ${formData.lastName}`.trim(),
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        selectedAddOns: formData.selectedAddOns,
        termsAccepted: formData.termsAccepted,
      };

      updateCustomerBooking(customerId, bookingReference, updatedBooking);
      setSubmitSuccess(true);
      setIsSubmitting(false);
    } catch (error) {
      setSubmitError(`Failed to update booking: ${error.message}`);
      setIsSubmitting(false);
    }
  };

  const selectedAddOnLabels = useMemo(
    () => getSelectedAddOnLabels(formData.selectedAddOns, addOns),
    [formData.selectedAddOns],
  );

  const guestCapacityHint = useMemo(
    () =>
      getGuestCapacityHint(
        selectedOffer,
        formData.checkInDate,
        maxAllowedGuests,
      ),
    [selectedOffer, formData.checkInDate, maxAllowedGuests],
  );

  return {
    // Booking data
    existingBooking,
    selectedOffer,
    bookingReference,

    // Form state
    formData,
    onChange,
    toggleAddOn,

    // Validation
    guestValidationMessage,
    guestInfoErrors,
    checkInValidationMessage,
    guestCapacityHint,
    maxAllowedGuests,
    selectedAddOnLabels,
    activeDateUnavailable,

    // Submission
    submitBooking,
    canProceed,
    hasChanges,
    isSubmitting,
    submitError,
    submitSuccess,

    // Date constraints
    minCheckInDate,
    todayISODate,
  };
}
