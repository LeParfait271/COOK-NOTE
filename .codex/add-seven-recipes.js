const fs = require('fs');
const vm = require('vm');

const file = 'recipes.js';
const context = { window: {} };
vm.runInNewContext(fs.readFileSync(file, 'utf8'), context);
const recipes = context.window.RECIPES;

const common = {
  master: 'plats_maitre',
  categories: ['Plats'],
  difficulty: 'medium'
};

const creamVariant = {
  group: 'À la crème',
  items: [
    '— Poulet et sauce —',
    '8 cuisses de poulet',
    '50g beurre',
    '4 oignons émincés',
    '1kg crème fraîche épaisse',
    '400g petits oignons glacés à blanc',
    '400g champignons de Paris glacés à blanc',
    'Sel fin',
    'Poivre du moulin',
    'Piment d’Espelette'
  ],
  steps: [
    'Faire fondre le beurre dans une sauteuse et colorer les cuisses de poulet sur toutes leurs faces sans les brûler.',
    'Ajouter les oignons émincés et les faire suer doucement.',
    'Retirer les cuisses, les déposer dans un plat et terminer leur cuisson 15min environ au four à 190°C.',
    'Verser la crème sur les oignons et laisser réduire 10min à feu doux.',
    'Glacer séparément les petits oignons à blanc avec un peu d’eau, de beurre et de sel, sous un disque de papier cuisson, sans coloration.',
    'Émincer les champignons et les glacer à blanc de la même manière.',
    'Réunir petits oignons et champignons, puis mixer finement la sauce crème-oignons.',
    'Verser la sauce sur la garniture, ajouter les cuisses cuites, rectifier avec sel, poivre du moulin et piment d’Espelette, puis tenir au chaud.'
  ],
  recipe: {
    title: 'Cuisses de poulet à la crème',
    ...common,
    image: '/assets/recipes/heroes/cuisses_poulet_creme.jpg',
    seasons: ['Automne', 'Hiver', 'Toutes saisons'],
    difficultyScore: 4,
    yield: '8 personnes',
    activeTime: 30,
    cookTime: 30,
    aliases: ['cuisse poulet crème', 'poulet crème champignons'],
    tags: ['poulet', 'crème', 'champignons', 'petits oignons'],
    notes: ['Réduire la crème sans forte ébullition pour conserver une sauce lisse.', 'Les garnitures glacées à blanc doivent rester sans coloration.'],
    technical: [{ label: 'Sauce', value: 'Mixer la crème et les oignons avant de réunir la garniture donne une sauce veloutée.' }]
  }
};
const chickenFamily = recipes.cuisses_poulet_variantes;
const existingCream = chickenFamily.ingredients.findIndex(item => item.group === creamVariant.group);
if (existingCream >= 0) chickenFamily.ingredients[existingCream] = creamVariant;
else chickenFamily.ingredients.push(creamVariant);
chickenFamily.tags = [...new Set([...(chickenFamily.tags || []), ...creamVariant.recipe.tags])];
chickenFamily.aliases = [...new Set([...(chickenFamily.aliases || []), ...creamVariant.recipe.aliases])];

