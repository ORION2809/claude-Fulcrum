---
name: clickhouse-io
description: ClickHouseÃ¦â€¢Â°Ã¦ÂÂ®Ã¥Âºâ€œÃ¦Â¨Â¡Ã¥Â¼ÂÃ£â‚¬ÂÃ¦Å¸Â¥Ã¨Â¯Â¢Ã¤Â¼ËœÃ¥Å’â€“Ã£â‚¬ÂÃ¥Ë†â€ Ã¦Å¾ÂÃ¤Â»Â¥Ã¥ÂÅ Ã©Â«ËœÃ¦â‚¬Â§Ã¨Æ’Â½Ã¥Ë†â€ Ã¦Å¾ÂÃ¥Â·Â¥Ã¤Â½Å“Ã¨Â´Å¸Ã¨Â½Â½Ã§Å¡â€žÃ¦â€¢Â°Ã¦ÂÂ®Ã¥Â·Â¥Ã§Â¨â€¹Ã¦Å“â‚¬Ã¤Â½Â³Ã¥Â®Å¾Ã¨Â·ÂµÃ£â‚¬â€š
origin: claude-fulcrum
---

# ClickHouse Ã¥Ë†â€ Ã¦Å¾ÂÃ¦Â¨Â¡Ã¥Â¼Â

Ã§â€Â¨Ã¤ÂºÅ½Ã©Â«ËœÃ¦â‚¬Â§Ã¨Æ’Â½Ã¥Ë†â€ Ã¦Å¾ÂÃ¥â€™Å’Ã¦â€¢Â°Ã¦ÂÂ®Ã¥Â·Â¥Ã§Â¨â€¹Ã§Å¡â€ž ClickHouse Ã§â€°Â¹Ã¥Â®Å¡Ã¦Â¨Â¡Ã¥Â¼ÂÃ£â‚¬â€š

## Ã¤Â½â€¢Ã¦â€”Â¶Ã¦Â¿â‚¬Ã¦Â´Â»

* Ã¨Â®Â¾Ã¨Â®Â¡ ClickHouse Ã¨Â¡Â¨Ã¦Å¾Â¶Ã¦Å¾â€žÃ¯Â¼Ë†MergeTree Ã¥Â¼â€¢Ã¦â€œÅ½Ã©â‚¬â€°Ã¦â€¹Â©Ã¯Â¼â€°
* Ã§Â¼â€“Ã¥â€ â„¢Ã¥Ë†â€ Ã¦Å¾ÂÃ¦Å¸Â¥Ã¨Â¯Â¢Ã¯Â¼Ë†Ã¨ÂÅ¡Ã¥ÂË†Ã£â‚¬ÂÃ§Âªâ€”Ã¥ÂÂ£Ã¥â€¡Â½Ã¦â€¢Â°Ã£â‚¬ÂÃ¨Â¿Å¾Ã¦Å½Â¥Ã¯Â¼â€°
* Ã¤Â¼ËœÃ¥Å’â€“Ã¦Å¸Â¥Ã¨Â¯Â¢Ã¦â‚¬Â§Ã¨Æ’Â½Ã¯Â¼Ë†Ã¥Ë†â€ Ã¥Å’ÂºÃ¨Â£ÂÃ¥â€°ÂªÃ£â‚¬ÂÃ¦Å â€¢Ã¥Â½Â±Ã£â‚¬ÂÃ§â€°Â©Ã¥Å’â€“Ã¨Â§â€ Ã¥â€ºÂ¾Ã¯Â¼â€°
* Ã¦â€˜â€žÃ¥Ââ€“Ã¥Â¤Â§Ã©â€¡ÂÃ¦â€¢Â°Ã¦ÂÂ®Ã¯Â¼Ë†Ã¦â€°Â¹Ã©â€¡ÂÃ¦Ââ€™Ã¥â€¦Â¥Ã£â‚¬ÂKafka Ã©â€ºâ€ Ã¦Ë†ÂÃ¯Â¼â€°
* Ã¤Â¸ÂºÃ¥Ë†â€ Ã¦Å¾ÂÃ§â€ºÂ®Ã§Å¡â€žÃ¤Â»Å½ PostgreSQL/MySQL Ã¨Â¿ÂÃ§Â§Â»Ã¥Ë†Â° ClickHouse
* Ã¥Â®Å¾Ã§Å½Â°Ã¥Â®Å¾Ã¦â€”Â¶Ã¤Â»ÂªÃ¨Â¡Â¨Ã¦ÂÂ¿Ã¦Ë†â€“Ã¦â€”Â¶Ã©â€”Â´Ã¥ÂºÂÃ¥Ë†â€”Ã¥Ë†â€ Ã¦Å¾Â

