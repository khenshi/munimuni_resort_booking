/**
 * Mock data for the Customer History page.
 * Enables list rendering before real data wiring.
 * Replace with real sources when available.
 */

import { createBookingListItemModel, createReceiptLedgerItemModel } from '../components/history/historyDisplayModels'

/**
 * Mock "Previous Stays" records for mapping + filtering.
 */
export const MOCK_BOOKINGS = [
  createBookingListItemModel({
    id: 'BKG-2025-001',
    title: 'Munimuni Resort • Overnight Stay',
    dateRange: 'Feb 14–16, 2025',
    guests: '2 guests',
    category: 'overnight',
    status: 'Completed',
    total: '₱12,450.00',
    year: '2025',
  }),
  createBookingListItemModel({
    id: 'BKG-2025-002',
    title: 'Munimuni Resort • Day Tour',
    dateRange: 'Jan 05, 2025',
    guests: '4 guests',
    category: 'day-tour',
    status: 'Completed',
    total: '₱4,200.00',
    year: '2025',
  }),
  createBookingListItemModel({
    id: 'BKG-2024-014',
    title: 'Munimuni Resort • Overnight Stay',
    dateRange: 'Dec 20–22, 2024',
    guests: '3 guests',
    category: 'overnight',
    status: 'Completed',
    total: '₱18,900.00',
    year: '2024',
  }),
  createBookingListItemModel({
    id: 'BKG-2024-008',
    title: 'Munimuni Resort • Day Tour',
    dateRange: 'Aug 11, 2024',
    guests: '2 guests',
    category: 'day-tour',
    status: 'Cancelled',
    total: '₱0.00',
    year: '2024',
  }),
  createBookingListItemModel({
    id: 'BKG-2023-031',
    title: 'Munimuni Resort • Overnight Stay',
    dateRange: 'Nov 03–05, 2023',
    guests: '2 guests',
    category: 'overnight',
    status: 'Completed',
    total: '₱11,980.00',
    year: '2023',
  }),
]

/**
 * Mock "Billing & Receipts" ledger records for mapping + filtering.
 */
export const MOCK_RECEIPTS = [
  createReceiptLedgerItemModel({
    id: 'RCT-2025-101',
    label: 'Stay Invoice • BKG-2025-001',
    date: 'Feb 16, 2025',
    amount: '₱12,450.00',
    status: 'Paid',
    year: '2025',
  }),
  createReceiptLedgerItemModel({
    id: 'RCT-2025-067',
    label: 'Day Tour Receipt • BKG-2025-002',
    date: 'Jan 05, 2025',
    amount: '₱4,200.00',
    status: 'Paid',
    year: '2025',
  }),
  createReceiptLedgerItemModel({
    id: 'RCT-2024-222',
    label: 'Stay Invoice • BKG-2024-014',
    date: 'Dec 22, 2024',
    amount: '₱18,900.00',
    status: 'Paid',
    year: '2024',
  }),
  createReceiptLedgerItemModel({
    id: 'RCT-2024-119',
    label: 'Deposit • Reservation Hold',
    date: 'Jul 28, 2024',
    amount: '₱2,000.00',
    status: 'Refunded',
    year: '2024',
  }),
  createReceiptLedgerItemModel({
    id: 'RCT-2023-305',
    label: 'Stay Invoice • BKG-2023-031',
    date: 'Nov 05, 2023',
    amount: '₱11,980.00',
    status: 'Paid',
    year: '2023',
  }),
]
