# Application resumes

Two independently written profiles, each in English and Chinese. These are not
print styles or shortened exports of the web CV.

| Profile | Source | Download |
| --- | --- | --- |
| Research, English | `research-en.tex` | `pdf/research-en.pdf` |
| Research, 中文 | `research-zh.tex` | `pdf/research-zh.pdf` |
| AI Engineer, English | `ai-engineer-en.tex` | `pdf/ai-engineer-en.pdf` |
| AI Engineer, 中文 | `ai-engineer-zh.tex` | `pdf/ai-engineer-zh.pdf` |

The web CV lives in `../cv.html` and `../cv_zh.html`, with its own `../cv.css`.
It retains the broader professional record and puts technical skills last.
Resume downloads appear in the experience archive, not the homepage header.

## Editorial rules

- Research: emphasize research questions, methods, evaluation, papers, and teaching.
- AI Engineer: emphasize implementation, system integration, validation, and applications.
- Keep skills near the top of both resumes, ordered for the intended role.
- Write English and Chinese separately. Keep dates, affiliations, links, publication
  status, and factual claims aligned; sentence structure need not match.
- Keep CrAIg Capital and Game Theory in the full CV, not these one-page resumes.
- Preserve the USC-only bachelor's education entry; UCSC may appear in teaching.
- Do not invent impact numbers or imply that submitted papers are accepted.
- AI Doctor has no public link. Fridge Manager links to https://howtoeat.food.
- Retain the internship window until the owner changes it.

## Build

Install TeX Live / MacTeX (XeLaTeX, latexmk, fontspec, xeCJK, enumitem,
titlesec, needspace, hyperref, TeX Gyre and Fandol fonts) and Poppler.
The template uses TeX-distributed fonts rather than machine-specific fonts.

From the repository root:

```sh
bash resumes/build.sh
```

The build checks one-page Letter PDFs, missing glyphs, overfull boxes, and text
extraction before replacing any committed PDFs. Temporary output stays in the
ignored `build/` directory. Visually inspect all four PDFs after changing content
or typography, and commit the regenerated PDFs with their sources.

Shared typography and contact information: `resume.sty`. Role descriptions and
education are maintained independently in each `.tex` file. When facts change,
update the two CVs, relevant archive entries, and all applicable resume variants.
