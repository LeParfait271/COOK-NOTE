# Registre des améliorations Cook Note

Dernière mise à jour : 10/08/2026

## Décisions de cette session

Les cinq lots proposés le 06/08/2026 sont acceptés :

1. fiabiliser l’audit des fiches parentes et des variantes internes ;
2. corriger les fiches réellement faibles et renforcer leurs liens utiles ;
3. ajouter les parcours smoke des courses, du menu et des techniques ;
4. alléger les assets de l’APK Android Legacy puis reconstruire l’APK ;
5. contrôler les images signalées sans régénérer d’image déjà correcte.

Statut de suivi : `accepté`, à valider avant le commit local.

## Règle de non-reproposition

Une proposition refusée, reportée ou exclue reste inscrite ici avec son statut et
ne doit pas être reproposée sans nouvelle demande explicite. Les exclusions
déjà actées à respecter restent : Android Modern/HD, WebView ou serveur local
dans Legacy, réglages visuels/diagnostic Android, mode cuisine et minuteurs,
gadgets ou refonte de l’accueil, interactions château/lune, sélecteur de hero
parent, doublons de panneaux/barres de commande et filtres de recherche lourds.

## Lots suivants acceptés

Le 09/08/2026, « vas-y » valide les quatre lots suivants :

1. fiabiliser les alertes de doublons et le signal conservation/sécurité de l’audit ;
2. enrichir la découverte par tags, alias et liens internes ciblés ;
3. documenter la conservation de dix recettes sensibles avec des consignes prudentes ;
4. conserver les reclassements automatiques incohérents hors périmètre.

Réalisation de ce lot : qualité et découverte de l’audit à zéro alerte ; dix fiches
de conservation enrichies ; dix fiches sans liens internes traitées. L’APK reste
en v4.56 tant qu’une reconstruction Android n’est pas demandée explicitement.

## Import des recettes du 09/08/2026

Les six pages fournies ont été recherchées puis verrouillées avant intégration :

- `Charlotte aux abricots`, `Charlotte poire & caramel`, `Charlotte poire/chocolat`,
  `Mini-charlotte aux fruits rouges` et `Charlotte aux fraises` partagent le même
  nom culinaire, la même structure de charlotte montée et la même fonction de
  dessert. Elles sont donc cinq variantes de la nouvelle fiche directement racine
  `charlotte_variantes` sous `Desserts`.
- `Opéra` possède une identité, une structure en couches et une finition propres.
  Il reste une fiche autonome `opera`, directement rattachée à `Desserts`, et ne
  devient pas une variante de Charlotte.

Décision : `variante` pour les cinq Charlottes, `fiche distincte` pour l’Opéra.
Aucun refus ni exclusion existante n’est réouvert ; aucun champ de source ou URL
externe n’est publié dans les données recette.

## Améliorations acceptées le 10/08/2026

Le 10/08/2026, « vasi » valide les six améliorations proposées ensuite :

1. expliciter la conservation et les précautions alimentaires des 45 fiches encore
   signalées par l’audit ;
2. ajouter des liens internes ciblés, uniquement quand la relation culinaire est
   suffisamment évidente, sans reclassement automatique global ;
3. renforcer les parcours clavier et les attributs d’accessibilité par un smoke test ;
4. vérifier le parcours hors-ligne de la PWA et le cache de secours ;
5. couvrir la recherche par quelques cas de qualité reproductibles ;
6. ajouter un smoke test structurel du catalogue Android Legacy et de ses variantes.

Statut : `accepté`, à valider avant le commit local.

## Correction intégrale de l’audit visuel du 10/08/2026

La demande explicite « vasi pour tout », faite après l’audit visuel complet, valide
la correction de chaque défaut constaté dans ce même audit. Elle remplace, pour le
périmètre web actuel, la réouverture antérieure du mode cuisine : cette fonctionnalité
est de nouveau retirée du produit, de ses assets, du cache et des parcours de test.

Les décisions appliquées sont :

1. ramener la palette de recherche à un champ, quatre accès rapides au maximum et
   des résultats uniquement après saisie ;
2. donner aux collections leur illustration de catégorie, sans logo Cook Note géant
   ni répétition du titre et du compteur juste sous le hero ;
3. supprimer l’espace mort sous la barre fixe, compacter la fiche et regrouper les
   actions secondaires dans « Plus » ;
4. recentrer durablement les liens profonds des techniques et replier leurs filtres
   sur mobile jusqu’à la demande de l’utilisateur ;
5. rendre les premières catégories visibles avant la navigation basse sur mobile,
   conserver des cibles tactiles de 44 px et éviter la coupure du trajet Courses ;
6. supprimer le doublon visuel des titres sur les cartes de catégories lorsque le
   visuel porte déjà le nom de la catégorie.

Le lot reste strictement web/PWA. Il n’autorise ni reconstruction, ni mise à jour,
ni publication de l’APK Android Legacy.

Statut : `accepté`, validation visuelle et technique requise avant le commit local.

## Ajustement visuel des fiches accepté le 10/08/2026

La demande de poursuivre les améliorations visuelles en supprimant le défilement
interne des fiches est appliquée : les panneaux Ingrédients, Étapes et Avant de
commencer restent ouverts dans le flux de la fiche, sans hauteur plafonnée,
position sticky ni barre de défilement propre au panneau.

Le défilement global du navigateur reste nécessaire pour les recettes longues,
afin de conserver toutes les informations accessibles sur mobile et desktop.
Les filtres Techniques reviennent à la ligne pour éviter tout rail horizontal
compressé ou chevauchement de libellés.

Le smoke test Android contrôle le catalogue source et les règles de génération.
La reconstruction et la publication d’un nouvel APK restent hors de ce lot tant
qu’une demande explicite de rebuild Android n’est pas formulée. Les exclusions
antérieures, notamment les filtres de recherche lourds et les reclassements
automatiques incohérents, restent inchangées et ne seront pas reproposées.

## Bilan du lot du 10/08/2026

Le lot est réalisé et validé :

- les 45 alertes de conservation/sécurité sont documentées ; l’audit passe à
  `100/100`, avec `0` alerte de conservation et `0` fiche faible ;
- 28 liens internes ciblés sont ajoutés ; les 212 fiches restantes sans lien sont
  conservées comme chantier séparé, sans génération automatique de relations ;
- 46 smoke tests navigateur passent sur desktop et mobile, dont les parcours
  clavier, hors-ligne, recherche, panier, menu et techniques ;
- le smoke test Android Legacy passe sur le catalogue source, les huit racines et
  les variantes ; les assets générés restent en v4.58, signalés comme obsolètes
  par rapport au site v4.59 jusqu’à une demande explicite de rebuild APK.

## Optimisations haut de gamme acceptées le 10/08/2026

La demande explicite « ok pour tout » réouvre le mode cuisine précédemment exclu
et valide les cinq axes proposés : performance mobile mesurée, PWA hors-ligne,
mode cuisine, fiabilité du build et préparation de l’architecture Android moderne.
Le mode cuisine est chargé à la demande puis couvert par un smoke test ; aucune
reconstruction ou mise à jour de l’APK Android Legacy n’est autorisée par cette
décision.

Statut : `accepté`, à valider avant le commit local.

## Priorité de la correction visuelle

La section « Correction intégrale de l’audit visuel du 10/08/2026 » est la décision
la plus récente pour le site web. Elle annule explicitement la réouverture du mode
cuisine décrite juste au-dessus, sans rouvrir le périmètre Android.
