---
name: clickhouse-io
description: ÃªÂ³Â Ã¬â€žÂ±Ã«Å Â¥ Ã«Â¶â€žÃ¬â€žÂ Ã¬â€ºÅ’Ã­ÂÂ¬Ã«Â¡Å“Ã«â€œÅ“Ã«Â¥Â¼ Ã¬Å“â€žÃ­â€¢Å“ ClickHouse Ã«ÂÂ°Ã¬ÂÂ´Ã­â€žÂ°Ã«Â²Â Ã¬ÂÂ´Ã¬Å Â¤ Ã­Å’Â¨Ã­â€žÂ´, Ã¬Â¿Â¼Ã«Â¦Â¬ Ã¬ÂµÅ“Ã¬Â ÂÃ­â„¢â€, Ã«Â¶â€žÃ¬â€žÂ Ã«Â°Â Ã«ÂÂ°Ã¬ÂÂ´Ã­â€žÂ° Ã¬â€”â€Ã¬Â§â‚¬Ã«â€¹Ë†Ã¬â€“Â´Ã«Â§Â Ã«ÂªÂ¨Ã«Â²â€ Ã¬â€šÂ¬Ã«Â¡â‚¬.
origin: claude-fulcrum
---

# ClickHouse Ã«Â¶â€žÃ¬â€žÂ Ã­Å’Â¨Ã­â€žÂ´

ÃªÂ³Â Ã¬â€žÂ±Ã«Å Â¥ Ã«Â¶â€žÃ¬â€žÂ Ã«Â°Â Ã«ÂÂ°Ã¬ÂÂ´Ã­â€žÂ° Ã¬â€”â€Ã¬Â§â‚¬Ã«â€¹Ë†Ã¬â€“Â´Ã«Â§ÂÃ¬Ââ€ž Ã¬Å“â€žÃ­â€¢Å“ ClickHouse Ã¬Â â€žÃ¬Å¡Â© Ã­Å’Â¨Ã­â€žÂ´.

## Ã­â„¢Å“Ã¬â€žÂ±Ã­â„¢â€ Ã¬â€¹Å“Ã¬Â Â

- ClickHouse Ã­â€¦Å’Ã¬ÂÂ´Ã«Â¸â€ Ã¬Å Â¤Ã­â€šÂ¤Ã«Â§Ë† Ã¬â€žÂ¤ÃªÂ³â€ž Ã¬â€¹Å“ (MergeTree Ã¬â€”â€Ã¬Â§â€ž Ã¬â€žÂ Ã­Æ’Â)
- Ã«Â¶â€žÃ¬â€žÂ Ã¬Â¿Â¼Ã«Â¦Â¬ Ã¬Å¾â€˜Ã¬â€žÂ± Ã¬â€¹Å“ (Ã¬Â§â€˜ÃªÂ³â€ž, Ã¬Å“Ë†Ã«Ââ€žÃ¬Å¡Â° Ã­â€¢Â¨Ã¬Ë†Ëœ, Ã¬Â¡Â°Ã¬ÂÂ¸)
- Ã¬Â¿Â¼Ã«Â¦Â¬ Ã¬â€žÂ±Ã«Å Â¥ Ã¬ÂµÅ“Ã¬Â ÂÃ­â„¢â€ Ã¬â€¹Å“ (Ã­Å’Å’Ã­â€¹Â°Ã¬â€¦Ëœ Ã­â€â€žÃ«Â£Â¨Ã«â€¹Â, Ã­â€â€žÃ«Â¡Å“Ã¬Â ÂÃ¬â€¦Ëœ, ÃªÂµÂ¬Ã¬Â²Â´Ã­â„¢â€Ã«ÂÅ“ Ã«Â·Â°)
- Ã«Å’â‚¬Ã«Å¸â€° Ã«ÂÂ°Ã¬ÂÂ´Ã­â€žÂ° Ã¬Ë†ËœÃ¬Â§â€˜ Ã¬â€¹Å“ (Ã«Â°Â°Ã¬Â¹Ëœ Ã¬â€šÂ½Ã¬Å¾â€¦, Kafka Ã­â€ ÂµÃ­â€¢Â©)
- PostgreSQL/MySQLÃ¬â€”ÂÃ¬â€žÅ“ ClickHouseÃ«Â¡Å“ Ã«Â¶â€žÃ¬â€žÂ Ã«Â§Ë†Ã¬ÂÂ´ÃªÂ·Â¸Ã«Â Ë†Ã¬ÂÂ´Ã¬â€¦Ëœ Ã¬â€¹Å“
- Ã¬â€¹Â¤Ã¬â€¹Å“ÃªÂ°â€ž Ã«Å’â‚¬Ã¬â€¹Å“Ã«Â³Â´Ã«â€œÅ“ Ã«ËœÂÃ«Å â€ Ã¬â€¹Å“ÃªÂ³â€žÃ¬â€”Â´ Ã«Â¶â€žÃ¬â€žÂ ÃªÂµÂ¬Ã­Ëœâ€ž Ã¬â€¹Å“

