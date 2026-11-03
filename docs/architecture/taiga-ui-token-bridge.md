# Atralume to Taiga UI token bridge

Atralume's DTCG tokens remain the source of design decisions. The generated
public theme stylesheet compiles Taiga UI 5's public theme, appearance, and
button styles, then maps Taiga's documented CSS custom-property theme surface
to Atralume semantic tokens.

The bridge is authored in
[`libs/angular/src/styles/taiga-bridge.scss`](../../libs/angular/src/styles/taiga-bridge.scss)
and generated with the workspace token build. Consumers load the public
stylesheet once:

```css
@import "@atralume/angular/styles/theme.css";
```

The `less` package is a pinned development-only compiler dependency used to
compile Taiga UI's published Less styles. It is not a runtime or package
dependency; no compiler is needed by Atralume consumers.

## Mapping

| Atralume contract                     | Taiga UI theme variables                                                                                                                             |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Primary and tertiary accent           | `--tui-background-accent-1*`, `--tui-background-accent-2*`, `--tui-text-primary-on-accent-1`, `--tui-text-primary-on-accent-2`, `--tui-text-action*` |
| Surface and elevation                 | `--tui-background-base`, `--tui-background-base-alt`, `--tui-background-elevation-*`, `--tui-shadow-*`, `--tui-theme-color` (layout aside)            |
| Interactive surfaces                  | `--tui-background-neutral-*`                                                                                                                         |
| Text and borders                      | `--tui-text-*`, `--tui-border-*`                                                                                                                     |
| Error, success, warning, and info     | `--tui-status-*`, `--tui-text-negative*`, `--tui-text-positive*`                                                                                     |
| Selection, autofill, and scrim        | `--tui-service-selection-background`, `--tui-service-autofill-background`, `--tui-service-backdrop`                                                  |
| Typography                            | `--tui-typography-*` and `--tui-typography-family-*`                                                                                                 |
| Shape and component dimensions        | `--tui-radius-*`, `--tui-height-*`, `--tui-padding-*`                                                                                                |
| Elevation, motion, and disabled state | `--tui-shadow-*`, `--tui-duration`, `--tui-curve-productive-standard`, `--tui-disabled-opacity`                                                      |
| Component primitives                  | `--tui-icon-size`, `--tui-progress-color`, `--tui-thumb-size`                                                                                        |

Taiga chart palette variables, viewport measurements, and directional
implementation values without an Atralume semantic equivalent retain Taiga's
defaults. Glass, overlay placement, density selection, and nested-overlay
propagation remain Atralume responsibilities; the bridge does not create
parallel Taiga tokens for them.

Because mapped values reference Atralume custom properties rather than copied
computed values, light, dark, system, nested themes, shape/brand modes
(`data-atr-shape`, `data-atr-brand`), surfaces, and consumer overrides resolve
through normal CSS inheritance into Taiga controls. Portaled overlays must
still be verified individually for theme-context propagation.

## Dependency and maintenance policy

- Taiga UI runtime packages remain peer dependencies; Less is build-only.
- The bridge uses the published `@taiga-ui/styles` theme and component Less
  entrypoints. It does not import Taiga source internals or copy implementation
  files into the repository.
- Update the mappings when upgrading Taiga UI, after reviewing its public
  theme variables and running token determinism, theme, component, package,
  and Storybook checks.
- Do not add a new CSS-valued component input or override Taiga selectors
  globally to customize a consumer brand.
