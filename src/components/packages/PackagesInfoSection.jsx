import { infoContentByTab } from './data'

export default function PackagesInfoSection({ activeTab }) {
  const content = infoContentByTab[activeTab] ?? infoContentByTab.daytour

  return (
    <section className="packagesInfoSection" aria-labelledby="packages-info-heading">
      <p className="packagesSectionKicker">Before You Book</p>
      <h2 id="packages-info-heading">{content.heading}</h2>

      <div className="packagesInfoGrid">
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
    </section>
  )
}
