---
name: deployment-patterns
description: Ã©Æ’Â¨Ã§Â½Â²Ã¥Â·Â¥Ã¤Â½Å“Ã¦ÂµÂÃ£â‚¬ÂCI/CDÃ¦ÂµÂÃ¦Â°Â´Ã§ÂºÂ¿Ã¦Â¨Â¡Ã¥Â¼ÂÃ£â‚¬ÂDockerÃ¥Â®Â¹Ã¥â„¢Â¨Ã¥Å’â€“Ã£â‚¬ÂÃ¥ÂÂ¥Ã¥ÂºÂ·Ã¦Â£â‚¬Ã¦Å¸Â¥Ã£â‚¬ÂÃ¥â€ºÅ¾Ã¦Â»Å¡Ã§Â­â€“Ã§â€¢Â¥Ã¤Â»Â¥Ã¥ÂÅ WebÃ¥Âºâ€Ã§â€Â¨Ã§Â¨â€¹Ã¥ÂºÂÃ§Å¡â€žÃ§â€Å¸Ã¤ÂºÂ§Ã¥Â°Â±Ã§Â»ÂªÃ¦Â£â‚¬Ã¦Å¸Â¥Ã¦Â¸â€¦Ã¥Ââ€¢Ã£â‚¬â€š
origin: claude-fulcrum
---

# Ã©Æ’Â¨Ã§Â½Â²Ã¦Â¨Â¡Ã¥Â¼Â

Ã§â€Å¸Ã¤ÂºÂ§Ã§Å½Â¯Ã¥Â¢Æ’Ã©Æ’Â¨Ã§Â½Â²Ã¥Â·Â¥Ã¤Â½Å“Ã¦ÂµÂÃ¥â€™Å’ CI/CD Ã¦Å“â‚¬Ã¤Â½Â³Ã¥Â®Å¾Ã¨Â·ÂµÃ£â‚¬â€š

## Ã¤Â½â€¢Ã¦â€”Â¶Ã¥ÂÂ¯Ã§â€Â¨

* Ã¨Â®Â¾Ã§Â½Â® CI/CD Ã¦ÂµÂÃ¦Â°Â´Ã§ÂºÂ¿Ã¦â€”Â¶
* Ã¥Â°â€ Ã¥Âºâ€Ã§â€Â¨Ã¥Â®Â¹Ã¥â„¢Â¨Ã¥Å’â€“Ã¯Â¼Ë†DockerÃ¯Â¼â€°Ã¦â€”Â¶
* Ã¨Â§â€žÃ¥Ë†â€™Ã©Æ’Â¨Ã§Â½Â²Ã§Â­â€“Ã§â€¢Â¥Ã¯Â¼Ë†Ã¨â€œÂÃ§Â»Â¿Ã£â‚¬ÂÃ©â€¡â€˜Ã¤Â¸ÂÃ©â€ºâ‚¬Ã£â‚¬ÂÃ¦Â»Å¡Ã¥Å Â¨Ã¯Â¼â€°Ã¦â€”Â¶
* Ã¥Â®Å¾Ã§Å½Â°Ã¥ÂÂ¥Ã¥ÂºÂ·Ã¦Â£â‚¬Ã¦Å¸Â¥Ã¥â€™Å’Ã¥Â°Â±Ã§Â»ÂªÃ¦Å½Â¢Ã©â€™Ë†Ã¦â€”Â¶
* Ã¥â€¡â€ Ã¥Â¤â€¡Ã§â€Å¸Ã¤ÂºÂ§Ã¥Ââ€˜Ã¥Â¸Æ’Ã¦â€”Â¶
* Ã©â€¦ÂÃ§Â½Â®Ã§Å½Â¯Ã¥Â¢Æ’Ã§â€°Â¹Ã¥Â®Å¡Ã¨Â®Â¾Ã§Â½Â®Ã¦â€”Â¶

## Ã©Æ’Â¨Ã§Â½Â²Ã§Â­â€“Ã§â€¢Â¥

