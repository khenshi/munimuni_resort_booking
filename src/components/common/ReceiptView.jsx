import React from 'react'
import './ReceiptView.css'

export default function ReceiptView({ transactionObject }) {
  if (!transactionObject) {
    return <div className="receipt-error">Transaction data not available</div>
  }

  const {
    transactionId,
    bookingId,
    timestamp,
    customerDetails,
    itemizedCosts,
    paymentMethod,
    totalAmount,
    status
  } = transactionObject

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(amount)
  }

  return (
    <div className="receipt-container">
      <div className="receipt-header">
        <div className="receipt-branding">
          <h1>Muni-Muni Beach Resort</h1>
          <p>Samal Island, Davao del Norte</p>
        </div>
        <div className="receipt-title">
          <h2>OFFICIAL RECEIPT</h2>
          <div className="paid-watermark">PAID</div>
        </div>
      </div>

      <div className="receipt-details">
        <div className="receipt-row">
          <span className="label">Transaction ID:</span>
          <span className="value">{transactionId}</span>
        </div>
        <div className="receipt-row">
          <span className="label">Booking ID:</span>
          <span className="value">{bookingId}</span>
        </div>
        <div className="receipt-row">
          <span className="label">Date & Time:</span>
          <span className="value">{formatDate(timestamp)}</span>
        </div>
        <div className="receipt-row">
          <span className="label">Status:</span>
          <span className="value status-completed">{status.toUpperCase()}</span>
        </div>
      </div>

      <div className="customer-details">
        <h3>Customer Information</h3>
        <div className="receipt-row">
          <span className="label">Name:</span>
          <span className="value">{customerDetails.name}</span>
        </div>
        <div className="receipt-row">
          <span className="label">Email:</span>
          <span className="value">{customerDetails.email}</span>
        </div>
        <div className="receipt-row">
          <span className="label">Phone:</span>
          <span className="value">{customerDetails.phone}</span>
        </div>
      </div>

      <div className="charges-breakdown">
        <h3>Charges Breakdown</h3>
        <div className="charges-table">
          <div className="charge-row">
            <span>Room Charges</span>
            <span>{formatCurrency(itemizedCosts.room)}</span>
          </div>
          <div className="charge-row">
            <span>Add-ons</span>
            <span>{formatCurrency(itemizedCosts.addOns)}</span>
          </div>
          <div className="charge-row">
            <span>Rentals</span>
            <span>{formatCurrency(itemizedCosts.rentals)}</span>
          </div>
          <div className="charge-row total-row">
            <span><strong>Total Amount</strong></span>
            <span><strong>{formatCurrency(totalAmount)}</strong></span>
          </div>
        </div>
      </div>

      <div className="payment-details">
        <h3>Payment Information</h3>
        <div className="receipt-row">
          <span className="label">Payment Method:</span>
          <span className="value">{paymentMethod}</span>
        </div>
      </div>

      <div className="receipt-footer">
        <p>Thank you for choosing Muni-Muni Beach Resort!</p>
        <p>For any inquiries, please contact our guest services.</p>
        <p className="receipt-note">This is an electronically generated receipt.</p>
      </div>
    </div>
  )
}