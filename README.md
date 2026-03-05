# IT Rock Challenge — Social Network

> **Live demo:** [https://phosph.github.io/it-rock-challenge-2026/](https://phosph.github.io/it-rock-challenge-2026/)

A basic social network built with **Angular 21**, **Tailwind CSS 4**, and **@ngrx/signals**. All data is mocked (no real backend) and persisted in **LocalStorage**.

## Features

- **OAuth login** — simulated Google & Twitter OAuth flow (fake consent screen + callback)
- **Email/password login** — with reactive form validation
- **Feed** — scrollable list of posts with like, share, and bookmark toggles
- **Post creation** — text and image posts via a dialog form
- **Post detail** — single post view with comments section
- **Comments** — add and view comments on each post
- **Bookmarks** — save/unsave posts, filter feed by saved posts
- **Share** — Web Share API or copy-to-clipboard modal fallback
- **User profile** — view account info and logout
- **State management** — `@ngrx/signals` (auth store + feed store)
- **Responsive design** — mobile-first with Tailwind CSS 4
- **Atomic Design** — atoms, molecules, organisms, templates, pages
- **Accessibility** — WCAG AA, ARIA attributes, focus management
- **SSR + Prerender** — Angular SSR with client-only data loading

## Tech Stack

| Tool              | Version |
|-------------------|---------|
| Angular           | 21.2    |
| Tailwind CSS      | 4       |
| @ngrx/signals     | 19      |
| Storybook         | 10      |
| Node.js           | 24+     |
| pnpm              | 10      |

## Prerequisites

- [Node.js](https://nodejs.org/) v24+
- [pnpm](https://pnpm.io/) v10+

## Installation

```bash
pnpm install
```

## Demo Credentials

There is no signup — use one of the pre-seeded accounts:

| Email                    | Password       |
|--------------------------|----------------|
| `galangal@example.com`   | `password123`  |
| `sarah@example.com`      | `password123`  |

You can also log in via the **Google** or **Twitter** OAuth buttons (simulated flow, no real provider).

## Development

```bash
pnpm start
```

Opens at [http://localhost:4200](http://localhost:4200). Hot reload is enabled.

## Production Build (with SSR)

```bash
pnpm build
```

Artifacts are output to `dist/it-rock-challenge/`.

To serve the SSR build locally:

```bash
node dist/it-rock-challenge/server/server.mjs
```

## Rendering Strategy

Since there is no real backend, all routes use **Prerender** or **Client** rendering. No route uses `RenderMode.Server`.

| Route                     | Render Mode | Notes                                       |
|---------------------------|-------------|---------------------------------------------|
| `/auth`                   | Prerender   | Login shell                                 |
| `/auth/oauth/:provider`  | Client      | Dynamic OAuth flow, fully client-side       |
| `/auth/callback`         | Prerender   | OAuth callback handler                      |
| `/feed`                   | Prerender   | Feed shell; posts load on client via defer  |
| `/feed/publish`          | Prerender   | Post creation dialog                        |
| `/feed/:postId`          | Prerender   | Post detail dialog; data loads on client    |
| `/profile`               | Prerender   | User profile page                           |

Data-dependent content (posts, comments, auth state) renders exclusively on the browser using `isPlatformBrowser` guards and `@defer (on immediate)`.

## Project Structure

```
src/app/
├── components/
│   ├── atoms/          # Avatar, FormField, ImagePreview, PostStats, QuoteBlock, ...
│   ├── molecules/      # CommentInput, CommentItem, PostHeader, UserProfile
│   ├── organisms/      # AppHeader, PostCard
│   └── templates/      # DialogLayout, FeedLayout
├── errors/             # AuthError, FeedError (typed error classes)
├── guards/             # authGuard, guestGuard
├── interfaces/         # TypeScript interfaces (User, Post, Comment, services)
├── pages/              # Auth, Feed, PostDetail, Publish, Profile, OAuthConsent, OAuthCallback
├── pipes/              # TimeAgoPipe
├── services/           # Mock implementations (auth, feed)
└── store/              # @ngrx/signals stores (AuthStore, FeedStore)
```

Path aliases are configured in `tsconfig.json`: `@components/*`, `@errors/*`, `@guards/*`, `@interfaces/*`, `@pages/*`, `@pipes/*`, `@services/*`, `@store/*`.

## Storybook

```bash
pnpm storybook
```

Opens at [http://localhost:6006](http://localhost:6006). Includes stories for:

- **Atoms:** Avatar, PostStats, QuoteBlock, ImagePreview, ArticlePreview, EventPreview
- **Molecules:** PostHeader, CommentItem, CommentInput
- **Organisms:** PostCard (6 variants)
- **Pages:** Auth (login form)

## Testing

```bash
pnpm test
```

## Deployment

Deployed automatically to **GitHub Pages** via GitHub Actions on push to `main`.

- Workflow: `.github/workflows/deploy.yml`
- Output: prerendered static files from `dist/it-rock-challenge/browser/`
- SPA fallback: `404.html` redirects to `index.csr.html` for client-side routing

## License

Private — built as a technical challenge for IT Rock.
