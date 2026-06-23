import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/landing/LandingPage'
import BookingPage from './pages/booking/BookingPage'
import PackagesPage from './pages/packages/PackagesPage'
import PackageOfferDetailsPage from './pages/packages/PackageOfferDetailsPage'
import PoliciesAgreementsPage from './pages/content/PoliciesAgreementsPage'
import FAQPage from './pages/content/FAQPage'
import PaymentPage from './pages/payment/PaymentPage'
import { PackagesLayout } from './components/packages/packages-list-page'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/packages" element={<PackagesLayout />}>
          <Route index element={<PackagesPage />} />
          <Route path="offers/:offerType/:offerId" element={<PackageOfferDetailsPage />} />
        </Route>
        <Route path="/policies" element={<PoliciesAgreementsPage />} />  
        <Route path="/faq" element={<FAQPage />} />
      </Routes>
    </BrowserRouter>
  )
}
