# Migrations

Taiga UI 5 is the UI runtime; Atralume is the brand layer (tokens, bridge,
modes). Work is tracked in the [migration matrix](../architecture/taiga-ui-migration-matrix.md)
and [checklist](../architecture/taiga-ui-migration-checklist.md). Doctrine:
[ADR-001](../architecture/adr/ADR-001-use-taiga-ui-as-component-foundation.md).
Consumer bootstrap: [Taiga UI guide](taiga-ui.md). Status:
[report](../architecture/taiga-ui-migration-final-report.md).

Deprecations are marked with `@deprecated`, name the supported replacement,
appear in the changelog, and remain through at least one documented minor
release line. Removal happens only in a major release. Migration notes cover
public imports, selectors, inputs, outputs, CSS tokens, themes, and accessible
behavior.
