const { test, expect } = require('@playwright/test');

const MOJIBAKE_PATTERN = /(?:\u00c3.|\u00c2.|\u00e2\u20ac|\u00e2\u20ac\u2122|\u00c5\u201c|\ufffd)/;

async function waitForCookNote(page) {
  await page.waitForFunction(() => Boolean(document.querySelector('#root')?.children.length), null, { timeout: 14000 });
  await page.waitForFunction(() => !document.querySelector('#loading-screen'), null, { timeout: 14000 });
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

test.describe('Cook Note visual smoke', () => {
  test('home renders cards, images and clean text', async ({ page }, testInfo) => {
    await page.goto('/');
    await waitForCookNote(page);

    await expect(page.locator('.home-view')).toBeVisible();
    await expect(async () => {
      const count = await page.locator('.recipe-card').count();
      expect(count).toBeGreaterThanOrEqual(8);
    }).toPass();
    await page.evaluate(() => document.querySelectorAll('.recipe-card')[7]?.scrollIntoView({ block: 'center' }));
    await page.waitForTimeout(250);
    await page.evaluate(() => document.querySelector('.recipe-card')?.scrollIntoView({ block: 'center' }));
    await expectImagesReady(page, '.recipe-card img', 6);
    await expectNoMojibake(page);
    await expectNoHorizontalOverflow(page);

    await page.screenshot({
      path: testInfo.outputPath(`home-${testInfo.project.name}.png`),
      fullPage: false
    });
  });

  test('direct recipe route renders hero and decoded copy', async ({ page }, testInfo) => {
    await page.goto('/recette/poulet_sauce_pimentee');
    await waitForCookNote(page);

    await expect(page.locator('.recipe-view')).toBeVisible();
    await expect(page.getByRole('heading', { name: new RegExp('Poulet sauce piment\\u00e9e', 'i') })).toBeVisible();
    await expect(page.locator('.recipe-detail-hero.has-photo')).toBeVisible();
    await expect(page.getByText(/Ajouter aux courses/i)).toBeVisible();
    await expectNoMojibake(page);
    await expectNoHorizontalOverflow(page);

    await page.screenshot({
      path: testInfo.outputPath(`recipe-${testInfo.project.name}.png`),
      fullPage: false
    });
  });
});
