import { useEffect, useMemo, useState } from 'react'
import Hero from '../components/landing/sections/Hero'
import TopNav from '../components/landing/layout/TopNav'
import ResortHighlights from '../components/landing/sections/ResortHighlights'
import ResortGallery from '../components/landing/sections/ResortGallery'
import Experiences from '../components/landing/sections/Experiences'
import ContactDetails from '../components/landing/sections/ContactDetails'
import LandingFooter from '../components/landing/layout/LandingFooter'
import '../styles/pages/landing-page.css'

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false)

  const navItems = useMemo(
    () => [
      { label: 'Highlights', targetId: 'resort-highlights' },
      { label: 'Gallery', targetId: 'resort-gallery' },
      { label: 'Featured Offers', targetId: 'featured-offers' },
      { label: 'Contact', targetId: 'resort-contact' },
    ],
    [],
  )

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <div>
      <TopNav
        navItems={navItems}
        menuOpen={menuOpen}
        onMenuToggle={() => setMenuOpen((v) => !v)}
      />
      <Hero/>
      <ResortHighlights />
      <ResortGallery />
      <Experiences />
      <ContactDetails />
      <LandingFooter />
    </div>
  )
}

