## History page handoff (Member 5 → Member 7)

### What Member 5 currently has
- The History page list UI is implemented with mock data and a route-agnostic `onViewDetails` callback.
- Booking rows use an `id` like `BKG-2025-001`.
- Receipt rows use an `id` like `RCT-2025-101`.

### What Member 7 needs to provide
- Booking detail route pattern (React Router): e.g. `/customer/history/bookings/:bookingId`
- Receipt detail route pattern (React Router): e.g. `/customer/history/receipts/:receiptId`

### Required parameters
- **Booking**: confirm the URL param name (e.g. `bookingId`) and whether it accepts the booking `id` string directly.
- **Receipt**: confirm the URL param name (e.g. `receiptId`) and whether it accepts the receipt `id` string directly.

### Integration point
- Update `src/pages/CustomerHistoryPage.jsx` `handleViewDetails(record)` to call `navigate(...)` to Member 7’s routes.

