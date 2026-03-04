import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthStore } from '@src/app/store/auth.store';

@Component({
  selector: 'app-user-profile',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css',
})
export class UserProfileComponent {
  private readonly router = inject(Router);
  readonly authStore = inject(AuthStore);

  logout(): void {
    this.authStore.logout();
    this.router.navigate(['/auth']);
  }
}
