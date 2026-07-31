// Constantes du site.
//
// `SITE_URL` doit correspondre au domaine de production : il construit les URL
// canoniques, les alternates hreflang, le sitemap, le robots.txt, les balises
// Open Graph et les données structurées. Se tromper ici fausse tout d'un coup.
//
// Forme retenue : avec `www`, car c'est elle qui répond en 200 aujourd'hui —
// `florestancapital.com` nu redirige (308) vers `www`. Si la bascule vers Vercel
// se fait sur le domaine nu, changer cette valeur pour rester cohérent avec la
// redirection : servir un canonique différent de l'URL réellement atteignable
// empêche Google de consolider les signaux.
//
// Surchargeable par `NEXT_PUBLIC_SITE_URL` (utile pour les préversions Vercel).
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.florestancapital.com'

export const ORG = {
  // Nom d'usage, affiché dans les titres de page et le nom du site.
  name: 'Florestan',
  // Dénomination sociale : c'est un fait juridique, elle ne suit pas le nom
  // d'usage. Reprise telle quelle dans les mentions légales.
  legalName: 'Florestan IM SAS',
  // Autres appellations sous lesquelles la société est connue. Déclarées dans
  // les données structurées afin que Google rattache aussi les recherches
  // « Florestan IM » et « Florestan Capital » à ce site.
  alternateNames: ['Florestan IM', 'Florestan Capital'],
  email: 'contact@florestan-im.com',
  street: '250bis rue du Faubourg Saint-Honoré',
  postalCode: '75008',
  city: 'Paris',
  country: 'FR',
  logo: '/assets/logo-blanc.png',
  // Image de partage social (OG). Reprend le visuel de l'accueil.
  ogImage: '/assets/card-fc2.png',
}
