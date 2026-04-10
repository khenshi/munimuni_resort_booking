import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import BookingPage from './pages/BookingPage'
import PackagesPage from './pages/PackagesPage'
import PackageOfferDetailsPage from './pages/PackageOfferDetailsPage'
import CustomerLoginPage from './pages/CustomerLoginPage'
import CustomerDashboardPage from './pages/CustomerDashboardPage'
import CustomerHistoryPage from './pages/CustomerHistoryPage'
import BookingDetailPage from './pages/BookingDetailPage'
import ReceiptDetailPage from './pages/ReceiptDetailPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/customer/login" element={<CustomerLoginPage />} />
        <Route path="/customer/dashboard" element={<CustomerDashboardPage />} />
        <Route path="/customer/history" element={<CustomerHistoryPage />} />
        <Route path="/customer/bookings/:bookingId" element={<BookingDetailPage />} />
        <Route path="/customer/receipts/:receiptId" element={<ReceiptDetailPage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/packages">
          <Route index element={<PackagesPage />} />
          <Route path="offers/:offerType/:offerId" element={<PackageOfferDetailsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
