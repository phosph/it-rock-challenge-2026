import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { PostImage } from '@src/app/interfaces/post.interface';

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
export class ImagePreviewComponent {
  image = input.required<PostImage>();
}
