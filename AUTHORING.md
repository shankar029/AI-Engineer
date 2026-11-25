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
8. **Consolidate.** A compact recap connects ideas, then a short bridge introduces the next question. End with a source note and previous/next navigation.

Repeat the intuition-to-application sequence for **every mathematical concept**, not just derivatives or the first section. This is a universal requirement across all six chapters and every future chapter. A beginner-friendly introduction followed by compressed advanced formulas does not satisfy it. Assume no prior knowledge of a newly introduced mathematical concept, including trigonometry, probability, logarithms, pooling, positional rotations, or training objectives; prior-chapter links need concise prerequisite reminders at the point of use.

For each concept, provide its definition, explain every new symbol and assumption, give an intuitive or geometric interpretation where helpful, show why the operation or rule makes sense, and walk through a numerical calculation with intermediate steps. Then connect it to engineering or an LLM where appropriate and give a prediction/check with an explained answer. Related concepts can share a worked example, but a name, keyword mention, analogy, or formula alone is not teaching coverage.

Teach prerequisites before relying on them: entries and dimensions before matrix operations; sums and lengths before dot products; ordinary derivatives before partials; partials before gradients; the chain rule before backpropagation; and both before optimizer equations. Define operations such as exponentials, logarithms, normalization, averaging, and elementwise squaring before using them inside a model formula. Distinguish an operation's definition from a theorem or an implementation convention.

It is not necessary to force a figure into every paragraph. An annotated value table or a fully written coordinate calculation can supply the visual explanation. Keep advanced side topics shorter than the main path, but still include definitions and worked calculations. If a topic is only a future pointer, label it as deferred instead of presenting it as taught. Do not imply that a short numerical illustration proves a general theorem.

Do not make up a reading-time estimate. This edition uses prerequisites and section counts because people work through math at very different speeds.

When a supplied source includes interview questions, retain their substantive breadth in a visibly labeled **Interview questions** section with a stable contents anchor. Adapt prompts and answers in original prose; do not substitute a few synthesis exercises for an inventory of the source interview questions. Map every source question and page to its adapted question and beginner-friendly explained answer. Consolidate genuinely duplicate prompts transparently, preserve their distinct qualifications, and identify missing or truncated questions without inventing their text. Answers should give reasoning, relevant worked steps and misconception boundaries, with concise prerequisite reminders and links to fuller lessons.

## Editorial titles and navigation

The book is **Becoming an AI Engineer**. Its distinct opening cover is `book/index.html`, with original portable artwork in `book/assets/engineering-cover.svg`; the mathematics-focused introduction and chapter cards live separately in `book/foundations.html`. Mathematics is Part I of the engineering journey, not the entire book identity. Keep the broader systems direction aspirational until those chapters exist. Preserve the cover's `#foundations` bookmark and direct chapter routes.

Use the full editorial title in the page title, chapter heading, home-page card, sidebar chapter link, and previous/next navigation. Subject labels may remain in kickers and source filenames.

- Chapter 01: **The Language of LLMs: Vectors, Matrices, and Meaning**
- Chapter 02: **How LLMs Learn: Derivatives, Gradients, and Optimization**
- Chapter 03: **From Text to Tokens: How LLMs Read Language**
- Chapter 04: **From Tokens to Meaning: How Embeddings Represent Language**
- Chapter 05: **From Inputs to Predictions: How Neural Networks Learn**
- Chapter 06: **Inside the Transformer: How Attention Builds Context**

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

## Source material and provenance

The five supplied PDFs are exported instructional conversations, not peer-reviewed textbooks. They were treated as conceptual source notes, not as authoritative prose to reproduce. All five PDFs were fully text-extracted and their page-by-page topic sequences read. The first three sources' relevant mathematical and diagram-heavy pages were rendered for visual inspection; the embeddings source's 25 embedded illustrations were extracted and visually inspected, with the formula/table text checked against their surrounding lessons. All 49 neural-network source pages were also rendered, and its 13 embedded images inspected. The source-specific maps below distinguish what was readable, corrected, added, unavailable, or merely proposed.

| Supplied source | Pages | Used in this edition |
| --- | --- | --- |
| *Understand Linear Algebra* | 1-20 | Foundational roadmap; vectors, dot products, transformations |
| Same source | 21-43 | Dimension versus vector count; vector addition; dot product versus cosine |
| Same source | 44-84 | Linear combinations, independence, transformations, multiplication and transpose; attention shapes |
| Same source | 85-110 | Inverses, determinant, rank, information loss, low-rank adaptation |
| Same source | 111-124 | Eigenvectors, eigenvalues, PCA; SVD as a follow-on connection |
| *Learn Calculus For LLMs* | 1-29 | Intuition-first roadmap; training versus inference; brief integration context |
| Same source | 30-83 | Functions, composition, limits, continuity, derivatives |
| Same source | 84-127 | Partial derivatives, gradients, chain rule and backpropagation |
| Same source | 128-161 | Gradient descent, optimizer overview, softmax, cross-entropy and logit gradients |
| Same source | 162-179 | Second derivatives, saddles, Hessians, curvature and Newton's method |
| Same source | 180-181 | Export/download wrap-up; no additional prerequisite lesson |
| *Start LLM Tokenizers Learning* | 1-32 | Tokenization foundations, BPE, byte representation, IDs, experiments and practical implications |
| Same source | 33-48 | WordPiece, Unigram, SentencePiece, comparison experiments and model compatibility |
| Same source | 49-68 | Vocabulary architecture, memory, special tokens, padding, chat/tool formats, context and multilingual/code behavior |
| Same source | 69-79 | Developed interview questions Q1-Q16 and the readable part of Q17; page 79 physically ends mid-answer |
| *Learn Embeddings* | 1-24 | Token embeddings, table lookups, training, geometry, contextual states and retrieval |
| Same source | 25-57 | Developed position lesson: additive vectors, sinusoidal encoding, learned positions, RoPE, causal masking, cache and engineering implications |
| Same source | 58-60 | Future neural-network/embedding-model curriculum; sentence-encoder/pooling illustration receives a bounded bridge |
| *Chapter 4 Neural Networks* | 1-21 | Neural-network motivation, neuron arithmetic, activations, layers and complete forward pass |
| Same source | 22-40 | Losses, conceptual backpropagation, gradient descent, MLPs, Transformer building blocks and training/inference |
| Same source | 41-49 | Static calculator, 14 readable interview questions, seven knowledge checks, recap and future-course roadmap |

The chapters reorganize the conversation topics into five coherent chapters. They do not reproduce the source's exact lessons, quizzes, UI screenshots, illustrations, or conversational turns. All explanatory prose, numerical scenarios, and SVGs in this repository are newly authored. Source PDFs and extracted source transcripts are not redistributed in the repository.

### Coverage after the first-principles expansion

The initial edition was not exhaustive. A subsequent audit reread the full 124-page algebra extraction and 181-page calculus extraction and inspected the large embedded source illustrations. The expansion below addresses the substantive instructional gaps with original calculations, not copies of source prose. The table maps coverage, rather than claiming that every original exercise or interface was recreated.

