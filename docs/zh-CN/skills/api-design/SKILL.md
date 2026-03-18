---
name: api-design
description: REST APIÃ¨Â®Â¾Ã¨Â®Â¡Ã¦Â¨Â¡Ã¥Â¼ÂÃ¯Â¼Å’Ã¥Å’â€¦Ã¦â€¹Â¬Ã¨Âµâ€žÃ¦ÂºÂÃ¥â€˜Â½Ã¥ÂÂÃ£â‚¬ÂÃ§Å Â¶Ã¦â‚¬ÂÃ§Â ÂÃ£â‚¬ÂÃ¥Ë†â€ Ã©Â¡ÂµÃ£â‚¬ÂÃ¨Â¿â€¡Ã¦Â»Â¤Ã£â‚¬ÂÃ©â€â„¢Ã¨Â¯Â¯Ã¥â€œÂÃ¥Âºâ€Ã£â‚¬ÂÃ§â€°Ë†Ã¦Å“Â¬Ã¦Å½Â§Ã¥Ë†Â¶Ã¥â€™Å’Ã§â€Å¸Ã¤ÂºÂ§APIÃ§Å¡â€žÃ©â‚¬Å¸Ã§Å½â€¡Ã©â„¢ÂÃ¥Ë†Â¶Ã£â‚¬â€š
origin: claude-fulcrum
---

# API Ã¨Â®Â¾Ã¨Â®Â¡Ã¦Â¨Â¡Ã¥Â¼Â

Ã§â€Â¨Ã¤ÂºÅ½Ã¨Â®Â¾Ã¨Â®Â¡Ã¤Â¸â‚¬Ã¨â€¡Â´Ã£â‚¬ÂÃ¥Â¯Â¹Ã¥Â¼â‚¬Ã¥Ââ€˜Ã¨â‚¬â€¦Ã¥Ââ€¹Ã¥Â¥Â½Ã§Å¡â€ž REST API Ã§Å¡â€žÃ§ÂºÂ¦Ã¥Â®Å¡Ã¥â€™Å’Ã¦Å“â‚¬Ã¤Â½Â³Ã¥Â®Å¾Ã¨Â·ÂµÃ£â‚¬â€š

## Ã¤Â½â€¢Ã¦â€”Â¶Ã¥ÂÂ¯Ã§â€Â¨

* Ã¨Â®Â¾Ã¨Â®Â¡Ã¦â€“Â°Ã§Å¡â€ž API Ã§Â«Â¯Ã§â€šÂ¹Ã¦â€”Â¶
* Ã¥Â®Â¡Ã¦Å¸Â¥Ã§Å½Â°Ã¦Å“â€°Ã§Å¡â€ž API Ã¥Â¥â€˜Ã§ÂºÂ¦Ã¦â€”Â¶
* Ã¦Â·Â»Ã¥Å Â Ã¥Ë†â€ Ã©Â¡ÂµÃ£â‚¬ÂÃ¨Â¿â€¡Ã¦Â»Â¤Ã¦Ë†â€“Ã¦Å½â€™Ã¥ÂºÂÃ¥Å Å¸Ã¨Æ’Â½Ã¦â€”Â¶
* Ã¤Â¸Âº API Ã¥Â®Å¾Ã§Å½Â°Ã©â€â„¢Ã¨Â¯Â¯Ã¥Â¤â€žÃ§Ââ€ Ã¦â€”Â¶
* Ã¨Â§â€žÃ¥Ë†â€™ API Ã§â€°Ë†Ã¦Å“Â¬Ã§Â­â€“Ã§â€¢Â¥Ã¦â€”Â¶
* Ã¦Å¾â€žÃ¥Â»ÂºÃ©ÂÂ¢Ã¥Ââ€˜Ã¥â€¦Â¬Ã¤Â¼â€”Ã¦Ë†â€“Ã¥ÂË†Ã¤Â½Å“Ã¤Â¼â„¢Ã¤Â¼Â´Ã§Å¡â€ž API Ã¦â€”Â¶

## Ã¨Âµâ€žÃ¦ÂºÂÃ¨Â®Â¾Ã¨Â®Â¡

### URL Ã§Â»â€œÃ¦Å¾â€ž