## Ã¦Â¦â€šÃ¨Â¿Â°

ClickHouse Ã¦ËœÂ¯Ã¤Â¸â‚¬Ã¤Â¸ÂªÃ§â€Â¨Ã¤ÂºÅ½Ã¥Å“Â¨Ã§ÂºÂ¿Ã¥Ë†â€ Ã¦Å¾ÂÃ¥Â¤â€žÃ§Ââ€  (OLAP) Ã§Å¡â€žÃ¥Ë†â€”Ã¥Â¼ÂÃ¦â€¢Â°Ã¦ÂÂ®Ã¥Âºâ€œÃ§Â®Â¡Ã§Ââ€ Ã§Â³Â»Ã§Â»Å¸ (DBMS)Ã£â‚¬â€šÃ¥Â®Æ’Ã©â€™Ë†Ã¥Â¯Â¹Ã¥Â¤Â§Ã¥Å¾â€¹Ã¦â€¢Â°Ã¦ÂÂ®Ã©â€ºâ€ Ã¤Â¸Å Ã§Å¡â€žÃ¥Â¿Â«Ã©â‚¬Å¸Ã¥Ë†â€ Ã¦Å¾ÂÃ¦Å¸Â¥Ã¨Â¯Â¢Ã¨Â¿â€ºÃ¨Â¡Å’Ã¤Âºâ€ Ã¤Â¼ËœÃ¥Å’â€“Ã£â‚¬â€š

**Ã¥â€¦Â³Ã©â€Â®Ã§â€°Â¹Ã¦â‚¬Â§:**

* Ã¥Ë†â€”Ã¥Â¼ÂÃ¥Â­ËœÃ¥â€šÂ¨
* Ã¦â€¢Â°Ã¦ÂÂ®Ã¥Å½â€¹Ã§Â¼Â©
* Ã¥Â¹Â¶Ã¨Â¡Å’Ã¦Å¸Â¥Ã¨Â¯Â¢Ã¦â€°Â§Ã¨Â¡Å’
* Ã¥Ë†â€ Ã¥Â¸Æ’Ã¥Â¼ÂÃ¦Å¸Â¥Ã¨Â¯Â¢
* Ã¥Â®Å¾Ã¦â€”Â¶Ã¥Ë†â€ Ã¦Å¾Â

## Ã¨Â¡Â¨Ã¨Â®Â¾Ã¨Â®Â¡Ã¦Â¨Â¡Ã¥Â¼Â

### MergeTree Ã¥Â¼â€¢Ã¦â€œÅ½ (Ã¦Å“â‚¬Ã¥Â¸Â¸Ã§â€Â¨)

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

### ReplacingMergeTree (Ã¥Å½Â»Ã©â€¡Â)

```sql
-- For data that may have duplicates (e.g., from multiple sources)
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

### AggregatingMergeTree (Ã©Â¢â€žÃ¨ÂÅ¡Ã¥ÂË†)

```sql
-- For maintaining aggregated metrics
CREATE TABLE market_stats_hourly (
    hour DateTime,
    market_id String,
    total_volume AggregateFunction(sum, UInt64),
    total_trades AggregateFunction(count, UInt32),
    unique_users AggregateFunction(uniq, String)
) ENGINE = AggregatingMergeTree()
PARTITION BY toYYYYMM(hour)
ORDER BY (hour, market_id);

-- Query aggregated data
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

