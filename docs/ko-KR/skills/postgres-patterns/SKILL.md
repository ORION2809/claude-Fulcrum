---
name: postgres-patterns
description: Ã¬Â¿Â¼Ã«Â¦Â¬ Ã¬ÂµÅ“Ã¬Â ÂÃ­â„¢â€, Ã¬Å Â¤Ã­â€šÂ¤Ã«Â§Ë† Ã¬â€žÂ¤ÃªÂ³â€ž, Ã¬ÂÂ¸Ã«ÂÂ±Ã¬â€¹Â±, Ã«Â³Â´Ã¬â€¢Ë†Ã¬Ââ€ž Ã¬Å“â€žÃ­â€¢Å“ PostgreSQL Ã«ÂÂ°Ã¬ÂÂ´Ã­â€žÂ°Ã«Â²Â Ã¬ÂÂ´Ã¬Å Â¤ Ã­Å’Â¨Ã­â€žÂ´. Supabase Ã«ÂªÂ¨Ã«Â²â€ Ã¬â€šÂ¬Ã«Â¡â‚¬ ÃªÂ¸Â°Ã«Â°Ëœ.
origin: claude-fulcrum
---

# PostgreSQL Ã­Å’Â¨Ã­â€žÂ´

PostgreSQL Ã«ÂªÂ¨Ã«Â²â€ Ã¬â€šÂ¬Ã«Â¡â‚¬ Ã«Â¹Â Ã«Â¥Â¸ Ã¬Â°Â¸Ã¬Â¡Â°. Ã¬Å¾ÂÃ¬â€žÂ¸Ã­â€¢Å“ ÃªÂ°â‚¬Ã¬ÂÂ´Ã«â€œÅ“Ã«Å â€ `database-reviewer` Ã¬â€”ÂÃ¬ÂÂ´Ã¬Â â€žÃ­Å Â¸Ã«Â¥Â¼ Ã¬â€šÂ¬Ã¬Å¡Â©Ã­â€¢ËœÃ¬â€žÂ¸Ã¬Å¡â€.

## Ã­â„¢Å“Ã¬â€žÂ±Ã­â„¢â€ Ã¬â€¹Å“Ã¬Â Â

- SQL Ã¬Â¿Â¼Ã«Â¦Â¬ Ã«ËœÂÃ«Å â€ Ã«Â§Ë†Ã¬ÂÂ´ÃªÂ·Â¸Ã«Â Ë†Ã¬ÂÂ´Ã¬â€¦ËœÃ¬Ââ€ž Ã¬Å¾â€˜Ã¬â€žÂ±Ã­â€¢Â  Ã«â€¢Å’
- Ã«ÂÂ°Ã¬ÂÂ´Ã­â€žÂ°Ã«Â²Â Ã¬ÂÂ´Ã¬Å Â¤ Ã¬Å Â¤Ã­â€šÂ¤Ã«Â§Ë†Ã«Â¥Â¼ Ã¬â€žÂ¤ÃªÂ³â€žÃ­â€¢Â  Ã«â€¢Å’
- Ã«Å ÂÃ«Â¦Â° Ã¬Â¿Â¼Ã«Â¦Â¬Ã«Â¥Â¼ Ã«Â¬Â¸Ã¬Â Å“ Ã­â€¢Â´ÃªÂ²Â°Ã­â€¢Â  Ã«â€¢Å’
- Row Level SecurityÃ«Â¥Â¼ ÃªÂµÂ¬Ã­Ëœâ€žÃ­â€¢Â  Ã«â€¢Å’
- Ã¬Â»Â¤Ã«â€žÂ¥Ã¬â€¦Ëœ Ã­â€™â‚¬Ã«Â§ÂÃ¬Ââ€ž Ã¬â€žÂ¤Ã¬Â â€¢Ã­â€¢Â  Ã«â€¢Å’

## Ã«Â¹Â Ã«Â¥Â¸ Ã¬Â°Â¸Ã¬Â¡Â°

### Ã¬ÂÂ¸Ã«ÂÂ±Ã¬Å Â¤ Ã¬Â¹ËœÃ­Å Â¸ Ã¬â€¹Å“Ã­Å Â¸

| Ã¬Â¿Â¼Ã«Â¦Â¬ Ã­Å’Â¨Ã­â€žÂ´ | Ã¬ÂÂ¸Ã«ÂÂ±Ã¬Å Â¤ Ã¬Å“Â Ã­Ëœâ€¢ | Ã¬ËœË†Ã¬â€¹Å“ |
|--------------|------------|---------|
| `WHERE col = value` | B-tree (ÃªÂ¸Â°Ã«Â³Â¸ÃªÂ°â€™) | `CREATE INDEX idx ON t (col)` |
| `WHERE col > value` | B-tree | `CREATE INDEX idx ON t (col)` |
| `WHERE a = x AND b > y` | Composite | `CREATE INDEX idx ON t (a, b)` |
| `WHERE jsonb @> '{}'` | GIN | `CREATE INDEX idx ON t USING gin (col)` |
| `WHERE tsv @@ query` | GIN | `CREATE INDEX idx ON t USING gin (col)` |
| Ã¬â€¹Å“ÃªÂ³â€žÃ¬â€”Â´ Ã«Â²â€Ã¬Å“â€ž | BRIN | `CREATE INDEX idx ON t USING brin (col)` |

