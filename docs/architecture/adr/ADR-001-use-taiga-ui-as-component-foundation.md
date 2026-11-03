# ADR-001: Use Taiga UI as Atralume's component foundation

- Status: Accepted (amended)
- Date: 2026-11-02
- Amended: 2026-11-02 — Atralume is a brand/modes layer over Taiga, not a parallel kit

## Context

Atralume publishes `@atralume/angular` with tokens, themes, and (historically)
its own component implementations. Maintaining a second full UI kit beside
Taiga UI increases cost and fights the product goal: **one behavior foundation
(Taiga) and one brand layer (Atralume)**.

Taiga UI 5 targets Angular ≥19 (includes this repo’s Angular 22). License:
Apache-2.0 for Taiga; Atralume remains MIT with attribution.

## Decision

**Taiga UI 5 is the only UI runtime.** Atralume does not keep parallel
component engines. Atralume’s job is brand and customization:

- Design tokens (`--atr-*`) and generated `theme.css`
- Token bridge mapping `--tui-*` ← `--atr-*`
- Scope modes that restyle **all** Taiga-backed controls together:
  - `data-atr-theme` — light / dark / system
  - `data-atr-surface` — standard / elevated / glass / transparent
  - `data-atr-shape` — sharp / rounded / pill (radius / curve)
  - `data-atr-brand` — default / green (accent palettes; extensible)
- `provideAtralume()` — registers Taiga providers for consumers
- Optional **thin** `atr*` adapters that only host/compose public Taiga APIs

Architecture:

```
Consumers
  → provideAtralume() + <tui-root> + theme.css + data-atr-* modes
  → thin atr* adapters (optional)
       → Taiga UI 5 (+ Angular CDK where Taiga uses it)
```

## Non-goals

- A second listbox/select/calendar/accordion/table implementation “until the
  API matches.”
- Component SCSS that reimplements Taiga layout beyond tokens/modes.
- Terminal matrix status `exception` meaning “keep Atralume UI forever.”

## Migration policy

1. Prefer a public Taiga primitive (`hostDirectives`, composition, or service).
2. **Breaking Atralume API is allowed** when aligning to Taiga hosts
   (`tui-textfield`, `TuiSelect`, `TuiDay`, etc.). Document each break.
3. If Taiga has no equivalent, **compose** the closest Taiga/CDK surface
   (dialog, drawer, dropdown, CSS). Do not invent a parallel kit.
4. Matrix statuses: `pending` → `in-progress` → `migrated` | `composed` |
   `removed`. No `exception` as an end state.

## Theming and tokens

Atralume tokens remain the brand source of truth. The bridge maps them onto
Taiga’s published CSS custom properties so modes and consumer overrides flow
into every Taiga control. See
[token bridge](../taiga-ui-token-bridge.md).

## Public API and packaging

- One npm package with secondary entrypoints may still expose thin `atr*` APIs.
- Taiga packages are **required** peers (`cdk`, `core`, `kit`, `layout`,
  `polymorpheus`; `addon-table` for Table).
- Do not re-export Taiga types as Atralume API unless documented.
- Do not deep-import Taiga internals or patch `node_modules`.

## Consequences

- Consumers install Taiga peers and load Atralume theme once.
- Form/overlay APIs may break during waves that align to Taiga hosts.
- Bundle size includes Taiga; measure before release claims.
- Glass / shape / brand modes must be verified on portaled overlays.

## Updates

Amend this ADR when modes expand or when a composed gap is retired in favor of
a new Taiga primitive.
