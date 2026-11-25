"""Audit actual chapter PDFs and render every page for local visual inspection."""

import hashlib
import json
import re
import sys
from pathlib import Path

import pypdfium2 as pdfium
from PIL import Image, ImageDraw
from pypdf import PdfReader


ROOT = Path(__file__).resolve().parent.parent
REVIEW = ROOT / "dist" / "pdf-review"


def normalized(text):
    return re.sub(r"[^a-z0-9]", "", text.lower())


def source_digest():
    paths = [ROOT / name for name in ("AUTHORING.md", "package.json", "package-lock.json", "requirements-pdf.txt")]
    paths += [path for folder in ("book", "scripts") for path in (ROOT / folder).rglob("*") if path.is_file()]
    paths = [path for path in paths if "__pycache__" not in path.parts]
    digest = hashlib.sha256()
    for path in sorted(paths, key=lambda item: item.relative_to(ROOT).as_posix()):
        digest.update(path.relative_to(ROOT).as_posix().encode())
        digest.update(path.read_text(encoding="utf-8").replace("\r\n", "\n").encode())
    return digest.hexdigest()


def check(condition, message):
    if not condition:
        raise AssertionError(message)


def audit(chapter):
    path = ROOT / "publications" / chapter["pdf"]
    check(hashlib.sha256(path.read_bytes()).hexdigest() == chapter["sha256"], f"{path.name}: PDF differs from generation manifest")
    reader = PdfReader(path)
    check(not reader.is_encrypted, f"{path.name}: encrypted PDF")
    check(reader.outline, f"{path.name}: missing chapter bookmarks")
    pages = []
    prose = []
    for page in reader.pages:
        check(list(page.cropbox) == list(page.mediabox), f"{path.name}: cropped page box")
        for annotation in page.get("/Annots", []):
            uri = str(annotation.get_object().get("/A", {}).get("/URI", ""))
            check(not uri.startswith("file:"), f"{path.name}: machine-local PDF link")
        def visitor(text, _cm, _tm, font, _size):
            if not font or "KaTeX" not in str(font.get("/BaseFont", "")):
                prose.append(text)
        pages.append(page.extract_text(visitor_text=visitor))
    text = "\n".join(pages)
    provenance = (
        r"Understand Linear Algebra|Learn Calculus For LLMs|Start LLM Tokenizers Learning|"
        r"Learn Embeddings|Chapter 4 Neural Networks|Transformer Architecture Deep Dive|"
        r"supplied(?:\s+\w+){0,3}\s+PDF|conversation\s+PDF|Source basis|Source and scope|"
        r"readable source|source(?:'s)?\s+(?:questions?|page\s+\d+|illustration)|"
        r"the source(?:'s)?\s+(?:proposes|names|only|develops|introduces)|source\s+Q\d+"
    )
    check(not re.search(provenance, text, re.IGNORECASE), f"{path.name}: private-input provenance in reader text")
    footer = r"Becoming an AI Engineer / Chapter \d+\s+\d+ / \d+"
    searchable = normalized(re.sub(footer, "", text))
    prose_searchable = normalized(re.sub(footer, "", "".join(prose)))
    missing = [fragment for fragment in chapter["text"]
               if normalized(fragment) not in searchable and normalized(fragment) not in prose_searchable]
    check(not missing, f"{path.name}: missing substantive text/answers:\n" + "\n".join(missing[:12]))
    check(normalized(chapter["title"]) in searchable, f"{path.name}: incorrect title")
    check("\\begin{" not in text and "\\frac{" not in text, f"{path.name}: raw TeX")
    font_names = {str(font.get_object().get("/BaseFont", ""))
                  for page in reader.pages
                  for font in page["/Resources"].get("/Font", {}).values()}
    check(any("KaTeX" in font for font in font_names), f"{path.name}: no embedded math font")
    document = pdfium.PdfDocument(path)
    output = REVIEW / path.stem
    output.mkdir(parents=True, exist_ok=True)
    for stale in output.iterdir():
        if re.fullmatch(r"(?:page-\d+|contact-\d+)\.png", stale.name):
            stale.unlink()
    thumbs = []
    bounds = []
    for index, page in enumerate(document):
        width, height = page.get_size()
        check(abs(width - 595.28) < 2 and abs(height - 841.89) < 2, f"{path.name} p{index + 1}: not A4")
        text_page = page.get_textpage()
        page_text = text_page.get_text_bounded()
        check(len(normalized(page_text)) > 40, f"{path.name} p{index + 1}: blank/nearly blank page")
        outside = []
        leftmost, rightmost = width, 0
        for char_index in range(text_page.count_chars()):
            char = text_page.get_text_range(char_index, 1)
            if not char.strip():
                continue
            left, bottom, right, top = text_page.get_charbox(char_index)
            leftmost, rightmost = min(leftmost, left), max(rightmost, right)
            side_margin = 18 * 72 / 25.4
            if left < side_margin - 1 or right > width - side_margin + 1 or bottom < 12 or top > height - 25:
                outside.append(char)
        check(not outside, f"{path.name} p{index + 1}: text outside safe page bounds: {''.join(outside)[:80]}")
        bounds.append({"page": index + 1, "characters": text_page.count_chars(),
                       "leftmost": round(leftmost, 2), "rightmost": round(rightmost, 2)})
        image = page.render(scale=1.5).to_pil().convert("RGB")
        image.save(output / f"page-{index + 1:03}.png")
        image.thumbnail((248, 351))
        thumb = Image.new("RGB", (270, 381), "white")
        thumb.paste(image, ((270 - image.width) // 2, 20))
        ImageDraw.Draw(thumb).text((10, 4), f"{chapter['number']} / page {index + 1}", fill="black")
        thumbs.append(thumb)
        text_page.close()
        page.close()
    document.close()
    for start in range(0, len(thumbs), 12):
        subset = thumbs[start:start + 12]
        sheet = Image.new("RGB", (270 * 4, 381 * 3), "#d8d8d8")
        for offset, image in enumerate(subset):
            sheet.paste(image, ((offset % 4) * 270, (offset // 4) * 381))
        sheet.save(output / f"contact-{start // 12 + 1:02}.png")
    (output / "text.txt").write_text(text, encoding="utf-8")
    print(f"{path.name}: {len(reader.pages)} pages; {len(chapter['text'])} text fragments including {chapter['answers']} expanded answers present; every page rendered.")
    return {"pdf": chapter["pdf"], "pages": len(reader.pages), "answers": chapter["answers"], "textFragments": len(chapter["text"]), "pageAudit": bounds}


def main():
    manifest = json.loads((ROOT / "publications" / "manifest.json").read_text(encoding="utf-8"))
    check(manifest["sourceDigest"] == source_digest(), "PDF sources changed: run npm run pdf before checking/publication.")
    REVIEW.mkdir(parents=True, exist_ok=True)
    reports = [audit(chapter) for chapter in manifest["chapters"]]
    (REVIEW / "report.json").write_text(json.dumps(reports, indent=2) + "\n", encoding="utf-8")
    print("Inspect all contact sheets and formula/diagram/answer pages in dist/pdf-review before delivery; automated checks do not prove visual quality.")


if __name__ == "__main__":
    try:
        main()
    except (AssertionError, FileNotFoundError) as error:
        print(f"PDF CHECK FAILED: {error}", file=sys.stderr)
        sys.exit(1)