### Ã¦Â»Å¡Ã¥Å Â¨Ã©Æ’Â¨Ã§Â½Â²Ã¯Â¼Ë†Ã©Â»ËœÃ¨Â®Â¤Ã¯Â¼â€°

Ã©â‚¬ÂÃ¦Â­Â¥Ã¦â€ºÂ¿Ã¦ÂÂ¢Ã¥Â®Å¾Ã¤Â¾â€¹Ã¢â‚¬â€Ã¢â‚¬â€Ã¥Å“Â¨Ã¥Ââ€˜Ã¥Â¸Æ’Ã¨Â¿â€¡Ã§Â¨â€¹Ã¤Â¸Â­Ã¯Â¼Å’Ã¦â€“Â°Ã¦â€”Â§Ã§â€°Ë†Ã¦Å“Â¬Ã¥ÂÅ’Ã¦â€”Â¶Ã¨Â¿ÂÃ¨Â¡Å’Ã£â‚¬â€š

```
Instance 1: v1 Ã¢â€ â€™ v2  (update first)
Instance 2: v1        (still running v1)
Instance 3: v1        (still running v1)

Instance 1: v2
Instance 2: v1 Ã¢â€ â€™ v2  (update second)
Instance 3: v1

Instance 1: v2
Instance 2: v2
Instance 3: v1 Ã¢â€ â€™ v2  (update last)
```

**Ã¤Â¼ËœÃ§â€šÂ¹Ã¯Â¼Å¡** Ã©â€ºÂ¶Ã¥ÂÅ“Ã¦Å“ÂºÃ¦â€”Â¶Ã©â€”Â´Ã¯Â¼Å’Ã¦Â¸ÂÃ¨Â¿â€ºÃ¥Â¼ÂÃ¥Ââ€˜Ã¥Â¸Æ’
**Ã§Â¼ÂºÃ§â€šÂ¹Ã¯Â¼Å¡** Ã¤Â¸Â¤Ã¤Â¸ÂªÃ§â€°Ë†Ã¦Å“Â¬Ã¥ÂÅ’Ã¦â€”Â¶Ã¨Â¿ÂÃ¨Â¡Å’Ã¢â‚¬â€Ã¢â‚¬â€Ã©Å“â‚¬Ã¨Â¦ÂÃ¥Ââ€˜Ã¥ÂÅ½Ã¥â€¦Â¼Ã¥Â®Â¹Ã§Å¡â€žÃ¦â€ºÂ´Ã¦â€Â¹
**Ã©â‚¬â€šÃ§â€Â¨Ã¥Å“ÂºÃ¦â„¢Â¯Ã¯Â¼Å¡** Ã¦Â â€¡Ã¥â€¡â€ Ã©Æ’Â¨Ã§Â½Â²Ã¯Â¼Å’Ã¥Ââ€˜Ã¥ÂÅ½Ã¥â€¦Â¼Ã¥Â®Â¹Ã§Å¡â€žÃ¦â€ºÂ´Ã¦â€Â¹

### Ã¨â€œÂÃ§Â»Â¿Ã©Æ’Â¨Ã§Â½Â²

Ã¨Â¿ÂÃ¨Â¡Å’Ã¤Â¸Â¤Ã¤Â¸ÂªÃ§â€ºÂ¸Ã¥ÂÅ’Ã§Å¡â€žÃ§Å½Â¯Ã¥Â¢Æ’Ã£â‚¬â€šÃ¥Å½Å¸Ã¥Â­ÂÃ¥Å’â€“Ã¥Å“Â°Ã¥Ë†â€¡Ã¦ÂÂ¢Ã¦ÂµÂÃ©â€¡ÂÃ£â‚¬â€š

```
Blue  (v1) Ã¢â€ Â traffic
Green (v2)   idle, running new version

# After verification:
Blue  (v1)   idle (becomes standby)
Green (v2) Ã¢â€ Â traffic
```