| Source topic and pages | Chapter destination | Treatment |
| --- | --- | --- |
| Algebra 1-30: scalar/vector/matrix, coordinates, dimension, learned representations | Chapter 1 sections 1 and 3 | Arithmetic, length, entry/shape definitions and representation caveats |
| Algebra 31-39: addition, subtraction, offsets, token-plus-position addition | Chapter 1 section 1 | Head-to-tail diagram and explicit componentwise calculations; fabricated offset example clearly labeled |
| Algebra 40-48: dot/cosine, angle, projection, weighted combination | Chapter 1 sections 2 and 5 | Coordinate sums, norms, inverse-cosine calculation, geometric projection and attention-weight calculation |
| Algebra 49-68: independence/span, linear maps and geometric actions | Chapter 1 sections 3 and 6 | Pair and three-vector dependence examples; rotation/reflection/shear/scaling/projection table |
| Algebra 68-84: products, composition, dimensions and transpose | Chapter 1 sections 4-5 | Row-column arithmetic, valid/invalid shapes, rectangular transpose and all four transpose identities |
| Algebra 85-100: inverse, systems, normal equation, determinant | Chapter 1 section 6 | Non-diagonal inverse, solved linear system, least-squares normal equation, area/volume and conditioning |
| Algebra 101-110: rank calculation, information loss and low-rank adaptation | Chapter 1 section 6 | Gaussian elimination, column dependency, collapse diagram and factor-product parameter counts |
| Algebra 111-124: eigenpairs, covariance and PCA; introductory SVD pointer | Chapter 1 section 7 | Eigenvector back-substitution, covariance from centered data, variance/projection and worked rectangular SVD bridge |
| Calculus 30-51: functions, domains, growth and composition | Chapter 2 section 1 | Evaluations/table, exponential/logarithm, sigmoid domain/range and ordered composition |
| Calculus 52-83: limits, continuity, derivative definition and rules | Chapter 2 sections 1-2 | Hole/jump/corner distinctions, both-sided secants, difference-quotient derivation and step-by-step rules |
| Calculus 84-117: partials, gradient, directional change and norm | Chapter 2 section 3; vanishing/exploding in section 4 | Coordinate-wise difference checks, contour visual, directional derivative and norm scaling |
| Calculus 117-144: chain rule, backpropagation, descent and optimizers | Chapter 2 sections 4-5 | Scalar and matrix gradients, branch sums, full/SGD/mini-batch comparison, momentum, Adam bias correction, AdamW and clipping |
| Calculus 144-161: softmax, cross-entropy and sequence likelihood | Chapter 2 section 6 | Stable normalization, logit-gradient derivation, probability boundary behavior, conditional likelihood and sum/mean reductions |
| Calculus 162-179: second derivatives, Hessians and Newton's method | Chapter 2 section 7 | Mixed entries, definiteness tests and their limits, local/global example, narrow-valley calculation and scalar/matrix Newton steps |
| Calculus 23-27 and 179-181: accumulation and future roadmap | Chapter 2 section 8 | Worked rectangle-limit, definite/indefinite integral, theorem, density and expectation bridge; future-course pointers remain deferred |

**Remaining scope limits:** the source's separate vector-coefficient, matrix-transform, function-switching, derivative, surface, and curvature explorers are not all recreated as controls. Their mathematical ideas have original worked replacements; the book retains three focused interactive labs. Static PDF screenshots do not supply the original widgets' code or complete behavior. Detailed numerical SVD/QR algorithms, full Jacobian/differential-equation courses, and named Bayesian/variational/diffusion applications are outside the PDFs' developed lessons and are not supplied as new chapters here. Linked downloadable HTML/glossary artifacts mentioned in the source wrap-up were not attached and are not claimed as audited or reproduced. Repeated chat turns and export UI are intentionally excluded; substantive gaps must never be relabeled as page furniture.

One illustration region on algebra PDF page 43 renders blank in the supplied PDF itself, not just in text extraction. Its surrounding dot-product/cosine explanation is readable and covered; no unseen figure content is claimed as recovered. Equation-heavy material and other large embedded illustrations were readable enough to identify their instructional topics. This is a conceptual audit, not a claim of pixel-by-pixel reproduction.

Editorial corrections and boundaries: do not identify linear independence with semantic dissimilarity; do not imply every embedding coordinate has a fixed human meaning; distinguish affine from linear maps; do not say a zero derivative proves a minimum; explain that reverse-mode derivatives add at branches; and distinguish a frozen-weight generation pass from a training update. The original source's broad SVD and integration pointers remain compact bridges rather than fabricated full source lessons.

## Tokenization source coverage

Chapter 3, **From Text to Tokens: How LLMs Read Language**, is based on the complete 79-page *Start LLM Tokenizers Learning* PDF, not on its initial roadmap alone. All pages were extracted and read, including the interview material after the lesson summaries. The three embedded raster illustrations on pages 4, 8, and 43 were inspected separately. Pages 12, 15-18, 22, 36, 39, 42, 50-52, 54, 57-58, 60, 64, and 79 were also rendered to check vector-drawn figures, tables, equations, the interactive-calculator screenshot, and the abrupt ending. This is conceptual source coverage, not reproduction of source wording, figures, exact quizzes, or hypothetical production outputs.

The inventory and destination audit below distinguish developed lessons, editorial prerequisite additions, roadmap-only suggestions, and unavailable material. Chapter anchors identify actual teaching sections, not keyword mentions.

| Source lesson, example type, or visual concept | Chapter 3 destination | Treatment and audit result |
| --- | --- | --- |
| pp. 1-3: future LLM course roadmap and teaching approach | Opening; `#recap` | Teaching sequence retained; embeddings, neural networks, Transformers, training/inference and agents remain future-course pointers, not invented source chapters |
| pp. 4-7, 69-72 Q1-Q5: token units, word/character/subword trade-offs, reusable word variations, lexer analogy, OOV, categorical IDs | `#text-units`, `#vocabulary-contract` | Defined units and vocabulary; original maps example, comparison table, lexer limits, unseen-word exercise, ID-to-vector calculation |
| pp. 8-10, 22-24, 31-32: text-to-ID-to-embedding pipeline and token table | `#vocabulary-contract`, `#vocabulary-memory` | Original saved pipeline SVG, reversible toy ID table, row lookup and model/tokenizer training distinctions |
| pp. 11-18: initial alphabet, adjacency counts, ties, successive merges, vocabulary growth and visual merge history | `#bpe-training` | Complete original weighted map/maps/maple corpus; every initial pair, every recount, five intermediate states, deterministic tie rules, vocabulary and token-occurrence audit; original saved SVG |
| pp. 18-20, 29-31: unfamiliar words, fixed merge rules, tokenizer training versus encoding | `#three-training-jobs`, `#bpe-encoding`, `#bpe-rank-conflict` | Frozen rank-2 and rank-5 encodings of a new word; exact ID decoding; explicit missing-base-unit counterexample; separate competing-ranks example proves why longest-prefix segmentation can differ |
| pp. 20-22, 26, 30, 71-73 Q4/Q7: compression origin, bytes, 256 base values, UTF-8, multilingual coverage and regex pre-tokenization | `#text-units`, `#unknown-byte-fallback`, `#preprocessing` | Byte arithmetic, accented Unicode examples, bytes-versus-characters, coverage limits, incomplete-byte decoding, preprocessing boundaries and byte-fallback distinction |
| pp. 24-25, 53-57, 78-79: structural tokens and message/turn/handoff distinctions | `#special-tokens`, `#chat-templates`, `#tool-handoffs` | Role table, conceptual serialization, structural token count and completed conceptual distinctions; no claim to recover the cut-off model-specific example |
| pp. 25-26: local tiktoken exploration, per-token bytes, multilingual count comparisons | `#tiktoken-experiment` | Optional local Python experiment with exact Unicode escapes and byte round-trip assertions; no unmeasured named-model counts |
| pp. 27-28, 45, 59-61: context, API cost, RAG chunking/overlap, external memory | `#context-budgets`, `#rag-chunking`, `#token-cost` | Original scaled budget SVG, fit/overflow calculation, inclusive chunk positions and duplicate count, invented-rate cost calculation, explicit storage-versus-context distinction |
| pp. 29-31: BPE assessment, whiteboard explanation and recap | Section-level explained exercises; `#practice` questions 1-2 and 8 | Original questions require recounts and mechanisms rather than copying the quiz or UI |
| pp. 33-37, 73-74 Q8: WordPiece motivation, continuation markers, greedy longest matching, unknown handling | `#wordpiece` | Likelihood motivation kept distinct from under-specified original training recipe; full greedy trace and failure, plus no-backtracking counterexample |
| pp. 38-41, 74 Q9: alternative Unigram segmentations, product scores, probability estimation, candidate pruning and regularization | `#unigram` through `#unigram-training`; `#unigram-pruning` | Original normalized four-token vocabulary; all paths, products, sum, best-path table and backward trace, log arithmetic, one fractional-count estimation step, two-candidate frozen-score removal comparison, and sampling interpretation |
| pp. 41-43, 74-75 Q10-Q11: comparison table and SentencePiece/raw-text/whitespace visual | `#sentencepiece` | Framework-versus-algorithm distinction, raw-text and marker example, preprocessing caveats and corrected non-universal algorithm comparisons |
| pp. 43-45: GPT/BERT/T5 comparison code, configuration/revision pinning, model compatibility and fine-tuning | `#compare-artifacts`, `#vocabulary-memory` | Optional revision-required local comparison instructions, normalization/special-token differences, model row contract and vocabulary-change implications; no claimed downloaded measurement |
| pp. 49-53, 63-65, 75-78 Q12-Q15: embedding row visualization, shape, parameter/memory arithmetic and vocabulary trade-off | `#vocabulary-memory`; `#practice` question 5 | Original small lookup and full 64,000-by-2,048 storage calculation, bytes/MB/MiB definitions, doubling/quadrupling exercises, tied/untied output boundary |
| pp. 52-55, 66 Q1-Q2: memory-calculator screenshot, variable-length batch diagram and mask array | `#vocabulary-memory`, `#padding` | Static worked replacements, parameter scaling and exact padding overhead/masks; source calculator and controls not recreated |
| pp. 55-59, 66-67 Q3-Q4: application messages, chat serialization pipeline and tool-call flow | `#chat-templates`, `#tool-handoffs` | Original saved six-stage SVG, application/runtime responsibilities, argument/permission checks and explicit limits of control markers |
| pp. 60-61, 67 Q5: context allocation diagram, overflow behavior and memory | `#context-budgets`; `#practice` question 7 | Original proportional allocation visual and recomputed categories; reject/reduce/recount behavior, separate output limits and headroom |
| pp. 61-63: natural language/code/JSON comparison and multilingual efficiency | `#preprocessing`, `#sentencepiece`, `#corpus-efficiency`, `#real-tokenizer-lab` | Training-coverage mechanism taught with two byte-BPE artifacts on identical accented text, exact toy counts and reversible payloads; casing, identifier, punctuation, indentation/JSON and script experiment sheet; no invented production counts or efficiency-equals-comprehension claim |
| pp. 64-69: embedding bridge, positional-information caveat and future module | `#vocabulary-memory`, `#recap` | Row indexing and vector bridge taught; position mechanisms named as deferred, not a new positional-encoding course |
| pp. 69-79: interview Q1-Q17, including architecture and special tokens | All relevant teaching sections; `#practice` | Q1-Q5 foundations in sections 1-2/4, Q6-Q7 BPE in 3-4, Q8 WordPiece in 5, Q9 Unigram in 6, Q10-Q11 framework/comparison in 7, Q12-Q15 architecture in 8, Q16 and readable Q17 in 9; eight original explained synthesis exercises |

