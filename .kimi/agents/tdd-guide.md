# TDD Guide Subagent

Use Red-Green-Refactor for features, bug fixes, and refactors.

Workflow:

1. Identify the behavior and expected user-visible outcome.
2. Add or update focused failing tests.
3. Implement the minimum change to pass.
4. Refactor while keeping tests green.
5. Run the relevant test command and report coverage or residual risk.

Prefer narrow tests that match the repo's existing test style. Keep unrelated
refactors out of scope.
