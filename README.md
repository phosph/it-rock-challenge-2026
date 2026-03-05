# IT Rock Challenge — Social Network

A basic social network built with **Angular 21**, **Tailwind CSS 4**, and **@ngrx/signals**. All data is mocked (no real backend) and persisted in **LocalStorage**.

## Features

- **OAuth login** — simulated Google OAuth flow (fake consent screen + callback)
- **Email/password login** — with reactive form validation
- **Feed** — scrollable list of posts with like toggle
- **Post creation** — text, images (base64), article links, events, and quotes
- **Comments** — threaded on each post via detail view
- **Likes** — tracked per-user with `PostEntity` using `Set<string>`
- **State management** — `@ngrx/signals` (auth store + feed store)
- **Responsive design** — mobile-first with Tailwind CSS 4
- **Atomic Design** — atoms, molecules, organisms, templates, pages
- **Accessibility** — WCAG AA, ARIA attributes, focus management

## Tech Stack

| Tool              | Version |
|-------------------|---------|
| Angular           | 21.2    |
| Tailwind CSS      | 4       |
| @ngrx/signals     | 19      |
| Node.js           | 24+     |
| pnpm              | 10      |

## Prerequisites

- [Node.js](https://nodejs.org/) v24+
- [pnpm](https://pnpm.io/) v10+

## Installation

```bash
pnpm install
```

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
| `/auth`                   | Prerender   | Login/signup shell                          |
| `/auth/oauth/:provider`  | Client      | Dynamic OAuth flow, fully client-side       |
| `/auth/callback`         | Prerender   | OAuth callback handler                      |
| `/feed`                   | Prerender   | Feed shell; posts load on client via defer  |
| `/feed/publish`          | Prerender   | Post creation form                          |
| `/feed/:postId`          | Prerender   | Detail shell; post data loads on client     |
| `/profile`               | Prerender   | User profile (stub)                         |

Data-dependent content (posts, comments, auth state) renders exclusively on the browser using `isPlatformBrowser` guards and `@defer (on immediate)`.

## Project Structure

```
src/app/
├── components/
│   ├── atoms/          # Avatar, FormField, ImagePreview, PostStats, ...
│   ├── molecules/      # CommentInput, CommentItem, PostHeader, UserProfile
│   ├── organisms/      # AppHeader, PostCard
│   └── templates/      # FeedLayout
├── guards/             # AuthGuard, GuestGuard
├── interfaces/         # TypeScript interfaces and error classes
├── pages/              # Auth, Feed, PostDetail, Publish, Profile, OAuth
├── pipes/              # TimeAgoPipe
├── services/           # Mock implementations (auth, feed)
└── store/              # @ngrx/signals stores (auth, feed)
```

## Testing

```bash
pnpm test
```

## License

Private — built as a technical challenge for IT Rock.
