import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  setCustomerOutstandingBalance,
  readCurrentCustomer,
} from '../../login/auth-storage'
import {
  addCustomerBooking,
  getCustomerBookingList,
  updateCustomerBooking,
} from '../../login/bookings-storage'
import {
  calculateBookingCosts,
  createTransaction,
  generateTransactionId,
  saveTransaction,
} from '../utils/transactionSchema'

const PAYMENT_DRAFT_STORAGE_KEY = 'munimuni-payment-draft'

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

function getStoredDraft() {
  try {
    const parsed = JSON.parse(window.sessionStorage.getItem(PAYMENT_DRAFT_STORAGE_KEY) ?? 'null')
    return parsed && typeof parsed === 'object' ? parsed : null
  } catch {
    return null
  }
}

function calculateBookingFinancials(booking) {
  const fallbackCost = calculateBookingCosts(booking)
  const itemizedCosts = booking.itemizedCosts ?? fallbackCost.itemizedCosts
  const totalAmount = roundCurrency(
    Number(booking.totalAmount)
      || Number(itemizedCosts?.room || 0) + Number(itemizedCosts?.addOns || 0) + Number(itemizedCosts?.rentals || 0)
      || fallbackCost.totalAmount,
  )
  const amountPaid = roundCurrency(
    Number(booking.amountPaid)
      || (String(booking.paymentStatus).toLowerCase() === 'paid' || String(booking.status).toLowerCase() === 'paid'
        ? totalAmount
        : 0),
  )
  const outstandingBalance = roundCurrency(
    Number(booking.outstandingBalance) || Math.max(0, totalAmount - amountPaid),
  )

  return {
    itemizedCosts,
    totalAmount,
    amountPaid,
    outstandingBalance,
  }
}

