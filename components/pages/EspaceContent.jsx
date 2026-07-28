'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { makeT } from '@/lib/i18n.js'
import { supabase, supabaseConfigured, DOCUMENTS_BUCKET, SIGNED_URL_TTL } from '@/lib/supabase.js'
import { ORG } from '@/lib/site.js'

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
  // `useMemo` est indispensable ici, pas cosmétique : `makeT` renvoie une
  // nouvelle fonction à chaque appel. Sans mémoïsation, `load` change
  // d'identité à chaque rendu, l'effet qui l'appelle se redéclenche, l'état
  // change, un nouveau rendu suit — boucle infinie, avec une requête Supabase
  // à chaque tour.
  const t = useMemo(() => makeT(lang), [lang])
  const locale = lang === 'en' ? 'en-GB' : 'fr-FR'

  const [session, setSession] = useState(null)
  const [ready, setReady] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [showPwForm, setShowPwForm] = useState(false)
  const [pwChanged, setPwChanged] = useState(false)
  const [showRequest, setShowRequest] = useState(false)
  const [req, setReq] = useState({ prenom: '', nom: '', email: '' })
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

  // On dépend de l'adresse (une chaîne) et non de l'objet session : Supabase en
  // émet un nouveau à chaque rafraîchissement de jeton, ce qui relancerait un
  // chargement complet sans raison.
  const userEmail = session?.user?.email?.toLowerCase() ?? null

  useEffect(() => {
    if (userEmail) load(userEmail)
  }, [userEmail, load])

  // --- Actions ---
  // Connexion par email + mot de passe. Aucun email n'est envoyé, ni à la
  // connexion ni ailleurs : le projet n'a pas de SMTP configuré, et c'est
  // volontaire. Les comptes sont créés par Florestan IM depuis le tableau de
  // bord Supabase, avec « Auto Confirm User » activé.
  const signIn = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error: e2 } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    })
    setLoading(false)
    if (e2) {
      // Message volontairement identique pour un email inconnu et un mot de
      // passe faux : on n'indique pas à un tiers si une adresse est enregistrée.
      setError(t('Adresse email ou mot de passe incorrect.'))
    } else {
      setPassword('')
    }
  }

  // Changement de mot de passe en session. Permet à l'investisseur de remplacer
  // le mot de passe initial transmis par Florestan IM, sans passer par un email.
  const changePassword = async (e) => {
    e.preventDefault()
    setError(null)
    if (newPassword.length < 10) {
      setError(t('Le mot de passe doit comporter au moins 10 caractères.'))
      return
    }
    setLoading(true)
    const { error: e2 } = await supabase.auth.updateUser({ password: newPassword })
    setLoading(false)
    if (e2) setError(e2.message)
    else {
      setNewPassword('')
      setPwChanged(true)
      setShowPwForm(false)
    }
  }

  // Demande d'accès : ouvre la messagerie de l'utilisateur avec un message
  // pré-rempli, comme le formulaire de la page Contact. Aucun envoi serveur.
  const sendRequest = (e) => {
    e.preventDefault()
    const prenom = req.prenom.trim()
    const nom = req.nom.trim()
    const mail = req.email.trim()
    if (!prenom || !nom || !mail) {
      setError(t('Merci de compléter tous les champs.'))
      return
    }
    setError(null)
    const sujet = t("Demande d'accès à l'espace investisseur") + ' — ' + prenom + ' ' + nom
    const corps =
      t('Bonjour, je souhaiterais avoir accès à mon espace personnel investisseur.') + '\n\n' +
      t('Prénom') + ' : ' + prenom + '\n' +
      t('Nom') + ' : ' + nom + '\n' +
      'E-mail : ' + mail + '\n'
    window.location.href =
      `mailto:${ORG.email}?subject=` + encodeURIComponent(sujet) + '&body=' + encodeURIComponent(corps)
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
    setPassword('')
    setNewPassword('')
    setShowPwForm(false)
    setPwChanged(false)
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
        <form className="form" onSubmit={signIn} noValidate>
          <div className="field">
            <label htmlFor="lp-email">{t('Votre adresse email')}</label>
            <input
              id="lp-email" type="email" autoComplete="email" required
              value={email} onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="lp-pw">{t('Mot de passe')}</label>
            <input
              id="lp-pw" type="password" autoComplete="current-password" required
              value={password} onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <button className="btn dark" type="submit" disabled={loading}>
              {loading ? t('Connexion…') : t('Se connecter')}
            </button>
            {/* Pas de lien « mot de passe oublié » : il enverrait un email, or
                aucun SMTP n'est configuré. Un bouton qui échoue en silence
                serait pire que son absence. */}
            <p className="note" style={{ marginTop: 14 }}>
              {t('Vos identifiants vous sont fournis par Florestan IM. En cas de perte, écrivez-nous à contact@florestan-im.com.')}
            </p>
          </div>
        </form>

        <div className="lp-sep">
          <span>{t("Pas encore d'accès ?")}</span>
          <button type="button" className="lp-link" onClick={() => setShowRequest((v) => !v)}>
            {t("Demande d'accès")}
          </button>
        </div>

        {showRequest && (
          <form className="form" onSubmit={sendRequest} noValidate style={{ marginTop: 22 }}>
            <div className="f2">
              <div className="field">
                <label htmlFor="rq-fn">{t('Prénom')}</label>
                <input
                  id="rq-fn" autoComplete="given-name" required
                  value={req.prenom} onChange={(e) => setReq({ ...req, prenom: e.target.value })}
                />
              </div>
              <div className="field">
                <label htmlFor="rq-ln">{t('Nom')}</label>
                <input
                  id="rq-ln" autoComplete="family-name" required
                  value={req.nom} onChange={(e) => setReq({ ...req, nom: e.target.value })}
                />
              </div>
            </div>
            <div className="field">
              <label htmlFor="rq-em">E-mail</label>
              <input
                id="rq-em" type="email" autoComplete="email" required
                value={req.email} onChange={(e) => setReq({ ...req, email: e.target.value })}
              />
            </div>
            <div>
              <button className="btn dark" type="submit">{t('Envoyer la demande')}</button>
              <p className="note" style={{ marginTop: 14 }}>
                {t('Votre messagerie va s\'ouvrir avec un message pré-rempli à destination de Florestan IM.')}
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
          <div className="lp-actions">
            <button className="btn-ghost dark" type="button" onClick={() => setShowPwForm((v) => !v)}>
              {t('Changer mon mot de passe')}
            </button>
            <button className="btn dark" type="button" onClick={signOut}>
              {t('Se déconnecter')}
            </button>
          </div>
        </div>

        {pwChanged && (
          <p className="lp-ok" role="status">{t('Votre mot de passe a été modifié.')}</p>
        )}

        {showPwForm && (
          <div className="lp-panel" style={{ marginBottom: 34 }}>
            <h3>{t('Changer mon mot de passe')}</h3>
            <form className="form" onSubmit={changePassword} noValidate>
              <div className="field">
                <label htmlFor="lp-newpw">{t('Nouveau mot de passe')}</label>
                <input
                  id="lp-newpw" type="password" autoComplete="new-password" required minLength={10}
                  value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div>
                <button className="btn dark" type="submit" disabled={loading}>
                  {t('Enregistrer')}
                </button>
                <p className="note" style={{ marginTop: 14 }}>
                  {t('Au moins 10 caractères. Nous vous recommandons de remplacer le mot de passe initial qui vous a été transmis.')}
                </p>
              </div>
            </form>
          </div>
        )}

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
