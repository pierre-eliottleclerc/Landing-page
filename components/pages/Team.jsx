import { makeT } from '@/lib/i18n.js'
import { TEAM } from '@/data/team.js'

const LI = (
  <svg viewBox="0 0 24 24">
    <path d="M4.98 3.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05C20.5 8.65 21 11.1 21 14.2V21h-4v-6c0-1.43-.03-3.28-2-3.28-2 0-2.3 1.56-2.3 3.17V21H9z" />
  </svg>
)

export default function Team({ lang }) {
  const t = makeT(lang)

  return (
    <>
      <section className="pg-hero tight" style={{ padding: '118px 0' }}>
        <div className="bg-media"><img src="/assets/equipe-banner.jpg" alt="" /></div>
        <div className="wrap">
          <p className="eyebrow rv">{t('Notre équipe')}</p>
          <h1 className="rv" style={{ fontSize: 'clamp(1.9rem,3.6vw,2.9rem)', maxWidth: '24ch' }}>
            {t("Florestan est née d'une équipe intégrée de passionnés aux expertises complémentaires")}
          </h1>
          <div className="rule rv"></div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="team">
            {TEAM.map((m, i) => (
              <a
                className="member rv"
                href={m.li}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={m.n + ' — LinkedIn'}
                key={i}
              >
                <div className="photo"><img src={m.p} alt={m.n} loading="lazy" /></div>
                <div className="info">
                  <h3>{m.n}</h3>
                  <p className="role">{t(m.r)}</p>
                  <ul>{m.b.map((x, j) => <li key={j}>{t(x)}</li>)}</ul>
                  <span className="li-link">{LI} LinkedIn</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
