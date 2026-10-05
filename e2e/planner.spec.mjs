import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFile } from 'node:fs/promises';

async function ready(page) {
  await page.goto('/');
  const debuff = page.locator('[data-modifier-id="hemophilia"]');
  await expect.poll(async () => {
    if (await debuff.getAttribute('aria-pressed') !== 'true') await debuff.click();
    return debuff.getAttribute('aria-pressed');
  }).toBe('true');
}

test('changing the shared hash loads the new normalized build', async ({ page }) => {
  await ready(page);
  await page.evaluate(() => { window.location.hash = 'no-flea-market,safecracker'; });
  await expect(page.locator('[data-modifier-id="no-flea-market"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('[data-modifier-id="safecracker"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('[data-modifier-id="hemophilia"]')).toHaveAttribute('aria-pressed', 'false');
  await expect(page.locator('.score-block strong')).toHaveText('0');
});

test('failed clipboard fallback never reports success', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: {} });
    document.execCommand = () => false;
  });
  await ready(page);
  await page.getByRole('button', { name: 'Copy text', exact: true }).click();
  await expect(page.getByRole('status')).toHaveText('Could not copy automatically.');
});

test('points, opposite traits and funding removal stay valid after reload', async ({ page }) => {
  await ready(page);
  const opposite = page.locator('[data-modifier-id="thrombophilia"]');
  await expect(opposite).toHaveAttribute('aria-disabled', 'true');
  await opposite.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('status')).toContainText('Blocked by HEMOPHILIA');
  await page.locator('[data-modifier-id="juice-time"]').click();
  await expect(page.locator('.score-block strong')).toHaveText('0');
  await page.locator('[data-modifier-id="hemophilia"]').click();
  await expect(page.getByRole('status')).toContainText('Remove enough positive traits');
  await expect(page.locator('[data-modifier-id="hemophilia"]')).toHaveAttribute('aria-pressed', 'true');
  await page.reload();
  await expect(page.locator('[data-modifier-id="juice-time"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.score-block strong')).toHaveText('0');
  await page.locator('[data-modifier-id="juice-time"]').click();
  await page.locator('[data-modifier-id="hemophilia"]').click();
  await expect(page).toHaveURL(/\/$/);
});

test('clipboard API returns the actual link and build summary', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await ready(page);
  await page.getByRole('button', { name: 'Copy link', exact: true }).click();
  await expect(page.getByRole('status')).toHaveText('Share link copied to clipboard.');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(page.url());
  await page.getByRole('button', { name: 'Copy text', exact: true }).click();
  await expect(page.getByRole('status')).toHaveText('Build copied to clipboard.');
  const text = await page.evaluate(() => navigator.clipboard.readText());
  expect(text).toContain('Available points: 2');
  expect(text).toContain('HEMOPHILIA (+2)');
});

test('responsive accessible board exports a real full-size PNG', async ({ page }, testInfo) => {
  await ready(page);
  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    const violations = (await new AxeBuilder({ page }).analyze()).violations;
    await testInfo.attach(`axe-selected-${width}`, { body: JSON.stringify(violations), contentType: 'application/json' });
    expect(violations).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  const [download] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: 'Download PNG', exact: true }).click()]);
  expect(download.suggestedFilename()).toBe('kord-breach-build-1-selected.png');
  const bytes = await readFile(await download.path());
  expect(bytes.subarray(0, 8).toString('hex')).toBe('89504e470d0a1a0a');
  expect(bytes.readUInt32BE(16)).toBe(2397);
  expect(bytes.readUInt32BE(20)).toBe(2149);
  await page.screenshot({ path: 'test-results/planner-desktop.png', fullPage: true });
});

test('reset clears the URL and accessible empty states at each width', async ({ page }, testInfo) => {
  await ready(page);
  await page.getByRole('button', { name: 'Reset', exact: true }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator('.score-block strong')).toHaveText('0');
  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    const violations = (await new AxeBuilder({ page }).analyze()).violations;
    await testInfo.attach(`axe-empty-${width}`, { body: JSON.stringify(violations), contentType: 'application/json' });
    expect(violations).toEqual([]);
  }
});
