---
name: database-migrations
description: Ã¦â€¢Â°Ã¦ÂÂ®Ã¥Âºâ€œÃ¨Â¿ÂÃ§Â§Â»Ã¦Å“â‚¬Ã¤Â½Â³Ã¥Â®Å¾Ã¨Â·ÂµÃ¯Â¼Å’Ã¦Â¶ÂµÃ§â€ºâ€“Ã¦Â¨Â¡Ã¥Â¼ÂÃ¥ÂËœÃ¦â€ºÂ´Ã£â‚¬ÂÃ¦â€¢Â°Ã¦ÂÂ®Ã¨Â¿ÂÃ§Â§Â»Ã£â‚¬ÂÃ¥â€ºÅ¾Ã¦Â»Å¡Ã¤Â»Â¥Ã¥ÂÅ Ã©â€ºÂ¶Ã¥ÂÅ“Ã¦Å“ÂºÃ©Æ’Â¨Ã§Â½Â²Ã¯Â¼Å’Ã©â‚¬â€šÃ§â€Â¨Ã¤ÂºÅ½PostgreSQLÃ£â‚¬ÂMySQLÃ¥ÂÅ Ã¥Â¸Â¸Ã§â€Â¨ORMÃ¯Â¼Ë†PrismaÃ£â‚¬ÂDrizzleÃ£â‚¬ÂDjangoÃ£â‚¬ÂTypeORMÃ£â‚¬Âgolang-migrateÃ¯Â¼â€°Ã£â‚¬â€š
origin: claude-fulcrum
---

# Ã¦â€¢Â°Ã¦ÂÂ®Ã¥Âºâ€œÃ¨Â¿ÂÃ§Â§Â»Ã¦Â¨Â¡Ã¥Â¼Â

Ã¤Â¸ÂºÃ§â€Å¸Ã¤ÂºÂ§Ã§Â³Â»Ã§Â»Å¸Ã¦ÂÂÃ¤Â¾â€ºÃ¥Â®â€°Ã¥â€¦Â¨Ã£â‚¬ÂÃ¥ÂÂ¯Ã©â‚¬â€ Ã§Å¡â€žÃ¦â€¢Â°Ã¦ÂÂ®Ã¥Âºâ€œÃ¦Â¨Â¡Ã¥Â¼ÂÃ¥ÂËœÃ¦â€ºÂ´Ã£â‚¬â€š

## Ã¤Â½â€¢Ã¦â€”Â¶Ã¦Â¿â‚¬Ã¦Â´Â»

* Ã¥Ë†â€ºÃ¥Â»ÂºÃ¦Ë†â€“Ã¤Â¿Â®Ã¦â€Â¹Ã¦â€¢Â°Ã¦ÂÂ®Ã¥Âºâ€œÃ¨Â¡Â¨
* Ã¦Â·Â»Ã¥Å Â /Ã¥Ë†Â Ã©â„¢Â¤Ã¥Ë†â€”Ã¦Ë†â€“Ã§Â´Â¢Ã¥Â¼â€¢
* Ã¨Â¿ÂÃ¨Â¡Å’Ã¦â€¢Â°Ã¦ÂÂ®Ã¨Â¿ÂÃ§Â§Â»Ã¯Â¼Ë†Ã¥â€ºÅ¾Ã¥Â¡Â«Ã£â‚¬ÂÃ¨Â½Â¬Ã¦ÂÂ¢Ã¯Â¼â€°
* Ã¨Â®Â¡Ã¥Ë†â€™Ã©â€ºÂ¶Ã¥ÂÅ“Ã¦Å“ÂºÃ¦Â¨Â¡Ã¥Â¼ÂÃ¥ÂËœÃ¦â€ºÂ´
* Ã¤Â¸ÂºÃ¦â€“Â°Ã©Â¡Â¹Ã§â€ºÂ®Ã¨Â®Â¾Ã§Â½Â®Ã¨Â¿ÂÃ§Â§Â»Ã¥Â·Â¥Ã¥â€¦Â·

## Ã¦Â Â¸Ã¥Â¿Æ’Ã¥Å½Å¸Ã¥Ë†â„¢

