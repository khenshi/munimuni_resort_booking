import { useEffect, useState } from 'react'
import PackagesPageHeader from '../components/packages/PackagesPageHeader'
import PackagesInfoSection from '../components/packages/PackagesInfoSection'
import PackagesOffersSection from '../components/packages/PackagesOffersSection'
import { readPackagesViewState, writePackagesViewState } from '../components/packages/packages-view-state'
import '../styles/pages/packages-page.css'

export default function PackagesPage() {
  const [activeTab, setActiveTab] = useState(() => readPackagesViewState().activeTab)

  useEffect(() => {
    const currentState = readPackagesViewState()
    writePackagesViewState({
      ...currentState,
      activeTab,
    })
  }, [activeTab])

  return (
    <div className="packagesPage packagesBrowsePage">
      <PackagesPageHeader activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="packagesPageMain">
        <PackagesInfoSection activeTab={activeTab} />
        <PackagesOffersSection activeTab={activeTab} />
      </main>
    </div>
  )
}
