import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthStore } from '@store/auth.store';

/**
 * Route guard that restricts access to unauthenticated (guest) users only.
 * Redirects to `/feed` if the user is already authenticated or has a valid stored token.
 * Always allows access during SSR.
 */
export const guestGuard: CanActivateFn = async () => {
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  const authStore = inject(AuthStore);
  const router = inject(Router);

  if (authStore.isAuthenticated()) {
    return router.createUrlTree(['/feed']);
  }

  if (authStore.token()) {
    const user = await authStore.getCurrentUser();
    if (user) return router.createUrlTree(['/feed']);
  }

  return true;
};
