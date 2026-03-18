---
name: backend-patterns
description: Node.js, Express, Next.js API Ã«ÂÂ¼Ã¬Å¡Â°Ã­Å Â¸Ã«Â¥Â¼ Ã¬Å“â€žÃ­â€¢Å“ Ã«Â°Â±Ã¬â€”â€Ã«â€œÅ“ Ã¬â€¢â€žÃ­â€šÂ¤Ã­â€¦ÂÃ¬Â²Ëœ Ã­Å’Â¨Ã­â€žÂ´, API Ã¬â€žÂ¤ÃªÂ³â€ž, Ã«ÂÂ°Ã¬ÂÂ´Ã­â€žÂ°Ã«Â²Â Ã¬ÂÂ´Ã¬Å Â¤ Ã¬ÂµÅ“Ã¬Â ÂÃ­â„¢â€ Ã«Â°Â Ã¬â€žÅ“Ã«Â²â€ž Ã¬â€šÂ¬Ã¬ÂÂ´Ã«â€œÅ“ Ã«ÂªÂ¨Ã«Â²â€ Ã¬â€šÂ¬Ã«Â¡â‚¬.
origin: claude-fulcrum
---

# Ã«Â°Â±Ã¬â€”â€Ã«â€œÅ“ ÃªÂ°Å“Ã«Â°Å“ Ã­Å’Â¨Ã­â€žÂ´

Ã­â„¢â€¢Ã¬Å¾Â¥ ÃªÂ°â‚¬Ã«Å Â¥Ã­â€¢Å“ Ã¬â€žÅ“Ã«Â²â€ž Ã¬â€šÂ¬Ã¬ÂÂ´Ã«â€œÅ“ Ã¬â€¢Â Ã­â€Å’Ã«Â¦Â¬Ã¬Â¼â‚¬Ã¬ÂÂ´Ã¬â€¦ËœÃ¬Ââ€ž Ã¬Å“â€žÃ­â€¢Å“ Ã«Â°Â±Ã¬â€”â€Ã«â€œÅ“ Ã¬â€¢â€žÃ­â€šÂ¤Ã­â€¦ÂÃ¬Â²Ëœ Ã­Å’Â¨Ã­â€žÂ´ÃªÂ³Â¼ Ã«ÂªÂ¨Ã«Â²â€ Ã¬â€šÂ¬Ã«Â¡â‚¬.

## Ã­â„¢Å“Ã¬â€žÂ±Ã­â„¢â€ Ã¬â€¹Å“Ã¬Â Â

- REST Ã«ËœÂÃ«Å â€ GraphQL API Ã¬â€”â€Ã«â€œÅ“Ã­ÂÂ¬Ã¬ÂÂ¸Ã­Å Â¸Ã«Â¥Â¼ Ã¬â€žÂ¤ÃªÂ³â€žÃ­â€¢Â  Ã«â€¢Å’
- Repository, Service Ã«ËœÂÃ«Å â€ Controller Ã«Â Ë†Ã¬ÂÂ´Ã¬â€“Â´Ã«Â¥Â¼ ÃªÂµÂ¬Ã­Ëœâ€žÃ­â€¢Â  Ã«â€¢Å’
- Ã«ÂÂ°Ã¬ÂÂ´Ã­â€žÂ°Ã«Â²Â Ã¬ÂÂ´Ã¬Å Â¤ Ã¬Â¿Â¼Ã«Â¦Â¬Ã«Â¥Â¼ Ã¬ÂµÅ“Ã¬Â ÂÃ­â„¢â€Ã­â€¢Â  Ã«â€¢Å’ (N+1, Ã¬ÂÂ¸Ã«ÂÂ±Ã¬â€¹Â±, Ã¬Â»Â¤Ã«â€žÂ¥Ã¬â€¦Ëœ Ã­â€™â‚¬Ã«Â§Â)
- Ã¬ÂºÂÃ¬â€¹Â±Ã¬Ââ€ž Ã¬Â¶â€ÃªÂ°â‚¬Ã­â€¢Â  Ã«â€¢Å’ (Redis, Ã¬ÂÂ¸Ã«Â©â€Ã«ÂªÂ¨Ã«Â¦Â¬, HTTP Ã¬ÂºÂÃ¬â€¹Å“ Ã­â€”Â¤Ã«Ââ€)
- Ã«Â°Â±ÃªÂ·Â¸Ã«ÂÂ¼Ã¬Å¡Â´Ã«â€œÅ“ Ã¬Å¾â€˜Ã¬â€”â€¦Ã¬ÂÂ´Ã«â€šËœ Ã«Â¹â€žÃ«Ââ„¢ÃªÂ¸Â° Ã¬Â²ËœÃ«Â¦Â¬Ã«Â¥Â¼ Ã¬â€žÂ¤Ã¬Â â€¢Ã­â€¢Â  Ã«â€¢Å’
- APIÃ«Â¥Â¼ Ã¬Å“â€žÃ­â€¢Å“ Ã¬â€”ÂÃ«Å¸Â¬ Ã¬Â²ËœÃ«Â¦Â¬ Ã«Â°Â Ã¬Å“Â Ã­Å¡Â¨Ã¬â€žÂ± ÃªÂ²â‚¬Ã¬â€šÂ¬Ã«Â¥Â¼ ÃªÂµÂ¬Ã¬Â¡Â°Ã­â„¢â€Ã­â€¢Â  Ã«â€¢Å’
- Ã«Â¯Â¸Ã«â€œÂ¤Ã¬â€ºÂ¨Ã¬â€“Â´Ã«Â¥Â¼ ÃªÂµÂ¬Ã¬Â¶â€¢Ã­â€¢Â  Ã«â€¢Å’ (Ã¬ÂÂ¸Ã¬Â¦Â, Ã«Â¡Å“ÃªÂ¹â€¦, Ã¬Å¡â€Ã¬Â²Â­ Ã¬Â Å“Ã­â€¢Å“)

