# @atralume/angular

Accessible Angular UI primitives and composable components for applications
that use standalone APIs, Angular SSR, or zoneless change detection.

## Install

```bash
npm install @atralume/angular \
  @taiga-ui/core @taiga-ui/cdk @taiga-ui/kit @taiga-ui/layout \
  @taiga-ui/addon-table @taiga-ui/polymorpheus
```

The package declares Angular 22, RxJS 7, Angular CDK, and Taiga UI 5 as peer
dependencies. Required Taiga peers include `cdk`, `core`, `kit`, `layout`,
`addon-table`, and `polymorpheus`. Call `provideAtralume()` once in the app
config and load `@atralume/angular/styles/theme.css`. Use Angular versions
already used by your application.

## Use a component

Import public symbols from the root package or the documented secondary
entrypoint. Do not import from `src`, `fesm2022`, or another generated path.

```ts
import { AtralumeButton } from "@atralume/angular/button";
```

The component catalogue, accessibility notes, and examples are published in
the project documentation. Components are currently marked **Preview** while
the public API stabilises; see `docs/component-maturity.md` in the repository
for the support policy.

Atralume keeps its own component API and design tokens while using Taiga UI's
public components and primitives internally. Import Atralume components from
their documented secondary entrypoints; do not rely on Taiga UI implementation
details or import from Atralume's internal paths.

## Styles and themes

Load the generated public stylesheet once. It contains Atralume tokens, the
theme bridge, and Taiga styles used by migrated components:

```css
@import "@atralume/angular/styles/theme.css";
```

Taiga UI remains a peer dependency. The Less compiler is used only while
building the workspace stylesheet and is not required by consuming
applications. The distributed `styles/` directory is part of the package
contract; generated maps, tests, Storybook stories, and source files are not.

## Compatibility

- Angular: `^22.2.0`
- Node.js: `>=24.19.0`
- npm: `>=11.9.0`

For migrations, security reporting, release notes, and contribution guidance,
see the repository's `docs/migrations`, `SECURITY.md`, `CHANGELOG.md`, and
`CONTRIBUTING.md`.