**Ã¤Â¼ËœÃ§â€šÂ¹Ã¯Â¼Å¡** Ã¥ÂÂ³Ã¦â€”Â¶Ã¥â€ºÅ¾Ã¦Â»Å¡Ã¯Â¼Ë†Ã¥Ë†â€¡Ã¦ÂÂ¢Ã¥â€ºÅ¾Ã¨â€œÂÃ¨â€°Â²Ã§Å½Â¯Ã¥Â¢Æ’Ã¯Â¼â€°Ã¯Â¼Å’Ã¥Ë†â€¡Ã¦ÂÂ¢Ã¥Â¹Â²Ã¥â€¡â‚¬Ã¥Ë†Â©Ã¨ÂÂ½
**Ã§Â¼ÂºÃ§â€šÂ¹Ã¯Â¼Å¡** Ã©Æ’Â¨Ã§Â½Â²Ã¦Å“Å¸Ã©â€”Â´Ã©Å“â‚¬Ã¨Â¦ÂÃ¥ÂÅ’Ã¥â‚¬ÂÃ§Å¡â€žÃ¥Å¸ÂºÃ§Â¡â‚¬Ã¨Â®Â¾Ã¦â€“Â½
**Ã©â‚¬â€šÃ§â€Â¨Ã¥Å“ÂºÃ¦â„¢Â¯Ã¯Â¼Å¡** Ã¥â€¦Â³Ã©â€Â®Ã¦Å“ÂÃ¥Å Â¡Ã¯Â¼Å’Ã¥Â¯Â¹Ã©â€”Â®Ã©Â¢ËœÃ©â€ºÂ¶Ã¥Â®Â¹Ã¥Â¿Â

### Ã©â€¡â€˜Ã¤Â¸ÂÃ©â€ºâ‚¬Ã©Æ’Â¨Ã§Â½Â²

Ã©Â¦â€“Ã¥â€¦Ë†Ã¥Â°â€ Ã¤Â¸â‚¬Ã¥Â°ÂÃ©Æ’Â¨Ã¥Ë†â€ Ã¦ÂµÂÃ©â€¡ÂÃ¨Â·Â¯Ã§â€Â±Ã¥Ë†Â°Ã¦â€“Â°Ã§â€°Ë†Ã¦Å“Â¬Ã£â‚¬â€š

```
v1: 95% of traffic
v2:  5% of traffic  (canary)

# If metrics look good:
v1: 50% of traffic
v2: 50% of traffic

# Final:
v2: 100% of traffic
```

**Ã¤Â¼ËœÃ§â€šÂ¹Ã¯Â¼Å¡** Ã¥Å“Â¨Ã¥â€¦Â¨Ã©â€¡ÂÃ¥Ââ€˜Ã¥Â¸Æ’Ã¥â€°ÂÃ¯Â¼Å’Ã©â‚¬Å¡Ã¨Â¿â€¡Ã§Å“Å¸Ã¥Â®Å¾Ã¦ÂµÂÃ©â€¡ÂÃ¥Ââ€˜Ã§Å½Â°Ã©â€”Â®Ã©Â¢Ëœ
**Ã§Â¼ÂºÃ§â€šÂ¹Ã¯Â¼Å¡** Ã©Å“â‚¬Ã¨Â¦ÂÃ¦ÂµÂÃ©â€¡ÂÃ¥Ë†â€ Ã¥â€°Â²Ã¥Å¸ÂºÃ§Â¡â‚¬Ã¨Â®Â¾Ã¦â€“Â½Ã¥â€™Å’Ã§â€ºâ€˜Ã¦Å½Â§
**Ã©â‚¬â€šÃ§â€Â¨Ã¥Å“ÂºÃ¦â„¢Â¯Ã¯Â¼Å¡** Ã©Â«ËœÃ¦ÂµÂÃ©â€¡ÂÃ¦Å“ÂÃ¥Å Â¡Ã¯Â¼Å’Ã©Â£Å½Ã©â„¢Â©Ã¦â‚¬Â§Ã¦â€ºÂ´Ã¦â€Â¹Ã¯Â¼Å’Ã¥Å Å¸Ã¨Æ’Â½Ã¦Â â€¡Ã¥Â¿â€”

## Docker

