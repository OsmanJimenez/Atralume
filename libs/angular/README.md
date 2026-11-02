# @atralume/angular

Accessible Angular UI primitives and composable components for applications
that use standalone APIs, Angular SSR, or zoneless change detection.

## Install

```bash
npm install @atralume/angular
```

The package declares Angular 22, RxJS 7, and the Angular CDK as peer
dependencies. Use the Angular versions already used by your application.

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

## Styles and themes

Load the public stylesheet exposed by the package when the component you use
requires it. The distributed `styles/` directory is part of the package
contract; generated maps, tests, Storybook stories, and source files are not.

## Compatibility

- Angular: `^22.2.0`
- Node.js: `>=24.19.0`
- npm: `>=11.9.0`

For migrations, security reporting, release notes, and contribution guidance,
see the repository's `docs/migrations`, `SECURITY.md`, `CHANGELOG.md`, and
`CONTRIBUTING.md`.
