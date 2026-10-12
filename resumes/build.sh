#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
for dependency in latexmk xelatex pdfinfo pdftotext; do
  command -v "$dependency" >/dev/null || { echo "Missing dependency: $dependency" >&2; exit 1; }
done
mkdir -p build pdf
for profile in research-en research-zh ai-engineer-en ai-engineer-zh; do
  latexmk -xelatex -interaction=nonstopmode -halt-on-error -outdir=build "$profile.tex"
  pages=$(pdfinfo "build/$profile.pdf" | awk '/^Pages:/ {print $2}')
  size=$(pdfinfo "build/$profile.pdf" | awk '/^Page size:/ {print $3, $5}')
  if [[ "$size" != "612 792" ]]; then
    echo "$profile must use US Letter paper; found $size pt." >&2
    exit 1
  fi
  if [[ "$pages" != 1 ]]; then
    echo "$profile must be one page; found $pages." >&2
    exit 1
  fi
  if grep -Eq 'Overfull \\[hv]box|Missing character:' "build/$profile.log"; then
    echo "$profile has overflowing text or missing glyphs; inspect build/$profile.log." >&2
    exit 1
  fi
  pdftotext "build/$profile.pdf" "build/$profile.txt"
  test -s "build/$profile.txt"
done
# Publish PDFs only after every language/profile passes the build checks.
for profile in research-en research-zh ai-engineer-en ai-engineer-zh; do
  case "$profile" in
    research-en) filename="Zhexiang_Li_Research_Resume.pdf" ;;
    research-zh) filename="李哲骧_研究岗位简历.pdf" ;;
    ai-engineer-en) filename="Zhexiang_Li_AI_Engineer_Resume.pdf" ;;
    ai-engineer-zh) filename="李哲骧_AI工程师简历.pdf" ;;
  esac
  cp "build/$profile.pdf" "pdf/$filename"
done
