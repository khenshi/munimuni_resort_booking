import '../../../styles/components/dashboard/digital-concierge-panel.css';

export default function DigitalConciergePanel() {
  const mapLink = 'https://maps.app.goo.gl/Ukzys2Q58NGMzrad7';
  const mapQuery = 'MuniMuni Beach Resort Samal, Brgy, Tagbay, Samal, 8119 Davao del Norte';
  const mapEmbedUrl = `https://www.google.com/maps?output=embed&q=${encodeURIComponent(mapQuery)}`;

  return (
    <section className="dashboardCard dashboardConciergeCard" aria-labelledby="digital-concierge-panel-heading">
      <div className="dashboardCardHeader">
        <div>
          <p className="dashboardKicker">Digital Concierge</p>
          <h2 id="digital-concierge-panel-heading">Contact & Location</h2>
        </div>
      </div>

      <div className="conciergeContactLocationRow">
        <div className="conciergeContactColumn">
          <h3 className="conciergeColumnTitle">Contact Information</h3>

          <div className="conciergeInfoItem">
            <span className="conciergeInfoLabel">Phone</span>
            <a href="tel:+639171234567" className="conciergeInfoLink">+63 917 123 4567</a>
          </div>

          <div className="conciergeInfoItem">
            <span className="conciergeInfoLabel">Email</span>
            <a href="mailto:munimunibeachresort@gmail.com" className="conciergeInfoLink">munimunibeachresort@gmail.com</a>
          </div>

          <div className="conciergeInfoItem">
            <span className="conciergeInfoLabel">Social Media</span>
            <div className="conciergeSocialLinks">
              <a href="https://www.facebook.com" target="_blank" rel="noreferrer" className="conciergeInfoLink">Facebook</a>
              <a href="https://www.instagram.com" target="_blank" rel="noreferrer" className="conciergeInfoLink">Instagram</a>
            </div>
          </div>
        </div>

        <div className="conciergeLocationColumn">
          <h3 className="conciergeColumnTitle">Location</h3>
          <p className="conciergeLocationText">
            MuniMuni Beach Resort Samal, Brgy. Tagbay, Samal, 8119 Davao del Norte
          </p>
          <a href={mapLink} target="_blank" rel="noreferrer" className="conciergeDirectionsBtn">
            Open in Maps
          </a>

          <div className="conciergeMapFrameWrap">
            <iframe
              title="MuniMuni Beach Resort map"
              src={mapEmbedUrl}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              className="conciergeMapFrame"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