1. **Ã¦Â¯ÂÃ¤Â¸ÂªÃ¥ÂËœÃ¦â€ºÂ´Ã©Æ’Â½Ã¦ËœÂ¯Ã¤Â¸â‚¬Ã¦Â¬Â¡Ã¨Â¿ÂÃ§Â§Â»** Ã¢â‚¬â€ Ã¥Ë†â€¡Ã¥â€¹Â¿Ã¦â€°â€¹Ã¥Å Â¨Ã¦â€ºÂ´Ã¦â€Â¹Ã§â€Å¸Ã¤ÂºÂ§Ã¦â€¢Â°Ã¦ÂÂ®Ã¥Âºâ€œ
2. **Ã¨Â¿ÂÃ§Â§Â»Ã¥Å“Â¨Ã§â€Å¸Ã¤ÂºÂ§Ã§Å½Â¯Ã¥Â¢Æ’Ã¤Â¸Â­Ã¦ËœÂ¯Ã¥ÂÂªÃ¨Â¿â€ºÃ¤Â¸ÂÃ©â‚¬â‚¬Ã§Å¡â€ž** Ã¢â‚¬â€ Ã¥â€ºÅ¾Ã¦Â»Å¡Ã¤Â½Â¿Ã§â€Â¨Ã¦â€“Â°Ã§Å¡â€žÃ¥â€°ÂÃ¥Ââ€˜Ã¨Â¿ÂÃ§Â§Â»
3. **Ã¦Â¨Â¡Ã¥Â¼ÂÃ¨Â¿ÂÃ§Â§Â»Ã¥â€™Å’Ã¦â€¢Â°Ã¦ÂÂ®Ã¨Â¿ÂÃ§Â§Â»Ã¦ËœÂ¯Ã¥Ë†â€ Ã¥Â¼â‚¬Ã§Å¡â€ž** Ã¢â‚¬â€ Ã¥Ë†â€¡Ã¥â€¹Â¿Ã¥Å“Â¨Ã¤Â¸â‚¬Ã¤Â¸ÂªÃ¨Â¿ÂÃ§Â§Â»Ã¤Â¸Â­Ã¦Â·Â·Ã¥ÂË† DDL Ã¥â€™Å’ DML
4. **Ã©â€™Ë†Ã¥Â¯Â¹Ã§â€Å¸Ã¤ÂºÂ§Ã¨Â§â€žÃ¦Â¨Â¡Ã§Å¡â€žÃ¦â€¢Â°Ã¦ÂÂ®Ã¦Âµâ€¹Ã¨Â¯â€¢Ã¨Â¿ÂÃ§Â§Â»** Ã¢â‚¬â€ Ã©â‚¬â€šÃ§â€Â¨Ã¤ÂºÅ½ 100 Ã¨Â¡Å’Ã§Å¡â€žÃ¨Â¿ÂÃ§Â§Â»Ã¥ÂÂ¯Ã¨Æ’Â½Ã¥Å“Â¨ 1000 Ã¤Â¸â€¡Ã¨Â¡Å’Ã¦â€”Â¶Ã©â€ÂÃ¥Â®Å¡
5. **Ã¨Â¿ÂÃ§Â§Â»Ã¤Â¸â‚¬Ã¦â€”Â¦Ã©Æ’Â¨Ã§Â½Â²Ã¥Â°Â±Ã¦ËœÂ¯Ã¤Â¸ÂÃ¥ÂÂ¯Ã¥ÂËœÃ§Å¡â€ž** Ã¢â‚¬â€ Ã¥Ë†â€¡Ã¥â€¹Â¿Ã§Â¼â€“Ã¨Â¾â€˜Ã¥Â·Â²Ã¥Å“Â¨Ã§â€Å¸Ã¤ÂºÂ§Ã¤Â¸Â­Ã¨Â¿ÂÃ¨Â¡Å’Ã§Å¡â€žÃ¨Â¿ÂÃ§Â§Â»

## Ã¨Â¿ÂÃ§Â§Â»Ã¥Â®â€°Ã¥â€¦Â¨Ã¦Â£â‚¬Ã¦Å¸Â¥Ã¦Â¸â€¦Ã¥Ââ€¢

