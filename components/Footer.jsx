import Link from 'next/link'
import { makeT } from '@/lib/i18n.js'
import { pathFor } from '@/lib/routes.js'
import { ORG } from '@/lib/site.js'

export default function Footer({ lang }) {
  const t = makeT(lang)
  const year = new Date().getFullYear()
  const p = (key) => pathFor(key, lang)

  return (
    <footer>
      <div className="wrap">
        <div className="f-top">
          <div>
            <Link href={p('accueil')} className="brand">
              <img className="logo" src="/assets/logo-blanc.png" alt="Florestan Investment Management" />
            </Link>
            <p className="about">
              {t("Société de gestion dédiée à l'investissement dans le Private Equity européen et les fonds de continuation.")}
            </p>
          </div>
          <div>
            <h4>Navigation</h4>
            <ul>
              <li><Link href={p('accueil')}>{t('Accueil')}</Link></li>
              <li><Link href={p('strategie')}>{t('Notre Stratégie')}</Link></li>
              <li><Link href={p('fc1')}>FC1</Link></li>
              <li><Link href={p('fc2')}>FC2</Link></li>
              <li><Link href={p('equipe')}>{t('Notre équipe')}</Link></li>
              <li><Link href={p('actualites')}>{t('Actualités')}</Link></li>
            </ul>
          </div>
          <div>
            <h4>{t('Informations')}</h4>
            <ul>
              <li><Link href={p('contact')}>{t('Contact')}</Link></li>
              <li><Link href={p('espace')}>{t('Espace Personnel')}</Link></li>
              <li><Link href={p('avertissement')}>{t('Avertissement')}</Link></li>
              <li><Link href={p('mentions')}>{t('Mentions Légales')}</Link></li>
              <li><Link href={p('confidentialite')}>{t('Confidentialité')}</Link></li>
            </ul>
            <p className="about" style={{ marginTop: 22 }}>
              {ORG.street}, {ORG.postalCode} {ORG.city}
            </p>
          </div>
        </div>

        <p className="f-legal">
          {t("Avertissement — Les informations présentées sur ce site ne constituent ni une offre de souscription, ni un conseil en investissement. Investir dans les fonds comporte un risque de perte en capital et un risque d'illiquidité. Les performances passées ne préjugent pas des performances futures.")}
        </p>

        <div className="f-bot">
          <span>© {year} {t('Florestan Investment Management. Tous droits réservés.')}</span>
          <span>
            <Link href={p('mentions')}>{t('Mentions Légales')}</Link>
            {' · '}
            <Link href={p('confidentialite')}>{t('Confidentialité')}</Link>
          </span>
        </div>
      </div>
    </footer>
  )
}
