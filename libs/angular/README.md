# @osmanjimenez/atralume

[![npm version](https://img.shields.io/npm/v/@osmanjimenez/atralume.svg)](https://www.npmjs.com/package/@osmanjimenez/atralume)
[![license](https://img.shields.io/npm/l/@osmanjimenez/atralume.svg)](https://github.com/OsmanJimenez/Atralume/blob/master/LICENSE)
[![Node](https://img.shields.io/node/v/@osmanjimenez/atralume.svg)](https://www.npmjs.com/package/@osmanjimenez/atralume)
[![docs](https://img.shields.io/badge/docs-Storybook-ff4785)](https://atralume.osmanjimenez.dev/)

**Atralume** is an accessible Angular design system: production-ready UI
primitives, DTCG design tokens, and light / dark / glass themes. Taiga UI 5
powers behavior under the hood; Atralume owns the public API, tokens, and brand.

> **Maturity:** preview (`0.2.4`). APIs may receive documented adjustments before
> a stable `1.0.0`. See [component maturity](https://github.com/OsmanJimenez/Atralume/blob/master/docs/component-maturity.md).

## Why Atralume

- **Brand-first API** — import `@osmanjimenez/atralume/button`, not Taiga internals
- **Token-driven theming** — DTCG source → CSS variables; `data-atr-theme` / `data-atr-surface`
- **Native-friendly forms** — checkbox, radio, switch, input, and textarea keep browser semantics
- **Icon catalog** — search ~2,191 names via `@osmanjimenez/atralume/icon/catalog`; render with `atr-icon` (`registry` / `tui` / `auto`)
- **Living docs** — every family ships Storybook stories on GitHub Pages

## Install

```bash
npm install @osmanjimenez/atralume \
  @taiga-ui/core @taiga-ui/cdk @taiga-ui/kit @taiga-ui/layout \
  @taiga-ui/addon-table @taiga-ui/polymorpheus @taiga-ui/event-plugins
```

Peer ranges match the package: Angular `^22.2.0`, Taiga UI `^5.31.0`, RxJS `^7.8.0`.
Do not resolve peer conflicts with `--force`.

## Quick start

```ts
import { bootstrapApplication } from "@angular/platform-browser";
import { provideAtralume } from "@osmanjimenez/atralume";
import { TuiRoot } from "@taiga-ui/core";
import { App } from "./app";

bootstrapApplication(App, {
  providers: [provideAtralume()],
});
```

```ts
@Component({
  imports: [TuiRoot],
  template: `<tui-root><router-outlet /></tui-root>`,
})
export class App {}
```

```ts
import { AtralumeButton } from "@osmanjimenez/atralume/button";
import { AtralumeGrid } from "@osmanjimenez/atralume/grid";
import { AtralumeIcon, provideAtralumeIcons } from "@osmanjimenez/atralume/icon";
import { searchAtralumeIcons } from "@osmanjimenez/atralume/icon/catalog";
```

```html
<button atrButton type="button">Continue</button>

<atr-icon engine="tui" name="@tui.heart" [decorative]="false" label="Favorite" />

<atr-grid columns="auto" gap="md" minTrack="14rem">
  <!-- cards, form sections, media tiles -->
</atr-grid>
```

Load styles once (CSS or Sass):

```css
@import "@osmanjimenez/atralume/styles/theme.css";
```

```scss
@use "@osmanjimenez/atralume/styles";
```

```html
<html data-atr-theme="system">
  <div data-atr-surface="glass">…</div>
</html>
```

Token metadata: `@osmanjimenez/atralume/styles/tokens.json`.

## Catalogue (secondary entries)

Import from the documented entrypoint (for example `/button`, `/form-field`,
`/dialog`, `/snackbar`, `/table`, `/grid`). Do not import from `src`, `fesm2022`,
or other generated paths.

| Area        | Examples                                                          |
| ----------- | ----------------------------------------------------------------- |
| Actions     | button, icon-button, fab, speed-dial, link                        |
| Forms       | form-field, input, textarea, checkbox, switch, **file-upload**    |
| Overlays    | dialog, menu, snackbar, tooltip, popover                          |
| Navigation  | **tabs**, breadcrumbs, side-navigation, nav-bar, **stepper**      |
| Composition | **card**, list, accordion, skeleton, **grid**                     |
| Media       | image, image-gallery, **image-360** (gyro / VR light)             |
| Data        | table, tree, carousel, timeline                                   |
| Icons       | icon (`atr-icon`), **icon/catalog** (~2,191 searchable names)     |

Full inventory and stories: [Storybook](https://atralume.osmanjimenez.dev/).

### Notable 0.2.4 surfaces

```ts
import { AtralumeImage360 } from "@osmanjimenez/atralume/image-360";
import { AtralumeFileUpload } from "@osmanjimenez/atralume/file-upload";
import { AtralumeStepper, AtralumeStep } from "@osmanjimenez/atralume/stepper";
```

```html
<atr-image-360 [src]="panoramaUrl" alt="Suite looking toward the terrace" label="Suite 12" />
<atr-file-upload label="Attachments" multiple accept="image/*,.pdf" />
```

Browse **Foundations / Icon Explorer** for copyable `@tui.*` snippets.

## Compatibility

| Runtime   | Range        |
| --------- | ------------ |
| Angular   | `^22.2.0`    |
| Node.js   | `>=24.19.0`  |
| npm       | `>=11.9.0`   |

## Links

- [Storybook / docs](https://atralume.osmanjimenez.dev/)
- [Changelog](https://github.com/OsmanJimenez/Atralume/blob/master/CHANGELOG.md)
- [Theming](https://github.com/OsmanJimenez/Atralume/blob/master/docs/theming.md)
- [Issues](https://github.com/OsmanJimenez/Atralume/issues)
- [npm package](https://www.npmjs.com/package/@osmanjimenez/atralume)

## License

MIT © Osman Jimenez