Ã¥Âºâ€Ã§â€Â¨Ã¤Â»Â»Ã¤Â½â€¢Ã¨Â¿ÂÃ§Â§Â»Ã¤Â¹â€¹Ã¥â€°ÂÃ¯Â¼Å¡

* \[ ] Ã¨Â¿ÂÃ§Â§Â»Ã¥ÂÅ’Ã¦â€”Â¶Ã¥Å’â€¦Ã¥ÂÂ« UP Ã¥â€™Å’ DOWNÃ¯Â¼Ë†Ã¦Ë†â€“Ã¦ËœÅ½Ã§Â¡Â®Ã¦Â â€¡Ã¨Â®Â°Ã¤Â¸ÂºÃ¤Â¸ÂÃ¥ÂÂ¯Ã©â‚¬â€ Ã¯Â¼â€°
* \[ ] Ã¥Â¯Â¹Ã¥Â¤Â§Ã¨Â¡Â¨Ã¦Â²Â¡Ã¦Å“â€°Ã¥â€¦Â¨Ã¨Â¡Â¨Ã©â€ÂÃ¯Â¼Ë†Ã¤Â½Â¿Ã§â€Â¨Ã¥Â¹Â¶Ã¥Ââ€˜Ã¦â€œÂÃ¤Â½Å“Ã¯Â¼â€°
* \[ ] Ã¦â€“Â°Ã¥Ë†â€”Ã¦Å“â€°Ã©Â»ËœÃ¨Â®Â¤Ã¥â‚¬Â¼Ã¦Ë†â€“Ã¥ÂÂ¯Ã¤Â¸ÂºÃ§Â©ÂºÃ¯Â¼Ë†Ã¥Ë†â€¡Ã¥â€¹Â¿Ã¦Â·Â»Ã¥Å Â Ã¦Â²Â¡Ã¦Å“â€°Ã©Â»ËœÃ¨Â®Â¤Ã¥â‚¬Â¼Ã§Å¡â€ž NOT NULLÃ¯Â¼â€°
* \[ ] Ã§Â´Â¢Ã¥Â¼â€¢Ã¦ËœÂ¯Ã¥Â¹Â¶Ã¥Ââ€˜Ã¥Ë†â€ºÃ¥Â»ÂºÃ§Å¡â€žÃ¯Â¼Ë†Ã¥Â¯Â¹Ã¤ÂºÅ½Ã§Å½Â°Ã¦Å“â€°Ã¨Â¡Â¨Ã¯Â¼Å’Ã¤Â¸ÂÃ¤Â¸Å½ CREATE TABLE Ã¥â€ â€¦Ã¨Ââ€Ã¥Ë†â€ºÃ¥Â»ÂºÃ¯Â¼â€°
* \[ ] Ã¦â€¢Â°Ã¦ÂÂ®Ã¥â€ºÅ¾Ã¥Â¡Â«Ã¦ËœÂ¯Ã¤Â¸Å½Ã¦Â¨Â¡Ã¥Â¼ÂÃ¥ÂËœÃ¦â€ºÂ´Ã¥Ë†â€ Ã¥Â¼â‚¬Ã§Å¡â€žÃ¨Â¿ÂÃ§Â§Â»
* \[ ] Ã¥Â·Â²Ã©â€™Ë†Ã¥Â¯Â¹Ã§â€Å¸Ã¤ÂºÂ§Ã¦â€¢Â°Ã¦ÂÂ®Ã¥â€°Â¯Ã¦Å“Â¬Ã¨Â¿â€ºÃ¨Â¡Å’Ã¦Âµâ€¹Ã¨Â¯â€¢
* \[ ] Ã¥â€ºÅ¾Ã¦Â»Å¡Ã¨Â®Â¡Ã¥Ë†â€™Ã¥Â·Â²Ã¨Â®Â°Ã¥Â½â€¢

## PostgreSQL Ã¦Â¨Â¡Ã¥Â¼Â

### Ã¥Â®â€°Ã¥â€¦Â¨Ã¥Å“Â°Ã¦Â·Â»Ã¥Å Â Ã¥Ë†â€”