### Ã¥Â¤Å¡Ã©ËœÂ¶Ã¦Â®Âµ Dockerfile (Node.js)

```dockerfile
# Stage 1: Install dependencies
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --production=false

# Stage 2: Build
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build
RUN npm prune --production

# Stage 3: Production image
FROM node:22-alpine AS runner
WORKDIR /app

RUN addgroup -g 1001 -S appgroup && adduser -S appuser -u 1001
USER appuser

COPY --from=builder --chown=appuser:appgroup /app/node_modules ./node_modules
COPY --from=builder --chown=appuser:appgroup /app/dist ./dist
COPY --from=builder --chown=appuser:appgroup /app/package.json ./

ENV NODE_ENV=production
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

CMD ["node", "dist/server.js"]
```

### Ã¥Â¤Å¡Ã©ËœÂ¶Ã¦Â®Âµ Dockerfile (Go)

```dockerfile
FROM golang:1.22-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o /server ./cmd/server

FROM alpine:3.19 AS runner
RUN apk --no-cache add ca-certificates
RUN adduser -D -u 1001 appuser
USER appuser

COPY --from=builder /server /server

EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost:8080/health || exit 1
CMD ["/server"]
```

### Ã¥Â¤Å¡Ã©ËœÂ¶Ã¦Â®Âµ Dockerfile (Python/Django)

```dockerfile
FROM python:3.12-slim AS builder
WORKDIR /app
RUN pip install --no-cache-dir uv
COPY requirements.txt .
RUN uv pip install --system --no-cache -r requirements.txt

FROM python:3.12-slim AS runner
WORKDIR /app

RUN useradd -r -u 1001 appuser
USER appuser

COPY --from=builder /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin
COPY . .

ENV PYTHONUNBUFFERED=1
EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=3s CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health/')" || exit 1
CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "4"]
```

### Docker Ã¦Å“â‚¬Ã¤Â½Â³Ã¥Â®Å¾Ã¨Â·Âµ

```
# GOOD practices
- Use specific version tags (node:22-alpine, not node:latest)
- Multi-stage builds to minimize image size
- Run as non-root user
- Copy dependency files first (layer caching)
- Use .dockerignore to exclude node_modules, .git, tests
- Add HEALTHCHECK instruction
- Set resource limits in docker-compose or k8s

# BAD practices
- Running as root
- Using :latest tags
- Copying entire repo in one COPY layer
- Installing dev dependencies in production image
- Storing secrets in image (use env vars or secrets manager)
```

## CI/CD Ã¦ÂµÂÃ¦Â°Â´Ã§ÂºÂ¿

### GitHub Actions (Ã¦Â â€¡Ã¥â€¡â€ Ã¦ÂµÂÃ¦Â°Â´Ã§ÂºÂ¿)

```yaml
name: CI/CD

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm test -- --coverage
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: coverage
          path: coverage/

  build:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - uses: docker/setup-buildx-action@v3
      - uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      - uses: docker/build-push-action@v5
        with:
          push: true
          tags: ghcr.io/${{ github.repository }}:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    environment: production
    steps:
      - name: Deploy to production
        run: |
          # Platform-specific deployment command
          # Railway: railway up
          # Vercel: vercel --prod
          # K8s: kubectl set image deployment/app app=ghcr.io/${{ github.repository }}:${{ github.sha }}
          echo "Deploying ${{ github.sha }}"
```

### Ã¦ÂµÂÃ¦Â°Â´Ã§ÂºÂ¿Ã©ËœÂ¶Ã¦Â®Âµ

```
PR opened:
  lint Ã¢â€ â€™ typecheck Ã¢â€ â€™ unit tests Ã¢â€ â€™ integration tests Ã¢â€ â€™ preview deploy

Merged to main:
  lint Ã¢â€ â€™ typecheck Ã¢â€ â€™ unit tests Ã¢â€ â€™ integration tests Ã¢â€ â€™ build image Ã¢â€ â€™ deploy staging Ã¢â€ â€™ smoke tests Ã¢â€ â€™ deploy production
```

