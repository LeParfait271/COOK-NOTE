const { test, expect } = require('@playwright/test');

async function waitForCookNote(page) {
  await expect(page.locator('#root > *').first()).toBeVisible({ timeout: 14000 });
  await expect(page.locator('#loading-screen')).toBeHidden({ timeout: 14000 });
}

async function expectDialogWithFocus(page) {
  const dialog = page.locator('[role="dialog"]:visible').last();
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAttribute('aria-modal', 'true');
  await expect.poll(() => page.evaluate(() => Boolean(document.activeElement?.closest('[role="dialog"]')))).toBe(true);
  return dialog;
}

test.describe('Cook Note accessibility keyboard smoke', () => {
  test('les panneaux modaux restent utilisables au clavier', async ({ page }) => {
    await page.goto('/?lang=fr');
    await waitForCookNote(page);

    const searchTrigger = page.locator('.home-search-launcher');
    await searchTrigger.focus();
    await page.keyboard.press('Enter');
    await expectDialogWithFocus(page);
    await expect(page.locator('#recipe-search-input')).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(page.locator('.search-modal')).toBeHidden();
    await expect(searchTrigger).toBeFocused();

    const menuTrigger = page.getByRole('button', { name: 'Composer un menu' }).first();
    await menuTrigger.focus();
    await page.keyboard.press('Enter');
    const menuDialog = await expectDialogWithFocus(page);
    await expect(menuDialog).toHaveAttribute('aria-labelledby', 'menu-planner-title');
    await expect(page.locator('#menu-planner-title')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('.menu-planner-modal')).toBeHidden();
    await expect(menuTrigger).toBeFocused();

    const shoppingTrigger = page.getByRole('button', { name: 'Liste de courses' }).first();
    await shoppingTrigger.focus();
    await page.keyboard.press('Enter');
    const shoppingDialog = await expectDialogWithFocus(page);
    await expect(shoppingDialog).toHaveAttribute('aria-labelledby', 'shopping-modal-title');
    await page.keyboard.press('Escape');
    await expect(page.locator('.shopping-modal')).toBeHidden();
    await expect(shoppingTrigger).toBeFocused();

    const preferencesTrigger = page.getByRole('button', { name: 'Préférences d’affichage' }).first();
    if (await preferencesTrigger.isVisible()) {
      await preferencesTrigger.focus();
      await page.keyboard.press('Enter');
      const preferencesDialog = await expectDialogWithFocus(page);
      await expect(preferencesDialog).toHaveAttribute('aria-labelledby', 'preferences-title');
      await expect(page.locator('#preferences-title')).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(page.locator('.preferences-modal')).toBeHidden();
      await expect(preferencesTrigger).toBeFocused();
    }
  });

  test('les boutons visibles ont un nom accessible', async ({ page }) => {
    await page.goto('/?lang=fr');
    await waitForCookNote(page);
    const unnamed = await page.locator('button:visible').evaluateAll(buttons => buttons
      .filter(button => !String(button.getAttribute('aria-label') || button.getAttribute('title') || button.innerText || '').trim())
      .map(button => button.outerHTML.slice(0, 180)));
    expect(unnamed, unnamed.join('\n')).toEqual([]);
  });
});
