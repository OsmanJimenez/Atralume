# Deployment

`Atralume CI` runs the stable `Quality` job for pull requests and pushes to `develop`, `release`, and `master`. It installs the pinned toolchain, validates PR policy, installs Chromium, and runs `npm run verify`.

`Atralume Storybook Pages` runs only for `master`. The same commit must pass the complete verification before the official Pages artifact is uploaded and deployed through OIDC/GITHUB_TOKEN. No `gh-pages` branch or personal token is used. The expected project URL is <https://osmanjimenez.github.io/Atralume/>; the authoritative URL is the `deploy-pages` output.

Remote setup still requires repository administration:

1. Settings → Pages → Build and deployment → **GitHub Actions**.
2. Create/use the `github-pages` environment.
3. Restrict environment deployments to `master` without manual approval for phase 0.
4. After the first `Quality` run, protect `develop`, `release`, and `master`: require PRs, `Quality`, and conversation resolution; block deletion/force push; allow merge commits; do not require linear history.

These controls must be verified remotely before being described as active. If the GitHub plan blocks a rule, record that limitation.

## Rollback

Revert the faulty change through a pull request to `master`; Pages will publish the corrected commit. Never reset or force push. Merge the rollback from `master` into `release` and `develop` afterward.
