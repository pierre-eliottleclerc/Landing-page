import Link from 'next/link'
import { makeT } from '@/lib/i18n.js'
import { pathFor } from '@/lib/routes.js'

const CARDS = [
  {
    img: '/assets/card-fc1.png', alt: 'Florestan Continuity 1', eyebrow: 'Florestan Continuity 1',
    h3: 'Fonds de continuation',
    bullets: ['Co-investir avec les meilleurs gérants européens', 'Dans des entreprises dérisquées à des valorisations maîtrisées', 'Fiscalité avantageuse'],
    tagClass: 'closed', tag: 'Clôturé', to: 'fc1'
  },
  {
    img: '/assets/card-fc2.png', alt: 'Florestan Continuity 2', eyebrow: 'Florestan Continuity 2',
    h3: 'Fonds de continuation',
    bullets: ['Co-investir avec les meilleurs gérants européens', 'Dans des entreprises dérisquées à des valorisations maîtrisées', 'Fiscalité avantageuse'],
    tagClass: 'live', tag: "En cours d'investissement", to: 'fc2'
  },
  {
    img: '/assets/card-fundsel.png', alt: 'Florestan Fund Selection', eyebrow: 'Fund Selection',
    h3: 'Fonds de fonds',
    bullets: ['Sélection parmi les meilleurs fonds des gérants européens de Private Equity', 'Durée cible de 10 ans, variable selon les fonds sélectionnés', 'Approche sur mesure et assistance à la liquidité'],
    tagClass: 'custom', tag: 'Offre sur-mesure', to: 'contact'
  }
]

const ADN = [
  { n: '01', h: 'Sourcing de qualité', p: 'Un accès direct aux gérants européens de premier plan et à leurs meilleures participations.', img: '/assets/adn-1.jpg' },
  { n: '02', h: 'Analyse approfondie', p: 'Une due diligence menée en interne, actif par actif, sur des sociétés matures et rentables.', img: '/assets/adn-2.jpg' },
  { n: '03', h: 'Approche pragmatique', p: 'Des structures lisibles, une fiscalité optimisée et une attention constante à la liquidité.', img: '/assets/adn-3.jpg' }
]

export default function Home({ lang }) {
  const t = makeT(lang)

  return (
    <>
      <section className="hero">
        <div className="bg-media">
          <video src="/assets/home-hero.mp4" autoPlay muted loop playsInline preload="auto" />
        </div>
        <div className="wrap">
          <p className="eyebrow rv">Private Equity · Europe</p>
          <h1 className="rv">
            {lang === 'en'
              ? <>Florestan invests in European private equity, offering privileged access to the best <em>managers</em> and <em>continuation funds</em></>
              : <>Florestan investit dans le private equity européen, offrant un accès privilégié aux meilleurs <em>gérants</em> et <em>fonds de continuation</em></>}
          </h1>
          <p className="lede rv">
            {t("Une équipe intégrée, un sourcing propriétaire et une conviction : les fonds de continuation single asset offrent un couple rendement / risque supérieur au LBO traditionnel.")}
          </p>
          <div className="hero-cta rv">
            <Link href={pathFor('strategie', lang)} className="btn">{t('Notre stratégie')}</Link>
            <Link href={pathFor('fc2', lang)} className="btn alt">{t('Découvrir FC2')}</Link>
          </div>
          <div className="hero-stats rv">
            <div><b>LBO</b><span>{t('Stratégie')}</span></div>
            <div><b>Europe</b><span>{t('Géographie')}</span></div>
            <div><b>17%</b><span>{t('TRI net cible*')}</span></div>
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="shead c rv">
            <p className="eyebrow">{t("Nos opportunités d'investissement")}</p>
            <h2>{t('Trois véhicules, une même exigence de sélection')}</h2>
            <div className="rule c"></div>
          </div>
          <div className="grid3">
            {CARDS.map((c, i) => (
              <Link className="fund-card rv" href={pathFor(c.to, lang)} key={i} aria-label={c.eyebrow}>
                <div className="thumb"><img src={c.img} alt={c.alt} /></div>
                <div className="body">
                  <p className="eyebrow">{c.eyebrow}</p>
                  <h3>{t(c.h3)}</h3>
                  <ul>{c.bullets.map((b, j) => <li key={j}>{t(b)}</li>)}</ul>
                </div>
                <div className="foot">
                  <span className={'tag ' + c.tagClass}>{t(c.tag)}</span>
                  <span className="more">{t('En savoir plus')}</span>
                </div>
              </Link>
            ))}
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
                <img src={a.img} alt="" />
                <span className="n">{a.n}</span>
                <h3>{t(a.h)}</h3>
                <p>{t(a.p)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta tight band-img">
        <div className="bg-media"><img src="/assets/home-equipe.png" alt="" /></div>
        <div className="wrap">
          <h2 className="rv">{t('Échangeons sur votre allocation en Private Equity')}</h2>
          <div className="rule c"></div>
          <Link href={pathFor('contact', lang)} className="btn rv" style={{ marginTop: 14 }}>
            {t('Nous contacter')}
          </Link>
        </div>
      </section>
    </>
  )
}
