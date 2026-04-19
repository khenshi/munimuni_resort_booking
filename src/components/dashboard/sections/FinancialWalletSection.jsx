import { Link } from 'react-router-dom'
import { defaultWalletData } from '../../../data/receipts'
import './FinancialWalletSection.css'

export default function FinancialWalletSection({ customerName, walletData = defaultWalletData, accountBalance = 0 }) {
  const hasOutstandingBalance = Number(walletData.outstandingBalance) > 0

  return (
    <section className="dashboardWalletSection" aria-labelledby="dashboard-wallet-heading">
      <div className="dashboardWalletHeader">
        <div>
          <p className="dashboardSectionEyebrow">Account & Financial Wallet</p>
          <h2 id="dashboard-wallet-heading" className="dashboardSectionTitle">
            Balance and receipt snapshot for {customerName}.
          </h2>
        </div>
        <p className="dashboardSectionCopy">
          A quick view of pending balances and the latest completed stay invoices.
        </p>
      </div>

      <div className="dashboardWalletGrid">
        <article className="dashboardWalletPanel dashboardBalancePanel">
          <div className="dashboardWalletPanelHeader">
            <div>
              <p className="dashboardPanelLabel">Outstanding Balances</p>
              <h3 className="dashboardPanelTitle">Open charges</h3>
              <p className="dashboardBalanceNote">
                Wallet balance: PHP {Number(accountBalance).toLocaleString()}
              </p>
            </div>
            <span className={`dashboardBalancePill ${hasOutstandingBalance ? 'isDue' : 'isClear'}`}>
              {hasOutstandingBalance ? 'Payment due' : 'Settled'}
            </span>
          </div>

          {hasOutstandingBalance ? (
            <div className="dashboardBalanceState">
              <div>
                <p className="dashboardBalanceAmount">PHP {Number(walletData.outstandingBalance).toLocaleString()}</p>
                <p className="dashboardBalanceNote">
                  Please settle the remaining balance before your next stay.
                </p>
              </div>
              <button type="button" className="dashboardPrimaryAction">
                Pay Now
              </button>
            </div>
          ) : (
            <p className="dashboardBalanceNote dashboardBalanceClearState">
              No outstanding balance at the moment.
            </p>
          )}
        </article>

        <article className="dashboardWalletPanel dashboardReceiptsPanel">
          <div className="dashboardWalletPanelHeader">
            <div>
              <p className="dashboardPanelLabel">Recent Receipts</p>
              <h3 className="dashboardPanelTitle">Latest completed stays</h3>
            </div>
            <p className="dashboardPanelSubcopy">Showing the last 2-3 invoice records.</p>
          </div>

          <ul className="dashboardReceiptsList">
            {walletData.recentReceipts.slice(0, 3).map((receipt) => (
              <li key={receipt.id} className="dashboardReceiptItem">
                <div className="dashboardReceiptCopy">
                  <div className="dashboardReceiptMetaRow">
                    <span className="dashboardReceiptInvoice">{receipt.invoiceNumber}</span>
                    <span className="dashboardReceiptDate">{receipt.dateLabel}</span>
                  </div>
                  <p className="dashboardReceiptStay">{receipt.stayLabel}</p>
                  <p className="dashboardReceiptPaymentMethod">Paid via {receipt.paymentMethod}</p>
                </div>

                <div className="dashboardReceiptActions">
                  <strong className="dashboardReceiptAmount">{receipt.amountLabel}</strong>
                  <Link
                    to={`/customer/receipts/${encodeURIComponent(receipt.id)}`}
                    className="dashboardTextButton"
                    aria-label={`View details for ${receipt.invoiceNumber}`}
                  >
                    View Details
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  )
}
