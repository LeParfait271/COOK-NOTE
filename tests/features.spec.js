const { test, expect } = require('@playwright/test');

// Fonctions recentes : site anglais (pages /en/, recherche, unites, aucun
// texte francais visible sur l'accueil), carte des saisons, parcours de chef
// (paliers, verdict), Ma semaine, Mon frigo, regimes, valeurs nutritionnelles,
// partage avec portions.

// Catalogue complet (ingredients, etapes) : l'accueil ne charge que le resume.
async function fullCatalog(page) {
  await page.addScriptTag({ url: '/recipes.js' });
  await page.waitForFunction(() => Object.values(window.RECIPES || {}).filter(recipe => (recipe.ingredients || []).length).length > 300, null, { timeout: 20000 });
}

async function ready(page) {
  await page.locator('.mc-shell').waitFor({ timeout: 15000 });
  await expect(page.locator('#loading-screen')).toBeHidden({ timeout: 14000 });
}

function trackErrors(page) {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  return errors;
}

const FRENCH_UI = /\b(Rechercher|Ajouter aux courses|Liste de courses|Mes favoris|Composer un menu|Ma semaine|Mon frigo|Saisons|Toutes les catégories|personnes|ingrédients|étapes)\b/;

test.describe('Cook Note fonctions recentes', () => {
  test('page anglaise /en/ : langue, titre, liens de langue, aucune interface en francais', async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto('/en/recette/chipirons_a_la_plancha/');
    await ready(page);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('h1').first()).toHaveText(/Grilled baby squid/);
    await expect(page.locator('link[hreflang="fr"]')).toHaveCount(1);
    await expect(page.locator('link[hreflang="en"]')).toHaveCount(1);
    await page.goto('/en/');
    await ready(page);
    const quick = (await page.locator('.home-quick-actions').innerText()).replace(/\s+/g, ' ');
    expect(quick).not.toMatch(FRENCH_UI);
    expect(quick).toMatch(/Shopping list/);
    await expect(page.locator('.top-lang-btn')).toHaveText('EN');
    expect(errors).toEqual([]);
  });

  test('recherche en anglais et unites US', async ({ page }) => {
    await page.goto('/en/');
    await ready(page);
    await fullCatalog(page);
    const titles = await page.evaluate(() => (window.RECIPES ? Object.values(window.RECIPES) : [])
      .map(recipe => ({ recipe, meta: scoreRecipeSearch(recipe, 'chicken', {}) }))
      .filter(item => item.meta.score > 0)
      .map(item => tc(item.recipe.title)));
    expect(titles.length).toBeGreaterThan(3);
    expect(titles.some(title => /chicken/i.test(title))).toBe(true);
    const converted = await page.evaluate(() => {
      setCookNoteUnits('us');
      const result = usUnits('200g strawberries, bake at 180°C');
      setCookNoteUnits('metric');
      return result;
    });
    expect(converted).toMatch(/oz/);
    expect(converted).toMatch(/356°F/);
  });

  test('carte des saisons : douze mois sans defilement lateral, fruits et legumes', async ({ page }) => {
    await page.goto('/');
    await ready(page);
    await page.locator('.home-seasons-action').click();
    await expect(page.locator('.season-modal')).toBeVisible();
    await expect(page.locator('.season-card').first()).toBeVisible({ timeout: 15000 });
    await expect(page.locator('.season-months button')).toHaveCount(12);
    const overflow = await page.locator('.season-months').evaluate(node => node.scrollWidth - node.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
    await page.locator('.season-kinds button').nth(1).click();
    await expect(page.locator('.season-card').first()).toBeVisible();
    expect(await page.locator('.season-card').count()).toBeGreaterThan(20);
  });

  test('parcours de chef : palier de technique a 200 et serie', async ({ page }) => {
    await page.goto('/');
    await ready(page);
    await fullCatalog(page);
    const result = await page.evaluate(() => {
      const id = TECHNIQUE_GUIDES[0].id;
      localStorage.setItem('cook_note_chef', JSON.stringify({ rating: 400, best: 400, cooked: {}, tech: { [id]: 199 }, unlocked: { [id]: Date.now() }, master: {}, history: [] }));
      const entry = Object.entries(window.RECIPES).find(([, item]) => (item.steps || []).length && chefRecipeTechniques(item).includes(id));
      const recipe = entry ? { id: entry[0], ...entry[1] } : null;
      if (!recipe) return { skipped: true };
      const verdict = recordChefVerdict(recipe, 'reussi');
      const tierFor200 = chefTechTier(200);
      localStorage.removeItem('cook_note_chef');
      return { tiered: verdict.tiered.map(item => item.tier.label), tierFor200, streak: chefStreak({ history: [{ score: 1 }, { score: 1 }, { score: 0 }] }) };
    });
    if (result.skipped) test.skip();
    expect(result.tierFor200).toBe(0);
    expect(result.tiered).toContain('Bronze');
    expect(result.streak).toBe(2);
  });

  test('Ma semaine se remplit et Mon frigo propose des recettes', async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto('/');
    await ready(page);
    await page.evaluate(() => { localStorage.removeItem('cook_note_week'); localStorage.removeItem('cook_note_fridge'); });
    await page.locator('.home-week-action').click();
    await expect(page.locator('.week-modal')).toBeVisible();
    await page.waitForFunction(() => Object.keys(window.RECIPES || {}).length > 200, null, { timeout: 15000 });
    await page.locator('.week-tool.is-primary').click();
    await expect(page.locator('.week-slot.is-filled')).toHaveCount(14);
    await page.keyboard.press('Escape');
    await page.locator('.home-fridge-action').click();
    await expect(page.locator('.fridge-modal')).toBeVisible();
    for (const item of ['poulet', 'courgette', 'tomate']) {
      await page.locator('.fridge-form input').fill(item);
      await page.locator('.fridge-form button[type="submit"]').click();
    }
    await expect(page.locator('.fridge-items button').first()).toBeVisible();
    await expect(page.locator('.fridge-results li').first()).toBeVisible({ timeout: 15000 });
    await page.evaluate(() => { localStorage.removeItem('cook_note_week'); localStorage.removeItem('cook_note_fridge'); });
    expect(errors).toEqual([]);
  });

  test('regimes, valeurs nutritionnelles et lien partage avec portions', async ({ page }) => {
    await page.goto('/recette/salade_cesar/');
    await ready(page);
    await fullCatalog(page);
    const diets = await page.evaluate(() => ({
      cesar: getRecipeDiets(window.RECIPES.salade_cesar || {}),
      lentilles: getRecipeDiets(Object.values(window.RECIPES).find(item => /lentilles tomate pommes de terre/i.test(item.title)) || {})
    }));
    expect(diets.cesar).not.toContain('vegetarien');
    expect(diets.lentilles).toContain('vegan');
    await expect(page.locator('.nutrition-card')).toHaveCount(1, { timeout: 15000 });
    await expect(page.locator('.nutrition-kcal')).toContainText('kcal');
    await page.goto('/recette/beurre_blanc/?pour=6');
    await ready(page);
    await expect(page.locator('.quantity-stepper-value').first()).toContainText('6');
  });
});
