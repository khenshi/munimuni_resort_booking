import { useEffect } from 'react'
import { readCurrentCustomer, writeCurrentCustomer, dispatchAuthChanged, addCustomerReceipt } from '../../login/auth-storage'

export default function PaymentSuccessState({
  transactionSummary,
  bookingData,
  paymentMethod,
  formatCurrency,
  onReturnToDashboard,
  onViewHistory,
}) {
  useEffect(() => {
    if (transactionSummary && bookingData) {
      const currentCustomer = readCurrentCustomer()
      if (currentCustomer) {
        const receipt = {
          id: `receipt-${Date.now()}`,
          invoiceNumber: `INV-${Date.now()}`,
          stayLabel: bookingData.propertyName || 'Resort Stay',
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
            label: `${bookingData.propertyName || 'Room'} package`,
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

        // Update current user context with recent payment details
        const updatedCustomer = {
          ...currentCustomer,
          recentPayment: transactionSummary,
        }
        writeCurrentCustomer(updatedCustomer)
        dispatchAuthChanged()
      }
    }
  }, [transactionSummary, bookingData, paymentMethod])

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
        <button type="button" className="secondary-btn">
          View Invoice
        </button>
      </div>
    </>
  )
}
