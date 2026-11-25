import { test, expect } from '@playwright/test';
import { chapters as chapterInventory } from '../scripts/chapters.mjs';

const base = 'http://127.0.0.1:4175';
const chapters = chapterInventory.map(chapter => chapter.file);
const pages = ['index.html', 'foundations.html', ...chapters, 'authoring.html'];

test('chapter PDF companions are downloadable locally and served as PDFs', async ({ page, request }) => {
  for (const chapter of chapters) {
    await page.goto(new URL(`../dist/${chapter}`, import.meta.url).href);
    const link = page.getByRole('link', { name: 'Chapter PDF' });
    await expect(link).toBeVisible();
    const href = await link.getAttribute('href');
    expect(href).toMatch(/^pdfs\/0[1-5]-.+\.pdf$/);
    const [download] = await Promise.all([page.waitForEvent('download'), link.click()]);
    expect(await download.failure()).toBeNull();
    const response = await request.get(`${base}/${href}`);
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toBe('application/pdf');
    expect((await response.body()).subarray(0, 5).toString()).toBe('%PDF-');
  }
});

test('printing expands all answers and restores the reading disclosure state', async ({ page }) => {
  await page.goto(`${base}/embeddings.html`);
  const answers = page.locator('main details');
  await answers.first().locator('summary').click();
  await page.evaluate(() => dispatchEvent(new Event('beforeprint')));
  await expect(page.locator('main details:not([open])')).toHaveCount(0);
  await page.emulateMedia({ media: 'print' });
  await expect(page.locator('.pdf-download')).toBeHidden();
  await expect(page.locator('[data-source-questions]').last().locator('details p').first()).toBeVisible();
  await page.evaluate(() => dispatchEvent(new Event('afterprint')));
  await expect(page.locator('main details[open]')).toHaveCount(1);
  await expect(answers.first()).toHaveAttribute('open', '');
});

