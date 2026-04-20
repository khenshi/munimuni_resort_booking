import { useMemo, useState } from 'react'
import { Navigate, useNavigate, useLocation } from 'react-router-dom'
import { readCurrentCustomer } from '../components/login/auth-storage'
import { getCustomerBookingList } from '../components/login/bookings-storage'
import useBookingStateSync from '../components/booking/state/useBookingStateSync'
import { resortReceipts } from '../data/receipts'
import BillingReceiptsList from '../components/history/BillingReceiptsList'
import PreviousBookingsList from '../components/history/PreviousBookingsList'
import '../styles/pages/customer-history-page.css'

const HISTORY_TABS = [
  { id: 'bookings', label: 'Bookings & Stays' },
  { id: 'billing', label: 'Billing & Receipts' },
]

const YEAR_OPTIONS = ['All', '2025', '2024', '2023', '2022', '2021']

const CATEGORY_OPTIONS = [
  { id: 'all', label: 'All Reservations' },
  { id: 'rooms', label: 'Day Tour' },
  { id: 'rooms', label: 'Overnight' },
]

const SORT_OPTIONS = [
  { id: 'newest', label: 'Newest first' },
  { id: 'oldest', label: 'Oldest first' },
]

function parseDateAtStartOfDay(dateText) {
  if (!dateText) return null
  const parsedDate = new Date(dateText)
  if (Number.isNaN(parsedDate.getTime())) return null
  parsedDate.setHours(0, 0, 0, 0)
  return parsedDate
}

function resolveBookingTimelineStatus(booking) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const checkOutDate = parseDateAtStartOfDay(booking.checkOutDate || booking.checkInDate)
  if (!checkOutDate) {
    return 'upcoming'
  }

  return checkOutDate < today ? 'completed' : 'upcoming'
}



import AccountLayout from '../components/dashboard/layout/AccountLayout'

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
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortOrder, setSortOrder] = useState('newest')

  const navigate = useNavigate()

  const visibleBookings = useMemo(() => {
    return customerBookings
      .filter((booking) => {
        const normalizedQuery = searchQuery.trim().toLowerCase()
        const bookingTitle = (booking.selectedOffer?.title || booking.propertyName || '').toLowerCase()
        const bookingReference = (booking.bookingReference || booking.id || '').toLowerCase()

        const matchesQuery = !normalizedQuery
          || bookingTitle.includes(normalizedQuery)
          || bookingReference.includes(normalizedQuery)

        const bookingYear = (booking.checkInDate || booking.checkOutDate || booking.createdAt || '').slice(0, 4)
        const matchesYear = selectedYear === 'All' || bookingYear === selectedYear

        return matchesQuery && matchesYear
      })
      .map((booking) => ({
        ...booking,
        id: booking.bookingReference || booking.id,
        title: booking.selectedOffer?.title || booking.propertyName || 'Resort Booking',
        dateRange: `${booking.checkInDate || 'TBD'} to ${booking.checkOutDate || 'TBD'}`,
        guests: booking.guests || booking.guestCount ? `${booking.guests || booking.guestCount} guests` : '',
        total: typeof (booking.totalAmount ?? booking.totalPaid) === 'number'
          ? `PHP ${(booking.totalAmount ?? booking.totalPaid).toLocaleString('en-PH')}`
          : undefined,
        status: resolveBookingTimelineStatus(booking),
      }))
      .sort((left, right) => {
        const leftDate = parseDateAtStartOfDay(left.checkInDate) || new Date(0)
        const rightDate = parseDateAtStartOfDay(right.checkInDate) || new Date(0)
        return sortOrder === 'newest' ? rightDate - leftDate : leftDate - rightDate
      })
  }, [customerBookings, searchQuery, selectedYear, sortOrder])

  const visibleReceipts = useMemo(() => {
    return resortReceipts
      .filter((receipt) => {
        const normalizedQuery = searchQuery.trim().toLowerCase()
        const matchesQuery = !normalizedQuery
          || receipt.stayLabel.toLowerCase().includes(normalizedQuery)
          || receipt.invoiceNumber.toLowerCase().includes(normalizedQuery)

        const receiptYear = receipt.issuedDate.slice(0, 4)
        const matchesYear = selectedYear === 'All' || receiptYear === selectedYear

        return matchesQuery && matchesYear
      })
      .map((receipt) => ({
        ...receipt,
        label: receipt.stayLabel,
        date: receipt.issuedDate,
        status: receipt.paymentStatus,
        amount: `PHP ${receipt.amountPaid}`,
        id: receipt.invoiceNumber,
        originalId: receipt.id,
      }))
      .sort((left, right) => {
        const leftDate = new Date(left.issuedDate)
        const rightDate = new Date(right.issuedDate)
        return sortOrder === 'newest' ? rightDate - leftDate : leftDate - rightDate
      })
  }, [searchQuery, selectedYear, sortOrder])

  const handleViewDetails = (record) => {
    const recordId = record.originalId || record.id || ''
    if (!recordId) {
      return
    }

    if (activeTab === 'bookings') {
      navigate(`/customer/bookings/${encodeURIComponent(recordId)}`)
    } else {
      navigate(`/customer/receipts/${encodeURIComponent(recordId)}`)
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
              placeholder="Search stays, room types, or receipt IDs"
            />
          </label>

          <div className="customerHistoryFilters">
            <div className="customerHistoryFilter">
              <label htmlFor="history-year">Year</label>
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

            <div className="customerHistoryFilter">
              <label htmlFor="history-category">Category</label>
              <select
                id="history-category"
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.target.value)}
              >
                {CATEGORY_OPTIONS.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="customerHistoryFilter">
              <label htmlFor="history-sort">Sort</label>
              <select
                id="history-sort"
                value={sortOrder}
                onChange={(event) => setSortOrder(event.target.value)}
              >
                {SORT_OPTIONS.map((option) => (
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
              </strong>{' '}
              sorted by {sortOrder === 'newest' ? 'newest' : 'oldest'}.
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