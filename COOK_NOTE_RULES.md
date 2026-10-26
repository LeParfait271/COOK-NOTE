# Regles Cook Note

Ce fichier est la source de verite des conventions du projet. Chaque regle n'y
figure qu'une fois, rangee par theme. Quand une nouvelle facon de faire est
donnee : l'ajouter dans la bonne section, ajouter une validation automatique si
elle peut etre testee, puis lancer le check complet. Une regle trop subjective
pour etre testee est au minimum ecrite ici et mentionnee dans le compte rendu.

Les validateurs controlent le comportement du code, pas la formulation de ce
document : on peut le reformuler librement tant que le sens est garde.

Sommaire :

1. Methode et livraison
2. Recettes : classement et creation
3. Recettes : redaction, quantites et donnees
4. Images
5. Interface du site
6. Production web
7. Versions
8. Application Android 5.0+ (Native Lite)
9. Fonctions retirees ou refusees

## 1. Methode et livraison

- Lire `A_LIRE_EN_PREMIER.md` avant toute intervention, puis ces regles avant de
  modifier recettes, UI, images, production, cache ou Android.
- Respecter les lois qualite permanentes du garde-fou maitre : ne jamais degrader,
  reduire la dette technique, privilegier stabilite, securite, performance
  mesurable, documentation et validation continue.
- Respecter les patterns existants avant d'inventer une nouvelle structure.
- Ne pas demander de confirmation inutile. Demander seulement pour une operation
  destructive, une image globale du mode jour a valider ou une ambiguite
  impossible a resoudre proprement.
- Apres une tache terminee, lancer les validations adaptees et laisser les
  changements prets en local. Commit uniquement sur demande de l'utilisateur,
  avec seulement les changements de la tache (jamais de modifications
  preexistantes ou hors scope ; si elles ne s'isolent pas, ne pas commit et
  signaler le blocage).
- Ne jamais pousser : le push est fait par l'utilisateur dans GitHub Desktop
  (`C:\COOK NOTE\COOK-NOTE v2`), sauf demande explicite contraire. Ne pas
  demander d'identifiants ni configurer d'authentification Git.
- Git portable : `.tools\git\cmd\git.exe` ; Node portable : `.tools\node\current`.
- Readiness release, avant tout push visible :
  - check complet : `powershell.exe -ExecutionPolicy Bypass -File .\check.ps1` ;
  - `node scripts/preflight.js` si l'UI, les recettes, le cache, le service
    worker ou les images changent ;
  - tests visuels `npm run test:visual` si le rendu ou l'ergonomie change ;
  - `dist/` regenere, cache/service worker coherents, headers et routes valides ;
  - rollback possible en redeployant le commit precedent.
- Regenerer le sitemap quand des recettes, ids, URLs ou fiches supprimables
  changent.
- Lancer `npm run audit:recipes` apres un gros lot de recettes ou de rangements,
  puis lire `reports/recipe-audit.md`.

## 2. Recettes : classement et creation

### Import et creation

- Toute creation ou import suit `docs/recipe-creation-workflow.md`.
- Un message compose uniquement d'un ou plusieurs liens HTTP(S) vers des pages de
  recettes vaut demande complete d'import dans Cook Note : appliquer directement
  le workflow, le verrou de classement, le kit visuel, l'integration et les
  validations, sans demander de formule supplementaire.
- Avant de creer une fiche, rechercher noms, synonymes, ingredients et techniques
  proches dans le catalogue. L'identite culinaire du plat prime sur la cuisson,
  le materiel ou une modification secondaire.

### Verrou de classement

- Meme plat de base et meme identite culinaire = variante, meme si la cuisson, le
  parfum, la presentation ou un ingredient secondaire change. Exemple
  obligatoire : `Poulet basquaise au four` est une variante de `Poulet basquaise`.
- Le verrou de classement de `docs/recipe-creation-workflow.md` est obligatoire
  avant toute creation ou fusion. Une variante exige a la fois le meme nom
  culinaire reconnu, la meme structure et fonction, le meme resultat attendu et
  l'absence d'un autre nom culinaire autonome. Un seul critere en echec interdit
  la fusion.
- Avant de modifier `recipes.js`, consigner la fiche existante la plus proche,
  l'identite commune eventuelle, les differences structurantes et secondaires,
  puis la decision `variante`, `recette liee` ou `fiche distincte` justifiee. Une
  proximite de mots, d'ingredients, de couleur, de cuisson ou d'image n'est
  jamais une preuve suffisante.
- Une sauce, une base, une garniture ou un accompagnement utilise par un plat est
  une recette liee, pas une variante : la sauce aux herbes n'est pas une variante
  des pommes de terre au barbecue.
- Deux preparations au nom et a l'identite propres restent distinctes :
  `Mayonnaise` n'est pas `Aioli`, `Pesto` n'est pas `Tapenade`, `Houmous` n'est
  pas `Caviar d'aubergines`, `Tiramisu` n'est pas `Charlotte`,
  `Gratin dauphinois` n'est pas `Tartiflette`.
- La sauce Choron est une variante de la sauce bearnaise (identite derivee),
  jamais une variante de la Mayonnaise.
- Partager un ingredient principal ne suffit jamais a creer une famille de
  variantes. En cas de doute semantique reel, presenter le classement propose a
  l'utilisateur avant de modifier le catalogue.

### Validation humaine des corrections culinaires

- Une analyse automatique peut relever une incoherence ou proposer un
  enrichissement, mais elle ne modifie jamais `recipes.js`.
- Toute correction d'une fiche existante est presentee a l'utilisateur et
  explicitement validee avant integration.
- Une proposition de temperature a coeur, de repere sensoriel ou de securite
  complete les temps deja ecrits : elle ne remplace et ne supprime jamais une
  duree, une temperature, une quantite, une etape ou une note existante.
- Le rapport `reports/culinary-proposals.md` est consultatif ; sa generation
  prouve que l'empreinte de `recipes.js` est identique avant et apres l'audit.
