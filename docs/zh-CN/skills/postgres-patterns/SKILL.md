---
name: postgres-patterns
description: Ã§â€Â¨Ã¤ÂºÅ½Ã¦Å¸Â¥Ã¨Â¯Â¢Ã¤Â¼ËœÃ¥Å’â€“Ã£â‚¬ÂÃ¦Â¨Â¡Ã¥Â¼ÂÃ¨Â®Â¾Ã¨Â®Â¡Ã£â‚¬ÂÃ§Â´Â¢Ã¥Â¼â€¢Ã¥â€™Å’Ã¥Â®â€°Ã¥â€¦Â¨Ã¦â‚¬Â§Ã§Å¡â€žPostgreSQLÃ¦â€¢Â°Ã¦ÂÂ®Ã¥Âºâ€œÃ¦Â¨Â¡Ã¥Â¼ÂÃ£â‚¬â€šÃ¥Å¸ÂºÃ¤ÂºÅ½SupabaseÃ¦Å“â‚¬Ã¤Â½Â³Ã¥Â®Å¾Ã¨Â·ÂµÃ£â‚¬â€š
origin: claude-fulcrum
---

# PostgreSQL Ã¦Â¨Â¡Ã¥Â¼Â

PostgreSQL Ã¦Å“â‚¬Ã¤Â½Â³Ã¥Â®Å¾Ã¨Â·ÂµÃ¥Â¿Â«Ã©â‚¬Å¸Ã¥Ââ€šÃ¨â‚¬Æ’Ã£â‚¬â€šÃ¥Â¦â€šÃ©Å“â‚¬Ã¨Â¯Â¦Ã§Â»â€ Ã¦Å’â€¡Ã¥Â¯Â¼Ã¯Â¼Å’Ã¨Â¯Â·Ã¤Â½Â¿Ã§â€Â¨ `database-reviewer` Ã¦â„¢ÂºÃ¨Æ’Â½Ã¤Â½â€œÃ£â‚¬â€š

## Ã¤Â½â€¢Ã¦â€”Â¶Ã¦Â¿â‚¬Ã¦Â´Â»

* Ã§Â¼â€“Ã¥â€ â„¢ SQL Ã¦Å¸Â¥Ã¨Â¯Â¢Ã¦Ë†â€“Ã¨Â¿ÂÃ§Â§Â»Ã¦â€”Â¶
* Ã¨Â®Â¾Ã¨Â®Â¡Ã¦â€¢Â°Ã¦ÂÂ®Ã¥Âºâ€œÃ¦Â¨Â¡Ã¥Â¼ÂÃ¦â€”Â¶
* Ã¦Å½â€™Ã¦Å¸Â¥Ã¦â€¦Â¢Ã¦Å¸Â¥Ã¨Â¯Â¢Ã¦â€”Â¶
* Ã¥Â®Å¾Ã¦â€“Â½Ã¨Â¡Å’Ã§ÂºÂ§Ã¥Â®â€°Ã¥â€¦Â¨Ã¦â‚¬Â§Ã¦â€”Â¶
* Ã¨Â®Â¾Ã§Â½Â®Ã¨Â¿Å¾Ã¦Å½Â¥Ã¦Â±Â Ã¦â€”Â¶

## Ã¥Â¿Â«Ã©â‚¬Å¸Ã¥Ââ€šÃ¨â‚¬Æ’

### Ã§Â´Â¢Ã¥Â¼â€¢Ã©â‚¬Å¸Ã¦Å¸Â¥Ã¨Â¡Â¨

