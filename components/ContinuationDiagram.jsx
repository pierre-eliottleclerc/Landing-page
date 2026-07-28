import { makeT } from '@/lib/i18n.js'

export default function ContinuationDiagram({ lang }) {
  const t = makeT(lang)
  const dur = t('4-5 ans de détention')

  return (
    <svg
      className="cf-svg"
      viewBox="0 0 1200 322"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={t("Schéma d'un fonds de continuation")}
    >
      <defs>
        <marker id="cfArr" markerWidth="7" markerHeight="7" refX="5.5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#b9c6ca" />
        </marker>
      </defs>

      {/* libellés de lignes */}
      <text x="6" y="90" fontSize="12" letterSpacing="1.4" fill="#9fb2b6">{t('SITUATION')}</text>
      <text x="6" y="106" fontSize="12" letterSpacing="1.4" fill="#9fb2b6">{t('CLASSIQUE')}</text>
      <text x="6" y="264" fontSize="12" letterSpacing="1.4" fill="#9fb2b6">{t('FONDS DE')}</text>
      <text x="6" y="280" fontSize="12" letterSpacing="1.4" fill="#9fb2b6">{t('CONTINUATION')}</text>

      {/* séparateurs pointillés */}
      <line x1="435" y1="46" x2="435" y2="150" stroke="#3f5f68" strokeWidth="1" strokeDasharray="2 4" />
      <line x1="585" y1="46" x2="585" y2="150" stroke="#3f5f68" strokeWidth="1" strokeDasharray="2 4" />
      <line x1="800" y1="46" x2="800" y2="150" stroke="#3f5f68" strokeWidth="1" strokeDasharray="2 4" />

      {/* ENTREPRISE */}
      <rect x="180" y="48" width="98" height="98" rx="2" fill="#EFF6A2" />
      <text x="229" y="101" textAnchor="middle" fontSize="12" fontWeight="700" fill="#173238">{t('ENTREPRISE')}</text>

      {/* durées */}
      <text x="360" y="74" textAnchor="middle" fontSize="11.5" fill="#c9d4d7">{dur}</text>
      <text x="510" y="74" textAnchor="middle" fontSize="11.5" fill="#c9d4d7">{dur}</text>
      <text x="660" y="74" textAnchor="middle" fontSize="11.5" fill="#c9d4d7">{dur}</text>
      <text x="875" y="74" textAnchor="middle" fontSize="11.5" fill="#c9d4d7">{dur}</text>

      {/* flèches */}
      <line x1="282" y1="90" x2="430" y2="90" stroke="#b9c6ca" strokeWidth="1.4" markerEnd="url(#cfArr)" />
      <line x1="450" y1="90" x2="578" y2="90" stroke="#b9c6ca" strokeWidth="1.4" markerEnd="url(#cfArr)" />
      <line x1="600" y1="90" x2="728" y2="90" stroke="#b9c6ca" strokeWidth="1.4" markerEnd="url(#cfArr)" />
      <line x1="815" y1="90" x2="943" y2="90" stroke="#b9c6ca" strokeWidth="1.4" markerEnd="url(#cfArr)" />
      <line x1="948" y1="90" x2="962" y2="90" stroke="#b9c6ca" strokeWidth="1.4" markerEnd="url(#cfArr)" />

      {/* gérants */}
      <rect x="305" y="106" width="110" height="34" rx="2" fill="#33535d" />
      <text x="360" y="127" textAnchor="middle" fontSize="12" fill="#fff">{t('Gérant 1')}</text>
      <rect x="455" y="106" width="110" height="34" rx="2" fill="#33535d" />
      <text x="510" y="127" textAnchor="middle" fontSize="12" fill="#fff">{t('Gérant 2')}</text>
      <rect x="605" y="106" width="110" height="34" rx="2" fill="#33535d" />
      <text x="660" y="127" textAnchor="middle" fontSize="12" fill="#fff">{t('Gérant 3')}</text>
      <rect x="820" y="106" width="110" height="34" rx="2" fill="#33535d" />
      <text x="875" y="127" textAnchor="middle" fontSize="12" fill="#fff">{t('Gérant X')}</text>

      <text x="767" y="128" textAnchor="middle" fontSize="20" fill="#8aa0a6" letterSpacing="2">• • •</text>

      {/* IPO / stratégique */}
      <rect x="965" y="48" width="114" height="98" rx="2" fill="#EFF6A2" />
      <text x="1022" y="92" textAnchor="middle" fontSize="12" fontWeight="700" fill="#173238">{t('IPO ou')}</text>
      <text x="1022" y="108" textAnchor="middle" fontSize="12" fontWeight="700" fill="#173238">{t('STRATÉGIQUE')}</text>

      {/* fonds de continuation : accolade + boîte */}
      <line x1="435" y1="150" x2="435" y2="224" stroke="#3f5f68" strokeWidth="1" strokeDasharray="2 4" />
      <path d="M373 250 L435 224 L497 250" fill="none" stroke="#b9c6ca" strokeWidth="1.4" />
      <rect x="370" y="252" width="130" height="40" rx="2" fill="#294a54" />
      <text x="435" y="277" textAnchor="middle" fontSize="12.5" fill="#fff">{t('Gérant 1')}</text>
      <text x="435" y="313" textAnchor="middle" fontSize="11.5" fill="#c9d4d7">{dur}</text>

      {/* légende à droite de la boîte */}
      <text x="565" y="266" fontSize="18" fill="#ffffff">{t('Le même gérant prolonge sa détention')}</text>
      <text x="565" y="292" fontSize="18" fill="#ffffff">
        {lang === 'en'
          ? <>in <tspan fill="#EFF6A2">a new fund</tspan></>
          : <>dans <tspan fill="#EFF6A2">un nouveau fonds</tspan></>}
      </text>
    </svg>
  )
}
