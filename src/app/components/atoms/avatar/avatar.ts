import { ChangeDetectionStrategy, Component, input } from '@angular/core';

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
export class AvatarComponent {
  src = input.required<string>();
  alt = input('');
  size = input<'sm' | 'md' | 'lg' | 'full'>('md');

  protected sizeClass = () => {
    const sizes = { sm: 'w-8 h-8', md: 'w-12 h-12', lg: 'w-16 h-16', full: 'w-full h-full' };
    return sizes[this.size()];
  };
}
