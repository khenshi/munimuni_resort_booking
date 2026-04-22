import BillingReceiptLedgerItem from './BillingReceiptLedgerItem'

/**
 * 
 * @param {Array} - recorsds - array of receipt records to display in the list
 * @param {Function} - onViewDetails - callback 
 * @returns 
 */
export default function BillingReceiptsList({ records, onViewDetails }) {
  if (!records?.length) {
    return (
      <section className="historyList" aria-label="Billing and receipts list">
        <div className="historyEmptyState" role="status">
          <p className="historyEmptyTitle">No invoices found</p>
          <p className="historyEmptyText">Try adjusting your search, year, or sort settings.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="historyList" aria-label="Billing and receipts list">
      <div className="historyListStack">
        {records.map((receipt) => (
          <BillingReceiptLedgerItem key={receipt.id} receipt={receipt} onViewDetails={onViewDetails} />
        ))}
      </div>
    </section>
  )
}

