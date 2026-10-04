# Atralume design tokens

The JSON files in `source` are the authoritative DTCG 2025.10 token source. Run `npm run tokens:build` to generate public CSS and the documentation manifest. Generated files are intentionally ignored: every consuming Nx target depends on deterministic generation, and `tokens:check` builds twice in temporary directories to detect drift or nondeterminism.

Reference tokens define scales, system tokens express semantic intent, and component tokens specialize that intent for the Button pilot. Applications should override system or component tokens rather than relying directly on reference tokens.