**Corrections and added prerequisites.** The source's Unigram illustration labels five values as token probabilities even though they sum to more than 1. Chapter 3 replaces that illustration with a complete normalized toy vocabulary and distinguishes token probabilities, path-product scores, conditional path probabilities, best-path decoding, and summed text likelihood. Fractional-count EM arithmetic, prefix dynamic programming, logarithmic scoring, overlapping-pair behavior, Unicode normalization, and byte fallback provide bounded explanatory bridges; they are original prerequisite/clarification additions, not claims that the PDF develops those algorithms in this depth. The source's unseen-word BPE illustration implicitly needs a base character absent from its listed vocabulary; the chapter explicitly distinguishes a new whole word from a missing base unit.

The page 8 pipeline illustration labels a generic tokenizer as greedy longest-match; that is not universally true of rank-based BPE. The page 43 illustration contrasts SentencePiece with supposedly space-dependent "standard BPE" and implies universally meaningful boundaries. The chapter retains the useful framework/raw-text distinction but corrects those implications: SentencePiece supports BPE, BPE itself need not require spaces, and learned pieces are not guaranteed linguistic units. IDs and embedding values from source artwork are not treated as production measurements.

**Unavailable, omitted, and deferred material.** The supplied PDF itself stops on page 79 in Q17, after an unfinished model-specific marker example; rendering confirms this is not merely an extraction omission. The readable distinction among sequence termination, assistant-turn completion, and tool handoff is taught, but no unseen continuation or additional interview questions are claimed. Some Devanagari examples contain replacement/missing glyphs in the source; newly specified Unicode examples replace them, without reconstructing the damaged originals. The large embedded illustrations and the vector tables/diagrams used for the audit were otherwise readable enough to identify their instructional ideas.

Repeated conversational transitions, quiz selections/scores/retry controls, QR/download furniture, and export headers are intentionally not recreated. The static source does not include runnable code for its quizzes or memory slider. Original explained exercises and storage calculations replace their instructional function; the chapter adds no new interactive control. The local tiktoken and GPT/BERT/T5 comparison ideas are retained as optional reproducible instructions, not executed or bundled production-model measurements. They require separate packages/artifacts and, for the latter, explicit revisions. Token counting in .NET, a tokenizer explorer, detailed original WordPiece vocabulary-training code, advanced Unigram implementation, and the later embeddings/Transformer/agent course are undeveloped roadmap suggestions or beyond the developed source lessons; no supplied lesson is claimed for them.

**Pedagogical review boundary.** Source coverage and numerical correctness are different from reader comprehension. The chapter's beginner-oriented review checks definition order, display notation versus literal whitespace, bytes versus IDs, tokenizer decoding versus model generation, complete algorithm traces, and explained predictions. It includes a BPE rank-versus-longest counterexample, a causal byte-fragmentation example, and additional Unigram backtracking, logarithm, fractional-count, and pruning explanations rather than relying on topic names alone. Section 6 remains the densest part: its implementation-oriented subsections are signposted after the core three-path example. The chapter teaches the developed source lessons and bounded explanatory bridges, not a full production tokenizer trainer. Automated checks and editorial review do not demonstrate that a human beginner understood it; no learner study is claimed.

## Embeddings source coverage

Chapter 4, **From Tokens to Meaning: How Embeddings Represent Language**, uses the entire 60-page *Learn Embeddings* PDF. It is not limited to the first embeddings introduction: pages 25-57 contain a second developed instructional lesson about position. All 60 pages were text-extracted and read before drafting. All 25 embedded raster illustrations were separately extracted and inspected, including pages 1, 4, 7, 9-10, 12, 15-16, 18, 26, 29-32, 34, 38, 41-42, 45, 47, 50, and 59. This records the actual inspection method; it is not a claim that every PDF page was independently rasterized.

The inventory includes row-selector and one-hot visuals, distributed-vector clusters, training/update diagrams, a cosine calculation, analogy directions, ambiguous bank senses, two architecture branches, retrieval stages, reorderings, additive vector tables, waves and heatmaps, rotation matrices and paired rotations, relative-gap scores, a causal triangle, cache implications, and the sentence-encoder/pooling diagram. Original prose, numbers, tables, and six substantive saved SVGs replace these visual concepts; a seventh SVG is decorative home-card art.

