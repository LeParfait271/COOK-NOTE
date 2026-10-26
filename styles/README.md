# Feuilles de style du site

Ces fichiers sont concatenes dans l ordre de leur prefixe pour former `/style.css`
(par `server.js` en local et par `npm run build` pour `dist/`). L ordre compte : les
couches suivantes surchargent les precedentes. La liste est dans
`scripts/lib/app-modules.js` (`STYLE_MODULES`).

- `01-socle.css` : Socle : jetons du design system, base, defilement, mouvement, pied de page, barre du haut, boutons.
- `02-accueil.css` : Accueil : hero, partage, recherche d accueil, garde-manger, saisons, techniques.
- `03-cartes-et-fiche.css` : Cartes et fiche recette : grille, cartes, hero de fiche, variantes, ingredients, etapes, notes, Avant de commencer.
- `04-panneaux.css` : Panneaux : fenetres, preferences, hors ligne, recherche, liste de courses, mode menu, notifications.
- `05-raffinements.css` : Raffinements : couche premium des cartes, palette de commandes, responsive intermediaire.
- `06-finitions-et-themes.css` : Finitions et themes : survols, reflets, animations, univers nuit et jour.
- `07-responsive.css` : Responsive : mouvement reduit, points de rupture et verrous finaux.
- `10-design.css` : Couche `design` : polices Fraunces/Inter, jetons OKLCH/P3, mise en page calme
  (catalogue, cartes, hero de fiche, listes, familles d Avant de commencer, pied de page),
  transitions de vue et fenetres `<dialog>`.
- `11-design-fiche.css` : Couche `design`, suite : fiche recette (Avant de commencer, variantes, etapes,
  ingredients en colonnes), mouvements, recherche en vignettes, chapitres, controle qualite et impression.
- `12-design-effets.css` : Couche `design`, effets : transition carte -> fiche, titres variables, images en
  fondu, quantites qui defilent, minuteurs, mode cuisine, fond vivant (transform seulement, cadence).

Les modules `0x-` sont emis dans `@layer legacy`, les modules `1x-` dans `@layer design`
(`STYLE_LAYERS` dans `scripts/lib/app-modules.js`) : la couche `design` l emporte sans
`!important`. Les nouveaux styles vont dans `10-design.css` ou `11-design-fiche.css` (50 Ko max par fichier).

Quand une regle design remplace entierement une propriete d un selecteur legacy identique,
retirer la declaration legacy au lieu de l empiler : un allegement de ce type (441 declarations,
230 -> 209 Ko) a ete verifie par comparaison des styles calcules avant/apres (0 ecart).
