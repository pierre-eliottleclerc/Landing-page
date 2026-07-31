import { SITE_URL, ORG } from './site.js'
import { pageByKey, pathFor } from './routes.js'
import { LANGS } from './i18n.js'

/**
 * Titre et description rédigés page par page et langue par langue.
 *
 * C'est l'apport SEO principal par rapport au site en une seule page : chaque
 * URL sert désormais son propre <title> et sa propre meta description dans le
 * HTML livré, sans dépendre du JavaScript.
 */
const META = {
  accueil: {
    fr: {
      title: 'Florestan — Private Equity européen & fonds de continuation',
      description:
        "Société de gestion spécialisée dans les fonds de continuation single asset en Europe. Un accès privilégié aux meilleurs gérants européens de Private Equity.",
    },
    en: {
      title: 'Florestan — European Private Equity & Continuation Funds',
      description:
        'Investment firm specialising in single-asset continuation funds in Europe, offering privileged access to leading European private equity managers.',
    },
  },
  strategie: {
    fr: {
      title: 'Notre stratégie — Fonds de continuation single asset | Florestan',
      description:
        "Une stratégie centrée sur les fonds de continuation single asset : entreprises matures et rentables (EBITDA > 20 M€) en Europe, sur un marché de plus de 100 Md$ en croissance de 25 % par an.",
    },
    en: {
      title: 'Our Strategy — Single-Asset Continuation Funds | Florestan',
      description:
        'A strategy focused on single-asset continuation funds: mature, profitable European companies (EBITDA above €20m), in a market exceeding $100bn and growing 25% a year.',
    },
  },
  fc1: {
    fr: {
      title: 'Florestan Continuity 1 (FC1) — FPCI fonds de continuation | Florestan',
      description:
        "FC1, FPCI lancé en 2024 et aujourd'hui clôturé. Durée de 6 ans, classification SFDR Article 8, objectif de TRI net investisseur de 17 %.",
    },
    en: {
      title: 'Florestan Continuity 1 (FC1) — Continuation Fund | Florestan',
      description:
        'FC1, a French FPCI launched in 2024 and now closed. Six-year term, SFDR Article 8 classification, 17% target net investor IRR.',
    },
  },
  fc2: {
    fr: {
      title: "Florestan Continuity 2 (FC2) — FPCI en cours d'investissement | Florestan",
      description:
        "FC2, FPCI lancé en 2026 et en cours d'investissement. Durée de 6 ans, SFDR Article 8, parts spéciales remploi-cession, objectif de TRI net investisseur de 17 %.",
    },
    en: {
      title: 'Florestan Continuity 2 (FC2) — Currently Investing | Florestan',
      description:
        'FC2, a French FPCI launched in 2026 and currently investing. Six-year term, SFDR Article 8 classification, 17% target net investor IRR.',
    },
  },
  equipe: {
    fr: {
      title: 'Notre équipe | Florestan',
      description:
        "Une équipe intégrée de professionnels du Private Equity aux expertises complémentaires : sourcing propriétaire, analyse actif par actif et structuration.",
    },
    en: {
      title: 'Our Team | Florestan',
      description:
        'An integrated team of private equity professionals with complementary expertise across proprietary sourcing, asset-by-asset analysis and structuring.',
    },
  },
  actualites: {
    fr: {
      title: 'Actualités | Florestan',
      description:
        'Les dernières nouvelles de Florestan : opérations réalisées, fonds de continuation et sociétés en portefeuille.',
    },
    en: {
      title: 'News | Florestan',
      description:
        'The latest from Florestan: completed transactions, continuation funds and portfolio companies.',
    },
  },
  contact: {
    fr: {
      title: 'Contact | Florestan',
      description:
        "Échangeons sur votre allocation en Private Equity. Florestan — 250bis rue du Faubourg Saint-Honoré, 75008 Paris.",
    },
    en: {
      title: 'Contact | Florestan',
      description:
        "Let's discuss your private equity allocation. Florestan — 250bis rue du Faubourg Saint-Honoré, 75008 Paris.",
    },
  },
  espace: {
    fr: {
      title: 'Espace investisseurs | Florestan',
      description: 'Accès sécurisé aux documents mis à disposition des investisseurs de Florestan.',
    },
    en: {
      title: 'Investor Portal | Florestan',
      description: 'Secure access to documents made available to Florestan investors.',
    },
  },
  mentions: {
    fr: {
      title: 'Mentions légales | Florestan',
      description:
        "Mentions légales de Florestan : identification de la société, coordonnées, hébergement et informations réglementaires (ORIAS 24007087).",
    },
    en: {
      title: 'Legal Notice | Florestan',
      description:
        'Legal notice for Florestan: company identification, contact details, hosting and regulatory information (ORIAS 24007087).',
    },
  },
  confidentialite: {
    fr: {
      title: 'Politique de confidentialité | Florestan',
      description:
        'Comment Florestan collecte, utilise et protège vos données personnelles, conformément au RGPD.',
    },
    en: {
      title: 'Privacy Policy | Florestan',
      description:
        'How Florestan collects, uses and protects your personal data, in accordance with the GDPR.',
    },
  },
  avertissement: {
    fr: {
      title: 'Avertissement | Florestan',
      description:
        "Avertissement sur les risques : les informations du site ne constituent ni une offre de souscription ni un conseil en investissement.",
    },
    en: {
      title: 'Disclaimer | Florestan',
      description:
        'Risk warning: information on this site constitutes neither an offer to subscribe nor investment advice.',
    },
  },
}

/** Construit l'objet `metadata` de Next.js pour une page et une langue. */
export function metadataFor(key, lang) {
  const m = META[key]?.[lang] ?? META.accueil[lang]
  const page = pageByKey(key)
  const canonical = pathFor(key, lang)

  // hreflang croisé : chaque page pointe vers sa jumelle dans l'autre langue.
  // x-default désigne la version servie par défaut (le français).
  const languages = {}
  for (const l of LANGS) languages[l] = pathFor(key, l)
  languages['x-default'] = pathFor(key, 'fr')

  return {
    title: m.title,
    description: m.description,
    alternates: { canonical, languages },
    openGraph: {
      type: 'website',
      siteName: ORG.name,
      locale: lang === 'en' ? 'en_GB' : 'fr_FR',
      url: `${SITE_URL}${canonical}`,
      title: m.title,
      description: m.description,
      images: [{ url: ORG.ogImage, width: 1200, height: 630, alt: m.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: m.title,
      description: m.description,
      images: [ORG.ogImage],
    },
    // L'espace investisseurs n'a aucun intérêt à être indexé.
    robots: page?.noindex ? { index: false, follow: false } : { index: true, follow: true },
  }
}

/** Données structurées Organization, injectées une fois sur la page d'accueil. */
export function organizationJsonLd(lang) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FinancialService',
    name: ORG.name,
    // Rattache les recherches « Florestan IM » et « Florestan Capital » à ce
    // site : la société est connue sous plusieurs appellations, et sans cette
    // déclaration Google n'a aucun élément pour faire le lien.
    alternateName: ORG.alternateNames,
    legalName: ORG.legalName,
    url: `${SITE_URL}${pathFor('accueil', lang)}`,
    logo: `${SITE_URL}${ORG.logo}`,
    email: ORG.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: ORG.street,
      postalCode: ORG.postalCode,
      addressLocality: ORG.city,
      addressCountry: ORG.country,
    },
    description: META.accueil[lang].description,
    areaServed: 'Europe',
  }
}
