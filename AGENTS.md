# Atralume Agent Guidelines

## Purpose

This file defines the permanent engineering, architecture, design, documentation, testing, accessibility, packaging, repository hygiene, and Git authority rules for Atralume.

These rules apply to every AI agent, developer, automation, script, and generated change in this repository.

Phase prompts define temporary scope and deliverables.

This file defines how work must always be performed.

Do not add phase-specific instructions, temporary branches, issue numbers, pull request numbers, or one-time implementation details to this file.

If a task prompt conflicts with this file:

1. Stop the conflicting work.
2. Explain the conflict.
3. Ask the user for direction.
4. Do not silently choose one instruction over the other.

---

# 1. Repository authority

The user owns and controls the repository.

Unless explicitly authorized, an agent must not:

- Create commits.
- Amend commits.
- Push branches.
- Delete branches.
- Create pull requests.
- Merge pull requests.
- Create tags.
- Create GitHub Releases.
- Publish npm packages.
- Change remote repository settings.
- Change branch protections.
- Configure npm trusted publishing remotely.
- Deploy external services.
- Add secrets.
- Rotate credentials.

An agent may:

- Inspect the local repository.
- Modify local files within the requested scope.
- Run local validation.
- Build artifacts locally.
- Generate tarballs locally.
- Prepare workflows and documentation.
- Report commands the user must execute manually.

Never claim that a remote operation was completed unless it was explicitly authorized and verified.

---

# 2. Required first actions

Before modifying the repository, every agent must:

1. Read this entire `AGENTS.md`.
2. Inspect the repository structure.
3. Inspect `package.json`.
4. Inspect the package manager lockfile.
5. Inspect `nx.json`.
6. Inspect project configurations.
7. Inspect `.storybook/`.
8. Inspect existing tokens and styles.
9. Inspect public entrypoints.
10. Inspect the current Git status.
11. Identify existing user changes.
12. Run or document the current validation baseline.
13. Determine the exact task scope.
14. Preserve unrelated changes.

Useful inspection commands include:

```bash
git status --short
rg --files
npx nx show projects
```

Before inventing a command, inspect the existing scripts and Nx targets.

Do not assume project names, paths, selectors, prefixes, package manager, test runner, or build commands.

---

# 3. Technology baseline

The expected technical baseline is:

- Angular 22.
- Nx 23.
- Storybook 10.
- TypeScript strict mode.
- Standalone Angular APIs.
- Angular Signals.
- Zoneless compatibility.
- SSR compatibility.
- Hydration compatibility.
- Sass and CSS Custom Properties.
- DTCG-compatible design tokens.
- Style Dictionary or the existing token compiler.
- Storybook MDX.
- Component Harnesses.
- WCAG 2.2 AA.

The repository configuration is the source of truth for exact installed versions.

Do not upgrade major versions as part of an unrelated task.

Do not downgrade packages to avoid solving compatibility issues.

---

# 4. Installed tooling and plugin discovery

The repository may already contain design, documentation, accessibility, testing, theming, visual regression, and token-generation plugins.

Before installing, removing, replacing, or configuring a plugin, inspect:

- `package.json`.
- The lockfile.
- `.storybook/main.*`.
- `.storybook/preview.*`.
- `.storybook/manager.*`.
- Nx project configuration.
- Test configuration.
- Existing scripts.
- Existing addon configuration.

Search for relevant tooling:

```bash
rg -n \
  "storybook|addon|a11y|themes|designs|docs|mdx|compodoc|chromatic|playwright|vitest|axe|style-dictionary|tokens|angular/cdk|angular/aria" \
  package.json \
  nx.json \
  .storybook \
  apps \
  libs
```

Do not install a second plugin that provides a capability already present.

Do not replace an installed plugin without documenting:

- Why it is insufficient.
- What replaces it.
- Compatibility impact.
- Migration impact.
- Bundle impact.
- Maintenance impact.

---

# 5. Design tooling standards

The design toolchain should provide the following capabilities when configured in the repository.

## 5.1 Storybook Docs and MDX

Use Storybook Docs and MDX for editorial component documentation.

Each public component or directive must have one canonical MDX document.

