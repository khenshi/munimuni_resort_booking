import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/landing/LandingPage'
import BookingPage from './pages/booking/BookingPage'
import PackagesPage from './pages/packages/PackagesPage'
import PackageOfferDetailsPage from './pages/packages/PackageOfferDetailsPage'
import CustomerLoginPage from './pages/customer/CustomerLoginPage'
import CustomerDashboardPage from './pages/customer/CustomerDashboardPage'
import CustomerHistoryPage from './pages/customer/CustomerHistoryPage'
import CustomerEditProfilePage from './pages/customer/CustomerEditProfilePage'
import BookingDetailPage from './pages/booking/BookingDetailPage'
import EditBookingPage from './pages/booking/EditBookingPage'
import ReceiptDetailPage from './pages/customer/ReceiptDetailPage'
import PoliciesAgreementsPage from './pages/content/PoliciesAgreementsPage'
import FAQPage from './pages/content/FAQPage'
import CustomerLayout from './components/login/layout/CustomerLayout'
import PaymentPage from './pages/payment/PaymentPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/customer" element={<CustomerLayout />}>
          <Route path="login" element={<CustomerLoginPage />} />
          <Route path="dashboard" element={<CustomerDashboardPage />} />
          <Route path="profile" element={<CustomerEditProfilePage />} />
          <Route path="history" element={<CustomerHistoryPage />} />
          <Route path="bookings/:bookingId" element={<BookingDetailPage />} />
          <Route path="receipts/detail" element={<ReceiptDetailPage />} />
        </Route>
        <Route path="/customer/bookings/:bookingReference/edit" element={<EditBookingPage />} />
        <Route path="/customer/payment" element={<PaymentPage />} />
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