## Ã¦Å¸Â¥Ã¨Â¯Â¢Ã¤Â¼ËœÃ¥Å’â€“Ã¦Â¨Â¡Ã¥Â¼Â

### Ã©Â«ËœÃ¦â€¢Ë†Ã¨Â¿â€¡Ã¦Â»Â¤

```sql
-- Ã¢Å“â€¦ GOOD: Use indexed columns first
SELECT *
FROM markets_analytics
WHERE date >= '2025-01-01'
  AND market_id = 'market-123'
  AND volume > 1000
ORDER BY date DESC
LIMIT 100;

-- Ã¢ÂÅ’ BAD: Filter on non-indexed columns first
SELECT *
FROM markets_analytics
WHERE volume > 1000
  AND market_name LIKE '%election%'
  AND date >= '2025-01-01';
```

### Ã¨ÂÅ¡Ã¥ÂË†

```sql
-- Ã¢Å“â€¦ GOOD: Use ClickHouse-specific aggregation functions
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

-- Ã¢Å“â€¦ Use quantile for percentiles (more efficient than percentile)
SELECT
    quantile(0.50)(trade_size) AS median,
    quantile(0.95)(trade_size) AS p95,
    quantile(0.99)(trade_size) AS p99
FROM trades
WHERE created_at >= now() - INTERVAL 1 HOUR;
```

### Ã§Âªâ€”Ã¥ÂÂ£Ã¥â€¡Â½Ã¦â€¢Â°

```sql
-- Calculate running totals
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

## Ã¦â€¢Â°Ã¦ÂÂ®Ã¦Ââ€™Ã¥â€¦Â¥Ã¦Â¨Â¡Ã¥Â¼Â

### Ã¦â€°Â¹Ã©â€¡ÂÃ¦Ââ€™Ã¥â€¦Â¥ (Ã¦Å½Â¨Ã¨ÂÂ)

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

// Ã¢Å“â€¦ Batch insert (efficient)
async function bulkInsertTrades(trades: Trade[]) {
  const values = trades.map(trade => `(
    '${trade.id}',
    '${trade.market_id}',
    '${trade.user_id}',
    ${trade.amount},
    '${trade.timestamp.toISOString()}'
  )`).join(',')

  await clickhouse.query(`
    INSERT INTO trades (id, market_id, user_id, amount, timestamp)
    VALUES ${values}
  `).toPromise()
}

// Ã¢ÂÅ’ Individual inserts (slow)
async function insertTrade(trade: Trade) {
  // Don't do this in a loop!
  await clickhouse.query(`
    INSERT INTO trades VALUES ('${trade.id}', ...)
  `).toPromise()
}
```

### Ã¦ÂµÂÃ¥Â¼ÂÃ¦Ââ€™Ã¥â€¦Â¥

```typescript
// For continuous data ingestion
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

## Ã§â€°Â©Ã¥Å’â€“Ã¨Â§â€ Ã¥â€ºÂ¾

### Ã¥Â®Å¾Ã¦â€”Â¶Ã¨ÂÅ¡Ã¥ÂË†

```sql
-- Create materialized view for hourly stats
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

-- Query the materialized view
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

## Ã¦â‚¬Â§Ã¨Æ’Â½Ã§â€ºâ€˜Ã¦Å½Â§

### Ã¦Å¸Â¥Ã¨Â¯Â¢Ã¦â‚¬Â§Ã¨Æ’Â½

```sql
-- Check slow queries
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

### Ã¨Â¡Â¨Ã§Â»Å¸Ã¨Â®Â¡Ã¤Â¿Â¡Ã¦ÂÂ¯

```sql
-- Check table sizes
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

## Ã¥Â¸Â¸Ã¨Â§ÂÃ¥Ë†â€ Ã¦Å¾ÂÃ¦Å¸Â¥Ã¨Â¯Â¢

### Ã¦â€”Â¶Ã©â€”Â´Ã¥ÂºÂÃ¥Ë†â€”Ã¥Ë†â€ Ã¦Å¾Â