| Developed source lesson, algorithm mechanic, example type, or visual | Chapter 4 destination | Actual teaching treatment |
| --- | --- | --- |
| pp. 1-6, 21-24: IDs versus vectors, dimensions, distributed representations, illustrative model widths, introductory vector clusters | `#ids-and-lookups`, `#offsets` | Complete toy vocabulary; scalar/vector/matrix/index definitions; shape and storage calculations; coordinate-label and projection limits. No unverified named-model widths |
| p. 1 one-hot/lookup artwork; pp. 7-9, 21 Q3-Q4: table, initialization, address-based retrieval and sequence output | `#ids-and-lookups`, `#one-hot` | Four-by-three table, repeated-ID gather, equivalent selector multiplication and inner-shape reasoning; saved lookup SVG. No full Word2Vec trainer inferred from unlabeled target nodes |
| pp. 6-10, 20-22 Q5/Q10: learned values, prediction task, gradients, trainable parameter table | `#learning-vectors`, `#probability-and-loss`, `#embedding-gradient` | Original complete two-choice forward/loss/backward/update/recompute calculation; definitions of exponential/log/probability/derivative/partial/chain rule; repeated-row accumulation and inference distinction; saved update SVG |
| pp. 5, 10-12, 22 Q7: dot product, magnitudes and complete three-coordinate cosine example | `#geometry`, `#normalization-and-distance` | Every product, square, sum, square root and denominator; scale counterexample; zero-vector restriction; original Euclidean/unit-normalized ranking bridge; no similarity-as-truth claim |
| pp. 1 and 12-13: analogy offsets and vector directions | `#offsets` | Constructed displacement and candidate-distance arithmetic; original equal-scale SVG; empirical/bias caveats instead of asserting a semantic law |
| pp. 13-16, 20, 22-23: same bank ID versus context-dependent state; text-to-model overview | `#contextual-states`, `#engineering`, `#recap` | Explicit shared input row and two fully calculated toy context mixtures; table of representation granularities; full pipeline roles, with omitted Transformer components clearly named |
| pp. 17-19, 21-22 Q8: chunking, compatible query/passage encoding, storage/metadata, compare/rank/select, context for RAG | `#text-vectors-and-search`, `#retrieval`, `#practical-contract` | Original three-passage cosine ranking, top-k trace, stored-text versus vectors, permission/currentness checks and saved two-path retrieval SVG; bounded hybrid/approximation/evaluation reminders |
| p. 59 sentence-encoder illustration; pp. 58-60 distinction between token layers and separate text encoders | `#pooling`, `#text-vectors-and-search` | Editorial prerequisite bridge: explicit hidden-state mean, padding exclusion and normalization arithmetic; no claim that arbitrary pooling creates a trained retrieval model or that diagram module labels specify actual layers |
| pp. 25-27, 29-30, 47, 52-53 Q1/Q12: reordered words/events and full-attention symmetry | `#order` | Original symmetric mixer trace; define permutation, equivariance versus invariance; explain moved query/key/value relationships and causal-mask exception. Source's identical-output shorthand corrected |
| pp. 27-29, 38-39, 47-48: token and position lookups, componentwise addition and pseudocode branches | `#additive-position`, `#learned-position`, `#rotary` | Same token at two positions, every coordinate sum and unchanged width; two distinct row addresses; additive versus query/key rotation location |
| pp. 30-36, 52 Q3-Q5: sine/cosine waves, frequencies, indexed original formula, four-coordinate position-2 calculation and heatmaps | `#angles`, `#sinusoidal` | Unit circle, degrees/radians, function values, period/phase, pair indices, fractional powers, every rate/angle/coordinate; numerical position table replaces heatmap; original circle SVG |
| p. 36: systematic relative-position transformation and calculable positions beyond training | `#sinusoidal-offset` | Derived offset-coordinate rules and complete p=1 to p=2 check; calculability distinguished from learned longer-context performance |
| pp. 36-39, 46, 52: learned position table, backpropagation, support length, extension/interpolation | `#learned-position` | Independent table shape/address, two-input addition sensitivities and row updates; valid index range, storage, midpoint interpolation illustration rather than an unverified extension recipe |
| pp. 40-45, 48-49, 52-53 Q6-Q8: Q/K/V roles, two-dimensional rotation, RoPE pairwise implementation and placement | `#queries-keys-values`, `#rotation-matrix`, `#rope-pairs` | Original three explicit projection products, axis-based rotation derivation, quarter-turn arithmetic, all four query coordinates at two rates, row/column and pairing conventions; values bypass rotation in saved SVG |
| pp. 31, 43-45: rotated query/key dot and signed relative gap; longer-context caveat | `#relative-rotation`, `#engineering` | Transpose/rotation-composition reasoning plus exact same-gap and changed-gap calculations with clearly nondefault toy rate; distinguish content contribution from relative rotation factor |
| pp. 49-50, 53-55 Q9: position versus causal masking, allowed-prefix triangle | `#causal-mask`, `#masked-attention` | Query/key access table, complete scaled-dot/masked-softmax/value mixture, blocked-score limit interpretation, padding distinction and all-blocked failure condition |
| pp. 50-53 Q10-Q11: context window, fine-tuning/inference configuration, KV cache and context extension | `#engineering`, `#cache`, `#practical-contract` | Cache reuse and double-rotation/reset counterexamples; hypothetical cache storage arithmetic; phase-scaling illustration, checkpoint contract and bounded extension caveats |
| pp. 19-24 and 52-57: two quizzes, interviews, whiteboard flows and recaps | Section-level predictions; `#practice`, `#interview-questions`, `#recap` | Original synthesis exercises remain; an explicit interview section maps every numbered interview question as inventoried below. Explained answers replace copied UI selections or interview wording |

**Interview-question correspondence.** The actual PDF interview pages were re-extracted and re-read for this revision: p. 21 contains embedding Q1-Q4; p. 22 contains Q5-Q10; p. 52 contains position Q1-Q6; p. 53 contains Q7-Q12 and the continuation of Q6's answer. That is **22 numbered source questions**, adapted into **21 explained chapter questions**. Position Q1 and Q12 overlap on the need for an order mechanism and share adapted question 11; their full-attention/causal-mask qualifications are explicitly preserved and corrected. Embedding Q3/Q4 (stored table versus lookup operation), Q5/Q10 (learning versus parameter status), and position Q2/Q5 (terminology versus mechanism comparison) remain separate because their requested explanations differ. The counts exclude separate quizzes, whiteboard prompts, repeated transitions, and export furniture.

| Source question and page | Substantive intent, paraphrased | Adapted question and answer anchor |
| --- | --- | --- |
| Embedding Q1, p. 21 | Define embeddings | 01: `#interview-representation` |
| Embedding Q2, p. 21 | Why IDs alone are not meaning vectors | 02: `#interview-token-ids` |
| Embedding Q3, p. 21 | Embedding matrix and dimensions | 03: `#interview-table` |
| Embedding Q4, p. 21 | Embedding-layer lookup mechanics | 04: `#interview-lookup` |
| Embedding Q5, p. 22 | Initialization and learning | 05: `#interview-training` |
| Embedding Q6, p. 22 | Token versus contextual representations | 06: `#interview-context` |
| Embedding Q7, p. 22 | Cosine similarity and its use | 07: `#interview-cosine` |
| Embedding Q8, p. 22 | Embeddings in RAG | 08: `#interview-rag` |
| Embedding Q9, p. 22 | Width and engineering tradeoffs | 09: `#interview-width` |
| Embedding Q10, p. 22 | Embeddings versus model weights | 10: `#interview-weights` |
| Position Q1, p. 52 | Why position information is needed | 11: `#interview-order` (combined with Q12) |
| Position Q2, p. 52 | Encoding versus embedding terminology | 12: `#interview-position-terms` |
| Position Q3, p. 52 | Sinusoidal generation | 13: `#interview-sinusoidal` |
| Position Q4, p. 52 | Why use both sine and cosine | 14: `#interview-sine-cosine` |
| Position Q5, p. 52 | Learned versus sinusoidal positions | 15: `#interview-position-learning` |
| Position Q6, pp. 52-53 | Define RoPE | 16: `#interview-rope` |
| Position Q7, p. 53 | RoPE's placement, not direct token-table rotation | 17: `#interview-rope-placement` |
| Position Q8, p. 53 | Relative-position benefit | 18: `#interview-relative-position` |
| Position Q9, p. 53 | Position handling versus causal masking | 19: `#interview-mask` |
| Position Q10, p. 53 | Limits of context extension | 20: `#interview-context-limit` |
| Position Q11, p. 53 | Position-dependent keys and KV reuse | 21: `#interview-cache` |
| Position Q12, p. 53 | Order without position/order mechanisms | 11: `#interview-order` (combined with Q1) |

All 22 numbered interview prompts and their answers are readable; none is inferred from missing or truncated text. Q6's page break is a continuation, not an absent answer. The p. 21 table-shape formula has flattened extraction layout, but its V/d definitions and the developed lookup lesson supply the shape unambiguously. The figure-label recovery limitations below remain unchanged. The adapted answers use original examples and local lesson links, retain the existing synthesis exercises, and explicitly distinguish parameters from activations, cosine from confidence, full-attention equivariance from causal connectivity, and calculable positions from tested context quality. A separate answer-by-answer review checked those boundaries and numerical steps; this is not evidence of a human learning outcome.

**Illustration corrections and recovery limits.** All developed text lessons were readable; the PDF ends with a complete planning discussion, not an abruptly cut-off lesson. Some equation layout was flattened during extraction, but the surrounding definitions and calculations identified the intended formulas. The p. 30 small wave graphic has clipped/right-edge labels, and the p. 34 heatmap has malformed axis labels and reversed fast/slow dimension captions. Exact missing labels are not claimed recovered; surrounding pp. 33-36 supply the readable formula and frequency lesson. The chapter replaces these with indexed numerical values and explicit rate definitions.

The p. 9 lookup picture's IDs, padding row, and copied output values do not consistently agree. The p. 15 bank artwork suggests separate sense-specific vocabulary entries despite the text's shared initial row. The p. 45 overview labels its input as a token vector even though the developed RoPE text applies rotations to Q/K. The p. 47 position-free panel implies identical rather than correspondingly permuted outputs; a causal decoder also needs a narrower statement than unmasked full-attention equivariance. These images are not treated as implementation specifications. Corrected original examples preserve their instructional intent without copying the contradictions. The sentence-encoder illustration's fixed 768 width and module-as-layer labels are not universal architecture facts.

**Added prerequisites, omissions, and deferred topics.** One-hot selector arithmetic, the fully traced tiny prediction objective/gradient, unit normalization and distance equivalence, mean pooling with padding, attention projection/normalization arithmetic, explicit relative-rotation reasoning, and cache failure examples are original bounded scaffolding. The PDF often mentions these mechanisms without those intermediate steps; their added depth is not falsely attributed to source demonstrations. Training this toy predictor does not teach standalone semantic-embedding training.