## Ã¥ÂÂ¥Ã¥ÂºÂ·Ã¦Â£â‚¬Ã¦Å¸Â¥

### Ã¥ÂÂ¥Ã¥ÂºÂ·Ã¦Â£â‚¬Ã¦Å¸Â¥Ã§Â«Â¯Ã§â€šÂ¹

```typescript
// Simple health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Detailed health check (for internal monitoring)
app.get("/health/detailed", async (req, res) => {
  const checks = {
    database: await checkDatabase(),
    redis: await checkRedis(),
    externalApi: await checkExternalApi(),
  };

  const allHealthy = Object.values(checks).every(c => c.status === "ok");

  res.status(allHealthy ? 200 : 503).json({
    status: allHealthy ? "ok" : "degraded",
    timestamp: new Date().toISOString(),
    version: process.env.APP_VERSION || "unknown",
    uptime: process.uptime(),
    checks,
  });
});

async function checkDatabase(): Promise<HealthCheck> {
  try {
    await db.query("SELECT 1");
    return { status: "ok", latency_ms: 2 };
  } catch (err) {
    return { status: "error", message: "Database unreachable" };
  }
}
```

### Kubernetes Ã¦Å½Â¢Ã©â€™Ë†

```yaml
livenessProbe:
  httpGet:
    path: /health
    port: 3000
  initialDelaySeconds: 10
  periodSeconds: 30
  failureThreshold: 3

readinessProbe:
  httpGet:
    path: /health
    port: 3000
  initialDelaySeconds: 5
  periodSeconds: 10
  failureThreshold: 2

startupProbe:
  httpGet:
    path: /health
    port: 3000
  initialDelaySeconds: 0
  periodSeconds: 5
  failureThreshold: 30    # 30 * 5s = 150s max startup time
```

## Ã§Å½Â¯Ã¥Â¢Æ’Ã©â€¦ÂÃ§Â½Â®

### Ã¥ÂÂÃ¤ÂºÅ’Ã¨Â¦ÂÃ§Â´Â Ã¥Âºâ€Ã§â€Â¨Ã¦Â¨Â¡Ã¥Â¼Â

```bash
# All config via environment variables Ã¢â‚¬â€ never in code
DATABASE_URL=postgres://user:pass@host:5432/db
REDIS_URL=redis://host:6379/0
API_KEY=${API_KEY}           # injected by secrets manager
LOG_LEVEL=info
PORT=3000

# Environment-specific behavior
NODE_ENV=production          # or staging, development
APP_ENV=production           # explicit app environment
```

### Ã©â€¦ÂÃ§Â½Â®Ã©ÂªÅ’Ã¨Â¯Â

```typescript
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "staging", "production"]),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
});

// Validate at startup Ã¢â‚¬â€ fail fast if config is wrong
export const env = envSchema.parse(process.env);
```

## Ã¥â€ºÅ¾Ã¦Â»Å¡Ã§Â­â€“Ã§â€¢Â¥

### Ã¥ÂÂ³Ã¦â€”Â¶Ã¥â€ºÅ¾Ã¦Â»Å¡

```bash
# Docker/Kubernetes: point to previous image
kubectl rollout undo deployment/app

# Vercel: promote previous deployment
vercel rollback

# Railway: redeploy previous commit
railway up --commit <previous-sha>

# Database: rollback migration (if reversible)
npx prisma migrate resolve --rolled-back <migration-name>
```

### Ã¥â€ºÅ¾Ã¦Â»Å¡Ã¦Â£â‚¬Ã¦Å¸Â¥Ã¦Â¸â€¦Ã¥Ââ€¢

