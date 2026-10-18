# Zhexiang (Bruce) Li — personal website

A static portfolio: warm paper, a blurred contour field, and six selected works
— two papers, two products, two roles. No build step, no framework, deployed
from the repository root by GitHub Pages.

## Pages

- `index.html` / `index-zh.html`: Selected work. Six pieces in a single
  editorial column beside a sticky index, over a fixed, blurred contour
  backdrop. The archive and CV hold the full record.
- `archive.html` / `archive-zh.html`: full experience archive, including the
  collapsible resume downloads. Uses `site.css` + `resume-downloads.css`.
- `cv.html` / `cv_zh.html`: full academic and professional CVs. Skills appear
  last; the print layout may span multiple pages.
- `resumes/`: independent one-page LaTeX resumes for Research and AI Engineer
  positions, each authored in English and Chinese. See
  [build and editorial instructions](resumes/README.md).

## Design system

- `atlas.css`, `atlas.js`: the homepage. Vanilla CSS/JS, one accent
  (`#3f5c3f`), Fraunces + Inter + IBM Plex Mono, light and dark themes,
  `prefers-reduced-motion`, and cross-page View Transitions between EN/ZH.
- The contour field is a fixed, oversized backdrop: blurred and tinted. It
  drifts on a 22-second cycle, scales and shifts with scroll, and follows the
  pointer by a few pixels on desktop. It is decoration only — no map navigation,
  no fake coordinates.
- `assets/atlas.svg`: the organic contour field, generated from seeded random
  peaks. Regenerate with `python scripts/make_atlas.py` (requires numpy and
  matplotlib). It writes the same file path and keeps the SVG under 50 KB.
- `email.js`: reverses the obfuscated address on archive/CV pages. `site.css`
  is archived-only; legacy homepage CSS/JS was removed in October 2026.
- The homepage sits below a fixed 68px navigation and uses 1px rules. There is
  no separate Now/About section: current context lives in the hero and archive.
  On mobile the sticky index is hidden, pieces stack, and the backdrop softens.

## Checks

```sh
python scripts/check_site.py
```

Verifies duplicate ids, internal anchors, local assets, image alt text, page
metadata, cache-busting query strings, and removed legacy references. The same
command runs in `.github/workflows/site-check.yml` on every push to `main`.

## Resumes and CV PDFs

After editing resume content, run `python resumes/build.py` and commit the PDFs
alongside the LaTeX sources. Keep shared facts aligned across languages and
documents while preserving the different editorial focus of each profile.

To export the full web CVs, install `playwright` and `pypdf`, then run
`python scripts/export_cv.py` with Chrome installed (or `--channel msedge`).
The exporter uses the print styles in `cv.css`, checks page numbers and public
links, and writes both PDFs to `output/pdf/`. Visually review exported pages
after changing content or layout. See `resumes/README.md` for resume dependencies
and the evidence supporting the research results.

## Deploy

Commit to `main`; GitHub Pages serves the repository root at
<https://brucelzx.github.io/>. Every page must keep working as plain HTML with
JavaScript disabled; motion, the sticky index, and the backdrop are
enhancements only.



