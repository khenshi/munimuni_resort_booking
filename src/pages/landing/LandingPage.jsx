import {
  ContactDetails,
  Experiences,
  Hero,
  LandingFooter,
  ResortGallery,
  ResortHighlights,
  TopNav,
} from '../../components/landing'
import '../../styles/pages/landing-page.css'

export default function LandingPage() {
  const navItems = [
    { label: 'Highlights', targetId: 'resort-highlights' },
    { label: 'Gallery', targetId: 'resort-gallery' },
    { label: 'Featured Offers', targetId: 'featured-offers' },
    { label: 'Contact', targetId: 'resort-contact' },
  ]

  return (
    <div>
      <TopNav navItems={navItems} />
      <Hero />
      <ResortHighlights />
      <ResortGallery />
      <Experiences />
      <ContactDetails />
      <LandingFooter />
    </div>
  )
}

