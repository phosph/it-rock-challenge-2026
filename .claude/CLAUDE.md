
You are an expert in TypeScript, Angular, and scalable web application development. You write functional, maintainable, performant, and accessible code following Angular and TypeScript best practices.

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Angular Best Practices

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default in Angular v20+.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.

## Accessibility Requirements

- It MUST pass all AXE checks.
- It MUST follow all WCAG AA minimums, including focus management, color contrast, and ARIA attributes.

### Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorator
- Prefer inline templates for small components
- Prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead
- When using external templates/styles, use paths relative to the component TS file.

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables
- Do not assume globals like (`new Date()`) are available.

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Use the `inject()` function instead of constructor injection

---

## Project Overview

This is a **basic social network** with mocked services (no real backend). Data is persisted in **LocalStorage**.

### Screens

1. **Feed** — main content feed with posts
2. **Login/Signup** — authentication screen
3. **Publish Content** — create new posts
4. **User Administration** — profile/settings management

### Styling & Design

- **Tailwind CSS** for all styling
- **Responsive design** (mobile-first)
- **Atomic Design** methodology for component organization:
  - `atoms/` — basic UI elements (buttons, inputs, avatars, etc.)
  - `molecules/` — groups of atoms (search bar, form field, etc.)
  - `organisms/` — complex sections (header, post card, etc.)
  - `templates/` — page layouts
  - `pages/` — final screen components

### Storybook

- Storybook is used for component documentation and development
- **Minimum required stories:**
  1. Login form
  2. Post card (publication card)

### Project Structure

- **Interfaces:** All TypeScript interfaces must be in `src/app/interfaces/`
- **Pages:** All page components must be in `src/app/pages/`
- **Store:** Global state store must be in `src/app/store/`

### Authentication

- Simulated **OAuth flow** ("Login with Google") — no real provider connection
- The full OAuth route flow must be mocked: redirect to a fake provider screen, simulate consent, return with a mocked token
- Auth tokens and user session are stored in **LocalStorage**
- All auth services must be mocked (no HTTP calls to external providers)

### Rendering Strategy

- Maximize **SSR** (Server-Side Rendering) usage
- Maximize **Prerender** for all eligible routes
