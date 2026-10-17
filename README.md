# Zhexiang (Bruce) Li — personal website

A static portfolio: warm paper, a contour field, and six selected works. A
scroll-driven map pans between six stops — two papers, two products, two roles.
No build step, no framework, deployed from the repository root by GitHub Pages.

## Pages

- `index.html` / `index-zh.html`: Selected work. A sticky contour map moves
  between six stops as you scroll; clicking a stop jumps to that entry. The
  archive and CV hold the full record.
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
- The map camera is driven by scroll position. It pans a 165%-wide contour
  field so the active stop sits near the frame centre while all six points stay
  visible and clickable; the active point enlarges and the route draws in one
  segment per stop. Desktop is a sticky split view; mobile keeps the map as a
  36vh sticky band above stacked entries.
- `assets/atlas.svg`: the six-station contour map. Regenerate with
  `python scripts/make_atlas.py` (requires numpy and matplotlib). It writes the
  same file path and keeps the SVG under 30 KB.
- `email.js`: reverses the obfuscated address on archive/CV pages. `site.css`
  is archived-only; legacy homepage CSS/JS was removed in October 2026.
- The homepage sits below a fixed 68px navigation and uses 1px rules. There is
  no separate Now/About section: current context lives in the hero and archive.

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
JavaScript disabled; motion, the map camera, and the sticky panes are
enhancements only.