for (const width of [375, 1440]) {
  test(`built file entry preserves theme, math, and navigation at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(new URL('../dist/index.html', import.meta.url).href);
    await expect(page.locator('html')).toHaveClass('no-js');
    await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(248, 246, 240)');
    await expect(page.locator('.book-cover')).toHaveCSS('background-color', 'rgb(24, 60, 53)');
    await expect(page.locator('.print-button')).toBeHidden();

    for (const file of chapters) {
      await page.locator(`.chapter-link[href="${file}"]`).click();
      await expect(page).toHaveURL(new URL(`../dist/${file}`, import.meta.url).href);
      await expect(page.locator('.chapter-link[aria-current=page]')).toBeVisible();
      expect(await page.locator('math').count()).toBeGreaterThan(30);
      await expect(page.locator('.katex-error')).toHaveCount(0);
      await expect(page.locator('.equation').first()).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      expect(await page.evaluate(() => document.fonts.check('16px KaTeX_Main'))).toBe(true);
      const brokenImages = await page.locator('img').evaluateAll(imgs =>
        imgs.filter(img => !img.complete || !img.naturalWidth).map(img => img.src));
      expect(brokenImages).toEqual([]);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
      await page.locator('.exercise summary').first().click();
      await expect(page.locator('.exercise details').first()).toHaveAttribute('open', '');
    }
    await page.locator('.site-footer a').click();
    await expect(page).toHaveURL(new URL('../dist/authoring.html#source-material-and-provenance', import.meta.url).href);
  });
}

for (const file of pages) {
  test(`${file}: formulas, assets, local links, and anchors`, async ({ page, request }) => {
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`${base}/${file}`);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('.katex-error')).toHaveCount(0);
    if (chapters.includes(file)) {
      expect(await page.locator('math').count()).toBeGreaterThan(30);
      await expect(page.locator('a[aria-current=page]')).toHaveCount(1);
      expect(await page.locator('.exercise details').count()).toBeGreaterThanOrEqual(5);
    }
    const brokenImages = await page.locator('img').evaluateAll(imgs => imgs.filter(img => !img.complete || !img.naturalWidth).map(img => img.src));
    expect(brokenImages).toEqual([]);
    const links = await page.locator('a[href]').evaluateAll(nodes => nodes.map(node => node.href));
    for (const link of new Set(links)) {
      const url = new URL(link);
      if (url.origin !== base) continue;
      const response = await request.get(`${url.origin}${url.pathname}`);
      expect(response.status(), link).toBe(200);
      if (url.hash) {
        const html = await response.text();
        expect(html, link).toContain(`id="${decodeURIComponent(url.hash.slice(1))}"`);
      }
    }
    const ids = await page.locator('[id]').evaluateAll(nodes => nodes.map(node => node.id));
    expect(new Set(ids).size).toBe(ids.length);
    expect(errors).toEqual([]);
  });
}

for (const width of [320, 375, 768, 1440]) {
  test(`reading layout at ${width}px does not overflow`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const file of pages) {
      await page.goto(`${base}/${file}`);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), file).toBe(true);
      for (const heading of await page.locator('h1,h2,h3').all()) {
        const box = await heading.boundingBox();
        expect(box.x + box.width, `${file} heading width`).toBeLessThanOrEqual(width + 1);
      }
    }
  });
}

test('meaningful chapter titles are consistent across entry points', async ({ page }) => {
  const titles = chapterInventory.map(chapter => chapter.title);
  await page.goto(`${base}/foundations.html`);
  for (let i = 0; i < titles.length; i++) {
    await expect(page.locator('.chapter-card h3').nth(i)).toHaveText(titles[i]);
    await page.goto(`${base}/${chapters[i]}`);
    await expect(page.locator('h1')).toHaveText(titles[i]);
    await expect(page).toHaveTitle(`${titles[i]} | Becoming an AI Engineer`);
    await expect(page.locator('.chapter-link[aria-current=page]')).toContainText(titles[i]);
    await page.goto(`${base}/foundations.html`);
  }
});

test('chapter 3 follows calculus in both directions and exposes all source-map anchors', async ({ page, request }) => {
  await page.goto(`${base}/calculus.html`);
  await page.locator('.chapter-pagination a[href="tokenization.html"]').click();
  await expect(page.locator('h1')).toHaveText('From Text to Tokens: How LLMs Read Language');
  await expect(page.locator('h2')).toHaveCount(13);
  await expect(page.locator('.on-this-page nav a')).toHaveCount(13);
  await expect(page.locator('.chapter-meta')).toContainText('13 sections');
  await expect(page.locator('main figure')).toHaveCount(5);
  await page.locator('.chapter-pagination a[href="calculus.html"]').click();
  await expect(page.locator('h1')).toContainText('How LLMs Learn');
  const guide = await (await request.get(`${base}/authoring.html`)).text();
  const html = await (await request.get(`${base}/tokenization.html`)).text();
  const coverage = guide.split('id="tokenization-source-coverage"')[1].split('<h2')[0];
  const anchors = [...coverage.matchAll(/<code>#([a-z0-9-]+)<\/code>/g)].map(match => match[1]);
  expect(anchors.length).toBeGreaterThan(20);
  for (const anchor of new Set(anchors)) expect(html, anchor).toContain(`id="${anchor}"`);
});

test('chapter 3 remains readable without JavaScript and in print', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 375, height: 812 } });
  const page = await context.newPage();
  await page.goto(new URL('../dist/tokenization.html', import.meta.url).href);
  await expect(page.locator('.chapter-link[aria-current=page]')).toBeInViewport();
  await expect(page.locator('h1')).toHaveText('From Text to Tokens: How LLMs Read Language');
  await expect(page.locator('math').first()).toBeAttached();
  await page.locator('#unigram').scrollIntoViewIfNeeded();
  await page.locator('.exercise summary').first().click();
  await expect(page.locator('.exercise details').first()).toHaveAttribute('open', '');
  await page.emulateMedia({ media: 'print' });
  await expect(page.locator('.sidebar')).toBeHidden();
  await expect(page.locator('.equation').first()).toBeVisible();
  await context.close();
});

test('chapter 4 navigation and developed-source anchors are integrated', async ({ page, request }) => {
  await page.goto(`${base}/tokenization.html`);
  await page.locator('.chapter-pagination a[href="embeddings.html"]').click();
  await expect(page.locator('h1')).toHaveText('From Tokens to Meaning: How Embeddings Represent Language');
  await expect(page.locator('h2')).toHaveCount(16);
  await expect(page.locator('.on-this-page nav a')).toHaveCount(16);
  await expect(page.locator('.chapter-meta')).toContainText('16 sections');
  await expect(page.locator('main figure')).toHaveCount(6);
  const guide = await (await request.get(`${base}/authoring.html`)).text();
  const html = await (await request.get(`${base}/embeddings.html`)).text();
  const coverage = guide.split('id="embeddings-source-coverage"')[1].split('<h2')[0];
  const anchors = [...coverage.matchAll(/<code>#([a-z0-9-]+)<\/code>/g)].map(match => match[1]);
  expect(new Set(anchors).size).toBeGreaterThan(25);
  for (const anchor of new Set(anchors)) expect(html, anchor).toContain(`id="${anchor}"`);
  await page.locator('.chapter-pagination a[href="tokenization.html"]').click();
  await expect(page.locator('h1')).toContainText('From Text to Tokens');
});

test('chapter 4 diagrams, equations, and solutions survive file opening without scripts', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 320, height: 812 } });
  const page = await context.newPage();
  await page.goto(new URL('../dist/embeddings.html', import.meta.url).href);
  await expect(page.locator('.chapter-link[aria-current=page]')).toBeInViewport();
  for (const anchor of ['sinusoidal', 'rotary', 'causal-mask']) {
    await page.locator(`#${anchor}`).scrollIntoViewIfNeeded();
    await expect(page.locator(`#${anchor}`)).toBeInViewport();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  }
  await page.locator('.exercise summary').last().click();
  await expect(page.locator('.exercise details').last()).toHaveAttribute('open', '');
  for (const details of await page.locator('.exercise details').all()) {
    if (await details.getAttribute('open') === null) await details.locator('summary').click();
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  for (const image of await page.locator('main figure img').all()) {
    expect(await image.evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true);
    const wrapper = image.locator('..');
    await expect(wrapper).toHaveAttribute('tabindex', '0');
  }
  await page.emulateMedia({ media: 'print' });
  await expect(page.locator('.sidebar')).toBeHidden();
  await expect(page.locator('.equation').first()).toBeVisible();
  await context.close();
});

