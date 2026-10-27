const { test, expect } = require('@playwright/test');

// Parcours utilisateur reels (clics) : favoris, liste de courses, menu, retour arriere.
// Couvre deux regressions : coche du panier perdue apres rechargement (catalogue
// charge en differe) et position de l'accueil ecrasee au retour arriere.

const RECIPE = 'poulet_sauce_pimentee';

async function ready(page) {
  await page.locator('.mc-shell').waitFor({ timeout: 15000 });
  await expect(page.locator('#loading-screen')).toBeHidden({ timeout: 14000 });
}

function readStorage(page, key) {
  return page.evaluate(k => JSON.parse(localStorage.getItem(k) || 'null'), key);
}

function trackErrors(page) {
  const errors = [];
  page.on('pageerror', error => errors.push(`pageerror: ${error.message}`));
  page.on('console', message => { if (message.type() === 'error') errors.push(`console: ${message.text()}`); });
  page.on('dialog', dialog => dialog.accept());
  return errors;
}

// Mobile : pas de bouton favoris dans la barre du haut, on passe par l'accueil.
async function openFavorites(page, isMobile) {
  if (!isMobile) return page.getByRole('button', { name: 'Voir les favoris' }).first().click();
  await page.goto('/');
  await ready(page);
  await page.locator('.home-quick-actions button:visible').filter({ hasText: /Mes favoris/ }).first().click();
}

async function openShopping(page) {
  await page.locator('.home-quick-actions button:visible, .mobile-bottom-nav [aria-label="Courses"]:visible')
    .filter({ hasText: /Liste de courses|Liste|Courses/ }).first().click();
  await expect(page.locator('.shopping-modal')).toBeVisible();
}