## API Ã¬â€žÂ¤ÃªÂ³â€ž Ã­Å’Â¨Ã­â€žÂ´

### RESTful API ÃªÂµÂ¬Ã¬Â¡Â°

```typescript
// Ã¢Å“â€¦ Resource-based URLs
GET    /api/markets                 # List resources
GET    /api/markets/:id             # Get single resource
POST   /api/markets                 # Create resource
PUT    /api/markets/:id             # Replace resource
PATCH  /api/markets/:id             # Update resource
DELETE /api/markets/:id             # Delete resource

// Ã¢Å“â€¦ Query parameters for filtering, sorting, pagination
GET /api/markets?status=active&sort=volume&limit=20&offset=0
```

### Repository Ã­Å’Â¨Ã­â€žÂ´

```typescript
// Abstract data access logic
interface MarketRepository {
  findAll(filters?: MarketFilters): Promise<Market[]>
  findById(id: string): Promise<Market | null>
  findByIds(ids: string[]): Promise<Market[]>
  create(data: CreateMarketDto): Promise<Market>
  update(id: string, data: UpdateMarketDto): Promise<Market>
  delete(id: string): Promise<void>
}

class SupabaseMarketRepository implements MarketRepository {
  async findAll(filters?: MarketFilters): Promise<Market[]> {
    let query = supabase.from('markets').select('*')

    if (filters?.status) {
      query = query.eq('status', filters.status)
    }

    if (filters?.limit) {
      query = query.limit(filters.limit)
    }

    const { data, error } = await query

    if (error) throw new Error(error.message)
    return data
  }

  // Other methods...
}
```

### Service Ã«Â Ë†Ã¬ÂÂ´Ã¬â€“Â´ Ã­Å’Â¨Ã­â€žÂ´

```typescript
// Business logic separated from data access
class MarketService {
  constructor(private marketRepo: MarketRepository) {}

  async searchMarkets(query: string, limit: number = 10): Promise<Market[]> {
    // Business logic
    const embedding = await generateEmbedding(query)
    const results = await this.vectorSearch(embedding, limit)

    // Fetch full data
    const markets = await this.marketRepo.findByIds(results.map(r => r.id))

    // Sort by similarity
    return [...markets].sort((a, b) => {
      const scoreA = results.find(r => r.id === a.id)?.score || 0
      const scoreB = results.find(r => r.id === b.id)?.score || 0
      return scoreA - scoreB
    })
  }

  private async vectorSearch(embedding: number[], limit: number) {
    // Vector search implementation
  }
}
```

### Ã«Â¯Â¸Ã«â€œÂ¤Ã¬â€ºÂ¨Ã¬â€“Â´ Ã­Å’Â¨Ã­â€žÂ´

```typescript
// Request/response processing pipeline
export function withAuth(handler: NextApiHandler): NextApiHandler {
  return async (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '')

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    try {
      const user = await verifyToken(token)
      req.user = user
      return handler(req, res)
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' })
    }
  }
}

// Usage
export default withAuth(async (req, res) => {
  // Handler has access to req.user
})
```

## Ã«ÂÂ°Ã¬ÂÂ´Ã­â€žÂ°Ã«Â²Â Ã¬ÂÂ´Ã¬Å Â¤ Ã­Å’Â¨Ã­â€žÂ´