test('chapter 4 interviews retain every source question and file-opened explained answers', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 320, height: 812 } });
  const page = await context.newPage();
  await page.goto(new URL('../dist/embeddings.html', import.meta.url).href);
  await page.locator('main a[href="#interview-questions"]').click();
  await expect(page).toHaveURL(/#interview-questions$/);
  await expect(page.locator('#interview-questions')).toBeInViewport();
  await expect(page.locator('.on-this-page a[href="#interview-questions"]')).toContainText('Interview questions');
  const questions = page.locator('[data-source-questions]');
  await expect(questions).toHaveCount(21);
  const correspondences = await questions.evaluateAll(nodes =>
    nodes.flatMap(node => node.dataset.sourceQuestions.split(' ')));
  const expected = [
    ...Array.from({ length: 10 }, (_, i) => `embedding-Q${i + 1}`),
    ...Array.from({ length: 12 }, (_, i) => `position-Q${i + 1}`)
  ];
  expect(correspondences.sort()).toEqual(expected.sort());
  await expect(page.locator('[data-source-questions="position-Q1 position-Q12"]')).toContainText('combines source position Q1 and Q12');
  for (const question of await questions.all()) {
    await expect(question.locator('h3[id]')).toHaveCount(1);
    await question.locator('summary').click();
    await expect(question.locator('details')).toHaveAttribute('open', '');
    await expect(question.locator('details p').first()).toBeVisible();
    expect(await question.locator('details a[href^="#"]').count()).toBeGreaterThan(0);
  }
  await expect(page.locator('.katex-error')).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  await context.close();
});

test('chapter 5 integrates its complete coverage map and bidirectional navigation', async ({ page, request }) => {
  await page.goto(`${base}/embeddings.html`);
  await page.locator('.chapter-pagination a[href="neural-networks.html"]').click();
  await expect(page.locator('h1')).toHaveText('From Inputs to Predictions: How Neural Networks Learn');
  await expect(page.locator('h2')).toHaveCount(15);
  await expect(page.locator('.chapter-meta')).toContainText('15 sections');
  await expect(page.locator('.on-this-page nav a')).toHaveCount(15);
  await expect(page.locator('main figure')).toHaveCount(6);
  const guide = await (await request.get(`${base}/authoring.html`)).text();
  const html = await (await request.get(`${base}/neural-networks.html`)).text();
  const coverage = guide.split('id="neural-networks-source-coverage"')[1].split('<h2')[0];
  const anchors = [...coverage.matchAll(/<code>#([a-z0-9-]+)<\/code>/g)].map(match => match[1]);
  expect(new Set(anchors).size).toBeGreaterThan(30);
  for (const anchor of new Set(anchors)) expect(html, anchor).toContain(`id="${anchor}"`);
  await page.locator('.chapter-pagination a[href="embeddings.html"]').click();
  await expect(page.locator('h1')).toContainText('From Tokens to Meaning');
});

for (const width of [320, 1440]) {
  test(`chapter 5 file-opened answers, figures, and calculations at ${width}px`, async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width, height: 900 } });
    const page = await context.newPage();
    await page.goto(new URL('../dist/neural-networks.html', import.meta.url).href);
    await page.locator('main a[href="#interview-questions"]').click();
    await expect(page.locator('#interview-questions')).toBeInViewport();
    const questions = page.locator('[data-source-questions]');
    await expect(questions).toHaveCount(14);
    expect(await questions.evaluateAll(nodes => nodes.map(node => node.dataset.sourceQuestions))).toEqual(
      Array.from({ length: 14 }, (_, i) => `neural-Q${i + 1}`));
    for (const details of await page.locator('main details').all()) {
      await details.locator('summary').click();
      await expect(details).toHaveAttribute('open', '');
      await expect(details.locator('p').first()).toBeVisible();
    }
    for (const question of await questions.all()) {
      expect(await question.locator('details a[href^="#"]').count()).toBeGreaterThan(0);
    }
    for (const anchor of ['forward-pass', 'backpropagation', 'parameter-update', 'layer-normalization', 'llm-pipeline']) {
      await page.locator(`#${anchor}`).scrollIntoViewIfNeeded();
      await expect(page.locator(`#${anchor}`)).toBeInViewport();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    }
    for (const image of await page.locator('main figure img').all()) {
      expect(await image.evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true);
      await expect(image.locator('..')).toHaveAttribute('tabindex', '0');
    }
    await expect(page.locator('main')).toContainText('0.354025');
    await expect(page.locator('.katex-error')).toHaveCount(0);
    await page.evaluate(() => document.fonts.ready);
    expect(await page.evaluate(() => document.fonts.check('16px KaTeX_Main'))).toBe(true);
    await context.close();
  });
}

