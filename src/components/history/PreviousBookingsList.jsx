
import PreviousBookingListItem from './PreviousBookingListItem'

/**
 * 
 * @param {Array} - records - array of booking records to display in the list
 * @param {Function} - onViewDetails - callback function to trigger when "View Details" button is clicked on any list item, receives the corresponding booking object as an argument
 * @returns 
 */
export default function PreviousBookingsList({ records, onViewDetails }) {
  if (!records?.length) {
    return (
      <section className="historyList" aria-label="Bookings and stays list">
        <div className="historyEmptyState" role="status">
          <p className="historyEmptyTitle">No bookings found</p>
          <p className="historyEmptyText">Try adjusting your search, year, or category filters.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="historyList" aria-label="Bookings and stays list">
      <div className="historyListStack">
        {records.map((booking) => (
          <PreviousBookingListItem key={booking.id} booking={booking} onViewDetails={onViewDetails} />
        ))}
      </div>
    </section>
  )
}

