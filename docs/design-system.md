# Design System Cook Note

Ce document est la reference visuelle du projet. Toute passe UI doit ameliorer le site sans changer la logique metier.

## Direction

- Experience sombre premium, culinaire, sobre et lisible.
- Pas de section gadget ajoutee pour "faire design".
- Les images recettes restent le signal principal. Les effets doivent soutenir la lecture, pas la remplacer.
- Les gradients sont utilises avec retenue, jamais comme decoration autonome.
- L'interface publique et l'admin doivent sembler appartenir au meme produit.
- Silent Design : retirer tout ce qui attire l'attention sans valeur avant
  d'ajouter une couleur, une ombre, une bordure, un texte ou une animation.
- Dual Art Direction : `night` est l'univers principal, profond et stable ;
  `day` est un univers lumineux, naturel et frais du meme produit. La logique,
  les layouts et les composants restent communs. La difference passe par les
  tokens d'ambiance et les assets conditionnels, jamais par une inversion CSS.

## Direction premium

Ces principes cadrent les passes de polish. Ils ne changent jamais la logique
metier et ne justifient pas d'ajouter une section gadget.

- Cinematic UI Engine : l'interface doit sembler filmee, avec un rythme entre
  les ecrans, des apparitions par sequences et des transitions qui preservent la
  continuite. Eviter les changements brusques.
- Magnetic Interaction Engine : les elements interactifs doivent donner un
  feedback immediat. Hover leger, press clair, focus visible et zones tactiles
  confortables ; pas d'effet qui fatigue le GPU ou gene la precision.
- Color Intelligence Engine : aucune teinte libre. Les contrastes, surfaces,
  etats et accents partent des tokens et restent harmonises dans le theme sombre.
- Breathing Layout Engine : chaque ecran doit respirer. Corriger blocs denses,
  listes interminables, cartes ecrasees, marges aleatoires et paddings trop
  proches avant d'ajouter du decor.
- Eye Tracking Simulator : verifier l'ordre de regard attendu. Le premier signal
  doit etre l'action ou l'information utile, puis le contexte, puis les details.
- Subconscious Quality Engine : traquer les details qui donnent une impression
  amateur : ombres lourdes, icones mal centrees, marges irregulieres, contrastes
  violents, animations robotiques, boutons trop petits.
- Screenshot Test : une capture de l'accueil, d'une fiche, d'un panneau et de
  l'admin doit donner envie d'utiliser ou installer le produit.
- Award Winning Design : rechercher equilibre, lumiere, composition, coherence
  et finesse sans copier une identite externe.
- First Impression Optimizer : les cinq premieres secondes doivent etre nettes :
  accueil comprehensible, arrivee fluide, vitesse percue forte et premier clic
  evident.
- Premium Value Perception : chaque detail doit augmenter la valeur percue :
  finition, coherence, transitions, etats de chargement, retours visuels et
  sobriete.

## Tokens principaux

Les styles nouveaux doivent partir des tokens. Une valeur locale n'est acceptable que pour une mesure de layout non reutilisable.

### Couleurs

- Fond : `--ds-color-background`.
- Surface : `--ds-color-surface`, `--ds-color-surface-strong`, `--ds-color-surface-soft`.
- Elevated : `--ds-color-elevated`.
- Primary : `--ds-color-primary`.
- Secondary : `--ds-color-secondary`, uniquement comme profondeur du primary.
- Accent : `--ds-color-accent`, aligne sur le primary par defaut.
- Texte : `--ds-color-text-primary`, `--ds-color-text-secondary`, `--ds-color-text-muted`.
- Bordures : `--ds-color-border`, `--ds-color-border-strong`, `--ds-color-divider`.
- Etats : `--ds-color-success`, `--ds-color-warning`, `--ds-color-error`, `--ds-color-info`.

Regle : une seule couleur principale visible. Les autres couleurs servent aux neutres, aux etats fonctionnels ou a de tres rares accents d'information.

### Espacement

Grille stricte :

- `--ds-space-1` = `4px`.
- `--ds-space-2` = `8px`.
- `--ds-space-3` = `12px`.
- `--ds-space-4` = `16px`.
- `--ds-space-5` = `24px`.
- `--ds-space-6` = `32px`.
- `--ds-space-7` = `48px`.
- `--ds-space-8` = `64px`.

### Radius

- Rayon compact : `--ds-radius-sm` = `6px`.
- Rayon standard : `--ds-radius-md` = `10px`.
- Rayon large : `--ds-radius-lg` = `16px`.
- Rayon extra large : `--ds-radius-xl` = `24px`.
- Rayon pilule : `--ds-radius-pill` = `999px`.

### Ombres

- `--ds-shadow-0` : flat.
- `--ds-shadow-1` : panneau ou carte stable.
- `--ds-shadow-2` : hover / carte elevee.
- `--ds-shadow-3` : modale / overlay.

Les ombres restent douces, jamais lourdes.

### Motion

