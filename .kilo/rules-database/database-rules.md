# Database Mode Rules

## Schema Design
- Use proper normalization (3NF minimum)
- Always define primary keys and foreign keys
- Add indexes for frequently queried columns
- Use appropriate data types (don't store numbers as text)
- Add constraints (NOT NULL, UNIQUE, CHECK) at database level

## Query Optimization
- Always use EXPLAIN ANALYZE for complex queries
- Prefer JOINs over subqueries when possible
- Use parameterized queries ALWAYS (never string concatenation)
- Add pagination for list endpoints
- Use connection pooling (PgBouncer/HikariCP)

## Migration Safety
- Never drop columns in production without deprecation period
- Always make migrations reversible
- Test migrations on a copy of production data
- Use transactions for multi-step migrations
- Verify no data loss after each migration

## Security
- Enable Row Level Security (RLS) policies
- Use least-privilege database roles
- Audit all DDL changes
- Encrypt sensitive columns at rest