## ÃªÂ°Å“Ã¬Å¡â€

ClickHouseÃ«Å â€ Ã¬ËœÂ¨Ã«ÂÂ¼Ã¬ÂÂ¸ Ã«Â¶â€žÃ¬â€žÂ Ã¬Â²ËœÃ«Â¦Â¬(OLAP)Ã«Â¥Â¼ Ã¬Å“â€žÃ­â€¢Å“ Ã¬Â»Â¬Ã«Å¸Â¼ Ã¬Â§â‚¬Ã­â€“Â¥ Ã«ÂÂ°Ã¬ÂÂ´Ã­â€žÂ°Ã«Â²Â Ã¬ÂÂ´Ã¬Å Â¤ ÃªÂ´â‚¬Ã«Â¦Â¬ Ã¬â€¹Å“Ã¬Å Â¤Ã­â€¦Å“(DBMS)Ã¬Å¾â€¦Ã«â€¹Ë†Ã«â€¹Â¤. Ã«Å’â‚¬ÃªÂ·Å“Ã«ÂªÂ¨ Ã«ÂÂ°Ã¬ÂÂ´Ã­â€žÂ°Ã¬â€¦â€¹Ã¬â€”Â Ã«Å’â‚¬Ã­â€¢Å“ Ã«Â¹Â Ã«Â¥Â¸ Ã«Â¶â€žÃ¬â€žÂ Ã¬Â¿Â¼Ã«Â¦Â¬Ã¬â€”Â Ã¬ÂµÅ“Ã¬Â ÂÃ­â„¢â€Ã«ÂËœÃ¬â€“Â´ Ã¬Å¾Ë†Ã¬Å ÂµÃ«â€¹Ë†Ã«â€¹Â¤.

**Ã¬Â£Â¼Ã¬Å¡â€ Ã­Å Â¹Ã¬Â§â€¢:**
- Ã¬Â»Â¬Ã«Å¸Â¼ Ã¬Â§â‚¬Ã­â€“Â¥ Ã¬Â â‚¬Ã¬Å¾Â¥Ã¬â€ Å’
- Ã«ÂÂ°Ã¬ÂÂ´Ã­â€žÂ° Ã¬â€¢â€¢Ã¬Â¶â€¢
- Ã«Â³â€˜Ã«Â Â¬ Ã¬Â¿Â¼Ã«Â¦Â¬ Ã¬â€¹Â¤Ã­â€“â€°
- Ã«Â¶â€žÃ¬â€šÂ° Ã¬Â¿Â¼Ã«Â¦Â¬
- Ã¬â€¹Â¤Ã¬â€¹Å“ÃªÂ°â€ž Ã«Â¶â€žÃ¬â€žÂ

## Ã­â€¦Å’Ã¬ÂÂ´Ã«Â¸â€ Ã¬â€žÂ¤ÃªÂ³â€ž Ã­Å’Â¨Ã­â€žÂ´

### MergeTree Ã¬â€”â€Ã¬Â§â€ž (ÃªÂ°â‚¬Ã¬Å¾Â¥ Ã¬ÂÂ¼Ã«Â°ËœÃ¬Â Â)

```sql
CREATE TABLE markets_analytics (
    date Date,
    market_id String,
    market_name String,
    volume UInt64,
    trades UInt32,
    unique_traders UInt32,
    avg_trade_size Float64,
    created_at DateTime
) ENGINE = MergeTree()
PARTITION BY toYYYYMM(date)
ORDER BY (date, market_id)
SETTINGS index_granularity = 8192;
```

### ReplacingMergeTree (Ã¬Â¤â€˜Ã«Â³Âµ Ã¬Â Å“ÃªÂ±Â°)