- Les sources officielles de securite alimentaire (ministere de l'Agriculture,
  Anses) s'affichent en liens en bas des seules fiches concernees, sans modifier
  leur contenu ni remplacer le plan de maitrise sanitaire du restaurant.

### Rangement du catalogue

- Hierarchie strictement plate : uniquement les 8 fiches parentes racines
  (`Apero`, `Entrees`, `Plats`, `Accompagnements`, `Desserts`, `Petit-dejeuner`,
  `Sauces`, `Bases`) et les fiches recettes directement rattachees. Aucune fiche
  parente intermediaire, sur le site comme dans l APK.
- Le rangement suit l'usage reel : `Toppings frites` = Accompagnements/Sauces,
  pas Plats ; `Oeufs mimosa` = Apero/Entrees ; `Legumes rotis au four` =
  Accompagnements/Entrees avec variantes ouvrables.
- Les coulis restent des variantes de la fiche parent `Coulis`. Ne pas remettre
  `coulis_fraise`, `coulis_framboise`, `coulis_abricot_vanille`, `coulis_poire`
  ou `coulis_guide`.
- Les recettes parentes sont des fiches de navigation, sans faux comptes
  ingredients/etapes de variante. Les recettes listees restent des fiches normales
  avec leur propre URL `/recette/id` ; la fiche parent est une collection de
  liens, pas un selecteur bloque dans le hero.
- Quand une nouvelle recette sert de base ou de composant a une fiche existante,
  ajouter dans les recettes consommatrices un lien interne
  `<span data-goto="id_recette">nom</span>` plus `linkedRecipes`, et un garde-fou
  dans `scripts/validate-recipes.js` pour les dependances durables.
  `npm run audit:link-proposals` liste les sauces et bases utilisees sans lien
  (`reports/link-proposals.md`, consultatif : chaque lien est valide par
  l'utilisateur avant integration).
- La detection des bases et composants reste generique : bases, fonds, appareils,
  inserts, pates, cremes, sauces, marinades, sirops, toppings, condiments, pains
  et buns ne sont pas proposes comme recettes servies seules.
- Garder un score de completude interne (structure, securite, conservation,
  liens, tags, images, rangement) et le dashboard de sante `npm run audit:recipes`.
  L'audit lit aussi `practical.storage`, ne signale la conservation que pour les
  preparations perissables, ne traite les doublons d'ingredients que dans une
  meme sous-preparation, et fait heriter les variantes internes des tags et alias
  de leur famille.

### Variantes internes

- Les etapes propres a un groupe de preparation sont rangees sur ce groupe ;
  l'interface n'affiche que celles du groupe ouvert. Quand les etapes de la fiche
  couvrent toutes les options (ex. `Beignets de calamar` : pate legere ou
  tempura), la regle de `app-inline-variant-rules.js` porte `useRecipeSteps`
  et chaque option garde les etapes completes, sur le site comme dans l APK.
- Une fiche a variantes internes propose un seul selecteur explicite avant le
  contenu : titre clair, courte explication, cartes lisibles, etat selectionne
  evident et compteurs propres a chaque choix. Tant qu'aucune variante n'est
  choisie : pas de faux totaux, pas de fiche rapide, pas de dock ni de second
  selecteur.
- Une selection de variante ouvre la fiche complete en un seul clic, sans second
  bouton de confirmation.

## 3. Recettes : redaction, quantites et donnees

- Grammes : au-dessus de `50g`, arrondir au multiple de `5g` le plus proche
  (jamais `57g`). Systeme metrique uniquement, pas de cups, oz ou tasses.
- Vanille et aromes : jamais de dosage numerique arbitraire. Ecrire
  `vanille selon gout ou arôme vanille selon dosage indiqué sur la bouteille`.
- Ecrire `cassonade ou vergeoise` pour cassonade, vergeoise ou sucre roux.
- Ecrire `poivre du moulin`, sauf poivre nomme precis (Timut, Sichuan, Kampot,
  poivre en grains).
- Beurre pommade ou ramolli : indiquer `sortir le beurre environ 45 a 60min avant`
  selon la temperature de la piece ; souple, pas fondu.
- Cuilleres : poudres et pates en cuillere rase, liquides remplis au niveau. Le
  texte explicatif reste dans `Repere indicatif`, pas dans `Poids moyens`.
- Poids moyens : affiches dans `Avant de commencer` des que la recette contient
  ces mesures ; ils respectent l'aliment exact (citron jaune et citron vert
  distincts, `1 melon` declenche son repere). `scripts/validate-average-weights.js`
  couvre toutes les fiches et la liste de courses.
- Oeufs durs : depart a froid, cuisson `12 a 13min`, refroidissement immediat,
  ecaler les oeufs froids.
- Les notes ne dupliquent pas ce qui est deja range dans conservation, erreurs,
  resultat ou reperes. Les conservations expliquent avant et apres cuisson quand
  c'est utile ; chaque conseil precise s'il concerne l'ingredient avant
  preparation, l'aliment cuit ou le reste de recette.
- Les techniques de cuisinier necessaires existent dans la page Techniques et
  sont liees automatiquement ou explicitement depuis les recettes.
