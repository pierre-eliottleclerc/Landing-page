/** @type {import('next').NextConfig} */
const nextConfig = {
  // Pas de `output: 'export'` : on garde la possibilité d'ajouter des routes API
  // (nécessaires pour l'espace investisseur adossé à Google Drive).
  // Les pages restent malgré tout pré-générées en HTML au build (SSG).
  async redirects() {
    return [
      // La racine sert le français. Redirection permanente pour ne pas diluer le SEO.
      { source: '/', destination: '/fr', permanent: true },
    ]
  },
}

export default nextConfig
