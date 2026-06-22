const { test, expect } = require('@playwright/test');

const MOJIBAKE_PATTERN = /(?:Ã.|Â.|â€|â€™|Å“|�)/;

async function waitForCookNote(page) {
  await page.waitForSelector('#loading-screen', { state: 'detached', timeout: 14000 }).catch(async () => {
    await expect(page.locator('#loading-screen')).toBeHidden();
  });
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
    await page.locator('.recipe-card').nth(7).scrollIntoViewIfNeeded();
    await page.waitForTimeout(250);
    await page.locator('.recipe-card').first().scrollIntoViewIfNeeded();
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
    await expect(page.getByRole('heading', { name: /Poulet sauce pimentée/i })).toBeVisible();
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
