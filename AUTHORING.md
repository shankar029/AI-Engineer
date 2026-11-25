# Becoming an AI Engineer: authoring and design system

This is the house style for the whole book, not a one-off mood board. Apply it when adding a chapter, revising a worked example, or drawing a figure. The built guide at `authoring.html` is generated from this file.

## Reader and promise

Write for a software engineer who is comfortable with arithmetic and code but **does not know linear algebra or calculus**. Do not treat engineering familiarity as mathematical familiarity. Refresh algebraic manipulations when first needed, including substitution, powers, factoring, fractions, and rearranging equations. Explain mathematical function notation rather than assuming it follows from coding experience. Never equate unfamiliar notation with lack of ability. The promise is **an accurate mental model that survives contact with implementation**, not mastery through memorization.

Voice: calm, direct, curious, and precise. Address the reader as "you." Use short paragraphs, concrete verbs, and one main idea per paragraph. Explain what a mathematical object does before naming its formal properties. Do not write conversational transcripts, congratulatory filler, or unexplained walls of formulas.

Each chapter begins with a real engineering question and ends with something the reader can now explain or calculate. Distinguish an operation's mathematical purpose from claims about intelligence or human-like understanding.

## Chapter architecture

Keep the same learning sequence in every chapter:

1. **Orient.** Part, chapter number, meaningful title, one-sentence promise, prerequisites, and section count. Start with a question rather than a formula.
2. **Build intuition.** Introduce a concrete situation and name the problem. A delivery displacement, a support search, or an estimator is more useful than "consider an arbitrary vector."
3. **Make it visible.** Show an original diagram, annotated table, or computation graph. Explain what to notice in the adjoining prose and provide an equivalent text description.
4. **Introduce notation.** State the equation, define every new symbol nearby, and make its conditions explicit. Link to an earlier definition instead of silently changing conventions.
5. **Work an example.** Show inputs, intermediate calculation, output, and interpretation. A reader must be able to reproduce it with basic arithmetic.
6. **Connect to an LLM.** Name the actual operation or component. State what the example omits, and where an analogy stops being literal.
7. **Give agency.** Include a small prediction, exercise, or interactive experiment. Ask the reader to predict before acting. Supply a solution or useful guidance.
8. **Consolidate.** A compact recap connects ideas, then a short bridge introduces the next question. End with useful scope limits and previous/next navigation.

Repeat the intuition-to-application sequence for **every mathematical concept**, not just derivatives or the first section. This is a universal requirement across all seven chapters and every future chapter. A beginner-friendly introduction followed by compressed advanced formulas does not satisfy it. Assume no prior knowledge of a newly introduced mathematical concept, including trigonometry, probability, logarithms, pooling, positional rotations, or training objectives; prior-chapter links need concise prerequisite reminders at the point of use.

For each concept, provide its definition, explain every new symbol and assumption, give an intuitive or geometric interpretation where helpful, show why the operation or rule makes sense, and walk through a numerical calculation with intermediate steps. Then connect it to engineering or an LLM where appropriate and give a prediction/check with an explained answer. Related concepts can share a worked example, but a name, keyword mention, analogy, or formula alone is not teaching coverage.

Teach prerequisites before relying on them: entries and dimensions before matrix operations; sums and lengths before dot products; ordinary derivatives before partials; partials before gradients; the chain rule before backpropagation; and both before optimizer equations. Define operations such as exponentials, logarithms, normalization, averaging, and elementwise squaring before using them inside a model formula. Distinguish an operation's definition from a theorem or an implementation convention.

It is not necessary to force a figure into every paragraph. An annotated value table or a fully written coordinate calculation can supply the visual explanation. Keep advanced side topics shorter than the main path, but still include definitions and worked calculations. If a topic is only a future pointer, label it as deferred instead of presenting it as taught. Do not imply that a short numerical illustration proves a general theorem.

