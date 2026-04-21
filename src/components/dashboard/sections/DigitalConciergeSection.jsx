import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motorcycleRentalDetails } from '../../../data/motor-rent'
import { filipinoMenu } from '../../../data/resto-food'
import '../../../styles/components/dashboard/dashboard-widgets.css'

const conciergeCards = [
  {
    id: 'motorcycling-renting',
    title: 'Motorcycle Rental',
    description: 'Rent motorcycles for exploring the island.',
    details: motorcycleRentalDetails,
  },
  {
    id: 'restaurant-hours',
    title: 'Restaurant Hours & Menu',
    description: 'Browse meal service times and our Filipino-themed menu.',
    menu: filipinoMenu,
  },
]

export default function DigitalConciergeSection() {
  const [expandedCard, setExpandedCard] = useState(null)

  const toggleCard = (cardId) => {
    setExpandedCard(expandedCard === cardId ? null : cardId)
  }

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
          <div key={item.id} className="conciergeCardWrapper">
            <button
              className="conciergeCard"
              onClick={() => toggleCard(item.id)}
              aria-expanded={expandedCard === item.id}
              aria-controls={`${item.id}-details`}
            >
              <div>
                <p className="conciergeCardLabel">{item.title}</p>
                <p className="conciergeCardDescription">{item.description}</p>
              </div>
              <span className="conciergeCardAction">
                {expandedCard === item.id ? 'Close' : 'Open'}
              </span>
            </button>

            {expandedCard === item.id && (
              <div id={`${item.id}-details`} className="conciergeCardDetails">
                {item.details && (
                  <div className="conciergeDetailsContent">
                    <p><strong>Provider:</strong> {item.details.provider}</p>
                    <p><strong>Contact:</strong> <a href={`tel:${item.details.contactNumber}`}>{item.details.contactNumber}</a></p>
                    <p><strong>Pricing:</strong> {item.details.pricingPolicy}</p>
                    <p><strong>Book Online:</strong> <a href={item.details.bookingLink} target="_blank" rel="noopener noreferrer">Facebook Page</a></p>
                  </div>
                )}
                {item.menu && (
                  <div className="conciergeMenuContent">
                    <h3>Restaurant Menu</h3>
                    <div className="menuSection">
                      <h4>Day Tour Packages</h4>
                      <div className="menuCategory">
                        <h5>Lunch: 11:00 AM - 1:00 PM</h5>
                        <ul>
                          {item.menu.dayTour.lunch.map((dish, index) => (
                            <li key={index}>{dish}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="menuCategory">
                        <h5>Snacks: 2:00 PM - 4:00 PM</h5>
                        <ul>
                          {item.menu.dayTour.snacks.map((dish, index) => (
                            <li key={index}>{dish}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="menuSection">
                      <h4>Night Tour Packages</h4>
                      <div className="menuCategory">
                        <h5>Breakfast: 6:00 AM - 8:00 AM</h5>
                        <ul>
                          {item.menu.nightTour.breakfast.map((dish, index) => (
                            <li key={index}>{dish}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="menuCategory">
                        <h5>Lunch: 11:00 AM - 1:00 PM</h5>
                        <ul>
                          {item.menu.nightTour.lunch.map((dish, index) => (
                            <li key={index}>{dish}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="menuCategory">
                        <h5>Snacks: 2:00 PM - 4:00 PM</h5>
                        <ul>
                          {item.menu.nightTour.snacks.map((dish, index) => (
                            <li key={index}>{dish}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="menuCategory">
                        <h5>Dinner: 6:00 PM - 8:00 PM</h5>
                        <ul>
                          {item.menu.nightTour.dinner.map((dish, index) => (
                            <li key={index}>{dish}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