### Ã¬Â¿Â¼Ã«Â¦Â¬ Ã¬ÂµÅ“Ã¬Â ÂÃ­â„¢â€

```typescript
// Ã¢Å“â€¦ GOOD: Select only needed columns
const { data } = await supabase
  .from('markets')
  .select('id, name, status, volume')
  .eq('status', 'active')
  .order('volume', { ascending: false })
  .limit(10)

// Ã¢ÂÅ’ BAD: Select everything
const { data } = await supabase
  .from('markets')
  .select('*')
```

### N+1 Ã¬Â¿Â¼Ã«Â¦Â¬ Ã«Â°Â©Ã¬Â§â‚¬

```typescript
// Ã¢ÂÅ’ BAD: N+1 query problem
const markets = await getMarkets()
for (const market of markets) {
  market.creator = await getUser(market.creator_id)  // N queries
}

// Ã¢Å“â€¦ GOOD: Batch fetch
const markets = await getMarkets()
const creatorIds = markets.map(m => m.creator_id)
const creators = await getUsers(creatorIds)  // 1 query
const creatorMap = new Map(creators.map(c => [c.id, c]))

markets.forEach(market => {
  market.creator = creatorMap.get(market.creator_id)
})
```

### Ã­Å Â¸Ã«Å¾Å“Ã¬Å¾Â­Ã¬â€¦Ëœ Ã­Å’Â¨Ã­â€žÂ´

```typescript
async function createMarketWithPosition(
  marketData: CreateMarketDto,
  positionData: CreatePositionDto
) {
  // Use Supabase transaction
  const { data, error } = await supabase.rpc('create_market_with_position', {
    market_data: marketData,
    position_data: positionData
  })

  if (error) throw new Error('Transaction failed')
  return data
}

// SQL function in Supabase
CREATE OR REPLACE FUNCTION create_market_with_position(
  market_data jsonb,
  position_data jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
BEGIN
  -- Start transaction automatically
  INSERT INTO markets VALUES (market_data);
  INSERT INTO positions VALUES (position_data);
  RETURN jsonb_build_object('success', true);
EXCEPTION
  WHEN OTHERS THEN
    -- Rollback happens automatically
    RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$$;
```

## Ã¬ÂºÂÃ¬â€¹Â± Ã¬Â â€žÃ«Å¾Âµ

### Redis Ã¬ÂºÂÃ¬â€¹Â± Ã«Â Ë†Ã¬ÂÂ´Ã¬â€“Â´

```typescript
class CachedMarketRepository implements MarketRepository {
  constructor(
    private baseRepo: MarketRepository,
    private redis: RedisClient
  ) {}

  async findById(id: string): Promise<Market | null> {
    // Check cache first
    const cached = await this.redis.get(`market:${id}`)

    if (cached) {
      return JSON.parse(cached)
    }

    // Cache miss - fetch from database
    const market = await this.baseRepo.findById(id)

    if (market) {
      // Cache for 5 minutes
      await this.redis.setex(`market:${id}`, 300, JSON.stringify(market))
    }

    return market
  }

  async invalidateCache(id: string): Promise<void> {
    await this.redis.del(`market:${id}`)
  }
}
```

### Cache-Aside Ã­Å’Â¨Ã­â€žÂ´

```typescript
async function getMarketWithCache(id: string): Promise<Market> {
  const cacheKey = `market:${id}`

  // Try cache
  const cached = await redis.get(cacheKey)
  if (cached) return JSON.parse(cached)

  // Cache miss - fetch from DB
  const market = await db.markets.findUnique({ where: { id } })

  if (!market) throw new Error('Market not found')

  // Update cache
  await redis.setex(cacheKey, 300, JSON.stringify(market))

  return market
}
```

## Ã¬â€”ÂÃ«Å¸Â¬ Ã¬Â²ËœÃ«Â¦Â¬ Ã­Å’Â¨Ã­â€žÂ´

### Ã¬Â¤â€˜Ã¬â€¢â„¢Ã­â„¢â€Ã«ÂÅ“ Ã¬â€”ÂÃ«Å¸Â¬ Ã­â€¢Â¸Ã«â€œÂ¤Ã«Å¸Â¬

```typescript
class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message)
    Object.setPrototypeOf(this, ApiError.prototype)
  }
}

export function errorHandler(error: unknown, req: Request): Response {
  if (error instanceof ApiError) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: error.statusCode })
  }

  if (error instanceof z.ZodError) {
    return NextResponse.json({
      success: false,
      error: 'Validation failed',
      details: error.errors
    }, { status: 400 })
  }

  // Log unexpected errors
  console.error('Unexpected error:', error)

  return NextResponse.json({
    success: false,
    error: 'Internal server error'
  }, { status: 500 })
}

// Usage
export async function GET(request: Request) {
  try {
    const data = await fetchData()
    return NextResponse.json({ success: true, data })
  } catch (error) {
    return errorHandler(error, request)
  }
}
```

