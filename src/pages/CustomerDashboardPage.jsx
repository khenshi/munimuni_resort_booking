import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import LoginPageHeader from '../components/login/layout/LoginPageHeader'
import { AUTH_CHANGED_EVENT, readCurrentCustomer } from '../components/login/auth-storage'
import '../components/dashboard/sections/FinancialWalletSection.css'

export default function CustomerDashboardPage() {
  const navigate = useNavigate()
  const [currentCustomer, setCurrentCustomer] = useState(() => readCurrentCustomer())

  useEffect(() => {
    const syncCurrentCustomer = () => {
      const nextCustomer = readCurrentCustomer()
      setCurrentCustomer(nextCustomer)

      if (!nextCustomer) {
        navigate('/customer/login', { replace: true })
      }
    }

    window.addEventListener('storage', syncCurrentCustomer)
    window.addEventListener(AUTH_CHANGED_EVENT, syncCurrentCustomer)

    return () => {
      window.removeEventListener('storage', syncCurrentCustomer)
      window.removeEventListener(AUTH_CHANGED_EVENT, syncCurrentCustomer)
    }
  }, [navigate])

  if (!currentCustomer) {
    return <Navigate to="/customer/login" replace />
  }

  const walletData = {
    outstandingBalance: 1850,
    recentReceipts: [
      {
        id: 'receipt-1029',
        invoiceNumber: 'INV-1029',
        stayLabel: 'Overnight Family Package',
        dateLabel: 'Apr 08, 2026',
        amountLabel: 'PHP 3,500',
        paymentMethod: 'Cash on arrival',
      },
      {
        id: 'receipt-1024',
        invoiceNumber: 'INV-1024',
        stayLabel: 'Cove Day Tour',
        dateLabel: 'Mar 30, 2026',
        amountLabel: 'PHP 2,000',
        paymentMethod: 'GCash',
      },
      {
        id: 'receipt-1018',
        invoiceNumber: 'INV-1018',
        stayLabel: 'Cliffside Overnight Stay',
        dateLabel: 'Mar 18, 2026',
        amountLabel: 'PHP 5,200',
        paymentMethod: 'Bank transfer',
      },
    ],
  }
  const hasOutstandingBalance = Number(walletData.outstandingBalance) > 0

  return (
    <div className="customerDashboardPage">
      <LoginPageHeader />
      <main className="customerDashboardMain">
        <section className="customerDashboardShell" aria-label="Customer dashboard overview">
          <div className="customerDashboardIntro">
            <p className="customerDashboardKicker">Customer Dashboard</p>
            <h1 className="customerDashboardTitle">
              Welcome back, {currentCustomer.fullName || currentCustomer.email}.
            </h1>
            <p className="customerDashboardCopy">
              Manage balances, review recent receipts, and keep your stay history in one place.
            </p>
          </div>

          <section className="dashboardWalletSection" aria-labelledby="dashboard-wallet-heading">
            <div className="dashboardWalletHeader">
              <div>
                <p className="dashboardSectionEyebrow">Account & Financial Wallet</p>
                <h2 id="dashboard-wallet-heading" className="dashboardSectionTitle">
                  Balance and receipt snapshot for {currentCustomer.fullName || currentCustomer.email}.
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
                        <button type="button" className="dashboardTextButton" aria-label={`View details for ${receipt.invoiceNumber}`}>
                          View Details
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </article>
            </div>
          </section>
        </section>
      </main>
    </div>
  )
}
