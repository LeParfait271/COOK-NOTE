/* global React, ReactDOM, QRCode */

const { useEffect, useMemo, useRef, useState } = React;
const h = React.createElement;

const HERO_IMAGE = '/assets/base-du-site.png';
const COOK_NOTE_LOGO = '/assets/cook-note-white.png';
const SITE_VERSION = 'v1.12';
const SITE_UPDATED_AT = '02/06/26';

const SEASONS = ['Printemps', 'Été', 'Automne', 'Hiver'];
const DIFFICULTY_LABELS = { easy: 'Facile', medium: 'Intermédiaire', hard: 'Technique' };
const CATEGORY_ACCENTS = {
  'Apéro': '#b51f30',
  'Entrées': '#697c1f',
  'Plats': '#c46311',
  'Accompagnements': '#8b7f1f',
  'Desserts': '#7d5565',
  'Petits-déjeuners': '#b07a16',
  'Sauces': '#b84a16',
  'Base': '#0f8a84'
};
const HOME_CARD_ORDER = {
  petit_dejeuner_maitre: 1,
  apero_maitre: 2,
  entrees_maitre: 3,
  sauces_maitre: 4,
  elements_base_maitre: 5,
  plats_maitre: 6,
  accompagnements_maitre: 7,
  desserts_maitre: 8
};
const MONTHLY_ADDITIONS = [
  { id: 'puree_butternut_pommes_terre_curry', addedAt: '2026-06-02' },
  { id: 'joues_boeuf_whiskey_orange', addedAt: '2026-06-02' },
  { id: 'sauce_roquefort', addedAt: '2026-06-02' },
  { id: 'curry_carottes_lait_coco', addedAt: '2026-06-02' },
  { id: 'potato_wedges_citron_herbes', addedAt: '2026-06-02' },
  { id: 'houmous_hakocem', addedAt: '2026-06-02' },
  { id: 'falafels_four', addedAt: '2026-06-02' },
  { id: 'cuisses_poulet_asiatique', addedAt: '2026-06-02' },
  { id: 'sauce_chevre_creme', addedAt: '2026-06-02' },
  { id: 'puree_courge_butternut', addedAt: '2026-05-29' },
  { id: 'riz_cantonnais', addedAt: '2026-05-29' },
  { id: 'pates_pesto_tomates_mozzarella', addedAt: '2026-05-29' },
  { id: 'cabillaud_crumble_chorizo', addedAt: '2026-05-29' },
  { id: 'lentilles_tomate_pommes_de_terre_sautees', addedAt: '2026-05-29' },
  { id: 'tiramisu_citron', addedAt: '2026-05-20' },
  { id: 'pesto_tomates_sechees_sans_cajou', addedAt: '2026-05-20' },
  { id: 'base_pour_flan_sale', addedAt: '2026-05-20' },
  { id: 'pain_grille_beurre_ail_herbes', addedAt: '2026-05-20' },
  { id: 'billes_mozzarella_marinees', addedAt: '2026-05-20' },
  { id: 'cookies_cerise_chocolat', addedAt: '2026-05-20' },
  { id: 'clafoutis_cerises_bocuse', addedAt: '2026-05-20' },
  { id: 'cerises_sechees_maison', addedAt: '2026-05-20' },
  { id: 'pate_lapin_piment_espelette', addedAt: '2026-05-20' },
  { id: 'terrine_campagne', addedAt: '2026-05-20' },
  { id: 'brie_farci_fruits_secs_noix', addedAt: '2026-05-20' },
  { id: 'carres_cremeux_citron_vert', addedAt: '2026-05-20' },
  { id: 'beurre_ail', addedAt: '2026-05-20' },
  { id: 'cake_tomate_chorizo_feta', addedAt: '2026-05-20' },
  { id: 'rillettes_porc', addedAt: '2026-05-20' },
  { id: 'rillettes_poulet', addedAt: '2026-05-20' },
  { id: 'terrine_porc_pistaches', addedAt: '2026-05-20' }
];
const MONTHLY_ADDITION_BY_ID = new Map(MONTHLY_ADDITIONS.map((item, index) => [item.id, { ...item, index }]));
const CATEGORY_PARENT_IDS = {
  'Apéro': 'apero_maitre',
  'Entrées': 'entrees_maitre',
  'Plats': 'plats_maitre',
  'Accompagnements': 'accompagnements_maitre',
  'Desserts': 'desserts_maitre',
  'Petits-déjeuners': 'petit_dejeuner_maitre',
  'Sauces': 'sauces_maitre',
  'Base': 'elements_base_maitre'
};
const SEASON_CATEGORY_FILTERS = [
  { value: 'Apéro', label: 'Apéro' },
  { value: 'Entrées', label: 'Entrées' },
  { value: 'Plats', label: 'Plats' },
  { value: 'Accompagnements', label: 'Accompagnements' },
  { value: 'Desserts', label: 'Desserts' },
  { value: 'Sauces', label: 'Sauces' },
  { value: 'Base', label: 'Bases' },
  { value: 'Petits-déjeuners', label: 'Petit-déj.' }
];
const TECHNIQUE_GUIDES = [
  {
    id: 'emincer',
    title: 'Émincer',
    label: 'Couteau',
    description: 'Couper en tranches fines et régulières, souvent pour les oignons, échalotes, poireaux ou champignons.',
    steps: ['Stabilise l’aliment avec une face plate.', 'Place les doigts en griffe.', 'Fais glisser la lame sans écraser.', 'Garde une épaisseur régulière.'],
    tip: 'Plus la coupe est fine, plus l’aliment fond vite à la cuisson.',
    query: 'oignon échalote champignon',
    aliases: ['émincer', 'émincé', 'émincée', 'émincés', 'émincées']
  },
  {
    id: 'ciseler',
    title: 'Ciseler',
    label: 'Couteau',
    description: 'Tailler très finement sans faire de purée, surtout pour les herbes, oignons et échalotes.',
    steps: ['Garde la pointe du couteau proche de la planche.', 'Avance petit à petit avec la main en griffe.', 'Repasse une fois seulement si nécessaire.', 'Arrête avant que l’aliment ne rende trop d’eau.'],
    tip: 'Pour les herbes, un couteau bien affûté évite de noircir les feuilles.',
    query: 'persil ciboulette échalote',
    aliases: ['ciseler', 'ciselé', 'ciselée', 'ciselés', 'ciselées']
  },
  {
    id: 'hacher',
    title: 'Hacher',
    label: 'Couteau',
    description: 'Couper très petit en gardant de la texture, pour l’ail, les herbes, les noix ou certains aromates.',
    steps: ['Regroupe l’aliment en tas.', 'Utilise un mouvement de balancier.', 'Ramène régulièrement les morceaux au centre.', 'Arrête avant d’obtenir une pâte humide.'],
    tip: 'Pour l’ail, retire le germe si tu veux un goût plus doux.',
    query: 'ail herbes noix',
    aliases: ['hacher', 'haché', 'hachée', 'hachés', 'hachées']
  },
  {
    id: 'brunoise',
    title: 'Tailler en brunoise',
    label: 'Couteau',
    description: 'Couper en très petits dés réguliers pour une cuisson rapide ou une garniture nette.',
    steps: ['Taillez d’abord des tranches régulières.', 'Coupe-les en bâtonnets fins.', 'Rassemble les bâtonnets.', 'Détaille en petits dés réguliers.'],
    tip: 'Une brunoise régulière cuit vite et donne une texture plus élégante.',
    query: 'carotte courgette légumes',
    aliases: ['brunoise', 'petite brunoise']
  },
  {
    id: 'julienne',
    title: 'Tailler en julienne',
    label: 'Couteau',
    description: 'Couper en fins bâtonnets pour une garniture, une salade ou une cuisson très courte.',
    steps: ['Coupe l’aliment en tronçons réguliers.', 'Fais des tranches fines.', 'Superpose quelques tranches.', 'Détaille en bâtonnets fins.'],
    tip: 'Ne superpose pas trop de tranches à la fois, sinon la coupe devient irrégulière.',
    query: 'légumes carotte courgette',
    aliases: ['julienne', 'en julienne']
  },
  {
    id: 'sommites',
    title: 'Détailler en sommités',
    label: 'Légumes',
    description: 'Séparer chou-fleur ou brocoli en petits bouquets réguliers pour une cuisson homogène et une présentation nette.',
    steps: ['Retire les feuilles et raccourcis la base du trognon.', 'Détache les gros bouquets à la main ou avec la pointe du couteau.', 'Recoupe par la tige pour garder des sommités régulières sans émietter les têtes.', 'Garde les parures et le cœur épluché pour une soupe, une purée ou une garniture.'],
    tip: 'Des sommités de taille proche cuisent au même rythme : plus petites pour rôtir vite, plus grosses pour garder du croquant.',
    query: 'chou-fleur brocoli fleurettes bouquets',
    aliases: ['sommités', 'sommites', 'somités', 'somites', 'détailler en sommités', 'detailler en sommites', 'fleurettes', 'en fleurettes', 'petits bouquets']
  },
  {
    id: 'monder-tomates',
    title: 'Monder des tomates',
    label: 'Légumes',
    description: 'Retirer facilement la peau des tomates pour une sauce, un coulis ou une préparation plus nette.',
    steps: ['Incise une petite croix sous chaque tomate.', 'Plonge 10 à 20 secondes dans l’eau bouillante.', 'Refroidis aussitôt dans de l’eau froide.', 'Tire la peau avec la pointe d’un couteau.'],
    tip: 'Le but est de décoller la peau, pas de cuire la chair.',
    query: 'tomate coulis sauce',
    aliases: ['monder', 'monder des tomates', 'tomate mondée', 'tomates mondées', 'mondée', 'mondées']
  },
  {
    id: 'concasser',
    title: 'Concasser',
    label: 'Préparation',
    description: 'Couper grossièrement pour garder des morceaux irréguliers, souvent pour tomates, noix, chocolat ou poivre.',
    steps: ['Place l’aliment sur une planche stable.', 'Coupe ou écrase grossièrement.', 'Garde des morceaux visibles.', 'Évite de réduire en poudre ou en purée.'],
    tip: 'Concasser donne du relief : texture, éclats et mâche.',
    query: 'tomates poivre noisettes chocolat',
    aliases: ['concasser', 'concassé', 'concassée', 'concassés', 'concassées']
  },
  {
    id: 'peler-a-vif',
    title: 'Peler à vif',
    label: 'Agrumes',
    description: 'Retirer peau et membrane blanche d’un agrume pour obtenir des segments nets et sans amertume.',
    steps: ['Coupe les deux extrémités.', 'Suis la courbe avec un couteau bien aiguisé.', 'Retire toute la partie blanche.', 'Prélève les segments entre les membranes.'],
    tip: 'Travaille au-dessus d’un bol pour récupérer le jus.',
    query: 'orange citron agrume',
    aliases: ['peler à vif', 'peler a vif', 'pelé à vif', 'pelée à vif']
  },
  {
    id: 'zester',
    title: 'Zester un agrume',
    label: 'Agrumes',
    description: 'Prélever seulement la partie parfumée de la peau, sans l’amertume du blanc.',
    steps: ['Lave et sèche l’agrume.', 'Utilise une râpe fine ou un zesteur.', 'Tourne l’agrume à chaque passage.', 'Arrête dès que la partie blanche apparaît.'],
    tip: 'Le zeste parfume mieux ajouté hors du feu ou en fin de préparation.',
    query: 'citron zeste',
    aliases: ['zester', 'zeste', 'zestes', 'zesté']
  },
  {
    id: 'abaisser-pate',
    title: 'Abaisser une pâte',
    label: 'Pâtisserie',
    description: 'Étaler une pâte au rouleau avec une épaisseur régulière, sans la réchauffer ni la déformer.',
    steps: ['Farine légèrement le plan de travail.', 'Étale du centre vers l’extérieur.', 'Tourne la pâte régulièrement.', 'Remets au frais si elle devient collante.'],
    tip: 'Une pâte trop farinée devient sèche ; une pâte trop chaude se rétracte davantage.',
    query: 'pâte tarte',
    aliases: ['abaisser', 'abaisser une pâte', 'pâte abaissée', 'abaissée']
  },
  {
    id: 'foncer-moule',
    title: 'Foncer un moule',
    label: 'Pâtisserie',
    description: 'Installer une pâte dans un cercle ou un moule en gardant les angles propres.',
    steps: ['Dépose la pâte abaissée sans tirer.', 'Pousse délicatement dans les angles.', 'Coupe l’excédent.', 'Pique et remets au froid si besoin.'],
    tip: 'Ne tire pas sur la pâte : elle se rétracterait à la cuisson.',
    query: 'fond de tarte pâte',
    aliases: ['foncer', 'foncer le moule', 'foncer un moule']
  },
  {
    id: 'cuire-a-blanc',
    title: 'Cuire à blanc',
    label: 'Pâtisserie',
    description: 'Précuire une pâte seule avant d’ajouter une garniture humide ou fragile.',
    steps: ['Fonce et pique la pâte.', 'Couvre de papier cuisson.', 'Ajoute des poids ou légumes secs.', 'Cuis jusqu’à légère coloration puis sèche sans poids si besoin.'],
    tip: 'Le froid avant cuisson limite la rétractation.',
    query: 'fond de tarte cuire blanc',
    aliases: ['cuire à blanc', 'cuire a blanc', 'cuisson à blanc', 'cuisson a blanc']
  },
  {
    id: 'sabler',
    title: 'Sabler',
    label: 'Pâtisserie',
    description: 'Mélanger farine et beurre pour obtenir une texture sableuse avant d’hydrater ou lier une pâte.',
    steps: ['Mets farine et beurre froid en morceaux.', 'Frotte entre les doigts ou au robot.', 'Arrête dès que la texture ressemble à du sable.', 'Ajoute le liquide ou l’œuf ensuite.'],
    tip: 'Ne chauffe pas trop le beurre, sinon la pâte perd son côté friable.',
    query: 'pâte sablée farine beurre',
    aliases: ['sabler', 'sablage', 'sablé la pâte', 'texture sableuse']
  },
  {
    id: 'fraiser',
    title: 'Fraiser une pâte',
    label: 'Pâtisserie',
    description: 'Écraser la pâte avec la paume pour homogénéiser sans trop la travailler.',
    steps: ['Rassemble la pâte en masse.', 'Pousse une portion avec la paume.', 'Rassemble à nouveau.', 'Arrête dès que la pâte est homogène.'],
    tip: 'Trop fraiser développe le gluten et rend la pâte moins friable.',
    query: 'pâte tarte sablée',
    aliases: ['fraiser', 'fraser', 'fraisage', 'frasage']
  },
  {
    id: 'chemiser',
    title: 'Chemiser',
    label: 'Moule',
    description: 'Recouvrir l’intérieur d’un moule avec farine, cacao, sucre, papier ou beurre pour faciliter le démoulage.',
    steps: ['Beurre ou humidifie légèrement le moule selon la recette.', 'Ajoute farine, cacao, sucre ou papier.', 'Couvre toute la surface.', 'Retire l’excédent avant de remplir.'],
    tip: 'Pour un gâteau chocolat, le cacao évite les traces blanches de farine.',
    query: 'moule cacao farine gâteau',
    aliases: ['chemiser', 'chemisé', 'chemisée']
  },
  {
    id: 'beurrer-fariner',
    title: 'Beurrer et fariner',
    label: 'Moule',
    description: 'Préparer un moule ou des ramequins pour éviter que les gâteaux et mi-cuits accrochent.',
    steps: ['Passe une fine couche de beurre mou.', 'Ajoute une petite cuillère de farine.', 'Tourne le moule pour couvrir les parois.', 'Tape pour retirer l’excédent.'],
    tip: 'Cette étape est importante pour les préparations qui collent facilement.',
    query: 'mi cuit chocolat cake',
    aliases: ['beurrer et fariner', 'beurrer le moule', 'beurrer un moule', 'beurrer les moules', 'beurrer les cercles', 'beurrer les ramequins', 'fariner le moule', 'fariner les ramequins']
  },
  {
    id: 'badigeonner',
    title: 'Badigeonner',
    label: 'Geste',
    description: 'Appliquer une fine couche de dorure, marinade, beurre, huile, miel ou moutarde sur une surface avec un pinceau.',
    steps: ['Prépare le mélange dans un petit bol.', 'Utilise un pinceau de cuisine propre.', 'Étale en couche fine et régulière.', 'Évite les flaques qui brûlent ou détrempent.', 'Renouvelle en cours de cuisson seulement si la recette le demande.'],
    tip: 'Badigeonner sert à parfumer, faire briller ou aider une surface à colorer sans l’imbiber.',
    query: 'pinceau dorure marinade moutarde miel',
    aliases: ['badigeonner', 'badigeoner', 'badigeonne', 'badigeonné', 'badigeonnée', 'badigeonner de moutarde', 'badigeonner les cuisses', 'badigeonner au pinceau', 'au pinceau', 'pinceau de cuisine']
  },
  {
    id: 'blanchir',
    title: 'Blanchir',
    label: 'Cuisson',
    description: 'Cuire brièvement dans l’eau bouillante, ou fouetter œufs et sucre jusqu’à éclaircissement selon le contexte.',
    steps: ['Pour les légumes, plonge dans l’eau bouillante salée.', 'Cuis très peu de temps.', 'Rafraîchis aussitôt si besoin.', 'Pour les œufs, fouette avec le sucre jusqu’à texture plus claire.'],
    tip: 'Le contexte dit tout : légumes blanchis ou œufs blanchis ne veulent pas dire la même chose.',
    query: 'blanchir œufs légumes',
    aliases: ['blanchir', 'blanchi', 'blanchie', 'sans trop blanchir']
  },
  {
    id: 'rafraichir',
    title: 'Rafraîchir',
    label: 'Cuisson',
    description: 'Stopper une cuisson en plongeant l’aliment dans de l’eau froide ou glacée.',
    steps: ['Prépare un bol d’eau froide avant la cuisson.', 'Égoutte l’aliment chaud.', 'Plonge immédiatement dans l’eau froide.', 'Égoutte à nouveau avant d’utiliser.'],
    tip: 'Rafraîchir garde les couleurs nettes et évite la surcuisson.',
    query: 'légumes eau froide',
    aliases: ['rafraîchir', 'rafraichir', 'refroidir aussitôt']
  },
  {
    id: 'monter-blancs',
    title: 'Monter des blancs',
    label: 'Œufs',
    description: 'Incorporer de l’air dans les blancs d’œufs pour obtenir une mousse stable.',
    steps: ['Utilise un bol propre et sec.', 'Commence doucement pour casser les blancs.', 'Augmente la vitesse quand la mousse devient fine.', 'Arrête au bec demandé par la recette.'],
    tip: 'Des blancs trop battus deviennent granuleux et s’incorporent moins bien.',
    query: 'blancs œufs meringue',
    aliases: ['monter les blancs', 'monter des blancs', 'blancs en neige', 'bec d’oiseau', 'bec d oiseau']
  },
  {
    id: 'incorporer-delicatement',
    title: 'Incorporer délicatement',
    label: 'Mélange',
    description: 'Mélanger une préparation légère sans casser l’air incorporé.',
    steps: ['Ajoute une première petite portion pour détendre.', 'Utilise une maryse.', 'Soulève la masse du bas vers le haut.', 'Arrête dès que le mélange est homogène.'],
    tip: 'Trop mélanger fait retomber les blancs, chantilly ou mousses.',
    query: 'incorporer délicatement blancs chantilly',
    aliases: ['incorporer délicatement', 'incorporer la chantilly', 'incorporer les blancs', 'incorporer progressivement']
  },
  {
    id: 'monter-mayonnaise',
    title: 'Monter une mayonnaise',
    label: 'Sauce',
    description: 'Créer une émulsion stable entre jaune d’œuf, moutarde, acidité et huile.',
    steps: ['Mélange jaune, moutarde, sel et acidité.', 'Verse l’huile goutte à goutte au début.', 'Augmente le filet quand la sauce prend.', 'Détends si elle devient trop épaisse.'],
    tip: 'Si elle tranche, repars avec une cuillère d’eau puis incorpore la sauce ratée petit à petit.',
    query: 'mayonnaise aïoli sauce',
    aliases: ['monter une mayonnaise', 'mayonnaise montée', 'monter à l’huile']
  },
  {
    id: 'pocher',
    title: 'Pocher',
    label: 'Cuisson',
    description: 'Cuire doucement dans un liquide frémissant, ou dresser une préparation à la poche selon le contexte.',
    steps: ['Pour une cuisson, garde le liquide sous l’ébullition.', 'Plonge l’aliment doucement.', 'Surveille la température.', 'Pour une poche, presse régulièrement sans à-coups.'],
    tip: 'Pocher peut désigner une cuisson douce ou un dressage à la poche.',
    query: 'pocher poche crème poisson',
    aliases: ['pocher', 'poché', 'pochée', 'à la poche', 'a la poche']
  },
  {
    id: 'frire',
    title: 'Frire',
    label: 'Cuisson',
    description: 'Cuire dans un bain d’huile chaud pour obtenir une surface croustillante.',
    steps: ['Chauffe l’huile à la température indiquée.', 'Travaille par petites quantités.', 'Égoutte sur grille ou papier.', 'Sale ou assaisonne juste après cuisson.'],
    tip: 'Trop remplir la casserole fait chuter la température et graisse la friture.',
    query: 'friture beignet tempura frites',
    aliases: ['frire', 'friture', 'à frire', 'a frire']
  },
  {
    id: 'paner',
    title: 'Paner',
    label: 'Cuisson',
    description: 'Enrober un aliment pour créer une croûte régulière à la cuisson.',
    steps: ['Sèche l’aliment.', 'Passe dans farine, œuf puis chapelure.', 'Appuie légèrement pour faire adhérer.', 'Laisse reposer si possible avant cuisson.'],
    tip: 'Une panure adhère mieux sur un aliment sec.',
    query: 'chapelure panure',
    aliases: ['paner', 'pané', 'panée', 'panure']
  },
  {
    id: 'suer',
    title: 'Faire suer',
    label: 'Cuisson',
    description: 'Cuire doucement un aromate ou légume sans coloration pour faire sortir son eau et son parfum.',
    steps: ['Chauffe doucement avec un peu de matière grasse.', 'Ajoute l’aliment taillé finement.', 'Sale légèrement si utile.', 'Cuis jusqu’à texture translucide sans brunir.'],
    tip: 'Suer développe la douceur sans goût grillé.',
    query: 'échalote oignon sauce',
    aliases: ['faire suer', 'suer', 'fait suer']
  },
  {
    id: 'etuver',
    title: 'Étuver',
    label: 'Cuisson douce',
    description: 'Cuire doucement à couvert avec très peu de liquide ou de matière grasse, souvent pour des légumes.',
    steps: ['Coupe les aliments assez régulièrement.', 'Ajoute peu de matière grasse ou un fond de liquide.', 'Couvre pour garder la vapeur.', 'Cuis doucement sans chercher de coloration.'],
    tip: 'Étuver attendrit et concentre le goût, mais peut ramollir un aliment qu’on voulait croustillant.',
    query: 'légumes vapeur couvert',
    aliases: ['étuver', 'etuver', 'étuvé', 'étuvée', 'étuvés', 'étuvées', 'étuvage', 'à l’étouffée', 'a l etouffee']
  },
  {
    id: 'faire-revenir',
    title: 'Faire revenir',
    label: 'Cuisson',
    description: 'Colorer rapidement un aliment dans une matière grasse pour développer le goût.',
    steps: ['Chauffe la poêle avant d’ajouter l’aliment.', 'Évite de surcharger.', 'Laisse colorer avant de remuer.', 'Baisse le feu si les sucs brûlent.'],
    tip: 'Faire revenir cherche plus de goût qu’une cuisson douce.',
    query: 'faire revenir oignon viande',
    aliases: ['faire revenir']
  },
  {
    id: 'deglacer',
    title: 'Déglacer',
    label: 'Cuisson',
    description: 'Décoller les sucs au fond d’une poêle avec un liquide pour créer une base de sauce.',
    steps: ['Retire l’excès de gras si nécessaire.', 'Verse un liquide dans la poêle chaude.', 'Gratte le fond avec une spatule.', 'Laisse réduire pour concentrer.'],
    tip: 'Eau, bouillon, vin, vinaigre ou jus peuvent déglacer selon la recette.',
    query: 'sauce cuisson',
    aliases: ['déglacer', 'deglacer', 'déglacé', 'déglacée']
  },
  {
    id: 'reduire',
    title: 'Réduire',
    label: 'Sauce',
    description: 'Faire évaporer une partie du liquide pour concentrer le goût et épaissir.',
    steps: ['Laisse frémir à découvert.', 'Remue de temps en temps.', 'Surveille les bords de casserole.', 'Arrête quand la texture nappe ou devient sirupeuse.'],
    tip: 'Une réduction continue d’épaissir légèrement en refroidissant.',
    query: 'sauce réduire',
    aliases: ['réduire', 'reduire', 'réduit', 'réduire presque à sec', 'réduire de moitié']
  },
  {
    id: 'lier-sauce',
    title: 'Lier une sauce',
    label: 'Sauce',
    description: 'Donner de la tenue à une sauce avec beurre, crème, fécule, jaune ou réduction.',
    steps: ['Choisis le liant adapté.', 'Ajoute-le hors feu ou à feu doux selon le cas.', 'Fouette pour homogénéiser.', 'Évite l’ébullition forte avec les jaunes ou le beurre.'],
    tip: 'Une sauce liée doit napper sans devenir lourde.',
    query: 'lier sauce beurre crème',
    aliases: ['lier la sauce', 'lier une sauce', 'pour lier', 'sauce liée']
  },
  {
    id: 'monter-au-beurre',
    title: 'Monter au beurre',
    label: 'Sauce',
    description: 'Finir une sauce chaude avec du beurre froid pour lui donner brillance, rondeur et tenue.',
    steps: ['Réduis la sauce avant d’ajouter le beurre.', 'Coupe le feu ou baisse très fort.', 'Ajoute le beurre froid en petits morceaux.', 'Fouette ou vanne la casserole sans refaire bouillir.'],
    tip: 'Si la sauce bout trop fort après ajout du beurre, elle peut trancher.',
    query: 'sauce beurre froid',
    aliases: ['monter au beurre', 'ajouter le beurre froid']
  },
  {
    id: 'clarifier',
    title: 'Clarifier',
    label: 'Préparation',
    description: 'Séparer une préparation de ses éléments troubles ou indésirables : beurre clarifié, bouillon limpide ou œuf séparé selon le contexte.',
    steps: ['Identifie ce qui doit être séparé : petit-lait, écume, dépôt ou blanc/jaune.', 'Travaille doucement pour éviter de remélanger les éléments.', 'Retire l’écume ou verse en laissant le dépôt au fond.', 'Filtre si la recette demande une texture parfaitement nette.'],
    tip: 'Clarifier demande de la douceur : si tu remues trop fort, les éléments séparés se remettent en suspension.',
    query: 'beurre bouillon œuf filtrer',
    aliases: ['clarifier', 'clarifié', 'clarifiée', 'beurre clarifié', 'bouillon clarifié']
  },
  {
    id: 'torrefier',
    title: 'Torréfier',
    label: 'Cuisson',
    description: 'Chauffer à sec ou au four pour renforcer le parfum des épices, graines ou fruits secs.',
    steps: ['Étale en couche fine.', 'Chauffe à sec ou au four.', 'Remue ou surveille souvent.', 'Arrête dès que l’odeur devient intense.'],
    tip: 'Les épices brûlent vite : quelques secondes peuvent suffire à la poêle.',
    query: 'noisettes épices graines',
    aliases: ['torréfier', 'torrefier', 'torréfié', 'torréfiée', 'torréfiées']
  },
  {
    id: 'detendre',
    title: 'Détendre une préparation',
    label: 'Texture',
    description: 'Assouplir une crème, une sauce ou une pâte trop ferme avec un peu de liquide ou une petite portion de préparation souple.',
    steps: ['Travaille d’abord la préparation au fouet ou à la spatule.', 'Ajoute le liquide ou la base souple en petite quantité.', 'Mélange jusqu’à retrouver une texture lisse.', 'Arrête dès que la texture est utilisable, sans la rendre liquide.'],
    tip: 'Détendre sert à faciliter l’incorporation : une crème trop ferme casse plus facilement une mousse ou une chantilly.',
    query: 'crème sauce pâte texture',
    aliases: ['détendre', 'detendre', 'détendu', 'détendue', 'détendre avec']
  },
  {
    id: 'serrer-blancs',
    title: 'Serrer des blancs',
    label: 'Œufs',
    description: 'Ajouter le sucre progressivement dans des blancs montés pour obtenir une meringue plus stable, brillante et régulière.',
    steps: ['Monte les blancs jusqu’à une mousse fine.', 'Ajoute le sucre petit à petit, pas d’un seul coup.', 'Continue de fouetter jusqu’à texture brillante.', 'Arrête au bec demandé par la recette.'],
    tip: 'Serrer trop tôt ralentit la montée ; serrer trop tard stabilise moins bien la mousse.',
    query: 'meringue blancs sucre',
    aliases: ['serrer', 'serrer au sucre', 'serrer les blancs', 'blancs serrés', 'meringue serrée']
  },
  {
    id: 'texture-ruban',
    title: 'Obtenir le ruban',
    label: 'Pâtisserie',
    description: 'Atteindre une texture souple qui retombe en ruban continu, utile pour les appareils fouettés, macarons et certaines pâtes.',
    steps: ['Soulève la préparation avec la maryse ou le fouet.', 'Observe si elle retombe en bande continue.', 'Mélange encore par petits gestes si elle casse trop vite.', 'Arrête dès que le ruban se fond lentement dans la masse.'],
    tip: 'Un ruban trop liquide annonce souvent un mélange trop travaillé.',
    query: 'macaron pâte appareil ruban',
    aliases: ['ruban', 'texture ruban', 'obtenir un ruban', 'ruban souple', 'faire le ruban']
  },
  {
    id: 'parer',
    title: 'Parer',
    label: 'Préparation',
    description: 'Retirer les parties inutiles, dures ou irrégulières d’un aliment pour obtenir une pièce nette avant cuisson ou dressage.',
    steps: ['Identifie les parties sèches, dures, grasses ou abîmées.', 'Retire-les avec un couteau bien aiguisé.', 'Garde les parures propres pour un bouillon ou une sauce si utile.', 'Évite de trop enlever : on cherche une pièce nette, pas une perte excessive.'],
    tip: 'Parer améliore la cuisson et la présentation, surtout sur viandes, poissons, légumes et agrumes.',
    query: 'préparer viande poisson légumes parures',
    aliases: ['parer', 'parures', 'paré', 'parée']
  },
  {
    id: 'singer',
    title: 'Singer',
    label: 'Sauce',
    description: 'Saupoudrer une préparation de farine puis cuire brièvement pour lier une sauce ou un ragoût sans goût de farine crue.',
    steps: ['Ajoute la farine en pluie sur la garniture chaude.', 'Mélange pour enrober régulièrement.', 'Cuis 1 à 2 minutes pour retirer le goût cru.', 'Mouille progressivement avec le liquide de cuisson.'],
    tip: 'Singer demande une cuisson courte de la farine avant d’ajouter le liquide, sinon la sauce peut rester pâteuse.',
    query: 'farine sauce ragoût liaison',
    aliases: ['singer', 'singer la garniture', 'fariner la garniture']
  },
  {
    id: 'cremer',
    title: 'Crémer',
    label: 'Pâtisserie',
    description: 'Travailler beurre pommade et sucre pour obtenir une base souple et homogène.',
    steps: ['Utilise un beurre pommade, pas fondu.', 'Travaille avec le sucre jusqu’à texture crémeuse.', 'Racle les bords du bol.', 'Ajoute les œufs ensuite selon la recette.'],
    tip: 'Trop crémer peut changer la texture finale de certains cakes ou cookies.',
    query: 'beurre sucre cookie cake',
    aliases: ['crémer', 'cremer', 'crémer le beurre']
  },
  {
    id: 'infuser',
    title: 'Infuser',
    label: 'Parfum',
    description: 'Extraire les parfums d’un ingrédient dans un liquide chaud ou froid.',
    steps: ['Chauffe le liquide si la recette le demande.', 'Ajoute aromates, épices ou zestes.', 'Couvre pour garder les parfums.', 'Filtre ou retire l’aromate avant usage.'],
    tip: 'Une infusion trop forte peut devenir amère, surtout avec agrumes, thé ou safran.',
    query: 'infuser safran zeste épice',
    aliases: ['infuser', 'infusé', 'infusée', 'laisser infuser']
  },
  {
    id: 'filmer-contact',
    title: 'Filmer au contact',
    label: 'Crème',
    description: 'Poser le film directement sur une crème pour éviter la peau en surface.',
    steps: ['Verse la crème dans un récipient propre.', 'Pose le film directement contre la surface.', 'Chasse les bulles d’air.', 'Refroidis rapidement si la recette le demande.'],
    tip: 'Le film doit toucher la crème, pas seulement couvrir le bol.',
    query: 'crème pâtissière refroidir',
    aliases: ['filmer au contact', 'film au contact', 'filmer immédiatement au contact']
  },
  {
    id: 'tamiser',
    title: 'Tamiser',
    label: 'Pâtisserie',
    description: 'Passer une poudre ou une préparation au tamis pour retirer les grains et alléger.',
    steps: ['Place le tamis au-dessus d’un bol.', 'Verse la poudre ou la préparation.', 'Tapote ou racle doucement.', 'Jette les gros morceaux si la recette demande une texture fine.'],
    tip: 'Tamiser évite les grumeaux dans les biscuits, macarons, crèmes et sauces.',
    query: 'tamis poudre amande sucre glace',
    aliases: ['tamiser', 'tamisé', 'tamisée', 'passer au tamis']
  },
  {
    id: 'macaroner',
    title: 'Macaroner',
    label: 'Pâtisserie',
    description: 'Travailler l’appareil à macarons pour le détendre juste assez et obtenir un ruban souple.',
    steps: ['Incorpore la meringue aux poudres.', 'Écrase légèrement la masse contre la paroi.', 'Ramène la pâte au centre.', 'Arrête dès que le ruban retombe souplement sans devenir liquide.'],
    tip: 'Un appareil trop peu macaronné fait des coques épaisses ; trop macaronné, il s’étale et perd son volume.',
    query: 'macaron meringue poudre amande',
    aliases: ['macaroner', 'macaronner', 'macaronnage', 'macaronné', 'macaronnée']
  },
  {
    id: 'bain-marie',
    title: 'Cuire au bain-marie',
    label: 'Cuisson douce',
    description: 'Chauffer doucement une préparation grâce à un récipient posé sur une eau frémissante.',
    steps: ['Fais frémir un fond d’eau.', 'Pose un bol sans que le fond touche trop l’eau.', 'Remue régulièrement.', 'Garde une chaleur douce et stable.'],
    tip: 'Le bain-marie évite de brûler chocolat, beurre, crèmes et sauces fragiles.',
    query: 'bain-marie chocolat beurre',
    aliases: ['bain-marie', 'bain marie', 'au bain-marie']
  },
  {
    id: 'steriliser-sans-sterilisateur',
    title: 'Stériliser',
    label: 'Conserve',
    description: 'Traiter des bocaux fermés à l’eau bouillante, au stérilisateur ou dans un grand faitout.',
    steps: ['Utilise des bocaux propres, des joints neufs et des couvercles en bon état.', 'Installe un torchon au fond du faitout ou du stérilisateur, puis cale les bocaux debout pour qu’ils ne s’entrechoquent pas.', 'Couvre largement d’eau : prévois 3 à 5cm au-dessus des couvercles pendant toute la cuisson.', 'Pour stériliser des bocaux vides, fais bouillir 10min à gros bouillons, puis laisse égoutter sans toucher l’intérieur.', 'Pour des bocaux remplis, fais bouillir pendant la durée de la recette : par exemple 2h30 pour un pâté de viande en conserve.', 'Garde les bocaux immergés jusqu’au refroidissement, sèche-les, puis vérifie que chaque fermeture tient avant stockage.'],
    tip: 'Pour viande, pâtés et bocaux peu acides, ne raccourcis jamais la durée indiquée. Écarte tout bocal mal fermé, fuyant, bombé, trouble ou suspect.',
    query: 'steriliser bocal conserve terrine pate lapin faitout',
    aliases: ['stériliser sans stérilisateur', 'steriliser sans sterilisateur', 'stériliser', 'steriliser', 'stérilisation', 'sterilisation', 'bocaux à conserve']
  },
  {
    id: 'flamber',
    title: 'Flamber',
    label: 'Cuisson',
    description: 'Enflammer brièvement un alcool assez chaud pour concentrer le goût et retirer une partie de l’alcool.',
    steps: ['Éloigne la poêle de la hotte et coupe toute flamme trop proche.', 'Chauffe légèrement l’alcool à part ou verse-le dans une poêle déjà chaude.', 'Allume prudemment avec une longue allumette ou incline très légèrement la poêle si tu cuisines au gaz.', 'Laisse la flamme s’éteindre seule avant de continuer la sauce.'],
    tip: 'Un alcool froid flambe mal. Ne verse jamais directement depuis la bouteille et ne flambe jamais sous une hotte allumée.',
    query: 'cognac armagnac flamber',
    aliases: ['flamber', 'flambé', 'flambée']
  },
  {
    id: 'saisir',
    title: 'Saisir',
    label: 'Cuisson',
    description: 'Colorer rapidement un aliment au contact d’une poêle, casserole ou plancha bien chaude pour créer une croûte avant de poursuivre la cuisson.',
    steps: ['Éponge l’aliment pour retirer l’humidité de surface.', 'Chauffe la poêle avec un peu de matière grasse.', 'Dépose les morceaux sans les serrer.', 'Laisse colorer avant de retourner.', 'Baisse le feu ou continue selon la recette.'],
    tip: 'Si l’aliment rend beaucoup d’eau ou ne colore pas, la poêle est trop froide ou trop remplie.',
    query: 'poêle viande poulet légumes plancha',
    aliases: ['saisir', 'saisi', 'saisie', 'saisir la viande', 'saisir le poulet', 'saisir les légumes', 'faire dorer', 'dorer les morceaux']
  },
  {
    id: 'mariner',
    title: 'Mariner',
    label: 'Préparation',
    description: 'Laisser un aliment au contact d’un assaisonnement pour parfumer, attendrir ou protéger.',
    steps: ['Mélange la marinade avant d’ajouter l’aliment.', 'Enrobe toute la surface.', 'Couvre et place au frais.', 'Égoutte ou essuie si la cuisson doit saisir.'],
    tip: 'Une marinade acide trop longue peut cuire ou durcir certains aliments.',
    query: 'mariner mozzarella calamars',
    aliases: ['mariner', 'marinade', 'mariné', 'marinée']
  },
  {
    id: 'raper',
    title: 'Râper',
    label: 'Préparation',
    description: 'Réduire un ingrédient en fins copeaux ou filaments pour mieux répartir son goût ou sa texture.',
    steps: ['Choisis une râpe adaptée.', 'Garde les doigts loin de la surface.', 'Râpe au dernier moment si l’ingrédient oxyde.', 'Presse si la recette demande de retirer l’eau.'],
    tip: 'Les pommes de terre râpées doivent souvent être pressées très fort pour croustiller.',
    query: 'râper pomme de terre ail gingembre',
    aliases: ['râper', 'raper', 'râpé', 'râpée', 'râper gros']
  },
  {
    id: 'enrober',
    title: 'Enrober',
    label: 'Mélange',
    description: 'Couvrir régulièrement un aliment avec une pâte, une huile, une sauce ou un assaisonnement.',
    steps: ['Verse l’assaisonnement dans un grand bol.', 'Ajoute l’aliment en plusieurs fois si besoin.', 'Mélange par retournements doux.', 'Vérifie que toutes les faces sont couvertes.'],
    tip: 'Un enrobage régulier donne une cuisson et un assaisonnement plus homogènes.',
    query: 'enrober huile tempura assaisonnement',
    aliases: ['enrober', 'enrobé', 'enrobée', 'pour les enrober']
  },
  {
    id: 'lisser',
    title: 'Lisser',
    label: 'Finition',
    description: 'Uniformiser une crème, une pâte, une sauce ou une surface pour obtenir une texture nette et régulière.',
    steps: ['Travaille avec une spatule, un fouet ou une palette adaptée.', 'Écrase les petits amas si besoin.', 'Racle les bords du récipient.', 'Arrête dès que la surface ou la texture est régulière.'],
    tip: 'Lisser ne veut pas dire trop mélanger : dès que c’est homogène, on s’arrête.',
    query: 'lisser creme surface glacage',
    aliases: ['lisser', 'lissé', 'lissée', 'lisser légèrement', 'lisser la surface']
  },
  {
    id: 'napper',
    title: 'Napper',
    label: 'Sauce',
    description: 'Couvrir une préparation avec une sauce assez liée pour tenir en fine couche.',
    steps: ['Vérifie que la sauce est assez liée.', 'Verse ou cuillère depuis le centre.', 'Couvre sans noyer la garniture.', 'Sers rapidement si la sauce est chaude.'],
    tip: 'Une sauce qui nappe le dos d’une cuillère laisse une trace nette au doigt.',
    query: 'napper sauce',
    aliases: ['napper', 'nappant', 'nappante', 'doit napper']
  },
  {
    id: 'mijoter',
    title: 'Mijoter / frémir',
    label: 'Cuisson douce',
    description: 'Cuire doucement avec de petites bulles pour développer le goût sans brutaliser la préparation.',
    steps: ['Porte d’abord proche de l’ébullition si nécessaire.', 'Baisse jusqu’à petites bulles régulières.', 'Couvre partiellement selon la réduction voulue.', 'Remue de temps en temps.'],
    tip: 'Un vrai frémissement est plus doux qu’une ébullition à gros bouillons.',
    query: 'mijoter frémir sauce bouillon',
    aliases: ['mijoter', 'frémir', 'fremir', 'frémissement', 'à frémissement']
  }
];
const SORTED_TECHNIQUE_GUIDES = [...TECHNIQUE_GUIDES].sort((a, b) => a.title.localeCompare(b.title, 'fr', { sensitivity: 'base' }));
const FAVORITE_COLLECTIONS = [
  { id: '', label: 'Tout' },
  { id: 'tester', label: 'À tester', match: (recipe, note) => normalizeText(note?.status).includes('refaire') || normalizeText(note?.status).includes('ajuster') },
  { id: 'valides', label: 'Validées', match: (recipe, note) => normalizeText(note?.status).includes('validee') },
  { id: 'famille', label: 'Repas famille', match: recipe => /\b(plat|plats|accompagnements|famil|gratin|burger|poulet|porc|boeuf|bœuf)\b/.test(normalizeText([recipe.title, ...(recipe.categories || []), ...(recipe.tags || [])].join(' '))) },
  { id: 'desserts', label: 'Desserts', match: recipe => recipeHasCategory(recipe, 'Desserts') },
  { id: 'sauces', label: 'Sauces', match: recipe => recipeHasCategory(recipe, 'Sauces') }
];
const SHOPPING_AISLES = [
  { label: 'Primeur', pattern: /\b(tomate|tomates|citron|citrons|zeste|jus de citron|pomme|pommes|poire|poires|oignon|oignons|ail|echalote|échalote|persil|basilic|menthe|ciboulette|pomme de terre|pommes de terre|patate douce|avocat|epinard|épinard|carotte|courgette|chou|chou-fleur|brocoli|butternut|courge|fenouil|poireau|melon|fraise|framboise|abricot|cerise|cranberry|canneberge)\b/ },
  { label: 'Crèmerie et œufs', pattern: /\b(lait|creme|crème|beurre|fromage|parmesan|comte|comté|cheddar|mozzarella|mascarpone|ricotta|yaourt|babeurre|oeuf|oeufs|œuf|œufs|jaune|jaunes|blanc|blancs)\b/ },
  { label: 'Boucherie', pattern: /\b(porc|poulet|volaille|boeuf|bœuf|agneau|magret|canard|lardon|lardons|poitrine|bacon|jambon|saucisse)\b/ },
  { label: 'Poissonnerie', pattern: /\b(crevette|crevettes|calamar|calamars|poisson|moule|moules|saumon|cabillaud|thon|chipiron|chipirons)\b/ },
  { label: 'Boulangerie', pattern: /\b(pain|pains|bun|buns|brioche|brioches|tortilla|tortillas)\b/ },
  { label: 'Épicerie salée', pattern: /\b(sel|poivre|huile|vinaigre|moutarde|chapelure|panko|riz|pâtes|pates|épice|epice|paprika|curry|miel|conserve|pois|lentille|lentilles)\b/ },
  { label: 'Épicerie sucrée', pattern: /\b(farine|sucre|cassonade|vergeoise|chocolat|cacao|fécule|fecule|maizena|maïzena|levure|sirop|vanille|praliné|noisette|noisettes|noix|amande|amandes|pistache|pistaches)\b/ }
];
const STORAGE_KEYS = {
  favorites: 'cook_note_favorites',
  shopping: 'cook_note_shopping_basket',
  shoppingFactors: 'cook_note_shopping_factors',
  shoppingChecked: 'cook_note_shopping_checked',
  shoppingOwned: 'cook_note_shopping_owned',
  menuHistory: 'cook_note_menu_history',
  preferences: 'cook_note_preferences',
  recentRecipes: 'cook_note_recent_recipes',
  recentSearches: 'cook_note_recent_searches',
  personalNotes: 'cook_note_personal_recipe_notes',
  homeScroll: 'cook_note_home_scroll',
  scrollPositions: 'cook_note_session_scroll_positions',
  legacyFavorites: ['mc_food_favorites', 'cuisine_favs']
};

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore private browsing restrictions */
  }
}

function readStoredList(key, legacyKeys) {
  const current = readJson(key, null);
  if (Array.isArray(current)) return current;
  for (const legacyKey of legacyKeys) {
    const value = readJson(legacyKey, null);
    if (Array.isArray(value)) return value;
  }
  return [];
}

function currentScrollRouteKey() {
  return `${window.location.pathname}${window.location.search}${window.location.hash || ''}`;
}

function readSessionScrollPositions() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEYS.scrollPositions);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveCurrentScrollPosition(routeKey = currentScrollRouteKey()) {
  try {
    const positions = readSessionScrollPositions();
    positions[routeKey] = Math.max(0, Math.round(window.scrollY || document.documentElement.scrollTop || 0));
    sessionStorage.setItem(STORAGE_KEYS.scrollPositions, JSON.stringify(positions));
  } catch {
    /* ignore session storage restrictions */
  }
}

function readScrollPositionForCurrentRoute() {
  const value = Number(readSessionScrollPositions()[currentScrollRouteKey()]);
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

function scrollElementToViewportCenter(element, behavior = 'smooth') {
  if (!element) return;
  const rect = element.getBoundingClientRect();
  const viewportHeight = window.visualViewport?.height || window.innerHeight;
  const viewportOffset = window.visualViewport?.offsetTop || 0;
  const top = Math.max(0, window.scrollY + rect.top + (rect.height / 2) - (viewportHeight / 2) - viewportOffset);
  window.scrollTo({ top, behavior });
}

function normalizeText(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[œŒ]/g, 'oe')
    .replace(/[æÆ]/g, 'ae')
    .toLowerCase();
}

function uniq(values) {
  return Array.from(new Set(values.filter(Boolean))).sort((a, b) => a.localeCompare(b, 'fr'));
}

function uniqInOrder(values) {
  const seen = new Set();
  return values.filter(value => {
    if (!value || seen.has(value)) return false;
    seen.add(value);
    return true;
  });
}

function getCurrentSeason(date = new Date()) {
  const month = Number(new Intl.DateTimeFormat('fr-FR', {
    timeZone: 'Europe/Paris',
    month: 'numeric'
  }).format(date));
  if ([3, 4, 5].includes(month)) return 'Printemps';
  if ([6, 7, 8].includes(month)) return 'Été';
  if ([9, 10, 11].includes(month)) return 'Automne';
  return 'Hiver';
}

const SEASONAL_INGREDIENT_RULES = [
  { seasons: ['Printemps'], pattern: /\b(asperge|asperges|petits pois|radis|rhubarbe|fraise|fraises)\b/ },
  { seasons: ['Printemps', 'Été'], pattern: /\b(framboise|framboises|cerise|cerises|abricot|abricots|peche|peches)\b/ },
  { seasons: ['Été'], pattern: /\b(melon|pasteque|concombre|tomate|tomates|courgette|courgettes|aubergine|aubergines|poivron|poivrons|basilic|menthe|myrtille|myrtilles|mure|mures|ananas|kiwi)\b/ },
  { seasons: ['Automne'], pattern: /\b(figue|figues|raisin|raisins|poire|poires|pommes?\b(?! de terre)|coing|coings|noisette|noisettes|noix|chataigne|chataignes|champignon|champignons)\b/ },
  { seasons: ['Automne', 'Hiver'], pattern: /\b(courge|courges|potiron|potimarron|butternut|patate douce|patates douces|poireau|poireaux|celeri|chou fleur|chou-fleur|choux|endive|endives)\b/ },
  { seasons: ['Hiver'], pattern: /\b(citron|citrons|orange|oranges|clementine|clementines|mandarine|mandarines|pamplemousse|pamplemousses)\b/ }
];

function getRecipeSeasonText(recipe) {
  return normalizeText([
    recipe?.title,
    ...(recipe?.tags || []),
    ...(recipe?.aliases || []),
    ...(recipe?.ingredients || []).flatMap(group => [group.group, ...(group.items || [])])
  ].join(' '));
}

function getInferredRecipeSeasons(recipe) {
  const text = getRecipeSeasonText(recipe);
  const seasons = new Set();
  SEASONAL_INGREDIENT_RULES.forEach(rule => {
    if (rule.pattern.test(text)) rule.seasons.forEach(season => seasons.add(season));
  });
  return Array.from(seasons);
}

function getAssignedRecipeSeasons(recipe) {
  return (recipe?.seasons || []).filter(season => season && season !== 'Toutes saisons');
}

function getRecipeSeasonSet(recipe, recipesById = {}) {
  const seasons = new Set(getAssignedRecipeSeasons(recipe));
  getLeafVariantRefs(recipe, recipesById).forEach(ref => {
    const child = recipesById[ref.id];
    if (!child || child.id === recipe?.id) return;
    getAssignedRecipeSeasons(child).forEach(season => seasons.add(season));
  });
  if (!seasons.size && !(recipe?.seasons || []).includes('Toutes saisons')) {
    getInferredRecipeSeasons(recipe).forEach(season => seasons.add(season));
  }
  return seasons;
}

function primaryCategory(recipe) {
  return (recipe.categories || [])[0] || 'Recette';
}

function categoryLine(recipe) {
  return (recipe.categories || []).filter(Boolean).join(' / ') || 'Recette';
}

function categoryLabel(category) {
  return SEASON_CATEGORY_FILTERS.find(item => item.value === category)?.label || category || 'Autres';
}

function recipeHasCategory(recipe, category) {
  if (!category) return true;
  return (recipe.categories || []).includes(category);
}

function seasonGroupCategory(recipe) {
  const categories = recipe.categories || [];
  return SEASON_CATEGORY_FILTERS.find(item => categories.includes(item.value))?.value || categories[0] || 'Autres';
}

function getCategoryColor(recipe) {
  return CATEGORY_ACCENTS[primaryCategory(recipe)] || '#fbbf24';
}

function homeCardOrder(recipe) {
  return HOME_CARD_ORDER[recipe.id] || 99;
}

function countIngredients(recipe) {
  return (recipe.ingredients || []).reduce((sum, group) => sum + (group.items || []).length, 0);
}

function difficultyText(recipe) {
  return Number.isFinite(recipe?.difficultyScore)
    ? `Difficulté ${recipe.difficultyScore}/10`
    : (DIFFICULTY_LABELS[recipe?.difficulty] || 'Recette');
}

function getNutriScore(recipe) {
  if (recipe?.nutriScore) return String(recipe.nutriScore).toUpperCase();
  const text = normalizeText([
    recipe?.title,
    recipe?.yield,
    ...(recipe?.categories || []),
    ...(recipe?.tags || []),
    ...(recipe?.aliases || []),
    ...(recipe?.ingredients || []).flatMap(group => [group.group, ...(group.items || [])])
  ].join(' '));
  let score = 2;
  if (/\b(salade|crudite|legume|chou fleur|tomate|gazpacho|gaspacho|melon|fruit|soupe|court bouillon)\b/.test(text)) score -= 1;
  if (/\b(friture|frites|beignet|churros|donut|caramel|cookie|cookies|creme au beurre|mayonnaise|rouille|pate sucree)\b/.test(text)) score += 1;
  if (/\b(beurre|creme|fromage|huile|sucre|chocolat|miel|sirop|jambon|lardon|poitrine fumee)\b/.test(text)) score += 1;
  if (/\b(poisson|oeuf|oeufs|yaourt|avocat|mozzarella|pesto)\b/.test(text)) score -= 0.5;
  const index = Math.max(0, Math.min(4, Math.round(score)));
  return ['A', 'B', 'C', 'D', 'E'][index];
}

function getRecipeAllergens(recipe) {
  const explicit = Array.isArray(recipe?.allergens) ? recipe.allergens : [];
  const text = normalizeText([
    recipe?.title,
    recipe?.yield,
    ...(recipe?.tags || []),
    ...(recipe?.aliases || []),
    ...(recipe?.ingredients || []).flatMap(group => [group.group, ...(group.items || [])])
  ].join(' '));
  const allergens = new Set(explicit);
  const addIf = (label, pattern) => {
    if (pattern.test(text)) allergens.add(label);
  };

  addIf('Gluten', /\b(farine|ble|pain|pains|brioche|brioches|bun|buns|pate a choux|pate sucree|pate a tarte|pates a tarte|chapelure|semoule|orge|avoine|epeautre|tortillas?)\b/);
  addIf('Œufs', /\b(oeuf|oeufs|jaune d oeuf|jaunes d oeufs|blanc d oeuf|blancs d oeufs|mimosa)\b/);
  addIf('Lait', /\b(lait entier|lait tiede|lait froid|lait chaud|lait ribot|babeurre|beurre|creme|fromage|parmesan|comte|cheddar|mozzarella|mascarpone|ricotta|yaourt|yogourt)\b/);
  addIf('Fruits à coque', /\b(amande|amandes|noisette|noisettes|pistache|pistaches|noix|pecan|cajou|praline|praline|pralinoise)\b/);
  addIf('Arachides', /\b(arachide|arachides|cacahuete|cacahuetes|beurre de cacahuete)\b/);
  addIf('Soja', /\b(soja|sauce soja|tofu|miso|edamame)\b/);
  addIf('Moutarde', /\b(moutarde|graines de moutarde)\b/);
  addIf('Miel', /\b(miel)\b/);
  addIf('Poisson', /\b(poisson|saumon|thon|cabillaud|anchois|sardine|dorade|bar|bouillabaisse)\b/);
  addIf('Crustacés', /\b(crevette|crevettes|crabe|homard|langoustine|gambas)\b/);
  addIf('Mollusques', /\b(calamar|calamars|moule|moules|palourde|palourdes|poulpe|encornet|encornets)\b/);
  addIf('Sésame', /\b(sesame|tahini|tahin)\b/);
  addIf('Sulfites', /\b(sulfite|sulfites|vin blanc|vin rouge|vinaigre de vin)\b/);
  addIf('Céleri', /\b(celeri|celeri rave|celeri-rave)\b/);
  addIf('Lupin', /\b(lupin|farine de lupin)\b/);

  return uniq(Array.from(allergens));
}

function getRecipeRiskSignals(recipe) {
  const text = normalizeText([
    recipe?.title,
    recipe?.yield,
    ...(recipe?.categories || []),
    ...(recipe?.tags || []),
    ...(recipe?.aliases || []),
    ...(recipe?.ingredients || []).flatMap(group => [group.group, ...(group.items || [])]),
    ...(recipe?.steps || []),
    ...(recipe?.notes || [])
  ].map(stripHtml).join(' '));
  const signals = [];
  const add = (label, level, pattern) => {
    if (pattern.test(text) && !signals.some(item => item.label === label)) signals.push({ label, level });
  };
  add('Conserve', 'high', /\b(sterilis|bocal|bocaux|conserve|pate de lapin|pate lapin|pate de campagne|terrine|rillettes|saindoux)\b/);
  add('Froid', 'medium', /\b(creme|chantilly|mascarpone|diplomate|patissiere|fromage frais|mozzarella|brie|tiramisu|salade|gaspacho|gazpacho)\b/);
  add('Œufs crus', 'medium', /\b(mayonnaise|aioli|aïoli|rouille|oeuf cru|jaune cru)\b/);
  add('Friture', 'medium', /\b(friture|frire|beignet|tempura|huile a 160|huile a 180|huile a 190)\b/);
  add('Mer', 'medium', /\b(poisson|crevette|crevettes|calamar|calamars|moule|moules|crustace|crustaces)\b/);
  add('Viande', 'medium', /\b(porc|poulet|boeuf|bœuf|lapin|viande|gorge|foie|jambon|lardon|bacon)\b/);
  return signals;
}

function getRecipeServiceItems(recipe) {
  const practicalService = asTextList(recipe?.service || recipe?.practical?.service);
  if (practicalService.length) return practicalService.slice(0, 4);
  const text = normalizeText([
    recipe?.title,
    recipe?.yield,
    ...(recipe?.categories || []),
    ...(recipe?.tags || []),
    ...(recipe?.aliases || []),
    ...(recipe?.steps || []),
    ...(recipe?.notes || [])
  ].map(stripHtml).join(' '));
  const identityText = normalizeText([
    recipe?.title,
    ...(recipe?.categories || []),
    ...(recipe?.tags || []),
    ...(recipe?.aliases || [])
  ].map(stripHtml).join(' '));
  const items = [...practicalService];
  const add = item => {
    if (item && !items.includes(item)) items.push(item);
  };
  const hasRestBeforeService = /\blaisser reposer\b.*\bavant (de )?serv(ir|ice)|\breposer \d+\s*(min|minutes)\b.*\bavant (de )?serv(ir|ice)/.test(text);
  if (/\b(friture|frire|frites|beignet|tempura|gril|griller|gratiner|four|chaud)\b/.test(text)) {
    add(hasRestBeforeService ? 'Laisser reposer le temps indiqué, puis servir chaud.' : 'Servir chaud, juste après cuisson.');
  } else if (/\b(terrine|rillettes|brie|salade|gaspacho|gazpacho|tiramisu|mojito|froid)\b/.test(text)) {
    add('Servir froid ou frais selon la recette.');
  } else if (/\b(cake|pain|brioche|cookies|beurre a l ail|beurre à l ail)\b/.test(text)) {
    add('Servir tiède ou à température ambiante selon la texture recherchée.');
  }
  if (/\b(friture|frire|frites|beignet|tempura)\b/.test(text)) add('Saler ou finir juste avant d’envoyer pour garder le croustillant.');
  if (/\b(chalumeau|meringue|zeste|herbes|fleur de sel|sucre glace)\b/.test(text)) add('Faire les finitions au dernier moment.');
  return items.slice(0, 4);
}

function getRecipeServiceSummary(recipe) {
  const first = getRecipeServiceItems(recipe)[0] || '';
  if (/chaud/i.test(first)) return 'Chaud';
  if (/froid|frais/i.test(first)) return 'Froid';
  if (/ti[eè]de|temp[eé]rature/i.test(first)) return 'Tiède';
  return first ? 'Service' : '';
}

const AVERAGE_WEIGHT_RULES = [
  { label: 'Œuf moyen', value: '≈ 55g', pattern: /\b(oeuf|oeufs|œuf|œufs|oeufs entiers|œufs entiers|oeuf entier|œuf entier)\b/, except: /\b(jaunes?|blancs?) d['’ ]?(oeuf|oeufs)\b/ },
  { label: 'Jaune d’œuf', value: '≈ 18g', pattern: /\bjaunes? d['’ ]?(oeuf|oeufs)\b/ },
  { label: 'Blanc d’œuf', value: '≈ 30g', pattern: /\bblancs? d['’ ]?(oeuf|oeufs)\b/ },
  { label: 'Citron jaune', value: '≈ 100 à 120g', pattern: /\b(citron entier|citron jaune|citrons jaunes)\b/ },
  { label: 'Jus d’un citron', value: '≈ 40 à 50g', pattern: /\bjus de citron\b/ },
  { label: 'Gousse d’ail', value: '≈ 5g', pattern: /\b(gousse d ail|gousses d ail|ail)\b/ },
  { label: 'Oignon moyen', value: '≈ 100 à 120g', pattern: /\b(oignon|oignons)\b/ },
  { label: 'Échalote', value: '≈ 25 à 30g', pattern: /\b(echalote|echalotes)\b/ },
  { label: 'Tomate moyenne', value: '≈ 120g', pattern: /\b(tomate|tomates)\b/ },
  { label: 'Carotte moyenne', value: '≈ 100g', pattern: /\b(carotte|carottes)\b/ },
  { label: 'Pomme de terre moyenne', value: '≈ 150g', pattern: /\b(pomme de terre|pommes de terre)\b/ },
  { label: 'Patate douce moyenne', value: '≈ 250g', pattern: /\b(patate douce|patates douces)\b/ },
  { label: 'Avocat', value: '≈ 150g de chair', pattern: /\b(avocat|avocats)\b/ },
  { label: 'Poivron', value: '≈ 150 à 180g', pattern: /\b(poivron|poivrons)\b/ },
  { label: 'Courgette moyenne', value: '≈ 200g', pattern: /\b(courgette|courgettes)\b/ },
  { label: 'Aubergine moyenne', value: '≈ 300g', pattern: /\b(aubergine|aubergines)\b/ },
  { label: 'Jus d’une orange', value: '≈ 70 à 90g', pattern: /\bjus d['’ ]?orange\b/ },
  { label: 'Orange', value: '≈ 150 à 180g', pattern: /\b(orange|oranges)\b/, except: /\bjus d['’ ]?orange\b/ },
  { label: 'Pomme', value: '≈ 150g', pattern: /\b(pomme|pommes)\b(?!\s+de\s+terre)/ },
  { label: 'Poire', value: '≈ 160g', pattern: /\b(poire|poires)\b/ }
];

const SPOON_WEIGHT_RULES = [
  { label: 'Huile', tablespoon: 14, teaspoon: 5, pattern: /\b(huile|graisse)\b/ },
  { label: 'Eau / bouillon', tablespoon: 15, teaspoon: 5, pattern: /\b(eau|bouillon|jus de viande)\b/ },
  { label: 'Lait / crème', tablespoon: 15, teaspoon: 5, pattern: /\b(lait|creme|yaourt|yogourt)\b/ },
  { label: 'Vinaigre', tablespoon: 15, teaspoon: 5, pattern: /\b(vinaigre)\b/ },
  { label: 'Jus de citron', tablespoon: 15, teaspoon: 5, pattern: /\bjus de citron\b/ },
  { label: 'Miel', tablespoon: 21, teaspoon: 7, pattern: /\b(miel)\b/ },
  { label: 'Moutarde', tablespoon: 15, teaspoon: 5, pattern: /\b(moutarde)\b/ },
  { label: 'Ketchup / sauce', tablespoon: 15, teaspoon: 5, pattern: /\b(ketchup|sauce barbecue|sauce soja|sauce)\b/ },
  { label: 'Concentré de tomate', tablespoon: 16, teaspoon: 5, pattern: /\b(concentre de tomate)\b/ },
  { label: 'Relish', tablespoon: 15, teaspoon: 5, pattern: /\b(relish)\b/ },
  { label: 'Sucre', tablespoon: 12, teaspoon: 4, pattern: /\b(sucre|cassonade|vergeoise)\b/ },
  { label: 'Farine', tablespoon: 8, teaspoon: 3, pattern: /\b(farine|fecule|maizena)\b/ },
  { label: 'Cacao', tablespoon: 8, teaspoon: 3, pattern: /\b(cacao)\b/ },
  { label: 'Levure / bicarbonate', tablespoon: 12, teaspoon: 4, pattern: /\b(levure chimique|bicarbonate)\b/ },
  { label: 'Sel', tablespoon: 18, teaspoon: 6, pattern: /\b(sel|fleur de sel)\b/ },
  { label: 'Poivre', tablespoon: 6, teaspoon: 2, pattern: /\b(poivre)\b/ },
  { label: 'Épices en poudre', tablespoon: 7, teaspoon: 2, pattern: /\b(paprika|piment|cayenne|espelette|cumin|curry|garam masala|tandoori|cannelle|muscade)\b/ },
  { label: 'Ail / oignon en poudre', tablespoon: 9, teaspoon: 3, pattern: /\b(ail en poudre|oignon en poudre)\b/ },
  { label: 'Herbes séchées', tablespoon: 3, teaspoon: 1, pattern: /\b(thym|origan|herbes?|persil sec|basilic sec)\b/ }
];

const SPOON_WEIGHT_NOTE = 'Repère indicatif : cuillères rases pour les poudres et pâtes, liquides remplis à niveau.';

function formatGramRange(first, second = null) {
  if (second !== null && Number.isFinite(second) && Math.abs(second - first) > 0.01) {
    return `${formatNumber(first)} à ${formatNumber(second)}g`;
  }
  return `${formatNumber(first)}g`;
}

function spoonLabel(kind) {
  return kind === 'tablespoon' ? 'c. à soupe' : 'c. à café';
}

function spoonPrecisionLabel(rule) {
  const liquidLabels = new Set(['huile', 'eau / bouillon', 'lait / creme', 'vinaigre', 'jus de citron']);
  return liquidLabels.has(normalizeText(rule?.label)) ? 'à niveau' : 'rase';
}

function getSpoonMeasureInfo(line) {
  const text = normalizeText(line);
  const match = text.match(/(\d+(?:[.,]\d+)?(?:\/\d+)?)(?:\s*(?:[\u2013\u2014-]|a)\s*(\d+(?:[.,]\d+)?(?:\/\d+)?))?\s*c\.?\s*(?:a\s*)?(soupe|cafe)\b/);
  if (!match) return null;

  const firstAmount = parseAmount(match[1]);
  const secondAmount = match[2] ? parseAmount(match[2]) : null;
  if (!Number.isFinite(firstAmount)) return null;

  const kind = match[3] === 'soupe' ? 'tablespoon' : 'teaspoon';
  const rule = SPOON_WEIGHT_RULES.find(item => item.pattern.test(text)) || {
    label: 'Ingrédient mesuré à la cuillère',
    tablespoon: 15,
    teaspoon: 5
  };
  const unitWeight = rule[kind];
  const firstWeight = firstAmount * unitWeight;
  const secondWeight = Number.isFinite(secondAmount) ? secondAmount * unitWeight : null;
  const precision = spoonPrecisionLabel(rule);
  const amountText = match[2]
    ? `${formatNumber(firstAmount)} à ${formatNumber(secondAmount)} ${spoonLabel(kind)} ${precision}`
    : `${formatNumber(firstAmount)} ${spoonLabel(kind)} ${precision}`;

  return {
    label: `${rule.label} (${amountText})`,
    value: `≈ ${formatGramRange(firstWeight, secondWeight)}`
  };
}

function getRecipeAverageWeights(recipe) {
  const explicit = Array.isArray(recipe?.averageWeights) ? recipe.averageWeights : [];
  const found = new Map();
  explicit.forEach(item => {
    const label = item?.label || item?.name;
    const value = item?.value || item?.weight;
    if (label && value) found.set(label, value);
  });
  (recipe?.ingredients || []).forEach(group => {
    (group.items || []).forEach(item => {
      const text = normalizeText(item);
      const spoonInfo = getSpoonMeasureInfo(item);
      if (spoonInfo && !found.has(spoonInfo.label)) found.set(spoonInfo.label, spoonInfo.value);
      if (!/\b\d+(?:[.,]\d+)?\s*g\b/.test(text)) return;
      AVERAGE_WEIGHT_RULES.forEach(rule => {
        if (rule.except?.test(text)) return;
        if (rule.pattern.test(text) && !found.has(rule.label)) found.set(rule.label, rule.value);
      });
    });
  });
  return Array.from(found, ([label, value]) => ({ label, value }));
}

function recipeHasSpoonMeasures(recipe) {
  return (recipe?.ingredients || []).some(group =>
    (group.items || []).some(item => Boolean(getSpoonMeasureInfo(item)))
  );
}

function getRecipeSteps(recipe) {
  return recipe?.steps || [];
}

function getIngredientGroupSteps(group) {
  return Array.isArray(group?.steps)
    ? group.steps.filter(step => typeof step === 'string' && step.trim())
    : [];
}

function getSelectedInlineVariantSteps(recipe, selectedInlineVariantGroup) {
  const groupSteps = getIngredientGroupSteps(selectedInlineVariantGroup?.group);
  return groupSteps.length ? groupSteps : getRecipeSteps(recipe);
}

function getInlineVariantOptions(recipe) {
  if (!recipe?.variantGroups) return [];
  const groups = recipe.ingredients || [];
  return groups
    .map((group, index) => ({ group, index }))
    .filter(({ group }) => isVariantIngredientGroup(group, groups, recipe))
    .map(option => ({
      ...option,
      label: cleanVariantGroupLabel(option.group?.group),
      steps: getSelectedInlineVariantSteps(recipe, option)
    }));
}

function getInlineBaseIngredientGroups(recipe) {
  const groups = recipe?.ingredients || [];
  return groups.filter(group => !isVariantIngredientGroup(group, groups, recipe));
}

function buildInlineVariantRecipe(recipe, option) {
  if (!recipe || !option) return recipe;
  return {
    ...recipe,
    ingredients: [...getInlineBaseIngredientGroups(recipe), option.group],
    steps: option.steps?.length ? option.steps : getSelectedInlineVariantSteps(recipe, option)
  };
}

function getVariantRefs(recipe) {
  return Array.isArray(recipe.variants) ? recipe.variants.filter(variant => variant && variant.id) : [];
}

function getLeafVariantRefs(recipe, recipesById = {}, seen = new Set()) {
  if (!recipe || seen.has(recipe.id)) return [];
  seen.add(recipe.id);
  const variantRefs = getVariantRefs(recipe);
  if (!variantRefs.length) return recipe.id ? [{ id: recipe.id, label: recipe.title }] : [];
  return variantRefs.flatMap(variant => {
    const child = recipesById[variant.id];
    if (!child) return [];
    return getVariantRefs(child).length
      ? getLeafVariantRefs(child, recipesById, seen)
      : [{ id: child.id, label: child.title || variant.label || child.id }];
  });
}

function recipeHasSeason(recipe, season, recipesById = {}) {
  if (!season) return true;
  const seasons = getRecipeSeasonSet(recipe, recipesById);
  return seasons.has(season);
}

function countLeafRecipes(recipe, recipesById = {}) {
  return getLeafVariantRefs(recipe, recipesById).length;
}

function sortVariantRefs(variantRefs, recipesById = {}) {
  return [...variantRefs].sort((a, b) => {
    const left = a.label || recipesById[a.id]?.title || a.id;
    const right = b.label || recipesById[b.id]?.title || b.id;
    return left.localeCompare(right, 'fr', { sensitivity: 'base' });
  });
}

function isMasterRecipe(recipe) {
  return getVariantRefs(recipe).length > 0;
}

function countInlineVariantGroups(recipe) {
  if (!recipe?.variantGroups) return 0;
  const groups = recipe.ingredients || [];
  return groups.filter(group => isVariantIngredientGroup(group, groups, recipe)).length;
}

function getRecipeVariantLabel(recipe, recipesById = {}) {
  const externalVariants = getVariantRefs(recipe);
  const count = externalVariants.length
    ? countLeafRecipes(recipe, recipesById)
    : countInlineVariantGroups(recipe);
  if (!count) return '';
  return `${count} variante${count > 1 ? 's' : ''}`;
}

function parseAmount(raw) {
  const normalized = raw.replace(',', '.');
  if (normalized.includes('/')) {
    const [left, right] = normalized.split('/');
    const num = Number(left);
    const den = Number(right);
    return den ? num / den : Number.NaN;
  }
  return Number(normalized);
}

function formatNumber(value) {
  if (!Number.isFinite(value)) return '';
  if (Math.abs(value - Math.round(value)) < 0.01) return String(Math.round(value));
  return value.toLocaleString('fr-FR', { maximumFractionDigits: 1 });
}

function prettifyServingUnit(phrase) {
  return String(phrase || '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\boeufs\b/g, 'œufs')
    .replace(/\boeuf\b/g, 'œuf')
    .replace(/\bpieces\b/g, 'pièces')
    .replace(/\bpiece\b/g, 'pièce')
    .replace(/\bdecor\b/g, 'décor')
    .replace(/\bparis brests?\b/g, 'Paris-Brest')
    .replace(/^demi\s+/, 'demi-');
}

function singularizeServingUnit(phrase) {
  const words = String(phrase || '').replace(/-/g, ' ').split(/\s+/).filter(Boolean);
  if (!words.length) return '';
  const firstWordMap = {
    petits: 'petit',
    petites: 'petite',
    grands: 'grand',
    grandes: 'grande',
    gros: 'gros',
    grosses: 'grosse'
  };
  words[0] = firstWordMap[words[0]] || words[0];
  const lastIndex = words.length - 1;
  const lastWordMap = {
    oeufs: 'oeuf',
    œufs: 'œuf',
    choux: 'chou'
  };
  words[lastIndex] = lastWordMap[words[lastIndex]] || words[lastIndex].replace(/s$/i, '');
  return prettifyServingUnit(words.join(' '));
}

function pluralizeServingUnit(phrase) {
  const words = String(phrase || '').replace(/-/g, ' ').split(/\s+/).filter(Boolean);
  if (!words.length) return '';
  const firstWordMap = {
    petit: 'petits',
    petite: 'petites',
    grand: 'grands',
    grande: 'grandes',
    grosse: 'grosses'
  };
  words[0] = firstWordMap[words[0]] || words[0];
  const lastIndex = words.length - 1;
  if (!/[sx]$/i.test(words[lastIndex])) words[lastIndex] = `${words[lastIndex]}s`;
  return prettifyServingUnit(words.join(' '));
}

function getServingInfo(recipe) {
  const yieldText = String(recipe?.yield || '');
  const normalized = normalizeText(yieldText);
  const match = normalized.match(/(\d+(?:[.,]\d+)?(?:\/\d+)?)(?:\s*(?:[\u2013\u2014-]|a)\s*(\d+(?:[.,]\d+)?(?:\/\d+)?))?\s*(personnes?|portions?|parts?)\b/);
  if (match) {
    const base = parseAmount(match[1]);
    const max = match[2] ? parseAmount(match[2]) : null;
    if (!Number.isFinite(base) || base <= 0) return null;
    const unit = match[3].startsWith('personne')
      ? 'personne'
      : match[3].startsWith('part')
        ? 'part'
        : 'portion';
    return {
      base,
      max: Number.isFinite(max) && max > base ? max : null,
      unit
    };
  }

  const genericMatch = normalized.match(/(\d+(?:[.,]\d+)?(?:\/\d+)?)(?:\s*(?:[\u2013\u2014-]|a)\s*(\d+(?:[.,]\d+)?(?:\/\d+)?))?\s+((?:(?:petits?|petites?|grands?|grandes?|gros|grosses)\s+)?[a-zœ]+(?:-[a-zœ]+)?)\b/);
  if (!genericMatch) return null;
  const base = parseAmount(genericMatch[1]);
  const max = genericMatch[2] ? parseAmount(genericMatch[2]) : null;
  if (!Number.isFinite(base) || base <= 0) return null;
  const unitPhrase = genericMatch[3].replace(/-/g, ' ').replace(/\s+/g, ' ').trim();
  const lastWord = unitPhrase.split(/\s+/).pop();
  const blockedUnits = new Set(['g', 'kg', 'mg', 'ml', 'cl', 'l', 'litre', 'litres', 'cm', 'mm', 'degre', 'degres', 'minute', 'minutes', 'min', 'heure', 'heures']);
  if (blockedUnits.has(unitPhrase) || blockedUnits.has(lastWord)) return null;
  return {
    base,
    max: Number.isFinite(max) && max > base ? max : null,
    unit: 'custom',
    singular: singularizeServingUnit(unitPhrase),
    plural: pluralizeServingUnit(unitPhrase)
  };
}

function servingUnitLabel(infoOrUnit, count) {
  const info = typeof infoOrUnit === 'string' ? { unit: infoOrUnit } : (infoOrUnit || {});
  if (info.unit === 'personne') return count > 1 ? 'personnes' : 'personne';
  if (info.unit === 'part') return count > 1 ? 'parts' : 'part';
  if (info.singular && info.plural) return count > 1 ? info.plural : info.singular;
  return count > 1 ? 'portions' : 'portion';
}

function getServingTarget(recipe, factor = 1) {
  const info = getServingInfo(recipe);
  if (!info) return null;
  return Math.max(1, Math.round(info.base * factor));
}

function getServingTargetRange(recipe, factor = 1) {
  const info = getServingInfo(recipe);
  if (!info) return null;
  const first = Math.max(1, Math.round(info.base * factor));
  const second = info.max ? Math.max(first, Math.round(info.max * factor)) : null;
  return { first, second, info };
}

function formatServingTarget(recipe, factor = 1) {
  const range = getServingTargetRange(recipe, factor);
  if (!range) return '';
  const unitCount = range.second || range.first;
  const label = servingUnitLabel(range.info, unitCount);
  if (range.second && range.second !== range.first) {
    return `${formatNumber(range.first)} à ${formatNumber(range.second)} ${label}`;
  }
  return `${formatNumber(range.first)} ${label}`;
}

function getQuantityDisplay(recipe, factor = 1) {
  const info = getServingInfo(recipe);
  if (!info) return scaleYieldDisplay(recipe?.yield, factor);
  return `Pour ${formatServingTarget(recipe, factor)}`;
}

function getQuantitySummary(recipe, factor = 1) {
  const info = getServingInfo(recipe);
  if (info) {
    return `pour ${formatServingTarget(recipe, factor)}`;
  }
  const scaledYield = scaleYieldDisplay(recipe?.yield, factor);
  return factor === 1 || !scaledYield ? '' : `pour ${scaledYield}`;
}

function servingOptionsFor(recipe) {
  const info = getServingInfo(recipe);
  if (!info) return [];
  const base = Math.round(info.base);
  const max = Math.max(24, base * 2);
  return uniq([1, 2, 3, 4, 5, 6, 8, 10, 12, base, base * 2]
    .filter(value => Number.isFinite(value) && value >= 1 && value <= max)
    .map(String))
    .map(Number)
    .sort((a, b) => a - b);
}

function stripHtml(value) {
  return String(value || '')
    .replace(/<span\b[^>]*data-goto=(["'])([^"']+)\1[^>]*>(.*?)<\/span>/gi, '$3')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function scaleParentheticalAmounts(text, factor) {
  return String(text || '').replace(/\(([^)]*)\)/g, (full, content) => {
    const hasScalableHint = /(?:≈|env\.?|environ|oeufs?|œufs?|jaunes?|blancs?|pi[eè]ces?|portions?|cl|ml|g|kg)/i.test(content);
    if (!hasScalableHint || !/\d/.test(content)) return full;
    const scaled = content.replace(/(\d+(?:[.,]\d+)?(?:\/\d+)?)(\s*(?:[\u2013\u2014-]|à|a)\s*(\d+(?:[.,]\d+)?(?:\/\d+)?))?/gi, (match, firstRaw, rangeSep, secondRaw) => {
      const first = parseAmount(firstRaw);
      const second = secondRaw ? parseAmount(secondRaw) : null;
      if (!Number.isFinite(first)) return match;
      if (second !== null && Number.isFinite(second)) {
        const separator = rangeSep.slice(0, rangeSep.length - secondRaw.length);
        return `${formatNumber(first * factor)}${separator}${formatNumber(second * factor)}`;
      }
      return formatNumber(first * factor);
    });
    return `(${scaled})`;
  });
}

function scaleIngredient(text, factor) {
  const cleanText = stripHtml(text);
  if (factor === 1) return cleanText;
  const parts = splitShoppingIngredientParts(cleanText);
  if (parts.length > 1) return parts.map(part => scaleIngredient(part, factor)).join(', ');
  const match = String(cleanText).match(/^(\d+(?:[.,]\d+)?(?:\/\d+)?)(\s*(?:[\u2013\u2014-]|à|a)\s*(\d+(?:[.,]\d+)?(?:\/\d+)?))?(.*)$/i);
  if (!match) return cleanText;
  const first = parseAmount(match[1]);
  const second = match[3] ? parseAmount(match[3]) : null;
  if (!Number.isFinite(first)) return cleanText;
  const rest = scaleParentheticalAmounts(match[4], factor);
  if (second !== null && Number.isFinite(second)) {
    const separator = match[2].slice(0, match[2].length - match[3].length);
    return `${formatNumber(first * factor)}${separator}${formatNumber(second * factor)}${rest}`;
  }
  return `${formatNumber(first * factor)}${rest}`;
}

function scaleYield(text, factor) {
  const value = String(text || '');
  if (factor === 1 || !value) return value;
  let scaledCount = 0;
  return value.replace(/(\d+(?:[.,]\d+)?(?:\/\d+)?)(\s*(?:[–-]|à|a)\s*(\d+(?:[.,]\d+)?(?:\/\d+)?))?/gi, (match, firstRaw, rangeSep, secondRaw, offset, fullText) => {
    const after = fullText.slice(offset + match.length).trimStart().toLowerCase();
    const isDetailAmount = scaledCount > 0 && /^(?:g|kg|mg|ml|cl|cm|mm)\b/.test(after);
    if (isDetailAmount) return match;
    const first = parseAmount(firstRaw);
    const second = secondRaw ? parseAmount(secondRaw) : null;
    if (!Number.isFinite(first)) return match;
    scaledCount += 1;
    if (second !== null && Number.isFinite(second)) {
      return `${formatNumber(first * factor)}${rangeSep}${formatNumber(second * factor)}`;
    }
    return formatNumber(first * factor);
  });
}

function scaleYieldDisplay(text, factor) {
  const value = String(text || '');
  if (factor === 1 || !value) return value;
  const amountPattern = String.raw`\d+(?:[.,]\d+)?(?:\/\d+)?`;
  const rangeSeparatorPattern = String.raw`\s*(?:[\u2013\u2014-]|\u00e0|a)\s*`;
  const quantityPattern = new RegExp(String.raw`(^|[^0-9A-Za-z\u00c0-\u017f])(${amountPattern})(${rangeSeparatorPattern}(${amountPattern}))?`, 'gi');
  const detailUnitPattern = /^\s*(?:g|kg|mg|ml|cl|l|litres?|cm|mm)\b/i;
  let scaledCount = 0;
  const scaled = value.replace(quantityPattern, (match, prefix, firstRaw, rangeFull, secondRaw, offset, fullText) => {
    const after = fullText.slice(offset + match.length).trimStart().toLowerCase();
    if (scaledCount > 0 && detailUnitPattern.test(after)) return match;
    const first = parseAmount(firstRaw);
    const second = secondRaw ? parseAmount(secondRaw) : null;
    if (!Number.isFinite(first)) return match;
    scaledCount += 1;
    if (second !== null && Number.isFinite(second)) {
      const separator = rangeFull.slice(0, rangeFull.length - secondRaw.length);
      return `${prefix}${formatNumber(first * factor)}${separator}${formatNumber(second * factor)}`;
    }
    return `${prefix}${formatNumber(first * factor)}`;
  });
  return scaled
    .replace(/\b([2-9]|\d{2,}) cake\b/gi, '$1 cakes')
    .replace(/\b([2-9]|\d{2,}) litre\b/gi, '$1 litres');
}

function recipeShoppingLines(recipe, factor = 1) {
  return (recipe.ingredients || []).flatMap(group => [
    group.group ? `# ${group.group}` : '# Base',
    ...(group.items || []).map(item => `- ${stripHtml(scaleIngredient(item, factor))}`)
  ]);
}

function splitShoppingIngredientParts(line) {
  const value = String(line || '').trim();
  if (!/,(\s*\d+(?:[.,]\d+)?(?:\/\d+)?\s*(?:g|kg|ml|cl|l)\b)/i.test(value)) return [value];
  return value.split(/,\s+(?=\d+(?:[.,]\d+)?(?:\/\d+)?\s*(?:g|kg|ml|cl|l)\b)/i)
    .map(part => part.trim())
    .filter(Boolean);
}

function normalizeShoppingName(value) {
  let text = normalizeText(value)
    .replace(/^(?:de |d'|du |des |la |le |les |l')/i, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (/^beurre\b/.test(text)) {
    if (/\bdemi sel\b/.test(text)) return 'beurre demi sel';
    if (/\bsale\b/.test(text) && !/\bnon sale\b/.test(text)) return 'beurre sale';
    text = text.replace(/\b(doux|non|sale|pommade|ramolli|ramollie|fondu|fondue|froid|froide|mou|molle)\b/g, ' ');
  }
  if (/^farine\b/.test(text)) {
    text = text.replace(/\b(de ble|blé|fluide|tamisee|tamise)\b/g, ' ');
  }
  if (/^huile\b/.test(text)) {
    text = text
      .replace(/\bd olive\b/g, 'olive')
      .replace(/\bde tournesol\b/g, 'tournesol')
      .replace(/\bd arachide\b/g, 'arachide')
      .replace(/\bde pepins de raisin\b/g, 'pepins raisin')
      .replace(/\bd avocat\b/g, 'avocat');
  }
  if (/^citrons?\b/.test(text)) return 'citron';
  if (/^tomates?\b/.test(text)) return 'tomate';
  if (/^oeufs?\b|^œufs?\b/.test(text)) return 'oeufs';
  return text.replace(/\s+/g, ' ').trim();
}

function canonicalShoppingName(value) {
  const text = normalizeText(value);
  if (/\bjus de citron\b/.test(text)) return 'jus de citron';
  if (/\bzeste de citron\b|\bzestes de citron\b/.test(text)) return 'zeste de citron';
  if (/^citrons?\b/.test(text)) return 'citron';
  if (/^oignons?\b/.test(text)) return 'oignon';
  if (/^echalotes?\b|^échalotes?\b/.test(text)) return 'échalote';
  if (/^gousses? d ail\b|^ail\b/.test(text)) return 'ail';
  if (/^beurre\b/.test(text)) {
    if (/\bdemi sel\b/.test(text)) return 'beurre demi-sel';
    if (/\bsale\b/.test(text) && !/\bnon sale\b/.test(text)) return 'beurre salé';
    return 'beurre';
  }
  if (/^farine\b/.test(text)) {
    if (/\bt45\b/.test(text)) return 'farine T45';
    if (/\bt55\b/.test(text)) return 'farine T55';
    return 'farine';
  }
  if (/^huile\b/.test(text)) {
    if (/\bolive\b/.test(text)) return "huile d'olive";
    if (/\bavocat\b/.test(text)) return "huile d'avocat";
    if (/\btournesol|arachide|pepins de raisin|pépins de raisin|neutre\b/.test(text)) return 'huile neutre';
    return value.trim();
  }
  if (/\bcassonade\b|\bvergeoise\b/.test(text)) return 'cassonade ou vergeoise';
  if (/^oeufs?\b|^œufs?\b/.test(text)) return 'œufs';
  if (/^chocolat noir\b/.test(text)) return 'chocolat noir';
  if (/^chocolat au lait\b/.test(text)) return 'chocolat au lait';
  if (/^chocolat blanc\b/.test(text)) return 'chocolat blanc';
  return value.trim();
}

function parseShoppingIngredient(line) {
  const cleaned = stripHtml(line).replace(/^[-•]\s*/, '').trim();
  const match = cleaned.match(/^(\d+(?:[.,]\d+)?(?:\/\d+)?)(\s*(?:[\u2013\u2014-]|à|a)\s*(\d+(?:[.,]\d+)?(?:\/\d+)?))?\s*(g|kg|ml|cl|l)\s+(.*)$/i);
  if (!match) {
    const countMatch = cleaned.match(/^(\d+(?:[.,]\d+)?(?:\/\d+)?)(\s*(?:[\u2013\u2014-]|à|a)\s*(\d+(?:[.,]\d+)?(?:\/\d+)?))?\s+(?!recette\b|c\.|cuill|pinc[eé]e\b|trait\b|filet\b)(citron(?:s)?|oignon(?:s)?|échalote(?:s)?|echalote(?:s)?|gousse(?:s)? d[’']ail|œuf(?:s)?|oeuf(?:s)?|jaune(?:s)?|blanc(?:s)?|tomate(?:s)?|avocat(?:s)?|pomme(?:s)?|poire(?:s)?|carotte(?:s)?|courgette(?:s)?)(.*)$/i);
    if (!countMatch) return null;
    const first = parseAmount(countMatch[1]);
    const second = countMatch[3] ? parseAmount(countMatch[3]) : null;
    if (!Number.isFinite(first)) return null;
    const rawName = `${countMatch[4]}${countMatch[5] || ''}`.trim();
    const normalizedName = normalizeShoppingName(rawName);
    const name = canonicalShoppingName(rawName);
    return {
      key: `piece:${normalizedName}`,
      name,
      unit: 'piece',
      first,
      second: Number.isFinite(second) ? second : null
    };
  }
  const first = parseAmount(match[1]);
  const second = match[3] ? parseAmount(match[3]) : null;
  if (!Number.isFinite(first)) return null;
  const unit = match[4].toLowerCase();
  const multiplier = unit === 'kg' || unit === 'l' ? 1000 : unit === 'cl' ? 10 : 1;
  const baseUnit = unit === 'kg' ? 'g' : unit === 'l' || unit === 'cl' ? 'ml' : unit;
  const rawName = stripHtml(match[5]).trim();
  const normalizedName = normalizeShoppingName(rawName);
  const name = canonicalShoppingName(rawName);
  return {
    key: `${baseUnit}:${normalizedName}`,
    name,
    unit: baseUnit,
    first: first * multiplier,
    second: Number.isFinite(second) ? second * multiplier : null
  };
}

function formatShoppingAmount(item) {
  if (!item.unit) return '';
  if (item.unit === 'piece') return item.second !== null ? `${formatNumber(item.first)} à ${formatNumber(item.second)}` : formatNumber(item.first);
  if (item.second !== null) return `${formatNumber(item.first)} à ${formatNumber(item.second)} ${item.unit}`;
  return `${formatNumber(item.first)} ${item.unit}`;
}

function shoppingPurchaseHint(item) {
  const text = normalizeText(item?.name);
  if (item.unit === 'ml') {
    if (/\b(creme|crème|lait|babeurre)\b/.test(text)) return `${Math.max(1, Math.ceil(item.first / 200))} briquette${item.first > 200 ? 's' : ''} 20cl`;
    if (/\bhuile|vinaigre|sirop\b/.test(text)) return 'bouteille à vérifier';
  }
  if (item.unit === 'g') {
    if (/\bbeurre\b/.test(text)) return `${Math.max(1, Math.ceil(item.first / 250))} plaquette${item.first > 250 ? 's' : ''}`;
    if (/\bfarine|sucre\b/.test(text)) return `${Math.max(1, Math.ceil(item.first / 1000))} paquet${item.first > 1000 ? 's' : ''}`;
    if (/\bchocolat\b/.test(text)) return `${Math.max(1, Math.ceil(item.first / 200))} tablette${item.first > 200 ? 's' : ''}`;
  }
  if (item.unit === 'piece') {
    if (/\boeufs|œufs\b/.test(text)) return `${Math.max(1, Math.ceil(item.first / 6))} boîte${item.first > 6 ? 's' : ''} de 6`;
    if (/\bcitron\b/.test(text)) return item.first >= 4 ? '1 filet ou vrac' : 'vrac';
  }
  return '';
}

function shoppingSmartGroupKey(item) {
  const text = normalizeText(item?.name);
  if (/\bcitron|jus de citron|zeste de citron|lime\b/.test(text)) return 'Citron, jus et zestes';
  if (/\boeuf|oeufs|œuf|œufs|jaune|blanc\b/.test(text)) return 'Œufs, jaunes et blancs';
  if (/\bail|gousse\b/.test(text)) return 'Ail';
  if (/\btomate|tomates\b/.test(text)) return 'Tomates';
  if (/\bcreme|crème|mascarpone|yaourt\b/.test(text)) return 'Crèmes et laitages';
  return '';
}

function buildShoppingSmartGroups(groupedItems) {
  const map = new Map();
  groupedItems.forEach(item => {
    const key = shoppingSmartGroupKey(item);
    if (!key) return;
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(item);
  });
  return [...map.entries()]
    .filter(([, items]) => items.length > 1)
    .map(([label, items]) => ({ label, items }));
}

function shoppingAisle(name) {
  const text = normalizeText(name);
  const aisle = SHOPPING_AISLES.find(item => item.pattern.test(text));
  return aisle?.label || 'Autres';
}

function buildShoppingListData(recipes, factorById = {}) {
  const grouped = new Map();
  const blocks = recipes.map(recipe => {
    const factor = factorById[recipe.id] || 1;
    const quantitySummary = getQuantitySummary(recipe, factor);
    const factorLabel = quantitySummary ? ` (${quantitySummary})` : '';
    (recipe.ingredients || []).forEach(group => {
      (group.items || []).forEach(item => {
        const scaled = scaleIngredient(item, factor);
        splitShoppingIngredientParts(scaled).forEach(part => {
          const parsed = parseShoppingIngredient(part);
          const item = parsed || {
            key: `other:${normalizeShoppingName(part)}`,
            name: part.replace(/^[-•]\s*/, '').trim(),
            unit: '',
            first: 0,
            second: null
          };
          if (!item.name) return;
          item.aisle = shoppingAisle(item.name);
          const existing = grouped.get(item.key);
          if (existing) {
            const existingFirst = existing.first;
            const existingSecond = existing.second;
            existing.first += item.first;
            existing.second = existingSecond !== null || item.second !== null
              ? (existingSecond || existingFirst) + (item.second || item.first)
              : null;
            existing.recipes.add(recipe.title);
          } else {
            grouped.set(item.key, { ...item, recipes: new Set([recipe.title]) });
          }
        });
      });
    });
    return [`## ${recipe.title}${factorLabel}`, ...recipeShoppingLines(recipe, factor)].join('\n');
  });

  const groupedItems = [...grouped.values()]
    .sort((a, b) => a.name.localeCompare(b.name, 'fr', { sensitivity: 'base' }))
    .map(item => ({ ...item, purchaseHint: shoppingPurchaseHint(item), recipeNames: [...item.recipes].sort((a, b) => a.localeCompare(b, 'fr', { sensitivity: 'base' })) }));

  const aisleGroups = SHOPPING_AISLES.map(aisle => ({
    label: aisle.label,
    items: groupedItems.filter(item => item.aisle === aisle.label)
  })).filter(group => group.items.length);
  const otherItems = groupedItems.filter(item => !SHOPPING_AISLES.some(aisle => aisle.label === item.aisle));
  if (otherItems.length) aisleGroups.push({ label: 'Autres', items: otherItems });
  return { blocks, groupedItems, aisleGroups, smartGroups: buildShoppingSmartGroups(groupedItems) };
}

function filterShoppingListData(data, ownedItems = {}) {
  const isOwned = item => Boolean(ownedItems[item.key]);
  const groupedItems = data.groupedItems.filter(item => !isOwned(item));
  const ownedGroupedItems = data.groupedItems.filter(isOwned);
  const aisleGroups = SHOPPING_AISLES.map(aisle => ({
    label: aisle.label,
    items: groupedItems.filter(item => item.aisle === aisle.label)
  })).filter(group => group.items.length);
  const otherItems = groupedItems.filter(item => !SHOPPING_AISLES.some(aisle => aisle.label === item.aisle));
  if (otherItems.length) aisleGroups.push({ label: 'Autres', items: otherItems });
  return { ...data, groupedItems, ownedGroupedItems, aisleGroups, smartGroups: buildShoppingSmartGroups(groupedItems) };
}

function shoppingListText(recipes, factorById = {}, ownedItems = {}, mode = 'detailed') {
  const data = buildShoppingListData(recipes, factorById);
  const filtered = filterShoppingListData(data, ownedItems);
  if (mode === 'compact') {
    return [
      'Courses Cook Note',
      ...filtered.aisleGroups.flatMap(group => [
        `${group.label}:`,
        ...group.items.map(item => `- ${[formatShoppingAmount(item), item.name].filter(Boolean).join(' ')}`)
      ])
    ].join('\n');
  }
  const groupedLines = filtered.groupedItems
    .map(item => {
      const amount = formatShoppingAmount(item);
      const hint = item.purchaseHint ? ` - achat: ${item.purchaseHint}` : '';
      return `- ${[amount, item.name].filter(Boolean).join(' ')}${hint} (${item.recipeNames.join(', ')})`;
    });
  return [
    'Liste de courses Cook Note',
    '',
    groupedLines.length ? '## Ingrédients regroupés' : '',
    ...groupedLines,
    filtered.smartGroups.length ? '' : '',
    filtered.smartGroups.length ? '## Regroupements utiles' : '',
    ...filtered.smartGroups.map(group => `- ${group.label}: ${group.items.map(item => item.name).join(', ')}`),
    filtered.ownedGroupedItems.length ? '' : '',
    filtered.ownedGroupedItems.length ? '## Déjà à la maison' : '',
    ...filtered.ownedGroupedItems.map(item => `- ${[formatShoppingAmount(item), item.name].filter(Boolean).join(' ')}`),
    '',
    '## Détail par recette',
    ...data.blocks
  ].filter((line, index, lines) => line || lines[index - 1]).join('\n\n');
}

function recipeExportText(recipe, factor = 1) {
  const practicalSections = getRecipePracticalSections(recipe);
  const notes = getDisplayNotes(recipe, practicalSections).map(stripHtml);
  const equipment = getRecipeEquipment(recipe);
  return [
    `${recipe.title} - Cook Note`,
    recipe.yield ? getQuantityDisplay(recipe, factor) : '',
    difficultyText(recipe),
    '',
    equipment.length ? '## Matériel nécessaire' : '',
    ...equipment.map(item => `- ${item}`),
    equipment.length ? '' : '',
    '## Ingrédients',
    ...(recipe.ingredients || []).flatMap(group => [
      group.group ? `### ${group.group}` : '',
      ...(group.items || []).map(item => `- ${stripHtml(scaleIngredient(item, factor))}`),
      group.note ? `Note: ${stripHtml(group.note)}` : '',
      ...(group.notes || []).map(note => `Note: ${stripHtml(note)}`)
    ]).filter(Boolean),
    '',
    '## Étapes',
    ...getRecipeSteps(recipe).map((step, index) => `${index + 1}. ${stripHtml(step)}`),
    '',
    practicalSections.length ? '## Avant de commencer' : '',
    ...practicalSections.flatMap(section => [
      `### ${section.title}`,
      ...(section.items || []).map(item => `- ${stripHtml(item)}`)
    ]),
    notes.length ? '' : '',
    notes.length ? '## Notes' : '',
    ...notes.map(note => `- ${note}`)
  ].filter((line, index, lines) => line || lines[index - 1]).join('\n');
}

function getStepMinutes(step) {
  const text = normalizeText(step);
  const hourMatch = text.match(/(\d+(?:[.,]\d+)?)\s*h/);
  if (hourMatch) return Math.round(parseAmount(hourMatch[1]) * 60);
  const minuteMatch = text.match(/(\d+(?:[.,]\d+)?)\s*(?:min|minute)/);
  if (minuteMatch) return Math.round(parseAmount(minuteMatch[1]));
  return 0;
}

function getRecipeTiming(recipe) {
  const steps = getRecipeSteps(recipe);
  const stepText = normalizeText(steps.join(' '));
  const timedSteps = steps.map(getStepMinutes).filter(minutes => minutes > 0);
  const totalTimed = timedSteps.reduce((sum, minutes) => sum + minutes, 0);
  const restMinutes = steps
    .filter(step => /\b(repos|reposer|refroidir|refrigerateur|froid|pousse|lever|mariner)\b/.test(normalizeText(step)))
    .map(getStepMinutes)
    .reduce((sum, minutes) => sum + minutes, 0);
  const cookMinutes = steps
    .filter(step => /\b(cuire|cuisson|four|enfourner|frire|friture|poele|mijoter|fremir|griller|rotir|saisir)\b/.test(normalizeText(step)))
    .map(getStepMinutes)
    .reduce((sum, minutes) => sum + minutes, 0);
  const activeEstimate = Math.max(5, Math.min(90, Math.round((countIngredients(recipe) * 2.2) + (steps.length * 2.5))));
  return {
    active: activeEstimate,
    cook: cookMinutes || (totalTimed && !restMinutes ? totalTimed : 0),
    rest: restMinutes,
    total: activeEstimate + totalTimed,
    hasOven: /\b(four|enfourner|rotir|gratin|plaque)\b/.test(stepText),
    hasFry: /\b(friture|frire|bain d huile|tempura|beignet)\b/.test(stepText),
    hasCold: /\b(refrigerateur|froid|refroidir|repos)\b/.test(stepText)
  };
}

function formatMinutesShort(minutes) {
  if (!minutes) return '';
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const rest = minutes % 60;
    return rest ? `${hours}h${String(rest).padStart(2, '0')}` : `${hours}h`;
  }
  return `${minutes} min`;
}

function getRecipeCardBadges(recipe, recipesById = {}) {
  if (isMasterRecipe(recipe)) return [];
  const timing = getRecipeTiming(recipe);
  const text = normalizeText([
    recipe.title,
    ...(recipe.categories || []),
    ...(recipe.tags || []),
    ...(recipe.steps || []),
    ...(recipe.notes || []),
    getRecipePracticalSections(recipe).flatMap(section => section.items).join(' ')
  ].join(' '));
  const badges = [];
  if (timing.hasOven) badges.push('Four');
  if (timing.hasFry) badges.push('Friture');
  if (timing.rest || timing.hasCold) badges.push('Repos');
  if (/\b(veille|avance|conserver|congel|refrigerateur)\b/.test(text)) badges.push('\u00c0 l\u2019avance');
  if (/\b(base|technique|pate|creme|sauce|fond)\b/.test(text) || (recipe.categories || []).some(category => normalizeText(category).includes('base'))) badges.push('Base');
  if ((recipe.variants || []).length || getRecipeVariantLabel(recipe, recipesById)) badges.push('Variante');
  return uniq(badges).slice(0, 3);
}

const MENU_COMPONENT_IDS = new Set([
  'aioli_citronne_leger',
  'babeurre_maison',
  'balsamique_reduit',
  'base_pour_flan_sale',
  'beurre_ail',
  'beurre_clarifie',
  'beurre_d_escargot_persille',
  'chantilly_classique',
  'chantilly_gelatine',
  'court_bouillon',
  'craquelin_cacao',
  'creme_beurre_meringue_italienne',
  'creme_citron_lemon_curd',
  'creme_diplomate_cloud',
  'creme_diplomate_vanille',
  'creme_mascarpone_vanille',
  'creme_patissiere_praline',
  'creme_patissiere_vanille',
  'creme_pistache',
  'huile_pimentee_pizza',
  'marinades',
  'mascarpone',
  'meringue_italienne',
  'meringues',
  'pain_hot_dog',
  'pains_burgers_brioche',
  'pate_choux',
  'pate_legere_beignets_calamar_crevettes',
  'pate_sucree',
  'pates_tarte_variantes',
  'pesto_tomates_sechees_sans_cajou',
  'ricotta_fouettee',
  'rouille',
  'sauce_aux_poivres',
  'sauce_caramel',
  'sauce_mornay',
  'sauce_yaourt_citronnee',
  'tempura_beignets_calamar_crevettes',
  'toppings_frites',
  'vinaigrette'
]);

const MENU_SIDE_IDS = new Set([
  'frites',
  'frites_belges',
  'frites_maison',
  'frites_patate_douce',
  'gratin_chou_fleur',
  'gratin_dauphinois',
  'lentilles_a_la_bourguignonne',
  'puree_courge_butternut',
  'puree_pommes_de_terre_citron',
  'riz_au_citron',
  'riz_cantonnais',
  'tomates_provencales'
]);

const MENU_STARTER_IDS = new Set([
  'billes_mozzarella_marinees',
  'brie_farci_fruits_secs_noix',
  'cake_tomate_chorizo_feta',
  'chorizo_au_cidre',
  'cookies_sales_variantes',
  'rillettes_porc',
  'rillettes_poulet',
  'salade_avocat_oeuf_epinards',
  'salade_melon_mozzarella_jambon_cru',
  'salade_oeufs_durs_mayonnaise_bistrot',
  'terrine_campagne',
  'terrine_porc_pistaches',
  'tomates_variantes'
]);

const MENU_COMPONENT_PATTERNS = [
  /\b(base|fond|fonds|appareil|insert|garniture|fourrage)\b/,
  /\b(pate|pates|pâte|pâtes|pate a tarte|pâte à tarte|pate sucree|pâte sucrée|pate a choux|pâte à choux)\b/,
  /\b(creme|crème|ganache|chantilly|mascarpone|diplomate|patissiere|pâtissière|curd|meringue)\b/,
  /\b(sauce|coulis|pesto|vinaigrette|aioli|aïoli|rouille|marinade|sirop|caramel|topping|condiment)\b/,
  /\b(beurre aromatise|beurre aromatisé|beurre clarifie|beurre clarifié|babeurre|levain|poolish)\b/,
  /\b(pain burger|pain hot dog|bun|buns|tortilla|chapelure|croûtons|croutons)\b/
];

function getMenuRecipeProfile(recipe) {
  const text = normalizeText([
    recipe?.title,
    ...(recipe?.categories || []),
    ...(recipe?.tags || []),
    ...(recipe?.aliases || []),
    ...(recipe?.ingredients || []).flatMap(group => [group.group, ...(group.items || [])])
  ].join(' '));
  const categories = (recipe?.categories || []).map(normalizeText);
  const hasCategory = value => categories.includes(normalizeText(value));
  const families = [];
  const addFamily = family => {
    if (!families.includes(family)) families.push(family);
  };
  if (/\b(riz|pates|pate|pommes? de terre|pdt|frites|puree|gratin dauphinois|pain|bun|lentilles)\b/.test(text)) addFamily('starch');
  if (/\b(poulet|volaille|boeuf|bœuf|porc|agneau|saucisse|chorizo|jambon|bacon|lapin)\b/.test(text)) addFamily('meat');
  if (/\b(poisson|cabillaud|saumon|thon|calamar|crevettes?|chipirons?)\b/.test(text)) addFamily('fish');
  if (/\b(legume|légume|courge|butternut|chou|tomate|salade|melon|betterave|carotte|avocat|epinards|épinards)\b/.test(text)) addFamily('vegetable');
  if (/\b(sauce|pesto|aioli|aïoli|mornay|rouille|vinaigrette|beurre|caramel|toppings)\b/.test(text)) addFamily('sauce');
  if (/\b(dessert|gateau|gâteau|gouter|goûter|cookies|tiramisu|creme|crème|tarte|flan|clafoutis|cerise|chocolat)\b/.test(text)) addFamily('dessert');
  if (/\b(apero|apéro|entree|entrée|brie|billes|oeufs|œufs|terrine|rillettes|cake sale|cake salé)\b/.test(text)) addFamily('starter');
  const explicitComponent = MENU_COMPONENT_IDS.has(recipe?.id);
  const explicitSide = MENU_SIDE_IDS.has(recipe?.id);
  const explicitStarter = MENU_STARTER_IDS.has(recipe?.id);
  const hasProtein = families.includes('meat') || families.includes('fish');
  const baseComponent = hasCategory('Base') || hasCategory('Sauces') || MENU_COMPONENT_PATTERNS.some(pattern => pattern.test(text));
  const servedStarter = explicitStarter || hasCategory('Apero') || hasCategory('Apéro') || hasCategory('Entrees') || hasCategory('Entrées');
  const servedSide = explicitSide || (hasCategory('Accompagnements') && !hasCategory('Plats'));
  const servedDessert = hasCategory('Desserts') && !hasCategory('Base') && !hasCategory('Sauces');
  const isComponent = explicitComponent || (baseComponent && !servedStarter && !servedSide && !servedDessert && !hasCategory('Plats'));
  const isDessert = !isComponent && servedDessert && !hasProtein;
  const isSauce = !isComponent && hasCategory('Sauces') && !hasProtein && !hasCategory('Desserts');
  const isStarter = !isComponent && servedStarter;
  const isSide = !isComponent && servedSide;
  const isCompleteMain = !isComponent && !isSide && !isStarter && (hasCategory('Plats') || hasProtein || /\b(curry|plat|croque|lentilles tomate)\b/.test(text));
  return {
    families,
    role: isComponent ? 'component' : isDessert ? 'dessert' : isSauce ? 'sauce' : isStarter ? 'starter' : isSide ? 'side' : isCompleteMain ? 'main' : families.includes('vegetable') || families.includes('starch') ? 'side' : 'other',
    heavy: families.includes('starch'),
    protein: hasProtein,
    servable: !isComponent,
    text
  };
}

const MENU_THEMES = [
  {
    id: 'bistrot',
    label: 'Bistrot',
    pitch: 'Classique chaud, sauce lisible, dessert de pâtisserie.',
    prefer: /\b(poulet|boeuf|bœuf|porc|gratin|mornay|poivre|moutarde|terrine|rillettes|tarte|flan|creme|crème)\b/,
    avoid: /\b(gazpacho|melon|air fryer|tempura|pesto)\b/
  },
  {
    id: 'mediterraneen',
    label: 'Méditerranéen',
    pitch: 'Tomate, citron, huile d’olive, herbes et fraîcheur.',
    prefer: /\b(tomate|citron|basilic|olive|pesto|poisson|saumon|cabillaud|melon|mozzarella|yaourt)\b/,
    avoid: /\b(mornay|poivre|gratin dauphinois|rhum|caramel)\b/
  },
  {
    id: 'semaine',
    label: 'Soir de semaine',
    pitch: 'Simple, rapide, peu de gestes et courses raisonnables.',
    prefer: /\b(rapide|facile|simple|poele|poêle|four|riz|pates|pâtes|poulet|salade)\b/,
    avoid: /\b(24h|la veille|maturation|terrine|macaron|pate a choux|pâte à choux)\b/
  },
  {
    id: 'invites',
    label: 'Invités',
    pitch: 'Préparable, équilibré, avec un dessert qui tient bien.',
    prefer: /\b(la veille|repos|conservation|terrine|brie|carre|carré|tiramisu|tarte|flan|clafoutis)\b/,
    avoid: /\b(frites|air fryer|croque|riz cantonnais)\b/
  },
  {
    id: 'apero',
    label: 'Apéro dînatoire',
    pitch: 'Petites pièces, dips, fromages et choses à picorer.',
    prefer: /\b(apero|apéro|brie|billes|rillettes|terrine|cake sale|cake salé|chorizo|dip|sauce|toppings)\b/,
    avoid: /\b(gratin|pates|pâtes|riz cantonnais|saucisse puree|joues)\b/
  },
  {
    id: 'confort',
    label: 'Confort',
    pitch: 'Gourmand, chaud, généreux, sans empiler deux féculents.',
    prefer: /\b(gratin|puree|purée|mornay|poulet|saucisse|lentilles|fromage|chocolat|caramel)\b/,
    avoid: /\b(gazpacho|salade melon|crudites|crudités)\b/
  },
  {
    id: 'ete',
    label: 'Été frais',
    pitch: 'Froid, acidulé, végétal, avec une fin légère.',
    prefer: /\b(froid|salade|melon|tomate|gazpacho|gaspacho|citron|yaourt|basilic|cerise|clafoutis)\b/,
    avoid: /\b(gratin|mornay|rhum|friture|beurre d escargot)\b/
  }
];

function menuThemeById(id) {
  return MENU_THEMES.find(theme => theme.id === id) || MENU_THEMES[0];
}

function isWeeknightDessert(recipe) {
  const timing = getRecipeTiming(recipe);
  return Boolean(timing.active && timing.active <= 10);
}

const MENU_PAIRING_PATTERNS = {
  creamySauce: /\b(creme|cremeux|fromage|mornay|gaston gerard|moutarde|bechamel|mascarpone|sauce blanche|sauce fromage)\b/,
  sauceMarked: /\b(sauce|jus reduit|coulis|pesto|vinaigrette|aioli|rouille|mornay|caramel|marinade|condiment)\b/,
  expressiveTomato: /\b(tomate|tomates|provencal|provencale|confites?|sechees?|ail|huile d olive|basilic|origan)\b/,
  neutralSide: /\b(riz nature|riz pilaf|pommes vapeur|pomme vapeur|haricots verts|salade verte|legumes vapeur|semoule nature|pates nature)\b/,
  greenFresh: /\b(salade|crudites|crudites|concombre|haricots verts|citron|vinaigrette|pickles|herbes|yaourt|fenouil)\b/,
  fried: /\b(friture|frire|frites|tempura|beignet|air fryer|croustillant)\b/,
  starch: /\b(riz|pates|pate|pommes de terre|pomme de terre|puree|gratin|frites|pain|bun|semoule|polenta)\b/,
  cheese: /\b(fromage|comte|comte|cheddar|parmesan|mozzarella|brie|raclette|mornay)\b/,
  delicateFish: /\b(cabillaud|sole|lieu|merlu|poisson blanc|poisson delicat)\b/,
  strongMeat: /\b(boeuf|boeuf|agneau|canard|joues|porc|saucisse)\b/,
  spicy: /\b(piment|espelette|harissa|cajun|curry|paprika fort|chili|sriracha)\b/,
  sweetSavory: /\b(miel|sucre sale|sucre-sale|caramel|rhum|sirop|fruit sec|fruits secs)\b/,
  richDessert: /\b(chocolat|caramel|cookies|brownie|tiramisu|macaron|creme|cremeux|ganache|mascarpone)\b/,
  freshDessert: /\b(citron|fruit|fruits|sorbet|yaourt|compote|fraise|framboise|cerise|clafoutis|tarte citron)\b/,
  technicalDessert: /\b(macaron|entremets|pate a choux|pate feuilletee|opera|ouréa|ourea)\b/,
  coldFresh: /\b(froid|froide|salade|gazpacho|gaspacho|melon|crudites|crudites)\b/,
  makeAhead: /\b(la veille|repos|24h|refroidir|conservation|preparer a l avance|preparable)\b/,
  strongFlavor: /\b(chorizo|bacon|lardons|poivre|moutarde forte|fromage fort|ail|anchois|fumee|fume)\b/,
  smoked: /\b(fume|fumee|fumé|fumée|bacon|lardons|poitrine fumee|saumon fume)\b/,
  eggMayo: /\b(oeuf|oeufs|œuf|œufs|mayo|mayonnaise|mimosa)\b/,
  rawAllium: /\b(oignon cru|oignons crus|ail cru|echalote crue|échalote crue|ciboule|cebettes|cébettes)\b/,
  nuts: /\b(noix|noisette|amande|pistache|pecan|pécan|cajou)\b/,
  sweetFruit: /\b(pomme|poire|abricot|cerise|fraise|framboise|figue|raisin|cranberry|canneberge|fruit sec|fruits secs)\b/,
  bitterGreen: /\b(endive|roquette|chicoree|chicorée|radicchio|salade amere|salade amère)\b/,
  herbBright: /\b(persil|ciboulette|basilic|menthe|coriandre|estragon|aneth|cerfeuil)\b/,
  pastryBase: /\b(pate sucree|pâte sucrée|pate brisee|pâte brisée|pate feuilletee|pâte feuilletée|fond de tarte|biscuit joconde)\b/,
  longRest: /\b(24h|la veille|repos une nuit|maturation|pousse lente|fermentation)\b/,
  oven: /\b(four|enfourner|rotir|rôtir|gratin|gratiner|plaque|moule)\b/,
  pan: /\b(poele|poêle|saisir|saute|sauté|revenir)\b/,
  grill: /\b(plancha|gril|griller|barbecue|brochette)\b/,
  coldServe: /\b(froid|froide|servir frais|bien frais|refrigerateur|réfrigérateur)\b/,
  hotServe: /\b(chaud|chaude|servir aussitot|servir aussitôt|sortie du four)\b/,
  mayo: /\b(mayo|mayonnaise|aioli|aïoli|remoulade|rémoulade)\b/,
  potato: /\b(pomme de terre|pommes de terre|patate|patates|puree|purée|gratin dauphinois|frites)\b/,
  rice: /\b(riz|risotto|pilaf|cantonais)\b/,
  pasta: /\b(pates|pâtes|lasagne|spaghetti|tagliatelle|macaroni)\b/,
  bread: /\b(pain|bun|buns|brioche|burger|toast|tartine|croûtons|croutons)\b/,
  legumes: /\b(lentilles|pois chiches|haricots blancs|haricot blanc|flageolets|feves|fèves)\b/,
  mushroom: /\b(champignon|champignons|cepes|cèpes|morilles|girolles)\b/,
  shellfish: /\b(crevette|crevettes|moule|moules|calamar|calamars|chipiron|chipirons|crustace|crustacé)\b/,
  citrus: /\b(citron|lime|orange|pamplemousse|zeste|agrumes)\b/,
  alcohol: /\b(rhum|vin blanc|vin rouge|cidre|biere|bière|cognac|armagnac|porto)\b/,
  coffeeCocoa: /\b(cafe|café|cacao|chocolat|praline|praliné)\b/,
  roasted: /\b(roti|rôti|roties|rôties|confites|confits|caramelise|caramélisé)\b/,
  braised: /\b(mijote|mijoté|braise|braisé|confit|longue cuisson)\b/,
  pickled: /\b(pickle|pickles|cornichon|vinaigre|saumure|mariné|marine)\b/,
  freshDairy: /\b(yaourt|fromage blanc|faisselle|ricotta|brousse|labneh)\b/,
  poultry: /\b(poulet|volaille|dinde|pintade)\b/,
  beefLamb: /\b(boeuf|bœuf|agneau|veau|joues)\b/,
  pork: /\b(porc|saucisse|lard|lardon|lardons|bacon|jambon|rillettes)\b/,
  dessertServed: /\b(dessert|gateau|gâteau|tarte|clafoutis|mousse|creme dessert|crème dessert|sorbet)\b/,
  lightSide: /\b(salade verte|crudites|crudités|legumes vapeur|légumes vapeur|haricots verts|concombre)\b/,
  crunchy: /\b(croustillant|croquant|crumble|chapelure|frit|frite|toast|noix|amande)\b/,
  softCreamyTexture: /\b(fondant|cremeux|crémeux|moelleux|puree|purée|mousse|veloute|velouté)\b/,
  bitterChocolate: /\b(chocolat noir|cacao amer|cafe|café)\b/
};

function menuHas(profile, patternName) {
  return MENU_PAIRING_PATTERNS[patternName]?.test(profile?.text || '');
}

function menuEither(firstProfile, secondProfile, patternName) {
  return menuHas(firstProfile, patternName) || menuHas(secondProfile, patternName);
}

function menuBoth(firstProfile, secondProfile, patternName) {
  return menuHas(firstProfile, patternName) && menuHas(secondProfile, patternName);
}

function menuPairHas(firstProfile, secondProfile, firstPattern, secondPattern) {
  return (menuHas(firstProfile, firstPattern) && menuHas(secondProfile, secondPattern))
    || (menuHas(firstProfile, secondPattern) && menuHas(secondProfile, firstPattern));
}

function menuRecipeDifficultyScore(recipe) {
  if (Number.isFinite(recipe?.difficultyScore)) return recipe.difficultyScore;
  if (normalizeText(recipe?.difficulty) === 'easy') return 3;
  if (normalizeText(recipe?.difficulty) === 'hard') return 8;
  return 5;
}

const MENU_PAIRING_RULES = [
  { id: 'creamy-sauce-needs-neutral-side', kind: 'pairPenalty', weight: 72, match: (a, b) => menuPairHas(a, b, 'creamySauce', 'expressiveTomato') },
  { id: 'dominant-sauce-with-second-sauce', kind: 'pairPenalty', weight: 46, match: (a, b) => menuBoth(a, b, 'sauceMarked') },
  { id: 'double-starch', kind: 'pairPenalty', weight: 44, match: (a, b) => menuBoth(a, b, 'starch') },
  { id: 'double-creamy', kind: 'pairPenalty', weight: 38, match: (a, b) => menuBoth(a, b, 'creamySauce') },
  { id: 'double-cheese', kind: 'pairPenalty', weight: 34, match: (a, b) => menuBoth(a, b, 'cheese') },
  { id: 'double-tomato', kind: 'pairPenalty', weight: 30, match: (a, b) => menuBoth(a, b, 'expressiveTomato') },
  { id: 'fried-with-fried', kind: 'pairPenalty', weight: 48, match: (a, b) => menuBoth(a, b, 'fried') },
  { id: 'fried-with-starch-heavy', kind: 'pairPenalty', weight: 34, match: (a, b) => menuPairHas(a, b, 'fried', 'starch') },
  { id: 'delicate-fish-strong-flavor', kind: 'pairPenalty', weight: 34, match: (a, b) => menuPairHas(a, b, 'delicateFish', 'strongFlavor') },
  { id: 'spicy-with-strong-heat', kind: 'pairPenalty', weight: 24, match: (a, b) => menuBoth(a, b, 'spicy') },
  { id: 'sweet-savory-with-rich-dessert', kind: 'pairPenalty', weight: 28, match: (a, b) => menuPairHas(a, b, 'sweetSavory', 'richDessert') },
  { id: 'cheese-with-rich-dessert', kind: 'pairPenalty', weight: 18, match: (a, b) => menuPairHas(a, b, 'cheese', 'richDessert') },
  { id: 'rich-meat-with-creamy-side', kind: 'pairPenalty', weight: 22, match: (a, b) => menuPairHas(a, b, 'strongMeat', 'creamySauce') },
  { id: 'cold-fresh-with-cold-fresh-repeat', kind: 'pairPenalty', weight: 12, match: (a, b) => menuBoth(a, b, 'coldFresh') },
  { id: 'sauce-and-condiment-overload', kind: 'pairPenalty', weight: 26, match: (a, b) => menuBoth(a, b, 'sauceMarked') && menuEither(a, b, 'strongFlavor') },
  { id: 'creamy-sauce-with-neutral-side', kind: 'pairAffinity', weight: 40, match: (a, b) => menuPairHas(a, b, 'creamySauce', 'neutralSide') },
  { id: 'rich-with-green-fresh', kind: 'pairAffinity', weight: 30, match: (a, b) => (menuEither(a, b, 'creamySauce') || menuEither(a, b, 'fried') || menuEither(a, b, 'cheese')) && menuEither(a, b, 'greenFresh') },
  { id: 'fried-with-acid-fresh', kind: 'pairAffinity', weight: 30, match: (a, b) => menuPairHas(a, b, 'fried', 'greenFresh') },
  { id: 'spicy-with-cooling-side', kind: 'pairAffinity', weight: 24, match: (a, b) => menuPairHas(a, b, 'spicy', 'greenFresh') },
  { id: 'fish-with-citrus-herbs', kind: 'pairAffinity', weight: 28, match: (a, b) => menuPairHas(a, b, 'delicateFish', 'greenFresh') },
  { id: 'meat-with-simple-starch', kind: 'pairAffinity', weight: 16, match: (a, b) => menuPairHas(a, b, 'strongMeat', 'neutralSide') },
  { id: 'tomato-with-mediterranean-context', kind: 'pairAffinity', weight: 12, match: (a, b) => menuBoth(a, b, 'expressiveTomato') && !menuEither(a, b, 'creamySauce') },
  { id: 'make-ahead-supports-invites', kind: 'recipeBonus', weight: 14, match: ({ recipe, theme }) => theme.id === 'invites' && menuHas(getMenuRecipeProfile(recipe), 'makeAhead') },
  { id: 'weeknight-active-under-30', kind: 'recipeBonus', weight: 14, match: ({ recipe, theme }) => theme.id === 'semaine' && (getRecipeTiming(recipe).active || 0) <= 30 },
  { id: 'weeknight-active-over-35', kind: 'recipePenalty', weight: 24, match: ({ recipe, theme }) => theme.id === 'semaine' && (getRecipeTiming(recipe).active || 0) > 35 },
  { id: 'weeknight-dessert-under-10', kind: 'recipeBonus', weight: 18, match: ({ recipe, profile, theme }) => theme.id === 'semaine' && profile.role === 'dessert' && isWeeknightDessert(recipe) },
  { id: 'weeknight-dessert-over-10', kind: 'recipePenalty', weight: 80, match: ({ recipe, profile, theme }) => theme.id === 'semaine' && profile.role === 'dessert' && !isWeeknightDessert(recipe) },
  { id: 'bistrot-dessert-simple', kind: 'recipeBonus', weight: 16, match: ({ recipe, profile, theme }) => theme.id === 'bistrot' && profile.role === 'dessert' && menuRecipeDifficultyScore(recipe) <= 6 && !menuHas(profile, 'technicalDessert') },
  { id: 'bistrot-dessert-too-technical', kind: 'recipePenalty', weight: 34, match: ({ recipe, profile, theme }) => theme.id === 'bistrot' && profile.role === 'dessert' && (menuRecipeDifficultyScore(recipe) >= 8 || menuHas(profile, 'technicalDessert')) },
  { id: 'ete-avoid-hot-heavy', kind: 'recipePenalty', weight: 26, match: ({ profile, theme }) => theme.id === 'ete' && (profile.heavy || menuHas(profile, 'creamySauce') || menuHas(profile, 'fried')) },
  { id: 'ete-fresh-cold', kind: 'recipeBonus', weight: 18, match: ({ profile, theme }) => theme.id === 'ete' && menuHas(profile, 'coldFresh') },
  { id: 'confort-accept-richness', kind: 'recipeBonus', weight: 12, match: ({ profile, theme }) => theme.id === 'confort' && (profile.heavy || menuHas(profile, 'creamySauce') || menuHas(profile, 'cheese')) },
  { id: 'mediterranean-avoid-cream', kind: 'recipePenalty', weight: 20, match: ({ profile, theme }) => theme.id === 'mediterraneen' && menuHas(profile, 'creamySauce') },
  { id: 'mediterranean-tomato-citrus-herbs', kind: 'recipeBonus', weight: 16, match: ({ profile, theme }) => theme.id === 'mediterraneen' && (menuHas(profile, 'expressiveTomato') || menuHas(profile, 'greenFresh')) },
  { id: 'apero-small-pieces', kind: 'recipeBonus', weight: 16, match: ({ profile, theme }) => theme.id === 'apero' && profile.role === 'starter' },
  { id: 'apero-avoid-real-main', kind: 'recipePenalty', weight: 50, match: ({ profile, theme }) => theme.id === 'apero' && profile.role === 'main' },
  { id: 'menu-total-under-90', kind: 'menuBonus', weight: 16, match: ({ totalActive }) => totalActive > 0 && totalActive <= 90 },
  { id: 'menu-total-over-120', kind: 'menuPenalty', weight: 28, match: ({ totalActive }) => totalActive > 120 },
  { id: 'menu-total-over-150', kind: 'menuPenalty', weight: 42, match: ({ totalActive }) => totalActive > 150 },
  { id: 'too-many-long-recipes', kind: 'menuPenalty', weight: 36, match: ({ recipes }) => recipes.filter(recipe => (getRecipeTiming(recipe).active || 0) > 30).length >= 3 },
  { id: 'weeknight-max-three-cards', kind: 'menuPenalty', weight: 34, match: ({ roles, theme }) => theme.id === 'semaine' && roles.length > 3 },
  { id: 'weeknight-total-over-75', kind: 'menuPenalty', weight: 48, match: ({ totalActive, theme }) => theme.id === 'semaine' && totalActive > 75 },
  { id: 'invites-can-hold-complexity', kind: 'menuBonus', weight: 18, match: ({ theme, recipes }) => theme.id === 'invites' && recipes.some(recipe => (getRecipeTiming(recipe).active || 0) > 30) },
  { id: 'bistrot-too-many-hard-cards', kind: 'menuPenalty', weight: 32, match: ({ theme, recipes }) => theme.id === 'bistrot' && recipes.filter(recipe => menuRecipeDifficultyScore(recipe) >= 8).length > 1 },
  { id: 'starter-rich-main-rich', kind: 'menuPenalty', weight: 28, match: ({ itemProfiles }) => itemProfiles.filter(profile => menuHas(profile, 'creamySauce') || menuHas(profile, 'fried') || menuHas(profile, 'cheese')).length >= 3 },
  { id: 'need-one-fresh-contrast', kind: 'menuPenalty', weight: 18, match: ({ itemProfiles }) => itemProfiles.some(profile => menuHas(profile, 'creamySauce') || menuHas(profile, 'fried') || menuHas(profile, 'cheese')) && !itemProfiles.some(profile => menuHas(profile, 'greenFresh') || menuHas(profile, 'freshDessert')) },
  { id: 'fresh-dessert-after-rich-main', kind: 'menuBonus', weight: 24, match: ({ itemProfiles, roles }) => roles.includes('dessert') && itemProfiles.some(profile => menuHas(profile, 'creamySauce') || menuHas(profile, 'fried') || menuHas(profile, 'cheese')) && itemProfiles.some(profile => menuHas(profile, 'freshDessert')) },
  { id: 'rich-dessert-after-rich-main', kind: 'menuPenalty', weight: 30, match: ({ itemProfiles, roles }) => roles.includes('dessert') && itemProfiles.some(profile => menuHas(profile, 'creamySauce') || menuHas(profile, 'fried') || menuHas(profile, 'cheese')) && itemProfiles.some(profile => menuHas(profile, 'richDessert')) },
  { id: 'one-clear-main-required', kind: 'menuPenalty', weight: 80, match: ({ roles, theme }) => theme.id !== 'apero' && !roles.includes('main') },
  { id: 'dessert-not-mandatory-weeknight', kind: 'menuBonus', weight: 10, match: ({ roles, theme }) => theme.id === 'semaine' && !roles.includes('dessert') },
  { id: 'component-never-served', kind: 'recipePenalty', weight: 90, match: ({ profile }) => profile.role === 'component' },
  { id: 'sauce-cannot-replace-side-alone', kind: 'menuPenalty', weight: 20, match: ({ roles, theme }) => theme.id !== 'apero' && roles.includes('sauce') && !roles.includes('side') },
  { id: 'fil-conducteur-readable', kind: 'menuBonus', weight: 8, match: ({ itemProfiles }) => new Set(itemProfiles.flatMap(profile => profile.families || [])).size >= 2 },
  { id: 'egg-mayo-with-creamy-main', kind: 'pairPenalty', weight: 30, match: (a, b) => menuPairHas(a, b, 'eggMayo', 'creamySauce') },
  { id: 'egg-mayo-with-rich-dessert', kind: 'pairPenalty', weight: 18, match: (a, b) => menuPairHas(a, b, 'eggMayo', 'richDessert') },
  { id: 'raw-allium-with-delicate-fish', kind: 'pairPenalty', weight: 24, match: (a, b) => menuPairHas(a, b, 'rawAllium', 'delicateFish') },
  { id: 'smoked-with-delicate-fish', kind: 'pairPenalty', weight: 30, match: (a, b) => menuPairHas(a, b, 'smoked', 'delicateFish') },
  { id: 'smoked-with-sweet-dessert', kind: 'pairPenalty', weight: 16, match: (a, b) => menuPairHas(a, b, 'smoked', 'richDessert') },
  { id: 'nuts-with-delicate-fish', kind: 'pairPenalty', weight: 14, match: (a, b) => menuPairHas(a, b, 'nuts', 'delicateFish') },
  { id: 'fruit-with-fresh-dessert-repeat', kind: 'pairPenalty', weight: 14, match: (a, b) => menuPairHas(a, b, 'sweetFruit', 'freshDessert') },
  { id: 'bitter-green-with-bitter-dessert', kind: 'pairPenalty', weight: 16, match: (a, b) => menuPairHas(a, b, 'bitterGreen', 'bitterChocolate') },
  { id: 'pastry-base-as-served-dessert', kind: 'recipePenalty', weight: 70, match: ({ profile }) => profile.role === 'dessert' && menuHas(profile, 'pastryBase') && !menuHas(profile, 'dessertServed') },
  { id: 'long-rest-in-weeknight', kind: 'recipePenalty', weight: 52, match: ({ profile, theme }) => theme.id === 'semaine' && menuHas(profile, 'longRest') },
  { id: 'long-rest-ok-invites', kind: 'recipeBonus', weight: 12, match: ({ profile, theme }) => theme.id === 'invites' && menuHas(profile, 'longRest') },
  { id: 'too-many-oven-recipes', kind: 'menuPenalty', weight: 22, match: ({ itemProfiles }) => itemProfiles.filter(profile => menuHas(profile, 'oven')).length >= 3 },
  { id: 'too-many-pan-recipes', kind: 'menuPenalty', weight: 16, match: ({ itemProfiles }) => itemProfiles.filter(profile => menuHas(profile, 'pan')).length >= 3 },
  { id: 'grill-theme-support', kind: 'recipeBonus', weight: 10, match: ({ profile, theme }) => theme.id === 'ete' && menuHas(profile, 'grill') },
  { id: 'hot-and-cold-balance', kind: 'menuBonus', weight: 12, match: ({ itemProfiles }) => itemProfiles.some(profile => menuHas(profile, 'hotServe')) && itemProfiles.some(profile => menuHas(profile, 'coldServe')) },
  { id: 'all-cold-menu-outside-ete', kind: 'menuPenalty', weight: 18, match: ({ itemProfiles, theme }) => theme.id !== 'ete' && itemProfiles.length >= 3 && itemProfiles.every(profile => menuHas(profile, 'coldServe')) },
  { id: 'all-hot-heavy-menu', kind: 'menuPenalty', weight: 18, match: ({ itemProfiles }) => itemProfiles.length >= 3 && itemProfiles.every(profile => menuHas(profile, 'hotServe') || profile.heavy) },
  { id: 'mayo-with-fried', kind: 'pairPenalty', weight: 18, match: (a, b) => menuPairHas(a, b, 'mayo', 'fried') },
  { id: 'mayo-with-green-fresh', kind: 'pairAffinity', weight: 12, match: (a, b) => menuPairHas(a, b, 'mayo', 'greenFresh') },
  { id: 'potato-with-rice', kind: 'pairPenalty', weight: 36, match: (a, b) => menuPairHas(a, b, 'potato', 'rice') },
  { id: 'potato-with-pasta', kind: 'pairPenalty', weight: 34, match: (a, b) => menuPairHas(a, b, 'potato', 'pasta') },
  { id: 'rice-with-pasta', kind: 'pairPenalty', weight: 34, match: (a, b) => menuPairHas(a, b, 'rice', 'pasta') },
  { id: 'bread-with-pasta', kind: 'pairPenalty', weight: 24, match: (a, b) => menuPairHas(a, b, 'bread', 'pasta') },
  { id: 'bread-with-rice', kind: 'pairPenalty', weight: 22, match: (a, b) => menuPairHas(a, b, 'bread', 'rice') },
  { id: 'legumes-with-light-side', kind: 'pairAffinity', weight: 16, match: (a, b) => menuPairHas(a, b, 'legumes', 'lightSide') },
  { id: 'legumes-with-heavy-starch', kind: 'pairPenalty', weight: 22, match: (a, b) => menuPairHas(a, b, 'legumes', 'starch') && !menuPairHas(a, b, 'legumes', 'lightSide') },
  { id: 'mushroom-with-cream-ok', kind: 'pairAffinity', weight: 12, match: (a, b) => menuPairHas(a, b, 'mushroom', 'creamySauce') && !menuEither(a, b, 'expressiveTomato') },
  { id: 'mushroom-with-tomato-clash', kind: 'pairPenalty', weight: 16, match: (a, b) => menuPairHas(a, b, 'mushroom', 'expressiveTomato') },
  { id: 'shellfish-with-citrus', kind: 'pairAffinity', weight: 24, match: (a, b) => menuPairHas(a, b, 'shellfish', 'citrus') },
  { id: 'shellfish-with-cheese', kind: 'pairPenalty', weight: 28, match: (a, b) => menuPairHas(a, b, 'shellfish', 'cheese') },
  { id: 'citrus-with-fresh-dessert-repeat', kind: 'pairPenalty', weight: 10, match: (a, b) => menuPairHas(a, b, 'citrus', 'freshDessert') && menuBoth(a, b, 'citrus') },
  { id: 'alcohol-with-weeknight', kind: 'recipePenalty', weight: 14, match: ({ profile, theme }) => theme.id === 'semaine' && menuHas(profile, 'alcohol') },
  { id: 'alcohol-with-invites', kind: 'recipeBonus', weight: 10, match: ({ profile, theme }) => theme.id === 'invites' && menuHas(profile, 'alcohol') },
  { id: 'coffee-cocoa-after-sweet-savory', kind: 'pairPenalty', weight: 16, match: (a, b) => menuPairHas(a, b, 'coffeeCocoa', 'sweetSavory') },
  { id: 'roasted-with-fresh-herbs', kind: 'pairAffinity', weight: 18, match: (a, b) => menuPairHas(a, b, 'roasted', 'herbBright') },
  { id: 'braised-with-crunchy', kind: 'pairAffinity', weight: 18, match: (a, b) => menuPairHas(a, b, 'braised', 'crunchy') },
  { id: 'braised-with-soft-creamy', kind: 'pairPenalty', weight: 16, match: (a, b) => menuPairHas(a, b, 'braised', 'softCreamyTexture') && !menuPairHas(a, b, 'braised', 'greenFresh') },
  { id: 'pickled-with-rich-main', kind: 'pairAffinity', weight: 20, match: (a, b) => menuPairHas(a, b, 'pickled', 'creamySauce') || menuPairHas(a, b, 'pickled', 'fried') || menuPairHas(a, b, 'pickled', 'cheese') },
  { id: 'pickled-with-delicate-dessert', kind: 'pairPenalty', weight: 12, match: (a, b) => menuPairHas(a, b, 'pickled', 'freshDessert') },
  { id: 'fresh-dairy-with-spice', kind: 'pairAffinity', weight: 24, match: (a, b) => menuPairHas(a, b, 'freshDairy', 'spicy') },
  { id: 'poultry-with-neutral-side', kind: 'pairAffinity', weight: 16, match: (a, b) => menuPairHas(a, b, 'poultry', 'neutralSide') },
  { id: 'poultry-with-double-cream', kind: 'pairPenalty', weight: 18, match: (a, b) => menuPairHas(a, b, 'poultry', 'creamySauce') && menuBoth(a, b, 'creamySauce') },
  { id: 'beef-lamb-with-bitter-green', kind: 'pairAffinity', weight: 16, match: (a, b) => menuPairHas(a, b, 'beefLamb', 'bitterGreen') },
  { id: 'beef-lamb-with-rich-dessert', kind: 'pairPenalty', weight: 18, match: (a, b) => menuPairHas(a, b, 'beefLamb', 'richDessert') },
  { id: 'pork-with-fruit', kind: 'pairAffinity', weight: 16, match: (a, b) => menuPairHas(a, b, 'pork', 'sweetFruit') },
  { id: 'pork-with-mayo-overload', kind: 'pairPenalty', weight: 18, match: (a, b) => menuPairHas(a, b, 'pork', 'mayo') },
  { id: 'need-crunch-or-freshness', kind: 'menuPenalty', weight: 16, match: ({ itemProfiles }) => itemProfiles.length >= 3 && !itemProfiles.some(profile => menuHas(profile, 'crunchy') || menuHas(profile, 'greenFresh') || menuHas(profile, 'freshDessert')) },
  { id: 'too-many-soft-textures', kind: 'menuPenalty', weight: 24, match: ({ itemProfiles }) => itemProfiles.filter(profile => menuHas(profile, 'softCreamyTexture')).length >= 3 },
  { id: 'one-crunchy-texture-good', kind: 'menuBonus', weight: 10, match: ({ itemProfiles }) => itemProfiles.some(profile => menuHas(profile, 'crunchy')) && itemProfiles.some(profile => menuHas(profile, 'softCreamyTexture')) },
  { id: 'dessert-base-blocked-global', kind: 'recipePenalty', weight: 64, match: ({ profile }) => profile.role === 'dessert' && menuHas(profile, 'pastryBase') }
];

window.MENU_PAIRING_RULES = MENU_PAIRING_RULES;

function menuRuleScore(kind, payload) {
  return MENU_PAIRING_RULES
    .filter(rule => {
      if (rule.kind !== kind) return false;
      if (kind === 'pairPenalty' || kind === 'pairAffinity') return rule.match(payload.firstProfile, payload.secondProfile, payload);
      return rule.match(payload);
    })
    .reduce((score, rule) => score + rule.weight, 0);
}

function menuThemeScore(recipe, profile, theme) {
  let score = 0;
  if (theme.prefer.test(profile.text)) score += 34;
  if (theme.avoid.test(profile.text)) score -= 38;
  if (theme.id === 'apero' && profile.role === 'starter') score += 22;
  if (theme.id === 'ete' && profile.families.includes('vegetable')) score += 12;
  if (theme.id === 'confort' && profile.heavy) score += 10;
  if (theme.id === 'semaine' && getRecipeTiming(recipe).active && getRecipeTiming(recipe).active <= 30) score += 12;
  if (theme.id === 'invites' && getRecipeIntentLabels(recipe).join(' ').includes('à préparer')) score += 14;
  return score;
}

function menuRecipeScore(recipe, profile = getMenuRecipeProfile(recipe), theme = MENU_THEMES[0]) {
  const timing = getRecipeTiming(recipe);
  const labels = getRecipeIntentLabels(recipe).join(' ');
  let score = 0;
  if ((recipe.seasons || []).includes(getCurrentSeason()) || (recipe.seasons || []).includes('Toutes saisons')) score += 18;
  if (normalizeText(recipe.difficulty) === 'easy') score += 8;
  if (timing.active && timing.active <= 30) score += 8;
  if (labels.includes('soir de semaine') || labels.includes('à préparer')) score += 6;
  if ((recipe.tags || []).length >= 3) score += 4;
  score += menuRuleScore('recipeBonus', { recipe, profile, theme });
  score -= menuRuleScore('recipePenalty', { recipe, profile, theme });
  return score + menuThemeScore(recipe, profile, theme);
}

function menuPairPenalty(firstProfile, secondProfile, theme = MENU_THEMES[0]) {
  if (!firstProfile || !secondProfile) return 0;
  let penalty = 0;
  if (firstProfile.heavy && secondProfile.heavy) penalty += 44;
  if (firstProfile.families.includes('starch') && secondProfile.families.includes('starch')) penalty += 32;
  if (firstProfile.families.includes('vegetable') && secondProfile.families.includes('vegetable') && !firstProfile.heavy && !secondProfile.heavy) penalty += 10;
  if (/\b(frites|friture|air fryer)\b/.test(firstProfile.text) && /\b(frites|friture|air fryer)\b/.test(secondProfile.text)) penalty += 42;
  if (/\b(creme|fromage|mornay|gratin)\b/.test(firstProfile.text) && /\b(creme|fromage|mornay|gratin)\b/.test(secondProfile.text)) penalty += 18;
  if (/\b(tomate|tomates)\b/.test(firstProfile.text) && /\b(tomate|tomates)\b/.test(secondProfile.text)) penalty += 22;
  if (firstProfile.families.includes('fish') && /\b(poivre|moutarde|bacon|chorizo)\b/.test(secondProfile.text)) penalty += 16;
  if ((firstProfile.protein && secondProfile.protein) && (firstProfile.role === 'side' || secondProfile.role === 'side')) penalty += 28;
  penalty += menuRuleScore('pairPenalty', { firstProfile, secondProfile, theme });
  return penalty;
}

function menuPairAffinity(firstProfile, secondProfile, theme = MENU_THEMES[0]) {
  if (!firstProfile || !secondProfile) return 0;
  let score = 0;
  const joined = `${firstProfile.text} ${secondProfile.text}`;
  if (firstProfile.families.includes('fish') && /\b(citron|tomate|olive|basilic|yaourt|salade|legume|légume)\b/.test(secondProfile.text)) score += 30;
  if (firstProfile.families.includes('meat') && /\b(tomate|salade|citron|moutarde|puree|purée|riz|gratin)\b/.test(secondProfile.text)) score += 18;
  if (/\b(frites|friture|air fryer)\b/.test(firstProfile.text) && /\b(salade|tomate|citron|yaourt|legume|légume)\b/.test(secondProfile.text)) score += 26;
  if (firstProfile.heavy && secondProfile.families.includes('vegetable') && !secondProfile.heavy) score += 24;
  if (firstProfile.families.includes('vegetable') && secondProfile.families.includes('starch') && !firstProfile.heavy) score += 12;
  if (/\b(miel|moutarde|rhum|piment)\b/.test(firstProfile.text) && /\b(citron|tomate|salade|yaourt)\b/.test(secondProfile.text)) score += 14;
  if (theme.id === 'mediterraneen' && /\b(tomate|olive|basilic|citron|poisson|saumon|cabillaud)\b/.test(joined)) score += 18;
  if (theme.id === 'ete' && /\b(froid|salade|melon|tomate|citron|yaourt|fruit)\b/.test(joined)) score += 16;
  if (theme.id === 'confort' && /\b(poulet|porc|boeuf|bœuf|gratin|puree|purée|chocolat|caramel)\b/.test(joined)) score += 12;
  score += menuRuleScore('pairAffinity', { firstProfile, secondProfile, theme });
  return score;
}

function menuDessertAffinity(items, profiles, theme = MENU_THEMES[0]) {
  const main = items.find(item => item.key === 'main')?.recipe;
  const dessert = items.find(item => item.key === 'dessert')?.recipe;
  if (!dessert) return 0;
  const mainProfile = main ? profiles.get(main.id) : null;
  const dessertProfile = profiles.get(dessert.id);
  let score = 0;
  const dessertText = dessertProfile?.text || '';
  const mainText = mainProfile?.text || '';
  const freshDessert = /\b(citron|lime|fruit|fruits|cerise|clafoutis|tarte citron|sorbet|fraise|framboise)\b/.test(dessertText);
  const richDessert = /\b(chocolat|caramel|cookies|brownie|tiramisu|macaron|creme|crème)\b/.test(dessertText);
  if (!mainProfile) return freshDessert ? 10 : 0;
  if (mainProfile.heavy || /\b(frites|gratin|creme|crème|fromage|mornay|porc|boeuf|bœuf|agneau)\b/.test(mainText)) {
    if (freshDessert) score += 34;
    if (richDessert) score -= 24;
  } else {
    if (richDessert) score += 16;
    if (freshDessert) score += 10;
  }
  if (theme.id === 'ete' && freshDessert) score += 20;
  if (theme.id === 'invites' && /\b(tarte|tiramisu|macaron|clafoutis)\b/.test(dessertText)) score += 16;
  if (theme.id === 'apero' && /\b(cookies|macaron|carres|carrés|mini)\b/.test(dessertText)) score += 14;
  if (theme.id === 'semaine' && isWeeknightDessert(dessert)) score += 26;
  return score;
}

function menuSignature(items) {
  return items.map(item => item.recipe?.id).filter(Boolean).sort().join('|');
}

function menuBalanceScore(items, profiles, theme) {
  const recipes = items.map(item => item.recipe).filter(Boolean);
  const itemProfiles = recipes.map(recipe => profiles.get(recipe.id));
  const roles = items.map(item => item.key);
  let score = recipes.reduce((total, recipe) => total + menuRecipeScore(recipe, profiles.get(recipe.id), theme), 0);
  for (let i = 0; i < itemProfiles.length; i += 1) {
    for (let j = i + 1; j < itemProfiles.length; j += 1) {
      score -= menuPairPenalty(itemProfiles[i], itemProfiles[j], theme);
      score += menuPairAffinity(itemProfiles[i], itemProfiles[j], theme);
    }
  }
  const familyCount = new Set(itemProfiles.flatMap(profile => profile?.families || [])).size;
  score += familyCount * 5;
  const totalActive = recipes.reduce((sum, recipe) => sum + (getRecipeTiming(recipe).active || 0), 0);
  if (totalActive && totalActive <= 90) score += 14;
  if (totalActive > 150) score -= 18;
  if (theme.id !== 'apero' && roles.includes('main') && roles.includes('dessert')) score += theme.id === 'semaine' ? 8 : 28;
  if (theme.id !== 'apero' && !roles.includes('main')) score -= 80;
  if (theme.id === 'apero') {
    score += roles.filter(role => role === 'starter').length * 18;
    if (roles.includes('main')) score -= 90;
  }
  if (theme.id === 'ete' && itemProfiles.filter(profile => profile?.heavy).length > 1) score -= 30;
  if (theme.id === 'confort' && itemProfiles.filter(profile => profile?.heavy).length === 0) score -= 14;
  const menuPayload = { recipes, itemProfiles, roles, totalActive, theme };
  score += menuRuleScore('menuBonus', menuPayload);
  score -= menuRuleScore('menuPenalty', menuPayload);
  score += menuDessertAffinity(items, profiles, theme);
  return score;
}

function menuItemReason(item, items, profiles, theme) {
  const profile = item.recipe ? profiles.get(item.recipe.id) : null;
  const main = items.find(candidate => candidate.key === 'main')?.recipe;
  const mainProfile = main ? profiles.get(main.id) : null;
  if (!profile) return '';
  if (theme.id === 'apero' && item.key === 'starter') return 'Format à partager, cohérent avec l’apéro.';
  if (item.key === 'main') {
    if (profile.families.includes('fish')) return 'Base poisson, facile à accorder avec frais et citron.';
    if (profile.families.includes('meat')) return 'Base principale solide pour construire le repas.';
    if (profile.heavy) return 'Plat structurant, donc le reste reste plus léger.';
    return 'Recette centrale du menu.';
  }
  if ((item.key === 'side' || item.key === 'sauce') && mainProfile) {
    if (mainProfile.heavy && profile.families.includes('vegetable') && !profile.heavy) return 'Allège le plat sans rajouter un second féculent.';
    if (mainProfile.families.includes('fish') && /\b(citron|tomate|olive|basilic|yaourt)\b/.test(profile.text)) return 'Accord frais avec le poisson.';
    if (mainProfile.families.includes('meat') && /\b(tomate|salade|citron|moutarde|puree|purée|riz)\b/.test(profile.text)) return 'Accompagnement logique avec la viande.';
    return 'Complète le plat sans conflit fort.';
  }
  if (item.key === 'dessert') {
    if (theme.id === 'semaine') return 'Dessert express uniquement, sinon on garde le repas court.';
    if (/\b(citron|fruit|cerise|clafoutis)\b/.test(profile.text)) return 'Fin plus fraîche après le salé.';
    if (/\b(chocolat|caramel|cookies|tiramisu)\b/.test(profile.text)) return 'Fin gourmande assumée.';
    return 'Dessert servi, pas une base technique.';
  }
  return 'Ouvre le menu sans alourdir le plat.';
}

function menuLeadReason(items, profiles, theme) {
  const main = items.find(item => item.key === 'main')?.recipe;
  const first = main || items.find(item => item.recipe)?.recipe;
  const profile = first ? profiles.get(first.id) : null;
  const cues = [];
  if (profile?.families.includes('fish')) cues.push('poisson');
  if (profile?.families.includes('meat') && !profile?.families.includes('fish')) cues.push('viande');
  if (profile?.families.includes('vegetable')) cues.push('légumes');
  if (profile?.families.includes('starch')) cues.push('féculent');
  if (profile?.families.includes('dessert')) cues.push('douceur');
  const lead = first ? `Fil conducteur : ${first.title}${cues.length ? `, ${cues.slice(0, 2).join(' et ')}` : ''}.` : 'Fil conducteur : menu cohérent.';
  return `${theme.label} : ${theme.pitch} ${lead}`;
}

function buildMenuCandidate(items, profiles, theme, recentMenuSignatures = []) {
  const cleanItems = items.filter(item => item.recipe);
  const signature = menuSignature(cleanItems);
  return {
    items: cleanItems,
    signature,
    score: menuBalanceScore(cleanItems, profiles, theme) - (recentMenuSignatures.includes(signature) ? 120 : 0)
  };
}

function annotateMenuItems(items, profiles, theme) {
  return items.map(item => ({
    ...item,
    note: menuItemReason(item, items, profiles, theme)
  }));
}

function buildMenuSuggestion(recipes, offset = 0, themeId = 'bistrot', recentMenuSignatures = []) {
  const theme = menuThemeById(themeId);
  const leaves = recipes.filter(recipe => recipe && !isMasterRecipe(recipe));
  const profiles = new Map(leaves.map(recipe => [recipe.id, getMenuRecipeProfile(recipe)]));
  const byRole = leaves.reduce((groups, recipe) => {
    const role = profiles.get(recipe.id).role;
    if (!groups[role]) groups[role] = [];
    groups[role].push(recipe);
    return groups;
  }, {});
  Object.keys(byRole).forEach(role => {
    byRole[role].sort((a, b) => menuRecipeScore(b, profiles.get(b.id), theme) - menuRecipeScore(a, profiles.get(a.id), theme) || a.title.localeCompare(b.title, 'fr', { sensitivity: 'base' }));
  });
  const rolePool = (role, limit = 16) => (byRole[role] || [])
    .filter(recipe => profiles.get(recipe.id).servable)
    .slice(0, limit);
  const candidates = [];
  if (theme.id === 'apero') {
    const starters = rolePool('starter', 28);
    const desserts = rolePool('dessert', 10);
    for (let i = 0; i < starters.length; i += 1) {
      const chosen = [starters[i], starters[(i + 3) % starters.length], starters[(i + 7) % starters.length]]
        .filter((recipe, index, list) => recipe && list.findIndex(item => item?.id === recipe.id) === index);
      const dessert = desserts[(i + offset) % Math.max(desserts.length, 1)];
      candidates.push(buildMenuCandidate([
        { key: 'starter', label: 'Bouchée salée', recipe: chosen[0] },
        { key: 'starter', label: 'À partager', recipe: chosen[1] },
        { key: 'starter', label: 'À picorer', recipe: chosen[2] },
        { key: 'dessert', label: 'Douceur', recipe: dessert }
      ], profiles, theme, recentMenuSignatures));
    }
  } else {
    const starters = rolePool('starter', 14)
      .filter(recipe => !/\b(cookies|cake|chorizo au cidre)\b/.test(profiles.get(recipe.id).text));
    const mains = rolePool('main', 18);
    const themedMains = mains.filter(recipe => {
      const text = profiles.get(recipe.id).text;
      if (theme.id === 'mediterraneen') return /\b(tomate|olive|basilic|poisson|saumon|cabillaud|bouillabaisse|calamar|crevettes|chipirons)\b/.test(text) && !/\b(chorizo|miel|moutarde|rhum)\b/.test(text);
      if (theme.id === 'ete') return /\b(froid|salade|melon|gazpacho|gaspacho|poisson|saumon|cabillaud|oeuf|œuf)\b/.test(text) && !/\b(chorizo|porc|boeuf|bœuf|agneau|miel|moutarde|rhum|gratin|friture)\b/.test(text);
      return true;
    });
    const mainOptions = themedMains.length ? themedMains : mains;
    const sides = rolePool('side', 18);
    const desserts = rolePool('dessert', 16)
      .filter(recipe => theme.id !== 'semaine' || isWeeknightDessert(recipe));
    const sauces = rolePool('sauce', 8);
    mainOptions.forEach((main, mainIndex) => {
      const mainProfile = profiles.get(main.id);
      const compatibleSides = sides
        .filter(side => menuPairPenalty(mainProfile, profiles.get(side.id), theme) < 35)
        .filter(side => theme.id !== 'mediterraneen' || !/\b(gratin|creme|crème|mornay)\b/.test(profiles.get(side.id).text))
        .filter(side => theme.id !== 'ete' || !/\b(gratin|creme|crème|frites|friture|puree|purée)\b/.test(profiles.get(side.id).text))
        .sort((a, b) => menuPairAffinity(mainProfile, profiles.get(b.id), theme) - menuPairAffinity(mainProfile, profiles.get(a.id), theme));
      const sideOptions = compatibleSides.length ? compatibleSides : [null];
      const starterOptions = starters.length ? starters : [null];
      const dessertOptions = desserts.length ? desserts : [null];
      for (let step = 0; step < Math.min(10, Math.max(sideOptions.length, dessertOptions.length, starterOptions.length)); step += 1) {
        const side = sideOptions[(mainIndex + step + offset) % sideOptions.length];
        const starter = starterOptions[(mainIndex + step * 2 + offset) % starterOptions.length];
        const dessert = dessertOptions[(mainIndex + step * 3 + offset) % dessertOptions.length];
        const sauce = !side && sauces.length ? sauces[(mainIndex + step + offset) % sauces.length] : null;
        candidates.push(buildMenuCandidate([
          { key: 'starter', label: 'Entrée / apéro', recipe: starter },
          { key: 'main', label: 'Plat', recipe: main },
          { key: side ? 'side' : 'sauce', label: side ? 'Accompagnement' : 'Sauce', recipe: side || sauce },
          { key: 'dessert', label: 'Dessert', recipe: dessert }
        ], profiles, theme, recentMenuSignatures));
      }
    });
  }
  if (candidates.length) {
    candidates.sort((a, b) => b.score - a.score);
    const selected = candidates[offset % Math.min(candidates.length, 24)] || candidates[0];
    return {
      theme,
      reason: menuLeadReason(selected.items, profiles, theme),
      quality: Math.max(0, Math.min(100, Math.round(62 + selected.score / 18))),
      signature: selected.signature,
      items: annotateMenuItems(selected.items, profiles, theme)
    };
  }
  const used = new Set();
  const pick = (roles, bump = 0, allowed = () => true) => {
    const pool = roles
      .flatMap(role => byRole[role] || [])
      .filter(recipe => !used.has(recipe.id) && allowed(recipe, profiles.get(recipe.id)));
    if (!pool.length) return null;
    const recipe = pool[(offset + bump) % pool.length];
    used.add(recipe.id);
    return recipe;
  };
  const starter = pick(['starter'], 0, (recipe, profile) => profile.servable);
  const main = pick(['main'], 1, (recipe, profile) => profile.servable);
  const mainProfile = main ? profiles.get(main.id) : null;
  const side = pick(['side'], 2, (recipe, profile) => {
    if (!profile.servable) return false;
    if (!mainProfile) return true;
    if (mainProfile.heavy && profile.heavy) return false;
    if (mainProfile.families.includes('starch') && profile.families.includes('starch')) return false;
    if (mainProfile.families.includes('vegetable') && profile.families.includes('vegetable') && !profile.families.includes('starch')) return offset % 2 === 0;
    return true;
  });
  const sauce = pick(['sauce'], 3, (recipe, profile) => {
    if (theme.id !== 'apero' && theme.id !== 'bistrot' && theme.id !== 'mediterraneen') return false;
    if (!mainProfile) return true;
    if (mainProfile.families.includes('fish')) return /\b(citron|yaourt|aioli|aïoli|rouille|beurre)\b/.test(profile.text);
    if (mainProfile.families.includes('meat')) return /\b(poivre|moutarde|mornay|beurre|rouille|burger)\b/.test(profile.text);
    return true;
  });
  const dessert = pick(['dessert'], 4, (recipe, profile) => profile.servable && (theme.id !== 'semaine' || isWeeknightDessert(recipe)));
  const items = [
    { key: 'starter', label: 'Entrée / apéro', recipe: starter },
    { key: 'main', label: 'Plat', recipe: main },
    { key: 'side', label: side ? 'Accompagnement' : 'Complément', recipe: side || sauce },
    { key: 'dessert', label: 'Dessert', recipe: dessert }
  ].filter(item => item.recipe);
  return {
    theme,
    reason: menuLeadReason(items, profiles, theme),
    quality: Math.max(0, Math.min(100, Math.round(menuBalanceScore(items, profiles, theme) / 18))),
    signature: menuSignature(items),
    items: annotateMenuItems(items, profiles, theme)
  };
}

function buildMenuItemReplacement(menu, recipes, themeId, targetIndex = 0, bump = 1) {
  const currentItems = menu?.items || [];
  const target = currentItems[targetIndex];
  if (!target?.recipe) return menu;
  const theme = menuThemeById(themeId);
  const leaves = recipes.filter(recipe => recipe && !isMasterRecipe(recipe));
  const profiles = new Map(leaves.map(recipe => [recipe.id, getMenuRecipeProfile(recipe)]));
  const usedIds = new Set(currentItems.map(item => item.recipe?.id).filter(Boolean));
  const wantedRole = target.key === 'sauce' ? 'sauce' : target.key === 'side' ? 'side' : target.key;
  const allowed = recipe => {
    const profile = profiles.get(recipe.id);
    if (!profile?.servable || profile.role !== wantedRole || usedIds.has(recipe.id)) return false;
    if (theme.id === 'semaine' && wantedRole === 'dessert' && !isWeeknightDessert(recipe)) return false;
    if (wantedRole === 'side') {
      const main = currentItems.find(item => item.key === 'main')?.recipe;
      const mainProfile = main ? profiles.get(main.id) : null;
      if (mainProfile && menuPairPenalty(mainProfile, profile, theme) >= 35) return false;
    }
    return true;
  };
  const candidates = leaves
    .filter(allowed)
    .map(recipe => {
      const items = currentItems.map((item, index) => index === targetIndex ? { ...item, recipe } : item);
      return {
        recipe,
        items,
        score: menuBalanceScore(items, profiles, theme)
      };
    })
    .sort((a, b) => b.score - a.score || a.recipe.title.localeCompare(b.recipe.title, 'fr', { sensitivity: 'base' }));
  if (!candidates.length) return menu;
  const selected = candidates[(Math.max(1, bump) - 1) % Math.min(candidates.length, 24)];
  const signature = menuSignature(selected.items);
  return {
    theme,
    reason: menuLeadReason(selected.items, profiles, theme),
    quality: Math.max(0, Math.min(100, Math.round(62 + selected.score / 18))),
    signature,
    items: annotateMenuItems(selected.items, profiles, theme)
  };
}

function buildMenuSuggestionWithOverrides(recipes, offset = 0, themeId = 'bistrot', recentMenuSignatures = [], itemOffsets = {}) {
  return Object.entries(itemOffsets)
    .filter(([, bump]) => Number(bump) > 0)
    .sort(([left], [right]) => Number(left) - Number(right))
    .reduce(
      (currentMenu, [index, bump]) => buildMenuItemReplacement(currentMenu, recipes, themeId, Number(index), Number(bump)),
      buildMenuSuggestion(recipes, offset, themeId, recentMenuSignatures)
    );
}

function menuRecipeStepText(recipe) {
  return normalizeText([
    recipe?.title,
    ...(recipe?.steps || []),
    ...(recipe?.notes || []),
    ...(recipe?.tags || [])
  ].join(' '));
}

function buildMenuTimeline(recipes) {
  const groups = [
    { key: 'advance', label: 'À faire en avance', items: [] },
    { key: 'start', label: 'Démarrer le repas', items: [] },
    { key: 'parallel', label: 'Pendant les cuissons', items: [] },
    { key: 'finish', label: 'Dernière minute', items: [] }
  ];
  recipes.forEach(recipe => {
    const text = menuRecipeStepText(recipe);
    const timing = getRecipeTiming(recipe);
    if (/\b(veille|repos|reposer|refroidir|refrigerateur|réfrigérateur|mariner|conserver|24h)\b/.test(text) || timing.rest >= 60) {
      groups[0].items.push(`${recipe.title} : préparer/refroidir avant le service.`);
    }
    if (/\b(four|prechauffer|préchauffer|mijoter|cuire|frire|poele|poêle)\b/.test(text)) {
      groups[1].items.push(`${recipe.title} : lancer la cuisson principale.`);
    } else {
      groups[1].items.push(`${recipe.title} : préparer les bases et pesées.`);
    }
    if (timing.cook || /\b(four|mijoter|repos|refroidir)\b/.test(text)) {
      groups[2].items.push(`${recipe.title} : profiter du temps mort pour préparer garniture, sauce ou dressage.`);
    }
    if (/\b(servir|dresser|minute|chaud|saler|poivrer|parsemer|zeste|citron|grille|grillé|croustillant)\b/.test(text)) {
      groups[3].items.push(`${recipe.title} : finir et dresser juste avant d’envoyer.`);
    }
  });
  return groups
    .map(group => ({ ...group, items: uniq(group.items).slice(0, 4) }))
    .filter(group => group.items.length);
}

function buildMenuStress(recipes) {
  const timings = recipes.map(getRecipeTiming);
  const totalActive = timings.reduce((sum, timing) => sum + (timing.active || 0), 0);
  const text = normalizeText(recipes.map(menuRecipeStepText).join(' '));
  const equipment = uniq(recipes.flatMap(getRecipeEquipment));
  let points = 0;
  if (totalActive > 120) points += 2;
  else if (totalActive > 80) points += 1;
  if (/\b(frire|friture|tempura|beignet)\b/.test(text)) points += 2;
  if (/\b(four)\b/.test(text) && /\b(poele|poêle|casserole|mijoter)\b/.test(text)) points += 1;
  if (/\b(minute|immediatement|immédiatement|croustillant)\b/.test(text)) points += 1;
  if (equipment.length >= 5) points += 1;
  const level = points >= 5 ? 'Intense' : points >= 3 ? 'Moyen' : 'Tranquille';
  const reasons = [
    totalActive ? `${formatMinutesShort(totalActive)} actif cumulé` : '',
    /\b(frire|friture|tempura|beignet)\b/.test(text) ? 'friture ou croustillant minute' : '',
    equipment.length >= 5 ? `${equipment.length} matériels à sortir` : '',
    /\b(four)\b/.test(text) && /\b(poele|poêle|casserole|mijoter)\b/.test(text) ? 'cuissons à coordonner' : ''
  ].filter(Boolean);
  return { level, reasons };
}

function buildMenuShoppingHints(shoppingData) {
  const freshPattern = /\b(citron|salade|tomate|herbe|basilic|persil|menthe|poisson|saumon|cabillaud|crevette|mozzarella|creme|crème|oeuf|œuf|viande|poulet|porc|boeuf|bœuf)\b/;
  const pantryPattern = /\b(sel|poivre|huile|farine|sucre|riz|pates|pâtes|moutarde|vinaigre|epice|épice|miel|chocolat|levure)\b/;
  const critical = shoppingData.groupedItems
    .filter(item => freshPattern.test(normalizeText(item.name)))
    .slice(0, 5)
    .map(item => item.name);
  const pantry = shoppingData.groupedItems
    .filter(item => pantryPattern.test(normalizeText(item.name)))
    .slice(0, 5)
    .map(item => item.name);
  return [
    critical.length && { label: 'À acheter frais', items: critical },
    pantry.length && { label: 'Placard à vérifier', items: pantry },
    shoppingData.aisleGroups.length && { label: 'Rayons principaux', items: shoppingData.aisleGroups.slice(0, 4).map(group => group.label) }
  ].filter(Boolean);
}

function buildMenuLeftovers(recipes, shoppingData) {
  const ingredientNames = shoppingData.groupedItems.map(item => normalizeText(item.name)).join(' ');
  const ideas = [];
  if (/\b(citron|lime)\b/.test(ingredientNames)) ideas.push('Citron restant : vinaigrette, marinade express ou zestes sur un dessert.');
  if (/\b(creme|crème|mascarpone|fromage)\b/.test(ingredientNames)) ideas.push('Crème/fromage restant : sauce minute, gratin ou tartine chaude.');
  if (/\b(tomate|salade|herbe|basilic|persil|menthe)\b/.test(ingredientNames)) ideas.push('Herbes/légumes frais : salade du lendemain ou garniture de sandwich.');
  if (/\b(riz|pomme de terre|pates|pâtes|pain)\b/.test(ingredientNames)) ideas.push('Féculent restant : poêlée rapide, croquettes ou bol repas.');
  if (recipes.some(recipe => getRecipeTiming(recipe).active > 30)) ideas.push('Prévoir une portion en plus du plat principal pour un repas simple le lendemain.');
  return uniq(ideas).slice(0, 4);
}

function buildMenuServiceTips(recipes) {
  return recipes.map(recipe => {
    const text = menuRecipeStepText(recipe);
    let tip = 'Servir en portion nette, avec l’élément chaud envoyé en dernier.';
    if (/\b(sauce|jus|creme|crème|yaourt)\b/.test(text)) tip = 'Servir la sauce à part ou napper au dernier moment.';
    if (/\b(salade|froid|melon|gazpacho|gaspacho)\b/.test(text)) tip = 'Servir bien frais, assiette froide si possible.';
    if (/\b(frite|croustillant|tempura|beignet|frire)\b/.test(text)) tip = 'Envoyer aussitôt pour garder le croustillant.';
    if (/\b(tarte|cake|cookies|tiramisu|macaron|dessert)\b/.test(text)) tip = 'Sortir avant service si besoin pour retrouver la bonne texture.';
    return { title: recipe.title, tip };
  }).slice(0, 5);
}

function buildMenuEquipmentConflicts(recipes) {
  const rows = recipes.map(recipe => ({
    recipe,
    text: menuRecipeStepText(recipe),
    equipment: getRecipeEquipment(recipe)
  }));
  const conflicts = [];
  const ovenRecipes = rows.filter(row => /\b(four|prechauffer|préchauffer)\b/.test(row.text));
  const fryRecipes = rows.filter(row => /\b(frire|friture|tempura|beignet)\b/.test(row.text));
  const panRecipes = rows.filter(row => /\b(poele|poêle|saisir|mijoter|casserole)\b/.test(row.text));
  if (ovenRecipes.length > 1) conflicts.push(`Four partagé : ${ovenRecipes.map(row => row.recipe.title).join(', ')}.`);
  if (fryRecipes.length) conflicts.push(`Friture minute à isoler : ${fryRecipes.map(row => row.recipe.title).join(', ')}.`);
  if (panRecipes.length >= 2) conflicts.push(`Feux/poêles à coordonner : ${panRecipes.map(row => row.recipe.title).join(', ')}.`);
  const equipmentCounts = new Map();
  rows.flatMap(row => row.equipment).forEach(item => {
    equipmentCounts.set(item, (equipmentCounts.get(item) || 0) + 1);
  });
  [...equipmentCounts.entries()].filter(([, count]) => count > 1).slice(0, 2).forEach(([item, count]) => {
    conflicts.push(`${item} utilisé sur ${count} recettes.`);
  });
  return conflicts.length ? conflicts.slice(0, 5) : ['Aucun conflit matériel évident.'];
}

function buildMenuServicePlan(recipes, shoppingData) {
  return {
    timeline: buildMenuTimeline(recipes),
    stress: buildMenuStress(recipes),
    shoppingHints: buildMenuShoppingHints(shoppingData),
    leftovers: buildMenuLeftovers(recipes, shoppingData),
    serviceTips: buildMenuServiceTips(recipes),
    conflicts: buildMenuEquipmentConflicts(recipes)
  };
}

function getBatchPlanData(recipes) {
  const allSteps = recipes.flatMap(recipe => getRecipeSteps(recipe).map(step => ({ recipe, step, text: normalizeText(step) })));
  const combinedText = normalizeText(recipes.map(recipe => [
    recipe.title,
    ...(recipe.ingredients || []).flatMap(group => [group.group, ...(group.items || [])]),
    ...(recipe.steps || [])
  ].join(' ')).join(' '));
  const sharedPrep = [
    /\b(citron|zeste|jus de citron|lime)\b/.test(combinedText) && 'Zester/presser tous les citrons en une fois, puis garder zestes et jus séparés.',
    /\b(oeuf|œuf|oeufs|œufs|jaune|blanc)\b/.test(combinedText) && 'Casser ou cuire les œufs groupés, en séparant jaunes/blancs si besoin.',
    /\b(persil|basilic|menthe|ciboulette|herbes)\b/.test(combinedText) && 'Laver, sécher et hacher toutes les herbes au même moment.',
    /\b(oignon|echalote|échalote|ail)\b/.test(combinedText) && 'Éplucher et tailler ail/oignons/échalotes avant de lancer les cuissons.',
    /\bbeurre\b/.test(combinedText) && 'Sortir le beurre nécessaire au début si une texture pommade ou souple est utile.',
    /\bfour|enfourner|prechauffer|préchauffer\b/.test(combinedText) && 'Préchauffer le four avant la mise en place chaude.'
  ].filter(Boolean);
  return [
    {
      key: 'prep',
      label: 'Mise en place',
      items: [
        `${recipes.length} fiche${recipes.length > 1 ? 's' : ''} \u00e0 pr\u00e9parer`,
        `${recipes.reduce((sum, recipe) => sum + countIngredients(recipe), 0)} lignes d'ingr\u00e9dients \u00e0 v\u00e9rifier`
      ]
    },
    {
      key: 'shared',
      label: 'Gestes groupés',
      items: sharedPrep
    },
    {
      key: 'cold',
      label: 'Froid / repos',
      items: allSteps
        .filter(item => /\b(repos|reposer|froid|refrigerateur|refroidir|mariner|pousse|lever)\b/.test(item.text))
        .slice(0, 4)
        .map(item => `${item.recipe.title} : ${stripHtml(item.step)}`)
    },
    {
      key: 'cook',
      label: 'Cuissons',
      items: allSteps
        .filter(item => /\b(cuire|cuisson|four|enfourner|frire|poele|mijoter|griller|rotir|saisir)\b/.test(item.text))
        .slice(0, 5)
        .map(item => `${item.recipe.title} : ${stripHtml(item.step)}`)
    },
    {
      key: 'finish',
      label: 'Finitions',
      items: allSteps
        .filter(item => /\b(servir|dresser|finir|zeste|saupoudrer|napper|decore|garnir)\b/.test(item.text))
        .slice(0, 4)
        .map(item => `${item.recipe.title} : ${stripHtml(item.step)}`)
    }
  ].filter(group => group.items.length);
}

function formatRemaining(ms) {
  const seconds = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(rest).padStart(2, '0')}`;
}

function getRecipeSearchText(recipe, tags, recipesById = {}) {
  const ingredients = (recipe.ingredients || [])
    .flatMap(group => [group.group, ...(group.items || [])])
    .join(' ');
  const practicalText = getRecipePracticalSections(recipe)
    .flatMap(section => [section.title, ...section.items])
    .join(' ');
  const linkedText = getLinkedRecipeRefs(recipe, recipesById)
    .flatMap(item => [item.role, item.recipe.title, ...(item.recipe.tags || [])])
    .join(' ');
  const facets = getRecipeSearchFacets(recipe).join(' ');
  const intents = getRecipeIntentLabels(recipe, recipesById).join(' ');
  const timing = getRecipeTiming(recipe);
  const timingText = [
    timing.active && `actif ${formatMinutesShort(timing.active)}`,
    timing.cook && `cuisson ${formatMinutesShort(timing.cook)}`,
    timing.rest && `repos ${formatMinutesShort(timing.rest)}`,
    ...getRecipeCardBadges(recipe, recipesById)
  ].filter(Boolean).join(' ');
  const variantsText = (recipe.variants || [])
    .map(variant => recipesById[variant.id])
    .filter(Boolean)
    .map(variantRecipe => getRecipeSearchText(variantRecipe, variantRecipe.tags || [], recipesById))
    .join(' ');
  return normalizeText([
    recipe.title,
    recipe.yield,
    recipe.difficulty,
    ...(recipe.aliases || []),
    ...(recipe.categories || []),
    ...(recipe.seasons || []),
    ...tags,
    ...(recipe.variants || []).flatMap(variant => [variant.id, variant.label]),
    ingredients,
    facets,
    intents,
    timingText,
    practicalText,
    linkedText,
    ...(recipe.steps || []),
    ...(recipe.notes || []),
    variantsText
  ].join(' '));
}

const SEARCH_SYNONYMS = {
  mayo: ['mayonnaise'],
  mayonaise: ['mayonnaise'],
  sauce: ['dip', 'assaisonnement', 'condiment'],
  sauces: ['dip', 'assaisonnement', 'condiment'],
  dessert: ['sucré', 'sucre', 'gâteau', 'cake', 'biscuit'],
  gateau: ['gâteau', 'cake', 'dessert'],
  gâteau: ['gateau', 'cake', 'dessert'],
  biscuit: ['cookies', 'sablé', 'goûter'],
  biscuits: ['cookies', 'sablés', 'goûter'],
  cookie: ['cookies', 'biscuit'],
  cookies: ['cookie', 'biscuit'],
  patate: ['pomme de terre', 'pommes de terre', 'pdt'],
  patates: ['pomme de terre', 'pommes de terre', 'pdt'],
  pdt: ['pomme de terre', 'pommes de terre', 'patate'],
  pomme: ['pommes', 'pomme de terre'],
  terre: ['pomme de terre', 'pommes de terre'],
  fritte: ['frite', 'frites'],
  frite: ['frites', 'pomme de terre'],
  frites: ['frite', 'pomme de terre'],
  reste: ['restes', 'anti gaspillage', 'fond de frigo'],
  restes: ['reste', 'anti gaspillage', 'fond de frigo'],
  frigo: ['refrigerateur', 'froid', 'reste'],
  placard: ['simple', 'rapide', 'base'],
  soir: ['diner', 'rapide', 'familial'],
  diner: ['soir', 'plat', 'familial'],
  semaine: ['rapide', 'organisation', 'familial'],
  batch: ['organisation', 'la veille', 'a preparer a l avance'],
  airfryer: ['air fryer', 'four', 'croustillant'],
  plancha: ['poele', 'saisir', 'griller'],
  barbecue: ['griller', 'gril', 'ete'],
  bbq: ['barbecue', 'griller'],
  accompagnement: ['accompagnements', 'garniture'],
  garniture: ['accompagnement', 'topping'],
  topping: ['garniture', 'sauce'],
  toppings: ['garniture', 'sauces'],
  crevette: ['crevettes', 'gambas'],
  crevettes: ['crevette', 'gambas'],
  calamar: ['calamars', 'encornet'],
  calamars: ['calamar', 'encornets'],
  oeuf: ['œuf', 'oeufs', 'œufs'],
  oeufs: ['œufs', 'oeuf', 'œuf'],
  pate: ['pâte', 'pâtes', 'base'],
  pates: ['pâtes', 'pâte', 'farine'],
  base: ['bases', 'pâte', 'fond'],
  citronne: ['citron'],
  citronné: ['citron'],
  citronnee: ['citron'],
  choco: ['chocolat'],
  chocolat: ['choco', 'noir', 'lait'],
  chilli: ['chili'],
  chili: ['chilli', 'piment'],
  crisp: ['croustillant', 'piment'],
  croquant: ['croustillant', 'texture'],
  croustillant: ['croquant', 'crisp', 'friture'],
  moelleux: ['fondant', 'tendre', 'texture'],
  fondant: ['moelleux', 'cremeux', 'texture'],
  cremeux: ['creme', 'fondant', 'texture'],
  leger: ['aerien', 'frais', 'light', 'sain'],
  frais: ['leger', 'froid', 'citron', 'acidule'],
  sain: ['leger', 'vegetarien'],
  acidule: ['citron', 'vinaigre', 'frais'],
  epice: ['piment', 'chili', 'releve'],
  releve: ['epice', 'piment'],
  aerien: ['leger', 'mousseux'],
  fourre: ['garni', 'coeur', 'insert'],
  garni: ['fourre', 'garniture'],
  garnie: ['fourre', 'garniture'],
  facile: ['easy', 'simple', 'débutant'],
  simple: ['easy', 'facile'],
  rapide: ['express', 'vite'],
  express: ['rapide', 'vite'],
  veille: ['avance', 'repos', 'make ahead'],
  lendemain: ['veille', 'avance', 'repos'],
  avance: ['préparer à l avance', 'la veille', 'make ahead'],
  preparer: ['préparer', 'préparation', 'avance'],
  sanscuisson: ['sans cuisson', 'froid'],
  froid: ['réfrigérateur', 'sans cuisson'],
  chaud: ['cuisson', 'four', 'poêle'],
  cuisson: ['four', 'poêle', 'friture'],
  four: ['enfourner', 'rôtir', 'gratin'],
  poele: ['poêle', 'saisir', 'faire revenir'],
  poêle: ['poele', 'saisir', 'faire revenir'],
  friture: ['frire', 'beignet', 'tempura', 'frites'],
  legumes: ['légumes', 'vegetal', 'végétal'],
  legume: ['légume', 'légumes'],
  chou: ['chou-fleur', 'chou fleur', 'brocoli'],
  fleur: ['chou-fleur', 'chou fleur'],
  choufleur: ['chou-fleur', 'chou fleur'],
  brocoli: ['brocolis', 'sommités', 'fleurettes'],
  sommites: ['sommités', 'fleurettes', 'petits bouquets'],
  fleurettes: ['sommités', 'petits bouquets'],
  vegetariens: ['végétarien', 'vegetarien'],
  vegetarien: ['végétarien', 'sans viande'],
  viande: ['boeuf', 'porc', 'poulet'],
  boeuf: ['bœuf', 'viande'],
  poulet: ['volaille', 'viande'],
  congelable: ['congélation', 'congeler'],
  moyen: ['medium', 'intermédiaire'],
  difficile: ['hard', 'technique'],
  technique: ['geste', 'tour de main'],
  blanchir: ['blanchi', 'blanchiment'],
  chemiser: ['moule', 'papier cuisson'],
  torrefier: ['torréfier', 'torréfié'],
  deglacer: ['déglacer', 'sucs', 'sauce'],
  ruban: ['macaronner', 'texture ruban'],
  ete: ['été'],
  hiver: ['automne', 'réconfort'],
  familial: ['plat', 'four', 'gratin'],
  aperitif: ['apero', 'apéro'],
  apero: ['apéro', 'aperitif'],
  entree: ['entrée', 'entrées'],
  entrees: ['entrées', 'entrée'],
  petitdej: ['petit-déjeuner', 'petits-déjeuners'],
  brunch: ['petit-déjeuner', 'petits-déjeuners']
};

const SEARCH_STOPWORDS = new Set(['a', 'au', 'aux', 'avec', 'd', 'de', 'des', 'du', 'en', 'et', 'la', 'le', 'les', 'l', 'pour', 'un', 'une']);

function searchTokens(value) {
  return normalizeText(value)
    .replace(/\bsans\s+cuisson\b/g, 'sanscuisson')
    .replace(/\bla\s+veille\b/g, 'veille')
    .replace(/\bair\s+fryer\b/g, 'airfryer')
    .replace(/\bfond\s+de\s+frigo\b/g, 'frigo')
    .replace(/\bsoir\s+de\s+semaine\b/g, 'semaine')
    .replace(/\bchou\s+fleur\b/g, 'choufleur')
    .replace(/\bpomme\s+de\s+terre\b/g, 'pdt')
    .split(/\s+/)
    .map(token => token.replace(/[^a-z0-9-]/g, '').trim())
    .filter(token => token.length > 1 && !SEARCH_STOPWORDS.has(token));
}

function expandSearchTokens(tokens) {
  return tokens.map(token => [token, ...(SEARCH_SYNONYMS[token] || []).map(normalizeText)]);
}

function isCloseSearchToken(token, text) {
  if (token.length < 4) return false;
  const words = text.match(/[a-z0-9]{4,}/g) || [];
  return words.some(word => {
    if (word.includes(token) || token.includes(word)) return true;
    if (word.length === token.length) {
      for (let index = 0; index < token.length - 1; index += 1) {
        if (
          token[index] === word[index + 1] &&
          token[index + 1] === word[index] &&
          token.slice(0, index) === word.slice(0, index) &&
          token.slice(index + 2) === word.slice(index + 2)
        ) return true;
      }
    }
    if (Math.abs(word.length - token.length) > 1) return false;
    let edits = 0;
    for (let index = 0; index < Math.min(word.length, token.length); index += 1) {
      if (word[index] !== token[index]) edits += 1;
      if (edits > 1) return false;
    }
    return edits + Math.abs(word.length - token.length) <= 1;
  });
}

function scoreRecipeSearch(recipe, query, recipesById = {}) {
  const needle = normalizeText(query).trim();
  if (!needle) return { score: 0, reasons: [] };
  const tokenGroups = expandSearchTokens(searchTokens(needle));
  if (!tokenGroups.length) return { score: 0, reasons: [] };
  const title = normalizeText(recipe.title);
  const aliases = normalizeText((recipe.aliases || []).join(' '));
  const tags = normalizeText([...(recipe.tags || []), ...(recipe.tagsExtracted || [])].join(' '));
  const categories = normalizeText((recipe.categories || []).join(' '));
  const ingredients = normalizeText((recipe.ingredients || []).flatMap(group => [group.group, ...(group.items || [])]).join(' '));
  const practical = normalizeText(getRecipePracticalSections(recipe).flatMap(section => [section.title, ...section.items]).join(' '));
  const intents = normalizeText(getRecipeIntentLabels(recipe, recipesById).join(' '));
  const facets = normalizeText(getRecipeSearchFacets(recipe).join(' '));
  const badges = normalizeText(getRecipeCardBadges(recipe, recipesById).join(' '));
  const timing = getRecipeTiming(recipe);
  const timingText = normalizeText([
    timing.active && `temps actif ${formatMinutesShort(timing.active)}`,
    timing.cook && `cuisson ${formatMinutesShort(timing.cook)}`,
    timing.rest && `repos ${formatMinutesShort(timing.rest)}`
  ].filter(Boolean).join(' '));
  const linked = normalizeText(getLinkedRecipeRefs(recipe, recipesById).flatMap(item => [item.role, item.recipe.title]).join(' '));
  const steps = normalizeText((recipe.steps || []).join(' '));
  const notes = normalizeText([...(recipe.notes || []), ...(recipe.technical || []).flatMap(item => [item.label, item.value, item.text])].join(' '));
  const fields = [
    { name: 'titre', text: title, points: 120 },
    { name: 'alias', text: aliases, points: 90 },
    { name: 'tag', text: tags, points: 70 },
    { name: 'intention', text: intents, points: 68 },
    { name: 'usage', text: facets, points: 62 },
    { name: 'repere', text: `${badges} ${timingText}`, points: 58 },
    { name: 'catégorie', text: categories, points: 55 },
    { name: 'ingrédient', text: ingredients, points: 45 },
    { name: 'recette liée', text: linked, points: 34 },
    { name: 'pratique', text: practical, points: 28 },
    { name: 'étape', text: steps, points: 24 },
    { name: 'note', text: notes, points: 18 }
  ];
  let score = 0;
  const reasons = new Set();
  const allMatched = tokenGroups.every(group => fields.some(field => group.some(token => field.text.includes(token) || isCloseSearchToken(token, field.text))));
  if (!allMatched) return { score: 0, reasons: [] };
  if (title === needle) score += 220;
  if (title.startsWith(needle)) score += 150;
  fields.forEach(field => {
    tokenGroups.forEach(group => {
      if (group.some(token => field.text.includes(token))) {
        score += field.points;
        reasons.add(field.name);
      } else if (group.some(token => isCloseSearchToken(token, field.text))) {
        score += Math.round(field.points * 0.45);
        reasons.add(`${field.name} proche`);
      }
    });
  });
  return { score, reasons: Array.from(reasons).slice(0, 3) };
}

function extractTags(recipe) {
  const tags = new Set((recipe.tags || []).map(tag => normalizeText(tag)).filter(Boolean));
  const blocked = new Set([
    'avec', 'sans', 'pour', 'dans', 'base', 'sel', 'poivre', 'repos', 'entier', 'entiere',
    'fondu', 'fondue', 'chimique', 'minutes', 'minute', 'grammes', 'gramme', 'cuisson',
    'froid', 'froide', 'chaud', 'chaude', 'recette', 'preparation'
  ]);
  (recipe.ingredients || []).forEach(group => {
    (group.items || []).forEach(item => {
      normalizeText(item).split(/\s+/).forEach(word => {
        const clean = word.replace(/[^a-z0-9]/g, '');
        if (clean.length > 3 && !/\d/.test(clean) && !blocked.has(clean)) {
          tags.add(clean);
        }
      });
    });
  });
  return Array.from(tags).slice(0, 18);
}

function isVariantIngredientGroup(group, groups = [], recipe = null) {
  const label = normalizeText(group?.group || '');
  if (label.includes('base commune') || label === 'base' || label.includes('commun')) return false;
  if (/^\d+\)/.test(label)) return true;
  if (label.startsWith('variante') || label.startsWith('version') || label.startsWith('option')) return true;
  if (recipe?.variantGroups) return true;
  return false;
}

function buildInlineRecipeTargets(recipes) {
  const aliasesByTerm = new Map();
  const forbiddenInlineTerms = new Set([
    'base',
    'plat',
    'plats',
    'sauce',
    'sauces',
    'recette',
    'recettes',
    'cuisson',
    'service',
    'conservation'
  ]);
  const add = (term, recipe, type) => {
    const normalized = normalizeText(term).trim();
    if (normalized.length < 4 || !recipe?.id) return;
    if (forbiddenInlineTerms.has(normalized)) return;
    const titleNormalized = normalizeText(recipe.title || '');
    const priority = type === 'title' ? 0 : titleNormalized.includes(normalized) ? 1 : 2;
    const target = { term, normalized, id: recipe.id, priority };
    const existing = aliasesByTerm.get(normalized);
    if (!existing || priority < existing.priority) aliasesByTerm.set(normalized, target);
  };
  recipes.forEach(recipe => {
    if (isMasterRecipe(recipe)) return;
    add(recipe.title, recipe, 'title');
    (recipe.aliases || []).forEach(alias => add(alias, recipe, 'alias'));
  });
  return Array.from(aliasesByTerm.values()).sort((a, b) => {
    const length = b.normalized.length - a.normalized.length;
    if (length) return length;
    return a.priority - b.priority;
  });
}

function buildTechniqueTargets() {
  const targets = [];
  const seen = new Set();
  const add = (term, id, title) => {
    const normalized = normalizeText(term).trim();
    if (normalized.length < 5 || seen.has(normalized)) return;
    seen.add(normalized);
    targets.push({ term, normalized, id, title });
  };
  SORTED_TECHNIQUE_GUIDES.forEach(technique => {
    add(technique.title, technique.id, technique.title);
    (technique.aliases || []).forEach(alias => add(alias, technique.id, technique.title));
  });
  return targets.sort((a, b) => b.normalized.length - a.normalized.length);
}

function isLinkedTextBoundary(char) {
  return !char || !/[a-z0-9]/.test(char);
}

function buildNormalizedIndexMap(value) {
  let normalized = '';
  const indexMap = [];
  for (let index = 0; index < value.length; index += 1) {
    const normalizedChar = normalizeText(value[index]);
    for (let charIndex = 0; charIndex < normalizedChar.length; charIndex += 1) {
      normalized += normalizedChar[charIndex];
      indexMap.push(index);
    }
  }
  return { normalized, indexMap };
}

function findLinkedTextMatch(value, targets) {
  const { normalized, indexMap } = buildNormalizedIndexMap(value);
  for (const target of targets) {
    let index = normalized.indexOf(target.normalized);
    while (index !== -1) {
      const end = index + target.normalized.length;
      if (isLinkedTextBoundary(normalized[index - 1]) && isLinkedTextBoundary(normalized[end])) {
        return {
          target,
          index: indexMap[index] ?? 0,
          end: end >= indexMap.length ? value.length : indexMap[end]
        };
      }
      index = normalized.indexOf(target.normalized, index + 1);
    }
  }
  return null;
}

function polishDisplayText(value) {
  return String(value || '')
    .replace(/\bPrechauffer\b/g, 'Préchauffer')
    .replace(/\bDetailler\b/g, 'Détailler')
    .replace(/\bEtaler\b/g, 'Étaler')
    .replace(/\bRotir\b/g, 'Rôtir')
    .replace(/\bGouter\b/g, 'Goûter')
    .replace(/\bEgoutter\b/g, 'Égoutter')
    .replace(/\bReduire\b/g, 'Réduire')
    .replace(/\bReserver\b/g, 'Réserver')
    .replace(/\bpoele\b/g, 'poêle')
    .replace(/\bechalote\b/g, 'échalote')
    .replace(/\blegumes\b/g, 'légumes')
    .replace(/\blegume\b/g, 'légume')
    .replace(/\bepices\b/g, 'épices')
    .replace(/\bjusqu a\b/g, 'jusqu’à')
    .replace(/\b([DdLlMmNnSsTt]) (?=[aeiouhàâäéèêëîïôöùûüAEIOUHÀÂÄÉÈÊËÎÏÔÖÙÛÜ])/g, '$1’')
    .replace(/\b([Cc]) (?=est\b|était\b|etaient\b|étaient\b|étais\b|etait\b)/g, '$1’')
    .replace(/\b([Qq]u) (?=[aeiouhàâäéèêëîïôöùûüAEIOUHÀÂÄÉÈÊËÎÏÔÖÙÛÜ])/g, '$1’')
    .replace(/\b(jusqu|lorsqu|puisqu) (?=[aeiouhàâäéèêëîïôöùûüAEIOUHÀÂÄÉÈÊËÎÏÔÖÙÛÜ])/gi, '$1’')
    .replace(/\ba l’/g, 'à l’')
    .replace(/\bA l’/g, 'À l’')
    .replace(/\bd Espelette\b/g, 'd’Espelette')
    .replace(/\baujourd hui\b/g, 'aujourd’hui')
    .replace(/\ba mi-cuisson\b/g, 'à mi-cuisson')
    .replace(/\ba coeur\b/g, 'à cœur')
    .replace(/\bau coeur\b/g, 'au cœur')
    .replace(/\bcoeur\b/g, 'cœur')
    .replace(/\b(\d{3})C\b/g, '$1°C');
}

function renderLinkedText(text, targets, openRecipe, techniqueTargets = [], openTechnique = null) {
  const value = polishDisplayText(text);
  const explicitLinkPattern = /<span\s+data-goto=(["'])([^"']+)\1[^>]*>(.*?)<\/span>/i;
  const explicitMatch = value.match(explicitLinkPattern);
  if (explicitMatch) {
    const [full, , id, label] = explicitMatch;
    const index = value.indexOf(full);
    return h(React.Fragment, null,
      renderLinkedText(value.slice(0, index), targets, openRecipe, techniqueTargets, openTechnique),
      h('button', {
        type: 'button',
        className: 'inline-recipe-link',
        onClick: event => {
          event.preventDefault();
          event.stopPropagation();
          openRecipe(id);
        }
      }, label.replace(/<[^>]+>/g, '')),
      renderLinkedText(value.slice(index + full.length), targets, openRecipe, techniqueTargets, openTechnique)
    );
  }
  const targetMatch = findLinkedTextMatch(value, targets);
  const techniqueMatch = openTechnique ? findLinkedTextMatch(value, techniqueTargets) : null;
  if (!targetMatch && !techniqueMatch) return value;
  const targetIndex = targetMatch ? targetMatch.index : Number.POSITIVE_INFINITY;
  const techniqueIndex = techniqueMatch ? techniqueMatch.index : Number.POSITIVE_INFINITY;
  const isTechnique = Boolean(techniqueMatch) && techniqueIndex < targetIndex;
  const chosen = isTechnique ? techniqueMatch.target : targetMatch.target;
  const index = isTechnique ? techniqueMatch.index : targetIndex;
  const end = isTechnique ? techniqueMatch.end : targetMatch.end;
  const label = value.slice(index, end) || chosen.term;
  return h(React.Fragment, null,
    renderLinkedText(value.slice(0, index), targets, openRecipe, techniqueTargets, openTechnique),
    h('button', {
      type: 'button',
      className: isTechnique ? 'inline-technique-link' : 'inline-recipe-link',
      title: isTechnique ? `Voir la technique : ${chosen.title}` : undefined,
      onClick: event => {
        event.preventDefault();
        event.stopPropagation();
        if (isTechnique) openTechnique(chosen.id);
        else openRecipe(chosen.id);
      }
    }, label),
    renderLinkedText(value.slice(end), targets, openRecipe, techniqueTargets, openTechnique)
  );
}

function asTextList(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(item => stripHtml(item)).filter(Boolean);
  return [stripHtml(value)].filter(Boolean);
}

function compactPracticalItems(key, items) {
  if (key !== 'storage') return items;
  const hasSpecificStorage = items.some(item => /^(?:avant cuisson|avant service|avant préparation|après cuisson|après préparation|conservation|stockage optimal)\b/i.test(stripHtml(item)));
  if (!hasSpecificStorage) return items;
  return items.filter(item => {
    const text = stripHtml(item);
    return !(/^stockage\s*:/i.test(text) && /\bp[eé]remption\b/i.test(text));
  });
}

function inferEquipment(recipe) {
  const text = normalizeText([
    recipe?.title,
    ...(recipe?.ingredients || []).flatMap(group => [group.group, ...(group.items || [])]),
    ...(recipe?.steps || []),
    ...(recipe?.notes || [])
  ].join(' '));
  const items = [];
  if (/\b(friture|frire|huile a 180|180c|180 c|bain d huile|tempura|beignet)\b/.test(text)) {
    items.push('Casserole ou sauteuse haute', 'Thermomètre de cuisson', 'Grille d’égouttage');
  }
  if (/\b(four|enfourner|gril|plaque)\b/.test(text)) items.push('Four', 'Plaque ou plat de cuisson');
  if (/\b(mixer|mixeur|blender)\b/.test(text)) items.push('Mixeur ou blender');
  if (/\b(mortier|piler)\b/.test(text)) items.push('Mortier');
  if (/\b(fouetter|fouet|emulsion|monter avec l huile)\b/.test(text)) items.push('Fouet');
  if (/\b(poche|pocher|douille)\b/.test(text)) items.push('Poche à douille');
  return uniq(items).slice(0, 4);
}

function getRecipeEquipment(recipe) {
  const practical = recipe?.practical || {};
  return uniq([
    ...asTextList(recipe?.equipment || practical.equipment),
    ...inferEquipment(recipe)
  ]).slice(0, 8);
}

function getRecipeConservationText(recipe) {
  return normalizeText([
    recipe?.title,
    ...(recipe?.categories || []),
    ...(recipe?.tags || []),
    ...(recipe?.aliases || []),
    ...(recipe?.ingredients || []).flatMap(group => [group.group, ...(group.items || [])]),
    ...(recipe?.steps || [])
  ].map(stripHtml).join(' '));
}

function inferRecipeConservation(recipe) {
  const titleText = normalizeText([
    recipe?.title,
    ...(recipe?.categories || []),
    ...(recipe?.tags || []),
    ...(recipe?.aliases || [])
  ].map(stripHtml).join(' '));
  const ingredientText = normalizeText((recipe?.ingredients || [])
    .flatMap(group => [group.group, ...(group.items || [])])
    .map(stripHtml)
    .join(' '));
  const stepText = normalizeText((recipe?.steps || []).map(stripHtml).join(' '));
  const text = getRecipeConservationText(recipe);
  const categories = normalizeText((recipe?.categories || []).join(' '));
  const cooked = /\b(cuire|cuisson|cuit|cuite|frire|friture|four|enfourner|poele|saisir|mijoter|fremir|bouillir|chauffer|rotir|griller|pocher|carameliser|bain marie)\b/.test(stepText);
  const fried = /\b(friture|frire|frit|frites|tempura|beignet|bain d huile|huile de friture)\b/.test(text);
  const seafood = /\b(calamar|calamars|crevette|crevettes|moule|moules|poisson|saumon|crustace|crustaces)\b/.test(ingredientText);
  const meat = /\b(porc|poulet|boeuf|viande|cotelette|cotelettes|jambon|lardon|lardons|bacon)\b/.test(ingredientText);
  const egg = /\b(oeuf|oeufs|jaune|jaunes|blanc|blancs)\b/.test(ingredientText);
  const dairy = /\b(lait|creme|cremes|beurre|fromage|parmesan|cheddar|mozzarella|mascarpone|yaourt|chantilly)\b/.test(ingredientText);
  const rawEggSauce = /\b(mayonnaise|aioli|aïoli|rouille)\b/.test(titleText);
  const cream = /\b(creme|cremes|chantilly|patissiere|diplomate|mascarpone|mornay|ganache)\b/.test(titleText) || /\b(creme|cremes|chantilly|mascarpone|ganache)\b/.test(ingredientText);
  const coldFresh = /\b(salade|crudite|crudites|gaspacho|gazpacho|mojito|tartare|soupe froide)\b/.test(titleText);
  const coulisOrFruitSauce = /\b(coulis|marmelade|compote|fruit|fruits|fraise|framboise|abricot|poire|citron)\b/.test(text) && /\b(sucre|jus de citron|mixer|flacon|pot)\b/.test(text);
  const dough = /\b(pate|pates|farine|levure|petrir|abaisser|foncer|pointage|pousse|repos)\b/.test(text);
  const minuteBatter = /\b(tempura|pate legere|pate a beignet|pate beignet)\b/.test(text);
  const bread = /\b(pain|pains|bun|buns|burger|hot dog|brioche)\b/.test(titleText);
  const dryBaked = /\b(cookie|cookies|biscuit|biscuits|craquelin|meringue|meringues|macaron|cake|sable|sables)\b/.test(titleText);
  const hotSauce = categories.includes('sauces') && cooked && !rawEggSauce;
  const items = [];

  if (seafood || meat) {
    items.push(`Avant cuisson : garde ${seafood ? 'poisson, crustacés ou calamars' : 'viande'} au réfrigérateur à 0–4°C, couvert, et sors seulement la quantité nécessaire juste avant cuisson.`);
    if (/\b(marinade|mariner|marin[ée]e?)\b/.test(text)) {
      items.push('Avant cuisson : marinade toujours couverte au froid ; jette la marinade qui a touché le cru, ou fais-la bouillir si elle doit servir de sauce.');
    }
  } else if (minuteBatter) {
    items.push('Avant cuisson : prépare la pâte au dernier moment et garde les liquides très froids ; une pâte tempura ou beignet se conserve mal une fois mélangée.');
  } else if (dough && cooked) {
    items.push('Avant cuisson : si la pâte doit attendre, couvre-la au contact ou filme-la et garde-la au réfrigérateur ; laisse-la revenir selon la recette avant cuisson.');
  } else if (cream || rawEggSauce) {
    items.push('Avant service : garde la préparation au réfrigérateur à 0–4°C et sors-la seulement pour le montage ou le dressage.');
  } else if (coldFresh) {
    items.push('Avant service : garde les éléments lavés, coupés ou mixés au froid, couverts ; ajoute herbes, assaisonnement et garnitures fragiles au dernier moment.');
  }

  if (rawEggSauce) {
    items.push('Après préparation : pot propre fermé au réfrigérateur à 0–4°C, 24h maximum ; utilise une cuillère propre et jette si odeur, texture ou couleur change.');
  } else if (seafood) {
    items.push(fried
      ? 'Après cuisson : meilleur immédiatement ; restes refroidis vite, boîte hermétique au réfrigérateur 24h, réchauffage au four ou air fryer pour limiter la perte de croustillant.'
      : 'Après cuisson : refroidis en moins de 2h, conserve au réfrigérateur en boîte hermétique 24–48h, puis réchauffe à cœur ou consomme bien froid.');
  } else if (meat) {
    items.push('Après cuisson : refroidis en moins de 2h, conserve en boîte hermétique au réfrigérateur 2–3 jours, puis réchauffe à cœur.');
  } else if (minuteBatter) {
    items.push('Après utilisation : ne conserve pas une pâte qui a touché des aliments crus ; jette le reste et prépare une nouvelle pâte pour une autre cuisson.');
  } else if (fried) {
    items.push('Après cuisson : idéalement minute ; les restes se gardent 24h au réfrigérateur et se réchauffent au four chaud ou air fryer, jamais au micro-ondes si tu veux du croustillant.');
  } else if (bread) {
    items.push('Après cuisson : refroidis sur grille, puis garde 24–48h en sachet ou boîte fermée ; congèle bien emballé après refroidissement pour une conservation plus longue.');
  } else if (dryBaked) {
    items.push('Après cuisson : refroidis complètement, puis conserve en boîte hermétique au sec ; passe au réfrigérateur seulement si la garniture contient crème, œufs ou fruits frais.');
  } else if (cream || (egg && dairy)) {
    items.push('Après préparation : refroidis rapidement si la base est chaude, filme au contact ou ferme en boîte propre, puis conserve 24–48h au réfrigérateur.');
  } else if (coldFresh) {
    items.push('Après préparation : couvre et conserve au réfrigérateur 24h maximum ; avec jambon, mozzarella, œuf, poisson ou sauce fraîche, vise plutôt le jour même.');
  } else if (coulisOrFruitSauce) {
    items.push('Après préparation : pot ou flacon propre fermé au réfrigérateur 3–5 jours ; congélation possible en petites portions environ 2 mois.');
  } else if (hotSauce) {
    items.push('Après cuisson : refroidis vite, filme au contact ou ferme en boîte propre, conserve 24–48h au réfrigérateur et réchauffe doucement en fouettant.');
  } else if (cooked) {
    items.push('Après cuisson : refroidis rapidement, conserve en boîte hermétique au réfrigérateur 3–4 jours et réchauffe au four, à la poêle ou doucement selon la texture.');
  } else if (dairy || egg) {
    items.push('Après préparation : conserve au réfrigérateur à 0–4°C en contenant propre fermé et consomme sous 24–48h.');
  } else {
    items.push('Après préparation : conserve couvert dans un contenant propre ; mets au réfrigérateur dès qu’il y a humidité, fruit coupé, sauce ou garniture fraîche.');
  }

  return items;
}

function getRecipePracticalSections(recipe) {
  const practical = recipe?.practical || {};
  const notes = (recipe?.notes || []).map(stripHtml);
  const technical = recipe?.technical || [];
  const sections = [];
  const add = (key, title, items) => {
    const cleanItems = compactPracticalItems(key, uniqInOrder((items || []).map(stripHtml).filter(Boolean)));
    if (cleanItems.length) sections.push({ key, title, items: cleanItems.slice(0, key === 'storage' ? 6 : 4) });
  };

  const isStorageNote = note => (
    /\b(conservation|stockage|p[eé]remption|cong[eé]lation|cong[eè]le)\b/i.test(note)
    || (/\br[eé]frig[eé]rateur\b/i.test(note) && /\b(conserve|garde|consomme|stocke|ferm[eé])\b/i.test(note))
  );
  const isReheatingNote = note => /\b(r[eé]chauff|remettre au four|four doux)\b/i.test(note);
  const storageNotes = notes.filter(isStorageNote);
  const reheatingNotes = notes.filter(note => isReheatingNote(note) && !storageNotes.includes(note));
  const substitutionNotes = notes.filter(note => /\b(remplace|remplacer|substitut|substitution|à défaut|a defaut|sinon|possible avec|variante)\b/i.test(note));
  const noteAlreadyClassified = note => storageNotes.includes(note) || reheatingNotes.includes(note) || substitutionNotes.includes(note);
  const mistakeNotes = notes.filter(note => !noteAlreadyClassified(note) && /\b(ne\s|[ée]vite|attention|trop cuit|trop cuits|surcharge|surveille|sans trop)\b/i.test(note));
  const tipNotes = notes.filter(note => !storageNotes.includes(note) && !reheatingNotes.includes(note) && !mistakeNotes.includes(note) && !substitutionNotes.includes(note));
  const resultTechnical = technical
    .filter(item => /\b(texture|cible|r[eé]sultat)\b/i.test(String(item.label || item.title || '')))
    .map(item => item.value || item.text);

  add('measures', 'Repère indicatif', recipeHasSpoonMeasures(recipe) ? [SPOON_WEIGHT_NOTE] : []);
  add('tips', 'À savoir', [
    ...asTextList(recipe?.tips || practical.tips),
    ...tipNotes
  ]);
  add('substitutions', 'Substitutions', [
    ...asTextList(recipe?.substitutions || practical.substitutions),
    ...substitutionNotes
  ]);
  add('service', 'Service', getRecipeServiceItems(recipe));
  const explicitStorage = [
    ...asTextList(recipe?.storage || practical.storage),
    ...storageNotes
  ];
  add('storage', 'Conservation', [
    ...(explicitStorage.length ? [] : inferRecipeConservation(recipe)),
    ...explicitStorage
  ]);
  add('reheating', 'Réchauffage', [
    ...asTextList(recipe?.reheating || practical.reheating),
    ...reheatingNotes
  ]);
  add('mistakes', 'Erreurs à éviter', [
    ...asTextList(recipe?.mistakes || practical.mistakes),
    ...mistakeNotes
  ]);
  add('result', 'Résultat attendu', [
    ...asTextList(recipe?.result || practical.result),
    ...resultTechnical
  ]);

  return sections;
}

function getPrepTimeline(recipe) {
  const explicitTimeline = asTextList(recipe?.timeline || recipe?.practical?.timeline);
  if (explicitTimeline.length) {
    return explicitTimeline.slice(0, 4).map((item, index) => {
      const parts = String(item).split(/\s*:\s*/);
      if (parts.length > 1) return { label: parts.shift(), value: parts.join(': ') };
      return { label: `Repère ${index + 1}`, value: item };
    });
  }
  return [];
}

function monthlyAdditionDate(item) {
  const added = new Date(`${item.addedAt}T00:00:00`);
  return Number.isNaN(added.getTime()) ? null : added;
}

function monthlyAdditionMonthKey(item) {
  const added = monthlyAdditionDate(item);
  if (!added) return '';
  return added.toLocaleDateString('fr-CA', { timeZone: 'Europe/Paris', year: 'numeric', month: '2-digit' });
}

function isMonthlyAdditionVisible(item, now = new Date()) {
  const added = monthlyAdditionDate(item);
  if (!added) return false;
  const currentMonth = now.toLocaleDateString('fr-CA', { timeZone: 'Europe/Paris', year: 'numeric', month: '2-digit' });
  return added.getTime() <= now.getTime() && monthlyAdditionMonthKey(item) === currentMonth;
}

function getVisibleMonthlyAdditions(items, now = new Date()) {
  const pastItems = items.filter(item => {
    const added = monthlyAdditionDate(item);
    return added && added.getTime() <= now.getTime();
  });
  const currentMonthItems = pastItems.filter(item => isMonthlyAdditionVisible(item, now));
  if (currentMonthItems.length) return currentMonthItems;
  const latestMonth = pastItems
    .map(monthlyAdditionMonthKey)
    .filter(Boolean)
    .sort()
    .pop();
  return latestMonth ? pastItems.filter(item => monthlyAdditionMonthKey(item) === latestMonth) : [];
}

function monthlyAdditionRank(recipe) {
  const item = MONTHLY_ADDITION_BY_ID.get(recipe?.id);
  if (!item) return { time: 0, index: 0 };
  const added = monthlyAdditionDate(item);
  return { time: added ? added.getTime() : 0, index: item.index };
}

function noteKey(value) {
  return normalizeText(stripHtml(value)).replace(/[^a-z0-9]+/g, ' ').trim();
}

function noteCoveredByPracticalSection(note, practicalSections = []) {
  const text = normalizeText(stripHtml(note));
  const hasSection = key => practicalSections.some(section => section.key === key);
  if (hasSection('storage') && /\b(conservation|stockage|peremption|congelation|congele|refrigerateur)\b/.test(text)) return true;
  if (hasSection('reheating') && /\b(rechauff|remettre au four|four doux|vapeur)\b/.test(text)) return true;
  return false;
}

function getDisplayNotes(recipe, practicalSections = []) {
  const practicalKeys = new Set(
    practicalSections
      .flatMap(section => section.items || [])
      .map(noteKey)
      .filter(Boolean)
  );
  const seen = new Set();
  return (recipe?.notes || []).filter(note => {
    const key = noteKey(note);
    if (!key || practicalKeys.has(key) || noteCoveredByPracticalSection(note, practicalSections) || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function getRecipeIngredientText(recipe) {
  return normalizeText((recipe?.ingredients || [])
    .flatMap(group => [group.group, ...(group.items || [])])
    .map(stripHtml)
    .join(' '));
}

function getEggPartUsage(recipe) {
  const text = getRecipeIngredientText(recipe)
    .replace(/\bjaunes?\s+(?:d['’ ]?|de\s+)?oeufs?\s+cuits?\b/g, '')
    .replace(/\bblancs?\s+(?:d['’ ]?|de\s+)?oeufs?\s+cuits?\b/g, '');
  return {
    yolks: /\bjaunes?\s+(?:d['’ ]?|de\s+)?oeufs?\b/.test(text),
    whites: /\bblancs?\s+(?:d['’ ]?|de\s+)?oeufs?\b/.test(text)
  };
}

function getEggWasteRecipeRefs(recipe, recipesById = {}) {
  const usage = getEggPartUsage(recipe);
  if (usage.yolks === usage.whites) return [];

  const wantedPart = usage.yolks ? 'whites' : 'yolks';
  const role = wantedPart === 'whites' ? 'Anti-gaspillage blancs d’œufs' : 'Anti-gaspillage jaunes d’œufs';
  const categoryPriority = wantedPart === 'whites'
    ? { Desserts: 0, Base: 1, Apéro: 2, Sauces: 3 }
    : { Sauces: 0, Base: 1, Apéro: 2, Desserts: 3 };

  return Object.values(recipesById)
    .filter(candidate => {
      if (!candidate?.id || candidate.id === recipe?.id || isMasterRecipe(candidate)) return false;
      const candidateUsage = getEggPartUsage(candidate);
      return wantedPart === 'whites'
        ? candidateUsage.whites && !candidateUsage.yolks
        : candidateUsage.yolks && !candidateUsage.whites;
    })
    .sort((left, right) => {
      const leftPriority = categoryPriority[primaryCategory(left)] ?? 9;
      const rightPriority = categoryPriority[primaryCategory(right)] ?? 9;
      if (leftPriority !== rightPriority) return leftPriority - rightPriority;
      const leftDifficulty = Number.isFinite(left.difficultyScore) ? left.difficultyScore : 99;
      const rightDifficulty = Number.isFinite(right.difficultyScore) ? right.difficultyScore : 99;
      if (leftDifficulty !== rightDifficulty) return leftDifficulty - rightDifficulty;
      return left.title.localeCompare(right.title, 'fr', { sensitivity: 'base' });
    })
    .slice(0, 6)
    .map(candidate => ({ id: candidate.id, role }));
}

function extractRecipeLinkIds(recipe) {
  const text = [
    ...(recipe?.ingredients || []).flatMap(group => [group.group, ...(group.items || []), group.note, ...(group.notes || [])]),
    ...(recipe?.steps || []),
    ...(recipe?.notes || []),
    ...(recipe?.technical || []).flatMap(item => [item.label, item.value, item.text])
  ].join('\n');
  const ids = [];
  for (const match of text.matchAll(/data-goto=\\?["']([^"']+)\\?["']/g)) ids.push(match[1]);
  return ids;
}

function getLinkedRecipeRefs(recipe, recipesById = {}) {
  const refs = [];
  const explicit = Array.isArray(recipe?.linkedRecipes) ? recipe.linkedRecipes : [];
  explicit.forEach(item => {
    if (typeof item === 'string') refs.push({ id: item });
    else if (item?.id) refs.push({ id: item.id, role: item.role || item.label || '' });
  });
  extractRecipeLinkIds(recipe).forEach(id => refs.push({ id }));
  getEggWasteRecipeRefs(recipe, recipesById).forEach(ref => refs.push(ref));

  const seen = new Set();
  return refs
    .filter(ref => {
      if (!ref.id || ref.id === recipe?.id || seen.has(ref.id) || !recipesById[ref.id]) return false;
      seen.add(ref.id);
      return true;
    })
    .map(ref => {
      const linked = recipesById[ref.id];
      const category = primaryCategory(linked);
      return {
        id: ref.id,
        role: ref.role || (category === 'Base' ? 'Base' : category === 'Sauces' ? 'Sauce' : 'Recette liée'),
        recipe: linked
      };
    });
}

function getRecipeWorkflowText(recipe, recipesById = {}) {
  return normalizeText([
    recipe?.title,
    recipe?.yield,
    recipe?.difficulty,
    ...(recipe?.categories || []),
    ...(recipe?.seasons || []),
    ...(recipe?.tags || []),
    ...(recipe?.aliases || []),
    ...(recipe?.ingredients || []).flatMap(group => [group.group, ...(group.items || []), group.note, ...(group.notes || [])]),
    ...(recipe?.steps || []),
    ...(recipe?.notes || []),
    ...(recipe?.technical || []).flatMap(item => [item.label, item.value, item.text]),
    ...getLinkedRecipeRefs(recipe, recipesById).flatMap(item => [item.role, item.recipe.title])
  ].join(' '));
}

function getRecipeWorkflowFlags(recipe, recipesById = {}) {
  const text = getRecipeWorkflowText(recipe, recipesById);
  const steps = getRecipeSteps(recipe);
  const difficultyScore = Number.isFinite(recipe?.difficultyScore)
    ? recipe.difficultyScore
    : recipe?.difficulty === 'easy'
      ? 3
      : recipe?.difficulty === 'hard'
        ? 8
        : 5;
  return {
    rapid: steps.length > 0 && (steps.length <= 4 || /\b(rapide|15\s*min|20\s*min|express)\b/.test(text)),
    easy: difficultyScore <= 3 || normalizeText(recipe?.difficulty) === 'easy',
    oven: /\b(four|enfourner|gril|plaque|ramequin|ramequins|moule|moules|gratiner|gratin)\b/.test(text),
    frying: /\b(friture|frire|frites?|beignets?|tempura|bain d huile|huile a 180)\b/.test(text),
    vegetarian: !/\b(poulet|boeuf|bœuf|porc|lardon|lardons|bacon|jambon|poisson|saumon|thon|cabillaud|crevette|crevettes|calamar|calamars|moule|moules|viande)\b/.test(text),
    cold: /\b(froid|froide|refroidir|refrigerateur|réfrigérateur|repos au frais|chantilly|salade|coulis|gaspacho|gazpacho)\b/.test(text),
    makeAhead: /\b(repos|la veille|24h|refroidir|conservation|stockage|au frais|refrigerateur|réfrigérateur|congelation|congélation)\b/.test(text),
    weeknight: /\b(rapide|facile|simple|15\s*min|20\s*min|30\s*min|poele|poêle|four|plat)\b/.test(text) && !/\b(24h|la veille|repos une nuit|maturation)\b/.test(text),
    airFryer: /\b(air fryer|airfryer)\b/.test(text),
    plancha: /\b(plancha|saisir|griller|gril)\b/.test(text)
  };
}

function getRecipeIntentLabels(recipe, recipesById = {}) {
  const text = getRecipeWorkflowText(recipe, recipesById);
  const flags = getRecipeWorkflowFlags(recipe, recipesById);
  const labels = [];
  const add = (...items) => items.forEach(item => labels.push(item));
  const hasCookingVerb = /\b(cuire|cuisson|four|enfourner|poele|poêle|frire|friture|gril|griller|bouillir|porter a ebullition|porter à ébullition|mijoter|rotir|rôtir|gratiner)\b/.test(text);

  if (flags.rapid) add('rapide', 'express', 'vite');
  if (flags.easy) add('facile', 'simple', 'débutant');
  if (flags.oven) add('cuisson au four', 'four', 'plat au four');
  if (flags.frying) add('friture', 'croustillant', 'beignet');
  if (flags.vegetarian) add('végétarien', 'sans viande');
  if (flags.cold) add('froid', 'à servir froid');
  if (flags.makeAhead) add('à préparer à l’avance', 'la veille', 'organisation');
  if (flags.weeknight) add('soir de semaine', 'dîner rapide', 'repas simple');
  if (flags.airFryer) add('air fryer', 'croustillant sans friture');
  if (flags.plancha) add('plancha', 'grillé', 'saisi');
  if (!hasCookingVerb && !flags.oven && !flags.frying) add('sans cuisson');
  if (/\b(congel|congelation|congélation|congeler|congelateur|congélateur)\b/.test(text)) add('congelable', 'à congeler');
  if (/\b(oeuf|œuf|blancs d oeufs|jaunes d oeufs)\b/.test(text)) add('anti-gaspillage œufs', 'œufs');
  if (/\b(panier|courses|liste de courses)\b/.test(text)) add('courses');
  return uniq(labels);
}

function ingredientSearchTokens(value) {
  const normalized = normalizeText(value)
    .replace(/\bchou\s+fleur\b/g, 'choufleur')
    .replace(/\bpomme\s+de\s+terre\b/g, 'pdt')
    .replace(/\bet\b/g, ',');
  const parts = normalized
    .split(/[,;\n]+/)
    .map(part => part.replace(/\b(de|du|des|la|le|les|l)\b/g, ' ').replace(/\s+/g, ' ').trim())
    .filter(Boolean);
  const tokens = parts.length > 1 ? parts : normalized
    .split(/\s+/)
    .map(part => part.trim())
    .filter(part => part.length > 2 && !['avec', 'sans', 'pour'].includes(part));
  return uniq(tokens.flatMap(token => [token, ...(SEARCH_SYNONYMS[token] || []).map(normalizeText)]));
}

function getRecipeIngredientSearchText(recipe) {
  return normalizeText([
    recipe?.title,
    ...(recipe?.tags || []),
    ...(recipe?.aliases || []),
    ...(recipe?.ingredients || []).flatMap(group => [group.group, ...(group.items || [])])
  ].join(' '));
}

function scoreIngredientSearch(recipe, query) {
  const tokens = ingredientSearchTokens(query);
  if (!tokens.length) return { score: 0, matched: [], missing: [] };
  const ingredientText = getRecipeIngredientSearchText(recipe);
  const matched = [];
  const missing = [];
  tokens.forEach(token => {
    if (ingredientText.includes(token) || isCloseSearchToken(token, ingredientText)) matched.push(token);
    else missing.push(token);
  });
  if (!matched.length) return { score: 0, matched, missing };
  return {
    score: matched.length * 90 - missing.length * 28 + (missing.length ? 0 : 45),
    matched,
    missing
  };
}

function getRecipeSearchFacets(recipe) {
  const difficulty = normalizeText(recipe?.difficulty || '');
  const intentLabels = getRecipeIntentLabels(recipe);
  const labels = [
    ...(recipe?.categories || []),
    ...(recipe?.seasons || []),
    primaryCategory(recipe),
    ...intentLabels
  ];
  if (difficulty === 'easy') labels.push('facile', 'simple', 'débutant');
  if (difficulty === 'medium') labels.push('moyen', 'intermédiaire', 'technique');
  if (difficulty === 'hard') labels.push('difficile', 'avancé', 'technique');
  if (isMasterRecipe(recipe)) labels.push('collection', 'catégorie', 'choisir une recette');
  if ((recipe?.tags || []).some(tag => /friture|beignet|tempura/i.test(tag))) labels.push('friture', 'croustillant');
  return uniq(labels.map(stripHtml).filter(Boolean));
}

function truncateText(value, max = 156) {
  const text = stripHtml(value);
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trimEnd()}…`;
}

function recipeDescription(recipe, recipesById = {}) {
  if (!recipe?.title) return 'Cook Note : carnet de recettes avec ingrédients, quantités ajustables, étapes et notes pratiques.';
  const category = primaryCategory(recipe).toLowerCase();
  const yieldText = recipe.yield ? ` pour ${recipe.yield}` : '';
  const ingredientNames = (recipe.ingredients || [])
    .flatMap(group => group.items || [])
    .map(item => stripHtml(item).replace(/^\d+(?:[.,]\d+)?(?:\s*(?:g|kg|ml|cl|l))?\s*/i, '').trim())
    .filter(Boolean)
    .slice(0, 3);
  const linked = getLinkedRecipeRefs(recipe, recipesById).slice(0, 2).map(item => item.recipe.title);
  const tail = linked.length ? ` Liens utiles : ${linked.join(', ')}.` : '';
  const ingredients = ingredientNames.length ? ` Avec ${ingredientNames.join(', ')}.` : '';
  return truncateText(`${recipe.title} sur Cook Note : recette ${category}${yieldText}, avec ingrédients, étapes et notes pratiques.${ingredients}${tail}`);
}

function getPathRecipe() {
  const match = window.location.pathname.match(/^\/recette\/([^/?#]+)\/?$/);
  return match ? decodeURIComponent(match[1]) : null;
}

function getPathPage() {
  return window.location.pathname === '/techniques' || window.location.pathname === '/techniques/' ? 'techniques' : 'home';
}

function getInitialTechnique() {
  if (getPathPage() !== 'techniques') return '';
  try {
    return decodeURIComponent(window.location.hash.replace(/^#/, ''));
  } catch {
    return window.location.hash.replace(/^#/, '');
  }
}

function getRecipeUrl(recipeId, variantId = '') {
  return `/recette/${encodeURIComponent(variantId || recipeId)}`;
}

function getHomeUrl() {
  return `${window.location.origin}/`;
}

function getTechniquesUrl() {
  return `${window.location.origin}/techniques`;
}

function getInitialRecipe() {
  const variantRecipe = getInitialVariant();
  const pathRecipe = getPathRecipe();
  if (variantRecipe && window.RECIPES?.[variantRecipe]) return variantRecipe;
  if (pathRecipe) return pathRecipe;
  const params = new URLSearchParams(window.location.hash.replace(/^#/, ''));
  return params.get('recipe');
}

function getInitialVariant() {
  const queryVariant = new URLSearchParams(window.location.search).get('variant');
  if (queryVariant) return queryVariant;
  const params = new URLSearchParams(window.location.hash.replace(/^#/, ''));
  return params.get('variant');
}

function isTypingTarget(target) {
  return ['INPUT', 'TEXTAREA', 'SELECT'].includes(target?.tagName);
}

function copyText(text) {
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(text);
  const area = document.createElement('textarea');
  area.value = text;
  area.style.position = 'fixed';
  area.style.opacity = '0';
  document.body.appendChild(area);
  area.select();
  document.execCommand('copy');
  area.remove();
  return Promise.resolve();
}

function sanitizeNoteHtml(value) {
  const template = document.createElement('template');
  template.innerHTML = String(value || '');
  const allowedTags = new Set(['SPAN', 'STRONG', 'EM', 'B', 'I', 'BR']);

  function clean(node) {
    Array.from(node.childNodes).forEach(child => {
      if (child.nodeType === Node.TEXT_NODE) return;
      if (child.nodeType !== Node.ELEMENT_NODE || !allowedTags.has(child.tagName)) {
        child.replaceWith(document.createTextNode(child.textContent || ''));
        return;
      }
      Array.from(child.attributes).forEach(attribute => {
        if (!(child.tagName === 'SPAN' && attribute.name === 'data-goto')) {
          child.removeAttribute(attribute.name);
        }
      });
      clean(child);
    });
  }

  clean(template.content);
  return template.innerHTML;
}

function setMetaContent(selector, content) {
  const node = document.head.querySelector(selector);
  if (node && content) node.setAttribute('content', content);
}

function absoluteAssetUrl(url) {
  if (!url) return undefined;
  try {
    return new URL(url, window.location.origin).href;
  } catch {
    return undefined;
  }
}

function recipeJsonLd(recipe, recipesById = {}) {
  if (!recipe || isMasterRecipe(recipe)) return null;
  const url = `${window.location.origin}${getRecipeUrl(recipe.id)}`;
  const linkedRecipes = getLinkedRecipeRefs(recipe, recipesById);
  const keywords = uniq([...(recipe.tags || []), ...(recipe.tagsExtracted || []), ...(recipe.categories || []), primaryCategory(recipe)]).join(', ');
  const recipeText = normalizeText([recipe.title, ...(recipe.tags || []), ...(recipe.categories || []), ...(recipe.ingredients || []).flatMap(group => group.items || [])].join(' '));
  const recipeNode = {
    '@type': 'Recipe',
    '@id': `${url}#recipe`,
    name: recipe.title,
    description: recipeDescription(recipe, recipesById),
    url,
    mainEntityOfPage: url,
    image: recipe.image ? [absoluteAssetUrl(recipe.image)] : undefined,
    author: { '@type': 'Organization', name: 'Cook Note' },
    publisher: { '@type': 'Organization', name: 'Cook Note', url: getHomeUrl() },
    inLanguage: 'fr-FR',
    recipeCuisine: 'Cuisine maison',
    recipeYield: recipe.yield || undefined,
    recipeCategory: (recipe.categories || []).join(', ') || undefined,
    keywords: keywords || undefined,
    suitableForDiet: /\b(vegetarien|végétarien|sans viande)\b/.test(recipeText) ? 'https://schema.org/VegetarianDiet' : undefined,
    recipeIngredient: (recipe.ingredients || []).flatMap(group => group.items || []).map(stripHtml),
    recipeInstructions: (recipe.steps || []).map(step => ({ '@type': 'HowToStep', text: stripHtml(step) })),
    mentions: linkedRecipes.map(item => ({
      '@type': 'Recipe',
      name: item.recipe.title,
      url: `${window.location.origin}${getRecipeUrl(item.id)}`
    }))
  };
  return {
    '@context': 'https://schema.org',
    '@graph': [
      recipeNode,
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Cook Note', item: getHomeUrl() },
          { '@type': 'ListItem', position: 2, name: primaryCategory(recipe), item: getHomeUrl() },
          { '@type': 'ListItem', position: 3, name: recipe.title, item: url }
        ]
      }
    ]
  };
}

function websiteJsonLd() {
  const url = getHomeUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Cook Note',
    description: 'Carnet de recettes avec ingrédients, quantités ajustables, étapes, techniques de cuisinier, favoris et liste de courses.',
    url,
    inLanguage: 'fr-FR',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${url}?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  };
}

function techniquesJsonLd() {
  const url = getTechniquesUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Technique de cuisinier',
    description: 'Gestes de cuisine Cook Note : coupes, cuissons, pâtisserie, sauces, moules, friture et bases de cuisinier.',
    url,
    hasPart: SORTED_TECHNIQUE_GUIDES.map(guide => ({
      '@type': 'HowTo',
      name: guide.title,
      description: guide.description,
      url: `${url}#${guide.id}`,
      step: (guide.steps || []).map(step => ({ '@type': 'HowToStep', text: step }))
    }))
  };
}

function updateDocumentMeta(recipe, recipesById = {}, page = 'home') {
  const isTechniques = page === 'techniques';
  const title = isTechniques
    ? 'Technique de cuisinier - Cook Note'
    : recipe?.title
      ? `${recipe.title} - Cook Note`
      : 'Cook Note';
  const description = isTechniques
    ? 'Technique de cuisinier : gestes de base pour tailler, cuire, abaisser une pâte, foncer un moule, monter une sauce et réussir les préparations.'
    : recipe?.title
      ? recipeDescription(recipe, recipesById)
      : 'Cook Note : carnet de recettes avec ingrédients, quantités ajustables, étapes et notes pratiques.';
  const canonicalUrl = isTechniques
    ? getTechniquesUrl()
    : recipe?.id
      ? `${window.location.origin}${getRecipeUrl(recipe.id)}`
      : getHomeUrl();
  document.title = title;
  setMetaContent('meta[name="description"]', description);
  setMetaContent('meta[property="og:title"]', title);
  setMetaContent('meta[property="og:description"]', description);
  setMetaContent('meta[property="og:type"]', recipe && !isMasterRecipe(recipe) ? 'article' : 'website');
  setMetaContent('meta[property="og:url"]', canonicalUrl);
  setMetaContent('meta[name="twitter:title"]', title);
  setMetaContent('meta[name="twitter:description"]', description);
  setMetaContent('meta[name="twitter:card"]', 'summary_large_image');
  let canonical = document.head.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', canonicalUrl);
  const image = absoluteAssetUrl(recipe?.image || HERO_IMAGE);
  setMetaContent('meta[property="og:image"]', image);
  setMetaContent('meta[property="og:image:secure_url"]', image);
  setMetaContent('meta[name="twitter:image"]', image);
  document.getElementById('recipe-jsonld')?.remove();
  const jsonLd = isTechniques ? techniquesJsonLd() : (recipeJsonLd(recipe, recipesById) || websiteJsonLd());
  if (jsonLd) {
    const script = document.createElement('script');
    script.id = 'recipe-jsonld';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(jsonLd);
    document.head.appendChild(script);
  }
}

function Button(props) {
  const className = ['btn', props.variant ? `btn-${props.variant}` : '', props.className || '']
    .filter(Boolean)
    .join(' ');
  return h('button', {
    type: props.type || 'button',
    className,
    onClick: props.onClick,
    disabled: props.disabled,
    title: props.title,
    'aria-label': props.ariaLabel,
    'aria-pressed': props.pressed
  }, props.children);
}

const ICON_PATHS = {
  home: [
    'M3.5 11.2 12 4l8.5 7.2',
    'M5.8 10.2V20h12.4v-9.8',
    'M9.4 20v-5.6h5.2V20'
  ],
  search: [
    'M10.8 18.2a7.4 7.4 0 1 1 0-14.8 7.4 7.4 0 0 1 0 14.8Z',
    'M16.2 16.2 21 21'
  ],
  heart: [
    'M20.3 5.9c-1.8-1.9-4.8-1.9-6.6 0L12 7.6l-1.7-1.7c-1.8-1.9-4.8-1.9-6.6 0-1.9 2-1.9 5.1 0 7.1L12 21l8.3-8c1.9-2 1.9-5.1 0-7.1Z'
  ],
  basket: [
    'M6.5 9.2h11L16.7 20H7.3L6.5 9.2Z',
    'M9 9.2 12 4l3 5.2',
    'M8.4 13h7.2',
    'M8.7 16.4h6.6'
  ],
  book: [
    'M5 4.8h7a3 3 0 0 1 3 3V20H8a3 3 0 0 0-3-3V4.8Z',
    'M19 4.8h-4a3 3 0 0 0-3 3V20h4a3 3 0 0 1 3-3V4.8Z',
    'M8 8h3',
    'M8 11h3'
  ],
  spark: [
    'M12 3l1.7 5.1L19 10l-5.3 1.9L12 17l-1.7-5.1L5 10l5.3-1.9L12 3Z',
    'M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z'
  ],
  share: [
    'M14 4h6v6',
    'M20 4 11 13',
    'M11 6H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5'
  ],
  print: [
    'M7 8V4h10v4',
    'M7 17H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2',
    'M7 14h10v7H7z'
  ],
  focus: [
    'M9 4H5a1 1 0 0 0-1 1v4',
    'M15 4h4a1 1 0 0 1 1 1v4',
    'M20 15v4a1 1 0 0 1-1 1h-4',
    'M9 20H5a1 1 0 0 1-1-1v-4',
    'M9 12h6'
  ],
  settings: [
    'M4 7h10',
    'M18 7h2',
    'M14 7a2 2 0 1 0 4 0 2 2 0 0 0-4 0Z',
    'M4 17h2',
    'M10 17h10',
    'M6 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0Z'
  ],
  close: [
    'M6 6l12 12',
    'M18 6 6 18'
  ]
};

function Icon({ name, filled = false }) {
  return h('svg', {
    className: 'site-icon',
    viewBox: '0 0 24 24',
    'aria-hidden': 'true',
    focusable: 'false'
  },
    (ICON_PATHS[name] || []).map(path => h('path', {
      key: path,
      d: path,
      fill: filled ? 'currentColor' : 'none',
      stroke: 'currentColor',
      strokeWidth: '1.9',
      strokeLinecap: 'round',
      strokeLinejoin: 'round'
    }))
  );
}

function ingredientAvailabilityGroup(meta) {
  const missingCount = meta?.missing?.length || 0;
  if (missingCount === 0) return { key: 'all', label: 'Tu as tout', order: 0 };
  if (missingCount === 1) return { key: 'missing-1', label: 'Il manque 1 ingrédient', order: 1 };
  if (missingCount === 2) return { key: 'missing-2', label: 'Il manque 2 ingrédients', order: 2 };
  return { key: 'missing-3', label: `Il manque ${missingCount} ingrédients`, order: 3 + missingCount };
}

function useDebouncedValue(value, delay = 180) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedValue(value), delay);
    return () => window.clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

function TopBarFixed({ onHome, shoppingCount, showFavorites, openShoppingBasket, openMenuPlanner, openTechniques, query, openSearch, openPreferences }) {
  return h('header', { className: 'topbar' },
    h('div', { className: 'top-left' },
      h(Button, { variant: 'subtle', className: 'icon-square', onClick: onHome, title: 'Accueil', ariaLabel: 'Accueil' }, h(Icon, { name: 'home' }))
    ),
    h('nav', { className: 'top-actions', 'aria-label': 'Actions rapides' },
      h(Button, { variant: 'subtle', className: 'top-techniques-btn', onClick: openTechniques }, [
        h(Icon, { key: 'icon', name: 'book' }),
        h('span', { key: 'label' }, 'Techniques')
      ]),
      h(Button, { variant: 'subtle', className: 'top-menu-btn', onClick: openMenuPlanner }, [
        h(Icon, { key: 'icon', name: 'spark' }),
        h('span', { key: 'label' }, 'Menu')
      ]),
      h('a', {
        className: 'btn btn-subtle top-request-btn',
        href: 'mailto:cooknote271@gmail.com?subject=Demande%20d%27ajout%20de%20recette%20Cook%20Note&body=Bonjour%2C%0A%0AJ%27aimerais%20demander%20l%27ajout%20de%20cette%20recette%20dans%20Cook%20Note%20%3A%0A%0ANom%20de%20la%20recette%20%3A%0AIngr%C3%A9dients%20%3A%0A%C3%89tapes%20%3A%0A%0AMerci.'
      }, [
        h(Icon, { key: 'icon', name: 'spark' }),
        h('span', { key: 'label' }, 'Demander une recette')
      ]),
      h(Button, { variant: 'subtle', className: 'cart-icon-btn icon-square', onClick: openShoppingBasket, title: `${shoppingCount} course${shoppingCount > 1 ? 's' : ''}`, ariaLabel: 'Panier courses' }, [
        h(Icon, { key: 'icon', name: 'basket' }),
        shoppingCount > 0 && h('span', { className: 'cart-count', key: 'count' }, shoppingCount)
      ])
    ),
    h('div', { className: 'top-right' },
      h(Button, {
        variant: 'ghost',
        className: query.trim() ? 'top-search-button icon-square active' : 'top-search-button icon-square',
        onClick: openSearch,
        title: 'Rechercher',
        ariaLabel: 'Rechercher',
        pressed: Boolean(query.trim())
      }, h(Icon, { name: 'search' })),
      h(Button, {
        variant: 'ghost',
        className: 'top-fav-btn icon-square',
        onClick: showFavorites,
        title: 'Voir les favoris',
        ariaLabel: 'Voir les favoris'
      }, h(Icon, { name: 'heart' })),
      h(Button, {
        variant: 'ghost',
        className: 'top-settings-btn icon-square',
        onClick: openPreferences,
        title: 'Préférences d’affichage',
        ariaLabel: 'Préférences d’affichage'
      }, h(Icon, { name: 'settings' }))
    )
  );
}

function Hero() {
  return h('section', { className: 'hero' },
    h('div', { className: 'hero-inner' },
      h('h1', { className: 'sr-only' }, 'Cook Note'),
      h('img', { className: 'hero-logo', src: COOK_NOTE_LOGO, alt: 'Cook Note' })
    )
  );
}

function ActiveChips({ chips }) {
  if (!chips.length) return null;
  return h('div', { className: 'active-chips', 'aria-label': 'Filtres actifs' },
    chips.map(chip => h('button', { key: chip.key, type: 'button', onClick: chip.clear }, `${chip.label} ×`))
  );
}

function recipeCardImageUrl(image) {
  if (!image || !image.startsWith('/assets/recipe-images-optimized/')) return image;
  return image
    .replace('/assets/recipe-images-optimized/', '/assets/recipe-card-images/')
    .replace(/\.(?:png|jpe?g|webp)(\?.*)?$/i, '.jpg$1');
}

function RecipeCard({ recipe, recipesById, isFavorite, toggleFavorite, openRecipe, setTagFilter, hideFavorite = false, personalNote }) {
  const master = isMasterRecipe(recipe);
  const color = getCategoryColor(recipe);
  const style = { '--card-accent': color };
  const className = ['recipe-card', recipe.image ? 'has-image' : '', master ? 'master-card' : '']
    .filter(Boolean)
    .join(' ');
  const variantLabel = master ? '' : getRecipeVariantLabel(recipe, recipesById);
  const cardFacts = !master && variantLabel ? [variantLabel] : [];
  const serviceSummary = !master ? getRecipeServiceSummary(recipe) : '';
  const timing = !master ? getRecipeTiming(recipe) : null;
  const cardBadges = !master ? getRecipeCardBadges(recipe, recipesById) : [];
  const quickFacts = !master ? [
    timing?.active ? `Actif ${formatMinutesShort(timing.active)}` : '',
    timing?.cook ? `Cuisson ${formatMinutesShort(timing.cook)}` : '',
    difficultyText(recipe),
    serviceSummary
  ].filter(Boolean).slice(0, 3) : [];
  const favoriteStatus = isFavorite ? personalNote?.status : '';

  return h('article', {
    className,
    style,
    tabIndex: 0,
    role: 'button',
    'aria-label': `Ouvrir ${recipe.title}`,
    onClick: () => openRecipe(recipe.id),
    onKeyDown: event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openRecipe(recipe.id);
      }
    }
  },
    h('div', { className: 'card-media' },
      recipe.image && h('img', {
        className: 'card-image',
        src: recipeCardImageUrl(recipe.image),
        alt: recipe.title,
        loading: 'lazy',
        decoding: 'async',
        draggable: false,
        onError: event => {
          if (recipe.image && event.currentTarget.getAttribute('src') !== recipe.image) {
            event.currentTarget.src = recipe.image;
          }
        }
      }),
      !recipe.image && h('span', { className: 'card-letter' }, recipe.title.slice(0, 1)),
      recipe.video && h('span', { className: 'video-badge' }, 'Vidéo'),
      !master && !hideFavorite && h('button', {
        type: 'button',
        className: isFavorite ? 'fav-btn active' : 'fav-btn',
        onClick: event => {
          event.stopPropagation();
          toggleFavorite(recipe.id);
        },
        'aria-label': isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'
      }, h(Icon, { name: 'heart', filled: isFavorite }))
    ),
    h('div', { className: 'card-body' },
      !master && h('div', { className: 'tag-line' }, h('span', null, categoryLine(recipe))),
      h('h3', null, recipe.title),
      favoriteStatus && h('span', { className: 'favorite-status-badge' }, favoriteStatus),
      !master && cardFacts.length > 0 && h('div', { className: 'card-facts' },
        cardFacts.map(fact => h('span', { key: fact }, fact))
      ),
      !master && cardBadges.length > 0 && h('div', { className: 'card-badges' },
        cardBadges.map(badge => h('span', { key: badge }, badge))
      ),
      h('p', { className: 'card-meta' },
        master
          ? h('span', null, `${countLeafRecipes(recipe, recipesById)} recette${countLeafRecipes(recipe, recipesById) > 1 ? 's' : ''}`)
          : h('span', null, `${countIngredients(recipe)} ingrédients`)
      ),
      !master && h('span', { className: `nutri-score nutri-${getNutriScore(recipe).toLowerCase()}` }, `Nutri ${getNutriScore(recipe)}`),
      !master && quickFacts.length > 0 && h('div', { className: 'card-quicklook', 'aria-label': 'Repères rapides' },
        quickFacts.map(fact => h('span', { key: fact }, fact))
      ),
      !master && h('div', { className: 'mini-tags card-overlay-tags' },
        (recipe.tagsExtracted || []).slice(0, 2).map(tag => h('button', {
          key: tag,
          type: 'button',
          onClick: event => {
            event.stopPropagation();
            setTagFilter(tag);
          }
        }, tag))
      )
    )
  );
}

function RecipeGrid({ recipes, recipesById, favorites, toggleFavorite, openRecipe, setTagFilter, hideFavorite = false, personalNotes = {} }) {
  if (!recipes.length) {
    return h('div', { className: 'empty-state' },
      h('h2', null, 'Aucune recette ne matche'),
      h('p', null, 'Les filtres sont trop serrés pour le contenu actuel.')
    );
  }
  return h('div', { className: 'recipe-grid' },
    recipes.map(recipe => h(RecipeCard, {
      key: recipe.id,
      recipe,
      recipesById,
      isFavorite: favorites.includes(recipe.id),
      toggleFavorite,
      openRecipe,
      setTagFilter,
      hideFavorite,
      personalNote: personalNotes[recipe.id]
    }))
  );
}

function MonthlyAdditionsSection({ recipes, recipesById, favorites, toggleFavorite, openRecipe, setTagFilter }) {
  const [expanded, setExpanded] = useState(false);
  if (!recipes.length) return null;
  const orderedRecipes = [...recipes].sort((a, b) => {
    const rankA = monthlyAdditionRank(a);
    const rankB = monthlyAdditionRank(b);
    return rankB.time - rankA.time || rankB.index - rankA.index;
  });
  const visibleRecipes = expanded ? orderedRecipes : orderedRecipes.slice(0, 3);
  const hasMore = orderedRecipes.length > visibleRecipes.length;
  return h('section', { className: 'monthly-additions-block', 'aria-label': 'Ajouts du mois' },
    h('div', { className: 'season-block-head monthly-additions-head' },
      h('div', null,
        h('p', { className: 'eyebrow' }, 'Nouveautés'),
        h('h3', null, 'Ajouts du mois')
      ),
      h('div', { className: 'monthly-additions-actions' },
        h('span', null, `${recipes.length} fiches`),
        recipes.length > 3 && h(Button, {
          variant: 'subtle',
          className: 'monthly-additions-more',
          onClick: () => setExpanded(value => !value)
        }, expanded ? 'Réduire' : `Voir les ${recipes.length}`)
      )
    ),
    h(RecipeGrid, { recipes: visibleRecipes, recipesById, favorites, toggleFavorite, openRecipe, setTagFilter, hideFavorite: true }),
    hasMore && h('p', { className: 'monthly-additions-hint' }, `${orderedRecipes.length - visibleRecipes.length} autre${orderedRecipes.length - visibleRecipes.length > 1 ? 's' : ''} ajout${orderedRecipes.length - visibleRecipes.length > 1 ? 's' : ''} du mois`)
  );
}

function SeasonSections({ sections, recipesById, favorites, toggleFavorite, openRecipe, setTagFilter, onlyFavorites, clearFavoriteView, selectedSeason, setSeason, categoryFilter, setCategoryFilter, categoryOptions, personalNotes = {}, favoriteCollection, setFavoriteCollection }) {
  const seasonOptions = ['Toutes', ...SEASONS];
  const showCategoryTabs = selectedSeason && !onlyFavorites && (categoryOptions || []).length > 1;
  const visibleIds = new Set(sections.flatMap(section => (section.recipes || []).map(recipe => recipe.id)));
  const dashboardLabel = onlyFavorites ? 'Favoris' : (selectedSeason || 'Toutes saisons');
  const favoriteRecipes = favorites.map(id => recipesById[id]).filter(Boolean);
  const favoriteCollectionCounts = onlyFavorites ? FAVORITE_COLLECTIONS.reduce((counts, collection) => {
    counts[collection.id] = collection.id
      ? favoriteRecipes.filter(recipe => collection.match?.(recipe, personalNotes[recipe.id])).length
      : favoriteRecipes.length;
    return counts;
  }, {}) : {};
  const favoriteStatusCounts = onlyFavorites ? favorites.reduce((counts, id) => {
    const status = personalNotes[id]?.status || 'Sans statut';
    counts[status] = (counts[status] || 0) + 1;
    return counts;
  }, {}) : {};
  return h('section', { className: 'season-sections', id: 'recettes' },
    h('div', { className: 'section-title list-title season-dashboard' },
      h('div', { className: 'season-dashboard-copy' },
        h('p', { className: 'eyebrow' }, onlyFavorites ? 'Favoris' : 'Rangement saisonnier'),
        h('h2', null, onlyFavorites ? 'Mes recettes favorites' : 'Recettes par saison'),
        h('div', { className: 'season-dashboard-meta', 'aria-label': 'Résumé de la sélection' },
          h('span', null, dashboardLabel),
          h('span', null, `${visibleIds.size} fiche${visibleIds.size > 1 ? 's' : ''}`),
          sections.length > 1 && h('span', null, `${sections.length} groupes`)
        ),
        onlyFavorites && Object.keys(favoriteStatusCounts).length > 0 && h('div', { className: 'favorite-status-summary' },
          Object.entries(favoriteStatusCounts).map(([status, count]) => h('span', { key: status }, `${status}: ${count}`))
        ),
        onlyFavorites && h('div', { className: 'favorite-collection-tabs', 'aria-label': 'Collections de favoris' },
          FAVORITE_COLLECTIONS
            .filter(collection => !collection.id || favoriteCollectionCounts[collection.id] > 0 || favoriteCollection === collection.id)
            .map(collection => h('button', {
              key: collection.id || 'all',
              type: 'button',
              className: favoriteCollection === collection.id ? 'active' : '',
              onClick: () => setFavoriteCollection?.(collection.id)
            },
              h('span', null, collection.label),
              h('small', null, favoriteCollectionCounts[collection.id] || 0)
            ))
        )
      ),
      onlyFavorites
        ? h('button', { type: 'button', onClick: clearFavoriteView }, 'Quitter les favoris')
        : h('div', { className: 'season-filter-stack' },
          h('div', { className: 'season-tabs', 'aria-label': 'Filtrer par saison' },
            seasonOptions.map(item => {
              const value = item === 'Toutes' ? '' : item;
              const active = selectedSeason === value;
              return h('button', {
                key: item,
                type: 'button',
                className: active ? 'active' : '',
                onClick: () => setSeason(value)
              }, item);
            })
          ),
          showCategoryTabs && h('div', { className: 'season-category-tabs', 'aria-label': 'Filtrer la saison par catégorie' },
            categoryOptions.map(item => h('button', {
              key: item.value || 'all',
              type: 'button',
              className: categoryFilter === item.value ? 'active' : '',
              onClick: () => setCategoryFilter(item.value)
            },
              h('span', null, item.label),
              h('small', null, item.count)
            ))
          )
        )
    ),
    sections.map(section => h('section', { key: section.key, className: 'season-block' },
      h('div', { className: 'season-block-head' },
        h('div', null, h('p', { className: 'eyebrow' }, section.kicker), h('h3', null, section.title)),
        h('span', null, `${section.recipes.length} fiche${section.recipes.length > 1 ? 's' : ''}`)
      ),
      h(RecipeGrid, { recipes: section.recipes, recipesById, favorites, toggleFavorite, openRecipe, setTagFilter, personalNotes })
    ))
  );
}

function HomeView(props) {
  const showRecent = !props.onlyFavorites && !props.activeChips.length && !props.filterProps.season && !props.filterProps.seasonCategory;
  return h('main', { className: 'home-view' },
    h(Hero),
    h('div', { className: 'content-wrap' },
      h(ActiveChips, { chips: props.activeChips }),
      showRecent && h(MonthlyAdditionsSection, {
        recipes: props.monthlyAdditionRecipes || [],
        recipesById: props.recipesById,
        favorites: props.favorites,
        toggleFavorite: props.toggleFavorite,
        personalNotes: props.personalNotes,
        openRecipe: props.openRecipe,
        setTagFilter: props.setTagFilter
      }),
      h(SeasonSections, {
        sections: props.sections,
        recipesById: props.recipesById,
        favorites: props.favorites,
        toggleFavorite: props.toggleFavorite,
        openRecipe: props.openRecipe,
        setTagFilter: props.setTagFilter,
        onlyFavorites: props.onlyFavorites,
        clearFavoriteView: props.clearFavoriteView,
        selectedSeason: props.filterProps.season,
        setSeason: props.filterProps.setSeason,
        categoryFilter: props.filterProps.seasonCategory,
        setCategoryFilter: props.filterProps.setSeasonCategory,
        categoryOptions: props.filterProps.seasonCategoryOptions,
        personalNotes: props.personalNotes,
        favoriteCollection: props.favoriteCollection,
        setFavoriteCollection: props.setFavoriteCollection
      })
    )
  );
}

function NotFoundView({ goHome, openSearch }) {
  return h('main', { className: 'not-found-view' },
    h(Hero),
    h('div', { className: 'content-wrap' },
      h('section', { className: 'fatal-state not-found-panel' },
        h('p', { className: 'eyebrow' }, 'Page introuvable'),
        h('h1', null, 'Cette fiche n’existe pas encore'),
        h('p', null, 'Le lien pointe vers une recette absente du carnet ou déplacée.'),
        h('div', { className: 'not-found-actions' },
          h(Button, { variant: 'primary', onClick: openSearch }, 'Rechercher une recette'),
          h(Button, { variant: 'subtle', onClick: goHome }, 'Retour au carnet')
        )
      )
    )
  );
}

function TechniquesView({ targetTechniqueId, goHome }) {
  const [highlightedTechniqueId, setHighlightedTechniqueId] = useState('');
  const [techniqueFilter, setTechniqueFilter] = useState('');
  const techniqueLabels = useMemo(() => uniq(SORTED_TECHNIQUE_GUIDES.map(guide => guide.label)), []);
  const visibleTechniques = useMemo(() => techniqueFilter
    ? SORTED_TECHNIQUE_GUIDES.filter(guide => guide.label === techniqueFilter)
    : SORTED_TECHNIQUE_GUIDES, [techniqueFilter]);
  const techniqueGroups = useMemo(() => {
    const groups = new Map();
    visibleTechniques.forEach(guide => {
      const label = guide.label || 'Technique';
      if (!groups.has(label)) groups.set(label, []);
      groups.get(label).push(guide);
    });
    return Array.from(groups, ([label, guides]) => ({ label, guides }));
  }, [visibleTechniques]);
  useEffect(() => {
    let frameId = 0;
    let settleTimer = 0;

    function hashId() {
      try {
        return decodeURIComponent(window.location.hash.replace(/^#/, ''));
      } catch {
        return window.location.hash.replace(/^#/, '');
      }
    }

    function scrollToTechnique(attempt = 0, forcedId = null) {
      const id = forcedId !== null ? forcedId : (targetTechniqueId || hashId());
      if (!id) {
        setHighlightedTechniqueId('');
        return;
      }
      const target = document.getElementById(`technique-${id}`);
      if (!target) {
        if (attempt < 30) frameId = requestAnimationFrame(() => scrollToTechnique(attempt + 1, forcedId));
        return;
      }
      window.clearTimeout(settleTimer);
      frameId = requestAnimationFrame(() => {
        scrollElementToViewportCenter(target);
        settleTimer = window.setTimeout(() => scrollElementToViewportCenter(target, 'auto'), 650);
      });
      target.focus({ preventScroll: true });
      setHighlightedTechniqueId(id);
    }

    const handleHashChange = () => scrollToTechnique(0, hashId());
    scrollToTechnique();
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      cancelAnimationFrame(frameId);
      window.clearTimeout(settleTimer);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [targetTechniqueId]);
  return h('main', { className: 'techniques-view' },
    h(Hero),
    h('div', { className: 'content-wrap techniques-wrap' },
      h('div', { className: 'section-title techniques-title' },
        h('div', null,
          h('p', { className: 'eyebrow' }, 'Gestes de cuisine'),
          h('h2', null, 'Technique de cuisinier'),
          h('p', null, 'Les gestes de base pour cuisiner plus proprement : tailler, peler, abaisser, foncer, monter, lier et éviter les erreurs classiques.')
        ),
        h(Button, { variant: 'subtle', onClick: goHome }, 'Retour aux recettes')
      ),
      h('div', { className: 'technique-filter-tabs', 'aria-label': 'Filtrer les techniques' },
        ['Toutes', ...techniqueLabels].map(label => {
          const value = label === 'Toutes' ? '' : label;
          const count = value ? SORTED_TECHNIQUE_GUIDES.filter(guide => guide.label === value).length : SORTED_TECHNIQUE_GUIDES.length;
          return h('button', {
            key: label,
            type: 'button',
            className: techniqueFilter === value ? 'active' : '',
            onClick: () => setTechniqueFilter(value)
          }, h('span', null, label), h('small', null, count));
        })
      ),
      h('div', { className: 'technique-family-list' },
        techniqueGroups.map(group => h('section', { key: group.label, className: 'technique-family' },
          h('div', { className: 'technique-family-head' },
            h('h3', null, group.label),
            h('span', null, `${group.guides.length} geste${group.guides.length > 1 ? 's' : ''}`)
          ),
          h('div', { className: 'technique-grid' },
            group.guides.map(guide => h('article', {
              key: guide.id,
              id: `technique-${guide.id}`,
              tabIndex: -1,
              className: highlightedTechniqueId === guide.id ? 'technique-card technique-card-highlight' : 'technique-card'
            },
              h('div', { className: 'technique-card-head' },
                h('span', null, h(Icon, { name: 'spark' })),
                h('small', null, guide.label)
              ),
              h('h3', null, guide.title),
              h('p', null, guide.description),
              h('ol', { className: 'technique-steps' },
                (guide.steps || []).map((step, index) => h('li', { key: `${guide.id}:step:${index}` }, step))
              ),
              guide.tip && h('p', { className: 'technique-tip' }, guide.tip)
            ))
          )
        ))
      )
    )
  );
}

function SharePanel({ open, onClose, recipe, notify }) {
  const [copied, setCopied] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [qrReady, setQrReady] = useState(false);
  const canvasRef = useRef(null);
  const url = `${window.location.origin}${getRecipeUrl(recipe.id)}`;
  const description = recipeDescription(recipe);
  const text = `${recipe.title} - Cook Note\n${description}\n${url}`;
  const imageStyle = recipe.image ? { backgroundImage: `url("${recipe.image}")` } : {};

  function nativeShare() {
    if (!navigator.share) return copyText(text).then(() => {
      setCopiedText(true);
      notify?.('Texte de partage copié');
    });
    return navigator.share({ title: `${recipe.title} - Cook Note`, text: description, url }).then(() => {
      notify?.('Partage ouvert');
    }).catch(() => {});
  }

  useEffect(() => {
    setCopied(false);
    setCopiedText(false);
    setQrReady(false);
    if (!open || !canvasRef.current || !window.QRCode) return;
    window.QRCode.toCanvas(canvasRef.current, url, {
      width: 132,
      margin: 1,
      color: { dark: '#111111', light: '#ffffff' }
    }).then(() => setQrReady(true)).catch(() => setQrReady(false));
  }, [open, url]);

  if (!open) return null;
  return h('div', { className: 'modal-backdrop', onMouseDown: onClose },
    h('section', { className: 'modal-panel share-modal', role: 'dialog', 'aria-modal': 'true', onMouseDown: event => event.stopPropagation() },
      h('div', { className: 'modal-head' },
        h('div', null, h('p', { className: 'eyebrow' }, 'Partager'), h('h2', null, recipe.title)),
        h('button', { type: 'button', className: 'icon-btn', onClick: onClose, 'aria-label': 'Fermer' }, h(Icon, { name: 'close' }))
      ),
      h('div', { className: 'share-card' },
        h('div', { className: 'share-card-media', style: imageStyle },
          !recipe.image && h('span', { className: 'card-letter' }, recipe.title.slice(0, 1))
        ),
        h('div', { className: 'share-card-copy' },
          h('p', { className: 'eyebrow' }, 'Cook Note'),
          h('h3', null, recipe.title),
          h('p', null, description),
          h('div', { className: 'share-card-meta' },
            h('span', null, primaryCategory(recipe)),
            recipe.yield && h('span', null, recipe.yield),
            h('span', { className: `nutri-score nutri-${getNutriScore(recipe).toLowerCase()}` }, `Nutri ${getNutriScore(recipe)}`)
          )
        ),
        h('div', { className: qrReady ? 'share-qr is-ready' : 'share-qr' },
          h('canvas', { ref: canvasRef, className: 'qr-canvas', width: 132, height: 132 }),
          !qrReady && h('span', null, 'Lien pret')
        )
      ),
      h('div', { className: 'share-link-box' }, url),
      h('div', { className: 'share-actions' },
        navigator.share && h(Button, { variant: 'primary', onClick: nativeShare }, 'Partager'),
        h(Button, { variant: navigator.share ? 'subtle' : 'primary', onClick: () => copyText(url).then(() => {
          setCopied(true);
          notify?.('Lien de recette copié');
        }) }, copied ? 'Lien copie' : 'Copier le lien'),
        h(Button, { variant: 'subtle', onClick: () => copyText(text).then(() => {
          setCopiedText(true);
          notify?.('Texte de recette copié');
        }) }, copiedText ? 'Texte copie' : 'Copier le texte'),
        h('a', { className: 'btn btn-subtle', href: `https://wa.me/?text=${encodeURIComponent(text)}`, target: '_blank', rel: 'noreferrer' }, 'WhatsApp'),
        h('a', { className: 'btn btn-subtle', href: `mailto:?subject=${encodeURIComponent(recipe.title)}&body=${encodeURIComponent(text)}` }, 'Email')
      )
    )
  );
}

function SearchPanel({ open, onClose, query, setQuery, searchRef, results, resultMeta, ingredientMeta, openRecipe, recentRecipes = [], recentSearches = [], rememberSearch }) {
  if (!open) return null;
  const hasQuery = Boolean(query.trim());
  const ingredientTokens = ingredientSearchTokens(query);
  const hasIngredientMatches = hasQuery && results.some(recipe => ingredientMeta.has(recipe.id));
  const groupByIngredientAvailability = hasIngredientMatches && (query.includes(',') || ingredientTokens.length > 1);
  const visibleResults = hasQuery ? results.slice(0, 18) : [];
  const resultGroups = visibleResults.reduce((groups, recipe) => {
    const availability = ingredientMeta.has(recipe.id) ? ingredientAvailabilityGroup(ingredientMeta.get(recipe.id)) : null;
    const key = groupByIngredientAvailability && availability ? availability.key : primaryCategory(recipe);
    const label = groupByIngredientAvailability && availability ? availability.label : key;
    if (!groups.has(key)) groups.set(key, { key, label, recipes: [], ingredientGroup: Boolean(groupByIngredientAvailability && availability) });
    groups.get(key).recipes.push(recipe);
    return groups;
  }, new Map());
  const suggestions = [
    { title: 'Ingrédients', items: [
      { label: 'Citron', query: 'citron' },
      { label: 'Œufs', query: 'oeuf' },
      { label: 'Chocolat', query: 'chocolat' },
      { label: 'Beurre noisette', query: 'beurre noisette' },
      { label: 'Reste de pommes de terre', query: 'reste pomme de terre' }
    ] },
    { title: 'Intentions', items: [
      { label: 'Rapide', query: 'rapide' },
      { label: 'Sans cuisson', query: 'sans cuisson' },
      { label: 'La veille', query: 'la veille' },
      { label: 'À préparer', query: 'à préparer à l’avance' },
      { label: 'Congelable', query: 'congelable' },
      { label: 'Soir de semaine', query: 'soir de semaine' }
    ] },
    { title: 'Textures', items: [
      { label: 'Croustillant', query: 'croustillant' },
      { label: 'Moelleux', query: 'moelleux' },
      { label: 'Cr\u00e9meux', query: 'cremeux' },
      { label: 'Fourr\u00e9', query: 'fourre' },
      { label: 'Léger', query: 'leger' }
    ] },
    { title: 'Méthodes', items: [
      { label: 'Four', query: 'cuisson au four' },
      { label: 'Friture', query: 'friture' },
      { label: 'Froid', query: 'froid' },
      { label: 'Air fryer', query: 'air fryer' },
      { label: 'Plancha', query: 'plancha' },
      { label: 'Acidulé', query: 'acidule' }
    ] },
    { title: 'Familles', items: [
      { label: 'Apéro', query: 'apéro' },
      { label: 'Sauces', query: 'sauce' },
      { label: 'Bases', query: 'base' },
      { label: 'Familial', query: 'familial' }
    ] }
  ];
  const rememberCurrentSearch = () => {
    if (query.trim()) rememberSearch?.(query);
  };
  const openSearchRecipe = recipe => {
    rememberCurrentSearch();
    openRecipe(recipe.id);
    onClose();
  };
  return h('div', { className: 'modal-backdrop search-backdrop', onMouseDown: onClose },
    h('section', {
      className: 'modal-panel search-modal',
      role: 'dialog',
      'aria-modal': 'true',
      'aria-label': 'Recherche',
      onMouseDown: event => event.stopPropagation()
    },
      h('div', { className: 'modal-head' },
        h('div', null,
          h('p', { className: 'eyebrow' }, 'Recherche'),
          h('h2', null, 'Trouver une recette')
        ),
        h('button', { type: 'button', className: 'icon-btn', onClick: onClose, 'aria-label': 'Fermer' }, h(Icon, { name: 'close' }))
      ),
      h('div', { className: 'field search-modal-field' },
        h('label', { className: 'sr-only', htmlFor: 'recipe-search-input' }, 'Rechercher une recette'),
        h('input', {
          id: 'recipe-search-input',
          type: 'search',
          ref: searchRef,
          value: query,
          onChange: event => setQuery(event.target.value),
          onKeyDown: event => {
            if (event.key === 'Escape') onClose();
            if (event.key === 'Enter' && visibleResults[0]) {
              openSearchRecipe(visibleResults[0]);
            }
          },
          placeholder: 'Recette, ingrédients, usage, saison...'
        })
      ),
      hasQuery
        ? h('div', { className: 'search-result-count' }, `${results.length} résultat${results.length > 1 ? 's' : ''} pour "${query}"`)
        : h('div', { className: 'search-discovery' },
          (recentSearches.length > 0 || recentRecipes.length > 0) && h('div', { className: 'search-memory-grid' },
            recentSearches.length > 0 && h('section', { className: 'search-memory-card' },
              h('strong', null, 'Recherches récentes'),
              h('div', { className: 'search-suggestions' },
                recentSearches.slice(0, 6).map(item =>
                  h('button', { key: item, type: 'button', onClick: () => setQuery(item) }, item)
                )
              )
            ),
            recentRecipes.length > 0 && h('section', { className: 'search-memory-card' },
              h('strong', null, 'Dernières fiches'),
              h('div', { className: 'recent-recipe-list' },
                recentRecipes.slice(0, 4).map(recipe =>
                  h('button', { key: recipe.id, type: 'button', onClick: () => openSearchRecipe(recipe) },
                    h('span', { className: 'search-result-image', style: recipe.image ? { backgroundImage: `url("${recipe.image}")` } : {} }),
                    h('span', null, recipe.title)
                  )
                )
              )
            )
          ),
          h('div', { className: 'search-suggestion-groups' },
          suggestions.map(group => h('section', { key: group.title, className: 'search-suggestion-group' },
            h('strong', null, group.title),
            h('div', { className: 'search-suggestions' },
              group.items.map(item =>
                h('button', { key: item.query, type: 'button', onClick: () => {
                  setQuery(item.query);
                  rememberSearch?.(item.query);
                } }, item.label)
              )
            )
          ))
          )
        ),
      hasQuery && (visibleResults.length
        ? h('div', { className: 'search-result-groups' },
          Array.from(resultGroups.values()).map(group => h('section', { key: group.key, className: group.ingredientGroup ? 'search-result-group ingredient-match-group' : 'search-result-group' },
            h('div', { className: 'search-result-group-head' },
              h('strong', null, group.label),
              h('span', null, `${group.recipes.length} résultat${group.recipes.length > 1 ? 's' : ''}`)
            ),
            h('div', { className: 'search-results' },
              group.recipes.map(recipe => {
                const meta = resultMeta.get(recipe.id);
                const ingredient = ingredientMeta.get(recipe.id);
                const availability = ingredient ? ingredientAvailabilityGroup(ingredient) : null;
                return h('button', {
                  key: recipe.id,
                  type: 'button',
                  className: 'search-result',
                  onClick: () => openSearchRecipe(recipe)
                },
                  h('span', { className: 'search-result-image', style: recipe.image ? { backgroundImage: `url("${recipe.image}")` } : {} }),
                  h('span', { className: 'search-result-copy' },
                    h('strong', null, recipe.title),
                    h('small', null, recipe.yield || difficultyText(recipe)),
                    availability && h('span', { className: `ingredient-match-badge ${availability.key}` }, availability.label),
                    meta?.reasons?.length && h('span', { className: 'search-reason-pills' },
                      meta.reasons.slice(0, 3).map(reason => h('em', { key: reason }, reason))
                    ),
                    ingredient?.matched?.length && h('span', { className: 'search-reason-pills' },
                      ingredient.matched.slice(0, 3).map(reason => h('em', { key: reason }, reason))
                    ),
                    ingredient?.missing?.length > 0 && h('small', { className: 'ingredient-missing' }, `Manque peut-être : ${ingredient.missing.slice(0, 2).join(', ')}`)
                  ),
                  h('span', { className: `nutri-score nutri-${getNutriScore(recipe).toLowerCase()}` }, `Nutri ${getNutriScore(recipe)}`)
                );
              })
            )
          ))
        )
        : h('div', { className: 'empty-state search-empty' },
          h('h2', null, 'Aucun résultat'),
          h('p', null, 'Essaie un ingrédient, une catégorie ou un mot proche.')
        ))

    )
  );
}
function ShoppingBasketPanel({ open, onClose, recipes, factorById, removeRecipe, clearShopping, notify }) {
  const [copied, setCopied] = useState(false);
  const [checkedItems, setCheckedItems] = useState(() => readJson(STORAGE_KEYS.shoppingChecked, {}));
  const [ownedItems, setOwnedItems] = useState(() => readJson(STORAGE_KEYS.shoppingOwned, {}));
  const shoppingData = useMemo(() => buildShoppingListData(recipes, factorById), [recipes, factorById]);
  const activeShoppingData = useMemo(() => filterShoppingListData(shoppingData, ownedItems), [shoppingData, ownedItems]);
  const batchPlan = useMemo(() => getBatchPlanData(recipes), [recipes]);
  const text = recipes.length ? shoppingListText(recipes, factorById, ownedItems) : 'Liste de courses Cook Note\n\nAucune recette cochee.';
  const compactText = recipes.length ? shoppingListText(recipes, factorById, ownedItems, 'compact') : 'Courses Cook Note\nAucune recette.';
  const visibleShoppingKeys = useMemo(() => new Set(shoppingData.groupedItems.map(item => item.key)), [shoppingData]);
  const checkedCount = activeShoppingData.groupedItems.filter(item => checkedItems[item.key]).length;
  const setShoppingChecked = updater => {
    setCheckedItems(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      writeJson(STORAGE_KEYS.shoppingChecked, next);
      return next;
    });
  };
  const shareText = () => {
    if (navigator.share) {
      navigator.share({ title: 'Liste de courses Cook Note', text }).then(() => notify?.('Partage de la liste ouvert')).catch(() => {});
    } else {
      copyText(text).then(() => {
        setCopied(true);
        notify?.('Liste de courses copiée');
      });
    }
  };
  const setOwnedShoppingItems = updater => {
    setOwnedItems(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      writeJson(STORAGE_KEYS.shoppingOwned, next);
      return next;
    });
  };
  const toggleOwnedItem = key => {
    setOwnedShoppingItems(prev => {
      const next = { ...(prev || {}) };
      if (next[key]) delete next[key];
      else next[key] = true;
      return next;
    });
  };

  useEffect(() => {
    if (open) setCopied(false);
  }, [open, recipes.length]);

  useEffect(() => {
    setShoppingChecked(prev => {
      const next = {};
      Object.entries(prev || {}).forEach(([key, value]) => {
        if (visibleShoppingKeys.has(key) && value) next[key] = true;
      });
      return next;
    });
  }, [visibleShoppingKeys]);

  if (!open) return null;
  return h('div', { className: 'modal-backdrop', onMouseDown: onClose },
    h('section', { className: 'modal-panel shopping-modal', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'shopping-modal-title', onMouseDown: event => event.stopPropagation() },
      h('div', { className: 'modal-head' },
        h('div', null,
          h('p', { className: 'eyebrow' }, 'Panier courses'),
          h('h2', { id: 'shopping-modal-title' }, recipes.length ? `${recipes.length} recette${recipes.length > 1 ? 's' : ''} cochée${recipes.length > 1 ? 's' : ''}` : 'Aucune recette')
        ),
        h('button', { type: 'button', className: 'icon-btn', onClick: onClose, 'aria-label': 'Fermer' }, h(Icon, { name: 'close' }))
      ),
      recipes.length
        ? h('div', { className: 'shopping-picked' },
            recipes.map(recipe => h('button', {
              key: recipe.id,
              type: 'button',
              onClick: () => removeRecipe(recipe.id),
              title: 'Retirer du panier courses'
            }, recipe.title, h('span', null, '×')))
          )
        : h('p', { className: 'muted' }, 'Ajoute une recette depuis sa fiche pour construire une liste groupée.'),
      recipes.length > 0 && h('div', { className: 'shopping-summary' },
        h('span', null, `${activeShoppingData.groupedItems.length} à acheter`),
        activeShoppingData.ownedGroupedItems.length > 0 && h('span', null, `${activeShoppingData.ownedGroupedItems.length} déjà maison`),
        h('span', null, `${checkedCount} coché${checkedCount > 1 ? 's' : ''}`),
        checkedCount > 0 && h('button', { type: 'button', onClick: () => setShoppingChecked({}) }, 'Tout décocher')
      ),
      recipes.length > 0 && activeShoppingData.smartGroups.length > 0 && h('div', { className: 'shopping-smart-groups' },
        activeShoppingData.smartGroups.map(group => h('span', { key: group.label }, `${group.label}: ${group.items.map(item => item.name).join(', ')}`))
      ),
      recipes.length > 1 && batchPlan.length > 0 && h('div', { className: 'batch-plan' },
        h('div', { className: 'batch-plan-head' },
          h('p', { className: 'eyebrow' }, 'Batch'),
          h('h3', null, 'Ordre de pr\u00e9paration')
        ),
        batchPlan.map(group => h('section', { key: group.key },
          h('strong', null, group.label),
          h('ul', null, group.items.map(item => h('li', { key: item }, item)))
        ))
      ),
      recipes.length > 0 && h('div', { className: 'shopping-aisles' },
        activeShoppingData.aisleGroups.map(group => h('section', { key: group.label, className: 'shopping-aisle' },
          h('div', { className: 'shopping-aisle-head' },
            h('strong', null, group.label),
            h('span', null, `${group.items.length} article${group.items.length > 1 ? 's' : ''}`)
          ),
          group.items.map(item => {
            const checked = Boolean(checkedItems[item.key]);
            const amount = formatShoppingAmount(item);
            return h('label', { key: item.key, className: checked ? 'shopping-line checked' : 'shopping-line' },
              h('input', {
                type: 'checkbox',
                checked,
                onChange: () => setShoppingChecked(prev => ({ ...prev, [item.key]: !prev[item.key] }))
              }),
              h('span', { className: 'shopping-line-main' },
                amount && h('strong', null, amount),
                h('span', null, item.name),
                item.purchaseHint && h('em', null, item.purchaseHint)
              ),
              h('small', null, item.recipeNames.join(', ')),
              h('button', { type: 'button', className: 'shopping-owned-btn', onClick: event => {
                event.preventDefault();
                toggleOwnedItem(item.key);
              } }, 'J’ai déjà')
            );
          })
        ))
      ),
      activeShoppingData.ownedGroupedItems.length > 0 && h('div', { className: 'shopping-owned-list' },
        h('strong', null, 'Déjà à la maison'),
        activeShoppingData.ownedGroupedItems.map(item => h('button', { key: item.key, type: 'button', onClick: () => toggleOwnedItem(item.key) }, `${[formatShoppingAmount(item), item.name].filter(Boolean).join(' ')}`))
      ),
      h('pre', { className: 'cart-output combined-cart' }, text),
      h('div', { className: 'modal-actions' },
        h(Button, { variant: 'primary', disabled: !recipes.length, onClick: () => copyText(text).then(() => {
          setCopied(true);
          notify?.('Liste de courses copiée');
        }) }, copied ? 'Copié' : 'Copier la liste complète'),
        h(Button, { variant: 'subtle', disabled: !recipes.length, onClick: () => copyText(compactText).then(() => {
          setCopied(true);
          notify?.('Liste compacte copiée');
        }) }, 'Copier compact'),
        h(Button, { variant: 'ghost', className: 'icon-square', disabled: !recipes.length, onClick: shareText, title: 'Partager la liste', ariaLabel: 'Partager la liste' }, h(Icon, { name: 'share' })),
        h(Button, { variant: 'ghost', className: 'icon-square', disabled: !recipes.length, onClick: () => window.print(), title: 'Imprimer la liste', ariaLabel: 'Imprimer la liste' }, h(Icon, { name: 'print' })),
        h(Button, { variant: 'subtle', disabled: !recipes.length, onClick: clearShopping }, 'Vider le panier')
      )
    )
  );
}

function MenuPlannerPanel({ open, onClose, recipes, openRecipe, addMenuToShopping, notify }) {
  const [offset, setOffset] = useState(0);
  const [itemOffsets, setItemOffsets] = useState({});
  const [themeId, setThemeId] = useState(MENU_THEMES[0].id);
  const [menuHistory, setMenuHistory] = useState(() => readStoredList(STORAGE_KEYS.menuHistory, []));
  const menu = useMemo(() => buildMenuSuggestionWithOverrides(recipes, offset, themeId, menuHistory, itemOffsets), [recipes, offset, themeId, menuHistory, itemOffsets]);
  const menuItems = menu.items || [];
  const menuRecipes = menuItems.map(item => item.recipe);
  const shoppingData = useMemo(() => buildShoppingListData(menuRecipes), [menuRecipes]);
  const servicePlan = useMemo(() => buildMenuServicePlan(menuRecipes, shoppingData), [menuRecipes, shoppingData]);
  if (!open) return null;
  const rememberMenu = currentMenu => {
    if (!currentMenu?.signature) return;
    const next = [currentMenu.signature, ...menuHistory.filter(item => item !== currentMenu.signature)].slice(0, 12);
    setMenuHistory(next);
    writeJson(STORAGE_KEYS.menuHistory, next);
  };
  const addToShopping = () => {
    rememberMenu(menu);
    addMenuToShopping(menuRecipes);
    notify?.('Menu ajouté aux courses');
  };
  const changeWholeMenu = () => {
    rememberMenu(menu);
    setItemOffsets({});
    setOffset(value => value + 1);
  };
  const changeOneItem = index => {
    setItemOffsets(current => ({ ...current, [index]: (current[index] || 0) + 1 }));
  };
  return h('div', { className: 'modal-backdrop', onMouseDown: onClose },
    h('section', { className: 'modal-panel menu-planner-modal', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'menu-planner-title', onMouseDown: event => event.stopPropagation() },
      h('div', { className: 'modal-head' },
        h('div', null,
          h('p', { className: 'eyebrow' }, 'Mode menu'),
          h('h2', { id: 'menu-planner-title' }, 'Composer un repas')
        ),
        h('div', { className: 'menu-planner-head-actions' },
          h(Button, { variant: 'subtle', onClick: changeWholeMenu }, 'Changer tout'),
          h('button', { type: 'button', className: 'icon-btn', onClick: onClose, 'aria-label': 'Fermer' }, h(Icon, { name: 'close' }))
        )
      ),
      h('div', { className: 'menu-theme-tabs', 'aria-label': 'Style de menu' },
        MENU_THEMES.map(theme => h('button', {
          key: theme.id,
          type: 'button',
          className: theme.id === themeId ? 'active' : '',
          onClick: () => {
            setThemeId(theme.id);
            setOffset(0);
            setItemOffsets({});
          }
        }, theme.label))
      ),
      h('p', { className: 'menu-planner-reason' }, menu.reason),
      h('div', { className: 'menu-planner-grid' },
        menuItems.map((item, index) => h('article', { key: `${item.key}-${item.recipe.id}-${index}`, className: 'menu-planner-card' },
          h('span', { className: 'menu-planner-image', style: item.recipe.image ? { backgroundImage: `url("${recipeCardImageUrl(item.recipe.image)}")` } : {} }),
          h('div', null,
            h('p', { className: 'eyebrow' }, item.label),
            h('h3', null, item.recipe.title),
            h('small', null, [primaryCategory(item.recipe), difficultyText(item.recipe), getRecipeTiming(item.recipe).active ? `Actif ${formatMinutesShort(getRecipeTiming(item.recipe).active)}` : ''].filter(Boolean).join(' · ')),
            item.note && h('p', { className: 'menu-planner-note' }, item.note),
            h('div', { className: 'menu-planner-card-actions' },
              h(Button, { variant: 'subtle', onClick: () => openRecipe(item.recipe.id) }, 'Ouvrir'),
              h(Button, { variant: 'ghost', onClick: () => changeOneItem(index) }, 'Changer')
            )
          )
        ))
      ),
      h('div', { className: 'menu-planner-summary' },
        Number.isFinite(menu.quality) && h('span', null, `Cohérence ${menu.quality}/100`),
        h('span', null, `Charge ${servicePlan.stress.level}`),
        h('span', null, `${menuRecipes.length} fiches`),
        h('span', null, `${shoppingData.groupedItems.length} articles groupés`),
        h('span', null, `${shoppingData.aisleGroups.length} rayons`)
      ),
      h('div', { className: 'menu-service-grid' },
        servicePlan.timeline.length > 0 && h('section', { className: 'menu-service-panel menu-service-panel-wide' },
          h('p', { className: 'eyebrow' }, 'Timeline'),
          servicePlan.timeline.map(group => h('div', { key: group.key, className: 'menu-service-block' },
            h('strong', null, group.label),
            h('ul', null, group.items.map(item => h('li', { key: item }, item)))
          ))
        ),
        h('section', { className: 'menu-service-panel' },
          h('p', { className: 'eyebrow' }, 'Charge mentale'),
          h('strong', null, servicePlan.stress.level),
          h('ul', null, (servicePlan.stress.reasons.length ? servicePlan.stress.reasons : ['Menu simple à coordonner.']).map(item => h('li', { key: item }, item)))
        ),
        h('section', { className: 'menu-service-panel' },
          h('p', { className: 'eyebrow' }, 'Courses'),
          servicePlan.shoppingHints.map(group => h('div', { key: group.label, className: 'menu-service-block' },
            h('strong', null, group.label),
            h('ul', null, group.items.map(item => h('li', { key: item }, item)))
          ))
        ),
        servicePlan.leftovers.length > 0 && h('section', { className: 'menu-service-panel' },
          h('p', { className: 'eyebrow' }, 'Restes'),
          h('ul', null, servicePlan.leftovers.map(item => h('li', { key: item }, item)))
        ),
        h('section', { className: 'menu-service-panel' },
          h('p', { className: 'eyebrow' }, 'Service'),
          h('ul', null, servicePlan.serviceTips.map(item => h('li', { key: item.title }, `${item.title} : ${item.tip}`)))
        ),
        h('section', { className: 'menu-service-panel' },
          h('p', { className: 'eyebrow' }, 'Matériel'),
          h('ul', null, servicePlan.conflicts.map(item => h('li', { key: item }, item)))
        )
      ),
      h('div', { className: 'modal-actions' },
        h(Button, { variant: 'primary', disabled: !menuRecipes.length, onClick: addToShopping }, 'Ajouter le menu aux courses'),
        h(Button, { variant: 'subtle', onClick: changeWholeMenu }, 'Autre menu')
      )
    )
  );
}

function PreferencesPanel({ open, onClose, preferences, setPreferences }) {
  if (!open) return null;
  const update = patch => {
    const next = { ...preferences, ...patch };
    setPreferences(next);
    writeJson(STORAGE_KEYS.preferences, next);
  };
  const density = preferences.density || 'comfort';
  return h('div', { className: 'modal-backdrop', onMouseDown: onClose },
    h('section', { className: 'modal-panel preferences-modal', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Préférences d’affichage', onMouseDown: event => event.stopPropagation() },
      h('div', { className: 'modal-head' },
        h('div', null,
          h('p', { className: 'eyebrow' }, 'Affichage'),
          h('h2', null, 'Préférences')
        ),
        h('button', { type: 'button', className: 'icon-btn', onClick: onClose, 'aria-label': 'Fermer' }, h(Icon, { name: 'close' }))
      ),
      h('div', { className: 'preference-group' },
        h('strong', null, 'Densité des cartes'),
        h('div', { className: 'segmented-control', role: 'group', 'aria-label': 'Densité des cartes' },
          h('button', { type: 'button', className: density === 'compact' ? 'active' : '', onClick: () => update({ density: 'compact' }) }, 'Compact'),
          h('button', { type: 'button', className: density === 'comfort' ? 'active' : '', onClick: () => update({ density: 'comfort' }) }, 'Confort')
        )
      ),
      h('label', { className: 'preference-check' },
        h('input', { type: 'checkbox', checked: Boolean(preferences.largeText), onChange: event => update({ largeText: event.target.checked }) }),
        h('span', null,
          h('strong', null, 'Texte plus lisible'),
          h('small', null, 'Agrandit légèrement les fiches et les panneaux.')
        )
      ),
      h('label', { className: 'preference-check' },
        h('input', { type: 'checkbox', checked: Boolean(preferences.reduceMotion), onChange: event => update({ reduceMotion: event.target.checked }) }),
        h('span', null,
          h('strong', null, 'Animations calmes'),
          h('small', null, 'Réduit les mouvements sans enlever les lumières du thème.')
        )
      )
    )
  );
}

function ToastStack({ toasts, dismissToast }) {
  if (!toasts.length) return null;
  return h('div', { className: 'toast-stack', role: 'status', 'aria-live': 'polite' },
    toasts.map(toast => h('button', {
      key: toast.id,
      type: 'button',
      className: `toast toast-${toast.tone || 'info'}`,
      onClick: () => dismissToast(toast.id)
    },
      h('strong', null, toast.title || 'Cook Note'),
      h('span', null, toast.message)
    ))
  );
}

function QuantityFactorControl({ recipe, factor, setFactor, className = '' }) {
  const servingInfo = getServingInfo(recipe);
  const servingOptions = servingOptionsFor(recipe);
  if (servingInfo && servingOptions.length) {
    const currentTarget = getServingTarget(recipe, factor);
    return h('label', {
      className: ['factor-control serving-control quantity-select-control', className].filter(Boolean).join(' '),
      'aria-label': `Choisir le nombre de ${servingUnitLabel(servingInfo, 2)}`
    },
      h('span', { className: 'factor-label' }, 'Quantité'),
      h('select', {
        className: 'quantity-select',
        value: String(currentTarget),
        onChange: event => setFactor(Number(event.target.value) / servingInfo.base)
      },
        servingOptions.map(value => h('option', { key: value, value: String(value) }, String(value)))
      ),
      h('span', { className: 'quantity-unit' }, servingUnitLabel(servingInfo, currentTarget))
    );
  }

  return h('label', {
    className: ['factor-control quantity-select-control multiplier-select-control', className].filter(Boolean).join(' '),
    'aria-label': 'Multiplier les quantités'
  },
    h('span', { className: 'factor-label' }, 'Quantité'),
    h('select', {
      className: 'quantity-select',
      value: String(factor),
      onChange: event => setFactor(Number(event.target.value))
    },
      [0.25, 0.5, 1, 2, 4].map(value => h('option', {
        key: value,
        value: String(value)
      }, `${String(value).replace('.', ',')}x`))
    ),
    h('span', { className: 'quantity-unit' }, 'fois')
  );
}

function CollectionLinksPanel({ parent, variantRefs, recipesById, openRecipe }) {
  const sortedVariantRefs = sortVariantRefs(variantRefs, recipesById);
  if (!sortedVariantRefs.length) return null;
  return h('section', { id: 'recipe-picker', className: 'recipe-panel variant-picker-panel collection-links-panel' },
    h('div', { className: 'panel-heading' },
      h('div', null,
        h('p', { className: 'eyebrow' }, 'Collection'),
        h('h2', null, parent.title)
      ),
      h('span', { className: 'progress-label' }, `${sortedVariantRefs.length} recette${sortedVariantRefs.length > 1 ? 's' : ''}`)
    ),
    h('div', { className: 'variant-card-grid' },
      sortedVariantRefs.map(variant => {
        const item = recipesById[variant.id];
        if (!item) return null;
        const image = item.image || parent.image;
        const variantLabel = getRecipeVariantLabel(item, recipesById);
        const quickFacts = [difficultyText(item), getRecipeServiceSummary(item)].filter(Boolean);
        return h('button', {
          key: variant.id,
          type: 'button',
          className: 'variant-card',
          style: { '--card-accent': getCategoryColor(item) },
          onClick: () => openRecipe(variant.id)
        },
          image && h('span', { className: 'variant-card-bg', style: { backgroundImage: `url("${image}")` } }),
          h('span', { className: 'variant-card-body' },
            h('small', null, categoryLine(item)),
            h('strong', null, variant.label || item.title),
            variantLabel && h('em', null, variantLabel)
          ),
          quickFacts.length > 0 && h('span', { className: 'variant-card-quicklook', 'aria-label': 'Repères rapides' },
            quickFacts.map(fact => h('span', { key: fact }, fact))
          )
        );
      })
    )
  );
}

function RecipeBreadcrumb({ recipe, selectedRecipe, showVariants, goHome, openRecipe }) {
  const breadcrumbRecipe = showVariants ? recipe : (selectedRecipe || recipe);
  const category = primaryCategory(breadcrumbRecipe);
  const categoryParentId = CATEGORY_PARENT_IDS[category];
  const isRootParent = showVariants && !breadcrumbRecipe.master;
  const repeatsTitle = normalizeText(category) === normalizeText(breadcrumbRecipe.title);
  const openCategory = () => categoryParentId ? openRecipe(categoryParentId) : goHome();
  const openCurrentParent = () => openRecipe(breadcrumbRecipe.id);
  return h('nav', { className: 'recipe-breadcrumb', 'aria-label': 'Fil d’Ariane' },
    h('button', { type: 'button', onClick: goHome }, 'Cook Note'),
    h('span', null, '/'),
    !isRootParent && !repeatsTitle && h(React.Fragment, null,
      categoryParentId
        ? h('button', { type: 'button', onClick: openCategory }, category)
        : h('span', null, category),
      h('span', null, '/')
    ),
    isRootParent
      ? h('button', { type: 'button', onClick: openCurrentParent }, breadcrumbRecipe.title)
      : h('strong', null, breadcrumbRecipe.title)
  );
}

function LinkedRecipesBlock({ links, openRecipe }) {
  const [expanded, setExpanded] = useState(false);
  const linkKey = links.map(item => item.id).join('|');
  useEffect(() => setExpanded(false), [linkKey]);
  if (!links.length) return null;
  const hasExtra = links.length > 3;
  const visibleLinks = hasExtra && !expanded ? links.slice(0, 3) : links;
  const hiddenCount = Math.max(0, links.length - 3);
  const groups = visibleLinks.reduce((acc, item) => {
    const role = item.role || 'Recette liée';
    if (!acc.has(role)) acc.set(role, []);
    acc.get(role).push(item);
    return acc;
  }, new Map());
  return h('div', { className: 'linked-recipes-block' },
    h('p', { className: 'eyebrow' }, 'Recettes liées'),
    Array.from(groups.entries()).map(([role, items]) => h('div', { key: role, className: 'linked-recipe-group' },
      h('div', { className: 'linked-recipe-group-title' }, role),
      h('div', { className: 'linked-recipe-list' },
        items.map(item => h('button', {
          key: item.id,
          type: 'button',
          className: 'linked-recipe-item',
          style: { '--card-accent': getCategoryColor(item.recipe) },
          onClick: () => openRecipe(item.id)
        },
          h('span', { className: 'linked-recipe-thumb', style: item.recipe.image ? { backgroundImage: `url("${item.recipe.image}")` } : {} }),
          h('span', { className: 'linked-recipe-copy' },
            h('small', null, primaryCategory(item.recipe)),
            h('strong', null, item.recipe.title)
          )
        ))
      )
    )),
    hasExtra && h('button', {
      type: 'button',
      className: expanded ? 'linked-recipe-toggle active' : 'linked-recipe-toggle',
      onClick: () => setExpanded(value => !value),
      'aria-expanded': expanded
    }, expanded ? 'Masquer les recettes liées' : `Voir ${hiddenCount} autre${hiddenCount > 1 ? 's' : ''} recette${hiddenCount > 1 ? 's' : ''}`)
  );
}

function PracticalSectionsBlock({ sections, inlineTargets, openRecipe, techniqueTargets, openTechnique }) {
  if (!sections.length) return null;
  return h('div', { className: 'practical-block' },
    h('p', { className: 'eyebrow' }, 'Repères'),
    h('h2', null, 'Infos pratiques'),
    sections.map(section => h('section', { key: section.key, className: 'practical-section' },
      h('h3', null, section.title),
      h('ul', null, section.items.map(item => h('li', { key: item }, renderLinkedText(item, inlineTargets || [], openRecipe, techniqueTargets || [], openTechnique))))
    ))
  );
}

function PrepTimelineBlock({ recipe }) {
  const items = getPrepTimeline(recipe);
  if (!items.length) return null;
  return h('div', { className: 'prep-timeline-block' },
    h('p', { className: 'eyebrow' }, 'Organisation'),
    h('h2', null, 'Repères de préparation'),
    h('ol', null, items.map(item => h('li', { key: item.label },
      h('strong', null, item.label),
      h('span', null, item.value)
    )))
  );
}

function PersonalRecipeNotes({ recipeId, value, updatePersonalRecipeNote }) {
  const note = value || {};
  const status = note.status || '';
  const text = note.text || '';
  const update = patch => updatePersonalRecipeNote?.(recipeId, { ...note, ...patch, updatedAt: Date.now() });
  return h('div', { className: 'personal-notes-card' },
    h('div', { className: 'personal-notes-head' },
      h('div', null,
        h('p', { className: 'eyebrow' }, 'Carnet perso'),
        h('h2', null, 'Note privée')
      ),
      status && h('span', null, status)
    ),
    h('label', { className: 'field' },
      h('span', null, 'Statut'),
      h('select', {
        value: status,
        onChange: event => update({ status: event.target.value })
      },
        h('option', { value: '' }, 'Non classée'),
        h('option', { value: 'À refaire' }, 'À refaire'),
        h('option', { value: 'Testée / validée' }, 'Testée / validée'),
        h('option', { value: 'À ajuster' }, 'À ajuster')
      )
    ),
    h('label', { className: 'field personal-note-field' },
      h('span', null, 'Mémo'),
      h('textarea', {
        value: text,
        rows: 4,
        maxLength: 600,
        placeholder: 'Ex : moins de sucre, cuisson +3 min, validée pour 8 personnes...',
        onChange: event => update({ text: event.target.value })
      })
    ),
    (status || text) && h('button', {
      type: 'button',
      className: 'personal-note-clear',
      onClick: () => updatePersonalRecipeNote?.(recipeId, null)
    }, 'Effacer la note')
  );
}

function RecipeQuickFacts({ recipe, factor, stepTotal, needsVariantSelection = false, hasVariantSelection = true }) {
  if (needsVariantSelection && !hasVariantSelection) {
    return h('section', { className: 'recipe-summary-panel recipe-summary-empty', 'aria-label': 'Résumé de la recette' },
      h('div', { className: 'recipe-summary-head' },
        h('p', { className: 'eyebrow' }, 'Résumé'),
        h('h2', null, 'Fiche rapide')
      ),
      h('p', { className: 'recipe-summary-message' }, 'Sélectionne une variante pour afficher les informations de la fiche rapide.')
    );
  }
  const seasons = (recipe.seasons || []).filter(item => item !== 'Toutes saisons');
  const equipment = getRecipeEquipment(recipe);
  const timing = getRecipeTiming(recipe);
  const facts = [
    { label: 'Temps actif', value: formatMinutesShort(timing.active) || 'A estimer' },
    timing.cook && { label: 'Cuisson', value: formatMinutesShort(timing.cook) },
    timing.rest && { label: 'Repos / froid', value: formatMinutesShort(timing.rest) },
    { label: 'Difficulté', value: difficultyText(recipe).replace('Difficulté ', '') },
    recipe.yield && { label: 'Quantité', value: getQuantityDisplay(recipe, factor) },
    { label: 'Ingrédients', value: `${countIngredients(recipe)} ingrédients` },
    { label: 'Étapes', value: `${stepTotal || getRecipeSteps(recipe).length} étapes` },
    seasons.length && { label: 'Saison', value: seasons.slice(0, 2).join(' / ') },
  ].filter(Boolean);
  return h('section', { className: 'recipe-summary-panel', 'aria-label': 'Résumé de la recette' },
    h('div', { className: 'recipe-summary-head' },
      h('p', { className: 'eyebrow' }, 'Résumé'),
      h('h2', null, 'Fiche rapide')
    ),
    h('div', { className: 'recipe-quick-facts' },
      facts.map(item => h('div', { key: item.label, className: 'recipe-quick-fact' },
        h('span', null, item.label),
        h('strong', null, item.value)
      ))
    ),
    equipment.length > 0 && h('div', { className: 'recipe-equipment-strip' },
      h('strong', null, 'Matériel nécessaire'),
      h('ul', null, equipment.map(item => h('li', { key: item }, item)))
    )
  );
}

function cleanVariantGroupLabel(label) {
  return String(label || 'Variante').replace(/^\d+\)\s*/, '').replace(/^variante\s*:?\s*/i, '').trim();
}

function InlineVariantPicker({ recipe, options, selectedIndex, onSelect }) {
  if (!options.length) return null;
  const selectedOption = options.find(option => option.index === selectedIndex) || null;
  const selectedRecipe = selectedOption ? buildInlineVariantRecipe(recipe, selectedOption) : null;
  const timing = selectedRecipe ? getRecipeTiming(selectedRecipe) : {};
  const baseCount = getInlineBaseIngredientGroups(recipe)
    .reduce((sum, group) => sum + (group.items || []).length, 0);
  const selectedIngredientCount = selectedOption ? baseCount + (selectedOption.group?.items || []).length : 0;
  const summary = selectedOption ? [
    `${selectedIngredientCount} ingr\u00e9dients`,
    `${selectedOption.steps.length || getRecipeSteps(recipe).length} \u00e9tapes`,
    timing.active && `Actif ${formatMinutesShort(timing.active)}`,
    timing.cook && `Cuisson ${formatMinutesShort(timing.cook)}`,
    timing.rest && `Repos ${formatMinutesShort(timing.rest)}`
  ].filter(Boolean) : [];

  return h('section', { className: 'recipe-panel variant-choice-panel', 'aria-label': 'Choix de variante' },
    h('div', { className: 'panel-heading' },
      h('div', null,
        h('p', { className: 'eyebrow' }, 'Variante'),
        h('h2', null, 'Choisir la pr\u00e9paration')
      ),
      h('span', { className: 'progress-label' }, `${options.length} option${options.length > 1 ? 's' : ''}`)
    ),
    h('div', { className: 'variant-choice-tabs' },
      options.map(option => {
        const active = Boolean(selectedOption) && option.index === selectedOption.index;
        return h('button', {
          key: `${recipe.id}:variant:${option.index}`,
          type: 'button',
          className: active ? 'variant-choice-button active' : 'variant-choice-button',
          onClick: () => onSelect(option.index),
          'aria-pressed': active
        },
          h('strong', null, option.label || 'Variante'),
          h('span', null, `${(option.group?.items || []).length} ingr\u00e9dients`),
          h('small', null, `${option.steps.length || getRecipeSteps(recipe).length} \u00e9tapes`)
        );
      })
    ),
    h('div', { className: 'variant-choice-summary' },
      selectedOption
        ? [
          h('strong', { key: 'label' }, selectedOption.label || 'Variante active'),
          ...summary.map(item => h('span', { key: item }, item))
        ]
        : [
          h('strong', { key: 'label' }, 'Aucune variante sélectionnée'),
          h('span', { key: 'hint' }, 'Sélectionne une variante pour afficher les détails.')
        ]
    )
  );
}

function RecipeView({
  recipe,
  isFavorite,
  toggleFavorite,
  shoppingIds,
  toggleShopping,
  openShoppingBasket,
  goHome,
  openRecipe,
  recipes,
  recipesById,
  checked,
  setCheckedWithHistory,
  canUndo,
  canRedo,
  undo,
  redo,
  setTagFilter,
  openTechnique,
  notify,
  personalRecipeNote,
  updatePersonalRecipeNote
}) {
  const [factor, setFactor] = useState(1);
  const variantRefs = useMemo(() => (
    getVariantRefs(recipe).length
      ? sortVariantRefs(getLeafVariantRefs(recipe, recipesById), recipesById)
      : []
  ), [recipe.id, recipesById]);
  const showVariants = variantRefs.length > 0;
  const leafRecipeCount = showVariants ? countLeafRecipes(recipe, recipesById) : 0;
  const hasSelectedVariant = !showVariants;
  const selectedRecipe = recipe;
  const inlineTargets = useMemo(() => buildInlineRecipeTargets(recipes), [recipes]);
  const techniqueTargets = useMemo(() => buildTechniqueTargets(), []);
  const detailKey = hasSelectedVariant ? selectedRecipe.id : recipe.id;
  const [shareOpen, setShareOpen] = useState(false);
  const [exportCopied, setExportCopied] = useState(false);
  const [mobileDetailTab, setMobileDetailTab] = useState('ingredients');
  const [openIngredientGroups, setOpenIngredientGroups] = useState({});
  const mobileSwipeStartRef = useRef(null);
  const completedRef = useRef('');
  const inlineVariantOptions = useMemo(() => getInlineVariantOptions(selectedRecipe), [selectedRecipe]);
  const needsInlineVariantSelection = inlineVariantOptions.length > 0;
  const selectedInlineVariantGroup = needsInlineVariantSelection
    ? inlineVariantOptions.find(({ index }) => Boolean(openIngredientGroups[`${detailKey}:group:${index}`])) || null
    : null;
  const canShowSteps = hasSelectedVariant && (!needsInlineVariantSelection || Boolean(selectedInlineVariantGroup));
  const displaySteps = canShowSteps ? getSelectedInlineVariantSteps(selectedRecipe, selectedInlineVariantGroup) : [];
  const stepScopeKey = selectedInlineVariantGroup ? `${detailKey}:variant-group:${selectedInlineVariantGroup.index}` : detailKey;
  const stepTotal = displaySteps.length;
  const fallbackStepTotal = getRecipeSteps(selectedRecipe).length;
  const effectiveStepTotal = stepTotal || fallbackStepTotal;
  const stepMetaText = needsInlineVariantSelection && !selectedInlineVariantGroup
    ? `${inlineVariantOptions.length} version${inlineVariantOptions.length > 1 ? 's' : ''}`
    : `${effectiveStepTotal} étape${effectiveStepTotal > 1 ? 's' : ''}`;
  const doneSteps = Object.keys(checked).filter(key => key.startsWith(`${stepScopeKey}:step:`) && checked[key]).length;
  const progress = stepTotal ? Math.round((doneSteps / stepTotal) * 100) : 0;
  const canAddToShopping = hasSelectedVariant && canShowSteps;
  const isInShopping = hasSelectedVariant && shoppingIds.includes(detailKey);
  const canFavorite = hasSelectedVariant && !isMasterRecipe(selectedRecipe);
  const recipeAllergens = hasSelectedVariant ? getRecipeAllergens(selectedRecipe) : [];
  const averageWeights = hasSelectedVariant ? getRecipeAverageWeights(selectedRecipe) : [];
  const linkedRecipes = hasSelectedVariant ? getLinkedRecipeRefs(selectedRecipe, recipesById) : [];
  const practicalSections = hasSelectedVariant ? getRecipePracticalSections(selectedRecipe) : [];
  const displayNotes = hasSelectedVariant ? getDisplayNotes(selectedRecipe, practicalSections) : [];
  const notesCount = recipeAllergens.length + averageWeights.length + linkedRecipes.length + practicalSections.length + displayNotes.length;
  const selectedGroupLabel = selectedInlineVariantGroup?.group?.group || '';
  const mobileTabOrder = ['ingredients', 'steps', 'notes'];

  function handleMobileTabSwipeStart(event) {
    if (!event.touches || event.touches.length !== 1) return;
    mobileSwipeStartRef.current = {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY
    };
  }

  function handleMobileTabSwipeEnd(event) {
    if (!mobileSwipeStartRef.current || !event.changedTouches || event.changedTouches.length !== 1) return;
    const start = mobileSwipeStartRef.current;
    mobileSwipeStartRef.current = null;
    const deltaX = event.changedTouches[0].clientX - start.x;
    const deltaY = event.changedTouches[0].clientY - start.y;
    if (Math.abs(deltaX) < 55 || Math.abs(deltaX) < Math.abs(deltaY) * 1.35) return;
    setMobileDetailTab(current => {
      const currentIndex = mobileTabOrder.indexOf(current);
      if (currentIndex === -1) return 'ingredients';
      const direction = deltaX < 0 ? 1 : -1;
      const nextIndex = Math.max(0, Math.min(mobileTabOrder.length - 1, currentIndex + direction));
      return mobileTabOrder[nextIndex];
    });
  }

  useEffect(() => {
    setFactor(1);
    completedRef.current = '';
    setMobileDetailTab('ingredients');
    setOpenIngredientGroups({});
    setExportCopied(false);
  }, [recipe.id]);

  useEffect(() => {
    setOpenIngredientGroups({});
  }, [detailKey]);

  useEffect(() => {
    if (!stepTotal || doneSteps !== stepTotal || completedRef.current === stepScopeKey) return;
    completedRef.current = stepScopeKey;
    if (window.confetti) {
      window.confetti({ particleCount: 110, spread: 70, origin: { y: .65 } });
      setTimeout(() => window.confetti({ particleCount: 50, angle: 60, spread: 55, origin: { x: 0 } }), 220);
      setTimeout(() => window.confetti({ particleCount: 50, angle: 120, spread: 55, origin: { x: 1 } }), 380);
    }
  }, [stepScopeKey, doneSteps, stepTotal]);

  function toggle(key) {
    setCheckedWithHistory(prev => ({ ...prev, [key]: !prev[key] }));
  }

  function toggleIngredientGroup(groupKey) {
    setOpenIngredientGroups(prev => {
      const isOpening = !prev[groupKey];
      if (!needsInlineVariantSelection || !isOpening) return { ...prev, [groupKey]: !prev[groupKey] };
      const next = { ...prev };
      inlineVariantOptions.forEach(({ index }) => {
        delete next[`${detailKey}:group:${index}`];
      });
      next[groupKey] = true;
      return next;
    });
  }

  function selectInlineVariant(index) {
    setOpenIngredientGroups(prev => {
      const next = { ...prev };
      inlineVariantOptions.forEach(option => {
        delete next[`${detailKey}:group:${option.index}`];
      });
      next[`${detailKey}:group:${index}`] = true;
      return next;
    });
  }

  const heroUsesHomeImage = showVariants;
  const heroImage = heroUsesHomeImage ? HERO_IMAGE : (selectedRecipe.image || recipe.image);
  const heroEyebrow = isMasterRecipe(recipe) ? 'Catégorie' : primaryCategory(recipe);
  const heroStyle = heroImage
    ? {
      backgroundImage: heroUsesHomeImage
        ? `linear-gradient(110deg, rgba(4,4,5,.92), rgba(4,4,5,.54) 48%, rgba(4,4,5,.84)), url("${heroImage}")`
        : `linear-gradient(90deg, rgba(4,4,5,.92), rgba(4,4,5,.50)), url("${heroImage}")`
    }
    : {};
  const detailAccent = getCategoryColor(selectedRecipe);
  const detailStyle = { '--accent': detailAccent, '--accent-2': detailAccent };

  return h('main', { className: 'recipe-view', style: detailStyle },
    h('section', {
      className: heroImage ? (heroUsesHomeImage ? 'recipe-detail-hero has-photo parent-hero' : 'recipe-detail-hero has-photo') : 'recipe-detail-hero',
      style: heroStyle
    },
      h('div', { className: 'detail-hero-copy' },
        heroUsesHomeImage && h('img', { className: 'detail-hero-logo', src: COOK_NOTE_LOGO, alt: 'Cook Note' }),
        h(RecipeBreadcrumb, { recipe, selectedRecipe, showVariants, goHome, openRecipe }),
        h('p', { className: 'eyebrow' }, heroEyebrow),
        h('h1', null, recipe.title),
        h('div', { className: 'detail-meta' },
          showVariants
            ? h('span', { key: 'recipes' }, `${leafRecipeCount} recette${leafRecipeCount > 1 ? 's' : ''}`)
            : [
              h('span', { key: 'difficulty' }, difficultyText(selectedRecipe)),
              h('span', { key: 'nutri', className: `nutri-score nutri-${getNutriScore(selectedRecipe).toLowerCase()}` }, `Nutri ${getNutriScore(selectedRecipe)}`),
              selectedRecipe.yield && h('span', { key: 'yield' }, getQuantityDisplay(selectedRecipe, factor)),
              h('span', { key: 'ingredients' }, `${countIngredients(selectedRecipe)} ingrédients`),
              h('span', { key: 'steps' }, stepMetaText)
            ]
        ),
        hasSelectedVariant && !isMasterRecipe(selectedRecipe) && h('div', { className: 'detail-quantity-row' },
          h(QuantityFactorControl, { recipe: selectedRecipe, factor, setFactor, className: 'detail-quantity-control' })
        ),
        h('div', { className: 'detail-actions' },
          hasSelectedVariant && h(Button, { variant: isInShopping ? 'primary' : 'ghost', disabled: !canAddToShopping, onClick: () => canAddToShopping && toggleShopping(detailKey, factor) }, isInShopping ? 'Dans les courses' : 'Ajouter aux courses'),
          hasSelectedVariant && !isMasterRecipe(selectedRecipe) && h(Button, {
            variant: 'subtle',
            onClick: () => copyText(recipeExportText(selectedRecipe, factor)).then(() => {
              setExportCopied(true);
              notify?.('Fiche recette copiée');
            })
          }, exportCopied ? 'Fiche copiée' : 'Copier fiche'),
          h(Button, { variant: 'ghost', className: 'icon-square', onClick: () => setShareOpen(true), title: 'Partager', ariaLabel: 'Partager' }, h(Icon, { name: 'share' })),
          selectedRecipe.video && h('a', { className: 'btn btn-ghost', href: selectedRecipe.video, target: '_blank', rel: 'noreferrer' }, 'Voir la vidéo'),
          h(Button, { variant: 'ghost', className: 'icon-square', onClick: () => window.print(), title: 'Imprimer', ariaLabel: 'Imprimer' }, h(Icon, { name: 'print' })),
          canFavorite && h(Button, { variant: 'ghost', className: isFavorite ? 'icon-square favorite-action active' : 'icon-square favorite-action', onClick: () => toggleFavorite(detailKey), title: isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris', ariaLabel: isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris' }, h(Icon, { name: 'heart', filled: isFavorite }))
        )
      )
    ),
    showVariants && h(CollectionLinksPanel, {
      parent: recipe,
      variantRefs,
      recipesById,
      openRecipe
    }),
    hasSelectedVariant && !isMasterRecipe(selectedRecipe) && h(RecipeQuickFacts, {
      recipe: selectedRecipe,
      factor,
      stepTotal: effectiveStepTotal,
      needsVariantSelection: needsInlineVariantSelection,
      hasVariantSelection: !needsInlineVariantSelection || Boolean(selectedInlineVariantGroup)
    }),
    hasSelectedVariant && needsInlineVariantSelection && h(InlineVariantPicker, {
      recipe: selectedRecipe,
      options: inlineVariantOptions,
      selectedIndex: selectedInlineVariantGroup?.index,
      onSelect: selectInlineVariant
    }),
    hasSelectedVariant && h('div', { className: 'recipe-tabs', 'aria-label': 'Sections de la recette' },
      [
        { key: 'ingredients', label: 'Ingrédients', count: countIngredients(selectedRecipe) },
        { key: 'steps', label: 'Étapes', count: effectiveStepTotal },
        { key: 'notes', label: 'Avant', count: notesCount }
      ].map(tab => h('button', {
        key: tab.key,
        type: 'button',
        className: mobileDetailTab === tab.key ? 'active' : '',
        'aria-selected': mobileDetailTab === tab.key,
        onClick: () => setMobileDetailTab(tab.key)
      }, h('span', null, tab.label), h('small', null, tab.count)))
    ),
    hasSelectedVariant && needsInlineVariantSelection && h('div', { className: 'mobile-recipe-guidance' },
      canShowSteps
        ? `Variante active : ${selectedGroupLabel}. Ingr\u00e9dients et \u00e9tapes suivent ce choix.`
        : 'Choisis une variante pour afficher les ingr\u00e9dients et les \u00e9tapes correspondantes.'
    ),
    hasSelectedVariant && h('div', {
      className: 'recipe-detail-grid',
      onTouchStart: handleMobileTabSwipeStart,
      onTouchEnd: handleMobileTabSwipeEnd
    },
      h('section', { className: mobileDetailTab === 'ingredients' ? 'recipe-panel ingredients-panel active-tab-panel' : 'recipe-panel ingredients-panel' },
        h('div', { className: 'panel-heading' },
          h('div', null, h('p', { className: 'eyebrow' }, 'Mise en place'), h('h2', null, 'Ingrédients'))
        ),
        needsInlineVariantSelection && h('div', { className: 'inline-choice-card' },
          h('strong', null, 'Variante active'),
          h('p', null, canShowSteps
            ? `Tu suis actuellement "${selectedGroupLabel}". Le s\u00e9lecteur au-dessus change aussi les ingr\u00e9dients et les \u00e9tapes.`
            : 'Choisis une variante au-dessus pour afficher les ingr\u00e9dients d\u00e9taill\u00e9s et les \u00e9tapes correspondantes.')
        ),
        (selectedRecipe.ingredients || []).map((group, groupIndex) => {
          const groupKey = `${detailKey}:group:${groupIndex}`;
          const collapsible = isVariantIngredientGroup(group, selectedRecipe.ingredients || [], selectedRecipe);
          const isSelectedInlineVariant = collapsible && selectedInlineVariantGroup?.index === groupIndex;
          const isOpen = !collapsible || Boolean(openIngredientGroups[groupKey]) || isSelectedInlineVariant;
          return h('div', { className: collapsible ? 'ingredient-group collapsible-ingredient-group' : 'ingredient-group', key: groupKey },
            collapsible
              ? h('button', { type: 'button', className: 'ingredient-group-toggle', onClick: () => toggleIngredientGroup(groupKey), 'aria-expanded': isOpen }, [
                  h('span', { key: 'label' }, group.group || 'Variante'),
                  h('span', { key: 'icon', className: 'ingredient-toggle-icon' }, isOpen ? '\u2212' : '+')
                ])
              : group.recipeId && recipesById[group.recipeId]
                ? h('button', { type: 'button', className: 'ingredient-group-link', onClick: () => openRecipe(group.recipeId) }, group.group || recipesById[group.recipeId].title)
                : h('h3', null, renderLinkedText(group.group || 'Base', inlineTargets, openRecipe, techniqueTargets, openTechnique)),
            isOpen && h('ul', null, (group.items || []).map((item, itemIndex) => {
              const key = `${detailKey}:ingredient:${groupIndex}:${itemIndex}`;
              return h('li', { key },
                h('label', null,
                  h('input', { type: 'checkbox', checked: Boolean(checked[key]), onChange: () => toggle(key) }),
                  h('span', null, renderLinkedText(scaleIngredient(item, factor), inlineTargets, openRecipe, techniqueTargets, openTechnique))
                )
              );
            })),
            isOpen && (group.note || (group.notes || []).length > 0) && h('div', { className: 'ingredient-group-note' },
              group.note && h('p', null, renderLinkedText(group.note, inlineTargets, openRecipe, techniqueTargets, openTechnique)),
              (group.notes || []).map((note, noteIndex) => h('p', { key: `${groupKey}:note:${noteIndex}` }, renderLinkedText(note, inlineTargets, openRecipe, techniqueTargets, openTechnique)))
            )
          );
        })
      ),
      hasSelectedVariant && h('section', { className: mobileDetailTab === 'steps' ? 'recipe-panel steps-panel active-tab-panel' : 'recipe-panel steps-panel' },
        h('div', { className: 'panel-heading' },
          h('div', null, h('p', { className: 'eyebrow' }, 'Exécution'), h('h2', null, 'Étapes')),
          h('div', { className: 'steps-panel-tools' },
            needsInlineVariantSelection && selectedGroupLabel && h('span', { className: 'progress-label' }, selectedGroupLabel)
          )
        ),
        canShowSteps && h('div', { className: 'progress-track' }, h('span', { style: { width: `${progress}%` } })),
        canShowSteps && h('div', { className: 'before-start-card' },
          h('div', null,
            h('strong', null, 'Avant de commencer'),
            h('p', null, 'Consulte les notes, allergènes et points techniques avant de lancer la recette.')
          ),
          h('button', { type: 'button', onClick: () => setMobileDetailTab('notes') }, 'Voir les notes')
        ),
        !canShowSteps
          ? h('div', { className: 'choice-empty-state variant-step-empty' },
            h('strong', null, 'Choisis un groupe d’ingrédients'),
            h('p', null, 'Ouvre un groupe d’ingrédients pour afficher les étapes correspondantes.')
          )
          : h('ol', { className: 'step-list' },
          displaySteps.map((step, index) => {
            const key = `${stepScopeKey}:step:${index}`;
            return h('li', { key, className: checked[key] ? 'done' : '' },
              h('label', null,
                h('input', { type: 'checkbox', checked: Boolean(checked[key]), onChange: () => toggle(key) }),
                h('span', { className: 'step-number' }, String(index + 1).padStart(2, '0')),
                h('span', { className: 'step-text' }, renderLinkedText(step, inlineTargets, openRecipe, techniqueTargets, openTechnique))
              )
            );
          })
        )
      ),
      hasSelectedVariant && h('aside', { className: mobileDetailTab === 'notes' ? 'recipe-panel notes-panel active-tab-panel' : 'recipe-panel notes-panel' },
        h('div', { className: 'notes-panel-head' },
          h('p', { className: 'eyebrow' }, 'Mémo'),
          h('h2', { className: 'read-before-title' }, 'Avant de commencer')
        ),
        h('div', { className: 'allergen-card' },
          h('p', { className: 'eyebrow' }, 'Allergènes'),
          recipeAllergens.length
            ? h('ul', { className: 'allergen-list' }, recipeAllergens.map(allergen => h('li', { key: `${detailKey}:allergen:${allergen}` }, allergen)))
            : h('p', { className: 'allergen-empty' }, 'Aucun allergène majeur détecté dans les ingrédients.')
        ),
        averageWeights.length > 0 && h('div', { className: 'average-weight-card' },
          h('p', { className: 'eyebrow' }, 'Poids moyens'),
          h('dl', null, averageWeights.map(item =>
            h(React.Fragment, { key: `${detailKey}:average:${item.label}` },
              h('dt', null, item.label),
              h('dd', null, item.value)
            )
          ))
        ),
        h(PersonalRecipeNotes, {
          recipeId: detailKey,
          value: personalRecipeNote,
          updatePersonalRecipeNote
        }),
        h(PrepTimelineBlock, { recipe: selectedRecipe }),
        h(LinkedRecipesBlock, { links: linkedRecipes, openRecipe }),
        h(PracticalSectionsBlock, { sections: practicalSections, inlineTargets, openRecipe, techniqueTargets, openTechnique }),
        displayNotes.length > 0 && h('div', { className: 'free-notes-block' },
          h('p', { className: 'eyebrow' }, 'Notes'),
          h('h2', null, 'Astuces et liens'),
          h('ul', null, displayNotes.map((note, index) => h('li', { key: `${detailKey}:note:${index}` }, renderLinkedText(sanitizeNoteHtml(note), inlineTargets, openRecipe, techniqueTargets, openTechnique))))
        ),
        (selectedRecipe.technical || recipe.technical || []).length > 0 && h('div', { className: 'technical-card' },
          h('p', { className: 'eyebrow' }, 'Fiche technique'),
          h('dl', null, (selectedRecipe.technical || recipe.technical || []).map((item, index) =>
            h(React.Fragment, { key: `${detailKey}:technical:${index}` },
              h('dt', null, renderLinkedText(item.label || item.title || 'Point clé', inlineTargets, openRecipe, techniqueTargets, openTechnique)),
              h('dd', null, renderLinkedText(item.value || item.text || '', inlineTargets, openRecipe, techniqueTargets, openTechnique))
            )
          ))
        )
      )
    ),
    h(SharePanel, { open: shareOpen, onClose: () => setShareOpen(false), recipe: selectedRecipe, notify })
  );
}

function App() {
  const rawRecipes = window.RECIPES && typeof window.RECIPES === 'object' ? window.RECIPES : {};
  const recipes = useMemo(() => {
    const baseRecipesById = Object.fromEntries(Object.entries(rawRecipes).map(([id, recipe]) => [id, { id, ...recipe }]));
    return Object.entries(rawRecipes).map(([id, recipe]) => {
      const tagsExtracted = extractTags(recipe);
      return { id, tagsExtracted, searchText: getRecipeSearchText(recipe, tagsExtracted, baseRecipesById), ...recipe };
    }).sort((a, b) => a.title.localeCompare(b.title, 'fr'));
  }, []);
  const recipesById = useMemo(() => Object.fromEntries(recipes.map(recipe => [recipe.id, recipe])), [recipes]);
  const homeCatalogRecipes = useMemo(() => recipes.filter(recipe => !recipe.master), [recipes]);
  const searchableRecipes = useMemo(() => recipes.filter(recipe => !isMasterRecipe(recipe)), [recipes]);
  const currentSeason = useMemo(() => getCurrentSeason(), []);

  const [query, setQuery] = useState(() => new URLSearchParams(window.location.search).get('q') || '');
  const searchFilterQuery = useDebouncedValue(query, 120);
  const [searchOpen, setSearchOpen] = useState(false);
  const [season, setSeason] = useState('');
  const [seasonCategory, setSeasonCategory] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [activePage, setActivePage] = useState(() => getPathPage());
  const [targetTechniqueId, setTargetTechniqueId] = useState(() => getInitialTechnique());
  const [onlyFavorites, setOnlyFavorites] = useState(() => new URLSearchParams(window.location.search).get('view') === '__favs__');
  const [favoriteCollection, setFavoriteCollection] = useState('');
  const [activeId, setActiveId] = useState(() => getInitialRecipe());
  const [favorites, setFavorites] = useState(() => readStoredList(STORAGE_KEYS.favorites, STORAGE_KEYS.legacyFavorites));
  const [shoppingIds, setShoppingIds] = useState(() => readStoredList(STORAGE_KEYS.shopping, []));
  const [shoppingFactors, setShoppingFactors] = useState(() => readJson(STORAGE_KEYS.shoppingFactors, {}));
  const [checked, setChecked] = useState({});
  const [historyVersion, setHistoryVersion] = useState(0);
  const [shoppingOpen, setShoppingOpen] = useState(false);
  const [menuPlannerOpen, setMenuPlannerOpen] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [preferences, setPreferences] = useState(() => ({ density: 'comfort', largeText: false, reduceMotion: false, ...readJson(STORAGE_KEYS.preferences, {}) }));
  const [recentRecipeIds, setRecentRecipeIds] = useState(() => readStoredList(STORAGE_KEYS.recentRecipes, []));
  const [recentSearches, setRecentSearches] = useState(() => readStoredList(STORAGE_KEYS.recentSearches, []));
  const [personalNotes, setPersonalNotes] = useState(() => readJson(STORAGE_KEYS.personalNotes, {}));
  const [toasts, setToasts] = useState([]);
  const searchRef = useRef(null);
  const homeScrollRef = useRef(Number(sessionStorage.getItem(STORAGE_KEYS.homeScroll)) || 0);
  const restoreHomeScrollRef = useRef(false);
  const pendingScrollModeRef = useRef('top');
  const lastRouteKeyRef = useRef(currentScrollRouteKey());
  const historyRef = useRef([{}]);
  const historyIndexRef = useRef(0);

  const activeRecipe = activeId ? recipesById[activeId] : null;
  const activeSeoRecipe = activeRecipe;
  const shoppingRecipes = useMemo(() => shoppingIds.map(id => recipesById[id]).filter(Boolean), [shoppingIds, recipesById]);
  const recentRecipes = useMemo(() => recentRecipeIds.map(id => recipesById[id]).filter(recipe => recipe && !isMasterRecipe(recipe)), [recentRecipeIds, recipesById]);
  const monthlyAdditionRecipes = useMemo(() => getVisibleMonthlyAdditions(MONTHLY_ADDITIONS)
    .map(item => recipesById[item.id])
    .filter(Boolean), [recipesById]);
  const hasRecipeFilters = Boolean(query.trim() || season || seasonCategory || tagFilter || onlyFavorites);
  const catalogRecipes = useMemo(() => hasRecipeFilters ? searchableRecipes : homeCatalogRecipes, [hasRecipeFilters, homeCatalogRecipes, searchableRecipes]);
  const allSeasons = useMemo(() => uniq([...SEASONS, ...searchableRecipes.flatMap(recipe => recipe.seasons || [])]).filter(item => item !== 'Toutes saisons'), [searchableRecipes]);

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  }, []);

  useEffect(() => {
    const legacyVariant = new URLSearchParams(window.location.search).get('variant');
    if (legacyVariant && recipesById[legacyVariant]) {
      history.replaceState('', document.title, getRecipeUrl(legacyVariant));
    }
  }, [recipesById]);

  useEffect(() => {
    const mode = pendingScrollModeRef.current;
    if (mode === 'none') return undefined;
    const top = mode === 'restore' ? readScrollPositionForCurrentRoute() : 0;
    pendingScrollModeRef.current = 'top';
    const applyScroll = () => window.scrollTo({ top, left: 0, behavior: 'auto' });
    applyScroll();
    let secondFrame = 0;
    const firstFrame = requestAnimationFrame(() => {
      applyScroll();
      secondFrame = requestAnimationFrame(applyScroll);
    });
    return () => {
      cancelAnimationFrame(firstFrame);
      cancelAnimationFrame(secondFrame);
    };
  }, [activeRecipe?.id, activePage, targetTechniqueId]);

  useEffect(() => {
    updateDocumentMeta(activeSeoRecipe, recipesById, activePage);
  }, [activeSeoRecipe?.id, recipesById, activePage]);

  useEffect(() => {
    let persistTimer = 0;
    const persistScrollPosition = () => {
      persistTimer = 0;
      if (!activeRecipe) {
        try {
          sessionStorage.setItem(STORAGE_KEYS.homeScroll, String(homeScrollRef.current || 0));
        } catch {
          /* ignore session storage restrictions */
        }
      }
      saveCurrentScrollPosition();
    };
    const schedulePersist = () => {
      if (persistTimer) return;
      persistTimer = window.setTimeout(persistScrollPosition, 280);
    };
    const handleScroll = () => {
      const top = window.scrollY || 0;
      if (!activeRecipe) {
        homeScrollRef.current = top;
      }
      schedulePersist();
    };
    const flushScrollPosition = () => {
      if (persistTimer) {
        window.clearTimeout(persistTimer);
        persistTimer = 0;
      }
      persistScrollPosition();
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') flushScrollPosition();
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('pagehide', flushScrollPosition);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('pagehide', flushScrollPosition);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      flushScrollPosition();
    };
  }, [activeRecipe]);

  function setCheckedWithHistory(next) {
    setChecked(prev => {
      const resolved = typeof next === 'function' ? next(prev) : next;
      historyRef.current = [...historyRef.current.slice(0, historyIndexRef.current + 1), resolved];
      historyIndexRef.current = historyRef.current.length - 1;
      setHistoryVersion(value => value + 1);
      return resolved;
    });
  }

  function undo() {
    if (historyIndexRef.current <= 0) return;
    historyIndexRef.current -= 1;
    setChecked(historyRef.current[historyIndexRef.current]);
    setHistoryVersion(value => value + 1);
  }

  function redo() {
    if (historyIndexRef.current >= historyRef.current.length - 1) return;
    historyIndexRef.current += 1;
    setChecked(historyRef.current[historyIndexRef.current]);
    setHistoryVersion(value => value + 1);
  }

  const canUndo = historyVersion >= 0 && historyIndexRef.current > 0;
  const canRedo = historyVersion >= 0 && historyIndexRef.current < historyRef.current.length - 1;

  function updateSeason(value) {
    setSeason(value);
    if (!value) setSeasonCategory('');
  }

  const searchMeta = useMemo(() => {
    const needle = searchFilterQuery.trim();
    const map = new Map();
    if (!needle) return map;
    searchableRecipes.forEach(recipe => {
      const meta = scoreRecipeSearch(recipe, needle, recipesById);
      if (meta.score > 0) map.set(recipe.id, meta);
    });
    return map;
  }, [searchFilterQuery, searchableRecipes, recipesById]);

  const ingredientMeta = useMemo(() => {
    const needle = searchFilterQuery.trim();
    const map = new Map();
    if (!needle) return map;
    searchableRecipes.forEach(recipe => {
      const meta = scoreIngredientSearch(recipe, needle);
      if (meta.score > 0) map.set(recipe.id, meta);
    });
    return map;
  }, [searchFilterQuery, searchableRecipes]);

  const baseFilteredRecipes = useMemo(() => {
    const activeSearchQuery = searchFilterQuery.trim();
    const activeFavoriteCollection = FAVORITE_COLLECTIONS.find(collection => collection.id === favoriteCollection);
    let list = catalogRecipes.filter(recipe => {
      if (activeSearchQuery && !searchMeta.has(recipe.id) && !ingredientMeta.has(recipe.id)) return false;
      if (season && !recipeHasSeason(recipe, season, recipesById)) return false;
      if (tagFilter && !(recipe.tagsExtracted || []).includes(tagFilter)) return false;
      if (onlyFavorites && !favorites.includes(recipe.id)) return false;
      if (onlyFavorites && activeFavoriteCollection?.id && !activeFavoriteCollection.match?.(recipe, personalNotes[recipe.id])) return false;
      return true;
    });

    list = [...list].sort((a, b) => {
      if (activeSearchQuery) {
        const score = ((searchMeta.get(b.id)?.score || 0) + (ingredientMeta.get(b.id)?.score || 0))
          - ((searchMeta.get(a.id)?.score || 0) + (ingredientMeta.get(a.id)?.score || 0));
        if (score) return score;
      }
      const order = homeCardOrder(a) - homeCardOrder(b);
      if (order) return order;
      return a.title.localeCompare(b.title, 'fr');
    });
    return list;
  }, [catalogRecipes, searchFilterQuery, searchMeta, ingredientMeta, season, tagFilter, onlyFavorites, favorites, recipesById, favoriteCollection, personalNotes]);

  const seasonCategoryOptions = useMemo(() => {
    if (!season) return [];
    return [
      { value: '', label: 'Tous', count: baseFilteredRecipes.length },
      ...SEASON_CATEGORY_FILTERS
        .map(item => ({
          ...item,
          count: baseFilteredRecipes.filter(recipe => recipeHasCategory(recipe, item.value)).length
        }))
        .filter(item => item.count > 0)
    ];
  }, [baseFilteredRecipes, season]);

  const filteredRecipes = useMemo(() => {
    if (!season || !seasonCategory) return baseFilteredRecipes;
    return baseFilteredRecipes.filter(recipe => recipeHasCategory(recipe, seasonCategory));
  }, [baseFilteredRecipes, season, seasonCategory]);

  useEffect(() => {
    if (!season && seasonCategory) {
      setSeasonCategory('');
      return;
    }
    if (seasonCategory && !seasonCategoryOptions.some(item => item.value === seasonCategory)) {
      setSeasonCategory('');
    }
  }, [season, seasonCategory, seasonCategoryOptions]);

  const sections = useMemo(() => {
    if (onlyFavorites) {
      if (!filteredRecipes.length) {
        return [{ key: 'favorites-empty', kicker: 'Favoris', title: 'Recettes sauvegardées', recipes: filteredRecipes }];
      }
      const grouped = new Map();
      filteredRecipes.forEach(recipe => {
        const category = seasonGroupCategory(recipe);
        if (!grouped.has(category)) grouped.set(category, []);
        grouped.get(category).push(recipe);
      });
      return Array.from(grouped.entries()).map(([category, recipes]) => ({
        key: `favorites-${category}`,
        kicker: 'Favoris',
        title: categoryLabel(category),
        recipes
      }));
    }
    if (season) {
      if (seasonCategory) {
        return [{ key: `season-${season}-${seasonCategory}`, kicker: categoryLabel(seasonCategory), title: `${categoryLabel(seasonCategory)} de saison : ${season}`, recipes: filteredRecipes }];
      }
      const grouped = new Map();
      filteredRecipes.forEach(recipe => {
        const category = seasonGroupCategory(recipe);
        if (!grouped.has(category)) grouped.set(category, []);
        grouped.get(category).push(recipe);
      });
      return [
        ...SEASON_CATEGORY_FILTERS
          .filter(item => grouped.has(item.value))
          .map(item => ({
            key: `season-${season}-${item.value}`,
            kicker: season === currentSeason ? 'Saison actuelle' : 'Saison',
            title: categoryLabel(item.value),
            recipes: grouped.get(item.value)
          })),
        ...Array.from(grouped.entries())
          .filter(([category]) => !SEASON_CATEGORY_FILTERS.some(item => item.value === category))
          .map(([category, recipes]) => ({
            key: `season-${season}-${category}`,
            kicker: 'Saison',
            title: categoryLabel(category),
            recipes
          }))
      ];
    }
    return [{ key: 'all-seasons', kicker: 'Toutes', title: 'Toutes les recettes', recipes: filteredRecipes }];
  }, [currentSeason, filteredRecipes, onlyFavorites, season, seasonCategory]);
  const activeChips = [
    query && { key: 'query', label: `Recherche: ${query}`, clear: () => setQuery('') },
    season && { key: 'season', label: season, clear: () => updateSeason('') },
    seasonCategory && { key: 'seasonCategory', label: categoryLabel(seasonCategory), clear: () => setSeasonCategory('') },
    tagFilter && { key: 'tag', label: `Tag: ${tagFilter}`, clear: () => setTagFilter('') },
    onlyFavorites && { key: 'favorites', label: 'Favoris', clear: () => { setOnlyFavorites(false); setFavoriteCollection(''); } },
    onlyFavorites && favoriteCollection && { key: 'favoriteCollection', label: FAVORITE_COLLECTIONS.find(item => item.id === favoriteCollection)?.label || 'Collection', clear: () => setFavoriteCollection('') }
  ].filter(Boolean);

  function dismissToast(id) {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }

  function notify(message, tone = 'info', title = 'Cook Note') {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setToasts(prev => [{ id, title, message, tone }, ...prev].slice(0, 4));
    window.setTimeout(() => dismissToast(id), 3400);
  }

  function persistRecentRecipes(next) {
    setRecentRecipeIds(next);
    writeJson(STORAGE_KEYS.recentRecipes, next);
  }

  function rememberRecipeVisit(id) {
    const recipe = recipesById[id];
    if (!recipe || isMasterRecipe(recipe)) return;
    persistRecentRecipes([id, ...recentRecipeIds.filter(item => item !== id)].slice(0, 8));
  }

  function rememberSearch(value) {
    const clean = stripHtml(value).trim();
    if (clean.length < 2) return;
    const next = [clean, ...recentSearches.filter(item => normalizeText(item) !== normalizeText(clean))].slice(0, 8);
    setRecentSearches(next);
    writeJson(STORAGE_KEYS.recentSearches, next);
  }

  function persistFavorites(next) {
    setFavorites(next);
    writeJson(STORAGE_KEYS.favorites, next);
  }

  function updatePersonalRecipeNote(id, note) {
    const next = { ...personalNotes };
    if (!note || (!note.status && !String(note.text || '').trim())) delete next[id];
    else next[id] = { status: note.status || '', text: String(note.text || '').slice(0, 600), updatedAt: note.updatedAt || Date.now() };
    setPersonalNotes(next);
    writeJson(STORAGE_KEYS.personalNotes, next);
  }

  function toggleFavorite(id) {
    const recipe = recipesById[id];
    const removing = favorites.includes(id);
    persistFavorites(removing ? favorites.filter(item => item !== id) : [id, ...favorites]);
    notify(removing ? `${recipe?.title || 'Recette'} retirée des favoris` : `${recipe?.title || 'Recette'} ajoutée aux favoris`, removing ? 'info' : 'success');
  }

  function persistShopping(next) {
    setShoppingIds(next);
    writeJson(STORAGE_KEYS.shopping, next);
  }

  function persistShoppingFactors(next) {
    setShoppingFactors(next);
    writeJson(STORAGE_KEYS.shoppingFactors, next);
  }

  function toggleShopping(id, factor = 1) {
    const recipe = recipesById[id];
    if (shoppingIds.includes(id)) {
      persistShopping(shoppingIds.filter(item => item !== id));
      const nextFactors = { ...shoppingFactors };
      delete nextFactors[id];
      persistShoppingFactors(nextFactors);
      notify(`${recipe?.title || 'Recette'} retirée des courses`, 'info');
      return;
    }
    persistShopping([id, ...shoppingIds]);
    persistShoppingFactors({ ...shoppingFactors, [id]: factor });
    notify(`${recipe?.title || 'Recette'} ajoutée aux courses`, 'success');
  }

  function removeShopping(id) {
    const recipe = recipesById[id];
    persistShopping(shoppingIds.filter(item => item !== id));
    const nextFactors = { ...shoppingFactors };
    delete nextFactors[id];
    persistShoppingFactors(nextFactors);
    notify(`${recipe?.title || 'Recette'} retirée des courses`, 'info');
  }

  function clearShopping() {
    persistShopping([]);
    persistShoppingFactors({});
    notify('Panier de courses vidé', 'info');
  }

  function addMenuToShopping(menuRecipes) {
    const ids = menuRecipes.map(recipe => recipe.id).filter(Boolean);
    const merged = [...ids, ...shoppingIds.filter(id => !ids.includes(id))];
    persistShopping(merged);
    persistShoppingFactors(ids.reduce((next, id) => ({ ...next, [id]: shoppingFactors[id] || 1 }), { ...shoppingFactors }));
    setShoppingOpen(true);
  }

  function openRecipe(id) {
    const target = recipesById[id];
    if (!target) return;
    saveCurrentScrollPosition(lastRouteKeyRef.current);
    pendingScrollModeRef.current = 'top';
    if (!activeRecipe) {
      homeScrollRef.current = window.scrollY || 0;
      sessionStorage.setItem(STORAGE_KEYS.homeScroll, String(homeScrollRef.current));
    }
    restoreHomeScrollRef.current = false;
    if (!isMasterRecipe(target)) {
      rememberRecipeVisit(id);
    }
    setActivePage('home');
    setTargetTechniqueId('');
    setActiveId(id);
    setOnlyFavorites(false);
    setFavoriteCollection('');
    const nextUrl = getRecipeUrl(id);
    if (window.location.pathname + window.location.search !== nextUrl) {
      history.pushState('', document.title, nextUrl);
    }
    lastRouteKeyRef.current = currentScrollRouteKey();
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'auto' }));
  }

  function goHome() {
    saveCurrentScrollPosition(lastRouteKeyRef.current);
    pendingScrollModeRef.current = 'top';
    restoreHomeScrollRef.current = false;
    setActivePage('home');
    setTargetTechniqueId('');
    setOnlyFavorites(false);
    setFavoriteCollection('');
    setActiveId(null);
    history.pushState('', document.title, '/');
    lastRouteKeyRef.current = currentScrollRouteKey();
  }

  function showFavorites() {
    saveCurrentScrollPosition(lastRouteKeyRef.current);
    pendingScrollModeRef.current = 'top';
    setActivePage('home');
    setTargetTechniqueId('');
    setOnlyFavorites(true);
    setFavoriteCollection('');
    setActiveId(null);
    history.pushState('', document.title, '/?view=__favs__');
    lastRouteKeyRef.current = currentScrollRouteKey();
    setTimeout(() => document.getElementById('recettes')?.scrollIntoView({ behavior: 'smooth' }), 0);
  }

  function goTechniques() {
    saveCurrentScrollPosition(lastRouteKeyRef.current);
    pendingScrollModeRef.current = 'top';
    restoreHomeScrollRef.current = false;
    setActivePage('techniques');
    setTargetTechniqueId('');
    setActiveId(null);
    setOnlyFavorites(false);
    history.pushState('', document.title, '/techniques');
    lastRouteKeyRef.current = currentScrollRouteKey();
  }

  function openTechnique(id) {
    saveCurrentScrollPosition(lastRouteKeyRef.current);
    pendingScrollModeRef.current = 'none';
    restoreHomeScrollRef.current = false;
    setActivePage('techniques');
    setTargetTechniqueId(id);
    setActiveId(null);
    setOnlyFavorites(false);
    history.pushState('', document.title, `/techniques#${encodeURIComponent(id)}`);
    lastRouteKeyRef.current = currentScrollRouteKey();
  }

  function updateSearchQuery(value) {
    setQuery(value);
  }

  function openSearch() {
    setSearchOpen(true);
    setTimeout(() => searchRef.current?.focus(), 0);
  }

  useEffect(() => {
    const handleLocation = () => {
      saveCurrentScrollPosition(lastRouteKeyRef.current);
      const recipe = getInitialRecipe();
      const page = getPathPage();
      const technique = page === 'techniques' ? getInitialTechnique() : '';
      pendingScrollModeRef.current = page === 'techniques' && technique ? 'none' : 'restore';
      lastRouteKeyRef.current = currentScrollRouteKey();
      if (recipe && !activeId) {
        homeScrollRef.current = Math.max(window.scrollY || 0, homeScrollRef.current || 0);
        restoreHomeScrollRef.current = false;
      }
      setActivePage(page);
      setTargetTechniqueId(technique);
      setOnlyFavorites(new URLSearchParams(window.location.search).get('view') === '__favs__');
      setActiveId(recipe);
      if (!recipe && page === 'home') restoreHomeScrollRef.current = false;
    };
    window.addEventListener('hashchange', handleLocation);
    window.addEventListener('popstate', handleLocation);
    return () => {
      window.removeEventListener('hashchange', handleLocation);
      window.removeEventListener('popstate', handleLocation);
    };
  }, [activeId]);

  useEffect(() => {
    if (activeRecipe || !restoreHomeScrollRef.current) return;
    restoreHomeScrollRef.current = false;
    const top = homeScrollRef.current || 0;
    let attempts = 0;
    const restore = () => {
      window.scrollTo({ top, behavior: 'auto' });
      attempts += 1;
      if (attempts < 8 && Math.abs((window.scrollY || 0) - top) > 2) requestAnimationFrame(restore);
    };
    requestAnimationFrame(() => requestAnimationFrame(restore));
  }, [activeRecipe]);

  useEffect(() => {
    const handleGoto = event => {
      const target = event.target.closest('[data-goto]');
      if (!target) return;
      const id = target.getAttribute('data-goto');
      if (!recipesById[id]) return;
      event.preventDefault();
      openRecipe(id);
    };
    document.addEventListener('click', handleGoto);
    return () => document.removeEventListener('click', handleGoto);
  }, [recipesById]);

  useEffect(() => {
    const handleKey = event => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        openSearch();
        return;
      }
      if (event.key === 'Escape') {
        if (searchOpen) {
          setSearchOpen(false);
          return;
        }
        if (preferencesOpen) {
          setPreferencesOpen(false);
          return;
        }
        if (menuPlannerOpen) {
          setMenuPlannerOpen(false);
          return;
        }
        if ((activeRecipe || activePage === 'techniques') && !isTypingTarget(event.target)) goHome();
        return;
      }
      if (isTypingTarget(event.target)) return;
      if (activeRecipe && (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z') {
        event.preventDefault();
        undo();
        return;
      }
      if (activeRecipe && (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'y') {
        event.preventDefault();
        redo();
        return;
      }
      if (event.key.toLowerCase() === 'h') {
        goHome();
        return;
      }
      if (activeRecipe && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
        const index = catalogRecipes.findIndex(recipe => recipe.id === activeRecipe.id);
        if (index === -1 || !catalogRecipes.length) return;
        const nextIndex = event.key === 'ArrowLeft'
          ? (index - 1 + catalogRecipes.length) % catalogRecipes.length
          : (index + 1) % catalogRecipes.length;
        openRecipe(catalogRecipes[nextIndex].id);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [activeRecipe, activePage, catalogRecipes, canUndo, canRedo, searchOpen, preferencesOpen, menuPlannerOpen]);

  if (!recipes.length) {
    return h('div', { className: 'mc-shell' },
      h('main', { className: 'fatal-state' },
        h('h1', null, 'Recettes introuvables'),
        h('p', null, 'Le fichier de recettes doit définir window.RECIPES avant app.js.')
      )
    );
  }

  const filterProps = {
    seasons: allSeasons,
    season,
    setSeason: updateSeason,
    seasonCategory,
    setSeasonCategory,
    seasonCategoryOptions
  };
  const missingRecipeId = activeId && !activeRecipe ? activeId : '';
  const shellClassName = [
    'mc-shell',
    preferences.density === 'compact' ? 'display-compact' : '',
    preferences.largeText ? 'display-large-text' : '',
    preferences.reduceMotion ? 'display-reduce-motion' : ''
  ].filter(Boolean).join(' ');

  return h('div', { className: shellClassName },
    h(TopBarFixed, {
      onHome: goHome,
      shoppingCount: shoppingRecipes.length,
      showFavorites,
      openShoppingBasket: () => setShoppingOpen(true),
      openMenuPlanner: () => setMenuPlannerOpen(true),
      openTechniques: goTechniques,
      query,
      openSearch,
      openPreferences: () => setPreferencesOpen(true)
    }),
    h('nav', { className: 'mobile-bottom-nav', 'aria-label': 'Navigation mobile' },
      h('button', { type: 'button', onClick: goHome, 'aria-label': 'Accueil', 'aria-current': !activeRecipe && activePage === 'home' && !onlyFavorites ? 'page' : undefined }, h('span', { className: 'mobile-nav-icon' }, h(Icon, { name: 'home' })), h('span', { className: 'sr-only' }, 'Accueil')),
      h('button', { type: 'button', onClick: openSearch, 'aria-label': 'Recherche', 'aria-current': searchOpen ? 'page' : undefined }, h('span', { className: 'mobile-nav-icon' }, h(Icon, { name: 'search' })), 'Recherche'),
      h('button', { type: 'button', onClick: () => setMenuPlannerOpen(true), 'aria-label': 'Mode menu', 'aria-current': menuPlannerOpen ? 'page' : undefined }, h('span', { className: 'mobile-nav-icon' }, h(Icon, { name: 'spark' })), 'Menu'),
      h('button', { type: 'button', onClick: showFavorites, 'aria-label': 'Favoris', 'aria-current': onlyFavorites ? 'page' : undefined }, h('span', { className: 'mobile-nav-icon' }, h(Icon, { name: 'heart' })), 'Favoris'),
      h('button', { type: 'button', onClick: () => setShoppingOpen(true), 'aria-label': 'Courses', 'aria-current': shoppingOpen ? 'page' : undefined }, h('span', { className: 'mobile-nav-icon' }, h(Icon, { name: 'basket' })), 'Courses')
    ),
    missingRecipeId
      ? h(NotFoundView, {
          goHome,
          openSearch
        })
      : activeRecipe
      ? h(RecipeView, {
          recipe: activeRecipe,
          isFavorite: favorites.includes(activeRecipe.id),
          toggleFavorite,
          shoppingIds,
          toggleShopping,
          openShoppingBasket: () => setShoppingOpen(true),
          goHome,
          openRecipe,
          recipes,
          recipesById,
          checked,
          setCheckedWithHistory,
          canUndo,
          canRedo,
          undo,
          redo,
          setTagFilter,
          openTechnique,
          notify,
          personalRecipeNote: personalNotes[activeRecipe.id],
          updatePersonalRecipeNote
        })
      : activePage === 'techniques'
        ? h(TechniquesView, {
            targetTechniqueId,
            goHome
          })
        : h(HomeView, {
          favorites,
          sections,
          recipesById,
          onlyFavorites,
          activeChips,
          monthlyAdditionRecipes,
          personalNotes,
          favoriteCollection,
          setFavoriteCollection,
          filterProps,
          toggleFavorite,
          openRecipe,
          clearFavoriteView: () => { setOnlyFavorites(false); setFavoriteCollection(''); },
          setTagFilter
        }),
    h('footer', { className: 'site-footer' },
      h('div', { className: 'site-footer-inner' },
        h('div', { className: 'site-footer-mark' },
          h('img', { src: '/assets/cook-note-mark.svg', alt: '', loading: 'lazy' })
        ),
        h('div', { className: 'site-footer-copy' },
          h('p', { className: 'site-footer-brand' }, 'Cook Note © 2026.'),
          h('p', null, 'Carnet personnel de recettes et techniques culinaires.'),
          h('p', null, 'Développé par MaruChiwa.'),
          h('p', { className: 'site-footer-version' }, `${SITE_VERSION} / ${SITE_UPDATED_AT}`)
        ),
        h('button', {
          type: 'button',
          className: 'site-footer-top',
          onClick: () => window.scrollTo({ top: 0, behavior: preferences.reduceMotion ? 'auto' : 'smooth' })
        }, 'Retour haut')
      )
    ),
    h(ShoppingBasketPanel, {
      open: shoppingOpen,
      onClose: () => setShoppingOpen(false),
      recipes: shoppingRecipes,
      factorById: shoppingFactors,
      removeRecipe: removeShopping,
      clearShopping,
      notify
    }),
    h(MenuPlannerPanel, {
      open: menuPlannerOpen,
      onClose: () => setMenuPlannerOpen(false),
      recipes: searchableRecipes,
      openRecipe: id => {
        setMenuPlannerOpen(false);
        openRecipe(id);
      },
      addMenuToShopping,
      notify
    }),
    h(PreferencesPanel, {
      open: preferencesOpen,
      onClose: () => setPreferencesOpen(false),
      preferences,
      setPreferences
    }),
    h(SearchPanel, {
      open: searchOpen,
      onClose: () => setSearchOpen(false),
      query,
      setQuery: updateSearchQuery,
      searchRef,
      results: filteredRecipes,
      resultMeta: searchMeta,
      ingredientMeta,
      openRecipe,
      recentRecipes,
      recentSearches,
      rememberSearch
    }),
    h(ToastStack, { toasts, dismissToast })
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(h(App));

requestAnimationFrame(() => {
  if (window.__cookNoteReady) {
    window.__cookNoteReady();
    return;
  }
  document.getElementById('loading-screen')?.remove();
});
