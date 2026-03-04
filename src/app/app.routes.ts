import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'feed', pathMatch: 'full' },
  { path: 'auth', loadComponent: () => import('./pages/auth/auth') },
  { path: 'feed', loadComponent: () => import('./pages/feed/feed'), canActivate: [authGuard] },
  { path: 'publish', loadComponent: () => import('./pages/publish/publish'), canActivate: [authGuard] },
  { path: 'profile', loadComponent: () => import('./pages/profile/profile'), canActivate: [authGuard] },
];
