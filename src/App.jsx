import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import BookingPage from './pages/BookingPage'
import PackagesPage from './pages/PackagesPage'
import PackageOfferDetailsPage from './pages/PackageOfferDetailsPage'
import CustomerLoginPage from './pages/CustomerLoginPage'
import CustomerDashboardPage from './pages/CustomerDashboardPage'
import CustomerHistoryPage from './pages/CustomerHistoryPage'
import CustomerEditProfilePage from './pages/CustomerEditProfilePage'
import BookingDetailPage from './pages/BookingDetailPage'
import EditBookingPage from './pages/EditBookingPage'
import ReceiptDetailPage from './pages/ReceiptDetailPage'
<<<<<<< HEAD
import PoliciesAgreementsPage from './pages/PoliciesAgreementsPage'
import FAQPage from './pages/FAQPage'
import CustomerLayout from './components/login/layout/CustomerLayout'
=======
import PaymentPage from './pages/PaymentPage'
import ReceiptHistory from './pages/ReceiptHistory'
>>>>>>> origin/jb-wasted-effort

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
<<<<<<< HEAD
        <Route path="/customer" element={<CustomerLayout />}>
          <Route path="login" element={<CustomerLoginPage />} />
          <Route path="dashboard" element={<CustomerDashboardPage />} />
          <Route path="profile" element={<CustomerEditProfilePage />} />
          <Route path="history" element={<CustomerHistoryPage />} />
          <Route path="bookings/:bookingId" element={<BookingDetailPage />} />
          <Route path="bookings/:bookingReference/edit" element={<EditBookingPage />} />
          <Route path="receipts/:receiptId" element={<ReceiptDetailPage />} />
        </Route>
=======
        <Route path="/customer/login" element={<CustomerLoginPage />} />
        <Route path="/customer/dashboard" element={<CustomerDashboardPage />} />
        <Route path="/customer/history" element={<CustomerHistoryPage />} />
        <Route path="/customer/bookings/:bookingId" element={<BookingDetailPage />} />
        <Route path="/customer/receipts/:receiptId" element={<ReceiptDetailPage />} />
        <Route path="/customer/payment" element={<PaymentPage />} />
        <Route path="/customer/receipt-history" element={<ReceiptHistory />} />
>>>>>>> origin/jb-wasted-effort
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/packages">
          <Route index element={<PackagesPage />} />
          <Route path="offers/:offerType/:offerId" element={<PackageOfferDetailsPage />} />
        </Route>
        <Route path="/policies" element={<PoliciesAgreementsPage />} />  
        <Route path="/faq" element={<FAQPage />} />
      </Routes>
    </BrowserRouter>
  )
}
