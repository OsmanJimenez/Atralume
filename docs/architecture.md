# Architecture

Atralume ships one publishable Angular library, `@atralume/angular`. Components do not become separate Nx projects or packages: stable consumer APIs are exposed as ng-packagr secondary entry points such as `@atralume/angular/button`. Consumers must never import `src`, `lib`, or an Atomic Design folder.

Internally, responsibilities flow downward:

1. `foundations` — tokens, themes, surfaces, contracts.
2. `primitives` — unstyled CDK/Aria infrastructure.
3. `atoms` — basic controls.
4. `molecules` — atom compositions.
5. `organisms` — complex sections.
6. `templates` — layouts using any lower layer.

A layer may depend on itself or a preceding layer, but cycles are forbidden. `tools/check-architecture.mjs` resolves relative imports and TypeScript aliases, ignores stories/tests as runtime edges, validates representative policy fixtures, and reports violations with source and target paths.

Components are standalone, strict, zoneless-compatible, and use OnPush change detection. CSS custom properties prefixed `--atr-` are the public styling contract. Theme (`data-atr-theme`) and surface treatment (`data-atr-surface`) are deliberately orthogonal. Angular Aria/CDK are available for future behavior but do not supply Atralume's visual styling.
