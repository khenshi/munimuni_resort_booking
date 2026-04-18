import { stepLabels } from '../utils/booking-utils'

export default function BookingStepsIndicator({ step }) {
  return (
    <ol className="bookingSteps" aria-label="Booking steps">
      {stepLabels.map((label, index) => {
        const stepNumber = index + 1
        const status = stepNumber < step ? 'isDone' : stepNumber === step ? 'isActive' : ''
        return (
          <li key={label} className={`bookingStep ${status}`.trim()}>
            <span className="bookingStepCircle" aria-hidden="true">
              {stepNumber}
            </span>
            <span className="bookingStepLabel">{label}</span>
          </li>
        )
      })}
    </ol>
  )
}