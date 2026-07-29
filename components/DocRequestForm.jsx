'use client'

import { useState } from 'react'
import { makeT } from '@/lib/i18n.js'
import { ORG } from '@/lib/site.js'

// Message envoyé lorsque le visiteur laisse le champ libre vide. `{fonds}` et
// `{nom}` sont substitués. La chaîne entière est traduite : la normalisation du
// dictionnaire tolère les retours à la ligne dans les clés.
const MESSAGE_PAR_DEFAUT =
  "Bonjour,\n\nJe serais intéressé de recevoir plus d'informations sur {fonds}.\n\nBien à vous,\n{nom}"

/**
 * Bouton de demande de documentation, replié par défaut, qui déploie un
 * formulaire et ouvre la messagerie du visiteur — même procédé que la page
 * Contact, sans envoi serveur.
 *
 * Composant client isolé volontairement : la page de fonds reste rendue côté
 * serveur, seul ce bloc est interactif.
 */
export default function DocRequestForm({ lang, fundName, label }) {
  const t = makeT(lang)
  const [open, setOpen] = useState(false)
  const [champs, setChamps] = useState({ prenom: '', nom: '', email: '', message: '' })
  const [erreur, setErreur] = useState(null)

  const maj = (cle) => (e) => setChamps({ ...champs, [cle]: e.target.value })

  const envoyer = (e) => {
    e.preventDefault()
    const prenom = champs.prenom.trim()
    const nom = champs.nom.trim()
    const email = champs.email.trim()
    const message = champs.message.trim()

    if (!prenom || !nom || !email) {
      setErreur(t('Merci de compléter tous les champs.'))
      return
    }
    setErreur(null)

    const sujet = t('Demande de documentation') + ' — ' + fundName + ' — ' + prenom + ' ' + nom
    const corps = message || t(MESSAGE_PAR_DEFAUT)
      .replace('{fonds}', fundName)
      .replace('{nom}', prenom + ' ' + nom)

    window.location.href =
      `mailto:${ORG.email}?subject=` + encodeURIComponent(sujet) + '&body=' + encodeURIComponent(corps)
  }

  return (
    <>
      <button
        type="button"
        className="btn dark"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        {t(label)}
      </button>

      {open && (
        <div className="lp-panel" style={{ marginTop: 26, marginLeft: 0 }}>
          <h3>{t('Demander la documentation')}</h3>
          {erreur && <p className="note" style={{ color: '#b33', marginBottom: 12 }} role="alert">{erreur}</p>}
          <form className="form" onSubmit={envoyer} noValidate>
            <div className="f2">
              <div className="field">
                <label htmlFor="doc-fn">{t('Prénom')}</label>
                <input id="doc-fn" autoComplete="given-name" required
                  value={champs.prenom} onChange={maj('prenom')} />
              </div>
              <div className="field">
                <label htmlFor="doc-ln">{t('Nom')}</label>
                <input id="doc-ln" autoComplete="family-name" required
                  value={champs.nom} onChange={maj('nom')} />
              </div>
            </div>
            <div className="field">
              <label htmlFor="doc-em">E-mail</label>
              <input id="doc-em" type="email" autoComplete="email" required
                value={champs.email} onChange={maj('email')} />
            </div>
            <div className="field">
              <label htmlFor="doc-ms">{t('Message')} <span className="opt">{t('(facultatif)')}</span></label>
              <textarea id="doc-ms" value={champs.message} onChange={maj('message')} />
            </div>
            <div>
              <button className="btn dark" type="submit">{t('Envoyer la demande')}</button>
              <p className="note" style={{ marginTop: 14 }}>
                {t("Votre messagerie va s'ouvrir avec un message pré-rempli à destination de Florestan IM.")}
              </p>
            </div>
          </form>
        </div>
      )}
    </>
  )
}
