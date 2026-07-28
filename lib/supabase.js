import { createClient } from '@supabase/supabase-js'

/**
 * Client Supabase pour le navigateur.
 *
 * La clé publiable est volontairement exposée : c'est son rôle. La protection
 * ne vient pas du secret de la clé mais des politiques Row Level Security, qui
 * s'appliquent dans Postgres. Une erreur dans cette page ne peut donc pas
 * révéler un document — la base refuse la requête.
 *
 * La clé secrète (`sb_secret_…`) n'a rien à faire ici : elle contournerait le RLS.
 */
const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

export const supabaseConfigured = Boolean(url && publishableKey)

export const supabase = supabaseConfigured
  ? createClient(url, publishableKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        // Nécessaire pour que le retour du lien magique ouvre la session.
        detectSessionInUrl: true,
      },
    })
  : null

export const DOCUMENTS_BUCKET = 'documents'

/** Durée de vie d'une URL signée, en secondes. Volontairement courte. */
export const SIGNED_URL_TTL = 60