```sql
-- Ã¬Â¤â€˜Ã«Â³ÂµÃ¬ÂÂ´ Ã¬Å¾Ë†Ã¬Ââ€ž Ã¬Ë†Ëœ Ã¬Å¾Ë†Ã«Å â€ Ã«ÂÂ°Ã¬ÂÂ´Ã­â€žÂ°Ã¬Å¡Â© (Ã¬ËœË†: Ã¬â€”Â¬Ã«Å¸Â¬ Ã¬â€ Å’Ã¬Å Â¤Ã¬â€”ÂÃ¬â€žÅ“ Ã¬Ë†ËœÃ¬Â§â€˜Ã«ÂÅ“ ÃªÂ²Â½Ã¬Å¡Â°)
CREATE TABLE user_events (
    event_id String,
    user_id String,
    event_type String,
    timestamp DateTime,
    properties String
) ENGINE = ReplacingMergeTree()
PARTITION BY toYYYYMM(timestamp)
ORDER BY (user_id, event_id, timestamp)
PRIMARY KEY (user_id, event_id);
```

### AggregatingMergeTree (Ã¬â€šÂ¬Ã¬Â â€ž Ã¬Â§â€˜ÃªÂ³â€ž)

```sql
-- Ã¬Â§â€˜ÃªÂ³â€ž Ã«Â©â€Ã­Å Â¸Ã«Â¦Â­Ã¬Ââ€ž Ã¬Å“Â Ã¬Â§â‚¬Ã­â€¢ËœÃªÂ¸Â° Ã¬Å“â€žÃ­â€¢Å“ Ã¬Å¡Â©Ã«Ââ€ž
CREATE TABLE market_stats_hourly (
    hour DateTime,
    market_id String,
    total_volume AggregateFunction(sum, UInt64),
    total_trades AggregateFunction(count, UInt32),
    unique_users AggregateFunction(uniq, String)
) ENGINE = AggregatingMergeTree()
PARTITION BY toYYYYMM(hour)
ORDER BY (hour, market_id);

-- Ã¬Â§â€˜ÃªÂ³â€žÃ«ÂÅ“ Ã«ÂÂ°Ã¬ÂÂ´Ã­â€žÂ° Ã¬Â¡Â°Ã­Å¡Å’
SELECT
    hour,
    market_id,
    sumMerge(total_volume) AS volume,
    countMerge(total_trades) AS trades,
    uniqMerge(unique_users) AS users
FROM market_stats_hourly
WHERE hour >= toStartOfHour(now() - INTERVAL 24 HOUR)
GROUP BY hour, market_id
ORDER BY hour DESC;
```

## Ã¬Â¿Â¼Ã«Â¦Â¬ Ã¬ÂµÅ“Ã¬Â ÂÃ­â„¢â€ Ã­Å’Â¨Ã­â€žÂ´

### Ã­Å¡Â¨Ã¬Å“Â¨Ã¬Â ÂÃ¬ÂÂ¸ Ã­â€¢â€žÃ­â€žÂ°Ã«Â§Â

```sql
-- Ã¢Å“â€¦ Ã¬Â¢â€¹Ã¬ÂÅ’: Ã¬ÂÂ¸Ã«ÂÂ±Ã¬Å Â¤Ã«ÂÅ“ Ã¬Â»Â¬Ã«Å¸Â¼Ã¬Ââ€ž Ã«Â¨Â¼Ã¬Â â‚¬ Ã¬â€šÂ¬Ã¬Å¡Â©
SELECT *
FROM markets_analytics
WHERE date >= '2025-01-01'
  AND market_id = 'market-123'
  AND volume > 1000
ORDER BY date DESC
LIMIT 100;

-- Ã¢ÂÅ’ Ã«â€šËœÃ¬ÂÂ¨: Ã«Â¹â€žÃ¬ÂÂ¸Ã«ÂÂ±Ã¬Å Â¤ Ã¬Â»Â¬Ã«Å¸Â¼Ã¬Ââ€ž Ã«Â¨Â¼Ã¬Â â‚¬ Ã­â€¢â€žÃ­â€žÂ°Ã«Â§Â
SELECT *
FROM markets_analytics
WHERE volume > 1000
  AND market_name LIKE '%election%'
  AND date >= '2025-01-01';
```

### Ã¬Â§â€˜ÃªÂ³â€ž