* \[ ] Ã¤Â¹â€¹Ã¥â€°ÂÃ§Å¡â€žÃ©â€¢Å“Ã¥Æ’Â/Ã¥Ë†Â¶Ã¥â€œÂÃ¥ÂÂ¯Ã§â€Â¨Ã¤Â¸â€Ã¥Â·Â²Ã¦Â â€¡Ã¨Â®Â°
* \[ ] Ã¦â€¢Â°Ã¦ÂÂ®Ã¥Âºâ€œÃ¨Â¿ÂÃ§Â§Â»Ã¥Ââ€˜Ã¥ÂÅ½Ã¥â€¦Â¼Ã¥Â®Â¹Ã¯Â¼Ë†Ã¦â€”Â Ã§Â Â´Ã¥ÂÂÃ¦â‚¬Â§Ã¦â€ºÂ´Ã¦â€Â¹Ã¯Â¼â€°
* \[ ] Ã¥Å Å¸Ã¨Æ’Â½Ã¦Â â€¡Ã¥Â¿â€”Ã¥ÂÂ¯Ã¤Â»Â¥Ã¥Å“Â¨Ã¤Â¸ÂÃ©Æ’Â¨Ã§Â½Â²Ã§Å¡â€žÃ¦Æ’â€¦Ã¥â€ ÂµÃ¤Â¸â€¹Ã§Â¦ÂÃ§â€Â¨Ã¦â€“Â°Ã¥Å Å¸Ã¨Æ’Â½
* \[ ] Ã§â€ºâ€˜Ã¦Å½Â§Ã¨Â­Â¦Ã¦Å Â¥Ã¥Â·Â²Ã©â€¦ÂÃ§Â½Â®Ã¯Â¼Å’Ã§â€Â¨Ã¤ÂºÅ½Ã©â€â„¢Ã¨Â¯Â¯Ã§Å½â€¡Ã©Â£â„¢Ã¥Ââ€¡
* \[ ] Ã¥Å“Â¨Ã§â€Å¸Ã¤ÂºÂ§Ã¥Ââ€˜Ã¥Â¸Æ’Ã¥â€°ÂÃ¯Â¼Å’Ã¥â€ºÅ¾Ã¦Â»Å¡Ã¥Â·Â²Ã¥Å“Â¨Ã©Â¢â€žÃ¦Â¼â€Ã§Å½Â¯Ã¥Â¢Æ’Ã¦Âµâ€¹Ã¨Â¯â€¢

## Ã§â€Å¸Ã¤ÂºÂ§Ã¥Â°Â±Ã§Â»ÂªÃ¦Â£â‚¬Ã¦Å¸Â¥Ã¦Â¸â€¦Ã¥Ââ€¢

Ã¥Å“Â¨Ã¤Â»Â»Ã¤Â½â€¢Ã§â€Å¸Ã¤ÂºÂ§Ã©Æ’Â¨Ã§Â½Â²Ã¤Â¹â€¹Ã¥â€°ÂÃ¯Â¼Å¡

### Ã¥Âºâ€Ã§â€Â¨

* \[ ] Ã¦â€°â‚¬Ã¦Å“â€°Ã¦Âµâ€¹Ã¨Â¯â€¢Ã©â‚¬Å¡Ã¨Â¿â€¡Ã¯Â¼Ë†Ã¥Ââ€¢Ã¥â€¦Æ’Ã£â‚¬ÂÃ©â€ºâ€ Ã¦Ë†ÂÃ£â‚¬ÂÃ§Â«Â¯Ã¥Ë†Â°Ã§Â«Â¯Ã¯Â¼â€°
* \[ ] Ã¤Â»Â£Ã§Â ÂÃ¦Ë†â€“Ã©â€¦ÂÃ§Â½Â®Ã¦â€“â€¡Ã¤Â»Â¶Ã¤Â¸Â­Ã¦Â²Â¡Ã¦Å“â€°Ã§Â¡Â¬Ã§Â¼â€“Ã§Â ÂÃ§Å¡â€žÃ¥Â¯â€ Ã©â€™Â¥
* \[ ] Ã©â€â„¢Ã¨Â¯Â¯Ã¥Â¤â€žÃ§Ââ€ Ã¨Â¦â€ Ã§â€ºâ€“Ã¦â€°â‚¬Ã¦Å“â€°Ã¨Â¾Â¹Ã§Â¼ËœÃ¦Æ’â€¦Ã¥â€ Âµ
* \[ ] Ã¦â€”Â¥Ã¥Â¿â€”Ã¦ËœÂ¯Ã§Â»â€œÃ¦Å¾â€žÃ¥Å’â€“Ã§Å¡â€žÃ¯Â¼Ë†JSONÃ¯Â¼â€°Ã¤Â¸â€Ã¤Â¸ÂÃ¥Å’â€¦Ã¥ÂÂ« PII
* \[ ] Ã¥ÂÂ¥Ã¥ÂºÂ·Ã¦Â£â‚¬Ã¦Å¸Â¥Ã§Â«Â¯Ã§â€šÂ¹Ã¨Â¿â€Ã¥â€ºÅ¾Ã¦Å“â€°Ã¦â€žÂÃ¤Â¹â€°Ã§Å¡â€žÃ§Å Â¶Ã¦â‚¬Â

