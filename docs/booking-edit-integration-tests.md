# Booking Edit Integration Test Plan

## Purpose

This document captures the integration-level test cases for the Edit Booking feature. It is designed to validate the edit flow, local persistence, and global state sync across customer-facing pages.

## Scope

- `EditBookingPage.jsx`
- `useEditBookingLogic.js`
- `useBookingStateSync.js`
- `bookings-storage.js`
- `CustomerDashboardPage.jsx`
- `BookingDetailPage.jsx`
- `CustomerBookingsList.jsx`
- `App.jsx`

## Test Environment

1. Run the app locally with `npm run dev`.
2. Use a modern browser with localStorage enabled.
3. Log in with an existing customer account.

## Test Cases

### TC1: Open existing booking for edit

1. Navigate to the dashboard and confirm at least one editable booking exists.
2. Click `Edit Booking` on a booking card.
3. Verify the app opens `/customer/bookings/:bookingReference/edit`.
4. Confirm the form is pre-populated with the booking data.

### TC2: Update booking fields and save

1. Change the check-in date, guest count, or guest contact details.
2. Complete the edit flow and submit the form.
3. Verify the success message appears.
4. Confirm the updated booking data is stored in `localStorage` under `munimuni-customer-bookings`.

### TC3: Dashboard reflects updated booking immediately

1. After saving changes, return to the dashboard.
2. Confirm the booking card shows the new check-in date / guest count.
3. Confirm the dashboard update occurs without a page refresh.

### TC4: Booking detail page refreshes after edit

1. Open the booking detail page for the edited booking.
2. Confirm the booking details match the newly saved values.
3. If already on the detail page when the edit occurs, refresh the page or re-open it to verify state consistency.

### TC5: Route and access handling

1. Navigate directly to `/customer/bookings/:bookingReference/edit` for an existing booking.
2. Confirm the page shows the edit form when authenticated.
3. Confirm unauthenticated users are redirected to `/customer/login`.
4. Navigate to an invalid booking reference and confirm the page shows a `Booking not found` state.

### TC6: Local storage event sync across tabs

1. Open the app in two browser tabs.
2. Edit a booking in tab A and save.
3. Confirm tab B receives the updated booking list or refreshes when the storage event occurs.

## Notes

- The current repo does not include an automated test framework. This plan is intended as a manual integration checklist that can be converted into automated tests once a runner (e.g. Vitest, Cypress) is installed.
- Use this document as a baseline for expanding to automated end-to-end coverage later.
