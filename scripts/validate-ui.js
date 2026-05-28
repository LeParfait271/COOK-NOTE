const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const files = {
  app: fs.readFileSync(path.join(ROOT, 'app.js'), 'utf8'),
  style: fs.readFileSync(path.join(ROOT, 'style.css'), 'utf8'),
  server: fs.readFileSync(path.join(ROOT, 'server.js'), 'utf8'),
  packageJson: fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8')
};
const errors = [];

function expect(label, condition) {
  if (!condition) errors.push(label);
}

expect('Recherche ingredients integree absente.', files.app.includes('scoreIngredientSearch') && files.app.includes('ingredientMeta') && files.app.includes('ingredient-match-badge'));
expect('Recherche separee ingredients encore presente.', !files.app.includes('ingredient-search-input') && !files.app.includes('ingredient-search-help') && !files.app.includes('FridgeAssistant'));
expect('Recherche par intention absente.', files.app.includes('getRecipeIntentLabels') && files.app.includes('sans cuisson') && files.app.includes('à préparer à l’avance') && files.app.includes('congelable'));
expect('Filtres avances encore presents.', !files.app.includes('QUICK_FILTERS') && !files.app.includes('QuickFilterBar') && !files.style.includes('quick-filter-row'));
expect('Page techniques absente.', files.app.includes('TECHNIQUE_GUIDES') && files.app.includes('TechniquesView'));
expect('Techniques de cuisinier incompletes.', files.app.includes('Émincer') && files.app.includes('Monder des tomates') && files.app.includes('Abaisser une pâte') && files.app.includes('Foncer un moule') && files.app.includes('Étuver') && files.app.includes('Macaroner') && files.app.includes('Lisser'));
expect('Techniques saisir/badigeonner absentes.', files.app.includes("id: 'saisir'") && files.app.includes("id: 'badigeonner'"));
expect('Technique beurrer trop large.', !files.app.includes("'beurrer', 'fariner le moule'"));
expect('Liens vers techniques absents.', files.app.includes('buildTechniqueTargets') && files.app.includes('openTechnique') && files.style.includes('inline-technique-link'));
expect('Liens automatiques sans limite de mot.', files.app.includes('findLinkedTextMatch') && files.app.includes('isLinkedTextBoundary'));
expect('Liens automatiques sans priorite titre/alias.', files.app.includes('aliasesByTerm') && files.app.includes('priority') && files.app.includes('titleNormalized.includes(normalized)'));
expect('Liens automatiques fragiles avec accents/ligatures.', files.app.includes('buildNormalizedIndexMap') && files.app.includes('indexMap[end]'));
expect('Fiche technique sans liens automatiques.', files.app.includes('technical-card') && files.app.includes("h('dd', null, renderLinkedText(item.value || item.text || ''"));
expect('Anti-gaspillage oeufs absent.', files.app.includes('getEggPartUsage') && files.app.includes('getEggWasteRecipeRefs') && files.app.includes('Anti-gaspillage blancs d’œufs') && files.app.includes('Anti-gaspillage jaunes d’œufs'));
expect('Surbrillance technique absente.', files.app.includes('highlightedTechniqueId') && files.style.includes('techniquePulse') && files.style.includes('techniquePulse 1s ease-in-out 5'));
expect('Centrage des liens techniques absent.', files.app.includes('scrollElementToViewportCenter') && files.app.includes('targetTechniqueId') && files.app.includes('visualViewport') && files.app.includes('settleTimer') && !files.app.includes('cook-note:technique-target'));
expect('Route /techniques absente du serveur.', files.server.includes("url.pathname === '/techniques'"));
expect('Export recette propre absent.', files.app.includes('recipeExportText') && files.app.includes('Copier fiche'));
expect('Resume recette premium absent.', files.app.includes('recipe-summary-panel') && files.style.includes('.recipe-summary-panel'));
expect('Passe premium composants absente.', files.style.includes('content-visibility: auto') && files.style.includes('.recipe-card::before') && files.style.includes('.variant-card::before') && files.app.includes("name: 'spark'"));
expect('Badges categories incomplets sur les cartes.', files.app.includes('function categoryLine') && files.app.includes("join(' / ')") && files.app.includes('categoryLine(recipe)') && files.app.includes('categoryLine(item)') && !files.app.includes('categories.slice(0, 1)') && files.style.includes('.tag-line'));
expect('Collections encore traitees comme variantes bloquees.', files.app.includes('CollectionLinksPanel') && files.app.includes('recipes.filter(recipe => !recipe.master)') && !files.app.includes('variantSelection') && !files.app.includes('setActiveId(activeRecipe.master)') && !files.style.includes('variant-picker-panel-selected'));
expect('Sous-titre de carte recette encore base sur portions/rendement.', files.app.includes('getRecipeVariantLabel') && files.app.includes('countInlineVariantGroups') && !files.app.includes('item.yield || difficultyText(item)') && !files.app.includes("recipe.yield || ''"));
expect('Etapes de variantes inline non separees.', files.app.includes('getSelectedInlineVariantSteps') && files.app.includes('selectedInlineVariantGroup?.group') && files.app.includes('variant-group:${selectedInlineVariantGroup.index}'));
expect('Onglets recette mobile non bornes.', files.style.includes('.recipe-tabs button span') && files.style.includes('text-overflow: ellipsis') && files.style.includes('grid-template-columns: repeat(3, minmax(0, 1fr))'));
expect('Precision cuilleres mal rangee.', files.app.includes('spoonPrecisionLabel') && files.app.includes('SPOON_WEIGHT_NOTE') && files.app.includes("add('measures', 'Repère indicatif'") && !files.style.includes('.average-weight-note'));
expect('Materiel necessaire encore dans la colonne droite.', !files.app.includes("add('equipment', 'Matériel nécessaire'"));
expect('Notes pratiques encore classees en double.', files.app.includes('noteAlreadyClassified') && files.app.includes('!noteAlreadyClassified(note)') && files.app.includes('storageNotes.includes(note)'));
expect('CSS mobile nav incoherent.', files.style.includes('grid-template-columns: repeat(5, 1fr)'));
expect('Scrollbars visibles dans panneaux longs.', files.style.includes('.recipe-panel::-webkit-scrollbar') && files.style.includes('.notes-panel::-webkit-scrollbar'));
expect('CSS print propre absent.', files.style.includes('@media print') && files.style.includes('.recipe-summary-panel'));
expect('Ancienne section dashboard encore presente.', !files.app.includes('function HomeDashboard') && !files.style.includes('.home-dashboard'));
expect('Ancienne section collections encore presente.', !files.app.includes('SmartCollections') && !files.style.includes('smart-collection'));
expect('Mode cuisine revenu.', !files.app.includes('Mode cuisine') && !files.app.includes('focusMode') && !files.style.includes('recipe-focus-mode') && !files.style.includes('focus-toggle') && !files.style.includes('focus-action'));
expect('Boutons minuteurs revenus.', !files.app.includes('step-timer') && !files.style.includes('step-timer') && !files.app.includes('timerEnd') && !files.app.includes('timerLabel') && !files.app.includes('cooking-step-card') && !files.style.includes('cooking-step-actions'));
expect('Fiche rapide variantes sans etat vide.', files.app.includes('recipe-summary-empty') && files.app.includes('Sélectionne une variante pour afficher les informations de la fiche rapide.'));
expect('Version footer absente.', files.app.includes("const SITE_VERSION = 'v0.88'") && files.app.includes("const SITE_UPDATED_AT = '28/05/26'") && files.app.includes('site-footer-version'));
expect('Script validate-ui non branche au check.', files.packageJson.includes('scripts/validate-ui.js'));

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('Validation UI OK.');
