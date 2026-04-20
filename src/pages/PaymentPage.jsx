import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { createTransaction, saveTransaction, generateTransactionId, ensureBookingCosts, calculateBookingCosts } from '../utils/transactionSchema'
import { CURRENT_CUSTOMER_STORAGE_KEY } from '../components/login/auth-storage'
import { CUSTOMER_BOOKINGS_STORAGE_KEY } from '../components/login/bookings-storage'
import ReceiptView from '../components/common/ReceiptView'
import '../styles/pages/payment-history.css'

export default function PaymentPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const [bookingData, setBookingData] = useState(null)
  const [currentCustomer, setCurrentCustomer] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState('Credit Card')
  const [isProcessing, setIsProcessing] = useState(false)
  const [transaction, setTransaction] = useState(null)
  const [unpaidBookings, setUnpaidBookings] = useState([])

  useEffect(() => {
    // 1. Fetch current customer
    const customer = JSON.parse(localStorage.getItem(CURRENT_CUSTOMER_STORAGE_KEY))
    if (!customer) {
      navigate('/customer/login')
      return
    }
    setCurrentCustomer(customer)

    // 2. Get all user bookings and filter unpaid ones
    const bookingsData = JSON.parse(localStorage.getItem(CUSTOMER_BOOKINGS_STORAGE_KEY) || '{}')
    const userBookings = bookingsData[customer.id] || []
    const unpaidBookingsList = userBookings.filter(b => b.status !== 'Paid')
    setUnpaidBookings(unpaidBookingsList)

    // 3. Fetch booking data using bookingReference from location.state
    const bookingReference = location.state?.bookingReference
    
    if (bookingReference) {
      const booking = unpaidBookingsList.find(b => b.bookingReference === bookingReference)
      
      if (booking) {
        // Calculate costs from official package data
        const { itemizedCosts, totalAmount } = calculateBookingCosts(booking)
        const bookingWithCosts = { ...booking, itemizedCosts, totalAmount }
        setBookingData(bookingWithCosts)
      } else {
        navigate('/customer/dashboard')
      }
    } else {
      // If no reference passed, check for multiple unpaid bookings
      if (unpaidBookingsList.length === 1) {
        // Single unpaid booking, use it
        const { itemizedCosts, totalAmount } = calculateBookingCosts(userBookings[0])
        const bookingWithCosts = { ...userBookings[0], itemizedCosts, totalAmount }
        setBookingData(bookingWithCosts)
      }
      // If multiple, leave bookingData null to show selection grid
      // If none, leave bookingData null to show empty state
    }
  }, [location, navigate])

  const calculateTotal = () => {
    return bookingData?.totalAmount || 0
  }

  const handlePayment = async () => {
    if (!bookingData || !currentCustomer) return

    setIsProcessing(true)

    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Generate transaction object based on your schema
    const newTransaction = createTransaction({
      transactionId: generateTransactionId(),
      bookingId: bookingData.bookingReference,
      customerDetails: {
        name: currentCustomer.fullName,
        email: currentCustomer.email,
        phone: currentCustomer.phone || ''
      },
      itemizedCosts: bookingData.itemizedCosts,
      paymentMethod,
      totalAmount: calculateTotal(),
      status: 'completed'
    })

    // Save to munimuni-transactions via your utility
    saveTransaction(newTransaction)

    // Update the booking in localStorage to mark it as processed/paid with costs
    const bookingsData = JSON.parse(localStorage.getItem(CUSTOMER_BOOKINGS_STORAGE_KEY) || '{}')
    const userBookings = bookingsData[currentCustomer.id] || []
    const updatedBookings = userBookings.map(b => 
      b.bookingReference === bookingData.bookingReference 
        ? { ...b, itemizedCosts: bookingData.itemizedCosts, totalAmount: bookingData.totalAmount, status: 'Paid' }
        : b
    )
    bookingsData[currentCustomer.id] = updatedBookings
    localStorage.setItem(CUSTOMER_BOOKINGS_STORAGE_KEY, JSON.stringify(bookingsData))

    setTransaction(newTransaction)
    setIsProcessing(false)
  }

  if (transaction) {
    return (
      <div className="payment-page">
        <div className="container">
          <div className="success-banner">
            <h1>Payment Successful</h1>
            <p>Your transaction has been recorded.</p>
          </div>
          <ReceiptView transactionObject={transaction} />
          <div className="payment-actions">
            <button onClick={() => navigate('/customer/dashboard')} className="primary-btn">
              Return to Dashboard
            </button>
            <button onClick={() => navigate('/customer/receipt-history')} className="secondary-btn">
              View Receipt History
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!bookingData) {
    if (unpaidBookings.length === 0) {
      return (
        <div className="payment-page">
          <div className="container">
            <button onClick={() => navigate('/customer/dashboard')} className="back-btn">
              ← Back to Dashboard
            </button>
            <div className="empty-state">
              <h1>No Pending Payments</h1>
              <p>No pending payments or bookings as of this moment.</p>
              <button onClick={() => navigate('/packages')} className="primary-btn">
                Go to Booking Page
              </button>
            </div>
          </div>
        </div>
      )
    }
    if (unpaidBookings.length > 1) {
      return (
        <div className="payment-page">
          <div className="container">
            <button onClick={() => navigate('/customer/dashboard')} className="back-btn">
              ← Back to Dashboard
            </button>
            <h1>Select Booking to Pay</h1>
            <div className="booking-selection-grid">
              {unpaidBookings.map(booking => (
                <div 
                  key={booking.bookingReference} 
                  className="booking-card"
                  onClick={() => {
                    const { itemizedCosts, totalAmount } = calculateBookingCosts(booking)
                    const bookingWithCosts = { ...booking, itemizedCosts, totalAmount }
                    setBookingData(bookingWithCosts)
                  }}
                >
                  <h3>{booking.bookingReference}</h3>
                  <p><strong>Property:</strong> {booking.propertyName || booking.name}</p>
                  <p><strong>Total:</strong> ₱{calculateBookingCosts(booking).totalAmount}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    }
    return <div className="loading">Loading booking details...</div>
  }

  return (
    <div className="payment-page">
      <div className="container">
        <button onClick={() => navigate('/customer/dashboard')} className="back-btn">
          ← Back to Dashboard
        </button>
        <h1>Complete Your Payment</h1>

        <div className="booking-summary">
          <h2>Booking Summary</h2>
          <div className="summary-details">
            <p><strong>Booking Reference:</strong> {bookingData.bookingReference}</p>
            <p><strong>Property:</strong> {bookingData.propertyName || bookingData.name}</p>
            <p><strong>Check-in:</strong> {bookingData.checkInDate}</p>
            <p><strong>Check-out:</strong> {bookingData.checkOutDate}</p>
            <p><strong>Guests:</strong> {bookingData.guestCount}</p>
          </div>

          <div className="cost-breakdown">
            <h3>Cost Breakdown</h3>
            <div className="cost-item">
              <span>Room Charges</span>
              <span>₱{bookingData.itemizedCosts.room}</span>
            </div>
            <div className="cost-item">
              <span>Add-ons</span>
              <span>₱{bookingData.itemizedCosts.addOns}</span>
            </div>
            <div className="cost-item total">
              <span><strong>Total</strong></span>
              <span><strong>₱{calculateTotal()}</strong></span>
            </div>
          </div>
        </div>

        <div className="payment-form">
          <h2>Payment Details</h2>
          <div className="form-group">
            <label htmlFor="payment-method">Payment Method</label>
            <select
              id="payment-method"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="Credit Card">Credit Card</option>
              <option value="Debit Card">Debit Card</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Cash">Cash</option>
            </select>
          </div>

          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className="confirm-payment-btn"
          >
            {isProcessing ? 'Processing...' : 'Confirm Payment'}
          </button>
        </div>
      </div>
    </div>
  )
}