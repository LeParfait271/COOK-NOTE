# A lire en premier - Garde-fou maitre Cook Note

Ce fichier doit etre lu avant toute intervention sur Cook Note, par un humain
comme par un agent. Il fixe la methode de travail, les autorisations, les zones
sensibles et les validations minimales.

## Ordre de lecture obligatoire

1. Lire ce fichier en entier.
2. Lire `COOK_NOTE_RULES.md` avant toute modification de recette, image, UI,
   production, cache, Android ou workflow.
3. Lire `docs/architecture.md` avant de toucher au build, a `dist/`, au service
   worker, aux headers, aux routes ou aux assets publics.
4. Lire `README.txt` et `GUIDE_COMPLET.txt` pour le contexte utilisateur.
5. Lire la documentation specialisee si le travail touche Android ou les apps :
   `docs/android-legacy-workflow.md` et `docs/apps-install-workflow.md`.

Si une regle nouvelle apparait pendant le travail, l'ajouter dans
`COOK_NOTE_RULES.md`, puis ajouter une validation automatique quand c'est
possible.

## Intention du projet

Cook Note est un carnet culinaire web/PWA autonome, publie comme site statique
sur Cloudflare Pages, avec un back-office Node pour la maintenance locale et une
app Android Legacy Native Lite maintenue a part. Le but est de garder un site
rapide, lisible, fiable, coherent visuellement et maintenable.

Ne pas traiter le depot comme un brouillon. Chaque changement doit preserver :

- la qualite des recettes ;
- la coherence des fiches parentes et variantes ;
- les performances mobile ;
- le cache et la reproductibilite de `dist/` ;
- les images locales optimisees ;
- l'absence de secret dans Git ;
- la compatibilite Android Legacy quand elle est concernee.

## Autonomie et autorisations

Carte blanche signifie : avancer, installer les outils necessaires, lancer les
validations utiles et corriger les problemes reels sans demander une validation
pour chaque detail.

Apres une intervention terminee et des validations OK, commit puis push sur
`main` sont le comportement normal. Ne pas laisser un changement valide dormir en
local, sauf demande explicite de pause ou blocage Git/reseau.

Mais ces actions demandent toujours une confirmation explicite ou une demande
utilisateur claire :

- supprimer beaucoup de fichiers, de recettes, d'images ou d'assets ;
- ouvrir une release, declencher un deploiement manuel ou publier un livrable
  externe ;
- construire ou publier l'APK Android ;
- changer des mots de passe, secrets, tokens, droits ou variables sensibles ;
- remplacer une image visible par une image generee non encore validee ;
- faire une migration irreversible ou un nettoyage massif ;
- modifier volontairement l'identite visuelle globale du site.

Les installations doivent rester justifiees par le besoin du projet. Preferer les
scripts et dependances existants avant d'ajouter un outil. Ne jamais versionner
`node_modules/`, `.tools/`, fichiers de cache, rapports temporaires, secrets ou
fichiers locaux d'admin.

## Methode de travail

1. Comprendre le besoin et lire les fichiers concernes avant d'editer.
2. Faire un audit cible puis appliquer les corrections necessaires.
3. Garder les changements scopes. Eviter les refontes larges sans lien direct.
4. Ne jamais supprimer une recette, une image master ou un workflow sans preuve
   qu'il est obsolete et sans respecter les regles du projet.
5. Mettre a jour les docs et validations quand une convention change.
6. Regenerer les artefacts produits par script, pas a la main.
7. Lancer les validations adaptees et noter clairement ce qui n'a pas pu etre
   verifie.

La boucle d'amelioration doit etre exigeante mais finie : corriger les problemes
significatifs du scope, refaire une passe, puis documenter les risques ou idees
restantes. Ne pas faire de changement cosmique non verifiable juste pour
"optimiser".

## Zones sensibles

- `recipes.js` : source principale du catalogue. Verifier parents, variantes,
  liens internes, quantites, images, categories et recherche.
- `assets/recipe-images/` : masters image. Ne pas supprimer lors d'une
  optimisation.
- `assets/recipe-images-optimized/` et `assets/recipe-card-images/` :
  fichiers servis. Les generer par scripts.
- `assets/image-manifest.js` : generer avec `npm run generate:image-manifest`.
- `dist/` : artefact public Cloudflare Pages. Le regenerer avec
  `npm run build`, ne pas bricoler a la main.
- `service-worker.js`, `index.html`, `app.js`, `app-images.js`, `style.css` :
  synchroniser versions/cache quand ils changent.
- `_headers`, `_redirects`, `wrangler.toml` : production Cloudflare.
- `android-legacy/`, `downloads/`, docs apps : workflow manuel, uniquement sur
  demande explicite pour build/release.
- `server.js`, `admin.js`, `admin*.html`, `admin.css` : back-office et surface
  admin. Ne jamais affaiblir auth, backups ou protections.

## Interdits forts

- Pas de CDN pour les librairies front critiques deja locales.
- Pas d'image recette externe dans le catalogue.
- Pas de champs publics de source, credit, attribution, sourceUrl ou importedFrom
  dans les donnees recette.
- Pas de secret dans Git. Utiliser `COOK_NOTE_ADMIN_PASSWORD` ou
  `admin.local.json` local ignore.
- Pas de retour d'Android Modern/HD, GeckoView, WebView ou serveur HTTP local
  dans Android Legacy sans demande explicite.
- Pas de `dist/` contenant admin, scripts, tests, rapports ou PNG masters.
- Pas de compte catalogue, version ou date visible ecrits en dur quand le projet
  a deja une source automatique.
- Pas de commandes destructives silencieuses.

## Commandes de reference

Developpement :

```powershell
npm run dev
```

Verification complete :

```powershell
powershell.exe -ExecutionPolicy Bypass -File .\check.ps1
```

Fallback si le Node global est disponible :

```powershell
npm run check
```

Build public :

```powershell
npm run build
npm run validate:dist
```

Preflight avant changement visible UI/recettes/cache/images :

```powershell
node scripts/preflight.js
```

Audits utiles :

```powershell
npm run audit:recipes
npm run audit:images
```

Images :

```powershell
npm run generate:image-manifest
npm run validate:image-manifest
npm run optimize:selected
```

Android Legacy, seulement sur demande explicite :

```powershell
npm run apps:update-all
npm run apps:publish-all
```

## Regles de compte rendu

A la fin d'une intervention, indiquer :

- ce qui a ete modifie ;
- les fichiers principaux touches ;
- les validations lancees et leur resultat ;
- ce qui n'a pas pu etre teste ;
- les risques restants ou suites utiles.

Un rapport tres detaille est utile pour une grosse passe d'audit. Pour une petite
correction, rester clair et concis.
