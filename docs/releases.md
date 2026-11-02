# Releases

Atralume follows Semantic Versioning. Removing or incompatibly changing a
selector, input, output, public token, peer dependency or documented accessible
behavior is a major change. Additive public capability is minor; compatible
fixes, documentation, styling and performance work are patch changes.

The first recommended public version is `0.1.0`. Families remain **preview**
until their tarball consumer, accessibility and compatibility checks are all
recorded as passing. A release to `1.0.0` requires an explicit API-stability
review; it is not an automatic milestone.

## Changesets

Run `npm exec changeset` for a public change to `@atralume/angular`. Internal
tooling, private documentation, tests, playground-only work and CI do not need
a changeset. Reviewers must verify the SemVer level and release note.

`develop` produces only a validated tarball artifact. `release` may publish a
protected `next` prerelease after approval. Stable `latest` publication is
restricted to a matching tag on `master`, with a protected environment and npm
Trusted Publishing. Workflows never use a long-lived npm token.

## Rollback

Do not unpublish a bad version as a normal rollback. Publish a corrective patch,
deprecate the affected version, and change a dist-tag only after approval:

```bash
npm deprecate @atralume/angular@<bad-version> "Use <fixed-version> instead"
npm dist-tag add @atralume/angular@<fixed-version> latest
```

Record the impact and migration in the changelog.
