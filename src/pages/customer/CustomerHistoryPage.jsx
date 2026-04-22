import { useMemo, useState } from 'react'
import { Navigate, useNavigate, useLocation } from 'react-router-dom'
import { getCustomerBookingList, getCustomerReceipts, readCurrentCustomer } from '../../components/login'
import { useBookingStateSync } from '../../components/booking'
import { BillingReceiptsList, PreviousBookingsList } from '../../components/history'
import {
  filterBookings,
  sortBookings,
  filterReceipts,
  sortReceipts,
  normalizeBookingForDisplay,
  normalizeReceiptForDisplay,
} from '../../components/history/utils/filteringSortingUtils'
import { AccountLayout } from '../../components/dashboard'
import '../../styles/pages/customer-history-page.css'

// Define constants for tabs, filters, and sort options
const HISTORY_TABS = [
  { id: 'bookings', label: 'Bookings & Stays' },
  { id: 'billing', label: 'Billing & Receipts' },
]

// Year filter options (same for both tabs)
const YEAR_OPTIONS = ['All', '2026', '2025', '2024', '2023', '2022', '2021']

// Bookings tab options
const BOOKINGS_FILTER_OPTIONS = [
  { id: 'all', label: 'All' },
  { id: 'day-tour', label: 'Day Tour' },
  { id: 'overnight', label: 'Overnight' },
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'completed', label: 'Completed' },
]

// Sort options for bookings tab
const BOOKINGS_SORT_OPTIONS = [
  { id: 'newest-booked', label: 'Newest first (by booked date)' },
  { id: 'oldest-booked', label: 'Oldest first (by booked date)' },
  { id: 'newest-checkin', label: 'Newest first (by check-in date)' },
  { id: 'oldest-checkin', label: 'Oldest first (by check-in date)' },
]

// Receipts tab options
const RECEIPTS_FILTER_OPTIONS = [
  { id: 'all', label: 'All' },
  { id: 'qr', label: 'QR' },
  { id: 'debit', label: 'Debit' },
  { id: 'credit', label: 'Credit' },
]

// Sort options for receipts tab
const RECEIPTS_SORT_OPTIONS = [
  { id: 'newest-issued', label: 'Newest first (by issued date)' },
  { id: 'oldest-issued', label: 'Oldest first (by issued date)' },
]

