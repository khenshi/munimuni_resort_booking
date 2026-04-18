import BookingStepStayDetails from './BookingStepStayDetails'
import BookingStepGuestInfo from './BookingStepGuestInfo'
import BookingStepAddOns from './BookingStepAddOns'
import BookingStepReview from './BookingStepReview'

export default function BookingStepContent(props) {
  const { step } = props

  if (step === 1) return <BookingStepStayDetails {...props} />
  if (step === 2) return <BookingStepGuestInfo {...props} />
  if (step === 3) return <BookingStepAddOns {...props} />
  return <BookingStepReview {...props} />
}