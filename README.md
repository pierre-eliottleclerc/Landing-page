# Florestan IM — site Next.js multi-pages, bilingue

Version multi-pages du site Florestan IM, conçue pour le **référencement** :
chaque page a sa propre URL, son `<title>`, sa meta description et ses balises
de partage, et la version anglaise est enfin indexable.

## Démarrer

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # génère les 22 pages en HTML statique
npm start        # sert le build de production
```

Node.js 18+ requis.

## Ce que ce projet corrige par rapport au site en une seule page

| Avant (`florestan-im/index.html`) | Maintenant |
|---|---|
| 1 seule URL, 1 seul `<title>` | 22 URLs, titre et description propres à chacune |
| Version EN traduite en JavaScript, **invisible pour Google** | `/en/…` pré-rendu en anglais dans le HTML livré |
| Aucune balise OG → partages LinkedIn sans aperçu | OG + Twitter Card sur chaque page |
| Pas de `sitemap.xml` ni `robots.txt` | Générés automatiquement depuis le registre de pages |
| Pas de `canonical` ni `hreflang` | Canonical + hreflang croisé FR/EN + `x-default` |
| Pas de données structurées | JSON-LD `FinancialService` sur l'accueil |

## Architecture

```
app/
  [lang]/
    layout.js            layout racine — porte <html lang="…">
    [[...slug]]/page.js  route unique qui sert les 11 pages × 2 langues
  sitemap.js  robots.js   générés depuis lib/routes.js
  globals.css             CSS extrait du site HTML de référence
lib/
  i18n.js     makeT(lang) — traduction résolue au BUILD, pas au runtime
  routes.js   registre des pages + slugs localisés (/fr/strategie, /en/strategy)
  seo.js      titres, descriptions, OG, hreflang, JSON-LD
  site.js     constantes (URL de prod, coordonnées, ID du dossier Drive)
components/
  Header.jsx  Footer.jsx  Reveal.jsx
  EuropeMap.jsx  ContinuationDiagram.jsx  MarketBars.jsx
  pages/      Home Strategy Fund Team News Contact Legal Espace
data/         translations, europeMap, team, news, portfolio, legal
public/assets/ vidéos, images, logos, polices Sculpin
```

### Deux points de conception à connaître

**La traduction est résolue au build.** `makeT(lang)` reçoit la langue depuis le
paramètre de route, pas depuis un `useState`. C'est ce qui fait que le HTML
anglais contient réellement du texte anglais — condition nécessaire pour être
indexé. Ne pas revenir à un contexte React côté client.

**On ne passe que `lang` aux composants, jamais `t`.** Une fonction ne peut pas
franchir la frontière serveur → client en React Server Components. Chaque page
fabrique son `t` via `makeT(lang)`.

## Ajouter une page

1. Ajouter une entrée dans `PAGES` (`lib/routes.js`) avec ses slugs FR et EN.
2. Ajouter titre et description dans `META` (`lib/seo.js`).
3. Créer le composant dans `components/pages/`.
4. L'associer dans le `switch` de `app/[lang]/[[...slug]]/page.js`.

Le sitemap et le routage suivent automatiquement.

## Déploiement

Le dépôt de référence est
[pierre-eliottleclerc/Landing-page](https://github.com/pierre-eliottleclerc/Landing-page),
et Vercel y est branché : **tout push sur `main` déclenche un redéploiement**.

Projet Next.js standard, aucune configuration à saisir dans Vercel (le framework
est détecté automatiquement). `output: 'export'` n'est **volontairement pas**
activé : cela préserve la possibilité d'ajouter des routes API, nécessaires si
l'espace investisseur passe un jour par une liste maison adossée à Google Drive.

### Circuit de travail

Les sources vivent sur le Drive partagé
(`0. Corporate\27. SIte Web\florestan-next`), qui est aussi la copie de travail
Git. La compilation se fait en revanche sur un **miroir local** : `node_modules`
représente des dizaines de milliers de fichiers et le serveur de développement
réécrit `.next` en continu — laisser tout cela se synchroniser sature le Drive et
provoque des verrous de fichiers. Les deux dossiers sont ignorés par Git.

```bash
robocopy <drive> <miroir> /MIR /XD node_modules .next .git   # avant chaque build
```

Exclure `.git` est important : sans cela le miroir devient une seconde copie de
travail pointant vers le même dépôt distant, ce qui finit par produire des
divergences. **La copie versionnée est celle du Drive, et elle seule** — le
miroir ne sert qu'à `npm run dev` et `npm run build`.

⚠️ Ne jamais lancer `npm run build` pendant que `npm run dev` tourne : les deux
partagent `.next` et le serveur de développement renvoie alors des 500 sur toutes
les routes. Arrêter le serveur, supprimer `.next`, puis relancer.

Avant la mise en production :

- définir `NEXT_PUBLIC_SITE_URL` sur le domaine réel (sinon `lib/site.js`
  retombe sur `https://florestan-im.com`).

## Textes légaux

Les trois textes (mentions légales, confidentialité, avertissement) vivent dans
`data/legal.js`, sous forme de chaînes HTML. Le corps reste en français, standard
pour un contenu réglementaire AMF ; seul le titre est traduit.

**Ne pas éditer `data/legal.js` à la main avec un outil qui ne force pas l'UTF-8.**
Ce fichier a déjà été corrompu une fois (accents doublement encodés, `société`
devenu `sociÃƒÂ©tÃƒÂ©`) parce que la conversion lisait de l'UTF-8 comme de
l'ANSI. Il est régénéré depuis l'`index.html` de référence par :

```powershell
powershell -ExecutionPolicy Bypass -File scripts\regen-legal.ps1
```

Le script contrôle lui-même l'absence de mojibake après écriture. Il porte un
BOM UTF-8, nécessaire pour que PowerShell 5.1 interprète correctement ses
accents — ne pas le retirer.

L'hébergeur déclaré est **Vercel Inc.** (440 N Barranca Avenue #4133, Covina,
CA 91723, États-Unis). Réserve à connaître : l'article 6 de la LCEN demande le
numéro de téléphone de l'hébergeur, or Vercel n'en publie aucun, ni dans ses CGU
ni dans sa politique de confidentialité. Le bloc renvoie donc vers `vercel.com/help`.
À faire valider juridiquement si le point est jugé sensible.

## Limite connue

La page Espace investisseurs reprend le cadre Google Drive du site HTML. Le
dossier étant privé, Google renvoie un 401 et les fichiers ne s'affichent pas —
seul le bouton « Ouvrir dans Google Drive » fonctionne. Voir le commentaire en
tête de `components/pages/Espace.jsx` pour les deux pistes de résolution.
