// Valeurs nutritionnelles moyennes pour 100 g (ordre de grandeur, tables
// CIQUAL / USDA arrondies) : [kcal, protéines, glucides, lipides, poids d'une
// pièce en g (facultatif : gousse, œuf, citron...)]. Une entrée par fiche de
// l'atlas : scripts/validate-ingredient-atlas.js refuse une fiche sans valeurs.
// Sert à l'estimation par portion affichée sur chaque recette.
cookNoteAtlas.nutrition({
  // Légumes
  oignon: [40, 1.1, 9, 0.1, 110], echalote: [72, 2.5, 16, 0.1, 28], carotte: [36, 0.9, 7.6, 0.2, 100], 'pomme-de-terre': [80, 2, 17, 0.1, 150], 'patate-douce': [86, 1.6, 20, 0.1, 250],
  tomate: [18, 0.9, 3.9, 0.2, 120], poivron: [26, 1, 5, 0.3, 160], champignon: [22, 3.1, 3.3, 0.3, 20], cepe: [30, 3.5, 3, 0.4, 80], truffe: [60, 6, 8, 0.5, 30],
  morille: [31, 3, 5, 0.6, 10], celeri: [18, 0.7, 3, 0.2, 40], epinard: [23, 2.9, 3.6, 0.4], courge: [26, 1, 6.5, 0.1], asperge: [20, 2.2, 3.9, 0.1, 20],
  'haricot-vert': [31, 1.8, 7, 0.2], courgette: [17, 1.2, 3.1, 0.3, 200], aubergine: [25, 1, 6, 0.2, 300], poireau: [61, 1.5, 14, 0.3, 150], chou: [25, 1.3, 5.8, 0.1],
  'chou-fleur': [25, 1.9, 5, 0.3], brocoli: [34, 2.8, 7, 0.4], 'chou-bruxelles': [43, 3.4, 9, 0.3, 15], navet: [28, 0.9, 6.4, 0.1, 120], panais: [75, 1.2, 18, 0.3, 150],
  betterave: [43, 1.6, 10, 0.2, 150], concombre: [15, 0.7, 3.6, 0.1, 300], avocat: [160, 2, 8.5, 14.7, 150], fenouil: [31, 1.2, 7.3, 0.2, 250], artichaut: [47, 3.3, 10.5, 0.2, 300],
  blette: [19, 1.8, 3.7, 0.2], endive: [17, 1.2, 3.4, 0.2, 120], salade: [15, 1.4, 2.9, 0.2], okra: [33, 1.9, 7.5, 0.2], lentille: [116, 9, 20, 0.4],
  'pois-chiche': [139, 7.6, 20, 2.6], 'haricot-sec': [127, 8.7, 22.8, 0.5], 'petit-pois': [81, 5.4, 14.5, 0.4], chataigne: [196, 1.6, 44, 1.3, 12], roquette: [25, 2.6, 3.7, 0.7],
  cresson: [11, 2.3, 1.3, 0.1], 'pois-gourmands': [42, 2.8, 7.6, 0.2], 'pois-casses': [118, 8.3, 21, 0.4],
  // Fruits
  citron: [29, 1.1, 9.3, 0.3, 110], 'citron-vert': [30, 0.7, 10.5, 0.2, 70], 'citron-confit': [40, 1, 8, 0.5, 60], yuzu: [21, 0.5, 7, 0.1, 100], orange: [47, 0.9, 11.8, 0.1, 160],
  fraise: [32, 0.7, 7.7, 0.3, 15], framboise: [52, 1.2, 12, 0.7], myrtille: [57, 0.7, 14.5, 0.3], mure: [43, 1.4, 9.6, 0.5], groseille: [56, 1.4, 13.8, 0.2],
  'fruits-rouges': [45, 1, 10.5, 0.4], cerise: [63, 1.1, 16, 0.2, 8], abricot: [48, 1.4, 11, 0.4, 45], peche: [39, 0.9, 9.5, 0.3, 150], melon: [34, 0.8, 8.2, 0.2, 900],
  mangue: [60, 0.8, 15, 0.4, 300], ananas: [50, 0.5, 13, 0.1, 1000], kiwi: [61, 1.1, 14.7, 0.5, 75], 'fruit-passion': [97, 2.2, 23, 0.7, 30], pomme: [52, 0.3, 13.8, 0.2, 150],
  poire: [57, 0.4, 15.2, 0.1, 160], raisin: [69, 0.7, 18, 0.2],
  // Herbes et aromates
  ail: [149, 6.4, 33, 0.5, 5], persil: [36, 3, 6.3, 0.8], ciboulette: [30, 3.3, 4.4, 0.7], coriandre: [23, 2.1, 3.7, 0.5], basilic: [23, 3.2, 2.7, 0.6],
  thym: [101, 5.6, 24, 1.7, 1], romarin: [131, 3.3, 20.7, 5.9, 1], laurier: [313, 7.6, 75, 8.4, 0.3], 'bouquet-garni': [100, 4, 20, 2, 5], menthe: [70, 3.8, 14.9, 0.9],
  aneth: [43, 3.5, 7, 1.1], estragon: [50, 3.4, 6.3, 1.1], cerfeuil: [37, 3.4, 4.6, 0.9], origan: [265, 9, 69, 4.3, 1], liveche: [40, 3, 6, 0.7],
  herbes: [45, 3.2, 7, 0.8], citronnelle: [99, 1.8, 25, 0.5, 20], combava: [30, 1, 9, 0.2, 2], gingembre: [80, 1.8, 18, 0.8, 15],
  // Épices (très peu utilisées : poids réel minime)
  piment: [40, 1.9, 9, 0.4, 5], paprika: [282, 14, 54, 13], cumin: [375, 18, 44, 22], curry: [325, 14, 58, 14], curcuma: [312, 9.7, 67, 3.3],
  safran: [310, 11, 65, 6], cannelle: [247, 4, 81, 1.2, 3], muscade: [525, 5.8, 49, 36], vanille: [288, 0.1, 13, 0.1, 3], 'quatre-epices': [300, 8, 60, 8],
  girofle: [274, 6, 66, 13], badiane: [337, 18, 50, 16, 1], cardamome: [311, 11, 68, 6.7, 0.2], 'graines-epicees': [330, 15, 45, 15], zaatar: [280, 9, 45, 10],
  poivre: [251, 10, 64, 3.3], sel: [0, 0, 0, 0], 'garam-masala': [320, 12, 50, 14], tandoori: [300, 10, 50, 10], 'cinq-epices': [330, 10, 60, 10],
  // Laitages et œufs
  oeuf: [143, 12.6, 0.7, 9.5, 55], lait: [47, 3.3, 4.8, 1.6], creme: [300, 2.2, 3, 30], yaourt: [61, 3.5, 4.7, 3.3, 125], 'fromage-blanc': [75, 7, 4, 3.2],
  mascarpone: [430, 4.6, 3.5, 44], ricotta: [174, 11, 3, 13], babeurre: [40, 3.3, 4.8, 0.9], 'lait-concentre': [320, 7.9, 54, 8.7],
  // Fromages
  parmesan: [392, 35, 0, 28], pecorino: [387, 28, 3.6, 30], comte: [413, 29, 0.5, 33], gruyere: [413, 29.8, 0.4, 32], mozzarella: [253, 18, 2.2, 19, 125],
  feta: [264, 14, 4, 21, 200], chevre: [290, 19, 1, 23, 150], roquefort: [369, 21.5, 2, 30.6], brie: [334, 20.8, 0.5, 27.7, 250], cheddar: [403, 25, 1.3, 33],
  emmental: [380, 28, 0, 29.7], munster: [330, 21, 0.3, 27], taleggio: [315, 19, 0.9, 26],
  // Viandes
  poulet: [165, 31, 0, 3.6, 150], boeuf: [190, 26, 0, 9.5], veau: [150, 21, 0, 7], porc: [210, 21, 0, 14], agneau: [230, 19, 0, 17],
  canard: [200, 19, 0, 13, 300], lapin: [136, 21, 0, 5.5], foie: [135, 20, 3.9, 3.6], lardons: [300, 15, 0.5, 27], jambon: [115, 20, 1, 3.5, 40],
  chorizo: [455, 24, 2, 38], saucisse: [300, 13, 2, 27, 100], bacon: [420, 15, 1, 40, 15], pancetta: [380, 17, 0.5, 35], guanciale: [650, 7, 0, 69],
  saucisson: [410, 26, 2, 33], 'foie-gras': [460, 7.5, 4.7, 44],
  // Poissons et fruits de mer
  saumon: [206, 20, 0, 13, 125], cabillaud: [82, 18, 0, 0.7, 150], 'poissons-roche': [95, 19, 0, 2], thon: [130, 26, 0, 3], anchois: [210, 29, 0, 10, 4],
  crevette: [99, 21, 0.2, 1.1, 12], langoustine: [90, 19, 0.5, 1, 40], 'saint-jacques': [88, 17, 3, 0.8, 25], moule: [86, 12, 3.7, 2.2, 10], calamar: [92, 15.6, 3.1, 1.4],
  fumet: [15, 2, 0.5, 0.5], daurade: [96, 19, 0, 2, 400], rouget: [100, 19, 0, 2.5, 150], espadon: [144, 20, 0, 6.7], homard: [89, 19, 0.5, 0.9, 500],
  // Céréales et féculents
  farine: [350, 10, 73, 1.2], 'farine-seigle': [325, 9, 68, 1.7], fecule: [380, 0.3, 91, 0.1], levure: [325, 40, 41, 7.6], pates: [358, 12.5, 72, 1.5],
  riz: [350, 7, 78, 0.6], polenta: [360, 8.5, 77, 1.2], pain: [265, 9, 49, 3.2, 40], chapelure: [395, 13, 72, 5.3], avoine: [379, 13, 67, 6.5],
  vermicelles: [360, 6, 80, 0.6], brick: [290, 8, 60, 1, 10], brioche: [370, 8, 50, 15, 60], tortilla: [310, 8.5, 50, 8, 45], levain: [220, 7, 46, 0.8],
  bicarbonate: [0, 0, 0, 0],
  // Sucres et douceurs
  sucre: [400, 0, 100, 0], cassonade: [390, 0.1, 97, 0], 'sucre-glace': [400, 0, 100, 0], miel: [320, 0.4, 80, 0], sirop: [270, 0, 68, 0],
  chocolat: [545, 6, 46, 35], cacao: [228, 20, 58, 14], caramel: [380, 2, 75, 8], confiture: [250, 0.4, 62, 0.1], biscuits: [470, 6.5, 70, 18, 8],
  gelatine: [335, 86, 0, 0, 2], meringue: [390, 5, 92, 0.1, 5], 'pate-tartiner': [540, 6, 57, 31], glucose: [310, 0, 77, 0], speculoos: [480, 5, 72, 19, 8],
  genoise: [300, 7, 50, 7], pectine: [325, 0.3, 90, 0.3], compote: [70, 0.3, 17, 0.1],
  // Matières grasses
  beurre: [745, 0.7, 0.6, 82], 'beurre-clarifie': [880, 0.3, 0, 99.5], 'huile-olive': [900, 0, 0, 100], 'huile-neutre': [900, 0, 0, 100], 'huile-parfumee': [880, 0, 1, 98],
  saindoux: [900, 0, 0, 100], 'huile-truffe': [900, 0, 0, 100], 'huile-noix': [900, 0, 0, 100], 'huile-coco': [890, 0, 0, 99], 'chili-crisp': [650, 4, 10, 65],
  // Condiments et sauces
  moutarde: [150, 7, 6, 11], vinaigre: [20, 0, 0.6, 0], balsamique: [110, 0.5, 23, 0], 'sauce-soja': [55, 8, 5, 0.1], 'nuoc-mam': [35, 5, 3.6, 0],
  'sauce-tomate': [45, 1.5, 7.5, 1.2], ketchup: [110, 1.2, 25, 0.2], mayonnaise: [700, 1.2, 1.5, 77], capres: [23, 2.4, 4.9, 0.9], harissa: [120, 3, 10, 8],
  tahini: [600, 17, 21, 54], vinaigrette: [450, 0.3, 4, 48], algues: [45, 3, 9, 0.6], cornichon: [15, 0.6, 2.3, 0.2, 10], olive: [145, 1, 4, 15, 4],
  worcestershire: [80, 0, 20, 0], 'sauce-chili': [200, 0.5, 48, 0.3], 'sauce-huitre': [100, 2.5, 22, 0.3],
  // Fruits secs et graines
  amande: [600, 21, 9, 52], noisette: [650, 15, 7, 62], noix: [690, 15, 7, 65], pistache: [590, 20, 17, 46], pignon: [690, 14, 13, 68],
  cajou: [570, 18, 30, 44], coco: [660, 6.9, 24, 64], 'raisins-secs': [300, 3, 79, 0.5], sesame: [570, 18, 23, 50], cacahuete: [590, 26, 16, 49],
  cranberry: [310, 0.1, 83, 1.4], pavot: [525, 18, 28, 42], 'courge-graines': [570, 30, 11, 49],
  // Boissons et alcools (alcool compté dans les calories)
  vin: [80, 0.1, 2.6, 0], cidre: [40, 0, 4.5, 0], rhum: [230, 0, 0, 0], cognac: [240, 0, 0, 0], porto: [160, 0.1, 13, 0],
  cafe: [2, 0.1, 0, 0], bouillon: [10, 0.8, 0.7, 0.3], eau: [0, 0, 0, 0], 'jus-fruits': [45, 0.5, 10.5, 0.1], 'eau-fleur': [0, 0, 0, 0],
  glace: [0, 0, 0, 0], biere: [43, 0.5, 3.6, 0], kirsch: [230, 0, 0, 0], 'grand-marnier': [300, 0, 25, 0], amaretto: [310, 0, 35, 0],
  whisky: [250, 0, 0, 0], vodka: [230, 0, 0, 0], pernod: [270, 0, 10, 0], sake: [135, 0.5, 5, 0], mirin: [240, 0.2, 43, 0],
  gin: [255, 0, 0, 0], vermouth: [150, 0, 14, 0], effervescent: [80, 0.2, 1.5, 0], amers: [270, 0, 15, 0], sodas: [40, 0, 10, 0], the: [1, 0, 0.2, 0], 'tomme-fraiche': [300, 22, 1, 23],
  pasteque: [30, 0.6, 7.5, 0.2, 3000], pamplemousse: [42, 0.8, 10.7, 0.1, 400],
  // Préparations de base
  'pate-feuilletee': [400, 5.5, 38, 25], 'creme-patissiere': [180, 4, 25, 7], chantilly: [330, 2, 12, 30], 'sauce-bechamel': [130, 3.5, 9, 9], glacage: [390, 0.5, 90, 4],
  frites: [312, 3.4, 41, 15]
});
