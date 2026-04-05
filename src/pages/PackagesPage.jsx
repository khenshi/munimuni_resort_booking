import { useState } from 'react'
import {
  PackagesInfoSection,
  PackagesOffersSection,
  PackagesPageHeader,
  readPackagesViewState,
  writePackagesViewState,
} from '../components/packages'
import '../styles/pages/packages-page.css'

export default function PackagesPage() {
  const [activeTab, setActiveTab] = useState(() => readPackagesViewState().activeTab)

  const handleTabChange = (nextTab) => {
    setActiveTab((prevTab) => {
      if (prevTab === nextTab) return prevTab
      writePackagesViewState({ activeTab: nextTab })
      return nextTab
    })
  }

  return (
    <div className="packagesPage packagesBrowsePage">
      <PackagesPageHeader activeTab={activeTab} onTabChange={handleTabChange} />
      <main className="packagesPageMain">
        <PackagesInfoSection activeTab={activeTab} />
        <PackagesOffersSection activeTab={activeTab} />
      </main>
    </div>
  )
}
