# Workflow compact d'ajout d'une recette

Ordre obligatoire : rechercher, classer, rediger, illustrer, integrer, valider.
Les details generaux restent dans `COOK_NOTE_RULES.md` et le style des images
dans `docs/visual-references/RECIPE_IMAGE_STYLE.md`.

## 1. Recherche

- Chercher nom, synonymes, ingredient principal et technique dans `recipes.js`.
- Examiner fiches proches, alias, variantes et recettes liees.
- Identifier la fiche existante la plus proche avant toute creation.

## 2. Verrou de classement obligatoire

L'identite du plat prime sur la cuisson, le materiel et les ingredients
secondaires.

### Variante

Fusion autorisee seulement si tout est vrai :

1. meme nom culinaire reconnu, apres retrait du parfum, de la garniture, de la
   cuisson ou de la presentation ;
2. meme structure, meme fonction a table et meme resultat attendu ;
3. aucun autre nom culinaire autonome reconnu ;
4. differences limitees a un parfum, aromate, alcool, ingredient secondaire,
   garniture, cuisson, materiel, presentation ou adaptation conservant le plat.

Un critere faux interdit la fusion.

### Recette liee

Une sauce, base, garniture ou accompagnement reutilisable garde sa fiche et est
lie au plat. Une sauce aux herbes servie avec des pommes de terre n'est donc pas
une variante des pommes de terre.

### Fiche distincte

Creer une fiche distincte si le nom, la structure, la fonction ou le resultat
culinaire change. Un ingredient, une couleur, une texture, une image, une
cuisson ou des mots communs ne suffisent jamais a former une famille.

Reperes obligatoires :

- `Poulet basquaise au four` -> variante du Poulet basquaise ;
- `sauce Choron` -> variante de la Bearnaise, jamais de la Mayonnaise ;
- `Mayonnaise et Aioli`, Pesto et Tapenade, Houmous et Caviar d'aubergines,
  Tiramisu et Charlotte, Gratin dauphinois et Tartiflette -> fiches distinctes.

### Preuve avant modification

Consigner avant d'ecrire dans `recipes.js` :

1. nouvelle recette ;
2. fiche la plus proche et son id, ou `aucune` ;
3. identite commune eventuelle ;
4. differences structurantes et secondaires ;
5. decision finale (`variante`, `recette liee`, `fiche distincte`) et une phrase
   de justification.

`C'est proche`, `memes ingredients` ou `meme cuisson` ne justifie jamais une
fusion. En cas d'ambiguite semantique persistante, ne rien fusionner et demander
le classement a l'utilisateur.

## 3. Donnees et rattachement

- Respecter la hierarchie plate : huit parents racines, aucun parent
  intermediaire ; utiliser `additionalMasters` pour les usages secondaires.
- Conserver toutes les informations culinaires utiles de la source.
- Titre neutre et factuel ; variante nommee par son element distinctif notable.
- Interdits dans titre/libelle : source, auteur, site et qualificatif marketing
  (`rapide`, `facile`, `simple`, `express`, `premium`, `haut de gamme`,
  `basique`, `inratable`).
- Renseigner rendement, temps, difficulte, categories, alias, tags, quantites
  metriques, groupes, etapes, liens et informations utiles d'`Avant de
  commencer`.
- Ne publier aucun champ de source, credit, attribution ou URL d'origine.

## 4. Images

- Lire le kit visuel et examiner ses trois references jour et trois references nuit.
- Donner a chaque generation une reference du meme theme et du type de plat le
  plus proche.
- Creer une composition jour et une nuit du plat exact, sans variantes
  melangees ; alterner fenetre gauche/droite pour tendre vers 50/50 sur le lot.
- Comparer chaque sortie au kit et regenerer automatiquement toute image non
  conforme.
- Une fois conforme, integrer le lot sans attendre de validation utilisateur ;
  montrer des apercus seulement sur demande.
- Conserver les masters, generer les derives locaux et valider manifeste,
  dimensions, cadrage et doublons.

## 5. Integration

1. Lancer le preflight.
2. Integrer recette, classement, liens et images.
3. Synchroniser catalogue, manifeste, sitemap et `dist/`.
4. Pour une modification produit, augmenter la version du site de `0.01`.
5. Valider recettes, quantites, doublons, parents, liens, images, production,
   performance, theme, cache et distribution.
6. Auditer Android Legacy sans construire ni publier l'APK sans autorisation.
7. Rapporter resultat et blocages, puis appliquer les autorisations Git fixees
   par le depot et la conversation.