Do not generate multiple documentation pages for the same component.

The expected navigation is:

```text
Component
  Docs
  Default
  Variants
  States
  Examples
```

Do not leave structures such as:

```text
DOCS
  forms
    checkbox.docs
```

Do not show physical filenames in the sidebar.

Do not simultaneously expose:

```text
Docs
Documentation
component.docs
```

Attach MDX to its story module using the Storybook API supported by the installed version.

Use one canonical page named `Docs`.

## 5.2 Storybook accessibility addon

The accessibility addon must be treated as a quality gate.

Expected project-level behavior:

```ts
parameters: {
  a11y: {
    test: 'error',
  },
}
```

Do not disable accessibility rules globally to obtain a green build.

Any exception must be:

- Local to the affected story.
- Documented.
- Justified.
- Temporary when possible.
- Referenced in the final report.

Automated accessibility tests do not replace manual keyboard and screen-reader review.

## 5.3 Storybook themes

Use the installed themes integration for:

- Light.
- Dark.
- System.
- Nested themes.
- Surface context.
- Glass context.

Do not implement a second, unrelated Storybook theme switcher.

The Storybook theme toolbar must use the same public theming mechanism that consumers use.

Storybook-only theme behavior must not hide defects in the published package.

## 5.4 Storybook interactions and testing

Use `play` functions for meaningful user behavior:

- Keyboard navigation.
- Pointer interactions.
- Form updates.
- Open/close.
- Selection.
- Focus restoration.
- Error states.
- Async states.

Do not add empty or ceremonial interaction tests.

Stories are executable examples and must remain deterministic.

## 5.5 Viewport and responsive tooling

Use Storybook viewport capabilities for:

- Mobile.
- Tablet.
- Desktop.
- Large desktop.

Responsive components must include representative viewport stories.

Do not hardcode layout based exclusively on Storybook dimensions.

## 5.6 Backgrounds and surfaces

Stories must demonstrate relevant components over:

- Standard surface.
- Elevated surface.
- Transparent surface.
- Glass surface.

A glass story must contain a meaningful background with depth, gradients, shapes, or imagery.

A flat white background does not demonstrate `backdrop-filter`.

## 5.7 Design reference plugins

If a design-reference plugin such as a Figma or Storybook design addon is installed:

- Use it to link approved design references.
- Do not treat screenshots as implementation specifications.
- Do not copy generated CSS blindly.
- Do not expose private design URLs.
- Do not require authentication to build Storybook.
- Keep references optional for runtime and CI.

Design files are references.

Design tokens and documented component contracts are the implementation source of truth.

## 5.8 Visual regression tooling

If Chromatic, Playwright screenshots, or another visual regression system is installed:

- Reuse it.
- Do not add a second provider without justification.
- Keep stories deterministic.
- Disable uncontrolled animations.
- Stabilize fonts, locale, timezone, random values, network data, and viewport.
- Never automatically approve changes on protected branches.
- Review intentional visual changes.

A paid external provider must not become mandatory without user authorization.

## 5.9 Compodoc or automatic API documentation

If Compodoc or an equivalent API extractor is installed:

- Use it for API metadata.
- Do not manually duplicate large API tables in MDX.
- Keep editorial guidance in MDX.
- Keep technical signatures generated from source.
- Ensure private APIs remain private.

## 5.10 Token tooling

If Style Dictionary or an equivalent compiler is installed:

- Treat source token files as authoritative.
- Do not manually edit generated outputs.
- Generate CSS, TypeScript, JSON, or documentation through the configured build.
- Preserve DTCG-compatible structures.
- Validate token references.
- Detect circular aliases.
- Ensure deterministic output.

Generated token outputs that are part of the package may be versioned only when the repository explicitly adopts that strategy.

---

# 6. Design language

Atralume is an independent design system inspired by Material Design 3.

It is not a wrapper around Angular Material.

Its design language combines:

- Clear visual hierarchy.
- Expressive but controlled shape.
- Luminous primary color.
- Soft surfaces.
- Subtle elevation.
- Accessible state layers.
- Contextual transparency.
- Glass surfaces.
- Functional motion.
- Deep consumer customization.
- Strong light and dark themes.

