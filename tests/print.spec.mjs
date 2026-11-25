import { test, expect } from '@playwright/test';
import { chapters } from '../scripts/chapters.mjs';

test('print content fits the actual A4 column including inline math and diagrams', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.emulateMedia({ media: 'print' });
  for (const chapter of chapters) {
    await page.goto(new URL(`../dist/${chapter.file}`, import.meta.url).href);
    await page.evaluate(() => {
      document.querySelector('main').style.width = '174mm';
      document.querySelectorAll('main details').forEach(details => { details.open = true; });
    });
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(255, 255, 255)');
    const overflow = await page.evaluate(() => {
      const main = document.querySelector('main').getBoundingClientRect();
      return [...document.querySelectorAll('main .math .katex-html, main .equation .katex-html, main figure img, main table, main pre')]
        .filter(element => {
          const box = element.getBoundingClientRect();
          return box.left < main.left - 1 || box.right > main.right + 1;
        }).map(element => element.textContent.slice(0, 80) || element.getAttribute('src'));
    });
    expect(overflow, chapter.file).toEqual([]);
    expect(await page.locator('main details:not([open])').count()).toBe(0);
  }
});