```
# Resources are nouns, plural, lowercase, kebab-case
GET    /api/v1/users
GET    /api/v1/users/:id
POST   /api/v1/users
PUT    /api/v1/users/:id
PATCH  /api/v1/users/:id
DELETE /api/v1/users/:id

# Sub-resources for relationships
GET    /api/v1/users/:id/orders
POST   /api/v1/users/:id/orders

# Actions that don't map to CRUD (use verbs sparingly)
POST   /api/v1/orders/:id/cancel
POST   /api/v1/auth/login
POST   /api/v1/auth/refresh
```

### Ã¥â€˜Â½Ã¥ÂÂÃ¨Â§â€žÃ¥Ë†â„¢

```
# GOOD
/api/v1/team-members          # kebab-case for multi-word resources
/api/v1/orders?status=active  # query params for filtering
/api/v1/users/123/orders      # nested resources for ownership

# BAD
/api/v1/getUsers              # verb in URL
/api/v1/user                  # singular (use plural)
/api/v1/team_members          # snake_case in URLs
/api/v1/users/123/getOrders   # verb in nested resource
```

## HTTP Ã¦â€“Â¹Ã¦Â³â€¢Ã¥â€™Å’Ã§Å Â¶Ã¦â‚¬ÂÃ§Â Â

### Ã¦â€“Â¹Ã¦Â³â€¢Ã¨Â¯Â­Ã¤Â¹â€°

| Ã¦â€“Â¹Ã¦Â³â€¢ | Ã¥Â¹â€šÃ§Â­â€°Ã¦â‚¬Â§ | Ã¥Â®â€°Ã¥â€¦Â¨Ã¦â‚¬Â§ | Ã§â€Â¨Ã©â‚¬â€ |
|--------|-----------|------|---------|
| GET | Ã¦ËœÂ¯ | Ã¦ËœÂ¯ | Ã¦Â£â‚¬Ã§Â´Â¢Ã¨Âµâ€žÃ¦ÂºÂ |
| POST | Ã¥ÂÂ¦ | Ã¥ÂÂ¦ | Ã¥Ë†â€ºÃ¥Â»ÂºÃ¨Âµâ€žÃ¦ÂºÂÃ¯Â¼Å’Ã¨Â§Â¦Ã¥Ââ€˜Ã¦â€œÂÃ¤Â½Å“ |
| PUT | Ã¦ËœÂ¯ | Ã¥ÂÂ¦ | Ã¥Â®Å’Ã¥â€¦Â¨Ã¦â€ºÂ¿Ã¦ÂÂ¢Ã¨Âµâ€žÃ¦ÂºÂ |
| PATCH | Ã¥ÂÂ¦\* | Ã¥ÂÂ¦ | Ã©Æ’Â¨Ã¥Ë†â€ Ã¦â€ºÂ´Ã¦â€“Â°Ã¨Âµâ€žÃ¦ÂºÂ |
| DELETE | Ã¦ËœÂ¯ | Ã¥ÂÂ¦ | Ã¥Ë†Â Ã©â„¢Â¤Ã¨Âµâ€žÃ¦ÂºÂ |

\*Ã©â‚¬Å¡Ã¨Â¿â€¡Ã©â‚¬â€šÃ¥Â½â€œÃ§Å¡â€žÃ¥Â®Å¾Ã§Å½Â°Ã¯Â¼Å’PATCH Ã¥ÂÂ¯Ã¤Â»Â¥Ã¥Â®Å¾Ã§Å½Â°Ã¥Â¹â€šÃ§Â­â€°

### Ã§Å Â¶Ã¦â‚¬ÂÃ§Â ÂÃ¥Ââ€šÃ¨â‚¬Æ’

```
# Success
200 OK                    Ã¢â‚¬â€ GET, PUT, PATCH (with response body)
201 Created               Ã¢â‚¬â€ POST (include Location header)
204 No Content            Ã¢â‚¬â€ DELETE, PUT (no response body)

# Client Errors
400 Bad Request           Ã¢â‚¬â€ Validation failure, malformed JSON
401 Unauthorized          Ã¢â‚¬â€ Missing or invalid authentication
403 Forbidden             Ã¢â‚¬â€ Authenticated but not authorized
404 Not Found             Ã¢â‚¬â€ Resource doesn't exist
409 Conflict              Ã¢â‚¬â€ Duplicate entry, state conflict
422 Unprocessable Entity  Ã¢â‚¬â€ Semantically invalid (valid JSON, bad data)
429 Too Many Requests     Ã¢â‚¬â€ Rate limit exceeded

# Server Errors
500 Internal Server Error Ã¢â‚¬â€ Unexpected failure (never expose details)
502 Bad Gateway           Ã¢â‚¬â€ Upstream service failed
503 Service Unavailable   Ã¢â‚¬â€ Temporary overload, include Retry-After
```

