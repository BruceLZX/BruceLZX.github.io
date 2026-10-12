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
- AI Engineer: emphasize what was built, the technical contribution, and the
  resulting capability or measured outcome. Test/check/file counts do not substitute
  for accomplishments and should stay out of the application resumes.
- Keep skills near the top of both resumes, ordered for the intended role.
- Write English and Chinese separately. Keep dates, affiliations, links, publication
  status, and factual claims aligned; sentence structure need not match.
- Keep CrAIg Capital and Game Theory in the full CV, not these one-page resumes.
- Preserve the USC-only bachelor's education entry; UCSC may appear in teaching.
- Do not invent impact numbers or imply that submitted papers are accepted.
- AI Doctor has no public link. Fridge Manager links to https://howtoeat.food.
- Retain the internship window until the owner changes it.

## Layout and writing references

The current revision follows the useful conventions in
[MIT's resume checklist](https://capd.mit.edu/resources/resume-checklist/),
[MIT's accomplishment-statement guide](https://capd.mit.edu/resources/resumes-writing-about-your-skills/),
and its [CS master's samples](https://capd.mit.edu/resources/sample-resumes/).
[Stanford's resume handout](https://careered.stanford.edu/sites/g/files/sbiybj22801/files/media/file/developing_your_resume_handout.pdf)
also informs the typography and emphasis.

- Use a single text column, 11 pt body text, 0.6 inch side margins, and
  0.55 inch top/bottom margins. Keep contact details on one line.
- Keep most bullets within one or two lines: contribution, method, then
  outcome or scope. Use only numbers already supported by the owner’s record.
- Give more space to relevant research/engineering evidence; do not add
  unrelated entries merely to fill the page.
- Align dates, use reverse chronology within experience sections, and
  reserve bold emphasis for headings and a few meaningful results or scope figures.
- Verify selectable text and reading order in the exported PDFs; this is not
  a guarantee of compatibility with every applicant tracking system.

## Build

Install Python 3.10+, TeX Live / MacTeX (XeLaTeX, latexmk, fontspec, xeCJK,
enumitem, titlesec, needspace, hyperref, TeX Gyre and Fandol fonts) and Poppler.
The template uses TeX-distributed fonts rather than machine-specific fonts.

From the repository root:

```sh
python -m pip install -r resumes/requirements.txt
python resumes/build.py
```

The shell wrapper `bash resumes/build.sh` is also available; set `PYTHON` to
select a Python interpreter if needed. The build checks one-page Letter PDFs,
missing glyphs, overfull boxes, paper links, and meaningful text extraction with
both pypdf and Poppler before replacing any public PDFs. It embeds missing
Fandol ToUnicode maps from the installed source fonts, so Chinese text does not
depend on a reader's external Adobe character maps. It validates the Chinese
phrases in each source, not merely whether the extracted text is nonempty.
Temporary output stays in the ignored `build/` directory. Visually inspect all
four PDFs after changing content or typography, and commit regenerated PDFs
with their sources.

## Evidence and scope

- Pre-Scoring: [arXiv v4](https://arxiv.org/abs/2505.11040v4), abstract:
  ChatGLM at 131k-token contexts, fixed interaction budget, integrated with
  HyperAttention; perplexity 12.0 to 9.5. This is not a measured speedup claim.
- MedTokenBudget: [Table 2](https://arxiv.org/html/2609.30613v1): ISIC 2019,
  30% token budget, three seeds; supervised LATS accuracy 80.38 +/- 0.18%,
  ToMe 76.93 +/- 0.03%. The router is post-backbone; the frozen backbone is
  unchanged. Do not equate token reduction with end-to-end compute savings.
- Mass-Conservation: retain the supplied submission status; author order and
  numerical results have not been supplied. Do not infer either.
- PMAOS delivery/deployment status, business impact, and additional clinical
  workflow outcomes must not be inferred from code or test counts.
- Fridge Manager and Synaptics remain in the full CV/archive. The AI application
  resume selects AI Doctor and the business-card workflow for relevance.
- The research resume prioritizes papers, research experience, and teaching;
  the full CV retains the broader industry record.

Further writing references: [CMU's 2026 graduate guide](https://www.cmu.edu/career/documents/sample-resumes-cover-letters/graduate_student_resume_guide_2026.pdf)
and [DeepMind's role descriptions](https://deepmind.google/careers/).

Shared typography and contact information: `resume.sty`. Role descriptions and
education are maintained independently in each `.tex` file. When facts change,
update the two CVs, relevant archive entries, and all applicable resume variants.
