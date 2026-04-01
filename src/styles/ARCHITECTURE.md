# CSS Architecture

## Folder Structure

- `base/`: global design tokens, typography, and element-level defaults.
- `components/`: component-scoped styles grouped by feature area, including package styles under `components/packages/`.
- `pages/`: page style entry files that compose relevant component CSS.

## Import Rules

- `src/index.css` should only import from `styles/base/`.
- Page components should import one page entry from `styles/pages/`.
- Page entries should compose styles via `@import` from `styles/components/` and feature folders.
- Avoid importing component styles directly in `App.jsx`.

## Naming Conventions

- Use semantic class names tied to component intent (example: `.bookingPageHeaderInner`).
- Keep camelCase for existing class naming consistency.
- Keep one concern per file:
  - Structure/layout rules in layout files.
  - Visual component rules in component files.
  - Breakpoints in `responsive.css` when shared across a feature.

## Canonical Paths

Legacy wrapper files were removed. All style imports should use canonical paths under `styles/base/`, `styles/components/`, and `styles/pages/`.
