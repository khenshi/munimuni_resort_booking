/**
 * 
 * @param {object} - receipt - receipt record to display in the list item
 * @param {Function} - onViewDetails - callback function to trigger when "View Details" button is clicked, receives the receipt object as an argument
 * @returns 
 */
export default function BillingReceiptLedgerItem({ receipt, onViewDetails }) {
  return (
    <article className="historyReceiptRow" aria-label={`Receipt ${receipt.id}`}>
      <div className="historyRowMain">
        <div className="historyRowTitleGroup">
          <p className="historyRowTitle">{receipt.label}</p>
          <p className="historyRowSubtle">
            <span className="historyRowMeta">{receipt.date}</span>
          </p>
          <p className="historyRowSubtle">{receipt.id}</p>
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