```sql
-- Ã¢Å“â€¦ Ã¬Â¢â€¹Ã¬ÂÅ’: ClickHouse Ã¬Â â€žÃ¬Å¡Â© Ã¬Â§â€˜ÃªÂ³â€ž Ã­â€¢Â¨Ã¬Ë†ËœÃ«Â¥Â¼ Ã¬â€šÂ¬Ã¬Å¡Â©
SELECT
    toStartOfDay(created_at) AS day,
    market_id,
    sum(volume) AS total_volume,
    count() AS total_trades,
    uniq(trader_id) AS unique_traders,
    avg(trade_size) AS avg_size
FROM trades
WHERE created_at >= today() - INTERVAL 7 DAY
GROUP BY day, market_id
ORDER BY day DESC, total_volume DESC;

-- Ã¢Å“â€¦ Ã«Â°Â±Ã«Â¶â€žÃ¬Å“â€žÃ¬Ë†ËœÃ¬â€”ÂÃ«Å â€ quantile Ã¬â€šÂ¬Ã¬Å¡Â© (percentileÃ«Â³Â´Ã«â€¹Â¤ Ã­Å¡Â¨Ã¬Å“Â¨Ã¬Â Â)
SELECT
    quantile(0.50)(trade_size) AS median,
    quantile(0.95)(trade_size) AS p95,
    quantile(0.99)(trade_size) AS p99
FROM trades
WHERE created_at >= now() - INTERVAL 1 HOUR;
```

### Ã¬Å“Ë†Ã«Ââ€žÃ¬Å¡Â° Ã­â€¢Â¨Ã¬Ë†Ëœ

```sql
-- Ã«Ë†â€žÃ¬Â Â Ã­â€¢Â©ÃªÂ³â€ž ÃªÂ³â€žÃ¬â€šÂ°
SELECT
    date,
    market_id,
    volume,
    sum(volume) OVER (
        PARTITION BY market_id
        ORDER BY date
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) AS cumulative_volume
FROM markets_analytics
WHERE date >= today() - INTERVAL 30 DAY
ORDER BY market_id, date;
```

## Ã«ÂÂ°Ã¬ÂÂ´Ã­â€žÂ° Ã¬â€šÂ½Ã¬Å¾â€¦ Ã­Å’Â¨Ã­â€žÂ´

### Ã«Â°Â°Ã¬Â¹Ëœ Ã¬â€šÂ½Ã¬Å¾â€¦ (ÃªÂ¶Å’Ã¬Å¾Â¥)

```typescript
import { ClickHouse } from 'clickhouse'

const clickhouse = new ClickHouse({
  url: process.env.CLICKHOUSE_URL,
  port: 8123,
  basicAuth: {
    username: process.env.CLICKHOUSE_USER,
    password: process.env.CLICKHOUSE_PASSWORD
  }
})

// Ã¢Å“â€¦ Ã«Â°Â°Ã¬Â¹Ëœ Ã¬â€šÂ½Ã¬Å¾â€¦ (Ã­Å¡Â¨Ã¬Å“Â¨Ã¬Â Â)
async function bulkInsertTrades(trades: Trade[]) {
  const rows = trades.map(trade => ({
    id: trade.id,
    market_id: trade.market_id,
    user_id: trade.user_id,
    amount: trade.amount,
    timestamp: trade.timestamp.toISOString()
  }))

  await clickhouse.insert('trades', rows)
}

// Ã¢ÂÅ’ ÃªÂ°Å“Ã«Â³â€ž Ã¬â€šÂ½Ã¬Å¾â€¦ (Ã«Å ÂÃ«Â¦Â¼)
async function insertTrade(trade: Trade) {
  // Ã«Â£Â¨Ã­â€â€ž Ã¬â€¢Ë†Ã¬â€”ÂÃ¬â€žÅ“ Ã¬ÂÂ´Ã«Â â€¡ÃªÂ²Å’ Ã­â€¢ËœÃ¬Â§â‚¬ Ã«Â§Ë†Ã¬â€žÂ¸Ã¬Å¡â€!
  await clickhouse.query(`
    INSERT INTO trades VALUES ('${trade.id}', ...)
  `).toPromise()
}
```

### Ã¬Å Â¤Ã­Å Â¸Ã«Â¦Â¬Ã«Â°Â Ã¬â€šÂ½Ã¬Å¾â€¦

