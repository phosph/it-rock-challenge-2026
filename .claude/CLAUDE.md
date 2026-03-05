
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
- Every component MUST have styles applied to `:host`, as it is the actual HTML container of the component's content.

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
- Use the `inject()` function instead of constructor injection
- All services follow this pattern:
  - **Interface**: `src/app/interfaces/<name>-service.interface.ts` — async method contracts
  - **Mock implementation**: `src/app/services/<name>/<name>.service.ts` — class `Mock<Name>ServiceImpl implements <Name>Service`, decorated with `@Injectable()` (no `providedIn`), uses a private `#mockedDb` Map as in-memory DB, returns `structuredClone()` copies
  - **Mock data**: `src/app/services/<name>/<name>s.mock.json`
  - **Token + provider factory**: `src/app/services/<name>/index.ts` — exports `InjectionToken<Service>` and `provideMock<Name>Service(): Provider` factory using `useClass`
  - **Registration**: All service providers are registered in `src/app/app.config.ts`

---

## Requirements

Full project requirements are in [`ENUNCIADO.md`](../ENUNCIADO.md).

## Project Overview

This is a **basic social network** with mocked services (no real backend). Data is persisted in **LocalStorage**.

### Screens

1. **Feed** — main content feed with posts
2. **Login/Signup** — authentication screen
3. **Publish Content** — create new posts
4. **Post Detail** — single post view with comments
5. **User Administration** — profile/settings management (stub)

### Styling & Design

- **Tailwind CSS v4** for all styling
- In Tailwind v4, use `@utility` (not `@layer components`) to define custom utility classes that need to be usable with `@apply` from component CSS files via `@reference`.
- **Responsive design** (mobile-first)
- **Google Material Symbols** (Outlined, variable font via CDN) for icons; brand icons use inline SVGs
- **Inter** font (self-hosted)
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

### Current Project Structure

```
src/app/
├── components/
│   ├── atoms/
│   │   ├── article-preview/       # Article link preview
│   │   ├── avatar/                # User avatar
│   │   ├── event-preview/         # Event preview card
│   │   ├── form-field/            # Reusable form field wrapper
│   │   ├── image-preview/         # Image preview
│   │   ├── post-stats/            # Post stats (likes, comments count)
│   │   └── quote-block/           # Quote/repost block
│   ├── molecules/
│   │   ├── comment-input/         # Comment text input
│   │   ├── comment-item/          # Single comment display
│   │   ├── post-header/           # Post author + timestamp header
│   │   └── user-profile/          # User profile card (sidebar)
│   ├── organisms/
│   │   ├── app-header/            # Top navigation bar
│   │   └── post-card/             # Full post card (feed item)
│   └── templates/
│       └── feed-layout/           # Feed page layout wrapper
├── guards/
│   ├── auth.guard.ts              # Redirects unauthenticated users to /auth
│   └── guest.guard.ts             # Redirects authenticated users to /feed
├── interfaces/
│   ├── auth-error.ts              # AuthError class + AuthErrorCode enum
│   ├── auth-service.interface.ts  # AuthService contract
│   ├── comment.interface.ts       # Comment + CommentInput interfaces
│   ├── feed-error.ts              # FeedError class + FeedErrorCode enum
│   ├── feed-service.interface.ts  # FeedService contract
│   ├── post.interface.ts          # Post interface
│   └── user.interface.ts          # User interface
├── pages/
│   ├── auth/                      # Login/signup page
│   ├── feed/                      # Main feed page (parent route)
│   ├── oauth-callback/            # OAuth callback handler
│   ├── oauth-consent/             # Mock OAuth consent screen
│   ├── post-detail/               # Single post + comments (child of feed)
│   ├── profile/                   # User profile page (stub)
│   └── publish/                   # Create new post (child of feed)
├── pipes/
│   └── time-ago.pipe.ts           # Relative time formatting ("5 min ago")
├── services/
│   ├── auth/
│   │   ├── auth.service.ts        # MockAuthServiceImpl
│   │   ├── users.mock.json        # Seed users
│   │   └── index.ts               # AUTH_SERVICE token + provider factory
│   └── feed/
│       ├── feed.service.ts        # MockFeedServiceImpl
│       ├── feeds.mock.json        # Seed posts + comments
│       └── index.ts               # FEED_SERVICE token + provider factory
├── store/
│   ├── auth.store.ts              # Auth state (@ngrx/signals)
│   └── feed.store.ts              # Feed state (@ngrx/signals)
├── app.ts                         # Root component
├── app.html                       # Root template
├── app.config.ts                  # App providers (router, hydration, services)
├── app.config.server.ts           # Server-side config
├── app.routes.ts                  # Route definitions
└── app.routes.server.ts           # SSR/prerender route config
```

