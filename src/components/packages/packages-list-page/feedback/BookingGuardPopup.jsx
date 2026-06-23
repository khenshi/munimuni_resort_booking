export default function BookingGuardPopup({ isOpen, title, message, onClose }) {
  if (!isOpen) return null

  return (
    <div className="bookingGuardPopupOverlay" role="presentation" onClick={onClose}>
      <div
        className="bookingGuardPopup"
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-guard-popup-title"
        aria-describedby="booking-guard-popup-message"
        onClick={(event) => event.stopPropagation()}
      >
        <h3 id="booking-guard-popup-title">{title}</h3>
        <p id="booking-guard-popup-message">{message}</p>
        <button type="button" className="bookingGuardPopupBtn" onClick={onClose}>
          Got it
        </button>
      </div>
    </div>
  )
}
