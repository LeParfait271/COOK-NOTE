const { test, expect } = require('@playwright/test');

const MOJIBAKE_PATTERN = /(?:\u00c3.|\u00c2.|\u00e2\u20ac|\u00e2\u20ac\u2122|\u00c5\u201c|\ufffd)/;
const CATEGORY_PARENT_ROUTES = [
  ['apero_maitre', 'Ap\u00e9ro'],
  ['entrees_maitre', 'Entr\u00e9es'],
  ['plats_maitre', 'Plats'],
  ['accompagnements_maitre', 'Accompagnements'],
  ['desserts_maitre', 'Desserts'],
  ['petit_dejeuner_maitre', 'Petit-d\u00e9jeuner'],
  ['sauces_maitre', 'Sauces'],
  ['elements_base_maitre', 'Bases']
];

async function waitForCookNote(page) {
  await expect(page.locator('#root > *').first()).toBeVisible({ timeout: 14000 });
  await expect(page.locator('#loading-screen')).toBeHidden({ timeout: 14000 });
}

async function forceTheme(page, theme) {
  await page.addInitScript(nextTheme => {
    localStorage.setItem('cook_note_preferences', JSON.stringify({ theme: nextTheme }));
  }, theme);
}

async function settleVisualFrame(page) {
  await page.evaluate(() => {
    const root = document.documentElement;
    const previous = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';
    window.scrollTo(0, 0);
    root.style.scrollBehavior = previous;
  });
  await page.waitForTimeout(50);
  await page.evaluate(() => new Promise(resolve => {
    requestAnimationFrame(() => requestAnimationFrame(resolve));
  }));
  await page.waitForTimeout(350);
}

async function expectNoMojibake(page) {
  const visibleText = await page.locator('body').innerText();
  expect(visibleText).not.toMatch(MOJIBAKE_PATTERN);
}

async function expectNoHorizontalOverflow(page) {
  const overflow = await page.evaluate(() =>
    Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth)
  );
  expect(overflow).toBeLessThanOrEqual(2);
}

async function expectImagesReady(page, selector, minCount) {
  await expect(async () => {
    const count = await page.locator(selector).evaluateAll(images =>
      images.filter(image => image.complete && image.naturalWidth >= 80 && image.naturalHeight >= 60).length
    );
    expect(count).toBeGreaterThanOrEqual(minCount);
  }).toPass({ timeout: 12000 });
}

