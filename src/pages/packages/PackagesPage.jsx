import { useOutletContext } from 'react-router-dom'
import {
  PackagesInfoSection,
  PackagesOffersSection,
} from '../../components/packages'
import '../../styles/pages/packages-page.css'

export default function PackagesPage() {
  const { activeTab } = useOutletContext()

  return (
    <div className="packagesPage packagesBrowsePage">
      <main className="packagesPageMain">
        <PackagesInfoSection activeTab={activeTab} />
        <PackagesOffersSection activeTab={activeTab} />
      </main>
    </div>
  )
}
