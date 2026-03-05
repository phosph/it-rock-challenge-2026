# IT Rock Challenge — Red Social

Red social básica construida con **Angular 21**, **Tailwind CSS 4** y **@ngrx/signals**. Todos los datos están mockeados (sin backend real) y persistidos en **LocalStorage**.

## Funcionalidades

- **Login con OAuth** — flujo simulado de Google OAuth (pantalla de consentimiento falsa + callback)
- **Login con email/contraseña** — con validación de formulario reactivo
- **Feed** — lista scrolleable de publicaciones con toggle de like
- **Creación de posts** — texto, imágenes (base64), links de artículos, eventos y citas
- **Comentarios** — en cada post a través de la vista de detalle
- **Likes** — rastreados por usuario con `PostEntity` usando `Set<string>`
- **Gestión de estado** — `@ngrx/signals` (auth store + feed store)
- **Diseño responsivo** — mobile-first con Tailwind CSS 4
- **Atomic Design** — átomos, moléculas, organismos, templates, páginas
- **Accesibilidad** — WCAG AA, atributos ARIA, gestión de foco

## Stack Tecnológico

| Herramienta       | Versión |
|-------------------|---------|
| Angular           | 21.2    |
| Tailwind CSS      | 4       |
| @ngrx/signals     | 19      |
| Node.js           | 24+     |
| pnpm              | 10      |

## Requisitos Previos

- [Node.js](https://nodejs.org/) v24+
- [pnpm](https://pnpm.io/) v10+

## Instalación

```bash
pnpm install
```

## Desarrollo

```bash
pnpm start
```

Se abre en [http://localhost:4200](http://localhost:4200). Hot reload habilitado.

## Build de Producción (con SSR)

```bash
pnpm build
```

Los artefactos se generan en `dist/it-rock-challenge/`.

Para servir el build SSR localmente:

```bash
node dist/it-rock-challenge/server/server.mjs
```

## Estrategia de Renderización

Al no haber backend real, todas las rutas usan **Prerender** o **Client**. Ninguna ruta usa `RenderMode.Server`.

| Ruta                      | Modo de Render | Notas                                          |
|---------------------------|----------------|-------------------------------------------------|
| `/auth`                   | Prerender      | Shell de login/signup                           |
| `/auth/oauth/:provider`  | Client         | Flujo OAuth dinámico, completamente en cliente  |
| `/auth/callback`         | Prerender      | Manejador de callback OAuth                     |
| `/feed`                   | Prerender      | Shell del feed; posts cargan en cliente via defer |
| `/feed/publish`          | Prerender      | Formulario de creación de posts                 |
| `/feed/:postId`          | Prerender      | Shell de detalle; datos cargan en cliente       |
| `/profile`               | Prerender      | Perfil de usuario (stub)                        |

El contenido dependiente de datos (posts, comentarios, estado de auth) se renderiza exclusivamente en el navegador usando guards `isPlatformBrowser` y `@defer (on immediate)`.

## Estructura del Proyecto

```
src/app/
├── components/
│   ├── atoms/          # Avatar, FormField, ImagePreview, PostStats, ...
│   ├── molecules/      # CommentInput, CommentItem, PostHeader, UserProfile
│   ├── organisms/      # AppHeader, PostCard
│   └── templates/      # FeedLayout
├── guards/             # AuthGuard, GuestGuard
├── interfaces/         # Interfaces TypeScript y clases de error
├── pages/              # Auth, Feed, PostDetail, Publish, Profile, OAuth
├── pipes/              # TimeAgoPipe
├── services/           # Implementaciones mock (auth, feed)
└── store/              # Stores @ngrx/signals (auth, feed)
```

## Tests

```bash
pnpm test
```

## Licencia

Privado — construido como challenge técnico para IT Rock.
