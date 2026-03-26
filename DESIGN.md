# DESIGN.md

This document captures the current application design philosophy for the Focus Mode extension. It should guide new UI work so new features feel consistent with the existing product instead of introducing a separate visual language.

## Product Direction

The extension is designed to reduce distraction with minimal friction. The UI should feel calm, direct, and functional. It is a utility product first, not a decorative interface.

## Core Principles

### 1. Prioritize focus over feature noise

- Keep screens task-oriented and easy to scan.
- Prefer a small number of clear actions over dense control surfaces.
- Avoid decorative elements that compete with the blocking or break-management flow.

### 2. Keep interactions direct

- Primary actions should be obvious and use plain language.
- Users should understand what will happen before clicking.
- Prefer simple flows over multi-step configuration when the same goal can be achieved faster.

### 3. Stay visually restrained

- Follow the existing dark theme as the default application tone.
- Use a grayscale-only palette across the product UI. Colors should stay within black, white, and gray values.
- Do not introduce accent colors for buttons, emphasis, charts, badges, or decorative details.
- Allow restrained semantic color in status and feedback surfaces when it materially improves clarity, such as success, warning, and error banners or alerts.
- Keep semantic color use narrow and purposeful. It should communicate state, not become a general accent system.
- Let contrast come from layout, typography, borders, opacity, and state treatment instead of color variation.
- Treat strong visuals as rare emphasis. The blocked page background is the exception, not the default pattern for the rest of the product.

### 4. Reuse Material UI patterns

- Prefer existing Material UI components and the shared app theme before building custom UI primitives.
- Keep component styling light and local. Use MUI spacing, borders, typography, and states consistently with the current codebase.
- Preserve existing button behavior, typography casing, and list or panel patterns unless there is a clear product reason to change them.

### 5. Make state and status clear

- Blocking state, break state, and disabled state should be immediately understandable.
- Use layout and copy to communicate state clearly before introducing additional visuals.
- Empty, loading, and already-configured states should feel intentional and not ambiguous.

### 6. Design for compact extension surfaces

- Popup UI should remain compact and action-oriented.
- Options UI can be roomier, but should still favor a simple settings layout with clear sections.
- Content-script UI should be lightweight, layered safely above host pages, and avoid unnecessary visual complexity.

## Current Visual Characteristics

- Dark mode is the default application theme.
- The product theme should remain grayscale-first, with limited semantic color exceptions for status feedback.
- Typography uses Roboto through Material UI.
- Buttons use Material UI defaults with no uppercase transformation.
- Layouts are simple, panel-based, and rely on spacing and borders more than custom graphics.
- Copy is short, literal, and action-focused.

## Guidance For New Features

- Start from existing patterns in `src/popup/`, `src/options/`, `src/content/`, and `src/providers/AppThemeProvider.tsx`.
- Keep all new UI colors inside the grayscale palette for general product UI, including hover, selected, and disabled states.
- Semantic colors may be used for success, warning, and error status messaging when they improve recognition speed and reduce ambiguity.
- When semantic colors are used, prefer muted, dark-theme-friendly tones and keep the surrounding layout, borders, and typography aligned with the grayscale system.
- Reuse existing layout structure, spacing rhythm, and MUI component choices before adding new patterns.
- If a feature needs a stronger visual treatment, keep it purposeful and tied to product meaning such as blocked state, urgency, or time-sensitive break actions.
- If a new feature requires a meaningful shift in design direction, update this file so the change becomes an explicit shared standard.
