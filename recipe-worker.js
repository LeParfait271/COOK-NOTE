/* Cook Note: parse the full recipe catalog away from the main UI thread. */
'use strict';

self.window = self;
let recipeCatalog = null;

function loadRecipeCatalog(src) {
  if (recipeCatalog) return recipeCatalog;
  importScripts(src);
  recipeCatalog = self.RECIPES && typeof self.RECIPES === 'object' ? self.RECIPES : {};
  return recipeCatalog;
}

self.addEventListener('message', event => {
  const data = event.data || {};
  if (data.type !== 'load' || !data.id) return;

  try {
    const catalog = loadRecipeCatalog(data.src);
    const recipe = catalog[data.id] || null;
    if (!recipe) throw new Error('Fiche recette introuvable.');
    self.postMessage({ type: 'recipe', id: data.id, recipe });
  } catch (error) {
    self.postMessage({
      type: 'error',
      id: data.id,
      message: String(error?.message || error || 'Chargement de la fiche impossible.')
    });
  }
});
