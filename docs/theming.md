# Token and theming architecture

## Layers and source

The JSON under `libs/angular/tokens/source` is the authoritative Design Tokens Community Group 2025.10 source. Every token declares or inherits `$type`; aliases use DTCG references. Reference tokens hold palettes and scales, system tokens communicate semantic intent, and component tokens specialize the Button pilot.

Style Dictionary 5.6.0 transforms the source. `npm run tokens:check` validates schema declarations, types, aliases, theme parity, critical contrast, determinism, and environment-independent output. `tokens:build` produces CSS and `token-manifest.json`; generated artifacts are ignored because the Nx library and Storybook targets declare `tokens-build` as a dependency with explicit inputs and outputs.

## Public contract

- `@atralume/angular/styles` — Sass entry.
- `@atralume/angular/styles/theme.css` — complete CSS contract without reset.
- `@atralume/angular/styles/tokens.json` — generated documentation/design-tool manifest.
- `@atralume/angular/styles/reset.scss` — optional minimal reset.

`light`, `dark`, and `system` work on the root or a nested scope. Without an attribute, light is deterministic. System follows `prefers-color-scheme` without JavaScript. Glass is selected independently through `data-atr-surface="glass"` and inherits the nearest theme.

Prefer system-token overrides for semantic theming and component-token overrides for a specific control. Consumers own the resulting contrast. Do not import source JSON or depend directly on reference tokens from application code.

## Maintenance

To add a token, place it in the correct DTCG source layer, add both light and dark semantic values when applicable, run `npm run tokens:check`, regenerate, and verify Storybook and the tarball. Deprecation uses a temporary alias only for a previously released public name; document it, then remove it in an announced breaking-change window.

Forced colors substitutes system colors and explicit borders. Reduced motion sets semantic durations to zero. Reduced transparency and unsupported backdrop filtering retain an opaque glass fallback.