The developed lessons are mapped above. Static quiz, row-highlighter, wave/heatmap, and architecture screenshots supply no executable widget implementation; original static diagrams, complete calculations, and native explained solutions replace their teaching function. Repeated conversation transitions, QR/download/promotional and export furniture, quiz scores/retry controls, and source numbering are excluded. No separately linked artifacts or runnable widget resources were attached or audited; source-only graphics remain outside the repository.

Pages 57-60 propose neural-network/activation/Transformer-block courses and a dedicated embedding-model course (Word2Vec CBOW/Skip-gram, GloVe, BERT/Sentence Transformers, contrastive objectives and positive/negative pairs, bi-/cross-encoders, model quality/training, recommendations, and .NET/API/vector-database implementation). They are roadmap-only, not developed lessons to fabricate. The p. 59 pooling visual gets the limited explanatory bridge described above. Detailed RoPE scaling/interpolation algorithms, production KV-cache code, and authenticated semantic-search implementations are likewise future work; the developed placement, arithmetic, and engineering caveats are taught here.

**Pedagogical review boundary.** A separate full-chapter beginner pass followed drafting, checking each definition and dependency rather than merely searching keywords or counting formulas. It checked token/position indices, dense versus one-hot shape, objective-driven updates, shared-row gradients, nonsemantic coordinate labels, normalization domains, context versus stored weights, pooling versus a trained encoder, equivariance versus identical output, angle units/pair order, relative-gap signs, mask timing, and cached rotations. Repairs added an explicit coordinate definition, a two-sided numerical loss-slope check, shared-gradient and loss-reduction arithmetic, causal-compatible bank contexts, radius/arc prerequisites, the axis decomposition before sinusoidal shift equations, zero/half-power reasoning, rotation-square cancellation, and a transpose/composition calculation. Sections 9 and 11 remain demanding and should be worked with the preceding circle lesson rather than skimmed. Source coverage, arithmetic tests, layout checks, and editorial reasoning cannot prove human comprehension; no learner study or production embedding benchmark is claimed.

The destination-book visual pass also moved long calculations into locally scrollable display blocks, added wrap opportunities between long vector coordinates, stacked the central sinusoidal definitions, and checked every original diagram's labels and direction arrows. Those changes preserve readable 320px layouts and expanded solutions without shrinking all mathematical content or hiding horizontal overflow. The four-chapter edition remains portable under `dist/`; no new chapter-specific JavaScript or server-dependent lesson is required.

## Neural networks source coverage

Chapter 5, **From Inputs to Predictions: How Neural Networks Learn**, uses the entire 49-page *Chapter 4 Neural Networks* PDF. The filename's source numbering is not our book numbering. Every page was text-extracted and read, all 49 pages rendered and reviewed in numbered contact sheets, and all 13 embedded images inspected separately. Full-size source pages 21, 37, and 42-44 additionally verified the output calculation, normalization formula, and interview boundaries. The readable PDF ends with a complete roadmap on page 49, not a truncated lesson.

The visual inventory includes a layered network, a weighted-neuron schematic, sigmoid and tanh curves, a dense-layer diagram, a stylized loss valley, a backward-network picture, a descent plot, an MLP diagram, an unrolled RNN, a paper-header image, a decoder-block overview, and a residual comparison. ReLU, layer-stage and training-loop diagrams, arithmetic tables, and the calculator/assessment are also present as vector/text layout. Six original substantive SVGs and one decorative card replace their instructional/entry-point roles; no source image or screenshot is redistributed.

| Developed lesson, algorithm/calculation type, or visual | Actual Chapter 5 destination | Teaching treatment |
| --- | --- | --- |
| pp. 1-4: prerequisites, rules versus example-driven learning, neural-network function and neuron stages | `#learned-functions`, `#neuron` | Original support-effort scenario; evaluate an explicit function; define parameters/activations/hyperparameters; compare rule selection with training |
| pp. 5-9, 13-15: connected units, numeric inputs, dot product, weights, bias and full neuron arithmetic | `#neuron`, `#forward-pass` | Original products/sum/bias/activation trace and saved neuron SVG; negative-weight and zero-input examples; affine-versus-linear distinction |
| pp. 9-13: need for nonlinearity, ReLU threshold/curve/table, sigmoid and tanh formulas/ranges, GELU gate, softmax comparison | `#activations`, `#relu`, `#sigmoid-tanh`, `#gelu`, `#softmax-loss` | Collapse two affine layers algebraically; non-affine hinge counterexample; reproduce all four activation table rows; exponential/reciprocal prerequisites; normal-CDF gate definition and numerical table values; vector softmax distinguished from scalar activations |
| pp. 14-18: input/hidden/output layers, three-input/two-neuron weight matrix, elementwise activation and shapes | `#forward-pass`, `#row-batches` | Define row/column/index/transpose conventions before products; compute a full original two-by-two layer and a rectangular two-by-three exercise; count weights/biases; two-row broadcasting trace |
| pp. 19-21: complete two-layer forward calculation and prediction-before-output-activation boundary | `#forward-pass` | Original nine-parameter network with every intermediate value; identity output and unconstrained-score warning; saved network SVG. Source's printed result 1.98 is arithmetically correct and is not falsely labeled an error |
| pp. 22-25: MSE, one-example square, categorical next-token probabilities and cross-entropy | `#losses`, `#squared-error`, `#softmax-loss` | Error/square/mean/sum definitions; full loss ledger; original three-choice exponentiate/sum/divide/log example; target dependence and stable shifted scores; valid-position reduction caveat |
| pp. 25-27: chain rule, backward sensitivities, gradient signs and gradient-versus-update distinction | `#backpropagation`, `#local-rules`, `#branch-sums` | Original complete nine-parameter reverse pass, square-derivative reasoning, local product/sum rules, branch sums and finite-difference checks; saved backward SVG. Source supplies the concept, not this fully traced algorithm |
| pp. 27-29: scalar gradient descent update, four-stage training loop, Adam/AdamW pointer | `#parameter-update` | All nine simultaneous old-gradient updates and full new forward/loss calculation; oversized-step counterexample; batch mean/sum arithmetic; clear-gradient/recompute pseudocode; link to previously developed Adam/AdamW lesson |
| pp. 30-31: multi-layer perceptron and feed-forward composition | `#mlp-ffn` | Define depth/counting and stage notation; complete width-two-to-three-to-two FFN on two token rows; shared-weight parameter count and separate row exercise; saved token-wise SVG |
| pp. 31-32: sequence relationships, RNN/LSTM limits, Transformer training parallelism and 2017 paper | `#sequence-attention`, `#recurrence` | Original three-step scalar recurrence and fourth-step exercise expose dependence/fading without claiming a full RNN/LSTM lesson; link original paper; distinguish within-layer training parallelism from autoregressive generation |
| pp. 33-35: embedding/position role, attention context mixtures and head-specific projections | `#attention-mixture`, `#multiple-heads`, `#llm-pipeline` | Refresh prior embedding/QKV/position lessons at point of use; original scalar scores, masked renormalization, weighted values, two-head concatenation and output product; head-role and causal/full-attention symmetry caveats |
| p. 36: FFN expansion, nonlinearity, contraction and position-wise parameter sharing | `#mlp-ffn`, `#interview-ffn` | Full matrix entries/products/output shapes, parameter count, two complete row traces and original figure; no unsupported fixed production expansion ratio |
| pp. 36-37: residual addition and gradient-flow purpose | `#residuals`, `#interview-residual` | Coordinate addition, shape condition, direct/branch sensitivity sum, cancellation counterexample; original skip-path SVG |
| pp. 37-38: LayerNorm expression, mean, variance, learned scale/shift and epsilon | `#layer-normalization`, `#interview-normalization` | Define statistics before formula; every deviation/square/division/square root/scale/shift calculation; constant-row stability and shifted-row exercise; within-token axis and learned parameter count |
| pp. 38-40: vocabulary-sized logits, softmax, next-token choice, decoder pipeline and implementation variation | `#output-projection`, `#llm-pipeline`, `#training-inference` | Original two-to-three output projection; greedy/sampling interval example; N-by-V row shapes; explicitly pre-normalized block diagram and pre/post order counterexample; fixed parameters versus changing context/cache |
| pp. 41-42: static neuron calculator and four experiments (negative sum, bias, activation choice, zero weights) | `#practice-neuron`; section 2 and 3 exercises | Complete original negative/positive/constant calculation with ReLU/sigmoid/tanh answers, not copied controls or an unprovided executable widget |
| pp. 42-44: 14 numbered interviews | `#interview-questions` and the one-to-one table below | All prompts readable; original explained answers preserve every intent and include arithmetic, boundaries and links to fuller lessons |
| pp. 44-46: seven knowledge checks on weights, nonlinearity, forward, backward, optimizer, FFN and fixed inference weights | `#practice-block`, section-level predictions; interview 01-03, 05-08, 10, 13 | Mechanism-based explanations replace multiple-choice selections/scores; no claim that the exported 7/7 score demonstrates this edition's reader comprehension |
| pp. 47-49: recap and future sequence | `#recap`, `#llm-pipeline` scope boundary | Recap ties representations, forward/loss/backward/update and block components together; subsequent architecture families, full attention/head algebra and modern block internals remain deferred |