export default function usePaymentPageLogic() {
  const location = useLocation()
  const navigate = useNavigate()
  const [currentCustomer, setCurrentCustomer] = useState(null)
  const [checkoutMode, setCheckoutMode] = useState('')
  const [bookingData, setBookingData] = useState(null)
  const [payableBookings, setPayableBookings] = useState([])
  const [paymentMethod, setPaymentMethod] = useState('Credit Card')
  const [paymentOption, setPaymentOption] = useState('full')
  const [isProcessing, setIsProcessing] = useState(false)
  const [transactionSummary, setTransactionSummary] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const customer = readCurrentCustomer()
    if (!customer) {
      navigate('/customer/login')
      return
    }
    setCurrentCustomer(customer)

    const routeState = location.state ?? {}
    const routeDraft = routeState.bookingDraft && typeof routeState.bookingDraft === 'object'
      ? routeState.bookingDraft
      : null

    if (routeDraft) {
      window.sessionStorage.setItem(PAYMENT_DRAFT_STORAGE_KEY, JSON.stringify(routeDraft))
    }

    const draft = routeDraft ?? getStoredDraft()

    const isNewBookingDraft = Boolean(draft && draft.bookingReference == null)

    if ((routeState.source === 'booking-checkout' || isNewBookingDraft) && draft) {
      const draftFinancials = calculateBookingFinancials(draft)
      setCheckoutMode('new')
      setBookingData({
        ...draft,
        ...draftFinancials,
      })
      return
    }

    const allBookings = getCustomerBookingList(customer.id)
    const mappedPayableBookings = allBookings
      .map((booking) => {
        const financials = calculateBookingFinancials(booking)
        return {
          ...booking,
          ...financials,
        }
      })
      .filter((booking) => booking.outstandingBalance > 0)

    setPayableBookings(mappedPayableBookings)

    const bookingReference = routeState.bookingReference
    if (bookingReference) {
      const matchedBooking = mappedPayableBookings.find(
        (booking) => booking.bookingReference === bookingReference,
      )
      if (matchedBooking) {
        setCheckoutMode('existing')
        setBookingData(matchedBooking)
      }
      return
    }

    if (mappedPayableBookings.length === 1) {
      setCheckoutMode('existing')
      setBookingData(mappedPayableBookings[0])
    }
  }, [location.state, navigate])

  const totalAmount = Number(bookingData?.totalAmount) || 0
  const outstandingBalance = Number(bookingData?.outstandingBalance) || 0

  const paymentAmount = useMemo(() => {
    if (!bookingData) return 0

    if (checkoutMode === 'existing') {
      return outstandingBalance
    }

    if (paymentOption === 'downpayment') {
      return roundCurrency(totalAmount / 2)
    }

    return totalAmount
  }, [bookingData, checkoutMode, paymentOption, outstandingBalance, totalAmount])

  const remainingBalanceAfterPayment = useMemo(() => {
    if (!bookingData) return 0

    if (checkoutMode === 'existing') {
      return 0
    }

    return roundCurrency(Math.max(0, totalAmount - paymentAmount))
  }, [bookingData, checkoutMode, paymentAmount, totalAmount])

  const syncOutstandingBalance = (customerId) => {
    const nextBookings = getCustomerBookingList(customerId)
    const nextOutstanding = nextBookings.reduce((total, booking) => {
      const { outstandingBalance: normalizedOutstanding } = calculateBookingFinancials(booking)
      return total + normalizedOutstanding
    }, 0)

    setCustomerOutstandingBalance(customerId, nextOutstanding)
  }

  const handlePayment = async () => {
    if (!bookingData || !currentCustomer) return

    setErrorMessage('')
    setIsProcessing(true)

    try {
      await new Promise((resolve) => {
        window.setTimeout(resolve, 1400)
      })

      if (checkoutMode === 'new') {
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

        addCustomerBooking(currentCustomer.id, bookingPayload)

        saveTransaction(createTransaction({
          transactionId: generateTransactionId(),
          bookingId: reference,
          customerDetails: {
            name: currentCustomer.fullName,
            email: currentCustomer.email,
            phone: currentCustomer.phone || '',
          },
          itemizedCosts: bookingPayload.itemizedCosts,
          paymentMethod,
          totalAmount: bookingPayload.totalAmount,
          amountPaid: paymentAmount,
          amountDue: remainingBalanceAfterPayment,
          paymentType: paymentOption,
          status: 'completed',
        }))

        syncOutstandingBalance(currentCustomer.id)
        window.sessionStorage.removeItem(PAYMENT_DRAFT_STORAGE_KEY)

        setTransactionSummary({
          bookingReference: reference,
          paymentType: paymentOption,
          amountPaid: paymentAmount,
          outstandingBalance: remainingBalanceAfterPayment,
          totalAmount,
        })
      } else {
        const safeReference = bookingData.bookingReference
        const nextAmountPaid = roundCurrency((Number(bookingData.amountPaid) || 0) + paymentAmount)

        const updated = updateCustomerBooking(currentCustomer.id, safeReference, {
          amountPaid: nextAmountPaid,
          outstandingBalance: 0,
          paymentMode: 'balance',
          paymentStatus: 'Paid',
          status: 'Paid',
        })

        if (!updated) {
          throw new Error('Unable to update booking payment status.')
        }

        saveTransaction(createTransaction({
          transactionId: generateTransactionId(),
          bookingId: safeReference,
          customerDetails: {
            name: currentCustomer.fullName,
            email: currentCustomer.email,
            phone: currentCustomer.phone || '',
          },
          itemizedCosts: bookingData.itemizedCosts,
          paymentMethod,
          totalAmount,
          amountPaid: paymentAmount,
          amountDue: 0,
          paymentType: 'balance',
          status: 'completed',
        }))

        syncOutstandingBalance(currentCustomer.id)

        setTransactionSummary({
          bookingReference: safeReference,
          paymentType: 'balance',
          amountPaid: paymentAmount,
          outstandingBalance: 0,
          totalAmount,
        })
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Payment failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSelectBooking = (booking) => {
    setCheckoutMode('existing')
    setBookingData(booking)
  }

  return {
    currentCustomer,
    checkoutMode,
    bookingData,
    payableBookings,
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
    handleSelectBooking,
    goToDashboard: () => navigate('/customer/dashboard'),
    goToPackages: () => navigate('/packages'),
    goToHistory: () => navigate('/customer/history?tab=bookings'),
    goToLogin: () => navigate('/customer/login'),
  }
}
