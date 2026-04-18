/**
 * History list section for the "Billing & Receipts" tab.
 * Renders receipt ledger rows, plus empty/loading states.
 * Delegates navigation via the onViewDetails callback.
 */

import BillingReceiptLedgerItem from './BillingReceiptLedgerItem'

/**
 * Render the billing & receipts list.
 * @param {{ records: import('../../pages/historyDisplayModels').ReceiptLedgerItemModel[], onViewDetails?: (receipt: any) => void, isLoading?: boolean }} props
 * @returns {import('react').JSX.Element}
 */
export default function BillingReceiptsList({ records, onViewDetails, isLoading = false }) {
  if (isLoading) {
    return (
      <section className="historyList" aria-label="Billing and receipts list">
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
      <section className="historyList" aria-label="Billing and receipts list">
        <div className="historyEmptyState" role="status">
          <p className="historyEmptyTitle">No billing records found</p>
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

