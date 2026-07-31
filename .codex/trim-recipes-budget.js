const fs = require('fs');
const vm = require('vm');

const context = { window: {} };
vm.runInNewContext(fs.readFileSync('recipes.js', 'utf8'), context);
const recipes = context.window.RECIPES;

recipes.pate_en_croute_noel.steps = [
  'La veille, sabler farine, beurre et sel à la feuille, puis ajouter les œufs, le jaune et juste assez d’eau froide pour former la pâte.',
  'Fraiser brièvement, filmer et garder 24h au réfrigérateur.',
  'Parer les viandes très froides ; hacher poitrine, échine et foies, et garder du magret en lanières pour la mosaïque.',
  'Mélanger viandes, sel, poivre du moulin, muscade, cognac, pistaches et panko jusqu’à liaison ; filmer et garder 24h au froid.',
  'Abaisser la pâte et chemiser le moule en réservant le couvercle.',
  'Tasser la farce et les lanières de magret sans laisser de poches d’air.',
  'Fermer, souder, décorer et aménager deux cheminées.',
  'Dorer au jaune détendu de lait et cuire environ 1h30 à 180°C, jusqu’à croûte dorée et farce cuite à cœur.',
  'Laisser refroidir complètement dans le moule.',
  'Préparer la gelée, la parfumer au Madère et la verser peu à peu par les cheminées.',
  'Réfrigérer une nuit avant de démouler et trancher.'
];

recipes.pate_en_croute_noel.notes = [
  'Garder pâte et farce froides pour une coupe nette.',
  'Verser la gelée en plusieurs fois après absorption.',
  'Servir bien frais avec pickles ou salade.'
];

recipes.poulet_vin_jaune.notes = [
  'Réduire brièvement pour préserver le vin jaune.',
  'Filtrer toute eau de réhydratation des morilles pour retirer le sable.'
];

recipes.poulet_marengo.notes = [
  'Absorber la farine avant les liquides pour éviter les grumeaux.',
  'La sauce finale doit être nappante, tomatée et brillante.'
];

recipes.potee_chou.notes = [
  'Blanchir les viandes retire excès de sel et impuretés.',
  'Ne pas piquer les saucisses de Morteau.'
];

recipes.lapin_saute_chasseur.notes = [
  'Saler peu : lardons et bouillon le sont déjà.',
  'Mijoter doucement pour un lapin moelleux.'
];

recipes.carpaccio_boeuf.notes = [
  'Employer une viande très fraîche et la garder froide.',
  'Assaisonner au dernier moment pour limiter la cuisson par le citron.'
];

fs.writeFileSync('recipes.js', `window.RECIPES = ${JSON.stringify(recipes)};\n`);