```sql
-- GOOD: Nullable column, no lock
ALTER TABLE users ADD COLUMN avatar_url TEXT;

-- GOOD: Column with default (Postgres 11+ is instant, no rewrite)
ALTER TABLE users ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT true;

-- BAD: NOT NULL without default on existing table (requires full rewrite)
ALTER TABLE users ADD COLUMN role TEXT NOT NULL;
-- This locks the table and rewrites every row
```

### Ã¦â€”Â Ã¥ÂÅ“Ã¦Å“ÂºÃ¦Â·Â»Ã¥Å Â Ã§Â´Â¢Ã¥Â¼â€¢

```sql
-- BAD: Blocks writes on large tables
CREATE INDEX idx_users_email ON users (email);

-- GOOD: Non-blocking, allows concurrent writes
CREATE INDEX CONCURRENTLY idx_users_email ON users (email);

-- Note: CONCURRENTLY cannot run inside a transaction block
-- Most migration tools need special handling for this
```

### Ã©â€¡ÂÃ¥â€˜Â½Ã¥ÂÂÃ¥Ë†â€”Ã¯Â¼Ë†Ã©â€ºÂ¶Ã¥ÂÅ“Ã¦Å“ÂºÃ¯Â¼â€°

Ã¥Ë†â€¡Ã¥â€¹Â¿Ã¥Å“Â¨Ã§â€Å¸Ã¤ÂºÂ§Ã¤Â¸Â­Ã§â€ºÂ´Ã¦Å½Â¥Ã©â€¡ÂÃ¥â€˜Â½Ã¥ÂÂÃ£â‚¬â€šÃ¤Â½Â¿Ã§â€Â¨Ã¦â€°Â©Ã¥Â±â€¢-Ã¦â€Â¶Ã§Â¼Â©Ã¦Â¨Â¡Ã¥Â¼ÂÃ¯Â¼Å¡

```sql
-- Step 1: Add new column (migration 001)
ALTER TABLE users ADD COLUMN display_name TEXT;

-- Step 2: Backfill data (migration 002, data migration)
UPDATE users SET display_name = username WHERE display_name IS NULL;

-- Step 3: Update application code to read/write both columns
-- Deploy application changes

-- Step 4: Stop writing to old column, drop it (migration 003)
ALTER TABLE users DROP COLUMN username;
```

### Ã¥Â®â€°Ã¥â€¦Â¨Ã¥Å“Â°Ã¥Ë†Â Ã©â„¢Â¤Ã¥Ë†â€”

```sql
-- Step 1: Remove all application references to the column
-- Step 2: Deploy application without the column reference
-- Step 3: Drop column in next migration
ALTER TABLE orders DROP COLUMN legacy_status;

-- For Django: use SeparateDatabaseAndState to remove from model
-- without generating DROP COLUMN (then drop in next migration)
```

### Ã¥Â¤Â§Ã¥Å¾â€¹Ã¦â€¢Â°Ã¦ÂÂ®Ã¨Â¿ÂÃ§Â§Â»

```sql
-- BAD: Updates all rows in one transaction (locks table)
UPDATE users SET normalized_email = LOWER(email);

-- GOOD: Batch update with progress
DO $$
DECLARE
  batch_size INT := 10000;
  rows_updated INT;
BEGIN
  LOOP
    UPDATE users
    SET normalized_email = LOWER(email)
    WHERE id IN (
      SELECT id FROM users
      WHERE normalized_email IS NULL
      LIMIT batch_size
      FOR UPDATE SKIP LOCKED
    );
    GET DIAGNOSTICS rows_updated = ROW_COUNT;
    RAISE NOTICE 'Updated % rows', rows_updated;
    EXIT WHEN rows_updated = 0;
    COMMIT;
  END LOOP;
END $$;
```

## Prisma (TypeScript/Node.js)

### Ã¥Â·Â¥Ã¤Â½Å“Ã¦ÂµÂ

```bash
# Create migration from schema changes
npx prisma migrate dev --name add_user_avatar

# Apply pending migrations in production
npx prisma migrate deploy

# Reset database (dev only)
npx prisma migrate reset

# Generate client after schema changes
npx prisma generate
```

