import '../../../styles/components/dashboard/FinancialWalletSection.css'

/**
 * Formats a currency amount as a string with the PHP symbol and two decimal places.
 * @param {number} amount - The currency amount to format.
 * @returns {string} The formatted currency string.
 */
export function formatCurrency(amount) {
  return `PHP ${Number(amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}`
}

/**
  * FinancialWalletSection component displays the customer's outstanding balance and payment status.
  * @param {Object} onPayNow - Navigation props.
  * @param {number} outstandingBalance - The customer's outstanding balance.
  */
export default function FinancialWalletSection({ outstandingBalance = 0, onPayNow }) {
  const hasBalance = outstandingBalance > 0;

  return (
    <div className={`accountStatusCard ${hasBalance ? 'hasBalance' : 'isSettled'}`}> {/* Add class based on balance status */}
      <div className="statusContent">
        <div className="statusTextGroup">
          <p className="statusLabel">Account Status</p>
          <h3 className="statusValue">
            {hasBalance ? 'Payment Pending' : 'Account Settled'}
          </h3>
          <p className="statusSubtext">
            {hasBalance 
              ? `You have an outstanding balance of ${formatCurrency(outstandingBalance)}.` 
              : 'All your stay balances have been fully settled. Thank you!'}
          </p>
        </div>

        <div className="statusActionArea">
          <div className="balanceDisplay">
            <span className="balanceLabel">Outstanding Balance</span>
            <span className="balanceValue">{formatCurrency(outstandingBalance)}</span>
          </div>
          {hasBalance && (
            <button type="button" className="payNowBtn" onClick={onPayNow}>
              Pay Now
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
