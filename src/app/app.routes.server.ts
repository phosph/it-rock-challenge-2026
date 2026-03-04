import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path: 'feed', renderMode: RenderMode.Prerender },
  { path: 'auth', renderMode: RenderMode.Prerender },
  { path: 'auth/oauth/:provider', renderMode: RenderMode.Server },
  { path: 'auth/callback', renderMode: RenderMode.Server },
  { path: 'feed/publish', renderMode: RenderMode.Server },
  { path: 'profile', renderMode: RenderMode.Server },
  { path: '**', renderMode: RenderMode.Prerender },
];