recipes.poulet_vin_jaune = {
  title: 'Poulet au vin jaune',
  ...common,
  image: '/assets/recipes/heroes/poulet_vin_jaune.jpg',
  seasons: ['Automne', 'Hiver'],
  difficultyScore: 5,
  yield: '6 personnes',
  activeTime: 25,
  cookTime: 40,
  aliases: ['poulet vin jaune aux morilles'],
  tags: ['poulet', 'vin jaune', 'morilles', 'Jura', 'crème'],
  ingredients: [{ group: 'Poulet au vin jaune', items: ['1 poulet fermier de 1,5kg coupé en 8 morceaux', '250g morilles fraîches ou 75g morilles séchées', '375ml vin jaune', '200ml crème fraîche', '2 échalotes', '30g huile', '80g beurre', '15g vinaigre', 'Noix de muscade', 'Sel fin', 'Poivre du moulin'] }],
  steps: ['Saler et poivrer les morceaux de poulet.', 'Faire chauffer l’huile et le beurre dans une cocotte, puis dorer le poulet sur toutes ses faces.', 'Ajouter les échalotes ciselées et environ 100ml de vin jaune, couvrir et laisser mijoter 20min.', 'Nettoyer les morilles fraîches dans une eau vinaigrée puis les rincer, ou réhydrater les morilles séchées 15min et les égoutter soigneusement.', 'Faire tiédir le reste du vin jaune, l’ajouter dans la cocotte avec les morilles et poursuivre 15min à découvert.', 'Réserver le poulet au chaud, ajouter la crème et une pointe de muscade, puis réduire la sauce 5min.', 'Rectifier l’assaisonnement, remettre le poulet dans la sauce et servir aussitôt.'],
  notes: ['Une réduction courte préserve le parfum caractéristique du vin jaune.', 'Filtrer l’eau de réhydratation des morilles si elle est utilisée afin d’éliminer tout sable.'],
  source: 'https://www.meilleurduchef.com/fr/recette/poulet-vin-jaune.html'
};

recipes.poulet_marengo = {
  title: 'Poulet Marengo',
  ...common,
  image: '/assets/recipes/heroes/poulet_marengo.jpg',
  seasons: ['Toutes saisons'],
  difficultyScore: 4,
  yield: '6 personnes',
  activeTime: 30,
  cookTime: 60,
  aliases: ['poulet sauce Marengo'],
  tags: ['poulet', 'tomates', 'champignons', 'vin blanc', 'cognac'],
  ingredients: [{ group: 'Poulet Marengo', items: ['1 gros poulet de 2kg coupé en morceaux', '60g beurre', '45g huile d’olive', '40g farine T55', '200ml fond de volaille', '200ml vin blanc sec', '15ml cognac', '2 oignons ou 2 échalotes', '1 gousse d’ail', '6 tomates', '12 champignons de Paris', '15g persil haché', 'Sel fin', 'Poivre du moulin'] }],
  steps: ['Saler et poivrer les morceaux de poulet, puis ciseler les oignons et l’ail.', 'Chauffer le beurre et l’huile dans une cocotte et faire dorer le poulet sur toutes ses faces.', 'Ajouter les oignons et l’ail, puis les faire dorer sans brunir.', 'Singer avec la farine, mélanger et torréfier quelques minutes à four chaud.', 'Verser progressivement le fond de volaille et le vin blanc, porter à ébullition puis laisser frémir 30min.', 'Monder, épépiner et concasser les tomates ; nettoyer puis émincer les champignons.', 'Ajouter tomates et champignons, assaisonner, couvrir et mijoter encore 20min jusqu’à ce que le poulet soit tendre.', 'Ajouter le cognac, vérifier la liaison de la sauce et terminer avec le persil haché.'],
  notes: ['La farine doit être absorbée avant l’ajout des liquides pour éviter les grumeaux.', 'La sauce finale doit être nappante, tomatée et brillante.'],
  source: 'https://www.meilleurduchef.com/fr/recette/poulet-marengo.html'
};

