'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

// Rejoue l'animation d'apparition (.rv → .in) à chaque changement de page,
// en reprenant la logique du site d'origine.
export default function Reveal() {
  const pathname = usePathname()

  useEffect(() => {
    window.scrollTo(0, 0)
    const timer = setTimeout(() => {
      const els = [...document.querySelectorAll('.rv:not(.in)')]
      const vh = window.innerHeight || document.documentElement.clientHeight || 900
      const io = new IntersectionObserver(
        (entries) =>
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add('in')
              io.unobserve(e.target)
            }
          }),
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
      )
      els.forEach((el, i) => {
        el.style.transitionDelay = Math.min(i, 8) * 60 + 'ms'
        if (vh === 0 || el.getBoundingClientRect().top < vh * 0.95) el.classList.add('in')
        else io.observe(el)
      })
    }, 30)
    return () => clearTimeout(timer)
  }, [pathname])

  return null
}
