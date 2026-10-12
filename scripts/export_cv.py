"""Export both web CVs with Chromium, preserving public links and page numbers.

Install playwright and pypdf, then use an installed Chrome browser (default),
--channel msedge, or --browser-path /path/to/chromium.
"""
import argparse
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import threading

from playwright.sync_api import sync_playwright
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[1]


class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, *_args):
        pass


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--channel", default="chrome")
    parser.add_argument("--browser-path")
    args = parser.parse_args()
    server = ThreadingHTTPServer(("127.0.0.1", 0), partial(QuietHandler, directory=str(ROOT)))
    threading.Thread(target=server.serve_forever, daemon=True).start()
    staging = ROOT / "tmp" / "pdfs"
    staging.mkdir(parents=True, exist_ok=True)
    outputs = []
    try:
        with sync_playwright() as playwright:
            options = {"executable_path": args.browser_path} if args.browser_path else {"channel": args.channel}
            browser = playwright.chromium.launch(headless=True, **options)
            page = browser.new_page(viewport={"width": 1100, "height": 900})
            for html, name in (("cv.html", "Zhexiang_Li_CV_EN.pdf"),
                               ("cv_zh.html", "Zhexiang_Li_CV_ZH.pdf")):
                errors = []
                on_error = lambda error: errors.append(error)
                page.on("pageerror", on_error)
                page.goto(f"http://127.0.0.1:{server.server_port}/{html}", wait_until="networkidle")
                page.evaluate("document.fonts.ready")
                assert not errors, errors
                # Local previews must never leak localhost links into public PDFs.
                page.locator("a[href]").evaluate_all("""links => links.forEach(link => {
                    const href = link.getAttribute('href');
                    if (!/^[a-z][a-z0-9+.-]*:/i.test(href))
                        link.href = new URL(href, 'https://brucelzx.github.io/').href;
                })""")
                candidate = staging / name
                page.pdf(path=str(candidate), prefer_css_page_size=True, print_background=True,
                         display_header_footer=False)
                reader = PdfReader(candidate)
                assert 1 < len(reader.pages) <= 4, f"Unexpected CV page count: {len(reader.pages)}"
                combined = "".join(p.extract_text() for p in reader.pages)
                for required in ("80.38", "76.93", "12.0", "9.5", "bruceli@ucla.edu"):
                    assert required in combined, (name, required)
                for index, pdfpage in enumerate(reader.pages, 1):
                    assert (float(pdfpage.mediabox.width), float(pdfpage.mediabox.height)) == (612, 792)
                    assert f"{index} / {len(reader.pages)}" in pdfpage.extract_text(), "Missing page footer"
                    for ref in pdfpage.get("/Annots", []):
                        url = ref.get_object().get("/A", {}).get("/URI", "")
                        assert "127.0.0.1" not in url and "localhost" not in url, url
                outputs.append((candidate, ROOT / "output" / "pdf" / name))
                print(f"Validated {name}: {len(reader.pages)} Letter pages, public links, page numbers")
                page.remove_listener("pageerror", on_error)
            browser.close()
        for candidate, destination in outputs:
            destination.parent.mkdir(parents=True, exist_ok=True)
            destination.write_bytes(candidate.read_bytes())
    finally:
        server.shutdown()
        server.server_close()


if __name__ == "__main__":
    main()
