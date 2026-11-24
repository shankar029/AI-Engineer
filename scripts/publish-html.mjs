import { readdir, readFile, writeFile, mkdir, unlink } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { chapters } from './chapters.mjs';

const destination = join('publications', 'html');
const checkOnly = process.argv.includes('--check');
const expected = new Map();
const normalized = (file, content) => /\.(html|css|js|mjs|svg)$/.test(file) || file.endsWith('LICENSE')
  ? Buffer.from(content.toString('utf8').replaceAll('\r\n', '\n'))
  : content;
async function files(directory, prefix = '') {
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const name = join(prefix, entry.name);
    if (entry.isDirectory()) result.push(...await files(join(directory, entry.name), name));
    else if (entry.isFile()) result.push(name);
    else throw new Error(`Unsupported publication entry: ${join(directory, entry.name)}`);
  }
  return result.sort();
}

for (const file of ['index.html', ...chapters.map(chapter => chapter.file), 'authoring.html']) {
  let html = await readFile(join('dist', file), 'utf8');
  for (const chapter of chapters) {
    const pdf = await readFile(join('publications', chapter.pdf));
    if (pdf.subarray(0, 5).toString() !== '%PDF-') throw new Error(`Invalid companion: ${chapter.pdf}`);
    html = html.replaceAll(`href="pdfs/${chapter.pdf}"`, `href="../${chapter.pdf}"`);
  }
  expected.set(file, Buffer.from(html));
}
for (const file of await files(join('book', 'assets'))) {
  expected.set(join('assets', file), await readFile(join('dist', 'assets', file)));
}
expected.set(join('assets', 'katex', 'katex.min.css'), await readFile(join('dist', 'assets', 'katex', 'katex.min.css')));
expected.set(join('assets', 'katex', 'LICENSE'), await readFile(join('node_modules', 'katex', 'LICENSE')));
for (const file of await files(join('dist', 'assets', 'katex', 'fonts'))) {
  expected.set(join('assets', 'katex', 'fonts', file), await readFile(join('dist', 'assets', 'katex', 'fonts', file)));
}

await mkdir(destination, { recursive: true });
const existing = new Set(await files(destination));
const stale = [];
for (const [file, source] of expected) {
  const content = normalized(file, source);
  const path = join(destination, file);
  const matches = existing.has(file) && normalized(file, await readFile(path)).equals(content);
  existing.delete(file);
  if (matches) continue;
  stale.push(file);
  if (!checkOnly) {
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, content);
  }
}
for (const file of existing) {
  stale.push(file);
  if (!checkOnly) await unlink(join(destination, file));
}
if (checkOnly && stale.length) {
  throw new Error(`HTML publication is stale; run npm run publish:html:\n${stale.join('\n')}`);
}
console.log(`${checkOnly ? 'Verified' : 'Published'} ${expected.size} portable HTML/assets files in ${destination}; PDFs linked from the parent directory.`);
