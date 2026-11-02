#!/usr/bin/env bash
# Package layout check only; behavior is covered by extension tests.
set -euo pipefail

project_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
required=(
  '.cursor-plugin/plugin.json'
  'skills/tech-stack-selector/SKILL.md'
  'skills/tech-stack-selector/references/modules.md'
  'skills/tech-stack-selector/references/presets.md'
  'skills/tech-stack-selector/references/compatibility.md'
  'skills/tech-stack-selector/templates/tech-stack-config.json'
  'skills/tech-stack-selector/templates/pom-fragment.xml'
  'skills/tech-stack-selector/templates/project-prompt.md'
  'skills/tech-stack-selector/templates/cursor-prompt.md'
  'commands/start.md'
  'commands/preset.md'
  'commands/export.md'
  'README.md'
  'LICENSE'
)

missing=0
for relative in "${required[@]}"; do
  if [[ -f "$project_root/$relative" ]]; then
    printf 'OK %s\n' "$relative"
  else
    printf 'MISSING %s\n' "$relative" >&2
    missing=$((missing + 1))
  fi
done
if (( missing > 0 )); then
  printf 'Package layout failed: %d missing files\n' "$missing" >&2
  exit 1
fi

if command -v node >/dev/null 2>&1; then
  node -e 'JSON.parse(require("fs").readFileSync(process.argv[1], "utf8"))' "$project_root/.cursor-plugin/plugin.json"
  printf 'OK plugin manifest JSON\n'
  node -e 'JSON.parse(require("fs").readFileSync(process.argv[1], "utf8"))' "$project_root/skills/tech-stack-selector/templates/tech-stack-config.json"
  printf 'OK example configuration JSON\n'
else
  printf 'SKIP manifest JSON syntax: node unavailable\n'
fi
if command -v xmllint >/dev/null 2>&1; then
  xmllint --noout "$project_root/skills/tech-stack-selector/templates/pom-fragment.xml"
  printf 'OK Maven root template XML\n'
else
  printf 'SKIP Maven template XML syntax: xmllint unavailable\n'
fi
printf 'Package layout passed; run production generator and Cursor UI tests separately.\n'
