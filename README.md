# Atralume

Atralume is an Angular design-system foundation built with Nx, Storybook, CSS custom properties, and an internal Atomic Design architecture. Phase 0 proves the full path from source code to a consumable package and public Storybook.

## Status

Phase 0 contains one pilot component: a semantic, standalone Button. A broader component catalogue is intentionally deferred.

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
| `npm run verify`             | Run the complete local/CI gate                      |

## Structure

```text
apps/playground        Real consumer application
libs/angular           Publishable package
  button               Secondary entry point
  src/lib/foundations  Tokens and themes
  src/lib/atoms        Button implementation
  .storybook           Living documentation
tools                  Architecture, package, PR, and browser checks
docs                   Technical and delivery documentation
```

See [architecture](docs/architecture.md), [branching](docs/branching.md), [deployment](docs/deployment.md), and [roadmap](docs/roadmap.md).
