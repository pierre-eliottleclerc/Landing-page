'use client'

import { useCallback, useEffect, useState } from 'react'
import { makeT } from '@/lib/i18n.js'
import { supabase, supabaseConfigured, DOCUMENTS_BUCKET, SIGNED_URL_TTL } from '@/lib/supabase.js'

// Ce module isole tout ce qui dépend du client Supabase (~65 ko). Il est chargé
// à la demande par Espace.jsx : les autres pages du site ne l'embarquent pas.

// Entrées techniques que Supabase Storage renvoie et qu'il ne faut pas afficher :
// les dossiers (id null) et le fichier témoin des dossiers vides.
const isRealFile = (o) => o && o.id !== null && o.name !== '.emptyFolderPlaceholder'

const formatSize = (bytes) => {
  if (!bytes) return ''
  return bytes >= 1024 * 1024
    ? (bytes / (1024 * 1024)).toFixed(1) + ' Mo'
    : Math.max(1, Math.round(bytes / 1024)) + ' Ko'
}

export default function EspaceContent({ lang }) {
  const t = makeT(lang)
  const locale = lang === 'en' ? 'en-GB' : 'fr-FR'

  const [session, setSession] = useState(null)
  const [ready, setReady] = useState(false)
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [investor, setInvestor] = useState(null)   // null = aucune fiche investisseur
  const [groups, setGroups] = useState([])         // [{ title, prefix, files }]

  // --- Session ---
  useEffect(() => {
    if (!supabase) { setReady(true); return }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null)
      setReady(true)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])

  // --- Chargement des documents ---
  // On ne demande jamais « tous les documents » : on liste les dossiers auxquels
  // la session donne droit. Et même si cette page se trompait, c'est le RLS de
  // Postgres qui tranche — elle ne peut pas élargir ses propres droits.
  const load = useCallback(async (userEmail) => {
    setLoading(true)
    setError(null)
    try {
      // Fiche investisseur : sa présence conditionne tout le reste.
      const { data: me } = await supabase
        .from('investors').select('full_name').maybeSingle()
      setInvestor(me ?? null)
      if (!me) { setGroups([]); return }

      // Fonds auxquels cet investisseur a droit (liste filtrée par le RLS).
      const { data: funds, error: fundsErr } = await supabase
        .from('funds').select('code, name').order('code')
      if (fundsErr) throw fundsErr

      const next = []

      for (const fund of funds ?? []) {
        const { data, error: e } = await supabase.storage
          .from(DOCUMENTS_BUCKET)
          .list(`fonds/${fund.code}`, { limit: 200, sortBy: { column: 'name', order: 'desc' } })
        if (e) throw e
        const files = (data ?? []).filter(isRealFile)
        if (files.length) next.push({ title: fund.name, prefix: `fonds/${fund.code}`, files })
      }

      // Documents nominatifs — indépendants des fonds.
      const { data: personal } = await supabase.storage
        .from(DOCUMENTS_BUCKET)
        .list(`investisseurs/${userEmail}`, { limit: 200, sortBy: { column: 'name', order: 'desc' } })
      const personalFiles = (personal ?? []).filter(isRealFile)
      if (personalFiles.length) {
        next.push({
          title: t('Vos documents personnels'),
          prefix: `investisseurs/${userEmail}`,
          files: personalFiles,
        })
      }

      setGroups(next)
    } catch (err) {
      setError(err.message ?? String(err))
    } finally {
      setLoading(false)
    }
  }, [t])

  useEffect(() => {
    if (session?.user?.email) load(session.user.email.toLowerCase())
  }, [session, load])

  // --- Actions ---
  const sendLink = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error: e2 } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: { emailRedirectTo: window.location.href },
    })
    setLoading(false)
    if (e2) setError(e2.message)
    else setSent(true)
  }

  const open = async (prefix, name) => {
    setError(null)
    const { data, error: e } = await supabase.storage
      .from(DOCUMENTS_BUCKET)
      .createSignedUrl(`${prefix}/${name}`, SIGNED_URL_TTL)
    if (e) { setError(t("Ce document n'est pas accessible avec votre compte.")); return }
    window.open(data.signedUrl, '_blank', 'noopener,noreferrer')
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setGroups([])
    setInvestor(null)
    setSent(false)
  }

  // --- Rendu ---
  let body

  if (!supabaseConfigured) {
    body = (
      <div className="lp-panel">
        <h3>{t('Espace non configuré')}</h3>
        <p className="note">
          {t("Les variables d'environnement Supabase ne sont pas définies sur cet environnement.")}
        </p>
      </div>
    )
  } else if (!ready) {
    body = <div className="lp-panel"><p className="note">{t('Chargement…')}</p></div>
  } else if (!session) {
    body = (
      <div className="lp-panel">
        <h3>{t('Connexion')}</h3>
        {sent ? (
          <p className="note" role="status">
            {t('Un lien de connexion vient de vous être envoyé. Ouvrez-le depuis cet appareil pour accéder à vos documents.')}
          </p>
        ) : (
          <form className="form" onSubmit={sendLink} noValidate>
            <div className="field">
              <label htmlFor="lp-email">{t('Votre adresse email')}</label>
              <input
                id="lp-email" type="email" autoComplete="email" required
                value={email} onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <button className="btn dark" type="submit" disabled={loading}>
                {loading ? t('Envoi…') : t("Recevoir mon lien d'accès")}
              </button>
              <p className="note" style={{ marginTop: 14 }}>
                {t('Seules les adresses enregistrées par Florestan IM peuvent accéder à cet espace.')}
              </p>
            </div>
          </form>
        )}
      </div>
    )
  } else if (!investor) {
    // Session valide mais aucune fiche investisseur : le compte existe, les droits
    // n'ont pas été ouverts. On le dit clairement plutôt que d'afficher du vide.
    body = (
      <div className="lp-panel">
        <h3>{t('Accès non activé')}</h3>
        <p className="note">
          {t('Votre compte est bien authentifié, mais aucun document ne vous est encore attribué. Écrivez-nous à contact@florestan-im.com.')}
        </p>
        <button className="btn dark" type="button" onClick={signOut} style={{ marginTop: 18 }}>
          {t('Se déconnecter')}
        </button>
      </div>
    )
  } else {
    body = (
      <>
        <div className="lp-head">
          <div>
            <p className="eyebrow">{t('Connecté')}</p>
            <h3>{investor.full_name}</h3>
          </div>
          <button className="btn dark" type="button" onClick={signOut}>
            {t('Se déconnecter')}
          </button>
        </div>

        {loading && <p className="note">{t('Chargement…')}</p>}

        {!loading && groups.length === 0 && (
          <div className="lp-panel">
            <p className="note">{t('Aucun document disponible pour le moment.')}</p>
          </div>
        )}

        {groups.map((g) => (
          <div className="lp-group" key={g.prefix}>
            <h4>{g.title}</h4>
            <ul className="lp-list">
              {g.files.map((f) => (
                <li key={f.name}>
                  <button type="button" onClick={() => open(g.prefix, f.name)}>
                    <span className="n">{f.name}</span>
                    <span className="m">
                      {[
                        formatSize(f.metadata?.size),
                        f.updated_at ? new Date(f.updated_at).toLocaleDateString(locale) : null,
                      ].filter(Boolean).join(' · ')}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </>
    )
  }

  return (
    <>
      {error && <p className="lp-error" role="alert">{error}</p>}
      {body}
    </>
  )
}
