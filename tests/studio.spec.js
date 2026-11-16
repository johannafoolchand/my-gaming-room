import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  page.on('console', message => {
    if (message.type() === 'error') console.log('[browser console error]', message.text());
  });
  page.on('pageerror', error => console.log('[browser pageerror]', error.stack || error.message));
  page.on('requestfailed', request => console.log('[request failed]', request.url(), request.failure()?.errorText));
});

test('loads the real 3D room and its initial furniture', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#engineStatus')).toContainText('MOTEUR 3D ACTIF', { timeout: 30_000 });
  await expect(page.locator('#scene3d canvas')).toBeVisible();
  await expect(page.locator('#objectCount')).toHaveText('15');
});

test('adds furniture and exposes object properties', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#engineStatus')).toContainText('MOTEUR 3D ACTIF', { timeout: 30_000 });
  await page.getByRole('button', { name: /Fauteuil gaming/ }).click();
  await expect(page.locator('#objectCount')).toHaveText('16');
  await expect(page.locator('#objectProperties')).toBeVisible();
  await expect(page.locator('#selectedName')).toContainText('Fauteuil gaming');
});

test('applies room themes and saves the current configuration', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#engineStatus')).toContainText('MOTEUR 3D ACTIF', { timeout: 30_000 });
  await page.locator('[data-theme="cyber"]').click();
  await expect(page.locator('#styleName')).toContainText('Cyber Glow');
  await page.locator('#saveBtn').click();
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('gamingRoomSaved3D') || '[]').length)).toBe(1);
  await page.reload();
  await expect(page.locator('#engineStatus')).toContainText('MOTEUR 3D ACTIF', { timeout: 30_000 });
  await expect(page.locator('#objectCount')).toHaveText('6');
});

test('game selector updates the selected PS5 screen preview', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#engineStatus')).toContainText('MOTEUR 3D ACTIF', { timeout: 30_000 });
  await page.locator('#gameSelect').selectOption('ghost');
  await expect.poll(() => page.evaluate(() => localStorage.getItem('gamingRoomStudio3D'))).toContain('"game":"ghost"');
});

test('room controls remain usable on a mobile viewport', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#engineStatus')).toContainText('MOTEUR 3D ACTIF', { timeout: 30_000 });
  await expect(page.locator('#scene3d canvas')).toBeVisible();
  await page.getByRole('button', { name: 'Enregistrer' }).click();
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('gamingRoomSaved3D') || '[]').length)).toBe(1);
});


test('keeps the chosen floor finish when changing and reloading a theme', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#engineStatus')).toContainText('MOTEUR 3D ACTIF', { timeout: 30_000 });
  await page.locator('[data-finish="stone"]').click();
  await page.locator('[data-theme="cyber"]').click();
  await page.locator('#saveBtn').click();
  await page.reload();
  await expect(page.locator('#engineStatus')).toContainText('MOTEUR 3D ACTIF', { timeout: 30_000 });
  await expect(page.locator('[data-finish="stone"]')).toHaveClass(/selected/);
  await page.getByRole('button', { name: 'Sauvegardes' }).click();
  await page.getByRole('button', { name: 'Ouvrir' }).first().click();
  await expect(page.locator('[data-finish="stone"]')).toHaveClass(/selected/);
});

test('exports the current room as a JSON file', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#engineStatus')).toContainText('MOTEUR 3D ACTIF', { timeout: 30_000 });
  const downloadPromise = page.waitForEvent('download');
  await page.locator('#exportBtn').click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('my-gaming-room.json');
});


test('starts with a complete PlayStation gaming setup', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#engineStatus')).toContainText('MOTEUR 3D ACTIF', { timeout: 30_000 });
  await expect(page.locator('#objectCount')).toHaveText('15');
  const ids = await page.evaluate(() => JSON.parse(localStorage.getItem('gamingRoomStudio3D') || '{}').objects.map(item => item.catalogId));
  expect(ids).toContain('ps5');
  expect(ids).toContain('dualsense');
  expect(ids).toContain('headset');
});

test('rotates the selected object with the rotation buttons', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#engineStatus')).toContainText('MOTEUR 3D ACTIF', { timeout: 30_000 });
  await page.getByRole('button', { name: /PlayStation 5/ }).click();
  await page.locator('#rotateRightBtn').click();
  await expect(page.locator('#rotationValue')).toHaveText('15°');
  const rotation = await page.evaluate(() => JSON.parse(localStorage.getItem('gamingRoomStudio3D')).objects.filter(item => item.catalogId === 'ps5').at(-1).rotation);
  expect(rotation).toBeCloseTo(Math.PI / 12, 4);
});
