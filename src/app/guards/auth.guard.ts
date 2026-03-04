import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthStore } from '@src/app/store/auth.store';

export const authGuard: CanActivateFn = async () => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  if (authStore.isAuthenticated()) {
    return true;
  }

  if (authStore.token()) {
    const user = await authStore.getCurrenUser();
    if (user) return true;
  }

  return router.createUrlTree(['/auth']);
};