```typescript
// Ã¬â€”Â°Ã¬â€ ÂÃ¬Â ÂÃ¬ÂÂ¸ Ã«ÂÂ°Ã¬ÂÂ´Ã­â€žÂ° Ã¬Ë†ËœÃ¬Â§â€˜Ã¬Å¡Â©
import { createWriteStream } from 'fs'
import { pipeline } from 'stream/promises'

async function streamInserts() {
  const stream = clickhouse.insert('trades').stream()

  for await (const batch of dataSource) {
    stream.write(batch)
  }

  await stream.end()
}
```

## ÃªÂµÂ¬Ã¬Â²Â´Ã­â„¢â€Ã«ÂÅ“ Ã«Â·Â°

### Ã¬â€¹Â¤Ã¬â€¹Å“ÃªÂ°â€ž Ã¬Â§â€˜ÃªÂ³â€ž

```sql
-- Ã¬â€¹Å“ÃªÂ°â€žÃ«Â³â€ž Ã­â€ ÂµÃªÂ³â€žÃ«Â¥Â¼ Ã¬Å“â€žÃ­â€¢Å“ materialized view Ã¬Æ’ÂÃ¬â€žÂ±
CREATE MATERIALIZED VIEW market_stats_hourly_mv
TO market_stats_hourly
AS SELECT
    toStartOfHour(timestamp) AS hour,
    market_id,
    sumState(amount) AS total_volume,
    countState() AS total_trades,
    uniqState(user_id) AS unique_users
FROM trades
GROUP BY hour, market_id;

-- materialized view Ã¬Â¡Â°Ã­Å¡Å’
SELECT
    hour,
    market_id,
    sumMerge(total_volume) AS volume,
    countMerge(total_trades) AS trades,
    uniqMerge(unique_users) AS users
FROM market_stats_hourly
WHERE hour >= now() - INTERVAL 24 HOUR
GROUP BY hour, market_id;
```

## Ã¬â€žÂ±Ã«Å Â¥ Ã«ÂªÂ¨Ã«â€¹Ë†Ã­â€žÂ°Ã«Â§Â

### Ã¬Â¿Â¼Ã«Â¦Â¬ Ã¬â€žÂ±Ã«Å Â¥

```sql
-- Ã«Å ÂÃ«Â¦Â° Ã¬Â¿Â¼Ã«Â¦Â¬ Ã­â„¢â€¢Ã¬ÂÂ¸
SELECT
    query_id,
    user,
    query,
    query_duration_ms,
    read_rows,
    read_bytes,
    memory_usage
FROM system.query_log
WHERE type = 'QueryFinish'
  AND query_duration_ms > 1000
  AND event_time >= now() - INTERVAL 1 HOUR
ORDER BY query_duration_ms DESC
LIMIT 10;
```

### Ã­â€¦Å’Ã¬ÂÂ´Ã«Â¸â€ Ã­â€ ÂµÃªÂ³â€ž

```sql
-- Ã­â€¦Å’Ã¬ÂÂ´Ã«Â¸â€ Ã­ÂÂ¬ÃªÂ¸Â° Ã­â„¢â€¢Ã¬ÂÂ¸
SELECT
    database,
    table,
    formatReadableSize(sum(bytes)) AS size,
    sum(rows) AS rows,
    max(modification_time) AS latest_modification
FROM system.parts
WHERE active
GROUP BY database, table
ORDER BY sum(bytes) DESC;
```

## Ã¬ÂÂ¼Ã«Â°ËœÃ¬Â ÂÃ¬ÂÂ¸ Ã«Â¶â€žÃ¬â€žÂ Ã¬Â¿Â¼Ã«Â¦Â¬

### Ã¬â€¹Å“ÃªÂ³â€žÃ¬â€”Â´ Ã«Â¶â€žÃ¬â€žÂ

```sql
-- Ã¬ÂÂ¼ÃªÂ°â€ž Ã­â„¢Å“Ã¬â€žÂ± Ã¬â€šÂ¬Ã¬Å¡Â©Ã¬Å¾Â
SELECT
    toDate(timestamp) AS date,
    uniq(user_id) AS daily_active_users
FROM events
WHERE timestamp >= today() - INTERVAL 30 DAY
GROUP BY date
ORDER BY date;

-- Ã«Â¦Â¬Ã­â€¦ÂÃ¬â€¦Ëœ Ã«Â¶â€žÃ¬â€žÂ
SELECT
    signup_date,
    countIf(days_since_signup = 0) AS day_0,
    countIf(days_since_signup = 1) AS day_1,
    countIf(days_since_signup = 7) AS day_7,
    countIf(days_since_signup = 30) AS day_30
FROM (
    SELECT
        user_id,
        min(toDate(timestamp)) AS signup_date,
        toDate(timestamp) AS activity_date,
        dateDiff('day', signup_date, activity_date) AS days_since_signup
    FROM events
    GROUP BY user_id, activity_date
)
GROUP BY signup_date
ORDER BY signup_date DESC;
```

