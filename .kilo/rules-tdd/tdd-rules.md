# TDD Mode Rules

## Mandatory Workflow
1. Write test FIRST (RED) — must fail
2. Run test — verify failure
3. Write minimal implementation (GREEN)
4. Run test — verify pass
5. Refactor (IMPROVE) — tests stay green
6. Verify 80%+ coverage

## Required Edge Cases
- Null/undefined input
- Empty arrays/strings
- Invalid types
- Boundary values (min/max)
- Error paths (network, DB failures)
- Race conditions
- Large data sets (10k+ items)
- Special characters (Unicode, emojis, SQL injection chars)