export default function CustomerHistoryPage() {
  const currentCustomer = readCurrentCustomer()
  const location = useLocation()
  const [activeTab, setActiveTab] = useState(() => {
    const tab = new URLSearchParams(location.search).get('tab')
    return tab === 'billing' ? 'billing' : 'bookings'
  })
  const [customerBookings, setCustomerBookings] = useState(() => (
    currentCustomer ? getCustomerBookingList(currentCustomer.id) : []
  ))

  useBookingStateSync(currentCustomer?.id, setCustomerBookings)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedYear, setSelectedYear] = useState('All')
  
  // Separate filters for each tab
  const [selectedBookingType, setSelectedBookingType] = useState('all')
  const [selectedPaymentType, setSelectedPaymentType] = useState('all')
  
  // Separate sort options for each tab
  const [bookingsSortOrder, setBookingsSortOrder] = useState('newest-checkin')
  const [receiptsSortOrder, setReceiptsSortOrder] = useState('newest-issued')

  const navigate = useNavigate()

  const visibleBookings = useMemo(() => {
    const filtered = filterBookings(customerBookings, {
      searchQuery,
      selectedYear,
      selectedType: selectedBookingType,
    })
    const sorted = sortBookings(filtered, bookingsSortOrder)
    return sorted.map(normalizeBookingForDisplay)
  }, [customerBookings, searchQuery, selectedYear, selectedBookingType, bookingsSortOrder])

  const visibleReceipts = useMemo(() => {
    const customerReceipts = currentCustomer ? getCustomerReceipts(currentCustomer.id) : []
    const filtered = filterReceipts(customerReceipts, {
      searchQuery,
      selectedYear,
      selectedPaymentType,
    })
    const sorted = sortReceipts(filtered, receiptsSortOrder)
    return sorted.map(normalizeReceiptForDisplay)
  }, [currentCustomer, searchQuery, selectedYear, selectedPaymentType, receiptsSortOrder])

  const handleViewDetails = (record) => {
    if (activeTab === 'bookings') {
      navigate(`/customer/bookings/${encodeURIComponent(record.id)}`)
    } else {
      navigate('/customer/receipts/detail', { state: { receiptData: record } })
    }
  }

  if (!currentCustomer) {
    return <Navigate to="/customer/login" replace />
  }

  return (
    <AccountLayout>
      <section className="customerHistoryShell">
        <div className="customerHistoryHero">
          <div className="customerHistoryTitleGroup">
            <p className="customerHistoryLabel">My Resort History</p>
            <h1 className="customerHistoryTitle">Review all bookings, stays, and resort charges</h1>
            <p className="customerHistoryDescription">
              Use the tabs, search bar, and filters below to find booking schedules and billing documents.
            </p>
          </div>
        </div>

        <div className="customerHistoryTabs" role="tablist" aria-label="History tabs">
          {HISTORY_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`customerHistoryTab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              aria-selected={activeTab === tab.id}
              role="tab"
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="customerHistoryToolbar">
          <label className="customerHistorySearch" htmlFor="history-search">
            <span className="customerHistorySearchLabel">Search history</span>
            <input
              id="history-search"
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={activeTab === 'bookings' 
                ? 'Search by accommodation name'
                : 'Search by accommodation name or invoice number'
              }
            />
          </label>

          <div className="customerHistoryFilters">
            <div className="customerHistoryFilter">
              <label htmlFor="history-year">
                {activeTab === 'bookings' ? 'Year Booked' : 'Year Issued'}
              </label>
              <select
                id="history-year"
                value={selectedYear}
                onChange={(event) => setSelectedYear(event.target.value)}
              >
                {YEAR_OPTIONS.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {activeTab === 'bookings' && (
              <div className="customerHistoryFilter">
                <label htmlFor="history-filter">Filter</label>
                <select
                  id="history-filter"
                  value={selectedBookingType}
                  onChange={(event) => setSelectedBookingType(event.target.value)}
                >
                  {BOOKINGS_FILTER_OPTIONS.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {activeTab === 'billing' && (
              <div className="customerHistoryFilter">
                <label htmlFor="history-payment-type">Payment Type</label>
                <select
                  id="history-payment-type"
                  value={selectedPaymentType}
                  onChange={(event) => setSelectedPaymentType(event.target.value)}
                >
                  {RECEIPTS_FILTER_OPTIONS.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="customerHistoryFilter">
              <label htmlFor="history-sort">Sort</label>
              <select
                id="history-sort"
                value={activeTab === 'bookings' ? bookingsSortOrder : receiptsSortOrder}
                onChange={(event) => {
                  if (activeTab === 'bookings') {
                    setBookingsSortOrder(event.target.value)
                  } else {
                    setReceiptsSortOrder(event.target.value)
                  }
                }}
              >
                {(activeTab === 'bookings' ? BOOKINGS_SORT_OPTIONS : RECEIPTS_SORT_OPTIONS).map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="customerHistoryContent">
          <div className="customerHistoryStatus">
            <p>
              Showing{' '}
              <strong>
                {activeTab === 'bookings' ? 'bookings & stays' : 'billing & receipts'}
              </strong>
              {activeTab === 'bookings' && selectedBookingType !== 'all' && (
                <> filtered by {selectedBookingType === 'day-tour' ? 'day tours' : selectedBookingType}</>
              )}
              {activeTab === 'billing' && selectedPaymentType !== 'all' && (
                <> filtered by {selectedPaymentType} payments</>
              )}.
            </p>
          </div>

          <div className="customerHistoryPlaceholder">
            <p className="customerHistoryPlaceholderTitle">
              {activeTab === 'bookings' ? 'Booking and stay records' : 'Billing & receipt records'}
            </p>
            <p className="customerHistoryPlaceholderText">
              Showing {activeTab === 'bookings' ? visibleBookings.length : visibleReceipts.length} matching record(s).
            </p>
            {activeTab === 'bookings' ? (
              <PreviousBookingsList
                records={visibleBookings}
                onViewDetails={handleViewDetails}
              />
            ) : (
              <BillingReceiptsList
                records={visibleReceipts}
                onViewDetails={handleViewDetails}
              />
            )}

          </div>
        </div>
      </section>
    </AccountLayout>
  )
}