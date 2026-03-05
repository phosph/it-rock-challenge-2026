import { RenderMode, ServerRoute } from '@angular/ssr';

// No real backend — all routes use Prerender (or Client) instead of Server.
// Data-dependent content renders exclusively on the browser.
export const serverRoutes: ServerRoute[] = [
  { path: 'feed', renderMode: RenderMode.Prerender },
  { path: 'auth', renderMode: RenderMode.Prerender },
  { path: 'auth/oauth/:provider', renderMode: RenderMode.Client },
  { path: 'auth/callback', renderMode: RenderMode.Prerender },
  { path: 'feed/publish', renderMode: RenderMode.Prerender },
  { path: 'feed/:postId', renderMode: RenderMode.Prerender, getPrerenderParams: async () => [] },
  { path: 'profile', renderMode: RenderMode.Prerender },
  { path: '**', renderMode: RenderMode.Prerender },
];
