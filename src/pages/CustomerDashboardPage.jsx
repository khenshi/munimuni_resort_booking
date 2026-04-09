import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import LoginPageHeader from '../components/login/layout/LoginPageHeader'
import { AUTH_CHANGED_EVENT, readCurrentCustomer } from '../components/login/auth-storage'
import PreviousBookingsWidget from '../components/dashboard/PreviousBookingsWidget'
import DigitalConciergeSection from '../components/dashboard/DigitalConciergeSection'

export default function CustomerDashboardPage() {
  const navigate = useNavigate()
  const [currentCustomer, setCurrentCustomer] = useState(() => readCurrentCustomer())

  useEffect(() => {
    const syncCurrentCustomer = () => {
      const nextCustomer = readCurrentCustomer()
      setCurrentCustomer(nextCustomer)

      if (!nextCustomer) {
        navigate('/customer/login', { replace: true })
      }
    }

    window.addEventListener('storage', syncCurrentCustomer)
    window.addEventListener(AUTH_CHANGED_EVENT, syncCurrentCustomer)

    return () => {
      window.removeEventListener('storage', syncCurrentCustomer)
      window.removeEventListener(AUTH_CHANGED_EVENT, syncCurrentCustomer)
    }
  }, [navigate])

  if (!currentCustomer) {
    return <Navigate to="/customer/login" replace />
  }

  return (
    <div>
      <LoginPageHeader />
      <PreviousBookingsWidget />
      <DigitalConciergeSection />
    </div>
  )
}
