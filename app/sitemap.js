import { SITE_URL } from '@/lib/site.js'
import { PAGES, pathFor } from '@/lib/routes.js'
import { LANGS } from '@/lib/i18n.js'

// Sitemap généré automatiquement depuis le registre de pages : pas de liste à
// maintenir à la main. Chaque entrée déclare ses alternates de langue, ce qui
// aide Google à associer les versions FR et EN d'une même page.
export default function sitemap() {
  const entries = []

  for (const p of PAGES) {
    if (p.noindex) continue

    const languages = {}
    for (const l of LANGS) languages[l] = `${SITE_URL}${pathFor(p.key, l)}`

    for (const lang of LANGS) {
      entries.push({
        url: `${SITE_URL}${pathFor(p.key, lang)}`,
        changeFrequency: p.key === 'actualites' ? 'monthly' : 'yearly',
        priority: p.key === 'accueil' ? 1 : p.key === 'strategie' || p.key === 'fc2' ? 0.9 : 0.6,
        alternates: { languages },
      })
    }
  }

  return entries
}
