

import '../../styles/components/dashboard/dashboard-widgets.css';

export default function DigitalConciergePanel() {
  const mapLink = 'https://maps.app.goo.gl/Ukzys2Q58NGMzrad7';
  const mapQuery = 'MuniMuni Beach Resort Samal, Brgy, Tagbay, Samal, 8119 Davao del Norte';
  const mapEmbedUrl = `https://www.google.com/maps?output=embed&q=${encodeURIComponent(mapQuery)}`;

  return (
    <section className="dashboardCard dashboardConciergeCard" aria-labelledby="digital-concierge-panel-heading">
      <div className="dashboardCardHeader">
        <div>
          <p className="dashboardKicker">Digital Concierge</p>
          <h2 id="digital-concierge-panel-heading" style={{ fontSize: 'clamp(20px, 2vw, 26px)', margin: 0 }}>Contact & Location</h2>
        </div>
      </div>
      <div style={{ borderRadius: 18, overflow: 'hidden', border: '1px solid rgba(15,23,42,0.08)', marginBottom: 18, background: '#fff', boxShadow: '0 8px 24px rgba(16,38,74,0.08)' }}>
        <iframe
          title="MuniMuni Beach Resort map"
          src={mapEmbedUrl}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          style={{ width: '100%', height: 220, border: 0, display: 'block', borderRadius: 0 }}
        />
      </div>
      <div style={{ borderRadius: 16, background: '#f8fafc', border: '1px solid rgba(15,23,42,0.08)', padding: 18, marginBottom: 0 }}>
        <h4 style={{ margin: '0 0 12px', color: '#102a43', fontSize: 16, fontWeight: 700 }}>Contact Information</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: '#334155' }}>
            <div>
              <span style={{ fontWeight: 600, color: '#102a43' }}>Location:</span> <br />
              MuniMuni Beach Resort Samal, Brgy. Tagbay, Samal, 8119 Davao del Norte<br />
              <a href={mapLink} target="_blank" rel="noreferrer" style={{ color: '#0f4cbd', fontWeight: 600, fontSize: 14 }}>Open in Maps</a>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: '#334155' }}>
            <div>
              <span style={{ fontWeight: 600, color: '#102a43' }}>Phone:</span> <br />
              <a href="tel:+639171234567" style={{ color: '#0f4cbd', fontWeight: 600, fontSize: 14 }}>+63 917 123 4567</a>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: '#334155' }}>
            <div>
              <span style={{ fontWeight: 600, color: '#102a43' }}>Email:</span> <br />
              <a href="mailto:munimunibeachresort@gmail.com" style={{ color: '#0f4cbd', fontWeight: 600, fontSize: 14 }}>munimunibeachresort@gmail.com</a>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: '#334155' }}>
            <div>
              <span style={{ fontWeight: 600, color: '#102a43' }}>Social Media:</span> <br />
              <a href="https://www.facebook.com" target="_blank" rel="noreferrer" style={{ color: '#0f4cbd', fontWeight: 600, fontSize: 14, marginRight: 8 }}>Facebook</a>
              <a href="https://www.instagram.com" target="_blank" rel="noreferrer" style={{ color: '#0f4cbd', fontWeight: 600, fontSize: 14 }}>Instagram</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
