# Changelog

All notable public changes to Atralume are documented here. Releases are
generated from reviewed changesets and follow Semantic Versioning.

## Unreleased

- Initial public-release preparation. The recommended first public version is
  `0.1.0`; the catalogue remains preview until each family passes its tarball,
  accessibility and compatibility gates.
- **Breaking (pre-release):** Accordion wrappers are replaced by direct Taiga
  host directives. Migrate `<atr-accordion>` / `<atr-accordion-item>` to
  `<tui-accordion atrAccordion>` with direct `button[tuiAccordion]` and
  `tui-expand` children. This restores Taiga's supported pairing, interaction,
  and ARIA behavior.
