---
name: tdd-workflow
description: Ã¬Æ’Ë† ÃªÂ¸Â°Ã«Å Â¥ Ã¬Å¾â€˜Ã¬â€žÂ±, Ã«Â²â€žÃªÂ·Â¸ Ã¬Ë†ËœÃ¬Â â€¢ Ã«ËœÂÃ«Å â€ Ã¬Â½â€Ã«â€œÅ“ Ã«Â¦Â¬Ã­Å’Â©Ã­â€žÂ°Ã«Â§Â Ã¬â€¹Å“ Ã¬ÂÂ´ Ã¬Å Â¤Ã­â€šÂ¬Ã¬Ââ€ž Ã¬â€šÂ¬Ã¬Å¡Â©Ã­â€¢ËœÃ¬â€žÂ¸Ã¬Å¡â€. Ã«â€¹Â¨Ã¬Å“â€ž, Ã­â€ ÂµÃ­â€¢Â©, E2E Ã­â€¦Å’Ã¬Å Â¤Ã­Å Â¸Ã«Â¥Â¼ Ã­ÂÂ¬Ã­â€¢Â¨Ã­â€¢Å“ 80% Ã¬ÂÂ´Ã¬Æ’ÂÃ¬ÂËœ Ã¬Â»Â¤Ã«Â²â€žÃ«Â¦Â¬Ã¬Â§â‚¬Ã«Â¡Å“ Ã­â€¦Å’Ã¬Å Â¤Ã­Å Â¸ Ã¬Â£Â¼Ã«Ââ€ž ÃªÂ°Å“Ã«Â°Å“Ã¬Ââ€ž Ã¬â€¹Å“Ã­â€“â€°Ã­â€¢Â©Ã«â€¹Ë†Ã«â€¹Â¤.
origin: claude-fulcrum
---

# Ã­â€¦Å’Ã¬Å Â¤Ã­Å Â¸ Ã¬Â£Â¼Ã«Ââ€ž ÃªÂ°Å“Ã«Â°Å“ Ã¬â€ºÅ’Ã­ÂÂ¬Ã­â€Å’Ã«Â¡Å“Ã¬Å¡Â°

Ã¬ÂÂ´ Ã¬Å Â¤Ã­â€šÂ¬Ã¬Ââ‚¬ Ã«ÂªÂ¨Ã«â€œÂ  Ã¬Â½â€Ã«â€œÅ“ ÃªÂ°Å“Ã«Â°Å“Ã¬ÂÂ´ Ã­ÂÂ¬ÃªÂ´â€žÃ¬Â ÂÃ¬ÂÂ¸ Ã­â€¦Å’Ã¬Å Â¤Ã­Å Â¸ Ã¬Â»Â¤Ã«Â²â€žÃ«Â¦Â¬Ã¬Â§â‚¬Ã¬â„¢â‚¬ Ã­â€¢Â¨ÃªÂ»Ëœ TDD Ã¬â€ºÂÃ¬Â¹â„¢Ã¬Ââ€ž Ã«â€Â°Ã«Â¥Â´Ã«Ââ€žÃ«Â¡Â Ã«Â³Â´Ã¬Å¾Â¥Ã­â€¢Â©Ã«â€¹Ë†Ã«â€¹Â¤.

## Ã­â„¢Å“Ã¬â€žÂ±Ã­â„¢â€ Ã¬â€¹Å“Ã¬Â Â

- Ã¬Æ’Ë† ÃªÂ¸Â°Ã«Å Â¥Ã¬ÂÂ´Ã«â€šËœ ÃªÂ¸Â°Ã«Å Â¥Ã¬â€žÂ±Ã¬Ââ€ž Ã¬Å¾â€˜Ã¬â€žÂ±Ã­â€¢Â  Ã«â€¢Å’
- Ã«Â²â€žÃªÂ·Â¸Ã«â€šËœ Ã¬ÂÂ´Ã¬Å Ë†Ã«Â¥Â¼ Ã¬Ë†ËœÃ¬Â â€¢Ã­â€¢Â  Ã«â€¢Å’
- ÃªÂ¸Â°Ã¬Â¡Â´ Ã¬Â½â€Ã«â€œÅ“Ã«Â¥Â¼ Ã«Â¦Â¬Ã­Å’Â©Ã­â€žÂ°Ã«Â§ÂÃ­â€¢Â  Ã«â€¢Å’
- API Ã¬â€”â€Ã«â€œÅ“Ã­ÂÂ¬Ã¬ÂÂ¸Ã­Å Â¸Ã«Â¥Â¼ Ã¬Â¶â€ÃªÂ°â‚¬Ã­â€¢Â  Ã«â€¢Å’
- Ã¬Æ’Ë† Ã¬Â»Â´Ã­ÂÂ¬Ã«â€žÅ’Ã­Å Â¸Ã«Â¥Â¼ Ã¬Æ’ÂÃ¬â€žÂ±Ã­â€¢Â  Ã«â€¢Å’

