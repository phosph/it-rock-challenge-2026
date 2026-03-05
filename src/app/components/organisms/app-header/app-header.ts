import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, output, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UserProfileComponent } from '@src/app/components/molecules/user-profile/user-profile';

const SM_BREAKPOINT = '(min-width: 640px)';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  imports: [RouterLink, UserProfileComponent],
})
export class AppHeaderComponent {
  menuClick = output<void>();

  readonly isDesktop = signal(false);

  constructor() {
    if (!isPlatformBrowser(inject(PLATFORM_ID))) return;

    const mql = window.matchMedia(SM_BREAKPOINT);
    this.isDesktop.set(mql.matches);

    const destroyRef = inject(DestroyRef);
    const handler = (e: MediaQueryListEvent) => this.isDesktop.set(e.matches);
    mql.addEventListener('change', handler);
    destroyRef.onDestroy(() => mql.removeEventListener('change', handler));
  }
}
