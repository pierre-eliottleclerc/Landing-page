'use client'

import { useState } from 'react'
import { makeT } from '@/lib/i18n.js'
import { ORG } from '@/lib/site.js'

// Message envoyé lorsque le visiteur laisse le champ libre vide. `{prenom}` est
// remplacé par la valeur du formulaire. La chaîne entière est traduite, la
// normalisation du dictionnaire tolérant les retours à la ligne dans les clés.
const MESSAGE_PAR_DEFAUT =
  "Bonjour,\n\nJe serais intéressé par le fait de recevoir plus d'information sur Florestan.\n\nBien à vous,\n{prenom}"

export default function Contact({ lang }) {
  const t = makeT(lang)
  const [msg, setMsg] = useState(null) // { text, ok }

  // Le formulaire ouvre la messagerie de l'utilisateur (mailto) : pas d'envoi
  // serveur, conformément au choix retenu pour le site.
  const onSubmit = (e) => {
    e.preventDefault()
    const f = e.currentTarget
    if (!f.checkValidity()) {
      f.reportValidity()
      setMsg({ text: t('Merci de compléter tous les champs.'), ok: false })
      return
    }
    const prenom = f.prenom.value.trim()
    const nom = f.nom.value.trim()
    const message = f.message.value.trim()
    const sujet = t('Prise de contact') + ' — ' + prenom + ' ' + nom
    // Nom, prénom et adresse ne sont plus repris dans le corps : le message part
    // depuis la messagerie du visiteur, son adresse est donc déjà l'expéditeur,
    // et son nom figure dans l'objet.
    const corps = message || t(MESSAGE_PAR_DEFAUT).replace('{prenom}', prenom)
    window.location.href =
      `mailto:${ORG.email}?subject=` + encodeURIComponent(sujet) + '&body=' + encodeURIComponent(corps)
    setMsg({
      text: t("Votre messagerie s'ouvre pour envoyer le message à contact@florestan-im.com."),
      ok: true
    })
  }

  return (
    <>
      {/* Le dégradé reste en fond de section : il sert de repli pendant le
          chargement de la vidéo, et pour les visiteurs qui demandent la
          réduction des animations — le CSS masque alors les vidéos. */}
      <section
        className="pg-hero tight soft-media"
        style={{ padding: '118px 0', background: 'linear-gradient(140deg,var(--navy) 0%,var(--teal) 100%)' }}
      >
        <div className="bg-media">
          <video src="/assets/wave-hero.mp4" autoPlay muted loop playsInline preload="auto" />
        </div>
        <div className="wrap">
          <p className="eyebrow rv">{t('Contact')}</p>
          <h1 className="rv" style={{ fontSize: 'clamp(2.1rem,4.2vw,3.4rem)' }}>{t('Contactez-nous')}</h1>
          <div className="rule rv"></div>
          <p className="rv" style={{ maxWidth: '52ch', color: 'rgba(255,255,255,.8)' }}>
            {t("L'équipe se tient à votre disposition pour vous accompagner et répondre à vos questions.")}
          </p>
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="contact">
            <div className="contact-info rv">
              <p className="eyebrow" style={{ color: 'var(--taupe-lt)' }}>Florestan</p>
              <h3>{t('Nos coordonnées')}</h3>
              <div className="blk">
                <div className="k">{t('Adresse')}</div>
                <div className="v">{ORG.street}<br />{ORG.postalCode} {ORG.city}, France</div>
              </div>
              <div className="blk">
                <div className="k">Email</div>
                <div className="v"><a href={`mailto:${ORG.email}`}>{ORG.email}</a></div>
              </div>
            </div>

            <form className="form rv" onSubmit={onSubmit} noValidate>
              <div className="f2">
                <div className="field">
                  <label htmlFor="fn">{t('Prénom')}</label>
                  <input id="fn" name="prenom" autoComplete="given-name" required />
                </div>
                <div className="field">
                  <label htmlFor="ln">{t('Nom')}</label>
                  <input id="ln" name="nom" autoComplete="family-name" required />
                </div>
              </div>
              <div className="field">
                <label htmlFor="em">E-mail</label>
                <input id="em" type="email" name="email" autoComplete="email" required />
              </div>
              <div className="field">
                <label htmlFor="ms">{t('Message')} <span className="opt">{t('(facultatif)')}</span></label>
                <textarea id="ms" name="message" />
              </div>
              <div>
                <button className="btn dark" type="submit">{t('Envoyer')}</button>
                {msg && (
                  <p className="note" style={{ color: msg.ok ? 'var(--teal)' : '#b33' }} role="status">
                    {msg.text}
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}
