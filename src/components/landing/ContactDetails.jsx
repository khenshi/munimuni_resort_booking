export default function ContactDetails() {
  const mapLink = 'https://maps.app.goo.gl/Ukzys2Q58NGMzrad7'
  const mapQuery = 'MuniMuni Beach Resort Samal, Brgy, Tagbay, Samal, 8119 Davao del Norte'
  const mapEmbedUrl = `https://www.google.com/maps?output=embed&q=${encodeURIComponent(mapQuery)}`

  return (
    <section className="locationSection" id="resort-contact">
      <div className="locationInner">
        <header className="locationHeader">
          <p className="locationKicker">Find Us</p>
          <h2 className="locationTitle">Contact and Location Details</h2>
          <p className="locationLead">
            MuniMuni Beach Resort is tucked along a quiet coastal area with convenient access from the main highway.
          </p>
        </header>

        <div className="locationSplit">
          <div className="locationDetailsCol">
            <article className="locationCard locationInfoCard">
              <h3>Contact Information</h3>
              <p>Reach us through any of the channels below for reservations, inquiries, and updates.</p>

              <div className="contactInfoGrid">
                <article className="contactInfoItem">
                  <span className="contactIcon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" role="presentation">
                      <path d="M12 21s-6-5.2-6-10a6 6 0 1 1 12 0c0 4.8-6 10-6 10Z" stroke="currentColor" strokeWidth="1.8" />
                      <circle cx="12" cy="11" r="2.4" stroke="currentColor" strokeWidth="1.8" />
                    </svg>
                  </span>
                  <h4>Location</h4>
                  <p>MuniMuni Beach Resort Samal, Brgy. Tagbay, Samal, 8119 Davao del Norte</p>
                  <a href={mapLink} target="_blank" rel="noreferrer">
                    Open in Maps
                  </a>
                </article>

                <article className="contactInfoItem">
                  <span className="contactIcon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" role="presentation">
                      <path d="M6.7 4h3.1l1.4 3.3-1.8 1.7a14 14 0 0 0 5.8 5.8l1.7-1.8 3.3 1.4v3.1a2 2 0 0 1-2.2 2 15.8 15.8 0 0 1-14.5-14.5A2 2 0 0 1 6.7 4Z" stroke="currentColor" strokeWidth="1.8" />
                    </svg>
                  </span>
                  <h4>Phone</h4>
                  <p>For reservations and inquiries, call us at:</p>
                  <a href="tel:+639171234567">+63 917 123 4567</a>
                </article>

                <article className="contactInfoItem">
                  <span className="contactIcon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" role="presentation">
                      <rect x="3.5" y="5" width="17" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" />
                      <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.8" />
                    </svg>
                  </span>
                  <h4>Email</h4>
                  <p>Reach us anytime via email:</p>
                  <a href="mailto:munimunibeachresort@gmail.com">munimunibeachresort@gmail.com</a>
                </article>

                <article className="contactInfoItem">
                  <span className="contactIcon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" role="presentation">
                      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.8" />
                      <path d="M8.5 13.5c1.2 1.2 2.4 1.8 3.5 1.8 1.1 0 2.3-.6 3.5-1.8M9 10.2h.01M15 10.2h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                  </span>
                  <h4>Social Media</h4>
                  <p>Follow us for updates, promos, and resort highlights:</p>
                  <div className="locationSocialLinks">
                    <a href="https://www.facebook.com" target="_blank" rel="noreferrer">
                      Facebook
                    </a>
                    <a href="https://www.instagram.com" target="_blank" rel="noreferrer">
                      Instagram
                    </a>
                  </div>
                </article>
              </div>
            </article>
          </div>

          <article className="locationCard locationMapCard">
            <h3>Map</h3>
            <p>Preview the exact location below and tap the map to open navigation.</p>
            <div className="locationMapEmbed">
              <iframe
                title="MuniMuni Beach Resort map"
                src={mapEmbedUrl}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
