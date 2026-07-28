// Constantes du site. `SITE_URL` doit correspondre au domaine de production :
// il sert à construire les URL canoniques, les alternates hreflang et le sitemap.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://florestan-im.com'

export const ORG = {
  name: 'Florestan IM',
  legalName: 'Florestan IM SAS',
  email: 'contact@florestan-im.com',
  street: '250bis rue du Faubourg Saint-Honoré',
  postalCode: '75008',
  city: 'Paris',
  country: 'FR',
  logo: '/assets/logo-blanc.png',
  // Image de partage social (OG). Reprend le visuel de l'accueil.
  ogImage: '/assets/card-fc2.png',
}
