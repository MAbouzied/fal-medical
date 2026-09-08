import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Phase 4 a11y gates.
 * When PLAYWRIGHT_BASE_URL points at a built preview, run axe + interaction checks.
 * Otherwise keep the dependency contract green for CI without a live server.
 */
const hasPreview = Boolean(process.env.PLAYWRIGHT_BASE_URL);

test.describe('A11y @a11y', () => {
  test('axe-core dependency is available', async () => {
    expect(typeof AxeBuilder).toBe('function');
  });

  test('homepage has no serious axe violations and no Google Fonts', async ({ page }) => {
    test.skip(!hasPreview, 'Set PLAYWRIGHT_BASE_URL to a built preview to run live a11y checks');

    const fontRequests: string[] = [];
    page.on('request', (request) => {
      const url = request.url();
      if (url.includes('fonts.googleapis.com') || url.includes('fonts.gstatic.com')) {
        fontRequests.push(url);
      }
    });

    await page.goto('/');
    await expect(page.locator('#main-content')).toBeVisible();

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    const serious = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
    expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
    expect(fontRequests).toEqual([]);
  });

  test('skip link focuses main content', async ({ page }) => {
    test.skip(!hasPreview, 'Set PLAYWRIGHT_BASE_URL to a built preview to run live a11y checks');
    await page.goto('/');
    await page.keyboard.press('Tab');
    const skip = page.locator('a[href="#main-content"]');
    await expect(skip).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('#main-content')).toBeFocused();
  });

  test('FAQ details toggle with keyboard', async ({ page }) => {
    test.skip(!hasPreview, 'Set PLAYWRIGHT_BASE_URL to a built preview to run live a11y checks');
    await page.goto('/');
    const faq = page.locator('#faq-heading').locator('xpath=ancestor::section');
    const details = faq.locator('details').first();
    const summary = details.locator('summary');
    await summary.focus();
    await page.keyboard.press('Enter');
    await expect(details).toHaveJSProperty('open', true);
  });
});
