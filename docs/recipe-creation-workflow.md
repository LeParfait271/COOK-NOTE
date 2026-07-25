# Workflow de creation d'une recette

Ce workflow est obligatoire avant toute integration dans `recipes.js`. Il sert
a eviter les doublons, a choisir correctement entre variante, recette liee et
fiche distincte, puis a livrer une fiche complete avec ses images jour et nuit.

## 1. Inventorier avant de creer

1. Rechercher dans le catalogue le nom du plat, ses synonymes, son ingredient
   principal et sa technique.
2. Examiner les fiches proches, leurs variantes, leurs alias et leurs recettes
   liees.
3. Ne rien creer tant que l'identite culinaire de la nouvelle proposition n'a
   pas ete comparee aux fiches existantes.

## 2. Decider : variante, recette liee ou fiche distincte

L'identite du plat prime sur la methode de cuisson, le materiel ou une simple
modification d'ingredient.

### Variante de la meme fiche

Creer une variante lorsque le plat conserve le meme nom et la meme identite
culinaire. Une cuisson differente, un parfum, un ingredient secondaire ou une
presentation differente ne suffisent pas a creer une nouvelle famille.

Exemples Cook Note :

- `Poulet basquaise` et `Poulet basquaise au four` : variantes du Poulet
  basquaise.
- les tiramisus en verrine, a l'amaretto, a la creme de marrons et citron
  meringue : variantes du Tiramisu.
- pesto classique, pesto de tomates sechees et futur pesto d'olives : variantes
  de la fiche Pestos.
- aioli citronne leger et aioli au safran : variantes de l'Aioli.
- les gratins de chou-fleur classique, comte-lardons, mascarpone-moutarde et
  chorizo : variantes du Gratin de chou-fleur.
- tresse au beurre classique et tresse au beurre d'Andreas Caminada : variantes
  de la Tresse au beurre.
- mousse au chocolat et mousse au Toblerone : variantes de la Mousse au
  chocolat.

Test pratique : si une personne dirait naturellement « c'est toujours un
tiramisu, un pesto ou un poulet basquaise », choisir une variante.

### Recette liee ou composant

Une sauce, une base, une garniture ou un accompagnement utilise par un plat
n'est pas une variante de ce plat. Conserver sa fiche propre lorsqu'elle est
reutilisable, puis creer un lien interne.

Exemples Cook Note :

- le pesto est lie aux pates au pesto ; les pates ne sont pas une variante du
  pesto ;
- la sauce caramel est liee au cheesecake ou a la brioche perdue ; ces desserts
  ne sont pas des variantes de la sauce ;
- une sauce aux herbes servie avec des pommes de terre au barbecue reste un
  accompagnement, pas une variante des pommes de terre.

### Fiche distincte

Creer une fiche distincte lorsque le plat possede un autre nom culinaire, une
autre structure ou un resultat reconnu comme different.

Exemples :

- Poulet basquaise et Poulet tikka masala ;
- Pesto et Tapenade ;
- Houmous et Caviar d'aubergines ;
- Tiramisu et Charlotte ;
- Gratin dauphinois et Tartiflette ;
- Mayonnaise et Aioli ;
- gratin, puree, croquettes et salade de pommes de terre.

Le partage d'un ingredient principal ne suffit jamais a regrouper deux plats.

## 3. Choisir le bon rattachement

1. Respecter la hierarchie plate du catalogue : uniquement les huit fiches
   parentes racines et les recettes directement rattachees.
2. Ajouter les categories secondaires avec `additionalMasters` lorsqu'une
   recette a plusieurs usages reels.
3. Pour une famille culinaire comportant plusieurs recettes ouvrables, conserver
   une entree de collection claire et des URLs propres pour chaque recette.
4. Pour plusieurs preparations tres proches dans une seule fiche, utiliser les
   variantes internes seulement lorsque leurs ingredients et leurs etapes sont
   presentes dans la meme recette.

## 4. Rediger la fiche

1. Utiliser un titre culinaire neutre et factuel.
2. Renseigner rendement, temps, difficulte, categories, alias et tags utiles.
3. Donner des quantites metriques conformes aux regles Cook Note.
4. Separer clairement les groupes d'ingredients et ordonner les etapes.
5. Completer `Avant de commencer` : materiel, poids moyens, allergenes, timing,
   conservation, rechauffage, erreurs a eviter, resultat attendu et technique
   lorsque ces informations sont utiles.
6. Ajouter les liens internes vers sauces, bases, accompagnements ou techniques
   reutilises.
7. Ne jamais publier de champ source, credit, attribution ou URL d'origine.

## 5. Preparer et valider les images

1. Verifier les images existantes avant toute generation.
2. Examiner visuellement au moins trois references jour et trois references nuit
   pour reprendre exactement la direction artistique Cook Note.
3. Generer deux compositions reellement distinctes : une image jour et une image
   nuit representant le plat exact.
4. Montrer une paire jour/nuit a l'utilisateur et attendre sa validation avant
   de produire et d'integrer tout le lot.
5. Conserver les masters puis generer les derives avec les scripts du projet.
6. Valider le manifeste, les dimensions, le cadrage et l'absence de doublon
   visuel.

## 6. Controle avant integration

Repondre explicitement a ces questions :

- Existe-t-il deja une fiche portant la meme identite culinaire ?
- La difference concerne-t-elle seulement la cuisson, le materiel, un parfum ou
  un ingredient secondaire ? Si oui, choisir une variante.
- La nouveaute est-elle seulement une sauce ou un composant ? Si oui, creer un
  lien, pas une variante du plat.
- Le plat a-t-il un autre nom, une autre structure et un resultat distinct ? Si
  oui, choisir une fiche separee.
- Le rattachement respecte-t-il les huit parents racines ?
- Les images jour et nuit ont-elles ete validees avant integration ?

En cas de doute semantique reel, presenter le classement propose et attendre la
decision de l'utilisateur avant de modifier le catalogue.

## 7. Integration et livraison

1. Lancer le preflight.
2. Integrer la recette, ses rattachements, ses liens et ses images.
3. Regenerer catalogue, manifeste d'images, sitemap et `dist/` avec les scripts
   officiels.
4. Augmenter la version du site de `0.01` pour toute modification produit, sans
   reconstruire l'APK sauf demande explicite.
5. Lancer les validations recettes, doublons, parents, images, production,
   performance, theme et distribution.
6. Auditer la parite Android Legacy sans construire ni publier l'APK sans
   autorisation explicite.
7. Apres validations, commit et push sur `main`, puis signaler clairement les
   eventuels controles bloques.
