import { SITE_URL } from '@/lib/site.js'
import { pathFor } from '@/lib/routes.js'

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // L'espace investisseurs est privé : inutile de le proposer aux moteurs.
        disallow: [pathFor('espace', 'fr'), pathFor('espace', 'en')],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
