import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-avatar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <img
      [src]="src()"
      [alt]="alt()"
      class="rounded-full object-cover ring-2 ring-white shadow-sm"
      [class]="sizeClass()"
    >
  `,
})
export class AvatarComponent {
  src = input.required<string>();
  alt = input('');
  size = input<'sm' | 'md' | 'lg'>('md');

  protected sizeClass = () => {
    const sizes = { sm: 'w-8 h-8', md: 'w-12 h-12', lg: 'w-16 h-16' };
    return sizes[this.size()];
  };
}
