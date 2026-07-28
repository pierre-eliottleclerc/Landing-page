'use client'

import { useEffect, useRef } from 'react'

const BARS = [
  { v: '$16B', h: 16, y: '2017' },
  { v: '$28B', h: 28, y: '2019' },
  { v: '$48B', h: 48, y: '2023' },
  { v: '$75B', h: 75, y: '2024' },
  { v: '+$100B', h: 100, y: '2025' }
]

// Seul le graphique est un composant client : la page Stratégie reste rendue
// côté serveur. Les libellés sont présents dans le HTML même sans JavaScript ;
// seule l'animation de hauteur est ajoutée à l'affichage.
export default function MarketBars() {
  const boxRef = useRef(null)

  useEffect(() => {
    const box = boxRef.current
    if (!box) return
    let done = false
    const run = () => {
      if (done) return
      done = true
      box.querySelectorAll('.col').forEach((c, i) =>
        setTimeout(() => { c.style.height = Number(c.dataset.h) * 0.86 + '%' }, i * 110)
      )
    }
    const io = new IntersectionObserver(
      (es) => { if (es.some((e) => e.isIntersecting)) { run(); io.disconnect() } },
      { threshold: 0.25 }
    )
    io.observe(box)
    return () => io.disconnect()
  }, [])

  return (
    <div className="bars" ref={boxRef}>
      {BARS.map((b, i) => (
        <div className="b" key={i}>
          <span className="v">{b.v}</span>
          <span className="col" data-h={b.h} style={{ height: 0 }}></span>
          <span className="y">{b.y}</span>
        </div>
      ))}
    </div>
  )
}