### Ã¥Å¸ÂºÃ§Â¡â‚¬Ã¨Â®Â¾Ã¦â€“Â½

* \[ ] Docker Ã©â€¢Å“Ã¥Æ’ÂÃ¥ÂÂ¯Ã©â€¡ÂÃ¥Â¤ÂÃ¦Å¾â€žÃ¥Â»ÂºÃ¯Â¼Ë†Ã§â€°Ë†Ã¦Å“Â¬Ã¥Â·Â²Ã¥â€ºÂºÃ¥Â®Å¡Ã¯Â¼â€°
* \[ ] Ã§Å½Â¯Ã¥Â¢Æ’Ã¥ÂËœÃ©â€¡ÂÃ¥Â·Â²Ã¨Â®Â°Ã¥Â½â€¢Ã¥Â¹Â¶Ã¥Å“Â¨Ã¥ÂÂ¯Ã¥Å Â¨Ã¦â€”Â¶Ã©ÂªÅ’Ã¨Â¯Â
* \[ ] Ã¨Âµâ€žÃ¦ÂºÂÃ©â„¢ÂÃ¥Ë†Â¶Ã¥Â·Â²Ã¨Â®Â¾Ã§Â½Â®Ã¯Â¼Ë†CPUÃ£â‚¬ÂÃ¥â€ â€¦Ã¥Â­ËœÃ¯Â¼â€°
* \[ ] Ã¦Â°Â´Ã¥Â¹Â³Ã¤Â¼Â¸Ã§Â¼Â©Ã¥Â·Â²Ã©â€¦ÂÃ§Â½Â®Ã¯Â¼Ë†Ã¦Å“â‚¬Ã¥Â°Â/Ã¦Å“â‚¬Ã¥Â¤Â§Ã¥Â®Å¾Ã¤Â¾â€¹Ã¦â€¢Â°Ã¯Â¼â€°
* \[ ] Ã¦â€°â‚¬Ã¦Å“â€°Ã§Â«Â¯Ã§â€šÂ¹Ã¥Ââ€¡Ã¥Â·Â²Ã¥ÂÂ¯Ã§â€Â¨ SSL/TLS

### Ã§â€ºâ€˜Ã¦Å½Â§

* \[ ] Ã¥Âºâ€Ã§â€Â¨Ã¦Å’â€¡Ã¦Â â€¡Ã¥Â·Â²Ã¥Â¯Â¼Ã¥â€¡ÂºÃ¯Â¼Ë†Ã¨Â¯Â·Ã¦Â±â€šÃ§Å½â€¡Ã£â‚¬ÂÃ¥Â»Â¶Ã¨Â¿Å¸Ã£â‚¬ÂÃ©â€â„¢Ã¨Â¯Â¯Ã¯Â¼â€°
* \[ ] Ã¥Â·Â²Ã©â€¦ÂÃ§Â½Â®Ã©â€â„¢Ã¨Â¯Â¯Ã§Å½â€¡Ã¨Â¶â€¦Ã¨Â¿â€¡Ã©ËœË†Ã¥â‚¬Â¼Ã§Å¡â€žÃ¨Â­Â¦Ã¦Å Â¥
* \[ ] Ã¦â€”Â¥Ã¥Â¿â€”Ã¨ÂÅ¡Ã¥ÂË†Ã¥Â·Â²Ã¨Â®Â¾Ã§Â½Â®Ã¯Â¼Ë†Ã§Â»â€œÃ¦Å¾â€žÃ¥Å’â€“Ã¦â€”Â¥Ã¥Â¿â€”Ã¯Â¼Å’Ã¥ÂÂ¯Ã¦ÂÅ“Ã§Â´Â¢Ã¯Â¼â€°
* \[ ] Ã¥ÂÂ¥Ã¥ÂºÂ·Ã§Â«Â¯Ã§â€šÂ¹Ã¦Å“â€°Ã¦Â­Â£Ã¥Â¸Â¸Ã¨Â¿ÂÃ¨Â¡Å’Ã¦â€”Â¶Ã©â€”Â´Ã§â€ºâ€˜Ã¦Å½Â§

