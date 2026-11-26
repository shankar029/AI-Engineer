import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { unzipSync, strFromU8 } from 'fflate';
import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { metadata, bookOrder, wholeBookFiles } from './chapters.mjs';

export function releaseBlockers() {
  return [
    ...['author', 'rights', 'edition'].filter(key => !metadata[key]?.trim()).map(key => `${key} metadata is undecided`),
    ...(!metadata.finalChapterList ? ['final chapter list has not been approved'] : []),
    ...(!metadata.printerRequirementsConfirmed ? ['printer, paper, trim, color and cover requirements are provisional'] : [])
  ];
}
const blockers = releaseBlockers();
if (process.argv.includes('--release') && blockers.length) {
  console.error('FINAL RELEASE BLOCKED:\n' + blockers.map(value => `- ${value}`).join('\n'));
  process.exit(1);
}
const manifest = JSON.parse(await readFile('publications/book-manifest.json', 'utf8'));
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const bytes = await readFile(`publications/${wholeBookFiles.epub}`);
assert.equal(bytes.readUInt32LE(0), 0x04034b50, 'EPUB must be a ZIP container');
assert.equal(bytes.readUInt16LE(8), 0, 'mimetype must be stored, not compressed');
assert.equal(bytes.subarray(30, 38).toString(), 'mimetype', 'mimetype must be first');
assert.equal(sha(bytes), manifest.epub.sha256, 'EPUB differs from assembly manifest');
const files = unzipSync(bytes);
assert.equal(strFromU8(files.mimetype), 'application/epub+zip');
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  const report = await page.evaluate(({ entries, expected, sections }) => {
    const parse = path => {
      if (!(path in entries)) throw Error(`Missing EPUB resource: ${path}`);
      const doc = new DOMParser().parseFromString(entries[path], 'application/xml');
      if (doc.querySelector('parsererror')) throw Error(`Malformed XML: ${path}: ${doc.querySelector('parsererror').textContent}`);
      return doc;
    };
    const container = parse('META-INF/container.xml');
    const opfPath = container.querySelector('rootfile').getAttribute('full-path');
    const opf = parse(opfPath);
    const resources = [...opf.querySelectorAll('manifest item')];
    const declared = new Set(resources.map(item => `EPUB/${item.getAttribute('href')}`));
    for (const path of declared) if (!(path in entries)) throw Error(`Manifest target missing: ${path}`);
    const ids = new Map(resources.map(item => [item.id, item.getAttribute('href')]));
    const spine = [...opf.querySelectorAll('spine itemref')].map(item => ids.get(item.getAttribute('idref')));
    if (JSON.stringify(spine) !== JSON.stringify(expected)) throw Error('EPUB spine differs from the book order');
    let formulas = 0, answers = 0;
    const documents = new Map();
    for (const path of declared) if (/\.xhtml$|\.svg$/.test(path)) documents.set(path, parse(path));
    for (const [path, doc] of documents) {
      if (!path.endsWith('.xhtml')) continue;
      formulas += doc.querySelectorAll('img.formula').length;
      answers += doc.querySelectorAll('.answer').length;
      for (const node of doc.querySelectorAll('[href],[src]')) {
        const ref = node.getAttribute('href') || node.getAttribute('src');
        if (/^https?:|^mailto:/.test(ref)) continue;
        const [target, anchor] = ref.split('#');
        const resolved = target ? `EPUB/${target}` : path;
        if (!(resolved in entries)) throw Error(`${path}: missing local reference ${ref}`);
        if (anchor && !documents.get(resolved)?.getElementById(anchor)) throw Error(`${path}: broken anchor ${ref}`);
      }
      for (const image of doc.querySelectorAll('img')) if (!image.hasAttribute('alt')) throw Error(`${path}: image lacks alternative text`);
      if (doc.querySelector('script,details,input,button,.katex')) throw Error(`${path}: web-only content remained in EPUB`);
      const normalized = text => text.toLowerCase().replace(/[^a-z0-9]/g, '');
      const section = sections.find(section => section.file.replace('.html', '.xhtml') === path.slice(5));
      if (section) {
        const text = normalized(doc.documentElement.textContent);
        const missing = section.fragments.filter(fragment => !text.includes(normalized(fragment)));
        if (missing.length) throw Error(`${path}: missing substantive EPUB text: ${missing[0]}`);
      }
    }
    const nav = parse('EPUB/nav.xhtml');
    const tocLinks = [...nav.querySelector('#toc').querySelectorAll('a')].map(a => a.getAttribute('href'));
    if (JSON.stringify(tocLinks) !== JSON.stringify(expected)) throw Error('EPUB navigation and spine differ');
    return { spine, formulas, answers, resources: declared.size };
  }, { entries: Object.fromEntries(Object.entries(files).map(([path, data]) => [path, /\.xhtml$|\.xml$|\.opf$|\.svg$/.test(path) ? strFromU8(data) : 'binary'])),
    expected: ['index.xhtml', ...bookOrder.map(page => page.file.replace('.html', '.xhtml'))], sections: manifest.sections });
  assert.equal(report.formulas, manifest.epub.formulas);
  assert.equal(report.answers, manifest.sections.reduce((sum, section) => sum + section.answers, 0));
  const jar = process.env.EPUBCHECK_JAR;
  let epubcheck = 'not run: set EPUBCHECK_JAR and optionally JAVA_COMMAND';
  if (jar) {
    const result = spawnSync(process.env.JAVA_COMMAND || 'java', ['-jar', jar, `publications/${wholeBookFiles.epub}`], { encoding: 'utf8' });
    if (result.error) throw result.error;
    console.log(result.stdout);
    if (result.status !== 0) throw Error(result.stderr || 'EPUBCheck failed');
    epubcheck = 'passed';
  } else if (process.argv.includes('--release')) {
    throw Error('Final-release validation requires EPUBCheck: set EPUBCHECK_JAR.');
  }
  await writeFile('dist/book-review/epub-validation.json', JSON.stringify({ ...report, epubcheck, releaseBlockers: blockers }, null, 2));
  console.log(`EPUB integrity: ${report.spine.length} ordered sections, ${report.formulas} formulas, ${report.answers} complete answers. EPUBCheck: ${epubcheck}.`);
  console.log('Review edition only. Remaining release decisions:\n' + blockers.map(value => `- ${value}`).join('\n'));
} finally {
  await browser.close();
}
