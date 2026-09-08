# Database Patterns

## Drizzle Usage
- Keep schemas in `db/schema.ts` and database access through `db/index.ts`.
- Prefer typed Drizzle queries over raw SQL when possible.
- Import query helpers such as `eq` from `drizzle-orm` as needed.

## Safety Rules
- Validate inputs before they are used in queries or mutations.
- Scope data access by the authenticated user when records are user-owned.
- Keep write operations explicit and easy to audit.