## Ã­â€¢ÂµÃ¬â€¹Â¬ Ã¬â€ºÂÃ¬Â¹â„¢

### 1. Ã¬Â½â€Ã«â€œÅ“Ã«Â³Â´Ã«â€¹Â¤ Ã­â€¦Å’Ã¬Å Â¤Ã­Å Â¸ÃªÂ°â‚¬ Ã«Â¨Â¼Ã¬Â â‚¬
Ã­â€¢Â­Ã¬Æ’Â Ã­â€¦Å’Ã¬Å Â¤Ã­Å Â¸Ã«Â¥Â¼ Ã«Â¨Â¼Ã¬Â â‚¬ Ã¬Å¾â€˜Ã¬â€žÂ±Ã­â€¢Å“ Ã­â€ºâ€ž, Ã­â€¦Å’Ã¬Å Â¤Ã­Å Â¸Ã«Â¥Â¼ Ã­â€ ÂµÃªÂ³Â¼Ã¬â€¹Å“Ã­â€šÂ¤Ã«Å â€ Ã¬Â½â€Ã«â€œÅ“Ã«Â¥Â¼ ÃªÂµÂ¬Ã­Ëœâ€žÃ­â€¢Â©Ã«â€¹Ë†Ã«â€¹Â¤.

### 2. Ã¬Â»Â¤Ã«Â²â€žÃ«Â¦Â¬Ã¬Â§â‚¬ Ã¬Å¡â€ÃªÂµÂ¬ Ã¬â€šÂ¬Ã­â€¢Â­
- Ã¬ÂµÅ“Ã¬â€ Å’ 80% Ã¬Â»Â¤Ã«Â²â€žÃ«Â¦Â¬Ã¬Â§â‚¬ (Ã«â€¹Â¨Ã¬Å“â€ž + Ã­â€ ÂµÃ­â€¢Â© + E2E)
- Ã«ÂªÂ¨Ã«â€œÂ  Ã¬â€”Â£Ã¬Â§â‚¬ Ã¬Â¼â‚¬Ã¬ÂÂ´Ã¬Å Â¤ Ã¬Â»Â¤Ã«Â²â€ž
- Ã¬â€”ÂÃ«Å¸Â¬ Ã¬â€¹Å“Ã«â€šËœÃ«Â¦Â¬Ã¬ËœÂ¤ Ã­â€¦Å’Ã¬Å Â¤Ã­Å Â¸
- ÃªÂ²Â½ÃªÂ³â€ž Ã¬Â¡Â°ÃªÂ±Â´ ÃªÂ²â‚¬Ã¬Â¦Â

### 3. Ã­â€¦Å’Ã¬Å Â¤Ã­Å Â¸ Ã¬Å“Â Ã­Ëœâ€¢

#### Ã«â€¹Â¨Ã¬Å“â€ž Ã­â€¦Å’Ã¬Å Â¤Ã­Å Â¸
- ÃªÂ°Å“Ã«Â³â€ž Ã­â€¢Â¨Ã¬Ë†Ëœ Ã«Â°Â Ã¬Å“Â Ã­â€¹Â¸Ã«Â¦Â¬Ã­â€¹Â°
- Ã¬Â»Â´Ã­ÂÂ¬Ã«â€žÅ’Ã­Å Â¸ Ã«Â¡Å“Ã¬Â§Â
- Ã¬Ë†Å“Ã¬Ë†Ëœ Ã­â€¢Â¨Ã¬Ë†Ëœ
- Ã­â€”Â¬Ã­ÂÂ¼ Ã«Â°Â Ã¬Å“Â Ã­â€¹Â¸Ã«Â¦Â¬Ã­â€¹Â°

