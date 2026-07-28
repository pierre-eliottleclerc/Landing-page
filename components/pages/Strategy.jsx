import { makeT } from '@/lib/i18n.js'
import EuropeMap from '@/components/EuropeMap.jsx'
import ContinuationDiagram from '@/components/ContinuationDiagram.jsx'
import MarketBars from '@/components/MarketBars.jsx'

const ADN = [
  { n: '01', h: 'Sourcing de qualité', p: 'Relations directes avec les gérants européens de premier plan.' },
  { n: '02', h: 'Analyse approfondie', p: 'Due diligence interne, actif par actif, sans délégation.' },
  { n: '03', h: 'Approche pragmatique', p: 'Structuration lisible, fiscalité et liquidité au cœur des décisions.' }
]

export default function Strategy({ lang }) {
  const t = makeT(lang)

  return (
    <>
      <section className="pg-hero tight" style={{ padding: '120px 0' }}>
        <div className="bg-media">
          <video src="/assets/strat-hero.mp4" autoPlay muted loop playsInline preload="auto" />
        </div>
        <div className="wrap">
          <div className="shead rv" style={{ marginBottom: 0 }}>
            <p className="eyebrow">{t('Notre stratégie')}</p>
            <h1 style={{ color: '#fff' }}>{t('Exploiter les dynamiques de marché du Private Equity')}</h1>
            <div className="rule"></div>
            <p style={{ color: 'rgba(255,255,255,.82)' }}>
              {lang === 'en'
                ? <>Florestan aims to exploit the market dynamics of private equity, focusing on <strong style={{ fontWeight: 400, color: 'var(--lime)' }}>single-asset</strong> continuation funds to achieve a higher risk/return potential than traditional LBOs.</>
                : <>Florestan vise à exploiter les dynamiques de marché du Private Equity, en se concentrant sur les fonds de continuation <strong style={{ fontWeight: 400, color: 'var(--lime)' }}>single asset</strong> pour obtenir un potentiel de rendement / risque supérieur au LBO traditionnel.</>}
            </p>
            <p style={{ color: 'rgba(255,255,255,.82)' }}>
              {t('Notre approche se concentre sur des entreprises matures et rentables (EBITDA > 20 M€), localisées en Europe dans des secteurs en croissance.')}
            </p>
          </div>
        </div>
      </section>

      <section className="tight">
        <div className="wrap">
          <div className="geo-head rv">
            <p className="eyebrow">{t('Géographie')}</p>
            <h2>{t('Florestan, un fonds pan-européen')}</h2>
            <div className="rule c"></div>
          </div>
          <EuropeMap lang={lang} />
        </div>
      </section>

      <section className="band-dark tight cf">
        <div className="wrap">
          <div className="shead rv" style={{ marginBottom: 36 }}>
            <p className="eyebrow">{t('Les fonds de continuation')}</p>
            <h2>{t("L'opportunité d'investir dans les entreprises les plus performantes en Europe")}</h2>
          </div>
          <div className="cf-diagram rv"><ContinuationDiagram lang={lang} /></div>
        </div>
      </section>

      <section className="band-paper">
        <div className="wrap">
          <div className="market">
            <div className="rv">
              <p className="eyebrow">{t('Une niche stratégique')}</p>
              <h2>{t('Les fonds de continuation')}</h2>
              <div className="rule"></div>
              <p className="cagr">25%<span>{t('CAGR du marché')}</span></p>
              <ul>
                <li>{t("L'émergence du marché des fonds de continuation en Europe laisse de la place à de nouveaux acteurs. Ce marché de +100 Md$ est en croissance de 25%+ par an et s'est surtout structuré aux États-Unis.")}</li>
                <li>{t("L'échéance des fonds traditionnels de Private Equity donne lieu à des opportunités d'arbitrage : faute de liquidité, certains investisseurs doivent céder leurs titres à une décote.")}</li>
                <li>{t("Dans un contexte où les meilleures entreprises passent de fonds en fonds, les gérants ont intérêt à renouveler la détention de leurs meilleures entreprises plutôt qu'à les céder à un gérant concurrent.")}</li>
              </ul>
            </div>
            <div className="rv">
              <p className="eyebrow">{t('Volumes du marché des fonds de continuation')}</p>
              <MarketBars />
              <p className="note">{t('Source marché — Lazard secondary market report.')}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="band-dark tight">
        <div className="wrap">
          <div className="shead rv" style={{ marginBottom: 44 }}>
            <p className="eyebrow">{t('Notre ADN')}</p>
            <h2>{t('Sourcing · Analyse · Pragmatisme')}</h2>
          </div>
          <div className="adn rv">
            {ADN.map((a, i) => (
              <div key={i}>
                <img src={`/assets/adn-${i + 1}.jpg`} alt="" />
                <span className="n">{a.n}</span>
                <h3>{t(a.h)}</h3>
                <p>{t(a.p)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