- Motion rapide : `--ds-motion-fast` = `120ms`.
- Motion standard : `--ds-motion-normal` = `200ms`.
- Motion lente : `--ds-motion-slow` = `320ms`.
- Le zoom image des cartes recette : `--ds-card-image-motion` = `250ms` maximum, exception performance pour eviter le jank GPU.
- Courbe : `--ds-ease-out` = `cubic-bezier(.22, .72, .2, 1)`.
- Hauteur controle standard : `40px`.
- Hauteur tactile mobile : `44px`.

Respect obligatoire de `prefers-reduced-motion`.

## Themes

- Le theme `dark` est la reference visuelle Cook Note. Il peut etre corrige ou
  uniformise, mais son identite sombre chaude ne doit pas etre remplacee.
- Le theme `light` conserve la meme hierarchie, avec des fonds ivoire doux, des
  surfaces chaudes, un accent ambre/brun et des contrastes confortables. Pas de
  blanc pur agressif.
- `theme.js` applique `data-theme` avant le chargement du CSS pour limiter le
  scintillement. Le dark mode reste le mode de base, puis le choix utilisateur
  jour/nuit est stocke dans `cook_note_preferences`.
- Les couleurs passent par les tokens semantiques. Un composant ne doit pas
  porter une couleur de theme en dur si `--ds-color-*`, `--ds-shadow-*` ou un
  token de surface couvre le besoin.
- Toute nouvelle surface doit etre testee au minimum en `.theme-dark` et
  `.theme-light`, avec focus visible, hover/active lisible et contraste texte
  confortable.
- `npm run validate:theme` verifie le runtime, le chargement avant CSS, le
  service worker, le build et les points d'integration principaux.

## Assets conditionnels

- Les assets de marque et d'ambiance passent par `theme.js` :
  `CookNoteTheme.asset(name, theme)` dans React, `data-art-asset` dans le HTML
  statique et `--art-*` dans le CSS.
- Assets supportes : `background`, `hero`, `logo`, `appIcon`.
- `DAY_ASSETS_APPROVED` reste le verrou de validation visuelle : `true` active
  les assets jour avec `data-art-assets="approved"`, `false` force le fallback
  nuit avec `data-art-assets="night-fallback"`.
- Les futures images jour validees vont dans `assets/theme/day/` avec des noms
  stables sous `global/`, `categories/` ou `recipes/`.
- Les overrides image recette sont declares dans `app-art-images.js` :
  `assets/theme/day/recipes/*.jpg` pour le mode jour et
  `assets/theme/dark/recipes/*.jpg` pour le mode nuit.
- Interdit : `filter`, inversion automatique, image nocturne forcee dans le
  mode jour, ou chemin d'asset global en dur dans un composant.

## Dark Mode

- Le theme public est un vrai dark mode : fonds noirs chauds, surfaces brun-noir, lignes champagne faibles, accent ambre.
- Pas de noir pur empile sans surface intermediaire dans les panneaux.
- Le cyan/mako reste un etat d'information rare, pas une deuxieme couleur de marque.
- Ne pas introduire une nouvelle couleur visible sans raison fonctionnelle.

## Typographie

- Police systeme uniquement.
- Letter spacing a `0` pour les contenus, sauf petits libelles uppercase deja presents.
- Niveaux a respecter : display, heading, body, caption, label.
- Les titres de cartes doivent rester sur deux lignes maximum avec ellipsis ou line-clamp.
- Les textes de boutons et pastilles doivent rester lisibles sur mobile, sans debordement.

## Composants

Chaque composant interactif doit couvrir :

- normal ;
- hover ;
- active ;
- focus visible ;
- disabled ;
- loading quand une attente existe ;
- success quand le composant porte un etat positif ;
- error quand le composant porte un etat bloquant.

Les boutons, cartes, panneaux, modales, toasts, inputs et tabs doivent reutiliser les memes rayons, durees, courbes et focus ring.

Les controles qui vivent sur une meme ligne d'action doivent partager la meme hauteur visible : bouton texte, bouton icone et select de quantite ne doivent pas avoir de rythme different.

Le select de quantite est un controle prioritaire : il doit rester contraste sur desktop et mobile meme si les styles globaux des champs changent.

## Responsive

- Mobile : aucun texte ne doit chevaucher son conteneur.
- Mobile : les tabs/filtres courts doivent utiliser une grille stable plutot qu'une flex row aleatoire quand le nombre d'items est connu.
- Tablette : les grilles doivent conserver des tailles stables.
- Desktop : les panneaux doivent respirer sans diluer les actions.

## Accessibilite

- Le focus visible ne doit jamais disparaitre.
- Les contrastes du dark mode doivent rester lisibles pour texte, boutons, champs et badges.
- Les etats vides et de chargement doivent donner un retour immediat.

## Verification

Avant push visible apres une passe design :

- lancer le check complet ;
- lancer le test visuel ;
- verifier que `style.css`, `admin.css` et cette doc restent coherents ;
- bump la version si `style.css` change.