```sql
-- Daily active users
SELECT
    toDate(timestamp) AS date,
    uniq(user_id) AS daily_active_users
FROM events
WHERE timestamp >= today() - INTERVAL 30 DAY
GROUP BY date
ORDER BY date;

-- Retention analysis
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

### Ã¦Â¼ÂÃ¦â€“â€”Ã¥Ë†â€ Ã¦Å¾Â

```sql
-- Conversion funnel
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

### Ã©ËœÅ¸Ã¥Ë†â€”Ã¥Ë†â€ Ã¦Å¾Â

```sql
-- User cohorts by signup month
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

## Ã¦â€¢Â°Ã¦ÂÂ®Ã¦ÂµÂÃ¦Â°Â´Ã§ÂºÂ¿Ã¦Â¨Â¡Ã¥Â¼Â

### ETL Ã¦Â¨Â¡Ã¥Â¼Â

```typescript
// Extract, Transform, Load
async function etlPipeline() {
  // 1. Extract from source
  const rawData = await extractFromPostgres()

  // 2. Transform
  const transformed = rawData.map(row => ({
    date: new Date(row.created_at).toISOString().split('T')[0],
    market_id: row.market_slug,
    volume: parseFloat(row.total_volume),
    trades: parseInt(row.trade_count)
  }))

  // 3. Load to ClickHouse
  await bulkInsertToClickHouse(transformed)
}

// Run periodically
setInterval(etlPipeline, 60 * 60 * 1000)  // Every hour
```

### Ã¥ÂËœÃ¦â€ºÂ´Ã¦â€¢Â°Ã¦ÂÂ®Ã¦Ââ€¢Ã¨Å½Â· (CDC)

```typescript
// Listen to PostgreSQL changes and sync to ClickHouse
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

## Ã¦Å“â‚¬Ã¤Â½Â³Ã¥Â®Å¾Ã¨Â·Âµ

### 1. Ã¥Ë†â€ Ã¥Å’ÂºÃ§Â­â€“Ã§â€¢Â¥

* Ã¦Å’â€°Ã¦â€”Â¶Ã©â€”Â´Ã¥Ë†â€ Ã¥Å’Âº (Ã©â‚¬Å¡Ã¥Â¸Â¸Ã¦ËœÂ¯Ã¦Å“Ë†Ã¦Ë†â€“Ã¦â€”Â¥)
* Ã©ÂÂ¿Ã¥â€¦ÂÃ¨Â¿â€¡Ã¥Â¤Å¡Ã¥Ë†â€ Ã¥Å’Âº (Ã¥Â½Â±Ã¥â€œÂÃ¦â‚¬Â§Ã¨Æ’Â½)
* Ã¥Â¯Â¹Ã¥Ë†â€ Ã¥Å’ÂºÃ©â€Â®Ã¤Â½Â¿Ã§â€Â¨ DATE Ã§Â±Â»Ã¥Å¾â€¹

### 2. Ã¦Å½â€™Ã¥ÂºÂÃ©â€Â®

* Ã¥Â°â€ Ã¦Å“â‚¬Ã¥Â¸Â¸Ã¨Â¿â€¡Ã¦Â»Â¤Ã§Å¡â€žÃ¥Ë†â€”Ã¦â€Â¾Ã¥Å“Â¨Ã¥â€°ÂÃ©ÂÂ¢
* Ã¨â‚¬Æ’Ã¨â„¢â€˜Ã¥Å¸ÂºÃ¦â€¢Â° (Ã©Â«ËœÃ¥Å¸ÂºÃ¦â€¢Â°Ã¤Â¼ËœÃ¥â€¦Ë†)
* Ã¦Å½â€™Ã¥ÂºÂÃ¥Â½Â±Ã¥â€œÂÃ¥Å½â€¹Ã§Â¼Â©

### 3. Ã¦â€¢Â°Ã¦ÂÂ®Ã§Â±Â»Ã¥Å¾â€¹

