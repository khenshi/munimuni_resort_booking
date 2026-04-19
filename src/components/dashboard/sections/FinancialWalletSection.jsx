import './FinancialWalletSection.css'

export function formatCurrency(amount) {
  return `PHP ${Number(amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}`
}

export default function FinancialWalletSection({ outstandingBalance = 0 }) {
  const hasBalance = outstandingBalance > 0;

  return (
    <div className={`accountStatusCard ${hasBalance ? 'hasBalance' : 'isSettled'}`}>
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
            <button type="button" className="payNowBtn">
              Pay Now
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
