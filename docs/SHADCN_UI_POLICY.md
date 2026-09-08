# shadcn/ui Policy

## Non-Negotiable Rules
- Use `shadcn/ui` components for all UI elements in this app.
- Do not create custom UI components when a `shadcn/ui` component can be used.
- Prefer composing existing `shadcn/ui` components over building new abstractions.

## Implementation Guidance
- Add missing primitives through the `shadcn/ui` component system instead of hand-rolling custom replacements.
- Keep app-specific logic in pages, hooks, or feature modules; keep UI rendering on top of `shadcn/ui` building blocks.
- Continue using existing utilities and styling patterns already established in the project.

