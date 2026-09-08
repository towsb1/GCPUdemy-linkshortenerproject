# API Authentication

## Required Rules
- Protect non-public API routes with Clerk.
- Use `auth()` from `@clerk/nextjs/server` to resolve the current user.
- Return `401` for unauthenticated requests and `403` for ownership or permission failures.

## Request Handling
- Validate request params and body data before performing mutations.
- Keep route handlers small and move reusable logic into `lib/` or feature modules when needed.
- Return structured JSON responses and appropriate HTTP status codes.