### Ã¥Â¸Â¸Ã¨Â§ÂÃ©â€â„¢Ã¨Â¯Â¯

```
# BAD: 200 for everything
{ "status": 200, "success": false, "error": "Not found" }

# GOOD: Use HTTP status codes semantically
HTTP/1.1 404 Not Found
{ "error": { "code": "not_found", "message": "User not found" } }

# BAD: 500 for validation errors
# GOOD: 400 or 422 with field-level details

# BAD: 200 for created resources
# GOOD: 201 with Location header
HTTP/1.1 201 Created
Location: /api/v1/users/abc-123
```

## Ã¥â€œÂÃ¥Âºâ€Ã¦Â Â¼Ã¥Â¼Â

### Ã¦Ë†ÂÃ¥Å Å¸Ã¥â€œÂÃ¥Âºâ€

```json
{
  "data": {
    "id": "abc-123",
    "email": "alice@example.com",
    "name": "Alice",
    "created_at": "2025-01-15T10:30:00Z"
  }
}
```

### Ã©â€ºâ€ Ã¥ÂË†Ã¥â€œÂÃ¥Âºâ€Ã¯Â¼Ë†Ã¥Â¸Â¦Ã¥Ë†â€ Ã©Â¡ÂµÃ¯Â¼â€°

```json
{
  "data": [
    { "id": "abc-123", "name": "Alice" },
    { "id": "def-456", "name": "Bob" }
  ],
  "meta": {
    "total": 142,
    "page": 1,
    "per_page": 20,
    "total_pages": 8
  },
  "links": {
    "self": "/api/v1/users?page=1&per_page=20",
    "next": "/api/v1/users?page=2&per_page=20",
    "last": "/api/v1/users?page=8&per_page=20"
  }
}
```

### Ã©â€â„¢Ã¨Â¯Â¯Ã¥â€œÂÃ¥Âºâ€

```json
{
  "error": {
    "code": "validation_error",
    "message": "Request validation failed",
    "details": [
      {
        "field": "email",
        "message": "Must be a valid email address",
        "code": "invalid_format"
      },
      {
        "field": "age",
        "message": "Must be between 0 and 150",
        "code": "out_of_range"
      }
    ]
  }
}
```

### Ã¥â€œÂÃ¥Âºâ€Ã¥Å’â€¦Ã¨Â£â€¦Ã¥â„¢Â¨Ã¥ÂËœÃ¤Â½â€œ

```typescript
// Option A: Envelope with data wrapper (recommended for public APIs)
interface ApiResponse<T> {
  data: T;
  meta?: PaginationMeta;
  links?: PaginationLinks;
}

interface ApiError {
  error: {
    code: string;
    message: string;
    details?: FieldError[];
  };
}

// Option B: Flat response (simpler, common for internal APIs)
// Success: just return the resource directly
// Error: return error object
// Distinguish by HTTP status code
```

## Ã¥Ë†â€ Ã©Â¡Âµ

### Ã¥Å¸ÂºÃ¤ÂºÅ½Ã¥ÂÂÃ§Â§Â»Ã©â€¡ÂÃ¯Â¼Ë†Ã§Â®â‚¬Ã¥Ââ€¢Ã¯Â¼â€°

```
GET /api/v1/users?page=2&per_page=20

# Implementation
SELECT * FROM users
ORDER BY created_at DESC
LIMIT 20 OFFSET 20;
```