| Ã¦Å¸Â¥Ã¨Â¯Â¢Ã¦Â¨Â¡Ã¥Â¼Â | Ã§Â´Â¢Ã¥Â¼â€¢Ã§Â±Â»Ã¥Å¾â€¹ | Ã§Â¤ÂºÃ¤Â¾â€¹ |
|--------------|------------|---------|
| `WHERE col = value` | B-treeÃ¯Â¼Ë†Ã©Â»ËœÃ¨Â®Â¤Ã¯Â¼â€° | `CREATE INDEX idx ON t (col)` |
| `WHERE col > value` | B-tree | `CREATE INDEX idx ON t (col)` |
| `WHERE a = x AND b > y` | Ã¥Â¤ÂÃ¥ÂË†Ã§Â´Â¢Ã¥Â¼â€¢ | `CREATE INDEX idx ON t (a, b)` |
| `WHERE jsonb @> '{}'` | GIN | `CREATE INDEX idx ON t USING gin (col)` |
| `WHERE tsv @@ query` | GIN | `CREATE INDEX idx ON t USING gin (col)` |
| Ã¦â€”Â¶Ã©â€”Â´Ã¥ÂºÂÃ¥Ë†â€”Ã¨Å’Æ’Ã¥â€ºÂ´Ã¦Å¸Â¥Ã¨Â¯Â¢ | BRIN | `CREATE INDEX idx ON t USING brin (col)` |

### Ã¦â€¢Â°Ã¦ÂÂ®Ã§Â±Â»Ã¥Å¾â€¹Ã¥Â¿Â«Ã©â‚¬Å¸Ã¥Ââ€šÃ¨â‚¬Æ’

| Ã¤Â½Â¿Ã§â€Â¨Ã¥Å“ÂºÃ¦â„¢Â¯ | Ã¦Â­Â£Ã§Â¡Â®Ã§Â±Â»Ã¥Å¾â€¹ | Ã©ÂÂ¿Ã¥â€¦ÂÃ¤Â½Â¿Ã§â€Â¨ |
|----------|-------------|-------|
| ID | `bigint` | `int`Ã¯Â¼Å’Ã©Å¡ÂÃ¦Å“Âº UUID |
| Ã¥Â­â€”Ã§Â¬Â¦Ã¤Â¸Â² | `text` | `varchar(255)` |
| Ã¦â€”Â¶Ã©â€”Â´Ã¦Ë†Â³ | `timestamptz` | `timestamp` |
| Ã¨Â´Â§Ã¥Â¸Â | `numeric(10,2)` | `float` |
| Ã¦Â â€¡Ã¥Â¿â€”Ã¤Â½Â | `boolean` | `varchar`Ã¯Â¼Å’`int` |

### Ã¥Â¸Â¸Ã¨Â§ÂÃ¦Â¨Â¡Ã¥Â¼Â

**Ã¥Â¤ÂÃ¥ÂË†Ã§Â´Â¢Ã¥Â¼â€¢Ã©Â¡ÂºÃ¥ÂºÂÃ¯Â¼Å¡**

```sql
-- Equality columns first, then range columns
CREATE INDEX idx ON orders (status, created_at);
-- Works for: WHERE status = 'pending' AND created_at > '2024-01-01'
```

**Ã¨Â¦â€ Ã§â€ºâ€“Ã§Â´Â¢Ã¥Â¼â€¢Ã¯Â¼Å¡**

```sql
CREATE INDEX idx ON users (email) INCLUDE (name, created_at);
-- Avoids table lookup for SELECT email, name, created_at
```

**Ã©Æ’Â¨Ã¥Ë†â€ Ã§Â´Â¢Ã¥Â¼â€¢Ã¯Â¼Å¡**

```sql
CREATE INDEX idx ON users (email) WHERE deleted_at IS NULL;
-- Smaller index, only includes active users
```

**RLS Ã§Â­â€“Ã§â€¢Â¥Ã¯Â¼Ë†Ã¤Â¼ËœÃ¥Å’â€“Ã§â€°Ë†Ã¯Â¼â€°Ã¯Â¼Å¡**

```sql
CREATE POLICY policy ON orders
  USING ((SELECT auth.uid()) = user_id);  -- Wrap in SELECT!
```

**UPSERTÃ¯Â¼Å¡**

```sql
INSERT INTO settings (user_id, key, value)
VALUES (123, 'theme', 'dark')
ON CONFLICT (user_id, key)
DO UPDATE SET value = EXCLUDED.value;
```