**Interview correspondence: 14 source questions, 14 adapted questions.** Source Q1-Q3 appear on p. 42; Q4-Q11 on p. 43; Q12-Q14 on p. 44. All question text and answers are readable. No duplicate consolidation or unreadable-question reconstruction was needed.

| Source question / page | Substantive intent, paraphrased | Adapted question / answer anchor |
| --- | --- | --- |
| Q1 / p. 42 | Artificial-neuron definition | 01 / `#interview-neuron` |
| Q2 / p. 42 | Weight versus bias | 02 / `#interview-weight-bias` |
| Q3 / p. 42 | Need for nonlinear activation | 03 / `#interview-nonlinearity` |
| Q4 / p. 43 | Parameter versus hyperparameter | 04 / `#interview-configuration` |
| Q5 / p. 43 | Forward propagation | 05 / `#interview-forward` |
| Q6 / p. 43 | Backpropagation | 06 / `#interview-backward` |
| Q7 / p. 43 | Gradient descent | 07 / `#interview-descent` |
| Q8 / p. 43 | Backpropagation versus descent | 08 / `#interview-backprop-optimizer` |
| Q9 / p. 43 | MLP definition | 09 / `#interview-mlp` |
| Q10 / p. 43 | MLP/FFN role in Transformers | 10 / `#interview-ffn` |
| Q11 / p. 43 | Residual connection | 11 / `#interview-residual` |
| Q12 / p. 44 | Layer normalization | 12 / `#interview-normalization` |
| Q13 / p. 44 | Training versus inference | 13 / `#interview-training-inference` |
| Q14 / p. 44 | Transformer versus RNN position parallelism | 14 / `#interview-parallelism` |

**Recovery, corrections and caveats.** The source's extracted matrices lose row layout; actual rendered rows on pp. 17 and 19-21 identify the column-vector convention. The string resembling "1.982" in extraction is the correct displayed 1.98 followed by the subscript 2, not an arithmetic error. The residual image on p. 37 is vertically cropped in the page layout; the separately inspected embedded image reveals the skip path, though its lower line also meets its image boundary. The adjoining formula and explanation are readable. Sigmoid/tanh graph images are readable; endpoint range labels are interpreted as limiting values, not finite-input attainments. No invisible continuation of a clipped figure is claimed recovered.

We correct the source's "all linear layers" shorthand to affine composition when biases are nonzero; distinguish a raw score from a pass probability; avoid reading weight magnitude as context-free importance; state GELU's bounded negative side rather than an indiscriminately unbounded range; and interpret a zero gradient as no first-order change, not a neighborhood or minimum claim. The source's decoder image uses a specific illustrative layer count and tied output embedding; neither is universal. Its pre/post-normalization and modern-model caveats become an explicit convention with an order calculation. Source chapter references are replaced by our actual prerequisite links. LayerNorm's gamma/beta are feature-wise vectors, not unspecified global scalars; its variance reduction and epsilon placement are explicit.

**Original prerequisite depth and deferred material.** The complete reverse pass, all-parameter update/re-evaluation, finite differences, shared-input sums, vanishing/exploding product examples, row-batch transpose, zero-gradient/ReLU-corner caveats, stable softmax, masked mixture, head concatenation, residual sensitivity/cancellation and full LayerNorm ledger are editorial additions serving the source's developed concepts. The source does not provide these intermediate demonstrations. GELU uses a defined standard-normal gate with table/library values; a numerical normal-CDF integration algorithm and GELU derivative are not claimed taught. Full recurrent/LSTM gates, a complete attention implementation, LayerNorm backward algebra, AdamW rederivation and production benchmarks are not fabricated.

The source explicitly proposes future architecture-family, attention, multi-head and modern-block courses on pp. 48-49. Its RMSNorm, gated FFN and alternative placement references on p. 40 are brief architecture-variation pointers, not completed algorithms. They stay labeled deferred, while its developed FFN/residual/LayerNorm lessons receive numerical teaching here. No additional chapter, runnable source calculator, quiz code, authenticated API experiment, or linked download was attached. Repeated chat turns, headers, QR/app promotion, score/retry controls and roadmap numbering are export furniture, not missing scientific content.

**Separate pedagogical review boundary.** After the complete draft, a separate opening-to-recap pass reread every lesson and all 14 answers as a beginner's dependency sequence, rather than only searching for topic names. It traced pre-activation versus output, function application versus multiplication, feature versus token indices, row/column weight orientation, elementwise versus vector-coupled activations, probability domains, old-state derivative consistency, branch sums, parameter sharing versus occurrences, normalization axes and pre/post ordering. Concrete repairs expanded the negative-input sigmoid/tanh calculations, reciprocal-log reasoning, all four square-expansion terms before the derivative limit, the CDF gate's visible probability table and prerequisite link, the nonnegative-square-root definition, and sampling's uniform/endpoint/interval-length explanation. Sections 6 and 11 remain deliberate pencil-and-paper lessons, not skim-friendly introductions. Source/arithmetic/layout checks and editorial reasoning do not demonstrate learner comprehension or production model quality; no learner study is claimed.

**Destination and print repairs.** The actual file-opened book was exercised at 320, 375 and 1440 pixels with all 29 solutions/answers open and locally rendered math. Five long inline calculations initially caused 320px page overflow; they were reflowed into stepped display equations, not hidden or globally shrunk. The PDF pass renders every actual page and checks expanded prose against the generation manifest. Visual review moved two decoder-diagram labels off their arrows. This chapter's exercises, interview prompt/answer groups, calculation boxes, and short tables stay together in print where they fit a page; this prevents stranded captions and a backward-step explanation separating from all its equations. Longer surrounding lessons can still continue across pages. These are concrete layout improvements, not evidence that every beginner will understand the mathematics. The companion and manifest are generated by the existing local pipeline; all five named publication files remain available.

## Transformer source coverage

Chapter 6, **Inside the Transformer: How Attention Builds Context**, uses the entire 54-page *Transformer Architecture Deep Dive* PDF. Its source numbering is Chapter 5, not our book numbering. Every page was extracted and read; all 54 pages were rendered and reviewed in five numbered contact sheets. All 13 embedded images were extracted and inspected, with full-size pages 4, 15, 20, 39, 41 and 52 checking arrows, normalization conventions, the malformed head picture, KV sharing, optional shared experts and the contradictory head-width answer. The PDF ends with a complete roadmap, not a truncated developed lesson. Private source/extraction/review artifacts are not redistributed.

The visual inventory includes the 2017 paper header, original encoder-decoder topology, encoder-only and decoder-only paths, a small encoder-decoder overview, two decoder-stack pictures with different normalization placements, an attention interior, a malformed head-projection picture, MHA and GQA diagrams, a routed-plus-shared-expert diagram, and a tied-embedding Post-Norm whiteboard figure. Text/vector layouts additionally depict token context, embedding lookup, encoder/decoder stages, the causal triangle, residual fork/add, pre/post ordering, complete block/shape flow and generation. Seven original substantive SVGs and one decorative chapter card replace these roles without copying source illustrations or vendor logos.