### Ã¬Â§â‚¬Ã¬Ë†Ëœ Ã«Â°Â±Ã¬ËœÂ¤Ã­â€â€žÃ«Â¥Â¼ Ã¬ÂÂ´Ã¬Å¡Â©Ã­â€¢Å“ Ã¬Å¾Â¬Ã¬â€¹Å“Ã«Ââ€ž

```typescript
async function fetchWithRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3
): Promise<T> {
  let lastError: Error = new Error('Retry attempts exhausted')

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error

      if (i < maxRetries - 1) {
        // Exponential backoff: 1s, 2s, 4s
        const delay = Math.pow(2, i) * 1000
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }

  throw lastError!
}

// Usage
const data = await fetchWithRetry(() => fetchFromAPI())
```

## Ã¬ÂÂ¸Ã¬Â¦Â Ã«Â°Â Ã¬ÂÂ¸ÃªÂ°â‚¬

### JWT Ã­â€ Â Ã­ÂÂ° ÃªÂ²â‚¬Ã¬Â¦Â

```typescript
import jwt from 'jsonwebtoken'

interface JWTPayload {
  userId: string
  email: string
  role: 'admin' | 'user'
}

export function verifyToken(token: string): JWTPayload {
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload
    return payload
  } catch (error) {
    throw new ApiError(401, 'Invalid token')
  }
}

export async function requireAuth(request: Request) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '')

  if (!token) {
    throw new ApiError(401, 'Missing authorization token')
  }

  return verifyToken(token)
}

// Usage in API route
export async function GET(request: Request) {
  const user = await requireAuth(request)

  const data = await getDataForUser(user.userId)

  return NextResponse.json({ success: true, data })
}
```

### Ã¬â€”Â­Ã­â€¢Â  ÃªÂ¸Â°Ã«Â°Ëœ Ã¬Â â€˜ÃªÂ·Â¼ Ã¬Â Å“Ã¬â€“Â´

```typescript
type Permission = 'read' | 'write' | 'delete' | 'admin'

interface User {
  id: string
  role: 'admin' | 'moderator' | 'user'
}

const rolePermissions: Record<User['role'], Permission[]> = {
  admin: ['read', 'write', 'delete', 'admin'],
  moderator: ['read', 'write', 'delete'],
  user: ['read', 'write']
}

export function hasPermission(user: User, permission: Permission): boolean {
  return rolePermissions[user.role].includes(permission)
}

export function requirePermission(permission: Permission) {
  return (handler: (request: Request, user: User) => Promise<Response>) => {
    return async (request: Request) => {
      const user = await requireAuth(request)

      if (!hasPermission(user, permission)) {
        throw new ApiError(403, 'Insufficient permissions')
      }

      return handler(request, user)
    }
  }
}

// Usage - HOF wraps the handler
export const DELETE = requirePermission('delete')(
  async (request: Request, user: User) => {
    // Handler receives authenticated user with verified permission
    return new Response('Deleted', { status: 200 })
  }
)
```

## Ã¬Å¡â€Ã¬Â²Â­ Ã¬Â Å“Ã­â€¢Å“

### ÃªÂ°â€žÃ«â€¹Â¨Ã­â€¢Å“ Ã¬ÂÂ¸Ã«Â©â€Ã«ÂªÂ¨Ã«Â¦Â¬ Ã¬Å¡â€Ã¬Â²Â­ Ã¬Â Å“Ã­â€¢Å“ÃªÂ¸Â°

```typescript
class RateLimiter {
  private requests = new Map<string, number[]>()

  async checkLimit(
    identifier: string,
    maxRequests: number,
    windowMs: number
  ): Promise<boolean> {
    const now = Date.now()
    const requests = this.requests.get(identifier) || []

    // Remove old requests outside window
    const recentRequests = requests.filter(time => now - time < windowMs)

    if (recentRequests.length >= maxRequests) {
      return false  // Rate limit exceeded
    }

    // Add current request
    recentRequests.push(now)
    this.requests.set(identifier, recentRequests)

    return true
  }
}

const limiter = new RateLimiter()

export async function GET(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown'

  const allowed = await limiter.checkLimit(ip, 100, 60000)  // 100 req/min

  if (!allowed) {
    return NextResponse.json({
      error: 'Rate limit exceeded'
    }, { status: 429 })
  }

  // Continue with request
}
```

