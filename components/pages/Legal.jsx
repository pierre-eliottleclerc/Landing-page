import { makeT } from '@/lib/i18n.js'
import { mentions, confidentialite, avertissement } from '@/data/legal.js'

// Le corps des textes légaux reste en français (standard pour un contenu
// réglementaire AMF) ; seul le titre se traduit.
const CONTENT = {
  mentions: { title: 'Mentions légales', html: mentions },
  confidentialite: { title: 'Politique de confidentialité', html: confidentialite },
  avertissement: { title: 'Avertissement', html: avertissement }
}

export default function Legal({ lang, page }) {
  const t = makeT(lang)
  const p = CONTENT[page]

  return (
    <>
      <section
        className="pg-hero tight"
        style={{ padding: '110px 0', background: 'linear-gradient(140deg,var(--navy) 0%,var(--teal) 100%)' }}
      >
        <div className="wrap">
          <p className="eyebrow rv">{t('Informations')}</p>
          <h1 className="rv" style={{ fontSize: 'clamp(2.1rem,4.2vw,3.4rem)' }}>{t(p.title)}</h1>
          <div className="rule rv"></div>
        </div>
      </section>
      <section className="tight">
        <div className="wrap">
          <div className="legal rv" dangerouslySetInnerHTML={{ __html: p.html }} />
        </div>
      </section>
    </>
  )
}