### Ã¦Â¨Â¡Ã¥Â¼ÂÃ§Â¤ÂºÃ¤Â¾â€¹

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  avatarUrl String?  @map("avatar_url")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")
  orders    Order[]

  @@map("users")
  @@index([email])
}
```

### Ã¨â€¡ÂªÃ¥Â®Å¡Ã¤Â¹â€° SQL Ã¨Â¿ÂÃ§Â§Â»

Ã¥Â¯Â¹Ã¤ÂºÅ½ Prisma Ã¦â€”Â Ã¦Â³â€¢Ã¨Â¡Â¨Ã¨Â¾Â¾Ã§Å¡â€žÃ¦â€œÂÃ¤Â½Å“Ã¯Â¼Ë†Ã¥Â¹Â¶Ã¥Ââ€˜Ã§Â´Â¢Ã¥Â¼â€¢Ã£â‚¬ÂÃ¦â€¢Â°Ã¦ÂÂ®Ã¥â€ºÅ¾Ã¥Â¡Â«Ã¯Â¼â€°Ã¯Â¼Å¡

```bash
# Create empty migration, then edit the SQL manually
npx prisma migrate dev --create-only --name add_email_index
```

```sql
-- migrations/20240115_add_email_index/migration.sql
-- Prisma cannot generate CONCURRENTLY, so we write it manually
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_email ON users (email);
```

## Drizzle (TypeScript/Node.js)

### Ã¥Â·Â¥Ã¤Â½Å“Ã¦ÂµÂ

```bash
# Generate migration from schema changes
npx drizzle-kit generate

# Apply migrations
npx drizzle-kit migrate

# Push schema directly (dev only, no migration file)
npx drizzle-kit push
```

### Ã¦Â¨Â¡Ã¥Â¼ÂÃ§Â¤ÂºÃ¤Â¾â€¹

```typescript
import { pgTable, text, timestamp, uuid, boolean } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
```

## Django (Python)

### Ã¥Â·Â¥Ã¤Â½Å“Ã¦ÂµÂ

```bash
# Generate migration from model changes
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Show migration status
python manage.py showmigrations

# Generate empty migration for custom SQL
python manage.py makemigrations --empty app_name -n description
```

### Ã¦â€¢Â°Ã¦ÂÂ®Ã¨Â¿ÂÃ§Â§Â»

```python
from django.db import migrations

def backfill_display_names(apps, schema_editor):
    User = apps.get_model("accounts", "User")
    batch_size = 5000
    users = User.objects.filter(display_name="")
    while users.exists():
        batch = list(users[:batch_size])
        for user in batch:
            user.display_name = user.username
        User.objects.bulk_update(batch, ["display_name"], batch_size=batch_size)

def reverse_backfill(apps, schema_editor):
    pass  # Data migration, no reverse needed

class Migration(migrations.Migration):
    dependencies = [("accounts", "0015_add_display_name")]

    operations = [
        migrations.RunPython(backfill_display_names, reverse_backfill),
    ]
```

### SeparateDatabaseAndState

Ã¤Â»Å½ Django Ã¦Â¨Â¡Ã¥Å¾â€¹Ã¤Â¸Â­Ã¥Ë†Â Ã©â„¢Â¤Ã¥Ë†â€”Ã¯Â¼Å’Ã¨â‚¬Å’Ã¤Â¸ÂÃ§Â«â€¹Ã¥ÂÂ³Ã¤Â»Å½Ã¦â€¢Â°Ã¦ÂÂ®Ã¥Âºâ€œÃ¤Â¸Â­Ã¥Ë†Â Ã©â„¢Â¤Ã¯Â¼Å¡

```python
class Migration(migrations.Migration):
    operations = [
        migrations.SeparateDatabaseAndState(
            state_operations=[
                migrations.RemoveField(model_name="user", name="legacy_field"),
            ],
            database_operations=[],  # Don't touch the DB yet
        ),
    ]
```

## golang-migrate (Go)

### Ã¥Â·Â¥Ã¤Â½Å“Ã¦ÂµÂ

```bash
# Create migration pair
migrate create -ext sql -dir migrations -seq add_user_avatar

