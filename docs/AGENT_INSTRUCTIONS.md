# Agent Instructions

## React / Next.js Conventions
- Use App Router conventions in `app/`.
- Prefer Server Components by default; add `"use client"` only for interactivity or browser-only APIs.
- Keep pages and layouts focused on composition, data loading, and routing.
- Reuse existing utilities and project aliases such as `@/components`, `@/lib`, and `@/db`.

## TypeScript Rules
- Keep strict typing enabled.
- Avoid `any`; prefer explicit types, inferred return types, and narrow unions.
- Validate untrusted input before it reaches business logic.

