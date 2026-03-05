import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { type OAuthBrand, ProviderIconComponent } from '@src/app/components/atoms/provider-icon/provider-icon';

type Provider = 'google' | 'twitter';

interface ProviderConfig {
  name: string;
  color: string;
  iconName: OAuthBrand;
  user: string;
  userEmail: string;
  scopes: string[];
}

const PROVIDERS: Record<Provider, ProviderConfig> = {
  google: {
    name: 'Google',
    color: '#4285F4',
    iconName: 'google',
    user: 'Galangal',
    userEmail: 'galangal@example.com',
    scopes: ['View your basic profile info', 'View your email address'],
  },
  twitter: {
    name: 'Twitter',
    color: '#1DA1F2',
    iconName: 'twitter',
    user: 'Sarah Mitchell',
    userEmail: 'sarah@example.com',
    scopes: ['Read your profile', 'Read your email address'],
  },
};

function isProvider(value: string | null): value is Provider {
  return value === 'google' || value === 'twitter';
}

@Component({
  selector: 'app-oauth-consent',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProviderIconComponent],
  templateUrl: './oauth-consent.html',
  styleUrl: './oauth-consent.css',
})
/**
 * Mock OAuth provider consent screen. Displays the provider's branding, a mock user
 * email, and requested permission scopes. The "Allow" button redirects to the callback
 * URL with a mock authorization code; "Deny" redirects back to `/auth`.
 *
 * Supports Google and Twitter providers via the `:provider` route param.
 *
 * @route `/auth/oauth/:provider`
 * @guard `guestGuard`
 */
export default class OAuthConsentPage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly provider = computed<Provider>(() => {
    const p = this.route.snapshot.paramMap.get('provider');
    return isProvider(p) ? p : 'google';
  });

  readonly config = computed(() => PROVIDERS[this.provider()]);

  private readonly redirectUri = computed(() =>
    this.route.snapshot.queryParamMap.get('redirect_uri') ?? '/auth/callback'
  );

  private readonly state = computed(() =>
    this.route.snapshot.queryParamMap.get('state') ?? ''
  );

  allow(): void {
    this.router.navigate([this.redirectUri()], {
      queryParams: {
        code: `mock_code_${this.provider()}`,
        state: this.state(),
        provider: this.provider(),
      },
    });
  }

  deny(): void {
    this.router.navigate(['/auth']);
  }
}
