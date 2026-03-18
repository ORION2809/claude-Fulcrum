---
name: backend-patterns
description: Ã¥ÂÅ½Ã§Â«Â¯Ã¦Å¾Â¶Ã¦Å¾â€žÃ¦Â¨Â¡Ã¥Â¼ÂÃ£â‚¬ÂAPIÃ¨Â®Â¾Ã¨Â®Â¡Ã£â‚¬ÂÃ¦â€¢Â°Ã¦ÂÂ®Ã¥Âºâ€œÃ¤Â¼ËœÃ¥Å’â€“Ã¤Â»Â¥Ã¥ÂÅ Ã©â‚¬â€šÃ§â€Â¨Ã¤ÂºÅ½Node.jsÃ£â‚¬ÂExpressÃ¥â€™Å’Next.js APIÃ¨Â·Â¯Ã§â€Â±Ã§Å¡â€žÃ¦Å“ÂÃ¥Å Â¡Ã¥â„¢Â¨Ã§Â«Â¯Ã¦Å“â‚¬Ã¤Â½Â³Ã¥Â®Å¾Ã¨Â·ÂµÃ£â‚¬â€š
origin: claude-fulcrum
---

# Ã¥ÂÅ½Ã§Â«Â¯Ã¥Â¼â‚¬Ã¥Ââ€˜Ã¦Â¨Â¡Ã¥Â¼Â

Ã§â€Â¨Ã¤ÂºÅ½Ã¥ÂÂ¯Ã¦â€°Â©Ã¥Â±â€¢Ã¦Å“ÂÃ¥Å Â¡Ã¥â„¢Â¨Ã§Â«Â¯Ã¥Âºâ€Ã§â€Â¨Ã§Â¨â€¹Ã¥ÂºÂÃ§Å¡â€žÃ¥ÂÅ½Ã§Â«Â¯Ã¦Å¾Â¶Ã¦Å¾â€žÃ¦Â¨Â¡Ã¥Â¼ÂÃ¥â€™Å’Ã¦Å“â‚¬Ã¤Â½Â³Ã¥Â®Å¾Ã¨Â·ÂµÃ£â‚¬â€š

## Ã¤Â½â€¢Ã¦â€”Â¶Ã¦Â¿â‚¬Ã¦Â´Â»

* Ã¨Â®Â¾Ã¨Â®Â¡ REST Ã¦Ë†â€“ GraphQL API Ã§Â«Â¯Ã§â€šÂ¹Ã¦â€”Â¶
* Ã¥Â®Å¾Ã§Å½Â°Ã¤Â»â€œÃ¥â€šÂ¨Ã¥Â±â€šÃ£â‚¬ÂÃ¦Å“ÂÃ¥Å Â¡Ã¥Â±â€šÃ¦Ë†â€“Ã¦Å½Â§Ã¥Ë†Â¶Ã¥â„¢Â¨Ã¥Â±â€šÃ¦â€”Â¶
* Ã¤Â¼ËœÃ¥Å’â€“Ã¦â€¢Â°Ã¦ÂÂ®Ã¥Âºâ€œÃ¦Å¸Â¥Ã¨Â¯Â¢Ã¯Â¼Ë†N+1Ã©â€”Â®Ã©Â¢ËœÃ£â‚¬ÂÃ§Â´Â¢Ã¥Â¼â€¢Ã£â‚¬ÂÃ¨Â¿Å¾Ã¦Å½Â¥Ã¦Â±Â Ã¯Â¼â€°Ã¦â€”Â¶
* Ã¦Â·Â»Ã¥Å Â Ã§Â¼â€œÃ¥Â­ËœÃ¯Â¼Ë†RedisÃ£â‚¬ÂÃ¥â€ â€¦Ã¥Â­ËœÃ§Â¼â€œÃ¥Â­ËœÃ£â‚¬ÂHTTP Ã§Â¼â€œÃ¥Â­ËœÃ¥Â¤Â´Ã¯Â¼â€°Ã¦â€”Â¶
* Ã¨Â®Â¾Ã§Â½Â®Ã¥ÂÅ½Ã¥ÂÂ°Ã¤Â½Å“Ã¤Â¸Å¡Ã¦Ë†â€“Ã¥Â¼â€šÃ¦Â­Â¥Ã¥Â¤â€žÃ§Ââ€ Ã¦â€”Â¶
* Ã¤Â¸Âº API Ã¦Å¾â€žÃ¥Â»ÂºÃ©â€â„¢Ã¨Â¯Â¯Ã¥Â¤â€žÃ§Ââ€ Ã¥â€™Å’Ã©ÂªÅ’Ã¨Â¯ÂÃ§Â»â€œÃ¦Å¾â€žÃ¦â€”Â¶
* Ã¦Å¾â€žÃ¥Â»ÂºÃ¤Â¸Â­Ã©â€”Â´Ã¤Â»Â¶Ã¯Â¼Ë†Ã¨Â®Â¤Ã¨Â¯ÂÃ£â‚¬ÂÃ¦â€”Â¥Ã¥Â¿â€”Ã¨Â®Â°Ã¥Â½â€¢Ã£â‚¬ÂÃ©â‚¬Å¸Ã§Å½â€¡Ã©â„¢ÂÃ¥Ë†Â¶Ã¯Â¼â€°Ã¦â€”Â¶

## API Ã¨Â®Â¾Ã¨Â®Â¡Ã¦Â¨Â¡Ã¥Â¼Â