**Ã¤Â¼ËœÃ§â€šÂ¹Ã¯Â¼Å¡** Ã¦Ëœâ€œÃ¤ÂºÅ½Ã¥Â®Å¾Ã§Å½Â°Ã¯Â¼Å’Ã¦â€Â¯Ã¦Å’ÂÃ¢â‚¬Å“Ã¨Â·Â³Ã¨Â½Â¬Ã¥Ë†Â°Ã§Â¬Â¬ N Ã©Â¡ÂµÃ¢â‚¬Â
**Ã§Â¼ÂºÃ§â€šÂ¹Ã¯Â¼Å¡** Ã¥Å“Â¨Ã¥Â¤Â§Ã¥ÂÂÃ§Â§Â»Ã©â€¡ÂÃ¦â€”Â¶Ã©â‚¬Å¸Ã¥ÂºÂ¦Ã¦â€¦Â¢Ã¯Â¼Ë†Ã¤Â¾â€¹Ã¥Â¦â€š OFFSET 100000Ã¯Â¼â€°Ã¯Â¼Å’Ã¥Â¹Â¶Ã¥Ââ€˜Ã¦Ââ€™Ã¥â€¦Â¥Ã¦â€”Â¶Ã§Â»â€œÃ¦Å¾Å“Ã¤Â¸ÂÃ¤Â¸â‚¬Ã¨â€¡Â´

### Ã¥Å¸ÂºÃ¤ÂºÅ½Ã¦Â¸Â¸Ã¦Â â€¡Ã¯Â¼Ë†Ã¥ÂÂ¯Ã¦â€°Â©Ã¥Â±â€¢Ã¯Â¼â€°

```
GET /api/v1/users?cursor=eyJpZCI6MTIzfQ&limit=20

# Implementation
SELECT * FROM users
WHERE id > :cursor_id
ORDER BY id ASC
LIMIT 21;  -- fetch one extra to determine has_next
```

```json
{
  "data": [...],
  "meta": {
    "has_next": true,
    "next_cursor": "eyJpZCI6MTQzfQ"
  }
}
```

**Ã¤Â¼ËœÃ§â€šÂ¹Ã¯Â¼Å¡** Ã¦â€”Â Ã¨Â®ÂºÃ¤Â½ÂÃ§Â½Â®Ã¥Â¦â€šÃ¤Â½â€¢Ã¯Â¼Å’Ã¦â‚¬Â§Ã¨Æ’Â½Ã¤Â¸â‚¬Ã¨â€¡Â´Ã¯Â¼â€ºÃ¥Å“Â¨Ã¥Â¹Â¶Ã¥Ââ€˜Ã¦Ââ€™Ã¥â€¦Â¥Ã¦â€”Â¶Ã§Â»â€œÃ¦Å¾Å“Ã§Â¨Â³Ã¥Â®Å¡
**Ã§Â¼ÂºÃ§â€šÂ¹Ã¯Â¼Å¡** Ã¦â€”Â Ã¦Â³â€¢Ã¨Â·Â³Ã¨Â½Â¬Ã¥Ë†Â°Ã¤Â»Â»Ã¦â€žÂÃ©Â¡ÂµÃ©ÂÂ¢Ã¯Â¼â€ºÃ¦Â¸Â¸Ã¦Â â€¡Ã¦ËœÂ¯Ã¤Â¸ÂÃ©â‚¬ÂÃ¦ËœÅ½Ã§Å¡â€ž

### Ã¤Â½â€¢Ã¦â€”Â¶Ã¤Â½Â¿Ã§â€Â¨Ã¥â€œÂªÃ§Â§Â

| Ã§â€Â¨Ã¤Â¾â€¹ | Ã¥Ë†â€ Ã©Â¡ÂµÃ§Â±Â»Ã¥Å¾â€¹ |
|----------|----------------|
| Ã§Â®Â¡Ã§Ââ€ Ã¤Â»ÂªÃ¨Â¡Â¨Ã¦ÂÂ¿Ã¯Â¼Å’Ã¥Â°ÂÃ¦â€¢Â°Ã¦ÂÂ®Ã©â€ºâ€  (<10K) | Ã¥ÂÂÃ§Â§Â»Ã©â€¡Â |
| Ã¦â€”Â Ã©â„¢ÂÃ¦Â»Å¡Ã¥Å Â¨Ã¯Â¼Å’Ã¤Â¿Â¡Ã¦ÂÂ¯Ã¦ÂµÂÃ¯Â¼Å’Ã¥Â¤Â§Ã¦â€¢Â°Ã¦ÂÂ®Ã©â€ºâ€  | Ã¦Â¸Â¸Ã¦Â â€¡ |
| Ã¥â€¦Â¬Ã¥â€¦Â± API | Ã¦Â¸Â¸Ã¦Â â€¡Ã¯Â¼Ë†Ã©Â»ËœÃ¨Â®Â¤Ã¯Â¼â€°Ã©â€¦ÂÃ¥ÂË†Ã¥ÂÂÃ§Â§Â»Ã©â€¡ÂÃ¯Â¼Ë†Ã¥ÂÂ¯Ã©â‚¬â€°Ã¯Â¼â€° |
| Ã¦ÂÅ“Ã§Â´Â¢Ã§Â»â€œÃ¦Å¾Å“ | Ã¥ÂÂÃ§Â§Â»Ã©â€¡ÂÃ¯Â¼Ë†Ã§â€Â¨Ã¦Ë†Â·Ã¦Å“Å¸Ã¦Å“â€ºÃ¦Å“â€°Ã©Â¡ÂµÃ§Â ÂÃ¯Â¼â€° |

