# Component maturity

| Maturity     | Meaning                                                                    |
| ------------ | -------------------------------------------------------------------------- |
| Experimental | Explicit opt-in; API can change without SemVer protection.                 |
| Preview      | Usable but may receive documented incompatible adjustments before stable.  |
| Stable       | Tarball, accessibility, compatibility and API-contract checks have passed. |
| Deprecated   | Supported temporarily with a documented replacement and migration.         |

The current catalogue is **preview**. This is deliberate: the release audit has
not yet established a stable API baseline for every family. The generated
catalog audit is the evidence source; move a family to stable only after its
entrypoint, MDX, stories, tests, harness, external consumer and accessibility
checks are recorded.
