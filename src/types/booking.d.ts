export interface BookingHistoryEntry {
  id: string
  propertyName: string
  checkInDate: string
  checkOutDate: string
  nights: number
  guestCount: number
  bookingReference: string | null
  status: 'completed' | 'cancelled' | 'upcoming' | 'Pending Payment' | 'Confirmed' | 'Paid'
  totalPaid?: number
  totalAmount?: number
  amountPaid?: number
  outstandingBalance?: number
  paymentStatus?: 'Unpaid' | 'Partially Paid' | 'Paid'
  paymentMode?: 'full' | 'downpayment' | 'balance' | null
}
