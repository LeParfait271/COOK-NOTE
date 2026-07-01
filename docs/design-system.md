# Design System Cook Note

Ce document est la reference visuelle du projet. Toute passe UI doit ameliorer le site sans changer la logique metier.

## Direction

- Experience sombre premium, culinaire, sobre et lisible.
- Pas de section gadget ajoutee pour "faire design".
- Les images recettes restent le signal principal. Les effets doivent soutenir la lecture, pas la remplacer.
- Les gradients sont utilises avec retenue, jamais comme decoration autonome.
- L'interface publique et l'admin doivent sembler appartenir au meme produit.

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
