import PackagesPageHeader from '../components/packages/PackagesPageHeader'
import PackagesInfoSection from '../components/packages/PackagesInfoSection'
import PackagesOffersSection from '../components/packages/PackagesOffersSection'
import { useState } from 'react'
import '../styles/pages/packages-page.css'

export default function PackagesPage() {
  const [activeTab, setActiveTab] = useState('daytour')

  return (
    <div className="packagesPage">
      <PackagesPageHeader activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="packagesPageMain">
        <PackagesInfoSection activeTab={activeTab} />
        <PackagesOffersSection activeTab={activeTab} />
      </main>
    </div>
  )
}
