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
  // State to track which card is expanded and which menu tab is active
  const [expandedCard, setExpandedCard] = useState(null)
  const [menuTab, setMenuTab] = useState('dayTour')

  // Toggle function to expand/collapse cards
  const toggleCard = (cardId) => {
    setExpandedCard(expandedCard === cardId ? null : cardId)
  }

  return (
    <section className="dashboardCard dashboardConciergeCard" aria-labelledby="digital-concierge-heading">
      <div className="dashboardCardHeader">
        <div>
          <p className="dashboardKicker">Offers</p>
          <h2 id="digital-concierge-heading">On-Property Mode</h2>
        </div>
      </div>

      {/* Concierge Cards Grid */}
      <div className="dashboardCardsGrid">
        {conciergeCards.map((item) => (
          <div key={item.id} className={`conciergeCardWrapper ${expandedCard === item.id ? 'is-expanded' : ''}`}>
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

            {/* Expanded details section, conditionally rendered based on state */}
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
                    <div className="menuHeader">
                      <h3>Restaurant Menu</h3>
                      <div className="menuTabs">
                        <button 
                          className={`menuTabBtn ${menuTab === 'dayTour' ? 'isActive' : ''}`}
                          onClick={() => setMenuTab('dayTour')}
                        >
                          Day Tour
                        </button>
                        <button 
                          className={`menuTabBtn ${menuTab === 'nightTour' ? 'isActive' : ''}`}
                          onClick={() => setMenuTab('nightTour')}
                        >
                          Night Tour
                        </button>
                      </div>
                    </div>
                    
                    <div className="menuPackage">
                      <div className="menuCategories">
                        {Object.entries(item.menu[menuTab]).map(([time, dishes]) => (
                          <div key={time} className="menuCategory">
                            <h5>
                              {time === 'breakfast' && 'Breakfast: 6:00 AM - 8:00 AM'}
                              {time === 'lunch' && 'Lunch: 11:00 AM - 1:00 PM'}
                              {time === 'snacks' && 'Snacks: 2:00 PM - 4:00 PM'}
                              {time === 'dinner' && 'Dinner: 6:00 PM - 8:00 PM'}
                            </h5>
                            <div className="menuItemsList">
                              {dishes.map((dish, index) => {
                                const parts = dish.split(' - ')
                                return (
                                  <div key={index} className="menuItem">
                                    <div className="menuItemMain">
                                      <span className="menuItemName">{parts[0]}</span>
                                      {parts[2] && <span className="menuItemPrice">{parts[2].replace('Priced at ', '').replace(' per serving', '')}</span>}
                                    </div>
                                    {parts[1] && <p className="menuItemDesc">{parts[1]}</p>}
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        ))}
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
