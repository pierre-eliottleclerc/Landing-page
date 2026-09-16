import '../globals.css'
import { LANGS } from '@/lib/i18n.js'
import { SITE_URL } from '@/lib/site.js'
import Header from '@/components/Header.jsx'
import Footer from '@/components/Footer.jsx'
import Reveal from '@/components/Reveal.jsx'

// Layout racine : il porte <html> et <body>. Le segment [lang] étant le
// segment le plus haut, `lang` est connu ici et posé sur <html lang="…"> —
// signal important pour les moteurs et les lecteurs d'écran.
export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }))
}

export const metadata = {
  metadataBase: new URL(SITE_URL),
  // Favicon : Google l'affiche à côté du résultat de recherche, les navigateurs
  // dans l'onglet. Déclaré explicitement plutôt que par la convention
  // `app/icon.png`, car la racine de l'application est `app/[lang]/` et le
  // rattachement automatique n'y est pas garanti.
  icons: {
    icon: '/favicon.png',
    apple: '/apple-icon.png',
  },
}

export default async function LangLayout({ children, params }) {
  const { lang } = await params

  return (
    <html lang={lang}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Header lang={lang} />
        <main>{children}</main>
        <Footer lang={lang} />
        <Reveal />
      </body>
    </html>
  )
}
