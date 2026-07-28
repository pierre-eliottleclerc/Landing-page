'use client'

import { useState } from 'react'
import { makeT } from '@/lib/i18n.js'
import { NEWS } from '@/data/news.js'

// Composant client pour le filtre par année. Next pré-rend malgré tout l'état
// initial (« Toutes ») dans le HTML statique : toutes les actualités sont donc
// bien présentes dans la page livrée aux moteurs, sans exécuter de JavaScript.
export default function News({ lang }) {
  const t = makeT(lang)
  const [filter, setFilter] = useState('all')
  const years = [...new Set(NEWS.map((n) => n.y))].sort((a, b) => b - a)
  const list = filter === 'all' ? NEWS : NEWS.filter((n) => n.y === filter)

  return (
    <>
      <section className="tight" style={{ background: 'var(--paper)' }}>
        <div className="wrap">
          <p className="eyebrow rv">{t('Actualités')}</p>
          <h1 className="rv">{t('Les dernières nouvelles de Florestan')}</h1>
          <div className="rule rv"></div>
        </div>
      </section>

      <section className="tight">
        <div className="wrap">
          <div className="filters">
            <button className={filter === 'all' ? 'on' : ''} onClick={() => setFilter('all')}>
              {t('Toutes')}
            </button>
            {years.map((y) => (
              <button key={y} className={filter === y ? 'on' : ''} onClick={() => setFilter(y)}>
                {y}
              </button>
            ))}
          </div>
          <div className="news">
            {list.map((n, i) => (
              <a className="item rv in" href={n.u} target="_blank" rel="noopener noreferrer" key={i}>
                <div className="thumb"><img src={n.i} alt={t(n.t)} loading="lazy" /></div>
                <div className="body">
                  <span className="yr">{n.y}</span>
                  <h3>{t(n.t)}</h3>
                  <p>{t(n.d)}</p>
                </div>
                <div className="foot"><span className="more">{t('En savoir plus')}</span></div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
