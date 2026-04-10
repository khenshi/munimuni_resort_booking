import { useMemo, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import LoginPageHeader from '../components/login/layout/LoginPageHeader'
import { readCurrentCustomer } from '../components/login/auth-storage'
import { previousBookings } from '../data/previous-bookings'
import { resortReceipts } from '../data/receipts'
import '../styles/pages/customer-history-page.css'

const HISTORY_TABS = [
  { id: 'bookings', label: 'Previous Stays' },
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

export default function CustomerHistoryPage() {
  const currentCustomer = readCurrentCustomer()
  const [activeTab, setActiveTab] = useState('bookings')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedYear, setSelectedYear] = useState('All')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortOrder, setSortOrder] = useState('newest')

  const toolbarState = useMemo(
    () => ({ activeTab, searchQuery, selectedYear, selectedCategory, sortOrder }),
    [activeTab, searchQuery, selectedYear, selectedCategory, sortOrder]
  )

  const bookingRecords = useMemo(() => {
    return previousBookings
      .filter((booking) => {
        const normalizedQuery = searchQuery.trim().toLowerCase()
        const matchesQuery = !normalizedQuery
          || booking.propertyName.toLowerCase().includes(normalizedQuery)
          || booking.bookingReference.toLowerCase().includes(normalizedQuery)

        const bookingYear = booking.checkInDate.slice(0, 4)
        const matchesYear = selectedYear === 'All' || bookingYear === selectedYear

        return matchesQuery && matchesYear
      })
      .sort((left, right) => {
        const leftDate = new Date(left.checkInDate)
        const rightDate = new Date(right.checkInDate)
        return sortOrder === 'newest' ? rightDate - leftDate : leftDate - rightDate
      })
  }, [searchQuery, selectedYear, sortOrder])

  const receiptRecords = useMemo(() => {
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
      .sort((left, right) => {
        const leftDate = new Date(left.issuedDate)
        const rightDate = new Date(right.issuedDate)
        return sortOrder === 'newest' ? rightDate - leftDate : leftDate - rightDate
      })
  }, [searchQuery, selectedYear, sortOrder])

  if (!currentCustomer) {
    return <Navigate to="/customer/login" replace />
  }

  return (
    <div className="customerHistoryPage">
      <LoginPageHeader />
      <main className="customerHistoryMain">
        <section className="customerHistoryShell">
          <div className="customerHistoryHero">
            <div className="customerHistoryTitleGroup">
              <p className="customerHistoryLabel">My Resort History</p>
              <h1 className="customerHistoryTitle">Review past stays and resort charges</h1>
              <p className="customerHistoryDescription">
                Use the tabs, search bar, and filters below to find prior reservations or billing documents.
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
                  {activeTab === 'bookings' ? 'previous stays' : 'billing & receipts'}
                </strong>{' '}
                sorted by {sortOrder === 'newest' ? 'newest' : 'oldest'}.
              </p>
            </div>

            <div className="customerHistoryPlaceholder">
              <p className="customerHistoryPlaceholderTitle">
                {activeTab === 'bookings' ? 'Previous stay records' : 'Billing & receipt records'}
              </p>
              <p className="customerHistoryPlaceholderText">
                Showing {activeTab === 'bookings' ? bookingRecords.length : receiptRecords.length} matching record(s).
              </p>
              {activeTab === 'bookings' ? (
                <div className="customerHistoryResults">
                  {bookingRecords.map((booking) => (
                    <article key={booking.id} className="customerHistoryResultCard">
                      <p className="customerHistoryResultTitle">{booking.propertyName}</p>
                      <p className="customerHistoryResultMeta">{booking.bookingReference}</p>
                      <p className="customerHistoryResultMeta">
                        {booking.checkInDate} to {booking.checkOutDate}
                      </p>
                      <Link
                        className="customerHistoryResultLink"
                        to={`/customer/bookings/${encodeURIComponent(booking.id)}`}
                      >
                        View Booking Detail
                      </Link>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="customerHistoryResults">
                  {receiptRecords.map((receipt) => (
                    <article key={receipt.id} className="customerHistoryResultCard">
                      <p className="customerHistoryResultTitle">{receipt.invoiceNumber}</p>
                      <p className="customerHistoryResultMeta">{receipt.stayLabel}</p>
                      <p className="customerHistoryResultMeta">Issued: {receipt.issuedDate}</p>
                      <Link
                        className="customerHistoryResultLink"
                        to={`/customer/receipts/${encodeURIComponent(receipt.id)}`}
                      >
                        View Receipt Detail
                      </Link>
                    </article>
                  ))}
                </div>
              )}
              <details>
                <summary>Debug filter state</summary>
                <pre>{JSON.stringify(toolbarState, null, 2)}</pre>
              </details>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}