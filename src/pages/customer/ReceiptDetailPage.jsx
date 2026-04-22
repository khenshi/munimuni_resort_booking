import { Link, Navigate, useLocation } from 'react-router-dom'
import { getCustomerReceipts, readCurrentCustomer } from '../../components/login'
import {
  formatReceiptCurrency,
  getReceiptTotals,
} from '../../data/receipts'
import '../../styles/pages/customer-detail-pages.css'

// Utility function to format date strings into a more readable format. If the input is invalid or missing, it returns 'N/A' or the original text.
function formatDate(dateText) {
  if (!dateText) return 'N/A'
  const parsedDate = new Date(dateText)
  if (Number.isNaN(parsedDate.getTime())) return dateText
  return parsedDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function ReceiptDetailPage() {
  const location = useLocation()
  const currentCustomer = readCurrentCustomer()

  // If there is no logged-in customer, redirect to the login page. This ensures that only authenticated users can access receipt details.
  if (!currentCustomer) {
    return <Navigate to="/customer/login" replace />
  }

  // Attempt to get receipt data from location state (if navigated from a recent transaction) or fallback to the latest receipt for the customer. 
  const stateReceipt = location.state?.receiptData
  const latestCustomerReceipt = getCustomerReceipts(currentCustomer.id).at(-1)
  const receipt = stateReceipt || latestCustomerReceipt

  if (!receipt) {
    return (
      <div className="customerDetailPage">
        <main className="customerDetailMain">
          <section className="customerDetailCard">
            <p className="customerDetailKicker">Receipt Detail</p>
            <h1 className="customerDetailTitle">Receipt not found</h1>
            <p className="customerDetailDescription">
              We could not find a receipt for your account yet.
            </p>
            <div className="customerDetailActions">
              <Link className="customerDetailBtn isPrimary" to="/customer/dashboard">
                Back to Dashboard
              </Link>
              <Link className="customerDetailBtn" to="/customer/history">
                Open History
              </Link>
            </div>
          </section>
        </main>
      </div>
    )
  }

  // Calculate totals for the receipt using the getReceiptTotals function
  const totals = getReceiptTotals(receipt)

  return (
    <div className="customerDetailPage">
      <main className="customerDetailMain">
        <section className="customerDetailCard">
          <p className="customerDetailKicker">Receipt Detail</p>
          <h1 className="customerDetailTitle">{receipt.invoiceNumber}</h1>
          <p className="customerDetailDescription">
            Itemized invoice for <strong>{receipt.stayLabel}</strong>.
          </p>

          <div className="customerDetailGrid singleColumn">
            <article className="customerDetailPanel">
              <h2>Invoice Summary</h2>
              <div className="customerDetailRow">
                <span>Receipt ID</span>
                <strong>{receipt.id}</strong>
              </div>
              <div className="customerDetailRow">
                <span>Invoice number</span>
                <strong>{receipt.invoiceNumber}</strong>
              </div>
              <div className="customerDetailRow">
                <span>Booking reference</span>
                <strong>{receipt.bookingReference || 'N/A'}</strong>
              </div>
              <div className="customerDetailRow">
                <span>Issued date</span>
                <strong>{formatDate(receipt.issuedDate)}</strong>
              </div>
              <div className="customerDetailRow">
                <span>Guest</span>
                <strong>{receipt.guestName}</strong>
              </div>
              <div className="customerDetailRow">
                <span>Payment method</span>
                <strong>{receipt.paymentMethod}</strong>
              </div>
              <div className="customerDetailRow">
                <span>Payment status</span>
                <strong className="customerDetailBadge">{receipt.paymentStatus}</strong>
              </div>
            </article>

            <article className="customerDetailPanel">
              <h2>Itemized Breakdown</h2>
              <div className="customerReceiptTable" role="table" aria-label="Receipt line items">
                <div className="customerReceiptTableHeader" role="row">
                  <span role="columnheader">Item</span>
                  <span role="columnheader">Qty</span>
                  <span role="columnheader">Unit Price</span>
                  <span role="columnheader">Amount</span>
                </div>
                {receipt.lineItems.map((item) => (
                  <div key={item.id} className="customerReceiptTableRow" role="row">
                    <span role="cell">{item.label}</span>
                    <span role="cell">{item.quantity}</span>
                    <span role="cell">{formatReceiptCurrency(item.unitPrice)}</span>
                    <span role="cell">{formatReceiptCurrency(item.quantity * item.unitPrice)}</span>
                  </div>
                ))}
              </div>

              <div className="customerReceiptTotals">
                <div className="customerDetailRow">
                  <span>Subtotal</span>
                  <strong>{formatReceiptCurrency(totals.subtotal)}</strong>
                </div>
                <div className="customerDetailRow">
                  <span>Service fee</span>
                  <strong>{formatReceiptCurrency(totals.serviceFee)}</strong>
                </div>
                <div className="customerDetailRow">
                  <span>Discount</span>
                  <strong>-{formatReceiptCurrency(totals.discount)}</strong>
                </div>
                <div className="customerDetailRow emphasis">
                  <span>Booking total</span>
                  <strong>{formatReceiptCurrency(totals.grandTotal)}</strong>
                </div>
                <div className="customerDetailRow emphasis">
                  <span>Amount paid for this invoice</span>
                  <strong>{formatReceiptCurrency(receipt.amountPaid || 0)}</strong>
                </div>
              </div>
            </article>
          </div>

          <div className="customerDetailActions">
            <Link className="customerDetailBtn isPrimary" to="/customer/history">
              Back to History
            </Link>
            <Link className="customerDetailBtn" to="/customer/dashboard">
              Dashboard
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}