### Ã¥Â®â€°Ã¥â€¦Â¨

* \[ ] Ã¤Â¾ÂÃ¨Âµâ€“Ã©Â¡Â¹Ã¥Â·Â²Ã¦â€°Â«Ã¦ÂÂ CVE
* \[ ] CORS Ã¤Â»â€¦Ã©â€¦ÂÃ§Â½Â®Ã¥â€¦ÂÃ¨Â®Â¸Ã§Å¡â€žÃ¦ÂÂ¥Ã¦ÂºÂ
* \[ ] Ã¥â€¦Â¬Ã¥â€¦Â±Ã§Â«Â¯Ã§â€šÂ¹Ã¥Â·Â²Ã¥ÂÂ¯Ã§â€Â¨Ã©â‚¬Å¸Ã§Å½â€¡Ã©â„¢ÂÃ¥Ë†Â¶
* \[ ] Ã¨ÂºÂ«Ã¤Â»Â½Ã©ÂªÅ’Ã¨Â¯ÂÃ¥â€™Å’Ã¦Å½Ë†Ã¦ÂÆ’Ã¥Â·Â²Ã©ÂªÅ’Ã¨Â¯Â
* \[ ] Ã¥Â®â€°Ã¥â€¦Â¨Ã¥Â¤Â´Ã¥Â·Â²Ã¨Â®Â¾Ã§Â½Â®Ã¯Â¼Ë†CSPÃ£â‚¬ÂHSTSÃ£â‚¬ÂX-Frame-OptionsÃ¯Â¼â€°

### Ã¨Â¿ÂÃ§Â»Â´

* \[ ] Ã¥â€ºÅ¾Ã¦Â»Å¡Ã¨Â®Â¡Ã¥Ë†â€™Ã¥Â·Â²Ã¨Â®Â°Ã¥Â½â€¢Ã¥Â¹Â¶Ã¦Âµâ€¹Ã¨Â¯â€¢
* \[ ] Ã¦â€¢Â°Ã¦ÂÂ®Ã¥Âºâ€œÃ¨Â¿ÂÃ§Â§Â»Ã¥Â·Â²Ã©â€™Ë†Ã¥Â¯Â¹Ã§â€Å¸Ã¤ÂºÂ§Ã¨Â§â€žÃ¦Â¨Â¡Ã§Å¡â€žÃ¦â€¢Â°Ã¦ÂÂ®Ã¨Â¿â€ºÃ¨Â¡Å’Ã¦Âµâ€¹Ã¨Â¯â€¢
* \[ ] Ã¥Â¸Â¸Ã¨Â§ÂÃ¦â€¢â€¦Ã©Å¡Å“Ã¥Å“ÂºÃ¦â„¢Â¯Ã§Å¡â€žÃ¥Âºâ€Ã¦â‚¬Â¥Ã©Â¢â€žÃ¦Â¡Ë†
* \[ ] Ã¥Â¾â€¦Ã¥â€˜Â½Ã¨Â½Â®Ã¦ÂÂ¢Ã¥â€™Å’Ã¥Ââ€¡Ã§ÂºÂ§Ã¨Â·Â¯Ã¥Â¾â€žÃ¥Â·Â²Ã¥Â®Å¡Ã¤Â¹â€°
