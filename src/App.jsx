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
import PoliciesAgreementsPage from './pages/PoliciesAgreementsPage'
import FAQPage from './pages/FAQPage'
import CustomerLayout from './components/login/layout/CustomerLayout'

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
          <Route path="bookings/:bookingReference/edit" element={<EditBookingPage />} />
          <Route path="receipts/:receiptId" element={<ReceiptDetailPage />} />
        </Route>
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
