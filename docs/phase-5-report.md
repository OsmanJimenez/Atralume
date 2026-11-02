# Phase 5 — release preparation report

Date: 2026-11-02

## Scope delivered

- Prepared `@atralume/angular` as a public `0.1.0` package with explicit
  Angular/RxJS peer dependencies, Node/npm requirements, provenance metadata,
  an allow-list of published files, package README, MIT license and changelog.
- Added Changesets configuration, a SemVer/release/rollback policy, migration
  starting point, support/security/contribution governance, maturity policy,
  Dependabot and issue templates.
- Added auditable release tooling: catalogue coverage report, public `.d.ts`
  baseline, gzip bundle budgets, SPDX SBOM, package checksum, isolated packed
  consumer check, and a dry-run that never publishes.
- Added pinned GitHub Actions workflows for canary artifacts and protected
  `next`/stable publication via npm Trusted Publishing (OIDC).
- Removed 29 unreferenced, one-off Phase 4 scaffolding scripts from `tools/`.
  No tracked build, coverage, Storybook, Playwright, archive, or log residue
  was found; `.gitignore` now blocks these generated artifacts.

## Checks recorded

| Check                 | Result   | Evidence                                                                                                                  |
| --------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------- |
| Angular package build | Pass     | All primary and 46 secondary entry points built.                                                                          |
| Lint                  | Pass     | Workspace lint completed (existing warnings do not fail the gate).                                                        |
| Angular unit tests    | Pass     | 85 files and 134 tests passed.                                                                                            |
| Public API baseline   | Pass     | `docs/api/public-api.json` records 47 typed exports.                                                                      |
| Bundle budgets        | Pass     | 48 ESM entry points are within `tools/bundle-budgets.json`.                                                               |
| SBOM generation       | Pass     | SPDX 2.3 written to `dist/release/atralume-angular.spdx.json`.                                                            |
| Package contents      | Pass     | Isolated Angular consumer installed the tarball and exercised browser and SSR flows.                                      |
| Catalogue audit       | Findings | `form-field` has no colocated story, MDX, or test under the audit convention.                                             |
| Full `npm run verify` | Blocked  | Formatting fails before tests because the active worktree contains extensive pre-existing, unformatted Phase 1–4 changes. |

## Required manual configuration

Before any publication, configure npm Trusted Publishers for the exact GitHub
repository, package name and `publish-next.yml`/`publish-stable.yml` workflow
identities. Configure protected GitHub environments `npm-next` and
`npm-production` with required reviewers. Do not add a long-lived npm token.

GitHub Pages and registry/project URLs must also be verified by the repository
owner after the first successful CI run; no release, tag, publication, push or
deployment was performed for this phase.

## Release blockers and known gaps

1. `npm run verify` is red at `nx format:check --all`; this must be resolved
   across the existing worktree, then the full unit, lint, static Storybook,
   accessibility and browser gates must run green.
2. The catalogue audit records three Form Field coverage gaps. Resolve them or
   formally waive them with a scoped reason before moving the family to stable.
3. Phase 4 advanced components are present but have not been independently
   certified as a completed phase in this release audit. Their functional,
   a11y, responsive and keyboard matrices need review.
4. No visual-regression baseline/review workflow is installed yet. Perform and
   record the required multi-viewport, light/dark/system and reduced-motion
   review before stable publication.
5. `@atralume/angular/internal/forms` and root `ɵ` bridge exports remain
   generated/public surfaces. Define an explicit compatibility policy or remove
   them before claiming a stable public API.
6. The complete development dependency tree reported 56 audit findings (5 low,
   34 moderate, 17 high) at installation time. The production-only audit is
   currently 0 findings. Triage the development findings with maintainers; no
   automatic audit fix was applied.
7. A zoneless consumer fixture and broad browser/assistive-technology manual
   audit are still required. The packaged consumer covers browser and SSR but
   is not evidence for every supported accessibility environment.

## Verdict

**NOT READY** for prerelease or stable publication. The release mechanics and
evidence tooling are in place, but the blocking checks and coverage/security
review above must be closed and recorded first.