* Ã¤Â½Â¿Ã§â€Â¨Ã¦Å“â‚¬Ã¥ÂË†Ã©â‚¬â€šÃ§Å¡â€žÃ¨Â¾Æ’Ã¥Â°ÂÃ§Â±Â»Ã¥Å¾â€¹ (UInt32 Ã¥Â¯Â¹Ã¦Â¯â€ UInt64)
* Ã¥Â¯Â¹Ã©â€¡ÂÃ¥Â¤ÂÃ¥Â­â€”Ã§Â¬Â¦Ã¤Â¸Â²Ã¤Â½Â¿Ã§â€Â¨ LowCardinality
* Ã¥Â¯Â¹Ã¥Ë†â€ Ã§Â±Â»Ã¦â€¢Â°Ã¦ÂÂ®Ã¤Â½Â¿Ã§â€Â¨ Enum

### 4. Ã©ÂÂ¿Ã¥â€¦Â

* SELECT \* (Ã¦Å’â€¡Ã¥Â®Å¡Ã¥Ë†â€”)
* FINAL (Ã¦â€Â¹Ã¤Â¸ÂºÃ¥Å“Â¨Ã¦Å¸Â¥Ã¨Â¯Â¢Ã¥â€°ÂÃ¥ÂË†Ã¥Â¹Â¶Ã¦â€¢Â°Ã¦ÂÂ®)
* Ã¨Â¿â€¡Ã¥Â¤Å¡Ã§Å¡â€ž JOIN (Ã¥Ë†â€ Ã¦Å¾ÂÃ¥Å“ÂºÃ¦â„¢Â¯Ã¤Â¸â€¹Ã¨Â¿â€ºÃ¨Â¡Å’Ã¥ÂÂÃ¨Â§â€žÃ¨Å’Æ’Ã¥Å’â€“)
* Ã©Â¢â€˜Ã§Â¹ÂÃ§Å¡â€žÃ¥Â°ÂÃ¦â€°Â¹Ã©â€¡ÂÃ¦Ââ€™Ã¥â€¦Â¥ (Ã¦â€Â¹Ã¤Â¸ÂºÃ¦â€°Â¹Ã©â€¡Â)

### 5. Ã§â€ºâ€˜Ã¦Å½Â§

* Ã¨Â·Å¸Ã¨Â¸ÂªÃ¦Å¸Â¥Ã¨Â¯Â¢Ã¦â‚¬Â§Ã¨Æ’Â½
* Ã§â€ºâ€˜Ã¦Å½Â§Ã§Â£ÂÃ§â€ºËœÃ¤Â½Â¿Ã§â€Â¨Ã¦Æ’â€¦Ã¥â€ Âµ
* Ã¦Â£â‚¬Ã¦Å¸Â¥Ã¥ÂË†Ã¥Â¹Â¶Ã¦â€œÂÃ¤Â½Å“
* Ã¦Å¸Â¥Ã§Å“â€¹Ã¦â€¦Â¢Ã¦Å¸Â¥Ã¨Â¯Â¢Ã¦â€”Â¥Ã¥Â¿â€”

**Ã¨Â®Â°Ã¤Â½Â**: ClickHouse Ã¦â€œâ€¦Ã©â€¢Â¿Ã¥Ë†â€ Ã¦Å¾ÂÃ¥Â·Â¥Ã¤Â½Å“Ã¨Â´Å¸Ã¨Â½Â½Ã£â‚¬â€šÃ¦Â Â¹Ã¦ÂÂ®Ã¦Å¸Â¥Ã¨Â¯Â¢Ã¦Â¨Â¡Ã¥Â¼ÂÃ¨Â®Â¾Ã¨Â®Â¡Ã¨Â¡Â¨Ã¯Â¼Å’Ã¦â€°Â¹Ã©â€¡ÂÃ¦Ââ€™Ã¥â€¦Â¥Ã¯Â¼Å’Ã¥Â¹Â¶Ã¥Ë†Â©Ã§â€Â¨Ã§â€°Â©Ã¥Å’â€“Ã¨Â§â€ Ã¥â€ºÂ¾Ã¨Â¿â€ºÃ¨Â¡Å’Ã¥Â®Å¾Ã¦â€”Â¶Ã¨ÂÅ¡Ã¥ÂË†Ã£â‚¬â€š
