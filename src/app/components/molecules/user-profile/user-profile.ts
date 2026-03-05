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
export class UserProfileComponent {
  private readonly router = inject(Router);
  readonly authStore = inject(AuthStore);
  readonly compact = input(false);

  logout(): void {
    this.authStore.logout();
    this.router.navigate(['/auth']);
  }
}
