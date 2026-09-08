<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

---

# GCPUdemy Link Shortener - Agent Instructions

## 📖 Project Documentation

**Comprehensive coding standards and patterns are available in the `/docs` directory.**
ALWAYS refer to the relevant .md file BEOFRE generating any code.

### Quick Links

| Document | Purpose |
|----------|---------|
| [AUTH_CLERK_POLICY.md](./docs/AUTH_CLERK_POLICY.md) | Required Clerk-only auth and route protection behavior |
| [SHADCN_UI_POLICY.md](./docs/SHADCN_UI_POLICY.md) | Required UI rule: use shadcn/ui components only; do not introduce custom UI components |

---

## ⚡ Quick Reference

### Technology Stack
- **Framework**: Next.js 16.3.3 (App Router)
- **Language**: TypeScript 5 (strict mode)
- **Auth**: Clerk
- **Database**: Neon PostgreSQL + Drizzle ORM
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **UI**: Base UI + Lucide Icons

### Project Structure
```
linkshortenerproject/
├── app/              # Next.js App Router (pages, layouts, API routes)
├── components/       # React components
│   └── ui/          # shadcn/ui components
├── db/              # Database schemas and client
│   ├── schema.ts   # Drizzle ORM schemas
│   └── index.ts    # DB connection
├── lib/             # Utility functions
├── docs/            # 📚 Agent instructions and patterns
└── public/          # Static assets
```

### Core Principles
1. **Type Safety First** - Always use TypeScript with strict mode
2. **Server Components by Default** - Use "use client" only when necessary
3. **Security Always** - Authenticate, validate, verify ownership
4. **Performance Matters** - Optimize queries, pagination, caching

---

## 🚀 Common Tasks

### Creating a New Page
```typescript
// app/[feature]/page.tsx
export default async function FeaturePage() {
  // Server Component - can fetch data directly
  const data = await fetchData();
  return <div>{/* Render */}</div>;
}
```
👉 **Details**: [AGENT_INSTRUCTIONS.md](./docs/AGENT_INSTRUCTIONS.md#react--nextjs-conventions)

### Creating a New Component
```typescript
// components/feature/component.tsx
"use client"; // Only if interactive

export function Component() {
  return <div>{/* Component code */}</div>;
}
```
👉 **Details**: [COMPONENT_PATTERNS.md](./docs/COMPONENT_PATTERNS.md)

### Creating an API Route
```typescript
// app/api/[resource]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // Handle request
}
```
👉 **Details**: [API_AUTHENTICATION.md](./docs/API_AUTHENTICATION.md)

### Database Query
```typescript
import { db } from "@/db";
import { links } from "@/db/schema";
import { eq } from "drizzle-orm";

const link = await db.select().from(links).where(eq(links.id, id));
```
👉 **Details**: [DATABASE_PATTERNS.md](./docs/DATABASE_PATTERNS.md)

---

## 🎯 Before You Code

1. **🛑 MANDATORY: Read the relevant documentation** in `/docs` for your task BEFORE writing any code — this is not optional
2. **Check existing patterns** in the codebase
3. **Follow TypeScript strict mode** - no `any` types
4. **Authenticate protected routes** - use Clerk's `auth()`
5. **Validate all inputs** - use Zod schemas
6. **Test your changes** - ensure nothing breaks
7. **Follow auth routing policy** - enforce `docs/AUTH_CLERK_POLICY.md`
8. **Follow the UI component policy** - enforce `docs/SHADCN_UI_POLICY.md` and use shadcn/ui for all UI elements

---

## 📚 Full Documentation

For comprehensive guides, code examples, and best practices:

**➡️ Start with [docs/README.md](./docs/README.md)**

---

**Last Updated**: 2026-08-31  
**Next.js Version**: 16.3.3
