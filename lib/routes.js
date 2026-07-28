import { LANGS } from './i18n.js'

/**
 * Registre des pages du site.
 *
 * Chaque page a un slug propre à chaque langue : c'est ce qui permet d'avoir
 * /en/strategy plutôt que /en/strategie — les moteurs indexent mieux des URL
 * dans la langue du contenu. La page d'accueil a un slug vide.
 *
 * `noindex` exclut la page des moteurs et du sitemap (espace privé).
 */
export const PAGES = [
  { key: 'accueil',         fr: '',                  en: '' },
  { key: 'strategie',       fr: 'strategie',         en: 'strategy' },
  { key: 'fc1',             fr: 'fc1',               en: 'fc1' },
  { key: 'fc2',             fr: 'fc2',               en: 'fc2' },
  { key: 'equipe',          fr: 'equipe',            en: 'team' },
  { key: 'actualites',      fr: 'actualites',        en: 'news' },
  { key: 'contact',         fr: 'contact',           en: 'contact' },
  { key: 'espace',          fr: 'espace-personnel',  en: 'investor-portal', noindex: true },
  { key: 'mentions',        fr: 'mentions-legales',  en: 'legal-notice' },
  { key: 'confidentialite', fr: 'confidentialite',   en: 'privacy-policy' },
  { key: 'avertissement',   fr: 'avertissement',     en: 'disclaimer' },
]

export const pageByKey = (key) => PAGES.find((p) => p.key === key)

/** Chemin absolu d'une page dans une langue : ('strategie','en') → '/en/strategy' */
export function pathFor(key, lang) {
  const p = pageByKey(key)
  if (!p) return `/${lang}`
  const slug = p[lang]
  return slug ? `/${lang}/${slug}` : `/${lang}`
}

/** Résout un slug d'URL vers une clé de page. `undefined` pour l'accueil. */
export function keyFromSlug(slugSegments, lang) {
  const slug = (slugSegments || []).join('/')
  const p = PAGES.find((x) => x[lang] === slug)
  return p ? p.key : null
}

/** Toutes les combinaisons langue × page, pour generateStaticParams et le sitemap. */
export function allRoutes() {
  const out = []
  for (const lang of LANGS) {
    for (const p of PAGES) {
      out.push({ lang, key: p.key, slug: p[lang], noindex: !!p.noindex })
    }
  }
  return out
}
