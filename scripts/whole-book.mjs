import { chromium } from '@playwright/test';
import { createHash } from 'node:crypto';
import { readFile, writeFile, mkdir, readdir, cp } from 'node:fs/promises';
import { resolve, join, relative } from 'node:path';
import { pathToFileURL } from 'node:url';
import { zipSync, strToU8 } from 'fflate';
import { mathjax } from 'mathjax-full/js/mathjax.js';
import { TeX } from 'mathjax-full/js/input/tex.js';
import { SVG } from 'mathjax-full/js/output/svg.js';
import { liteAdaptor } from 'mathjax-full/js/adaptors/liteAdaptor.js';
import { RegisterHTMLHandler } from 'mathjax-full/js/handlers/html.js';
import { AllPackages } from 'mathjax-full/js/input/tex/AllPackages.js';
import { metadata, bookOrder, wholeBookFiles, chapters } from './chapters.mjs';
import { contentId, escape } from './book-content.mjs';

const hash = data => createHash('sha256').update(data).digest('hex');
const out = resolve('dist', 'book-review');
await mkdir(out, { recursive: true });
const files = new Map();
async function sourceDigest() {
  const paths = ['AUTHORING.md', 'package.json', 'package-lock.json', 'requirements-pdf.txt'];
  async function visit(folder) {
    for (const entry of await readdir(folder, { withFileTypes: true })) {
      const path = join(folder, entry.name);
      if (entry.isDirectory()) await visit(path);
      else if (!path.includes('__pycache__')) paths.push(path);
    }
  }
  await visit('book'); await visit('scripts');
  const digest = createHash('sha256');
  for (const path of paths.sort()) {
    digest.update(relative('.', path).replaceAll('\\', '/'));
    digest.update((await readFile(path, 'utf8')).replaceAll('\r\n', '\n'));
  }
  return digest.digest('hex');
}
const browser = await chromium.launch();
const sections = [];
const page = await browser.newPage();
const inventory = [{ file: 'index.html', title: metadata.title, type: 'cover' }, ...bookOrder];
try {
  for (const entry of inventory) {
    await page.goto(pathToFileURL(resolve('dist', entry.file)).href);
    const data = await page.evaluate(() => {
      const main = document.querySelector('main').cloneNode(true);
      main.querySelectorAll('script,.diagram-hint,.book-downloads,.cover-actions,.cover-orientation,.chapter-pagination,.chapter-cards,.hero-link,.hero-bottom,.intro-strip').forEach(node => node.remove());
      main.querySelectorAll('.lab input,.lab button,.lab label').forEach(node => node.remove());
      main.querySelectorAll('noscript').forEach(node => {
        const holder = document.createElement('div');
        holder.innerHTML = node.textContent;
        node.replaceWith(...holder.childNodes);
      });
      main.querySelectorAll('details').forEach(node => {
        const answer = document.createElement('div');
        answer.className = 'answer';
        const summary = node.querySelector('summary');
        if (summary) {
          const label = document.createElement('p');
          label.className = 'answer-label';
          label.textContent = summary.textContent;
          answer.append(label);
          summary.remove();
        }
        answer.append(...node.childNodes);
        node.replaceWith(answer);
      });
      main.querySelectorAll('img').forEach(img => img.removeAttribute('loading'));
      const speak = node => {
        if (node.nodeType === Node.TEXT_NODE) return node.textContent;
        const children = [...node.children].map(speak);
        if (node.localName === 'mfrac') return `(${children[0]}) divided by (${children[1]})`;
        if (node.localName === 'msup') return `${children[0]} to the power (${children[1]})`;
        if (node.localName === 'msub') return `${children[0]} subscript (${children[1]})`;
        if (node.localName === 'msubsup') return `${children[0]} subscript (${children[1]}) to the power (${children[2]})`;
        if (node.localName === 'msqrt') return `square root of (${children.join(' ')})`;
        if (node.localName === 'mtr') return `row (${children.join(', ')})`;
        if (node.localName === 'mtable') return `table (${children.join('; ')})`;
        return children.length ? children.join(' ') : node.textContent;
      };
      const tex = [...main.querySelectorAll('.math,.equation')].map(node => {
        const formula = node.querySelector('math').cloneNode(true);
        formula.querySelectorAll('annotation').forEach(n => n.remove());
        return { tex: node.querySelector('annotation[encoding="application/x-tex"]').textContent,
          alt: speak(formula).replace(/\s+/g, ' ').trim(), display: node.className === 'equation' };
      });
      const fragments = [];
      const walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) {
        const node = walker.currentNode;
        if (node.parentElement.closest('.math,.equation,.chapter-pagination,.answer-label')) continue;
        const value = node.textContent.replace(/\s+/g, ' ').trim();
        if (value.replace(/[^a-zA-Z0-9]/g, '').length >= 24) fragments.push(value);
      }
      return { html: main.innerHTML, tex, fragments: [...new Set(fragments)],
        answers: main.querySelectorAll('.answer').length, figures: main.querySelectorAll('figure').length };
    });
    sections.push({ ...entry, ...data });
  }
  // One DOM transform supplies namespaced, unambiguous links for both ebook and PDF.
  const prepared = await page.evaluate(sections => {
    return sections.map(section => {
      const holder = document.createElement('div');
      holder.innerHTML = section.html;
      const prefix = section.file.replace('.html', '');
      holder.querySelectorAll('[id]').forEach(node => node.id = `${prefix}--${node.id}`);
      holder.querySelectorAll('[aria-labelledby],[aria-describedby]').forEach(node => {
        for (const attribute of ['aria-labelledby', 'aria-describedby']) {
          if (node.hasAttribute(attribute)) node.setAttribute(attribute, node.getAttribute(attribute).split(/\s+/).map(id => `${prefix}--${id}`).join(' '));
        }
      });
      holder.querySelectorAll('.answer').forEach((node, index) => node.dataset.answerId = `${prefix}-${index + 1}`);
      holder.querySelectorAll('.math,.equation').forEach((node, index) => node.dataset.formulaId = `${prefix}-${index + 1}`);
      holder.querySelectorAll('a[href]').forEach(link => {
        const href = link.getAttribute('href');
        if (/^https?:|^mailto:/.test(href)) return;
        const [file, anchor] = href.split('#');
        const target = file || section.file;
        if (!sections.some(s => s.file === target)) {
          if (target === 'authoring.html') link.replaceWith(...link.childNodes);
          else throw Error(`Unmapped whole-book link: ${section.file}: ${href}`);
        } else link.setAttribute('href', `${target}${anchor ? `#${target.replace('.html', '')}--${anchor}` : ''}`);
      });
      return { ...section, html: holder.innerHTML };
    });
  }, sections);

  const adaptor = liteAdaptor();
  RegisterHTMLHandler(adaptor);
  const mathDocument = mathjax.document('', { InputJax: new TeX({ packages: AllPackages }),
    OutputJax: new SVG({ fontCache: 'none' }) });
  let formulaIndex = 0;
  const epubSections = [];
  for (const section of prepared) {
    const formulaImages = section.tex.map(formula => {
      const node = mathDocument.convert(formula.tex, { display: formula.display });
      let svg = adaptor.outerHTML(adaptor.firstChild(node));
      if (svg.includes('data-mjx-error')) throw Error(`EPUB math conversion failed: ${formula.tex}`);
      const name = `formula-${String(++formulaIndex).padStart(4, '0')}.svg`;
      const width = Number(svg.match(/width="([\d.]+)ex"/)?.[1]);
      const height = Number(svg.match(/height="([\d.]+)ex"/)?.[1]);
      if (!width || !height) throw Error(`Missing formula geometry: ${formula.tex}`);
      svg = svg.replace('<svg ', `<svg aria-label="${escape(formula.alt)}" `);
      files.set(`EPUB/math/${name}`, strToU8(svg));
      return { src: `math/${name}`, alt: formula.alt, width: width * .442, height: height * .442 };
    });
    const xhtml = await page.evaluate(({ section, images }) => {
      const holder = document.createElement('div');
      holder.innerHTML = section.html;
      holder.querySelectorAll('.math,.equation').forEach((node, i) => {
        const image = document.createElement('img');
        image.src = images[i].src;
        image.alt = images[i].alt;
        image.className = node.className === 'equation' ? 'formula display-formula' : 'formula';
        image.style.width = `${images[i].width}em`;
        image.style.height = 'auto';
        node.replaceChildren(image);
      });
      holder.querySelectorAll('a[href]').forEach(link => link.setAttribute('href', link.getAttribute('href').replace('.html', '.xhtml')));
      for (const table of holder.querySelectorAll('table')) {
        const headings = [...(table.tHead?.rows[table.tHead.rows.length - 1]?.cells || [])].map(cell => cell.textContent.trim());
        for (const body of table.tBodies) for (const row of body.rows) for (const [index, cell] of [...row.cells].entries()) {
          if (!headings[index]) continue;
          const label = document.createElement('span');
          label.className = 'cell-label';
          label.textContent = `${headings[index]}: `;
          cell.prepend(label);
        }
      }
      return new XMLSerializer().serializeToString(holder).replace(/^<div[^>]*>|<\/div>$/g, '');
    }, { section, images: formulaImages });
    epubSections.push({ ...section, xhtml });
    files.set(`EPUB/${contentId(section.file)}.xhtml`, strToU8(`<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="${metadata.language}" xml:lang="${metadata.language}"><head><title>${escape(section.title)}</title><link rel="stylesheet" type="text/css" href="ebook.css"/></head><body epub:type="${section.type === 'cover' ? 'cover' : section.type === 'chapter' ? 'chapter' : 'bodymatter'}">${xhtml}</body></html>`));
  }
  const assetNames = new Set();
  for (const section of epubSections) for (const match of section.html.matchAll(/src="assets\/([^"]+)"/g)) assetNames.add(match[1]);
  for (const asset of assetNames) files.set(`EPUB/assets/${asset}`, new Uint8Array(await readFile(join('book', 'assets', asset))));
  files.set('EPUB/ebook.css', strToU8(`body{color:#213b35;font:1em/1.5 serif;margin:5%;}h1,h2,h3{line-height:1.2;}h1{font-size:1.8em;}h2{font-size:1.4em;}a{color:#226b59;}img{max-width:100%;height:auto;}figure{margin:1em 0;}figcaption,.symbol-key{font-size:.9em;}img.formula{display:inline-block;vertical-align:middle;max-width:100%;}.equation{margin:1em 0;text-align:center;}.worked,.callout,.answer,.recap{padding:.6em;border:1px solid #dedfd5;margin:1em 0;}table{border-collapse:collapse;width:100%;font-size:.9em;}th,td{padding:.3em;border:1px solid #dedfd5;overflow-wrap:anywhere;}.cell-label{display:none;}@media(max-width:600px){table,thead,tbody,tr,th,td{display:block;width:auto;}thead{display:none;}.cell-label{display:block;font-weight:bold;}.formula{max-width:100%;}}pre{white-space:pre-wrap;overflow-wrap:anywhere;font-size:.85em;}code{overflow-wrap:anywhere;}dt{font-weight:bold;}dd{margin-left:1em;}.eyebrow,.label,.chapter-meta{font-size:.85em;}.cover-actions,.cover-orientation,.chapter-cards,.intro-strip,.hero-bottom{display:none;}.hero-art{max-width:60%;}.book-contents{padding-left:1em;}`));
  const navList = prepared.map(s => `<li><a href="${contentId(s.file)}.xhtml">${s.number ? `${s.number} / ` : ''}${escape(s.title)}</a></li>`).join('');
  files.set('EPUB/nav.xhtml', strToU8(`<?xml version="1.0" encoding="UTF-8"?><html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="${metadata.language}"><head><title>Contents</title></head><body><nav epub:type="toc" id="toc"><h1>Contents</h1><ol>${navList}</ol></nav><nav epub:type="landmarks"><h2>Reading landmarks</h2><ol><li><a epub:type="cover" href="index.xhtml">Cover</a></li><li><a epub:type="bodymatter" href="${contentId(chapters[0].file)}.xhtml">Start of chapters</a></li></ol></nav></body></html>`));
  const items = [...files.keys()].filter(path => path.startsWith('EPUB/')).map((path, i) => {
    const ext = path.split('.').pop();
    const media = { xhtml: 'application/xhtml+xml', svg: 'image/svg+xml', css: 'text/css', png: 'image/png', jpg: 'image/jpeg' }[ext];
    if (!media) throw Error(`Unsupported EPUB asset: ${path}`);
    const id = path.endsWith('.xhtml') ? contentId(path.split('/').pop().replace('.xhtml', '.html')) : `resource-${i}`;
    const properties = path.endsWith('/nav.xhtml') ? ' properties="nav"' : path.endsWith('/engineering-cover.svg') ? ' properties="cover-image"' : '';
    return `<item id="${id}" href="${path.slice(5)}" media-type="${media}"${properties}/>`;
  }).join('');
  const modified = new Date(Number(process.env.SOURCE_DATE_EPOCH || Math.floor(Date.now() / 1000)) * 1000).toISOString().replace(/\.\d{3}Z$/, 'Z');
  files.set('EPUB/package.opf', strToU8(`<?xml version="1.0" encoding="UTF-8"?><package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="book-id" xml:lang="${metadata.language}"><metadata xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:identifier id="book-id">${escape(metadata.identifier)}</dc:identifier><dc:title>${escape(metadata.title)} - ${escape(metadata.reviewLabel)}</dc:title><dc:language>${metadata.language}</dc:language>${metadata.author ? `<dc:creator>${escape(metadata.author)}</dc:creator>` : ''}${metadata.rights ? `<dc:rights>${escape(metadata.rights)}</dc:rights>` : ''}<meta property="dcterms:modified">${modified}</meta></metadata><manifest>${items}</manifest><spine>${prepared.map(s => `<itemref idref="${contentId(s.file)}"/>`).join('')}</spine></package>`));
  files.set('META-INF/container.xml', strToU8('<?xml version="1.0"?><container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles><rootfile full-path="EPUB/package.opf" media-type="application/oebps-package+xml"/></rootfiles></container>'));
  const zip = { mimetype: [strToU8('application/epub+zip'), { level: 0 }] };
  for (const [name, data] of files) zip[name] = [data, { level: 6 }];
  await writeFile(join('publications', wholeBookFiles.epub), zipSync(zip));
  // Unpacked XHTML is a validation/preview artifact, not part of the website.
  for (const [name, data] of files) {
    const dest = join(out, 'epub', name);
    await mkdir(resolve(dest, '..'), { recursive: true }); await writeFile(dest, data);
  }

  const baseCss = await readFile('book/assets/book-edition.css', 'utf8');
  const printAssets = new Map();
  const figureNames = new Set(prepared.flatMap(section => [...section.html.matchAll(/<figure>[\s\S]*?src="assets\/([^"]+)"/g)].map(match => match[1])));
  const printAssetDirectory = join(out, 'print-assets');
  await mkdir(printAssetDirectory, { recursive: true });
  const printContentWidth = metadata.print.widthInches * 25.4 - 40;
  for (const name of figureNames) {
    await page.goto(pathToFileURL(resolve('book', 'assets', name)).href);
    const illustration = await page.evaluate(contentWidth => {
      const svg = document.querySelector('svg');
      const box = svg.viewBox.baseVal;
      const widthMm = Math.min(160, contentWidth * box.width / box.height);
      const minimumFont = 8.5 * box.width / (widthMm * 72 / 25.4);
      const notes = [];
      const texts = [...svg.querySelectorAll('text')];
      const bounds = text => {
        const box = text.getBBox();
        const transform = svg.getCTM().inverse().multiply(text.getCTM());
        const corners = [[box.x, box.y], [box.x + box.width, box.y], [box.x, box.y + box.height], [box.x + box.width, box.y + box.height]]
          .map(([x, y]) => new DOMPoint(x, y).matrixTransform(transform));
        const x = Math.min(...corners.map(point => point.x)), y = Math.min(...corners.map(point => point.y));
        return { x, y, width: Math.max(...corners.map(point => point.x)) - x, height: Math.max(...corners.map(point => point.y)) - y };
      };
      const original = new Map(texts.map(text => [text, bounds(text)]));
      for (const text of texts) {
        const size = parseFloat(getComputedStyle(text).fontSize);
        if (size >= minimumFont) continue;
        text.style.fontSize = `${Math.ceil(minimumFont * 10) / 10}px`;
        let rect = bounds(text);
        const dx = Math.max(box.x + 1 - rect.x, 0) - Math.max(rect.x + rect.width - box.x - box.width + 1, 0);
        const dy = Math.max(box.y + 1 - rect.y, 0) - Math.max(rect.y + rect.height - box.y - box.height + 1, 0);
        if (dx || dy) {
          const inverse = svg.getCTM().inverse().multiply(text.getCTM()).inverse();
          text.setAttribute('dx', (parseFloat(text.getAttribute('dx')) || 0) + inverse.a * dx + inverse.c * dy);
          text.setAttribute('dy', (parseFloat(text.getAttribute('dy')) || 0) + inverse.b * dx + inverse.d * dy);
          rect = bounds(text);
        }
        const intersects = texts.some(other => {
          if (other === text || !other.isConnected) return false;
          const a = original.get(text), b = original.get(other), now = bounds(other);
          const overlaps = (a, b) => a.x < b.x + b.width - 1 && a.x + a.width > b.x + 1 && a.y < b.y + b.height - 1 && a.y + a.height > b.y + 1;
          return !overlaps(a, b) && overlaps(rect, now);
        });
        if (intersects || rect.x < box.x || rect.x + rect.width > box.x + box.width || rect.y < box.y || rect.y + rect.height > box.y + box.height) {
          notes.push(text.textContent);
          text.remove();
        }
      }
      return { svg: new XMLSerializer().serializeToString(svg), widthMm, heightMm: widthMm * box.height / box.width, notes };
    }, printContentWidth);
    if (name === 'vector-addition.svg') illustration.notes = illustration.notes.map(note =>
      note === '5' ? 'Top north-axis tick: 5 m' : note);
    await writeFile(join(printAssetDirectory, name), illustration.svg);
    printAssets.set(name, { ...illustration, src: pathToFileURL(join(printAssetDirectory, name)).href });
  }
  await page.goto(pathToFileURL(resolve('dist', 'index.html')).href);
  const report = { sourceDigest: await sourceDigest(), review: true, metadata: { author: metadata.author, rights: metadata.rights, edition: metadata.edition },
    epub: { file: wholeBookFiles.epub, sha256: hash(await readFile(join('publications', wholeBookFiles.epub))), sections: prepared.map(s => s.file), formulas: formulaIndex },
    sections: prepared.map(({ file, title, answers, figures, fragments }) => ({ file, title, answers, figures, fragments })), pdfs: [] };
  for (const kind of ['digital', 'print']) {
    const selected = kind === 'print' ? prepared.filter(s => s.type !== 'cover') : prepared;
    let html = selected.map(s => `<section class="book-section" id="section-${contentId(s.file)}" data-file="${s.file}">${s.html}</section>`).join('');
    html = html.replace(/href="([^"#]+\.html)(#[^"]+)?"/g, (_, file, anchor) => `href="${anchor || `#section-${contentId(file)}`}"`);
    html = html.replaceAll('src="assets/', `src="${pathToFileURL(resolve('book', 'assets')).href}/`);
    html = await page.evaluate(({ html, printAssets, kind }) => {
      const holder = document.createElement('div');
      holder.innerHTML = html;
      if (kind === 'print') for (const figure of holder.querySelectorAll('figure')) {
        const image = figure.querySelector('img');
        const asset = printAssets[image.getAttribute('src').split('/').pop()];
        if (!asset) throw Error('Missing print illustration');
        image.setAttribute('src', asset.src);
        const viewport = image.parentElement;
        viewport.classList.add('print-figure-viewport');
        viewport.style.height = `${asset.widthMm}mm`;
        image.style.width = `${asset.widthMm}mm`;
        image.style.left = `calc(50% + ${asset.heightMm / 2}mm)`;
        if (asset.notes.length) {
          const note = document.createElement('p');
          note.className = 'symbol-key';
          note.textContent = `Diagram annotations: ${asset.notes.join('; ')}.`;
          figure.append(note);
        }
      }
      for (const pre of holder.querySelectorAll('pre')) {
        const listing = document.createElement('div');
        listing.className = 'code-listing';
        for (const line of pre.textContent.split('\n')) {
          const row = document.createElement('pre');
          row.textContent = line || '\u00a0';
          listing.append(row);
        }
        pre.replaceWith(listing);
      }
      return holder.innerHTML;
    }, { html, printAssets: Object.fromEntries(printAssets), kind });
    const printCss = kind === 'print' ? `@page{size:${metadata.print.widthInches}in ${metadata.print.heightInches}in;margin-top:15mm;margin-bottom:18mm;}@page:left{margin-left:16mm;margin-right:22mm;}@page:right{margin-left:22mm;margin-right:16mm;}body{font-size:10pt;}h1{font-size:25pt;}h2{font-size:17pt;}table{font-size:8.5pt;}th,td{padding:1mm;}.chapter-header .dek{font-size:11pt;}figure{break-before:page;break-after:page;margin:0;}.print-figure-viewport{position:relative;margin:2mm 0;}.print-figure-viewport img{position:absolute;top:0;max-width:none;transform:rotate(90deg);transform-origin:top left;}` : '';
    const cssPath = join(out, `${kind}.css`);
    await writeFile(cssPath, baseCss + printCss);
    const previewPath = join(out, `${kind}-source.html`);
    await writeFile(previewPath, `<!doctype html><html lang="en"><head><meta charset="utf-8"/><title>${escape(metadata.title)}</title><link rel="stylesheet" href="${pathToFileURL(resolve('node_modules/katex/dist/katex.min.css')).href}"/></head><body></body></html>`);
    await page.goto(pathToFileURL(previewPath).href);
    await page.addScriptTag({ path: resolve('node_modules/pagedjs/dist/paged.js') });
    await page.evaluate(async ({ html, css, cssText }) => {
      await new Paged.Previewer().preview(html, [{ [css]: cssText }], document.body);
      await document.fonts.ready;
    }, { html, css: pathToFileURL(cssPath).href, cssText: baseCss + printCss });
    const audit = await page.evaluate(() => {
      const pages = [...document.querySelectorAll('.pagedjs_page')];
      const destinations = {};
      const overflow = [];
      for (const [index, page] of pages.entries()) {
        const area = page.querySelector('.pagedjs_area').getBoundingClientRect();
        for (const section of page.querySelectorAll('[data-file]')) destinations[section.dataset.file] ??= index + 1;
        for (const node of page.querySelectorAll('.pagedjs_page_content .katex-html,.pagedjs_page_content table,.pagedjs_page_content img,.pagedjs_page_content pre')) {
          const box = node.getBoundingClientRect();
          if (box.width && (box.left < area.left - 1 || box.right > area.right + 1)) overflow.push({ page: index + 1, text: node.textContent.slice(0,120) || node.getAttribute('src'), width: box.width, available: area.width, style: node.getAttribute('style'), cssWidth: getComputedStyle(node).width, parent: node.parentElement.outerHTML.slice(0,200) });
          if (node.tagName === 'IMG' && box.height && (box.top < area.top - 1 || box.bottom > area.bottom + 1)) overflow.push({ page: index + 1, image: node.getAttribute('src'), height: box.height, availableHeight: area.height });
        }
      }
      const failedImages = [...document.querySelectorAll('.pagedjs_page img')].filter(img => !img.complete || !img.naturalWidth);
      if (failedImages.length) throw Error('Unloaded whole-book image');
      return { pages: pages.length, destinations, overflow,
        formulas: new Set([...document.querySelectorAll('.pagedjs_page [data-formula-id]')].map(node => node.dataset.formulaId)).size,
        answers: new Set([...document.querySelectorAll('.pagedjs_page .answer')].map(node => node.dataset.answerId)).size };
    });
    await writeFile(join(out, `${kind}-layout.json`), JSON.stringify(audit, null, 2));
    await writeFile(join(out, `${kind}-preview.html`), await page.content());
    if (audit.overflow.length) throw Error(`${kind}: fixed-page content needs reflow:\n${JSON.stringify(audit.overflow.slice(0,12), null, 2)}`);
    await page.evaluate(() => {
      const style = document.createElement('style');
      style.textContent = '.pagedjs_pages{display:block!important;}.pagedjs_page{margin:0!important;box-shadow:none!important;break-after:page!important;}.pagedjs_page:last-child{break-after:auto!important;}';
      document.head.append(style);
    });
    const pdf = join('publications', wholeBookFiles[kind]);
    await page.pdf({ path: pdf, width: kind === 'print' ? `${metadata.print.widthInches}in` : '210mm', height: kind === 'print' ? `${metadata.print.heightInches}in` : '297mm',
      margin: { top: 0, right: 0, bottom: 0, left: 0 }, printBackground: true, preferCSSPageSize: false, tagged: true, outline: true });
    report.pdfs.push({ kind, file: wholeBookFiles[kind], sha256: hash(await readFile(pdf)), ...audit });
    console.log(`${kind}: ${audit.pages} pages; section destinations recorded.`);
  }
  await writeFile('publications/book-manifest.json', JSON.stringify(report, null, 2) + '\n');
  for (const file of Object.values(wholeBookFiles)) await cp(join('publications', file), resolve('dist', 'pdfs', file));
  console.log(`EPUB: ${prepared.length} ordered sections; ${formulaIndex} accessible vector formula images.`);
} finally {
  await browser.close();
}
