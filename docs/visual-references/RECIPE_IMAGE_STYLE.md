# Kit visuel des images recette Cook Note

Ce document et les six images du dossier `recipe-images/` constituent la
reference obligatoire pour toute nouvelle generation d'image recette. Ils
remplacent la recherche aleatoire d'anciennes images et permettent de conserver
la direction artistique dans une nouvelle conversation.

## References approuvees

### Jour

- Fenetre a gauche, plat de viande :
  `recipe-images/day/window-left-filet-mignon.jpg`
- Fenetre a gauche, pain entier :
  `recipe-images/day/window-left-focaccia.jpg`
- Fenetre a droite, plat de cuisson entier :
  `recipe-images/day/window-right-tian.jpg`

### Nuit

- Fenetre a gauche, sauce sombre :
  `recipe-images/night/window-left-balsamique.jpg`
- Fenetre a droite, petites pieces :
  `recipe-images/night/window-right-brochettes-lotte.jpg`
- Fenetre a droite, sauce :
  `recipe-images/night/window-right-sauce-moutardes.jpg`

Ces fichiers sont des references de style et de composition. Ils ne doivent pas
etre publies comme nouvelles images recette, recadres, recolores ou reutilises
pour une autre fiche.

## Methode obligatoire

1. Lire ce document avant toute generation.
2. Inspecter visuellement les trois references du theme concerne.
3. Pour chaque appel de generation, fournir comme reference d'entree l'image du
   meme theme dont le cadrage et le type de plat sont les plus proches.
4. Alterner la fenetre a gauche et a droite sur l'ensemble du lot. La repartition
   finale doit etre aussi proche que possible de 50/50.
5. Generer une composition jour et une composition nuit reellement distinctes.
6. Comparer visuellement chaque sortie aux references avant de l'integrer.
7. Rejeter et recommencer automatiquement toute sortie qui enfreint un des
   criteres ci-dessous.
8. Une fois chaque sortie conforme, terminer et integrer le lot sans attendre de validation utilisateur.
   Ne montrer les apercus que sur demande.

## Direction artistique mesuree

- Format horizontal 16:9.
- Photographie culinaire realiste et cinematographique.
- Vue a hauteur de table, legerement plongeante, jamais totalement aerienne.
- Plat occupant environ 45 a 60 % de la largeur.
- Sujet net et detaille ; arriere-plan progressivement plus doux.
- Horizon situe dans le tiers superieur.
- Fenetre ou ouverture placee alternativement a gauche ou a droite.
- Chateau identifiable mais secondaire, environ 2 a 4 % de la largeur.
- Chateau dans le paysage lointain, avec une vraie profondeur de vallee entre
  la cuisine et lui ; jamais colle a l'ouverture.
- Cuisine medievale en pierre, bois ancien sombre, ferronnerie, gres et cuivre
  patine.
- Deux ou trois accessoires discrets au maximum.
- Aucun objet moderne, aucun texte, aucune personne et aucun watermark.
- Grain presque imperceptible ; pas de rendu HDR, plastique, cartoon ou
  excessivement net.

## Representation culinaire

- Montrer uniquement la recette nommee dans la fiche, jamais ses variantes.
- Montrer le plat entier lorsque la presentation traditionnelle le demande :
  tarte, gateau, tiramisu, gratin, pain, focaccia ou piece rotie.
- Plusieurs exemplaires sont autorises seulement pour une preparation
  naturellement multiple : cookies, galettes, brochettes, acras ou boulettes.
- Une decoupe partielle est permise uniquement lorsqu'elle revele une farce ou
  une texture essentielle, tout en conservant la preparation principale
  visiblement entiere.
- Les accessoires et ingredients secondaires ne doivent jamais concurrencer la
  recette.
- La presentation reste genereuse, credible et traditionnelle, sans dressage
  artificiellement gastronomique.

## Mode jour

