# Design System Cook Note

Ce document est la reference visuelle du projet. Toute passe UI doit ameliorer le site sans changer la logique metier.

## Direction

- Experience sombre premium, culinaire, sobre et lisible.
- Pas de section gadget ajoutee pour "faire design".
- Les images recettes restent le signal principal. Les effets doivent soutenir la lecture, pas la remplacer.
- Les gradients sont utilises avec retenue, jamais comme decoration autonome.

## Tokens principaux

- Rayon standard : `--ds-radius-md` = `8px`.
- Rayon compact : `--ds-radius-sm` = `7px`.
- Rayon pilule : `--ds-radius-pill` = `999px`.
- Motion rapide : `150ms`.
- Motion standard : `200ms`.
- Motion lente maximale : `250ms`.
- Courbe : `cubic-bezier(.22, .72, .2, 1)`.

## Couleurs

- Le theme public est un vrai dark mode : fonds noirs chauds, surfaces brun-noir, lignes champagne faibles, accent ambre.
- Le cyan/mako reste secondaire et rare, surtout pour signaler l'installation ou l'assistant.
- Les gris et les lignes doivent venir des tokens `--surface`, `--surface-strong`, `--surface-soft`, `--line` et `--rim`.
- Ne pas introduire une nouvelle couleur visible sans raison fonctionnelle.

## Typographie

- Police systeme uniquement.
- Letter spacing a `0` pour les contenus, sauf petits libelles uppercase deja presents.
- Les titres de cartes doivent rester sur deux lignes maximum avec ellipsis ou line-clamp.
- Les textes de boutons et pastilles doivent rester lisibles sur mobile, sans debordement.

## Composants

Chaque composant interactif doit couvrir :

- normal ;
- hover ;
- active ;
- focus visible ;
- disabled ;
- success quand le composant porte un etat positif ;
- error quand le composant porte un etat bloquant.

Les boutons, cartes, panneaux, modales, toasts, inputs et tabs doivent reutiliser les memes rayons, durees, courbes et focus ring.

## Motion

- Transitions entre `150ms` et `250ms`.
- Pas d'animation decorative permanente.
- Les apparitions de modales et toasts sont utiles, courtes et calmes.
- Respect obligatoire de `prefers-reduced-motion`.

## Responsive

- Mobile : aucun texte ne doit chevaucher son conteneur.
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