#### Ã­â€ ÂµÃ­â€¢Â© Ã­â€¦Å’Ã¬Å Â¤Ã­Å Â¸
- API Ã¬â€”â€Ã«â€œÅ“Ã­ÂÂ¬Ã¬ÂÂ¸Ã­Å Â¸
- Ã«ÂÂ°Ã¬ÂÂ´Ã­â€žÂ°Ã«Â²Â Ã¬ÂÂ´Ã¬Å Â¤ Ã¬Å¾â€˜Ã¬â€”â€¦
- Ã¬â€žÅ“Ã«Â¹â€žÃ¬Å Â¤ Ã¬Æ’ÂÃ­ËœÂ¸Ã¬Å¾â€˜Ã¬Å¡Â©
- Ã¬â„¢Â¸Ã«Â¶â‚¬ API Ã­ËœÂ¸Ã¬Â¶Å“

#### E2E Ã­â€¦Å’Ã¬Å Â¤Ã­Å Â¸ (Playwright)
- Ã­â€¢ÂµÃ¬â€¹Â¬ Ã¬â€šÂ¬Ã¬Å¡Â©Ã¬Å¾Â Ã­â€Å’Ã«Â¡Å“Ã¬Å¡Â°
- Ã¬â„¢â€žÃ¬Â â€žÃ­â€¢Å“ Ã¬â€ºÅ’Ã­ÂÂ¬Ã­â€Å’Ã«Â¡Å“Ã¬Å¡Â°
- Ã«Â¸Å’Ã«ÂÂ¼Ã¬Å¡Â°Ã¬Â â‚¬ Ã¬Å¾ÂÃ«Ââ„¢Ã­â„¢â€
- UI Ã¬Æ’ÂÃ­ËœÂ¸Ã¬Å¾â€˜Ã¬Å¡Â©

## TDD Ã¬â€ºÅ’Ã­ÂÂ¬Ã­â€Å’Ã«Â¡Å“Ã¬Å¡Â° Ã«â€¹Â¨ÃªÂ³â€ž

### Ã«â€¹Â¨ÃªÂ³â€ž 1: Ã¬â€šÂ¬Ã¬Å¡Â©Ã¬Å¾Â Ã¬â€”Â¬Ã¬Â â€¢ Ã¬Å¾â€˜Ã¬â€žÂ±
```
As a [role], I want to [action], so that [benefit]

Example:
As a user, I want to search for markets semantically,
so that I can find relevant markets even without exact keywords.
```

### Ã«â€¹Â¨ÃªÂ³â€ž 2: Ã­â€¦Å’Ã¬Å Â¤Ã­Å Â¸ Ã¬Â¼â‚¬Ã¬ÂÂ´Ã¬Å Â¤ Ã¬Æ’ÂÃ¬â€žÂ±
ÃªÂ°Â Ã¬â€šÂ¬Ã¬Å¡Â©Ã¬Å¾Â Ã¬â€”Â¬Ã¬Â â€¢Ã¬â€”Â Ã«Å’â‚¬Ã­â€¢Â´ Ã­ÂÂ¬ÃªÂ´â€žÃ¬Â ÂÃ¬ÂÂ¸ Ã­â€¦Å’Ã¬Å Â¤Ã­Å Â¸ Ã¬Â¼â‚¬Ã¬ÂÂ´Ã¬Å Â¤Ã«Â¥Â¼ Ã¬Å¾â€˜Ã¬â€žÂ±Ã­â€¢Â©Ã«â€¹Ë†Ã«â€¹Â¤:

```typescript
describe('Semantic Search', () => {
  it('returns relevant markets for query', async () => {
    // Test implementation
  })

  it('handles empty query gracefully', async () => {
    // Test edge case
  })

  it('falls back to substring search when Redis unavailable', async () => {
    // Test fallback behavior
  })

  it('sorts results by similarity score', async () => {
    // Test sorting logic
  })
})
```

### Ã«â€¹Â¨ÃªÂ³â€ž 3: Ã­â€¦Å’Ã¬Å Â¤Ã­Å Â¸ Ã¬â€¹Â¤Ã­â€“â€° (Ã¬â€¹Â¤Ã­Å’Â¨Ã­â€¢Â´Ã¬â€¢Â¼ Ã­â€¢Â¨)
```bash
npm test
# Tests should fail - we haven't implemented yet
```