# Apply all pending migrations
migrate -path migrations -database "$DATABASE_URL" up

# Rollback last migration
migrate -path migrations -database "$DATABASE_URL" down 1

# Force version (fix dirty state)
migrate -path migrations -database "$DATABASE_URL" force VERSION
```

### Ã¨Â¿ÂÃ§Â§Â»Ã¦â€“â€¡Ã¤Â»Â¶

```sql
-- migrations/000003_add_user_avatar.up.sql
ALTER TABLE users ADD COLUMN avatar_url TEXT;
CREATE INDEX CONCURRENTLY idx_users_avatar ON users (avatar_url) WHERE avatar_url IS NOT NULL;

-- migrations/000003_add_user_avatar.down.sql
DROP INDEX IF EXISTS idx_users_avatar;
ALTER TABLE users DROP COLUMN IF EXISTS avatar_url;
```

## Ã©â€ºÂ¶Ã¥ÂÅ“Ã¦Å“ÂºÃ¨Â¿ÂÃ§Â§Â»Ã§Â­â€“Ã§â€¢Â¥

Ã¥Â¯Â¹Ã¤ÂºÅ½Ã¥â€¦Â³Ã©â€Â®Ã§Å¡â€žÃ§â€Å¸Ã¤ÂºÂ§Ã¥ÂËœÃ¦â€ºÂ´Ã¯Â¼Å’Ã©ÂÂµÃ¥Â¾ÂªÃ¦â€°Â©Ã¥Â±â€¢-Ã¦â€Â¶Ã§Â¼Â©Ã¦Â¨Â¡Ã¥Â¼ÂÃ¯Â¼Å¡

```
Phase 1: EXPAND
  - Add new column/table (nullable or with default)
  - Deploy: app writes to BOTH old and new
  - Backfill existing data

Phase 2: MIGRATE
  - Deploy: app reads from NEW, writes to BOTH
  - Verify data consistency

Phase 3: CONTRACT
  - Deploy: app only uses NEW
  - Drop old column/table in separate migration
