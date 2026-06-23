# Architecture Cook Note

Cook Note reste une web app statique autonome : le navigateur charge HTML, CSS, JS, catalogues recettes et assets locaux. Il n'y a pas de backend obligatoire en production publique.

## Sources versionnees

- `index.html`, `recipe.html`, `app.js`, `app-images.js`, `recipe.js`, `style.css` : shell public du site.
- `recipes.js` : catalogue complet, source GitHub des fiches recette.
- `assets/catalog-*.js` : catalogues compacts de l'accueil, generes depuis `recipes.js`.
- `assets/recipe-images/` : masters PNG des images recette, gardes dans GitHub.
- `assets/recipe-images-optimized/` : JPG servis en hero de fiche.
- `assets/recipe-card-images/` : JPG legers servis sur les cartes.
- `scripts/` : generation, validation, audit et preflight.
- `tests/` : smoke tests visuels Playwright.

## Build production

`npm run build` cree `dist/`.

Le build copie uniquement le site public, les modules runtime extraits, les vendors locaux, les catalogues, `recipes.js`, les JPG optimises et les miniatures. Il regenere aussi un `assets/image-manifest.js` de production sans les masters PNG.

`dist/` est ignore par Git : il se regenere toujours depuis les sources versionnees.

## Deploiement

Cloudflare Pages doit avoir cette configuration de build Git :

- Build command : `npm run build`
- Build output directory : `dist`

`wrangler.toml` declare :

```toml
pages_build_output_dir = "dist"
```

Cloudflare Pages doit donc generer puis publier `dist/`, pas la racine du depot.

Si le log Cloudflare affiche `No build command specified. Skipping build step.`, le build echouera avec `Output directory "dist" not found` parce que `dist/` est volontairement ignore par Git.

## Validations

- `npm run check` : validations completes + build + validation de `dist`.
- `npm run validate:dist` : verifie que `dist` ne contient pas de fichiers source ou admin, que les assets precaches existent, et que toutes les images optimisees/miniatures referencees sont presentes.
- GitHub Actions reconstruit `dist`, le valide, lance les tests visuels, puis publie `cook-note-dist` en artefact CI.
