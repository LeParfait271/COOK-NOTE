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

async function expectLightDockActiveStateReadable(page) {
  const activeTab = page.locator('.recipe-dock-tabs button.active:visible').first();
  await expect(activeTab).toBeVisible();
  const colors = await activeTab.evaluate(node => {
    const styles = getComputedStyle(node);
    const marker = getComputedStyle(node, '::after');
    return {
      text: styles.color,
      marker: marker.backgroundColor
    };
  });
  expect(colors.text).not.toBe('rgb(255, 255, 255)');
  expect(colors.marker).not.toBe('rgb(255, 255, 255)');
}

test.describe('Cook Note visual smoke', () => {
  test('home renders cards, images and clean text', async ({ page }, testInfo) => {
    await forceTheme(page, 'dark');
    await page.goto('/?lang=fr');
    await waitForCookNote(page);

    await expect(page.locator('.home-view')).toBeVisible();
    await expect(async () => {
      const count = await page.locator('.recipe-card').count();
      expect(count).toBeGreaterThanOrEqual(8);
    }).toPass();
    await page.keyboard.press('Control+K');
    await expect(page.locator('.command-palette')).toBeVisible();
    await expectNoMojibake(page);
    await page.keyboard.press('Escape');
    await expect(page.locator('.command-palette')).toBeHidden();
    await page.evaluate(() => document.querySelectorAll('.recipe-card')[7]?.scrollIntoView({ block: 'center' }));
    await page.waitForTimeout(250);
    await page.evaluate(() => document.querySelector('.recipe-card')?.scrollIntoView({ block: 'center' }));
    await expectImagesReady(page, '.hero-logo', 1);
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
    await expect(page.locator('.hero-logo')).toBeVisible();
    await expect(page.locator('.hero-logo')).toHaveAttribute('src', /\/assets\/theme\/day\/global\/logo\.png/);
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
    const firstDayCardSource = await page.locator('.recipe-card.master-card .card-image').first().getAttribute('src');
    expect(firstDayCardSource).toContain('/assets/theme/day/categories/');
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
    await expect(page.locator('.recipe-command-dock')).toBeVisible();
    await expectLightDockActiveStateReadable(page);
  });

  test('english recipe controls stay translated', async ({ page }) => {
    await forceTheme(page, 'dark');
    await page.goto('/recette/poulet_sauce_pimentee?lang=en');
    await waitForCookNote(page);

    await expectSelectedLanguage(page, 'en', 'EN');
    const dock = page.locator('.recipe-command-dock');
    await expect(dock).toBeVisible();
    await expect(dock).toContainText('Active sheet');
    await expect(dock.getByRole('button', { name: /Add to shopping|Remove from shopping/i })).toBeVisible();
    await expect(dock.getByRole('button', { name: /Add to favorites|Remove from favorites/i })).toBeVisible();
    await expect(dock).toContainText(/(?:\+ )?Shopping/);
    await expect(dock).toContainText('Favorite');
    await expect(dock).toContainText('0% ready');
    await expect(dock).not.toContainText('Fiche active');
    const dockText = await dock.innerText();
    expect(dockText).not.toMatch(/(^|\s)Favori($|\s)/);
    expect(dockText).not.toMatch(/(^|\s)prêt($|\s)/);
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
      await mobileTabs.getByRole('button', { name: /Steps/i }).click();
    }
    await expect(page.locator('.step-list')).toBeVisible();
    await expect(page.locator('.step-list')).toContainText('Quickly rinse the calamari');
    await expect(page.locator('.step-list')).toContainText('Mix the milk, lemon, garlic, salt');
    await expect(page.locator('.step-list')).not.toContainText('Rincer rapidement les calamars');
    await expect(page.locator('.step-list')).not.toContainText('Mélanger lait');
    await expect(page.locator('.practical-block')).toContainText('Practical info');
    await expect(page.locator('.practical-block')).toContainText('Good to know');
    await expect(page.locator('.practical-block')).not.toContainText('Infos pratiques');
    await expect(page.locator('.recipe-command-dock')).toContainText('Active sheet');
    await expectNoMojibake(page);
    await expectNoHorizontalOverflow(page);
  });

  test('direct recipe route renders hero and decoded copy', async ({ page }, testInfo) => {
    await forceTheme(page, 'dark');
    await page.goto('/recette/poulet_sauce_pimentee?lang=fr');
    await waitForCookNote(page);

    await expect(page.locator('.recipe-view')).toBeVisible();
    await expect(page.getByRole('heading', { name: new RegExp('Poulet sauce piment\\u00e9e', 'i') })).toBeVisible();
    await expect(page.locator('.recipe-detail-hero.has-photo')).toBeVisible();
    await expect(page.locator('.recipe-command-dock')).toBeVisible();
    await expect(page.getByText(/Ajouter aux courses/i)).toBeVisible();
    await expectNoMojibake(page);
    await expectNoHorizontalOverflow(page);
    await settleVisualFrame(page);

    await page.screenshot({
      path: testInfo.outputPath(`recipe-${testInfo.project.name}.png`),
      fullPage: false
    });
  });

  for (const [recipeId, expectedTitle] of CATEGORY_PARENT_ROUTES) {
    test(`category parent ${recipeId} renders variants cleanly`, async ({ page }, testInfo) => {
      await forceTheme(page, 'dark');
      await page.goto(`/recette/${recipeId}?lang=fr`);
      await waitForCookNote(page);

      await expect(page.locator('.recipe-view')).toBeVisible();
      await expect(page.getByRole('heading', { level: 1, name: new RegExp(expectedTitle, 'i') })).toBeVisible();
      await expect(page.locator('.parent-hero.has-photo')).toBeVisible();
      await expect(async () => {
        const count = await page.locator('.variant-card').count();
        expect(count).toBeGreaterThanOrEqual(4);
      }).toPass();
      await expectBackgroundImagesReady(page, '.variant-card-bg', 4);
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