## Ã«Â°Â±ÃªÂ·Â¸Ã«ÂÂ¼Ã¬Å¡Â´Ã«â€œÅ“ Ã¬Å¾â€˜Ã¬â€”â€¦ Ã«Â°Â Ã­ÂÂ

### ÃªÂ°â€žÃ«â€¹Â¨Ã­â€¢Å“ Ã­ÂÂ Ã­Å’Â¨Ã­â€žÂ´

```typescript
class JobQueue<T> {
  private queue: T[] = []
  private processing = false

  async add(job: T): Promise<void> {
    this.queue.push(job)

    if (!this.processing) {
      this.process()
    }
  }

  private async process(): Promise<void> {
    this.processing = true

    while (this.queue.length > 0) {
      const job = this.queue.shift()!

      try {
        await this.execute(job)
      } catch (error) {
        console.error('Job failed:', error)
      }
    }

    this.processing = false
  }

  private async execute(job: T): Promise<void> {
    // Job execution logic
  }
}

// Usage for indexing markets
interface IndexJob {
  marketId: string
}

const indexQueue = new JobQueue<IndexJob>()

export async function POST(request: Request) {
  const { marketId } = await request.json()

  // Add to queue instead of blocking
  await indexQueue.add({ marketId })

  return NextResponse.json({ success: true, message: 'Job queued' })
}
```

## Ã«Â¡Å“ÃªÂ¹â€¦ Ã«Â°Â Ã«ÂªÂ¨Ã«â€¹Ë†Ã­â€žÂ°Ã«Â§Â

### ÃªÂµÂ¬Ã¬Â¡Â°Ã­â„¢â€Ã«ÂÅ“ Ã«Â¡Å“ÃªÂ¹â€¦

```typescript
interface LogContext {
  userId?: string
  requestId?: string
  method?: string
  path?: string
  [key: string]: unknown
}

class Logger {
  log(level: 'info' | 'warn' | 'error', message: string, context?: LogContext) {
    const entry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...context
    }

    console.log(JSON.stringify(entry))
  }

  info(message: string, context?: LogContext) {
    this.log('info', message, context)
  }

  warn(message: string, context?: LogContext) {
    this.log('warn', message, context)
  }

  error(message: string, error: Error, context?: LogContext) {
    this.log('error', message, {
      ...context,
      error: error.message,
      stack: error.stack
    })
  }
}

const logger = new Logger()

// Usage
export async function GET(request: Request) {
  const requestId = crypto.randomUUID()

  logger.info('Fetching markets', {
    requestId,
    method: 'GET',
    path: '/api/markets'
  })

  try {
    const markets = await fetchMarkets()
    return NextResponse.json({ success: true, data: markets })
  } catch (error) {
    logger.error('Failed to fetch markets', error as Error, { requestId })
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
```

**ÃªÂ¸Â°Ã¬â€“ÂµÃ­â€¢ËœÃ¬â€žÂ¸Ã¬Å¡â€**: Ã«Â°Â±Ã¬â€”â€Ã«â€œÅ“ Ã­Å’Â¨Ã­â€žÂ´Ã¬Ââ‚¬ Ã­â„¢â€¢Ã¬Å¾Â¥ ÃªÂ°â‚¬Ã«Å Â¥Ã­â€¢ËœÃªÂ³Â  Ã¬Å“Â Ã¬Â§â‚¬Ã«Â³Â´Ã¬Ë†Ëœ ÃªÂ°â‚¬Ã«Å Â¥Ã­â€¢Å“ Ã¬â€žÅ“Ã«Â²â€ž Ã¬â€šÂ¬Ã¬ÂÂ´Ã«â€œÅ“ Ã¬â€¢Â Ã­â€Å’Ã«Â¦Â¬Ã¬Â¼â‚¬Ã¬ÂÂ´Ã¬â€¦ËœÃ¬Ââ€ž ÃªÂ°â‚¬Ã«Å Â¥Ã­â€¢ËœÃªÂ²Å’ Ã­â€¢Â©Ã«â€¹Ë†Ã«â€¹Â¤. Ã«Â³ÂµÃ¬Å¾Â¡Ã«Ââ€ž Ã¬Ë†ËœÃ¬Â¤â‚¬Ã¬â€”Â Ã«Â§Å¾Ã«Å â€ Ã­Å’Â¨Ã­â€žÂ´Ã¬Ââ€ž Ã¬â€žÂ Ã­Æ’ÂÃ­â€¢ËœÃ¬â€žÂ¸Ã¬Å¡â€.
