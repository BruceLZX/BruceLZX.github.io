# Application resumes

Two independently written profiles, each in English and Chinese. These are not
print styles or shortened exports of the web CV.

| Profile | Source | Download |
| --- | --- | --- |
| Research, English | `research-en.tex` | `pdf/Zhexiang_Li_Research_Resume.pdf` |
| Research, 中文 | `research-zh.tex` | `pdf/李哲骧_研究岗位简历.pdf` |
| AI Engineer, English | `ai-engineer-en.tex` | `pdf/Zhexiang_Li_AI_Engineer_Resume.pdf` |
| AI Engineer, 中文 | `ai-engineer-zh.tex` | `pdf/李哲骧_AI工程师简历.pdf` |

The web CV lives in `../cv.html` and `../cv_zh.html`, with its own `../cv.css`.
It retains the broader professional record and puts technical skills last.
Resume downloads appear in the experience archive, not the homepage header.
Public PDF filenames include the applicant's name and target role and are ready
for submission. Keep these names stable when rebuilding; short language/profile
identifiers are only used for source and intermediate files.

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
