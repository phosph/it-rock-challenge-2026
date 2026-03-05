import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthStore } from '@src/app/store/auth.store';

/**
 * Route guard that restricts access to authenticated users only.
 * If the user is not authenticated, attempts to restore the session from a stored token.
 * Redirects to `/auth` when no valid session exists. Always allows access during SSR.
 */
export const authGuard: CanActivateFn = async () => {
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  const authStore = inject(AuthStore);
  const router = inject(Router);

  if (authStore.isAuthenticated()) {
    return true;
  }

  if (authStore.token()) {
    const user = await authStore.getCurrentUser();
    if (user) return true;
  }

  return router.createUrlTree(['/auth']);
};