Do not make up a reading-time estimate. This edition uses prerequisites and section counts because people work through math at very different speeds.

Retain substantive interview breadth in a visibly labeled **Interview questions** section with a stable contents anchor. Use original prompts and explained answers, not just synthesis exercises. Maintain correspondence and any duplicate consolidation in internal auditing records, never in reader-facing commentary. Do not invent missing material. Answers should give reasoning, relevant worked steps and misconception boundaries, with concise prerequisite reminders and links to fuller lessons.

## Editorial titles and navigation

The book is **Becoming an AI Engineer**. Its distinct opening cover is `book/index.html`, with original portable artwork in `book/assets/engineering-cover.svg`; the mathematics-focused introduction and chapter cards live separately in `book/foundations.html`. Mathematics is Part I of the engineering journey, not the entire book identity. Keep the broader systems direction aspirational until those chapters exist. Preserve the cover's `#foundations` bookmark and direct chapter routes.

Use the full editorial title in the page title, chapter heading, home-page card, sidebar chapter link, and previous/next navigation. Subject labels may remain in kickers and editable HTML filenames.

- Chapter 01: **The Language of LLMs: Vectors, Matrices, and Meaning**
- Chapter 02: **How LLMs Learn: Derivatives, Gradients, and Optimization**
- Chapter 03: **From Text to Tokens: How LLMs Read Language**
- Chapter 04: **From Tokens to Meaning: How Embeddings Represent Language**
- Chapter 05: **From Inputs to Predictions: How Neural Networks Learn**
- Chapter 06: **Inside the Transformer: How Attention Builds Context**
- Chapter 07: **Attention in Action: How Models Select and Combine Context**

"Meaning" in chapter 1 refers to useful learned representations and their limits. It must not imply that individual coordinates intrinsically correspond to human-interpretable concepts.

Use stable descriptive anchors such as `#attention` or `#backpropagation`. In prose, "chapter 1" and "chapter 2" are acceptable compact references. Avoid renumbering anchors when a section moves.

## Visual identity

The theme is a **botanical engineering notebook**: warm paper, deep evergreen, precise gridded diagrams, and restrained terracotta emphasis. It should feel like a readable technical field guide rather than a dashboard or a slide deck.

| Token | Value | Role |
| --- | --- | --- |
| `--paper` | `#f8f6f0` | Main reading canvas |
| `--surface` | `#fffefa` | Worked example surfaces |
| `--ink` | `#213b35` | Primary text |
| `--muted` | `#606963` | Secondary labels and captions |
| `--dark` | `#183c35` | Cover and recap panels |
| `--green` | `#226b59` | Links, forward values, representations |
| `--green-soft` | `#eaf1e9` | Intuition and experiment background |
| `--orange` | `#ab4a2d` | Sensitivity, resultant, caution |
| `--orange-soft` | `#f7e9dd` | Assumption and limitation notes |
| `--line` | `#dedfd5` | Quiet separation, never meaning alone |

Color supports labels, arrows, line styles, and captions; it must never be the sole way to distinguish concepts. Color is contextual: a terracotta resultant in an algebra diagram is not an error. State the legend in text whenever the interpretation is not obvious.

No external font service is required. Georgia supplies editorial headings; Segoe UI and system sans-serif fallbacks carry prose and UI. KaTeX supplies locally served mathematical fonts. Use sentence case for section headings and the established editorial chapter titles.

Body: 16px with 1.75 line height on desktop; 15px with 1.8 on small screens. Desktop reading columns top out around 800px, with a persistent book rail and a separate contents rail where space permits. Large chapter headings use a serif face, close tracking, and generous surrounding whitespace. Avoid centered body text.

Spacing uses a small family: approximately 8px for inline relationships, 12-16px for related labels, 20-30px within components, 32-40px between groups, and 50-65px before major sections. Borders are thin and corners modest (4-9px). Do not add gradients, generic stock photography, or decorative illustrations that compete with the explanation.

