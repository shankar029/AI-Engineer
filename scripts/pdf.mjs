import { chromium } from '@playwright/test';
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile, cp, readdir } from 'node:fs/promises';
import { resolve, relative, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { chapters, repositoryUrl } from './chapters.mjs';

const hash = data => createHash('sha256').update(data).digest('hex');
async function sourceDigest() {
  const inputs = ['AUTHORING.md', 'package.json', 'package-lock.json', 'requirements-pdf.txt'];
  async function visit(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) await visit(path);
      else inputs.push(path);
    }
  }
  await visit('book');
  await visit('scripts');
  const digest = createHash('sha256');
  for (const file of inputs.sort()) {
    digest.update(relative('.', file).replaceAll('\\', '/'));
    digest.update((await readFile(file, 'utf8')).replaceAll('\r\n', '\n'));
  }
  return digest.digest('hex');
}

await mkdir('publications', { recursive: true });
const browser = await chromium.launch();
const manifest = { sourceDigest: await sourceDigest(), paper: 'A4', chapters: [] };
try {
  for (const chapter of chapters) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, javaScriptEnabled: false });
    await page.goto(pathToFileURL(resolve('dist', chapter.file)).href);
    await page.emulateMedia({ media: 'print' });
    await page.evaluate(() => {
      document.querySelectorAll('main details').forEach(node => { node.open = true; });
    });
    await page.evaluate(({ chapters, repositoryUrl }) => {
      for (const link of document.querySelectorAll('main a[href]')) {
        const url = new URL(link.href);
        if (url.protocol !== 'file:' || url.pathname === location.pathname) continue;
        const file = url.pathname.split('/').pop();
        const target = chapters.find(chapter => chapter.file === file);
        if (target) {
          link.href = `${repositoryUrl}/raw/refs/heads/main/publications/${target.pdf}${url.hash ? `#nameddest=${url.hash.slice(1)}` : ''}`;
        } else if (file === 'authoring.html') {
          link.href = `${repositoryUrl}/blob/main/AUTHORING.md${url.hash}`;
        } else if (file === 'index.html' || file === 'foundations.html') {
          link.href = repositoryUrl;
        } else {
          throw new Error(`Unmapped local PDF link: ${link.getAttribute('href')}`);
        }
      }
    }, { chapters, repositoryUrl });
    await page.evaluate(() => document.fonts.ready);
    const audit = await page.evaluate(() => {
      const main = document.querySelector('main');
      const badImages = [...main.querySelectorAll('img')].filter(img => !img.complete || !img.naturalWidth);
      if (badImages.length) throw new Error('Unloaded PDF diagram');
      if (document.querySelector('.katex-error')) throw new Error('Unrendered PDF formula');
      const fitWidth = 174 * 96 / 25.4;
      main.style.width = `${fitWidth}px`;
      const bounds = main.getBoundingClientRect();
      for (const block of main.querySelectorAll('.equation, .table-wrap, pre, .figure-viewport')) {
        if (block.scrollWidth > block.clientWidth + 1) {
          throw new Error(`Print block needs manual reflow: ${block.textContent.slice(0, 100)}`);
        }
      }
      for (const element of main.querySelectorAll('.math .katex-html, .equation .katex-html, figure img, table, pre')) {
        const box = element.getBoundingClientRect();
        if (box.left < bounds.left - 1 || box.right > bounds.right + 1) {
          throw new Error(`Print content crosses side margins: ${element.textContent.slice(0, 100) || element.getAttribute('src')}`);
        }
      }
      const text = [];
      const walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) {
        const node = walker.currentNode;
        if (node.parentElement.closest('.math,.equation,.diagram-hint,noscript,summary,.chapter-pagination')) continue;
        const value = node.textContent.replace(/\s+/g, ' ').trim();
        if (value.replace(/[^a-zA-Z0-9]/g, '').length >= 24) text.push(value);
      }
      return {
        text: [...new Set(text)],
        answers: main.querySelectorAll('details').length,
        interviews: main.querySelectorAll('[data-source-questions]').length,
        figures: main.querySelectorAll('figure').length,
        formulas: main.querySelectorAll('.math,.equation').length
      };
    });
    const path = join('publications', chapter.pdf);
    await page.pdf({
      path, format: 'A4', preferCSSPageSize: true, printBackground: true,
      displayHeaderFooter: true, headerTemplate: '<span></span>',
      footerTemplate: `<div style="width:100%;margin:0 18mm;font:8px Arial;color:#606963;display:flex;justify-content:space-between"><span>Becoming an AI Engineer / Chapter ${chapter.number}</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>`,
      tagged: true, outline: true
    });
    const bytes = await readFile(path);
    await cp(path, join('dist', 'pdfs', chapter.pdf));
    manifest.chapters.push({ ...chapter, sha256: hash(bytes), bytes: bytes.length, ...audit });
    await page.close();
    console.log(`Generated ${path}: ${(bytes.length / 1024 / 1024).toFixed(2)} MB; ${audit.answers} expanded answers.`);
  }
} finally {
  await browser.close();
}
await writeFile('publications/manifest.json', JSON.stringify(manifest, null, 2) + '\n');
