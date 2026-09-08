# Clerk Auth and Route Protection Policy

## Non-Negotiable Rules
- Clerk is the only authentication system allowed in this app.
- Do not add or use any other auth providers, session systems, or custom auth flows.

## Required Route Behavior
- `/dashboard` is a protected route and must require an authenticated user.
- If an authenticated user visits `/`, redirect them to `/dashboard`.

## Sign-In and Sign-Up UX
- Sign in and sign up must always launch using Clerk modals.
- Do not introduce standalone custom sign-in or sign-up pages/forms outside Clerk modal flows.