## Ã¨Â¿â€¡Ã¦Â»Â¤Ã£â‚¬ÂÃ¦Å½â€™Ã¥ÂºÂÃ¥â€™Å’Ã¦ÂÅ“Ã§Â´Â¢

### Ã¨Â¿â€¡Ã¦Â»Â¤

```
# Simple equality
GET /api/v1/orders?status=active&customer_id=abc-123

# Comparison operators (use bracket notation)
GET /api/v1/products?price[gte]=10&price[lte]=100
GET /api/v1/orders?created_at[after]=2025-01-01

# Multiple values (comma-separated)
GET /api/v1/products?category=electronics,clothing

# Nested fields (dot notation)
GET /api/v1/orders?customer.country=US
```

### Ã¦Å½â€™Ã¥ÂºÂ

```
# Single field (prefix - for descending)
GET /api/v1/products?sort=-created_at

# Multiple fields (comma-separated)
GET /api/v1/products?sort=-featured,price,-created_at
```

### Ã¥â€¦Â¨Ã¦â€“â€¡Ã¦ÂÅ“Ã§Â´Â¢

```
# Search query parameter
GET /api/v1/products?q=wireless+headphones

# Field-specific search
GET /api/v1/users?email=alice
```

### Ã§Â¨â‚¬Ã§â€“ÂÃ¥Â­â€”Ã¦Â®ÂµÃ©â€ºâ€ 

```
# Return only specified fields (reduces payload)
GET /api/v1/users?fields=id,name,email
GET /api/v1/orders?fields=id,total,status&include=customer.name
```

## Ã¨Â®Â¤Ã¨Â¯ÂÃ¥â€™Å’Ã¦Å½Ë†Ã¦ÂÆ’

### Ã¥Å¸ÂºÃ¤ÂºÅ½Ã¤Â»Â¤Ã§â€°Å’Ã§Å¡â€žÃ¨Â®Â¤Ã¨Â¯Â

```
# Bearer token in Authorization header
GET /api/v1/users
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

# API key (for server-to-server)
GET /api/v1/data
X-API-Key: sk_live_abc123
```

### Ã¦Å½Ë†Ã¦ÂÆ’Ã¦Â¨Â¡Ã¥Â¼Â

```typescript
// Resource-level: check ownership
app.get("/api/v1/orders/:id", async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ error: { code: "not_found" } });
  if (order.userId !== req.user.id) return res.status(403).json({ error: { code: "forbidden" } });
  return res.json({ data: order });
});

// Role-based: check permissions
app.delete("/api/v1/users/:id", requireRole("admin"), async (req, res) => {
  await User.delete(req.params.id);
  return res.status(204).send();
});
```

## Ã©â‚¬Å¸Ã§Å½â€¡Ã©â„¢ÂÃ¥Ë†Â¶

### Ã¥â€œÂÃ¥Âºâ€Ã¥Â¤Â´

```
HTTP/1.1 200 OK
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640000000

# When exceeded
HTTP/1.1 429 Too Many Requests
Retry-After: 60
{
  "error": {
    "code": "rate_limit_exceeded",
    "message": "Rate limit exceeded. Try again in 60 seconds."
  }
}
```

### Ã©â‚¬Å¸Ã§Å½â€¡Ã©â„¢ÂÃ¥Ë†Â¶Ã¥Â±â€šÃ§ÂºÂ§

