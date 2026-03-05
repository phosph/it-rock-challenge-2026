import { ChangeDetectionStrategy, Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthStore } from '@src/app/store/auth.store';
import type { OAuthProvider } from '@src/app/interfaces/auth-service.interface';

@Component({
  selector: 'app-oauth-callback',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './oauth-callback.css',
  template: `
    <div class="flex flex-col items-center gap-4" role="status" aria-live="polite">
      <span class="material-symbols-outlined text-4xl text-neutral-300 animate-spin" aria-hidden="true">progress_activity</span>
      @if (error()) {
        <p class="text-sm text-red-600">{{ error() }}</p>
      } @else {
        <p class="text-sm text-neutral-600">Completing sign in...</p>
      }
    </div>
  `,
})
export default class OAuthCallbackPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly authStore = inject(AuthStore);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly error = signal('');

  async ngOnInit(): Promise<void> {
    if (!this.isBrowser) return;

    const params = this.route.snapshot.queryParamMap;
    const code = params.get('code');
    const provider = params.get('provider') as OAuthProvider | null;

    if (!code || !provider) {
      this.error.set('Invalid callback parameters.');
      this.router.navigate(['/auth']);
      return;
    }

    const user = await this.authStore.loginWithOAuth({ code, provider });

    if (user) {
      this.router.navigate(['/feed']);
    } else {
      this.error.set(this.authStore.error() || 'Authentication failed.');
      setTimeout(() => this.router.navigate(['/auth']), 2000);
    }
  }
}
