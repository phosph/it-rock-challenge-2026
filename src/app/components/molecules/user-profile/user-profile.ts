import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthStore } from '@src/app/store/auth.store';
import { AvatarComponent } from '@src/app/components/atoms/avatar/avatar';

@Component({
  selector: 'app-user-profile',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, AvatarComponent],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css',
})
/**
 * Sidebar user profile card showing the current user's avatar, name, bio, and a logout button.
 * Reads user data from the `AuthStore`. Supports a compact variant for smaller viewports.
 *
 * @example
 * ```html
 * <app-user-profile />
 * <app-user-profile [compact]="true" />
 * ```
 */
export class UserProfileComponent {
  private readonly router = inject(Router);
  /** Global auth store providing the current user's profile data. */
  readonly authStore = inject(AuthStore);
  /** When `true`, renders a smaller card layout. Defaults to `false`. */
  readonly compact = input(false);

  logout(): void {
    this.authStore.logout();
    this.router.navigate(['/auth']);
  }
}
