import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  calculateBookingCosts,
  createTransaction,
  generateTransactionId,
  saveTransaction,
} from '../utils/transactionSchema'

function roundCurrency(value) {
  return Math.round((Number(value) || 0) * 100) / 100
}

function formatCurrency(value) {
  const safeValue = roundCurrency(value)
  return `PHP ${safeValue.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

function generateBookingReference(selectedOffer) {
  const offerTypePrefix = (selectedOffer?.offerType ?? 'gen').slice(0, 3).toUpperCase()
  const randomCode = Math.floor(1000 + Math.random() * 9000)
  const dateCode = new Date().toISOString().slice(2, 10).replace(/-/g, '')

  return `MMR-${offerTypePrefix}-${dateCode}-${randomCode}`
}

function calculateBookingFinancials(booking) {
  const fallbackCost = calculateBookingCosts(booking)
  const itemizedCosts = booking.itemizedCosts ?? fallbackCost.itemizedCosts
  const totalAmount = roundCurrency(
    Number(booking.totalAmount)
      || Number(itemizedCosts?.room || 0) + Number(itemizedCosts?.rentals || 0)
      || fallbackCost.totalAmount,
  )

  return {
    itemizedCosts,
    totalAmount,
    amountPaid: 0,
    outstandingBalance: totalAmount,
  }
}

export default function usePaymentPageLogic() {
  const location = useLocation()
  const navigate = useNavigate()
  const [checkoutMode, setCheckoutMode] = useState('')
  const [bookingData, setBookingData] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState('Credit Card')
  const [paymentOption, setPaymentOption] = useState('full')
  const [isProcessing, setIsProcessing] = useState(false)
  const [transactionSummary, setTransactionSummary] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const routeState = location.state ?? {}
    const draft = routeState.bookingDraft && typeof routeState.bookingDraft === 'object'
      ? routeState.bookingDraft
      : null

    const isNewBookingDraft = Boolean(draft && draft.bookingReference == null)

    if ((routeState.source === 'booking-checkout' || isNewBookingDraft) && draft) {
      const draftFinancials = calculateBookingFinancials(draft)
      setCheckoutMode('new')
      setBookingData({
        ...draft,
        ...draftFinancials,
      })
    }
  }, [location.state])

  const totalAmount = Number(bookingData?.totalAmount) || 0

  const paymentAmount = useMemo(() => {
    if (!bookingData) return 0
    if (paymentOption === 'downpayment') return roundCurrency(totalAmount / 2)
    return totalAmount
  }, [bookingData, paymentOption, totalAmount])

  const remainingBalanceAfterPayment = useMemo(() => {
    if (!bookingData) return 0
    return roundCurrency(Math.max(0, totalAmount - paymentAmount))
  }, [bookingData, paymentAmount, totalAmount])

  const handlePayment = async () => {
    if (!bookingData) return

    setErrorMessage('')
    setIsProcessing(true)

    try {
      await new Promise((resolve) => {
        window.setTimeout(resolve, 1400)
      })

      const reference = generateBookingReference(bookingData.selectedOffer)
      const paymentStatus = remainingBalanceAfterPayment > 0 ? 'Partially Paid' : 'Paid'
      const bookingStatus = remainingBalanceAfterPayment > 0 ? 'Confirmed' : 'Paid'
      const bookingPayload = {
        ...bookingData,
        bookingReference: reference,
        amountPaid: paymentAmount,
        outstandingBalance: remainingBalanceAfterPayment,
        paymentMode: paymentOption,
        paymentStatus,
        status: bookingStatus,
      }

      saveTransaction(createTransaction({
        transactionId: generateTransactionId(),
        bookingId: reference,
        guestDetails: {
          name: bookingPayload.fullName,
          email: bookingPayload.email,
          phone: bookingPayload.phone || '',
        },
        itemizedCosts: bookingPayload.itemizedCosts,
        paymentMethod,
        totalAmount: bookingPayload.totalAmount,
        amountPaid: paymentAmount,
        amountDue: remainingBalanceAfterPayment,
        paymentType: paymentOption,
        status: 'completed',
      }))

      setBookingData(bookingPayload)
      setTransactionSummary({
        bookingReference: reference,
        paymentType: paymentOption,
        amountPaid: paymentAmount,
        outstandingBalance: remainingBalanceAfterPayment,
        totalAmount,
      })
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Payment failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  return {
    checkoutMode,
    bookingData,
    payableBookings: [],
    paymentMethod,
    setPaymentMethod,
    paymentOption,
    setPaymentOption,
    isProcessing,
    transactionSummary,
    errorMessage,
    totalAmount,
    paymentAmount,
    remainingBalanceAfterPayment,
    formatCurrency,
    handlePayment,
    goToHome: () => navigate('/'),
    goToPackages: () => navigate('/packages'),
  }
}
