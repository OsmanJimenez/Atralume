# Atralume

Atralume is an Angular design-system foundation built with Nx, Storybook, DTCG design tokens, CSS custom properties, and an internal Atomic Design architecture.

## Status

Phase 1 provides generated reference, system, and Button tokens with light, dark, and system themes. The semantic Button remains the only pilot component; a broader catalogue is intentionally deferred.

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

## Use the Button

```ts
import { AtralumeButton } from "@atralume/angular/button";
```

```html
<button atrButton type="button">Continue</button>
```

Load the public theme stylesheet and select a theme independently from the surface treatment:

```scss
@use "@atralume/angular/styles/theme.css";
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
  button               Secondary entry point
  tokens/source        Authoritative DTCG token source
  src/styles           Public themes and generated artifacts
  src/lib/atoms        Button implementation
  .storybook           Living documentation
tools                  Architecture, package, PR, and browser checks
docs                   Technical and delivery documentation
```

See [architecture](docs/architecture.md), [theming](docs/theming.md), [branching](docs/branching.md), [deployment](docs/deployment.md), and [roadmap](docs/roadmap.md).
