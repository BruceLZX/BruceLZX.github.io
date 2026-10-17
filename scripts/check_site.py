#!/usr/bin/env python3
"""Static checks for the site: ids, anchors, local assets, metadata, cache-busting."""
from __future__ import annotations

from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
PAGES = [
    "index.html",
    "index-zh.html",
    "archive.html",
    "archive-zh.html",
    "cv.html",
    "cv_zh.html",
]
LEGACY = ("site.js", "home.css", "home.js", "scroll.css")


class Page(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.ids: list[str] = []
        self.hrefs: list[str] = []
        self.srcs: list[str] = []
        self.images: list[tuple[str, str | None]] = []
        self.lang: str | None = None
        self.headings = {"h1": 0, "h2": 0, "h3": 0}
        self.blank_links_without_rel: list[str] = []
        self._current_blank = False

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        data = dict(attrs)
        if tag == "html":
            self.lang = data.get("lang")
        if "id" in data and data["id"]:
            self.ids.append(data["id"])
        if tag == "a" and data.get("href") is not None:
            self.hrefs.append(data["href"] or "")
            if data.get("target") == "_blank":
                self._current_blank = True
                if "noopener" not in (data.get("rel") or ""):
                    self.blank_links_without_rel.append(data["href"] or "")
        if tag in ("img", "script", "source"):
            if data.get("src"):
                self.srcs.append(data["src"])
        if tag == "img":
            self.images.append((data.get("src") or "", data.get("alt")))
        if tag == "link" and data.get("href"):
            self.hrefs.append(data["href"])
        if tag in self.headings:
            self.headings[tag] += 1

    def handle_endtag(self, tag: str) -> None:
        if tag == "a":
            self._current_blank = False


def local_target(ref: str) -> str:
    return unquote(ref.split("#", 1)[0].split("?", 1)[0])


def check_page(name: str) -> list[str]:
    errors: list[str] = []
    path = ROOT / name
    if not path.is_file():
        return [f"{name}: missing page"]

    text = path.read_text(encoding="utf-8")
    parser = Page()
    parser.feed(text)

    duplicates = sorted({value for value in parser.ids if parser.ids.count(value) > 1})
    if duplicates:
        errors.append(f"{name}: duplicate ids {duplicates}")

    if parser.headings["h1"] != 1:
        errors.append(f"{name}: expected exactly one h1, found {parser.headings['h1']}")

    if not parser.lang:
        errors.append(f"{name}: missing html lang")
    if name.endswith("-zh.html") and not (parser.lang or "").startswith("zh"):
        errors.append(f"{name}: expected a zh lang attribute")
    if name.startswith("index") and not name.endswith("-zh.html") and parser.lang != "en":
        errors.append(f"{name}: expected lang=en")

    if not re.search(r"<title>[^<]+</title>", text):
        errors.append(f"{name}: missing title")
    if 'name="description"' not in text:
        errors.append(f"{name}: missing meta description")
    if 'name="viewport"' not in text:
        errors.append(f"{name}: missing viewport")
    if "noindex" in text:
        errors.append(f"{name}: noindex should not ship on public pages")

    for ref in parser.hrefs + parser.srcs:
        if not ref or ref.startswith(("#", "mailto:", "tel:", "data:", "http:", "https:", "//")):
            continue
        target = local_target(ref)
        if not target:
            continue
        if any(legacy in target for legacy in LEGACY):
            errors.append(f"{name}: references removed legacy file {ref}")
        if not (ROOT / target).exists():
            errors.append(f"{name}: broken local reference {ref}")
        if (target.endswith(".css") or target.endswith(".js")) and "?v=" not in ref:
            errors.append(f"{name}: cache-busting missing on {ref}")

    for ref in parser.hrefs:
        if ref.startswith("#") and len(ref) > 1:
            anchor = unquote(ref[1:])
            if anchor not in parser.ids:
                errors.append(f"{name}: anchor #{anchor} has no target")

    for src, alt in parser.images:
        if alt is None:
            errors.append(f"{name}: image without alt: {src}")
        if src and not src.startswith(("http:", "https:", "data:", "//")):
            if not (ROOT / local_target(src)).exists():
                errors.append(f"{name}: missing image {src}")

    if parser.blank_links_without_rel:
        errors.append(f"{name}: target=_blank without noopener: {parser.blank_links_without_rel}")

    return errors


def main() -> int:
    problems: list[str] = []
    for page in PAGES:
        problems.extend(check_page(page))

    if problems:
        print("FAIL")
        for problem in problems:
            print(f"  - {problem}")
        return 1

    print(f"OK — {len(PAGES)} pages checked: ids, anchors, assets, metadata, cache-busting")
    return 0


if __name__ == "__main__":
    sys.exit(main())