## Reusable components

Source components are ordinary semantic HTML styled in `book/assets/style.css`. No framework or runtime templating is required.

| Component | Source pattern | Use |
| --- | --- | --- |
| Chapter opening | `header.chapter-header` | Promise, prerequisites, section count |
| Kicker | `p.eyebrow` | Part or volume orientation |
| Intuition note | `div.callout` with `p.label` | Key interpretation or prediction |
| Assumption note | `div.callout.caution` | Caveat, scope boundary, false inference |
| Numerical walk-through | `div.worked` with `p.label` | Reproducible calculation |
| Display equation | `div.equation` containing TeX | Build-time accessible math |
| Inline equation | `span.math` containing TeX | Math within a sentence |
| Symbol key | `p.symbol-key` | Define symbols immediately |
| Diagram | `figure`, `img`, `figcaption` | Original visual plus text equivalent |
| Experiment | `section.lab` | Labeled controls, textual outputs, fallback |
| Practice | `div.exercise` and `details` | Prediction followed by solution |
| Recap | `div.recap` | A few durable connections |
| Navigation | `nav.chapter-pagination` | Previous/next chapter |

Use real headings in logical order: one h1 per page, h2 for sections, h3 for subsections. A component label is a paragraph, not a heading. Do not use manual line breaks to wrap prose; a deliberate break on a cover or card is acceptable.

## Mathematical conventions

Use bold lowercase for individual vectors, uppercase for matrices, ordinary lowercase for scalar entries, and a bold theta for the full parameter collection. Use real-valued examples unless discussing another domain explicitly. Define indices, dimensions, and constraints adjacent to each equation.

An individual vector is a column. Write `[1, 2]` as an inline list for readability, and include a transpose when explicitly defining a column from a row list. Token batches use **rows**: X is token count by representation width, and `Y = XW`. Explain the orientation switch from `y = Wx`; these equations require transposed weight layouts. Omit batch/head axes only with a note.

Use a superscript transpose, not a matrix inverse, to change orientation. Use the Euclidean norm unless stated otherwise. Cosine requires nonzero vectors. Rank is an algebraic property, not the number of semantic concepts. A map with a nonzero bias is affine, even if a framework calls it linear.

Use natural logarithms for cross-entropy, a one-hot target for the introductory derivation, and a clearly stated loss reduction when batching is introduced. Squared-error examples here use `(prediction - target)^2` without a half factor. Learning rates are positive. State the coordinate metric when describing the gradient as steepest ascent.

In source HTML, TeX lives inside `.math` or `.equation`, without dollar delimiters. Escape matrix ampersands as `&amp;` to keep HTML well-formed; the builder decodes entities before KaTeX renders. Formulas must parse in strict build mode. The output includes MathML for assistive technology and HTML for visual layout, so reading does not depend on client-side equation rendering.

Avoid silently mixing equality and approximation. Calculate with full precision; round only reported results. Explain differences from rounding or first-order approximation. State domain conditions for logarithms, inverses, and derivatives.

## Diagrams and experiments

Every diagram is a separate original SVG under `book/assets/`. Use a viewBox, explicit dimensions, text labels, visible directionality, and sufficient contrast. Prefer 4-8 labeled entities to a giant flowchart. A standalone SVG need not duplicate the surrounding image alt text; the HTML image supplies its accessible description.

Graphs must match their equations. Check point coordinates, axis scales, tangent slopes, arrows, and matrix entries. Declare schematic or unequal axis scales. No cropped labels. For 2D embedding drawings, explicitly say they are illustrations, not faithful projections of a real model.

Experiments teach one variable at a time and begin with a prediction prompt. Every control has a persistent label; outputs include a text value, not just a graphic. Reset behavior must be deterministic. Bounds should reveal the intended behavior without allowing numerical overflow. Core exposition and worked values remain available without JavaScript; include a noscript interpretation.

