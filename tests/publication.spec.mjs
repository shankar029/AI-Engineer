import { test, expect } from '@playwright/test';
import { cp, readFile } from 'node:fs/promises';
import { resolve, sep } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { chapters } from '../scripts/chapters.mjs';

for (const width of [320, 1440]) {
  test(`relocated committed publication reads offline at ${width}px`, async ({ page }, testInfo) => {
    const root = testInfo.outputPath('downloaded-book');
    await cp(resolve('publications'), root, { recursive: true });
    const entry = pathToFileURL(resolve(root, 'index.html')).href;
    await page.setViewportSize({ width, height: 900 });
    const remoteRequests = [];
    await page.route(/^https?:/, route => {
      remoteRequests.push(route.request().url());
      return route.abort();
    });
    await page.goto(entry);
    await expect(page).toHaveURL(pathToFileURL(resolve(root, 'html', 'index.html')).href);
    await expect(page.locator('.chapter-card')).toHaveCount(chapters.length);
    for (const chapter of chapters) {
      await page.locator(`.chapter-link[href="${chapter.file}"]`).click();
      await expect(page.locator('h1')).toHaveText(chapter.title);
      await expect(page.locator('html')).toHaveClass('no-js');
      await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(248, 246, 240)');
      await expect(page.locator('.print-button')).toBeHidden();
      expect(await page.locator('math').count()).toBeGreaterThan(30);
      await expect(page.locator('.katex-error')).toHaveCount(0);
      await page.evaluate(() => document.fonts.ready);
      expect(await page.evaluate(() => document.fonts.check('16px KaTeX_Main'))).toBe(true);
      expect(await page.locator('img').evaluateAll(images =>
        images.filter(image => !image.complete || !image.naturalWidth).map(image => image.src))).toEqual([]);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
      await page.locator('.exercise summary').first().click();
      await expect(page.locator('.exercise details').first()).toHaveAttribute('open', '');
      const pdf = page.getByRole('link', { name: 'Chapter PDF' });
      await expect(pdf).toHaveAttribute('href', `../${chapter.pdf}`);
      const [download] = await Promise.all([page.waitForEvent('download'), pdf.click()]);
      expect(await download.failure()).toBeNull();
    }
    await page.locator('.site-footer a').click();
    await expect(page.locator('h1')).toHaveText('The authoring system');
    expect(remoteRequests).toEqual([]);

    for (const file of ['index.html', ...chapters.map(chapter => chapter.file), 'authoring.html']) {
      await page.goto(pathToFileURL(resolve(root, 'html', file)).href);
      const references = await page.locator('[href], [src]').evaluateAll(nodes =>
        nodes.map(node => node.getAttribute('href') || node.getAttribute('src')));
      for (const reference of new Set(references)) {
        expect(reference).not.toMatch(/^(file:|[A-Za-z]:|\/)/);
        const url = new URL(reference, page.url());
        if (url.protocol !== 'file:') continue;
        const path = fileURLToPath(url);
        expect(path.startsWith(root + sep), reference).toBe(true);
        const content = await readFile(path);
        if (url.hash) expect(content.toString(), reference).toContain(`id="${decodeURIComponent(url.hash.slice(1))}"`);
      }
    }
  });
}
