# Button

Import `AtralumeButton` and `AtralumeButtonHarness` from `@atralume/angular/button`.
Use `button[atrButton]` for actions and `a[atrButton]` with href for navigation.
The existing filled medium button remains the default. Native form attributes and click events are preserved.

Inputs: appearance (filled, tonal, outlined, text), size (small, medium, large), disabled, loading and fullWidth.
Loading sets aria-busy, disables activation and preserves the accessible label and content width.
Import `@atralume/angular/styles/theme.css` once. Override `--atr-comp-button-*` variables to customize a theme, subtree or instance.
See the canonical Storybook Docs page and sibling stories for full examples.