| Developed source topic, algorithm/example type or diagram | Actual chapter destination | Treatment |
| --- | --- | --- |
| pp. 1-4: sequence processing, recurrence, distant reference and attention as representation mixture | `#architecture-families` | Original recurrence with every step; direct versus chained dependency; diagram and limits of grammatical analogy |
| pp. 4-8: encoder, decoder, causal target/cross source paths, original six-layer example, three model families and next-token objective | `#architecture-families`, `#cross-attention` | Original three-path overview; source/target lengths, structural repetition versus tied weights; useful tasks without claiming all models use one topology |
| pp. 8-12: tokenizer/lookup, vocabulary and hidden widths, learned table and computed rows | `#tensor-contract`, `#input-and-position` | Explicit axis/index and row/column reminders; original three-row vocabulary, two lookups and componentwise additions |
| pp. 12-13 and 40: position information, additive positions, query/key RoPE and relative rotation | `#input-and-position` | Prior-chapter reminder, original moved-token addition and quarter-turn dot calculations; causal connectivity distinguished from full-attention equivariance |
| pp. 13-15 and 28-29: stacked same-width blocks and modern pre-normalized decoder flow | `#residual-and-order`, `#complete-block` | Focused original block and complete numerical forward trace; two distinct norm parameter sets, two derived heads and output projection |
| pp. 15-18: Q/K/V roles and projections; dot scores, square-root scaling, row softmax and weighted values | `#attention-projections`, `#scaled-masked-attention`, `#scaling-reason` | All six original scalar projections, all four scores, nontrivial width-two divisor, stable shifted softmax, two-coordinate value mixture; stated scale assumptions and saturation sensitivity |
| pp. 19-21: multiple learned perspectives, independent heads, equal widths, concatenation and output projection | `#multiple-heads` | Derive both heads rather than stipulate their results; every combined coordinate; explicit head reshaping/axis order; no permanent semantic-head labels |
| pp. 21-23: lower triangle, additive zero/negative-infinity mask, no future-target leakage | `#scaled-masked-attention`, `#training-and-inference` | Access and weight tables, before-normalization exclusion, all-blocked caveat, padding distinction, current input versus next target |
| pp. 23-25: FFN/MLP, expansion/contraction, nonlinearity, attention versus feature transformation; activation names | `#feed-forward`, `#gated-ffn` | Full two-to-three-to-two row products, ReLU and shared parameters; defined prior GELU gate reminder; bounded original SwiGLU recognition calculation, not a source-developed derivative course |
| pp. 25-28: residuals, gradient route, LayerNorm statistics/scale/shift, pre/post placement and RMSNorm recognition | `#normalization`, `#rmsnorm`, `#residual-and-order` | Complete mean/deviation/square/variance/root/output ledgers; constant/shifted rows; RMS calculation; residual sensitivity/cancellation and numerical order counterexample |
| pp. 29-32: final norm, LM head, logits, vocabulary softmax, greedy/sampling; filtering/temperature named | `#complete-block`, `#language-head` | End-to-end final normalization/projection and approximate probabilities with epsilon retained; sampling interval and stopping boundary; top-k/top-p/temperature explicitly deferred algorithm details |
| pp. 32-34: known shifted targets, loss/backward/update, repeated inference and basic cache reuse | `#training-and-inference`, `#kv-cache` | Original label alignment, cross-entropy/one-hot/logit-gradient/bias update, mean reduction and separate fixed-weight generation; exact cached attention result |
| pp. 35-38: batch/sequence/head/coordinate axes, square score table, joined/FFN/logit shapes | `#shapes-and-cache`, `#multiple-heads` | Original full shape ledger, scalar counts, valid causal pairs, quadratic versus linear growth; last-position generation versus all-position training |
| pp. 38-40: MHA/GQA/MQA sharing and KV cache tradeoffs | `#grouped-queries` | Four distinct toy query outputs with two KV groups, original sharing SVG, complete 192/96/48-byte payload arithmetic with assumptions and exclusions |
| pp. 40-42: MoE router/selected experts, capacity versus active work, shared-expert image variation, load/communication costs | `#mixture-of-experts` | Three router logits, top-two selection/renormalization and both output coordinates; simplified affine experts explicitly labeled; stored-versus-active counts and optional shared branch |
| p. 42: FlashAttention, exact IO-aware tiling and memory traffic | `#flash-attention` | Define IO/tile/accumulators and show two-tile stable-normalizer arithmetic equal to earlier attention; source supplies the concept, not the added numerical algorithm bridge or a GPU kernel |
| pp. 43-44: application/API and inference responsibilities, message/control/security boundaries | `#application-boundary` | Two-lane table, original token reservation arithmetic, explicit authorization/provenance boundary; no claimed provider implementation or benchmark |
| pp. 44-46: whiteboard route and component recap | `#complete-block`, `#recap` | Original traced route and durable recap; no copy of tied-embedding Post-Norm source figure |
| pp. 46-50: 20 numbered interviews | `#interview-questions` and table below | All 20 adapted prompts have explained answers and prerequisite/lesson links; one-to-one, no consolidation |
| pp. 50-52: six quiz intents and five architecture exercises | Section-level exercises; `#practice-architecture` | Preserve attention, mask, concatenation, FFN, LM-head, GQA, head division, square growth and depth-not-quality intents with original reasoning, not a screenshot widget |
| pp. 53-54: proposed future attention/training/inference chapters | `#application-boundary`, `#recap` and source note | Roadmap, not invented full Transformer backward, data/pretraining, quantization, TTFT/ITL or GPU-serving lessons |

**Interview correspondence: 20 source questions, 20 adapted questions.** Every numbered prompt and supplied answer is readable. Q1, Q6, Q13 and Q19 cross page boundaries; those are continuations, not truncation. Similar components occur in different requested explanations, so none was collapsed into a synthesis question.

| Source question / pages | Substantive intent in original wording here | Adapted answer anchor |
| --- | --- | --- |
| Q1 / pp. 46-47 | Define the attention-based sequence architecture | `#interview-transformer` |
| Q2 / p. 47 | Original components versus decoder-only components | `#interview-components` |
| Q3 / p. 47 | Training parallelism, dependency paths and scaling versus recurrence | `#interview-recurrence` |
| Q4 / p. 47 | Encoder-only/decoder-only/encoder-decoder | `#interview-families` |
| Q5 / p. 47 | Repeated block unit | `#interview-block` |
| Q6 / pp. 47-48 | Self-attention mechanism | `#interview-self-attention` |
| Q7 / p. 48 | Separate Q versus K/V sequence origins | `#interview-cross-attention` |
| Q8 / p. 48 | Head-specific comparisons and output combination | `#interview-heads` |
| Q9 / p. 48 | Square-root score scaling | `#interview-scaling` |
| Q10 / p. 48 | Causal restriction and next-token target | `#interview-causality` |
| Q11 / p. 48 | Residual addition and gradient route | `#interview-residual` |
| Q12 / p. 48 | Normalization purpose and feature axis | `#interview-normalization` |
| Q13 / pp. 48-49 | Pre/post placement | `#interview-norm-order` |
| Q14 / p. 49 | Position-wise FFN role | `#interview-ffn` |
| Q15 / p. 49 | Vocabulary projection after hidden states | `#interview-lm-head` |
| Q16 / p. 49 | Logits versus probabilities | `#interview-probabilities` |
| Q17 / p. 49 | Grouped queries, KV sharing and storage | `#interview-gqa` |
| Q18 / p. 49 | Router and selected expert networks | `#interview-moe` |
| Q19 / pp. 49-50 | Exact IO-aware tiled attention | `#interview-flash` |
| Q20 / p. 50 | Sequential next-token generation | `#interview-generation` |

**Source corrections and recovery limits.** Page 52 incorrectly rejects the equal-head answer 1,024/32=32; the chapter explicitly corrects it. Page 20's illustration repeats head labels, mixes projection/head roles and suggests permanent semantic duties; its exact malformed labels are not claimed as an implementation specification. Surrounding pages 19-21 supply the readable independent-projection lesson. Pages 9, 13 and 44 show different norm placements, and p. 44 ties embeddings; these are variants, not one universal GPT architecture. Page 15 shows an attention interior including dropout, not the complete modern block described in the prose. The original diagrams do not specify universal additive-bias/mask placement. We use scale, then additive mask, then row softmax.

Page 23's current-token prediction phrasing is corrected to row i predicting i+1 while allowing diagonal access. Page 12 overloads E for both the vocabulary table and selected rows; this chapter keeps E as the table and X as states. Page 30's flattened transpose is replaced by an explicit vocabulary-by-width U and row h U-transpose. The mean/root notation is confirmed from rendered source pages rather than copied from flattened extraction. Attention is not globally a fixed linear average: projected input-dependent softmax is nonlinear. Residual preservation and Pre-Norm stability are helpful mechanisms, not guarantees. The MoE image has a shared expert and a different illustrative expert count; neither is imposed as a mandatory rule. Vendor examples are kept as bounded architecture-family context, not assertions about unverified private model internals.

**Editorial additions and deferred scope.** Full numerical attention projections, both heads, cross-attention, residual/norm/FFN flow, final vocabulary output, RMSNorm, the bounded SwiGLU calculation, router output, cache counts and tiled normalizer are original first-principles scaffolding. The supplied source develops architecture and optimization concepts mostly without those intermediate computations. No fabricated performance measurement, actual attention-head interpretation, production cache/GPU code, full Transformer backward pass, normalization derivative course, gate-properties proof or detailed sampling-filter algorithm is attributed to it. Separate quizzes, repeated transitions, export furniture, QR/app promotion and source numbering are not additional lessons. No runnable source widgets or separately linked artifacts were attached.