### Ã«ÂÂ°Ã¬ÂÂ´Ã­â€žÂ° Ã­Æ’â‚¬Ã¬Å¾â€¦ Ã«Â¹Â Ã«Â¥Â¸ Ã¬Â°Â¸Ã¬Â¡Â°

| Ã¬â€šÂ¬Ã¬Å¡Â© Ã¬â€šÂ¬Ã«Â¡â‚¬ | Ã¬ËœÂ¬Ã«Â°â€Ã«Â¥Â¸ Ã­Æ’â‚¬Ã¬Å¾â€¦ | Ã¬Â§â‚¬Ã¬â€“â€˜ |
|----------|-------------|-------|
| ID | `bigint` | `int`, random UUID |
| Ã«Â¬Â¸Ã¬Å¾ÂÃ¬â€”Â´ | `text` | `varchar(255)` |
| Ã­Æ’â‚¬Ã¬Å¾â€žÃ¬Å Â¤Ã­Æ’Â¬Ã­â€â€ž | `timestamptz` | `timestamp` |
| ÃªÂ¸Ë†Ã¬â€¢Â¡ | `numeric(10,2)` | `float` |
| Ã­â€Å’Ã«Å¾ËœÃªÂ·Â¸ | `boolean` | `varchar`, `int` |

### Ã¬ÂÂ¼Ã«Â°Ëœ Ã­Å’Â¨Ã­â€žÂ´

**Ã«Â³ÂµÃ­â€¢Â© Ã¬ÂÂ¸Ã«ÂÂ±Ã¬Å Â¤ Ã¬Ë†Å“Ã¬â€žÅ“:**
```sql
-- Equality columns first, then range columns
CREATE INDEX idx ON orders (status, created_at);
-- Works for: WHERE status = 'pending' AND created_at > '2024-01-01'
```

**Ã¬Â»Â¤Ã«Â²â€žÃ«Â§Â Ã¬ÂÂ¸Ã«ÂÂ±Ã¬Å Â¤:**
```sql
CREATE INDEX idx ON users (email) INCLUDE (name, created_at);
-- Avoids table lookup for SELECT email, name, created_at
```

**Ã«Â¶â‚¬Ã«Â¶â€ž Ã¬ÂÂ¸Ã«ÂÂ±Ã¬Å Â¤:**
```sql
CREATE INDEX idx ON users (email) WHERE deleted_at IS NULL;
-- Smaller index, only includes active users
```

**RLS Ã¬Â â€¢Ã¬Â±â€¦ (Ã¬ÂµÅ“Ã¬Â ÂÃ­â„¢â€):**
```sql
CREATE POLICY policy ON orders
  USING ((SELECT auth.uid()) = user_id);  -- Wrap in SELECT!
```

**UPSERT:**
```sql
INSERT INTO settings (user_id, key, value)
VALUES (123, 'theme', 'dark')
ON CONFLICT (user_id, key)
DO UPDATE SET value = EXCLUDED.value;
```

**Ã¬Â»Â¤Ã¬â€žÅ“ Ã­Å½ËœÃ¬ÂÂ´Ã¬Â§â‚¬Ã«â€žÂ¤Ã¬ÂÂ´Ã¬â€¦Ëœ:**
```sql
SELECT * FROM products WHERE id > $last_id ORDER BY id LIMIT 20;
-- O(1) vs OFFSET which is O(n)
```

**Ã­ÂÂ Ã¬Â²ËœÃ«Â¦Â¬:**
```sql
UPDATE jobs SET status = 'processing'
WHERE id = (
  SELECT id FROM jobs WHERE status = 'pending'
  ORDER BY created_at LIMIT 1
  FOR UPDATE SKIP LOCKED
) RETURNING *;
```

### Ã¬â€¢Ë†Ã­â€¹Â°Ã­Å’Â¨Ã­â€žÂ´ ÃªÂ°ÂÃ¬Â§â‚¬

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

### ÃªÂµÂ¬Ã¬â€žÂ± Ã­â€¦Å“Ã­â€Å’Ã«Â¦Â¿

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

## ÃªÂ´â‚¬Ã«Â Â¨ Ã­â€¢Â­Ã«ÂªÂ©

- Ã¬â€”ÂÃ¬ÂÂ´Ã¬Â â€žÃ­Å Â¸: `database-reviewer` - Ã¬Â â€žÃ¬Â²Â´ Ã«ÂÂ°Ã¬ÂÂ´Ã­â€žÂ°Ã«Â²Â Ã¬ÂÂ´Ã¬Å Â¤ Ã«Â¦Â¬Ã«Â·Â° Ã¬â€ºÅ’Ã­ÂÂ¬Ã­â€Å’Ã«Â¡Å“Ã¬Å¡Â°
- Ã¬Å Â¤Ã­â€šÂ¬: `clickhouse-io` - ClickHouse Ã«Â¶â€žÃ¬â€žÂ Ã­Å’Â¨Ã­â€žÂ´
- Ã¬Å Â¤Ã­â€šÂ¬: `backend-patterns` - API Ã«Â°Â Ã«Â°Â±Ã¬â€”â€Ã«â€œÅ“ Ã­Å’Â¨Ã­â€žÂ´

---

*Supabase Agent Skills ÃªÂ¸Â°Ã«Â°Ëœ (Ã­ÂÂ¬Ã«Â Ë†Ã«â€Â§: Supabase Ã­Å’â‚¬) (MIT License)*
