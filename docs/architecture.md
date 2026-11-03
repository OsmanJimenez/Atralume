# Architecture

Atralume ships one publishable Angular library, `@atralume/angular`. Components do not become separate Nx projects or packages: stable consumer APIs are exposed as ng-packagr secondary entry points such as `@atralume/angular/button`. Consumers must never import `src`, `lib`, or an Atomic Design folder.

Taiga UI 5 is the **only** component and interaction runtime. Atralume is the **brand layer** on top: design tokens, theme bridge (`--atr-*` → `--tui-*`), and scope modes (`data-atr-theme`, `data-atr-surface`, `data-atr-shape`, `data-atr-brand`) that restyle every Taiga-backed control together. Thin `atr*` adapters may wrap public Taiga APIs; Atralume must not keep parallel UI engines. Never depend on Taiga private APIs, internal DOM, or undocumented CSS variables. See [ADR-001](architecture/adr/ADR-001-use-taiga-ui-as-component-foundation.md), [matrix](architecture/taiga-ui-migration-matrix.md), [checklist](architecture/taiga-ui-migration-checklist.md), and [status report](architecture/taiga-ui-migration-final-report.md).

Internally, responsibilities flow downward:

1. `foundations` — tokens, themes, surfaces, contracts.
2. `primitives` — unstyled CDK/Aria infrastructure.
3. `atoms` — basic controls backed by Taiga UI where an equivalent exists.
4. `molecules` — atom compositions.
5. `organisms` — complex sections.
6. `templates` — layouts using any lower layer.

A layer may depend on itself or a preceding layer, but cycles are forbidden. `tools/check-architecture.mjs` resolves relative imports and TypeScript aliases, ignores stories/tests as runtime edges, validates representative policy fixtures, and reports violations with source and target paths.

Components are standalone, strict, zoneless-compatible, and use OnPush change detection. CSS custom properties prefixed `--atr-` are the public styling contract. Theme (`data-atr-theme`) and surface treatment (`data-atr-surface`) are deliberately orthogonal. Taiga UI provides behavior and component primitives; Atralume tokens and styles provide the public brand contract.

Design tokens use three layers: DTCG reference scales, semantic system roles, and minimal component aliases. Style Dictionary generates cached CSS and manifests before the library and Storybook builds. See [theming](theming.md) for the public contract and maintenance workflow.
