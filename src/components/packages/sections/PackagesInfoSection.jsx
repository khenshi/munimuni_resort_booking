import { useState } from 'react'
import { infoContentByTab } from '../../../data/packages'

export default function PackagesInfoSection({ activeTab }) {
  const content = infoContentByTab[activeTab] ?? infoContentByTab.daytour
  const [isExpanded, setIsExpanded] = useState(false)
  const contentId = 'packages-info-content'

  return (
    <section className="packagesInfoSection" aria-labelledby="packages-info-heading">
      <div className="packagesInfoHeaderRow">
        <div>
          <p className="packagesSectionKicker">Before You Book</p>
          <h2 id="packages-info-heading">{content.heading}</h2>
        </div>
        <button
          type="button"
          className="packagesInfoToggle"
          aria-expanded={isExpanded}
          aria-controls={contentId}
          onClick={() => setIsExpanded((prev) => !prev)}
        >
          {isExpanded ? 'Hide Details' : 'Show Details'}
        </button>
      </div>

      {isExpanded ? (
        <div id={contentId} className="packagesInfoGrid">
          <article className="packagesInfoCard">
            <h3>Reminders</h3>
            <ul>
              {content.reminders.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article className="packagesInfoCard">
            <h3>General Details</h3>
            <ul>
              {content.details.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
      ) : null}
    </section>
  )
}
