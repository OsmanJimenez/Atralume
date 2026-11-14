# Releases

Atralume follows Semantic Versioning. Removing or incompatibly changing a
selector, input, output, public token, peer dependency or documented accessible
behavior is a major change. Additive public capability is minor; compatible
fixes, documentation, styling and performance work are patch changes.

Published `latest` previews include `0.1.0`, `0.1.1`, `0.2.0`, and **`0.2.1`**. Families
remain **preview** until their tarball consumer, accessibility and compatibility
checks are all recorded as passing. A release to `1.0.0` requires an explicit
API-stability review; it is not an automatic milestone.

## Changesets

Run `npm exec changeset` for a public change to `@osmanjimenez/atralume`. Internal
tooling, private documentation, tests, playground-only work and CI do not need
a changeset. Reviewers must verify the SemVer level and release note.

`develop` produces only a validated tarball artifact. `release` may publish a
protected `next` prerelease after approval. On `master`, the Pages workflow
deploys Storybook first and then publishes an unpublished package version as
`latest`, through the protected `npm-production` environment and npm Trusted
Publishing. Workflows never use a long-lived npm token.

## Rollback

Do not unpublish a bad version as a normal rollback. Publish a corrective patch,
deprecate the affected version, and change a dist-tag only after approval:

```bash
npm deprecate @osmanjimenez/atralume@<bad-version> "Use <fixed-version> instead"
npm dist-tag add @osmanjimenez/atralume@<fixed-version> latest
```

Record the impact and migration in the changelog.
