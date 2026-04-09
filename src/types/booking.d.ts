export interface BookingHistoryEntry {
  id: string
  propertyName: string
  checkInDate: string
  checkOutDate: string
  nights: number
  guestCount: number
  bookingReference: string
  status: 'completed' | 'cancelled' | 'upcoming'
  totalPaid?: number
}
