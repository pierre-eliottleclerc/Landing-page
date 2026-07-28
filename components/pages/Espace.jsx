import { makeT } from '@/lib/i18n.js'
import { DRIVE_FOLDER_ID } from '@/lib/site.js'

// Page portée telle quelle depuis le site HTML.
//
// ⚠️ Limite connue et NON résolue : le dossier Drive est privé, Google renvoie
// donc un 401 dans le cadre intégré et les fichiers ne s'affichent pas. Seul le
// bouton « Ouvrir dans Google Drive » fonctionne. Deux pistes possibles :
//   1. partager le dossier plus largement (lien, ou domaine Workspace) ;
//   2. remplacer le cadre par une liste maison alimentée par une route API et
//      un compte de service Google — c'est ce que permet la conservation des
//      routes serverless dans ce projet (pas de `output: 'export'`).
export default function Espace({ lang }) {
  const t = makeT(lang)

  return (
    <>
      <section
        className="pg-hero tight"
        style={{ padding: '110px 0', background: 'linear-gradient(140deg,var(--navy) 0%,var(--teal) 100%)' }}
      >
        <div className="wrap">
          <p className="eyebrow rv">{t('Espace Personnel')}</p>
          <h1 className="rv" style={{ fontSize: 'clamp(2.1rem,4.2vw,3.4rem)' }}>
            {t('Espace investisseurs')}
          </h1>
          <div className="rule rv"></div>
          <p className="rv" style={{ maxWidth: '56ch', color: 'rgba(255,255,255,.8)' }}>
            {t("Retrouvez les documents mis à votre disposition par Florestan IM. L'accès requiert un compte Google autorisé.")}
          </p>
        </div>
      </section>

      <section className="tight">
        <div className="wrap">
          <div className="drive-wrap rv">
            <iframe
              className="drive-frame"
              src={`https://drive.google.com/embeddedfolderview?id=${DRIVE_FOLDER_ID}#grid`}
              title={t('Documents Florestan IM')}
              loading="lazy"
            ></iframe>
          </div>
          <div className="rv" style={{ textAlign: 'center', marginTop: 26 }}>
            <a
              className="btn dark"
              href={`https://drive.google.com/drive/folders/${DRIVE_FOLDER_ID}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('Ouvrir dans Google Drive')}
            </a>
            <p className="note" style={{ marginTop: 14 }}>
              {t('Connectez-vous avec le compte Google autorisé pour accéder aux documents.')}
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
