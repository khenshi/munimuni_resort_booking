const highlights = [
  {
    title: 'Beachfront Location',
    description: 'Wake up to sea views and a short walk to soft white sand.',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M4 17c1.2 0 1.8-.7 2.5-1.4.7-.7 1.3-1.3 2.5-1.3s1.8.6 2.5 1.3c.7.7 1.3 1.4 2.5 1.4s1.8-.7 2.5-1.4c.7-.7 1.3-1.3 2.5-1.3v2c-.5 0-.8.3-1.4.9-.8.8-1.9 1.8-3.6 1.8s-2.8-1-3.6-1.8c-.6-.6-.9-.9-1.4-.9s-.8.3-1.4.9C6.8 18 5.7 19 4 19v-2z" />
        <path d="M16.5 3.5l.8 1.7 1.7.8-1.7.8-.8 1.7-.8-1.7-1.7-.8 1.7-.8.8-1.7z" />
      </svg>
    ),
  },
  {
    title: 'Relaxed Stays',
    description: 'Comfortable rooms and calm spaces designed for true downtime.',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M4 11h16v7H4v-7zm2 2v3h12v-3H6z" />
        <path d="M7 8h10a2 2 0 0 1 2 2v1H5v-1a2 2 0 0 1 2-2z" />
      </svg>
    ),
  },
  {
    title: 'Sunset Moments',
    description: 'End each day with golden skies and ocean breeze by the shore.',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M12 5a5 5 0 0 0-5 5h10a5 5 0 0 0-5-5z" />
        <path d="M3 14h18v2H3v-2zm8 3h2v3h-2v-3zm-7 3h16v2H4v-2z" />
      </svg>
    ),
  },
]

export default function ResortHighlights() {
  return (
    <section className="resortHighlights" id="highlights" aria-label="Resort highlights">
      <div className="resortHighlightsInner">
        <p className="resortHighlightsKicker">At A Glance</p>
        <h2>Small reasons guests love Muni-Muni</h2>

        <div className="resortHighlightsGrid">
          {highlights.map((item) => (
            <article className="resortHighlightCard" key={item.title}>
              <span className="resortHighlightIcon">{item.icon}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}