### Ã«â€¹Â¨ÃªÂ³â€ž 4: Ã¬Â½â€Ã«â€œÅ“ ÃªÂµÂ¬Ã­Ëœâ€ž
Ã­â€¦Å’Ã¬Å Â¤Ã­Å Â¸Ã«Â¥Â¼ Ã­â€ ÂµÃªÂ³Â¼Ã¬â€¹Å“Ã­â€šÂ¤ÃªÂ¸Â° Ã¬Å“â€žÃ­â€¢Å“ Ã¬ÂµÅ“Ã¬â€ Å’Ã­â€¢Å“Ã¬ÂËœ Ã¬Â½â€Ã«â€œÅ“Ã«Â¥Â¼ Ã¬Å¾â€˜Ã¬â€žÂ±Ã­â€¢Â©Ã«â€¹Ë†Ã«â€¹Â¤:

```typescript
// Implementation guided by tests
export async function searchMarkets(query: string) {
  // Implementation here
}
```

### Ã«â€¹Â¨ÃªÂ³â€ž 5: Ã­â€¦Å’Ã¬Å Â¤Ã­Å Â¸ Ã¬Å¾Â¬Ã¬â€¹Â¤Ã­â€“â€°
```bash
npm test
# Tests should now pass
```

### Ã«â€¹Â¨ÃªÂ³â€ž 6: Ã«Â¦Â¬Ã­Å’Â©Ã­â€žÂ°Ã«Â§Â
Ã­â€¦Å’Ã¬Å Â¤Ã­Å Â¸ÃªÂ°â‚¬ Ã­â€ ÂµÃªÂ³Â¼Ã­â€¢ËœÃ«Å â€ Ã¬Æ’ÂÃ­Æ’Å“Ã«Â¥Â¼ Ã¬Å“Â Ã¬Â§â‚¬Ã­â€¢ËœÃ«Â©Â´Ã¬â€žÅ“ Ã¬Â½â€Ã«â€œÅ“ Ã­â€™Ë†Ã¬Â§Ë†Ã¬Ââ€ž ÃªÂ°Å“Ã¬â€žÂ Ã­â€¢Â©Ã«â€¹Ë†Ã«â€¹Â¤:
- Ã¬Â¤â€˜Ã«Â³Âµ Ã¬Â Å“ÃªÂ±Â°
- Ã«â€žÂ¤Ã¬ÂÂ´Ã«Â°Â ÃªÂ°Å“Ã¬â€žÂ 
- Ã¬â€žÂ±Ã«Å Â¥ Ã¬ÂµÅ“Ã¬Â ÂÃ­â„¢â€
- ÃªÂ°â‚¬Ã«Ââ€¦Ã¬â€žÂ± Ã­â€“Â¥Ã¬Æ’Â

### Ã«â€¹Â¨ÃªÂ³â€ž 7: Ã¬Â»Â¤Ã«Â²â€žÃ«Â¦Â¬Ã¬Â§â‚¬ Ã­â„¢â€¢Ã¬ÂÂ¸
```bash
npm run test:coverage
# Verify 80%+ coverage achieved
```

## Ã­â€¦Å’Ã¬Å Â¤Ã­Å Â¸ Ã­Å’Â¨Ã­â€žÂ´

### Ã«â€¹Â¨Ã¬Å“â€ž Ã­â€¦Å’Ã¬Å Â¤Ã­Å Â¸ Ã­Å’Â¨Ã­â€žÂ´ (Jest/Vitest)
```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from './Button'

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click</Button>)

    fireEvent.click(screen.getByRole('button'))

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
```

### API Ã­â€ ÂµÃ­â€¢Â© Ã­â€¦Å’Ã¬Å Â¤Ã­Å Â¸ Ã­Å’Â¨Ã­â€žÂ´
```typescript
import { NextRequest } from 'next/server'
import { GET } from './route'

describe('GET /api/markets', () => {
  it('returns markets successfully', async () => {
    const request = new NextRequest('http://localhost/api/markets')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(Array.isArray(data.data)).toBe(true)
  })

  it('validates query parameters', async () => {
    const request = new NextRequest('http://localhost/api/markets?limit=invalid')
    const response = await GET(request)

    expect(response.status).toBe(400)
  })

  it('handles database errors gracefully', async () => {
    // Mock database failure
    const request = new NextRequest('http://localhost/api/markets')
    // Test error handling
  })
})
```