| Ã¥Â±â€šÃ§ÂºÂ§ | Ã©â„¢ÂÃ¥Ë†Â¶ | Ã¦â€”Â¶Ã©â€”Â´Ã§Âªâ€”Ã¥ÂÂ£ | Ã§â€Â¨Ã¤Â¾â€¹ |
|------|-------|--------|----------|
| Ã¥Å’Â¿Ã¥ÂÂÃ§â€Â¨Ã¦Ë†Â· | 30/Ã¥Ë†â€ Ã©â€™Å¸ | Ã¦Â¯ÂÃ¤Â¸Âª IP | Ã¥â€¦Â¬Ã¥â€¦Â±Ã§Â«Â¯Ã§â€šÂ¹ |
| Ã¨Â®Â¤Ã¨Â¯ÂÃ§â€Â¨Ã¦Ë†Â· | 100/Ã¥Ë†â€ Ã©â€™Å¸ | Ã¦Â¯ÂÃ¤Â¸ÂªÃ§â€Â¨Ã¦Ë†Â· | Ã¦Â â€¡Ã¥â€¡â€  API Ã¨Â®Â¿Ã©â€”Â® |
| Ã©Â«ËœÃ§ÂºÂ§Ã§â€Â¨Ã¦Ë†Â· | 1000/Ã¥Ë†â€ Ã©â€™Å¸ | Ã¦Â¯ÂÃ¤Â¸Âª API Ã¥Â¯â€ Ã©â€™Â¥ | Ã¤Â»ËœÃ¨Â´Â¹ API Ã¥Â¥â€”Ã©Â¤Â |
| Ã¥â€ â€¦Ã©Æ’Â¨Ã¦Å“ÂÃ¥Å Â¡ | 10000/Ã¥Ë†â€ Ã©â€™Å¸ | Ã¦Â¯ÂÃ¤Â¸ÂªÃ¦Å“ÂÃ¥Å Â¡ | Ã¦Å“ÂÃ¥Å Â¡Ã©â€”Â´Ã¨Â°Æ’Ã§â€Â¨ |

## Ã§â€°Ë†Ã¦Å“Â¬Ã¦Å½Â§Ã¥Ë†Â¶

### URL Ã¨Â·Â¯Ã¥Â¾â€žÃ§â€°Ë†Ã¦Å“Â¬Ã¦Å½Â§Ã¥Ë†Â¶Ã¯Â¼Ë†Ã¦Å½Â¨Ã¨ÂÂÃ¯Â¼â€°

```
/api/v1/users
/api/v2/users
```

**Ã¤Â¼ËœÃ§â€šÂ¹Ã¯Â¼Å¡** Ã¦ËœÅ½Ã§Â¡Â®Ã¯Â¼Å’Ã¦Ëœâ€œÃ¤ÂºÅ½Ã¨Â·Â¯Ã§â€Â±Ã¯Â¼Å’Ã¥ÂÂ¯Ã§Â¼â€œÃ¥Â­Ëœ
**Ã§Â¼ÂºÃ§â€šÂ¹Ã¯Â¼Å¡** Ã§â€°Ë†Ã¦Å“Â¬Ã©â€”Â´ URL Ã¤Â¼Å¡Ã¥ÂËœÃ¥Å’â€“

### Ã¨Â¯Â·Ã¦Â±â€šÃ¥Â¤Â´Ã§â€°Ë†Ã¦Å“Â¬Ã¦Å½Â§Ã¥Ë†Â¶

```
GET /api/users
Accept: application/vnd.myapp.v2+json
```

**Ã¤Â¼ËœÃ§â€šÂ¹Ã¯Â¼Å¡** URL Ã§Â®â‚¬Ã¦Â´Â
**Ã§Â¼ÂºÃ§â€šÂ¹Ã¯Â¼Å¡** Ã¦Âµâ€¹Ã¨Â¯â€¢Ã¦â€ºÂ´Ã¥â€ºÂ°Ã©Å¡Â¾Ã¯Â¼Å’Ã¥Â®Â¹Ã¦Ëœâ€œÃ¥Â¿ËœÃ¨Â®Â°

### Ã§â€°Ë†Ã¦Å“Â¬Ã¦Å½Â§Ã¥Ë†Â¶Ã§Â­â€“Ã§â€¢Â¥

```
1. Start with /api/v1/ Ã¢â‚¬â€ don't version until you need to
2. Maintain at most 2 active versions (current + previous)
3. Deprecation timeline:
   - Announce deprecation (6 months notice for public APIs)
   - Add Sunset header: Sunset: Sat, 01 Jan 2026 00:00:00 GMT
   - Return 410 Gone after sunset date
4. Non-breaking changes don't need a new version:
   - Adding new fields to responses
   - Adding new optional query parameters
   - Adding new endpoints
5. Breaking changes require a new version:
   - Removing or renaming fields
   - Changing field types
   - Changing URL structure
   - Changing authentication method
```

