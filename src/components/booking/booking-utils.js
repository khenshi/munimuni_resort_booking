import { cottages, dayTourOffers, overnightOffers } from '../packages/data'

export const stepLabels = ['Stay Details', 'Guest Info', 'Add-ons', 'Review']

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
      offerType,
      offerId,
    }
  }

  return null
}
