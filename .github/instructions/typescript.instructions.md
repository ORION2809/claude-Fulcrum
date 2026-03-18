---
applyTo: "**/*.ts,**/*.tsx,**/*.js,**/*.jsx"
---
# TypeScript/JavaScript Instructions

- Use strict TypeScript (`strict: true`) — no `any` types unless absolutely necessary
- Prefer `const` over `let`, never use `var`
- Use arrow functions for callbacks, named functions for top-level
- Prefer `interface` over `type` for object shapes
- Use discriminated unions over boolean flags
- Handle all Promise rejections — no unhandled `.catch()` chains
- Use `readonly` for arrays and properties that shouldn't change
- Prefer `Map`/`Set` over plain objects for dynamic keys
- Use `satisfies` operator for type-safe constant objects
- Import types with `import type { ... }` to keep runtime bundles clean
- No `console.log` in production code — use a proper logger
- Prefer `async/await` over `.then()` chains
- Handle null/undefined with optional chaining `?.` and nullish coalescing `??`
- Use ESM imports, not CommonJS `require()`