## Ã¥Â®Å¾Ã§Å½Â°Ã¦Â¨Â¡Ã¥Â¼Â

### TypeScript (Next.js API Ã¨Â·Â¯Ã§â€Â±)

```typescript
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";

const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = createUserSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({
      error: {
        code: "validation_error",
        message: "Request validation failed",
        details: parsed.error.issues.map(i => ({
          field: i.path.join("."),
          message: i.message,
          code: i.code,
        })),
      },
    }, { status: 422 });
  }

  const user = await createUser(parsed.data);

  return NextResponse.json(
    { data: user },
    {
      status: 201,
      headers: { Location: `/api/v1/users/${user.id}` },
    },
  );
}
```

### Python (Django REST Framework)

```python
from rest_framework import serializers, viewsets, status
from rest_framework.response import Response

class CreateUserSerializer(serializers.Serializer):
    email = serializers.EmailField()
    name = serializers.CharField(max_length=100)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "email", "name", "created_at"]

class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action == "create":
            return CreateUserSerializer
        return UserSerializer

    def create(self, request):
        serializer = CreateUserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = UserService.create(**serializer.validated_data)
        return Response(
            {"data": UserSerializer(user).data},
            status=status.HTTP_201_CREATED,
            headers={"Location": f"/api/v1/users/{user.id}"},
        )
```

### Go (net/http)

```go
func (h *UserHandler) CreateUser(w http.ResponseWriter, r *http.Request) {
    var req CreateUserRequest
    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        writeError(w, http.StatusBadRequest, "invalid_json", "Invalid request body")
        return
    }

    if err := req.Validate(); err != nil {
        writeError(w, http.StatusUnprocessableEntity, "validation_error", err.Error())
        return
    }

    user, err := h.service.Create(r.Context(), req)
    if err != nil {
        switch {
        case errors.Is(err, domain.ErrEmailTaken):
            writeError(w, http.StatusConflict, "email_taken", "Email already registered")
        default:
            writeError(w, http.StatusInternalServerError, "internal_error", "Internal error")
        }
        return
    }

    w.Header().Set("Location", fmt.Sprintf("/api/v1/users/%s", user.ID))
    writeJSON(w, http.StatusCreated, map[string]any{"data": user})
}
```

## API Ã¨Â®Â¾Ã¨Â®Â¡Ã¦Â¸â€¦Ã¥Ââ€¢

Ã¥Ââ€˜Ã¥Â¸Æ’Ã¦â€“Â°Ã§Â«Â¯Ã§â€šÂ¹Ã¥â€°ÂÃ¨Â¯Â·Ã¦Â£â‚¬Ã¦Å¸Â¥Ã¯Â¼Å¡

