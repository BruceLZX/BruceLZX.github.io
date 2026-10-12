# Zhexiang (Bruce) Li — personal website

- `index.html` / `index-zh.html`: English and Chinese homepages.
- `archive.html` / `archive-zh.html`: full experience archive, including a
  collapsible download section for application resumes.
- `cv.html` / `cv_zh.html`: full academic and professional CVs. Skills appear
  last; the print layout may span multiple pages.
- `resumes/`: independent one-page LaTeX resumes for Research and AI Engineer
  positions, each authored in English and Chinese. See [build and editorial
  instructions](resumes/README.md).

After editing resume content, run `python resumes/build.py` and commit the PDFs
alongside the LaTeX sources. Keep shared facts aligned across languages and
documents while preserving the different editorial focus of each profile.

To export the full web CVs, install `playwright` and `pypdf`, then run
`python scripts/export_cv.py` with Chrome installed (or `--channel msedge`).
The exporter uses the print styles in `cv.css`, checks page numbers and public
links, and writes both PDFs to `output/pdf/`. Visually review exported pages
after changing content or layout. See `resumes/README.md` for resume dependencies
and the evidence supporting the research results.
