'use client'

import { useEffect, useRef, useState } from 'react'
import { makeT } from '@/lib/i18n.js'
import { EUROPE_PATHS } from '@/data/europeMap.js'
import { GEO, ZONE, CO } from '@/data/portfolio.js'

/**
 * Les classes .co (pays de participation) et .zone (périmètre) sont injectées
 * directement dans le markup, une seule fois au chargement du module.
 *
 * Pourquoi pas via classList dans un effet, comme le faisait le portage
 * précédent : React réapplique le innerHTML du SVG au re-render, ce qui effaçait
 * les classes ajoutées à la main — les pays perdaient leur couleur dès le
 * premier survol. Les baker dans la chaîne règle le problème et présente en
 * prime la carte déjà colorée dans le HTML pré-rendu, sans attendre l'hydratation.
 */
const MARKED_PATHS = EUROPE_PATHS.replace(
  /<path class="ctry"([^>]*?)id="([A-Za-z]{2})"/g,
  (_, middle, code) => {
    const cls = GEO[code] ? 'ctry co' : ZONE[code] ? 'ctry zone' : 'ctry'
    return `<path class="${cls}"${middle}id="${code}"`
  }
)

export default function EuropeMap({ lang }) {
  const t = makeT(lang)
  const boxRef = useRef(null)
  const svgRef = useRef(null)
  const [active, setActive] = useState(null) // code pays de participation survolé
  const [tip, setTip] = useState(null) // { name, x, y }

  // surbrillance du pays actif
  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    svg.querySelectorAll('.ctry.on').forEach((e) => e.classList.remove('on'))
    if (active) {
      const el = svg.querySelector('#' + active)
      if (el) el.classList.add('on')
    }
  }, [active])

  const handleMove = (e) => {
    const el = e.target.closest && e.target.closest('[id]')
    const code = el ? el.id : null
    const r = boxRef.current.getBoundingClientRect()
    if (code && GEO[code]) {
      setActive(code)
      setTip({ name: t(GEO[code].n), x: e.clientX - r.left, y: e.clientY - r.top })
    } else if (code && ZONE[code]) {
      setTip({ name: t(ZONE[code]), x: e.clientX - r.left, y: e.clientY - r.top })
    } else {
      setTip(null)
    }
  }
  const handleClick = (e) => {
    const el = e.target.closest && e.target.closest('[id]')
    if (el && GEO[el.id]) setActive(el.id)
  }
  const handleLeave = () => {
    setActive(null)
    setTip(null)
  }

  const d = active ? GEO[active] : null

  return (
    <div className="geo-map rv">
      <div
        className="eu-map-box"
        ref={boxRef}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        onClick={handleClick}
      >
        <svg
          className="eu-map"
          ref={svgRef}
          viewBox="145 -4 862 664"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label={t('Carte des investissements de Florestan en Europe')}
          dangerouslySetInnerHTML={{ __html: MARKED_PATHS }}
        />
        {tip && (
          <div className="eu-tip" style={{ left: tip.x, top: tip.y }}>
            {tip.name}
          </div>
        )}
      </div>

      <aside className="geo-panel">
        {!d ? (
          <div>
            <p className="eyebrow">{t('Portefeuille')}</p>
            <h3>{t("Une présence à travers toute l'Europe")}</h3>
            <p className="note">
              {t('Survolez un pays pour afficher les sociétés que Florestan y accompagne.')}
            </p>
            <div className="geo-legend">
              <span><i className="sw-teal"></i> {t('Pays de participation')}</span>
            </div>
          </div>
        ) : (
          <div>
            <p className="eyebrow">{t('Participations')}</p>
            <h3>{t(d.n)}</h3>
            <div className="geo-logos">
              {d.c.map((k) => (
                <div className={'lg' + (d.c.length === 1 ? ' solo' : '')} key={k}>
                  <img src={CO[k].l} alt={CO[k].n} title={CO[k].n} loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        )}
      </aside>
    </div>
  )
}