### E2E Ã­â€¦Å’Ã¬Å Â¤Ã­Å Â¸ Ã­Å’Â¨Ã­â€žÂ´ (Playwright)
```typescript
import { test, expect } from '@playwright/test'

test('user can search and filter markets', async ({ page }) => {
  // Navigate to markets page
  await page.goto('/')
  await page.click('a[href="/markets"]')

  // Verify page loaded
  await expect(page.locator('h1')).toContainText('Markets')

  // Search for markets
  await page.fill('input[placeholder="Search markets"]', 'election')

  // Wait for stable search results instead of sleeping
  const results = page.locator('[data-testid="market-card"]')
  await expect(results.first()).toBeVisible({ timeout: 5000 })
  await expect(results).toHaveCount(5, { timeout: 5000 })

  // Verify results contain search term
  const firstResult = results.first()
  await expect(firstResult).toContainText('election', { ignoreCase: true })

  // Filter by status
  await page.click('button:has-text("Active")')

  // Verify filtered results
  await expect(results).toHaveCount(3)
})

test('user can create a new market', async ({ page }) => {
  // Login first
  await page.goto('/creator-dashboard')

  // Fill market creation form
  await page.fill('input[name="name"]', 'Test Market')
  await page.fill('textarea[name="description"]', 'Test description')
  await page.fill('input[name="endDate"]', '2025-12-31')

  // Submit form
  await page.click('button[type="submit"]')

  // Verify success message
  await expect(page.locator('text=Market created successfully')).toBeVisible()

  // Verify redirect to market page
  await expect(page).toHaveURL(/\/markets\/test-market/)
})
```

## Ã­â€¦Å’Ã¬Å Â¤Ã­Å Â¸ Ã­Å’Å’Ã¬ÂÂ¼ ÃªÂµÂ¬Ã¬â€žÂ±

```
src/
Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ components/
Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ Button/
Ã¢â€â€š   Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ Button.tsx
Ã¢â€â€š   Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ Button.test.tsx          # Unit tests
Ã¢â€â€š   Ã¢â€â€š   Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬ Button.stories.tsx       # Storybook
Ã¢â€â€š   Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬ MarketCard/
Ã¢â€â€š       Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ MarketCard.tsx
Ã¢â€â€š       Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬ MarketCard.test.tsx
Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ app/
Ã¢â€â€š   Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬ api/
Ã¢â€â€š       Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬ markets/
Ã¢â€â€š           Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ route.ts
Ã¢â€â€š           Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬ route.test.ts         # Integration tests
Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬ e2e/
    Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ markets.spec.ts               # E2E tests
    Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ trading.spec.ts
    Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬ auth.spec.ts
```

## Ã¬â„¢Â¸Ã«Â¶â‚¬ Ã¬â€žÅ“Ã«Â¹â€žÃ¬Å Â¤ Ã«ÂªÂ¨Ã­â€šÂ¹

### Supabase Mock
```typescript
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({
          data: [{ id: 1, name: 'Test Market' }],
          error: null
        }))
      }))
    }))
  }
}))
```

### Redis Mock
```typescript
jest.mock('@/lib/redis', () => ({
  searchMarketsByVector: jest.fn(() => Promise.resolve([
    { slug: 'test-market', similarity_score: 0.95 }
  ])),
  checkRedisHealth: jest.fn(() => Promise.resolve({ connected: true }))
}))
```

### OpenAI Mock
```typescript
jest.mock('@/lib/openai', () => ({
  generateEmbedding: jest.fn(() => Promise.resolve(
    new Array(1536).fill(0.1) // Mock 1536-dim embedding
  ))
}))
```

## Ã­â€¦Å’Ã¬Å Â¤Ã­Å Â¸ Ã¬Â»Â¤Ã«Â²â€žÃ«Â¦Â¬Ã¬Â§â‚¬ ÃªÂ²â‚¬Ã¬Â¦Â

