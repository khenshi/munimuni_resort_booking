import { Link } from 'react-router-dom'

export default function PackagesPageHeader({ activeTab, onTabChange }) {

  return (
    <header className="packagesPageHeader">
      <div className="packagesPageHeaderInner">
        <Link to="/" className="packagesPageBrand">
          MuniMuni
        </Link>

        <div className="packagesToggleGroup">
          <button
            className={`packagesToggle ${activeTab === 'overnight' ? 'active' : ''}`}
            onClick={() => onTabChange('overnight')}
          >
            Overnight Packages
          </button>
          <button
            className={`packagesToggle ${activeTab === 'daytour' ? 'active' : ''}`}
            onClick={() => onTabChange('daytour')}
          >
            Day Tour Packages
          </button>
          <button
            className={`packagesToggle ${activeTab === 'addons' ? 'active' : ''}`}
            onClick={() => onTabChange('addons')}
          >
            Add Ons
          </button>
        </div>
      </div>
    </header>
  )
}
