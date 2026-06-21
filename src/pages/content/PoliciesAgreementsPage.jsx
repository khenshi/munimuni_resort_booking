import '../../styles/pages/content-pages.css'

const POLICY_GROUPS = [
  {
    label: 'Booking policies',
    title: 'Booking policies',
    items: [
      'Bookings are subject to availability and the selected package terms.',
      'Guest details, dates, and room selections should be reviewed before final confirmation.',
      'Special requests are noted when possible but are not guaranteed unless confirmed by the resort.',
    ],
  },
  {
    label: 'Cancellation and refund policy',
    title: 'Cancellation & refund policy',
    items: [
      'Cancellation eligibility depends on the package type and timing of the request.',
      'Refunds are processed only for qualifying reservations and follow the original payment channel where possible.',
      'Late cancellations, no-shows, and non-refundable packages may not receive a refund.',
    ],
  },
  {
    label: 'Terms and conditions',
    title: 'Terms and conditions',
    items: [
      'Guests agree to comply with resort rules, check-in requirements, and property policies during their stay.',
      'The resort may update package details, service availability, or operating hours when needed for safety or service quality.',
      'Misuse of booking or payment features may lead to cancellation or restricted access to guest services.',
    ],
  },
  {
    label: 'Privacy policy',
    title: 'Privacy policy',
    items: [
      'Guest information is used to manage bookings, billing, communication, and support requests.',
      'Personal data is handled with care and shared only for operational needs, payment processing, or legal compliance.',
      'Guests can expect booking and payment details to remain protected within the resort system.',
    ],
  },
]

export default function PoliciesAgreementsPage() {
  return (
    <div className="contentPage">
      <main className="contentPageMain">
        <section className="contentPageShell">
          <header className="contentPageHero">
            <div>
              <p className="contentPageKicker">Guest Guidelines</p>
              <h1 className="contentPageTitle">Policies & Agreements</h1>
              <p className="contentPageDescription">
                Review the resort&apos;s booking rules, refund conditions, terms, and privacy
                expectations in one consistent reference page.
              </p>
            </div>
            <div className="contentPageBadgeRow" aria-label="Policy sections">
              {POLICY_GROUPS.map((group) => (
                <span key={group.label} className="contentPageBadge">
                  {group.label}
                </span>
              ))}
            </div>
          </header>

          <div className="contentPageBody">
            <div className="contentSectionGrid">
              {POLICY_GROUPS.slice(0, 2).map((group) => (
                <article key={group.label} className="contentInfoCard">
                  <h3>{group.title}</h3>
                  <ul>
                    {group.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
            <div className="contentSectionGrid">
              {POLICY_GROUPS.slice(2).map((group) => (
                <article key={group.label} className="contentInfoCard">
                  <h3>{group.title}</h3>
                  <ul>
                    {group.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