### Ã¬Â»Â¤Ã«Â²â€žÃ«Â¦Â¬Ã¬Â§â‚¬ Ã«Â¦Â¬Ã­ÂÂ¬Ã­Å Â¸ Ã¬â€¹Â¤Ã­â€“â€°
```bash
npm run test:coverage
```

### Ã¬Â»Â¤Ã«Â²â€žÃ«Â¦Â¬Ã¬Â§â‚¬ Ã¬Å¾â€žÃªÂ³â€žÃªÂ°â€™
```json
{
  "jest": {
    "coverageThreshold": {
      "global": {
        "branches": 80,
        "functions": 80,
        "lines": 80,
        "statements": 80
      }
    }
  }
}
```

## Ã­Ââ€Ã­â€¢Å“ Ã­â€¦Å’Ã¬Å Â¤Ã­Å Â¸ Ã¬â€¹Â¤Ã¬Ë†Ëœ

### Ã¬Å¾ËœÃ«ÂªÂ»Ã«ÂÅ“ Ã¬ËœË†: ÃªÂµÂ¬Ã­Ëœâ€ž Ã¬â€žÂ¸Ã«Â¶â‚¬Ã¬â€šÂ¬Ã­â€¢Â­ Ã­â€¦Å’Ã¬Å Â¤Ã­Å Â¸
```typescript
// Don't test internal state
expect(component.state.count).toBe(5)
```

### Ã¬ËœÂ¬Ã«Â°â€Ã«Â¥Â¸ Ã¬ËœË†: Ã¬â€šÂ¬Ã¬Å¡Â©Ã¬Å¾ÂÃ¬â€”ÂÃªÂ²Å’ Ã«Â³Â´Ã¬ÂÂ´Ã«Å â€ Ã«Ââ„¢Ã¬Å¾â€˜ Ã­â€¦Å’Ã¬Å Â¤Ã­Å Â¸
```typescript
// Test what users see
expect(screen.getByText('Count: 5')).toBeInTheDocument()
```

### Ã¬Å¾ËœÃ«ÂªÂ»Ã«ÂÅ“ Ã¬ËœË†: Ã¬Â·Â¨Ã¬â€¢Â½Ã­â€¢Å“ Ã¬â€¦â‚¬Ã«Â â€°Ã­â€žÂ°
```typescript
// Breaks easily
await page.click('.css-class-xyz')
```

### Ã¬ËœÂ¬Ã«Â°â€Ã«Â¥Â¸ Ã¬ËœË†: Ã¬â€¹Å“Ã«Â§Â¨Ã­â€¹Â± Ã¬â€¦â‚¬Ã«Â â€°Ã­â€žÂ°
```typescript
// Resilient to changes
await page.click('button:has-text("Submit")')
await page.click('[data-testid="submit-button"]')
```

### Ã¬Å¾ËœÃ«ÂªÂ»Ã«ÂÅ“ Ã¬ËœË†: Ã­â€¦Å’Ã¬Å Â¤Ã­Å Â¸ ÃªÂ²Â©Ã«Â¦Â¬ Ã¬â€”â€ Ã¬ÂÅ’
```typescript
// Tests depend on each other
test('creates user', () => { /* ... */ })
test('updates same user', () => { /* depends on previous test */ })
```

### Ã¬ËœÂ¬Ã«Â°â€Ã«Â¥Â¸ Ã¬ËœË†: Ã«Ââ€¦Ã«Â¦Â½Ã¬Â ÂÃ¬ÂÂ¸ Ã­â€¦Å’Ã¬Å Â¤Ã­Å Â¸
```typescript
// Each test sets up its own data
test('creates user', () => {
  const user = createTestUser()
  // Test logic
})

test('updates user', () => {
  const user = createTestUser()
  // Update logic
})
```

## Ã¬Â§â‚¬Ã¬â€ ÂÃ¬Â Â Ã­â€¦Å’Ã¬Å Â¤Ã­Å Â¸

### ÃªÂ°Å“Ã«Â°Å“ Ã¬Â¤â€˜ Watch Ã«ÂªÂ¨Ã«â€œÅ“
```bash
npm test -- --watch
# Tests run automatically on file changes
```

### Pre-Commit Hook
```bash
# Runs before every commit
npm test && npm run lint
```

### CI/CD Ã­â€ ÂµÃ­â€¢Â©
```yaml
# GitHub Actions
- name: Run Tests
  run: npm test -- --coverage
- name: Upload Coverage
  uses: codecov/codecov-action@v3
```

