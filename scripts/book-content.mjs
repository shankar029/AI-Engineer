import { readFile } from 'node:fs/promises';
import { metadata, chapters, bookOrder, wholeBookFiles } from './chapters.mjs';

export const escape = text => String(text).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
export const contentId = file => file.replace(/\.html$/, '');
const header = title => `<header class="chapter-header"><p class="eyebrow">${escape(metadata.title)}</p><h1>${escape(title)}</h1></header>`;
const withNavigation = (content, page) => {
  const index = bookOrder.findIndex(entry => entry.file === page.file);
  if (index < 0 || page.type === 'chapter') return content;
  const previous = bookOrder[index - 1] || { file: 'index.html', title: 'Book cover' };
  const next = bookOrder[index + 1] || { file: 'index.html', title: 'Book cover' };
  return `${content}<nav class="chapter-pagination" aria-label="Book navigation"><a href="${previous.file}"><small>Previous</small>&#8592; ${escape(previous.title)}</a><a href="${next.file}"><small>Next</small>${escape(next.title)} &#8594;</a></nav>`;
};
export function contentsHtml() {
  return `<ol class="book-contents">${bookOrder.filter(page => page.kind !== 'title' && page.kind !== 'publication' && page.kind !== 'contents').map(page =>
    `<li class="${page.type === 'chapter' ? 'contents-chapter' : 'contents-matter'}"><a href="${page.file}">${page.number ? `${page.number} / ` : ''}${escape(page.title)}</a></li>`
  ).join('')}</ol>`;
}
export function downloadsHtml() {
  return `<section class="book-downloads"><h2 id="review-downloads">Whole-book review downloads</h2><p>These exports assemble the current chapters and book pages. The print interior uses a provisional 6-by-9-inch color layout; it is not a printer-approved file or a wraparound cover.</p><ul>${Object.entries(wholeBookFiles).map(([kind, file]) => `<li><a href="pdfs/${file}">${kind === 'epub' ? 'Reflowable EPUB' : kind === 'digital' ? 'Complete reading PDF' : 'Provisional 6-by-9 print interior PDF'}</a></li>`).join('')}</ul></section>`;
}
export async function pageContent(page) {
  if (page.kind === 'title') return withNavigation(`${header(metadata.title)}<div class="title-page"><p class="dek">${escape(metadata.subtitle)}</p>${metadata.author ? `<p class="book-author">${escape(metadata.author)}</p>` : ''}</div>`, page);
  if (page.kind === 'publication') {
    return withNavigation(`${header(page.title)}<p><strong>${escape(metadata.reviewLabel)}.</strong> This growing book currently contains ${chapters.length} chapters. It is not a completed final edition. More chapters may be added before publication.</p>${metadata.edition ? `<p>Edition: ${escape(metadata.edition)}</p>` : ''}${metadata.author ? `<p>Author: ${escape(metadata.author)}</p>` : ''}${metadata.rights ? `<p>${escape(metadata.rights)}</p>` : ''}${metadata.publisher ? `<p>Publisher: ${escape(metadata.publisher)}</p>` : ''}${metadata.isbn ? `<p>ISBN: ${escape(metadata.isbn)}</p>` : ''}<p>The illustrations and small numerical examples support the lessons, not claims about every trained model. Equations describe stated assumptions; rounded numbers and executable examples use finite precision.</p><p>The illustrated front cover belongs to this reading edition. A paperback needs a separate final cover designed for its printer, paper and page count.</p>`, page);
  }
  if (page.kind === 'contents') return withNavigation(`${header(page.title)}${contentsHtml()}${downloadsHtml()}`, page);
  let content = await readFile(`book/${page.file}`, 'utf8');
  const part = metadata.parts.find(part => part.file === page.file);
  if (part) {
    const entries = chapters.filter(chapter => part.chapters.some(entry => entry.file === chapter.file));
    content = content.replace(/<div class="chapter-cards">[\s\S]*?<\/section>/,
      `<div class="chapter-cards">${entries.map(chapter => `<a class="chapter-card" href="${chapter.file}"><img class="card-art" src="assets/${chapter.card.asset}" alt="" width="580" height="220"><div class="card-content"><span class="card-number">Chapter ${String(chapter.number).padStart(2, '0')} &nbsp; / &nbsp; ${escape(chapter.card.subject)}</span><h3>${escape(chapter.title)}</h3><p>${escape(chapter.card.description)}</p><div class="card-footer"><span>${escape(chapter.card.topics)}</span><span class="card-arrow" aria-hidden="true">&#8594;</span></div></div></a>`).join('')}</div></section>`);
    content = content.replace(/\d+ foundational chapters/, `${String(entries.length).padStart(2, '0')} foundational chapters`);
    content = content.replace(/href="linear-algebra.html"/, `href="${entries[0].file}"`);
  }
  if (page.type === 'cover') content = content.replace(/<ol class="cover-chapters">[\s\S]*?<\/ol>/, `<ol class="cover-chapters">${chapters.map(c => `<li><a href="${c.file}"><span>${c.number}</span><span>${escape(c.title)}</span></a></li>`).join('')}</ol>`);
  if (page.type === 'chapter') {
    content = content.replace(/(<h1(?: [^>]*)?>)[\s\S]*?<\/h1>/, `$1${escape(page.title)}</h1>`);
    const index = chapters.findIndex(c => c.file === page.file);
    const part = metadata.parts.find(part => part.chapters.some(entry => entry.file === page.file));
    content = content.replace(/(<p class="eyebrow">)([\s\S]*?)<\/p>/, (_, opening, text) =>
      `${opening}${text.replace(/^Part [IVXLCDM]+/, escape(part.label)).replace(/\d+\s*$/, page.number)}</p>`);
    const previous = index ? chapters[index - 1] : { file: 'foundations.html', title: 'Part I / Foundations' };
    const next = chapters[index + 1] || { file: 'glossary.html', title: 'Glossary and notation' };
    content = content.replace(/<nav class="chapter-pagination"[\s\S]*?<\/nav>/, `<nav class="chapter-pagination" aria-label="Chapter navigation"><a href="${previous.file}"><small>Previous${previous.number ? ` / Chapter ${previous.number}` : ''}</small>&#8592; ${escape(previous.title)}</a><a href="${next.file}"><small>Next${next.number ? ` / Chapter ${next.number}` : ''}</small>${escape(next.title)} &#8594;</a></nav>`);
  }
  return withNavigation(content, page);
}
