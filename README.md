# arborspace.dev

Site vitrine ArborSpace, Astro en mode statique, servi par nginx sur Scalingo.

## En local

```bash
npm install
npm run dev      # http://localhost:4321, rechargement à chaud
npm run build    # génère dist/
```

## Fichiers à connaître

- `src/data/site.ts` : le menu (Product / Solutions / Resources / Company), l'adresse de contact et l'exemple de la turbine
- `src/pages/index.astro` : la page d'accueil
- `src/pages/product/`, `solutions/`, `resources/`, `company/` : une page par entrée du menu
- `src/layouts/Base.astro` : balises meta, en-tête et pied de page ; `Page.astro` : gabarit des pages intérieures
- `src/components/` : en-tête, pied de page, aperçu de la file de revue, exemple, bandeau « pilote »
- `src/styles/global.css` : couleurs, typographie, mise en page (thème sombre inclus)
- `public/nav.js` : ouverture des menus déroulants (fichier séparé pour respecter la CSP de nginx)

## Documentation

- Une page = un fichier Markdown dans `src/content/docs/<section>/<page>.md`, publié à l'adresse `/docs/<section>/<page>`.
- En-tête du fichier : `title`, `description`, `audience` (`Analysts`, `IT teams` ou `Everyone`) et `order` (position dans la section, facultatif).
- Les sections, leur ordre et leur libellé sont dans `src/data/docSections.ts`. Une section n'apparaît qu'une fois son dossier non vide.
- Le menu latéral, « On this page », les liens Previous / Next, l'accueil `/docs` et le menu Docs se mettent à jour tout seuls.
- Si une page change d'adresse, ajouter une redirection 301 dans `nginx.conf`.

Pour ajouter une page au menu : créer le fichier dans `src/pages/`, puis ajouter une ligne dans `nav` de `src/data/site.ts`.

## Déploiement Scalingo

Le dépôt contient déjà la configuration :

- `.buildpacks` : Node (lance `npm run build`), puis nginx
- `nginx.conf` : sert `/app/dist`, en-têtes de sécurité, cache long sur `/_astro/`
- `Procfile` : `web: bin/run`

```bash
git init && git add . && git commit -m "Initial site"
scalingo create arborspace-site --region osc-fr1
git remote add scalingo <url donnée par la commande précédente>
git push scalingo main
```

Puis le domaine :

```bash
scalingo --app arborspace-site domains-add arborspace.dev
```

Chez le registrar, faire pointer `arborspace.dev` vers l'app (enregistrement indiqué par Scalingo). Le certificat Let's Encrypt est émis automatiquement ; `.dev` impose le HTTPS.

## À vérifier avant mise en ligne

- L'adresse `contact@arborspace.dev` doit exister.
- L'en-tête HSTS contient `preload` : à retirer si tu ne veux pas d'engagement HTTPS long terme sur les sous-domaines.