### Ã­ÂÂ¼Ã«â€žÂ Ã«Â¶â€žÃ¬â€žÂ

```sql
-- Ã¬Â â€žÃ­â„¢Ëœ Ã­ÂÂ¼Ã«â€žÂ
SELECT
    countIf(step = 'viewed_market') AS viewed,
    countIf(step = 'clicked_trade') AS clicked,
    countIf(step = 'completed_trade') AS completed,
    round(clicked / viewed * 100, 2) AS view_to_click_rate,
    round(completed / clicked * 100, 2) AS click_to_completion_rate
FROM (
    SELECT
        user_id,
        session_id,
        event_type AS step
    FROM events
    WHERE event_date = today()
)
GROUP BY session_id;
```

### Ã¬Â½â€Ã­ËœÂ¸Ã­Å Â¸ Ã«Â¶â€žÃ¬â€žÂ

```sql
-- ÃªÂ°â‚¬Ã¬Å¾â€¦ Ã¬â€ºâ€Ã«Â³â€ž Ã¬â€šÂ¬Ã¬Å¡Â©Ã¬Å¾Â Ã¬Â½â€Ã­ËœÂ¸Ã­Å Â¸
SELECT
    toStartOfMonth(signup_date) AS cohort,
    toStartOfMonth(activity_date) AS month,
    dateDiff('month', cohort, month) AS months_since_signup,
    count(DISTINCT user_id) AS active_users
FROM (
    SELECT
        user_id,
        min(toDate(timestamp)) OVER (PARTITION BY user_id) AS signup_date,
        toDate(timestamp) AS activity_date
    FROM events
)
GROUP BY cohort, month, months_since_signup
ORDER BY cohort, months_since_signup;
```

## Ã«ÂÂ°Ã¬ÂÂ´Ã­â€žÂ° Ã­Å’Å’Ã¬ÂÂ´Ã­â€â€žÃ«ÂÂ¼Ã¬ÂÂ¸ Ã­Å’Â¨Ã­â€žÂ´

### ETL Ã­Å’Â¨Ã­â€žÂ´

```typescript
// Ã¬Â¶â€Ã¬Â¶Å“, Ã«Â³â‚¬Ã­â„¢Ëœ, Ã¬Â ÂÃ¬Å¾Â¬(ETL)
async function etlPipeline() {
  // 1. Ã¬â€ Å’Ã¬Å Â¤Ã¬â€”ÂÃ¬â€žÅ“ Ã¬Â¶â€Ã¬Â¶Å“
  const rawData = await extractFromPostgres()

  // 2. Ã«Â³â‚¬Ã­â„¢Ëœ
  const transformed = rawData.map(row => ({
    date: new Date(row.created_at).toISOString().split('T')[0],
    market_id: row.market_slug,
    volume: parseFloat(row.total_volume),
    trades: parseInt(row.trade_count)
  }))

  // 3. ClickHouseÃ¬â€”Â Ã¬Â ÂÃ¬Å¾Â¬
  await bulkInsertToClickHouse(transformed)
}

// Ã¬Â£Â¼ÃªÂ¸Â°Ã¬Â ÂÃ¬Å“Â¼Ã«Â¡Å“ Ã¬â€¹Â¤Ã­â€“â€°
let etlRunning = false

setInterval(async () => {
  if (etlRunning) return

  etlRunning = true
  try {
    await etlPipeline()
  } finally {
    etlRunning = false
  }
}, 60 * 60 * 1000)  // Every hour
```

### Ã«Â³â‚¬ÃªÂ²Â½ Ã«ÂÂ°Ã¬ÂÂ´Ã­â€žÂ° Ã¬ÂºÂ¡Ã¬Â²Ëœ (CDC)