Do not copy:

- Angular Material source code.
- Angular Material internal DOM.
- Angular Material private tokens.
- Angular Material private selectors.
- Angular Material component APIs without evaluation.
- CSS extracted from Angular Material.

Atralume must have its own:

- API.
- Selectors.
- Tokens.
- Styling.
- Documentation.
- Component contracts.
- Visual identity.

---

# 7. Design token architecture

Tokens must follow this direction:

```text
Reference tokens
      ↓
System tokens
      ↓
Component tokens
      ↓
Consumer overrides
```

## 7.1 Reference tokens

Raw design values:

```text
reference.color.*
reference.typeface.*
reference.dimension.*
reference.duration.*
reference.easing.*
```

Reference tokens must not normally be consumed directly by components.

## 7.2 System tokens

Semantic decisions:

```text
system.color.primary
system.color.on-primary
system.color.surface
system.color.on-surface
system.color.outline
system.color.error
system.shape.*
system.typography.*
system.motion.*
system.state.*
system.elevation.*
```

## 7.3 Component tokens

Each public component must expose component-specific CSS Custom Properties.

Examples:

```text
component.button.container-color
component.button.label-color
component.card.container-shape
component.dialog.container-elevation
component.input.focus-ring-color
```

Component tokens must reference system tokens by default.

## 7.4 Consumer overrides

Consumers must be able to override styles without recompiling Atralume:

```css
.custom-action {
  --atl-button-container-color: #5b32c4;
  --atl-button-label-color: white;
  --atl-button-container-shape: 1rem;
}
```

Exact prefixes must follow the repository convention.

Overrides must work:

- Globally.
- Per theme.
- In a nested theme.
- Per surface.
- Per component family.
- Per component instance.

Do not expose raw styling inputs such as:

```ts
backgroundColor: string;
borderRadius: string;
boxShadow: string;
fontSize: string;
```

Variants are public inputs.

Brand customization is performed through tokens.

---

# 8. Themes

Atralume must support:

- Light.
- Dark.
- System.
- Nested themes.
- Consumer-defined themes.

Components must not assume the entire document has one theme.

A nested theme must resolve tokens from the nearest theme context.

Overlays rendered outside the trigger DOM subtree must preserve:

- Theme.
- Direction.
- Density.
- Surface context.
- Glass context.
- Relevant CSS Custom Properties.

Do not copy all computed styles from a trigger into an overlay.

Use a documented theme propagation strategy.

---

# 9. Glass surfaces

Glass is a surface treatment, not a decorative effect applied indiscriminately to every component.

Glass must consider:

- Transparency.
- Backdrop filtering.
- Border.
- Elevation.
- Contrast.
- Fallback.
- Dark theme.
- Reduced transparency.
- Forced colors.
- Browser support.

Components rendered on glass must remain readable and accessible.

Do not add a `glass` variant to every component when contextual surface tokens can solve it.

Surface components such as Card, Dialog, Bottom Sheet or Popover may expose a meaningful glass appearance.

---

# 10. Atomic architecture

Maintain a dependency direction equivalent to:

```text
Foundations
  ↓
Atoms
  ↓
Molecules
  ↓
Organisms
  ↓
Patterns or application examples
```

Rules:

- Foundations must not import components.
- Atoms must not import molecules.
- Molecules must not import organisms.
- Public entrypoints must not form cycles.
- Playground may consume the library.
- The library must not import the playground.
- Stories may consume public APIs.
- Production code must not import stories or MDX.

Atomic classification should not be forced when it harms semantics, but dependency direction must remain clean.

---

# 11. Package architecture

Atralume must remain one publishable npm package with secondary entrypoints.

Example:

```text
@atralume/angular/button
@atralume/angular/icon
@atralume/angular/forms
@atralume/angular/dialog
@atralume/angular/table
```

Do not create one npm package per component.

Do not import internal paths:

```ts
@atralume/angular/src/lib/...
```

Use public entrypoints.

Each entrypoint must:

- Export only public API.
- Be tree-shakable.
- Avoid cycles.
- Include typings.
- Build independently when required.
- Work from the npm tarball.
- Declare dependencies correctly.

Infrastructure that is not intended for consumers must remain internal.

---

# 12. Angular component standards

All Angular components must be:

- Standalone.
- Strictly typed.
- `ChangeDetectionStrategy.OnPush`.
- Compatible with zoneless.
- Compatible with SSR.
- Compatible with hydration.
- Free from deprecated APIs.
- Free from unnecessary subscriptions.
- Free from unsafe global DOM access.

Prefer:

- Signal Inputs.
- Signal Outputs where appropriate.
- `computed`.
- Signal queries.
- `DestroyRef`.
- `takeUntilDestroyed`.
- `booleanAttribute`.
- `numberAttribute`.
- Native events.
- Explicit content projection.

Do not use `effect` to copy signals unnecessarily.

Do not create state that duplicates Angular Forms state without synchronization.

---

# 13. Required component files

Every public Angular component must include:

```text
<name>.component.ts
<name>.component.html
<name>.component.scss
<name>.component.spec.ts
<name>.component.stories.ts
<name>.component.docs.mdx
<name>.harness.ts
index.ts
```

Templates and component styles must not be inline.

Every public directive must include:

```text
<name>.directive.ts
<name>.directive.spec.ts
<name>.directive.stories.ts
<name>.directive.docs.mdx
<name>.harness.ts
index.ts
```

Directives do not need artificial HTML files.

Services, providers, adapters and utilities are exempt from component HTML and SCSS requirements but still require:

- Tests.
- Public documentation when exported.
- Clear public/internal classification.

---

# 14. Native HTML semantics

Prefer native HTML elements.

Use:

- `<button>` for actions.
- `<a>` for navigation.
- `<input>` for text and native form controls.
- `<select>` when custom behavior is unnecessary.
- `<fieldset>` and `<legend>` for grouped controls.
- `<table>` for tabular data.
- `<nav>` for navigation.
- `<dialog>` or an accessible dialog pattern when appropriate.
- `<hr>` for semantic separators.

Do not implement clickable `div` or `span` elements.

Do not add ARIA roles that duplicate correct native semantics.

The first rule of ARIA is to prefer native HTML.

---

# 15. Angular Forms

Native controls must preserve Angular's native value accessors.

Do not implement a custom `ControlValueAccessor` when applying a directive to a native input is sufficient.

Custom controls that represent a value must correctly implement:

- `writeValue`.
- `registerOnChange`.
- `registerOnTouched`.
- `setDisabledState`.

They must support:

- Reactive Forms.
- Template-driven Forms.
- Signal Forms when supported by the installed Angular version.
- Reset.
- Disabled.
- Touched.
- Dirty.
- Required.
- Invalid.
- `null`.
- Strict typing.

Do not emit custom events that duplicate form or native events.

---

# 16. Angular CDK and Angular Aria

Angular CDK and Angular Aria may be used as behavior primitives.

Allowed capability areas include:

- Overlay.
- Portal.
- Accessibility.
- Focus management.
- Bidirectionality.
- Scrolling.
- Collections.
- Menu.
- Dialog.
- Listbox.
- Tree.
- Table.
- Stepper.
- Virtual scrolling.

Rules:

- Use only public APIs.
- Verify compatibility with installed Angular.
- Do not expose experimental APIs directly.
- Do not expose CDK implementation details unnecessarily.
- Keep Atralume's own public API.
- Keep Atralume's visual identity.
- Do not import Angular Material components.

Angular CDK is permitted.

Angular Material visual components are not.

---

# 17. Overlay standards

All floating components must reuse shared infrastructure.

Do not create unrelated overlay implementations for:

- Tooltip.
- Menu.
- Dialog.
- Bottom Sheet.
- Select.
- Autocomplete.
- Date Picker.
- Popover.
- Command Palette.

The shared infrastructure must handle:

- Positioning.
- Viewport collisions.
- Scroll strategy.
- Backdrop.
- Escape.
- Outside click.
- Focus management.
- Focus restoration.
- Nested overlays.
- Z-index.
- Theme propagation.
- RTL.
- Cleanup.
- SSR.
- Hydration.

