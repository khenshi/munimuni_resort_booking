import { cottages, dayTourOffers, overnightOffers } from '../../../../data/packages'

export const tabByType = {
  daytour: 'daytour',
  overnight: 'overnight',
}

export function resolveOfferDetail(offerType, offerId) {
  if (offerType === 'daytour' && offerId === 'basic') {
    const basicOffer = dayTourOffers.find((item) => item.id === 'basic')

    return {
      title: 'Basic Type - Entrance Fee',
      subtitle: 'Entrance & facilities access',
      galleryImages: basicOffer?.galleryImages ?? [],
      details: [
        'Monday to Thursday: PHP 275 per person',
        'Friday to Sunday and Holidays: PHP 325 per person',
        'Hours: 8:00 AM to 5:00 PM',
        'Includes free use of tables and chairs',
        'Walk-ins welcome, subject to availability',
      ],
    }
  }

  if (offerType === 'daytour' && offerId?.startsWith('cottage-')) {
    const cottageId = offerId.replace('cottage-', '')
    const cottage = cottages.find((item) => item.id === cottageId)
    if (!cottage) return null

    return {
      title: cottage.name,
      subtitle: cottage.description,
      priceInfo: `${cottage.priceLabel} (${cottage.paxLabel})`,
      galleryImages: cottage.galleryImages ?? [],
      details: cottage.details,
    }
  }

  if (offerType === 'overnight') {
    const offer = overnightOffers.find((item) => item.id === offerId)
    if (!offer) return null

    return {
      title: offer.title,
      subtitle: offer.description,
      priceInfo: offer.priceLabel,
      galleryImages: offer.galleryImages ?? [],
      details: offer.details,
    }
  }

  return null
}

export function resolveSelectedAvailabilityItem(offerType, offerId) {
  if (offerType === 'daytour' && offerId === 'basic') {
    return dayTourOffers.find((item) => item.id === 'basic') ?? null
  }

  if (offerType === 'daytour' && offerId?.startsWith('cottage-')) {
    const cottageId = offerId.replace('cottage-', '')
    return cottages.find((item) => item.id === cottageId) ?? null
  }

  if (offerType === 'overnight') {
    return overnightOffers.find((item) => item.id === offerId) ?? null
  }

  return null
}
