export default function BookingStepGuestInfo({ formData, guestInfoErrors, onChange }) {
  return (
    <div className="bookingGrid">
      <div className="bookingField">
        <label htmlFor="firstName">First Name</label>
        <input
          id="firstName"
          type="text"
          value={formData.firstName}
          onChange={(e) => onChange('firstName', e.target.value)}
          required
        />
        {guestInfoErrors?.firstName ? <p className="bookingFieldError">{guestInfoErrors.firstName}</p> : null}
      </div>

      <div className="bookingField">
        <label htmlFor="lastName">Last Name</label>
        <input
          id="lastName"
          type="text"
          value={formData.lastName}
          onChange={(e) => onChange('lastName', e.target.value)}
          required
        />
        {guestInfoErrors?.lastName ? <p className="bookingFieldError">{guestInfoErrors.lastName}</p> : null}
      </div>

      <div className="bookingField">
        <label htmlFor="phone">Mobile Number</label>
        <input
          id="phone"
          type="tel"
          inputMode="numeric"
          maxLength={13}
          value={formData.phone}
          onChange={(e) => onChange('phone', e.target.value)}
          placeholder="09XXXXXXXXX"
          required
        />
        {guestInfoErrors?.phone ? <p className="bookingFieldError">{guestInfoErrors.phone}</p> : null}
      </div>

      <div className="bookingField">
        <label htmlFor="email">Email Address</label>
        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => onChange('email', e.target.value)}
          required
        />
        {guestInfoErrors?.email ? <p className="bookingFieldError">{guestInfoErrors.email}</p> : null}
      </div>

      <div className="bookingField isFull">
        <label htmlFor="address">Address (Optional)</label>
        <input
          id="address"
          type="text"
          value={formData.address}
          onChange={(e) => onChange('address', e.target.value)}
        />
      </div>
    </div>
  )
}