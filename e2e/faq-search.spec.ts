import { expect, test } from '@playwright/test';

test('FAQ search returns a best match and related questions', async ({ page }) => {
  await page.goto('/');

  await page.fill('#query', 'Can I change my subscription plan?');
  await page.click('button[type="submit"]');

  await expect(page.locator('text=Best match')).toBeVisible();
  await expect(page.locator('h2')).toHaveText(/Can I change my subscription plan\?/i);
  await expect(page.locator('role=heading[name="Related questions"]').first()).toBeVisible();
  await expect(page.locator('text=confidence is low')).toHaveCount(0);
});
