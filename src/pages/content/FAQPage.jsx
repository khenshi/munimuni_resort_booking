import { useState } from 'react'
import '../../styles/pages/content-pages.css'

const FAQ_GROUPS = [
  {
    label: 'Bookings',
    title: 'Booking questions',
    copy: 'Common questions about reserving a stay, editing dates, and checking availability.',
    items: [
      {
        question: 'How do I confirm a booking?',
        answer:
          'A booking is confirmed once the reservation details are completed and the required payment step is approved. You will receive an on-screen confirmation and booking reference for your records.',
      },
      {
        question: 'Can I change my booking date?',
        answer:
          'Date changes depend on availability and the booking window. If your stay is still editable, update it from your booking record before the cutoff period.',
      },
      {
        question: 'What information do I need before booking?',
        answer:
          'Prepare the guest name, check-in and check-out dates, guest count, and your preferred room or package so you can finish the reservation quickly.',
      },
    ],
  },
  {
    label: 'Payments',
    title: 'Payment questions',
    copy: 'Guidance on accepted payment methods, confirmations, and payment timing.',
    items: [
      {
        question: 'What payment methods are accepted?',
        answer:
          'The resort supports common payment options used throughout the system, including cash settlement, e-wallet transfers, and bank transfer where applicable.',
      },
      {
        question: 'When is payment due?',
        answer:
          'Payment may be due at booking, upon arrival, or before check-in depending on the package rules. The payment confirmation screen shows the current payment status.',
      },
      {
        question: 'Where can I check my payment status?',
        answer:
          'After payment, the confirmation screen shows whether the booking is paid in full or has an outstanding balance.',
      },
    ],
  },
  {
    label: 'Cancellations',
    title: 'Cancellation questions',
    copy: 'What happens if plans change before your stay.',
    items: [
      {
        question: 'How do I cancel a booking?',
        answer:
          'Cancellation is handled through the current booking record or by following the resort support process in your reservation instructions.',
      },
      {
        question: 'Will I be charged for cancelling?',
        answer:
          'Some bookings allow free cancellation before a cutoff time, while others may charge a fee depending on the package or promotional terms.',
      },
      {
        question: 'Can I cancel the same day?',
        answer:
          'Same-day cancellations may be restricted. Review the booking terms, since late cancellations often fall under non-refundable rules.',
      },
    ],
  },
  {
    label: 'Refunds',
    title: 'Refund questions',
    copy: 'Refund timing, eligibility, and how refunds are processed.',
    items: [
      {
        question: 'When is a refund available?',
        answer:
          'Refunds depend on the package terms, cancellation timing, and the payment method used. Approved refunds follow the resort’s refund policy.',
      },
      {
        question: 'How long does a refund take?',
        answer:
          'Processing time depends on the original payment channel. Cash, card, and online transfer refunds can have different release schedules.',
      },
      {
        question: 'How are refunds confirmed?',
        answer:
          'Refunded transactions are handled through the resort support process and confirmed through the original payment channel.',
      },
    ],
  },
]

function AccordionCard({ group }) {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section className="contentInfoCard" aria-label={group.title}>
      <h3>{group.title}</h3>
      <p className="contentPanelCopy">{group.copy}</p>
      <div className="accordionList">
        {group.items.map((item, index) => {
          const isOpen = openIndex === index
          const panelId = `${group.label.toLowerCase()}-faq-${index}`

          return (
            <div className={`accordionItem ${isOpen ? 'isOpen' : ''}`} key={item.question}>
              <button
                type="button"
                className="accordionButton"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? -1 : index)}
              >
                <span className="accordionButtonTitle">{item.question}</span>
                <span className="accordionIcon" aria-hidden="true">{isOpen ? '−' : '+'}</span>
              </button>
              {isOpen ? (
                <div id={panelId} className="accordionPanel">
                  <p>{item.answer}</p>
                </div>
              ) : null}
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default function FAQPage() {
  return (
    <div className="contentPage">
      <main className="contentPageMain">
        <section className="contentPageShell">
          <header className="contentPageHero">
            <div>
              <p className="contentPageKicker">Guest Support</p>
              <h1 className="contentPageTitle">Frequently Asked Questions</h1>
              <p className="contentPageDescription">
                Find quick answers to the most common questions about bookings, payments,
                cancellations, and refunds in a clean, easy-to-scan format.
              </p>
            </div>
            <div className="contentPageBadgeRow" aria-label="FAQ topics">
              {FAQ_GROUPS.map((group) => (
                <span key={group.label} className="contentPageBadge">
                  {group.label}
                </span>
              ))}
            </div>
          </header>

          <div className="contentPageBody">
            <div className="contentSectionGrid">
              {FAQ_GROUPS.slice(0, 2).map((group) => (
                <AccordionCard key={group.label} group={group} />
              ))}
            </div>
            <div className="contentSectionGrid">
              {FAQ_GROUPS.slice(2).map((group) => (
                <AccordionCard key={group.label} group={group} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