```typescript
// PostgreSQL Ã«Â³â‚¬ÃªÂ²Â½Ã¬Ââ€ž Ã¬Ë†ËœÃ¬â€¹Â Ã­â€¢ËœÃªÂ³Â  ClickHouseÃ¬â„¢â‚¬ Ã«Ââ„¢ÃªÂ¸Â°Ã­â„¢â€
import { Client } from 'pg'

const pgClient = new Client({ connectionString: process.env.DATABASE_URL })

pgClient.query('LISTEN market_updates')

pgClient.on('notification', async (msg) => {
  const update = JSON.parse(msg.payload)

  await clickhouse.insert('market_updates', [
    {
      market_id: update.id,
      event_type: update.operation,  // INSERT, UPDATE, DELETE
      timestamp: new Date(),
      data: JSON.stringify(update.new_data)
    }
  ])
})
```

## Ã«ÂªÂ¨Ã«Â²â€ Ã¬â€šÂ¬Ã«Â¡â‚¬

### 1. Ã­Å’Å’Ã­â€¹Â°Ã¬â€¦â€Ã«â€¹Â Ã¬Â â€žÃ«Å¾Âµ
- Ã¬â€¹Å“ÃªÂ°â€žÃ«Â³â€ž Ã­Å’Å’Ã­â€¹Â°Ã¬â€¦â€Ã«â€¹Â (Ã«Â³Â´Ã­â€ Âµ Ã¬â€ºâ€ Ã«ËœÂÃ«Å â€ Ã¬ÂÂ¼)
- Ã­Å’Å’Ã­â€¹Â°Ã¬â€¦ËœÃ¬ÂÂ´ Ã«â€žË†Ã«Â¬Â´ Ã«Â§Å½Ã¬Ââ‚¬ ÃªÂ²Æ’ Ã«Â°Â©Ã¬Â§â‚¬ (Ã¬â€žÂ±Ã«Å Â¥ Ã¬ËœÂÃ­â€“Â¥)
- Ã­Å’Å’Ã­â€¹Â°Ã¬â€¦Ëœ Ã­â€šÂ¤Ã¬â€”Â DATE Ã­Æ’â‚¬Ã¬Å¾â€¦ Ã¬â€šÂ¬Ã¬Å¡Â©

### 2. Ã¬Â â€¢Ã«Â Â¬ Ã­â€šÂ¤
- ÃªÂ°â‚¬Ã¬Å¾Â¥ Ã¬Å¾ÂÃ¬Â£Â¼ Ã­â€¢â€žÃ­â€žÂ°Ã«Â§ÂÃ«ÂËœÃ«Å â€ Ã¬Â»Â¬Ã«Å¸Â¼Ã¬Ââ€ž Ã«Â¨Â¼Ã¬Â â‚¬ Ã«Â°Â°Ã¬Â¹Ëœ
- Ã¬Â¹Â´Ã«â€â€Ã«â€žÂÃ«Â¦Â¬Ã­â€¹Â° ÃªÂ³Â Ã«Â Â¤ (Ã«â€ â€™Ã¬Ââ‚¬ Ã¬Â¹Â´Ã«â€â€Ã«â€žÂÃ«Â¦Â¬Ã­â€¹Â° Ã«Â¨Â¼Ã¬Â â‚¬)
- Ã¬Â â€¢Ã«Â Â¬Ã¬ÂÂ´ Ã¬â€¢â€¢Ã¬Â¶â€¢Ã¬â€”Â Ã¬ËœÂÃ­â€“Â¥Ã¬Ââ€ž Ã«Â¯Â¸Ã¬Â¹Â¨

### 3. Ã«ÂÂ°Ã¬ÂÂ´Ã­â€žÂ° Ã­Æ’â‚¬Ã¬Å¾â€¦
- ÃªÂ°â‚¬Ã¬Å¾Â¥ Ã¬Å¾â€˜Ã¬Ââ‚¬ Ã¬Â ÂÃ¬Â Ë†Ã­â€¢Å“ Ã­Æ’â‚¬Ã¬Å¾â€¦ Ã¬â€šÂ¬Ã¬Å¡Â© (UInt32 vs UInt64)
- Ã«Â°ËœÃ«Â³ÂµÃ«ÂËœÃ«Å â€ Ã«Â¬Â¸Ã¬Å¾ÂÃ¬â€”Â´Ã¬â€”Â LowCardinality Ã¬â€šÂ¬Ã¬Å¡Â©
- Ã«Â²â€Ã¬Â£Â¼Ã­Ëœâ€¢ Ã«ÂÂ°Ã¬ÂÂ´Ã­â€žÂ°Ã¬â€”Â Enum Ã¬â€šÂ¬Ã¬Å¡Â©

