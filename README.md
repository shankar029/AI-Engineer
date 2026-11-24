# The AI Engineer

An illustrated, intuition-first web book about the mathematics behind language models. Built with semantic HTML, CSS, small JavaScript experiments, and build-time KaTeX. No web framework, external font service, or runtime CDN.

## Read locally

**Open `dist/index.html`, not `book/index.html`.** Files under `book/` are editable HTML fragments: they do not include the page shell, theme, navigation, or rendered formulas.

To create the themed edition, use Node.js 20 or newer and run these commands from the repository root:

```powershell
npm ci
npm run build
```

Then double-click **`dist/index.html`**. Keep the entire `dist/` folder together: its relative assets include the theme, diagrams, and local mathematical fonts. All four chapters have pre-rendered formulas and accessible navigation without a server. Browsers block JavaScript module imports on `file://`, so this mode shows the no-JavaScript reading layout, including mobile chapter links and expandable exercise solutions; interactive experiments and the print button require HTTP. Use the browser's own Print command for a file-opened chapter.

For the complete interactive experience, run:

```powershell
npm start
```

Open **http://127.0.0.1:4173**. The server binds to loopback only. To change the port in PowerShell, set `$env:PORT=4174` before `npm start`. After editing sources, rebuild with `npm run build`, or use `npm run dev` to build and serve.

For static hosting, publish the contents of `dist/`. All asset and chapter links are relative, so deployment under a subdirectory works.

## Chapters and authoring

| Book content | Editable source (not the reading entry point) |
| --- | --- |
| Learning path | [book/index.html](book/index.html) |
| Chapter 01: The Language of LLMs: Vectors, Matrices, and Meaning | [book/linear-algebra.html](book/linear-algebra.html) |
| Chapter 02: How LLMs Learn: Derivatives, Gradients, and Optimization | [book/calculus.html](book/calculus.html) |
| Chapter 03: From Text to Tokens: How LLMs Read Language | [book/tokenization.html](book/tokenization.html) |
| Chapter 04: From Tokens to Meaning: How Embeddings Represent Language | [book/embeddings.html](book/embeddings.html) |
| Theme, layout, teaching sequence, notation, source coverage, and review checklist | [AUTHORING.md](AUTHORING.md) |

The build produces `dist/index.html`, `dist/linear-algebra.html`, `dist/calculus.html`, `dist/tokenization.html`, `dist/embeddings.html`, and `dist/authoring.html`. Edit the source, not the build output. The shared shell is [book/template.html](book/template.html); original figures and shared styles live in [book/assets](book/assets).

All four supplied source PDFs were fully extracted and audited; original explanations and illustrations were written for this edition. The tokenizer PDF ends mid-answer on page 79 and has some damaged multilingual glyphs. The 60-page embeddings source also develops positional encoding, learned positions, RoPE, masking, and cache implications; Chapter 4 includes those lessons. Its later embedding-model training and .NET implementation proposals remain deferred, with a bounded pooling bridge for the sentence-encoder illustration. See the guide's section-by-section coverage tables, corrections, scope limits, and each chapter's source note. The source PDFs and their transcripts are not redistributed. Chapter 3 includes optional local Python experiments, not fabricated production token counts; their external packages and model artifacts are not needed to read the book.

## Checks

```powershell
npx playwright install chromium
npm test
```

Tests independently verify the numerical examples, exercise solutions, interactive behavior, local links and anchors, formula rendering, image loading, mobile navigation, responsive overflow, and a no-JavaScript reading path. The browser suite starts and stops its own local server at port 4175.

## Chapter PDFs

Each chapter has a **Chapter PDF** download link that also works when opening the book directly from disk. The four publication companions are committed under `publications/`; `npm run build` copies them into `dist/pdfs/` for portable distribution:

| Chapter | Publication PDF |
| --- | --- |
| 01 | [The Language of LLMs](publications/01-the-language-of-llms.pdf) |
| 02 | [How LLMs Learn](publications/02-how-llms-learn.pdf) |
| 03 | [From Text to Tokens](publications/03-from-text-to-tokens.pdf) |
| 04 | [From Tokens to Meaning](publications/04-from-tokens-to-meaning.pdf) |

Regenerate and inspect these companions whenever chapter content, math, assets, print styling, or publishing rules change. Generation uses the existing local Playwright Chromium, never an external conversion service. PDF inspection requires Python 3.10+ and the local PDF tools declared here:

```powershell
python -m pip install -r requirements-pdf.txt
npm run pdf
npm run pdf:check
```

`npm run pdf` rebuilds HTML, opens every solution/interview answer, and generates A4 PDFs with local fonts, original diagrams, bookmarks, theme colors, and page numbers. `npm run pdf:check` rejects stale source/output hashes, missing substantive prose or answers, raw TeX, blank pages, and text outside safe page bounds; it rasterizes **every actual PDF page** into `dist/pdf-review/` with numbered contact sheets and extracted text. Inspect all contact sheets and the full-size formula/diagram/answer pages for page breaks, clipping, legibility, and complete explanations before delivery. Automated checks cannot replace that visual pass or establish learner comprehension.

Commit updated PDFs and `publications/manifest.json` with the source; the four companions together are only a few MB. Build output, extracted audit text, page images, and contact sheets remain ignored under `dist/`. Generation is reproducible from the sources, but Chromium metadata and platform fonts can prevent byte-identical PDFs across runs/machines. The web edition remains the interactive version; PDFs contain static examples and expanded answers, not live experiments.

Within-chapter links use PDF destinations/bookmarks. Cross-chapter PDF links target the committed companions on GitHub; coverage-guide links target `AUTHORING.md` there. They therefore need Internet access, but never point at the author's local checkout. PDF viewers vary in support for named destinations; use the destination chapter's bookmarks if a viewer opens at its first page.

The **Print / save PDF** button still supports ad-hoc printing with navigation removed and temporarily expands answers. The checked companion download is the delivery artifact, including when browser file-opening restrictions disable JavaScript.
