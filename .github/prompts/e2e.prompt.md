---
description: "Generate and run end-to-end Playwright tests for critical user flows. Creates Page Object Model tests, runs across browsers, captures artifacts."
mode: "agent"
---

# E2E Testing

Generate and run end-to-end tests using Playwright for critical user flows.

## Workflow

1. **Analyze User Flow** — Identify the test scenarios from the description
2. **Generate Tests** — Create Playwright tests using Page Object Model pattern
3. **Run Tests** — Execute across browsers (Chromium, Firefox, WebKit)
4. **Capture Artifacts** — Screenshots, videos, and traces on failure
5. **Report Results** — Pass/fail with artifact links

## Test Structure

```typescript
// Page Object
class ExamplePage {
  constructor(private page: Page) {}
  async navigate() { /* ... */ }
  async performAction() { /* ... */ }
  async verifyResult() { /* ... */ }
}

// Test
test.describe('User Flow', () => {
  test('should complete flow successfully', async ({ page }) => {
    const examplePage = new ExamplePage(page);
    await examplePage.navigate();
    await examplePage.performAction();
    await examplePage.verifyResult();
  });
});
```

## Rules
- Use Page Object Model for all tests
- Each test must be independent — no shared state
- Add `data-testid` attributes for reliable selectors
- Capture screenshot on every failure
- Mark flaky tests with `test.fixme()` and create tickets

{{{ input }}}
