import { mkdir, readFile, writeFile, cp, access } from 'node:fs/promises';
import { chapters, readingPages, metadata, wholeBookFiles } from './chapters.mjs';
import { pageContent } from './book-content.mjs';
import katex from 'katex';
import MarkdownIt from 'markdown-it';

const pages = readingPages;
const escape = text => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
const md = new MarkdownIt({ html: false, typographer: false });
await mkdir('dist', { recursive: true });
await cp('book/assets', 'dist/assets', { recursive: true });
await cp('node_modules/katex/dist', 'dist/assets/katex', { recursive: true });
await mkdir('dist/pdfs', { recursive: true });
for (const chapter of chapters) {
  const source = `publications/${chapter.pdf}`;
  try {
    await access(source);
  } catch (error) {
    if (error.code === 'ENOENT') continue;
    throw error;
  }
  await cp(source, `dist/pdfs/${chapter.pdf}`);
}
for (const file of Object.values(wholeBookFiles)) {
  try { await access(`publications/${file}`); }
  catch (error) { if (error.code === 'ENOENT') continue; throw error; }
  await cp(`publications/${file}`, `dist/pdfs/${file}`);
}
const template = await readFile('book/template.html', 'utf8');

for (const page of pages) {
  let content = page.type === 'guide'
    ? `<header class="chapter-header"><p class="eyebrow">Behind the book</p><h1>The authoring system</h1><p class="dek">One visual language. One teaching promise. A reference for every chapter that follows.</p></header>${md.render((await readFile('AUTHORING.md', 'utf8')).replace(/^# .+\r?\n/, '').replace(/<!-- maintainer-only -->[\s\S]*?<!-- \/maintainer-only -->/g, ''))}`
    : await pageContent(page);
  if (page.type === 'guide') content = content.replace(/<table>[\s\S]*?<\/table>/g, table => `<div class="table-wrap">${table}</div>`);
  content = content.replace(/<figure>\s*(<img[^>]+>)/g, '<figure><div class="figure-viewport" tabindex="0" role="group" aria-label="Diagram. Scroll horizontally on small screens.">$1</div>');
  content = content.replaceAll('</figcaption>', '<span class="diagram-hint"> On small screens, scroll the diagram to see every detail.</span></figcaption>');
  content = content.replace(/<(span|div) class="(math|equation)">([\s\S]*?)<\/\1>/g, (_, tag, cls, tex) =>
    `<${tag} class="${cls}">${katex.renderToString(tex.trim().replaceAll('&amp;', '&').replaceAll('&gt;', '>').replaceAll('&lt;', '<'), { displayMode: cls === 'equation', throwOnError: true, output: 'htmlAndMathml', strict: 'error' })}</${tag}>`);
  const headings = [];
  content = content.replace(/<h2(?: id="([^"]+)")?>([\s\S]*?)<\/h2>/g, (_, givenId, text) => {
    const plain = text.replace(/<[^>]*>/g, '');
    const id = givenId || plain.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    headings.push({ id, text: plain });
    return `<h2 id="${id}">${text}</h2>`;
  });
  const nav = metadata.parts.map(part => `<p class="nav-label">${escape(part.label)}<span>${escape(part.title.replace(`${part.label}: `, ''))}</span></p>${pages.filter(p => p.type === 'chapter' && part.chapters.some(chapter => chapter.file === p.file)).map(p =>
    `<a class="chapter-link${page.file === p.file ? ' selected' : ''}" href="${p.file}"${page.file === p.file ? ' aria-current="page"' : ''}><span>${p.number}</span><span>${p.title}<small>${p.subtitle}</small></span>${page.file === p.file ? '<span class="current-dot" aria-hidden="true"></span>' : ''}</a>`).join('')}`).join('');
  const toc = headings.map((h, i) => `<a href="#${h.id}"><span>${String(i + 1).padStart(2, '0')}</span>${h.text.replace(/^\d+\.\s*/, '')}</a>`).join('');
  let html = template.replaceAll('{{TITLE}}', escape(page.title)).replace('{{TYPE}}', page.type)
    .replace('{{PARTS}}', metadata.parts.map(part => `<a class="overview-link" href="${part.file}"><span aria-hidden="true">&#8594;</span> ${escape(part.title)}</a>`).join(''))
    .replace('{{BOOK_PAGES}}', [...metadata.frontMatter, ...metadata.backMatter].filter(p => p.kind !== 'title' && p.kind !== 'publication').map(p => `<a class="overview-link" href="${p.file}">${escape(p.title)}</a>`).join(''))
    .replace('{{NAV}}', nav).replace('{{CONTENT}}', content)
    .replace('{{TOC}}', toc).replace('{{PDF_LINK}}', page.pdf ? `<a class="pdf-download" href="pdfs/${page.pdf}" download>Chapter PDF <span aria-hidden="true">&#8595;</span></a>` : '')
    .replace('{{BREADCRUMB}}', page.type === 'cover' ? 'The book cover' : page.type === 'guide' ? 'Authoring guide' : page.type === 'chapter' ? `${metadata.parts.find(part => part.chapters.some(chapter => chapter.file === page.file)).label} / ${page.number} ${page.title}` : page.title);
  await writeFile(`dist/${page.file}`, html);
}
console.log(`Built ${pages.length} pages. All formulas rendered locally with KaTeX.`);
