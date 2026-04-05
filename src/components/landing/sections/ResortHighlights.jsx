import { resortHighlights } from '../../../data/landing'

export default function ResortHighlights() {
  return (
    <section className="resortHighlights" id="resort-highlights" aria-label="Resort highlights">
      <div className="resortHighlightsInner">
        <p className="resortHighlightsKicker">At A Glance</p>
        <h2>Small reasons guests love Muni-Muni</h2>

        <div className="resortHighlightsGrid">
          {resortHighlights.map((item) => (
            <article className="resortHighlightCard" key={item.title}>
              <span className="resortHighlightIcon">
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  {item.iconPaths.map((path) => (
                    <path key={path} d={path} />
                  ))}
                </svg>
              </span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}