# Whole-book publishing workflow

`book/publication.json` is the ordered-content and metadata source. Add chapters to its part lists; keep their chapter fragments, card artwork and per-chapter PDF names. The same registry supplies numbering, navigation, contents, cards, EPUB spine and whole-book assembly. Add front/back source pages to its matter lists. Generated title, edition and contents pages do not need separate HTML fragments.

## Local review editions

Use Node and Python versions/dependencies described in `AUTHORING.md`. Run `npm ci` and `python -m pip install -r requirements-pdf.txt` on a new machine.

1. `npm run book` builds HTML, a real EPUB, complete A4 reading PDF and provisional 6-by-9-inch color interior, then refreshes portable HTML.
2. Run `node scripts/pdf.mjs --adopt-existing` only when its printable-content audits confirm existing chapter PDF bytes remain applicable. Otherwise use `npm run pdf`.
3. Set `EPUBCHECK_JAR` to the official EPUBCheck jar and optionally `JAVA_COMMAND` to Java 17 or newer. Run `npm run book:check` for container/link/content checks, actual EPUBCheck and full PDF rendering. Without the jar, the report explicitly says EPUBCheck was not run; it does not claim validation.
4. Run `npm test` and `npm run pdf:check`. Open the portable `publications/html/index.html` at narrow and desktop widths.
5. Inspect **every** sheet in `dist/book-review/digital` and `print`, then full-size dense pages. Check diagram labels at physical size, calculations, tables, code, expanded answers, running numbers, chapter breaks, contents destinations and page edges. Inspect the EPUB in representative reading software, including small-screen math, navigation and reading order. Checks do not replace reading or publisher proof approval.

For reproducible EPUB dates, set `SOURCE_DATE_EPOCH` to a chosen Unix publication timestamp. Browser PDF metadata and font rasterization can vary between tool versions; source digests and actual output hashes record each build. Keep the pinned lockfile.

Outputs are `publications/becoming-an-ai-engineer-review.epub`, `becoming-an-ai-engineer-reading-review.pdf`, `becoming-an-ai-engineer-6x9-print-review.pdf` and `book-manifest.json`. Chapter companions remain separate. Debug previews and validation evidence live in `dist/book-review`, not in the portable reader edition.

EPUB prose reflows and uses the reader's fonts. Original diagrams and equations are local SVG images, with alternative text describing fractions, powers, indices and matrix rows. This avoids reliance on JavaScript, web fonts or reader-specific TeX support. Formula text is not selectable like prose; readers differ in image zoom and table handling. Check the target readers and use the reading PDF when a wide diagram/formula is difficult to examine.

The illustrated reading cover is an EPUB/front-cover asset. The print **interior excludes it**. No spine width, bleed, back-cover legal text or press-ready wrap cover is generated.

Print diagrams get dedicated sideways pages. Their small labels are enlarged to at least 8.5 points at the actual trim; any annotation that cannot fit without overlap is carried into the adjoining text key. Format-specific SVGs are regenerated in `dist/book-review/print-assets`, leaving reader website/EPUB artwork unchanged. Narrow EPUB tables stack their labeled cells, and long algebraic chains use explicit aligned steps rather than tiny shrink-to-fit equations.

## Final-release decisions and gate

Run `npm run book:release-check`. It intentionally rejects this review edition until:

- Author name, authorized rights statement and edition metadata are supplied and approved.
- The final chapter list is approved; future systems chapters are not advertised as present.
- Printer/paper/trim/color/cover requirements are confirmed and the actual interior proof accepted.
- EPUBCheck passes with the configured real validator and full PDF/page review is repeated.

Publisher and ISBN are optional metadata: include them only when legitimate values are supplied. Do not invent copyright, licensing, acknowledgments or author biography. Metadata omissions are not a rights grant.

The current 6-by-9 dimensions, mirrored 22 mm inner/16 mm outer margins, 15 mm top/18 mm bottom and color interior are provisional defaults. Continuous Arabic page numbers start at the title page in print; all contents numbers refer to actual physical destinations. Final publisher requirements may call for different front-matter numbering, recto-only chapters, margins, embedded-font rules, accessibility/conversion formats or a separately prepared print cover. Changing specifications requires rebuilding and checking the real outputs.

Maintainer coverage records remain outside all reader exports. Committing, pushing and deployment require a separate user request.