Do not persist learner activity or transmit it. This book has no analytics, accounts, remote font loading, or third-party requests at reading time. Print styles support offline review; use Print / save PDF for a chapter, not as a claim that a combined typeset print edition exists.

## Reader-facing editorial boundary

The book must read as an original, coherent publication. Do not put private-input filenames, conversation/export history, extraction or glyph-recovery notes, source-page numbers, question correspondence, or adaptation/correction commentary into chapters, captions, interview answers, reader README, or the published guide. Publication prose must never identify or describe the private inputs used during authoring. Keep mathematically accurate explanations and useful learner caveats; explain the correct rule directly rather than discussing an erroneous input.

Keep provenance inventories, interview correspondence, missing-material limitations and extraction evidence in maintainer-only records outside `book/`, `publications/` and the publication build. The published guide contains teaching standards and maintenance instructions, not those records. Reader navigation must never link to internal auditing. Legitimate chapter-PDF downloads and format instructions are reader features and must remain.

## Accessibility and responsive behavior

Provide a skip link, visible keyboard focus, semantic landmarks, clear link names, meaningful image alt text, native expandable solutions, and labeled range inputs. Use aria-live sparingly for changing results. Decorative card art has empty alt text; substantive figures have descriptions of the relationships and values.

Keep the `no-js` class on the document until the application module initializes. Directly opening the built `dist/index.html` uses the no-JavaScript reading layout because browsers block local module imports; the theme, pre-rendered math, diagrams, and chapter navigation must still work, including on mobile. Source fragments under `book/` are not standalone reading pages.

The contents rail disappears before it squeezes the reading column. Below 640px, the sidebar becomes a button-controlled disclosure; Escape closes it and restores focus. Long equations and tables scroll locally, never the entire page. Respect reduced-motion preferences. Do not hide essential definitions behind hover. A print stylesheet removes navigation and keeps worked examples together where practical.

## Adding a chapter and reviewing it

Create `book/topic-name.html`, add the page metadata in `scripts/chapters.mjs`, add the home card and adjacent chapter links, and place original assets in `book/assets/`. The builder creates sidebar links, table-of-contents anchors, document titles, local KaTeX assets, and the guide page. Do not hand-edit `dist/`.

Before calling a chapter finished:

1. Audit the chapter's conceptual coverage in internal maintainer records. Preserve the evidence and correspondence outside the published guide.
   Distinguish fully taught concepts, bounded introductions, missing evidence and deferred implementation topics. State useful scope limits directly to readers; do not narrate the private inputs or the adaptation process. Passing build/math checks is not evidence of exhaustive conceptual coverage.
2. Recalculate every numerical example independently. Trace matrix shapes and distinguish toy illustrations from model behavior.
   Review every section for unexplained prerequisites, not only the derivative derivation. Check definitions, symbol keys, domain/shape conditions, intermediate steps, worked results, and explained practice for every introduced concept.
3. Run `npm test`. A build must reject malformed math; browser checks cover links, image loading, responsive overflow, navigation, and the interactive experiments.
4. Inspect the home page and both a formula-heavy and a diagram-heavy section at desktop and mobile widths. Check keyboard navigation and readable local equation scrolling.
5. Confirm that meaning survives without scripts. Generate and inspect each chapter's PDF companion according to the mandatory PDF delivery procedure below; a browser print-media preview alone does not count.
6. Keep the chapter, this guide, implementation, and related checks in agreement. Do not add a framework merely for a new page.
7. Generate and commit the complete ready-to-read HTML publication at `publications/html/index.html`, together with its assets and inspected PDF companions. Verify the actual publication after copying the entire `publications/` folder to a different location: no build, npm, or server is needed to read it. Check desktop/mobile navigation, math/fonts, diagrams, expanded solutions, and relative Chapter PDF downloads. File-opened reading uses the static fallback; interactive modules and the print button need HTTP.

