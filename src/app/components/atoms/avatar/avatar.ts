import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-avatar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `:host { display: contents; }`,
  template: `
    <img
      [src]="src()"
      [alt]="alt()"
      class="rounded-full object-cover shadow-sm"
      [class]="sizeClass()"
    >
  `,
})
/**
 * Displays a circular user avatar image with configurable size.
 *
 * @example
 * ```html
 * <app-avatar [src]="user.avatarUrl" [alt]="user.name" size="lg" />
 * ```
 */
export class AvatarComponent {
  /** URL of the avatar image. */
  src = input.required<string>();
  /** Alternative text for the image. Defaults to empty string. */
  alt = input('');
  /** Size variant: `sm` (32px), `md` (48px), `lg` (64px), or `full` (100%). Defaults to `md`. */
  size = input<'sm' | 'md' | 'lg' | 'full'>('md');

  protected readonly sizeClass = computed(() => {
    const sizes = { sm: 'w-8 h-8', md: 'w-12 h-12', lg: 'w-16 h-16', full: 'w-full h-full' };
    return sizes[this.size()];
  });
}
