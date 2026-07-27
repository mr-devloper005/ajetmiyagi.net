'use client'

import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'

/**
 * Floating back-to-top control. Appears once the visitor is a screen or so
 * down the page and scrolls smoothly unless reduced motion is preferred.
 */
export function EditableScrollTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const toTop = () => {
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
  }

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label="Back to top"
      className={`fixed bottom-6 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--slot4-accent)] text-white shadow-[0_14px_34px_rgba(11,75,196,0.35)] transition duration-500 hover:-translate-y-1 hover:bg-[var(--slot4-accent-deep)] sm:right-8 ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
      }`}
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  )
}
