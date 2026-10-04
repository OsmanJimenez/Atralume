# Branching

Persistent branches have distinct roles: `develop` integrates short-lived `feature/*`, `fix/*`, `chore/*`, and `docs/*`; `release` stabilizes; `master` represents the published state.

Normal promotion is `develop → release → master`, by pull request. Short-lived work may be squashed into `develop`; promotions and persistent-branch synchronization use merge commits. Linear history is therefore not required.

During stabilization, `release-fix/*` starts from and returns to `release`, then `release` is merged back to `develop`. A `hotfix/*` starts from `master`, returns to `master`, then `master` is merged into both `release` and `develop`. Force pushes, history rewrites, and branch deletion are not part of this flow.

`tools/check-pr-policy.mjs` enforces permitted source/target combinations in CI and requires promotion, hotfix, and release-fix branches to belong to the same repository.