- Lumiere naturelle douce, diffuse et legerement chaude.
- Ambiance lumineuse mais assourdie, jamais surexposee.
- Vallee verte, profonde et legerement brumeuse.
- Ciel clair ou couvert conservant ses details.
- Pierre beige-grise, bois sombre et cuivre chaud.
- Ombres presentes pour conserver l'atmosphere du chateau.

Prompt de base :

```text
Photographie culinaire Cook Note au format horizontal 16:9. Une seule
preparation correspondant exactement au nom de la recette, presentee de facon
traditionnelle et entiere lorsque cela s'applique. Cuisine medievale en pierre
dans un chateau, table en vieux bois sombre, gres et cuivre patine, deux ou
trois accessoires discrets maximum. Vue a hauteur de table legerement
plongeante, plat occupant 45 a 60 % de la largeur, nourriture nette et
arriere-plan progressivement doux. Lumiere naturelle douce et legerement
chaude, vallee verte profonde. Fenetre du cote demande. Chateau identifiable
mais tres secondaire, dans le paysage lointain, environ 2 a 4 % de la largeur.
Rendu photorealiste et cinematographique, couleurs naturelles, grain presque
imperceptible. Aucun texte, personne, watermark, objet moderne, collage de
variantes, tres gros plan, vue aerienne ou rendu HDR.
```

## Mode nuit

- Exterieur bleu profond.
- Interieur sombre avec des noirs riches conservant leurs details.
- Une seule petite bougie courte comme source chaude principale.
- Lune et vallee fournissant une faible lumiere froide secondaire.
- Aucun eclairage electrique apparent.
- Nourriture lisible sans effet de projecteur de studio.

Prompt de base :

```text
Photographie culinaire Cook Note de nuit au format horizontal 16:9. Une seule
preparation correspondant exactement au nom de la recette, presentee de facon
traditionnelle et entiere lorsque cela s'applique. Cuisine medievale en pierre
dans un chateau, table en vieux bois noirci, gres et cuivre patine, deux ou
trois accessoires discrets maximum. Vue a hauteur de table legerement
plongeante, plat occupant 45 a 60 % de la largeur, nourriture nette et
arriere-plan progressivement doux. Interieur tres sombre aux noirs detailles,
une seule petite bougie courte, faible lumiere froide venant de la lune et de
la vallee bleue. Fenetre du cote demande. Chateau identifiable mais tres
secondaire, dans le paysage lointain, environ 2 a 4 % de la largeur. Rendu
photorealiste et cinematographique, grain presque imperceptible. Aucun texte,
personne, watermark, objet moderne, eclairage electrique, collage de variantes,
tres gros plan, vue aerienne ou rendu HDR.
```

Le prompt final ajoute seulement les informations necessaires a la recette :
forme traditionnelle, contenant, texture, cuisson visible, garniture essentielle
et cote de la fenetre. Il ne doit pas reinventer la direction artistique.

## Rejet automatique

Recommencer l'image sans la presenter si l'un de ces defauts est visible :

- chateau trop proche, trop grand, trop net ou presque invisible ;
- fenetre du mauvais cote ou repetition desequilibree dans le lot ;
- plat trop proche, trop petit ou coupe sans justification ;
- vue totalement aerienne ;
- plusieurs recettes ou variantes ;
- presentation differente du nom de la fiche ;
- trop d'accessoires ou d'ingredients disperses ;
- cuisine moderne ou ambiance de maison contemporaine ;
- image granuleuse, floue, plastique, cartoon ou sursaturee ;
- jour blanc et surexpose ;
- nuit grise, orange ou insuffisamment profonde ;
- plusieurs bougies, bougie trop haute ou lumiere de studio manifeste.

## Controle avant integration

- Le sujet culinaire correspond exactement a la fiche.
- Les compositions jour et nuit sont distinctes.
- Le cote de la fenetre respecte l'alternance du lot.
- La taille et la distance du chateau correspondent aux references.
- Le plat, le cadrage, la lumiere, le grain et les accessoires sont conformes.
- Chaque sortie a passe le controle automatique de conformite au kit.
- Les masters et les derives locaux ont ete crees avec les scripts du projet.