**Ã¦Â¸Â¸Ã¦Â â€¡Ã¥Ë†â€ Ã©Â¡ÂµÃ¯Â¼Å¡**

```sql
SELECT * FROM products WHERE id > $last_id ORDER BY id LIMIT 20;
-- O(1) vs OFFSET which is O(n)
```

**Ã©ËœÅ¸Ã¥Ë†â€”Ã¥Â¤â€žÃ§Ââ€ Ã¯Â¼Å¡**

```sql
UPDATE jobs SET status = 'processing'
WHERE id = (
  SELECT id FROM jobs WHERE status = 'pending'
  ORDER BY created_at LIMIT 1
  FOR UPDATE SKIP LOCKED
) RETURNING *;
```

### Ã¥ÂÂÃ¦Â¨Â¡Ã¥Â¼ÂÃ¦Â£â‚¬Ã¦Âµâ€¹\*\*

```sql
-- Find unindexed foreign keys
SELECT conrelid::regclass, a.attname
FROM pg_constraint c
JOIN pg_attribute a ON a.attrelid = c.conrelid AND a.attnum = ANY(c.conkey)
WHERE c.contype = 'f'
  AND NOT EXISTS (
    SELECT 1 FROM pg_index i
    WHERE i.indrelid = c.conrelid AND a.attnum = ANY(i.indkey)
  );

-- Find slow queries
SELECT query, mean_exec_time, calls
FROM pg_stat_statements
WHERE mean_exec_time > 100
ORDER BY mean_exec_time DESC;

-- Check table bloat
SELECT relname, n_dead_tup, last_vacuum
FROM pg_stat_user_tables
WHERE n_dead_tup > 1000
ORDER BY n_dead_tup DESC;
```

### Ã©â€¦ÂÃ§Â½Â®Ã¦Â¨Â¡Ã¦ÂÂ¿

```sql
-- Connection limits (adjust for RAM)
ALTER SYSTEM SET max_connections = 100;
ALTER SYSTEM SET work_mem = '8MB';

-- Timeouts
ALTER SYSTEM SET idle_in_transaction_session_timeout = '30s';
ALTER SYSTEM SET statement_timeout = '30s';

-- Monitoring
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- Security defaults
REVOKE ALL ON SCHEMA public FROM public;

SELECT pg_reload_conf();
```

## Ã§â€ºÂ¸Ã¥â€¦Â³

* Ã¦â„¢ÂºÃ¨Æ’Â½Ã¤Â½â€œÃ¯Â¼Å¡`database-reviewer` - Ã¥Â®Å’Ã¦â€¢Â´Ã§Å¡â€žÃ¦â€¢Â°Ã¦ÂÂ®Ã¥Âºâ€œÃ¥Â®Â¡Ã¦Å¸Â¥Ã¥Â·Â¥Ã¤Â½Å“Ã¦ÂµÂ
* Ã¦Å â‚¬Ã¨Æ’Â½Ã¯Â¼Å¡`clickhouse-io` - ClickHouse Ã¥Ë†â€ Ã¦Å¾ÂÃ¦Â¨Â¡Ã¥Â¼Â
* Ã¦Å â‚¬Ã¨Æ’Â½Ã¯Â¼Å¡`backend-patterns` - API Ã¥â€™Å’Ã¥ÂÅ½Ã§Â«Â¯Ã¦Â¨Â¡Ã¥Â¼Â

***

*Ã¥Å¸ÂºÃ¤ÂºÅ½ Supabase Ã¤Â»Â£Ã§Ââ€ Ã¦Å â‚¬Ã¨Æ’Â½Ã¯Â¼Ë†Ã¨â€¡Â´Ã¨Â°Â¢Ã¯Â¼Å¡Supabase Ã¥â€ºÂ¢Ã©ËœÅ¸Ã¯Â¼â€°Ã¯Â¼Ë†MIT Ã¨Â®Â¸Ã¥ÂÂ¯Ã¨Â¯ÂÃ¯Â¼â€°*
