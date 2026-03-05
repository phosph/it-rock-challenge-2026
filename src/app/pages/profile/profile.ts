import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AvatarComponent } from '@components/atoms/avatar/avatar';
import { AppHeaderComponent } from '@components/organisms/app-header/app-header';
import { AuthStore } from '@store/auth.store';

@Component({
  selector: 'app-profile',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AvatarComponent, AppHeaderComponent, DatePipe],
  host: { class: 'block min-h-screen' },
  template: `
    <app-header />

    <main class="flex items-center justify-center p-4 sm:p-6 md:p-8">
      @if (authStore.user(); as u) {
        <div class="card w-full max-w-sm p-6 flex flex-col items-center text-center">
          <app-avatar [src]="u.avatar" [alt]="u.displayName" size="lg" />

          <h1 class="mt-4 text-xl font-bold text-neutral-900">{{ u.displayName }}</h1>
          <p class="text-sm text-neutral-500">@{{ u.username }}</p>

          @if (u.bio) {
            <p class="mt-3 text-sm text-neutral-600 leading-relaxed">{{ u.bio }}</p>
          }

          <dl class="mt-4 w-full space-y-2 text-sm">
            <div class="flex justify-between">
              <dt class="text-neutral-500">Email</dt>
              <dd class="text-neutral-900">{{ u.email }}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-neutral-500">Member since</dt>
              <dd class="text-neutral-900">{{ u.createdAt | date:'mediumDate' }}</dd>
            </div>
          </dl>

          <button type="button" class="btn-filled w-full mt-6" (click)="logout()">
            Logout
          </button>
        </div>
      }
    </main>
  `,
})
/**
 * User profile page displaying the authenticated user's avatar, display name, username,
 * bio, email, and membership date. Includes a logout button that clears the session
 * and redirects to `/auth`.
 *
 * @route `/profile`
 * @guard `authGuard`
 */
export default class ProfilePage {
  readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);

  async logout(): Promise<void> {
    await this.authStore.logout();
    this.router.navigate(['/auth']);
  }
}
