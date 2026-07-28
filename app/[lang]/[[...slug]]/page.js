import { notFound } from 'next/navigation'
import { LANGS } from '@/lib/i18n.js'
import { PAGES, keyFromSlug } from '@/lib/routes.js'
import { metadataFor, organizationJsonLd } from '@/lib/seo.js'

import Home from '@/components/pages/Home.jsx'
import Strategy from '@/components/pages/Strategy.jsx'
import Fund from '@/components/pages/Fund.jsx'
import Team from '@/components/pages/Team.jsx'
import News from '@/components/pages/News.jsx'
import Contact from '@/components/pages/Contact.jsx'
import Legal from '@/components/pages/Legal.jsx'
import Espace from '@/components/pages/Espace.jsx'

// Une seule route attrape-tout sert les 11 pages × 2 langues. Le slug est
// résolu vers une clé de page via le registre, ce qui permet des URL
// localisées (/fr/strategie, /en/strategy) sans dupliquer l'arborescence.
export function generateStaticParams() {
  const params = []
  for (const lang of LANGS) {
    for (const p of PAGES) {
      // Slug vide (accueil) → pas de segment, la route optionnelle l'accepte.
      params.push({ lang, slug: p[lang] ? [p[lang]] : [] })
    }
  }
  return params
}

export async function generateMetadata({ params }) {
  const { lang, slug } = await params
  if (!LANGS.includes(lang)) return {}
  const key = keyFromSlug(slug, lang)
  if (!key) return {}
  return metadataFor(key, lang)
}

export default async function Page({ params }) {
  const { lang, slug } = await params
  if (!LANGS.includes(lang)) notFound()

  const key = keyFromSlug(slug, lang)
  if (!key) notFound()

  // On ne passe que `lang` : une fonction ne peut pas franchir la frontière
  // serveur → client en React Server Components. Chaque page fabrique son `t`.
  const props = { lang }

  const content = (() => {
    switch (key) {
      case 'accueil':         return <Home {...props} />
      case 'strategie':       return <Strategy {...props} />
      case 'fc1':             return <Fund {...props} fund="fc1" />
      case 'fc2':             return <Fund {...props} fund="fc2" />
      case 'equipe':          return <Team {...props} />
      case 'actualites':      return <News {...props} />
      case 'contact':         return <Contact {...props} />
      case 'espace':          return <Espace {...props} />
      case 'mentions':        return <Legal {...props} page="mentions" />
      case 'confidentialite': return <Legal {...props} page="confidentialite" />
      case 'avertissement':   return <Legal {...props} page="avertissement" />
      default:                notFound()
    }
  })()

  return (
    <>
      {key === 'accueil' && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd(lang)) }}
        />
      )}
      {content}
    </>
  )
}
