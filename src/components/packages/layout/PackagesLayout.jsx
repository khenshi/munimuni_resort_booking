import { useState } from 'react'
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'
import PackagesPageHeader from './PackagesPageHeader'
import { readPackagesViewState, writePackagesViewState } from '../state/packages-view-state'
import { tabByType } from '../details'

export default function PackagesLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { offerType } = useParams()
  const detailTab = tabByType[offerType] ?? null
  const [activeTab, setActiveTab] = useState(() => readPackagesViewState().activeTab)

  const headerActiveTab = detailTab ?? activeTab

  const handleTabChange = (nextTab) => {
    if (activeTab !== nextTab) {
      setActiveTab(nextTab)
      writePackagesViewState({ activeTab: nextTab })
    }

    if (location.pathname.startsWith('/packages/offers/')) {
      navigate('/packages')
    }
  }

  return (
    <div className="packagesPage">
      <PackagesPageHeader activeTab={headerActiveTab} onTabChange={handleTabChange} />
      <Outlet context={{ activeTab: headerActiveTab, onTabChange: handleTabChange }} />
    </div>
  )
}