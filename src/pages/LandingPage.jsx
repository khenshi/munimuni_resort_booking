import { useEffect, useMemo, useState } from 'react'
import Hero from '../components/landing/Hero'
import TopNav from '../components/landing/TopNav'
import ResortHighlights from '../components/landing/ResortHighlights'
import ResortGallery from '../components/landing/ResortGallery'
import '../styles/pages/landing-page.css'

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false)

  const navItems = useMemo(
    () => [
      { label: 'Highlights', targetId: 'resort-highlights' },
      { label: 'Gallery', targetId: 'resort-gallery' },
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
    </div>
  )
}

