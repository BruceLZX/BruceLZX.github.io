#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
# PYTHON may select a virtual environment or bundled Python interpreter.
exec "${PYTHON:-python3}" build.py
