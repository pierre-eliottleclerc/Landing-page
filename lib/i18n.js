import { DICT } from '@/data/translations.js'

export const LANGS = ['fr', 'en']
export const DEFAULT_LANG = 'fr'

// Normalisation (apostrophes courbes → droites, espaces multiples) pour un
// matching robuste entre le texte source et les clés du dictionnaire.
const norm = (s) => (s || '').replace(/[’‘ʼ]/g, "'").replace(/\s+/g, ' ').trim()

const NDICT = {}
for (const k in DICT) NDICT[norm(k)] = DICT[k]

/**
 * Fabrique la fonction de traduction pour une langue donnée.
 *
 * Différence essentielle avec le portage React précédent : `lang` vient du
 * paramètre de route, pas d'un `useState`. La traduction est donc résolue au
 * build et le HTML anglais est réellement pré-rendu — c'est ce qui rend la
 * version EN indexable par les moteurs.
 */
export function makeT(lang) {
  if (lang === 'en') return (s) => NDICT[norm(s)] ?? s
  return (s) => s
}