## Committed HTML publication

### Maintainer setup and local reading

Use Node.js 20+ from the repository root:

```powershell
npm ci
npm run build
```

Open `dist/index.html` for the themed development build, not the unstyled `book/index.html` source fragment. Keep the whole `dist/` folder together if copying it; it includes assets and `pdfs/`. The public, already-built reading edition is committed at `publications/html/index.html`. README is reader-first: lead with the verified live website and chapter PDFs, not setup commands.

For interactive experiments, run `npm start` and open its printed loopback address (default `http://127.0.0.1:4173`). If occupied, set `$env:PORT=4174` in PowerShell first. `npm run dev` builds once and serves; it does not watch files. Rebuild after edits. File-opened pages retain themed math, diagrams, navigation and native expandable answers, but browser restrictions block module-based experiments and the print button; use the Chapter PDF download.

```powershell
npm run publish:html
npm run html:check
npx playwright install chromium
npm test
```

The browser suite uses its own local server at port 4175. Tests verify numerical examples, links/anchors, formula rendering, images, responsive layouts, interactions, and relocated offline publication/PDF downloads. Optional Chapter 3 Python packages/model artifacts are separate from reading or building the book.

### Publication and hosting

`npm run build` creates the ignored `dist/` development workspace. `npm run publish:html` builds and synchronizes only the reading pages, book assets, KaTeX stylesheet and local fonts into `publications/html/`. It rewrites Chapter PDF links to the existing companions one directory above, avoiding duplicate PDFs, recursive publication copies, KaTeX runtime dependencies, and review artifacts. Do not edit generated publication files manually. Keep all of `publications/` together when distributing or statically hosting this edition; a GitHub file link displays HTML source rather than hosting the website.

`npm run html:check` rebuilds and compares the complete expected file inventory and contents without rewriting publication files. `npm test` includes this freshness check and relocated, file-opened publication checks. After changing sources or this guide, refresh with `npm run publish:html` before testing. The full `npm run pdf` workflow also refreshes the committed HTML after producing the companions; source/hash changes still require PDF regeneration and the inspection below.

`.github/workflows/pages.yml` checks HTML freshness and deploys committed `publications/` with the official GitHub Pages Actions on pushes to `main` or manual dispatch. The small `publications/index.html` landing page redirects to `html/index.html`; deploying the parent folder keeps PDF links valid under the repository's Pages subpath. No private source material, dependencies, caches, screenshots, or review output belong in this artifact. Pages must use the Actions build type in repository settings; verify its returned URL, successful deployment, and actual chapter/assets/PDF HTTP responses before claiming it is live. For other hosting, either deploy all of `publications/` or the independently portable `dist/` build.

## Mandatory PDF companions and review

Every chapter delivery or substantive revision must include an **up-to-date, generated and inspected PDF companion**. This applies to all seven current chapters and every future chapter. Keep the web reading edition and PDF substantively aligned, including every exercise and interview answer; collapsed `<details>` must not hide answers in the delivered PDF. Do not treat successful HTML rendering, a print button, or an aspirational checklist as evidence that the actual PDF is correct.

Use the existing local workflow:

```powershell
npx playwright install chromium
python -m pip install -r requirements-pdf.txt
npm run pdf
npm run pdf:check
```

`scripts/chapters.mjs` is the shared source of chapter titles, HTML names and meaningful PDF names. Register a future chapter there, extend the home card/adjacent links, and follow the same pipeline. `npm run pdf` first builds the book, then uses local Chromium with `book/assets/print.css`, opens every solution, waits for local fonts and diagrams, and writes the A4 companions under `publications/`. No external conversion service is allowed. A shared Chapter PDF link is generated into each chapter's toolbar; `npm run build` copies the publication files into `dist/pdfs/` so downloads work in a portable, file-opened book.

