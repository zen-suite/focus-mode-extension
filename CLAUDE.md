# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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

## Architecture

This is a **Chrome Manifest V3 extension** built with React + TypeScript + Vite, using the `crxjs/vite-plugin` to bundle everything as a Chrome extension. The manifest is defined in `manifest.ts` (TypeScript, not JSON).

### Extension Entry Points

| Entry                              | Role                                                                             |
| ---------------------------------- | -------------------------------------------------------------------------------- |
| `src/popup/`                       | Quick-access popup (block current site, link to options)                         |
| `src/options/`                     | Full settings page (manage blocked sites, break schedules)                       |
| `src/background/service-worker.ts` | Background service worker (manages blocking rules, alarms, break state)          |
| `src/content/main.tsx`             | Content script injected into all pages (detects blocked state, renders overlays) |
| `src/blocked/`                     | Static page shown when a site is blocked                                         |

### Data Flow

Chrome Storage is the single source of truth. `src/storage/StorageInstance.ts` provides a generic typed singleton wrapper around `chrome.storage.local`. `BlockSiteStorage` in `src/domain/block-site/storage.ts` builds on top of it for the blocked sites list.

UI components read state via the `BlockedSitesProvider` React context (`src/providers/`). Cross-context communication (popup → background, content script → background) uses typed Chrome runtime messages defined in `src/util/messages.ts` with `MessageType` enum routing.

### Domain Logic

`src/domain/` contains core business logic decoupled from UI:

- `block-site/` — adding/removing sites via Chrome's `declarativeNetRequest` dynamic rules
- `take-a-break/` — break scheduling types and config

### Website

`website/` contains a static privacy policy page for GitHub Pages. It is not bundled into the extension build. The CI workflow `.github/workflows/deploy-website.yaml` deploys it automatically on pushes to `main` that touch `website/`.

## Testing

Tests are co-located with source files (`.test.ts` / `.test.tsx`). The test environment is `jsdom` with `@testing-library/react`. Chrome APIs must be mocked — see existing test files for patterns. Mocks are reset after each test automatically via `vitest.setup.ts`.

## Before Finishing Any Task

Always run the following and fix all failures before considering a task done:

```bash
yarn fmt:write   # auto-formats — run first so lint sees clean files
yarn lint:fix    # auto-fix lint issues, then manually fix any remaining errors
yarn typecheck  # type-check
yarn test        # all tests must pass
```