* \[ ] Ã¨Âµâ€žÃ¦ÂºÂ URL Ã©ÂÂµÃ¥Â¾ÂªÃ¥â€˜Â½Ã¥ÂÂÃ§ÂºÂ¦Ã¥Â®Å¡Ã¯Â¼Ë†Ã¥Â¤ÂÃ¦â€¢Â°Ã£â‚¬ÂÃ§Å¸Â­Ã¦Â¨ÂªÃ§ÂºÂ¿Ã¨Â¿Å¾Ã¦Å½Â¥Ã£â‚¬ÂÃ¤Â¸ÂÃ¥ÂÂ«Ã¥Å Â¨Ã¨Â¯ÂÃ¯Â¼â€°
* \[ ] Ã¤Â½Â¿Ã§â€Â¨Ã¤Âºâ€ Ã¦Â­Â£Ã§Â¡Â®Ã§Å¡â€ž HTTP Ã¦â€“Â¹Ã¦Â³â€¢Ã¯Â¼Ë†GET Ã§â€Â¨Ã¤ÂºÅ½Ã¨Â¯Â»Ã¥Ââ€“Ã¯Â¼Å’POST Ã§â€Â¨Ã¤ÂºÅ½Ã¥Ë†â€ºÃ¥Â»ÂºÃ§Â­â€°Ã¯Â¼â€°
* \[ ] Ã¨Â¿â€Ã¥â€ºÅ¾Ã¤Âºâ€ Ã©â‚¬â€šÃ¥Â½â€œÃ§Å¡â€žÃ§Å Â¶Ã¦â‚¬ÂÃ§Â ÂÃ¯Â¼Ë†Ã¤Â¸ÂÃ¨Â¦ÂÃ¦â€°â‚¬Ã¦Å“â€°Ã¦Æ’â€¦Ã¥â€ ÂµÃ©Æ’Â½Ã¨Â¿â€Ã¥â€ºÅ¾ 200Ã¯Â¼â€°
* \[ ] Ã¤Â½Â¿Ã§â€Â¨Ã¦Â¨Â¡Ã¥Â¼ÂÃ¯Â¼Ë†Zod, Pydantic, Bean ValidationÃ¯Â¼â€°Ã©ÂªÅ’Ã¨Â¯ÂÃ¤Âºâ€ Ã¨Â¾â€œÃ¥â€¦Â¥
* \[ ] Ã©â€â„¢Ã¨Â¯Â¯Ã¥â€œÂÃ¥Âºâ€Ã©ÂÂµÃ¥Â¾ÂªÃ¥Â¸Â¦Ã¤Â»Â£Ã§Â ÂÃ¥â€™Å’Ã¦Â¶Ë†Ã¦ÂÂ¯Ã§Å¡â€žÃ¦Â â€¡Ã¥â€¡â€ Ã¦Â Â¼Ã¥Â¼Â
* \[ ] Ã¥Ë†â€”Ã¨Â¡Â¨Ã§Â«Â¯Ã§â€šÂ¹Ã¥Â®Å¾Ã§Å½Â°Ã¤Âºâ€ Ã¥Ë†â€ Ã©Â¡ÂµÃ¯Â¼Ë†Ã¦Â¸Â¸Ã¦Â â€¡Ã¦Ë†â€“Ã¥ÂÂÃ§Â§Â»Ã©â€¡ÂÃ¯Â¼â€°
* \[ ] Ã©Å“â‚¬Ã¨Â¦ÂÃ¨Â®Â¤Ã¨Â¯ÂÃ¯Â¼Ë†Ã¦Ë†â€“Ã¦ËœÅ½Ã§Â¡Â®Ã¦Â â€¡Ã¨Â®Â°Ã¤Â¸ÂºÃ¥â€¦Â¬Ã¥Â¼â‚¬Ã¯Â¼â€°
* \[ ] Ã¦Â£â‚¬Ã¦Å¸Â¥Ã¤Âºâ€ Ã¦Å½Ë†Ã¦ÂÆ’Ã¯Â¼Ë†Ã§â€Â¨Ã¦Ë†Â·Ã¥ÂÂªÃ¨Æ’Â½Ã¨Â®Â¿Ã©â€”Â®Ã¨â€¡ÂªÃ¥Â·Â±Ã§Å¡â€žÃ¨Âµâ€žÃ¦ÂºÂÃ¯Â¼â€°
* \[ ] Ã©â€¦ÂÃ§Â½Â®Ã¤Âºâ€ Ã©â‚¬Å¸Ã§Å½â€¡Ã©â„¢ÂÃ¥Ë†Â¶
* \[ ] Ã¥â€œÂÃ¥Âºâ€Ã¦Å“ÂªÃ¦Â³â€žÃ©Å“Â²Ã¥â€ â€¦Ã©Æ’Â¨Ã§Â»â€ Ã¨Å â€šÃ¯Â¼Ë†Ã¥Â â€ Ã¦Â Ë†Ã¨Â·Å¸Ã¨Â¸ÂªÃ£â‚¬ÂSQL Ã©â€â„¢Ã¨Â¯Â¯Ã¯Â¼â€°
* \[ ] Ã¤Â¸Å½Ã§Å½Â°Ã¦Å“â€°Ã§Â«Â¯Ã§â€šÂ¹Ã¥â€˜Â½Ã¥ÂÂÃ¤Â¸â‚¬Ã¨â€¡Â´Ã¯Â¼Ë†camelCase Ã¥Â¯Â¹Ã¦Â¯â€ snake\_caseÃ¯Â¼â€°
* \[ ] Ã¥Â·Â²Ã¨Â®Â°Ã¥Â½â€¢Ã¯Â¼Ë†Ã¦â€ºÂ´Ã¦â€“Â°Ã¤Âºâ€  OpenAPI/Swagger Ã¨Â§â€žÃ¨Å’Æ’Ã¯Â¼â€°
