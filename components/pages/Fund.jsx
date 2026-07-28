import Link from 'next/link'
import { makeT } from '@/lib/i18n.js'
import { pathFor } from '@/lib/routes.js'

const DISCLAIMER =
  "*La performance n'est ni garantie ni contractuelle et constitue uniquement un objectif de gestion. Investir dans le Fonds comporte un risque de perte en capital et un risque d'illiquidité. Les performances passées ne préjugent pas des performances futures, lesquelles sont susceptibles d'être affectées par la fiscalité, en fonction de la situation personnelle de chaque investisseur et du régime fiscal qui lui est applicable."

// FC1 et FC2 partagent la même vidéo de fond : le fichier était dupliqué à
// l'octet près (fc1-hero.mp4 / fc2-hero.mp4), il est désormais servi une seule
// fois sous le nom fc-hero.mp4 et mis en cache après la première page.
const FC_VIDEO = '/assets/fc-hero.mp4'

const DATA = {
  fc1: {
    name: 'Florestan Continuity 1', video: FC_VIDEO,
    intro: 'Florestan Continuity 1 est destiné à investir dans des fonds de continuation européens, au côté de gérants de premier plan.',
    tagClass: 'closed', tag: 'Clôturé',
    rows: [
      ['Nom', 'Florestan Continuity 1'], ['Structure', 'FPCI'], ['Durée', '6 ans'],
      ['Date de lancement', '2024'], ['Classification SFDR', 'Article 8'],
      ['Fiscalité', 'Fonds fiscal (IR & IS 0%)'], ['Performance cible*', '17% TRI net investisseur']
    ],
    button: null
  },
  fc2: {
    name: 'Florestan Continuity 2', video: FC_VIDEO,
    intro: 'Florestan Continuity 2 est destiné à investir dans des fonds de continuation européens, au côté de gérants de premier plan.',
    tagClass: 'live', tag: "En cours d'investissement",
    rows: [
      ['Nom', 'Florestan Continuity 2'], ['Structure', 'FPCI'], ['Durée', '6 ans'],
      ['Date de lancement', '2026'], ['Classification SFDR', 'Article 8'],
      ['Fiscalité', 'Fonds fiscal (IR & IS 0%), parts spéciales remploi-cession'], ['Performance cible*', '17% TRI net investisseur']
    ],
    button: 'Demander la documentation'
  }
}

export default function Fund({ lang, fund }) {
  const t = makeT(lang)
  const d = DATA[fund]

  return (
    <>
      <section className="pg-hero tight" style={{ padding: '118px 0' }}>
        <div className="bg-media">
          <video src={d.video} autoPlay muted loop playsInline preload="auto" />
        </div>
        <div className="wrap">
          <p className="eyebrow rv">{t('Nos fonds')}</p>
          <h1 className="rv" style={{ fontSize: 'clamp(2.1rem,4.2vw,3.4rem)' }}>{d.name}</h1>
          <div className="rule rv"></div>
          <p className="rv" style={{ maxWidth: '56ch', color: 'rgba(255,255,255,.8)' }}>{t(d.intro)}</p>
          <span className={'tag ' + d.tagClass + ' rv'} style={{ display: 'inline-block', marginTop: 26 }}>
            {t(d.tag)}
          </span>
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="shead rv" style={{ marginBottom: 36 }}>
            <p className="eyebrow">{t('Caractéristiques du fonds')}</p>
            <h2>{t("Fiche d'identité")}</h2>
          </div>
          <dl className="sheet rv">
            {d.rows.map(([k, v], i) => (
              <div className="row" key={i}>
                <dt>{t(k)}</dt>
                <dd>{t(v)}</dd>
              </div>
            ))}
            <div className="row">
              <dt>{t('Indicateur de risque')}</dt>
              <dd>
                <span className="risk">
                  {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                    <i className={n === 6 ? 'on' : ''} key={n}>{n}</i>
                  ))}
                </span>
              </dd>
            </div>
          </dl>

          <p className="disclaimer rv">{t(DISCLAIMER)}</p>

          {d.button && (
            <div style={{ marginTop: 44 }} className="rv">
              <Link href={pathFor('contact', lang)} className="btn dark">{t(d.button)}</Link>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