## Ã«ÂªÂ¨Ã«Â²â€ Ã¬â€šÂ¬Ã«Â¡â‚¬

1. **Ã­â€¦Å’Ã¬Å Â¤Ã­Å Â¸ Ã«Â¨Â¼Ã¬Â â‚¬ Ã¬Å¾â€˜Ã¬â€žÂ±** - Ã­â€¢Â­Ã¬Æ’Â TDD
2. **Ã­â€¦Å’Ã¬Å Â¤Ã­Å Â¸Ã«â€¹Â¹ Ã­â€¢ËœÃ«â€šËœÃ¬ÂËœ Assert** - Ã«â€¹Â¨Ã¬ÂÂ¼ Ã«Ââ„¢Ã¬Å¾â€˜Ã¬â€”Â Ã¬Â§â€˜Ã¬Â¤â€˜
3. **Ã¬â€žÂ¤Ã«Âªâ€¦Ã¬Â ÂÃ¬ÂÂ¸ Ã­â€¦Å’Ã¬Å Â¤Ã­Å Â¸ Ã¬ÂÂ´Ã«Â¦â€ž** - Ã«Â¬Â´Ã¬â€”â€¡Ã¬Ââ€ž Ã­â€¦Å’Ã¬Å Â¤Ã­Å Â¸Ã­â€¢ËœÃ«Å â€Ã¬Â§â‚¬ Ã¬â€žÂ¤Ã«Âªâ€¦
4. **Arrange-Act-Assert** - Ã«Âªâ€¦Ã­â„¢â€¢Ã­â€¢Å“ Ã­â€¦Å’Ã¬Å Â¤Ã­Å Â¸ ÃªÂµÂ¬Ã¬Â¡Â°
5. **Ã¬â„¢Â¸Ã«Â¶â‚¬ Ã¬ÂËœÃ¬Â¡Â´Ã¬â€žÂ± Ã«ÂªÂ¨Ã­â€šÂ¹** - Ã«â€¹Â¨Ã¬Å“â€ž Ã­â€¦Å’Ã¬Å Â¤Ã­Å Â¸ ÃªÂ²Â©Ã«Â¦Â¬
6. **Ã¬â€”Â£Ã¬Â§â‚¬ Ã¬Â¼â‚¬Ã¬ÂÂ´Ã¬Å Â¤ Ã­â€¦Å’Ã¬Å Â¤Ã­Å Â¸** - null, undefined, Ã«Â¹Ë† ÃªÂ°â€™, Ã­ÂÂ° ÃªÂ°â€™
7. **Ã¬â€”ÂÃ«Å¸Â¬ ÃªÂ²Â½Ã«Â¡Å“ Ã­â€¦Å’Ã¬Å Â¤Ã­Å Â¸** - Ã¬Â â€¢Ã¬Æ’Â ÃªÂ²Â½Ã«Â¡Å“Ã«Â§Å’Ã¬ÂÂ´ Ã¬â€¢â€žÃ«â€¹Å’
8. **Ã­â€¦Å’Ã¬Å Â¤Ã­Å Â¸ Ã¬â€ ÂÃ«Ââ€ž Ã¬Å“Â Ã¬Â§â‚¬** - Ã«â€¹Â¨Ã¬Å“â€ž Ã­â€¦Å’Ã¬Å Â¤Ã­Å Â¸ ÃªÂ°Â 50ms Ã«Â¯Â¸Ã«Â§Å’
9. **Ã­â€¦Å’Ã¬Å Â¤Ã­Å Â¸ Ã­â€ºâ€ž Ã¬Â â€¢Ã«Â¦Â¬** - Ã«Â¶â‚¬Ã¬Å¾â€˜Ã¬Å¡Â© Ã¬â€”â€ Ã¬ÂÅ’
10. **Ã¬Â»Â¤Ã«Â²â€žÃ«Â¦Â¬Ã¬Â§â‚¬ Ã«Â¦Â¬Ã­ÂÂ¬Ã­Å Â¸ ÃªÂ²â‚¬Ã­â€ Â ** - Ã«Ë†â€žÃ«ÂÂ½ Ã«Â¶â‚¬Ã«Â¶â€ž Ã¬â€¹ÂÃ«Â³â€ž

