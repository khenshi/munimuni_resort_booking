import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import BookingPage from './pages/BookingPage'
import PackagesPage from './pages/PackagesPage'
import './styles/hero.css'
import './styles/topnav.css'
import './styles/booking-header.css'
import './styles/packages-header.css'
import './styles/resort-highlights.css'
import './styles/resort.css'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/packages" element={<PackagesPage />} />
      </Routes>
    </BrowserRouter>
  )
}
