import BookingStepStayDetails from './BookingStepStayDetails'
import BookingStepGuestInfo from './BookingStepGuestInfo'
import BookingStepReview from './BookingStepReview'

export default function BookingStepContent(props) {
  const { step } = props

  if (step === 1) return <BookingStepStayDetails {...props} />
  if (step === 2) return <BookingStepGuestInfo {...props} />
  return <BookingStepReview {...props} />
}