import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  readCurrentCustomer,
  writeCurrentCustomer,
  dispatchAuthChanged,
  addCustomerReceipt,
  getCustomerReceipts,
} from '../../login/auth-storage'

export default function PaymentSuccessState({
  transactionSummary,
  bookingData,
  paymentMethod,
  formatCurrency,
  onReturnToDashboard,
}) {
  const [createdReceipt, setCreatedReceipt] = useState(null)
  const navigate = useNavigate()
  const receiptProcessedRef = useRef(false)

  const packageTitle = bookingData?.selectedOffer?.title || bookingData?.title || bookingData?.propertyName || 'Resort Stay'

  // Reset processing flag when transaction changes
  useEffect(() => {
    receiptProcessedRef.current = false
    setCreatedReceipt(null)
  }, [transactionSummary?.bookingReference])
  useEffect(() => {
    if (transactionSummary && bookingData && !receiptProcessedRef.current) {
      receiptProcessedRef.current = true
      
      const currentCustomer = readCurrentCustomer()
      if (currentCustomer) {
        const receipt = {
          id: `receipt-${Date.now()}`,
          invoiceNumber: `INV-${Date.now()}`,
          bookingReference: transactionSummary.bookingReference,
          stayLabel: packageTitle,
          packageName: packageTitle,
          issuedDate: new Date().toISOString().slice(0, 10),
          amountPaid: transactionSummary.amountPaid,
          paymentMethod: paymentMethod || 'Cash',
          paymentStatus: 'paid',
          guestName: currentCustomer.fullName,
          billingAddress: 'MuniMuni Resort Front Desk Billing',
          lineItems: [],
          serviceFee: 0,
          discount: 0,
        }

        const itemizedCosts = bookingData.itemizedCosts || {}
        if (itemizedCosts.room) {
          receipt.lineItems.push({
            id: 'room',
            label: `${packageTitle} package`,
            quantity: 1,
            unitPrice: itemizedCosts.room,
          })
        }
        if (itemizedCosts.addOns) {
          receipt.lineItems.push({
            id: 'add-ons',
            label: 'Add-ons',
            quantity: 1,
            unitPrice: itemizedCosts.addOns,
          })
        }
        if (itemizedCosts.rentals) {
          receipt.lineItems.push({
            id: 'rentals',
            label: 'Rentals',
            quantity: 1,
            unitPrice: itemizedCosts.rentals,
          })
        }

        addCustomerReceipt(currentCustomer.id, receipt)
        setCreatedReceipt(receipt)

        // Update current user context with recent payment details
        const updatedCustomer = {
          ...currentCustomer,
          recentPayment: transactionSummary,
        }
        writeCurrentCustomer(updatedCustomer)
        dispatchAuthChanged()
      }
    }
  }, [transactionSummary?.bookingReference]) // Only depend on bookingReference to allow new transactions

  const handleViewInvoice = () => {
    const currentCustomer = readCurrentCustomer()
    if (!currentCustomer) {
      return
    }

    const latestReceipt = createdReceipt || getCustomerReceipts(currentCustomer.id).at(-1)
    if (!latestReceipt) {
      return
    }

    navigate('/customer/receipts/detail', { state: { receiptData: latestReceipt } })
  }

  const currentCustomer = readCurrentCustomer()
  const hasStoredReceipt = currentCustomer
    ? getCustomerReceipts(currentCustomer.id).length > 0
    : false
  const canViewInvoice = Boolean(createdReceipt || hasStoredReceipt)

  return (
    <>
      <div className="success-banner">
        <p>
          Booking {transactionSummary.bookingReference} was confirmed with a {transactionSummary.paymentType} payment.
        </p>
      </div>

      <div className="booking-summary">
        <h2>Transaction Summary</h2>
        <div className="summary-details">
          <p><strong>Booking Reference:</strong> {transactionSummary.bookingReference}</p>
          <p><strong>Total Amount:</strong> {formatCurrency(transactionSummary.totalAmount)}</p>
          <p><strong>Amount Paid:</strong> {formatCurrency(transactionSummary.amountPaid)}</p>
          <p><strong>Outstanding Balance:</strong> {formatCurrency(transactionSummary.outstandingBalance)}</p>
        </div>
      </div>

      <div className="payment-actions">
        <button type="button" onClick={onReturnToDashboard} className="primary-btn">
          Go to Dashboard
        </button>
        <button 
          type="button" 
          className="secondary-btn"
          onClick={handleViewInvoice}
          disabled={!canViewInvoice}
        >
          View Invoice / Receipt
        </button>
      </div>
    </>
  )
}
