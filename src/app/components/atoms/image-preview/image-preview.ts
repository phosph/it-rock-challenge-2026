import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { PostImage } from '@interfaces/post.interface';

@Component({
  selector: 'app-image-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <div class="relative rounded-2xl overflow-hidden shadow-sm group cursor-pointer">
      <div class="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors z-10" aria-hidden="true"></div>
      <img
        [src]="image().imageUrl"
        [alt]="image().alt"
        class="w-full object-cover"
      >
      @if (image().caption) {
        <div class="absolute bottom-3 right-3 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-white text-[10px] md:text-xs font-medium z-20">
          {{ image().caption }}
        </div>
      }
    </div>
  `,
})
/**
 * Displays an image with a hover overlay effect and an optional caption badge
 * positioned at the bottom-right corner.
 *
 * @example
 * ```html
 * <app-image-preview [image]="post.image!" />
 * ```
 */
export class ImagePreviewComponent {
  /** Image data including URL, alt text, and optional caption. */
  image = input.required<PostImage>();
}
