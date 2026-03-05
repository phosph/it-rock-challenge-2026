import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormFieldComponent } from '@src/app/components/atoms/form-field/form-field';
import { ProviderIconComponent } from '@src/app/components/atoms/provider-icon/provider-icon';
import { AuthStore } from '@src/app/store/auth.store';

@Component({
  selector: 'app-auth',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, FormFieldComponent, ProviderIconComponent],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
})
export default class AuthPage {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  readonly authStore = inject(AuthStore);

  readonly loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    rememberMe: [false],
  });

  loginWithProvider(provider: 'google' | 'twitter'): void {
    const state = crypto.randomUUID();
    this.router.navigate(['/auth/oauth', provider], {
      queryParams: {
        redirect_uri: '/auth/callback',
        state,
      },
    });
  }

  async onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.getRawValue();
    const user = await this.authStore.login({ username: email, password });

    if (user) {
      await this.router.navigate(['/feed']);
    }
  }
}