test.describe('Cook Note parcours utilisateur', () => {
  test('favoris : recherche, ajout, persistance, vue favoris, retrait', async ({ page, isMobile }) => {
    const errors = trackErrors(page);
    await page.goto('/');
    await ready(page);

    await page.getByRole('button', { name: 'Rechercher' }).first().click();
    await page.locator('#cook-note-command-input:visible, #recipe-search-input:visible').first().fill('poulet sauce pimentée');
    const hit = page.locator('.search-result:visible, [data-vt-card]:visible, .command-recipe-row:visible')
      .filter({ hasText: /Poulet sauce pimentée/i }).first();
    await expect(hit).toBeVisible();
    await hit.click();
    await expect(page).toHaveURL(new RegExp(`/recette/${RECIPE}`));
    await ready(page);

    const favorite = page.locator('.favorite-action').first();
    await favorite.click();
    await expect(favorite).toHaveClass(/\bactive\b/);
    expect(JSON.stringify(await readStorage(page, 'cook_note_favorites'))).toContain(RECIPE);

    await page.reload();
    await ready(page);
    await expect(page.locator('.favorite-action').first()).toHaveClass(/\bactive\b/);

    await openFavorites(page, isMobile);
    const cards = page.locator('.season-sections [data-vt-card]');
    await expect(cards).toHaveCount(1);
    await expect(cards.first()).toContainText('Poulet');
    const tabs = page.locator('.favorite-collection-tabs button');
    expect(await tabs.count()).toBeGreaterThan(0);
    if (await tabs.count() > 1) {
      await tabs.nth(1).click();
      await tabs.nth(0).click();
      await expect(cards).toHaveCount(1);
    }

    await cards.first().click();
    await expect(page).toHaveURL(new RegExp(`/recette/${RECIPE}`));
    await ready(page);
    await page.locator('.favorite-action').first().click();
    await expect(page.locator('.favorite-action').first()).not.toHaveClass(/\bactive\b/);

    await openFavorites(page, isMobile);
    await expect(page.locator('.season-sections .empty-state')).toBeVisible();
    expect(errors).toEqual([]);
  });

  test('liste de courses : portions, deux recettes, coches conservees, filtres, vidage', async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto(`/recette/${RECIPE}`);
    await ready(page);

    const select = page.locator('.recipe-detail-hero select, .detail-quantity-control select').first();
    await select.selectOption('6');
    await expect(select).toHaveValue('6');
    await page.getByRole('button', { name: /Ajouter aux courses/i }).first().click();
    await expect(page.getByRole('button', { name: /Dans les courses/i }).first()).toBeVisible();
    expect(JSON.stringify(await readStorage(page, 'cook_note_shopping_basket'))).toContain(RECIPE);
    const factors = await readStorage(page, 'cook_note_shopping_factors');
    expect(factors?.[RECIPE]).toBeGreaterThan(1);

    await page.goto('/recette/croque_madame');
    await ready(page);
    await page.getByRole('button', { name: /Ajouter aux courses/i }).first().click();
    await expect(page.getByRole('button', { name: /Dans les courses/i }).first()).toBeVisible();

    await page.goto('/');
    await ready(page);
    await openShopping(page);
    const modal = page.locator('.shopping-modal');
    const title = page.locator('#shopping-modal-title');
    await expect(title).toContainText('2 recettes');
    const lines = page.locator('.shopping-line');
    expect(await lines.count()).toBeGreaterThan(3);
    const invalid = await lines.evaluateAll(items => items
      .map(item => item.querySelector('.shopping-line-main')?.textContent || '')
      .filter(text => !text.trim() || /NaN|undefined|null|\b0g\b|Infinity/.test(text)));
    expect(invalid).toEqual([]);

    await lines.first().locator('input[type=checkbox]').check();
    await expect(lines.first()).toHaveClass(/\bchecked\b/);
    await page.locator('.shopping-owned-btn').nth(1).click();
    await expect(page.locator('.shopping-owned-list')).toBeVisible();

    // Regression : le panier ouvert avant la fin du chargement du catalogue effacait les coches.
    await page.reload();
    await ready(page);
    await openShopping(page);
    await expect(title).toContainText('2 recettes');
    await expect(page.locator('.shopping-line.checked')).not.toHaveCount(0);
    await expect(page.locator('.shopping-owned-list')).toBeVisible();

    await modal.getByRole('button', { name: /Frais seulement/ }).click();
    await expect(modal.getByRole('button', { name: /Tout afficher/ })).toBeVisible();
    await modal.getByRole('button', { name: /Tout afficher/ }).click();

    const text = await page.locator('.combined-cart').textContent();
    expect(text).toMatch(/Liste de courses/);
    expect(text.length).toBeGreaterThan(80);

    await page.getByRole('button', { name: /Retirer Croque-madame du panier courses/i }).click();
    await expect(title).toContainText('1 recette');

    await modal.getByRole('button', { name: 'Sur mon téléphone' }).click();
    await expect(page.locator('.shopping-transfer .share-qr.is-ready')).toBeVisible();

    await modal.getByRole('button', { name: 'Vider le panier' }).click();
    await expect(title).toContainText('Aucune recette');
    expect(await readStorage(page, 'cook_note_shopping_basket') || []).toHaveLength(0);
    expect(errors).toEqual([]);
  });

  test('liste de courses : portions modifiables dans le panier et placard memorise', async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto('/');
    await ready(page);
    await page.evaluate(() => localStorage.setItem('cook_note_shopping_basket', JSON.stringify(['croque_madame'])));
    await page.reload();
    await ready(page);
    await openShopping(page);
    const bread = page.locator('.shopping-line').filter({ hasText: /pain de mie/ }).locator('strong');
    const before = Number(await bread.textContent());
    await page.locator('.shopping-picked-item').filter({ hasText: 'Croque-madame' }).locator('select').selectOption('4');
    await expect(bread).toHaveText(String(before * 2));
    expect((await readStorage(page, 'cook_note_shopping_factors'))?.croque_madame).toBe(2);

    const butter = page.locator('.shopping-line').filter({ hasText: /beurre/i }).first();
    const butterName = (await butter.locator('.shopping-line-main > span').textContent()).trim();
    await butter.getByRole('button', { name: /comme déjà à la maison/ }).click();
    const owned = page.locator('.shopping-owned-item').filter({ hasText: butterName });
    await owned.getByRole('button', { name: /au placard pour les prochaines listes/ }).click();
    await expect(owned.locator('.shopping-staple-btn')).toHaveAttribute('aria-pressed', 'true');

    // Vider le panier oublie les « J'ai deja », pas le placard.
    await page.locator('.shopping-modal').getByRole('button', { name: 'Vider le panier' }).click();
    expect(await readStorage(page, 'cook_note_shopping_owned')).toEqual({});
    await page.evaluate(() => localStorage.setItem('cook_note_shopping_basket', JSON.stringify(['croque_madame'])));
    await page.reload();
    await ready(page);
    await openShopping(page);
    await expect(page.locator('.shopping-owned-item.is-staple').filter({ hasText: butterName })).toBeVisible();
    await expect(page.locator('.shopping-line').filter({ hasText: butterName })).toHaveCount(0);

    // Remettre a acheter retire aussi l'article du placard.
    await page.locator('.shopping-owned-item').filter({ hasText: butterName }).getByRole('button', { name: /dans la liste à acheter/ }).click();
    await expect(page.locator('.shopping-line').filter({ hasText: butterName })).toHaveCount(1);
    expect(await readStorage(page, 'cook_note_shopping_staples')).toEqual({});
    expect(errors).toEqual([]);
  });

  test('liste de courses : intertitres ignores, cuilleres, pincees, pluriels et formats du commerce', async ({ page }) => {
    await page.goto('/');
    await ready(page);
    const items = await page.evaluate(() => {
      const recipe = (id, items) => ({ id, title: id, ingredients: [{ items }] });
      const data = buildShoppingListData([
        recipe('a', ['— Pâte —', 'Cuisson 20min à 180°C', '1 c. à soupe d’huile d’olive', '1 pincée de sel fin', '1 petit oignon', '300 g beurre', '3 œufs', '1 c. à café ail en poudre']),
        recipe('b', ['2 c. à soupe huile d’olive', 'Sel fin', '1 petit oignon', '20 cl crème liquide', '4 œufs'])
      ], {});
      return Object.fromEntries(data.groupedItems.map(item => [item.name, [formatShoppingAmount(item), item.purchaseHint].filter(Boolean).join(' | ')]));
    });
    expect(Object.keys(items).some(name => /Pâte|Cuisson/.test(name))).toBe(false);
    expect(items["huile d'olive"]).toBe('3 c. à s.');
    expect(items['Sel fin']).toBe('');
    expect(items['petits oignons']).toBe('2');
    expect(items.beurre).toBe('300 g | 1 plaquette de 250 g + 1 plaquette de 125 g');
    expect(items['œufs']).toBe('7 | 1 boîte de 12');
    expect(items['crème liquide']).toBe('200 ml | 1 briquette de 20 cl');
    expect(items['ail en poudre']).toBe('1 c. à c.');
  });

  test('menu : quatre plats envoyes a la liste de courses', async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto('/');
    await ready(page);
    await page.locator('.home-quick-actions button:visible, .mobile-bottom-nav [aria-label="Mode menu"]:visible')
      .filter({ hasText: /Composer un menu|Menu/ }).first().click();
    const menu = page.locator('.menu-planner-modal');
    await expect(menu).toBeVisible();
    await expect(menu.locator('.menu-planner-card')).toHaveCount(4);
    await menu.getByRole('button', { name: /Ajouter le menu aux courses/ }).click();
    await menu.getByRole('button', { name: 'Fermer' }).click();
    await expect(page.locator('.shopping-modal')).toBeVisible();
    await expect(page.locator('#shopping-modal-title')).toContainText(/recette/);
    expect(errors).toEqual([]);
  });

  // Regressions : la position de la page quittee (0) ecrasait celle de l'accueil,
  // et un retour pendant la transition d'ouverture etait remis en haut.
  for (const [label, delay] of [['immediat', 0], ['apres la transition', 1200]]) {
    test(`retour arriere ${label} : la position de defilement de l’accueil est restauree`, async ({ page }) => {
      const errors = trackErrors(page);
      await page.goto('/');
      await ready(page);
      await page.mouse.wheel(0, 500);
      await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(200);
      await page.waitForTimeout(500);
      const before = await page.evaluate(() => window.scrollY);

      await page.locator('[data-vt-card]').filter({ hasText: 'Apéro' }).first().click();
      await expect(page).toHaveURL(/apero_maitre/);
      await page.waitForTimeout(delay);
      await page.goBack();
      await expect.poll(() => new URL(page.url()).pathname).toBe('/');
      await page.waitForTimeout(1000);
      expect(Math.abs(await page.evaluate(() => window.scrollY) - before)).toBeLessThan(60);
      expect(errors).toEqual([]);
    });
  }
});