test('mobile menu, Escape, chapter navigation, and solution disclosure', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(`${base}/linear-algebra.html`);
  const menu = page.getByRole('button', { name: 'Menu', exact: true });
  await menu.click();
  await expect(menu).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Escape');
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  await expect(menu).toBeFocused();
  await expect(page.locator('.sidebar')).toHaveAttribute('inert', '');
  await page.keyboard.press('Tab');
  await expect(page.locator('.pdf-download')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.locator('.print-button')).toBeFocused();
  await menu.click();
  await expect(page.locator('.sidebar')).not.toHaveAttribute('inert', '');
  await page.locator('.chapter-link[href="calculus.html"]').click();
  await expect(page.locator('h1')).toContainText('How LLMs Learn');
  await page.locator('.exercise summary').first().click();
  await expect(page.locator('.exercise details').first()).toHaveAttribute('open', '');
});

test('alignment experiment changes dot product but not cosine', async ({ page }) => {
  await page.goto(`${base}/linear-algebra.html`);
  await page.locator('#vector-scale').fill('2');
  await expect(page.locator('[data-output=dot]')).toHaveText('8.00');
  await expect(page.locator('[data-output=cosine]')).toHaveText('0.80');
  await expect(page.locator('[data-output=vector]')).toHaveText('[4.0, 2.0]');
});

test('descent experiment updates, resets, and warns on an excessive rate', async ({ page }) => {
  await page.goto(`${base}/calculus.html`);
  const lab = page.locator('#descent-lab');
  await lab.getByRole('button', { name: /Take one step/ }).click();
  await expect(lab.locator('[data-output=weight]')).toHaveText('0.800');
  await expect(lab.locator('[data-output=loss]')).toHaveText('10.240');
  await lab.getByRole('button', { name: 'Reset', exact: true }).click();
  await expect(lab.locator('[data-output=steps]')).toHaveText('0');
  await lab.locator('input').fill('1.1');
  await lab.getByRole('button', { name: /Take one step/ }).click();
  await expect(lab.locator('.lab-note')).toContainText('Loss increased');
});

test('softmax controls reveal competition and reset deterministically', async ({ page }) => {
  await page.goto(`${base}/calculus.html`);
  const lab = page.locator('#softmax-lab');
  await expect(lab.locator('[data-output=ce]')).toHaveText('0.408');
  await lab.locator('#cold-logit').fill('4');
  expect(Number(await lab.locator('[data-output=ce]').textContent())).toBeGreaterThan(2);
  await lab.getByRole('button', { name: 'Reset logits' }).click();
  await expect(lab.locator('[data-output=ce]')).toHaveText('0.408');
});

test('reading remains usable with JavaScript disabled', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(`${base}/calculus.html`);
  await expect(page.locator('h1')).toContainText('How LLMs Learn');
  await expect(page.locator('math').first()).toBeAttached();
  await expect(page.locator('#descent-lab noscript p')).toContainText('0.8 and 1.44');
  await page.locator('.exercise summary').first().click();
  await expect(page.locator('.exercise details').first()).toHaveAttribute('open', '');
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(`${base}/calculus.html`);
  await expect(page.locator('.chapter-link').first()).toBeInViewport();
  await expect(page.locator('.menu-toggle')).toBeHidden();
  await context.close();
});

test('print layout removes navigation but preserves equations and solutions', async ({ page }) => {
  await page.goto(`${base}/calculus.html`);
  await page.emulateMedia({ media: 'print' });
  await expect(page.locator('.sidebar')).toBeHidden();
  await expect(page.locator('.topbar')).toBeHidden();
  await expect(page.locator('.equation').first()).toBeVisible();
  const solutionVisibility = await page.locator('.exercise details').first().evaluate(details =>
    getComputedStyle(details, '::details-content').contentVisibility);
  expect(solutionVisibility).toBe('visible');
});
