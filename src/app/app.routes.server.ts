import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path: 'feed', renderMode: RenderMode.Prerender },
  { path: 'auth', renderMode: RenderMode.Prerender },
  { path: 'publish', renderMode: RenderMode.Server },
  { path: 'profile', renderMode: RenderMode.Server },
  { path: '**', renderMode: RenderMode.Prerender },
];
