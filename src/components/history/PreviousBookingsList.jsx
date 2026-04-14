/**
 * History list section for the "Previous Stays" tab.
 * Renders booking rows, plus empty/loading states.
 * Delegates navigation via the onViewDetails callback.
 */

import PreviousBookingListItem from './PreviousBookingListItem'

/**
 * Render the previous bookings list.
 * @param {{ records: import('../../pages/historyDisplayModels').BookingListItemModel[], onViewDetails?: (booking: any) => void, isLoading?: boolean }} props
 * @returns {import('react').JSX.Element}
 */
export default function PreviousBookingsList({ records, onViewDetails, isLoading = false }) {
  if (isLoading) {
    return (
      <section className="historyList" aria-label="Previous stays list">
        <div className="historyListSkeleton" aria-hidden="true">
          <div className="historySkeletonRow" />
          <div className="historySkeletonRow" />
          <div className="historySkeletonRow" />
        </div>
      </section>
    )
  }

  if (!records?.length) {
    return (
      <section className="historyList" aria-label="Previous stays list">
        <div className="historyEmptyState" role="status">
          <p className="historyEmptyTitle">No previous stays found</p>
          <p className="historyEmptyText">Try adjusting your search, year, or category filters.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="historyList" aria-label="Previous stays list">
      <div className="historyListStack">
        {records.map((booking) => (
          <PreviousBookingListItem key={booking.id} booking={booking} onViewDetails={onViewDetails} />
        ))}
      </div>
    </section>
  )
}

