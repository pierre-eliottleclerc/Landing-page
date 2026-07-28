'use client'

import dynamic from 'next/dynamic'
import { makeT } from '@/lib/i18n.js'

// Enveloppe volontairement légère : elle n'importe pas le client Supabase.
// Le contenu, qui l'embarque (~65 ko), est chargé à la demande depuis un
// composant client — c'est la seule façon dont Next découpe réellement le
// bundle ici, `next/dynamic` depuis un composant serveur ne le fait pas.
const EspaceContent = dynamic(() => import('./EspaceContent.jsx'), {
  ssr: false,
  loading: () => <div className="lp-panel"><p className="note">…</p></div>,
})

export default function Espace({ lang }) {
  const t = makeT(lang)

  return (
    <>
      <section
        className="pg-hero tight"
        style={{ padding: '110px 0', background: 'linear-gradient(140deg,var(--navy) 0%,var(--teal) 100%)' }}
      >
        <div className="wrap">
          <p className="eyebrow rv">{t('Espace Personnel')}</p>
          <h1 className="rv" style={{ fontSize: 'clamp(2.1rem,4.2vw,3.4rem)' }}>
            {t('Espace investisseurs')}
          </h1>
          <div className="rule rv"></div>
          <p className="rv" style={{ maxWidth: '56ch', color: 'rgba(255,255,255,.8)' }}>
            {t('Accédez aux documents mis à votre disposition par Florestan IM. La connexion se fait par un lien envoyé à votre adresse email, sans mot de passe.')}
          </p>
        </div>
      </section>

      <section className="tight">
        <div className="wrap">
          <EspaceContent lang={lang} />
        </div>
      </section>
    </>
  )
}
