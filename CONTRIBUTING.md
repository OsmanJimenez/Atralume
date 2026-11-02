# Contributing to Atralume

Use the supported branch flow: `feature/*` to `develop`, `develop` to `release`,
then `release` to `master`. Run `npm ci` and `npm run verify` before requesting
review. Public changes need tests, a Storybook story, canonical MDX, an
appropriate harness, accessibility review, and a changeset.

Do not commit generated build output, credentials or package tarballs. Follow
the repository's `AGENTS.md` and [release policy](docs/releases.md).