No overlay may remain attached after its trigger or owning injector is destroyed.

---

# 18. Accessibility

WCAG 2.2 AA is the minimum target.

All public interactive components must support:

- Keyboard.
- Visible focus.
- Accessible names.
- Accessible descriptions.
- Correct roles.
- Correct states.
- Correct relationships.
- Zoom.
- Forced colors.
- Reduced motion.
- Touch targets.
- Light and dark contrast.
- Screen-reader usage.

Color must not be the only method of communicating state.

Placeholder must not replace a label.

Tooltip must not replace an accessible name.

Disabled state must not be communicated only by opacity.

Automated tests do not replace manual review.

---

# 19. Motion

Motion must be functional.

Use motion tokens for:

- Duration.
- Easing.
- Enter.
- Exit.
- Emphasis.
- Movement.

Respect:

```css
@media (prefers-reduced-motion: reduce)
```

Reduced motion must preserve understanding.

Do not leave loading indicators visually ambiguous when animation is reduced.

Do not animate layout excessively.

---

# 20. Story requirements

Stories must cover meaningful states.

Expected categories include:

- Default.
- Variants.
- Sizes.
- Disabled.
- Loading.
- Invalid.
- Empty.
- Error.
- Focus visible.
- Light.
- Dark.
- Nested themes.
- On glass.
- Consumer override.
- RTL when applicable.
- Responsive when applicable.
- Reduced motion when applicable.
- Forced colors when applicable.

Stories must:

- Be deterministic.
- Avoid real network calls.
- Avoid real credentials.
- Avoid current dates unless fixed.
- Avoid uncontrolled randomness.
- Avoid production services.
- Function as executable examples.

---

# 21. MDX documentation

Every public component must document:

- Purpose.
- When to use.
- When not to use.
- Import.
- Minimal example.
- Public API.
- Variants.
- States.
- Composition.
- Accessibility.
- Keyboard.
- Themes.
- Glass.
- Tokens.
- Consumer overrides.
- Responsive behavior.
- RTL when applicable.
- SSR when applicable.
- Common mistakes.
- Related components.
- Story references.

Do not duplicate automatically generated API documentation manually.

Use MDX for guidance and examples.

Use generated metadata for signatures.

---

# 22. Component Harnesses

Interactive public components must provide a Component Harness.

Harnesses must expose stable user-observable behavior.

Good harness methods include:

```text
getText
getValue
isDisabled
isSelected
isExpanded
open
close
click
focus
selectOption
getError
```

Do not expose fragile internal class names as the public testing contract.

Harnesses must work against the built component behavior.

---

# 23. Testing

Required validation includes:

- Unit tests.
- Interaction tests.
- Accessibility tests.
- Harness tests.
- Build tests.
- Package tests.
- Consumer tests.
- SSR tests for relevant components.
- Zoneless tests.
- Visual regression for representative states.

Test:

- Public behavior.
- Keyboard.
- ARIA.
- Disabled states.
- Controlled state.
- Forms.
- Content projection.
- Cleanup.
- Themes.
- Overlays.
- Error states.

Do not leave:

- `.skip`.
- `.only`.
- Empty tests.
- Snapshot tests without meaningful review.
- Tests that assert private implementation unnecessarily.

---

# 24. Public API

Every exported symbol must be intentional.

Do not export:

- Internal utilities.
- Private overlay helpers.
- Story fixtures.
- Test hosts.
- Internal token calculation helpers.
- Private CDK adapters.
- Temporary compatibility aliases.

Public changes must be reviewable through API reports or an equivalent contract.

Breaking changes require:

- SemVer analysis.
- Changelog.
- Migration guidance.
- Deprecation when appropriate.

---

# 25. Performance

Components must avoid:

- Unnecessary change detection.
- Global listeners without cleanup.
- Repeated DOM measurements.
- Layout thrashing.
- Large eager dependencies.
- Importing entire icon collections.
- Loading unrelated entrypoints.
- Unbounded event subscriptions.
- Unnecessary overlays.
- Rendering large collections without strategy.

Verify tree shaking.