recipes.pate_en_croute_noel = {
  title: 'Pâté en croûte de Noël',
  master: 'apero_maitre',
  additionalMasters: ['entrees_maitre'],
  image: '/assets/recipes/heroes/pate_en_croute_noel.jpg',
  categories: ['Apéro', 'Entrées'],
  seasons: ['Hiver'],
  difficulty: 'hard',
  difficultyScore: 8,
  yield: '12 personnes',
  activeTime: 90,
  cookTime: 90,
  restTime: 1440,
  aliases: ['pâté croûte Noël', 'pâté en croûte canard pistaches'],
  tags: ['pâté en croûte', 'Noël', 'canard', 'porc', 'pistaches', 'gelée'],
  ingredients: [
    { group: 'Pâte brisée, à faire la veille', items: ['500g farine T55', '250g beurre pommade', '10g sel fin', '75g œufs entiers', '10g jaune d’œuf', '100g eau froide'] },
    { group: 'Farce, à faire la veille', items: ['500g magret de canard', '800g poitrine de porc fraîche', '800g échine de porc', '100g foies de volaille', '42g sel fin', '5g poivre moulu', '2g noix de muscade moulue', '100ml cognac', '50g pistaches entières émondées', '20g chapelure panko'] },
    { group: 'Dorure et gelée', items: ['1 jaune d’œuf', '15g lait ou crème fleurette', '900ml eau', '50g gelée claire en poudre', '100ml Madère'] }
  ],
  steps: ['La veille, sabler farine, beurre et sel à la feuille, puis incorporer les œufs, le jaune et juste assez d’eau froide pour former une pâte homogène.', 'Fraiser brièvement, filmer et réserver la pâte 24h au réfrigérateur.', 'Parer les viandes très froides, hacher la poitrine, l’échine et les foies, puis garder une partie du magret en lanières pour la mosaïque.', 'Mélanger viandes, sel, poivre, muscade, cognac, pistaches et panko jusqu’à obtenir une farce liée ; filmer et réserver 24h au froid.', 'Abaisser la pâte et chemiser soigneusement un moule à pâté en croûte en gardant assez de pâte pour le couvercle.', 'Remplir en tassant la farce et les lanières de magret pour éviter les poches d’air.', 'Fermer avec le couvercle de pâte, souder les bords, décorer puis aménager deux cheminées.', 'Dorer avec le jaune détendu au lait et cuire jusqu’à pâte bien dorée et farce cuite à cœur, environ 1h30 à 180°C selon le moule.', 'Laisser refroidir complètement sans démouler.', 'Préparer la gelée avec l’eau et la poudre, parfumer au Madère, puis la verser progressivement par les cheminées.', 'Réfrigérer au moins une nuit avant de démouler et de trancher.'],
  notes: ['Garder pâte et farce froides garantit une coupe nette.', 'Verser la gelée en plusieurs fois, après absorption de chaque ajout.', 'Servir bien frais avec pickles ou salade.'],
  source: 'https://www.meilleurduchef.com/fr/recette/pate-en-croute-de-noel.html'
};

Object.assign(recipes.potee_chou, {
  title: 'Potée aux légumes',
  image: '/assets/recipes/heroes/potee_chou.jpg',
  yield: '4 personnes',
  activeTime: 30,
  cookTime: 55,
  tags: ['potée', 'porc', 'Morteau', 'chou', 'légumes', 'hiver'],
  aliases: ['potée au chou', 'potée aux légumes', 'potée à la Morteau'],
  ingredients: [{ group: 'Potée', items: ['1,2kg palette demi-sel ou jarret de porc', '4 saucisses de Morteau', '1 saucisson à l’ail', '4 tranches épaisses de poitrine de porc', '1 chou vert', '2 poireaux', '4 carottes', '4 navets', '800g pommes de terre', '2 oignons piqués de clous de girofle', 'Persil plat', '15g vinaigre', 'Gros sel', 'Poivre en grains'] }],
  steps: ['Couper le chou en quatre, retirer le trognon puis le laver dans une eau légèrement vinaigrée.', 'Éplucher et laver les autres légumes ; garder les pommes de terre entières ou en gros morceaux.', 'Mettre poitrine et porc demi-sel dans une marmite, couvrir d’eau froide, porter à ébullition puis égoutter.', 'Remettre les viandes dans la marmite avec carottes, oignons, poireaux et navets, ajouter le poivre en grains et couvrir d’eau.', 'Couvrir et cuire 35min à partir de la reprise de l’ébullition.', 'Ajouter pommes de terre, chou, saucisson à l’ail et saucisses de Morteau.', 'Couvrir et poursuivre la cuisson 20min, jusqu’à légumes tendres et viandes chaudes à cœur.', 'Égoutter et dresser viandes et légumes sur un grand plat, parsemer de persil et servir avec de la moutarde.'],
  notes: ['Le blanchiment retire l’excès de sel et les impuretés des viandes.', 'Ne pas piquer les saucisses de Morteau afin de conserver leur jus.'],
  source: 'https://www.meilleurduchef.com/fr/recette/potee-legumes.html'
});