**Separate beginner-review boundary.** After the complete draft, an opening-to-recap pass reread every section and all 20 explained interviews as a dependency sequence. It checked row/column layouts, token positions versus vocabulary IDs, attention-input normalization versus the skip, mask timing, score/value widths, shape rearrangement, learned scales versus input-dependent statistics, rounded epsilon results, shifted labels, cache validity, query versus KV axes, routed versus stored expert parameters and exact versus memory-efficient attention. Repairs replaced ambiguous plain-text exponential powers with rendered notation, defined affine/linear maps and score/weight symbols, taught independence/variance with four equally likely sums before the scaling argument, expanded the local softmax-sensitivity arithmetic, added a numerical head reshape, explicitly defined sampling probabilities/ID indices, added general stable-accumulator rules and showed the separate target-prefix input in the family diagram. Section 11's intentionally chosen LN1 scales are clearly a toy stipulation, not typical trained values. This editorial review, arithmetic checks and source correspondence do not prove human comprehension; no learner study or model benchmark is claimed.

**Destination and print review.** The actual portable home, foundations entry and Chapter 6 were opened from this checkout with file URLs and JavaScript disabled at 375 and 1440 pixels; relocated-publication tests additionally cover 320 pixels. The theme, local fonts, all seven figures, 25 rendered formula elements, native disclosures and parent-relative PDF download remain available without a server. All 36 exercise/interview answers are expanded in the 31-page PDF. All pages were reviewed in three rendered contact sheets, followed by full-size opening, dense arithmetic, normalization, block/shape/cache, variant, interview and concluding pages. The 18 mm white-canvas print margins and 174 mm bounds checks are retained; no missing content or side clipping was found in these local renders. Longer lessons and some answer continuations cross pages without hiding content. Chapter 5's changed concluding bridge was also inspected in its regenerated companion. This verifies this local edition, not remote deployment or every PDF viewer.

## Accessibility and responsive behavior

Provide a skip link, visible keyboard focus, semantic landmarks, clear link names, meaningful image alt text, native expandable solutions, and labeled range inputs. Use aria-live sparingly for changing results. Decorative card art has empty alt text; substantive figures have descriptions of the relationships and values.

Keep the `no-js` class on the document until the application module initializes. Directly opening the built `dist/index.html` uses the no-JavaScript reading layout because browsers block local module imports; the theme, pre-rendered math, diagrams, and chapter navigation must still work, including on mobile. Source fragments under `book/` are not standalone reading pages.

The contents rail disappears before it squeezes the reading column. Below 640px, the sidebar becomes a button-controlled disclosure; Escape closes it and restores focus. Long equations and tables scroll locally, never the entire page. Respect reduced-motion preferences. Do not hide essential definitions behind hover. A print stylesheet removes navigation and keeps worked examples together where practical.

## Adding a chapter and reviewing it

Create `book/topic-name.html`, add the page metadata in `scripts/chapters.mjs`, add the home card and adjacent chapter links, and place original assets in `book/assets/`. The builder creates sidebar links, table-of-contents anchors, document titles, local KaTeX assets, and the guide page. Do not hand-edit `dist/`.

Before calling a chapter finished:

1. Audit coverage against the actual source notes. Record deliberate omissions or additions in its source note.
   Read the complete supplied extraction, inspect figures whose meaning is absent from text, and distinguish taught, partial, missing, and roadmap-only topics. Passing build/math checks is not evidence of exhaustive source coverage.
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

Every chapter delivery or substantive revision must include an **up-to-date, generated and inspected PDF companion**. This applies to all six current chapters and every future chapter. Keep the web reading edition and PDF substantively aligned, including every exercise and interview answer; collapsed `<details>` must not hide answers in the delivered PDF. Do not treat successful HTML rendering, a print button, or an aspirational checklist as evidence that the actual PDF is correct.

Use the existing local workflow:

```powershell
npx playwright install chromium
python -m pip install -r requirements-pdf.txt
npm run pdf
npm run pdf:check
```

`scripts/chapters.mjs` is the shared source of chapter titles, HTML names and meaningful PDF names. Register a future chapter there, extend the home card/adjacent links, and follow the same pipeline. `npm run pdf` first builds the book, then uses local Chromium with `book/assets/print.css`, opens every solution, waits for local fonts and diagrams, and writes the A4 companions under `publications/`. No external conversion service is allowed. A shared Chapter PDF link is generated into each chapter's toolbar; `npm run build` copies the publication files into `dist/pdfs/` so downloads work in a portable, file-opened book.

PDF generation is incremental: a chapter's printable main content, metadata, referenced diagrams, styles, generator and dependency lockfile determine its render digest. The generator preserves an existing companion only when that digest, its recorded PDF hash, and the current complete prose/answer/figure/formula audit agree. A global source digest still detects source changes for the checker. Changes to hidden book navigation or the guide alone do not require redrawing every unchanged companion. The one-time `node scripts/pdf.mjs --adopt-existing` migration records render digests only after existing PDFs have passed `npm run pdf:check`; it refuses missing companions, hash differences or changed printable audits. It does not regenerate or repair a stale PDF.

Commit the fresh `publications/html/` edition, reasonable-sized publication PDFs, and `publications/manifest.json` beside source changes. The manifest records a source digest, each PDF's hash, expected substantive prose fragments, and answer/figure/formula counts for checks; counts are not evidence of instructional quality. `dist/`, raster page images, contact sheets and extracted audit text are reproducible, ignored output. Do not redistribute supplied source PDFs or private source-audit material. Regeneration is content/layout reproducibility, not a claim of byte identity across browser versions, fonts and metadata timestamps.

The checker verifies the **actual PDF files**: source and output freshness, title/bookmarks, expected prose (including expanded answer text), A4 size, blank pages, raw TeX, and text bounding boxes inside safe paper margins. It renders every page locally at inspection resolution and creates numbered contact sheets under `dist/pdf-review/<chapter-name>/`. A passing checker is necessary but not sufficient:

Print uses a white page canvas rather than a tinted body column ending abruptly at the printable edges. Horizontal margins are 18 mm, with unchanged body type size and individually reflowed equations where necessary. The generator checks the actual 174 mm A4 content width, including inline mathematical spans, tables, code and diagram bounds; the PDF checker verifies uncropped page boxes and glyph clearance against those side margins. The edge investigation of the preceding PDFs found roughly 15 mm physical clearance and did not reproduce missing side content. A viewer-specific cropping report still needs an example screenshot; do not claim the visual-edge repair diagnoses every viewer.

1. Inspect every contact sheet for overall completeness, consistent botanical-notebook theme, page numbering, excessive blank space, awkward page breaks and missing/oversized diagrams. Reopen suspicious pages at full resolution, rather than approving only thumbnails.
2. Read formula-heavy pages at full resolution: confirm symbols, fractions, matrices, indices and signs are rendered, legible and unclipped. Reflow an overwide derivation into steps; do not silently shrink an entire chapter or crop overflow. The generator rejects detected overwide equation/table/code blocks.
3. Check original diagrams, table headers/rows, multiline code, source notes and the beginning/end of each chapter. Verify captions stay with diagrams and headings do not become orphaned at page bottoms. Long worked examples and answers may continue across pages; they must not lose lines or become giant unbreakable boxes.
4. Inspect expanded exercise and interview answers in the PDF, not only their HTML disclosure controls. The checker compares substantive prose fragments against extracted PDF text; manually inspect mathematical answers and diagrams that text extraction cannot fully certify.
5. Run `npm test` for the associated web behavior and download links. Regenerate and repeat checks after any content or print-layout repair. Record genuine remaining limitations; automated geometry/text checks do not prove semantic math correctness, full accessibility or human comprehension.

Ad-hoc HTTP printing temporarily expands solutions and restores their prior disclosure state afterward. File-opened readers can always use the prechecked companion download. Static PDF experiments show default/fallback explanations and results rather than promising live controls. A PDF delivery should name the actual generated files and summarize inspection findings, not claim that a test count proves readability.

PDF links must not retain `file:` URLs into the author's checkout. The generator preserves same-chapter destinations and maps cross-chapter/guide links to the repository's published PDF companions and guide. Those cross-document links need Internet access; named-destination behavior varies by PDF viewer, so retain useful chapter bookmarks as a fallback. Update the canonical repository URL in `scripts/chapters.mjs` if the publication moves.
