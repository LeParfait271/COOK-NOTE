const { test, expect } = require('@playwright/test');

async function waitForCookNote(page) {
  await expect(page.locator('#root > *').first()).toBeVisible({ timeout: 14000 });
  await expect(page.locator('#loading-screen')).toBeHidden({ timeout: 14000 });
}

async function searchAndExpect(page, query, expectedTitle) {
  const input = page.locator('#recipe-search-input');
  await input.fill(query);
  await expect(page.locator('.search-result-count')).toContainText(query, { timeout: 12000 });
  await expect.poll(() => page.locator('.search-result').count(), { timeout: 12000 }).toBeGreaterThan(0);
  await expect(page.getByRole('button', { name: new RegExp(`^Ouvrir ${expectedTitle}$`, 'i') }).first()).toBeVisible();
  const labels = await page.locator('.search-result').evaluateAll(results => results.map(result => result.getAttribute('aria-label')));
  expect(new Set(labels).size, `Résultats dupliqués pour « ${query} »`).toBe(labels.length);
}

test.describe('Cook Note search quality smoke', () => {
  test('retrouve les fiches importées, les variantes et les alias sans accent', async ({ page }) => {
    await page.goto('/?lang=fr');
    await waitForCookNote(page);
    await page.locator('.home-search-launcher').click();
    await expect(page.locator('.search-modal')).toBeVisible();

    await searchAndExpect(page, 'opera', 'Opéra');
    await searchAndExpect(page, 'charlotte poire chocolat', 'Charlotte');
    await expect(page.locator('.search-result').filter({ hasText: 'Charlotte' }).first()).toContainText(/poire|chocolat/i);
    await searchAndExpect(page, 'creme brulee', 'Crème brûlée à la vanille');
    await searchAndExpect(page, 'poulet basquaise', 'Poulet basquaise');

    await page.keyboard.press('Escape');
    await expect(page.locator('.search-modal')).toBeHidden();
  });
});
