import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { guestGuard } from './guards/guest.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'feed', pathMatch: 'full' },
  { path: 'auth', loadComponent: () => import('./pages/auth/auth'), canActivate: [guestGuard] },
  { path: 'auth/oauth/:provider', loadComponent: () => import('./pages/oauth-consent/oauth-consent'), canActivate: [guestGuard] },
  { path: 'auth/callback', loadComponent: () => import('./pages/oauth-callback/oauth-callback'), canActivate: [guestGuard] },
  {
    path: 'feed',
    loadComponent: () => import('./pages/feed/feed'),
    canActivate: [authGuard],
    children: [
      { path: 'publish', loadComponent: () => import('./pages/publish/publish') },
      { path: ':postId', loadComponent: () => import('./pages/post-detail/post-detail') },
    ],
  },
  { path: 'profile', loadComponent: () => import('./pages/profile/profile'), canActivate: [authGuard] },
];
