# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Design Guidance

When designing or implementing new UI features, read `DESIGN.md` first and follow it as the primary design reference for visual and interaction decisions. New work should extend the current design language unless the task explicitly calls for a design change. In particular, keep the UI grayscale-only unless the design guidance is explicitly updated.

## Commands

```bash
yarn dev              # Vite dev server
yarn build            # TypeScript check + production build (outputs to dist/)
yarn test             # Run tests once
yarn test:watch       # Run tests in watch mode
yarn lint             # ESLint
yarn lint:fix         # Auto-fix lint issues
yarn fmt:write        # Auto-format with Prettier
yarn storybook        # Storybook dev server (port 6006)
```

To run a single test file:

```bash
yarn test src/util/host.test.ts
```

## Project structure and architecture

See [docs/folder-structure.md](docs/folder-structure.md) for extension entry points, folder layout, data flow, and how the pieces connect.

## Testing

Tests are co-located with source files (`.test.ts` / `.test.tsx`). The test environment is `jsdom` with `@testing-library/react`. Chrome APIs must be mocked — see existing test files for patterns. Mocks are reset after each test automatically via `vitest.setup.ts`.

## Before Finishing Any Task

Always run the following and fix all failures before considering a task done:

```bash
yarn precheck
```
