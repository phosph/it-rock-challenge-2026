import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'feed', pathMatch: 'full' },
  { path: 'feed', loadComponent: () => import('./pages/feed/feed') },
  { path: 'auth', loadComponent: () => import('./pages/auth/auth') },
  { path: 'publish', loadComponent: () => import('./pages/publish/publish') },
  { path: 'profile', loadComponent: () => import('./pages/profile/profile') },
];