### Routes

| Path                       | Component        | Guard   | Notes                          |
|----------------------------|------------------|---------|--------------------------------|
| `/`                        | —                | —       | Redirects to `/feed`           |
| `/auth`                    | AuthPage         | guest   | Login/signup                   |
| `/auth/oauth/:provider`   | OAuthConsentPage | guest   | Mock OAuth consent screen      |
| `/auth/callback`          | OAuthCallbackPage| guest   | Processes mock OAuth token     |
| `/feed`                    | FeedPage         | auth    | Main feed                      |
| `/feed/publish`           | PublishPage      | auth    | Create post (child route)      |
| `/feed/:postId`           | PostDetailPage   | auth    | Post detail + comments (child) |
| `/profile`                | ProfilePage      | auth    | User profile (stub)            |

### Authentication

- Simulated **OAuth flow** ("Login with Google") — no real provider connection
- The full OAuth route flow must be mocked: redirect to a fake provider screen, simulate consent, return with a mocked token
- Auth tokens and user session are stored in **LocalStorage**
- All auth services must be mocked (no HTTP calls to external providers)

### State Management

- **`@ngrx/signals`** for global state (auth store + feed store)
- Signals for local component state

### Rendering Strategy

- Maximize **SSR** (Server-Side Rendering) usage
- Maximize **Prerender** for all eligible routes
- **No real backend** — all data lives in LocalStorage (client only). Anything that depends on state/memory/persistence must render on the client, not during SSR.

#### Client-only data pattern

Since there is no backend, all data-dependent content **must** load exclusively in the browser. Apply this pattern in page components:

1. **Guard data loading with `isPlatformBrowser`** in `ngOnInit()`:
   ```typescript
   private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

   ngOnInit(): void {
     if (!this.isBrowser) return;
     this.store.loadData();
   }
   ```

2. **Manage loading state locally** with a `signal()` in the component (not in the store). Wrap the promise with `from()` and pipe through `takeUntilDestroyed(this.destroyRef)` to auto-cancel if the component is destroyed before completion:
   ```typescript
   readonly destroyRef = inject(DestroyRef);
   readonly loading = signal(true);

   ngOnInit(): void {
     if (!postId || !this.isBrowser) return;
     from(this.store.loadPost(postId)).pipe(
       takeUntilDestroyed(this.destroyRef),
     ).subscribe({
       complete: () => this.loading.set(false),
       error: () => this.handleError()
     });
   }
   ```

3. **Wrap data-dependent template blocks** with `@defer (on immediate)` to skip server rendering while still rendering immediately on the client:
   ```html
   @defer (on immediate) {
     @for (item of items(); track item.id) { ... }
   }
   ```

4. **Store methods must NOT auto-load data** in `withHooks({ onInit })`. Data loading is always triggered from the page component's `ngOnInit()` behind the `isPlatformBrowser` guard.

5. **Show a loading indicator** while data loads (spinner, skeleton, etc.) using the local `loading()` signal and `@else if (loading())` blocks.
