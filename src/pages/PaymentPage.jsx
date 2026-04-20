import {
  PaymentBookingSelection,
  PaymentBookingSummary,
  PaymentEmptyState,
  PaymentPageShell,
  PaymentPaymentForm,
  PaymentSuccessState,
  usePaymentPageLogic,
} from '../components/payment'
import '../styles/components/payment/page.css'
import '../styles/pages/payment-page.css'

export default function PaymentPage() {
  const {
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
    goToDashboard,
    goToPackages,
    goToHistory,
  } = usePaymentPageLogic()

  if (transactionSummary) {
    return (
      <PaymentPageShell title="Payment Successful">
        <PaymentSuccessState
          transactionSummary={transactionSummary}
          bookingData={bookingData}
          paymentMethod={paymentMethod}
          formatCurrency={formatCurrency}
          onReturnToDashboard={goToDashboard}
          onViewHistory={goToHistory}
        />
      </PaymentPageShell>
    )
  }

  if (!bookingData) {
    if (payableBookings.length === 0) {
      return (
        <PaymentPageShell title="No Pending Payments" onBack={goToDashboard}>
          <PaymentEmptyState
            title="No Pending Payments"
            message="No pending payments or bookings as of this moment."
            actionLabel="Go to Booking Page"
            onAction={goToPackages}
          />
        </PaymentPageShell>
      )
    }

    return (
      <PaymentPageShell title="Select Booking to Pay" onBack={goToDashboard}>
        <PaymentBookingSelection
          payableBookings={payableBookings}
          onSelectBooking={handleSelectBooking}
          formatCurrency={formatCurrency}
        />
      </PaymentPageShell>
    )
  }

  return (
    <PaymentPageShell title="Complete Your Payment" onBack={goToDashboard}>
      <PaymentBookingSummary
        bookingData={bookingData}
        totalAmount={totalAmount}
        formatCurrency={formatCurrency}
      />

      <PaymentPaymentForm
        checkoutMode={checkoutMode}
        paymentOption={paymentOption}
        setPaymentOption={setPaymentOption}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        paymentAmount={paymentAmount}
        remainingBalanceAfterPayment={remainingBalanceAfterPayment}
        errorMessage={errorMessage}
        isProcessing={isProcessing}
        onSubmit={handlePayment}
        formatCurrency={formatCurrency}
      />
    </PaymentPageShell>
  )
}
