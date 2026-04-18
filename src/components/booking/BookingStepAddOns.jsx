export default function BookingStepAddOns({ formData, addOns, toggleAddOn }) {
  return (
    <div className="bookingAddOnsList">
      {addOns.slice(0, 3).map((item) => {
        const checked = formData.selectedAddOns.includes(item.id)
        return (
          <label key={item.id} className={`bookingAddOn ${checked ? 'isChecked' : ''}`}>
            <input
              type="checkbox"
              checked={checked}
              onChange={() => toggleAddOn(item.id)}
            />
            <span>
              <strong>{item.title}</strong>
              <small>{item.priceLabel}</small>
            </span>
          </label>
        )
      })}
    </div>
  )
}