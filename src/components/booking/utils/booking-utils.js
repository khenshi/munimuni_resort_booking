import { cottages, dayTourOffers, overnightOffers } from '../../../data/packages'
import { addDaysToISODate } from '../../packages/utils/availability-utils'

export const stepLabels = ['Stay Details', 'Guest Info', 'Review']

export function resolveAutoCheckOutDate(checkInDate, stayTab) {
  if (!checkInDate) return ''

  const daysToAdd = stayTab === 'overnight' ? 1 : 0
  return addDaysToISODate(checkInDate, daysToAdd)
}

export function resolveSelectedOffer(offerType, offerId) {
  if (!offerType || !offerId) return null

  if (offerType === 'daytour' && offerId === 'basic') {
    const offer = dayTourOffers.find((item) => item.id === 'basic')
    if (!offer) return null
    return {
      title: offer.title,
      subtitle: offer.description,
      priceInfo: offer.priceLabel,
      paxLabel: offer.paxLabel,
      paxMin: offer.paxMin,
      paxMax: offer.paxMax,
      imageUrl: offer.imageUrl,
      price: offer.price,
      offerType,
      offerId,
    }
  }

  if (offerType === 'daytour' && offerId.startsWith('cottage-')) {
    const cottageId = offerId.replace('cottage-', '')
    const cottage = cottages.find((item) => item.id === cottageId)
    if (!cottage) return null
    return {
      title: cottage.name,
      subtitle: cottage.description,
      priceInfo: `${cottage.priceLabel} (${cottage.paxLabel})`,
      paxLabel: cottage.paxLabel,
      paxMin: cottage.paxMin,
      paxMax: cottage.paxMax,
      imageUrl: cottage.imageUrl,
      price: cottage.price,
      offerType,
      offerId,
    }
  }

  if (offerType === 'overnight') {
    const offer = overnightOffers.find((item) => item.id === offerId)
    if (!offer) return null
    return {
      title: offer.title,
      subtitle: offer.description,
      priceInfo: offer.priceLabel,
      paxLabel: offer.paxLabel,
      paxMin: offer.paxMin,
      paxMax: offer.paxMax,
      imageUrl: offer.imageUrl,
      price: offer.price,
      offerType,
      offerId,
    }
  }

  return null
}