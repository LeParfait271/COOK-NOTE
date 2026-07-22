# Architecture Cook Note

Cook Note reste une web app statique autonome : le navigateur charge HTML, CSS, JS, catalogues recettes et assets locaux. Il n'y a pas de backend obligatoire en production publique.

## Sources versionnees

- `index.html`, `recipe.html`, `app.js`, `app-images.js`, `app-art-images.js`, `recipe.js`, `style.css` : shell public du site.
- `recipes.js` : catalogue complet, source GitHub des fiches recette.
- `assets/catalog-*.js` : catalogues compacts de l'accueil, generes depuis `recipes.js`.
- `assets/recipes/masters/` : masters PNG des images recette, gardes dans GitHub.
- `assets/recipes/heroes/` : JPG servis en hero de fiche.
- `assets/recipes/cards/` : JPG legers servis sur les cartes.
- `assets/theme/day/` et `assets/theme/dark/` : overrides visuels jour/nuit et assets
  d'ambiance servis par `theme.js` et `app-art-images.js`.
- `scripts/` : generation, validation, audit et preflight.
- `tests/` : smoke tests visuels Playwright.

## Build production

`npm run build` cree `dist/`.

Le build copie uniquement le site public, les modules runtime extraits, les vendors locaux, les catalogues, `recipes.js`, les JPG optimises, les miniatures et les overrides `assets/theme/day/` + `assets/theme/dark/`. Il regenere aussi un `assets/image-manifest.js` de production sans les masters PNG.

`dist/` est versionne comme artefact public Cloudflare Pages. Il se regenere toujours depuis les sources versionnees avec `npm run build`, puis `scripts/validate-dist.js` verifie qu'il ne contient que le site public.

## Deploiement

Cloudflare Pages doit avoir cette configuration de build Git :

- Build command : `npm run build`
- Build output directory : `dist`

`wrangler.toml` declare :

```toml
pages_build_output_dir = "dist"
```

Cloudflare Pages doit donc publier `dist/`, pas la racine du depot.

`dist/_redirects` contient les routes statiques des recettes prerendered et les
fallbacks SPA. Les routes sans slash final doivent pointer en 301 vers l'URL
canonique avec slash final, et les fallbacks SPA doivent servir `/` plutot que
`/index.html`, sinon Cloudflare Pages detecte une boucle et ignore la regle.

Si le log Cloudflare affiche `No build command specified. Skipping build step.`, le deploiement reste valide parce que `dist/` est versionne. Il faut seulement s'assurer que `npm run build` a ete relance avant le push.

## Validations

- `npm run check` : validations completes + build + validation de `dist`.
- `npm run validate:dist` : verifie que `dist` ne contient pas de fichiers source ou admin, que les assets precaches existent, et que toutes les images optimisees/miniatures referencees sont presentes.
- GitHub Actions reconstruit `dist`, le valide, lance les tests visuels, puis publie `cook-note-dist` en artefact CI.

## Readiness release

Une version prete production doit rester reproductible depuis les sources versionnees :

- Toute modification versionnee du projet augmente la version produit de `0.01`,
  sans exception pour la documentation, les scripts, la CI, l admin local, le
  build ou un correctif technique. Un changement web utilise le bump site seul.
  L APK n est reconstruit que sur demande explicite ; ce build final passe alors
  par `npm run apps:update-all` et aligne le site, `dist/`, le manifeste Android
  et l APK sur la meme version.
- `SITE_VERSION` et les versions `?v=N` sont la source de cache publique, derivees par `scripts/bump-version.js`. La version produit publiee reste unique : `SITE_VERSION` (`vX.YY`), `ANDROID_LEGACY_APK_VERSION` (`X.YY`) et `cookNoteAndroidVersion` (`X.YY`) doivent rester alignes.
- Les validateurs ne portent pas la version courante en dur : ils lisent `app.js` ou les fichiers publics a valider.
- `npm run build`, `npm run check` et `npm run preflight` doivent passer avant un push visible quand UI, cache, recettes ou images changent.
- Les tests visuels Playwright sont obligatoires quand une modification change le rendu ou l'ergonomie.
- Le rollback consiste a redeployer le commit precedent, avec son `dist/`, son service worker et ses assets coherents.
