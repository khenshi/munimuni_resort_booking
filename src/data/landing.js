import galleryImage1 from '../assets/1.png'
import galleryImage2 from '../assets/2.png'
import galleryImage3 from '../assets/3.png'
import galleryImage4 from '../assets/4.png'
import galleryImage5 from '../assets/5.png'
import galleryImage6 from '../assets/6.png'
import galleryImage7 from '../assets/7.png'
import galleryImage8 from '../assets/8.png'
import resort_bg from '../assets/resort_sectionbg.jpg'
import hero_bg from '../assets/herobg.jpg'

export const resortHighlights = [
  {
    title: 'Beachfront Location',
    description: 'Wake up to sea views and a short walk to soft white sand.',
    iconPaths: ['M4 17c1.2 0 1.8-.7 2.5-1.4.7-.7 1.3-1.3 2.5-1.3s1.8.6 2.5 1.3c.7.7 1.3 1.4 2.5 1.4s1.8-.7 2.5-1.4c.7-.7 1.3-1.3 2.5-1.3v2c-.5 0-.8.3-1.4.9-.8.8-1.9 1.8-3.6 1.8s-2.8-1-3.6-1.8c-.6-.6-.9-.9-1.4-.9s-.8.3-1.4.9C6.8 18 5.7 19 4 19v-2z', 'M16.5 3.5l.8 1.7 1.7.8-1.7.8-.8 1.7-.8-1.7-1.7-.8 1.7-.8.8-1.7z'],
  },
  {
    title: 'Relaxed Stays',
    description: 'Comfortable rooms and calm spaces designed for true downtime.',
    iconPaths: ['M4 11h16v7H4v-7zm2 2v3h12v-3H6z', 'M7 8h10a2 2 0 0 1 2 2v1H5v-1a2 2 0 0 1 2-2z'],
  },
  {
    title: 'Sunset Moments',
    description: 'End each day with golden skies and ocean breeze by the shore.',
    iconPaths: ['M12 5a5 5 0 0 0-5 5h10a5 5 0 0 0-5-5z', 'M3 14h18v2H3v-2zm8 3h2v3h-2v-3zm-7 3h16v2H4v-2z'],
  },
]

export const resortImages = [
  {
    src: galleryImage1,
    alt: 'Resort gallery image 1',
  },
  {
    src: galleryImage2,
    alt: 'Resort gallery image 2',
  },
  {
    src: galleryImage3,
    alt: 'Resort gallery image 3',
  },
  {
    src: galleryImage4,
    alt: 'Resort gallery image 4',
  },
  {
    src: galleryImage5,
    alt: 'Resort gallery image 5',
  },
  {
    src: galleryImage6,
    alt: 'Resort gallery image 6',
  },
  {
    src: galleryImage7,
    alt: 'Resort gallery image 7',
  },
  {
    src: galleryImage8,
    alt: 'Resort gallery image 8',
  },
  {
    src: resort_bg,
    alt: 'Beachside view of the resort shoreline',
  },
  {
    src: hero_bg,
    alt: 'Coastal view with clear water and palm trees',
  },
]

export const cottageImageById = {
  cove: { src: galleryImage3, alt: 'Cove cottage with ocean-facing lounge area' },
  jungle: { src: galleryImage5, alt: 'Jungle cottage surrounded by tropical greenery' },
  cliffside: { src: galleryImage7, alt: 'Cliffside cottage with panoramic sea view' },
}