### RESTful API Ã§Â»â€œÃ¦Å¾â€ž

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

### Ã¤Â»â€œÃ¥â€šÂ¨Ã¦Â¨Â¡Ã¥Â¼Â

```typescript
// Abstract data access logic
interface MarketRepository {
  findAll(filters?: MarketFilters): Promise<Market[]>
  findById(id: string): Promise<Market | null>
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

### Ã¦Å“ÂÃ¥Å Â¡Ã¥Â±â€šÃ¦Â¨Â¡Ã¥Â¼Â

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
    return markets.sort((a, b) => {
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

### Ã¤Â¸Â­Ã©â€”Â´Ã¤Â»Â¶Ã¦Â¨Â¡Ã¥Â¼Â

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

## Ã¦â€¢Â°Ã¦ÂÂ®Ã¥Âºâ€œÃ¦Â¨Â¡Ã¥Â¼Â

### Ã¦Å¸Â¥Ã¨Â¯Â¢Ã¤Â¼ËœÃ¥Å’â€“

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

### N+1 Ã¦Å¸Â¥Ã¨Â¯Â¢Ã©Â¢â€žÃ©ËœÂ²

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

### Ã¤Âºâ€¹Ã¥Å Â¡Ã¦Â¨Â¡Ã¥Â¼Â

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
AS $
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
$;
```

## Ã§Â¼â€œÃ¥Â­ËœÃ§Â­â€“Ã§â€¢Â¥

### Redis Ã§Â¼â€œÃ¥Â­ËœÃ¥Â±â€š

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

### Ã¦â€”ÂÃ¨Â·Â¯Ã§Â¼â€œÃ¥Â­ËœÃ¦Â¨Â¡Ã¥Â¼Â

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

## Ã©â€â„¢Ã¨Â¯Â¯Ã¥Â¤â€žÃ§Ââ€ Ã¦Â¨Â¡Ã¥Â¼Â

### Ã©â€ºâ€ Ã¤Â¸Â­Ã¥Â¼ÂÃ©â€â„¢Ã¨Â¯Â¯Ã¥Â¤â€žÃ§Ââ€ Ã§Â¨â€¹Ã¥ÂºÂ

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

### Ã¦Å’â€¡Ã¦â€¢Â°Ã©â‚¬â‚¬Ã©ÂÂ¿Ã©â€¡ÂÃ¨Â¯â€¢

```typescript
async function fetchWithRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3
): Promise<T> {
  let lastError: Error

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

## Ã¨Â®Â¤Ã¨Â¯ÂÃ¤Â¸Å½Ã¦Å½Ë†Ã¦ÂÆ’

### JWT Ã¤Â»Â¤Ã§â€°Å’Ã©ÂªÅ’Ã¨Â¯Â

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

### Ã¥Å¸ÂºÃ¤ÂºÅ½Ã¨Â§â€™Ã¨â€°Â²Ã§Å¡â€žÃ¨Â®Â¿Ã©â€”Â®Ã¦Å½Â§Ã¥Ë†Â¶

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

## Ã©â‚¬Å¸Ã§Å½â€¡Ã©â„¢ÂÃ¥Ë†Â¶

### Ã§Â®â‚¬Ã¥Ââ€¢Ã§Å¡â€žÃ¥â€ â€¦Ã¥Â­ËœÃ©â‚¬Å¸Ã§Å½â€¡Ã©â„¢ÂÃ¥Ë†Â¶Ã¥â„¢Â¨

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

## Ã¥ÂÅ½Ã¥ÂÂ°Ã¤Â½Å“Ã¤Â¸Å¡Ã¤Â¸Å½Ã©ËœÅ¸Ã¥Ë†â€”

### Ã§Â®â‚¬Ã¥Ââ€¢Ã©ËœÅ¸Ã¥Ë†â€”Ã¦Â¨Â¡Ã¥Â¼Â

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

## Ã¦â€”Â¥Ã¥Â¿â€”Ã¨Â®Â°Ã¥Â½â€¢Ã¤Â¸Å½Ã§â€ºâ€˜Ã¦Å½Â§

### Ã§Â»â€œÃ¦Å¾â€žÃ¥Å’â€“Ã¦â€”Â¥Ã¥Â¿â€”Ã¨Â®Â°Ã¥Â½â€¢

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

**Ã¨Â®Â°Ã¤Â½Â**Ã¯Â¼Å¡Ã¥ÂÅ½Ã§Â«Â¯Ã¦Â¨Â¡Ã¥Â¼ÂÃ¦â€Â¯Ã¦Å’ÂÃ¥ÂÂ¯Ã¦â€°Â©Ã¥Â±â€¢Ã£â‚¬ÂÃ¥ÂÂ¯Ã§Â»Â´Ã¦Å Â¤Ã§Å¡â€žÃ¦Å“ÂÃ¥Å Â¡Ã¥â„¢Â¨Ã§Â«Â¯Ã¥Âºâ€Ã§â€Â¨Ã§Â¨â€¹Ã¥ÂºÂÃ£â‚¬â€šÃ©â‚¬â€°Ã¦â€¹Â©Ã©â‚¬â€šÃ¥ÂË†Ã¤Â½Â Ã¥Â¤ÂÃ¦Ââ€šÃ§Â¨â€¹Ã¥ÂºÂ¦Ã§Å¡â€žÃ¦Â¨Â¡Ã¥Â¼ÂÃ£â‚¬â€š
