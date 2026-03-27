import { useEffect, useMemo, useState } from 'react'
import Hero from '../components/Hero'
import Resort from '../components/Resort'

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false)

  const navItems = useMemo(
    () => [
      { label: 'Resort', targetId: 'resort' },
      { label: 'Experiences', targetId: 'experiences' },
      { label: 'Gallery', targetId: 'gallery' },
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

  const onNavigateTo = (e, targetId) => {
    e.preventDefault()
    const el = document.getElementById(targetId)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setMenuOpen(false)
  }

  return (
    <div>
      <Hero
      navItems={navItems}
      menuOpen={menuOpen}
      onMenuToggle={() => setMenuOpen((v) => !v)}
      onNavigateTo={onNavigateTo}
      />
      <Resort />
    </div>
  )
}

