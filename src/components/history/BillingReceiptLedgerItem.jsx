/**
 * History "Billing & Receipts" ledger row component.
 * Renders a normalized receipt display model for Member 5 mapping.
 * Delegates navigation via the onViewDetails callback.
 */

/**
 * Render one billing/receipt ledger row for the History page.
 * @param {{ receipt: import('../../pages/historyDisplayModels').ReceiptLedgerItemModel, onViewDetails?: (receipt: any) => void }} props
 * @returns {import('react').JSX.Element}
 */
export default function BillingReceiptLedgerItem({ receipt, onViewDetails }) {
  return (
    <article className="historyReceiptRow" aria-label={`Receipt ${receipt.id}`}>
      <div className="historyRowMain">
        <div className="historyRowTitleGroup">
          <p className="historyRowTitle">{receipt.label}</p>
          <p className="historyRowSubtle">
            <span className="historyRowMeta">{receipt.date}</span>
            {receipt.status ? <span className="historyRowMeta"> • {receipt.status}</span> : null}
            <span className="historyRowMeta"> • {receipt.id}</span>
          </p>
        </div>

        <div className="historyRowAside">
          <p className="historyRowAmount">{receipt.amount}</p>
          <button
            type="button"
            className="historyRowAction"
            onClick={() => onViewDetails?.(receipt)}
            aria-label={`View details for receipt ${receipt.id}`}
          >
            View Details
          </button>
        </div>
      </div>
    </article>
  )
}

