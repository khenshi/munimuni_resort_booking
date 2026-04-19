import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllTransactions } from '../utils/transactionSchema'
import { CURRENT_CUSTOMER_STORAGE_KEY } from '../components/login/auth-storage'
import ReceiptView from '../components/common/ReceiptView'
import '../styles/pages/payment-history.css'

export default function ReceiptHistory() {
  const navigate = useNavigate()
  const [transactions, setTransactions] = useState([])
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [currentCustomer, setCurrentCustomer] = useState(null)

  useEffect(() => {
    const customer = JSON.parse(localStorage.getItem(CURRENT_CUSTOMER_STORAGE_KEY))
    if (!customer) {
      navigate('/customer/login')
      return
    }
    setCurrentCustomer(customer)

    const allTransactions = getAllTransactions()
    // Filter transactions by current user's email
    const userTransactions = allTransactions.filter(t => t.customerDetails.email === customer.email)
    setTransactions(userTransactions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)))
  }, [navigate])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(amount)
  }

  const handleDeleteReceipt = (transactionId) => {
    if (window.confirm('Are you sure you want to delete this receipt? This action cannot be undone.')) {
      // Get all transactions
      const allTransactions = getAllTransactions()
      // Filter out the transaction to delete
      const updatedTransactions = allTransactions.filter(t => t.transactionId !== transactionId)
      // Save back to localStorage
      localStorage.setItem('munimuni-transactions', JSON.stringify(updatedTransactions))
      // Update state to reflect the change
      setTransactions(updatedTransactions.filter(t => t.customerDetails.email === currentCustomer.email).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)))
    }
  }

  if (selectedTransaction) {
    return (
      <div className="receipt-history-page">
        <div className="container">
          <button onClick={() => setSelectedTransaction(null)} className="back-btn">
            ← Back to History
          </button>
          <ReceiptView transactionObject={selectedTransaction} />
        </div>
      </div>
    )
  }

  return (
    <div className="receipt-history-page">
      <div className="container">
        <button onClick={() => navigate('/customer/dashboard')} className="back-btn">
          ← Back to Dashboard
        </button>
        <h1>Receipt History</h1>

        {transactions.length === 0 ? (
          <div className="no-transactions">
            <p>No transactions found.</p>
            <button onClick={() => navigate('/customer/dashboard')} className="primary-btn">
              Return to Dashboard
            </button>
          </div>
        ) : (
          <div className="transactions-table">
            <div className="table-header">
              <span>Transaction ID</span>
              <span>Date</span>
              <span>Booking ID</span>
              <span>Amount</span>
              <span>Status</span>
              <span>Action</span>
            </div>
            {transactions.map((transaction) => (
              <div key={transaction.transactionId} className="table-row">
                <span>{transaction.transactionId}</span>
                <span>{formatDate(transaction.timestamp)}</span>
                <span>{transaction.bookingId}</span>
                <span>{formatCurrency(transaction.totalAmount)}</span>
                <span className={`status ${transaction.status.toLowerCase()}`}>
                  {transaction.status}
                </span>
                <div className="action-buttons">
                  <button
                    onClick={() => setSelectedTransaction(transaction)}
                    className="view-btn"
                  >
                    View Receipt
                  </button>
                  <button
                    onClick={() => handleDeleteReceipt(transaction.transactionId)}
                    className="delete-btn"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}