```

### Ã¦â€”Â¶Ã©â€”Â´Ã§ÂºÂ¿Ã§Â¤ÂºÃ¤Â¾â€¹

```
Day 1: Migration adds new_status column (nullable)
Day 1: Deploy app v2 Ã¢â‚¬â€ writes to both status and new_status
Day 2: Run backfill migration for existing rows
Day 3: Deploy app v3 Ã¢â‚¬â€ reads from new_status only
Day 7: Migration drops old status column
```

## Ã¥ÂÂÃ¦Â¨Â¡Ã¥Â¼Â

| Ã¥ÂÂÃ¦Â¨Â¡Ã¥Â¼Â | Ã¤Â¸ÂºÃ¤Â½â€¢Ã¤Â¼Å¡Ã¥Â¤Â±Ã¨Â´Â¥ | Ã¦â€ºÂ´Ã¥Â¥Â½Ã§Å¡â€žÃ¦â€“Â¹Ã¦Â³â€¢ |
|-------------|-------------|-----------------|
| Ã¥Å“Â¨Ã§â€Å¸Ã¤ÂºÂ§Ã¤Â¸Â­Ã¦â€°â€¹Ã¥Å Â¨Ã¦â€°Â§Ã¨Â¡Å’ SQL | Ã¦Â²Â¡Ã¦Å“â€°Ã¥Â®Â¡Ã¨Â®Â¡Ã¨Â¿Â½Ã¨Â¸ÂªÃ¯Â¼Å’Ã¤Â¸ÂÃ¥ÂÂ¯Ã©â€¡ÂÃ¥Â¤Â | Ã¥Â§â€¹Ã§Â»Ë†Ã¤Â½Â¿Ã§â€Â¨Ã¨Â¿ÂÃ§Â§Â»Ã¦â€“â€¡Ã¤Â»Â¶ |
| Ã§Â¼â€“Ã¨Â¾â€˜Ã¥Â·Â²Ã©Æ’Â¨Ã§Â½Â²Ã§Å¡â€žÃ¨Â¿ÂÃ§Â§Â» | Ã¥Â¯Â¼Ã¨â€¡Â´Ã§Å½Â¯Ã¥Â¢Æ’Ã©â€”Â´Ã¥â€¡ÂºÃ§Å½Â°Ã¥Â·Â®Ã¥Â¼â€š | Ã¦â€Â¹Ã¤Â¸ÂºÃ¥Ë†â€ºÃ¥Â»ÂºÃ¦â€“Â°Ã¨Â¿ÂÃ§Â§Â» |
| Ã¦Â²Â¡Ã¦Å“â€°Ã©Â»ËœÃ¨Â®Â¤Ã¥â‚¬Â¼Ã§Å¡â€ž NOT NULL | Ã©â€ÂÃ¥Â®Å¡Ã¨Â¡Â¨Ã¯Â¼Å’Ã©â€¡ÂÃ¥â€ â„¢Ã¦â€°â‚¬Ã¦Å“â€°Ã¨Â¡Å’ | Ã¦Â·Â»Ã¥Å Â Ã¥ÂÂ¯Ã¤Â¸ÂºÃ§Â©ÂºÃ¥Ë†â€”Ã¯Â¼Å’Ã¥â€ºÅ¾Ã¥Â¡Â«Ã¦â€¢Â°Ã¦ÂÂ®Ã¯Â¼Å’Ã§â€žÂ¶Ã¥ÂÅ½Ã¦Â·Â»Ã¥Å Â Ã§ÂºÂ¦Ã¦ÂÅ¸ |
| Ã¥Å“Â¨Ã¥Â¤Â§Ã¨Â¡Â¨Ã¤Â¸Å Ã¥â€ â€¦Ã¨Ââ€Ã¥Ë†â€ºÃ¥Â»ÂºÃ§Â´Â¢Ã¥Â¼â€¢ | Ã¥Å“Â¨Ã¦Å¾â€žÃ¥Â»ÂºÃ¦Å“Å¸Ã©â€”Â´Ã©ËœÂ»Ã¥Â¡Å¾Ã¥â€ â„¢Ã¥â€¦Â¥ | Ã¤Â½Â¿Ã§â€Â¨ CREATE INDEX CONCURRENTLY |
| Ã¥Å“Â¨Ã¤Â¸â‚¬Ã¤Â¸ÂªÃ¨Â¿ÂÃ§Â§Â»Ã¤Â¸Â­Ã¦Â·Â·Ã¥ÂË†Ã¦Â¨Â¡Ã¥Â¼ÂÃ¥â€™Å’Ã¦â€¢Â°Ã¦ÂÂ®Ã§Å¡â€žÃ¥ÂËœÃ¦â€ºÂ´ | Ã©Å¡Â¾Ã¤Â»Â¥Ã¥â€ºÅ¾Ã¦Â»Å¡Ã¯Â¼Å’Ã¤Âºâ€¹Ã¥Å Â¡Ã¦â€”Â¶Ã©â€”Â´Ã©â€¢Â¿ | Ã¥Ë†â€ Ã¥Â¼â‚¬Ã§Å¡â€žÃ¨Â¿ÂÃ§Â§Â» |
| Ã¥Å“Â¨Ã§Â§Â»Ã©â„¢Â¤Ã¤Â»Â£Ã§Â ÂÃ¤Â¹â€¹Ã¥â€°ÂÃ¥Ë†Â Ã©â„¢Â¤Ã¥Ë†â€” | Ã¥Âºâ€Ã§â€Â¨Ã§Â¨â€¹Ã¥ÂºÂÃ¥Å“Â¨Ã§Â¼ÂºÃ¥Â¤Â±Ã¥Ë†â€”Ã¦â€”Â¶Ã¥â€¡ÂºÃ©â€â„¢ | Ã¥â€¦Ë†Ã§Â§Â»Ã©â„¢Â¤Ã¤Â»Â£Ã§Â ÂÃ¯Â¼Å’Ã¤Â¸â€¹Ã¤Â¸â‚¬Ã¦Â¬Â¡Ã©Æ’Â¨Ã§Â½Â²Ã¥â€ ÂÃ¥Ë†Â Ã©â„¢Â¤Ã¥Ë†â€” |
