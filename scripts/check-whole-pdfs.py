"""Validate and render the actual complete-book review PDFs, not chapter companions."""
import hashlib
import json
import re
import runpy
from pathlib import Path
from PIL import Image, ImageDraw
from pypdf import PdfReader
import pypdfium2 as pdfium

ROOT = Path(__file__).resolve().parent.parent
helpers = runpy.run_path(str(ROOT / "scripts" / "check-pdfs.py"))
normalized, check = helpers["normalized"], helpers["check"]
manifest = json.loads((ROOT / "publications" / "book-manifest.json").read_text(encoding="utf-8"))
publication = json.loads((ROOT / "book" / "publication.json").read_text(encoding="utf-8"))
check(manifest["sourceDigest"] == helpers["source_digest"](), "Whole-book source changed: run npm run book.")
reports = []
for entry in manifest["pdfs"]:
    path = ROOT / "publications" / entry["file"]
    check(hashlib.sha256(path.read_bytes()).hexdigest() == entry["sha256"], f"{path.name}: stale bytes")
    reader = PdfReader(path)
    check(len(reader.pages) == entry["pages"], f"{path.name}: browser pagination and actual PDF disagree")
    check(reader.outline, f"{path.name}: missing PDF bookmarks")
    doc = pdfium.PdfDocument(path)
    output = ROOT / "dist" / "book-review" / entry["kind"]
    output.mkdir(parents=True, exist_ok=True)
    for stale in output.iterdir():
        if re.fullmatch(r"(?:page-\d+|contact-\d+)\.png", stale.name):
            stale.unlink()
    texts, thumbs = [], []
    expected_size = (publication["print"]["widthInches"] * 72, publication["print"]["heightInches"] * 72) if entry["kind"] == "print" else (595.28, 841.89)
    for index, page in enumerate(doc):
        width, height = page.get_size()
        check(abs(width - expected_size[0]) < 1 and abs(height - expected_size[1]) < 1, f"{path.name} p{index+1}: incorrect trim")
        textpage = page.get_textpage()
        texts.append(textpage.get_text_bounded())
        check(len(normalized(texts[-1])) > 20, f"{path.name} p{index+1}: empty page")
        if entry["kind"] == "print":
            left_mm, right_mm = (22, 16) if index % 2 == 0 else (16, 22)
        else:
            left_mm = right_mm = 18
        outside = []
        for char_index in range(textpage.count_chars()):
            char = textpage.get_text_range(char_index, 1)
            if not char.strip():
                continue
            left, bottom, right, top = textpage.get_charbox(char_index)
            if left < left_mm * 72 / 25.4 - 1 or right > width - right_mm * 72 / 25.4 + 1 or bottom < 8 or top > height - 20:
                outside.append(char)
        check(not outside, f"{path.name} p{index+1}: text outside safe bounds: {''.join(outside)[:100]}")
        image = page.render(scale=1.5).to_pil().convert("RGB")
        image.save(output / f"page-{index+1:03}.png")
        image.thumbnail((248, 351))
        thumb = Image.new("RGB", (270, 381), "white")
        thumb.paste(image, ((270-image.width)//2, 20))
        ImageDraw.Draw(thumb).text((10, 4), f"{entry['kind']} / {index+1}", fill="black")
        thumbs.append(thumb)
        textpage.close()
        page.close()
    doc.close()
    text = "\n".join(texts)
    check(not re.search(r"supplied(?:\s+\w+){0,3}\s+PDF|source\s+Q\d+|MAINTAINER-AUDIT|conversation\s+PDF", text, re.I), f"{path.name}: internal provenance")
    footer = r"Becoming an AI Engineer\s+\d+"
    searchable = normalized(re.sub(footer, "", text))
    prose = []
    def visitor(value, _cm, _tm, font, _size):
        if not font or "KaTeX" not in str(font.get("/BaseFont", "")):
            prose.append(value)
    for page in reader.pages:
        page.extract_text(visitor_text=visitor)
    prose_searchable = normalized(re.sub(footer, "", "".join(prose)))
    for section in manifest["sections"]:
        if entry["kind"] == "print" and section["file"] == "index.html":
            continue
        missing = [fragment for fragment in section["fragments"] if normalized(fragment) not in searchable and normalized(fragment) not in prose_searchable]
        check(not missing, f"{path.name}: missing {section['file']} content:\n" + "\n".join(missing[:5]))
        destination = entry["destinations"].get(section["file"])
        check(destination is not None, f"{path.name}: missing section destination")
        # The part-page display heading differs from its catalogue title.
        if section["file"] != "foundations.html":
            title = publication["title"] if any(page["file"] == section["file"] and page["kind"] == "title" for page in publication["frontMatter"]) else section["title"]
            check(normalized(title) in normalized(texts[destination-1]), f"{path.name}: incorrect destination for {section['file']}")
    contents_page = entry["destinations"]["contents.html"]
    contents_text = normalized("\n".join(texts[contents_page-1:entry["destinations"]["preface.html"]-1]))
    for section in manifest["sections"]:
        if section["file"] in ("index.html", "title-page.html", "publication.html", "contents.html"):
            continue
        expected = normalized(section["title"] + str(entry["destinations"][section["file"]]))
        check(expected in contents_text, f"{path.name}: contents page number incorrect for {section['file']}")
    check(entry["answers"] == sum(section["answers"] for section in manifest["sections"]), f"{path.name}: answer inventory differs")
    check(entry["formulas"] == manifest["epub"]["formulas"], f"{path.name}: formula inventory differs")
    for page in reader.pages:
        for annotation in page.get("/Annots", []):
            uri = str(annotation.get_object().get("/A", {}).get("/URI", ""))
            check(not uri.startswith("file:"), f"{path.name}: machine-local PDF link")
    for start in range(0, len(thumbs), 12):
        sheet = Image.new("RGB", (1080, 1143), "#d8d8d8")
        for offset, thumb in enumerate(thumbs[start:start+12]):
            sheet.paste(thumb, ((offset % 4)*270, (offset // 4)*381))
        sheet.save(output / f"contact-{start//12+1:02}.png")
    (output / "text.txt").write_text(text, encoding="utf-8")
    reports.append({"kind": entry["kind"], "pages": len(reader.pages), "answers": entry["answers"], "formulas": entry["formulas"], "contentsVerified": True})
    print(f"{path.name}: {len(reader.pages)} actual pages; all text, contents destinations, {entry['answers']} answers and {entry['formulas']} formulas verified; every page rendered.")
(ROOT / "dist" / "book-review" / "pdf-validation.json").write_text(json.dumps(reports, indent=2)+"\n", encoding="utf-8")