- Allergenes : un moule de cuisson n'est pas une moule coquillage (`beurrer le
  moule`, `moule a cake`, `moule a tarte` ne declenchent pas `Mollusques`).
- Titres culinaires, neutres et factuels : jamais `rapide`, `facile`, `simple`,
  `express` ou `inratable` dans le champ `title` (ces mots restent permis dans
  les instructions, notes et intentions de recherche).
- Le nom public d'une variante vient de son element distinctif le plus notable
  (ingredient, alcool, aromate, cuisson, technique) : `Sauce aux poivres au
  cognac`, jamais une source, un auteur ou un qualificatif commercial (`du Chef`,
  `premium`, `basique`...).
- Les ids, URLs et noms de fichiers ne gardent aucune trace de source externe,
  d'auteur, de blog ou de personne citee.
- Les donnees recette ne contiennent jamais de champs publics de source, credit,
  attribution, imageSource, sourceUrl ou importedFrom.
- Textes en UTF-8 sain : le site, le build et les apps gardent une reparation
  anti-mojibake et bloquent les caracteres suspects avant publication.
- Chaque fiche a une version `recipeVersion` au format `X.YY`, `1.00` a la
  creation ; seule une modification du contenu de la fiche l'augmente de `0.01`
  (`scripts/sync-recipe-versions.js` compare a `HEAD`). L'interface n'affiche
  que la version publiee courante.
- Toute cuisson au four indique sa temperature dans les etapes affichees
  (`180°C`, `th. 6`), y compris dans les etapes propres d'une variante qui
  remplacent les etapes de base ; le gril se donne par position.
  `npm run validate:oven` le bloque.
- `validate:recipe-links` refuse tout lien interne absent, auto-reference,
  duplique ou mal forme ; `validate:recipe-duplicates` refuse les titres et
  contenus strictement dupliques.

## 4. Images

### Images recette

- Chaque recette feuille a une image locale unique : pas de meme fichier, pas de
  meme composition recadree ou reteinte, pas de presque-doublon
  (`npm run validate:visual-images` bloque avant push).
- Aucune image recette ne doit venir du web ou pointer vers une URL externe.
  Circuit : master dans `assets/recipes/masters/` (jamais supprime), copie
  optimisee dans `assets/recipes/heroes/`, miniature homonyme dans
  `assets/recipes/cards/`, puis audit. Les recettes pointent vers `heroes/`.
- Toute nouvelle recette recoit deux visuels coherents : nuit dans
  `assets/theme/dark/recipes/` et jour dans `assets/theme/day/recipes/`.
- Toute generation suit le kit `docs/visual-references/RECIPE_IMAGE_STYLE.md`
  et part d'une de ses six images approuvees : cadrage, taille du plat,
  lumieres, grain, accessoires, distance du chateau et motifs de rejet. Le mode
  jour reprend la terrasse de chateau validee (lumiere doree assourdie, palette
  olive/sepia, ferronnerie fine, vegetation sombre, cuivre ancien) avec un
  chateau petit, brumeux et tres eloigne, jamais colle a la fenetre.
- Sur un lot, alterner ouvertures a gauche et a droite, au plus pres de 50/50.
- Avant integration, comparer l'image au kit et la recommencer si chateau,
  fenetre, cadrage, lumiere, grain ou presentation divergent. Une fois conforme,
  integrer le lot sans attendre de validation utilisateur ; ne montrer les
  apercus que sur demande.
- Une image represente le plat exact ou une variante visuelle evidente : une
  image jolie mais semantiquement fausse est une erreur bloquante. Pas de rendu
  vectoriel plat ou cartoon : appetissant, texture, plausible. Style Cook Note :
  sombre, gothique, nourriture lisible, sans texte ni watermark.
- Une image visible remplacee recoit un nouveau nom de fichier stable pour
  contourner le cache ; ne jamais corriger une URL en place.
- Une image validee est copiee dans `assets/recipes/masters/` avec un nom stable
  lie a l'id recette.
- Outils : `npm run optimize:images` apres ajout ou modification ;
  `scripts/optimize-selected-images.ps1` avec des noms explicites pour quelques
  images ; `npm run audit:images` (miniature manquante, image faible, cadrage
  atypique, doublon) ; `npm run validate:image-cleanup` (images inutilisees,
  references absentes, noms sans id correspondant).
- `assets/image-manifest.js` est genere par `npm run generate:image-manifest`,
  versionne avec le cache et valide en CI. Les miniatures d'interface utilisent
  `assets/recipes/cards/` hors hero et image de partage.
- AVIF : chaque JPG/PNG de `assets/recipes/heroes|cards/` et
  `assets/theme/{dark,day}/{recipes,categories,global}/` a une copie `.avif`
  homonyme (`npm run generate:avif`, qualite 58, environ -50 %). Le JPG/PNG reste
  la reference et le repli : `<img>` via `preferredImageUrl` puis
  `retryOriginalImage` en cas d'erreur, fonds via `cssImageValue` (`image-set()`
  avec `type("image/avif")`), prechargements avec `type="image/avif"`. Relancer
  `npm run generate:avif` apres tout ajout, remplacement ou suppression d'image ;
  `npm run validate:avif` bloque une copie manquante ou orpheline. Android
  n'embarque jamais d'AVIF (Android 5 ne le decode pas).

### Direction artistique jour/nuit

- Les visuels de direction artistique globale du mode jour (fond, hero, splash,
  logo, illustration) ne sont pas des images recette : stockes dans
  `assets/theme/day/global/` seulement apres validation visuelle, sans filtre CSS
  ni inversion automatique pour simuler le jour.
- Les overrides recette par theme passent par `app-art-images.js` (jour dans
  `assets/theme/day/`, nuit dans `assets/theme/dark/`), versionne comme
  `app-images.js` dans `index.html`, le service worker, `dist/` et les
  validateurs.
- Fiches parentes : images theme avec banniere `assets/theme/dark/categories/*_maitre.jpg`
  (nuit) et `assets/theme/day/categories/*_maitre.jpg` (jour). Exception validee :
  tant que les images jour n'existent pas, les huit parents du mode jour
  reutilisent les images nuit (jamais pour une recette feuille). Les anciennes
  `parent_*_moon` ne sont que des fallbacks.
- Les images parentes validees sont verrouillees par
  `scripts/validate-parent-art-lock.js` : ni regenerees, ni recompressees, ni
  remplacees sans demande explicite.

## 5. Interface du site

### Langue

- Le site est en francais uniquement depuis la v5.33 (decision du 24/10/2026).
  L'ancienne traduction anglaise automatique est supprimee et ne doit pas
  revenir partiellement. Les textes d'interface centraux restent des cles `t()`
  dans `i18n.js`. Une future version anglaise sera refaite a neuf, sur demande
  explicite, avec des champs localises controles recette par recette ; jamais de
  traduction approximative du contenu culinaire. `npm run validate:i18n` bloque
  tout reste de l'ancienne traduction.

### Design et themes

- Toute passe de direction artistique respecte `docs/design-system.md` : tokens
  communs, dark mode equilibre, motion system `120ms / 200ms / 320ms`, focus
  visible permanent, support de `prefers-reduced-motion`. Les principes premium
  (Silent Design, premiere impression, etc.) y sont detailles : retirer ce qui
  attire l'attention sans valeur avant d'ajouter un effet.
- Mouvements « high-tech » admis s'ils servent la cuisine et restent sobres :
  ils reagissent a un geste (defilement, survol, bascule), restent natifs et
  legers (View Transitions, animations liees au defilement, Web Animations, sans
  bibliotheque 3D), se coupent sous `prefers-reduced-motion` et ne genent jamais
  la lecture d'une fiche. En place : devoilement circulaire jour/nuit, titre de
  la fiche dans la barre du haut au defilement, image du hero qui recule,
  apparition des cartes et panneaux au defilement, reflet lumineux qui suit la
  souris sur les cartes, graisse variable des titres, vignette qui file vers le
  bouton a l'ajout aux courses.
- Ingredients en deux colonnes : quantite et unite (`splitIngredientQuantity`)
  a gauche en chiffres reguliers, nom a droite ; sans quantite, le nom prend
  toute la ligne. Survoler ou focaliser une etape eclaire les ingredients qu'elle
  cite, et inversement (`ingredientLinkWords`).
- Recherche : resultats en vignettes 16/9 (image, categorie, temps total,
  rendement).
- Impression d'une fiche : encre noire sur papier blanc quel que soit le theme,
  aucune animation (les apparitions au defilement laisseraient des blocs
  invisibles), trois colonnes imprimees dont `Avant de commencer` (ses blocs
  replies s'ouvrent le temps d'imprimer) ; barre du haut, bandeau, selecteur de
  variante, sources et pied de page masques.
- Repli des images : une seule tentative vers l'image d'origine par image
  (`retryOriginalImage`), jamais de rebond entre deux sources qui echouent ;
  un test verifie qu'une fiche sans image ne relance pas de requetes en boucle.
- Pages categorie : ouverture de chapitre avec une phrase par categorie
  (`COLLECTION_INTROS`) et des reperes chiffres calcules (faciles, de saison),
  informatifs, sans filtre ni outil de comparaison.
- Les nouveaux styles utilisent les tokens du design system (couleurs, spacing,
  radius, ombres, typo, motion) ; une valeur locale n'est admise que pour une
  mesure de layout non reutilisable.
- Couches CSS : `/style.css` est assemble en `@layer legacy, design`. Les
  modules `styles/0x-*.css` et les feuilles annexes sont dans `legacy` ; tout
  nouveau style va dans `styles/10-design.css` ou `styles/11-design-fiche.css` (couche `design`, 50 Ko max par fichier, prioritaire sans
  `!important`). Ne pas ajouter de `!important` (impression exceptee) ; preferer
  les container queries (`catalogue`, `fiche-rapide`, `avant`) aux media queries
  pour les composants.
- Typographie editoriale : Fraunces (titres) et Inter (texte), polices
  variables locales dans `assets/fonts/` (licences OFL jointes, sous-ensemble
  latin, cache immuable), `text-wrap: balance` sur les titres et `pretty` sur les
  paragraphes. Couleurs des jetons en OKLCH, renforcees sous
  `@media (color-gamut: p3)`.
- Fenetres modales : toujours le composant `ModalDialog` (`app-premium.js`), un
  `<dialog>` natif ouvert par `showModal()` (calque superieur, page inerte,
  Echap via `cancel`, clic sur le voile pour fermer). Il garde la classe
  `.modal-backdrop` ; le panneau interieur garde `role="dialog"` et
  `aria-modal`. A l'impression il quitte le calque superieur pour suivre le flux.
- Transitions de vue : carte vers hero de fiche via `view-transition-name`,
  desactivees sous `prefers-reduced-motion`. L'intention d'ouverture (survol,
  focus, toucher) precharge les donnees et l'image principale de la fiche.
- Les passes premium ameliorent les composants existants (cartes, panneaux,
  boutons, hover/focus, responsive, performance) sans rajouter de sections
  gadget sur l'accueil.
- Le mode nuit est la reference et ne change pas d'identite. Le mode jour passe
  par `theme.js`, `data-theme`, `.theme-dark/.theme-light` et les tokens ; ce sont
  deux univers du meme produit, pas une inversion CSS. Assets de marque, fonds,
  hero et illustrations passent par `CookNoteTheme.asset` ou `data-art-asset`.
  Le choix est instantane, sans rechargement, persiste dans
  `cook_note_preferences` ; `npm run validate:theme` bloque les regressions.
- En mode jour, toutes les icones de la barre superieure utilisent
  `--topbar-icon-color` et restent sombres dans tous leurs etats (theme,
  recherche, favoris, reglages), jamais `rgb(255, 255, 255)`.
- Les icones de boutons restent coherentes et blanches sur boutons sombres.

### Accueil et cartes

- L'accueil sans filtre reste un rangement par fiches parentes : jamais toutes
  les recettes enfants en vrac.
- Recherche de l'accueil epuree : la barre seule, sans surtitre, grand titre ni
  phrase au-dessus, sur le site comme dans l APK.
- Hero : `Cook Note` en titre typographique sans pictogramme accole ; il se fond
  dans le fond de page sans bordure, filet ni ligne basse (nuit, jour et
  Android). Les deux chateaux, la lune et l'atmosphere restent un decor passif :
  jamais cliquables, jamais associes a un partage sale/sucre, sans fenetres
  allumees au survol ni recherche dans la lune.
- Un seul titre de catalogue, `Toutes les recettes`, avec compteur et filtres dans
  le meme en-tete, puis la grille. Pas de marge basse cumulee avec le footer,
  footer aligne sur la grille, grande barre de recherche a contour continu.
- Cartes des huit parents : titre lisible, sans numero romain, blason ni icone,
  cadre image 16/9 partage avec les cartes recettes. Grilles regulieres, sans
  composition editoriale asymetrique.
- Sous le nom d'une carte recette : seulement le nombre de variantes s'il y en a,
  jamais poids, rendement ou portions. Le badge categorie affiche toutes les
  categories de la fiche separees par ` / `. Aucun badge automatique au-dessus
  de l'image (`A l'avance`, `Base`, `Four`...).
- Zoom hover des cartes court et leger : transition image de `250ms` maximum,
  sans grossissement agressif.
- Filtres de saison mobiles en grille stable a hauteur tactile constante.
- La liste de courses est accessible sous la recherche et dans la navigation
  mobile, pas dans la barre superieure.
- Footer : compteur catalogue automatique (fiches servies + variantes inline)
  calcule depuis `window.RECIPES`, jamais en dur ; `Cook Note © 2026.` dans le
  texte d'identite, compteur et version dans les badges.

### Fiche recette

- `Materiel necessaire` reste dans la fiche rapide en haut.
- La colonne droite s'appelle `Avant de commencer`. Les allergenes y restent
  visibles ; `Poids moyens` reste toujours ouvert comme `Allergenes` ; les autres
  informations secondaires (organisation, conservation, accords, conseils,
  notes, recettes liees, fiche technique) sont dans des boites repliables
  accessibles, chacune avec un apercu d'une ligne. Les sections pratiques sont
  rangees en trois familles : `Servir` (accords, dressage, service),
  `Conserver` (conservation, rechauffage) et `Maitriser` (repere, a savoir,
  fiches ingredients, erreurs, resultat attendu), sur le site comme dans l'APK.
  `Ingredients utiles` s'appelle `Conversation ingredients`.
- `Avant de commencer` est une seule surface : blocs et lignes separes par des
  filets fins, jamais de carte dans la carte. La version de la fiche est une
  mention d'une ligne en pied de colonne.
- Couleurs de la fiche : la couleur de categorie reste une touche discrete du
  hero (filet bas) ; l'action principale, le selecteur de portions et tout le
  contenu sous le hero (liens, astuces, reperes, variante choisie) utilisent l'or
  de la marque. Le rouge (`--ds-alert`) est reserve aux vraies alertes, comme les
  allergenes.
- Fiche a variantes : le bandeau sous la fiche rapide est le selecteur
  `Variante` (onglets alignes sur la grille) ; l'en-tete `Etapes` ne repete pas
  la variante. Les fiches sans variante gardent le bandeau des phases.
- Etapes : pas de case a cocher visible ; toucher l'etape (numero ou texte) la
  marque faite, numero barre et texte attenue, la case restant accessible au
  clavier.
- Sur mobile, ces informations passent par l'onglet/encart mobile, jamais par une
  fausse etape. Le swipe entre panneaux est accroche a toute la vue recette.
- Flux unique sans defilement interne : `Ingredients`, `Etapes` et `Avant de
  commencer` gardent une hauteur automatique, sans `max-height`,
  `overflow-y: auto/scroll` ni `position: sticky/fixed`, aussi sur mobile.
- Pas de barre de commandes recapitulatives en doublon : le selecteur de
  personnes et les actions restent dans le hero, les onglets dans le contenu.
  Les actions gardent une hauteur commune ; le selecteur de quantite reste
  lisible et contraste dans le hero.
- Partager et imprimer n'apparaissent que sur les vraies fiches recettes, jamais
  sur les categories, collections ou fiches parentes.
- Une transition de route ne masque jamais la page precedente avant le rendu de
  la nouvelle fiche : aucun flash noir ni ecran vide.
- Les liens Techniques centrent la carte visee, la font clignoter assez longtemps
  et gardent le halo tant qu'on reste sur la page.
- La Lecture chef ne doit jamais deduire un service froid ou un signal proteine
  depuis une note de conservation, un accompagnement frais ou un dessert frais :
  cassoulet, stew, saucisse-lentilles, dhal, pates au pesto ou cocotte restent en
  service chaud.

### Recherche

- La recherche comprend les intentions courantes : rapide, sans cuisson, four,
  friture, a l'avance, congelable, vegetarien, froid et ingredients proches.
- Ouvrir la recherche avec un champ vide ne charge pas le catalogue differe ; la
  saisie reste locale, le calcul part apres une courte pause de frappe.
- Fenetre epuree : titre court, champ principal, quatre raccourcis maximum et
  resultats. Pas de filtre de difficulte, recherches recentes, dernieres fiches ni
  groupes massifs de suggestions.

### Mode menu

- Outil de decision direct : composer entree/plat/accompagnement ou
  sauce/dessert, ouvrir chaque fiche, ajouter le menu entier aux courses
  fusionnees, avec un choix du nombre de personnes applique aux rendements, au
  resume et aux quantites des courses.
- Mode menu : accords dessert obligatoires. Apres un plat lourd, cremeux, frit ou tres
  fromage, un dessert frais/citron/fruit ; apres un plat leger, un dessert plus
  gourmand. Soir de semaine : pas de dessert force, ou alors moins de 10 minutes
  d'actif.
- Le registre `MENU_PAIRING_RULES` garde au moins 100 regles actives et couvre au
  minimum : cremeux/fromage/moutarde avec accompagnement neutre ou vert ;
  interdiction des doubles sauces dominantes ; double feculent et double
  creme/fromage penalises ; tomate expressive interdite avec sauce cremeuse ;
  friture avec frais/acide ; poisson delicat sans chorizo/bacon/fromage fort ;
  epice avec element rafraichissant ; sucre-sale sans dessert trop riche ;
  bistrot avec dessert simple ; ete frais sans gratin/friture/creme chaude ;
  apero sans vrai plat ; semaine a trois fiches maximum et charge active basse ;
  plus oeuf/mayo, ail/oignon cru, fume, fruits/noix, amertume, herbes,
  chaud/froid, equipements repetes, feculents, legumes secs, champignons,
  crustaces, alcool, textures, familles de viandes et bases de dessert.
- Historique des menus : ne pas reproposer exactement la meme combinaison. Une fiche
  ouverte depuis le menu revient au meme mode menu avec son contexte via le
  bouton retour du navigateur.

### Liste de courses

- Le panier courses doit regrouper les noms proches sans perdre le sens : beurre
  doux/ramolli/fondu vers beurre, cassonade/vergeoise ensemble, huiles neutres
  ensemble, chocolats noir/lait/blanc separes, citrons jaune et vert separes
  quand la recette le demande ; familles utiles regroupees (citron/jus/zeste,
  oeufs/jaunes/blancs, ail, tomates, cremes et laitages).
- Liste de courses : mode `J’ai déjà` obligatoire pour retirer un ingredient sans
  retirer la recette.
- Rayons proches d'un vrai magasin : primeur, cremerie et oeufs, boucherie,
  poissonnerie, boulangerie, epicerie salee, epicerie sucree. Quantites d'achat
  indicatives quand une conversion stable existe (briquette, plaquette,
  tablette, boite d'oeufs, vrac).
- Export compact : version courte copiable par rayons pour SMS ou messagerie.
- Le batch multi-recettes regroupe les gestes repetitifs detectables : zestes et
  jus, oeufs, herbes, ail/oignons/echalotes, beurre a sortir, prechauffage.
- Transfert vers un autre appareil : le bouton `Sur mon téléphone` du panier
  affiche un QR code de `https://cook-note.pages.dev/#courses=id*facteur,...`
  (30 fiches maximum, liste dans le fragment d'URL, jamais envoyee au serveur).
  A l'ouverture, le site valide strictement chaque entree, demande confirmation,
  ajoute les recettes en tete de la liste puis efface le fragment. L'app Android
  produit le meme lien (section 8).

### Outils restaurant et personnels

- Perimetre restaurant accepte : plan de production (retroplanning indicatif
  construit depuis les temps existants, sans reecrire d'etape), matrice
  allergenes (rappelle la verification des etiquettes, fournisseurs et
  contaminations croisees), formats restaurant/degustation/buffet/banquet
  (facteur de planification sans modifier les quantites sources) et gestion des
  restes (restitue les consignes existantes, aucune deduction automatique).
- Outils personnels acceptes (decision du 28/08/2026) : version individuelle des
  fiches, profil de materiel, calculateur de moules et contenants, valorisation
  des sous-produits, sauvegarde/restauration complete et detection des recettes
  proches (informative : elle ne fusionne, ne renomme et ne supprime rien).
- L'admin d'ajout recette previsualise l'impact avant sauvegarde : role menu,
  rayons, allergenes probables, statut image, SEO et checks qualite.
- Garder un registre de couverture des features (recherche, fiche, images, mode
  menu, courses, techniques, anti-gaspillage, production) verifie
  automatiquement quand de nouvelles recettes arrivent.

## 6. Production web

### Build et deploiement

- Domaine canonique : `https://cook-note.pages.dev`, jamais d'URL preview
  Cloudflare dans `index.html`, `robots.txt` ou `sitemap.xml`.
- `npm run build` produit `dist/`, valide par `scripts/validate-dist.js`, jamais
  edite a la main. `dist/` est un artefact de build ignore par Git : Cloudflare
  Pages le reconstruit a chaque push. Il ne contient ni admin, ni scripts, ni
  tests, ni rapports, ni masters PNG.
- Reglages Cloudflare Pages Git : Build command: npm run build ; Build output
  directory: dist (`pages_build_output_dir = "dist"`) ; `NODE_VERSION=20`. Si le
  log indique `No build command specified`, corriger le reglage Pages avant tout
  push. Bascule depuis l'ancien `dist/` versionne : voir `docs/architecture.md`.
- Code applicatif decoupe en modules classiques listes dans
  `scripts/lib/app-modules.js` (de `app.js` a `app-main.js`) : ordre de
  chargement garanti dans `index.html`, precache du service worker, copie dans
  `dist/`, `node --check` et lecture par les validateurs passent tous par cette
  liste. Les autres modules runtime extraits de `app.js` (`app-images.js`,
  `app-art-images.js`, `app-premium.js`...) sont charges avant `app.js` et
  suivent le meme circuit.
- Feuille principale decoupee dans `styles/` (7 fichiers prefixes, liste
  `STYLE_MODULES` dans `scripts/lib/app-modules.js`) : `server.js` et le build les
  assemblent dans cet ordre en une seule `/style.css`. L'ordre fait la cascade :
  ne pas reordonner, et ajouter une regle dans le fichier du domaine concerne.
  Une meme regle (meme contexte, meme selecteur) ne doit pas etre redeclaree a
  plusieurs endroits.
- Librairies front critiques locales dans `assets/vendor/` : jamais React,
  ReactDOM, QRCode ou confetti via CDN.
- Dependances reproductibles : `package-lock.json` versionne, CI en
  `npm ci --no-audit --no-fund`, `@playwright/test` epingle compatible Node 20 ;
  la CI lance `npm run audit:security` (high/critical bloquants).
- Les tests visuels Playwright restent dans GitHub Actions via `npm run
  test:visual` (captures desktop/mobile en artefacts) et compatibles avec la CSP
  stricte : pas de `page.waitForFunction` ni de technique exigeant `unsafe-eval`.

### Cache, service worker et headers

- Les pages HTML et fichiers qui changent souvent sont servis reseau d abord avec
  cache de secours ; les images locales en cache-first. Les images publiques
  immutables (`assets/recipes/cards/`, `assets/recipes/heroes/`,
  `assets/theme/`, `assets/brand/`) doivent retourner le cache directement sans
  rafraichissement en arriere-plan.
- Le service worker ne precache que des assets existants, actuels et reellement
  references ; aucune ancienne URL dans le sitemap ou le cache ; aucun
  `console.log`, `console.warn` ou `console.error` runtime.
- Un asset identique n'est pas duplique entre le theme et la base.
- Quand `app.js`, un module applicatif, `recipes.js` ou `style.css` change, bump
  la version des assets dans `index.html` et `service-worker.js` (via
  `node scripts/bump-version.js --next`, controle par
  `node scripts/validate-cache-version.js`).
- Les headers de production Cloudflare Pages sont versionnes dans `_headers` :
  CSP stricte du site autonome, service worker et HTML en
  `no-cache`, JS/CSS/catalogues/manifest en cache court, images et vendors en
  immutable. `_redirects` versionne : `/recette/*` et `/techniques` rechargent
  l'app sans 404, fallbacks SPA vers `/` (pas `/index.html`), recettes sans slash
  en 301 vers l'URL avec slash final.

### Performance et validations

- Budgets bloques par `npm run validate:performance` : shell, modules,
  catalogues, manifest, miniatures, images optimisees, masters non servis. Le
  budget de `recipes.js` couvre la source d'edition complete (660 Ko au
  25/07/2026, 800 Ko le 04/08/2026, 900 Ko le 05/08/2026 apres les imports de
  lots) ; les catalogues publics decoupes ont un budget total de 560 Ko depuis
  l'ajout de `recipeVersion` en v5.26.
- Les scripts de validation restent branches dans `npm run check`. Les
  validateurs ne doivent pas porter la version de release courante en dur
  (`vX.YY`, date, `?v=N`) : ils la derivent de `app.js`.
- Le preflight doit refuser les diffs image anormalement larges (sauf lot
  complet et equilibre qui passe `scripts/audit-images.js`), resynchroniser les
  catalogues, lancer les validations, demarrer un serveur local sur port libre
  et tester les assets critiques.
- Les rapports d'audit versionnes sont deterministes : aucun horodatage ne doit
  produire de diff sans changement de contenu.
- Les scripts PowerShell qui relisent puis reecrivent des sources UTF-8 (comme
  `app.js`) utilisent un encodage UTF-8 explicite ; jamais `Get-Content -Raw`
  suivi d'une reecriture.

### Admin local

- Les routes admin qui modifient l'etat refusent un `Origin` different de l'hote
  courant (CSRF). La connexion limite les echecs repetes par adresse (`429` avec
  `Retry-After`). Les uploads verifient extension et signature binaire (`jpg`,
  `png`, `webp`) avant ecriture dans `assets/uploads/`. Les pages admin
  respectent la CSP locale sans font ni CDN externe.

## 7. Versions

- Version produit unique `X.YY` : `SITE_VERSION` (`vX.YY`) dans `app.js`,
  `ANDROID_LEGACY_APK_VERSION` (`X.YY`) dans `app.js` et `cookNoteAndroidVersion`
  (`X.YY`) dans `android-legacy/gradle.properties`. Chaque APK publiee porte la
  meme version produit `X.YY` que le site au moment de sa construction.
- Toute modification produit versionnee augmente la version du site de `0.01`
  avec `node scripts/bump-version.js --next --site-only` et met `SITE_UPDATED_AT`
  a la date du jour (`JJ/MM/AA`) ; footer au format `vX.XX / JJ/MM/AA`. Une
  modification limitee aux garde-fous ou au workflow interne, sans effet sur le
  produit livre, ne declenche pas de release.
- Deux chiffres apres le point : apres `v1.99` vient `v2.00`, jamais `v1.100`.
- L'APK publiee et son manifeste gardent la version du dernier binaire
  construit. Lors d'une reconstruction demandee explicitement : aligner les trois
  valeurs avec `node scripts/bump-version.js --next`, puis
  `npm run apps:update-all`. Ne jamais annoncer ni publier une version APK sans
  binaire reconstruit correspondant.

## 8. Application Android 5.0+ (Native Lite)

### Perimetre et workflow

- L'app Android Legacy est un projet secondaire manuel avec parite site/app :
  quand une fonctionnalite visible du site, une recette, le catalogue ou l'UX
  concerne aussi la tablette, auditer et porter en Native Lite pour tablette peu
  puissante dans le meme lot. Le code reste pret a construire.
- Construire l'APK uniquement sur demande explicite de l'utilisateur : sans
  elle, ne pas lancer Gradle, `npm run apps:update-all`, `apps:rebuild` ni
  `android:legacy:update-apk`, ne pas remplacer les fichiers de `downloads/` ni
  le manifeste. Jamais branche sur `npm run build`, `check`, `preflight`, `start`
  ou `dev`.
- Workflow de reconstruction : `npm run apps:rebuild:check` puis
  `npm run apps:rebuild` (idempotent, version cible = version du site sans bump
  implicite, sauvegarde de l'APK precedente, verification version/signature
  avant copie, validations Android/cache/`dist`). `npm run apps:update-all` reste
  le workflow commun historique ; il ne construit maintenant que l APK Android
  Legacy et supprime les anciens `downloads/cook-note-android-legacy-v*.apk`.
  Details : `docs/android-legacy-workflow.md` et `docs/apps-install-workflow.md`.
- Publication GitHub Releases optionnelle, sur demande explicite seulement :
  `npm run apps:publish-all` (release commune `apps-vX.YY`) ;
  `npm run android:legacy:publish-release` reste une sous-commande interne.
- Application Android unique : `Cook Note Android 5.0+`. L'app Android HD/Modern
  est supprimee et ne revient ni dans le footer, ni dans les scripts, docs, APK,
  CSS ou validateurs sans demande explicite.

### Distribution et mise a jour

- Copies telechargeables uniquement dans `downloads/` : alias stable
  `cook-note-android-legacy.apk` plus `cook-note-android-legacy-vX.YY.apk`. Jamais
  dans `dist/` (limite Cloudflare de 25 MiB par fichier). Les APK/AAB generes
  ailleurs et `android-legacy/build/generated/cook-note-lite/` ne sont pas
  versionnes. `npm run validate:android` reste branche au check.
- Le bouton `Android 5.0+` du footer telecharge directement l'URL brute stable
  `https://raw.githubusercontent.com/LeParfait271/COOK-NOTE/main/downloads/cook-note-android-legacy.apk`,
  qui ne contient jamais la version. Le panneau d'installation garde le lien
  `github.com/LeParfait271/COOK-NOTE/raw/main/downloads/`, le secours
  `raw.githubusercontent.com` et la page GitHub du fichier.
- Mise a jour in-app : au demarrage, l'app lit `downloads/android-latest-version.json`
  (meme version produit, versionCode `major*1000+minor`, regenere par
  `scripts/bump-version.js`), propose un dialogue, telecharge via
  `DownloadManager` puis ouvre l'installateur systeme (avant Android 7, avec
  l'URI `file://` du fichier telecharge). Le catalogue reste 100% local ; le
  reseau ne sert qu'a ce controle et echoue en silence hors ligne.
- Signature : cle release stable gardee hors Git dans `android-legacy/signing/`
  (`cook-note-release.jks` + `keystore.properties`, dossier ignore), via
  `signingConfigs.release`. Aucun mot de passe de signature dans un fichier
  versionne. L'ancienne cle publiee a ete remplacee le 24/10/2026, ce qui impose
  une desinstallation unique de l'app v5.32. Sauvegarder `android-legacy/signing/`
  hors du PC : sa perte impose une nouvelle desinstallation. Ne jamais revenir a
  `signingConfigs.debug` (cle regeneree par machine,
  `INSTALL_FAILED_UPDATE_INCOMPATIBLE`) ni regenerer la cle sans demande
  explicite.

### Contraintes techniques

- App native Java pour Android 5 et tablettes 2 Go : pas de WebView systeme, pas
  de GeckoView ARMv7, pas de serveur HTTP local `127.0.0.1`, pas de React, pas de
  service worker, pas de dossier `assets/www`, pas de `usesCleartextTraffic`.
  `minSdk 21`, page d'erreur native visible, `GridView` recyclee,
  `CookNoteRepository`, `ImageLoader`, cache memoire limite, images en `RGB_565`.
- Assets generes par `scripts/build-android-legacy-assets.js` dans
  `android-legacy/build/generated/cook-note-lite` : `recipes-lite.json` sans
  source externe, `images/` (grille, `480px` max), `detail-images/` (fiche,
  `960px` max), recompression `jpeg-js`, aucun asset web moderne brut. Les images
  derivent des assets nuit du site (`assets/theme/dark`), jamais des anciens
  derives Android, avec un redimensionnement lisse.
- Les optimisations Native Lite existantes (recherche temporisee et indexee,
  caches bornes, file image prioritaire, prechauffage et annulation des
  prefetchs, recyclage des vues, pile retour bornee, scroll fluide...) restent
  obligatoires ; `npm run validate:android` les verifie directement dans le code.

### Interface

- Lecture native claire et premium, theme nuit unique : cockpit culinaire avec
  surfaces charbon, accent or chaud, hierarchie typographique nette, cartes image
  16/9 et statuts locaux discrets. Accueil compact avec les fiches parentes du
  site, grille de cartes proches du site, header compact avec stats locales,
  hero de fiche encadre, sections cadrees, infos rapides en pastilles, grille
  Ingredients/Etapes/Avant de commencer, actions principales/secondaires
  distinguees. Pas de rendu web ni de controles Android par defaut sans
  direction Cook Note.
- Parite avec la typographie du site : titres (accueil `Cook Note`, titre de
  fiche, titres de section, numeros d'etape) en serif systeme `Ui.DISPLAY`,
  etapes en `Ui.READING` ; accueil avec titre typographique, sans logo image.
  Listes calmes : pas de boite par ingredient, conseil ou etape (repere dore,
  filet fin entre etapes) ; une seule surface par section.
- Recherche simple sans filtres (un champ et `Effacer`), recherche intelligente
  sans filtres sous le capot. Les fiches parentes lisent `master` et
  `additionalMasters` et affichent leurs recettes en cartes visibles, jamais dans
  un menu deroulant. Les fiches a variantes internes gardent un selecteur natif
  `Choisir une variante` et la preparation choisie.
- Fiche detail allegee : pas de saisons, difficulte, nombre d etapes, bouton
  favori ou bouton partager. Selecteur natif de personnes quand possible.
  `Avant de commencer` reste complet et derive des helpers web : allergenes,
  materiel, poids moyens, timing, recettes liees, repere cuilleres, conseils,
  notes restantes, conservation, rechauffage et fiche technique. L'essentiel
  reste ouvert ; le reste est range dans les familles repliables `Servir`,
  `Conserver` et `Maitriser` (`RecipeScreen.practicalFamily`), avec apercu.
- Fonctions natives legeres conservees : quantites ajustables, copie des
  ingredients et de la fiche, liste de courses locale cochable et fusionnee,
  transfert de la liste vers le telephone par QR code natif (meme lien que le
  site, encodeur `QrCode.java` verifie par `npm run test:android-qr`), cache image
  adaptatif, navigation restaurable, swipe retour bord gauche, ecran actif
  persistant et bouton natif `MISE A JOUR` (sans numero de version).
- Tous les boutons et cases reagissent a la premiere pression : jamais
  `setFocusableInTouchMode(true)` sur un controle tactile ; cases cochables
  explicitement cliquables et non focusables.
- Toute refonte Android est controlee sur un emulateur Android 5 API 21 (accueil,
  collection, fiche, recherche, courses) et le site est inspecte en bureau et
  mobile apres le lot pour garder l'harmonie site/APK.

## 9. Fonctions retirees ou refusees

Ne pas les recreer sans nouvelle demande explicite :

- Mode cuisine et minuteurs : pas de `focusMode`, `recipe-focus-mode`,
  `Mode cuisine`, `step-timer`, `timerEnd`, `timerLabel`, `cooking-step-card` ni
  `cooking-step-actions`.
- Blocs `Substitutions` et `Ratios culinaires` des fiches.
- Outils personnels refuses : carnet d'essais, statuts personnels,
  retroplanning, memoire automatique des ajustements, export PDF/dossier.
- Fiche recette : box d'actions des etapes, select inline `Choisir un bloc`,
  bouton parent `Choisir une recette` dans le hero, ancien panneau de variante
  selectionnee.
- Traduction anglaise automatique (section 5).
- Android : mode jour, theme jour/nuit, cartes compactes et anciens reglages
  `Texte 100%`, `Cartes confort`, `Derniere non`, `Diagnostic`. Les expressions
  historiques `preferences locales discretes` et `diagnostic hors ligne`
  designent ces fonctions retirees, interdites dans l'interface et le code.
- App Android HD/Modern, GeckoView, WebView ou serveur local dans Android Legacy.
