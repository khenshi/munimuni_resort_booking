import {
  PaymentBookingSummary,
  PaymentEmptyState,
  PaymentPageShell,
  PaymentPaymentForm,
  PaymentSuccessState,
  usePaymentPageLogic,
} from '../../components/payment'
import '../../styles/components/payment/page.css'
import '../../styles/pages/payment-page.css'

export default function PaymentPage() {
  const {
    checkoutMode,
    bookingData,
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
    goToHome,
    goToPackages,
  } = usePaymentPageLogic()

  if (transactionSummary) {
    return (
      <PaymentPageShell title="Payment Successful">
        <PaymentSuccessState
          transactionSummary={transactionSummary}
          bookingData={bookingData}
          paymentMethod={paymentMethod}
          formatCurrency={formatCurrency}
          onReturnHome={goToHome}
        />
      </PaymentPageShell>
    )
  }

  if (!bookingData) {
    return (
      <PaymentPageShell title="No Booking Selected" onBack={goToPackages}>
        <PaymentEmptyState
          title="No Booking Selected"
          message="Choose a package first so we can prepare your payment summary."
          actionLabel="Go to Packages"
          onAction={goToPackages}
        />
      </PaymentPageShell>
    )
  }

  return (
    <PaymentPageShell title="Complete Your Payment" onBack={goToPackages}>
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
