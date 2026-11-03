# Atralume

Atralume is an Angular design system built with Nx, Storybook, DTCG design tokens, CSS custom properties, and an internal Atomic Design architecture. Taiga UI 5 is the technical foundation for component behavior and primitives; Atralume owns its consumer API, tokens, themes, and visual identity.

## Status

The Angular library includes a token-driven component catalogue for actions,
navigation, identity, status, activity, and native form controls. The Taiga UI
migration is in progress component-by-component; its permanent decision and
verified inventory are documented in the [ADR](docs/architecture/adr/ADR-001-use-taiga-ui-as-component-foundation.md)
and [migration matrix](docs/architecture/taiga-ui-migration-matrix.md).

## Requirements

- Node.js 24.19.0 (`nvm use`)
- npm 11.9.0 (`packageManager` is pinned)

## Install and run

```bash
nvm use
npm ci
npm start
```

Storybook runs with `npm run storybook` on port 6006. The public deployment target is <https://osmanjimenez.github.io/Atralume/>; availability depends on the repository Pages environment described in [deployment](docs/deployment.md).

## Use the atoms

Consumers install Atralume and its Taiga UI peer package:

```bash
npm install @atralume/angular @taiga-ui/core @taiga-ui/cdk @taiga-ui/kit
```

Register providers in the application config:

```ts
import { provideTaiga } from "@taiga-ui/core";
import { provideEventPlugins } from "@taiga-ui/event-plugins";

bootstrapApplication(App, {
  providers: [provideEventPlugins(), provideTaiga()],
});
```

Use the peer versions published by `@atralume/angular`; do not bypass Angular
or Taiga UI peer conflicts with `--force`.

```ts
import { AtralumeButton } from "@atralume/angular/button";
import { AtralumeCheckbox } from "@atralume/angular/checkbox";
import { AtralumeFormField } from "@atralume/angular/form-field";
import { AtralumeInput } from "@atralume/angular/input";
```

```html
<button atrButton type="button">Continue</button>

<label>
  <input atrCheckbox type="checkbox" />
  Accept the terms
</label>

<atr-form-field>
  <tui-textfield tuiTextfieldSize="m">
    <label tuiLabel>Email</label>
    <input atrInput type="email" autocomplete="email" />
  </tui-textfield>
</atr-form-field>
```

Load the public Sass entry once for token and component styles, then select a theme independently from the surface treatment:

```scss
@use "@atralume/angular/styles";
```

```html
<html data-atr-theme="dark">
  <div data-atr-surface="glass">...</div>
</html>
```

Use `data-atr-theme="system"` to follow the operating-system preference without JavaScript. Generated token metadata is available through `@atralume/angular/styles/tokens.json`.

## Commands

| Command                      | Purpose                                             |
| ---------------------------- | --------------------------------------------------- |
| `npm start`                  | Serve the playground                                |
| `npm run storybook`          | Serve Storybook on port 6006                        |
| `npm run build`              | Package `@atralume/angular`                         |
| `npm run build:playground`   | Production playground build                         |
| `npm run build:storybook`    | Static Storybook build                              |
| `npm run lint`               | Lint every project                                  |
| `npm run format:check`       | Check formatting                                    |
| `npm run check:architecture` | Enforce internal atomic boundaries and cycles       |
| `npm run test:unit`          | Run unit tests once                                 |
| `npm run check:package`      | Install the tarball in an isolated Angular consumer |
| `npm run catalog:audit`      | Report catalogue coverage gaps                      |
| `npm run api:check`          | Enforce the public declaration baseline             |
| `npm run bundle:check`       | Enforce compressed ESM size budgets                 |
| `npm run sbom`               | Generate an SPDX SBOM for the built package         |
| `npm run release:dry-run`    | Build, audit, pack, checksum; never publishes       |
| `npm run check:storybook`    | Browser smoke test at `/Atralume/`                  |
| `npm run tokens:build`       | Generate CSS variables and token manifest           |
| `npm run tokens:check`       | Validate DTCG, parity, contrast, and determinism    |
| `npm run tokens:inspect`     | Print token counts and resolution status            |
| `npm run lint:styles`        | Lint styles and reject public visual literals       |
| `npm run test:themes`        | Check computed themes in a real browser             |
| `npm run verify`             | Run the complete local/CI gate                      |

## Structure

```text
apps/playground        Real consumer application
libs/angular           Publishable package
  <component>/         Secondary entry points and component source
    src/lib/            components, directives, docs, stories, tests, harnesses
  tokens/source        Authoritative DTCG token source
  src/styles           Public themes and generated artifacts
  .storybook           Living documentation
tools                  Architecture, package, PR, and browser checks
docs                   Technical and delivery documentation
```

See [architecture](docs/architecture.md), [theming](docs/theming.md), [branching](docs/branching.md), [deployment](docs/deployment.md), [release policy](docs/releases.md), [migration guides](docs/migrations/README.md), [Taiga UI migration](docs/migrations/taiga-ui.md), [third-party licenses](THIRD_PARTY_LICENSES.md), and [roadmap](docs/roadmap.md). The current component maturity is documented in [component maturity](docs/component-maturity.md).