Importing a small atom must not include advanced components.

---

# 26. Repository hygiene

Do not commit generated residue unless explicitly required.

Common files that should normally remain untracked:

```text
dist/
coverage/
storybook-static/
playwright-report/
test-results/
blob-report/
.angular/cache/
.nx/cache/
*.tgz
*.log
*.tmp
*.bak
.DS_Store
Thumbs.db
```

Before deleting tracked files:

1. Search references.
2. Inspect imports.
3. Inspect Nx targets.
4. Inspect workflows.
5. Inspect Storybook.
6. Inspect package exports.
7. Confirm regeneration or replacement.

Classify deletion candidates as:

```text
GENERATED
OBSOLETE
DUPLICATE
REQUIRED
AMBIGUOUS
SENSITIVE
```

Never delete `AMBIGUOUS` files automatically.

Never use broad destructive commands against the repository root, home directory, parent directory, or `.git`.

The following files are protected:

```text
AGENTS.md
README.md
LICENSE
CHANGELOG.md
CONTRIBUTING.md
SECURITY.md
SUPPORT.md
package.json
lockfile
nx.json
```

`AGENTS.md` must never be classified as generated garbage.

---

# 27. Package contents

The npm tarball must include only required consumer artifacts.

Expected contents:

- Compiled library.
- Typings.
- Public entrypoints.
- Public CSS.
- Public tokens.
- README.
- LICENSE.
- Package metadata.

It must not include:

- Tests.
- Stories.
- Internal MDX.
- Storybook configuration.
- Coverage.
- Build reports.
- Temporary applications.
- Logs.
- Screenshots.
- Previous tarballs.
- Workspace-only scripts.
- Credentials.

Validate using the actual `.tgz`, not only the workspace build.

---

# 28. Git workflow

The repository flow is:

```text
feature/* → develop → release → master
```

General expectations:

- Feature work targets `develop`.
- `develop` is the integration branch.
- `release` is the stabilization branch.
- `master` is the stable branch.
- GitHub Pages deploys stable Storybook from `master`.
- npm stable releases originate from validated code in `master`.
- `develop` must not publish npm.
- `release` must not publish the `latest` dist-tag.

The user performs all Git operations unless explicit authority is granted.

---

# 29. Dependency changes

Before adding a dependency, document:

- Purpose.
- Existing alternative.
- Runtime or development classification.
- Bundle impact.
- License.
- Maintenance status.
- Angular compatibility.
- SSR compatibility.
- Security impact.

Do not add dependencies for functionality that can be implemented safely with existing tooling.

Do not duplicate existing plugin capabilities.

Keep runtime dependencies minimal.

---

# 30. Documentation language

Use one canonical documentation language consistently.

If the existing public documentation is in English, continue in English.

Do not mix languages within the same API page unless the project intentionally adopts localization.

Code, selectors, public types and technical identifiers must use English.

---

# 31. Definition of done

A task is not complete until:

- Requested behavior is implemented.
- Architecture rules are respected.
- Public API is intentional.
- Tokens are used.
- Consumer overrides work.
- Light and dark work.
- Glass is verified when relevant.
- Accessibility is verified.
- Tests pass.
- Stories exist.
- MDX exists.
- Harness exists when applicable.
- Build passes.
- Storybook builds.
- Package builds.
- Tarball is inspected when public API changes.
- External consumer works when packaging changes.
- No unrelated files were modified.
- No garbage was added.
- No remote Git operation was performed without authorization.

---

# 32. Required final report

Every implementation agent must report:

## Implemented

Concrete files, components and behavior.

## Architecture

Important design and dependency decisions.

## Public API

Entry points, symbols and tokens.

## Tests

Exact commands and results.

## Storybook

Stories, MDX, interactions and accessibility.

## Packaging

Build, tarball and consumer verification.

## Accessibility

Keyboard, ARIA, focus, screen reader and visual states.

## Repository hygiene

Added, modified, removed, ambiguous and generated files.

## Limitations

Real limitations or incomplete criteria.

## User actions

Any manual GitHub, npm, Git or environment configuration required.

Never claim completion when a required check was not executed.