recipes.lapin_saute_chasseur = {
  title: 'Lapin sauté chasseur',
  ...common,
  image: '/assets/recipes/heroes/lapin_saute_chasseur.jpg',
  seasons: ['Automne', 'Hiver'],
  difficultyScore: 5,
  yield: '6 personnes',
  activeTime: 30,
  cookTime: 45,
  aliases: ['lapin chasseur', 'lapin sauce chasseur'],
  tags: ['lapin', 'chasseur', 'champignons', 'lardons', 'vin blanc'],
  linkedRecipes: [{ id: 'sauce_chasseur', role: 'Sauce associée' }],
  ingredients: [{ group: 'Lapin chasseur', items: ['1 lapin de 1,8kg coupé en morceaux', '60g huile', '30g farine', '4 échalotes', '200g lardons fumés', '4 gousses d’ail', '300ml vin blanc sec', '150ml bouillon de volaille', '2 tomates', '3 carottes', '250g champignons de Paris', '1 bouquet garni', 'Sel fin', 'Poivre du moulin'] }],
  steps: ['Émincer finement échalotes et ail ; couper les carottes en rondelles de 2 à 3mm.', 'Chauffer l’huile dans une cocotte, faire suer échalotes, ail et carottes quelques minutes.', 'Ajouter lardons et morceaux de lapin, puis faire dorer sur toutes les faces.', 'Singer avec la farine et mélanger pour bien enrober.', 'Verser le vin blanc et le bouillon, ajouter le bouquet garni, saler légèrement et poivrer.', 'Couvrir et laisser mijoter doucement environ 30min.', 'Monder et concasser les tomates ; nettoyer et émincer les champignons.', 'Ajouter tomates et champignons, puis poursuivre la cuisson 15min à découvert jusqu’à lapin tendre et sauce nappante.', 'Retirer le bouquet garni, rectifier l’assaisonnement et servir chaud.'],
  notes: ['Saler avec prudence, car les lardons et le bouillon apportent déjà du sel.', 'La cuisson douce garde le lapin moelleux.'],
  source: 'https://www.meilleurduchef.com/fr/recette/lapin-chasseur.html'
};

recipes.carpaccio_boeuf = {
  title: 'Carpaccio de bœuf',
  master: 'entrees_maitre',
  additionalMasters: ['plats_maitre'],
  image: '/assets/recipes/heroes/carpaccio_boeuf.jpg',
  categories: ['Entrées', 'Plats'],
  seasons: ['Printemps', 'Été'],
  difficulty: 'easy',
  difficultyScore: 2,
  yield: '4 personnes',
  activeTime: 20,
  restTime: 60,
  aliases: ['carpaccio bœuf parmesan roquette'],
  tags: ['bœuf cru', 'carpaccio', 'parmesan', 'roquette', 'pignons'],
  ingredients: [{ group: 'Carpaccio', items: ['400g rond de gîte de bœuf très frais', '2 citrons jaunes', 'Huile d’olive, même volume que le jus de citron', 'Parmesan en copeaux', 'Roquette', 'Pignons de pin', 'Sel fin', 'Poivre du moulin'] }],
  steps: ['Placer la viande au congélateur quelques heures pour la raffermir sans la congeler à cœur.', 'La sortir 10min avant la découpe et la tailler en tranches très fines, idéalement à la trancheuse.', 'Disposer immédiatement les tranches en rosace sur des assiettes très froides.', 'Presser les citrons, mesurer le jus et le mélanger avec le même volume d’huile d’olive, du sel et du poivre du moulin.', 'Napper la viande avec cette marinade.', 'Ajouter les pignons, quelques feuilles de roquette et des copeaux de parmesan.', 'Servir sans attendre.'],
  notes: ['Utiliser une viande d’une fraîcheur irréprochable et maintenir la chaîne du froid.', 'Dresser et assaisonner au dernier moment pour éviter que le citron ne cuise trop la viande.'],
  source: 'https://www.meilleurduchef.com/fr/recette/carpaccio-boeuf.html'
};

fs.writeFileSync(file, `window.RECIPES = ${JSON.stringify(recipes)};\n`);