async function expectBackgroundImagesReady(page, selector, minCount) {
  await expect(async () => {
    const count = await page.locator(selector).evaluateAll(async elements => {
      const urls = elements
        .map(element => getComputedStyle(element).backgroundImage.match(/url\(["']?(.+?)["']?\)/)?.[1])
        .filter(Boolean);
      const results = await Promise.all(urls.map(url => new Promise(resolve => {
        const image = new Image();
        image.onload = () => resolve(image.naturalWidth >= 80 && image.naturalHeight >= 60);
        image.onerror = () => resolve(false);
        image.src = url;
      })));
      return results.filter(Boolean).length;
    });
    expect(count).toBeGreaterThanOrEqual(minCount);
  }).toPass({ timeout: 12000 });
}

async function expectSelectedLanguage(page, value, label) {
  const toggle = page.locator('.language-toggle:visible').first();
  await expect(toggle).toHaveAttribute('data-locale', value);
  await expect(toggle.locator('.language-toggle-code.active')).toHaveText(label);
  await expect(page.locator('.language-switcher select')).toHaveCount(0);
}

test.describe('Cook Note visual smoke', () => {
  test('home renders cards, images and clean text', async ({ page }, testInfo) => {
    await forceTheme(page, 'dark');
    await page.goto('/?lang=fr');
    await waitForCookNote(page);

    await expect(page.locator('.home-view')).toBeVisible();
    await expect(page.locator('.hero-atmosphere-glow')).toHaveCount(1);
    await expect(page.locator('.hero-atmosphere-mist')).toHaveCount(1);
    await expect(page.locator('.home-view > .hero button, .home-view > .hero a')).toHaveCount(0);
    await expect(page.locator('.home-command-status')).toHaveCount(0);
    await expect(async () => {
      const count = await page.locator('.recipe-card').count();
      expect(count).toBeGreaterThanOrEqual(8);
    }).toPass();
    await expect(page.locator('.recipe-card.master-card .card-category-crest')).toHaveCount(0);
    await expect(page.locator('.recipe-card.master-card .card-category-index')).toHaveCount(0);
    await expect(page.locator('.recipe-card.master-card .card-chapter-mark')).toHaveCount(0);
    const masterCardMetrics = await page.locator('.recipe-card.master-card').evaluateAll(cards => cards.map(card => {
      const rect = card.getBoundingClientRect();
      const style = getComputedStyle(card);
      const edge = getComputedStyle(card, '::before');
      return {
        title: card.getAttribute('title'),
        heading: card.querySelector('.card-title')?.textContent.trim() || '',
        ratio: rect.width / rect.height,
        leftBorder: style.borderLeftWidth,
        rightBorder: style.borderRightWidth,
        rightBorderColor: style.borderRightColor,
        edgeDisplay: edge.display,
        edgeRightBorder: edge.borderRightWidth,
        edgeRightColor: edge.borderRightColor,
        edgeZIndex: Number(edge.zIndex)
      };
    }));
    expect(masterCardMetrics).toHaveLength(8);
    expect(masterCardMetrics.every(card => card.title === card.heading && Math.abs(card.ratio - (16 / 9)) < 0.08)).toBe(true);
    expect(masterCardMetrics.every(card => card.rightBorder === card.leftBorder && card.rightBorder !== '0px' && card.rightBorderColor !== 'rgba(0, 0, 0, 0)')).toBe(true);
    expect(masterCardMetrics.every(card => card.edgeDisplay === 'block' && card.edgeRightBorder !== '0px' && card.edgeRightColor !== 'rgba(0, 0, 0, 0)' && card.edgeZIndex > 1)).toBe(true);
    await expect(page.locator('.top-menu-btn, .top-techniques-btn, .top-actions .cart-icon-btn, .top-actions [aria-label="Panier courses"]')).toHaveCount(0);
    await expect(page.locator('.home-quick-actions button')).toHaveCount(4);
    if (testInfo.project.name === 'mobile') {
      await expect(page.locator('.mobile-bottom-nav')).toHaveCount(0);
    }
    await expect(page.locator('.home-view > .hero .hero-logo')).toHaveCount(0);
    await expect(page.locator('.home-view > .hero .hero-wordmark')).toHaveText('Cook Note');
    await expect(page.locator('.recipe-card[data-recipe-id="accompagnements_maitre"] h3')).toBeVisible();
    await page.keyboard.press('Control+K');
    await expect(page.locator('.command-palette')).toBeVisible();
    expect(await page.locator('.command-row').count()).toBeLessThanOrEqual(4);
    await expect(page.locator('.command-recipe-row')).toHaveCount(0);
    await page.locator('#cook-note-command-input').fill('poulet');
    await expect(page.locator('.command-recipe-row')).not.toHaveCount(0);
    await expect(page.locator('.command-row')).toHaveCount(0);
    await expectNoMojibake(page);
    await page.keyboard.press('Escape');
    await expect(page.locator('.command-palette')).toBeHidden();
    await page.locator('.home-search-launcher').click();
    await expect(page.locator('.search-modal')).toBeVisible();
    expect(await page.locator('.search-quick-rail button').count()).toBeLessThanOrEqual(4);
    const searchInput = page.locator('#recipe-search-input');
    await searchInput.fill('poulet');
    await expect(searchInput).toHaveValue('poulet');
    await expect(page.locator('.search-result-count')).toContainText(/résultat|Recherche en cours/, { timeout: 4000 });
    await expect(page.locator('.search-result')).not.toHaveCount(0, { timeout: 5000 });
    await expect(page.locator('.search-result')).toHaveCount(12);
    await searchInput.fill('');
    await page.keyboard.press('Escape');
    await expect(page.locator('.search-modal')).toBeHidden();
    await expect(page.locator('.recipe-card.master-card')).toHaveCount(8);
    await expect(page.locator('.recipe-card .card-facts')).toHaveCount(0);
    await expect(page.locator('.season-sections.is-default-catalog')).toHaveCount(1);
    await expect(page.locator('.season-dashboard h2')).toHaveText('Toutes les catégories');
    await expect(page.locator('.season-block-default .season-block-head')).toHaveCount(0);
    const homeLayout = await page.evaluate(() => {
      const grid = document.querySelector('.master-recipe-grid').getBoundingClientRect();
      const footer = document.querySelector('.site-footer').getBoundingClientRect();
      const search = getComputedStyle(document.querySelector('.home-search-launcher'));
      return {
        footerGap: footer.top - grid.bottom,
        leftDelta: Math.abs(footer.left - grid.left),
        widthDelta: Math.abs(footer.width - grid.width),
        searchClipPath: search.clipPath
      };
    });
    expect(homeLayout.footerGap).toBeGreaterThanOrEqual(testInfo.project.name === 'mobile' ? 32 : 48);
    expect(homeLayout.footerGap).toBeLessThanOrEqual(128);
    expect(homeLayout.leftDelta).toBeLessThanOrEqual(1);
    expect(homeLayout.widthDelta).toBeLessThanOrEqual(1);
    expect(homeLayout.searchClipPath).toBe('none');
    await page.evaluate(() => document.querySelectorAll('.recipe-card')[7]?.scrollIntoView({ block: 'center' }));
    await page.waitForTimeout(250);
    await page.evaluate(() => document.querySelector('.recipe-card')?.scrollIntoView({ block: 'center' }));
    await expectImagesReady(page, '.recipe-card img', 6);
    const firstDarkCardSource = await page.locator('.recipe-card.master-card .card-image').first().getAttribute('src');
    expect(firstDarkCardSource).toContain('/assets/theme/dark/categories/');
    expect(firstDarkCardSource).toContain('_maitre.jpg?v=');
    expect(firstDarkCardSource).not.toContain('/assets/recipes/cards/parent_');
    await expectNoMojibake(page);
    await expectNoHorizontalOverflow(page);
    await settleVisualFrame(page);

    await page.screenshot({
      path: testInfo.outputPath(`home-${testInfo.project.name}.png`),
      fullPage: false
    });
  });

  test('day mode renders from the same design system', async ({ page }, testInfo) => {
    await forceTheme(page, 'light');
    await page.goto('/?lang=fr');
    await waitForCookNote(page);

    await expect(page.locator('.mc-shell.theme-light')).toBeVisible();
    await expect(page.locator('.theme-toggle-btn')).toHaveAttribute('aria-pressed', 'true');
    await expectSelectedLanguage(page, 'fr', 'FR');
    await page.locator('.language-toggle:visible').first().click();
    await expectSelectedLanguage(page, 'en', 'EN');
    await expect(page.locator('.hero-system-label')).toHaveText('Culinary archives · The twin citadels');
    await expect(page.locator('.home-search-copy strong')).toHaveText('Search for a recipe or ingredient');
    await expect(page.locator('.home-search-copy small')).toHaveText('Title, ingredient, season, craving or technique');
    const englishCategoryTitle = page.getByRole('heading', { level: 3, name: 'Appetizers', exact: true });
    await expect(englishCategoryTitle).toBeVisible();
    await expect(englishCategoryTitle).not.toHaveClass(/sr-only/);
    await page.locator('.language-toggle:visible').first().click();
    await expectSelectedLanguage(page, 'fr', 'FR');
    await expect(page.locator('.home-view')).toBeVisible();
    const lightArt = await page.evaluate(() => ({
      background: getComputedStyle(document.documentElement).getPropertyValue('--art-background-image').trim(),
      hero: getComputedStyle(document.documentElement).getPropertyValue('--art-hero-image').trim(),
      assets: document.documentElement.dataset.artAssets
    }));
    expect(lightArt.assets).toBe('approved');
    expect(lightArt.background).toContain('/assets/theme/day/global/hero.jpg');
    expect(lightArt.hero).toContain('/assets/theme/day/global/hero.jpg');
    await expect(page.locator('.hero-wordmark')).toBeVisible();
    await expect(page.locator('.hero-wordmark')).toHaveText('Cook Note');
    await expect(page.locator('.home-view > .hero .hero-logo')).toHaveCount(0);
    const topbarColors = await page.locator('.topbar').evaluate(node => {
      const buttons = Array.from(node.querySelectorAll('.top-right .icon-square'));
      return buttons.map(button => {
        const icon = button.querySelector('.site-icon');
        return {
          label: button.getAttribute('aria-label') || '',
          icon: icon ? getComputedStyle(icon).color : '',
          button: getComputedStyle(button).color,
          background: getComputedStyle(button).backgroundColor
        };
      });
    });
    expect(topbarColors).toHaveLength(4);
    topbarColors.forEach(colors => {
      expect(colors.icon, colors.label).toBe(colors.button);
      expect(colors.icon, colors.label).not.toBe('rgb(255, 255, 255)');
      expect(colors.background, colors.label).not.toBe('rgba(0, 0, 0, 0)');
    });
    await page.keyboard.press('Control+K');
    await expect(page.locator('.command-palette')).toBeVisible();
    const commandIconColor = await page.locator('.command-row-icon').first().evaluate(node => getComputedStyle(node).color);
    expect(commandIconColor).not.toBe('rgb(255, 255, 255)');
    await page.keyboard.press('Escape');
    const firstDayCardSource = await page.locator('.recipe-card.master-card .card-image').first().getAttribute('src');
    expect(firstDayCardSource).toContain('/assets/theme/dark/categories/');
    expect(firstDayCardSource).toContain('_maitre.jpg?v=');
    expect(firstDayCardSource).not.toContain('/assets/recipes/cards/parent_');
    const firstCardMediaOpacity = await page.locator('.recipe-card.master-card .card-media').first().evaluate(node =>
      getComputedStyle(node).opacity
    );
    expect(Number(firstCardMediaOpacity)).toBeGreaterThan(0.95);
    await expectNoMojibake(page);
    await expectNoHorizontalOverflow(page);
    await settleVisualFrame(page);

    await page.screenshot({
      path: testInfo.outputPath(`home-light-${testInfo.project.name}.png`),
      fullPage: false
    });

    await page.goto('/recette/poulet_sauce_pimentee?lang=fr');
    await waitForCookNote(page);
    await expect(page.locator('.recipe-command-dock')).toHaveCount(0);
    await expect(page.locator('.detail-actions')).toBeVisible();
    await page.locator('.theme-toggle-btn').click();
    await expect(page.locator('.mc-shell.theme-dark')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.dataset.theme)).toBe('dark');
    await page.locator('.theme-toggle-btn').click();
    await expect(page.locator('.mc-shell.theme-light')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.dataset.theme)).toBe('light');
  });

  test('english recipe controls stay translated', async ({ page }) => {
    await forceTheme(page, 'dark');
    await page.goto('/recette/poulet_sauce_pimentee?lang=en');
    await waitForCookNote(page);

    await expectSelectedLanguage(page, 'en', 'EN');
    await expect(page.locator('.recipe-command-dock')).toHaveCount(0);
    const detailActions = page.locator('.detail-actions');
    await expect(detailActions).toBeVisible();
    await expect(detailActions.getByRole('button', { name: /Add to shopping|In shopping|Remove from shopping/i })).toBeVisible();
    await expect(detailActions.getByRole('button', { name: /Add to favorites|Remove from favorites/i })).toBeVisible();
    const dockText = await detailActions.innerText();
    expect(dockText).not.toMatch(/(^|\s)Favori($|\s)/);
    expect(dockText).not.toMatch(/(^|\s)prêt($|\s)/);
    await page.goto('/recette/acras_epinards?lang=en');
    await waitForCookNote(page);
    await expect(page.getByRole('heading', { level: 1, name: 'Spinach fritters', exact: true })).toBeVisible();
    await expectNoMojibake(page);
    await expectNoHorizontalOverflow(page);
  });

  test('english inline variant recipe content stays translated', async ({ page }) => {
    await forceTheme(page, 'dark');
    await page.goto('/recette/beignets_calamar?lang=en');
    await waitForCookNote(page);

    await expectSelectedLanguage(page, 'en', 'EN');
    await expect(page.getByRole('heading', { level: 1, name: /Calamari fritters/i })).toBeVisible();
    await page.locator('.variant-choice-button').filter({ hasText: /Calamari/i }).first().click();
    const mobileTabs = page.locator('.recipe-tabs');
    if (await mobileTabs.isVisible()) {
      await mobileTabs.getByRole('tab', { name: /Steps/i }).click();
    }
    await expect(page.locator('.step-list')).toBeVisible();
    await expect(page.locator('.step-list')).toContainText('Quickly rinse the calamari');
    await expect(page.locator('.step-list')).toContainText('Mix the milk, lemon, garlic, salt');
    await expect(page.locator('.step-list')).not.toContainText('Rincer rapidement les calamars');
    await expect(page.locator('.step-list')).not.toContainText('Mélanger lait');
    await expect(page.locator('.practical-block')).toContainText('Good to know');
    await expect(page.locator('.practical-block')).not.toContainText('Practical info');
    await expect(page.locator('.practical-block')).not.toContainText('Infos pratiques');
    await expect(page.locator('.recipe-command-dock')).toHaveCount(0);
    await expect(page.locator('.detail-actions')).toBeVisible();
    await expectNoMojibake(page);
    await expectNoHorizontalOverflow(page);
  });

  test('merged recipe keeps each curry variant complete and isolated', async ({ page }) => {
    await forceTheme(page, 'dark');
    await page.goto('/recette/currys_carnivores_variantes?lang=fr');
    await waitForCookNote(page);

    await expect(page.getByRole('heading', { level: 1, name: /Currys carnivores/i })).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: /Choisis une variante/i })).toBeVisible();
    await expect(page.locator('.variant-choice-description')).toContainText('Chaque choix ouvre une recette');
    await expect(page.locator('.detail-meta')).toContainText('3 variantes');
    await expect(page.locator('.detail-meta')).not.toContainText('48 ingr');
    await expect(page.locator('.variant-choice-status')).toContainText('Choisis une carte ci-dessus');
    await expect(page.locator('.recipe-summary-panel')).toHaveCount(0);
    await expect(page.locator('.recipe-command-dock')).toHaveCount(0);
    await expect(page.locator('.recipe-detail-grid')).toHaveCount(0);
    await expect(page.locator('.variant-choice-button')).toHaveCount(3);
    const selectedVariant = page.locator('.variant-choice-button').filter({ hasText: /Poulet et crevettes/i });
    await expect(selectedVariant).toHaveAttribute('aria-pressed', 'false');
    await selectedVariant.click();
    await expect(selectedVariant).toHaveAttribute('aria-pressed', 'true');
    await expect(selectedVariant).toContainText('lectionn');
    await expect(page.locator('.variant-choice-status')).toHaveCount(0);
    await expect(page.locator('.variant-choice-continue')).toHaveCount(0);
    await expect(page.locator('.recipe-summary-panel')).toBeVisible();
    await expect(page.locator('.recipe-command-dock')).toHaveCount(0);
    await expect(page.locator('.recipe-detail-grid')).toBeVisible();
    await expect.poll(() => page.locator('#recipe-detail-content').evaluate(element => Math.round(element.getBoundingClientRect().top))).toBeLessThanOrEqual(180);
    await expect(page.locator('.ingredients-panel')).toContainText('220g crevettes');
    await expect(page.locator('.ingredients-panel')).not.toContainText('120g yaourt nature');
    await expect(page.locator('.step-list')).toContainText("Saisir le poulet dans l'huile");
    await expect(page.locator('.recipe-view')).toContainText('prévoir riz nature');
    await expect(page.getByRole('button', { name: /Ajouter aux courses/i }).first()).toBeEnabled();
    const tikkaVariant = page.locator('.variant-choice-button').filter({ hasText: /Poulet tikka masala/i });
    await tikkaVariant.click();
    await expect(selectedVariant).toHaveAttribute('aria-pressed', 'false');
    await expect(tikkaVariant).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('.ingredients-panel')).toContainText('120g yaourt nature');
    await expect(page.locator('.ingredients-panel')).not.toContainText('220g crevettes');
    await expectNoMojibake(page);
    await expectNoHorizontalOverflow(page);
  });

  test('long ingredient panel stays fully open inside the fiche', async ({ page }) => {
    await forceTheme(page, 'dark');
    await page.goto('/recette/poulet_basquaise_variantes?lang=fr');
    await waitForCookNote(page);

    const ovenVariant = page.locator('.variant-choice-button').filter({ hasText: /Au four/i });
    await expect(ovenVariant).toHaveCount(1);
    await ovenVariant.click();

    const panel = page.locator('.ingredients-panel');
    await expect(panel).toContainText('1 bouquet garni');
    const layout = await panel.evaluate(element => {
      const lastItem = element.querySelector('.ingredient-group li:last-child');
      const panelRect = element.getBoundingClientRect();
      const lastItemRect = lastItem.getBoundingClientRect();
      return {
        overflowY: getComputedStyle(element).overflowY,
        scrollDelta: element.scrollHeight - element.clientHeight,
        bottomSpace: panelRect.bottom - lastItemRect.bottom,
        ingredientPosition: getComputedStyle(element).position,
        stepsPosition: getComputedStyle(document.querySelector('.steps-panel')).position,
        notesPosition: getComputedStyle(document.querySelector('.notes-panel')).position,
        stepsOverflowY: getComputedStyle(document.querySelector('.steps-panel')).overflowY,
        notesOverflowY: getComputedStyle(document.querySelector('.notes-panel')).overflowY
      };
    });

    expect(layout.overflowY).toBe('visible');
    expect(layout.scrollDelta).toBe(0);
    expect(layout.bottomSpace).toBeGreaterThanOrEqual(12);
    expect(layout.ingredientPosition).toBe('static');
    expect(layout.stepsPosition).toBe('static');
    expect(layout.notesPosition).toBe('static');
    expect(layout.stepsOverflowY).toBe('visible');
    expect(layout.notesOverflowY).toBe('visible');
    await expectNoHorizontalOverflow(page);
  });

  test('secondary recipe notes stay in accessible expandable boxes', async ({ page }) => {
    await forceTheme(page, 'dark');
    await page.goto('/recette/acras_epinards?lang=fr');
    await waitForCookNote(page);

    const mobileTabs = page.locator('.recipe-tabs');
    if (await mobileTabs.isVisible()) {
      await mobileTabs.getByRole('tab', { name: /Avant/i }).click();
    }
    const notes = page.locator('.notes-panel');
    await expect(page.locator('.recipe-anatomy')).toBeVisible();
    await expect(page.locator('.recipe-section-jump')).toHaveCount(0);
    await expect(notes.getByRole('heading', { level: 2, name: 'Avant de commencer' })).toBeVisible();
    await expect(notes.locator('.notes-panel-head .eyebrow')).toHaveCount(0);
    await expect(notes.locator('.notes-reference-heading')).toHaveCount(0);
    await expect(notes).not.toContainText('Infos pratiques');
    await expect(notes).not.toContainText('Carte des accords');
    await expect(notes).not.toContainText('Fiches ingrédients');
    expect(await notes.locator('details.notes-disclosure').count()).toBeGreaterThan(0);

    const storage = notes.locator('details.notes-disclosure').filter({ hasText: 'Conservation' }).first();
    if (await storage.count()) {
      await expect(storage).not.toHaveAttribute('open', '');
      await storage.locator('summary').click();
      await expect(storage).toHaveAttribute('open', '');
      const openFill = await storage.evaluate(node => ({
        detail: getComputedStyle(node).backgroundColor,
        summary: getComputedStyle(node.querySelector('summary')).backgroundColor,
        body: getComputedStyle(node.querySelector('.notes-disclosure-body')).backgroundColor
      }));
      expect(openFill.detail).not.toBe('rgba(0, 0, 0, 0)');
      expect(openFill.summary).toBe('rgba(0, 0, 0, 0)');
      expect(openFill.body).toBe('rgba(0, 0, 0, 0)');
    }

    const ingredientCard = notes.locator('.ingredient-knowledge-card').first();
    if (await ingredientCard.count()) {
      await expect(ingredientCard.locator('small')).toHaveCount(0);
      await expect(ingredientCard).not.toContainText('Toute saison');
      await expect(ingredientCard).not.toContainText('Accords');
    }
    await expectNoMojibake(page);
    await expectNoHorizontalOverflow(page);
  });

  test('personal kitchen tools save a profile and enrich a recipe', async ({ page }) => {
    await forceTheme(page, 'dark');
    await page.goto('/recette/opera?lang=fr');
    await waitForCookNote(page);

    await page.locator('.top-settings-btn').click();
    await page.getByRole('button', { name: 'Ouvrir mes outils' }).click();
    await expect(page.getByRole('heading', { name: 'Mes outils de cuisine' })).toBeVisible();
    await page.getByLabel('Matériel disponible').fill('Batteur électrique, Thermomètre, Cadre carré de 20cm');
    await page.getByLabel('Moule rond habituel (cm)').fill('24');
    await page.getByRole('button', { name: 'Enregistrer mon matériel' }).click();
    await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('cook_note_equipment_profile') || '{}').roundMold)).toBe(24);
    await page.getByRole('button', { name: 'Fermer', exact: true }).click();

    const tabs = page.locator('.recipe-tabs');
    if (await tabs.isVisible()) await tabs.getByRole('tab', { name: /Avant/i }).click();
    const notes = page.locator('.notes-panel');
    await expect(notes.locator('.personal-equipment-block')).toHaveCount(1);
    await expect(notes.locator('.personal-mold-block')).toHaveCount(1);
    await expect(notes.locator('.personal-ratios-block')).toHaveCount(0);
    await expect(notes.locator('.average-weight-card.notes-static-card')).toHaveCount(1);
    await expect(notes.locator('.personal-history-block')).toHaveCount(1);
    await expect(notes.locator('.recipe-version-value')).toHaveText('v1.00');
    await expectNoHorizontalOverflow(page);
  });

  test('direct recipe route renders hero and decoded copy', async ({ page }, testInfo) => {
    await forceTheme(page, 'dark');
    await page.goto('/recette/poulet_sauce_pimentee?lang=fr');
    await waitForCookNote(page);

    await expect(page.locator('.recipe-view')).toBeVisible();
    await expect(page.getByRole('heading', { name: new RegExp('Poulet sauce piment\\u00e9e', 'i') })).toBeVisible();
    await expect(page.locator('.recipe-detail-hero.has-photo')).toBeVisible();
    const heroImage = page.locator('.recipe-detail-hero-image');
    await expect(heroImage).toHaveCount(1);
    await expectImagesReady(page, '.recipe-detail-hero-image', 1);
    const heroImageMetrics = await heroImage.evaluate(image => {
      const hero = image.closest('.recipe-detail-hero')?.getBoundingClientRect();
      const frame = image.closest('.recipe-detail-hero-media')?.getBoundingClientRect();
      const style = getComputedStyle(image);
      return {
        complete: image.complete,
        naturalWidth: image.naturalWidth,
        naturalHeight: image.naturalHeight,
        heroWidth: hero?.width || 0,
        heroHeight: hero?.height || 0,
        frameWidth: frame?.width || 0,
        frameHeight: frame?.height || 0,
        objectFit: style.objectFit,
        loading: image.getAttribute('loading'),
        fetchPriority: image.getAttribute('fetchpriority')
      };
    });
    expect(heroImageMetrics.complete).toBe(true);
    expect(heroImageMetrics.naturalWidth).toBeGreaterThanOrEqual(80);
    expect(heroImageMetrics.naturalHeight).toBeGreaterThanOrEqual(60);
    expect(Math.abs(heroImageMetrics.heroWidth - heroImageMetrics.frameWidth)).toBeLessThanOrEqual(1);
    expect(Math.abs(heroImageMetrics.heroHeight - heroImageMetrics.frameHeight)).toBeLessThanOrEqual(2);
    expect(heroImageMetrics.objectFit).toBe('cover');
    expect(heroImageMetrics.loading).toBe('eager');
    expect(heroImageMetrics.fetchPriority).toBe('high');
    await expect(page.locator('.recipe-command-dock')).toHaveCount(0);
    await expect(page.locator('.plating-guide-block')).toHaveCount(0);
    await expect(page.getByText(/Ajouter aux courses/i)).toBeVisible();
    await expectNoMojibake(page);
    await expectNoHorizontalOverflow(page);
    await settleVisualFrame(page);

    await page.screenshot({
      path: testInfo.outputPath(`recipe-${testInfo.project.name}.png`),
      fullPage: false
    });
  });

  test('recipe sheet keeps controls in the fiche without a duplicate command bar', async ({ page }) => {
    await forceTheme(page, 'dark');
    await page.goto('/recette/poulet_sauce_pimentee?lang=fr');
    await waitForCookNote(page);

    await expect(page.locator('.recipe-command-dock')).toHaveCount(0);
    await expect(page.locator('.recipe-command-dock-slot')).toHaveCount(0);
    await expect(page.locator('.detail-actions')).toBeVisible();
    await expect(page.locator('.recipe-detail-grid')).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });

  test('recipe keeps secondary utilities grouped without a cooking mode', async ({ page }) => {
    await forceTheme(page, 'dark');
    await page.goto('/recette/poulet_sauce_pimentee?lang=fr');
    await waitForCookNote(page);

    await expect(page.getByRole('button', { name: 'Mode cuisine' })).toHaveCount(0);
    await expect(page.locator('.cooking-mode-shell')).toHaveCount(0);
    const utilities = page.locator('.detail-utility-menu');
    await expect(utilities).toBeVisible();
    await utilities.locator('summary').click();
    await expect(utilities.getByRole('button', { name: 'Copier fiche' })).toBeVisible();
    await expect(utilities.getByRole('button', { name: 'Partager' })).toBeVisible();
    await expect(utilities.getByRole('button', { name: 'Imprimer' })).toBeVisible();
    const utilityLayout = await page.locator('.recipe-detail-hero').evaluate(hero => {
      const popover = hero.querySelector('.detail-utility-popover')?.getBoundingClientRect();
      const heroBox = hero.getBoundingClientRect();
      return { overflow: getComputedStyle(hero).overflow, popoverBottom: popover?.bottom || 0, heroBottom: heroBox.bottom };
    });
    expect(utilityLayout.overflow).toBe('visible');
    expect(utilityLayout.popoverBottom).toBeGreaterThan(utilityLayout.heroBottom);
    expect(await page.locator('.recipe-detail-hero').evaluate(node => getComputedStyle(node).borderBottomWidth)).toBe('2px');
    expect(await page.locator('.site-footer').evaluate(node => getComputedStyle(node, '::before').content)).not.toBe('none');
    await expect(page.locator('.recipe-detail-grid')).toBeVisible();
    await expectNoMojibake(page);
    await expectNoHorizontalOverflow(page);
  });

  test('empty favorites explains how to save a recipe', async ({ page }) => {
    await forceTheme(page, 'dark');
    await page.goto('/?lang=fr&view=__favs__');
    await waitForCookNote(page);

    const emptyState = page.locator('.season-sections .empty-state');
    await expect(emptyState).toBeVisible();
    await expect(emptyState.getByRole('heading', { level: 2 })).toHaveText('Aucune recette favorite pour le moment');
    await expect(emptyState).toContainText('Ouvre une fiche puis utilise « Favori » pour la retrouver ici.');
    await expectNoMojibake(page);
    await expectNoHorizontalOverflow(page);
  });

  test('compact visual controls remain readable at 320 px', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await forceTheme(page, 'dark');
    await page.goto('/?lang=fr');
    await waitForCookNote(page);

    const compactHome = await page.evaluate(() => {
      const card = document.querySelector('.recipe-card.master-card')?.getBoundingClientRect();
      return {
        cardTop: card?.top || 0,
        overflow: Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth)
      };
    });
    expect(compactHome.cardTop).toBeGreaterThan(0);
    await expect(page.locator('.mobile-bottom-nav')).toHaveCount(0);
    expect(compactHome.overflow).toBeLessThanOrEqual(2);

    await page.getByRole('button', { name: 'Préférences d’affichage', exact: true }).click();
    const preferenceCopy = page.locator('.preference-data-copy');
    await expect(preferenceCopy).toBeVisible();
    const preferenceLayout = await preferenceCopy.evaluate(node => {
      const title = node.querySelector('strong')?.getBoundingClientRect();
      const description = node.querySelector('small')?.getBoundingClientRect();
      return {
        display: getComputedStyle(node).display,
        titleBottom: title?.bottom || 0,
        descriptionTop: description?.top || 0,
        overflow: node.scrollWidth - node.clientWidth
      };
    });
    expect(preferenceLayout.display).toBe('grid');
    expect(preferenceLayout.descriptionTop - preferenceLayout.titleBottom).toBeGreaterThanOrEqual(3.5);
    expect(preferenceLayout.overflow).toBeLessThanOrEqual(1);
    await page.locator('.preferences-modal').getByRole('button', { name: 'Fermer', exact: true }).click();

    await page.locator('.home-search-launcher').click();
    const searchInput = page.locator('#recipe-search-input');
    await expect(searchInput).toHaveAttribute('placeholder', 'Recette, ingrédients, usage, saison...');
    await page.locator('.search-modal').getByRole('button', { name: 'Fermer', exact: true }).click();

    await page.locator('.home-quick-actions button').filter({ hasText: 'Composer un menu' }).click();
    const menuModal = page.locator('.menu-planner-modal');
    await expect(menuModal).toBeVisible();
    const closeButton = menuModal.getByRole('button', { name: 'Fermer', exact: true });
    const closeInViewport = await closeButton.evaluate(button => {
      const rect = button.getBoundingClientRect();
      return rect.left >= 0 && rect.right <= window.innerWidth && rect.top >= 0 && rect.bottom <= window.innerHeight;
    });
    expect(closeInViewport).toBe(true);
    await menuModal.evaluate(node => { node.scrollTop = node.scrollHeight; });
    await page.waitForTimeout(120);
    const stickyHeader = await menuModal.locator('.menu-planner-modal-head').evaluate(header => {
      const panel = header.closest('.menu-planner-modal')?.getBoundingClientRect();
      const close = header.querySelector('[aria-label="Fermer"]')?.getBoundingClientRect();
      return {
        panelTop: panel?.top || 0,
        panelBottom: panel?.bottom || 0,
        closeTop: close?.top || 0,
        closeBottom: close?.bottom || 0
      };
    });
    expect(stickyHeader.closeTop).toBeGreaterThanOrEqual(stickyHeader.panelTop - 1);
    expect(stickyHeader.closeBottom).toBeLessThanOrEqual(stickyHeader.panelBottom + 1);
    await menuModal.getByRole('button', { name: /Ajouter le menu aux courses pour \d+ personnes/ }).click();
    await closeButton.click();

    const shoppingModal = page.locator('.shopping-modal');
    await expect(shoppingModal).toBeVisible();
    const metricWidths = await shoppingModal.locator('.shopping-store-metrics > span').evaluateAll(metrics =>
      metrics.map(metric => metric.getBoundingClientRect().width)
    );
    expect(metricWidths).toHaveLength(3);
    metricWidths.forEach(width => expect(width).toBeGreaterThanOrEqual(88));
    await expectNoMojibake(page);
    await expectNoHorizontalOverflow(page);
  });

  test('shopping basket keeps a recipe and marks an item already at home', async ({ page }) => {
    await forceTheme(page, 'dark');
    await page.goto('/recette/poulet_sauce_pimentee?lang=fr');
    await waitForCookNote(page);

    const addToShopping = page.getByRole('button', { name: /Ajouter aux courses/i }).first();
    await addToShopping.click();
    await expect(page.getByRole('button', { name: /Dans les courses/i }).first()).toBeVisible();
    await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('cook_note_shopping_basket') || '[]')))
      .toContain('poulet_sauce_pimentee');

    await page.goto('/?lang=fr');
    await waitForCookNote(page);
    await page.locator('.mobile-bottom-nav [aria-label="Courses"]:visible, .home-quick-actions button:visible')
      .filter({ hasText: /Liste de courses|Liste/ })
      .first()
      .click();
    const shoppingModal = page.locator('.shopping-modal');
    await expect(shoppingModal).toBeVisible();
    await expect(page.locator('#shopping-modal-title')).toContainText('1 recette');
    await expect(page.locator('.shopping-line')).not.toHaveCount(0);

    await page.locator('.shopping-owned-btn').first().click();
    await expect(page.locator('.shopping-owned-list')).toBeVisible();
    await expectNoMojibake(page);
    await expectNoHorizontalOverflow(page);
  });

  test('menu planner sends its scaled menu to shopping', async ({ page }) => {
    await forceTheme(page, 'dark');
    await page.goto('/?lang=fr');
    await waitForCookNote(page);

    await page.locator('.mobile-bottom-nav [aria-label="Mode menu"]:visible, .home-quick-actions button:visible')
      .filter({ hasText: /Composer un menu|Menu/ })
      .first()
      .click();
    const menuModal = page.locator('.menu-planner-modal');
    await expect(menuModal).toBeVisible();
    await expect(menuModal.locator('.menu-planner-card')).toHaveCount(4);

    const peopleSelect = menuModal.locator('select[aria-label="Nombre de personnes du menu"]');
    await peopleSelect.selectOption('6');
    await expect(peopleSelect).toHaveValue('6');
    await expect(menuModal.locator('.menu-serving-hint')).toBeVisible();
    await menuModal.getByRole('button', { name: 'Ajouter le menu aux courses pour 6 personnes' }).click();
    await menuModal.getByRole('button', { name: 'Fermer' }).click();
    await expect(menuModal).toBeHidden();

    const shoppingModal = page.locator('.shopping-modal');
    await expect(shoppingModal).toBeVisible();
    await expect(page.locator('#shopping-modal-title')).toContainText(/recette/);
    await expect(page.locator('.shopping-line')).not.toHaveCount(0);
    await expectNoMojibake(page);
    await expectNoHorizontalOverflow(page);
  });

  test('techniques page filters and highlights a direct technique', async ({ page }) => {
    await forceTheme(page, 'dark');
    await page.goto('/techniques?lang=fr#emincer');
    await waitForCookNote(page);

    await expect(page.locator('.techniques-view')).toBeVisible();
    await expect(page.locator('.techniques-view > .hero')).toHaveCount(0);
    await expect(page.locator('.technique-card')).not.toHaveCount(0);
    await expect(page.locator('#technique-emincer')).toHaveClass(/technique-card-highlight/);
    await expect.poll(() => page.evaluate(() => {
      const target = document.querySelector('#technique-emincer');
      if (!target) return Number.POSITIVE_INFINITY;
      const viewport = window.visualViewport?.height || window.innerHeight;
      const rect = target.getBoundingClientRect();
      return Math.abs((rect.top + rect.height / 2) - viewport / 2);
    }), { timeout: 4000 }).toBeLessThan(120);

    const filterToggle = page.locator('.technique-filter-toggle');
    if (await filterToggle.isVisible()) {
      const filterToggleBox = await filterToggle.boundingBox();
      expect(filterToggleBox?.height || 0).toBeGreaterThanOrEqual(44);
      await filterToggle.click();
    }
    const knifeFilter = page.locator('.technique-filter-tabs button').filter({ hasText: 'Couteau' }).first();
    await knifeFilter.click();
    await expect(knifeFilter).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('.technique-card')).not.toHaveCount(0);
    await expect(page.locator('.technique-card-head').first()).toContainText('Couteau');
    await expectNoMojibake(page);
    await expectNoHorizontalOverflow(page);
  });

  for (const [recipeId, expectedTitle] of CATEGORY_PARENT_ROUTES) {
    test(`category parent ${recipeId} renders variants cleanly`, async ({ page }, testInfo) => {
      await forceTheme(page, 'dark');
      await page.goto(`/recette/${recipeId}?lang=fr`);
      await waitForCookNote(page);

      await expect(page.locator('.recipe-view')).toBeVisible();
      await expect(page.getByRole('heading', { level: 1, name: new RegExp(expectedTitle, 'i') })).toBeVisible();
      await expect(page.locator('.parent-hero.has-photo')).toBeVisible();
      const parentHeroHeight = await page.locator('.parent-hero').evaluate(node => node.getBoundingClientRect().height);
      const maxParentHeroHeight = (page.viewportSize()?.width || 0) <= 760 ? 280 : 320;
      expect(parentHeroHeight).toBeGreaterThan(180);
      expect(parentHeroHeight).toBeLessThanOrEqual(maxParentHeroHeight);
      const parentHeroImage = page.locator('.parent-hero .recipe-detail-hero-image');
      await expect(parentHeroImage).toHaveCount(1);
      await expectImagesReady(page, '.parent-hero .recipe-detail-hero-image', 1);
      const parentHeroImageSrc = await parentHeroImage.getAttribute('src');
      expect(parentHeroImageSrc).toContain('/assets/theme/dark/categories/');
      expect(parentHeroImageSrc).not.toContain('/assets/theme/dark/global/hero');
      await expect(page.locator('.parent-hero .detail-hero-logo')).toHaveCount(0);
      await expect(page.locator('.collection-links-panel .collection-links-heading')).toHaveCount(0);
      await expect(async () => {
        const count = await page.locator('.variant-card').count();
        expect(count).toBeGreaterThanOrEqual(4);
      }).toPass();
      await expectBackgroundImagesReady(page, '.variant-card-bg', 4);
      const variantRatios = await page.locator('.variant-card').evaluateAll(cards => cards.map(card => {
        const rect = card.getBoundingClientRect();
        return rect.width / rect.height;
      }));
      expect(variantRatios.length).toBeGreaterThanOrEqual(4);
      expect(variantRatios.every(ratio => Math.abs(ratio - (16 / 9)) < 0.08)).toBe(true);
      await expectNoMojibake(page);
      await expectNoHorizontalOverflow(page);
      await settleVisualFrame(page);

      await page.screenshot({
        path: testInfo.outputPath(`category-${recipeId}-${testInfo.project.name}.png`),
        fullPage: false
      });
    });
  }
});
