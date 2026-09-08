# Component Patterns

## General Rules
- Use `shadcn/ui` components for all UI elements.
- Do not introduce custom UI components when an existing `shadcn/ui` primitive or pattern can be used.
- Compose from `components/ui/*` and keep feature logic outside shared UI primitives.

## Client / Server Split
- Default to Server Components.
- Mark components with `"use client"` only when they handle events, state, effects, or browser APIs.
- Pass serialized data into client components instead of moving data fetching client-side without a clear reason.