PDF generation is incremental: a chapter's printable main content, metadata, referenced diagrams, styles, generator and dependency lockfile determine its render digest. The generator preserves an existing companion only when that digest, its recorded PDF hash, and the current complete prose/answer/figure/formula audit agree. A global source digest still detects source changes for the checker. Changes to hidden book navigation or the guide alone do not require redrawing every unchanged companion. The one-time `node scripts/pdf.mjs --adopt-existing` migration records render digests only after existing PDFs have passed `npm run pdf:check`; it refuses missing companions, hash differences or changed printable audits. It does not regenerate or repair a stale PDF.

Commit the fresh `publications/html/` edition, reasonable-sized publication PDFs, and `publications/manifest.json` beside source changes. The manifest records a source digest, each PDF's hash, expected substantive prose fragments, and answer/figure/formula counts for checks; counts are not evidence of instructional quality. `dist/`, raster page images, contact sheets and extracted audit text are reproducible, ignored output. Keep private inputs and internal auditing records out of publication artifacts. Regeneration is content/layout reproducibility, not a claim of byte identity across browser versions, fonts and metadata timestamps.

The checker verifies the **actual PDF files**: source and output freshness, title/bookmarks, expected prose (including expanded answer text), A4 size, blank pages, raw TeX, and text bounding boxes inside safe paper margins. It renders every page locally at inspection resolution and creates numbered contact sheets under `dist/pdf-review/<chapter-name>/`. A passing checker is necessary but not sufficient:

Print uses a white page canvas rather than a tinted body column ending abruptly at the printable edges. Horizontal margins are 18 mm, with unchanged body type size and individually reflowed equations where necessary. The generator checks the actual 174 mm A4 content width, including inline mathematical spans, tables, code and diagram bounds; the PDF checker verifies uncropped page boxes and glyph clearance against those side margins. The edge investigation of the preceding PDFs found roughly 15 mm physical clearance and did not reproduce missing side content. A viewer-specific cropping report still needs an example screenshot; do not claim the visual-edge repair diagnoses every viewer.

1. Inspect every contact sheet for overall completeness, consistent botanical-notebook theme, page numbering, excessive blank space, awkward page breaks and missing/oversized diagrams. Reopen suspicious pages at full resolution, rather than approving only thumbnails.
2. Read formula-heavy pages at full resolution: confirm symbols, fractions, matrices, indices and signs are rendered, legible and unclipped. Reflow an overwide derivation into steps; do not silently shrink an entire chapter or crop overflow. The generator rejects detected overwide equation/table/code blocks.
3. Check original diagrams, table headers/rows, multiline code, scope notes and the beginning/end of each chapter. Verify captions stay with diagrams and headings do not become orphaned at page bottoms. Long worked examples and answers may continue across pages; they must not lose lines or become giant unbreakable boxes.
4. Inspect expanded exercise and interview answers in the PDF, not only their HTML disclosure controls. The checker compares substantive prose fragments against extracted PDF text; manually inspect mathematical answers and diagrams that text extraction cannot fully certify.
5. Run `npm test` for the associated web behavior and download links. Regenerate and repeat checks after any content or print-layout repair. Record genuine remaining limitations; automated geometry/text checks do not prove semantic math correctness, full accessibility or human comprehension.

Ad-hoc HTTP printing temporarily expands solutions and restores their prior disclosure state afterward. File-opened readers can always use the prechecked companion download. Static PDF experiments show default/fallback explanations and results rather than promising live controls. A PDF delivery should name the actual generated files and summarize inspection findings, not claim that a test count proves readability.

PDF links must not retain `file:` URLs into the author's checkout. The generator preserves same-chapter destinations and maps cross-chapter/guide links to the repository's published PDF companions and guide. Those cross-document links need Internet access; named-destination behavior varies by PDF viewer, so retain useful chapter bookmarks as a fallback. Update the canonical repository URL in `scripts/chapters.mjs` if the publication moves.