### 4. Ã­â€Â¼Ã­â€¢Â´Ã¬â€¢Â¼ Ã­â€¢Â  ÃªÂ²Æ’
- SELECT * (Ã¬Â»Â¬Ã«Å¸Â¼Ã¬Ââ€ž Ã«Âªâ€¦Ã¬â€¹Å“)
- FINAL (Ã¬Â¿Â¼Ã«Â¦Â¬ Ã¬Â â€žÃ¬â€”Â Ã«ÂÂ°Ã¬ÂÂ´Ã­â€žÂ°Ã«Â¥Â¼ Ã«Â³â€˜Ã­â€¢Â©)
- Ã«â€žË†Ã«Â¬Â´ Ã«Â§Å½Ã¬Ââ‚¬ JOIN (Ã«Â¶â€žÃ¬â€žÂÃ¬Ââ€ž Ã¬Å“â€žÃ­â€¢Â´ Ã«Â¹â€žÃ¬Â â€¢ÃªÂ·Å“Ã­â„¢â€)
- Ã¬Å¾â€˜Ã¬Ââ‚¬ Ã«Â¹Ë†Ã«Â²Ë†Ã­â€¢Å“ Ã¬â€šÂ½Ã¬Å¾â€¦ (Ã«Â°Â°Ã¬Â¹Ëœ Ã¬Â²ËœÃ«Â¦Â¬)

### 5. Ã«ÂªÂ¨Ã«â€¹Ë†Ã­â€žÂ°Ã«Â§Â
- Ã¬Â¿Â¼Ã«Â¦Â¬ Ã¬â€žÂ±Ã«Å Â¥ Ã¬Â¶â€Ã¬Â Â
- Ã«â€â€Ã¬Å Â¤Ã­ÂÂ¬ Ã¬â€šÂ¬Ã¬Å¡Â©Ã«Å¸â€° Ã«ÂªÂ¨Ã«â€¹Ë†Ã­â€žÂ°Ã«Â§Â
- Ã«Â³â€˜Ã­â€¢Â© Ã¬Å¾â€˜Ã¬â€”â€¦ Ã­â„¢â€¢Ã¬ÂÂ¸
- Ã¬Å Â¬Ã«Â¡Å“Ã¬Å¡Â° Ã¬Â¿Â¼Ã«Â¦Â¬ Ã«Â¡Å“ÃªÂ·Â¸ ÃªÂ²â‚¬Ã­â€ Â 

**ÃªÂ¸Â°Ã¬â€“ÂµÃ­â€¢ËœÃ¬â€žÂ¸Ã¬Å¡â€**: ClickHouseÃ«Å â€ Ã«Â¶â€žÃ¬â€žÂ Ã¬â€ºÅ’Ã­ÂÂ¬Ã«Â¡Å“Ã«â€œÅ“Ã¬â€”Â Ã­Æ’ÂÃ¬â€ºâ€Ã­â€¢Â©Ã«â€¹Ë†Ã«â€¹Â¤. Ã¬Â¿Â¼Ã«Â¦Â¬ Ã­Å’Â¨Ã­â€žÂ´Ã¬â€”Â Ã«Â§Å¾ÃªÂ²Å’ Ã­â€¦Å’Ã¬ÂÂ´Ã«Â¸â€Ã¬Ââ€ž Ã¬â€žÂ¤ÃªÂ³â€žÃ­â€¢ËœÃªÂ³Â , Ã«Â°Â°Ã¬Â¹Ëœ Ã¬â€šÂ½Ã¬Å¾â€¦Ã¬Ââ€ž Ã¬â€šÂ¬Ã¬Å¡Â©Ã­â€¢ËœÃ«Â©Â°, Ã¬â€¹Â¤Ã¬â€¹Å“ÃªÂ°â€ž Ã¬Â§â€˜ÃªÂ³â€žÃ«Â¥Â¼ Ã¬Å“â€žÃ­â€¢Â´ ÃªÂµÂ¬Ã¬Â²Â´Ã­â„¢â€Ã«ÂÅ“ Ã«Â·Â°Ã«Â¥Â¼ Ã­â„¢Å“Ã¬Å¡Â©Ã­â€¢ËœÃ¬â€žÂ¸Ã¬Å¡â€.
