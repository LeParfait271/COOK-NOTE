# Registre des améliorations Cook Note

Dernière mise à jour : 09/08/2026

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
