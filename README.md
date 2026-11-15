# Atralume

[![npm](https://img.shields.io/npm/v/@osmanjimenez/atralume.svg?logo=npm)](https://www.npmjs.com/package/@osmanjimenez/atralume)
[![license](https://img.shields.io/github/license/OsmanJimenez/Atralume.svg)](LICENSE)
[![Storybook](https://img.shields.io/badge/Storybook-docs-ff4785?logo=storybook)](https://atralume.osmanjimenez.dev/)
[![Angular](https://img.shields.io/badge/Angular-22-dd0031?logo=angular)](https://angular.dev/)

**Accessible Angular design system** — components, DTCG tokens, and themes with
a stable brand API on top of [Taiga UI](https://taiga-ui.dev/) 5.

| | |
| --- | --- |
| **npm** | [`@osmanjimenez/atralume`](https://www.npmjs.com/package/@osmanjimenez/atralume) `0.2.3` (preview) |
| **Docs** | [atralume.osmanjimenez.dev](https://atralume.osmanjimenez.dev/) |
| **Repo** | Nx workspace · Angular 22 · Storybook 10 |

Atralume owns selectors, tokens, theming (`data-atr-theme` / `data-atr-surface`),
and documentation. Taiga provides primitives and interaction patterns under the
adapters — consumers import Atralume entrypoints only.

## Quick start (consumers)

```bash
npm install @osmanjimenez/atralume \
  @taiga-ui/core @taiga-ui/cdk @taiga-ui/kit @taiga-ui/layout \
  @taiga-ui/addon-table @taiga-ui/polymorpheus @taiga-ui/event-plugins
```

```ts
import { provideAtralume } from "@osmanjimenez/atralume";
import { TuiRoot } from "@taiga-ui/core";
import { AtralumeButton } from "@osmanjimenez/atralume/button";
import { AtralumeCard } from "@osmanjimenez/atralume/card";
import { AtralumeFormField } from "@osmanjimenez/atralume/form-field";
import { AtralumeGrid, AtralumeGridItem } from "@osmanjimenez/atralume/grid";
import { AtralumeInput } from "@osmanjimenez/atralume/input";

bootstrapApplication(App, {
  providers: [provideAtralume()],
});
```

```html
<tui-root>
  <button atrButton type="button">Continue</button>

  <atr-form-field>
    <tui-textfield tuiTextfieldSize="m">
      <label tuiLabel>Email</label>
      <input atrInput type="email" autocomplete="email" />
    </tui-textfield>
  </atr-form-field>

  <atr-grid columns="auto" gap="md" minTrack="14rem">
    <atr-card appearance="elevated" atrGridItem>…</atr-card>
    <atr-card appearance="outlined" atrGridItem [span]="2">…</atr-card>
  </atr-grid>
</tui-root>
```

```css
@import "@osmanjimenez/atralume/styles/theme.css";
```

```html
<html data-atr-theme="system">
  <div data-atr-surface="glass">…</div>
</html>
```

Use the peer versions declared by the package; do not bypass conflicts with
`--force`.

## What you get

- **Actions & identity** — button, icon-button, fab, link, avatar, badge, icon
- **Forms** — form-field, input, textarea, checkbox, radio, switch, select, …
- **Overlays** — dialog, bottom-sheet, menu, snackbar, tooltip, popover, command palette
- **Navigation** — tabs, breadcrumbs, pagination, side-navigation, navigation-bar
- **Composition & data** — card, list, accordion, skeleton, **grid**, table, tree
- **Tokens** — DTCG source, generated CSS variables, light / dark / glass

Explore every story: **[atralume.osmanjimenez.dev](https://atralume.osmanjimenez.dev/)**.

## Develop in this repository

```bash
nvm use          # Node 24.19.0
npm ci
npm start        # playground
npm run storybook  # http://127.0.0.1:6006
```

| Command | Purpose |
| --- | --- |
| `npm run build` | Package `@osmanjimenez/atralume` |
| `npm run build:storybook` | Static Storybook for Pages |
| `npm run tokens:build` | Generate CSS variables and token manifest |
| `npm run verify` | Full local / CI gate |
| `npm run release:dry-run` | Build, audit, pack; never publishes |

```text
apps/playground        Consumer application
libs/angular           Publishable package (@osmanjimenez/atralume)
  <component>/         Secondary entry points
  tokens/source        Authoritative DTCG tokens
  src/styles           Themes and generated artifacts
  .storybook           Living documentation
tools                  Architecture, package, and browser checks
docs                   Architecture, theming, releases, migrations
```

## Documentation

- [Architecture](docs/architecture.md) · [Theming](docs/theming.md) · [Releases](docs/releases.md)
- [Component maturity](docs/component-maturity.md) · [Changelog](CHANGELOG.md)
- [Taiga UI migration](docs/migrations/taiga-ui.md) · [Migration matrix](docs/architecture/taiga-ui-migration-matrix.md)
- [Deployment](docs/deployment.md) · [Contributing](CONTRIBUTING.md) · [Security](SECURITY.md)

## License

[MIT](LICENSE) · third-party notices in [THIRD_PARTY_LICENSES.md](THIRD_PARTY_LICENSES.md)
