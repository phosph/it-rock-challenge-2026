import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthStore } from '@src/app/store/auth.store';

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
    const user = await authStore.getCurrenUser();
    if (user) return router.createUrlTree(['/feed']);
  }

  return true;
};
