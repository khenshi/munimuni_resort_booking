import { Link } from 'react-router-dom'
import '../../styles/components/dashboard/dashboard-widgets.css'

const conciergeCards = [
  {
    id: 'property-map',
    title: 'Property Map',
    description: 'Quick access to resort paths, cottages, and activity zones.',
    to: '/property-map',
  },
  {
    id: 'shuttle-schedules',
    title: 'Shuttle Schedules',
    description: 'See updated transport times for arrival and departure.',
    to: '/shuttle-schedules',
  },
  {
    id: 'restaurant-hours',
    title: 'Restaurant Hours',
    description: 'Browse meal service times for all dining spots on property.',
    to: '/restaurant-hours',
  },
  {
    id: 'support-contacts',
    title: 'Support & Social',
    description: 'Reach guest services, emergency support, and social channels.',
    to: '/support',
  },
]

export default function DigitalConciergeSection() {
  return (
    <section className="dashboardCard dashboardConciergeCard" aria-labelledby="digital-concierge-heading">
      <div className="dashboardCardHeader">
        <div>
          <p className="dashboardKicker">Digital Concierge</p>
          <h2 id="digital-concierge-heading">On-Property Mode</h2>
        </div>
      </div>

      <div className="dashboardCardsGrid">
        {conciergeCards.map((item) => (
          <Link key={item.id} to={item.to} className="conciergeCard">
            <div>
              <p className="conciergeCardLabel">{item.title}</p>
              <p className="conciergeCardDescription">{item.description}</p>
            </div>
            <span className="conciergeCardAction">Open</span>
          </Link>
        ))}
      </div>
    </section>
  )
}