## Ã¬â€žÂ±ÃªÂ³Âµ Ã¬Â§â‚¬Ã­â€˜Å“

- 80% Ã¬ÂÂ´Ã¬Æ’ÂÃ¬ÂËœ Ã¬Â½â€Ã«â€œÅ“ Ã¬Â»Â¤Ã«Â²â€žÃ«Â¦Â¬Ã¬Â§â‚¬ Ã«â€¹Â¬Ã¬â€žÂ±
- Ã«ÂªÂ¨Ã«â€œÂ  Ã­â€¦Å’Ã¬Å Â¤Ã­Å Â¸ Ã­â€ ÂµÃªÂ³Â¼ (ÃªÂ·Â¸Ã«Â¦Â°)
- ÃªÂ±Â´Ã«â€žË†Ã«â€ºÂ´ Ã­â€¦Å’Ã¬Å Â¤Ã­Å Â¸Ã«â€šËœ Ã«Â¹â€žÃ­â„¢Å“Ã¬â€žÂ±Ã­â„¢â€Ã«ÂÅ“ Ã­â€¦Å’Ã¬Å Â¤Ã­Å Â¸ Ã¬â€”â€ Ã¬ÂÅ’
- Ã«Â¹Â Ã«Â¥Â¸ Ã­â€¦Å’Ã¬Å Â¤Ã­Å Â¸ Ã¬â€¹Â¤Ã­â€“â€° (Ã«â€¹Â¨Ã¬Å“â€ž Ã­â€¦Å’Ã¬Å Â¤Ã­Å Â¸ 30Ã¬Â´Ë† Ã«Â¯Â¸Ã«Â§Å’)
- E2E Ã­â€¦Å’Ã¬Å Â¤Ã­Å Â¸ÃªÂ°â‚¬ Ã­â€¢ÂµÃ¬â€¹Â¬ Ã¬â€šÂ¬Ã¬Å¡Â©Ã¬Å¾Â Ã­â€Å’Ã«Â¡Å“Ã¬Å¡Â°Ã«Â¥Â¼ Ã¬Â»Â¤Ã«Â²â€ž
- Ã­â€¦Å’Ã¬Å Â¤Ã­Å Â¸ÃªÂ°â‚¬ Ã­â€â€žÃ«Â¡Å“Ã«Ââ€¢Ã¬â€¦Ëœ Ã¬ÂÂ´Ã¬Â â€žÃ¬â€”Â Ã«Â²â€žÃªÂ·Â¸Ã«Â¥Â¼ Ã­ÂÂ¬Ã¬Â°Â©

---

**ÃªÂ¸Â°Ã¬â€“ÂµÃ­â€¢ËœÃ¬â€žÂ¸Ã¬Å¡â€**: Ã­â€¦Å’Ã¬Å Â¤Ã­Å Â¸Ã«Å â€ Ã¬â€žÂ Ã­Æ’Â Ã¬â€šÂ¬Ã­â€¢Â­Ã¬ÂÂ´ Ã¬â€¢â€žÃ«â€¹â„¢Ã«â€¹Ë†Ã«â€¹Â¤. Ã­â€¦Å’Ã¬Å Â¤Ã­Å Â¸Ã«Å â€ Ã¬Å¾ÂÃ¬â€¹Â ÃªÂ°Â Ã¬Å¾Ë†Ã«Å â€ Ã«Â¦Â¬Ã­Å’Â©Ã­â€žÂ°Ã«Â§Â, Ã«Â¹Â Ã«Â¥Â¸ ÃªÂ°Å“Ã«Â°Å“, ÃªÂ·Â¸Ã«Â¦Â¬ÃªÂ³Â  Ã­â€â€žÃ«Â¡Å“Ã«Ââ€¢Ã¬â€¦Ëœ Ã¬â€¢Ë†Ã¬Â â€¢Ã¬â€žÂ±Ã¬Ââ€ž ÃªÂ°â‚¬Ã«Å Â¥Ã­â€¢ËœÃªÂ²Å’ Ã­â€¢ËœÃ«Å â€ Ã¬â€¢Ë†Ã¬Â â€žÃ«Â§ÂÃ¬Å¾â€¦Ã«â€¹Ë†Ã«â€¹Â¤.
