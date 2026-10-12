"""Build, embed Unicode mappings, and validate all four application resumes."""
from pathlib import Path
import re
import shutil
import subprocess

from fontTools.ttLib import TTFont
from pypdf import PdfReader, PdfWriter
from pypdf.generic import DecodedStreamObject, NameObject

ROOT = Path(__file__).resolve().parent
PROFILES = {
    "research-en": "Zhexiang_Li_Research_Resume.pdf",
    "research-zh": "李哲骧_研究岗位简历.pdf",
    "ai-engineer-en": "Zhexiang_Li_AI_Engineer_Resume.pdf",
    "ai-engineer-zh": "李哲骧_AI工程师简历.pdf",
}


def embed_fandol_unicode(source, destination):
    """Map identity-encoded Adobe-GB1 CIDs using the original Fandol font.

    XeTeX can omit ToUnicode for this standard character collection. Readers
    with an external Adobe CMap recover the text, but others cannot. Embedding
    the font's own mapping makes extraction independent of those reader assets.
    Glyphs, layout, links and metadata are preserved.
    """
    writer = PdfWriter(clone_from=source)
    for page in writer.pages:
        for ref in page["/Resources"]["/Font"].values():
            font = ref.get_object()
            if "/ToUnicode" in font:
                continue
            name = str(font.get("/BaseFont", ""))
            match = re.search(r"FandolSong-(Regular|Bold)", name)
            if not match:
                continue
            assert font["/Encoding"] == "/Identity-H", name
            info = font["/DescendantFonts"][0].get_object()["/CIDSystemInfo"]
            assert (info["/Registry"], info["/Ordering"]) == ("Adobe", "GB1"), name
            filename = f"FandolSong-{match[1]}.otf"
            path = subprocess.check_output(["kpsewhich", filename], text=True).strip()
            with TTFont(path) as original:
                assert original["CFF "].cff.topDictIndex[0].ROS == ("Adobe", "GB1", 5)
                mapping = {}
                # Prefer standard CJK characters to compatibility/radical aliases.
                pairs = sorted(original.getBestCmap().items(),
                               key=lambda item: (not 0x4E00 <= item[0] <= 0x9FFF, item[0]))
                for codepoint, glyph in pairs:
                    if codepoint >= 32 and glyph.startswith("cid"):
                        mapping.setdefault(int(glyph[3:]), chr(codepoint).encode("utf-16-be").hex())
            entries = [f"<{cid:04x}> <{unicode}>" for cid, unicode in sorted(mapping.items())]
            cmap = ["/CIDInit /ProcSet findresource begin", "12 dict begin", "begincmap",
                    "/CIDSystemInfo << /Registry (Adobe) /Ordering (UCS) /Supplement 0 >> def",
                    "/CMapName /FandolToUnicode def", "/CMapType 2 def",
                    "1 begincodespacerange", "<0000> <ffff>", "endcodespacerange"]
            for offset in range(0, len(entries), 100):
                block = entries[offset:offset + 100]
                cmap += [f"{len(block)} beginbfchar", *block, "endbfchar"]
            cmap += ["endcmap", "CMapName currentdict /CMap defineresource pop", "end", "end"]
            stream = DecodedStreamObject()
            stream.set_data("\n".join(cmap).encode("ascii"))
            font[NameObject("/ToUnicode")] = writer._add_object(stream.flate_encode())
    writer.write(destination)


def validate(path, profile):
    reader = PdfReader(path)
    assert len(reader.pages) == 1, f"{profile}: expected one page"
    page = reader.pages[0]
    assert (float(page.mediabox.width), float(page.mediabox.height)) == (612, 792)
    for ref in page["/Resources"]["/Font"].values():
        font = ref.get_object()
        if font.get("/Subtype") == "/Type0":
            assert "/ToUnicode" in font, f"{profile}: missing Unicode map for {font['/BaseFont']}"
    extracted = [page.extract_text(), subprocess.check_output(
        ["pdftotext", str(path), "-"], encoding="utf-8")]
    required = ["bruceli@ucla.edu", "80.38", "76.93", "12.0", "9.5", "131k"]
    if profile.endswith("zh"):
        body = (ROOT / f"{profile}.tex").read_text(encoding="utf-8").split(r"\begin{document}")[1]
        required += ["李哲骧", "教育背景", *re.findall(r"[\u4e00-\u9fff]{2,}", body)]
    else:
        required += ["Zhexiang", "Education", "PyTorch", "Triton"]
    for text in extracted:
        compact = re.sub(r"\s+", "", text)
        for phrase in required:
            assert phrase in compact, f"{profile}: failed text extraction: {phrase}"
        assert not re.search(r"629|438|139|34\s*contract", compact), profile
    urls = [a.get_object().get("/A", {}).get("/URI", "") for a in page.get("/Annots", [])]
    for url in ("https://arxiv.org/abs/2505.11040", "https://arxiv.org/abs/2609.30613"):
        assert url in urls, f"{profile}: missing paper link"


def main():
    for dependency in ("latexmk", "xelatex", "kpsewhich", "pdftotext"):
        if not shutil.which(dependency):
            raise SystemExit(f"Missing dependency: {dependency}")
    build = ROOT / "build"
    build.mkdir(exist_ok=True)
    for profile in PROFILES:
        result = subprocess.run(["latexmk", "-xelatex", "-interaction=nonstopmode",
                                 "-halt-on-error", "-outdir=build", f"{profile}.tex"],
                                cwd=ROOT, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
        (build / f"{profile}-build.log").write_bytes(result.stdout)
        if result.returncode:
            raise SystemExit(f"{profile}: compilation failed; see build log")
        log = (build / f"{profile}.log").read_text(encoding="utf-8", errors="replace")
        assert not re.search(r"Overfull \\[hv]box|Missing character:", log), f"{profile}: layout/font error"
        final = build / f"{profile}-checked.pdf"
        embed_fandol_unicode(build / f"{profile}.pdf", final)
        validate(final, profile)
        print(f"Validated {profile}: one-page Letter, Unicode text, paper links", flush=True)
    # Replace public outputs only after every variant passes.
    (ROOT / "pdf").mkdir(exist_ok=True)
    for profile, name in PROFILES.items():
        shutil.copyfile(build / f"{profile}-checked.pdf", ROOT / "pdf" / name)


if __name__ == "__main__":
    main()
