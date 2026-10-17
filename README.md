# Zhexiang (Bruce) Li — personal website

A static field-survey portfolio: warm paper, contour maps, and five "plates" that
organise research, work, measures, route, and contact. No build step, no
framework, deployed from the repository root by GitHub Pages.

## Pages

- `index.html` / `index-zh.html`: Atlas homepage. A contour-map index links to
  five plates; the same index is available as a dialog from the navigation.
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
- `assets/atlas.svg`: the contour map. Regenerate with
  `python scripts/make_atlas.py` (requires numpy and matplotlib). It writes the
  same file path and keeps the SVG under 30 KB.
- `email.js`: reverses the obfuscated address on archive/CV pages. `site.css`
  is archived-only; legacy homepage CSS/JS was removed in October 2026.
- The new pages sit below a fixed 72px navigation; sections use 1px rules and a
  12-column grid. Mobile collapses the map into a labelled index band and stacks
  every plate.

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
JavaScript disabled; motion and the map index are enhancements only.
