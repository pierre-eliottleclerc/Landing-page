'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { makeT, LANGS } from '@/lib/i18n.js'
import { PAGES, pathFor } from '@/lib/routes.js'

export default function Header({ lang }) {
  const t = makeT(lang)
  const pathname = usePathname()
  const [shrunk, setShrunk] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setShrunk(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const close = () => setOpen(false)
  const is = (key) => pathname === pathFor(key, lang)

  // Le sélecteur de langue devient un vrai lien vers la page jumelle. Deux
  // bénéfices : chaque langue a son URL indexable, et la traduction ne dépend
  // plus du JavaScript.
  const currentKey =
    PAGES.find((p) => pathFor(p.key, lang) === pathname)?.key ?? 'accueil'

  return (
    <header id="hdr" className={shrunk ? 'shrunk' : ''}>
      <div className="wrap">
        <Link href={pathFor('accueil', lang)} className="brand" onClick={close}>
          <img className="logo" src="/assets/logo-blanc.png" alt="Florestan Investment Management" />
        </Link>

        <nav className={'main' + (open ? ' open' : '')} id="nav">
          <Link href={pathFor('accueil', lang)} className={is('accueil') ? 'active' : ''} onClick={close}>
            {t('Accueil')}
          </Link>
          <Link href={pathFor('strategie', lang)} className={is('strategie') ? 'active' : ''} onClick={close}>
            {t('Notre Stratégie')}
          </Link>
          <span className="drop">
            <Link href={pathFor('fc2', lang)} className={is('fc1') || is('fc2') ? 'active' : ''} onClick={close}>
              {t('Nos fonds')}
            </Link>
            <span className="drop-panel">
              <Link href={pathFor('fc1', lang)} onClick={close}>FC1</Link>
              <Link href={pathFor('fc2', lang)} onClick={close}>FC2</Link>
            </span>
          </span>
          <Link href={pathFor('equipe', lang)} className={is('equipe') ? 'active' : ''} onClick={close}>
            {t('Notre équipe')}
          </Link>
          <Link href={pathFor('contact', lang)} className={is('contact') ? 'active' : ''} onClick={close}>
            {t('Contact')}
          </Link>
          <Link href={pathFor('actualites', lang)} className={is('actualites') ? 'active' : ''} onClick={close}>
            {t('Actualités')}
          </Link>
        </nav>

        <div className="hdr-right">
          <div className="lang">
            {LANGS.map((l) => (
              <Link
                key={l}
                href={pathFor(currentKey, l)}
                className={l === lang ? 'on' : ''}
                hrefLang={l}
                aria-current={l === lang ? 'true' : undefined}
              >
                {l.toUpperCase()}
              </Link>
            ))}
          </div>
          <Link href={pathFor('espace', lang)} className="btn-ghost" onClick={close}>
            {t('Espace Personnel')}
          </Link>
          <button className="burger" aria-label="Menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </header>
  )
}
