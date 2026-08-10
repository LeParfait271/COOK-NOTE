const { test, expect } = require('@playwright/test');

test.use({ serviceWorkers: 'allow' });

async function waitForCookNote(page) {
  await expect(page.locator('#root > *').first()).toBeVisible({ timeout: 14000 });
  await expect(page.locator('#loading-screen')).toBeHidden({ timeout: 14000 });
}

test.describe('Cook Note offline PWA smoke', () => {
  test('le shell et la recherche restent accessibles après perte réseau', async ({ page }) => {
    await page.goto('/?lang=fr');
    await waitForCookNote(page);
    await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker?.controller)), { timeout: 15000 }).toBe(true);
    await expect.poll(() => page.evaluate(async () => {
      const keys = await caches.keys();
      return keys.some(key => key.startsWith('cook-note-v'));
    }), { timeout: 15000 }).toBe(true);

    await page.context().setOffline(true);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await waitForCookNote(page);
    await expect(page.locator('.offline-status-bar')).toBeVisible();
    await expect(page.locator('.offline-status-bar')).toContainText('Mode hors-ligne');
    await expect(page.locator('.home-view')).toBeVisible();

    await page.locator('.home-search-launcher').click();
    await expect(page.locator('.search-modal')).toBeVisible();
    await expect(page.locator('#recipe-search-input')).toBeFocused();
  });
});
